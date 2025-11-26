/**
 * Panabit Deep Linker
 * Selector based on: .paui-menu-title > .paui-menu-title-desc
 */

const MENU_ITEM_SELECTOR = '.paui-menu-title';
const TEXT_SELECTOR = '.paui-menu-title-desc';

// Helper: Convert menu text to a URL-friendly hash (e.g. "Flow Overview" -> "flow-overview")
function toSlug(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, '-').toLowerCase();
}

// 1. Logic to Attach Click Listeners
function attachListeners() {
    const items = document.querySelectorAll(MENU_ITEM_SELECTOR);

    items.forEach(item => {
        // Avoid double-attaching
        if (item.dataset.hasDeepLink) return;

        item.addEventListener('click', (e) => {
            // Find the text description element inside the clicked button
            const descEl = item.querySelector(TEXT_SELECTOR);
            if (descEl) {
                const slug = toSlug(descEl.innerText);
                // Update URL bar without reloading
                history.pushState(null, null, `#${slug}`);
            }
        });

        item.dataset.hasDeepLink = "true";
    });
}

// 2. Logic to Restore State (Click the menu item matches the URL)
function restoreState() {
    const hash = window.location.hash.substring(1); // Remove '#'
    if (!hash) return;

    // We use a small interval because Panabit loads menus dynamically via JS
    const checkExist = setInterval(function () {
        const items = document.querySelectorAll(MENU_ITEM_SELECTOR);

        if (items.length > 0) {
            let found = false;
            for (let item of items) {
                const descEl = item.querySelector(TEXT_SELECTOR);
                if (descEl && toSlug(descEl.innerText) === decodeURIComponent(hash)) {

                    // Found it! Check if we need to expand a parent first
                    // (Optional: Add logic here if submenus are hidden)

                    console.log(`[Panabit Linker] Restoring view: ${hash}`);
                    item.click();
                    found = true;
                    clearInterval(checkExist); // Stop checking
                    break;
                }
            }

            // Stop checking after 10 seconds if nothing found to save memory
            // setTimeout(() => clearInterval(checkExist), 10000); 
        }
    }, 500); // Check every 500ms
}

// 3. Initialize using MutationObserver
// This is necessary because Panabit uses LayUI which renders elements after page load
const observer = new MutationObserver((mutations) => {
    attachListeners();
});

// Start observing the document body for changes (when menu loads)
observer.observe(document.body, { childList: true, subtree: true });

// Attempt restoration on initial load
window.addEventListener('load', restoreState);
// Also try immediately in case DOM is already ready
restoreState();