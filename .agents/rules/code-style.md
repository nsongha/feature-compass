---
description: Code style conventions for Feature Compass
---

# Code Style

## Architecture Pattern
- App sử dụng **Object Literal Pattern**: toàn bộ logic nằm trong `App = { ... }` object
- KHÔNG tạo class, KHÔNG dùng prototype chain
- Method mới thêm vào `App` object, giữ cùng coding style

## Naming
- **Methods**: camelCase — `renderList()`, `calcVerdict()`, `buildContext()`
- **Constants**: UPPER_SNAKE — `VERDICT_CFG`, `CUT_VERDICTS`, `MODELS`
- **CSS classes**: kebab-case — `.idea-card`, `.dim-slider`, `.ctx-rel-item`
- **CSS variables**: short abbreviations — `--sur`, `--tx2`, `--bdm`, `--grn`
- **DOM IDs**: kebab-case — `#center-inner`, `#idea-list`, `#drop-zone`
- **i18n keys**: camelCase — `noIdeaTitle`, `evalComplete`, `scoreLabelBuild`

## CSS Variables
- Luôn dùng CSS custom properties từ `:root` — KHÔNG hardcode colors
- Dark mode tự động qua `@media(prefers-color-scheme:dark)`
- Shorthand: `--r` (border-radius), `--rl` (large radius), `--fn` (font), `--mono` (monospace font)

## HTML Generation
- Render UI bằng template literals gán vào `innerHTML`
- Luôn escape user input qua `App.esc()` trước khi render
- Event binding: inline `onclick="App.method()"` cho simple actions, `addEventListener` cho complex logic

## File Structure
- `index.html` — markup skeleton + script/style refs
- `style.css` — toàn bộ styling, dark mode, responsive
- `app.js` — toàn bộ logic, i18n, AI integration
- Không có build step — files chạy trực tiếp trong browser
