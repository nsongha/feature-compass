# 📋 Project Context

## Overview

**Feature Compass** là công cụ đánh giá và ưu tiên feature idea cho product team, sử dụng AI (Anthropic Claude) để phân tích tự động, kết hợp với đánh giá thủ công của người dùng.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5, CSS3, JavaScript ES6+ |
| Fonts | Inter, JetBrains Mono (Google Fonts CDN) |
| DOCX Parser | mammoth.js (Cloudflare CDN) |
| AI Provider | Anthropic Claude API (Haiku 4.5 / Sonnet 4 / Opus 4) |
| Storage | Browser localStorage |
| Hosting | Static (GitHub Pages, Netlify, Vercel, etc.) |

## Architecture

- **Pattern**: Single App object, singleton
- **State management**: localStorage with JSON serialization
- **Rendering**: Direct DOM manipulation via `innerHTML` + event binding
- **i18n**: Key-value lookup with EN/VI fallback
- **Theme**: CSS custom properties with `prefers-color-scheme` media query

## Key Design Decisions

1. **Zero backend** — Giảm complexity, tăng privacy, deploy tức thì
2. **Vanilla stack** — Không framework dependency, chạy mọi nơi
3. **localStorage** — Đơn giản, không cần authentication
4. **Direct browser API access** — Dùng `anthropic-dangerous-direct-browser-access` header để gọi thẳng
5. **Single file JS** — Toàn bộ logic trong 1 file cho simplicity
6. **CSS custom properties** — Design system linh hoạt, hỗ trợ dark mode tự động

## Constraints

- localStorage giới hạn ~5MB → đủ cho hàng trăm ideas nhưng không phải unlimited
- API key lưu plain text trong localStorage → chấp nhận được cho client-side tool
- Không có real-time collaboration → single-user tool
- Không có version history → chỉ có snapshot hiện tại

## Target Users

- Product Managers evaluating feature backlogs
- Startup founders prioritizing MVP scope
- Development teams deciding build vs. defer
- Solo developers assessing personal project features
