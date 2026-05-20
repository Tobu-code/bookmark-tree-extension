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

/**
 * Initialize time display for Pure Mode (Fix #6: precise setTimeout scheduling)
 */
function initPureTime() {
    const timeDisplay = document.querySelector('.pure-time-display');
    if (!timeDisplay) return;

    const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    function updateTime() {
        const now = new Date();
        const weekday = WEEKDAYS[now.getDay()];
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeDisplay.textContent = `${weekday} · ${month}月${day}日 ${hours}:${minutes}`;

        // Precise scheduling: fire exactly at the next minute boundary
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout(updateTime, msUntilNextMinute);
    }

    updateTime();
}

/**
 * Initialize greeting text based on time of day (Fix #3: uses shared getDailyGreeting)
 */
function initGreeting() {
    const greeting = document.querySelector('.pure-greeting-text');
    if (!greeting) return;
    greeting.textContent = getDailyGreeting();
}

/**
 * Initialize keyboard shortcuts and dynamic footer hint for Pure Mode
 */
function initPureShortcuts() {
    const footerHint = document.querySelector('.pure-footer-hint');
    if (footerHint) {
        footerHint.textContent = '按 Enter 搜索 · Tab 切换引擎';
    }
}

// ========================================
// Pure Mode Memo
// ========================================

const STORAGE_KEY_MEMO = 'pure_memo_items';
const MEMO_CHUNK_SIZE = 15;

/**
 * Calculate how many memo items to display based on available vertical space.
 * Pure mode center block ≈ 420px (greeting + search + margins).
 * Each item ≈ 40px. Max cap at 8 to avoid crowding.
 */
function calcMemoInitialCount() {
    const availableH = Math.max(0, window.innerHeight - 480);
    return Math.max(3, Math.min(8, Math.floor(availableH / 40)));
}

/**
 * Initialize Pure Mode lightweight memo feature (inline, no popup).
 */
function initPureMemo() {
    const memoRoot     = document.getElementById('pure-memo');
    const list         = document.getElementById('pure-memo-list');
    const input        = document.getElementById('pure-memo-input');
    const ghostWrap    = document.getElementById('pure-memo-ghost-wrap');
    const cursorBlink  = document.getElementById('pure-memo-cursor-blink');
    const loadMoreWrap = document.getElementById('pure-memo-load-more-wrap');
    const loadMoreBtn  = document.getElementById('pure-memo-load-more-btn');
    const clearBtn     = document.getElementById('pure-memo-clear-btn');

    if (!memoRoot || !list || !input) return;

    let _items = [];        // full list, newest first
    let _renderedCount = 0; // how many DOM nodes currently rendered

    // ── Storage ──────────────────────────────────────────────
    async function loadItems() {
        const res = await storageGet([STORAGE_KEY_MEMO]);
        _items = Array.isArray(res[STORAGE_KEY_MEMO]) ? res[STORAGE_KEY_MEMO] : [];
        _renderedCount = calcMemoInitialCount();
        renderList();
    }

    async function saveItems() {
        await storageSet({ [STORAGE_KEY_MEMO]: _items });
    }

    // ── Render ───────────────────────────────────────────────
    function renderList() {
        list.innerHTML = '';

        const slice = _items.slice(0, _renderedCount);
        const frag = document.createDocumentFragment();
        slice.forEach(item => frag.appendChild(buildItemEl(item)));
        list.appendChild(frag);

        // "Load more" button
        loadMoreWrap.classList.toggle('hidden', _items.length <= _renderedCount);

        // "Clear" button — hide when empty
        clearBtn.style.visibility = _items.length === 0 ? 'hidden' : '';

        // Card border only when there are items
        memoRoot.classList.toggle('memo-has-items', _items.length > 0);
    }

    function buildItemEl(item) {
        const el = document.createElement('div');
        el.className = 'pure-memo-item';
        el.setAttribute('role', 'listitem');
        el.dataset.id = item.id;

        const timeStr = formatMemoTime(item.createdAt);
        el.innerHTML = `
            <button class="pure-memo-item-check" type="button" aria-label="完成并删除此备忘">
                <svg class="memo-check-svg" viewBox="0 0 10 8" width="10" height="8" fill="none"
                     stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="1 4 3.5 6.5 9 1"/>
                </svg>
            </button>
            <span class="pure-memo-item-text">${escapeHtml(item.text)}</span>
            <span class="pure-memo-item-time">${timeStr}</span>
            <button class="pure-memo-item-del" type="button" aria-label="删除此备忘">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>`;

        // Checkbox: check animation → delete
        el.querySelector('.pure-memo-item-check').addEventListener('click', (e) => {
            e.stopPropagation();
            const checkBtn = e.currentTarget;
            // 1. show checkmark + strikethrough
            checkBtn.classList.add('is-checking');
            el.classList.add('is-completing');
            // 2. fade out item
            setTimeout(() => {
                el.classList.add('is-removing');
                // 3. remove from data
                setTimeout(async () => {
                    _items = _items.filter(i => i.id !== item.id);
                    if (_renderedCount > _items.length) {
                        _renderedCount = Math.max(calcMemoInitialCount(), _items.length);
                    }
                    await saveItems();
                    renderList();
                }, 220);
            }, 320);
        });

        // X button: immediate delete
        el.querySelector('.pure-memo-item-del').addEventListener('click', (e) => {
            e.stopPropagation();
            el.classList.add('is-removing');
            setTimeout(async () => {
                _items = _items.filter(i => i.id !== item.id);
                if (_renderedCount > _items.length) {
                    _renderedCount = Math.max(calcMemoInitialCount(), _items.length);
                }
                await saveItems();
                renderList();
            }, 180);
        });

        return el;
    }

    // ── Add item ─────────────────────────────────────────────
    async function addItem() {
        const text = input.value.trim();
        if (!text) return;

        const newItem = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            text,
            createdAt: Date.now()
        };
        _items.unshift(newItem);

        if (_renderedCount < 1) _renderedCount = calcMemoInitialCount();

        // Clear input, keep focus for continuous entry
        input.value = '';
        input.focus();

        await saveItems();
        renderList();

        // Entrance animation on newest item
        const firstEl = list.firstElementChild;
        if (firstEl) {
            firstEl.classList.add('is-entering');
            requestAnimationFrame(() => firstEl.classList.remove('is-entering'));
        }
    }

    // ── Time formatting ───────────────────────────────────────
    function formatMemoTime(ts) {
        const diff = Date.now() - ts;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
        const d = new Date(ts);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) {
            return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return '昨天';
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    }

    // ── Cursor blink + hint control ───────────────────────────
    const inputHint = document.getElementById('pure-memo-input-hint');

    function setGhostVisible(visible) {
        if (cursorBlink) cursorBlink.classList.toggle('hidden', !visible);
        if (inputHint)   inputHint.classList.toggle('hidden', !visible);
    }

    if (cursorBlink) {
        // Hide ghost when focused (native cursor takes over)
        input.addEventListener('focus', () => setGhostVisible(false));
        // Show ghost when blurred and empty
        input.addEventListener('blur', () => {
            if (!input.value.trim()) setGhostVisible(true);
        });
        // Hide hint/cursor when typing, restore if cleared
        input.addEventListener('input', () => {
            setGhostVisible(input.value.length === 0);
        });
    }

    // Clicking ghost wrap area focuses the input
    if (ghostWrap) {
        ghostWrap.addEventListener('click', () => input.focus());
    }

    // ── Event Listeners ───────────────────────────────────────
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); addItem(); }
    });

    loadMoreBtn.addEventListener('click', () => {
        _renderedCount += MEMO_CHUNK_SIZE;
        renderList();
    });

    clearBtn.addEventListener('click', () => {
        if (_items.length === 0) return;
        showConfirmDialog('确定清空所有备忘？此操作无法撤销。', async () => {
            _items = [];
            _renderedCount = 0;
            await saveItems();
            renderList();
        });
    });

    loadItems();
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
