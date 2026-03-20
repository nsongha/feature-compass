---
description: Step-by-step guide to add a new feature to Feature Compass
---

# Add Feature

Quy trình thêm feature mới vào Feature Compass.

## Steps

1. **Thêm i18n keys** — mở `app.js`, thêm key vào CẢ HAI `I18N.en` và `I18N.vi`
```javascript
// Tìm I18N object (đầu file app.js)
en: {
  myNewKey: 'English text',
},
vi: {
  myNewKey: 'Vietnamese text',
},
```

2. **Thêm logic** — thêm method mới vào `App` object
```javascript
// Trong App = { ... }
myNewFeature() {
  // Business logic
  this.save();
  this.renderAll(); // hoặc render cụ thể
}
```

3. **Thêm UI** — update render method phù hợp
- Header → `renderHeader()`
- Left panel → `renderList()`
- Center → `renderEval()`
- Right panel → `renderContext()`
- Modal → `openSettings()` hoặc tạo method mới

4. **Thêm CSS** (nếu cần) — thêm vào `style.css`
- Dùng CSS variables: `var(--sur)`, `var(--tx)`, `var(--grn)`, etc.
- Thêm dark mode variant nếu dùng hardcoded colors
- Thêm responsive rules nếu cần (breakpoints: 900px, 640px, 480px)

5. **Test trong browser**
- Mở `index.html` — verify feature hoạt động
- Test light mode + dark mode
- Test responsive (thu nhỏ browser window)
- Test với cả English và Tiếng Việt
- Kiểm tra console không có errors

6. **Verify không break features cũ**
- Tạo idea mới → OK
- Chọn idea → render đúng
- Import file → extract context đúng
- Settings → save/load đúng

7. **Chạy `/task-completion`** workflow
