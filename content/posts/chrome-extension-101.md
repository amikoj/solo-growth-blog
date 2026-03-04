+++
title = "Chrome Extension V3: Building Your First Plugin (2026 Update)"
date = 2026-02-10T00:00:00Z
tags = ["chrome-extension", "javascript", "manifest-v3", "web-development"]
categories = ["dev-tutorials"]
series = "modern-web-dev"
description = "A step-by-step guide to creating a Chrome Extension using Manifest V3. Covers service workers, popup interaction, and debugging."
+++

Chrome Extensions are a powerful playground for developers. They solve specific problems right where users spend most of their time: the browser.

However, the ecosystem has shifted. Chrome now mandates **Manifest V3**, which introduces significant changes (like replacing background pages with [service workers]({{< ref "chrome-process-architecture.md" >}})).

In this guide, we'll build a simple **"Focus Mode"** extension that hides distracting elements on a page.

## Project Structure

A basic Chrome extension is just HTML, CSS, and JavaScript. Here is the file structure we will build:

```text
my-extension/
├── manifest.json      # The configuration file
├── popup.html         # The UI when you click the extension icon
├── popup.js           # Logic for the popup
├── content.js         # Script that runs on web pages
└── icons/
    └── icon.png
```

## Step 1: The Blueprint (`manifest.json`)

Create a folder for your project and add a `manifest.json`. This tells Chrome what your extension does and what permissions it needs.

```json
{
  "manifest_version": 3,
  "name": "Simple Focus Mode",
  "version": "1.0",
  "description": "Hides distracting elements on the current page.",
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon.png",
      "48": "icons/icon.png",
      "128": "icons/icon.png"
    }
  },
  "icons": {
    "16": "icons/icon.png",
    "48": "icons/icon.png",
    "128": "icons/icon.png"
  }
}
```

**Key Concepts:**
*   **`manifest_version: 3`**: Mandatory for modern extensions.
*   **`permissions`**: We ask for `activeTab` to manipulate the current tab and `scripting` to inject CSS/JS.
*   **`action`**: Defines the popup behavior.

## Step 2: The Popup UI (`popup.html`)

This is the interface users see when clicking the extension icon.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 200px; padding: 10px; font-family: sans-serif; }
    button { width: 100%; padding: 10px; background: #2563eb; color: white; border: none; cursor: pointer; }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <h3>Focus Mode</h3>
  <button id="toggleBtn">Hide Distractions</button>
  <script src="popup.js"></script>
</body>
</html>
```

## Step 3: The Logic (`popup.js`)

Here we handle the button click. We'll use the `chrome.scripting` API to execute code in the current tab.

```javascript
document.getElementById("toggleBtn").addEventListener("click", async () => {
  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute the function inside the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleDistractions,
  });
});

// This function is serialized and executed in the page context
function toggleDistractions() {
  const selectors = [
    'aside', 
    '.ads', 
    '.sidebar', 
    '#comments'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = el.style.display === 'none' ? '' : 'none';
    });
  });
  
  alert("Distractions toggled!");
}
```

## Step 4: Loading into Chrome

1.  Open Chrome and go to `chrome://extensions`.
2.  Enable **Developer mode** (top right toggle).
3.  Click **Load unpacked**.
4.  Select your project folder.

## Debugging Tips

Debugging extensions can be tricky because code runs in different contexts.

*   **Popup Logic**: Right-click the extension icon and select "Inspect Popup". This opens a DevTools window specifically for `popup.html`.
*   **Content Scripts**: These run in the web page context. Open the normal DevTools (F12) on the web page to see `console.log` output from `content.js` or injected scripts.
*   **Service Workers (Background)**: In `chrome://extensions`, click the "service worker" link inside your extension card to open its console.

## Conclusion

You've just built a functional Manifest V3 extension! From here, you can explore more advanced APIs like `storage` to save user preferences, or `alarms` to run periodic tasks.
