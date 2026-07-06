// --- Bookmark Card / Item Helpers ---
const CARD_LAYOUT_SIZES = new Set([
    '1*1', '1*2', '1*3',
    '2*1', '2*2', '2*3',
    '3*1', '3*2', '3*3'
]);

function getStableDefaultFlatCardSize(node, variant = 'bookmark') {
    return '2*1';
}

function normalizeCardLayoutSize(size, variant = 'bookmark') {
    if (size && CARD_LAYOUT_SIZES.has(size)) return size;
    return getStableDefaultFlatCardSize(null, variant);
}

// --- Helpers ---

// Helper function to create bookmark icon element (CSP-compliant, no inline handlers)
function createBookmarkIcon(iconData, size = 32) {
    if (iconData.type === 'img') {
        const img = document.createElement('img');
        img.className = 'bookmark-icon';
        img.src = iconData.src;
        img.width = size;
        img.height = size;
        img.decoding = 'async';
        img.loading = 'lazy';
        img.style.cssText = `margin-right:8px;`;
        img.addEventListener('error', function () {
            // Generate a deterministic letter avatar when the favicon cannot be loaded
            const url = this.closest('a')?.href || '';
            let letter = '?';
            let bgColor = '#888';
            try {
                const hostname = new URL(url).hostname.replace('www.', '');
                letter = hostname.charAt(0).toUpperCase();
                // Generate a consistent color from the hostname
                let hash = 0;
                for (let i = 0; i < hostname.length; i++) {
                    hash = hostname.charCodeAt(i) + ((hash << 5) - hash);
                }
                const h = Math.abs(hash) % 360;
                bgColor = `hsl(${h}, 55%, 55%)`;
            } catch (e) {}
            const avatar = document.createElement('span');
            avatar.className = 'bookmark-icon-fallback';
            avatar.style.backgroundColor = bgColor;
            avatar.textContent = letter;
            avatar.style.marginRight = '8px';
            this.replaceWith(avatar);
        });
        return img;
    } else if (iconData.type === 'svg') {
        const span = document.createElement('span');
        span.className = 'bookmark-icon';
        span.style.cssText = `margin-right:8px;display:flex;align-items:center;justify-content:center;`;
        span.innerHTML = iconData.value;
        return span;
    } else {
        const span = document.createElement('span');
        span.className = 'bookmark-icon';
        span.style.cssText = `margin-right:8px;`;
        span.textContent = iconData.value;
        return span;
    }
}

function renderFlatBookmarkItem(node) {
    const wrapper = document.createElement('div');
    wrapper.className = 'leaf-wrapper';
    wrapper.setAttribute('draggable', 'true');
    wrapper.dataset.id = node.id;
    wrapper.dataset.parentId = node.parentId;
    wrapper.dataset.type = 'bookmark';

    const size = BOOKMARK_CARD_SIZES[node.id] || 'default';
    wrapper.classList.forEach(cls => {
        if (cls.startsWith('layout-size-') || cls === 'card--large' || cls === 'card--small' || cls === 'card--square') {
            wrapper.classList.remove(cls);
        }
    });
    let activeSize = size === 'default' ? getStableDefaultFlatCardSize(node) : normalizeCardLayoutSize(size);
    wrapper.classList.add(`layout-size-${activeSize.replace('*', '-')}`);
    if (BOOKMARK_CARD_PULSE[node.id]) {
        wrapper.classList.add('card-pulse-enabled');
    }

    const a = document.createElement('a');
    a.className = 'leaf-node';
    a.href = node.url;
    if (OPEN_IN_NEW_TAB) {
        a.target = '_blank';
    }

    const iconData = getIconForBookmark(node.url);
    const iconElement = createBookmarkIcon(iconData);
    a.appendChild(iconElement);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'bookmark-label';
    labelSpan.textContent = node.title;
    labelSpan.title = node.title || '';
    a.title = node.title || '';
    a.appendChild(labelSpan);

    wrapper.appendChild(a);
    const actions = createBookmarkActions(node, wrapper);
    wrapper.appendChild(actions);

    return wrapper;
}

// --- Shared helper: bind sub-folder hover-expand behavior (Fix #2) ---
function bindSubFolderHoverExpand(wrapper, childrenContainer) {
    let hoverTimer = null;
    wrapper.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
            childrenContainer.classList.remove('hidden');
        }, 40);
    });
    wrapper.addEventListener('mouseleave', () => {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
    });
}

/**
 * Unified tree node renderer (Fix #1 — replaces renderTreeItem + renderTreeItemForModal).
 * @param {Object} node - Bookmark node from Chrome API.
 * @param {{ defaultExpanded?: boolean }} [options]
 *   defaultExpanded: true = sub-folders start open (used in folder modal)
 */
function renderTreeNode(node, options = {}) {
    const defaultExpanded = Boolean(options.defaultExpanded);

    if (node.url) {
        // --- Leaf (bookmark) ---
        const wrapper = document.createElement('div');
        wrapper.className = 'leaf-wrapper';
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId;
        wrapper.dataset.type = 'bookmark';

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) a.target = '_blank';

        const iconData = getIconForBookmark(node.url);
        a.appendChild(createBookmarkIcon(iconData));

        const labelSpan = document.createElement('span');
        labelSpan.className = 'bookmark-label';
        labelSpan.textContent = node.title;
        labelSpan.title = node.title || '';
        a.title = node.title || '';
        a.appendChild(labelSpan);

        wrapper.appendChild(a);
        wrapper.appendChild(createBookmarkActions(node, wrapper));
        return wrapper;
    } else {
        // --- Sub-folder ---
        const wrapper = document.createElement('div');
        wrapper.className = 'sub-folder';
        wrapper.setAttribute('draggable', 'true');
        wrapper.dataset.id = node.id;
        wrapper.dataset.parentId = node.parentId;
        wrapper.dataset.type = 'folder';

        const header = document.createElement('div');
        header.className = 'sub-folder-header';
        header.innerHTML = `<span class="folder-icon-inline">${FOLDER_ICON_SVG}</span> ${node.title}`;
        // Default locked state: open for modal, closed for normal tree
        header.dataset.isLocked = defaultExpanded ? 'true' : 'false';

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sub-folder-content';
        if (!defaultExpanded) childrenContainer.classList.add('hidden');
        childrenContainer.dataset.parentId = node.id;

        if (node.children) {
            node.children.forEach(child => {
                childrenContainer.appendChild(renderTreeNode(child, options));
            });
        }

        // Click to toggle and lock
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.classList.contains('hidden');
            if (isHidden) {
                childrenContainer.classList.remove('hidden');
                header.dataset.isLocked = 'true';
            } else {
                if (header.dataset.isLocked === 'true') {
                    childrenContainer.classList.add('hidden');
                    header.dataset.isLocked = 'false';
                } else {
                    header.dataset.isLocked = 'true';
                }
            }
        });

        // Shared hover-expand logic (Fix #2)
        bindSubFolderHoverExpand(wrapper, childrenContainer);

        // Expose collapse helper for parent card
        wrapper.collapseIfUnlocked = () => {
            if (header.dataset.isLocked !== 'true') {
                childrenContainer.classList.add('hidden');
            }
        };

        wrapper.appendChild(header);
        wrapper.appendChild(childrenContainer);
        return wrapper;
    }
}

// Backwards-compat shims so existing call-sites keep working
function renderTreeItem(node) {
    return renderTreeNode(node, { defaultExpanded: false });
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
            refreshBookmarkTreeCache();
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
    const sizeSelect = document.getElementById('edit-bookmark-size');
    const pulseInput = document.getElementById('edit-bookmark-pulse');
    const deleteBtn = document.getElementById('edit-bookmark-delete');
    const cancelBtn = document.getElementById('edit-bookmark-cancel');
    const saveBtn = document.getElementById('edit-bookmark-save');
    const closeBtn = document.getElementById('edit-bookmark-close');

    if (!dialog || !titleInput || !urlInput || !cancelBtn || !saveBtn) {
        console.warn('Edit bookmark dialog elements missing.');
        return;
    }

    const isFolder = node.url === undefined;
    const urlField = urlInput.closest('.edit-bookmark-field');
    const titleLabel = dialog.querySelector('.edit-bookmark-title-label');

    // Pre-fill with current values
    titleInput.value = node.title || '';
    urlInput.value = node.url || '';
    if (sizeSelect) {
        sizeSelect.value = BOOKMARK_CARD_SIZES[node.id] || 'default';
    }
    if (pulseInput) {
        pulseInput.checked = Boolean(BOOKMARK_CARD_PULSE[node.id]);
    }
    titleInput.classList.remove('input-error');
    urlInput.classList.remove('input-error');

    // Toggle URL field visibility for folders vs bookmarks
    if (isFolder) {
        if (urlField) urlField.classList.add('hidden');
        if (deleteBtn) deleteBtn.classList.add('hidden');
        if (titleLabel) titleLabel.textContent = '编辑目录';
    } else {
        if (urlField) urlField.classList.remove('hidden');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
        if (titleLabel) titleLabel.textContent = '编辑书签';
    }

    dialog.classList.remove('hidden');

    // Focus title input
    setTimeout(() => titleInput.focus(), 80);

    // Use AbortController to clean up all listeners at once (fixes #14)
    const ac = new AbortController();
    const { signal } = ac;

    const closeDialog = () => {
        dialog.classList.add('hidden');
        ac.abort();
    };

    cancelBtn.addEventListener('click', closeDialog, { signal });
    if (closeBtn) closeBtn.addEventListener('click', closeDialog, { signal });
    if (deleteBtn && !isFolder) {
        deleteBtn.addEventListener('click', () => {
            closeDialog();
            deleteBookmark(node, wrapperEl);
        }, { signal });
    }

    saveBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        const newUrl = urlInput.value.trim();
        const newSize = sizeSelect ? sizeSelect.value : 'default';
        const newPulseEnabled = pulseInput ? pulseInput.checked : false;

        if (!newTitle) {
            titleInput.focus();
            titleInput.classList.add('input-error');
            setTimeout(() => titleInput.classList.remove('input-error'), 1500);
            return;
        }
        if (!isFolder && !newUrl) {
            urlInput.focus();
            urlInput.classList.add('input-error');
            setTimeout(() => urlInput.classList.remove('input-error'), 1500);
            return;
        }

        const changes = {};
        if (newTitle !== node.title) changes.title = newTitle;
        if (!isFolder && newUrl !== node.url) changes.url = newUrl;

        const sizeChanged = newSize !== (BOOKMARK_CARD_SIZES[node.id] || 'default');
        const pulseChanged = newPulseEnabled !== Boolean(BOOKMARK_CARD_PULSE[node.id]);

        if (Object.keys(changes).length === 0 && !sizeChanged && !pulseChanged) {
            closeDialog();
            return;
        }

        const proceedSave = () => {
            if (newSize === 'default') {
                delete BOOKMARK_CARD_SIZES[node.id];
            } else {
                BOOKMARK_CARD_SIZES[node.id] = newSize;
            }

            if (newPulseEnabled) {
                BOOKMARK_CARD_PULSE[node.id] = true;
            } else {
                delete BOOKMARK_CARD_PULSE[node.id];
            }

            chrome.storage.local.set({
                [STORAGE_KEY_CARD_SIZES]: BOOKMARK_CARD_SIZES,
                [STORAGE_KEY_CARD_PULSE]: BOOKMARK_CARD_PULSE
            }, () => {
                refreshBookmarkTreeCache((tree) => {
                    renderBookmarks(tree);
                });
                closeDialog();
            });
        };

        if (Object.keys(changes).length > 0) {
            chrome.bookmarks.update(node.id, changes, (updated) => {
                if (chrome.runtime.lastError) {
                    console.error('Edit failed:', chrome.runtime.lastError.message);
                    return;
                }
                if (changes.title) node.title = changes.title;
                if (!isFolder && changes.url) node.url = changes.url;

                proceedSave();
            });
        } else {
            proceedSave();
        }
    }, { signal });

    // Enter key to save
    const enterHandler = (e) => {
        if (e.key === 'Enter' && !dialog.classList.contains('hidden')) {
            e.preventDefault();
            saveBtn.click();
        }
    };
    titleInput.addEventListener('keydown', enterHandler, { signal });
    urlInput.addEventListener('keydown', enterHandler, { signal });

    // Click overlay to cancel
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeDialog();
    }, { signal });

    // ESC to cancel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !dialog.classList.contains('hidden')) {
            closeDialog();
        }
    }, { signal });
}
