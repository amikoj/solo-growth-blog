+++
title = "Generating Word Docs in the Browser with docx.js"
date = 2024-02-14T10:00:00Z
tags = ["javascript", "docx", "tutorial"]
categories = ["tech-thoughts"]
series = "tech"
description = "Stop generating PDFs for everything. Sometimes your users just want an editable Word doc. Here is how to do it in 5 minutes."
+++

I used to think PDF was the only professional document format. Then I started building B2B apps.

Here is the truth: **Business users love Word.** They want to edit the contract, tweak the report, or copy-paste the data. If you only give them a PDF, you are actually making their life harder.

`docx.js` is the library that changed my mind. It allows you to generate `.docx` files entirely in the browser (or Node.js) without any server-side dependencies.

## Installation

```bash
npm install docx
```

## The "Hello World" of Word

Unlike HTML strings, `docx.js` uses an object-oriented approach. You build a tree of objects: `Document` -> `Section` -> `Paragraph` -> `TextRun`.

```typescript
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver"; // You'll need this for browser download

const generateDoc = () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: " This is bold",
                bold: true,
              }),
              new TextRun({
                text: "\tAnd this is a tabbed text",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "hello-world.docx");
  });
};
```

## Understanding the Structure

1.  **Document**: The root object. Contains global settings like metadata (author, title) and background color.
2.  **Sections**: Think of these as chapters or page layouts. You can have a landscape section followed by a portrait section.
3.  **Paragraph**: The block-level element. Handles alignment, spacing, and indenting.
4.  **TextRun**: The inline element. Handles font size, color, bold/italic, and font family.

## Why This Matters for Indie Hackers

If you are building a SaaS, "Export to Word" is often a premium feature you can charge for.
- **Legal Tech**: Generate NDAs or contracts filled with user data.
- **EdTech**: Create worksheets or lesson plans teachers can modify.
- **Reporting**: Generate weekly status reports managers can tweak before sending to their boss.

It is a low-effort feature with high perceived value.
