---
description: No framework constraint — browser-native only
---

# No Framework

## Core Constraint
Feature Compass là **vanilla web app** — KHÔNG dùng framework, build tools, hay package manager.

## Cụ thể KHÔNG dùng
- ❌ npm, yarn, pnpm, bun
- ❌ React, Vue, Angular, Svelte, hoặc bất kỳ UI framework nào
- ❌ Webpack, Vite, esbuild, Rollup, hoặc bundler nào
- ❌ TypeScript (viết plain JavaScript)
- ❌ CSS preprocessors (Sass, Less, PostCSS)
- ❌ Tailwind CSS

## Được phép dùng
- ✅ Vanilla HTML, CSS, JavaScript
- ✅ CSS Custom Properties (variables)
- ✅ ES6+ syntax (template literals, arrow functions, async/await, destructuring)
- ✅ CDN-hosted libraries (như `mammoth.js` cho DOCX parsing)
- ✅ Browser APIs (localStorage, fetch, File API, Canvas)
- ✅ Google Fonts qua `@import url()`

## Lý do
- App chạy trực tiếp bằng `file://` protocol — mở file HTML là dùng được
- Zero setup, zero dependencies, zero build step
- Dễ maintain, dễ fork, chạy offline hoàn toàn
- Chỉ external dependency duy nhất: `mammoth.js` (CDN, optional, chỉ cho DOCX import)
