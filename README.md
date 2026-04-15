# Hongyu Su's Personal Website

A modern Jekyll-powered website hosted on GitHub Pages.

## Recent Updates (2025)

✅ **Modernized to Jekyll 4.4.1**
- Updated `_config.yml` with modern Jekyll configuration
- Added `Gemfile` for proper dependency management
- Replaced deprecated `pygment` highlighter with `rouge`
- Updated Kramdown configuration for better markdown parsing

✅ **Removed Legacy References**
- Cleaned up Mark Reid references from layouts and CSS
- Updated author attribution to Hongyu Su

✅ **Enhanced Security & Performance**
- Upgraded all HTTP links to HTTPS
- Updated MathJax to version 3 (modern CDN)
- Migrated from Universal Analytics to GA4 (placeholder)
- Removed IE6 compatibility code

✅ **Mobile Responsive Design**
- Added responsive CSS with mobile-first approach
- Included viewport meta tag for proper mobile rendering
- Optimized layout for tablets and phones

✅ **Modern HTML5**
- Replaced XHTML DOCTYPE with HTML5
- Updated meta tags and structure

## Development Setup

### Prerequisites
- Ruby 2.7+ (recommend using rbenv or rvm)
- Bundler gem

### Local Development

1. **Install dependencies:**
   ```bash
   bundle install
   ```

2. **Run locally:**
   ```bash
   bundle exec jekyll serve
   ```
   Your site will be available at `http://localhost:4000`

3. **Build for production:**
   ```bash
   bundle exec jekyll build
   ```

### Important Configuration Notes

#### Google Analytics
Update the GA4 tracking ID in `_layouts/default.html`:
- Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
- Get your ID from Google Analytics 4 property settings

#### Site Settings
Update these in `_config.yml`:
- `email`: Your contact email
- `description`: Site description for SEO
- `url`: Your actual domain if different from hongyusu.github.io

## Content Management

### Adding Blog Posts

#### Data Science Blog (IMT)
Create files in `/imt/_posts/` with format: `YYYY-MM-DD-title.md`

#### Data Engineering Blog (AMT)
Create files in `/amt/_posts/` with format: `YYYY-MM-DD-title.md`

### Front Matter Template
```yaml
---
layout: imt-post  # or amt-post
title: "Your Post Title"
excerpt: "Brief description for listings"
---
```

## Deployment

This site is configured for **GitHub Pages** with automatic deployment:
1. Push changes to `main` branch
2. GitHub automatically builds and deploys
3. Site available at `https://hongyusu.github.io`

## Technology Alternatives

### Current: Jekyll + GitHub Pages
**Pros:** Free hosting, good SEO, content-focused, mature ecosystem
**Cons:** Ruby dependency, slower builds, GitHub Pages plugin limitations

### Modern Alternatives to Consider

#### 1. **Astro + Netlify/Vercel** ⭐ **Recommended**
- **Pros:** Extremely fast, modern dev experience, supports multiple frameworks
- **Migration:** Moderate effort, can reuse existing content
- **Best for:** Performance-focused sites, modern development workflow

#### 2. **Next.js + Vercel**
- **Pros:** React-based, excellent performance, great ecosystem
- **Migration:** Higher effort, need to convert templates to React
- **Best for:** Interactive features, React developers

#### 3. **Hugo + Netlify**
- **Pros:** Blazing fast builds, great for large sites, simple deployment
- **Migration:** Moderate effort, need to convert templates
- **Best for:** Content-heavy sites, speed-focused

#### 4. **11ty + Netlify**
- **Pros:** Flexible, JavaScript-based, excellent performance
- **Migration:** Low-moderate effort, similar template concepts
- **Best for:** JAMstack approach, JavaScript developers

## Performance Tips

1. **Optimize images:** Use WebP format and responsive images
2. **Minimize plugins:** Only use essential Jekyll plugins
3. **Enable caching:** Configure proper cache headers
4. **Monitor Core Web Vitals:** Use Google PageSpeed Insights

## SEO Features Included

- Meta tags for social sharing
- XML sitemap generation
- RSS feeds for blog categories
- Structured data markup ready
- Mobile-friendly responsive design

---

**Last Updated:** January 2025  
**Jekyll Version:** 4.4.1  
**Ruby Version:** 2.7+ required