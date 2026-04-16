# hongyusu.github.io

Personal website of Hongyu Su — built with Astro, deployed on GitHub Pages.

**Live:** https://hongyusu.github.io

## Stack

- **Astro 5.x** — static site generator
- **JetBrains Mono** — monospace font (self-hosted woff2)
- **Shiki** — syntax highlighting
- **MathJax 3** — LaTeX rendering (CDN, loaded per-post)
- **Google Analytics 4** — visitor tracking (G-HSNQ1ZDBH2)

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # output to dist/
npm run preview   # preview the build
```

## Structure

```
src/
├── content/blog/    # 73 markdown posts
├── layouts/         # Base.astro, BlogPost.astro
├── pages/           # index, blog/, code, work, play
├── components/      # Header, Footer, PostCard, ProjectCard
├── styles/          # global.css
└── scripts/         # main.ts (scramble, typewriter, animations)
public/
├── images/          # post images
├── files/pubs/      # publication PDFs
└── fonts/           # JetBrains Mono woff2
```

## Pages

| Path | Content |
|------|---------|
| `/` | Hero with typewriter, recent posts, research + portfolio summaries |
| `/blog/` | All posts in 2-column card grid |
| `/blog/archive/` | Year-grouped chronological list |
| `/code/` | Portfolio grouped by category |
| `/work/` | Academic (education, publications, awards, teaching) |
| `/play/` | Matrix rain + Typing Rain games |

## Adding a Blog Post

Create `src/content/blog/YYYY-MM-DD-title.md`:

```yaml
---
title: "Post Title"
tags: [Tag1, Tag2]
description: "Optional excerpt"
---

Content in markdown.
```

## Deployment

Push to `master` → GitHub Actions (`.github/workflows/deploy.yml`) builds Astro → deploys to GitHub Pages.
