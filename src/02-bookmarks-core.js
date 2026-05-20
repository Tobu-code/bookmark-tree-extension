// --- Icon Constants ---
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

const FOLDER_ICON_SVG = `<svg class="bookmark-svg-icon folder-svg-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const BOOKMARK_ICON_SVG = `<svg class="bookmark-svg-icon bookmark-file-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

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
    
    // Smooth transition indicator sync
    setTimeout(syncSidebarActiveIndicator, 50);
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
    if (!bookmarkTreeNodes || !bookmarkTreeNodes[0]) {
        renderBookmarkState('empty', '当前没有书签目录。');
        return;
    }

    const rootNode = bookmarkTreeNodes[0];
    const bookmarksBar = rootNode.children.find(node => node.id === '1') || rootNode.children[0];
    if (!bookmarksBar || !bookmarksBar.children || bookmarksBar.children.length === 0) {
        renderBookmarkState('empty', '书签栏还是空的，先收藏几个常用站点吧。');
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
    // Directory scroll container represents root for left pane reordering
    dirScroll.dataset.parentId = bookmarksBar.id;
    dirPane.appendChild(dirScroll);
    
    const bmkPane = document.createElement('div');
    bmkPane.className = 'bookmarks-pane';
    
    container.appendChild(dirPane);
    container.appendChild(bmkPane);

    let currentActiveFolder = null;
    let pendingRenderFrame = null;

    const renderBmkPane = (folder) => {
        bmkPane.innerHTML = '';
        if (!folder || !folder.children) return;
        
        const header = document.createElement('div');
        header.className = 'bookmarks-pane-header';
        
        buildFolderBreadcrumb(header, folder.title);
        bmkPane.appendChild(header);

        const bmkPaneScroll = document.createElement('div');
        bmkPaneScroll.className = 'bookmarks-pane-scroll';
        bmkPane.appendChild(bmkPaneScroll);

        const listContainer = document.createElement('div');
        listContainer.className = 'bookmarks-pane-grid';

        listContainer.dataset.type = 'folder';
        listContainer.dataset.id = folder.id;
        listContainer.dataset.parentId = folder.id;

        const getFlatDragTarget = (e) => {
            const eventTarget = e.target instanceof Element ? e.target : null;
            const item = eventTarget ? eventTarget.closest('.leaf-wrapper, .bookmark-card') : null;
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

        const bookmarks = folder.children.filter(child => !child.children);
        const subFolders = folder.children.filter(child => child.children);
        const activateFolderByNode = (targetFolder) => {
            if (!targetFolder) return;
            TREE_EXPANDED_FOLDERS.add(folder.id);
            saveTreeExpandedState();
            const leftFolderEl = dirPane.querySelector(`.tree-folder-item[data-id="${targetFolder.id}"]`);
            activateFolder(targetFolder, leftFolderEl);
        };

        // Render sub-folders as grid cards (same visual as bookmarks)
        subFolders.forEach((subFolder) => {
            const folderCard = document.createElement('div');
            folderCard.className = 'leaf-wrapper leaf-wrapper--folder';
            folderCard.dataset.id = subFolder.id;
            folderCard.setAttribute('role', 'button');
            folderCard.setAttribute('tabindex', '0');

            const folderInner = document.createElement('div');
            folderInner.className = 'leaf-node leaf-node--folder';

            const iconWrap = document.createElement('div');
            iconWrap.className = 'bookmark-icon-wrap';
            iconWrap.innerHTML = FOLDER_ICON_SVG;

            const label = document.createElement('span');
            label.className = 'bookmark-label';
            label.textContent = subFolder.title || '未命名目录';
            label.title = subFolder.title || '未命名目录';

            const meta = document.createElement('span');
            meta.className = 'bookmark-url-preview';
            meta.textContent = `${subFolder.children.length} 项`;

            folderInner.appendChild(iconWrap);
            folderInner.appendChild(label);
            folderInner.appendChild(meta);
            folderCard.appendChild(folderInner);

            folderCard.addEventListener('click', () => activateFolderByNode(subFolder));
            folderCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateFolderByNode(subFolder);
                }
            });

            listContainer.appendChild(folderCard);
        });

        // Render bookmarks into the grid
        bookmarks.forEach(child => {
            const bmkItem = renderFlatBookmarkItem(child);
            if (child.url) {
                const leafNode = bmkItem.querySelector('.leaf-node');
                if (leafNode) {
                    const urlPreview = document.createElement('span');
                    urlPreview.className = 'bookmark-url-preview';
                    try {
                        let hostname = new URL(child.url).hostname.replace(/^www\./, '');
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

        if (bookmarks.length > 0 || subFolders.length > 0) {
            bmkPaneScroll.appendChild(listContainer);
        }

        if (bookmarks.length === 0 && subFolders.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'pane-empty-state';
            emptyState.innerHTML = `
                <div class="pane-empty-icon">${FOLDER_ICON_SVG}</div>
                <div class="pane-empty-title">此目录暂无内容</div>
                <div class="pane-empty-desc">当前目录下没有直接书签和子目录</div>
            `;
            bmkPaneScroll.appendChild(emptyState);
        }
    };

    const activateFolder = (folder, element) => {
        if (currentActiveFolder === folder) return;
        dirPane.querySelectorAll('.tree-folder-item').forEach(t => t.classList.remove('active'));
        if (element) element.classList.add('active');
        currentActiveFolder = folder;
        
        if (pendingRenderFrame) {
            cancelAnimationFrame(pendingRenderFrame);
            pendingRenderFrame = null;
        }

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
    };

    const renderFolderTree = (node, parentContainer, depth = 0) => {
        if (!node.children) return;

        const folderItem = document.createElement('div');
        folderItem.className = 'tree-folder-item';
        folderItem.style.paddingLeft = `${depth * 16 + 4}px`;
        folderItem.dataset.id = node.id;
        folderItem.dataset.type = 'folder';
        folderItem.setAttribute('draggable', 'true');

        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'tree-folder-toggle';
        if (node.children.some(child => child.children)) {
            toggleBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
            if (TREE_EXPANDED_FOLDERS.has(node.id)) {
                toggleBtn.classList.add('expanded');
            }
        } else {
            toggleBtn.style.visibility = 'hidden';
            toggleBtn.innerHTML = `<svg width="12" height="12"></svg>`;
        }
        
        const isHidden = HIDDEN_FOLDERS.includes(node.id);
        if (isHidden && !SHOW_HIDDEN_FOLDERS) return;
        if (isHidden) folderItem.classList.add('is-hidden-folder');

        const iconContainer = document.createElement('div');
        iconContainer.className = 'tree-folder-icon';
        iconContainer.innerHTML = FOLDER_ICON_SVG;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'tree-folder-title';
        titleSpan.textContent = node.title;
        
        const eyeSvg = isHidden
            ? `<svg class="hide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg class="hide-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

        const actionsSpan = document.createElement('span');
        actionsSpan.className = 'tree-folder-actions';
        const hideBtnHtml = `<button type="button" class="folder-action-btn hide-btn" title="${isHidden ? '取消隐藏' : '隐藏目录'}">${eyeSvg}</button>`;
        actionsSpan.innerHTML = hideBtnHtml;

        folderItem.appendChild(toggleBtn);
        folderItem.appendChild(iconContainer);
        folderItem.appendChild(titleSpan);
        folderItem.appendChild(actionsSpan);
        
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-folder-children';
        childrenContainer.dataset.parentId = node.id;
        if (TREE_EXPANDED_FOLDERS.has(node.id)) {
            childrenContainer.classList.add('expanded');
        }

        folderItem.addEventListener('dragstart', handleItemDragStart);
        folderItem.addEventListener('dragover', handleItemDragOver);
        folderItem.addEventListener('dragleave', handleItemDragLeave);
        folderItem.addEventListener('drop', handleItemDrop);
        folderItem.addEventListener('dragend', handleItemDragEnd);

        folderItem.addEventListener('click', (e) => {
            if (e.target.closest('.tree-folder-toggle') && node.children.some(child => child.children)) {
                e.stopPropagation();
                if (childrenContainer.classList.contains('expanded')) {
                    childrenContainer.classList.remove('expanded');
                    toggleBtn.classList.remove('expanded');
                    TREE_EXPANDED_FOLDERS.delete(node.id);
                } else {
                    childrenContainer.classList.add('expanded');
                    toggleBtn.classList.add('expanded');
                    TREE_EXPANDED_FOLDERS.add(node.id);
                }
                saveTreeExpandedState();
                return;
            }
            
            if (e.target.closest('.hide-btn')) {
                e.stopPropagation();
                if (isHidden) {
                    HIDDEN_FOLDERS = HIDDEN_FOLDERS.filter(id => id !== node.id);
                } else {
                    HIDDEN_FOLDERS.push(node.id);
                }
                chrome.storage.local.set({ [STORAGE_KEY_HIDDEN_FOLDERS]: HIDDEN_FOLDERS }, () => {
                    renderBookmarks(bookmarkTreeNodes);
                });
                return;
            }

            activateFolder(node, folderItem);
        });

        parentContainer.appendChild(folderItem);
        parentContainer.appendChild(childrenContainer);

        // Auto-activate the first rendered folder if nothing is active
        if (!currentActiveFolder && (node.id === '1' || depth === 0)) {
             folderItem.classList.add('active');
             currentActiveFolder = node;
             renderBmkPane(node);
        }

        node.children.forEach(child => {
            if (child.children) {
                renderFolderTree(child, childrenContainer, depth + 1);
            }
        });
    };

    bookmarksBar.children.forEach(child => {
        if (child.children) {
            renderFolderTree(child, dirScroll, 0);
        }
    });
    
    if (HIDDEN_FOLDERS.length > 0) {
        const toggleHiddenBtn = document.createElement('div');
        toggleHiddenBtn.className = 'toggle-hidden-btn';
        toggleHiddenBtn.innerHTML = SHOW_HIDDEN_FOLDERS ? '隐藏已折叠目录' : `显示已折叠目录 (${HIDDEN_FOLDERS.length})`;
        
        toggleHiddenBtn.addEventListener('click', () => {
            SHOW_HIDDEN_FOLDERS = !SHOW_HIDDEN_FOLDERS;
            renderBookmarks(bookmarkTreeNodes);
        });
        
        toggleHiddenBtn.style.padding = '10px';
        toggleHiddenBtn.style.cursor = 'pointer';
        toggleHiddenBtn.style.textAlign = 'center';
        toggleHiddenBtn.style.color = 'var(--text-subtle)';
        toggleHiddenBtn.style.fontSize = '12px';
        dirScroll.appendChild(toggleHiddenBtn);
    }
}

