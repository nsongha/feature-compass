---
description: Security rules for Feature Compass
---

# Security

## API Key Handling
- API key lưu trong `localStorage` (key: `fc-state`) — chỉ chạy local, KHÔNG deploy lên server
- Key được sanitize khi load: `replace(/[^\x20-\x7E]/g, '').trim()` — strip non-ASCII chars gây lỗi fetch headers
- KHÔNG bao giờ commit API key vào git
- KHÔNG log API key ra console

## XSS Prevention
- **BẮT BUỘC** dùng `App.esc(value)` cho mọi user input trước khi render vào `innerHTML`
- `esc()` dùng `document.createElement('div').textContent = s` — safe method
- KHÔNG dùng `innerHTML` với raw user data (title, description, notes, file names)
- Template literals trong `renderEval()`, `renderList()`, `renderContext()` đều phải escape

## API Communication
- Gọi Anthropic API trực tiếp từ browser qua `fetch()`
- Header `anthropic-dangerous-direct-browser-access: true` — required cho browser calls
- Luôn check `resp.ok` trước khi parse response
- Error handling: catch network errors + API errors, hiển thị qua `toast()`

## Data Storage
- Toàn bộ data (ideas, scores, context, settings) lưu trong localStorage
- Key migration: `feature-compass-state` → `fc-state` (backward compatible)
- KHÔNG gửi data lên bất kỳ server nào ngoài Anthropic API
- File imports (JSON, MD, TXT, DOCX) chỉ đọc client-side, không upload
