document.addEventListener('DOMContentLoaded', () => {
    initSettings(); // initBookmarks will be called inside initSettings after loading
    initSearch();
});

// --- State and Constants ---
let dragSrcEl = null;

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

    // Icon handling
    const iconData = getIconForBookmark(node.url);
    let iconHtml;
    if (iconData.type === 'img') {
        iconHtml = `<img class="bookmark-icon" src="${iconData.src}" onerror="this.outerHTML='<span class=\\'bookmark-icon\\' style=\\'font-size:20px;\\'>🔖</span>'" style="width:20px;height:20px;margin-right:8px;">`;
    } else {
        iconHtml = `<span class="bookmark-icon" style="font-size:20px;margin-right:8px;">${iconData.value}</span>`;
    }

    leaf.innerHTML = `${iconHtml}<span class="bookmark-label" style="font-weight:bold;">${node.title}</span>`;

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

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) {
            a.target = '_blank';
        }

        // Icon handling
        const iconData = getIconForBookmark(node.url);
        let iconHtml;
        if (iconData.type === 'img') {
            iconHtml = `<img class="bookmark-icon" src="${iconData.src}" onerror="this.outerHTML='<span class=\\'bookmark-icon\\' style=\\'font-size:16px;\\'>🔖</span>'" style="width:16px;height:16px;margin-right:8px;">`;
        } else {
            iconHtml = `<span class="bookmark-icon" style="font-size:16px;margin-right:8px;">${iconData.value}</span>`;
        }

        a.innerHTML = `${iconHtml}<span class="bookmark-label">${node.title}</span>`;

        wrapper.appendChild(a);
        return wrapper;
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

        // Interactions
        // State: 'isLocked' (persistent open) stored on wrapper or header dataset

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.classList.contains('hidden');

            if (isHidden) {
                // Open and Lock
                childrenContainer.classList.remove('hidden');
                header.querySelector('span').style.transform = 'rotate(90deg)';
                header.dataset.isLocked = 'true';
            } else {
                if (header.dataset.isLocked === 'true') {
                    // Locked -> Unlock and Close
                    childrenContainer.classList.add('hidden');
                    header.querySelector('span').style.transform = 'rotate(0deg)';
                    header.dataset.isLocked = 'false';
                } else {
                    // Hover-Open (Not Locked) -> Lock it
                    header.dataset.isLocked = 'true';
                    // Optional: Visual cue that it's locked?
                }
            }
        });

        // Collapse timeout reference
        let collapseTimeout = null;

        // Auto-expand on hover (Fast)
        wrapper.addEventListener('mouseenter', () => {
            // Clear any pending collapse
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
                collapseTimeout = null;
            }
            childrenContainer.classList.remove('hidden');
            header.querySelector('span').style.transform = 'rotate(90deg)';
        });

        // Auto-collapse on leave (with delay, unless locked)
        wrapper.addEventListener('mouseleave', () => {
            if (header.dataset.isLocked !== 'true') {
                collapseTimeout = setTimeout(() => {
                    childrenContainer.classList.add('hidden');
                    header.querySelector('span').style.transform = 'rotate(0deg)';
                }, 300); // 300ms delay
            }
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
    const label = document.getElementById('search-engine-label');
    const wheel = document.getElementById('engine-wheel');
    const overlay = document.getElementById('engine-picker-overlay');
    const options = document.querySelectorAll('.wheel-option');
    const STORAGE_KEY_ENGINE = 'bookmark_tree_search_engine';

    let currentEngine = 'google';
    let currentUrl = 'https://www.google.com/search?q=';

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

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (query) {
                const searchUrl = currentUrl + encodeURIComponent(query);
                window.location.href = searchUrl;
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
const STORAGE_KEY_NEW_TAB = 'settings_open_new_tab';
const STORAGE_KEY_THEME = 'settings_theme';
const STORAGE_KEY_ICON_STYLE = 'settings_icon_style';

let OPEN_IN_NEW_TAB = false;
let CURRENT_ICON_STYLE = 'native'; // 'native', 'animals', or 'work'

const ANIMAL_EMOJIS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅'
];

const WORK_EMOJIS = [
    '💼', '📊', '📈', '📉', '📧', '📇', '📅', '📝', '📌', '📎',
    '💻', '🖥️', '⌨️', '🖱️', '📱', '🖨️', '🔍', '💡', '🧠', '⚙️'
];

// Returns emoji or null for native favicon mode
function getIconForBookmark(url) {
    if (CURRENT_ICON_STYLE === 'native') {
        // Return favicon URL
        try {
            const domain = new URL(url).origin;
            return { type: 'img', src: `${domain}/favicon.ico` };
        } catch {
            return { type: 'emoji', value: '🔖' }; // fallback
        }
    } else {
        const emojis = CURRENT_ICON_STYLE === 'work' ? WORK_EMOJIS : ANIMAL_EMOJIS;
        return { type: 'emoji', value: emojis[Math.floor(Math.random() * emojis.length)] };
    }
}

function initSettings() {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-modal');
    const saveBtn = document.getElementById('save-settings'); // Element removed, but var might be null
    const clearBtn = document.getElementById('clear-bg');

    // Inputs
    const bgUrlInput = document.getElementById('bg-url');
    const bgUpload = document.getElementById('bg-upload');
    const opacityInput = document.getElementById('bg-opacity');
    const linkTargetInputs = document.getElementsByName('link-target');
    const themeInputs = document.getElementsByName('theme');
    const iconStyleInputs = document.getElementsByName('icon-style');

    // About Section Logic
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeAbout = document.getElementById('close-about');
    const appVersion = document.getElementById('app-version');
    const appDesc = document.getElementById('app-desc');

    if (aboutBtn && aboutModal) {
        aboutBtn.onclick = () => {
            modal.classList.add('hidden'); // Close settings
            aboutModal.classList.remove('hidden'); // Open about
        };

        // Return to settings logic
        const returnToSettings = () => {
            aboutModal.classList.add('hidden');
            modal.classList.remove('hidden');
        };

        closeAbout.onclick = returnToSettings;

        // Close about modal on outside click - return to settings? 
        // User asked "exit ... back to settings".
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                returnToSettings();
            }
        });
    }

    if (chrome.runtime && chrome.runtime.getManifest) {
        const manifest = chrome.runtime.getManifest();
        if (appVersion) appVersion.textContent = manifest.version;
        if (appDesc) appDesc.textContent = manifest.description;
    }

    // Helper to save settings
    const saveSetting = (key, value, callback) => {
        chrome.storage.local.set({ [key]: value }, callback);
    };

    // Real-time Listeners

    // 1. Background URL (Blur/Change)
    bgUrlInput.addEventListener('change', () => {
        const url = bgUrlInput.value.trim();
        if (url) {
            saveSetting(STORAGE_KEY_BG, url, () => applyBackground(url));
            // Clear file input value if any
            bgUpload.value = '';
        }
    });

    // 2. Background File
    bgUpload.addEventListener('change', () => {
        const file = bgUpload.files[0];
        const fileNameDisplay = document.getElementById('file-name-display');

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                try {
                    saveSetting(STORAGE_KEY_BG, base64data, () => applyBackground(base64data));
                    bgUrlInput.value = ''; // Clear URL input
                    if (fileNameDisplay) fileNameDisplay.textContent = `已选择: ${file.name}`;
                } catch (e) {
                    alert('Image too large to save!');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Opacity (Input - Realtime)
    opacityInput.addEventListener('input', () => {
        const opacity = opacityInput.value;
        updateOpacity(opacity); // Visual update
        saveSetting(STORAGE_KEY_OPACITY, opacity); // Storage update
    });

    // 4. Link Target (Radio)
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

    // 5. Theme
    themeInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const theme = radio.value;
                applyTheme(theme);
                saveSetting(STORAGE_KEY_THEME, theme);
            }
        });
    });

    // 6. Icon Style
    iconStyleInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                CURRENT_ICON_STYLE = radio.value;
                saveSetting(STORAGE_KEY_ICON_STYLE, CURRENT_ICON_STYLE);
                initBookmarks(); // Re-render
            }
        });
    });

    // Load saved settings
    chrome.storage.local.get([STORAGE_KEY_BG, STORAGE_KEY_OPACITY, STORAGE_KEY_NEW_TAB, STORAGE_KEY_THEME, STORAGE_KEY_ICON_STYLE], (result) => {
        if (result[STORAGE_KEY_BG]) {
            applyBackground(result[STORAGE_KEY_BG]);
            bgUrlInput.value = result[STORAGE_KEY_BG].startsWith('data:') ? '' : result[STORAGE_KEY_BG];
        }
        if (result[STORAGE_KEY_OPACITY]) {
            opacityInput.value = result[STORAGE_KEY_OPACITY];
            updateOpacity(result[STORAGE_KEY_OPACITY]);
        }

        // Open in New Tab
        // Link Target (Radio)
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

    clearBtn.onclick = () => {
        chrome.storage.local.remove([STORAGE_KEY_BG], () => {
            document.getElementById('background-layer').style.backgroundImage = 'none';
            bgUrlInput.value = '';
            bgUpload.value = '';
            const fileNameDisplay = document.getElementById('file-name-display');
            if (fileNameDisplay) fileNameDisplay.textContent = '';
        });
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        // System
        root.removeAttribute('data-theme');
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
