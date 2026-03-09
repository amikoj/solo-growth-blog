---
title: "Automating Blog Post Summaries with OpenAI and GitHub Actions"
date: 2026-03-05T12:00:00+08:00
draft: false
tags: ["Automation", "GitHub Actions", "OpenAI", "CI/CD", "Node.js"]
categories: ["Dev Tutorials", "Indie Hacking"]
description: "Save time and improve SEO by automatically generating summaries for your blog posts using OpenAI's API and GitHub Actions."
---

Writing a blog post is hard enough. Writing a compelling meta description or summary for SEO and social media sharing is often an afterthought. 

But what if you could automate it?

In this tutorial, I'll show you how to build a **GitHub Action** that:
1.  Detects new or modified Markdown files in your repo.
2.  Reads the content.
3.  Sends it to OpenAI (GPT-4o-mini) to generate a concise summary.
4.  Updates the file's frontmatter with the new summary.
5.  Commits the changes back to your repository.

## The Workflow

We want this to run every time we push to the `main` branch.

### Step 1: The Script (`scripts/generate-summary.js`)

First, we need a Node.js script to do the heavy lifting.

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSummary(content) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an SEO expert. Summarize the following blog post in 150-160 characters for a meta description. Do not use quotes." },
      { role: "user", content: content.slice(0, 3000) } // Send first 3000 chars to save tokens
    ]
  });
  return response.choices[0].message.content;
}

const postsDir = path.join(__dirname, '../content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

(async () => {
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    if (!data.description || data.description.length < 10) {
      console.log(`Generating summary for ${file}...`);
      const summary = await generateSummary(content);
      
      data.description = summary;
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent);
    }
  }
})();
```

### Step 2: The GitHub Action (`.github/workflows/auto-summary.yml`)

Now, automate it.

```yaml
name: Auto Summarize Posts

on:
  push:
    paths:
      - 'content/posts/*.md'

jobs:
  summarize:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm install openai gray-matter

      - name: Generate Summaries
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node scripts/generate-summary.js

      - name: Commit Changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-generate summaries [skip ci]"
```

## Why This Matters

For indie hackers and solo developers, **automation is leverage**. By offloading this small task, you ensure every post has a high-quality description for SEO without spending mental energy on it.

This pattern—**Event -> AI Processing -> Commit Back**—can be applied to many other tasks:
-   Generating OG images.
-   Checking for spelling errors.
-   Translating content into other languages.

If you're interested in more ways to optimize your workflow, check out my comparison of [OpenClaw vs. Claude Code]({{< ref "openclaw-vs-claude-code.md" >}}), where I discuss how AI agents are changing the way we work.
