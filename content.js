console.log('[ClearMark] content script loaded');

function removeWatermark() {
    // Try several likely selectors
    const selectors = [
        '.watermark',
        '#watermark',
        '[class*="watermark"]',
        '[id*="watermark"]'
    ];

    for (const sel of selectors) {
        document.querySelectorAll(sel).forEach(el => {
            if (el.style.display !== 'none') {
                el.style.display = 'none';
                console.log('[ClearMark] hid element matching', sel, el);
                chrome.storage.sync.set({ watermarkHidden: true });
            }
        });
    }
}

function handleMutations() {
    removeWatermark();
}

function start() {
    if (!document.body) {
        console.warn('[ClearMark] no document.body yet');
        return;
    }
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    removeWatermark(); // initial run
}

if (document.body) {
    start();
} else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
}