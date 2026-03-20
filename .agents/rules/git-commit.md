---
description: Rules for writing clear, detailed git commit messages
---

# Git Commit Message

## Format

```
<type>: <title mô tả ngắn gọn nhưng ĐẦY ĐỦ>

<body — chi tiết thay đổi, bắt buộc nếu > 1 file hoặc logic phức tạp>

<footer — optional: breaking changes, related issues>
```

## Title (dòng đầu tiên)

- Tiếng Việt, viết thường sau prefix
- **Tối đa 72 ký tự**
- Phải trả lời được: "commit này làm gì?"
- KHÔNG quá chung chung — `fix: sửa lỗi` ❌ vs `fix: sửa lỗi parse JSON khi AI response bị truncate` ✅

### Prefixes

| Prefix | Khi nào dùng |
|---|---|
| `feat:` | Thêm tính năng mới |
| `fix:` | Sửa bug |
| `refactor:` | Refactor không thay đổi behavior |
| `docs:` | Chỉ thay đổi documentation |
| `test:` | Thêm hoặc sửa tests |
| `chore:` | Maintenance (deps, configs, CI) |
| `style:` | CSS / formatting / không ảnh hưởng logic |

## Body (bắt đầu từ dòng 3)

**Bắt buộc khi:**
- Thay đổi > 1 file
- Thay đổi logic phức tạp
- Bug fix (phải giải thích root cause)
- Breaking changes

**Nội dung body:**
- Liệt kê files/modules bị ảnh hưởng
- Giải thích WHY (tại sao thay đổi), không chỉ WHAT
- Nếu fix bug: mô tả nguyên nhân + cách fix

## Ví dụ

### ❌ Xấu
```
feat: update app
fix: sửa lỗi
chore: misc changes
refactor: cleanup
```

### ✅ Tốt — đơn giản
```
fix: sửa lỗi XSS khi render idea title chứa HTML
```

### ✅ Tốt — có body
```
feat: thêm export portfolio sang PNG qua canvas

- Thêm App.exportPNG() trong app.js
- Thêm nút Export PNG trong renderEval()
- Thêm i18n keys: exportPng, exportPngSuccess (EN + VI)
- Dùng html2canvas CDN để capture portfolio view
```

### ✅ Tốt — fix bug có root cause
```
fix: sửa lỗi fetch thất bại khi API key có Unicode chars

Root cause: copy-paste API key từ web kèm invisible Unicode
chars (zero-width space, BOM). fetch() headers chỉ chấp nhận
ISO-8859-1, gây TypeError không rõ ràng.

Fix: thêm sanitize regex trong App.load() —
apiKey.replace(/[^\x20-\x7E]/g, '').trim()
```

## Quy tắc bổ sung
- Không commit code chưa chạy được (`node --check` phải pass)
- Không commit code có tests fail
- Mỗi commit nên là 1 đơn vị thay đổi có ý nghĩa — không gộp nhiều features vào 1 commit
- Nếu commit liên quan đến issue → ghi `Ref: #issue-number` trong footer
