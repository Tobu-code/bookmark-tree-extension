document.addEventListener('DOMContentLoaded', () => {
    initBookmarks();
    initSettings();
    initSearch();
});

// --- State and Constants ---
let dragSrcEl = null;

// --- Bookmarks Logic ---

function initBookmarks() {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
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
    header.innerHTML = `<span style="font-size:20px;">📁</span> <span class="card-title">${folderNode.title}</span>`;
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
    return card;
}

// --- Helpers ---
function getRandomEmoji() {
    const emojis = ['🌍', '📚', '🔗', '📌', '💻', '🎨', '🎵', '🎬', '🎮', '📱', '📡', '💡', '📅', '📝', '📁', '📂'];
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

    const leaf = document.createElement('a');
    leaf.className = 'leaf-node';
    leaf.href = node.url;
    leaf.style.padding = '0';

    const emoji = getRandomEmoji();
    leaf.innerHTML = `<span class="bookmark-icon" style="font-size:20px;margin-right:8px;">${emoji}</span> <span class="bookmark-label" style="font-weight:bold;">${node.title}</span>`;

    card.appendChild(leaf);
    return card;
}

// Recursive helper for list items
function renderTreeItem(node) {
    if (node.url) {
        // Leaf
        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;

        const emoji = getRandomEmoji();
        a.innerHTML = `<span class="bookmark-icon" style="font-size:16px;margin-right:8px;">${emoji}</span> <span class="bookmark-label">${node.title}</span>`;
        return a;
    } else {
        // Sub-folder
        const wrapper = document.createElement('div');
        wrapper.className = 'sub-folder';

        const header = document.createElement('div');
        header.className = 'sub-folder-header';
        header.innerHTML = `<span style="margin-right:5px;">▶</span> ${node.title}`;

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sub-folder-content hidden';

        if (node.children) {
            node.children.forEach(child => {
                childrenContainer.appendChild(renderTreeItem(child));
            });
        }

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.classList.toggle('hidden');
            header.querySelector('span').style.transform = isHidden ? 'rotate(0deg)' : 'rotate(90deg)';
        });

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

// --- Search Logic ---

function initSearch() {
    const input = document.getElementById('search-input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (query) {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        }
    });

    input.addEventListener('input', (e) => {
        const query = input.value.toLowerCase();
        // Simple filter: Toggle visibility of list items?
        // It's tricky with nested structure. 
        // Let's implement filtering only leaf nodes.
        const allNodes = document.querySelectorAll('.leaf-node');
        allNodes.forEach(node => {
            const text = node.textContent.toLowerCase();
            const visible = text.includes(query);
            // We'll hide the node itself
            node.style.display = visible ? 'flex' : 'none';
            // We should ideally also hide empty folders, but that's V2 optimization.
        });
    });
}

// --- Settings Logic (Preserved) ---
const STORAGE_KEY_BG = 'bookmark_tree_bg';
const STORAGE_KEY_OPACITY = 'bookmark_tree_opacity';

function initSettings() {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-modal');
    const saveBtn = document.getElementById('save-settings');
    const clearBtn = document.getElementById('clear-bg');
    const bgUrlInput = document.getElementById('bg-url');
    const bgUpload = document.getElementById('bg-upload');
    const opacityInput = document.getElementById('bg-opacity');

    // Load saved settings
    chrome.storage.local.get([STORAGE_KEY_BG, STORAGE_KEY_OPACITY], (result) => {
        if (result[STORAGE_KEY_BG]) {
            applyBackground(result[STORAGE_KEY_BG]);
            bgUrlInput.value = result[STORAGE_KEY_BG].startsWith('data:') ? '' : result[STORAGE_KEY_BG];
        }
        if (result[STORAGE_KEY_OPACITY]) {
            opacityInput.value = result[STORAGE_KEY_OPACITY];
            updateOpacity(result[STORAGE_KEY_OPACITY]);
        }
    });

    btn.onclick = () => modal.classList.remove('hidden');
    close.onclick = () => modal.classList.add('hidden');
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
        }
    };

    saveBtn.onclick = () => {
        const url = bgUrlInput.value.trim();
        const file = bgUpload.files[0];
        const opacity = opacityInput.value;

        chrome.storage.local.set({ [STORAGE_KEY_OPACITY]: opacity });
        updateOpacity(opacity);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                try {
                    chrome.storage.local.set({ [STORAGE_KEY_BG]: base64data }, () => {
                        applyBackground(base64data);
                        modal.classList.add('hidden');
                    });
                } catch (e) {
                    alert('Image too large to save!');
                }
            };
            reader.readAsDataURL(file);
        } else if (url) {
            chrome.storage.local.set({ [STORAGE_KEY_BG]: url }, () => {
                applyBackground(url);
                modal.classList.add('hidden');
            });
        }
    };

    clearBtn.onclick = () => {
        chrome.storage.local.remove([STORAGE_KEY_BG], () => {
            document.getElementById('background-layer').style.backgroundImage = 'none';
            bgUrlInput.value = '';
            bgUpload.value = '';
            modal.classList.add('hidden');
        });
    }
}

function applyBackground(data) {
    const layer = document.getElementById('background-layer');
    if (data) {
        layer.style.backgroundImage = `url('${data}')`;
    } else {
        layer.style.backgroundImage = 'none';
    }
}

function updateOpacity(val) {
    // val is 0 to 1
    // Container uses var(--bg-overlay)
    // We update the css var on the container
    const c = document.querySelector('.container');
    // Inverse logic: Higher opacity slider = More solid background (less transparent)
    // Slider value name is "Overlay Opacity"
    // Let's assume 1.0 = fully opaque white, 0.0 = fully transparent
    c.style.setProperty('--bg-overlay', `rgba(255, 255, 255, ${val})`);
}
