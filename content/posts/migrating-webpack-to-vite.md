+++
title = "Migrating from Webpack to Vite: A Real-World Case Study (2026)"
date = 2026-03-04T10:00:00+08:00
tags = ["vite", "webpack", "migration", "build-tools", "frontend"]
categories = ["dev-tutorials"]
series = "modern-web-dev"
description = "Is your Webpack build taking forever? Learn how I migrated a legacy React project from Webpack to Vite, reducing dev server start time from 30s to 300ms. We cover config translation, environment variables, and common pitfalls."
+++

If you've been working on a React project that started before 2021, chances are you're using Webpack (likely via `create-react-app`). And if your project has grown, your dev server probably takes 30+ seconds to start.

I recently migrated a mid-sized React application from Webpack 5 to Vite. The results were dramatic:
*   **Dev Server Start**: 34s -> 300ms
*   **HMR (Hot Module Replacement)**: 2-3s -> Instant
*   **Production Build**: 45s -> 18s

But it wasn't just a "drop-in replacement." Here is the step-by-step guide to making the switch, including the tricky parts that most tutorials skip.

## Step 1: Install Vite & Clean House

First, remove `react-scripts` (if using CRA) or your manual Webpack dependencies.

```bash
# Remove Webpack/CRA
npm uninstall react-scripts webpack webpack-cli webpack-dev-server

# Install Vite
npm install -D vite @vitejs/plugin-react
```

## Step 2: The Config File Swap

Webpack configuration can be hundreds of lines long. Vite configuration is surprisingly minimal.

Create a `vite.config.ts` in your project root:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Handle path aliases
    },
  },
  server: {
    port: 3000, // Keep your old port to avoid confusion
    open: true,
  },
  build: {
    outDir: 'build', // CRA outputs to 'build', Vite defaults to 'dist'
  }
})
```

**Note**: If you are planning to add PWA capabilities later, check out my guide on [Vite + PWA]({{< ref "vite-pwa-guide.md" >}}) for specific configuration.

## Step 3: Moving `index.html`

In Webpack/CRA, `index.html` lives in `public/`. In Vite, it **must** be in the project root.

1.  Move `public/index.html` to `./index.html`.
2.  Remove `%PUBLIC_URL%` from the HTML file. Vite handles paths automatically.
3.  Add the script module entry point just before the closing `</body>` tag:

```html
<script type="module" src="/src/index.tsx"></script>
</body>
```

## Step 4: Environment Variables

This is the most common breaking change.

*   **Webpack**: Uses `process.env.REACT_APP_API_URL`.
*   **Vite**: Uses `import.meta.env.VITE_API_URL`.

You have two options:
1.  **Refactor**: Search and replace all instances (Recommended).
2.  **Shim**: Use `vite-plugin-env-compatible` to keep using `REACT_APP_` prefixes, but I strongly suggest biting the bullet and refactoring to the modern standard.

## Step 5: Dealing with CommonJS Dependencies

Vite relies heavily on ES Modules (ESM). If you have dependencies that are strictly CommonJS (using `require` or `module.exports`), you might see errors like "require is not defined."

The fix is usually to verify if the package has an ESM build, or add it to `optimizeDeps`:

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  optimizeDeps: {
    include: ['some-legacy-commonjs-package'],
  },
})
```

## Conclusion

The migration took me about 4 hours, mostly spent fixing TypeScript errors and environment variables. Was it worth it? Absolutely. The productivity boost from instant HMR is invaluable.

If you are starting a new project today, use Vite. If you have a legacy project, plan this migration—your team will thank you.
