const SCRIPT_ID = 'panabit-linker-script';

document.addEventListener('DOMContentLoaded', () => {
    loadUrls();
    document.getElementById('addBtn').addEventListener('click', addUrl);
});

async function loadUrls() {
    const data = await chrome.storage.sync.get('panabitUrls');
    const urls = data.panabitUrls || [];
    renderList(urls);
}

async function addUrl() {
    const input = document.getElementById('urlInput');
    let rawUrl = input.value.trim();

    if (!rawUrl) return;

    if (!rawUrl.includes('://')) {
        rawUrl = `*://${rawUrl}/*`;
    } else if (!rawUrl.endsWith('*')) {
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

async function removeUrl(urlToRemove) {
    const data = await chrome.storage.sync.get('panabitUrls');
    let urls = data.panabitUrls || [];
    urls = urls.filter(u => u !== urlToRemove);
    await chrome.storage.sync.set({ panabitUrls: urls });
    await updateScriptRegistration(urls);
    renderList(urls);
}

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

// CORE FIX IS HERE: allFrames: true
async function updateScriptRegistration(urls) {
    if (urls.length === 0) {
        try {
            await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
        } catch (e) { /* ignore */ }
        return;
    }

    try {
        // Try to update existing first
        await chrome.scripting.updateContentScripts([{
            id: SCRIPT_ID,
            matches: urls,
            allFrames: true // <--- IMPORTANT FIX
        }]);
        console.log("Script updated");
    } catch (err) {
        // If not exists, register new
        try {
            await chrome.scripting.registerContentScripts([{
                id: SCRIPT_ID,
                js: ['content.js'],
                matches: urls,
                runAt: 'document_end',
                allFrames: true // <--- IMPORTANT FIX
            }]);
            console.log("Script registered");
        } catch (regErr) {
            console.error("Registration failed:", regErr);
        }
    }
}