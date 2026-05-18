// --- Card-Level Drag & Drop ---
// --- Drag & Drop Logic ---

function handleDragStart(e) {
    if (e.target !== this) return;
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.target !== this) return false;
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    if (e.target !== this) return;
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.target !== this) return false;
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    this.classList.remove('drag-over');

    if (dragSrcEl && dragSrcEl !== this) {
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
            refreshBookmarkTreeCache();
        });

        this.style.opacity = '1';
        dragSrcEl.style.opacity = '1';
    }
    return false;
}

function handleDragEnd(e) {
    if (e.target !== this) return;
    this.style.opacity = '1';
    const items = document.querySelectorAll('.bookmark-card');
    items.forEach(item => item.classList.remove('drag-over'));
}

