# 🤝 Contributing Guide

Thank you for your interest in contributing to Feature Compass!

---

## Project Overview

Feature Compass is a single-page, client-side web application built with:
- **Vanilla HTML** — Single `index.html` shell
- **Vanilla JavaScript** — Single `app.js` with `App` object pattern
- **Vanilla CSS** — Design system via CSS custom properties

No build tools, bundlers, or frameworks required.

---

## Development Setup

```bash
git clone https://github.com/your-username/feature-compass.git
cd feature-compass

# Open in browser
open index.html

# Or use a local server (recommended for CORS)
python3 -m http.server 8080
```

---

## Code Style & Conventions

### JavaScript

- **Single App object** — All functionality lives in `App`
- **No external dependencies** — Except mammoth.js for DOCX support
- **ES6+ syntax** — Arrow functions, template literals, destructuring, async/await
- **Semicolons** — Required
- **Quotes** — Single quotes for strings
- **Naming** — `camelCase` for methods, `SCREAMING_SNAKE` for constants

### CSS

- **Custom properties** — All colors, radii, fonts via `var(--token)`
- **Light + Dark mode** — Use `prefers-color-scheme: dark` override block
- **Component comments** — Section headers with `/* ── SECTION ── */`
- **Shorthand** — Prefer concise single-line declarations where readable
- **Responsive** — Mobile-first, breakpoints at 900px, 640px, 480px

### HTML

- **Semantic structure** — Proper heading hierarchy, accessible elements
- **IDs** — Used for JavaScript binding (e.g., `id="idea-list"`)
- **Classes** — Used for styling (e.g., `class="idea-card"`)

### i18n

- **All user-facing strings** must go through `App.t('key')`
- **Both languages** required — add keys to both `I18N.en` and `I18N.vi`
- **Key naming** — `camelCase`, descriptive (e.g., `deleteConfirm`, not `dc`)

---

## Design Tokens

### Adding a New Color

```css
:root {
  --new-color: #hex;
  --new-bg: #hex;     /* Light background variant */
  --new-tx: #hex;     /* Text on light background */
}
@media (prefers-color-scheme: dark) {
  :root {
    --new-bg: #hex;   /* Dark background variant */
    --new-tx: #hex;   /* Text on dark background */
  }
}
```

### Spacing & Radii

| Token | Value | Usage |
|-------|-------|-------|
| `--r` | `8px` | Default border radius |
| `--rl` | `12px` | Large border radius (cards, modals) |

---

## Pull Request Workflow

### 1. Fork & Clone

```bash
git fork https://github.com/your-username/feature-compass.git
git clone https://github.com/YOUR-USER/feature-compass.git
cd feature-compass
```

### 2. Create a Branch

```bash
git checkout -b feat/your-feature-name
```

Branch naming:
- `feat/description` — New features
- `fix/description` — Bug fixes
- `refactor/description` — Code restructuring
- `docs/description` — Documentation changes

### 3. Make Changes

- Keep changes focused — one feature/fix per PR
- Update i18n strings for both EN and VI
- Update relevant documentation in `/docs`
- Test in both light and dark mode

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/) in Vietnamese:

```bash
git commit -m "feat: thêm export CSV cho portfolio"
git commit -m "fix: sửa lỗi slider không cập nhật verdict"
git commit -m "docs: cập nhật hướng dẫn sử dụng"
```

### 5. Submit PR

```bash
git push origin feat/your-feature-name
```

Open a PR with:
- Clear description of what changed
- Screenshots (if UI changes)
- Testing notes

---

## Testing Guidelines

Since there's no test framework currently:

1. **Manual testing checklist**:
   - [ ] App loads without console errors
   - [ ] Can create, edit, delete ideas
   - [ ] AI evaluation works (with valid API key)
   - [ ] Score sliders update verdict in real-time
   - [ ] File import works (JSON, MD, TXT, DOCX)
   - [ ] Portfolio quadrant renders correctly
   - [ ] Export generates valid markdown
   - [ ] Settings save and persist across reload
   - [ ] Light/dark mode both look correct
   - [ ] Responsive at all breakpoints (900px, 640px, 480px)
   - [ ] i18n: switch between EN and VI

2. **Browser testing**:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)

---

## Architecture Decisions

When making significant changes, document the decision in a code comment or PR description:
- **Why** this approach was chosen
- **Trade-offs** considered
- **Alternatives** rejected and why

---

## See Also

- [Architecture](./ARCHITECTURE.md) — System design, state schema, design tokens
- [API Reference](./API_REFERENCE.md) — Full list of App methods and schemas
- [User Guide](./USER_GUIDE.md) — Understand the product before contributing
- [Changelog](./CHANGELOG.md) — Track what's been released
- [Security](./SECURITY.md) — Security model to maintain
- [Project Context](./PROJECT_CONTEXT.md) — Project overview and constraints

