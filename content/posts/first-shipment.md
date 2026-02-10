+++
title = "First Shipment: Setting the Baseline"
date = 2026-02-09T00:00:00Z
tags = ["product-log", "meta", "hugo"]
categories = ["indie-hacking"]
series = "personal-notes"
description = "Why and how I built this blog as the first step of my indie hacking journey."
+++

> **Editor's Note**: Every journey needs a starting point. This blog is mine. It's not just a collection of articles, but a living product log where I document the reality of building for the global market as a beginner.

## Context

For over 10 years, I've been writing code for others. As a Senior Engineer, I was comfortable with technology but increasingly distant from the *product* itself. I wanted to change that. I wanted to build, ship, and grow my own products.

But "Indie Hacking" is overwhelming. There are endless things to learn: marketing, SEO, design, copywriting, legal compliance... The list goes on.

I realized I needed a **home base**. A place to:
1.  **Document** my learnings (to solidify them).
2.  **Showcase** my work (to build credibility).
3.  **Experiment** with growth tactics (SEO, analytics, monetization) in a low-risk environment.

So, I decided to treat this blog as my **Product #0**.

## The Challenge

The goal was simple: **Ship a production-ready blog in 24 hours.**

However, "production-ready" for an indie hacker means more than just `hugo new site`. It requires:
*   **Performance**: Must be blazing fast (Core Web Vitals).
*   **SEO**: Sitemap, robots.txt, semantic HTML, meta tags.
*   **Analytics**: Google Analytics 4 (to track traffic).
*   **Monetization Ready**: Google AdSense integration (ads.txt, placeholders).
*   **Compliance**: ICP Beian (for China access) + Global accessibility (Vercel).
*   **Workflow**: Zero-friction deployment (Push to Git -> Live).

## The Solution

I chose a minimalist tech stack to focus on content and speed:

### 1. The Stack
*   **Engine**: [Hugo](https://gohugo.io/) (Static Site Generator). It's incredibly fast and produces zero-dependency HTML.
*   **Hosting**: [Vercel](https://vercel.com/). Free, fast global CDN, and automatic Git deployments.
*   **Theme**: Custom-built "Portfolio + Log" theme. I didn't want a generic template. I wanted a specific "Shipping" focus.

### 2. Key Implementations

**The "Portfolio First" Layout**
I modified the homepage to prioritize *Products* over *Posts*.
```html
{{ range .Site.Data.projects }}
  <a href="{{ .url }}" class="project-card">
    <div class="project-icon"><img src="{{ .icon }}" ...></div>
    <!-- ... -->
  </a>
{{ end }}
```

**Production Hygiene**
I set up a rigorous `hugo.toml` configuration to ensure search engines and ad networks are happy:
*   `enableRobotsTXT = true`
*   Custom `layouts/partials/head.html` for conditional GA4/AdSense injection (production only).
*   `ads.txt` in the static folder to verify inventory ownership.

**Cross-Border Accessibility**
*   **China**: Hosted on a specific domain/server with ICP filing (future plan).
*   **Global**: Vercel handles the rest of the world.
*   **Build System**: Used `hugo-bin` and custom npm scripts to avoid local dependency hell and ensure consistent builds across Windows/Mac/CI.

## Results & Learnings

I successfully shipped v1.0 within the timeframe.

**What I learned:**
*   **Don't over-engineer**: A simple static site is powerful enough.
*   **Content is King, Distribution is Queen**: Building the blog was the easy part. Writing consistently and getting readers will be the real challenge.
*   **Small wins matter**: Seeing the "WeChat QR Code" and "Project Cards" render correctly gave me a disproportionate amount of joy. It feels real now.

**What's Next?**
Now that the baseline is set, I will focus on **Project Alpha** (a productivity tool) and **Mindgift**. I will log every major milestone here.

Stay tuned.

---

### About the Author

**Mason** is a software engineer turned indie hacker, learning to build and sell to the global market.
Follow my journey on [X (Twitter)](https://x.com/giftwiseFei) or subscribe to the [RSS Feed](/feed.xml).