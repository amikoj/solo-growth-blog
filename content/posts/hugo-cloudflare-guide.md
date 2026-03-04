+++
title = "Deploying Hugo on Cloudflare Pages: The Complete Guide (2026)"
date = 2026-02-14T10:00:00+08:00
tags = ["hugo", "cloudflare", "deployment", "jamstack"]
categories = ["dev-tutorials"]
series = "modern-web-dev"
description = "A step-by-step guide to deploying a Hugo static site on Cloudflare Pages. Learn how to configure build settings, custom domains, and HTTPS for free."
+++

If you're running a static site in 2026, **Cloudflare Pages** is arguably the best hosting option available. It's fast, free for personal projects, and comes with the massive global network of Cloudflare CDN built-in.

In this guide, I'll walk you through the exact process of deploying a Hugo blog (like this one) to Cloudflare Pages.

## Why Cloudflare Pages?

For solo developers and indie hackers, the benefits are clear:

1.  **Zero Cost**: The free tier is generous (unlimited bandwidth, 500 builds/month).
2.  **Global Edge Network**: Your site is cached in 275+ cities worldwide.
3.  **Instant Git Integration**: Push to GitHub/GitLab, and it deploys automatically.
4.  **Preview Deployments**: Every pull request gets a unique URL for testing.

## Prerequisites

-   A **Hugo** project on your local machine.
-   A **GitHub** or **GitLab** account.
-   A **Cloudflare** account.

## Step 1: Prepare Your Hugo Project

Before deploying, ensure your project is "cloud-ready".

### Check `hugo.toml`

Make sure your `baseURL` is set correctly. For Cloudflare Pages, it's often better to let Cloudflare handle the base URL or ensure it matches your custom domain.

```toml
# hugo.toml
baseURL = "https://your-custom-domain.com/"
languageCode = "en-us"
title = "My Solo Blog"
theme = "your-theme"
```

### Create a `.gitignore`

Ensure you aren't committing the `public` folder (which is generated) or `resources` (unless necessary).

```gitignore
# .gitignore
/public
/resources/_gen
/assets/jsconfig.json
node_modules/
.DS_Store
```

## Step 2: Push to GitHub

If you haven't already, push your code to a remote repository.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Step 3: Connect to Cloudflare Pages

1.  Log in to the **Cloudflare Dashboard**.
2.  Navigate to **Workers & Pages** > **Create Application**.
3.  Select the **Pages** tab and click **Connect to Git**.
4.  Authorize Cloudflare to access your GitHub repository.
5.  Select your Hugo project repository and click **Begin setup**.

## Step 4: Configure Build Settings

This is the critical part where many beginners get stuck. Cloudflare needs to know *how* to build your site.

-   **Project Name**: (e.g., `my-solo-blog`)
-   **Production Branch**: `main`
-   **Framework Preset**: Select **Hugo**.

Cloudflare will auto-fill the following:

-   **Build command**: `hugo`
-   **Build output directory**: `public`

### Recommended: Use a Specific Hugo Version

Cloudflare's default Hugo version might be outdated. It's best to specify the version you use locally to avoid "it works on my machine" errors.

1.  Scroll down to **Environment variables**.
2.  Add a variable:
    -   **Variable name**: `HUGO_VERSION`
    -   **Value**: `0.120.0` (or whatever version you use, check with `hugo version`)

### Recommended: Minify Output

For better performance, update the **Build command** to:

```bash
hugo --minify
```

Click **Save and Deploy**.

## Step 5: Verify the Deployment

Cloudflare will now clone your repo and run the build command. You can watch the logs in real-time.

Once complete, you'll get a `*.pages.dev` subdomain (e.g., `my-solo-blog.pages.dev`). Click it to verify your site is live.

## Step 6: Add a Custom Domain

Using a `pages.dev` subdomain is fine for testing, but for a real blog, you want your own domain.

1.  Go to the **Custom Domains** tab in your Pages project.
2.  Click **Set up a custom domain**.
3.  Enter your domain (e.g., `www.enjoytoday.cn`).
4.  Cloudflare will prompt you to update your DNS records.
    -   If your DNS is managed by Cloudflare, it's automatic.
    -   If managed elsewhere (GoDaddy, Namecheap), you'll need to add a **CNAME** record pointing to your `pages.dev` subdomain.

## Troubleshooting Common Issues

### "Page Not Found" on Assets (CSS/JS)
This usually means your `baseURL` in `hugo.toml` doesn't match the deployment URL.
-   **Fix**: Update `baseURL` to your custom domain, or use relative URLs (though absolute is recommended for SEO).

### "Command not found: hugo"
This means Cloudflare didn't install Hugo.
-   **Fix**: Ensure you selected the **Hugo** framework preset.

### Build Timeout
If your site is huge (thousands of pages), the build might time out.
-   **Fix**: Cloudflare Pages has a 20-minute build limit. Optimize your images or use Hugo's `--gc` (garbage collection) flag.

## Conclusion

Deploying Hugo to Cloudflare Pages is a set-and-forget process. Once configured, every article you write and push to GitHub will automatically go live within seconds.

It's the perfect stack for solo developers who want to focus on **content** and **product**, not server maintenance.

## What's Next?

Now that your site is live, you should focus on:

1.  **SEO Optimization**: Configure your canonical URLs and sitemap. Check out my guide on [Optimizing Hugo for SEO]({{< ref "optimizing-hugo-seo.md" >}}).
2.  **Performance**: Ensure your site loads instantly. If you are building a web app, consider making it a PWA with [Vite + PWA]({{< ref "vite-pwa-guide.md" >}}).
