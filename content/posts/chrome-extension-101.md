+++
title = "Chrome Extension 101: Building Your First Manifest V3 Plugin"
date = 2022-12-10T00:00:00Z
tags = ["technical-guide", "chrome-extension", "javascript"]
series = "tech-stack"
description = "A step-by-step guide to creating a simple Chrome Extension using Manifest V3. Perfect for beginners looking to build micro-SaaS tools."
+++

> **Editor's Note**: Chrome Extensions are a powerful playground for indie developers. They solve specific problems right where users spend most of their time: the browser. This guide breaks down the basics of creating a "Hello World" extension using the latest Manifest V3 standard.

## Context

Many successful micro-SaaS products started as simple browser extensions. Whether it's an ad blocker, a productivity timer, or a grammar checker, the barrier to entry is surprisingly low.

However, the ecosystem has shifted. Chrome now mandates **Manifest V3**, while Firefox still largely supports V2. For developers targeting the largest market share, understanding V3 is non-negotiable.

## The Challenge

For a beginner, the official documentation can be overwhelming. Files, permissions, background scripts, popups... where do you actually start?

The goal of this log is to strip away the complexity and build a minimal, functional extension: a simple **Ad Filter Configuration** interface.

## The Solution

A basic Chrome extension is just HTML, CSS, and JavaScript, glued together by a `manifest.json` file.

### Step 1: The Blueprint (`manifest.json`)

Create a folder for your project and add a `manifest.json` file. This tells Chrome what your extension does.

```json
{
  "name": "Ad Filter Basic",
  "version": "0.0.1",
  "manifest_version": 3,
  "description": "A simple example to filter common web ads.",
  "action": {
    "default_popup": "popup.html"
  },
  "icons": {
    "16": "icons/icon.png",
    "32": "icons/icon.png",
    "48": "icons/icon.png",
    "128": "icons/icon.png"
  }
}
```

*   **manifest_version**: Must be `3` for new Chrome extensions.
*   **action**: Defines what happens when you click the extension icon (in this case, opening `popup.html`).

### Step 2: The Interface (`popup.html`)

Create a `popup.html` file. This is the small window that appears when users click your extension icon.

**Pro Tip**: Always use standard HTML structure with `<meta charset="UTF-8">` to avoid character encoding issues (like garbled Chinese characters).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ad Filter Config</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .container {
            min-width: 300px;
            padding: 15px 20px;
        }
        h3 { margin-top: 0; color: #333; }
        .settings {
            margin-top: 20px;
            font-size: 14px;
        }
        .set {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        /* Custom Checkbox Style could go here */
    </style>
</head>
<body>
    <div class="container">
        <h3>Filter Settings</h3>
        <div class="settings">
            <div class="set">
                <span>Filter Google Adsense</span>
                <input type="checkbox" checked>
            </div>
            <div class="set">
                <span>Filter Baidu Ads</span>
                <input type="checkbox">
            </div>
        </div>
    </div>
</body>
</html>
```

### Step 3: Icons

Create an `icons` folder and add a PNG file named `icon.png` (you can resize it to 16, 32, 48, 128px versions for best results, but one file works for testing).

### Step 4: Loading the Extension

You don't need to pay $5 to the Web Store just to test your code.

1.  Open Chrome and go to `chrome://extensions/`.
2.  Toggle **Developer mode** in the top right corner.
3.  Click **Load unpacked**.
4.  Select your project folder.

Voila! Your extension icon should appear in the browser toolbar. Click it, and you'll see your "Ad Filter" popup.

## Results & Learnings

*   **Simplicity**: You don't need a complex build step (Webpack/Vite) for simple extensions.
*   **Manifest V3**: It enforces better security and performance practices, though the migration for complex extensions can be tricky.
*   **Distribution**: You can pack the extension into a `.crx` file locally for sharing, or upload the zip to the Chrome Web Store for public release.

This simple structure is the foundation for almost every browser tool you use. Next steps would be adding JavaScript to handle the checkbox logic and actually injecting CSS to hide those ads!

---

### About the Author

**Amiko** is an indie developer exploring the micro-SaaS ecosystem.
Follow my journey on [X (Twitter)](https://x.com/giftwiseFei) or subscribe to the [RSS Feed](/index.xml).