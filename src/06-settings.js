// --- Settings & Theme ---
// --- Settings Logic (Cleaned) ---
// Constants are defined at the top of the file


// Returns native favicon data, with SVG fallback when favicon service is unavailable
function getIconForBookmark(url) {
    if (CURRENT_ICON_STYLE === 'theme') {
        return { type: 'svg', value: BOOKMARK_ICON_SVG };
    } else {
        // Native (Default)
        try {
            const override = getBookmarkIconOverride(url);
            if (override) return override;

            return {
                type: 'img',
                src: `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${FAVICON_SIZE}`
            };
        } catch {
            return { type: 'svg', value: BOOKMARK_ICON_SVG };
        }
    }
}

function getBookmarkIconOverride(url) {
    if (!url || !Array.isArray(BOOKMARK_ICON_OVERRIDES)) return null;

    let hostname = '';
    try {
        hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
        return null;
    }

    const match = BOOKMARK_ICON_OVERRIDES.find((item) => {
        return item.hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
    });
    if (!match) return null;

    if (match.path && typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        return {
            type: 'img',
            src: chrome.runtime.getURL(match.path),
            fallbackLabel: match.hosts[0]?.slice(0, 2).toUpperCase()
        };
    }

    if (match.svg) {
        return { type: 'svg', value: match.svg };
    }

    return null;
}

function initSettingsUI(settings) {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-modal');

    if (!modal || !btn || !close) {
        console.warn('Settings modal elements missing, UI initialization skipped.');
        return;
    }

    const linkTargetInputs = document.getElementsByName('link-target');
    const themeInputs = document.getElementsByName('theme');
    const iconStyleInputs = document.getElementsByName('icon-style');

    // Background Inputs
    const bgUpload = document.getElementById('bg-image-upload');
    const clearBgBtn = document.getElementById('clear-bg');
    const blurInput = document.getElementById('bg-blur');
    const blurValueDisplay = document.getElementById('bg-blur-value');
    const ambientBlurInput = document.getElementById('ambient-blur');
    const ambientBlurValueDisplay = document.getElementById('ambient-blur-value');
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

    LAYOUT_MODE = 'flat';
    chrome.storage.local.set({ [STORAGE_KEY_LAYOUT_MODE]: 'flat' });

    // 4. Background Settings

    // 更新模糊控制的启用/禁用状态
    function updateBlurControlsState() {
        blurInput.disabled = false;
        if (ambientBlurInput) ambientBlurInput.disabled = false;
        containerBlurInput.disabled = false;
        blurControls.style.opacity = '1';
    }

    // Fix #16: Save to IndexedDB instead of chrome.storage.local to bypass 8MB limit
    async function saveBackgroundImage(dataUrl) {
        CURRENT_BG_IMAGE = dataUrl;
        updateBlurControlsState();
        applyBackground();
        void applyBackgroundContrast(dataUrl);
        try {
            await bgIdbSet(dataUrl);
            return true;
        } catch (e) {
            console.error('BG save failed:', e);
            return false;
        }
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

            const trySave = async (candidateDataUrl) => saveBackgroundImage(candidateDataUrl);

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

    // Clear Background (Fix #16: also clear from IndexedDB)
    clearBgBtn.addEventListener('click', async () => {
        CURRENT_BG_IMAGE = null;
        bgUpload.value = ''; // Reset input
        updateBlurControlsState();
        applyBackground();
        applyContainerOpacity();
        await bgIdbRemove();
        chrome.storage.local.remove(STORAGE_KEY_BG_IMAGE); // clean up legacy
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

    // 底图模糊滑块
    if (ambientBlurInput) {
        ambientBlurInput.addEventListener('input', (e) => {
            const level = parseInt(e.target.value);
            CURRENT_AMBIENT_BLUR_LEVEL = level;
            ambientBlurValueDisplay.textContent = getBlurLabel(level);
            applyBackground();
        });

        ambientBlurInput.addEventListener('change', (e) => {
            const level = parseInt(e.target.value);
            saveSetting(STORAGE_KEY_AMBIENT_BLUR, level);
        });
    }

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

    if (settings[STORAGE_KEY_AMBIENT_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_AMBIENT_BLUR]);
        if (ambientBlurInput) ambientBlurInput.value = level;
        CURRENT_AMBIENT_BLUR_LEVEL = level;
        if (ambientBlurValueDisplay) ambientBlurValueDisplay.textContent = getBlurLabel(level);
    } else {
        if (ambientBlurInput) ambientBlurInput.value = 2;
        CURRENT_AMBIENT_BLUR_LEVEL = 2;
        if (ambientBlurValueDisplay) ambientBlurValueDisplay.textContent = '20%';
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

    const aiProviderList = document.getElementById('ai-provider-list');
    const aiProviderNameInput = document.getElementById('ai-provider-name');
    const aiProviderUrlInput = document.getElementById('ai-provider-url');
    const aiProviderAddBtn = document.getElementById('ai-provider-add');
    const settingsToast = document.getElementById('settings-toast');
    const aiProviderCount = document.getElementById('ai-provider-count');
    const aiProviderEnabledCount = document.getElementById('ai-provider-enabled-count');
    let aiSettingsState = normalizeAiProviders(settings[STORAGE_KEY_AI_CONFIG], settings[STORAGE_KEY_AI_ORDER]);
    let aiSelectedId = settings[STORAGE_KEY_AI]?.id || getFirstEnabledAiProvider(aiSettingsState)?.id || null;
    let aiDraggedProviderId = null;
    let aiToastTimer = null;

    function showSettingsToast(message, variant = 'default') {
        if (!settingsToast || !message) return;
        settingsToast.textContent = message;
        settingsToast.dataset.variant = variant;
        settingsToast.classList.add('is-visible');
        clearTimeout(aiToastTimer);
        aiToastTimer = setTimeout(() => {
            settingsToast.classList.remove('is-visible');
        }, 2200);
    }

    function getEnabledAiCount() {
        return aiSettingsState.filter((provider) => provider.enabled !== false).length;
    }

    function ensureSelectedAi() {
        const selected = findAiProviderById(aiSettingsState, aiSelectedId);
        if (selected && selected.enabled !== false) return;
        aiSelectedId = getFirstEnabledAiProvider(aiSettingsState)?.id || null;
    }

    function notifyAiSidebarRefresh() {
        if (AI_SIDEBAR_CONTROLLER?.refresh) {
            AI_SIDEBAR_CONTROLLER.refresh();
        }
    }

    async function commitAiSettings() {
        aiSettingsState = await persistAiProviders(aiSettingsState);
        ensureSelectedAi();
        const selectedProvider = findAiProviderById(aiSettingsState, aiSelectedId) || getFirstEnabledAiProvider(aiSettingsState);
        if (selectedProvider) {
            aiSelectedId = selectedProvider.id;
            await persistSelectedAi(selectedProvider);
        }
        try {
            await syncDynamicAiRules(aiSettingsState);
        } catch (error) {
            console.error('Failed to sync AI dynamic rules:', error);
            showSettingsToast('AI 站点规则同步失败，侧栏可能只能用弹窗打开。', 'warning');
        }
        renderAiProviderList();
        notifyAiSidebarRefresh();
    }

    function renderAiProviderList() {
        if (!aiProviderList) return;
        ensureSelectedAi();
        if (aiProviderCount) aiProviderCount.textContent = String(aiSettingsState.length);
        if (aiProviderEnabledCount) aiProviderEnabledCount.textContent = String(getEnabledAiCount());

        if (!aiSettingsState.length) {
            aiProviderList.innerHTML = '<div class="ai-provider-empty">暂无可用 AI 服务</div>';
            return;
        }

        aiProviderList.innerHTML = aiSettingsState.map((provider, index) => {
            const disabled = provider.enabled === false;
            const isSelected = provider.id === aiSelectedId;
            return `
                <div class="ai-provider-item${disabled ? ' is-disabled' : ''}" data-ai-id="${escapeHtml(provider.id)}">
                    <div class="ai-provider-drag-handle" data-drag-handle title="拖动排序">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="9" cy="5" r="1"/>
                            <circle cx="9" cy="12" r="1"/>
                            <circle cx="9" cy="19" r="1"/>
                            <circle cx="15" cy="5" r="1"/>
                            <circle cx="15" cy="12" r="1"/>
                            <circle cx="15" cy="19" r="1"/>
                        </svg>
                    </div>
                    <div class="ai-provider-identity">
                        <span class="ai-provider-icon">${normalizeAiProviderIcon(provider.icon, provider.name)}</span>
                        <div class="ai-provider-meta">
                            <div class="ai-provider-title-row">
                                <span class="ai-provider-name">${escapeHtml(provider.name)}</span>
                                <span class="ai-provider-badge">${provider.builtIn ? '预置' : '自定义'}</span>
                            </div>
                            <div class="ai-provider-caption">${provider.builtIn ? '官方预置服务' : '用户自定义服务'}</div>
                        </div>
                    </div>
                    <div class="ai-provider-endpoint">
                        <span class="ai-provider-endpoint-label">站点地址</span>
                        <div class="ai-provider-url" title="${escapeHtml(provider.url)}">${escapeHtml(provider.url)}</div>
                    </div>
                    <div class="ai-provider-controls">
                        <div class="ai-provider-actions-main">
                            <label class="ai-provider-switch">
                                <input type="checkbox" data-action="toggle" ${disabled ? '' : 'checked'}>
                                <span class="ai-provider-switch-indicator" aria-hidden="true">
                                    <svg viewBox="0 0 16 16" width="12" height="12">
                                        <path d="M3.5 8.2 6.6 11 12.5 4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                                <span class="ai-provider-switch-label">启用</span>
                            </label>
                            <label class="ai-provider-switch is-default">
                                <input type="checkbox" data-action="default" ${isSelected ? 'checked disabled' : ''}>
                                <span class="ai-provider-switch-indicator" aria-hidden="true">
                                    <svg viewBox="0 0 16 16" width="12" height="12">
                                        <path d="M3.5 8.2 6.6 11 12.5 4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                                <span class="ai-provider-switch-label">默认</span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function moveAiProvider(providerId, delta) {
        const currentIndex = aiSettingsState.findIndex((provider) => provider.id === providerId);
        const targetIndex = currentIndex + delta;
        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= aiSettingsState.length) return;
        const [provider] = aiSettingsState.splice(currentIndex, 1);
        aiSettingsState.splice(targetIndex, 0, provider);
        await commitAiSettings();
        showSettingsToast('AI 服务顺序已更新。');
    }

    async function reorderAiProviders(draggedId, targetId) {
        if (!draggedId || !targetId || draggedId === targetId) return;
        const currentIndex = aiSettingsState.findIndex((provider) => provider.id === draggedId);
        const targetIndex = aiSettingsState.findIndex((provider) => provider.id === targetId);
        if (currentIndex < 0 || targetIndex < 0) return;
        const [provider] = aiSettingsState.splice(currentIndex, 1);
        aiSettingsState.splice(targetIndex, 0, provider);
        await commitAiSettings();
        showSettingsToast('AI 服务顺序已更新。');
    }

    if (aiProviderList) {
        aiProviderList.addEventListener('click', async (event) => {
            const removeBtn = event.target.closest('[data-action="remove"]');
            if (!removeBtn) return;

            const item = removeBtn.closest('[data-ai-id]');
            if (!item) return;

            const providerId = item.dataset.aiId;
            const provider = findAiProviderById(aiSettingsState, providerId);
            if (!provider || provider.builtIn) return;

            const providerName = provider.name;
            aiSettingsState = aiSettingsState.filter((entry) => entry.id !== providerId);
            if (aiSelectedId === providerId) {
                aiSelectedId = getFirstEnabledAiProvider(aiSettingsState)?.id || null;
            }
            await commitAiSettings();
            showSettingsToast(`${providerName} 已从 AI 列表移除。`);
        });

        aiProviderList.addEventListener('change', async (event) => {
            const actionTarget = event.target.closest('input[data-action]');
            if (!actionTarget) return;

            const item = actionTarget.closest('[data-ai-id]');
            if (!item) return;

            const providerId = item.dataset.aiId;
            const provider = findAiProviderById(aiSettingsState, providerId);
            if (!provider) return;

            const action = actionTarget.dataset.action;

            if (action === 'toggle') {
                const enable = actionTarget.checked;
                // Business rule: at least one enabled
                if (!enable && getEnabledAiCount() <= 1 && provider.enabled !== false) {
                    actionTarget.checked = true;
                    showSettingsToast('至少保留一个启用中的 AI 服务。', 'warning');
                    return;
                }

                if (enable && !provider.builtIn) {
                    const granted = await requestAiOriginPermission(provider.url);
                    if (!granted) {
                        actionTarget.checked = false;
                        showSettingsToast('未获得站点权限，已保留为停用状态。', 'warning');
                        return;
                    }
                }

                provider.enabled = enable;
                if (!enable && aiSelectedId === providerId) {
                    const next = getFirstEnabledAiProvider(aiSettingsState.filter(p => p.id !== providerId));
                    aiSelectedId = next ? next.id : null;
                }
                await commitAiSettings();
                showSettingsToast(`${provider.name} 已${enable ? '启用' : '停用'}。`);
                return;
            }

            if (action === 'default') {
                if (actionTarget.checked) {
                    aiSelectedId = providerId;
                    await commitAiSettings();
                    showSettingsToast(`${provider.name} 已设为默认 AI。`, 'success');
                }
            }
        });

        // Drag & Drop Handling
        aiProviderList.addEventListener('mousedown', (e) => {
            const handle = e.target.closest('[data-drag-handle]');
            if (handle) {
                const item = handle.closest('.ai-provider-item');
                if (item) item.draggable = true;
            }
        });

        aiProviderList.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.ai-provider-item');
            if (!item || !item.draggable) {
                e.preventDefault();
                return;
            }
            aiDraggedProviderId = item.dataset.aiId;
            item.classList.add('is-dragging');
            e.dataTransfer.setData('text/plain', aiDraggedProviderId);
            e.dataTransfer.effectAllowed = 'move';
        });

        aiProviderList.addEventListener('dragover', (e) => {
            if (!aiDraggedProviderId) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const item = e.target.closest('.ai-provider-item');
            if (item && item.dataset.aiId !== aiDraggedProviderId) {
                item.classList.add('is-drag-over');
            }
        });

        aiProviderList.addEventListener('dragleave', (e) => {
            const item = e.target.closest('.ai-provider-item');
            if (item) item.classList.remove('is-drag-over');
        });

        aiProviderList.addEventListener('drop', async (e) => {
            if (!aiDraggedProviderId) return;
            e.preventDefault();
            const item = e.target.closest('.ai-provider-item');
            if (item) {
                item.classList.remove('is-drag-over');
                const targetId = item.dataset.aiId;
                if (targetId !== aiDraggedProviderId) {
                    await reorderAiProviders(aiDraggedProviderId, targetId);
                }
            }
        });

        aiProviderList.addEventListener('dragend', (e) => {
            const items = aiProviderList.querySelectorAll('.ai-provider-item');
            items.forEach(item => {
                item.classList.remove('is-dragging');
                item.classList.remove('is-drag-over');
                item.draggable = false;
            });
            aiDraggedProviderId = null;
        });
    }

    if (aiProviderAddBtn && aiProviderNameInput && aiProviderUrlInput) {
        aiProviderAddBtn.addEventListener('click', async () => {
            const name = sanitizeAiName(aiProviderNameInput.value);
            const url = normalizeAiUrl(aiProviderUrlInput.value);

            if (!name || !url) {
                showSettingsToast('请输入有效的 AI 名称和网址。', 'warning');
                return;
            }

            const granted = await requestAiOriginPermission(url);
            const provider = sanitizeCustomAiProvider({
                id: createCustomAiId(name, url),
                name,
                url,
                enabled: granted
            });

            if (!provider) {
                showSettingsToast('AI 配置无效，请检查后重试。', 'warning');
                return;
            }

            aiSettingsState.push(provider);
            if (!aiSelectedId || getEnabledAiCount() === 0) {
                aiSelectedId = provider.id;
            }

            await commitAiSettings();
            aiProviderNameInput.value = '';
            aiProviderUrlInput.value = '';

            if (!granted) {
                showSettingsToast('站点已添加，但因未授权访问，当前保持停用状态。', 'warning');
                return;
            }
            showSettingsToast(`${provider.name} 已添加到 AI 列表。`, 'success');
        });
    }

    renderAiProviderList();

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
    const syncThemeSurfaceVars = () => {
        if (typeof applyContainerOpacity === 'function') {
            applyContainerOpacity();
        }
    };
    const cleanupSystemThemeListener = () => {
        if (root._themeMediaQuery && root._themeListener) {
            root._themeMediaQuery.removeEventListener('change', root._themeListener);
        }
        root._themeMediaQuery = null;
        root._themeListener = null;
    };

    if (theme === 'system') {
        cleanupSystemThemeListener();
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const syncThemeFromSystem = () => {
            root.setAttribute('data-theme', darkModeQuery.matches ? 'dark' : 'light');
            syncThemeSurfaceVars();
        };

        const handleSystemThemeChange = () => {
            syncThemeFromSystem();
        };

        syncThemeFromSystem();
        root._themeMediaQuery = darkModeQuery;
        root._themeListener = handleSystemThemeChange;
        darkModeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (theme === 'skeuomorphic') {
        cleanupSystemThemeListener();
        root.setAttribute('data-theme', 'skeuomorphic');
        syncThemeSurfaceVars();
    } else {
        cleanupSystemThemeListener();
        root.setAttribute('data-theme', theme);
        syncThemeSurfaceVars();
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
    const ambientLayer = document.getElementById('ambient-layer');
    if (!bgLayer) return;

    if (ambientLayer) {
        ambientLayer.style.setProperty('--ambient-blur', `${CURRENT_AMBIENT_BLUR_LEVEL * 4}px`);
    }

    if (CURRENT_BG_IMAGE) {
        bgLayer.style.backgroundImage = `url('${CURRENT_BG_IMAGE}')`;
        if (ambientLayer) ambientLayer.style.backgroundImage = `url('${CURRENT_BG_IMAGE}')`;
        document.body.classList.add('has-custom-bg');
    } else {
        bgLayer.style.backgroundImage = ''; // Fallback to CSS default
        if (ambientLayer) ambientLayer.style.backgroundImage = '';
        document.body.classList.remove('has-custom-bg');
        delete document.body.dataset.backgroundTone;
    }

    if (CURRENT_BG_BLUR > 0) {
        bgLayer.style.setProperty('--applied-blur', `blur(${CURRENT_BG_BLUR}px) saturate(130%) contrast(98%)`);
        bgLayer.style.setProperty('--applied-scale', 'scale(1.06)');
    } else {
        bgLayer.style.setProperty('--applied-blur', 'none');
        bgLayer.style.setProperty('--applied-scale', 'scale(1)');
    }

    requestAnimationFrame(() => {
        if (typeof syncSidebarActiveIndicator === 'function') {
            syncSidebarActiveIndicator();
        }
    });
}

function detectBackgroundTone(dataUrl) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 40;
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            if (!context) {
                resolve('light');
                return;
            }

            try {
                context.drawImage(image, 0, 0, size, size);
                const pixels = context.getImageData(0, 0, size, size).data;
                let luminance = 0;
                let samples = 0;
                for (let index = 0; index < pixels.length; index += 4) {
                    if (pixels[index + 3] < 32) continue;
                    luminance += pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
                    samples += 1;
                }
                resolve(samples && luminance / samples < 150 ? 'dark' : 'light');
            } catch (error) {
                resolve('light');
            }
        };
        image.onerror = () => resolve('light');
        image.src = dataUrl;
    });
}

async function applyBackgroundContrast(dataUrl) {
    const tone = await detectBackgroundTone(dataUrl);
    if (CURRENT_BG_IMAGE !== dataUrl) return;
    document.body.dataset.backgroundTone = tone;
    applyContainerOpacity();
}

function applyContainerOpacity() {
    const level = Math.max(0, Math.min(10, CURRENT_CONTAINER_BLUR));
    const root = document.documentElement;
    const body = document.body;
    const backgroundTone = body?.dataset.backgroundTone;
    const isDark = backgroundTone ? backgroundTone === 'dark' : root.getAttribute('data-theme') === 'dark';

    const r = isDark ? 18 : 255;
    const g = isDark ? 25 : 255;
    const b = isDark ? 42 : 255;

    const baseAlphaCard = isDark ? 0.62 : 0.62;
    const baseAlphaGlass = isDark ? 0.66 : 0.64;
    const baseAlphaStrong = isDark ? 0.84 : 0.82;

    const cardAlpha = Math.max(0.02, baseAlphaCard - (level / 10) * (baseAlphaCard - 0.02));
    const glassAlpha = Math.max(0.02, baseAlphaGlass - (level / 10) * (baseAlphaGlass - 0.02));
    const strongAlpha = Math.max(0.08, baseAlphaStrong - (level / 10) * (baseAlphaStrong - 0.08));

    // Frosted strength mapping: 使用指数曲线让低档位（1-3）更明显
    // level 1 → 8px, level 5 → 18px, level 10 → 28px
    const blurPx = Math.max(0, Math.round(Math.pow(level / 10, 0.7) * 28));

    const surfaceVars = {
        '--card-bg': `rgba(${r}, ${g}, ${b}, ${cardAlpha})`,
        '--glass-bg': `rgba(${r}, ${g}, ${b}, ${glassAlpha})`,
        '--glass-bg-strong': `rgba(${r}, ${g}, ${b}, ${strongAlpha})`,
        '--glass-blur': `${blurPx}px`,
        '--container-blur': `${blurPx}px`
    };

    Object.entries(surfaceVars).forEach(([name, value]) => {
        root.style.setProperty(name, value);
        if (body) body.style.setProperty(name, value);
    });

    // Reset container's styling to ensure full transparent fullscreen shell
    const container = document.querySelector('.container');
    if (container) {
        container.style.background = 'transparent';
        container.style.backdropFilter = 'none';
        container.style.webkitBackdropFilter = 'none';
        container.style.borderColor = 'transparent';
        container.style.boxShadow = 'none';
    }
}
