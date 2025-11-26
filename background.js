// On install, just clear any old state or ensure defaults
chrome.runtime.onInstalled.addListener(async () => {
    // Optional: You could set a default URL here if you wanted
    // const defaults = ["*://192.168.3.200/*"];
    // chrome.storage.sync.set({ panabitUrls: defaults });
});