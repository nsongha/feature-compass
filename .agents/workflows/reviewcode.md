---
description: Checklist review code cho Feature Compass
---

# Code Review Checklist

Chạy workflow này khi cần review code quality của project.

## Steps

1. **Pre-check — Đọc context trước khi review**
   - Đọc `docs/PROJECT_CONTEXT.md` để hiểu kiến trúc hiện tại
   - Đọc `docs/KNOWN_ISSUES.md` để biết issue đã biết, tránh report trùng
   - Nếu phát hiện issue mới → ghi vào `KNOWN_ISSUES.md` sau khi review

2. **Architecture — Tách biệt Logic & UI**
   - Business logic KHÔNG nằm trong renderer/component hiển thị
   - Mỗi file/function chỉ làm 1 việc (Single Responsibility)
   - State mutations chỉ qua `StateModule`, rendering chỉ qua `RendererModule`
   - Không có code "bonus fix" ngoài phạm vi được yêu cầu

3. **Security — XSS & Sanitization**
   - Tất cả dynamic content trong `innerHTML` phải qua `esc()`
   - Không có inline `onclick` với user input chưa sanitize
   - API key không được log ra console

4. **Module Structure**
   - Mỗi module chỉ làm 1 việc (Single Responsibility)
   - Không có circular dependencies giữa các module
   - Entry point (`js/app.js`) chỉ orchestrate, không chứa business logic

5. **CSS Reusability**
   - Kiểm tra có lặp pattern `background:var(--xxxbg);color:var(--xxxtx)` → nên extract thành utility class `.badge-{color}`
   - Inline styles trong JS (`style="..."`) → nên chuyển thành CSS class nếu dùng > 2 lần
   - Card components (verdict, dim, idea) có thể share base class `.card` không?
   - Spacing/typography có nhất quán hay mỗi chỗ hardcode khác nhau?

6. **Error Handling**
   - `localStorage` operations có try/catch + toast cho user
   - API calls có catch + user-facing error message
   - File import có handle từng file riêng (không fail cả batch)

7. **Responsive**
   - Test ở 3 breakpoints: desktop (>900px), tablet (480-900px), phone (<480px)
   - Drawer/sheet có overlay backdrop + close on click
   - Touch targets ≥ 44px cho mobile

8. **i18n**
   - Mọi user-facing text đều dùng `t('key')`, không hardcode
   - Cả EN và VI đều có đủ keys (không thiếu translation)

9. **State Management**
   - State mutations chỉ qua `StateModule` functions
   - `save()` được gọi sau mọi state change
   - Backup/restore validate structure trước khi apply
