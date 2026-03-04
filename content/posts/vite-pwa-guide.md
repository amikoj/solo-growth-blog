+++
title = "Vite + PWA: Handling Offline Caching Correctly (2026)"
date = 2026-02-24T12:00:00+08:00
tags = ["vite", "pwa", "service-worker", "offline-first", "react", "vue"]
categories = ["dev-tutorials"]
series = "modern-web-dev"
description = "A deep dive into configuring vite-plugin-pwa for reliable offline experiences. Learn about strategies like 'Stale-While-Revalidate', handling updates, and debugging Service Workers."
+++

Building a Progressive Web App (PWA) with Vite is deceptively simple. You install `vite-plugin-pwa`, add a few lines to `vite.config.ts`, and boom—your app is installable.

But making it *truly* offline-capable? That's where the headaches begin.

-   Why does my app still show old content after I deploy?
-   Why does the offline page look broken?
-   How do I cache API responses, not just static assets?

In this guide, I'll walk you through the correct way to handle offline caching using `vite-plugin-pwa` and Google's Workbox library.

## The "Update on Reload" Trap

By default, many tutorials suggest using `registerType: 'autoUpdate'`.

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate', // ⚠️ The lazy way
      // ...
    })
  ]
})
```

**The Problem:**
When you deploy a new version, the Service Worker installs in the background. With `autoUpdate`, it immediately takes control. If your user is in the middle of a form or an important task, the page might reload unexpectedly, or assets might break because the old index.html is trying to fetch hashed JS files that no longer exist on the server.

**The Solution:** Use `prompt` (Manual Update).

This gives you control. You can show a "New content available" toast, and let the user click "Reload" when they are ready.

## Step 1: Configuring `vite.config.ts`

Here is a production-ready configuration.

```typescript
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'prompt', // 1. Use prompt instead of autoUpdate
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // 2. Caching Strategies
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache API calls (StaleWhileRevalidate)
            urlPattern: /^https:\/\/api\.myapp\.com\/.*\/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // <== 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

## Step 2: Handling the Update Prompt (React Example)

You need to listen for the `needRefresh` event from the Service Worker. `vite-plugin-pwa` provides a virtual module for this.

Create a component `ReloadPrompt.tsx`:

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            { offlineReady
              ? <span>App ready to work offline</span>
              : <span>New content available, click on reload button to update.</span>
            }
          </div>
          { needRefresh && (
            <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>
              Reload
            </button>
          ) }
          <button className="ReloadPrompt-toast-button" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default ReloadPrompt
```

## Step 3: Debugging Service Workers

When developing, Service Workers can be tricky because they persist.

1.  **Enable in Dev**: In `vite.config.ts`, set `devOptions: { enabled: true }`.
2.  **Chrome DevTools**: Go to **Application** > **Service Workers**.
    -   Check "Update on reload" to force updates during development.
    -   Click "Unregister" if things get stuck.
3.  **Storage**: Go to **Application** > **Storage** and click "Clear site data" to nuke everything (Cache Storage, IndexedDB, Service Workers) and start fresh.

## Common Pitfalls

### 1. Caching Too Much
Don't cache `/api/user/profile` or sensitive data unless you know what you're doing. Use `NetworkFirst` for critical data that changes often.

### 2. The `start_url`
Ensure your `manifest.json` (inside the `VitePWA` config) has a valid `start_url`, usually `/` or `/index.html`. If this is wrong, your installed app might show a 404.

### 3. Missing Icons
PWA installability requires specific icon sizes (usually 192x192 and 512x512). Use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) to create them automatically.

## Conclusion

`vite-plugin-pwa` is a wrapper around Workbox, which is the industry standard for Service Workers. By moving from `autoUpdate` to `prompt` and configuring explicit runtime caching strategies, you transform your app from "technically a PWA" to a robust, offline-capable product.
