// --- UI Widgets ---
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

    // Greeting quotes pool
    const GREETINGS = [
        '慢慢来，比较快',
        '保持好奇心，探索未知',
        '做喜欢的事，见想见的人',
        '用心感受每一个当下',
        '简单生活，认真做事',
        '把每一天过成想要的样子',
        '保持热爱，奔赴山海',
        '今日事，今日毕'
    ];

    function getGreeting() {
        const hour = new Date().getHours();
        let prefix = '你好';
        if (hour < 5) prefix = '夜深了';
        else if (hour < 9) prefix = '早上好';
        else if (hour < 12) prefix = '上午好';
        else if (hour < 14) prefix = '中午好';
        else if (hour < 18) prefix = '下午好';
        else if (hour < 22) prefix = '晚上好';
        else prefix = '夜深了';
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const quote = GREETINGS[dayOfYear % GREETINGS.length];
        return `${prefix}，${quote}`;
    }

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
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];

        timeContainer.innerHTML = `
            <span class="ambient-time-clock">${hours}:${minutes}</span>
            <div class="ambient-time-info-group">
                <span class="ambient-time-date">${year}年${month}月${day}日 · 星期${weekday}</span>
                <span class="ambient-time-greeting">${getGreeting()}</span>
            </div>
        `;

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

/**
 * Initialize time display for Pure Mode
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
    }

    updateTime();
    setInterval(updateTime, 60000);
}

/**
 * Initialize greeting text based on time of day
 */
function initGreeting() {
    const greeting = document.querySelector('.pure-greeting-text');
    if (!greeting) return;

    const QUOTES = [
        '慢慢来，比较快',
        '保持好奇心，探索未知',
        '做喜欢的事，见想见的人',
        '用心感受每一个当下',
        '简单生活，认真做事',
        '把每一天过成想要的样子',
        '保持热爱，奔赴山海',
        '今日事，今日毕'
    ];

    const hour = new Date().getHours();
    let prefix = '你好';
    if (hour < 5) prefix = '夜深了';
    else if (hour < 9) prefix = '早上好';
    else if (hour < 12) prefix = '上午好';
    else if (hour < 14) prefix = '中午好';
    else if (hour < 18) prefix = '下午好';
    else if (hour < 22) prefix = '晚上好';
    else prefix = '夜深了';

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quote = QUOTES[dayOfYear % QUOTES.length];
    greeting.textContent = `${prefix}，${quote}`;
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
