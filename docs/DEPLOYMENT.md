# 🚀 Deployment Guide

Feature Compass is a static site — no build step, no server required. Deploy the 3 files (`index.html`, `app.js`, `style.css`) to any static host.

---

## Deployment Checklist

- [ ] All 3 files present: `index.html`, `app.js`, `style.css`
- [ ] HTTPS enabled (required for `localStorage` and API calls)
- [ ] CDN dependencies accessible (Google Fonts, mammoth.js)

---

## Hosting Options

### GitHub Pages (Free)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "feat: initial release"
git remote add origin https://github.com/your-username/feature-compass.git
git push -u origin main

# 2. Enable Pages
# Go to Settings → Pages → Source: Deploy from branch → main → / (root)
```

Your app will be live at `https://your-username.github.io/feature-compass/`

### Netlify (Free)

1. Go to [netlify.com](https://www.netlify.com/)
2. Drag & drop the project folder
3. Done — instant deploy with custom domain support

Or via CLI:
```bash
npx netlify-cli deploy --prod --dir=.
```

### Vercel (Free)

```bash
npx vercel --prod
```

### Cloudflare Pages (Free)

1. Connect your GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Build settings: leave blank (no build step)
3. Output directory: `/`

### Simple HTTP Server (Local/Self-hosted)

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

---

## Custom Domain

All major hosts support custom domains:

1. Add your domain in the hosting dashboard
2. Point DNS `CNAME` or `A` record to the host
3. Enable HTTPS (usually automatic with Let's Encrypt)

---

## CDN Dependencies

Feature Compass loads 2 external resources:

| Resource | URL | Purpose |
|----------|-----|---------|
| Google Fonts | `fonts.googleapis.com` | Inter + JetBrains Mono |
| mammoth.js | `cdnjs.cloudflare.com` | DOCX file parsing |

### Offline / Self-hosted Option

To remove CDN dependencies:

1. **Fonts** — Download from [Google Fonts](https://fonts.google.com/), update `@import` in `style.css`
2. **mammoth.js** — Download from [npm](https://www.npmjs.com/package/mammoth), change `<script src>` in `index.html`

---

## Performance Optimization

### For Production

1. **Minify files**:
   ```bash
   # CSS
   npx cssnano style.css style.min.css
   
   # JavaScript
   npx terser app.js -o app.min.js --compress --mangle
   ```
   Update references in `index.html` accordingly.

2. **Add caching headers** (if you control the server):
   ```
   Cache-Control: public, max-age=31536000, immutable  # for versioned assets
   Cache-Control: no-cache                              # for index.html
   ```

3. **Preload fonts**:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

4. **Add favicon**:
   ```html
   <link rel="icon" type="image/svg+xml" href="favicon.svg">
   ```

---

## Environment Requirements

| Requirement | Details |
|-------------|---------|
| **Protocol** | HTTPS (required for Anthropic API + localStorage) |
| **CORS** | Anthropic API allows direct browser access via `anthropic-dangerous-direct-browser-access` header |
| **Storage** | ~5MB localStorage quota (sufficient for hundreds of ideas) |
| **Network** | Only needed for AI evaluation & context extraction |

---

## Monitoring

Since Feature Compass is fully client-side:

- **No server logs** — All errors appear in browser console
- **Usage analytics** — Add a lightweight analytics script if needed (e.g., Plausible, Umami)
- **Error tracking** — Consider client-side error tracking (e.g., Sentry browser SDK)

---

## Backup & Restore

User data lives in `localStorage`. To backup:

```javascript
// Export (run in browser console)
copy(localStorage.getItem('fc-state'))

// Import (run in browser console)
localStorage.setItem('fc-state', '...paste JSON here...')
location.reload()
```

Consider adding periodic export functionality for production deployments.
