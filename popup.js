const SCRIPT_ID = 'panabit-linker-script';

document.addEventListener('DOMContentLoaded', () => {
    loadUrls();
    document.getElementById('addBtn').addEventListener('click', addUrl);
});

// 1. Load URLs from storage and display them
async function loadUrls() {
    const data = await chrome.storage.sync.get('panabitUrls');
    const urls = data.panabitUrls || [];
    renderList(urls);
}

// 2. Add a new URL
async function addUrl() {
    const input = document.getElementById('urlInput');
    let rawUrl = input.value.trim();

    if (!rawUrl) return;

    // Clean up input to make it a match pattern
    // If user types "192.168.3.200", we make it "*://192.168.3.200/*"
    if (!rawUrl.includes('://')) {
        rawUrl = `*://${rawUrl}/*`;
    } else if (!rawUrl.endsWith('*')) {
        // Ensure it ends with wildcard so it matches subpages
        rawUrl = rawUrl.endsWith('/') ? `${rawUrl}*` : `${rawUrl}/*`;
    }

    const data = await chrome.storage.sync.get('panabitUrls');
    const urls = data.panabitUrls || [];

    if (!urls.includes(rawUrl)) {
        urls.push(rawUrl);
        await chrome.storage.sync.set({ panabitUrls: urls });
        await updateScriptRegistration(urls);
        renderList(urls);
    }

    input.value = '';
}

// 3. Remove a URL
async function removeUrl(urlToRemove) {
    const data = await chrome.storage.sync.get('panabitUrls');
    let urls = data.panabitUrls || [];

    urls = urls.filter(u => u !== urlToRemove);

    await chrome.storage.sync.set({ panabitUrls: urls });
    await updateScriptRegistration(urls);
    renderList(urls);
}

// 4. Render the UI list
function renderList(urls) {
    const container = document.getElementById('targetList');
    container.innerHTML = '';

    if (urls.length === 0) {
        container.innerHTML = '<div style="color:#666; font-style:italic;">No active monitors.</div>';
        return;
    }

    urls.forEach(url => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>${url}</span> <span class="remove">X</span>`;
        div.querySelector('.remove').onclick = () => removeUrl(url);
        container.appendChild(div);
    });
}

// 5. CORE LOGIC: Register the content script dynamically
async function updateScriptRegistration(urls) {
    // If no URLs, we must unregister the script to stop it running anywhere
    if (urls.length === 0) {
        try {
            await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
        } catch (e) { /* ignore if not registered */ }
        return;
    }

    // Try to update existing script first
    try {
        await chrome.scripting.updateContentScripts([{
            id: SCRIPT_ID,
            matches: urls
        }]);
        console.log("Script updated with new URLs");
    } catch (err) {
        // If update failed (likely because it doesn't exist yet), register it new
        try {
            await chrome.scripting.registerContentScripts([{
                id: SCRIPT_ID,
                js: ['content.js'],
                matches: urls,
                runAt: 'document_end'
            }]);
            console.log("Script registered successfully");
        } catch (regErr) {
            console.error("Failed to register script:", regErr);
        }
    }
}