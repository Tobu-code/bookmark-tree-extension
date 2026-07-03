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
const STORAGE_KEY_TREE_EXPANDED = 'tree_expanded_folders';
const STORAGE_KEY_CARD_SIZES = 'settings_bookmark_card_sizes';
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
// HiDPI-aware favicon size: request 2× or 3× resolution for crisp rendering on Retina/4K screens
const FAVICON_SIZE = Math.min(128, 32 * Math.ceil(window.devicePixelRatio || 1));
const BUILTIN_AI_PROVIDERS = Object.freeze([
    {
        id: 'google',
        name: 'Google',
        url: 'https://www.google.com/search?udm=50&aep=11',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=google.com&sz=${FAVICON_SIZE}" width="24" height="24" alt="Google" draggable="false">`
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chatgpt.com/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=chatgpt.com&sz=${FAVICON_SIZE}" width="24" height="24" alt="ChatGPT" draggable="false">`
    },
    {
        id: 'gemini',
        name: 'Gemini',
        url: 'https://gemini.google.com/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=gemini.google.com&sz=${FAVICON_SIZE}" width="24" height="24" alt="Gemini" draggable="false">`
    },
    {
        id: 'claude',
        name: 'Claude',
        url: 'https://claude.ai/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=${FAVICON_SIZE}" width="24" height="24" alt="Claude" draggable="false">`
    },
    {
        id: 'qwen',
        name: '通义千问',
        url: 'https://chat.qwen.ai/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=chat.qwen.ai&sz=${FAVICON_SIZE}" width="24" height="24" alt="通义千问" draggable="false">`
    },
    {
        id: 'doubao',
        name: '豆包',
        url: 'https://www.doubao.com/chat/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=doubao.com&sz=${FAVICON_SIZE}" width="24" height="24" alt="豆包" draggable="false">`
    },
    {
        id: 'kimi',
        name: 'Kimi',
        url: 'https://kimi.moonshot.cn/',
        enabled: true,
        builtIn: true,
        icon: `<img src="https://www.google.com/s2/favicons?domain=kimi.moonshot.cn&sz=${FAVICON_SIZE}" width="24" height="24" alt="Kimi" draggable="false">`
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        url: 'https://chat.deepseek.com/',
        enabled: true,
        builtIn: true,
        icon: `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" draggable="false"><path d="M26.5542 4.34393C26.2719 4.20592 26.1506 4.46928 25.9856 4.60268C25.9292 4.64581 25.8815 4.70216 25.8338 4.75391C25.4215 5.19438 24.9396 5.48361 24.3105 5.44911C23.3905 5.39736 22.605 5.68659 21.9104 6.39041C21.7626 5.52271 21.2721 5.00462 20.5258 4.67226C20.1353 4.49976 19.7403 4.32668 19.4666 3.95119C19.2757 3.68381 19.2234 3.38595 19.1279 3.09211C19.0669 2.91501 19.0066 2.73388 18.8024 2.7034C18.5811 2.6689 18.4942 2.85463 18.4074 3.00989C18.0601 3.6447 17.9255 4.34393 17.9388 5.05235C17.9692 6.64572 18.642 7.91478 19.9789 8.81756C20.1307 8.92106 20.1698 9.02457 20.1221 9.1758C20.0307 9.48688 19.9226 9.78876 19.8271 10.0998C19.7662 10.2982 19.6753 10.3419 19.4626 10.2551C18.7288 9.94862 18.0952 9.49493 17.5351 8.94694C16.5846 8.02749 15.7249 7.01258 14.6531 6.21791C14.4013 6.03218 14.1494 5.85967 13.8889 5.69522C12.7952 4.63316 14.0321 3.76086 14.3185 3.65736C14.618 3.54925 14.4225 3.17779 13.4548 3.18239C12.487 3.18642 11.6015 3.51073 10.4727 3.94256C10.3077 4.00754 10.1341 4.05469 9.95637 4.09379C8.93227 3.89944 7.86849 3.85631 6.75755 3.98167C4.66564 4.21455 2.99464 5.20358 1.7664 6.89183C0.290908 8.92106 -0.0564026 11.2269 0.368535 13.6316C0.815324 16.1663 2.10911 18.2645 4.09695 19.905C6.15838 21.6059 8.53263 22.4397 11.2415 22.2799C12.8867 22.185 14.7181 21.9648 16.7841 20.2161C17.3051 20.4755 17.8519 20.579 18.7587 20.6566C19.4574 20.7216 20.1302 20.6221 20.6511 20.514C21.4671 20.3415 21.4107 19.5859 21.1157 19.4473C18.7242 18.3335 19.2492 18.7866 18.772 18.4198C19.987 16.9822 21.8431 14.4269 22.4158 10.9474C22.4722 10.5633 22.5441 10.0222 22.5355 9.71114C22.5309 9.52138 22.5746 9.44778 22.7913 9.42593C23.3905 9.35693 23.9718 9.19305 24.506 8.89921C26.0557 8.05279 26.6808 6.6624 26.828 4.996C26.8498 4.74126 26.8234 4.47791 26.5542 4.34393ZM13.0511 19.3438C10.7332 17.5216 9.60906 16.9219 9.14502 16.9477C8.71089 16.9736 8.78909 17.4704 8.88454 17.7942C8.98459 18.1139 9.11455 18.3341 9.29683 18.6147C9.42276 18.8004 9.50959 19.0764 9.1709 19.284C8.42453 19.7458 7.12671 19.1288 7.06576 19.0983C5.55519 18.2087 4.29245 17.0346 3.40233 15.4285C2.54268 13.8829 2.04356 12.2245 1.96133 10.4546C1.93948 10.0274 2.06541 9.87617 2.49092 9.79854C3.05099 9.69504 3.62831 9.67319 4.1878 9.75541C6.55342 10.101 8.56713 11.1585 10.2554 12.8341C11.2191 13.788 11.9482 14.9283 12.6992 16.0421C13.4979 17.2249 14.357 18.3519 15.4512 19.276C15.8377 19.5997 16.1459 19.8458 16.4408 20.0275C15.5513 20.127 14.0666 20.1483 13.0511 19.345V19.3438ZM14.162 12.1981C14.162 12.0083 14.3139 11.8571 14.5048 11.8571C14.5479 11.8571 14.587 11.8657 14.6221 11.8784C14.6698 11.8956 14.7135 11.9215 14.748 11.9606C14.8089 12.021 14.8434 12.1072 14.8434 12.1981C14.8434 12.3878 14.6916 12.5391 14.5007 12.5391C14.3098 12.5391 14.162 12.3878 14.162 12.1981ZM17.6127 13.968C17.3913 14.0588 17.17 14.1365 16.9572 14.1451C16.6271 14.1623 16.2672 14.0284 16.0717 13.8645C15.7681 13.6098 15.5507 13.4671 15.4599 13.0227C15.4208 12.8329 15.4426 12.5391 15.4771 12.3706C15.5553 12.0078 15.4685 11.7749 15.2126 11.5633C15.0045 11.3908 14.7394 11.343 14.4484 11.343C14.3397 11.343 14.2403 11.2953 14.1661 11.2568C14.0447 11.1964 13.9447 11.0452 14.0401 10.8594C14.0706 10.7991 14.2184 10.6524 14.2529 10.6266C14.6479 10.4017 15.1034 10.4753 15.5248 10.6438C15.9153 10.8037 16.2108 11.0969 16.6358 11.5115C17.0699 12.0124 17.1481 12.1504 17.3954 12.5264C17.5909 12.8203 17.7686 13.1221 17.8905 13.4677C17.9641 13.6834 17.8686 13.8599 17.6127 13.968Z" fill="#3B71FE"></path></svg>`
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
let HOVER_DELAY = 100;
let LAYOUT_MODE = 'tree';

let HIDDEN_FOLDERS = [];
let SHOW_HIDDEN_FOLDERS = false;
let FLAT_DIR_EXPANDED = false;
let TREE_EXPANDED_FOLDERS = new Set(['1']);
let DRAG_HIGHLIGHTED_ELEMENTS = new Set();
let BOOKMARK_TREE_CACHE = null;
let BOOKMARK_CARD_SIZES = {};
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
    const name = sanitizeAiName(rawProvider.name);
    const url = normalizeAiUrl(rawProvider.url);
    if (!name || !url) return null;

    return {
        id: String(rawProvider.id || createCustomAiId(name, url)),
        name,
        url,
        enabled: rawProvider.enabled !== false,
        builtIn: false,
        icon: rawProvider.icon || '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.22"></circle><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>'
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

    return {
        id: ruleId,
        priority: 1,
        action: {
            type: 'modifyHeaders',
            responseHeaders: [
                { header: 'X-Frame-Options', operation: 'remove' },
                { header: 'Content-Security-Policy', operation: 'remove' },
                { header: 'Content-Security-Policy-Report-Only', operation: 'remove' },
                { header: 'Cross-Origin-Opener-Policy', operation: 'remove' },
                { header: 'Cross-Origin-Embedder-Policy', operation: 'remove' },
                { header: 'Cross-Origin-Resource-Policy', operation: 'remove' },
                { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' }
            ]
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
            STORAGE_KEY_HOVER_DELAY, STORAGE_KEY_LAYOUT_MODE, STORAGE_KEY_HIDDEN_FOLDERS,
            STORAGE_KEY_FLAT_DIR_EXPANDED, STORAGE_KEY_TREE_EXPANDED,
            STORAGE_KEY_AI, STORAGE_KEY_AI_ORDER, STORAGE_KEY_AI_CONFIG,
            STORAGE_KEY_CARD_SIZES
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

    if (Array.isArray(settings[STORAGE_KEY_TREE_EXPANDED])) {
        TREE_EXPANDED_FOLDERS = new Set(settings[STORAGE_KEY_TREE_EXPANDED]);
    }

    if (settings[STORAGE_KEY_CARD_SIZES]) {
        BOOKMARK_CARD_SIZES = settings[STORAGE_KEY_CARD_SIZES];
    } else {
        BOOKMARK_CARD_SIZES = {};
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

    // 7.5 Layout Toggle Button (outside settings for quick access)
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const layoutIconTree = document.getElementById('layout-icon-tree');
    const layoutIconFlat = document.getElementById('layout-icon-flat');
    
    function updateLayoutToggleIcon() {
        if (LAYOUT_MODE === 'flat') {
            layoutIconTree.classList.add('icon-hidden');
            layoutIconFlat.classList.remove('icon-hidden');
            layoutToggleBtn.title = '切换到树状模式';
        } else {
            layoutIconTree.classList.remove('icon-hidden');
            layoutIconFlat.classList.add('icon-hidden');
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
            const size = BOOKMARK_CARD_SIZES[subFolder.id] || 'default';
            folderCard.classList.remove('card--large', 'card--small', 'card--square');
            if (size === 'large') {
                folderCard.classList.add('card--large');
            } else if (size === 'small') {
                folderCard.classList.add('card--small');
            } else if (size === 'square') {
                folderCard.classList.add('card--square');
            }
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
        const editBtnHtml = `<button type="button" class="folder-action-btn edit-btn" title="编辑目录"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>`;
        actionsSpan.innerHTML = hideBtnHtml + editBtnHtml;

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

            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                editBookmark(node, folderItem);
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


// --- Bookmark Card / Item Helpers ---
function createBookmarkCard(folderNode) {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    
    // Detect if this folder contains any sub-folders dynamically
    const hasSubFolder = folderNode.children && folderNode.children.some(child => child.children);
    const savedSize = BOOKMARK_CARD_SIZES[folderNode.id] || 'default';
    
    card.classList.remove('card--large', 'card--small', 'card--square');
    if (savedSize === 'large') {
        card.classList.add('card--large');
    } else if (savedSize === 'small') {
        card.classList.add('card--small');
    } else if (savedSize === 'square') {
        card.classList.add('card--square');
    } else {
        if (hasSubFolder) {
            card.classList.add('card--large');
        } else {
            card.classList.add('card--small');
        }
    }

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

    // Header Actions Container (flex alignment for layout edit/expand buttons)
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'card-header-actions';

    // Edit Button for card (folder) custom layout
    const editCardBtn = document.createElement('button');
    editCardBtn.className = 'card-action-btn edit-btn';
    editCardBtn.title = '编辑目录';
    editCardBtn.setAttribute('aria-label', `编辑目录 ${folderNode.title}`);
    editCardBtn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    editCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editBookmark(folderNode, card);
    });
    actionsContainer.appendChild(editCardBtn);

    // Mac-style Expand Button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'card-action-btn expand-btn';
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
    actionsContainer.appendChild(expandBtn);

    header.appendChild(actionsContainer);
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
    const iconElement = createBookmarkIcon(iconData, 16);
    leaf.appendChild(iconElement);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'bookmark-label';
    labelSpan.style.fontWeight = 'bold';
    labelSpan.textContent = node.title;
    labelSpan.title = node.title || '';
    leaf.title = node.title || '';
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

    const size = BOOKMARK_CARD_SIZES[node.id] || 'default';
    wrapper.classList.remove('card--large', 'card--small', 'card--square');
    if (size === 'large') {
        wrapper.classList.add('card--large');
    } else if (size === 'small') {
        wrapper.classList.add('card--small');
    } else if (size === 'square') {
        wrapper.classList.add('card--square');
    }

    const a = document.createElement('a');
    a.className = 'leaf-node';
    a.href = node.url;
    if (OPEN_IN_NEW_TAB) {
        a.target = '_blank';
    }

    const iconData = getIconForBookmark(node.url);
    const iconElement = createBookmarkIcon(iconData, 16);
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
        a.appendChild(createBookmarkIcon(iconData, 16));

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
    const sizeSelect = document.getElementById('edit-bookmark-size');
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
    titleInput.classList.remove('input-error');
    urlInput.classList.remove('input-error');

    // Toggle URL field visibility for folders vs bookmarks
    if (isFolder) {
        if (urlField) urlField.classList.add('hidden');
        if (titleLabel) titleLabel.textContent = '编辑目录';
    } else {
        if (urlField) urlField.classList.remove('hidden');
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

    saveBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        const newUrl = urlInput.value.trim();
        const newSize = sizeSelect ? sizeSelect.value : 'default';

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

        if (Object.keys(changes).length === 0 && !sizeChanged) {
            closeDialog();
            return;
        }

        const proceedSave = () => {
            if (newSize === 'default') {
                delete BOOKMARK_CARD_SIZES[node.id];
            } else {
                BOOKMARK_CARD_SIZES[node.id] = newSize;
            }

            chrome.storage.local.set({ [STORAGE_KEY_CARD_SIZES]: BOOKMARK_CARD_SIZES }, () => {
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


// --- Folder Modal & Search ---
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

// renderTreeItemForModal now delegates to the unified factory with defaultExpanded=true
function renderTreeItemForModal(node) {
    return renderTreeNode(node, { defaultExpanded: true });
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

    if (!input || !label || !wheel || !overlay || !searchOverlay || !suggestions) {
        console.warn('Search critical elements missing, initialization skipped.');
        return;
    }

    let currentEngine = 'google';
    let currentUrl = 'https://www.google.com/search?q=';
    let selectedIndex = -1;
    let activeMatches = [];
    let inputDebounceTimer = null;

    // Show/hide picker with overlay
    function showPicker() {
        wheel.classList.remove('hidden');
        overlay.classList.remove('hidden');
        label.setAttribute('aria-expanded', 'true');
        updateActiveOption();
    }

    function hidePicker() {
        wheel.classList.add('hidden');
        overlay.classList.add('hidden');
        label.setAttribute('aria-expanded', 'false');
    }

    // Update active state
    function updateActiveOption() {
        options.forEach(opt => {
            const isActive = opt.dataset.engine === currentEngine;
            opt.classList.toggle('active', isActive);
            opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
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
        input.setAttribute('aria-expanded', 'true');
    }

    function hideSuggestions() {
        suggestions.classList.add('hidden');
        selectedIndex = -1;
        activeMatches = [];
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
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

            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'suggestion-item';
            item.id = `search-suggestion-${index}`;
            item.dataset.index = index;
            item.dataset.url = bookmark.url;
            item.setAttribute('role', 'option');

            // Icon (CSP-compliant)
            const iconDiv = document.createElement('div');
            iconDiv.className = 'suggestion-icon';
            try {
                const url = new URL(bookmark.url);
                const img = document.createElement('img');
                // Use extension's favicon service
                img.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(bookmark.url)}&size=${FAVICON_SIZE}`;
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
            const isSelected = index === selectedIndex;
            item.classList.toggle('selected', isSelected);
            item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
        if (selectedIndex >= 0 && items[selectedIndex]) {
            input.setAttribute('aria-activedescendant', items[selectedIndex].id);
        } else {
            input.removeAttribute('aria-activedescendant');
        }
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

    label.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showPicker();
            if (options[0]) options[0].focus();
        } else if (e.key === 'Escape') {
            hidePicker();
        }
    });



    // Tab key to switch engine (Universal)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const engineOptions = Array.from(options);
            const currentIndex = engineOptions.findIndex(opt => opt.dataset.engine === currentEngine);
            const nextIndex = (currentIndex + 1) % engineOptions.length;
            const nextOpt = engineOptions[nextIndex];
            
            if (nextOpt) {
                currentEngine = nextOpt.dataset.engine;
                currentUrl = nextOpt.dataset.url;
                label.textContent = nextOpt.textContent.trim();
                updateActiveOption();
                chrome.storage.local.set({ [STORAGE_KEY_ENGINE]: currentEngine });
            }
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
            input.focus();
        });

        opt.addEventListener('keydown', (e) => {
            const optionList = Array.from(options);
            const currentIndex = optionList.indexOf(opt);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                optionList[(currentIndex + 1) % optionList.length]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                optionList[(currentIndex - 1 + optionList.length) % optionList.length]?.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hidePicker();
                label.focus();
            }
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
            return {
                type: 'img',
                src: `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=${FAVICON_SIZE}`
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

    if (!modal || !btn || !close) {
        console.warn('Settings modal elements missing, UI initialization skipped.');
        return;
    }

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

    // Fix #16: Save to IndexedDB instead of chrome.storage.local to bypass 8MB limit
    async function saveBackgroundImage(dataUrl) {
        CURRENT_BG_IMAGE = dataUrl;
        updateBlurControlsState();
        applyBackground();
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
                        <span class="ai-provider-icon">${provider.icon || (() => { try { const d = new URL(provider.url).hostname; return `<img src="https://www.google.com/s2/favicons?domain=${d}&sz=${FAVICON_SIZE}" width="24" height="24" alt="${escapeHtml(provider.name)}" draggable="false">`; } catch { return ''; } })()}</span>
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
    } else {
        cleanupSystemThemeListener();
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
        document.body.classList.add('has-custom-bg');
    } else {
        bgLayer.style.backgroundImage = ''; // Fallback to CSS default
        document.body.classList.remove('has-custom-bg');
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
    const level = Math.max(0, Math.min(10, CURRENT_CONTAINER_BLUR));
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';

    // Base color values for rgb
    const r = isDark ? 24 : 255;
    const g = isDark ? 25 : 255;
    const b = isDark ? 28 : 255;

    // Card and Glass alpha interpolation (0.65/0.72 to 0.02, 0.70/0.76 to 0.02)
    const baseAlphaCard = isDark ? 0.65 : 0.72;
    const baseAlphaGlass = isDark ? 0.70 : 0.76;

    const cardAlpha = Math.max(0.02, baseAlphaCard - (level / 10) * (baseAlphaCard - 0.02));
    const glassAlpha = Math.max(0.02, baseAlphaGlass - (level / 10) * (baseAlphaGlass - 0.02));

    // Blur px mapping: level 0 maps to 24px, level 10 maps to 0px
    const blurPx = Math.max(0, Math.round(24 - (level / 10) * 24));

    // Set properties on root to globally control card/directory backgrounds
    root.style.setProperty('--card-bg', `rgba(${r}, ${g}, ${b}, ${cardAlpha})`);
    root.style.setProperty('--glass-bg', `rgba(${r}, ${g}, ${b}, ${glassAlpha})`);
    root.style.setProperty('--glass-blur', `${blurPx}px`);

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
        document.body.classList.add('ai-sidebar-open');
        sidebar.classList.remove('hidden');
        requestAnimationFrame(() => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
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
        setTimeout(() => {
            if (!sidebar.classList.contains('active')) {
                document.body.classList.remove('ai-sidebar-open');
                sidebar.classList.add('hidden');
                sidebarOverlay.classList.add('hidden');
                
                iframes.forEach((iframe, id) => {
                    unloadIframe(id);
                });
                
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

    if (tabsContainer) {
        tabsContainer.addEventListener('click', (event) => {
            const tab = event.target.closest('.ai-tab');
            if (!tab) return;
            selectAiById(tab.dataset.ai);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
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


// --- Shared time/greeting utilities (Fix #3: dedup GREETINGS/QUOTES) ---
const DAILY_QUOTES = Object.freeze([
    '慢慢来，比较快',
    '保持好奇心，探索未知',
    '做喜欢的事，见想见的人',
    '用心感受每一个当下',
    '简单生活，认真做事',
    '把每一天过成想要的样子',
    '保持热爱，奔赴山海',
    '今日事，今日毕'
]);

function getTimePrefix(hour = new Date().getHours()) {
    if (hour < 5) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
}

function getDailyGreeting() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return `${getTimePrefix()}，${DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]}`;
}

/**
 * Initialize ambient time display and idle detection
 */
function initAmbientTime() {
    const timeContainer = document.getElementById('ambient-time-container');
    if (!timeContainer) return;

    let idleTimer;
    const idleDelay = 3000;

    // Build static DOM once — only update textContent on tick (Fix #5)
    const clockEl = document.createElement('span');
    clockEl.className = 'ambient-time-clock';
    const infoGroup = document.createElement('div');
    infoGroup.className = 'ambient-time-info-group';
    const dateEl = document.createElement('span');
    dateEl.className = 'ambient-time-date';
    const greetingEl = document.createElement('span');
    greetingEl.className = 'ambient-time-greeting';
    infoGroup.appendChild(dateEl);
    infoGroup.appendChild(greetingEl);
    timeContainer.appendChild(clockEl);
    timeContainer.appendChild(infoGroup);

    const WEEKDAYS_SHORT = ['日', '一', '二', '三', '四', '五', '六'];

    function updateAmbientTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const weekday = WEEKDAYS_SHORT[now.getDay()];

        // textContent-only update: no DOM rebuild, no layout thrash (Fix #5)
        clockEl.textContent = `${hours}:${minutes}`;
        dateEl.textContent = `${year}年${month}月${day}日 · 星期${weekday}`;
        greetingEl.textContent = getDailyGreeting();

        // Precise next-minute scheduling (Fix #6 applied to ambient clock)
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout(updateAmbientTime, msUntilNextMinute);
    }

    function resetIdleTimer() {
        timeContainer.classList.remove('visible');
        timeContainer.classList.add('dimmed');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            timeContainer.classList.remove('dimmed');
            timeContainer.classList.add('visible');
        }, idleDelay);
    }

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    updateAmbientTime();

    idleTimer = setTimeout(() => {
        timeContainer.classList.add('visible');
    }, idleDelay);
}



// --- Dynamic indicator and card hover flow animations ---
function syncSidebarActiveIndicator() {
    updateActiveIndicator('.directory-pane-scroll', '.tree-folder-item.active');
    updateActiveIndicator('#bookmarks-tree', '.tree-folder-item.active');
}

function updateActiveIndicator(containerSelector, activeItemSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (containerSelector === '#bookmarks-tree' && container.classList.contains('layout-flat')) {
        const ind = container.querySelector('.sidebar-active-indicator');
        if (ind) ind.remove();
        return;
    }

    const activeItem = container.querySelector(activeItemSelector);
    let indicator = container.querySelector('.sidebar-active-indicator');

    if (!activeItem) {
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'scale3d(0.9, 0.9, 1)';
        }
        return;
    }

    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'sidebar-active-indicator';
        container.insertBefore(indicator, container.firstChild);
        void indicator.offsetWidth; // Force reflow
    }

    let top = 0;
    let left = 0;
    let current = activeItem;
    while (current && current !== container) {
        top += current.offsetTop;
        left += current.offsetLeft;
        current = current.offsetParent;
    }

    const width = activeItem.offsetWidth;
    const height = activeItem.offsetHeight;

    indicator.style.width = `${width}px`;
    indicator.style.height = `${height}px`;
    indicator.style.transform = `translate3d(${left}px, ${top}px, 0) scale3d(1, 1, 1)`;
    indicator.style.opacity = '1';
}

// Bind resize and scroll window events to recalculate indicator positions
window.addEventListener('resize', debounce(syncSidebarActiveIndicator, 80));

// Bind clicks globally to handle fluid shimmers and directory indicator shifts
document.addEventListener('click', (e) => {
    // 1. Fluid shimmers for bookmarks
    const cardEl = e.target.closest('.leaf-wrapper, .bookmark-card');
    if (cardEl) {
        cardEl.classList.remove('is-selected');
        void cardEl.offsetWidth; // Force animation reset
        cardEl.classList.add('is-selected');
        setTimeout(() => {
            cardEl.classList.remove('is-selected');
        }, 1400);
    }

    // 2. Directory sliding indicators
    if (e.target.closest('.tree-folder-item') || e.target.closest('.tree-folder-toggle')) {
        setTimeout(syncSidebarActiveIndicator, 50);
    }
});
