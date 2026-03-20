---
description: Step-by-step guide to add a new feature to Feature Compass
---

# Add Feature

Quy trình thêm feature mới vào Feature Compass.

## Phase 1: Phân tích & Chuẩn bị

1. **Đọc context** — đọc các docs để hiểu trạng thái hiện tại:
   - `docs/ROADMAP.md` — kế hoạch phát triển, xem feature mới nằm ở phase nào
   - `docs/PROJECT_CONTEXT.md` — kiến trúc, data flow, conventions
   - `docs/KNOWN_ISSUES.md` — issues đã biết, workarounds
   - `docs/API_REFERENCE.md` — prompt structure, API hiện tại
   - `docs/USER_GUIDE.md` — UI flow hiện tại

2. **Phân tích & Recommend** — dựa trên docs đã đọc, báo lại cho user:
   - ⚠️ **Trùng lặp**: feature mới có trùng/overlap với feature đã có không? (VD: trùng 80% với feature E)
   - 🔴 **Conflict**: có conflict với logic/data/UI hiện tại không? (VD: conflict với feature B)
   - 📦 **Dependencies**: cần bổ sung lib/stack/API nào không?
   - 🏗️ **Architecture impact**: có cần thay đổi kiến trúc/data model không?
   - 📝 **Scope**: recommend scope phù hợp, tránh over-engineering
   - → **CHỜ user xác nhận** giải quyết hết các vấn đề trước khi tiếp tục

3. **Update docs trước khi code** — cập nhật docs bị ảnh hưởng bởi feature mới:
   - `docs/PROJECT_CONTEXT.md` — nếu thay đổi kiến trúc, data model, conventions
   - `docs/API_REFERENCE.md` — nếu thêm/sửa prompt, API structure
   - `docs/USER_GUIDE.md` — nếu thêm/sửa UI flow
   - → Chỉ update những file thực sự bị ảnh hưởng, không update tất cả

---

## Phase 2: Implementation

4. **Thêm i18n keys** — mở `app.js`, thêm key vào CẢ HAI `I18N.en` và `I18N.vi`
```javascript
// Tìm I18N object (đầu file app.js)
en: {
  myNewKey: 'English text',
},
vi: {
  myNewKey: 'Vietnamese text',
},
```

5. **Thêm logic** — thêm method mới vào `App` object
```javascript
// Trong App = { ... }
myNewFeature() {
  // Business logic
  this.save();
  this.renderAll(); // hoặc render cụ thể
}
```

6. **Thêm UI** — update render method phù hợp
- Header → `renderHeader()`
- Left panel → `renderList()`
- Center → `renderEval()`
- Right panel → `renderContext()`
- Modal → `openSettings()` hoặc tạo method mới

7. **Thêm CSS** (nếu cần) — thêm vào `style.css`
- Dùng CSS variables: `var(--sur)`, `var(--tx)`, `var(--grn)`, etc.
- Thêm dark mode variant nếu dùng hardcoded colors
- Thêm responsive rules nếu cần (breakpoints: 900px, 640px, 480px)

---

## Phase 3: Verification

8. **Test trong browser**
- Mở `index.html` — verify feature hoạt động
- Test light mode + dark mode
- Test responsive (thu nhỏ browser window)
- Test với cả English và Tiếng Việt
- Kiểm tra console không có errors

9. **Verify không break features cũ**
- Tạo idea mới → OK
- Chọn idea → render đúng
- Import file → extract context đúng
- Settings → save/load đúng

10. **Chạy `/task-completion`** workflow
