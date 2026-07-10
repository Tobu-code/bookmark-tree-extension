// --- Constants ---
const STORAGE_KEY_NEW_TAB = 'settings_open_new_tab';
const STORAGE_KEY_THEME = 'settings_theme';
const STORAGE_KEY_ICON_STYLE = 'settings_icon_style';
const STORAGE_KEY_BG_IMAGE = 'settings_bg_image';
const STORAGE_KEY_BG_BLUR = 'settings_bg_blur';
const STORAGE_KEY_CONTAINER_BLUR = 'settings_container_blur';
const STORAGE_KEY_LAYOUT_MODE = 'settings_layout_mode';

const STORAGE_KEY_HIDDEN_FOLDERS = 'hidden_folders';
const STORAGE_KEY_FLAT_DIR_EXPANDED = 'settings_flat_dir_expanded';
const STORAGE_KEY_TREE_EXPANDED = 'tree_expanded_folders';
const STORAGE_KEY_CARD_SIZES = 'settings_bookmark_card_sizes';
const STORAGE_KEY_CARD_PULSE = 'settings_bookmark_card_pulse';
const STORAGE_KEY_AI = 'bookmark_tree_selected_ai';
const STORAGE_KEY_AI_ORDER = 'bookmark_tree_ai_order';
const STORAGE_KEY_AI_CONFIG = 'bookmark_tree_ai_config_v2';
const LEGACY_FREQUENCY_STORAGE_KEYS = [
    'frequent_bookmarks_data',
    'settings_frequent_enabled',
    'settings_auto_sort_by_frequency',
    'folder_frequency_data'
];
const AI_DYNAMIC_RULE_START = 1000;
const AI_DYNAMIC_RULE_END = 1499;
// Request the largest Chrome favicon service size so card icons stay crisp when rendered at 24-32px.
const FAVICON_SIZE = 128;

function createBookmarkGlyph(label, bg = '#eef2ff', fg = '#3157d5') {
    const safeLabel = String(label || '?').slice(0, 3).toUpperCase();
    return `<svg width="28" height="28" viewBox="0 0 28 28" role="img" aria-label="${safeLabel}" xmlns="http://www.w3.org/2000/svg" draggable="false"><rect width="28" height="28" rx="9" fill="${bg}"></rect><text x="14" y="17.5" text-anchor="middle" fill="${fg}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9.5" font-weight="850">${safeLabel}</text></svg>`;
}

const BOOKMARK_ICON_OVERRIDES = Object.freeze([
    { hosts: ['chatgpt.com', 'openai.com'], path: 'icons/ai/chatgpt.svg' },
    { hosts: ['claude.ai', 'anthropic.com'], path: 'icons/ai/anthropic.ico' },
    { hosts: ['gemini.google.com', 'aistudio.google.com', 'ai.google.dev'], path: 'icons/ai/gemini.svg' },
    { hosts: ['deepseek.com', 'chat.deepseek.com'], path: 'icons/ai/deepseek.svg' },
    { hosts: ['kimi.moonshot.cn'], path: 'icons/ai/kimi.ico' },
    { hosts: ['doubao.com'], path: 'icons/ai/doubao.png' },
    { hosts: ['chatglm.cn', 'z.ai'], path: 'icons/ai/glm.svg' },
    { hosts: ['github.com'], svg: createBookmarkGlyph('GH', '#0f172a', '#ffffff') },
    { hosts: ['perplexity.ai'], svg: createBookmarkGlyph('PX', '#0f172a', '#ffffff') },
    { hosts: ['linux.do'], svg: createBookmarkGlyph('LD', '#111827', '#f8fafc') },
    { hosts: ['v2ex.com'], svg: createBookmarkGlyph('V2', '#f3f4f6', '#374151') },
    { hosts: ['z-lib.io', 'z-library.sk', 'z-library.se', 'singlelogin.re'], svg: createBookmarkGlyph('Z', '#f8fafc', '#475569') }
]);

function createLocalAiIcon(label, bg = '#eef2ff', fg = '#4f46e5') {
    const safeLabel = escapeHtml(String(label || 'AI').slice(0, 2).toUpperCase());
    return `<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="${safeLabel}" xmlns="http://www.w3.org/2000/svg" draggable="false"><rect width="24" height="24" rx="8" fill="${bg}"></rect><text x="12" y="15.5" text-anchor="middle" fill="${fg}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" font-weight="800">${safeLabel}</text></svg>`;
}

function createAiIconImage(src, alt) {
    return `<img src="${src}" width="24" height="24" alt="${escapeHtml(alt)}" draggable="false">`;
}

function normalizeAiProviderIcon(icon, fallbackName) {
    const value = String(icon || '').trim();
    if (value && !/<img\b/i.test(value)) return value;
    if (/<img\b/i.test(value) && /\bsrc=(["'])icons\/ai\/[^"']+\1/i.test(value)) return value;
    return createLocalAiIcon(fallbackName);
}

const BUILTIN_AI_PROVIDERS = Object.freeze([
    {
        id: 'google',
        name: 'Google',
        url: 'https://www.google.com/search?udm=50&aep=11',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/google.ico', 'Google')
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chatgpt.com/',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/chatgpt.svg', 'ChatGPT')
    },
    {
        id: 'glm',
        name: 'GLM',
        url: 'https://chatglm.cn/',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/glm.svg', 'GLM')
    },
    {
        id: 'qwen',
        name: 'Qwen',
        url: 'https://chat.qwen.ai/',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/qwen.png', 'Qwen')
    },
    {
        id: 'kimi',
        name: 'Kimi',
        url: 'https://kimi.moonshot.cn/',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/kimi.ico', 'Kimi')
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        url: 'https://chat.deepseek.com/',
        enabled: true,
        builtIn: true,
        icon: createAiIconImage('icons/ai/deepseek.svg', 'DeepSeek')
    }
]);
const BUILTIN_AI_PROVIDER_MAP = new Map(BUILTIN_AI_PROVIDERS.map((provider) => [provider.id, provider]));

// --- State and Constants ---
let dragSrcEl = null;
let OPEN_IN_NEW_TAB = true;
let CURRENT_ICON_STYLE = 'default';
let CURRENT_BG_IMAGE = null;
let CURRENT_BG_BLUR = 0;
let CURRENT_CONTAINER_BLUR = 0;
let LAYOUT_MODE = 'tree';

let HIDDEN_FOLDERS = [];
let SHOW_HIDDEN_FOLDERS = false;
let FLAT_DIR_EXPANDED = false;
let TREE_EXPANDED_FOLDERS = new Set(['1']);
let DRAG_HIGHLIGHTED_ELEMENTS = new Set();
let BOOKMARK_TREE_CACHE = null;
let BOOKMARK_CARD_SIZES = {};
let BOOKMARK_CARD_PULSE = {};
let BOOKMARK_SEARCH_INDEX = [];
let BOOKMARK_SEARCH_BUCKETS = new Map();
let AI_SIDEBAR_CONTROLLER = null;
let LAYOUT_SWITCH_TIMER = null;

function storageGet(keys) {
    return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function storageSet(payload) {
    return new Promise((resolve) => chrome.storage.local.set(payload, resolve));
}

// --- IndexedDB helpers for background image (Fix #16: bypass 8MB chrome.storage limit) ---
const BG_IDB_DB_NAME = 'bookmark_tree_bg';
const BG_IDB_STORE = 'bg_store';
const BG_IDB_KEY = 'bg_image';

function openBgDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(BG_IDB_DB_NAME, 1);
        req.onupgradeneeded = (e) => {
            e.target.result.createObjectStore(BG_IDB_STORE);
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

async function bgIdbGet() {
    try {
        const db = await openBgDB();
        return new Promise((resolve) => {
            const tx = db.transaction(BG_IDB_STORE, 'readonly');
            const req = tx.objectStore(BG_IDB_STORE).get(BG_IDB_KEY);
            req.onsuccess = (e) => resolve(e.target.result ?? null);
            req.onerror = () => resolve(null);
        });
    } catch { return null; }
}

async function bgIdbSet(dataUrl) {
    try {
        const db = await openBgDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(BG_IDB_STORE, 'readwrite');
            tx.objectStore(BG_IDB_STORE).put(dataUrl, BG_IDB_KEY);
            tx.oncomplete = () => resolve(true);
            tx.onerror = (e) => reject(e.target.error);
        });
    } catch (e) { return false; }
}

async function bgIdbRemove() {
    try {
        const db = await openBgDB();
        return new Promise((resolve) => {
            const tx = db.transaction(BG_IDB_STORE, 'readwrite');
            tx.objectStore(BG_IDB_STORE).delete(BG_IDB_KEY);
            tx.oncomplete = () => resolve();
        });
    } catch { /* ignore */ }
}



function getDynamicRules() {
    return new Promise((resolve) => chrome.declarativeNetRequest.getDynamicRules(resolve));
}

function updateDynamicRules(options) {
    return new Promise((resolve, reject) => {
        chrome.declarativeNetRequest.updateDynamicRules(options, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve();
        });
    });
}

function cloneAiProvider(provider) {
    return { ...provider };
}

function getBuiltinAiProviders() {
    return BUILTIN_AI_PROVIDERS.map(cloneAiProvider);
}

function sanitizeAiName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').slice(0, 24);
}

function normalizeAiUrl(rawUrl) {
    const input = String(rawUrl || '').trim();
    if (!input) return null;

    try {
        const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
        const url = new URL(candidate);
        if (!['http:', 'https:'].includes(url.protocol)) return null;
        url.hash = '';
        return url.toString();
    } catch (error) {
        return null;
    }
}

function createCustomAiId(name, url) {
    const seed = `${name}-${url}-${Date.now()}`;
    const slug = seed
        .toLowerCase()
        .replace(/https?:\/\//g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
    return `custom-${slug || 'ai'}`;
}

function serializeAiProvider(provider) {
        const payload = {
            id: provider.id,
            name: provider.name,
            url: provider.url,
            enabled: provider.enabled !== false,
            builtIn: !!provider.builtIn
        };
        if (provider.sidebarMode) {
            payload.sidebarMode = provider.sidebarMode;
        }
        if (!provider.builtIn) {
            payload.icon = provider.icon || '';
        }
        return payload;
}

function sanitizeCustomAiProvider(rawProvider) {
    if (!rawProvider || BUILTIN_AI_PROVIDER_MAP.has(rawProvider.id)) return null;
    if (rawProvider.builtIn) return null;
    const name = sanitizeAiName(rawProvider.name);
    const url = normalizeAiUrl(rawProvider.url);
    if (!name || !url) return null;

    return {
        id: String(rawProvider.id || createCustomAiId(name, url)),
        name,
        url,
        enabled: rawProvider.enabled !== false,
        builtIn: false,
        icon: normalizeAiProviderIcon(rawProvider.icon, name)
    };
}

function normalizeAiProviders(rawProviders, legacyOrder) {
    const builtins = getBuiltinAiProviders();
    const ordered = [];
    const seen = new Set();

    const pushProvider = (provider) => {
        if (!provider || !provider.id || seen.has(provider.id)) return;
        ordered.push(provider);
        seen.add(provider.id);
    };

    if (Array.isArray(rawProviders) && rawProviders.length) {
        rawProviders.forEach((item) => {
            if (BUILTIN_AI_PROVIDER_MAP.has(item?.id)) {
                const builtin = cloneAiProvider(BUILTIN_AI_PROVIDER_MAP.get(item.id));
                builtin.enabled = item.enabled !== false;
                if (item.sidebarMode) builtin.sidebarMode = item.sidebarMode;
                pushProvider(builtin);
                return;
            }

            pushProvider(sanitizeCustomAiProvider(item));
        });
    } else if (Array.isArray(legacyOrder) && legacyOrder.length) {
        const builtinById = new Map(builtins.map((provider) => [provider.id, provider]));
        legacyOrder.forEach((id) => {
            if (builtinById.has(id)) {
                pushProvider(cloneAiProvider(builtinById.get(id)));
                builtinById.delete(id);
            }
        });
    }

    builtins.forEach((provider) => pushProvider(cloneAiProvider(provider)));
    return ordered;
}

function findAiProviderById(providers, providerId) {
    return providers.find((provider) => provider.id === providerId) || null;
}

function getFirstEnabledAiProvider(providers) {
    return providers.find((provider) => provider.enabled !== false) || providers[0] || null;
}

async function loadAiPreferences() {
    const stored = await storageGet([STORAGE_KEY_AI_CONFIG, STORAGE_KEY_AI_ORDER, STORAGE_KEY_AI]);
    const providers = normalizeAiProviders(stored[STORAGE_KEY_AI_CONFIG], stored[STORAGE_KEY_AI_ORDER]);
    const selectedId = stored[STORAGE_KEY_AI]?.id;
    const selectedProvider = findAiProviderById(providers, selectedId);
    const activeProvider = selectedProvider?.enabled !== false ? selectedProvider : getFirstEnabledAiProvider(providers);

    return {
        providers,
        selectedId: activeProvider?.id || null
    };
}

async function persistAiProviders(providers) {
    const normalizedProviders = normalizeAiProviders(providers);
    await storageSet({
        [STORAGE_KEY_AI_CONFIG]: normalizedProviders.map(serializeAiProvider),
        [STORAGE_KEY_AI_ORDER]: normalizedProviders.map((provider) => provider.id)
    });
    return normalizedProviders;
}

async function persistSelectedAi(provider) {
    if (!provider) return;
    await storageSet({
        [STORAGE_KEY_AI]: {
            id: provider.id,
            name: provider.name,
            url: provider.url
        }
    });
}

function getAiOriginPattern(urlString) {
    const url = new URL(urlString);
    return `${url.origin}/*`;
}

function buildDynamicAiRule(ruleId, provider) {
    const url = new URL(provider.url);
    const responseHeaders = [
        { header: 'X-Frame-Options', operation: 'remove' },
        { header: 'Content-Security-Policy', operation: 'remove' },
        { header: 'Content-Security-Policy-Report-Only', operation: 'remove' },
        { header: 'Cross-Origin-Opener-Policy', operation: 'remove' },
        { header: 'Cross-Origin-Embedder-Policy', operation: 'remove' },
        { header: 'Cross-Origin-Resource-Policy', operation: 'remove' }
    ];

    return {
        id: ruleId,
        priority: 1,
        action: {
            type: 'modifyHeaders',
            responseHeaders
        },
        condition: {
            urlFilter: `${url.origin}/*`,
            resourceTypes: ['sub_frame', 'xmlhttprequest', 'script', 'image', 'font', 'stylesheet']
        }
    };
}

async function syncDynamicAiRules(providers) {
    const dynamicProviders = providers
        .filter((provider) => provider.enabled !== false)
        .slice(0, AI_DYNAMIC_RULE_END - AI_DYNAMIC_RULE_START + 1);

    const existingRules = await getDynamicRules();
    const managedRuleIds = existingRules
        .filter((rule) => rule.id >= AI_DYNAMIC_RULE_START && rule.id <= AI_DYNAMIC_RULE_END)
        .map((rule) => rule.id);

    const newRules = dynamicProviders.map((provider, index) => buildDynamicAiRule(AI_DYNAMIC_RULE_START + index, provider));

    await updateDynamicRules({
        removeRuleIds: managedRuleIds,
        addRules: newRules
    });
}

function requestAiOriginPermission(urlString) {
    return new Promise((resolve) => {
        chrome.permissions.request({ origins: [getAiOriginPattern(urlString)] }, (granted) => {
            resolve(Boolean(granted));
        });
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

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

function buildFolderBreadcrumb(container, displayTitle) {
    if (!container) return;

    const icon = document.createElement('span');
    icon.className = 'pane-breadcrumb-icon';
    icon.innerHTML = FOLDER_ICON_SVG;
    container.appendChild(icon);

    const text = document.createElement('span');
    text.className = 'pane-breadcrumb';
    const parts = String(displayTitle || '').split(' / ').filter(Boolean);

    if (parts.length <= 1) {
        text.textContent = displayTitle || '';
        container.appendChild(text);
        return;
    }

    parts.forEach((part, index) => {
        const segment = document.createElement('span');
        segment.className = index === parts.length - 1 ? 'pane-breadcrumb-current' : 'pane-breadcrumb-segment';
        segment.textContent = part;
        text.appendChild(segment);

        if (index < parts.length - 1) {
            const separator = document.createElement('span');
            separator.className = 'pane-breadcrumb-separator';
            separator.textContent = '›';
            text.appendChild(separator);
        }
    });

    container.appendChild(text);
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

function saveTreeExpandedState() {
    chrome.storage.local.set({ [STORAGE_KEY_TREE_EXPANDED]: Array.from(TREE_EXPANDED_FOLDERS) });
}

function renderBookmarksWithLayoutTransition() {
    const body = document.body;
    if (body.classList.contains('layout-switching')) return;

    // Restart class for repeated rapid toggles.
    body.classList.remove('layout-switching');
    void body.offsetWidth; // force reflow to restart animation
    body.classList.add('layout-switching');

    renderBookmarksFromCache();

    // Fix #8: use transitionend instead of fixed setTimeout for robustness
    const removeClass = () => body.classList.remove('layout-switching');

    let guard = null;
    const onEnd = (e) => {
        if (e && e.target !== body) return; // ignore child transitions
        clearTimeout(guard);
        body.removeEventListener('transitionend', onEnd);
        removeClass();
    };

    body.addEventListener('transitionend', onEnd, { once: true });
    // Fallback: ensure class is removed even if transitionend doesn't fire
    guard = setTimeout(() => {
        body.removeEventListener('transitionend', onEnd);
        removeClass();
    }, 350);
}

function cleanupLegacyFrequencyStorage() {
    chrome.storage.local.remove(LEGACY_FREQUENCY_STORAGE_KEYS);
}

function debounce(fn, delayMs) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delayMs);
    };
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
            STORAGE_KEY_LAYOUT_MODE, STORAGE_KEY_HIDDEN_FOLDERS,
            STORAGE_KEY_FLAT_DIR_EXPANDED, STORAGE_KEY_TREE_EXPANDED,
            STORAGE_KEY_AI, STORAGE_KEY_AI_ORDER, STORAGE_KEY_AI_CONFIG,
            STORAGE_KEY_CARD_SIZES, STORAGE_KEY_CARD_PULSE
        ]),
        getBookmarks()
    ]);
    setBookmarkTreeCache(bookmarkTree);

    // 3. Apply Settings Global State
    if (settings[STORAGE_KEY_NEW_TAB] !== undefined) OPEN_IN_NEW_TAB = settings[STORAGE_KEY_NEW_TAB];
    else OPEN_IN_NEW_TAB = true; // Default

    if (settings[STORAGE_KEY_ICON_STYLE]) CURRENT_ICON_STYLE = settings[STORAGE_KEY_ICON_STYLE];

    // Fix #16: Load background image from IndexedDB (with legacy migration from chrome.storage.local)
    let bgFromIdb = await bgIdbGet();
    if (!bgFromIdb && settings[STORAGE_KEY_BG_IMAGE]) {
        // Migrate from legacy chrome.storage.local → IndexedDB
        bgFromIdb = settings[STORAGE_KEY_BG_IMAGE];
        bgIdbSet(bgFromIdb).then(() => chrome.storage.local.remove(STORAGE_KEY_BG_IMAGE));
    }
    if (bgFromIdb) CURRENT_BG_IMAGE = bgFromIdb;

    if (settings[STORAGE_KEY_BG_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_BG_BLUR]);
        CURRENT_BG_BLUR = level * 5;
    }

    if (settings[STORAGE_KEY_CONTAINER_BLUR] !== undefined) {
        const level = parseInt(settings[STORAGE_KEY_CONTAINER_BLUR]);
        CURRENT_CONTAINER_BLUR = level;
    }

    LAYOUT_MODE = 'flat';



    if (settings[STORAGE_KEY_HIDDEN_FOLDERS]) HIDDEN_FOLDERS = settings[STORAGE_KEY_HIDDEN_FOLDERS];
    else HIDDEN_FOLDERS = [];

    if (settings[STORAGE_KEY_FLAT_DIR_EXPANDED] !== undefined) {
        FLAT_DIR_EXPANDED = !!settings[STORAGE_KEY_FLAT_DIR_EXPANDED];
    } else {
        FLAT_DIR_EXPANDED = false;
    }

    if (Array.isArray(settings[STORAGE_KEY_TREE_EXPANDED])) {
        TREE_EXPANDED_FOLDERS = new Set(settings[STORAGE_KEY_TREE_EXPANDED]);
    }

    if (settings[STORAGE_KEY_CARD_SIZES]) {
        BOOKMARK_CARD_SIZES = settings[STORAGE_KEY_CARD_SIZES];
    } else {
        BOOKMARK_CARD_SIZES = {};
    }

    if (settings[STORAGE_KEY_CARD_PULSE]) {
        BOOKMARK_CARD_PULSE = settings[STORAGE_KEY_CARD_PULSE];
    } else {
        BOOKMARK_CARD_PULSE = {};
    }

    // 4. Init Settings UI (Bindings)
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

    // 8. Reveal Page
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('loaded');
        });
    });
});

// Fix #12: Preload with timeout protection — prevents blocking init on slow/broken images
function preloadImage(url, timeoutMs = 5000) {
    return new Promise((resolve) => {
        if (!url) { resolve(); return; }

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            clearTimeout(guard);
            resolve();
        };

        // Timeout guard to unblock init if image hangs
        const guard = setTimeout(finish, timeoutMs);

        const img = new Image();
        img.src = url;

        // Use decode() if available to ensure image is GPU-ready before display
        if ('decode' in img) {
            img.decode().then(finish).catch(finish);
        } else {
            if (img.complete) {
                finish();
            } else {
                img.onload = finish;
                img.onerror = finish;
            }
        }
    });
}
