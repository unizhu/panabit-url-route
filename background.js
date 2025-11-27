const SCRIPT_ID = 'panabit-linker-script';

// This runs every time the extension is installed, updated, or RELOADED
chrome.runtime.onInstalled.addListener(async () => {
    console.log("[Panabit Linker] Extension installed/reloaded. Restoring scripts...");
    await restoreRegistration();
});

// This runs when you open Chrome
chrome.runtime.onStartup.addListener(async () => {
    console.log("[Panabit Linker] Browser started. Checking scripts...");
    await restoreRegistration();
});

async function restoreRegistration() {
    try {
        // 1. Get the list of URLs from storage
        const data = await chrome.storage.sync.get('panabitUrls');
        const urls = data.panabitUrls || [];

        if (urls.length === 0) return;

        // 2. Re-register the content script
        // We use 'update' first to avoid "Duplicate script ID" errors
        try {
            // Try to remove it first to be clean
            await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
        } catch (e) { /* ignore if not exists */ }

        await chrome.scripting.registerContentScripts([{
            id: SCRIPT_ID,
            js: ['content.js'],
            matches: urls,
            runAt: 'document_end',
            allFrames: true // Ensure it works in iframes
        }]);

        console.log(`[Panabit Linker] Restored monitoring for: ${urls.join(', ')}`);

    } catch (err) {
        console.error("[Panabit Linker] Failed to restore scripts:", err);
    }
}