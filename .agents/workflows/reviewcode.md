---
description: Checklist review code cho Feature Compass
---

# Code Review Checklist

Chạy workflow này khi cần review code quality của project.

## Steps

1. **Security — XSS & Sanitization**
   - Tất cả dynamic content trong `innerHTML` phải qua `esc()`
   - Không có inline `onclick` với user input chưa sanitize
   - API key không được log ra console

2. **Module Structure**
   - Mỗi module chỉ làm 1 việc (Single Responsibility)
   - Không có circular dependencies giữa các module
   - Entry point (`js/app.js`) chỉ orchestrate, không chứa business logic

3. **CSS Reusability**
   - Kiểm tra có lặp pattern `background:var(--xxxbg);color:var(--xxxtx)` → nên extract thành utility class `.badge-{color}`
   - Inline styles trong JS (`style="..."`) → nên chuyển thành CSS class nếu dùng > 2 lần
   - Card components (verdict, dim, idea) có thể share base class `.card` không?
   - Spacing/typography có nhất quán hay mỗi chỗ hardcode khác nhau?

4. **Error Handling**
   - `localStorage` operations có try/catch + toast cho user
   - API calls có catch + user-facing error message
   - File import có handle từng file riêng (không fail cả batch)

5. **Responsive**
   - Test ở 3 breakpoints: desktop (>900px), tablet (480-900px), phone (<480px)
   - Drawer/sheet có overlay backdrop + close on click
   - Touch targets ≥ 44px cho mobile

6. **i18n**
   - Mọi user-facing text đều dùng `t('key')`, không hardcode
   - Cả EN và VI đều có đủ keys (không thiếu translation)

7. **State Management**
   - State mutations chỉ qua `StateModule` functions
   - `save()` được gọi sau mọi state change
   - Backup/restore validate structure trước khi apply
