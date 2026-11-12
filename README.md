# Arjun P — Engineering Portfolio

A static portfolio and technical blog built with HTML, CSS and JavaScript. Blog pages are generated from Markdown at build time.

## Local development

```bash
npm install
npm run build
```

Preview the generated `dist/` directory with any static server, for example:

```bash
npx serve dist
```

No application server or admin dashboard is required.

## Publishing a blog post

1. Create a Markdown file in `content/blog/`, for example `my-new-article.md`.
2. Add frontmatter:

```yaml
---
title: "Your article title"
slug: "your-article-title"
description: "A concise summary for search and sharing."
date: "2026-11-12"
category: "Data Engineering"
tags:
  - Python
  - Data Engineering
published: false
featured: false
cover: "/assets/article-cover.jpg"
coverAlt: "Description of the cover image"
---
```

3. Write the article below the second `---` using Markdown. Fenced code blocks are syntax-highlighted at build time. Standard Markdown images, links, lists, tables and headings are supported.
4. Set `published: true` when it is ready. Only published posts are generated, listed and added to the sitemap.
5. Commit and push. Vercel installs the dependencies, runs `npm run build` and publishes `dist/`.

Optional fields:
- `featured: true` — feature the article at the top of the blog.
- `readingTime: 5` — override the automatic reading-time estimate.
- `cover` and `coverAlt` — add an article cover and social preview image.
- `sample: true` — mark a post as a format demonstration.

The file `content/blog/data-pipeline-observability.md` is a clearly marked sample article. Replace it with an article you approve or set `published: false` before publishing the site if you do not want the sample visible.

## Routes and SEO

- Blog index: `/blog/`
- Article: `/blog/<slug>/`
- Canonical URLs, descriptions, Open Graph metadata and BlogPosting JSON-LD are generated per article.
- Sitemap includes the homepage, blog index and published articles only.
- Drafts are excluded from the generated output.

## Site structure

- `index.html` — portfolio homepage
- `style.css` and `editorial.css` — base styles and editorial design layer
- `script.js` — navigation, theme, architecture explorer and copy-email interactions
- `content/blog/` — Markdown articles and frontmatter
- `scripts/build.mjs` — static site and blog generator
- `blog.css`, `blog.js` — blog reading, filtering and theme behavior
- `dist/` — generated deployment output (do not edit manually)

The portfolio's featured projects and TCS experience remain separate; client-identifying information is intentionally omitted.
