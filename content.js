/**
 * Panabit Deep Linker (High-Latency & Capture Mode)
 */

const MENU_ITEM_SELECTOR = '.paui-menu-title';
const TEXT_SELECTOR = '.paui-menu-title-desc';

function toSlug(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, '-').toLowerCase();
}

function attachListeners() {
    const items = document.querySelectorAll(MENU_ITEM_SELECTOR);

    items.forEach(item => {
        // Prevent double-attachment
        if (item.dataset.hasDeepLink) return;

        // VISUAL DEBUG: Add a tiny red border so you KNOW script is running
        // item.style.borderLeft = "1px dashed blue";

        item.addEventListener('click', (e) => {
            const descEl = item.querySelector(TEXT_SELECTOR);
            if (descEl) {
                const slug = toSlug(descEl.innerText);
                console.log("[Panabit Linker] Clicked:", slug);
                try {
                    window.top.history.pushState(null, null, `#${slug}`);
                } catch (err) {
                    console.log("Cross-origin frame error:", err);
                }
            }
        }, true); // <--- The 'true' is the magic fix for UI frameworks

        item.dataset.hasDeepLink = "true";
    });
}

function restoreState() {
    let hash = '';
    try {
        hash = window.top.location.hash.substring(1);
    } catch (e) { return; }

    if (!hash) return;

    console.log("[Panabit Linker] Waiting for menu to appear...");

    // FIX: Increased timeout to 30 seconds for high latency
    let attempts = 0;
    const checkExist = setInterval(function () {
        attempts++;
        const items = document.querySelectorAll(MENU_ITEM_SELECTOR);

        if (items.length > 0) {
            for (let item of items) {
                const descEl = item.querySelector(TEXT_SELECTOR);
                // Decode URI component handles Chinese characters in URL
                if (descEl && toSlug(descEl.innerText) === decodeURIComponent(hash)) {
                    console.log(`[Panabit Linker] Restoring view: ${hash}`);
                    item.click();
                    clearInterval(checkExist);
                    return;
                }
            }
        }

        // Stop after 30 seconds (approx 60 attempts)
        if (attempts > 60) {
            console.log("[Panabit Linker] Timed out waiting for menu.");
            clearInterval(checkExist);
        }
    }, 500);
}

// Observe changes (LayUI renders dynamically)
const observer = new MutationObserver((mutations) => {
    attachListeners();
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });

// Attempt restore
window.addEventListener('load', restoreState);
// Also try immediately just in case
restoreState();