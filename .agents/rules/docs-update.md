---
description: Rules for when to update which documentation files
---

# Documentation Update Rules

## Ma trận bắt buộc

| Scenario | CHANGELOG | PROJECT_CONTEXT | API_REFERENCE | USER_GUIDE | KNOWN_ISSUES | ARCHITECTURE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Thêm feature mới | ✅ | ⚠️ | ⚠️ | ✅ | — | ⚠️ |
| Fix bug | ✅ | — | — | — | ✅ | — |
| Thêm verdict type | ✅ | — | ✅ | ✅ | — | — |
| Thay đổi prompt/AI | ✅ | — | ✅ | — | — | — |
| Refactor kiến trúc | ✅ | ✅ | — | — | — | ✅ |
| Thay đổi data model | ✅ | ✅ | ✅ | — | — | ⚠️ |
| Thay đổi CSS/UI only | ✅ | — | — | ⚠️ | — | — |

✅ = bắt buộc · ⚠️ = tùy mức độ · — = không cần

## Chi tiết từng file

### `docs/CHANGELOG.md` — BẮT BUỘC mọi commit
- Mọi thay đổi đều phải có entry trong CHANGELOG
- Dùng section `[Unreleased]` cho changes chưa release
- Format: `### Added / Changed / Fixed / Removed`
- Mô tả đủ chi tiết để người đọc hiểu scope thay đổi

### `docs/PROJECT_CONTEXT.md` — khi thay đổi kiến trúc / data model
- Cập nhật khi: thêm module mới, thay đổi data flow, thêm/sửa state schema
- Mục đích: AI agents khác đọc file này để hiểu project → thông tin sai = output sai

### `docs/API_REFERENCE.md` — khi thay đổi prompt / AI / data schema
- Cập nhật khi: sửa prompt template, thêm field vào JSON response, thay đổi API call pattern
- Mục đích: là contract giữa app và AI — phải luôn chính xác

### `docs/USER_GUIDE.md` — khi thay đổi UI flow / thêm feature
- Cập nhật khi: thêm trang mới, thêm nút, thay đổi flow người dùng
- Mục đích: end-user documentation — phải phản ánh đúng trải nghiệm thực tế

### `docs/KNOWN_ISSUES.md` — khi fix bug hoặc phát hiện issue mới
- Khi fix bug: xóa/đánh dấu resolved issue tương ứng
- Khi phát hiện issue mới chưa fix: thêm vào danh sách
- Mục đích: tránh fix lại bug đã biết, track technical debt

### `docs/ARCHITECTURE.md` — khi refactor kiến trúc
- Cập nhật khi: thêm/xóa module, thay đổi dependency graph, thay đổi build/deploy flow
- KHÔNG cần update cho feature changes nhỏ

## Quy tắc áp dụng

1. **CHANGELOG luôn bắt buộc** — không có ngoại lệ
2. **Kiểm tra ma trận trước khi commit** — xác định loại thay đổi → check cột tương ứng
3. **Khi không chắc** → update docs. Thừa docs tốt hơn thiếu docs
4. **Workflows reference rule này** — `task-completion.md`, `add-feature.md`, `add-verdict-type.md` đều phải tuân thủ
