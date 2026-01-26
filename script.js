document.addEventListener('DOMContentLoaded', () => {
    initSettings(); // initBookmarks will be called inside initSettings after loading
    initSearch();
    initAiSidebar();
});


// --- State and Constants ---
let dragSrcEl = null;

const FOLDER_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); vertical-align: middle; flex-shrink: 0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const BOOKMARK_ICON_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); vertical-align: middle; flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

// --- Bookmarks Logic ---

function initBookmarks() {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const container = document.getElementById('bookmarks-tree');
        container.innerHTML = ''; // Clear previous

        // Apply Open in New Tab setting to container class for easier delegation or just use global
        // We will use the global OPEN_IN_NEW_TAB variable when creating links

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
                // We treat immediate children of Bookmarks Bar as "Cards"
                // If it's a folder, it gets a card.
                // If it's a file, maybe group them in a "Misc" card or just a mini card.
                // For better aesthetics, let's make everything a card/item.
                if (child.children) { // Is Folder
                    const card = createBookmarkCard(child);
                    topLevelContainer.appendChild(card);
                } else {
                    // Single bookmark at top level
                    // Only render if we want mixed content. 
                    // Let's create a special "Quick Links" card for loose items if we find them?
                    // For now, let's just make it a simple tile.
                    const card = createSimpleTile(child);
                    topLevelContainer.appendChild(card);
                }
            });
        }


    });
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

    // Icon handling (CSP-compliant)
    const iconData = getIconForBookmark(node.url);
    const iconElement = createBookmarkIcon(iconData, 28);
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

        // Icon handling (CSP-compliant)
        const iconData = getIconForBookmark(node.url);
        const iconElement = createBookmarkIcon(iconData, 24);
        a.appendChild(iconElement);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'bookmark-label';
        labelSpan.textContent = node.title;
        a.appendChild(labelSpan);

        wrapper.appendChild(a);
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

        // Auto-expand on hover (Fast)
        wrapper.addEventListener('mouseenter', () => {
            childrenContainer.classList.remove('hidden');
            header.querySelector('.arrow').style.transform = 'rotate(90deg)';
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

        // Icon handling (CSP-compliant)
        const iconData = getIconForBookmark(node.url);
        const iconElement = createBookmarkIcon(iconData, 24);
        a.appendChild(iconElement);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'bookmark-label';
        labelSpan.textContent = node.title;
        a.appendChild(labelSpan);

        wrapper.appendChild(a);
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

        // Auto-expand on hover
        wrapper.addEventListener('mouseenter', () => {
            childrenContainer.classList.remove('hidden');
            header.querySelector('.arrow').style.transform = 'rotate(90deg)';
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
        suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
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
const STORAGE_KEY_NEW_TAB = 'settings_open_new_tab';
const STORAGE_KEY_THEME = 'settings_theme';
const STORAGE_KEY_ICON_STYLE = 'settings_icon_style';
const STORAGE_KEY_BG_IMAGE = 'settings_bg_image';
const STORAGE_KEY_BG_BLUR = 'settings_bg_blur';

let OPEN_IN_NEW_TAB = false;
let CURRENT_ICON_STYLE = 'native'; // 'native', 'animals', or 'work'
let CURRENT_BG_IMAGE = null;
let CURRENT_BG_BLUR = 0;

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

function initSettings() {
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
    const blurValueDisplay = document.getElementById('blur-value');

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
    });

    // 3. Icon Style
    iconStyleInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                CURRENT_ICON_STYLE = radio.value;
                saveSetting(STORAGE_KEY_ICON_STYLE, CURRENT_ICON_STYLE);
                initBookmarks(); // Re-render
            }
        });
    });

    // 4. Background Settings
    
    // File Upload
    bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit size (e.g., 4MB to be safe for local storage)
        if (file.size > 4 * 1024 * 1024) {
            alert('图片过大，请选择小于 4MB 的图片');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            CURRENT_BG_IMAGE = dataUrl;
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
        applyBackground();
        chrome.storage.local.remove(STORAGE_KEY_BG_IMAGE);
    });

    // Blur Slider
    blurInput.addEventListener('input', (e) => {
        CURRENT_BG_BLUR = e.target.value;
        blurValueDisplay.textContent = `${CURRENT_BG_BLUR}px`;
        applyBackground();
    });

    blurInput.addEventListener('change', () => {
        saveSetting(STORAGE_KEY_BG_BLUR, CURRENT_BG_BLUR);
    });

    // Load saved settings
    chrome.storage.local.get([
        STORAGE_KEY_NEW_TAB, 
        STORAGE_KEY_THEME, 
        STORAGE_KEY_ICON_STYLE,
        STORAGE_KEY_BG_IMAGE,
        STORAGE_KEY_BG_BLUR
    ], (result) => {

        // Open in New Tab
        if (result[STORAGE_KEY_NEW_TAB] !== undefined) {
            OPEN_IN_NEW_TAB = result[STORAGE_KEY_NEW_TAB];
            linkTargetInputs.forEach(radio => {
                radio.checked = (radio.value === 'blank') === OPEN_IN_NEW_TAB;
            });
            const links = document.querySelectorAll('a.leaf-node');
            if (links.length > 0) {
                links.forEach(a => a.target = OPEN_IN_NEW_TAB ? '_blank' : '_self');
            }
        } else {
            // Default to new tab
            OPEN_IN_NEW_TAB = true;
            linkTargetInputs.forEach(radio => {
                radio.checked = radio.value === 'blank';
            });
        }

        // Theme
        const savedTheme = result[STORAGE_KEY_THEME] || 'system';
        applyTheme(savedTheme);
        themeInputs.forEach(radio => {
            if (radio.value === savedTheme) radio.checked = true;
        });

        // Icon Style
        if (result[STORAGE_KEY_ICON_STYLE]) {
            CURRENT_ICON_STYLE = result[STORAGE_KEY_ICON_STYLE];
            iconStyleInputs.forEach(radio => {
                if (radio.value === CURRENT_ICON_STYLE) radio.checked = true;
            });
        }

        // Background Image
        if (result[STORAGE_KEY_BG_IMAGE]) {
            CURRENT_BG_IMAGE = result[STORAGE_KEY_BG_IMAGE];
        }

        // Background Blur
        if (result[STORAGE_KEY_BG_BLUR] !== undefined) {
            CURRENT_BG_BLUR = result[STORAGE_KEY_BG_BLUR];
            blurInput.value = CURRENT_BG_BLUR;
            blurValueDisplay.textContent = `${CURRENT_BG_BLUR}px`;
        }

        applyBackground();

        // Initial Bookmark Render after settings are loaded
        initBookmarks();
    });

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

function applyBackground() {
    const bgLayer = document.getElementById('background-layer');
    if (!bgLayer) return;

    if (CURRENT_BG_IMAGE) {
        bgLayer.style.backgroundImage = `url('${CURRENT_BG_IMAGE}')`;
    } else {
        bgLayer.style.backgroundImage = ''; // Fallback to CSS default
    }

    bgLayer.style.filter = `blur(${CURRENT_BG_BLUR}px)`;
    // Scale up slightly to avoid blurred edges if blurring
    if (CURRENT_BG_BLUR > 0) {
        bgLayer.style.transform = 'scale(1.05)';
    } else {
        bgLayer.style.transform = 'scale(1)';
    }
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
    this.classList.add('drag-over-item');
    return false;
}

function handleItemDragLeave(e) {
    e.stopPropagation();
    this.classList.remove('drag-over-item');
}

function handleItemDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    this.classList.remove('drag-over-item');

    // Check if we are dropping an item
    const type = e.dataTransfer.getData('type');
    if (type !== 'bookmark-item') return false;

    if (dragSrcEl !== this) {
        // Visual Move
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
        const srcId = dragSrcEl.dataset.id;

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
    // Clean all item drag-overs
    document.querySelectorAll('.drag-over-item').forEach(el => el.classList.remove('drag-over-item'));
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
        grok: document.getElementById('ai-iframe-grok'),
        qwen: document.getElementById('ai-iframe-qwen')
    };

    // AI URLs mapping
    const aiUrls = {
        google: 'https://www.google.com/search?udm=50&aep=11',
        gemini: 'https://gemini.google.com',
        chatgpt: 'https://chatgpt.com/',
        grok: 'https://grok.com/',
        qwen: 'https://chat.qwen.ai/'
    };

    const STORAGE_KEY_AI = 'bookmark_tree_selected_ai';

    // Current AI state
    let currentAi = {
        id: 'google',
        url: aiUrls.google,
        icon: '🔍',
        name: 'Google AI'
    };

    // Track which iframes have been loaded
    const loadedIframes = new Set();


    // Load saved AI preference
    chrome.storage.local.get([STORAGE_KEY_AI], (result) => {
        if (result[STORAGE_KEY_AI]) {
            const saved = result[STORAGE_KEY_AI];
            currentAi = saved;
            updateCurrentAiDisplay();
        }
        updateActiveTab();

        // Preload default AI iframe
        preloadIframe(currentAi.id);
    });

    function updateCurrentAiDisplay() {
        // Icon is now static in HTML, no need to update
    }

    function updateActiveTab() {
        aiTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.ai === currentAi.id);
        });
    }

    // Preload iframe for specific AI
    function preloadIframe(aiId) {
        const iframe = iframes[aiId];
        if (iframe && !loadedIframes.has(aiId)) {
            iframe.src = aiUrls[aiId];
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
        updateCurrentAiDisplay();
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

        updateCurrentAiDisplay();
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
