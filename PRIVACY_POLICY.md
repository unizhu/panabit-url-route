# Privacy Policy for Panabit Deep Linker (Pro)

**Last Updated:** December 9, 2025

This Privacy Policy describes how **Panabit Deep Linker (Pro)** ("we", "us", or "our") collects, uses, and discloses information, and what choices you have with respect to the information.

## 1. Information We Collect

### User-Configured Data
We collect and store the URLs (IP addresses or domains) that you explicitly add to the extension via the popup interface. This is necessary for the extension to know which pages to enhance with deep linking capabilities.

### Storage
This data is stored locally on your device and synchronized across your signed-in Chrome browsers using Chrome's native `storage.sync` API.

## 2. How We Use and Share Information

*   **Functionality Only:** The URLs you configured are used solely to register content scripts via the `chrome.scripting` API. This allows the extension to inject only into the pages you have authorized.
*   **No External Transmission:** We gave strictly **NO** external servers. The data you enter never leaves your browser environment (except for Chrome's own encrypted sync feature if enabled).
*   **No Tracking:** We do not track your browsing history, clicks, or any other personal usage data.

## 3. Permissions

The extension requests the following permissions for specific functional purposes:

*   **`storage`**: Required to save your list of monitored Panabit URLs.
*   **`scripting`**: Required to inject the navigation logic (deep linking) into the specific pages you added.
*   **`host_permissions` (`<all_urls>`)**: Required to allow you to add *any* arbitrary IP address or domain (internal or public) as a target without us needing to update the extension code for every possible IP. We effectively limit this permission by only acting on the URLs you manually add.

## 4. Contact Us

If you have any questions about this Privacy Policy, please contact the developer via the support tab on the Chrome Web Store listing.
