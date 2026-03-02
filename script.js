// --- Constants ---
const STORAGE_KEY_NEW_TAB = 'settings_open_new_tab';
const STORAGE_KEY_THEME = 'settings_theme';
const STORAGE_KEY_ICON_STYLE = 'settings_icon_style';
const STORAGE_KEY_BG_IMAGE = 'settings_bg_image';
const STORAGE_KEY_BG_BLUR = 'settings_bg_blur';
const STORAGE_KEY_CONTAINER_BLUR = 'settings_container_blur';
const STORAGE_KEY_FREQUENT_DATA = 'frequent_bookmarks_data';
const STORAGE_KEY_FREQUENT_ENABLED = 'settings_frequent_enabled';
const STORAGE_KEY_HOVER_DELAY = 'settings_hover_delay';
const FREQUENT_BOOKMARK_COUNT = 6;
const FRECENCY_DECAY_LAMBDA = 0.1; // Decay factor for time-based weighting

document.addEventListener('DOMContentLoaded', async () => {
    // 1. UI Initialization (Sync)
    initSearch();
    initAiSidebar();
    initAmbientTime();

    // 2. Data Loading (Async)
    const getStorage = (keys) => new Promise(resolve => chrome.storage.local.get(keys, resolve));
    const getBookmarks = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));

    const [settings, bookmarkTree] = await Promise.all([
        getStorage([
            STORAGE_KEY_NEW_TAB, STORAGE_KEY_THEME, STORAGE_KEY_ICON_STYLE,
            STORAGE_KEY_BG_IMAGE, STORAGE_KEY_BG_BLUR, STORAGE_KEY_CONTAINER_BLUR,
            STORAGE_KEY_FREQUENT_DATA, STORAGE_KEY_FREQUENT_ENABLED, STORAGE_KEY_HOVER_DELAY
        ]),
        getBookmarks()
    ]);

    // 3. Apply Settings Global State
    if (settings[STORAGE_KEY_NEW_TAB] !== undefined) OPEN_IN_NEW_TAB = settings[STORAGE_KEY_NEW_TAB];
    else OPEN_IN_NEW_TAB = true; // Default

    if (settings[STORAGE_KEY_ICON_STYLE]) CURRENT_ICON_STYLE = settings[STORAGE_KEY_ICON_STYLE];

    if (settings[STORAGE_KEY_BG_IMAGE]) CURRENT_BG_IMAGE = settings[STORAGE_KEY_BG_IMAGE];

    if (settings[STORAGE_KEY_BG_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_BG_BLUR]);
        CURRENT_BG_BLUR = level * 5;
    }

    if (settings[STORAGE_KEY_CONTAINER_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_CONTAINER_BLUR]);
        CURRENT_CONTAINER_BLUR = level * 5;
    }

    if (settings[STORAGE_KEY_HOVER_DELAY] !== undefined) {
        HOVER_DELAY = parseInt(settings[STORAGE_KEY_HOVER_DELAY]);
    }

    // 4. Init Settings UI (Bindings)
    // We defer this call until we have the function definition, or we can hoist the logic.
    // For now, we assume initSettingsUI will be defined later or we call the modified initSettings.
    initSettingsUI(settings);

    // 5. Apply Visuals
    const theme = settings[STORAGE_KEY_THEME] || 'system';
    applyTheme(theme);

    // 6. Background Preload
    if (CURRENT_BG_IMAGE) {
        await preloadImage(CURRENT_BG_IMAGE);
    }
    applyBackground();
    applyContainerBlur();

    // 7. Render Bookmarks
    renderBookmarks(bookmarkTree);

    // 8. Render Frequent Bookmarks (if enabled)
    const frequentEnabled = settings[STORAGE_KEY_FREQUENT_ENABLED] !== false; // Default true
    if (frequentEnabled) {
        const frequentData = settings[STORAGE_KEY_FREQUENT_DATA] || {};
        renderFrequentBookmarks(frequentData);
    }

    // 9. Reveal Page
    // Use double requestAnimationFrame to ensure the browser has painted the background 
    // and layout is stable before triggering the opacity transition.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('loaded');
        });
    });
});

function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        // Use decode() if available to ensure image is ready for display
        if ('decode' in img) {
            img.decode()
                .then(resolve)
                .catch(() => {
                    // Fallback if decode fails (e.g. invalid image data)
                    resolve();
                });
        } else {
            // Fallback for older browsers
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            }
        }
    });
}

// --- State and Constants ---
let dragSrcEl = null;

const FOLDER_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); vertical-align: middle; flex-shrink: 0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const BOOKMARK_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); vertical-align: middle; flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

// --- Bookmarks Logic ---

function renderBookmarks(bookmarkTreeNodes) {
    const container = document.getElementById('bookmarks-tree');
    container.innerHTML = ''; // Clear previous

    // Create a wrapper for top-level columns
    const topLevelContainer = document.createElement('div');
    topLevelContainer.className = 'top-level-container';
    container.appendChild(topLevelContainer);

    // We want to primarily show "Bookmarks Bar" content
    // Root -> [0] is usually the root node
    const rootNode = bookmarkTreeNodes[0];

    // Find Bookmarks Bar (usually id '1' or title 'Bookmarks Bar')
    let bookmarksBar = rootNode.children.find(node => node.id === '1');
    if (!bookmarksBar && rootNode.children.length > 0) {
        // Fallback: Use the first child if id '1' not found
        bookmarksBar = rootNode.children[0];
    }

    if (bookmarksBar && bookmarksBar.children) {
        bookmarksBar.children.forEach(child => {
            if (child.children) { // Is Folder
                const card = createBookmarkCard(child);
                topLevelContainer.appendChild(card);
            } else {
                const card = createSimpleTile(child);
                topLevelContainer.appendChild(card);
            }
        });
    }
}

function createBookmarkCard(folderNode) {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    card.setAttribute('draggable', 'true');
    card.dataset.id = folderNode.id;

    // Drag Events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('dragleave', handleDragLeave);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `${FOLDER_ICON_SVG} <span class="card-title">${folderNode.title}</span>`;

    // Mac-style Expand Button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'expand-btn';
    expandBtn.title = '放大查看';
    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showFolderModal(folderNode);
    });
    header.appendChild(expandBtn);

    card.appendChild(header);

    // Content List
    const content = document.createElement('div');
    content.className = 'card-content';

    if (folderNode.children) {
        folderNode.children.forEach(child => {
            content.appendChild(renderTreeItem(child));
        });
    }

    card.appendChild(content);

    // Auto-collapse all sub-folders when mouse leaves the entire card
    card.addEventListener('mouseleave', () => {
        const subFolders = content.querySelectorAll('.sub-folder');
        subFolders.forEach(folder => {
            if (folder.collapseIfUnlocked) {
                folder.collapseIfUnlocked();
            }
        });
    });

    return card;
}

// --- Helpers ---

// Helper function to create bookmark icon element (CSP-compliant, no inline handlers)
function createBookmarkIcon(iconData, size = 16) {
    if (iconData.type === 'img') {
        const img = document.createElement('img');
        img.className = 'bookmark-icon';
        img.src = iconData.src;
        img.style.cssText = `width:${size}px;height:${size}px;margin-right:8px;`;
        img.addEventListener('error', function () {
            const span = document.createElement('span');
            span.className = 'bookmark-icon';
            span.style.cssText = `font-size:${size}px;margin-right:8px;`;
            span.textContent = '🔖';
            this.replaceWith(span);
        });
        return img;
    } else if (iconData.type === 'svg') {
        const span = document.createElement('span');
        span.className = 'bookmark-icon';
        span.style.cssText = `width:${size}px;height:${size}px;margin-right:8px;display:flex;align-items:center;justify-content:center;`;
        span.innerHTML = iconData.value;
        return span;
    } else {
        const span = document.createElement('span');
        span.className = 'bookmark-icon';
        span.style.cssText = `font-size:${size}px;margin-right:8px;`;
        span.textContent = iconData.value;
        return span;
    }
}

function getRandomEmoji() {
    const emojis = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
        '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅'
    ];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function createSimpleTile(node) {
    // For single bookmarks at the top level, we make a mini card
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    card.style.height = 'auto'; // Auto height for single items
    card.setAttribute('draggable', 'true');
    card.dataset.id = node.id;

    // Drag Events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('dragleave', handleDragLeave);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);

    const wrapper = document.createElement('div');
    wrapper.className = 'leaf-wrapper';

    const leaf = document.createElement('a');
    leaf.className = 'leaf-node';
    leaf.href = node.url;
    if (OPEN_IN_NEW_TAB) {
        leaf.target = '_blank';
    }
    leaf.style.padding = '0';

    // Track click for frequent bookmarks
    leaf.addEventListener('click', () => {
        trackBookmarkClick(node.url, node.title);
    });

    // Icon handling (CSP-compliant)
    const iconData = getIconForBookmark(node.url);
    const iconElement = createBookmarkIcon(iconData, 20);
    leaf.appendChild(iconElement);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'bookmark-label';
    labelSpan.style.fontWeight = 'bold';
    labelSpan.textContent = node.title;
    leaf.appendChild(labelSpan);

    wrapper.appendChild(leaf);
    card.appendChild(wrapper);
    return card;
}

// Recursive helper for list items
function renderTreeItem(node) {
    if (node.url) {
        // Leaf
        const wrapper = document.createElement('div');
        wrapper.className = 'leaf-wrapper';

        // Draggable props
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId; // Important for moving
        wrapper.dataset.type = 'bookmark';

        // Drag Events
        wrapper.addEventListener('dragstart', handleItemDragStart);
        wrapper.addEventListener('dragover', handleItemDragOver);
        wrapper.addEventListener('dragleave', handleItemDragLeave);
        wrapper.addEventListener('drop', handleItemDrop);
        wrapper.addEventListener('dragend', handleItemDragEnd);

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) {
            a.target = '_blank';
        }

        // Track click for frequent bookmarks
        a.addEventListener('click', () => {
            trackBookmarkClick(node.url, node.title);
        });

        // Icon handling (CSP-compliant)
        const iconData = getIconForBookmark(node.url);
        const iconElement = createBookmarkIcon(iconData, 18);
        a.appendChild(iconElement);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'bookmark-label';
        labelSpan.textContent = node.title;
        a.appendChild(labelSpan);

        wrapper.appendChild(a);

        // Action buttons (move & delete)
        const actions = createBookmarkActions(node, wrapper);
        wrapper.appendChild(actions);

        return wrapper;
    } else {
        // Sub-folder
        const wrapper = document.createElement('div');
        wrapper.className = 'sub-folder';

        // Draggable props
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId;
        wrapper.dataset.type = 'folder';

        // Drag Events
        wrapper.addEventListener('dragstart', handleItemDragStart);
        wrapper.addEventListener('dragover', handleItemDragOver);
        wrapper.addEventListener('dragleave', handleItemDragLeave);
        wrapper.addEventListener('drop', handleItemDrop);
        wrapper.addEventListener('dragend', handleItemDragEnd);

        const header = document.createElement('div');
        header.className = 'sub-folder-header';

        // Add folder icon if in theme mode, or just always add it for consistency?
        // User asked to "replace all bookmark icons... directory and bookmarks"
        // Let's use FOLDER_ICON_SVG
        const folderIcon = `<span style="display:inline-flex; align-items:center; margin-right:6px; transform: scale(0.8);">${FOLDER_ICON_SVG}</span>`;

        header.innerHTML = `<span style="margin-right:5px; transition: transform 0.2s;" class="arrow">▶</span> ${folderIcon} ${node.title}`;

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sub-folder-content hidden';
        childrenContainer.dataset.parentId = node.id; // Mark container with parent ID for dropping into empty folders (future)

        if (node.children) {
            node.children.forEach(child => {
                childrenContainer.appendChild(renderTreeItem(child));
            });
        }

        // Interactions
        // State: 'isLocked' (persistent open) stored on wrapper or header dataset

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.classList.contains('hidden');

            if (isHidden) {
                // Open and Lock
                childrenContainer.classList.remove('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(90deg)';
                header.dataset.isLocked = 'true';
            } else {
                if (header.dataset.isLocked === 'true') {
                    // Locked -> Unlock and Close
                    childrenContainer.classList.add('hidden');
                    header.querySelector('.arrow').style.transform = 'rotate(0deg)';
                    header.dataset.isLocked = 'false';
                } else {
                    // Hover-Open (Not Locked) -> Lock it
                    header.dataset.isLocked = 'true';
                    // Optional: Visual cue that it's locked?
                }
            }
        });

        // Auto-expand on hover with delay
        let hoverTimer = null;
        wrapper.addEventListener('mouseenter', () => {
            if (HOVER_DELAY === 1100) return; // "Closed" setting
            hoverTimer = setTimeout(() => {
                childrenContainer.classList.remove('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(90deg)';
            }, HOVER_DELAY);
        });

        wrapper.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });

        // Store reference to collapse function for card-level collapse
        wrapper.collapseIfUnlocked = () => {
            if (header.dataset.isLocked !== 'true') {
                childrenContainer.classList.add('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(0deg)';
            }
        };

        wrapper.appendChild(header);
        wrapper.appendChild(childrenContainer);
        return wrapper;
    }
}

// --- Bookmark Actions (Move & Delete) ---

function createBookmarkActions(node, wrapperEl) {
    const actions = document.createElement('div');
    actions.className = 'bookmark-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'bookmark-action-btn edit-btn';
    editBtn.title = '编辑书签';
    editBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        editBookmark(node, wrapperEl);
    });
    actions.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bookmark-action-btn delete-btn';
    deleteBtn.title = '删除书签';
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteBookmark(node, wrapperEl);
    });
    actions.appendChild(deleteBtn);

    return actions;
}

function showConfirmDialog(message, onConfirm) {
    const dialog = document.getElementById('confirm-dialog');
    const msgEl = document.getElementById('confirm-dialog-message');
    const cancelBtn = document.getElementById('confirm-dialog-cancel');
    const okBtn = document.getElementById('confirm-dialog-ok');

    msgEl.textContent = message;
    dialog.classList.remove('hidden');

    // Clean up old listeners by replacing buttons
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newOkBtn = okBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    const closeDialog = () => {
        dialog.classList.add('hidden');
    };

    newCancelBtn.addEventListener('click', closeDialog);
    newOkBtn.addEventListener('click', () => {
        closeDialog();
        onConfirm();
    });

    // Click overlay to cancel
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog();
    }, { once: true });

    // ESC to cancel
    const escHandler = (e) => {
        if (e.key === 'Escape' && !dialog.classList.contains('hidden')) {
            closeDialog();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function deleteBookmark(node, wrapperEl) {
    const title = node.title || node.url || '此书签';
    showConfirmDialog(`确定要删除「${title}」吗？\n此操作无法撤销。`, () => {
        chrome.bookmarks.remove(node.id, () => {
            if (chrome.runtime.lastError) {
                console.error('Delete failed:', chrome.runtime.lastError.message);
                return;
            }
            console.log('Deleted bookmark:', node.id);
            // Animate out
            wrapperEl.classList.add('bookmark-fade-out');
            wrapperEl.addEventListener('animationend', () => {
                wrapperEl.remove();
            });
        });
    });
}

function editBookmark(node, wrapperEl) {
    const dialog = document.getElementById('edit-bookmark-dialog');
    const titleInput = document.getElementById('edit-bookmark-title');
    const urlInput = document.getElementById('edit-bookmark-url');
    const cancelBtn = document.getElementById('edit-bookmark-cancel');
    const saveBtn = document.getElementById('edit-bookmark-save');

    // Pre-fill with current values
    titleInput.value = node.title || '';
    urlInput.value = node.url || '';

    dialog.classList.remove('hidden');

    // Focus title input
    setTimeout(() => titleInput.focus(), 100);

    // Clean up old listeners by replacing buttons
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newSaveBtn = saveBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    const closeDialog = () => {
        dialog.classList.add('hidden');
    };

    newCancelBtn.addEventListener('click', closeDialog);

    newSaveBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        const newUrl = urlInput.value.trim();

        if (!newTitle) {
            titleInput.focus();
            titleInput.style.borderColor = '#FF5F56';
            setTimeout(() => titleInput.style.borderColor = '', 1500);
            return;
        }
        if (!newUrl) {
            urlInput.focus();
            urlInput.style.borderColor = '#FF5F56';
            setTimeout(() => urlInput.style.borderColor = '', 1500);
            return;
        }

        const changes = {};
        if (newTitle !== node.title) changes.title = newTitle;
        if (newUrl !== node.url) changes.url = newUrl;

        if (Object.keys(changes).length === 0) {
            closeDialog();
            return;
        }

        chrome.bookmarks.update(node.id, changes, (updated) => {
            if (chrome.runtime.lastError) {
                console.error('Edit failed:', chrome.runtime.lastError.message);
                return;
            }
            console.log('Updated bookmark:', updated);

            // Update node object
            if (changes.title) node.title = changes.title;
            if (changes.url) node.url = changes.url;

            // Update DOM
            const labelEl = wrapperEl.querySelector('.bookmark-label');
            if (labelEl && changes.title) labelEl.textContent = changes.title;

            const linkEl = wrapperEl.querySelector('.leaf-node');
            if (linkEl && changes.url) {
                linkEl.href = changes.url;
                // Update favicon
                const oldIcon = linkEl.querySelector('.bookmark-icon');
                if (oldIcon) {
                    const iconData = getIconForBookmark(changes.url);
                    const newIcon = createBookmarkIcon(iconData, 18);
                    oldIcon.replaceWith(newIcon);
                }
            }

            closeDialog();
        });
    });

    // Enter key to save
    const enterHandler = (e) => {
        if (e.key === 'Enter' && !dialog.classList.contains('hidden')) {
            e.preventDefault();
            newSaveBtn.click();
        }
    };
    titleInput.addEventListener('keydown', enterHandler);
    urlInput.addEventListener('keydown', enterHandler);

    // Click overlay to cancel
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog();
    }, { once: true });

    // ESC to cancel
    const escHandler = (e) => {
        if (e.key === 'Escape' && !dialog.classList.contains('hidden')) {
            closeDialog();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// --- Drag & Drop Logic ---

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    this.classList.remove('drag-over');

    if (dragSrcEl !== this) {
        // Swap DOM elements
        const parent = this.parentNode;
        const allCards = Array.from(parent.children);
        const srcIndex = allCards.indexOf(dragSrcEl);
        const targetIndex = allCards.indexOf(this);

        if (srcIndex < targetIndex) {
            parent.insertBefore(dragSrcEl, this.nextSibling);
        } else {
            parent.insertBefore(dragSrcEl, this);
        }

        // Update Chrome Bookmarks
        const srcId = dragSrcEl.dataset.id;
        // We need the numeric index in the actual folder
        // For simplicity, we assume the valid index is just the DOM index now.
        // NOTE: Chrome index is 0-based within the parent.
        // We are reordering inside top-level-container, which corresponds to bookmarksBar.children

        chrome.bookmarks.move(srcId, { index: targetIndex }, (res) => {
            console.log('Moved bookmark:', res);
        });

        this.style.opacity = '1';
        dragSrcEl.style.opacity = '1';
    }
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    const items = document.querySelectorAll('.bookmark-card');
    items.forEach(item => item.classList.remove('drag-over'));
}

// --- Folder Modal Logic ---

function showFolderModal(folderNode) {
    const modal = document.getElementById('folder-modal');
    const title = modal.querySelector('.folder-modal-title');
    const iconContainer = modal.querySelector('.folder-modal-icon');
    const body = modal.querySelector('.folder-modal-body');
    const closeBtn = document.getElementById('close-folder-modal');

    // Set icon and title
    if (iconContainer) iconContainer.innerHTML = FOLDER_ICON_SVG;
    title.textContent = folderNode.title;

    // Store folder ID on the modal content for move dialog
    const modalContent = modal.querySelector('.folder-modal-content');
    if (modalContent) modalContent.dataset.folderId = folderNode.id;

    // Clear and render content
    body.innerHTML = '';
    if (folderNode.children) {
        folderNode.children.forEach(child => {
            body.appendChild(renderTreeItemForModal(child));
        });
    }

    // Show modal
    modal.classList.remove('hidden');

    // Close handlers
    const closeModal = () => {
        modal.classList.add('hidden');
        body.innerHTML = '';
    };

    closeBtn.onclick = closeModal;

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Render tree item for modal (same logic but with auto-collapse on modal leave)
function renderTreeItemForModal(node) {
    if (node.url) {
        // Leaf
        const wrapper = document.createElement('div');
        wrapper.className = 'leaf-wrapper';

        // Draggable props
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId;
        wrapper.dataset.type = 'bookmark';

        // Drag Events
        wrapper.addEventListener('dragstart', handleItemDragStart);
        wrapper.addEventListener('dragover', handleItemDragOver);
        wrapper.addEventListener('dragleave', handleItemDragLeave);
        wrapper.addEventListener('drop', handleItemDrop);
        wrapper.addEventListener('dragend', handleItemDragEnd);

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) {
            a.target = '_blank';
        }

        // Track click for frequent bookmarks
        a.addEventListener('click', () => {
            trackBookmarkClick(node.url, node.title);
        });

        // Icon handling (CSP-compliant)
        const iconData = getIconForBookmark(node.url);
        const iconElement = createBookmarkIcon(iconData, 18);
        a.appendChild(iconElement);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'bookmark-label';
        labelSpan.textContent = node.title;
        a.appendChild(labelSpan);

        wrapper.appendChild(a);

        // Action buttons (move & delete)
        const actions = createBookmarkActions(node, wrapper);
        wrapper.appendChild(actions);

        return wrapper;
    } else {
        // Sub-folder
        const wrapper = document.createElement('div');
        wrapper.className = 'sub-folder';

        // Draggable props
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId;
        wrapper.dataset.type = 'folder';

        // Drag Events
        wrapper.addEventListener('dragstart', handleItemDragStart);
        wrapper.addEventListener('dragover', handleItemDragOver);
        wrapper.addEventListener('dragleave', handleItemDragLeave);
        wrapper.addEventListener('drop', handleItemDrop);
        wrapper.addEventListener('dragend', handleItemDragEnd);

        const header = document.createElement('div');
        header.className = 'sub-folder-header';

        const folderIcon = `<span style="display:inline-flex; align-items:center; margin-right:6px; transform: scale(0.8);">${FOLDER_ICON_SVG}</span>`;

        header.innerHTML = `<span style="margin-right:5px; transform: rotate(90deg); transition: transform 0.2s;" class="arrow">▶</span> ${folderIcon} ${node.title}`;
        header.dataset.isLocked = 'true'; // Default open

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sub-folder-content'; // Default expanded (removed hidden)
        childrenContainer.dataset.parentId = node.id;

        if (node.children) {
            node.children.forEach(child => {
                childrenContainer.appendChild(renderTreeItemForModal(child));
            });
        }

        // Click to toggle and lock
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.classList.contains('hidden');

            if (isHidden) {
                childrenContainer.classList.remove('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(90deg)';
                header.dataset.isLocked = 'true';
            } else {
                if (header.dataset.isLocked === 'true') {
                    childrenContainer.classList.add('hidden');
                    header.querySelector('.arrow').style.transform = 'rotate(0deg)';
                    header.dataset.isLocked = 'false';
                } else {
                    header.dataset.isLocked = 'true';
                }
            }
        });

        // Auto-expand on hover with delay
        let hoverTimer = null;
        wrapper.addEventListener('mouseenter', () => {
            if (HOVER_DELAY === 1100) return; // "Closed" setting
            hoverTimer = setTimeout(() => {
                childrenContainer.classList.remove('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(90deg)';
            }, HOVER_DELAY);
        });

        wrapper.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });

        // Collapse function for parent to call
        wrapper.collapseIfUnlocked = () => {
            if (header.dataset.isLocked !== 'true') {
                childrenContainer.classList.add('hidden');
                header.querySelector('.arrow').style.transform = 'rotate(0deg)';
            }
        };

        wrapper.appendChild(header);
        wrapper.appendChild(childrenContainer);
        return wrapper;
    }
}

// --- Search Logic ---

function initSearch() {
    const input = document.getElementById('search-input');
    const label = document.getElementById('search-engine-label');
    const wheel = document.getElementById('engine-wheel');
    const overlay = document.getElementById('engine-picker-overlay');
    const searchOverlay = document.getElementById('search-overlay');
    const suggestions = document.getElementById('search-suggestions');
    const options = document.querySelectorAll('.wheel-option');
    const STORAGE_KEY_ENGINE = 'bookmark_tree_search_engine';

    let currentEngine = 'google';
    let currentUrl = 'https://www.google.com/search?q=';
    let selectedIndex = -1;
    let allBookmarks = [];

    // Collect all bookmarks for suggestions
    function collectAllBookmarks() {
        allBookmarks = [];
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            function traverse(nodes, path = '') {
                nodes.forEach(node => {
                    if (node.url) {
                        allBookmarks.push({
                            title: node.title,
                            url: node.url,
                            path: path
                        });
                    }
                    if (node.children) {
                        traverse(node.children, path ? `${path} > ${node.title}` : node.title);
                    }
                });
            }
            traverse(bookmarkTreeNodes);
        });
    }

    // Collect bookmarks on init
    collectAllBookmarks();

    // Show/hide picker with overlay
    function showPicker() {
        wheel.classList.remove('hidden');
        overlay.classList.remove('hidden');
        updateActiveOption();
    }

    function hidePicker() {
        wheel.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    // Update active state
    function updateActiveOption() {
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.engine === currentEngine);
        });
    }

    // Search mode - blur background
    function enterSearchMode() {
        document.body.classList.add('search-active');
        searchOverlay.classList.remove('hidden');
        searchOverlay.classList.add('active');
    }

    function exitSearchMode() {
        document.body.classList.remove('search-active');
        searchOverlay.classList.add('hidden');
        searchOverlay.classList.remove('active');
        hideSuggestions();
    }

    function showSuggestions() {
        suggestions.classList.remove('hidden');
    }

    function hideSuggestions() {
        suggestions.classList.add('hidden');
        selectedIndex = -1;
    }

    // Render suggestions
    function renderSuggestions(query) {
        if (!query.trim()) {
            hideSuggestions();
            return;
        }

        const queryLower = query.toLowerCase();
        const matches = allBookmarks.filter(b =>
            b.title.toLowerCase().includes(queryLower) ||
            b.url.toLowerCase().includes(queryLower)
        ).slice(0, 10); // Limit to 10 results

        if (matches.length === 0) {
            suggestions.innerHTML = '<div class="no-results">没有找到匹配的书签</div>';
            showSuggestions();
            return;
        }

        suggestions.innerHTML = '';
        matches.forEach((bookmark, index) => {
            // Get short folder path (last folder only)
            const pathParts = bookmark.path.split(' > ');
            const shortPath = pathParts.length > 1 ? pathParts[pathParts.length - 1] : '';

            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.dataset.index = index;
            item.dataset.url = bookmark.url;

            // Icon (CSP-compliant)
            const iconDiv = document.createElement('div');
            iconDiv.className = 'suggestion-icon';
            try {
                const url = new URL(bookmark.url);
                const img = document.createElement('img');
                // Use extension's favicon service
                img.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(bookmark.url)}&size=32`;
                img.addEventListener('error', function () {
                    this.replaceWith(document.createTextNode('🔖'));
                });
                iconDiv.appendChild(img);
            } catch {
                iconDiv.textContent = '🔖';
            }
            item.appendChild(iconDiv);

            // Content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'suggestion-content';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'suggestion-title';
            titleDiv.textContent = bookmark.title;
            contentDiv.appendChild(titleDiv);

            const urlDiv = document.createElement('div');
            urlDiv.className = 'suggestion-url';
            urlDiv.textContent = bookmark.url;
            contentDiv.appendChild(urlDiv);

            item.appendChild(contentDiv);

            // Folder path
            if (shortPath) {
                const folderSpan = document.createElement('span');
                folderSpan.className = 'suggestion-folder';
                folderSpan.textContent = shortPath;
                item.appendChild(folderSpan);
            }

            suggestions.appendChild(item);
        });

        // Add click handlers
        suggestions.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                const bookmark = matches[index];
                // Track click for frequent bookmarks
                trackBookmarkClick(bookmark.url, bookmark.title);
                if (OPEN_IN_NEW_TAB) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
                exitSearchMode();
                input.value = '';
            });
        });

        showSuggestions();
        selectedIndex = -1;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateSelection() {
        const items = suggestions.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
        // Scroll selected into view
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Load saved engine
    chrome.storage.local.get([STORAGE_KEY_ENGINE], (result) => {
        if (result[STORAGE_KEY_ENGINE]) {
            const opt = document.querySelector(`.wheel-option[data-engine="${result[STORAGE_KEY_ENGINE]}"]`);
            if (opt) {
                currentEngine = opt.dataset.engine;
                currentUrl = opt.dataset.url;
                label.textContent = opt.textContent.trim();
                updateActiveOption();
            }
        }
    });

    // Click label to toggle popup
    label.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wheel.classList.contains('hidden')) {
            showPicker();
        } else {
            hidePicker();
        }
    });

    // Click option to select
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            currentEngine = opt.dataset.engine;
            currentUrl = opt.dataset.url;
            label.textContent = opt.textContent.trim();
            updateActiveOption();
            chrome.storage.local.set({ [STORAGE_KEY_ENGINE]: currentEngine });
            hidePicker();
        });
    });

    // Click overlay to close
    overlay.addEventListener('click', () => {
        hidePicker();
    });

    // Search overlay click to exit search mode
    searchOverlay.addEventListener('click', () => {
        exitSearchMode();
        input.blur();
    });

    // Focus/blur events for search mode
    input.addEventListener('focus', () => {
        enterSearchMode();
        if (input.value.trim()) {
            renderSuggestions(input.value);
        }
    });

    input.addEventListener('keydown', (e) => {
        const items = suggestions.querySelectorAll('.suggestion-item');
        const hasItems = items.length > 0 && !suggestions.classList.contains('hidden');

        if (e.key === 'ArrowDown' && hasItems) {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection();
        } else if (e.key === 'ArrowUp' && hasItems) {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                // Open selected suggestion
                const url = items[selectedIndex].dataset.url;
                // Get bookmark info from allBookmarks based on URL
                const bookmark = allBookmarks.find(b => b.url === url);
                if (bookmark) {
                    trackBookmarkClick(bookmark.url, bookmark.title);
                }
                if (OPEN_IN_NEW_TAB) {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
                exitSearchMode();
                input.value = '';
            } else {
                // Web search
                const query = input.value.trim();
                if (query) {
                    const searchUrl = currentUrl + encodeURIComponent(query);
                    if (OPEN_IN_NEW_TAB) {
                        window.open(searchUrl, '_blank');
                    } else {
                        window.location.href = searchUrl;
                    }
                }
            }
        } else if (e.key === 'Escape') {
            exitSearchMode();
            input.blur();
        }
    });

    input.addEventListener('input', (e) => {
        renderSuggestions(input.value);
    });
}

// --- Settings Logic (Cleaned) ---
// Constants are defined at the top of the file

let OPEN_IN_NEW_TAB = false;
let CURRENT_ICON_STYLE = 'native'; // 'native', 'animals', or 'work'
let CURRENT_BG_IMAGE = null;
let CURRENT_BG_BLUR = 0;
let CURRENT_CONTAINER_BLUR = 15; // 默认15px (档位3)
let HOVER_DELAY = 300; // 默认300ms

// Returns emoji or null for native favicon mode
function getIconForBookmark(url) {
    if (CURRENT_ICON_STYLE === 'theme') {
        return { type: 'svg', value: BOOKMARK_ICON_SVG };
    } else {
        // Native (Default)
        try {
            return {
                type: 'img',
                src: `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`
            };
        } catch {
            return { type: 'emoji', value: '🔖' }; // fallback
        }
    }
}

function initSettingsUI(settings) {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-modal');

    // Inputs
    const linkTargetInputs = document.getElementsByName('link-target');
    const themeInputs = document.getElementsByName('theme');
    const iconStyleInputs = document.getElementsByName('icon-style');

    // Background Inputs
    const bgUpload = document.getElementById('bg-image-upload');
    const clearBgBtn = document.getElementById('clear-bg');
    const blurInput = document.getElementById('bg-blur');
    const blurValueDisplay = document.getElementById('bg-blur-value');
    const containerBlurInput = document.getElementById('container-blur');
    const containerBlurValueDisplay = document.getElementById('container-blur-value');
    const blurControls = document.getElementById('blur-controls');

    // Helper to save settings
    const saveSetting = (key, value, callback) => {
        chrome.storage.local.set({ [key]: value }, callback);
    };

    // 1. Link Target (Radio)
    linkTargetInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                OPEN_IN_NEW_TAB = radio.value === 'blank';
                saveSetting(STORAGE_KEY_NEW_TAB, OPEN_IN_NEW_TAB);

                const links = document.querySelectorAll('a.leaf-node');
                links.forEach(a => a.target = OPEN_IN_NEW_TAB ? '_blank' : '_self');
            }
        });

        // Initial state
        if (settings[STORAGE_KEY_NEW_TAB] !== undefined) {
            if ((radio.value === 'blank') === settings[STORAGE_KEY_NEW_TAB]) radio.checked = true;
        } else {
            if (radio.value === 'blank') radio.checked = true; // Default
        }
    });

    // 2. Theme
    themeInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const theme = radio.value;
                applyTheme(theme);
                saveSetting(STORAGE_KEY_THEME, theme);
            }
        });

        // Initial state
        const savedTheme = settings[STORAGE_KEY_THEME] || 'system';
        if (radio.value === savedTheme) radio.checked = true;
    });

    // 3. Icon Style
    iconStyleInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                CURRENT_ICON_STYLE = radio.value;
                saveSetting(STORAGE_KEY_ICON_STYLE, CURRENT_ICON_STYLE);
                // Re-render bookmarks
                chrome.bookmarks.getTree((tree) => renderBookmarks(tree));
            }
        });

        // Initial state
        if (settings[STORAGE_KEY_ICON_STYLE] && radio.value === settings[STORAGE_KEY_ICON_STYLE]) {
            radio.checked = true;
        }
    });

    // 4. Background Settings

    // 更新模糊控制的启用/禁用状态
    function updateBlurControlsState() {
        const hasImage = CURRENT_BG_IMAGE !== null;
        blurInput.disabled = !hasImage;
        containerBlurInput.disabled = !hasImage;
        blurControls.style.opacity = hasImage ? '1' : '0.5';
    }

    // File Upload
    bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit size (e.g., 10MB to be safe for local storage)
        if (file.size > 10 * 1024 * 1024) {
            alert('图片过大，请选择小于 10MB 的图片');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            CURRENT_BG_IMAGE = dataUrl;
            updateBlurControlsState();
            applyBackground();
            saveSetting(STORAGE_KEY_BG_IMAGE, dataUrl, () => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to save image:', chrome.runtime.lastError);
                    alert('图片保存失败 (可能超出存储限制)');
                }
            });
        };
        reader.readAsDataURL(file);
    });

    // Clear Background
    clearBgBtn.addEventListener('click', () => {
        CURRENT_BG_IMAGE = null;
        bgUpload.value = ''; // Reset input
        updateBlurControlsState();
        applyBackground();
        chrome.storage.local.remove(STORAGE_KEY_BG_IMAGE);
    });

    // Blur Slider - 档位制 (0-10档，每档5px)
    function getBlurLabel(level) {
        if (level === 0) return '关闭';
        return `${level * 10}%`;
    }

    // 背景模糊滑块
    blurInput.addEventListener('input', (e) => {
        const level = parseInt(e.target.value);
        CURRENT_BG_BLUR = level * 5; // 每档5px
        blurValueDisplay.textContent = getBlurLabel(level);
        applyBackground();
    });

    blurInput.addEventListener('change', (e) => {
        const level = parseInt(e.target.value);
        saveSetting(STORAGE_KEY_BG_BLUR, level); // 存储档位值
    });

    // 主容器模糊滑块
    containerBlurInput.addEventListener('input', (e) => {
        const level = parseInt(e.target.value);
        CURRENT_CONTAINER_BLUR = level * 5; // 每档5px
        containerBlurValueDisplay.textContent = getBlurLabel(level);
        applyContainerBlur();
    });

    containerBlurInput.addEventListener('change', (e) => {
        const level = parseInt(e.target.value);
        saveSetting(STORAGE_KEY_CONTAINER_BLUR, level);
    });

    // Initial Blur State
    if (settings[STORAGE_KEY_BG_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_BG_BLUR]);
        blurInput.value = level;
        CURRENT_BG_BLUR = level * 5;
        blurValueDisplay.textContent = getBlurLabel(level);
    }

    if (settings[STORAGE_KEY_CONTAINER_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_CONTAINER_BLUR]);
        containerBlurInput.value = level;
        CURRENT_CONTAINER_BLUR = level * 5;
        containerBlurValueDisplay.textContent = getBlurLabel(level);
    } else {
        // 默认档位3 (15px)
        containerBlurInput.value = 3;
        CURRENT_CONTAINER_BLUR = 15;
        containerBlurValueDisplay.textContent = getBlurLabel(3);
    }

    // 初始化模糊控制状态
    updateBlurControlsState();

    // 5. Hover Delay Setting
    const hoverDelayInput = document.getElementById('hover-delay');
    const hoverDelayValueDisplay = document.getElementById('hover-delay-value');

    hoverDelayInput.addEventListener('input', (e) => {
        HOVER_DELAY = parseInt(e.target.value);
        if (HOVER_DELAY === 1100) {
            hoverDelayValueDisplay.textContent = '已关闭';
        } else {
            hoverDelayValueDisplay.textContent = `${HOVER_DELAY}ms`;
        }
    });

    hoverDelayInput.addEventListener('change', () => {
        saveSetting(STORAGE_KEY_HOVER_DELAY, HOVER_DELAY);
    });

    // Initial Hover Delay State
    if (settings[STORAGE_KEY_HOVER_DELAY] !== undefined) {
        hoverDelayInput.value = settings[STORAGE_KEY_HOVER_DELAY];
        if (parseInt(settings[STORAGE_KEY_HOVER_DELAY]) === 1100) {
            hoverDelayValueDisplay.textContent = '已关闭';
        } else {
            hoverDelayValueDisplay.textContent = `${settings[STORAGE_KEY_HOVER_DELAY]}ms`;
        }
    }

    // 6. Frequent Bookmarks Toggle
    const frequentInputs = document.getElementsByName('frequent-enabled');
    frequentInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const enabled = radio.value === 'on';
                saveSetting(STORAGE_KEY_FREQUENT_ENABLED, enabled);
                toggleFrequentBookmarks(enabled);
            }
        });

        // Initial state
        const savedEnabled = settings[STORAGE_KEY_FREQUENT_ENABLED] !== false; // Default true
        if ((radio.value === 'on') === savedEnabled) {
            radio.checked = true;
        }
    });

    const exportBtn = document.getElementById('export-bookmarks-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = '导出中...';
            exportBtn.disabled = true;

            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                const htmlContent = generateBookmarksHTML(bookmarkTreeNodes);
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // Generate a filename with current date
                const dateStr = new Date().toISOString().split('T')[0];
                a.download = `bookmarks_${dateStr}.html`;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    exportBtn.textContent = '导出成功!';
                    setTimeout(() => {
                        exportBtn.textContent = originalText;
                        exportBtn.disabled = false;
                    }, 2000);
                }, 100);
            });
        });
    }

    btn.onclick = () => modal.classList.remove('hidden');
    close.onclick = () => modal.classList.add('hidden');
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
        }
    };
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', theme);
    }
}

// Generate Netscape Bookmark Format HTML
function generateBookmarksHTML(nodes) {
    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
    html += '<!-- This is an automatically generated file.\n';
    html += '     It will be read and overwritten.\n';
    html += '     DO NOT EDIT! -->\n';
    html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
    html += '<TITLE>Bookmarks</TITLE>\n';
    html += '<H1>Bookmarks</H1>\n';
    html += '<DL><p>\n';

    function traverseNodes(nodeArray, indentStr = "    ") {
        let result = "";
        for (const node of nodeArray) {
            // Skip root node if it doesn't have a title and it's the very top level
            if (!node.title && node.id === '0') {
                if (node.children) {
                    result += traverseNodes(node.children, indentStr);
                }
                continue;
            }

            if (node.url) {
                // It's a bookmark
                const title = escapeHtmlForExport(node.title || node.url);
                const url = escapeHtmlForExport(node.url);
                const addDate = node.dateAdded ? Math.floor(node.dateAdded / 1000) : "";
                result += `${indentStr}<DT><A HREF="${url}" ADD_DATE="${addDate}">${title}</A>\n`;
            } else if (node.children) {
                // It's a folder
                const title = escapeHtmlForExport(node.title || "Folder");
                const addDate = node.dateAdded ? Math.floor(node.dateAdded / 1000) : "";
                // Top level bar folders might need special attributes like PERSONAL_TOOLBAR_FOLDER
                const toolbarAttr = (node.id === '1') ? ' PERSONAL_TOOLBAR_FOLDER="true"' : '';
                result += `${indentStr}<DT><H3 ADD_DATE="${addDate}"${toolbarAttr}>${title}</H3>\n`;
                result += `${indentStr}<DL><p>\n`;
                result += traverseNodes(node.children, indentStr + "    ");
                result += `${indentStr}</DL><p>\n`;
            }
        }
        return result;
    }

    html += traverseNodes(nodes);
    html += '</DL><p>\n';
    return html;
}

function escapeHtmlForExport(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function applyBackground() {
    const bgLayer = document.getElementById('background-layer');
    const aiSidebar = document.getElementById('ai-sidebar');
    if (!bgLayer) return;

    if (CURRENT_BG_IMAGE) {
        bgLayer.style.backgroundImage = `url('${CURRENT_BG_IMAGE}')`;
    } else {
        bgLayer.style.backgroundImage = ''; // Fallback to CSS default
    }

    bgLayer.style.filter = `blur(${CURRENT_BG_BLUR}px)`;
    if (aiSidebar) {
        // Base blur of 40px plus user's background blur
        const totalBlur = 40 + parseInt(CURRENT_BG_BLUR);
        aiSidebar.style.backdropFilter = `blur(${totalBlur}px)`;
        aiSidebar.style.webkitBackdropFilter = `blur(${totalBlur}px)`;
    }

    // Scale up slightly to avoid blurred edges if blurring
    if (CURRENT_BG_BLUR > 0) {
        bgLayer.style.transform = 'scale(1.05)';
    } else {
        bgLayer.style.transform = 'scale(1)';
    }
}

function applyContainerBlur() {
    const container = document.querySelector('.container');
    if (!container) return;

    container.style.backdropFilter = `blur(${CURRENT_CONTAINER_BLUR}px)`;
    container.style.webkitBackdropFilter = `blur(${CURRENT_CONTAINER_BLUR}px)`;
}

// --- Bookmark Item Drag Handlers ---

function handleItemDragStart(e) {
    if (this.getAttribute('draggable') !== 'true') return;
    e.stopPropagation(); // Prevent card drag start
    this.style.opacity = '0.4';
    dragSrcEl = this; // Reuse global

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id); // Transfer ID
    e.dataTransfer.setData('type', 'bookmark-item');
}

function handleItemDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.stopPropagation(); // Prevent card drag over
    e.dataTransfer.dropEffect = 'move';

    // If dragging over a folder, show "drop into" visual
    if (this.dataset.type === 'folder' && dragSrcEl && dragSrcEl.dataset.type === 'bookmark') {
        this.classList.add('drag-into-folder');
        this.classList.remove('drag-over-item');
    } else {
        this.classList.add('drag-over-item');
        this.classList.remove('drag-into-folder');
    }
    return false;
}

function handleItemDragLeave(e) {
    e.stopPropagation();
    this.classList.remove('drag-over-item');
    this.classList.remove('drag-into-folder');
}

function handleItemDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    this.classList.remove('drag-over-item');
    this.classList.remove('drag-into-folder');

    // Check if we are dropping an item
    const type = e.dataTransfer.getData('type');
    if (type !== 'bookmark-item') return false;

    if (dragSrcEl !== this) {
        const srcId = dragSrcEl.dataset.id;

        // Case 1: Dropping a bookmark onto a folder → move INTO the folder
        if (this.dataset.type === 'folder' && dragSrcEl.dataset.type === 'bookmark') {
            const destFolderId = this.dataset.id;

            chrome.bookmarks.move(srcId, { parentId: destFolderId }, (res) => {
                if (chrome.runtime.lastError) {
                    console.error('Move into folder failed:', chrome.runtime.lastError.message);
                } else {
                    console.log('Moved bookmark into folder:', res);
                    // Refresh entire bookmark tree to reflect the change
                    chrome.bookmarks.getTree((bookmarkTree) => {
                        renderBookmarks(bookmarkTree);
                    });
                }
            });

            dragSrcEl.style.opacity = '1';
            return false;
        }

        // Case 2: Reordering within the same parent (original logic)
        const parent = this.parentNode;
        const allChildren = Array.from(parent.children);
        const srcIndex = allChildren.indexOf(dragSrcEl);
        const targetIndex = allChildren.indexOf(this);

        let newIndex = targetIndex;

        if (dragSrcEl.parentNode === parent && srcIndex < targetIndex) {
            parent.insertBefore(dragSrcEl, this.nextSibling);
            newIndex = targetIndex + 1;
        } else {
            parent.insertBefore(dragSrcEl, this);
        }

        // API Update
        // Determine Destination Parent ID
        let destParentId = parent.dataset.parentId;
        if (!destParentId) {
            const card = parent.closest('.bookmark-card');
            if (card) destParentId = card.dataset.id;
        }

        const destination = { index: newIndex };
        if (destParentId) {
            destination.parentId = destParentId;
        }

        chrome.bookmarks.move(srcId, destination, (res) => {
            if (chrome.runtime.lastError) {
                console.error('Move failed:', chrome.runtime.lastError.message);
            } else {
                console.log('Moved bookmark item:', res);
                dragSrcEl.dataset.parentId = destParentId;
            }
        });

        dragSrcEl.style.opacity = '1';
    }
    return false;
}

function handleItemDragEnd(e) {
    if (e.stopPropagation) e.stopPropagation();
    this.style.opacity = '1';
    // Clean all drag visual states
    document.querySelectorAll('.drag-over-item').forEach(el => el.classList.remove('drag-over-item'));
    document.querySelectorAll('.drag-into-folder').forEach(el => el.classList.remove('drag-into-folder'));
    dragSrcEl = null;
}

// --- AI Sidebar Logic ---

function initAiSidebar() {
    const toggleBtn = document.getElementById('ai-sidebar-btn');
    const sidebar = document.getElementById('ai-sidebar');
    const sidebarOverlay = document.getElementById('ai-sidebar-overlay');
    const closeBtn = document.getElementById('ai-sidebar-close');
    const openNewWindowBtn = document.getElementById('ai-open-new-window');
    const openFallbackBtn = document.getElementById('ai-open-gemini');
    const fallback = document.getElementById('ai-iframe-fallback');
    const aiTabs = document.querySelectorAll('.ai-tab');

    // Get all iframes
    const iframes = {
        google: document.getElementById('ai-iframe-google'),
        gemini: document.getElementById('ai-iframe-gemini'),
        chatgpt: document.getElementById('ai-iframe-chatgpt'),
        kimi: document.getElementById('ai-iframe-kimi'),
        longcat: document.getElementById('ai-iframe-longcat'),
        perplexity: document.getElementById('ai-iframe-perplexity'),
        zai: document.getElementById('ai-iframe-zai'),
        doubao: document.getElementById('ai-iframe-doubao'),
        grok: document.getElementById('ai-iframe-grok'),
        qwen: document.getElementById('ai-iframe-qwen')
    };

    // AI URLs mapping
    const aiUrls = {
        google: 'https://www.google.com/search?udm=50&aep=11',
        gemini: 'https://gemini.google.com',
        chatgpt: 'https://chatgpt.com/',
        kimi: 'https://kimi.moonshot.cn/',
        longcat: 'https://longcat.chat/',
        perplexity: 'https://www.perplexity.ai/',
        zai: 'https://chat.z.ai/',
        doubao: 'https://www.doubao.com/chat/',
        grok: 'https://grok.com/',
        qwen: 'https://chat.qwen.ai/'
    };

    const STORAGE_KEY_AI = 'bookmark_tree_selected_ai';
    const STORAGE_KEY_AI_ORDER = 'bookmark_tree_ai_order';

    // Current AI state
    let currentAi = {
        id: 'google',
        url: aiUrls.google,
        icon: '🔍',
        name: 'Google AI'
    };

    // Track which iframes have been loaded
    const loadedIframes = new Set();

    // --- Drag and Drop Sorting for AI Tabs ---
    const tabsContainer = document.querySelector('.ai-tabs');
    let draggedTab = null;

    function initAiTabSort() {
        tabsContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('ai-tab')) {
                draggedTab = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        tabsContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('ai-tab')) {
                e.target.classList.remove('dragging');
                draggedTab = null;
                saveAiOrder();
            }
        });

        tabsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const afterElement = getDragAfterElement(tabsContainer, e.clientX);
            if (afterElement == null) {
                tabsContainer.appendChild(draggedTab);
            } else {
                tabsContainer.insertBefore(draggedTab, afterElement);
            }
        });

        // Helper to find the element we are dragging over
        function getDragAfterElement(container, x) {
            const draggableElements = [...container.querySelectorAll('.ai-tab:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        function saveAiOrder() {
            const currentOrder = [...tabsContainer.querySelectorAll('.ai-tab')].map(tab => tab.dataset.ai);
            chrome.storage.local.set({ [STORAGE_KEY_AI_ORDER]: currentOrder });
        }

        function loadAiOrder() {
            chrome.storage.local.get([STORAGE_KEY_AI_ORDER], (result) => {
                const order = result[STORAGE_KEY_AI_ORDER];
                const existingTabs = new Map();
                tabsContainer.querySelectorAll('.ai-tab').forEach(tab => {
                    existingTabs.set(tab.dataset.ai, tab);
                });

                if (order) {
                    // Re-append in order
                    order.forEach(aiId => {
                        if (existingTabs.has(aiId)) {
                            tabsContainer.appendChild(existingTabs.get(aiId));
                            existingTabs.delete(aiId); // Mark as handled
                        }
                    });
                }

                // Any remaining tabs (e.g., newly added after order was saved)
                // should also be appended to the end
                existingTabs.forEach(tab => {
                    tabsContainer.appendChild(tab);
                });
            });
        }

        loadAiOrder();
    }

    initAiTabSort();


    // Load saved AI preference
    chrome.storage.local.get([STORAGE_KEY_AI], (result) => {
        if (result[STORAGE_KEY_AI]) {
            const saved = result[STORAGE_KEY_AI];
            currentAi = saved;
            // updateCurrentAiDisplay(); // No longer needed as icon is static
        }
        updateActiveTab();

        // Preload default AI iframe
        preloadIframe(currentAi.id);
    });

    function updateCurrentAiDisplay() {
        // No-op: Functionality removed as icon is static, but kept to prevent ReferenceErrors from legacy calls
    }

    function updateActiveTab() {
        // Re-query tabs as they might have been reordered in DOM
        document.querySelectorAll('.ai-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.ai === currentAi.id);
        });
    }

    // Preload iframe for specific AI
    function preloadIframe(aiId) {
        const iframe = iframes[aiId];
        if (iframe && !loadedIframes.has(aiId)) {
            let url = aiUrls[aiId];

            // Inject theme parameter for Google Search
            if (aiId === 'google') {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                    (document.documentElement.getAttribute('data-theme') === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                    url += '&theme=1'; // Basic dark theme hint for Google
                }
            }

            iframe.src = url;
            loadedIframes.add(aiId);

            iframe.addEventListener('load', () => {
                iframe.classList.add('loaded');
            });
        }
    }

    // Switch between AI iframes
    function switchToAi(aiId) {
        Object.values(iframes).forEach(iframe => {
            if (iframe) iframe.classList.remove('active');
        });

        const targetIframe = iframes[aiId];
        if (targetIframe) {
            targetIframe.classList.add('active');
            if (!loadedIframes.has(aiId)) {
                preloadIframe(aiId);
            }
        }
    }

    function selectAi(tab) {
        const newId = tab.dataset.ai;
        if (newId === currentAi.id) return;

        currentAi = {
            id: newId,
            url: tab.dataset.url,
            icon: tab.dataset.icon,
            name: tab.dataset.name
        };

        chrome.storage.local.set({ [STORAGE_KEY_AI]: currentAi });
        updateActiveTab();
        switchToAi(newId);
    }

    function openSidebar() {
        sidebar.classList.remove('hidden');
        requestAnimationFrame(() => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
            sidebarOverlay.classList.add('active');
        });

        switchToAi(currentAi.id);
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        setTimeout(() => {
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.add('hidden');
                sidebarOverlay.classList.add('hidden');
            }
        }, 400);
    }

    function openPopup() {
        window.open(currentAi.url, 'AI_Window', 'width=800,height=900,left=100,top=100,resizable=yes,scrollbars=yes');
    }

    function showFallback() {
        if (iframe) iframe.style.display = 'none';
        if (fallback) fallback.classList.remove('hidden');
    }

    // AI tabs click
    aiTabs.forEach(tab => {
        tab.addEventListener('click', () => selectAi(tab));
    });

    // Main button click - open sidebar
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // Sidebar overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Open in popup buttons
    if (openNewWindowBtn) openNewWindowBtn.addEventListener('click', openPopup);
    if (openFallbackBtn) openFallbackBtn.addEventListener('click', openPopup);

    // Iframe error events for all iframes
    Object.values(iframes).forEach(iframe => {
        if (iframe) {
            iframe.addEventListener('error', () => {
                showFallback();
            });
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

// ========================================
// Frequent Bookmarks - Frecency Algorithm
// ========================================

/**
 * Calculate Frecency score for a bookmark
 * Score = clickCount * decayFactor(lastClickTime)
 * decayFactor = exp(-λ * hoursSinceClick / 24)
 */
function calculateFrecency(data) {
    const now = Date.now();
    const hoursSinceClick = (now - data.lastClickTime) / (1000 * 60 * 60);
    const decayFactor = Math.exp(-FRECENCY_DECAY_LAMBDA * hoursSinceClick / 24);
    return data.clickCount * decayFactor;
}

/**
 * Track bookmark click and update frequency data
 */
function trackBookmarkClick(url, title) {
    chrome.storage.local.get([STORAGE_KEY_FREQUENT_DATA], (result) => {
        const frequentData = result[STORAGE_KEY_FREQUENT_DATA] || {};
        const key = url; // Use URL as unique key

        if (frequentData[key]) {
            frequentData[key].clickCount += 1;
            frequentData[key].lastClickTime = Date.now();
            frequentData[key].title = title; // Update title in case it changed
        } else {
            frequentData[key] = {
                url: url,
                title: title,
                clickCount: 1,
                lastClickTime: Date.now()
            };
        }

        // Clean up old entries (keep top 50 to prevent storage bloat)
        const entries = Object.entries(frequentData);
        if (entries.length > 50) {
            const sorted = entries.sort((a, b) => calculateFrecency(b[1]) - calculateFrecency(a[1]));
            const trimmed = sorted.slice(0, 50);
            const newData = Object.fromEntries(trimmed);
            chrome.storage.local.set({ [STORAGE_KEY_FREQUENT_DATA]: newData });
        } else {
            chrome.storage.local.set({ [STORAGE_KEY_FREQUENT_DATA]: frequentData });
        }
    });
}

/**
 * Get top N frequent bookmarks sorted by Frecency score
 */
function getTopFrequentBookmarks(frequentData, count = FREQUENT_BOOKMARK_COUNT) {
    const entries = Object.entries(frequentData);
    if (entries.length === 0) return [];

    const scored = entries.map(([key, data]) => ({
        ...data,
        score: calculateFrecency(data)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, count);
}

/**
 * Render frequent bookmarks section
 */
function renderFrequentBookmarks(frequentData) {
    const section = document.getElementById('frequent-bookmarks');
    const container = section.querySelector('.suggested-items');

    if (!section || !container) return;

    const topBookmarks = getTopFrequentBookmarks(frequentData);

    if (topBookmarks.length === 0) {
        section.classList.add('hidden');
        return;
    }

    container.innerHTML = '';

    topBookmarks.forEach(bookmark => {
        const item = document.createElement('a');
        item.className = 'suggested-item';
        item.href = bookmark.url;
        if (OPEN_IN_NEW_TAB) {
            item.target = '_blank';
        }

        // Track click when opened
        item.addEventListener('click', () => {
            trackBookmarkClick(bookmark.url, bookmark.title);
        });

        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'suggested-item-icon';
        try {
            const img = document.createElement('img');
            img.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(bookmark.url)}&size=32`;
            img.addEventListener('error', function () {
                this.replaceWith(document.createTextNode('·'));
            });
            iconDiv.appendChild(img);
        } catch {
            iconDiv.textContent = '·';
        }
        item.appendChild(iconDiv);

        // Title
        const titleSpan = document.createElement('span');
        titleSpan.className = 'suggested-item-title';
        titleSpan.textContent = bookmark.title || new URL(bookmark.url).hostname;
        item.appendChild(titleSpan);

        container.appendChild(item);
    });

    section.classList.remove('hidden');
}

/**
 * Toggle frequent bookmarks section visibility
 */
function toggleFrequentBookmarks(enabled) {
    const section = document.getElementById('frequent-bookmarks');
    if (!section) return;

    if (enabled) {
        chrome.storage.local.get([STORAGE_KEY_FREQUENT_DATA], (result) => {
            const frequentData = result[STORAGE_KEY_FREQUENT_DATA] || {};
            renderFrequentBookmarks(frequentData);
        });
    } else {
        section.classList.add('hidden');
    }
}

// ========================================
// Ambient Time Display - Claude Style
// ========================================

/**
 * Initialize ambient time display and idle detection
 */
function initAmbientTime() {
    const timeContainer = document.getElementById('ambient-time-container');
    if (!timeContainer) return;

    let idleTimer;
    const idleDelay = 3000; // 3 seconds

    function resetIdleTimer() {
        // When active, reduce presence
        timeContainer.classList.remove('visible');
        timeContainer.classList.add('dimmed');

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            // When idle, show clearly (as restrained background hint)
            timeContainer.classList.remove('dimmed');
            timeContainer.classList.add('visible');
        }, idleDelay);
    }

    // Update time every minute
    function updateAmbientTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // Format: 2026 · 01 · 26 14:37
        timeContainer.textContent = `${year} · ${month} · ${day}   ${hours}:${minutes}`;

        // Schedule next update at the start of the next minute
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout(updateAmbientTime, msUntilNextMinute);
    }

    // Listen for interactions to handle visibility
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    // Initial update
    updateAmbientTime();

    // Initial state setup after delay
    idleTimer = setTimeout(() => {
        timeContainer.classList.add('visible');
    }, idleDelay);
}
