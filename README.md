Here is a professional and comprehensive `README.md` for your extension. You can save this file in your `panabit-linker` folder.

-----

# Panabit Deep Link Enabler

A Chrome Extension (Manifest V3) that adds URL routing capabilities to Panabit Web Admin consoles. It resolves the "stateless" nature of the Panabit interface, allowing you to refresh the page or share links directly to specific menu items (e.g., Flow Overview, Network Settings) without being reset to the dashboard.

## Features

  * **Deep Linking:** Updates the browser URL hash (e.g., `/#flow-overview`) when navigation menus are clicked.
  * **State Restoration:** Automatically navigates back to the correct menu item when the page is refreshed.
  * **Dynamic Targeting:** Use the popup menu to add or remove multiple Panabit console IPs/Domains.
  * **LayUI Support:** specifically designed to handle Panabit's asynchronous (LayUI) menu rendering.
  * **Privacy Focused:** Only runs scripts on the specific IPs you configure.

## Project Structure

```text
panabit-linker/
├── manifest.json      # Extension configuration (Manifest V3)
├── content.js         # Core logic for URL hashing and menu clicking
├── background.js      # Service worker for initialization
├── popup.html         # User interface for adding monitor IPs
├── popup.js           # Logic for saving settings and registering scripts
└── README.md          # Documentation
```

## Installation

Since this is a custom tool, you will install it via Chrome's "Developer Mode":

1.  Download or clone this repository to a folder named `panabit-linker`.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the `panabit-linker` folder.

## Usage Guide

### 1\. Add a Monitor Target

By default, the extension does nothing until you tell it which IPs are Panabit consoles.

1.  Click the extension icon (puzzle piece) in your browser toolbar.
2.  In the input field, enter the IP address or domain of your Panabit console (e.g., `192.168.3.200`).
3.  Click **Add Monitor Target**.

### 2\. Verify Functionality

1.  Open your Panabit console in a new tab.
2.  Click on a menu item on the left (e.g., **流量概况** / Flow Overview).
3.  Observe the URL bar; it should change to something like `http://192.168.3.200/#流量概况`.
4.  **Refresh the page.** The extension should automatically click the menu and restore your view.

## Configuration Details

### Permissions

  * `storage`: Used to save your list of monitored IP addresses locally in your browser.
  * `scripting`: Used to dynamically inject the navigation logic only into the specific tabs you authorize.
  * `host_permissions`: Set to `<all_urls>` to allow you to add any local or public IP address via the popup without modifying code.

### CSS Selectors

The extension is hardcoded to work with the Panabit/LayUI structure:

  * Menu Item: `.paui-menu-title`
  * Menu Text: `.paui-menu-title-desc`

## Troubleshooting

**The URL updates, but refreshing doesn't load the view.**

  * Panabit loads menus slowly. The script attempts to find the menu for 5 seconds. If your network is very slow, the script might time out.

**I added an IP, but nothing happens.**

  * Try refreshing the Panabit tab manually once after adding the IP in the popup.
  * Ensure the URL in the browser matches what you added (e.g., if you use `https`, ensure you didn't just type the IP, or that the wildcard covers it).

**It doesn't work on sub-menus.**

  * Currently, the script is optimized for top-level menus. Deeply nested sub-menus inside collapsed parents might require additional logic to "expand" the parent first.

## License

MIT License - Feel free to modify and distribute for personal or commercial use.