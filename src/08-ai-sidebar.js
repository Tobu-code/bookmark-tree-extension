// --- AI Sidebar ---
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
    const tabsContainer = document.getElementById('ai-tabs');
    const contentContainer = document.getElementById('ai-sidebar-content');

    if (!sidebar || !tabsContainer || !contentContainer) {
        console.warn('AI Sidebar critical elements missing, initialization skipped.');
        return {
            toggle: () => {},
            refresh: () => Promise.resolve()
        };
    }

    const fallbackTitle = fallback ? fallback.querySelector('p') : null;
    const fallbackHint = fallback ? fallback.querySelector('.ai-placeholder-hint') : null;
    const iframes = new Map();
    const loadedIframes = new Set();
    let aiProviders = [];
    let currentAiId = null;
    let draggedTab = null;

    function getCurrentAi() {
        return findAiProviderById(aiProviders, currentAiId) || getFirstEnabledAiProvider(aiProviders);
    }

    function buildAiTab(provider) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ai-tab';
        button.draggable = true;
        button.dataset.ai = provider.id;
        button.dataset.url = provider.url;
        button.dataset.name = provider.name;
        button.title = provider.name;
        button.innerHTML = `
            <span class="ai-tab-icon">${provider.icon || ''}</span>
            <span class="ai-tab-name">${escapeHtml(provider.name)}</span>
        `;
        return button;
    }

    function buildAiIframe(provider) {
        const iframe = document.createElement('iframe');
        iframe.id = `ai-iframe-${provider.id}`;
        iframe.className = 'ai-iframe';
        iframe.dataset.ai = provider.id;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'clipboard-read; clipboard-write; compute-pressure');
        iframe.addEventListener('error', () => showFallback('无法直接嵌入 AI 网站', '安全策略阻止了嵌入，可改用新窗口打开。'));
        return iframe;
    }

    function buildAiUrl(provider) {
        let url = provider.url;
        if (provider.id === 'google') {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                (document.documentElement.getAttribute('data-theme') === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark && !url.includes('theme=1')) {
                url += '&theme=1';
            }
        }
        return url;
    }

    function showFallback(title, hint) {
        const activeFrame = contentContainer.querySelector('.ai-iframe.active');
        if (activeFrame) activeFrame.style.display = 'none';
        if (fallbackTitle) fallbackTitle.textContent = title || '无法直接嵌入 AI 网站';
        if (fallbackHint) fallbackHint.textContent = hint || '安全策略阻止了嵌入';
        if (fallback) fallback.classList.remove('hidden');
    }

    function hideFallback() {
        if (fallback) fallback.classList.add('hidden');
    }

    function updateActiveTab() {
        tabsContainer.querySelectorAll('.ai-tab').forEach((tab) => {
            const isActive = tab.dataset.ai === currentAiId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function syncAiTabsIndicator() {
        if (!sidebar || !sidebar.classList.contains('active')) return;
        
        const activeTab = tabsContainer.querySelector('.ai-tab.active');
        let indicator = tabsContainer.querySelector('.ai-tabs-indicator');

        if (!activeTab) {
            if (indicator) {
                indicator.style.opacity = '0';
                indicator.style.transform = 'scale3d(0.9, 0.9, 1)';
            }
            return;
        }

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'ai-tabs-indicator';
            tabsContainer.insertBefore(indicator, tabsContainer.firstChild);
            void indicator.offsetWidth;
        }

        // Use getBoundingClientRect for robust positioning, factoring in horizontal scrolling (scrollLeft)
        const activeRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();

        const left = activeRect.left - containerRect.left + tabsContainer.scrollLeft;
        const top = activeRect.top - containerRect.top;

        const width = activeTab.offsetWidth;
        const height = activeTab.offsetHeight;

        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        indicator.style.transform = `translate3d(${left}px, ${top}px, 0) scale3d(1, 1, 1)`;
        indicator.style.opacity = '1';
    }

    function preloadIframe(provider) {
        const iframe = iframes.get(provider.id);
        if (!iframe || loadedIframes.has(provider.id)) return;

        iframe.src = buildAiUrl(provider);
        loadedIframes.add(provider.id);
        iframe.style.display = '';

        if (!iframe.dataset.loadBound) {
            iframe.addEventListener('load', () => {
                iframe.classList.add('loaded');
                if (currentAiId === provider.id) {
                    const loader = document.getElementById('ai-sidebar-loading');
                    if (loader) loader.classList.add('hidden');
                }
            });
            iframe.dataset.loadBound = 'true';
        }
    }

    function unloadIframe(providerId) {
        const iframe = iframes.get(providerId);
        if (!iframe || !loadedIframes.has(providerId)) return;
        iframe.classList.remove('active', 'loaded');
        iframe.style.display = '';
        iframe.src = 'about:blank';
        loadedIframes.delete(providerId);
    }

    function switchToAi(aiId) {
        const targetProvider = findAiProviderById(aiProviders, aiId);
        if (!targetProvider || targetProvider.enabled === false) {
            showFallback('当前没有可用的 AI 服务', '请在设置中启用至少一个 AI 站点。');
            return;
        }

        currentAiId = aiId;
        updateActiveTab();
        
        requestAnimationFrame(() => {
            syncAiTabsIndicator();
        });

        iframes.forEach((iframe, id) => {
            iframe.classList.remove('active');
            iframe.style.display = 'none';
        });

        const targetIframe = iframes.get(aiId);
        if (!targetIframe) {
            showFallback('当前没有可用的 AI 服务', '请在设置中启用至少一个 AI 站点。');
            return;
        }

        if (targetProvider.sidebarMode === 'external') {
            showFallback(`${targetProvider.name} 暂不支持侧边栏内嵌`, '该站点会拒绝 iframe 嵌入，请使用右上角按钮在新窗口打开。');
            const loader = document.getElementById('ai-sidebar-loading');
            if (loader) loader.classList.add('hidden');
            return;
        }

        hideFallback();
        targetIframe.classList.add('active');
        targetIframe.style.display = '';

        const loader = document.getElementById('ai-sidebar-loading');
        if (loader) {
            if (targetIframe.classList.contains('loaded')) {
                loader.classList.add('hidden');
            } else {
                loader.classList.remove('hidden');
            }
        }

        if (!loadedIframes.has(aiId)) {
            preloadIframe(targetProvider);
        }
    }

    async function selectAiById(aiId) {
        const provider = findAiProviderById(aiProviders, aiId);
        if (!provider || provider.enabled === false || aiId === currentAiId) return;
        currentAiId = aiId;
        await persistSelectedAi(provider);
        switchToAi(aiId);
    }

    function renderAiSidebar() {
        tabsContainer.innerHTML = '';
        contentContainer.querySelectorAll('.ai-iframe').forEach((iframe) => iframe.remove());
        iframes.clear();
        loadedIframes.clear();

        const enabledProviders = aiProviders.filter((provider) => provider.enabled !== false);
        if (!enabledProviders.length) {
            currentAiId = null;
            showFallback('当前没有启用中的 AI 服务', '请先在设置里启用至少一个 AI 站点。');
            return;
        }

        enabledProviders.forEach((provider) => {
            const tab = buildAiTab(provider);
            const iframe = buildAiIframe(provider);
            tabsContainer.appendChild(tab);
            contentContainer.insertBefore(iframe, fallback);
            iframes.set(provider.id, iframe);
        });

        currentAiId = findAiProviderById(enabledProviders, currentAiId)?.id || enabledProviders[0].id;
        updateActiveTab();
        switchToAi(currentAiId);
    }

    async function loadAiState() {
        const preference = await loadAiPreferences();
        aiProviders = preference.providers;
        currentAiId = preference.selectedId;
        try {
            await syncDynamicAiRules(aiProviders);
        } catch (error) {
            console.error('Failed to restore AI dynamic rules:', error);
        }
        renderAiSidebar();
    }

    async function persistAiTabOrder() {
        const orderedIds = [...tabsContainer.querySelectorAll('.ai-tab')].map((tab) => tab.dataset.ai);
        const orderedProviders = [];
        orderedIds.forEach((id) => {
            const provider = findAiProviderById(aiProviders, id);
            if (provider) orderedProviders.push(provider);
        });
        aiProviders.forEach((provider) => {
            if (!orderedIds.includes(provider.id)) orderedProviders.push(provider);
        });
        aiProviders = orderedProviders;
        await persistAiProviders(aiProviders);
    }

    function initAiTabSort() {
        if (!tabsContainer) return;
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
                persistAiTabOrder();
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
    }

    initAiTabSort();

    function openSidebar() {
        sidebar.classList.remove('hidden');
        sidebarOverlay.classList.remove('hidden');
        
        // 强制触发布局重排 (Reflow)，确保浏览器应用了 initial transform (translateX(100%)) 
        // 这样后续添加的 .active 才会触发过渡动画
        void sidebar.offsetWidth;

        requestAnimationFrame(() => {
            document.body.classList.add('ai-sidebar-open');
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            setTimeout(syncAiTabsIndicator, 150);
        });

        if (!currentAiId) {
            renderAiSidebar();
        } else {
            switchToAi(currentAiId);
        }
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        // 立即移除 body 类名，让主容器的 3D 还原动画与侧栏滑回完美同步，消除关闭割裂延迟
        document.body.classList.remove('ai-sidebar-open');
        setTimeout(() => {
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.add('hidden');
                sidebarOverlay.classList.add('hidden');
                
                // 保活策略：关闭时不卸载 iframe，提供下次点击的“热启动秒开”体验，避免冷启动网络重载
                /*
                iframes.forEach((iframe, id) => {
                    unloadIframe(id);
                });
                */
                
                const loader = document.getElementById('ai-sidebar-loading');
                if (loader) loader.classList.add('hidden');
            }
        }, 400);
    }

    function openPopup() {
        const provider = getCurrentAi();
        if (!provider) return;
        window.open(provider.url, 'AI_Window', 'width=800,height=900,left=100,top=100,resizable=yes,scrollbars=yes');
    }

    function handleCloseSidebar(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') {
                event.stopImmediatePropagation();
            }
        }
        closeSidebar();
    }

    if (tabsContainer) {
        tabsContainer.addEventListener('click', (event) => {
            const tab = event.target.closest('.ai-tab');
            if (!tab) return;
            selectAiById(tab.dataset.ai);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('pointerdown', handleCloseSidebar, { capture: true });
        closeBtn.addEventListener('click', handleCloseSidebar, { capture: true });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    if (openNewWindowBtn) openNewWindowBtn.addEventListener('click', openPopup);
    if (openFallbackBtn) openFallbackBtn.addEventListener('click', openPopup);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    window.addEventListener('resize', debounce(syncAiTabsIndicator, 100));

    loadAiState();

    return {
        toggle() {
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        },
        refresh() {
            return loadAiState();
        }
    };
}
