+++
title = "Building a Robust Dark Mode Toggle with Vanilla JS (No Frameworks)"
date = 2026-03-04T10:00:00+08:00
tags = ["javascript", "css", "dark-mode", "frontend", "web-performance"]
categories = ["dev-tutorials"]
series = "modern-web-dev"
description = "Learn how to implement a flicker-free dark mode using CSS variables and Vanilla JavaScript. We cover system preferences, local storage persistence, and preventing the dreaded Flash of Unstyled Content (FOUC)."
+++

Dark mode is no longer a "nice-to-have"; it's a user expectation. While React, Vue, and Tailwind all have their own ways of handling it, sometimes you just want a simple, dependency-free solution.

In this tutorial, we will build a **production-ready** dark mode toggle using only Vanilla JavaScript and CSS Variables.

## The Requirements

A "robust" dark mode implementation must handle:
1.  **System Preference**: Respect the user's OS setting (Light/Dark) by default.
2.  **User Override**: Allow the user to toggle it manually.
3.  **Persistence**: Remember the choice on reload.
4.  **No FOUC**: Prevent the "Flash of Unstyled Content" (or Flash of Wrong Theme) on page load.

## Step 1: CSS Variables

First, define your color palette using CSS Custom Properties. We use a data attribute on the `<html>` tag to switch themes.

```css
/* style.css */
:root {
  --bg-color: #ffffff;
  --text-color: #1a202c;
  --link-color: #2563eb;
}

/* When the html tag has data-theme="dark" */
html[data-theme="dark"] {
  --bg-color: #1a202c;
  --text-color: #f7fafc;
  --link-color: #63b3ed;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
```

## Step 2: The Toggle Button

Add a simple button to your HTML.

```html
<button id="theme-toggle" aria-label="Toggle Dark Mode">
  <!-- Sun Icon -->
  <svg class="sun-icon" ... >...</svg>
  <!-- Moon Icon -->
  <svg class="moon-icon" ... >...</svg>
</button>
```

## Step 3: Preventing FOUC (Critical)

This is where most tutorials fail. If you wait for `DOMContentLoaded` or your React app to hydrate before checking the theme, the user will see a white flash on a dark background.

To fix this, we must run a small **blocking script** in the `<head>`, before the `<body>` renders.

```html
<!-- index.html -->
<head>
  <script>
    (function() {
      // 1. Check local storage
      const localTheme = localStorage.getItem('theme');
      
      // 2. Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 3. Determine the theme
      if (localTheme === 'dark' || (!localTheme && systemTheme)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  </script>
</head>
```

This script executes immediately, ensuring the HTML has the correct `data-theme` attribute before the browser paints the page.

## Step 4: The Toggle Logic

Now, let's implement the button behavior in our main JavaScript file (or at the end of `<body>`).

```javascript
// main.js
const toggleBtn = document.getElementById('theme-toggle');
const html = document.documentElement;

toggleBtn.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // 1. Update DOM
  html.setAttribute('data-theme', newTheme);
  
  // 2. Save to Local Storage
  localStorage.setItem('theme', newTheme);
});
```

## Step 5: Listening for System Changes

What if the user changes their OS theme while your site is open? We should listen for that event.

```javascript
// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  // Only update if the user hasn't manually overridden the preference
  if (!localStorage.getItem('theme')) {
    const newTheme = e.matches ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
  }
});
```

## Conclusion

You don't need a heavy library to implement dark mode. By leveraging CSS variables and a tiny head script, you can provide a seamless, flicker-free experience that respects both user preferences and system settings.

This approach is exactly what I use on this blog (check the source!). Along with [SEO Optimization]({{< ref "optimizing-hugo-seo.md" >}}), it's a foundational part of my tech stack.
