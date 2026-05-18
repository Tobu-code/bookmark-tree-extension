// --- Item-Level Drag & Drop ---
// --- Bookmark Item Drag Handlers ---

function handleItemDragStart(e) {
    if (this.getAttribute('draggable') !== 'true') return;
    const target = e.target instanceof Element ? e.target : null;
    if (target && (target.closest('.folder-tile-actions') || target.closest('.tree-folder-actions'))) return;
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
    DRAG_HIGHLIGHTED_ELEMENTS.add(this);
    return false;
}

function handleItemDragLeave(e) {
    e.stopPropagation();
    this.classList.remove('drag-over-item');
    this.classList.remove('drag-into-folder');
    DRAG_HIGHLIGHTED_ELEMENTS.delete(this);
}

function handleItemDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    this.classList.remove('drag-over-item');
    this.classList.remove('drag-into-folder');
    DRAG_HIGHLIGHTED_ELEMENTS.delete(this);

    // Check if we are dropping an item
    const type = e.dataTransfer.getData('type');
    if (type !== 'bookmark-item') return false;

    if (dragSrcEl && dragSrcEl !== this) {
        const srcId = dragSrcEl.dataset.id;

        // Case 1: Dropping a bookmark onto a folder → move INTO the folder
        if (this.dataset.type === 'folder' && dragSrcEl.dataset.type === 'bookmark') {
            const destFolderId = this.dataset.id;

            chrome.bookmarks.move(srcId, { parentId: destFolderId }, (res) => {
                if (chrome.runtime.lastError) {
                    console.error('Move into folder failed:', chrome.runtime.lastError.message);
                } else {
                    console.log('Moved bookmark into folder:', res);
                    // Refresh cache and UI to reflect the change
                    refreshBookmarkTreeCache((bookmarkTree) => {
                        renderBookmarks(bookmarkTree);
                    });
                }
            });

            if (dragSrcEl) dragSrcEl.style.opacity = '1';
            return false;
        }

        // Case 3: Reordering within the same parent (bookmarks/subfolders)
        const parent = this.parentNode;
        const allChildren = Array.from(parent.children).filter((el) => !!el.dataset?.id);
        const srcIndex = allChildren.indexOf(dragSrcEl);
        const targetIndex = allChildren.indexOf(this);

        if (dragSrcEl.parentNode === parent && srcIndex < targetIndex) {
            parent.insertBefore(dragSrcEl, this.nextSibling);
        } else {
            parent.insertBefore(dragSrcEl, this);
        }

        const orderedChildren = Array.from(parent.children).filter((el) => !!el.dataset?.id);
        const newIndex = orderedChildren.indexOf(dragSrcEl);

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
                if (dragSrcEl && dragSrcEl.dataset) {
                    dragSrcEl.dataset.parentId = destParentId;
                }
                refreshBookmarkTreeCache();
            }
        });

        dragSrcEl.style.opacity = '1';
    }
    return false;
}

function handleItemDragEnd(e) {
    if (e.stopPropagation) e.stopPropagation();
    this.style.opacity = '1';
    // Clean only tracked drag highlight nodes to avoid full-DOM query on every drag end.
    DRAG_HIGHLIGHTED_ELEMENTS.forEach((el) => {
        el.classList.remove('drag-over-item');
        el.classList.remove('drag-into-folder');
    });
    DRAG_HIGHLIGHTED_ELEMENTS.clear();
    dragSrcEl = null;
}

