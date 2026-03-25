// --- Constants ---
const STORAGE_KEY_NEW_TAB = 'settings_open_new_tab';
const STORAGE_KEY_THEME = 'settings_theme';
const STORAGE_KEY_ICON_STYLE = 'settings_icon_style';
const STORAGE_KEY_BG_IMAGE = 'settings_bg_image';
const STORAGE_KEY_BG_BLUR = 'settings_bg_blur';
const STORAGE_KEY_CONTAINER_BLUR = 'settings_container_blur';
const STORAGE_KEY_HOVER_DELAY = 'settings_hover_delay';
const STORAGE_KEY_LAYOUT_MODE = 'settings_layout_mode';
const STORAGE_KEY_HIDDEN_FOLDERS = 'hidden_folders';
const STORAGE_KEY_FLAT_DIR_EXPANDED = 'settings_flat_dir_expanded';
const STORAGE_KEY_FLAT_DIRECTORY_ORDER = 'flat_directory_order';
const LEGACY_FREQUENCY_STORAGE_KEYS = [
    'frequent_bookmarks_data',
    'settings_frequent_enabled',
    'settings_auto_sort_by_frequency',
    'folder_frequency_data'
];

// --- State and Constants ---
let dragSrcEl = null;
let OPEN_IN_NEW_TAB = true;
let CURRENT_ICON_STYLE = 'default';
let CURRENT_BG_IMAGE = null;
let CURRENT_BG_BLUR = 0;
let CURRENT_CONTAINER_BLUR = 0;
let HOVER_DELAY = 100;
let LAYOUT_MODE = 'tree';
let HIDDEN_FOLDERS = [];
let SHOW_HIDDEN_FOLDERS = false;
let FLAT_DIR_EXPANDED = false;
let FLAT_DIRECTORY_ORDER = [];
let DRAG_HIGHLIGHTED_ELEMENTS = new Set();
let BOOKMARK_TREE_CACHE = null;
let BOOKMARK_SEARCH_INDEX = [];
let BOOKMARK_SEARCH_BUCKETS = new Map();
let AI_SIDEBAR_CONTROLLER = null;
let LAYOUT_SWITCH_TIMER = null;

function buildBookmarkSearchIndex(bookmarkTreeNodes) {
    const entries = [];
    const buckets = new Map();

    const addToBucket = (key, entry) => {
        if (!key) return;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(entry);
    };

    const traverse = (nodes, path = '') => {
        nodes.forEach(node => {
            if (node.url) {
                const title = node.title || '';
                const url = node.url || '';
                const titleLower = title.toLowerCase();
                const urlLower = url.toLowerCase();
                const pathLower = path.toLowerCase();
                const entry = {
                    title,
                    url,
                    path,
                    searchText: `${titleLower} ${urlLower} ${pathLower}`
                };
                entries.push(entry);

                const seedText = `${titleLower} ${urlLower} ${pathLower}`;
                const tokens = seedText.split(/[\s/:._-]+/).filter(Boolean);
                const keys = new Set();
                tokens.forEach(token => {
                    keys.add(token.slice(0, 1));
                    keys.add(token.slice(0, 2));
                });
                keys.add(entry.searchText.slice(0, 1));
                keys.add(entry.searchText.slice(0, 2));
                keys.forEach((key) => addToBucket(key, entry));
                return;
            }

            if (node.children) {
                const nextPath = node.title ? (path ? `${path} > ${node.title}` : node.title) : path;
                traverse(node.children, nextPath);
            }
        });
    };

    traverse(bookmarkTreeNodes);
    return { entries, buckets };
}

function setBookmarkTreeCache(bookmarkTreeNodes) {
    BOOKMARK_TREE_CACHE = bookmarkTreeNodes;
    const { entries, buckets } = buildBookmarkSearchIndex(bookmarkTreeNodes);
    BOOKMARK_SEARCH_INDEX = entries;
    BOOKMARK_SEARCH_BUCKETS = buckets;
}

function renderBookmarkState(type = 'loading', message = '') {
    const container = document.getElementById('bookmarks-tree');
    if (!container) return;

    container.innerHTML = '';
    container.className = 'tree-view';

    const state = document.createElement('div');
    state.className = `tree-state tree-state-${type}`;
    state.setAttribute('role', type === 'error' ? 'alert' : 'status');
    state.setAttribute('aria-live', 'polite');

    const copy = document.createElement('div');
    copy.className = 'tree-state-copy';

    const title = document.createElement('strong');
    const description = document.createElement('span');

    if (type === 'empty') {
        title.textContent = '这里还没有可展示的书签';
        description.textContent = message || '先收藏几个常用站点，首页会立即变得充实。';
    } else if (type === 'error') {
        title.textContent = '书签内容暂时不可用';
        description.textContent = message || '读取书签失败，请刷新页面后重试。';
    } else {
        title.textContent = '正在准备你的书签空间';
        description.textContent = message || '稍候片刻，常用目录和搜索索引正在加载。';
    }

    copy.appendChild(title);
    copy.appendChild(description);
    state.appendChild(copy);

    if (type === 'loading') {
        const skeleton = document.createElement('div');
        skeleton.className = 'tree-state-skeleton';
        skeleton.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 3; i += 1) {
            skeleton.appendChild(document.createElement('span'));
        }
        state.appendChild(skeleton);
    }

    container.appendChild(state);
}

function refreshBookmarkTreeCache(callback) {
    chrome.bookmarks.getTree((tree) => {
        if (chrome.runtime.lastError) {
            console.error('Failed to read bookmarks tree:', chrome.runtime.lastError.message);
            renderBookmarkState('error', '读取书签失败，请刷新页面后重试。');
            return;
        }
        setBookmarkTreeCache(tree);
        if (callback) callback(tree);
    });
}

function renderBookmarksFromCache() {
    if (BOOKMARK_TREE_CACHE) {
        renderBookmarks(BOOKMARK_TREE_CACHE);
        return;
    }
    renderBookmarkState('loading');
    refreshBookmarkTreeCache((tree) => renderBookmarks(tree));
}

function getFlatRootFolders(bookmarkTreeNodes) {
    if (!bookmarkTreeNodes || !bookmarkTreeNodes[0]) return [];
    const rootNode = bookmarkTreeNodes[0];
    const bookmarksBar = rootNode.children.find(node => node.id === '1') || rootNode.children[0];
    const folders = [];
    if (bookmarksBar && bookmarksBar.children) {
        bookmarksBar.children.forEach(child => flattenFolders(child, folders));
    }
    return folders;
}

function applyFlatDirectoryOrder(folders) {
    if (!Array.isArray(folders) || folders.length === 0) return [];
    if (!Array.isArray(FLAT_DIRECTORY_ORDER) || FLAT_DIRECTORY_ORDER.length === 0) return [...folders];

    const byId = new Map(folders.map(folder => [folder.id, folder]));
    const ordered = [];

    FLAT_DIRECTORY_ORDER.forEach((id) => {
        if (byId.has(id)) ordered.push(byId.get(id));
    });

    folders.forEach((folder) => {
        if (!FLAT_DIRECTORY_ORDER.includes(folder.id)) ordered.push(folder);
    });

    return ordered;
}

function getOrderedFlatFolderIds() {
    const allFolders = applyFlatDirectoryOrder(getFlatRootFolders(BOOKMARK_TREE_CACHE));
    return allFolders.map(folder => folder.id);
}

function saveFlatDirectoryOrder(ids, callback) {
    FLAT_DIRECTORY_ORDER = Array.from(new Set(ids));
    chrome.storage.local.set({ [STORAGE_KEY_FLAT_DIRECTORY_ORDER]: FLAT_DIRECTORY_ORDER }, () => {
        if (callback) callback();
    });
}

function renderBookmarksWithLayoutTransition() {
    const body = document.body;
    if (!body) {
        renderBookmarksFromCache();
        return;
    }

    // Restart class for repeated rapid toggles.
    body.classList.remove('layout-switching');
    void body.offsetWidth;
    body.classList.add('layout-switching');

    renderBookmarksFromCache();

    if (LAYOUT_SWITCH_TIMER) clearTimeout(LAYOUT_SWITCH_TIMER);
    LAYOUT_SWITCH_TIMER = setTimeout(() => {
        body.classList.remove('layout-switching');
        LAYOUT_SWITCH_TIMER = null;
    }, 220);
}

function cleanupLegacyFrequencyStorage() {
    chrome.storage.local.remove(LEGACY_FREQUENCY_STORAGE_KEYS);
}

document.addEventListener('DOMContentLoaded', async () => {
    cleanupLegacyFrequencyStorage();

    // 1. UI Initialization (Sync)
    initSearch();
    initAiSidebarLazy();
    initAmbientTime();

    // 2. Data Loading (Async)
    const getStorage = (keys) => new Promise(resolve => chrome.storage.local.get(keys, resolve));
    const getBookmarks = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));

    const [settings, bookmarkTree] = await Promise.all([
        getStorage([
            STORAGE_KEY_NEW_TAB, STORAGE_KEY_THEME, STORAGE_KEY_ICON_STYLE,
            STORAGE_KEY_BG_IMAGE, STORAGE_KEY_BG_BLUR, STORAGE_KEY_CONTAINER_BLUR,
            STORAGE_KEY_HOVER_DELAY, STORAGE_KEY_LAYOUT_MODE, STORAGE_KEY_HIDDEN_FOLDERS,
            STORAGE_KEY_FLAT_DIR_EXPANDED, STORAGE_KEY_FLAT_DIRECTORY_ORDER
        ]),
        getBookmarks()
    ]);
    setBookmarkTreeCache(bookmarkTree);

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
        CURRENT_CONTAINER_BLUR = level;
    }

    if (settings[STORAGE_KEY_HOVER_DELAY] !== undefined) {
        HOVER_DELAY = parseInt(settings[STORAGE_KEY_HOVER_DELAY]);
    }

    if (settings[STORAGE_KEY_LAYOUT_MODE]) LAYOUT_MODE = settings[STORAGE_KEY_LAYOUT_MODE];
    else LAYOUT_MODE = 'tree';

    if (settings[STORAGE_KEY_HIDDEN_FOLDERS]) HIDDEN_FOLDERS = settings[STORAGE_KEY_HIDDEN_FOLDERS];
    else HIDDEN_FOLDERS = [];

    if (settings[STORAGE_KEY_FLAT_DIR_EXPANDED] !== undefined) {
        FLAT_DIR_EXPANDED = !!settings[STORAGE_KEY_FLAT_DIR_EXPANDED];
    } else {
        FLAT_DIR_EXPANDED = false;
    }

    if (Array.isArray(settings[STORAGE_KEY_FLAT_DIRECTORY_ORDER])) {
        FLAT_DIRECTORY_ORDER = settings[STORAGE_KEY_FLAT_DIRECTORY_ORDER];
    } else {
        FLAT_DIRECTORY_ORDER = [];
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
    applyContainerOpacity();

    // 7. Render Bookmarks
    renderBookmarksFromCache();

    // 7.5 Layout Toggle Button (outside settings for quick access)
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const layoutIconTree = document.getElementById('layout-icon-tree');
    const layoutIconFlat = document.getElementById('layout-icon-flat');
    
    function updateLayoutToggleIcon() {
        if (LAYOUT_MODE === 'flat') {
            layoutIconTree.style.display = 'none';
            layoutIconFlat.style.display = 'block';
            layoutToggleBtn.title = '切换到树状模式';
        } else {
            layoutIconTree.style.display = 'block';
            layoutIconFlat.style.display = 'none';
            layoutToggleBtn.title = '切换到平铺模式';
        }
    }
    updateLayoutToggleIcon(); // Set initial icon state
    
    layoutToggleBtn.addEventListener('click', () => {
        LAYOUT_MODE = LAYOUT_MODE === 'tree' ? 'flat' : 'tree';
        chrome.storage.local.set({ [STORAGE_KEY_LAYOUT_MODE]: LAYOUT_MODE });
        updateLayoutToggleIcon();
        // Also sync the radio buttons inside settings modal
        const layoutRadios = document.getElementsByName('layout-mode');
        layoutRadios.forEach(r => r.checked = r.value === LAYOUT_MODE);
        // Re-render
        renderBookmarksWithLayoutTransition();
    });

    // 8. Reveal Page
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



const FOLDER_ICON_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); vertical-align: middle; flex-shrink: 0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const BOOKMARK_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary); vertical-align: middle; flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

// --- Bookmarks Logic ---

function flattenFolders(node, folders = [], path = []) {
    if (node.children) {
        let currentPath = [...path];
        if (node.title) {
             currentPath.push(node.title);
        }

        // Check if this folder has at least one direct leaf node (bookmark)
        const hasBookmarks = node.children.some(child => !child.children);

        if (node.id && node.id !== '0' && node.id !== '1' && node.title && hasBookmarks) {
            // Store the full path joined by separator for display
            node._fullPath = currentPath.join(' / ');
            folders.push(node);
        }
        node.children.forEach(child => flattenFolders(child, folders, currentPath));
    }
    return folders;
}

function renderBookmarks(bookmarkTreeNodes) {
    const container = document.getElementById('bookmarks-tree');
    if (!container) return;
    if (!bookmarkTreeNodes || !bookmarkTreeNodes[0]) {
        renderBookmarkState('empty');
        return;
    }
    container.innerHTML = ''; // Clear previous
    container.className = 'tree-view'; // reset

    if (LAYOUT_MODE === 'flat') {
        container.classList.add('layout-flat');
        renderFlatBookmarks(bookmarkTreeNodes, container);
    } else {
        container.classList.add('layout-tree');
        renderTreeBookmarks(bookmarkTreeNodes, container);
    }
}

function bindDelegatedItemDnD(container) {
    if (!container || container.dataset.itemDndDelegated === 'true') return;
    container.dataset.itemDndDelegated = 'true';

    const getTarget = (e) => {
        const eventTarget = e.target instanceof Element ? e.target : null;
        if (!eventTarget) return null;
        const target = eventTarget.closest('[data-type][draggable="true"], .bookmarks-pane-grid[data-type="folder"]');
        return target && container.contains(target) ? target : null;
    };

    container.addEventListener('dragstart', (e) => {
        const target = getTarget(e);
        if (!target || target.classList.contains('bookmarks-pane-grid')) return;
        handleItemDragStart.call(target, e);
    });

    container.addEventListener('dragover', (e) => {
        const target = getTarget(e);
        if (!target) return;
        handleItemDragOver.call(target, e);
    });

    container.addEventListener('dragleave', (e) => {
        const target = getTarget(e);
        if (!target) return;
        handleItemDragLeave.call(target, e);
    });

    container.addEventListener('drop', (e) => {
        const target = getTarget(e);
        if (!target) return;
        handleItemDrop.call(target, e);
    });

    container.addEventListener('dragend', (e) => {
        const target = getTarget(e);
        if (!target || target.classList.contains('bookmarks-pane-grid')) return;
        handleItemDragEnd.call(target, e);
    });
}

function renderTreeBookmarks(bookmarkTreeNodes, container) {
    // We want to primarily show "Bookmarks Bar" content
    // Root -> [0] is usually the root node
    const rootNode = bookmarkTreeNodes[0];

    // Find Bookmarks Bar (usually id '1' or title 'Bookmarks Bar')
    let bookmarksBar = rootNode.children.find(node => node.id === '1');
    if (!bookmarksBar && rootNode.children.length > 0) {
        // Fallback: Use the first child if id '1' not found
        bookmarksBar = rootNode.children[0];
    }

    if (!bookmarksBar || !bookmarksBar.children || bookmarksBar.children.length === 0) {
        renderBookmarkState('empty', '书签栏还是空的，先收藏几个常用站点吧。');
        return;
    }

    // Create a wrapper for top-level columns
    const topLevelContainer = document.createElement('div');
    topLevelContainer.className = 'top-level-container';
    container.appendChild(topLevelContainer);
    bindDelegatedItemDnD(topLevelContainer);

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

function renderFlatBookmarks(bookmarkTreeNodes, container) {
    const FLAT_DIR_VISIBLE_LIMIT = 8;
    const allFolders = applyFlatDirectoryOrder(getFlatRootFolders(bookmarkTreeNodes));
    if (allFolders.length === 0) {
        renderBookmarkState('empty', '当前没有可平铺的书签目录，可切回树状模式查看顶层书签。');
        return;
    }

    const dirPane = document.createElement('div');
    dirPane.className = 'directory-pane';

    // Add "书签目录" title header to the left pane
    const dirHeader = document.createElement('div');
    dirHeader.className = 'directory-pane-header';
    dirHeader.innerHTML = `${FOLDER_ICON_SVG} <span>书签目录</span>`;
    dirPane.appendChild(dirHeader);

    const dirScroll = document.createElement('div');
    dirScroll.className = 'directory-pane-scroll';
    dirPane.appendChild(dirScroll);
    
    const bmkPane = document.createElement('div');
    bmkPane.className = 'bookmarks-pane';
    
    container.appendChild(dirPane);
    container.appendChild(bmkPane);

    const renderBmkPane = (folder) => {
        bmkPane.innerHTML = '';
        if (!folder || !folder.children) return;
        
        const header = document.createElement('div');
        header.className = 'bookmarks-pane-header';
        const displayTitle = folder._fullPath || folder.title;
        // Item 5: Style breadcrumb - dim separators, bold last segment
        const parts = displayTitle.split(' / ');
        if (parts.length > 1) {
            const lastPart = parts.pop();
            const pathHtml = parts.map(p => `<span style="color: var(--text-secondary); font-weight: 400;">${p}</span>`).join('<span style="color: var(--text-secondary); opacity: 0.7; margin: 0 6px;">›</span>');
            header.innerHTML = `${FOLDER_ICON_SVG} <span>${pathHtml}<span style="color: var(--text-secondary); opacity: 0.7; margin: 0 6px;">›</span><span style="color: var(--text-color); font-weight: bold;">${lastPart}</span></span>`;
        } else {
            header.innerHTML = `${FOLDER_ICON_SVG} <span>${displayTitle}</span>`;
        }
        bmkPane.appendChild(header);

        const bmkPaneScroll = document.createElement('div');
        bmkPaneScroll.className = 'bookmarks-pane-scroll';
        bmkPane.appendChild(bmkPaneScroll);

        const listContainer = document.createElement('div');
        listContainer.className = 'bookmarks-pane-grid';

        // Make the grid container a drop target for reordering bookmarks inside this folder
        listContainer.dataset.type = 'folder';
        listContainer.dataset.id = folder.id;
        listContainer.dataset.parentId = folder.id;

        const getFlatDragTarget = (e) => {
            const eventTarget = e.target instanceof Element ? e.target : null;
            const item = eventTarget ? eventTarget.closest('.leaf-wrapper') : null;
            return item && listContainer.contains(item) ? item : listContainer;
        };

        listContainer.addEventListener('dragstart', (e) => {
            const target = getFlatDragTarget(e);
            if (target === listContainer) return;
            handleItemDragStart.call(target, e);
        });

        listContainer.addEventListener('dragover', (e) => {
            handleItemDragOver.call(getFlatDragTarget(e), e);
        });

        listContainer.addEventListener('dragleave', (e) => {
            handleItemDragLeave.call(getFlatDragTarget(e), e);
        });

        listContainer.addEventListener('drop', (e) => {
            handleItemDrop.call(getFlatDragTarget(e), e);
        });

        listContainer.addEventListener('dragend', (e) => {
            const target = getFlatDragTarget(e);
            if (target === listContainer) return;
            handleItemDragEnd.call(target, e);
        });

        let childrenToRender = folder.children.filter(child => !child.children);
        
        // Append container synchronously to prevent race conditions during rapid re-renders
        bmkPaneScroll.appendChild(listContainer);
        renderBookmarkItems(childrenToRender, listContainer, folder);
    };

    // Helper to render bookmark items into the grid container
    const renderBookmarkItems = (children, listContainer, folder) => {
        children.forEach(child => {
                const bmkItem = renderFlatBookmarkItem(child);

                // Item 8: Add URL preview line below the title
                if (child.url) {
                    const leafNode = bmkItem.querySelector('.leaf-node');
                    if (leafNode) {
                        const urlPreview = document.createElement('span');
                        urlPreview.className = 'bookmark-url-preview';
                        try {
                            let hostname = new URL(child.url).hostname.replace(/^www\./, '');
                            // Simplify long subdomains: keep last 2 levels (e.g. 'laihua.cn')
                            const parts = hostname.split('.');
                            if (parts.length > 2 && hostname.length > 20) {
                                hostname = parts.slice(-2).join('.');
                            }
                            urlPreview.textContent = hostname;
                        } catch (e) {
                            urlPreview.textContent = child.url.substring(0, 30);
                        }
                        leafNode.appendChild(urlPreview);
                    }
                }

                listContainer.appendChild(bmkItem);
        });
    };

    // Hover-to-switch: immediate activation + frame-scheduled render for smoothness
    let currentActiveFolder = null;
    const allowHoverSwitch = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let pendingRenderFrame = null;

    const activateFolder = (folder, folderTile, animated = false) => {
        if (currentActiveFolder === folder) return;
        dirPane.querySelectorAll('.folder-tile').forEach(t => t.classList.remove('active'));
        folderTile.classList.add('active');
        currentActiveFolder = folder;

        if (pendingRenderFrame) {
            cancelAnimationFrame(pendingRenderFrame);
            pendingRenderFrame = null;
        }

        if (animated) {
            bmkPane.style.opacity = '0.94';
            bmkPane.style.transform = 'translateY(2px)';
            pendingRenderFrame = requestAnimationFrame(() => {
                renderBmkPane(folder);
                requestAnimationFrame(() => {
                    bmkPane.style.opacity = '1';
                    bmkPane.style.transform = 'translateY(0)';
                });
                pendingRenderFrame = null;
            });
            return;
        }

        renderBmkPane(folder);
    };

    const visibleFolders = allFolders.filter((folder) => {
        const isHidden = HIDDEN_FOLDERS.includes(folder.id);
        return !(isHidden && !SHOW_HIDDEN_FOLDERS);
    });
    const shouldClampFolders = visibleFolders.length > FLAT_DIR_VISIBLE_LIMIT && !FLAT_DIR_EXPANDED;
    const foldersToRender = shouldClampFolders
        ? visibleFolders.slice(0, FLAT_DIR_VISIBLE_LIMIT)
        : visibleFolders;

    foldersToRender.forEach((folder) => {
        // Skip hidden folders unless SHOW_HIDDEN_FOLDERS is true
        const isHidden = HIDDEN_FOLDERS.includes(folder.id);

        const folderTile = document.createElement('div');
        folderTile.className = 'folder-tile';
        if (isHidden) folderTile.classList.add('is-hidden-folder');
        
        folderTile.dataset.id = folder.id;
        folderTile.dataset.parentId = folder.parentId;
        folderTile.dataset.type = 'folder';
        folderTile.setAttribute('draggable', 'true');
        
        const eyeSvg = isHidden
            ? `<svg class="hide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg class="hide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

        const pinTopBtn = `<button type="button" class="folder-action-btn pin-top-btn" title="置顶目录" aria-label="置顶目录"><svg class="pin-top-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V4"/><path d="m6 10 6-6 6 6"/><path d="M5 20h14"/></svg></button>`;
        const hideBtnHtml = `<button type="button" class="folder-action-btn hide-btn" title="${isHidden ? '取消隐藏目录' : '隐藏目录'}" aria-label="${isHidden ? '取消隐藏目录' : '隐藏目录'}">${eyeSvg}</button>`;
        folderTile.innerHTML = `${FOLDER_ICON_SVG} <span class="folder-tile-title">${folder.title}</span><span class="folder-tile-actions">${pinTopBtn}${hideBtnHtml}</span>`;
        
        const hideBtn = folderTile.querySelector('.hide-btn');
        const pinBtn = folderTile.querySelector('.pin-top-btn');

        pinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentOrderedIds = getOrderedFlatFolderIds();
            const nextOrder = [folder.id, ...currentOrderedIds.filter(id => id !== folder.id)];
            saveFlatDirectoryOrder(nextOrder, () => {
                renderBookmarks(bookmarkTreeNodes);
            });
        });

        hideBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isHidden) {
                HIDDEN_FOLDERS = HIDDEN_FOLDERS.filter(id => id !== folder.id);
            } else {
                HIDDEN_FOLDERS.push(folder.id);
            }
            chrome.storage.local.set({ [STORAGE_KEY_HIDDEN_FOLDERS]: HIDDEN_FOLDERS }, () => {
                renderBookmarks(bookmarkTreeNodes);
            });
        });

        if (allowHoverSwitch) {
            folderTile.addEventListener('mouseenter', () => {
                activateFolder(folder, folderTile, true);
            });
        }

        // Keep click as fallback (touch devices, accessibility)
        folderTile.addEventListener('click', () => {
            activateFolder(folder, folderTile, false);
        });

        // Folder tile drag events for sorting folders
        folderTile.addEventListener('dragstart', handleItemDragStart);
        folderTile.addEventListener('dragover', handleItemDragOver);
        folderTile.addEventListener('dragleave', handleItemDragLeave);
        folderTile.addEventListener('drop', handleItemDrop);
        folderTile.addEventListener('dragend', handleItemDragEnd);
        
        dirScroll.appendChild(folderTile);
    });

    // Automatically select the first visible folder
    const firstTile = dirPane.querySelector('.folder-tile');
    if (firstTile) {
        firstTile.classList.add('active');
        const firstFolderId = firstTile.dataset.id;
        const firstFolder = visibleFolders.find(f => f.id === firstFolderId);
        if (firstFolder) {
            currentActiveFolder = firstFolder;
            renderBmkPane(firstFolder);
        }
    }

    if (visibleFolders.length > FLAT_DIR_VISIBLE_LIMIT) {
        const moreToggleBtn = document.createElement('div');
        moreToggleBtn.className = 'directory-more-btn';
        const remainingCount = Math.max(0, visibleFolders.length - FLAT_DIR_VISIBLE_LIMIT);
        moreToggleBtn.textContent = FLAT_DIR_EXPANDED ? '收起目录' : `展开更多目录 (+${remainingCount})`;
        moreToggleBtn.addEventListener('click', () => {
            FLAT_DIR_EXPANDED = !FLAT_DIR_EXPANDED;
            chrome.storage.local.set({ [STORAGE_KEY_FLAT_DIR_EXPANDED]: FLAT_DIR_EXPANDED }, () => {
                renderBookmarks(bookmarkTreeNodes);
            });
        });
        dirScroll.appendChild(moreToggleBtn);
    }

    // Add "Manage Hidden Folders" toggle at the bottom of the left pane
    if (HIDDEN_FOLDERS.length > 0) {
        const toggleHiddenBtn = document.createElement('div');
        toggleHiddenBtn.className = 'toggle-hidden-btn';
        toggleHiddenBtn.innerHTML = SHOW_HIDDEN_FOLDERS ? '隐藏已折叠目录' : `显示已折叠目录 (${HIDDEN_FOLDERS.length})`;
        
        toggleHiddenBtn.addEventListener('click', () => {
            SHOW_HIDDEN_FOLDERS = !SHOW_HIDDEN_FOLDERS;
            renderBookmarks(bookmarkTreeNodes);
        });
        
        // Wrap the original dirPane content in a scrollable div and put this button at the bottom fixed
        // or just append it as the last item in the grid, spanning both columns.
        toggleHiddenBtn.style.gridColumn = '1 / -1';
        dirScroll.appendChild(toggleHiddenBtn);
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
    expandBtn.setAttribute('aria-label', `展开查看 ${folderNode.title}`);
    expandBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
    `;
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

function renderFlatBookmarkItem(node) {
    const wrapper = document.createElement('div');
    wrapper.className = 'leaf-wrapper';
    wrapper.setAttribute('draggable', 'true');
    wrapper.dataset.id = node.id;
    wrapper.dataset.parentId = node.parentId;
    wrapper.dataset.type = 'bookmark';

    const a = document.createElement('a');
    a.className = 'leaf-node';
    a.href = node.url;
    if (OPEN_IN_NEW_TAB) {
        a.target = '_blank';
    }

    const iconData = getIconForBookmark(node.url);
    const iconElement = createBookmarkIcon(iconData, 18);
    a.appendChild(iconElement);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'bookmark-label';
    labelSpan.textContent = node.title;
    a.appendChild(labelSpan);

    wrapper.appendChild(a);
    const actions = createBookmarkActions(node, wrapper);
    wrapper.appendChild(actions);

    return wrapper;
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

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) {
            a.target = '_blank';
        }

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

        const header = document.createElement('div');
        header.className = 'sub-folder-header';

        // Add folder icon if in theme mode, or just always add it for consistency?
        // User asked to "replace all bookmark icons... directory and bookmarks"
        // Let's use FOLDER_ICON_SVG
        const folderIcon = `<span style="display:inline-flex; align-items:center; margin-right:6px; transform: scale(0.8);">${FOLDER_ICON_SVG}</span>`;

        header.innerHTML = `${folderIcon} ${node.title}`;

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
                header.dataset.isLocked = 'true';
            } else {
                if (header.dataset.isLocked === 'true') {
                    // Locked -> Unlock and Close
                    childrenContainer.classList.add('hidden');
                    header.dataset.isLocked = 'false';
                } else {
                    // Hover-Open (Not Locked) -> Lock it
                    header.dataset.isLocked = 'true';
                    // Optional: Visual cue that it's locked?
                }
            }
        });

        // Auto-expand on hover with low-latency delay for smoother follow
        let hoverTimer = null;
        wrapper.addEventListener('mouseenter', () => {
            if (HOVER_DELAY === 1100) return; // "Closed" setting
            const effectiveDelay = Math.min(HOVER_DELAY, 40);
            hoverTimer = setTimeout(() => {
                childrenContainer.classList.remove('hidden');
            }, effectiveDelay);
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
            refreshBookmarkTreeCache();

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
    bindDelegatedItemDnD(body);

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

        const a = document.createElement('a');
        a.className = 'leaf-node';
        a.href = node.url;
        if (OPEN_IN_NEW_TAB) {
            a.target = '_blank';
        }

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

        const header = document.createElement('div');
        header.className = 'sub-folder-header';

        const folderIcon = `<span style="display:inline-flex; align-items:center; margin-right:6px; transform: scale(0.8);">${FOLDER_ICON_SVG}</span>`;

        header.innerHTML = `${folderIcon} ${node.title}`;
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

        // Auto-expand on hover with low-latency delay for smoother follow
        let hoverTimer = null;
        wrapper.addEventListener('mouseenter', () => {
            if (HOVER_DELAY === 1100) return; // "Closed" setting
            const effectiveDelay = Math.min(HOVER_DELAY, 40);
            hoverTimer = setTimeout(() => {
                childrenContainer.classList.remove('hidden');
            }, effectiveDelay);
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
    let activeMatches = [];
    let inputDebounceTimer = null;

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
        activeMatches = [];
    }

    function openSearchMatch(bookmark) {
        if (!bookmark) return;
        if (OPEN_IN_NEW_TAB) {
            window.open(bookmark.url, '_blank');
        } else {
            window.location.href = bookmark.url;
        }
        exitSearchMode();
        input.value = '';
    }

    // Render suggestions
    function renderSuggestions(query) {
        const queryLower = query.trim().toLowerCase();
        if (!queryLower) {
            hideSuggestions();
            return;
        }

        const bucketKeys = [queryLower.slice(0, 2), queryLower.slice(0, 1)].filter(Boolean);
        const candidateSet = new Set();
        bucketKeys.forEach((key) => {
            const bucket = BOOKMARK_SEARCH_BUCKETS.get(key);
            if (bucket) bucket.forEach(item => candidateSet.add(item));
        });
        const source = candidateSet.size > 0 ? Array.from(candidateSet) : BOOKMARK_SEARCH_INDEX;

        const matches = source
            .filter(b => b.searchText.includes(queryLower))
            .slice(0, 10); // Limit to 10 results
        activeMatches = matches;

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
                    const fallback = document.createElement('span');
                    fallback.className = 'suggestion-icon-fallback';
                    fallback.innerHTML = BOOKMARK_ICON_SVG;
                    this.replaceWith(fallback);
                });
                iconDiv.appendChild(img);
            } catch {
                const fallback = document.createElement('span');
                fallback.className = 'suggestion-icon-fallback';
                fallback.innerHTML = BOOKMARK_ICON_SVG;
                iconDiv.appendChild(fallback);
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

        showSuggestions();
        selectedIndex = -1;
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

    suggestions.addEventListener('click', (e) => {
        const eventTarget = e.target instanceof Element ? e.target : null;
        const item = eventTarget ? eventTarget.closest('.suggestion-item') : null;
        if (!item || !suggestions.contains(item)) return;
        const index = Number(item.dataset.index);
        openSearchMatch(activeMatches[index]);
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
                openSearchMatch(activeMatches[selectedIndex]);
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
        clearTimeout(inputDebounceTimer);
        inputDebounceTimer = setTimeout(() => {
            renderSuggestions(input.value);
        }, 100);
    });
}

// --- Settings Logic (Cleaned) ---
// Constants are defined at the top of the file


// Returns native favicon data, with SVG fallback when favicon service is unavailable
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
            return { type: 'svg', value: BOOKMARK_ICON_SVG };
        }
    }
}

function initSettingsUI(settings) {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-modal');

    const linkTargetInputs = document.getElementsByName('link-target');
    const themeInputs = document.getElementsByName('theme');
    const iconStyleInputs = document.getElementsByName('icon-style');
    const layoutModeInputs = document.getElementsByName('layout-mode');

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
                renderBookmarksWithLayoutTransition();
            }
        });

        // Initial state
        if (settings[STORAGE_KEY_ICON_STYLE] && radio.value === settings[STORAGE_KEY_ICON_STYLE]) {
            radio.checked = true;
        }
    });

    // 4. Layout Mode
    layoutModeInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                LAYOUT_MODE = radio.value;
                saveSetting(STORAGE_KEY_LAYOUT_MODE, LAYOUT_MODE);
                // Re-render bookmarks
                renderBookmarksFromCache();
            }
        });

        // Initial state
        if (settings[STORAGE_KEY_LAYOUT_MODE] && radio.value === settings[STORAGE_KEY_LAYOUT_MODE]) {
            radio.checked = true;
        } else if (!settings[STORAGE_KEY_LAYOUT_MODE] && radio.value === 'tree') {
            radio.checked = true; // Default
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

    function saveBackgroundImage(dataUrl, onDone) {
        CURRENT_BG_IMAGE = dataUrl;
        updateBlurControlsState();
        applyBackground();
        saveSetting(STORAGE_KEY_BG_IMAGE, dataUrl, () => {
            const hasError = !!chrome.runtime.lastError;
            if (onDone) onDone(!hasError);
        });
    }

    function compressImageDataUrl(sourceDataUrl, options = {}) {
        const {
            maxDim = 6144,
            quality = 0.95,
            mimeType = 'image/webp'
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(sourceDataUrl);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL(mimeType, quality));
            };
            img.onerror = () => reject(new Error('image decode failed'));
            img.src = sourceDataUrl;
        });
    }

    // File Upload (high-fidelity first, then adaptive compression fallback)
    bgUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const dataUrl = event.target.result;
            const normalizedMime = (file.type || '').toLowerCase() === 'image/jpg' ? 'image/jpeg' : (file.type || '').toLowerCase();
            const preferredMime = ['image/jpeg', 'image/webp'].includes(normalizedMime) ? normalizedMime : 'image/webp';

            const trySave = (candidateDataUrl) => new Promise((resolve) => {
                saveBackgroundImage(candidateDataUrl, resolve);
            });

            // Always try original first to maximize fidelity.
            const originalOk = await trySave(dataUrl);
            if (originalOk) return;

            // Adaptive fallback: gradually reduce size only when needed by storage constraints.
            const compressionPresets = [
                { maxDim: 6144, quality: 0.98, mimeType: preferredMime },
                { maxDim: 5120, quality: 0.96, mimeType: preferredMime },
                { maxDim: 4096, quality: 0.94, mimeType: preferredMime },
                { maxDim: 3200, quality: 0.92, mimeType: 'image/webp' },
                { maxDim: 2560, quality: 0.9, mimeType: 'image/webp' }
            ];

            for (const preset of compressionPresets) {
                try {
                    const compressedDataUrl = await compressImageDataUrl(dataUrl, preset);
                    const ok = await trySave(compressedDataUrl);
                    if (ok) return;
                } catch (err) {
                    console.error('Image compression failed:', err);
                }
            }

            console.error('Failed to save image:', chrome.runtime.lastError);
            alert('图片保存失败（存储限制导致）。可尝试更小图片或降低分辨率后重试。');
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

    // Slider labels
    function getBlurLabel(level) {
        if (level === 0) return '关闭';
        return `${level * 10}%`;
    }

    function getContainerOpacityLabel(level) {
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

    // 主容器透明度滑块
    containerBlurInput.addEventListener('input', (e) => {
        const level = parseInt(e.target.value);
        CURRENT_CONTAINER_BLUR = level;
        containerBlurValueDisplay.textContent = getContainerOpacityLabel(level);
        applyContainerOpacity();
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
        CURRENT_CONTAINER_BLUR = level;
        containerBlurValueDisplay.textContent = getContainerOpacityLabel(level);
    } else {
        // 默认档位1（10% 透明）
        containerBlurInput.value = 1;
        CURRENT_CONTAINER_BLUR = 1;
        containerBlurValueDisplay.textContent = getContainerOpacityLabel(1);
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

    if (CURRENT_BG_BLUR > 0) {
        bgLayer.style.filter = `blur(${CURRENT_BG_BLUR}px)`;
        bgLayer.style.transform = 'scale(1.05)';
    } else {
        bgLayer.style.filter = 'none';
        bgLayer.style.transform = 'scale(1)';
    }
    if (aiSidebar) {
        // Base blur of 40px plus user's background blur
        const totalBlur = 40 + parseInt(CURRENT_BG_BLUR);
        aiSidebar.style.backdropFilter = `blur(${totalBlur}px)`;
        aiSidebar.style.webkitBackdropFilter = `blur(${totalBlur}px)`;
    }
}

function applyContainerOpacity() {
    const container = document.querySelector('.container');
    if (!container) return;

    const level = Math.max(0, Math.min(10, CURRENT_CONTAINER_BLUR));
    const transparency = level / 10;
    // Blend transparency and frosted blur together:
    // higher transparency -> lower blur, but keep a minimum for readability.
    const overlayAlpha = Math.max(0.28, 0.82 - transparency * 0.52);
    const blurPx = Math.max(2, Math.round(18 - transparency * 16));

    container.style.background =
        `linear-gradient(160deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.18) 34%, rgba(255, 255, 255, 0.06) 100%), color-mix(in srgb, var(--bg-overlay) ${Math.round(overlayAlpha * 100)}%, transparent)`;
    container.style.backdropFilter = `blur(${blurPx}px)`;
    container.style.webkitBackdropFilter = `blur(${blurPx}px)`;
}

// --- Bookmark Item Drag Handlers ---

function handleItemDragStart(e) {
    if (this.getAttribute('draggable') !== 'true') return;
    const target = e.target instanceof Element ? e.target : null;
    if (target && target.closest('.folder-tile-actions')) return;
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
                    // Refresh cache and UI to reflect the change
                    refreshBookmarkTreeCache((bookmarkTree) => {
                        renderBookmarks(bookmarkTree);
                    });
                }
            });

            dragSrcEl.style.opacity = '1';
            return false;
        }

        // Case 2: Reordering folders in flat left pane (index must ignore header/buttons)
        if (dragSrcEl.dataset.type === 'folder' && this.dataset.type === 'folder' &&
            dragSrcEl.classList.contains('folder-tile') && this.classList.contains('folder-tile')) {
            const parent = this.parentNode;
            const folderSiblings = Array.from(parent.querySelectorAll('.folder-tile'));
            const srcIndex = folderSiblings.indexOf(dragSrcEl);
            const targetIndex = folderSiblings.indexOf(this);
            const moveAfterTarget = srcIndex < targetIndex;

            if (moveAfterTarget) {
                parent.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                parent.insertBefore(dragSrcEl, this);
            }

            const targetId = this.dataset.id;
            const allOrderedIds = getOrderedFlatFolderIds();
            const sourceGlobalIndex = allOrderedIds.indexOf(srcId);
            const targetGlobalIndex = allOrderedIds.indexOf(targetId);

            if (sourceGlobalIndex !== -1 && targetGlobalIndex !== -1) {
                allOrderedIds.splice(sourceGlobalIndex, 1);
                const adjustedTargetIndex = allOrderedIds.indexOf(targetId);
                const insertIndex = moveAfterTarget ? adjustedTargetIndex + 1 : adjustedTargetIndex;
                allOrderedIds.splice(insertIndex, 0, srcId);
            }

            saveFlatDirectoryOrder(allOrderedIds, () => {
                renderBookmarksFromCache();
            });
            dragSrcEl.style.opacity = '1';
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
                dragSrcEl.dataset.parentId = destParentId;
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

// --- AI Sidebar Logic ---

function initAiSidebarLazy() {
    const toggleBtn = document.getElementById('ai-sidebar-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        if (!AI_SIDEBAR_CONTROLLER) {
            AI_SIDEBAR_CONTROLLER = initAiSidebar();
        }
        AI_SIDEBAR_CONTROLLER.toggle();
    });
}

function initAiSidebar() {
    const sidebar = document.getElementById('ai-sidebar');
    const sidebarOverlay = document.getElementById('ai-sidebar-overlay');
    const closeBtn = document.getElementById('ai-sidebar-close');
    const openNewWindowBtn = document.getElementById('ai-open-new-window');
    const openFallbackBtn = document.getElementById('ai-open-ai');
    const fallback = document.getElementById('ai-iframe-fallback');
    const aiTabs = document.querySelectorAll('.ai-tab');

    // Get all iframes
    const iframes = {
        google: document.getElementById('ai-iframe-google'),
        chatgpt: document.getElementById('ai-iframe-chatgpt'),
        doubao: document.getElementById('ai-iframe-doubao'),
        qwen: document.getElementById('ai-iframe-qwen')
    };

    // AI URLs mapping
    const aiUrls = {
        google: 'https://www.google.com/search?udm=50&aep=11',
        chatgpt: 'https://chatgpt.com/',
        doubao: 'https://www.doubao.com/chat/',
        qwen: 'https://chat.qwen.ai/'
    };

    const STORAGE_KEY_AI = 'bookmark_tree_selected_ai';
    const STORAGE_KEY_AI_ORDER = 'bookmark_tree_ai_order';

    // Current AI state
    let currentAi = {
        id: 'google',
        url: aiUrls.google,
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
    function syncAiState() {
        updateActiveTab();
        switchToAi(currentAi.id);
    }

    chrome.storage.local.get([STORAGE_KEY_AI], (result) => {
        if (result[STORAGE_KEY_AI]) {
            const saved = result[STORAGE_KEY_AI];
            if (saved?.id && aiUrls[saved.id]) {
                currentAi = saved;
            }
        }
        syncAiState();
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
            iframe.style.display = '';

            if (!iframe.dataset.loadBound) {
                iframe.addEventListener('load', () => {
                    iframe.classList.add('loaded');
                });
                iframe.dataset.loadBound = 'true';
            }
        }
    }

    function unloadIframe(aiId) {
        const iframe = iframes[aiId];
        if (!iframe || !loadedIframes.has(aiId)) return;
        iframe.classList.remove('active');
        iframe.classList.remove('loaded');
        iframe.style.display = '';
        iframe.src = 'about:blank';
        loadedIframes.delete(aiId);
    }

    // Switch between AI iframes
    function switchToAi(aiId) {
        Object.entries(iframes).forEach(([id, iframe]) => {
            if (!iframe) return;
            // Always clear stale active state, even if iframe was never loaded
            iframe.classList.remove('active');
            if (id !== aiId) unloadIframe(id);
        });

        const targetIframe = iframes[aiId];
        if (targetIframe) {
            targetIframe.classList.add('active');
            if (fallback) fallback.classList.add('hidden');
            targetIframe.style.display = '';
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
                unloadIframe(currentAi.id);
            }
        }, 400);
    }

    function openPopup() {
        window.open(currentAi.url, 'AI_Window', 'width=800,height=900,left=100,top=100,resizable=yes,scrollbars=yes');
    }

    function showFallback() {
        const activeFrame = document.querySelector('.ai-iframe.active');
        if (activeFrame) activeFrame.style.display = 'none';
        if (fallback) fallback.classList.remove('hidden');
    }

    // AI tabs click
    aiTabs.forEach(tab => {
        tab.addEventListener('click', () => selectAi(tab));
    });

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

    return {
        toggle() {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    };
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
