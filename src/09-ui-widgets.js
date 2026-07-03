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

// --- Dynamic mouse magnetic physics and 3D Tilt Hover effects (Apple/Notion style) ---
function initMagneticHover() {
    let initialRect = null;
    let lastTarget = null;

    document.addEventListener('mousemove', (e) => {
        // Exclude nested .leaf-wrapper items inside .bookmark-card to prevent transform conflict
        const target = e.target.closest('.bookmarks-pane-grid .leaf-wrapper, .bookmark-card, .btn-magnetic, .tree-folder-item');
        
        if (!target) {
            const activeEl = document.querySelector('.is-magnetized');
            if (activeEl) {
                activeEl.style.transform = '';
                activeEl.style.removeProperty('--mouse-x');
                activeEl.style.removeProperty('--mouse-y');
                activeEl.classList.remove('is-magnetized');
            }
            initialRect = null;
            lastTarget = null;
            return;
        }

        const activeEl = document.querySelector('.is-magnetized');
        if (activeEl && activeEl !== target) {
            activeEl.style.transform = '';
            activeEl.style.removeProperty('--mouse-x');
            activeEl.style.removeProperty('--mouse-y');
            activeEl.classList.remove('is-magnetized');
        }

        target.classList.add('is-magnetized');
        
        // Cache pristine bounding box on initial entry to prevent coordinate feedback loop
        if (lastTarget !== target || !initialRect) {
            lastTarget = target;
            const prevTransform = target.style.transform;
            target.style.transform = '';
            initialRect = target.getBoundingClientRect();
            target.style.transform = prevTransform;
        }
        
        const rect = initialRect;
        const clientX = e.clientX;
        const clientY = e.clientY;
        
        // 1. Calculate relative coordinates in percentage for ::after radial-gradient shine sweep
        const mouseXPercent = ((clientX - rect.left) / rect.width) * 100;
        const mouseYPercent = ((clientY - rect.top) / rect.height) * 100;
        target.style.setProperty('--mouse-x', `${mouseXPercent}%`);
        target.style.setProperty('--mouse-y', `${mouseYPercent}%`);
        
        // 2. Calculate 3D perspective rotate angles & magnetic offsets
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);
        
        // Fine-tune dampening variables based on target element geometries
        let maxRotate = 8;
        let transFactor = 0.12;
        let scale = 1.02;
        
        if (target.classList.contains('tree-folder-item')) {
            maxRotate = 4;       // Long flat nodes use subtle tilt
            transFactor = 0.05;  // Subtle magnetic slide
            scale = 1.01;        // Slight zoom
        }
        
        const rotateX = -(dy / (rect.height / 2)) * maxRotate;
        const rotateY = (dx / (rect.width / 2)) * maxRotate;
        
        const tx = dx * transFactor;
        const ty = dy * transFactor;
        
        // Combine 3D rotations, translations, and micro scaling for a premium Bento-tilt feel
        target.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    });

    document.addEventListener('mouseleave', () => {
        const activeEl = document.querySelector('.is-magnetized');
        if (activeEl) {
            activeEl.style.transform = '';
            activeEl.style.removeProperty('--mouse-x');
            activeEl.style.removeProperty('--mouse-y');
            activeEl.classList.remove('is-magnetized');
        }
        initialRect = null;
        lastTarget = null;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticHover);
} else {
    initMagneticHover();
}
