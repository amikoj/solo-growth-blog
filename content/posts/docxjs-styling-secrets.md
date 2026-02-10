+++
title = "Mastering Word Document Styling with docx.js"
date = 2025-06-19T10:20:00Z
tags = ["javascript", "docx", "web-development", "document-generation"]
categories = ["tech-thoughts"]
series = "tech"
description = "Generating Word documents in the browser is easy. Making them look professional is hard. Here are three strategies to tame the docx.js styling beast."
+++

I've built enough "Export to Word" buttons to know the pain.

You think it's going to be like writing HTML. You try to apply a CSS class. Nothing happens. You try to use pixels. The layout breaks. You realize that a `.docx` file is actually a zipped collection of XML files that hates your creativity.

But if you're building a contract management system, a report generator, or any serious B2B app, you can't escape it. Your users want Word documents, and they want them to look **professional**.

I've spent weeks wrestling with `docx.js`, the most popular library for this in the JS ecosystem. Here is what I learned about styling.

## The Core Problem: XML vs. HTML

The biggest mistake developers make is bringing a "Web Mindset" to Word.
- **Web:** Cascade styles (CSS). Child elements inherit from parents.
- **Word:** Hierarchy styles. A paragraph has a style, a run (text span) has a style. They don't cascade the way you expect.

`docx.js` is a wrapper around the OpenXML standard. To master it, you need to think less like a web designer and more like a typesetter.

## Strategy 1: The "Hardcoded" Approach (Good for Dynamic Content)

The most direct way is to define styles inline. This gives you granular control.

```javascript
import { Document, Paragraph, TextRun } from 'docx';

const paragraph = new Paragraph({
  spacing: { line: 400 }, // Line height
  indent: { left: 400 },  // Indentation
  children: [
    new TextRun({
      text: 'WARNING: ',
      bold: true,
      color: 'FF0000', // Hex without #
      size: 28,        // Half-points (28 = 14pt)
      font: 'Arial'
    }),
    new TextRun({
      text: 'This is a strict contract clause.',
      size: 24
    })
  ]
});
```

**Pros:** precise control.
**Cons:** verbose code. It's React `style={{}}` prop hell, but worse.

## Strategy 2: The "Reference Doc" Approach (Best for Consistency)

This is the pro move. Instead of writing styling code, **use Word to design Word.**

1. Open Microsoft Word.
2. Create a blank document.
3. Define your styles in the "Styles" pane (e.g., modify "Heading 1" to be blue and 24pt).
4. Save this file as `template.docx`.
5. Load this file as a `externalStyles` blob in `docx.js`.

```javascript
const doc = new Document({
  externalStyles: await fetch('/template.docx').then(res => res.text()),
  sections: [{
    children: [
      new Paragraph({
        text: 'Contract Header',
        style: 'Heading1' // Matches the ID in your Word doc
      })
    ]
  }]
});
```

**Pros:**
- Designers can fix styles without touching code.
- Guaranteed consistency with corporate branding.
- Much cleaner code.

## Strategy 3: The "HTML Conversion" Hack (The Quick & Dirty)

Sometimes you just have a rich text editor content (HTML) and you need it in Word. You can use libraries like `html-docx-js` combined with `juice` (to inline CSS).

```javascript
import juice from 'juice';
import htmlDocx from 'html-docx-js';

const html = `
  <div style="font-family: Arial; color: red;">
    <h1>Report</h1>
    <p>Generated content...</p>
  </div>
`;

// Inline all CSS before conversion
const inlinedHtml = juice(html);
const blob = htmlDocx.asBlob(inlinedHtml);
```

**Pros:** Fast to implement if you already have HTML.
**Cons:** Fragile. Complex layouts (Flexbox, Grid) will break. Table borders often disappear. Use with caution.

## A Note on Fonts

Fonts are tricky. Word doesn't embed fonts by default. If you set `font: 'Helvetica'` and the user is on Windows (which doesn't have Helvetica), it will look wrong.

Always specify a fallback or use standard "safe" fonts:
- `Microsoft YaHei` (for Chinese)
- `Arial`
- `Times New Roman`

## Conclusion

If you're building a simple "Export" feature, **Strategy 3** might survive.
If you're building a report generator where data drives the layout, use **Strategy 1**.
But if you're building a serious document automation product, **Strategy 2** is the only scalable path. Let Word do what Word does best (styling), and let JavaScript do what it does best (logic).
