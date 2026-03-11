---
title: "Chrome Extension V3: Migrating from Background Pages to Service Workers"
date: 2026-03-11T15:00:00+08:00
draft: false
tags: ["Chrome Extension", "Manifest V3", "Service Worker", "Migration", "JavaScript"]
categories: ["Dev Tutorials", "Chrome Extension"]
description: "Manifest V2 is dead. Learn how to migrate your persistent background pages to ephemeral Service Workers in Manifest V3, handling state, alarms, and events correctly."
---

Google has officially sunset Manifest V2. If your Chrome extension still relies on persistent background pages, it's time to migrate to **Service Workers** (Manifest V3).

This isn't just a config change. It's a paradigm shift.

## The Core Difference: Persistence

*   **Manifest V2 (Background Page)**: A hidden HTML page that runs *forever* in the background. You could store variables in global scope (`window.myVar = 123`) and they would persist until the browser closed.
*   **Manifest V3 (Service Worker)**: An event-driven script that terminates when not in use. It wakes up for an event (e.g., a click), does its job, and goes back to sleep. **Global variables are not persistent.**

## Step 1: Update `manifest.json`

Change `background.scripts` to `background.service_worker`.

```json
// Manifest V2
{
  "background": {
    "scripts": ["background.js"],
    "persistent": true
  }
}

// Manifest V3
{
  "background": {
    "service_worker": "background.js"
  }
}
```

## Step 2: Replace Global Variables with Storage API

Since the Service Worker dies, any in-memory state is lost. You must use `chrome.storage`.

**Bad (V2):**
```javascript
let count = 0;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'INCREMENT') {
    count++;
    sendResponse({ count });
  }
});
```

**Good (V3):**
```javascript
// Use chrome.storage.local (or session for non-persistent across restarts)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'INCREMENT') {
    chrome.storage.local.get(['count'], (result) => {
      const newCount = (result.count || 0) + 1;
      chrome.storage.local.set({ count: newCount }, () => {
        sendResponse({ count: newCount });
      });
    });
    return true; // Keep message channel open for async response
  }
});
```

## Step 3: Replace `setTimeout` / `setInterval` with Alarms API

Timers in Service Workers are unreliable because the worker can be terminated at any time. Use the **Alarms API**.

**Bad (V2):**
```javascript
setInterval(() => {
  console.log("Checking for updates...");
}, 60000);
```

**Good (V3):**
```javascript
// create alarm
chrome.alarms.create('checkUpdates', { periodInMinutes: 1 });

// listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkUpdates') {
    console.log("Checking for updates...");
  }
});
```

## Step 4: DOM Access

Service Workers don't have access to the DOM (no `window`, no `document`). If you need to parse HTML, use:
1.  **Offscreen Documents** (new in MV3).
2.  `fetch()` to get text, then regex or a lightweight parser (if simple).

## Conclusion

Migrating to Manifest V3 forces you to write more efficient, event-driven code. It's painful at first, but your extension will use less memory and be more respectful of the user's battery life.

For more on Chrome Extensions, check out my guide on Injecting React Components (coming soon).
