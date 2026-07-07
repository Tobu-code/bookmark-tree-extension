/**
 * Get cached poetry synchronously
 */
function getCachedPoetry() {
    const CACHE_KEY = 'poetry_cache';
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            const { data, cacheDate } = JSON.parse(cached);
            const today = new Date().toDateString();
            if (cacheDate === today) {
                return data;
            }
        } catch (e) {
            console.warn('Poetry cache parse error:', e);
        }
    }
    return null;
}

/**
 * Fetch and cache new poetry
 */
async function fetchPoetry() {
    const CACHE_KEY = 'poetry_cache';

    // Fetch new poetry
    try {
        const response = await fetch('https://poetry.palemoky.com/api/poems/random?lang=zh-Hans', {
            headers: { accept: 'application/json' }
        });
        const result = await response.json();

        // Cache the result with today's date
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: result.data,
            cacheDate: new Date().toDateString()
        }));

        return result.data;
    } catch (error) {
        console.error('Failed to fetch poetry:', error);
        // Return fallback poetry
        const fallback = {
            title: '静夜思',
            content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
            author: { name: '李白' },
            dynasty: { name: '唐' },
            type: { name: '五言绝句' }
        };

        // Also cache the fallback to avoid repeated failed requests
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: fallback,
            cacheDate: new Date().toDateString()
        }));

        return fallback;
    }
}

/**
 * Render poetry in the container
 */
function renderPoetry(container, poetryData) {
    if (!poetryData) return;

    const poetryContainer = document.createElement('div');
    poetryContainer.className = 'poetry-container';

    // Poetry content (right column in vertical layout)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'poetry-content';

    // Add each line as a separate element
    if (poetryData.content && Array.isArray(poetryData.content)) {
        poetryData.content.forEach(line => {
            const lineSpan = document.createElement('span');
            lineSpan.className = 'poetry-line';
            lineSpan.textContent = line;
            contentDiv.appendChild(lineSpan);
        });
    }

    // Poetry metadata (left column in vertical layout)
    const metaDiv = document.createElement('div');
    metaDiv.className = 'poetry-meta-column';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'poetry-title';
    titleDiv.textContent = poetryData.title || '';

    const metaInfo = document.createElement('div');
    metaInfo.className = 'poetry-meta';
    const dynasty = poetryData.dynasty?.name || '';
    const author = poetryData.author?.name || '';
    metaInfo.textContent = dynasty && author ? `${dynasty} · ${author}` : (author || dynasty);

    metaDiv.appendChild(titleDiv);
    metaDiv.appendChild(metaInfo);

    poetryContainer.appendChild(contentDiv);
    poetryContainer.appendChild(metaDiv);

    container.innerHTML = '';
    container.appendChild(poetryContainer);
}

/**
 * Initialize poetry display and time/date display
 */
async function initAmbientTime() {
    const poetryContainer = document.getElementById('ambient-time-container');
    const timeDateDisplay = document.getElementById('time-date-display');

    // Initialize poetry display
    if (poetryContainer) {
        // Try to get cached poetry first (synchronous, no flicker)
        const cachedPoetry = getCachedPoetry();

        if (cachedPoetry) {
            // Render immediately from cache
            renderPoetry(poetryContainer, cachedPoetry);
        } else {
            // Show placeholder only if no cache
            poetryContainer.innerHTML = `
                <div class="poetry-container">
                    <div class="poetry-meta-column">
                        <div class="poetry-title">加载中...</div>
                        <div class="poetry-meta">每日一诗</div>
                    </div>
                    <div class="poetry-content">
                        <span class="poetry-line">　</span>
                        <span class="poetry-line">　</span>
                    </div>
                </div>
            `;

            // Fetch and render new poetry
            const poetryData = await fetchPoetry();
            renderPoetry(poetryContainer, poetryData);
        }

        // Add idle detection for poetry container
        let idleTimer;
        const idleDelay = 3000;

        function resetIdleTimer() {
            poetryContainer.classList.remove('visible');
            poetryContainer.classList.add('dimmed');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                poetryContainer.classList.remove('dimmed');
                poetryContainer.classList.add('visible');
            }, idleDelay);
        }

        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('keydown', resetIdleTimer);
        window.addEventListener('click', resetIdleTimer);
        window.addEventListener('scroll', resetIdleTimer);

        idleTimer = setTimeout(() => {
            poetryContainer.classList.add('visible');
        }, idleDelay);
    }

    // Initialize time/date display above search box
    if (timeDateDisplay) {
        const WEEKDAYS_SHORT = ['日', '一', '二', '三', '四', '五', '六'];
        timeDateDisplay.innerHTML = `
            <span class="search-greeting-time"></span>
            <span class="search-greeting-separator">·</span>
            <span class="search-greeting-date"></span>
        `;
        const timeEl = timeDateDisplay.querySelector('.search-greeting-time');
        const dateEl = timeDateDisplay.querySelector('.search-greeting-date');

        function updateTimeDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const weekday = WEEKDAYS_SHORT[now.getDay()];

            timeEl.textContent = `${hours}:${minutes}`;
            dateEl.textContent = `${year}年${month}月${day}日 · 星期${weekday}`;

            // Schedule next update at the start of the next minute
            const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
            setTimeout(updateTimeDate, msUntilNextMinute);
        }

        updateTimeDate();
    }
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
    const cardEl = e.target.closest('.leaf-wrapper');
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
        const target = e.target.closest('.bookmarks-pane-grid .leaf-wrapper, .btn-magnetic, .tree-folder-item');
        
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
