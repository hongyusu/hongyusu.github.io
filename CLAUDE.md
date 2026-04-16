# CLAUDE.md

## Project Overview

Personal website for Hongyu Su. Astro 5.x static site with monospace dark theme inspired by aino.agency. Deployed to GitHub Pages via GitHub Actions.

## Commands

- `npm run dev` — dev server at localhost:4321
- `npm run build` — build to dist/
- `npm run preview` — preview built site

## Architecture

- **Astro content collections** for blog posts (`src/content/blog/`)
- **No framework** — vanilla CSS + TypeScript for interactivity
- **No light theme** — dark only (`--bg: rgb(24,24,24)`, `--fg: rgb(232,232,227)`)
- **No View Transitions** — removed due to CSS flash issues on GitHub Pages
- Colors use `rgba(var(--black-rgb), opacity)` pattern for consistency

## Blog Posts

- Located in `src/content/blog/YYYY-MM-DD-title.md`
- Date parsed from filename if not in front matter
- Schema defined in `src/content/config.ts` — `title` is optional (defaults to 'Untitled')
- Posts with `$$` in body auto-load MathJax
- Some posts migrated from Jekyll — `{% highlight %}` blocks converted to fenced code blocks, `{:toc}` and `{:width}` stripped

## Work-Related Blog Posts (Compliance)

Posts about work projects use fictional names/labels/numbers to protect proprietary details:
- Real label names replaced with alternatives (sentiment_polarity, visual_appeal, credibility, etc.)
- Real driver names replaced (Sensory Appeal, Visual Design, Perceived Quality, etc.)
- No client names, no company name (Cambri), no internal system names
- Each post has a disclaimer note at the top
- See compliance review in conversation history for full mapping

## Interactive Effects (src/scripts/main.ts)

- **Character scramble** — all `<a>`, `<h1-h3>`, `<button>` scramble on hover. For compound elements (`.project-row`, `.post-card`), only the name/title child scrambles
- **Typewriter** — `[data-typewriter]` on h1 types character by character; `[data-typewriter-lines]` with `[data-line]` children types multiple lines sequentially
- **Scroll reveals** — `.fadein` elements observed by IntersectionObserver; `.section-header` h2 elements get scramble reveal
- **Staggered list reveals** — `.project-showcase` and `.archive-list` children animate in with 30ms stagger
- **Character trail** — monospace chars spawn at cursor position and float up (desktop only)
- **Scroll progress** — 1px bar at top of page
- **Live clock** — footer `.footer-time` updates every 200ms

## Play Page

`/play/` is a standalone fullscreen page (no Base layout). Two games:
- **Matrix rain** — canvas, click to spawn bursts, mouse bends streams
- **Typing rain** — falling chars, type to destroy, score tracking
- Random game selected on load, nav to switch

## Key Files

| File | Purpose |
|------|---------|
| `src/layouts/Base.astro` | HTML shell, GA4, MathJax conditional |
| `src/styles/global.css` | All CSS, rgba color system, no light theme |
| `src/scripts/main.ts` | All JS interactions |
| `src/content/config.ts` | Blog collection schema |
| `src/pages/blog/[...slug].astro` | Dynamic blog post routes |
| `src/pages/play.astro` | Standalone fullscreen games page |
| `.github/workflows/deploy.yml` | Build + deploy to GitHub Pages |

## Deployment

- Push to `master` triggers GitHub Actions
- Pages source set to "GitHub Actions" (not branch deploy)
- Build output: `dist/`
- `GITHUB_TOKEN` env var is invalid — use `GITHUB_TOKEN="" gh ...` for CLI commands

## Git

- Main branch: `master` (deploys)
- Development branch: `develop` (may be stale)
- `redesign` branch exists (merged into master)
