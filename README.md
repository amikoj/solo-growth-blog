# Enjoy Today · Hugo 英文博客（独立开发者产品日志）

站点定位：面向海外的英文静态博客，主题风格为「独立开发者的产品日志 / Shipping notes」  
域名：`https://www.enjoytoday.cn/`  
部署：GitHub + Vercel

## 特性

- Hugo 静态站点（无需本地安装 Hugo，使用 `hugo-bin`）
- Google Analytics（仅生产环境注入）
- Google AdSense（仅生产环境注入）
- `ads.txt` 根路径可访问
- `sitemap.xml` 自动生成
- `robots.txt` 显式声明 Sitemap
- RSS：`/index.xml`，并兼容 `/feed.xml`（Vercel Redirect）
- 国内访问可选展示备案信息（页脚）

## 目录结构（关键）

- `hugo.toml`：站点配置（域名、菜单、统计、广告、备案等）
- `content/`：内容（英文文章放在 `content/posts/`）
- `layouts/`：主题模板（首页/列表/文章/partials）
- `static/`：静态文件（`ads.txt`、`robots.txt`、CSS 等）
- `dist/`：构建输出目录（部署产物）

## 本地开发

安装依赖：

```bash
npm install
```

启动本地预览：

```bash
npm run dev
```

打开：`http://localhost:1313/`

构建（默认本地输出到 `dist-local/`，Vercel 输出到 `dist/`）：

```bash
npm run build
```

如需本地强制输出到 `dist/`：

```bash
npm run build:vercel
```

或指定输出目录（Windows PowerShell 示例）：

```bash
$env:HUGO_DEST="dist"; npm run build
```

## 配置说明（必看）

在 [hugo.toml](file:///d:/Projects/solo-growth-blog/hugo.toml) 的 `[params]` 中配置：

- `googleAnalyticsID`：GA4 Measurement ID（形如 `G-XXXXXXX`）
- `adsenseClient`：AdSense client（形如 `ca-pub-5905842540305144`）
- `beianText`：备案展示文案（不填则不显示）
- `beianLink`：备案链接（可选，不填则只显示文本）

### AdSense ads.txt

文件在 [static/ads.txt](file:///d:/Projects/solo-growth-blog/static/ads.txt)。部署后应能在根路径访问：

- `https://www.enjoytoday.cn/ads.txt`

## Sitemap / Robots / RSS

- Sitemap：`/sitemap.xml`
- Robots：`/robots.txt`（包含 `Sitemap: https://www.enjoytoday.cn/sitemap.xml`）
- RSS：
  - 主 feed：`/index.xml`
  - 兼容：`/feed.xml`、`/rss.xml` → `/index.xml`（见 `vercel.json`）

## Vercel + GitHub 部署

1. 将仓库推到 GitHub
2. 在 Vercel 中 Import 该仓库
3. 构建配置：
   - Build Command：`npm run build:vercel`
   - Output Directory：`dist`
4. 绑定自定义域名：`www.enjoytoday.cn`

Vercel 配置文件： [vercel.json](file:///d:/Projects/solo-growth-blog/vercel.json)

## 发布文章

在 `content/posts/` 新建 Markdown，例如：

- `content/posts/my-new-log.md`

Front matter 示例（TOML）：

```toml
+++
title = "Shipping log: something new"
date = 2026-02-09T00:00:00Z
tags = ["product-log", "shipping"]
draft = false
+++
```

## 常见问题

### 为什么构建输出是 dist/ 而不是 public/？

在当前 Windows 环境下，`public/robots.txt` 可能被系统占用导致 Hugo 写入失败。为保证构建稳定，已将输出目录切换到 `dist/`（同时已同步 Vercel 输出目录配置）。

### 为什么本地 build 默认输出到 dist-local/？

在 Windows 上 `robots.txt` 偶发被系统进程占用，导致对同一路径反复覆盖写入失败。本地默认使用 `dist-local/` 规避文件锁；Vercel 构建环境干净且可稳定输出到 `dist/`。

