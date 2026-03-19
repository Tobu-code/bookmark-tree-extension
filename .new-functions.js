// Performance optimization: Multi-iframe caching for AI sidebar
// This file contains the updated functions for the multi-iframe implementation

function preloadIframe(aiId) {
    const iframe = iframes[aiId];
    if (iframe && !loadedIframes.has(aiId)) {
        iframe.src = aiUrls[aiId];
        loadedIframes.add(aiId);

        // Add load event listener
        iframe.addEventListener('load', () => {
            iframe.classList.add('loaded');
        });
    }
}

function switchToAi(aiId) {
    // Hide all iframes
    Object.values(iframes).forEach(iframe => {
        if (iframe) iframe.classList.remove('active');
    });

    // Show target iframe
    const targetIframe = iframes[aiId];
    if (targetIframe) {
        targetIframe.classList.add('active');

        // Lazy load if not loaded yet
        if (!loadedIframes.has(aiId)) {
            preloadIframe(aiId);
        }
    }
}

function selectAi_new(tab) {
    const newId = tab.dataset.ai;
    if (newId === currentAi.id) return; // Skip if same

    currentAi = {
        id: newId,
        url: tab.dataset.url,
        icon: tab.dataset.icon,
        name: tab.dataset.name
    };

    // Save preference
    chrome.storage.local.set({ [STORAGE_KEY_AI]: currentAi });

    updateCurrentAiDisplay();
    updateActiveTab();

    // Switch iframe (no reload needed!)
    switchToAi(newId);
}

function openSidebar_new() {
    sidebar.classList.remove('hidden');
    requestAnimationFrame(() => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.remove('hidden');
        sidebarOverlay.classList.add('active');
    });

    updateCurrentAiDisplay();

    // Switch to current AI (will lazy load if needed)
    switchToAi(currentAi.id);
}
