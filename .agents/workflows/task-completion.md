---
description: Post-task verification, commit, and push
---

# Task Completion

Chạy workflow này SAU KHI hoàn thành bất kỳ task nào có thay đổi code.

// turbo-all

## Steps

1. Verify syntax
```bash
node --check app.js
```

2. Chạy test suite (nếu có)
```bash
open tests/test.html
```
→ Verify tất cả tests PASS trong browser trước khi tiếp tục.

3. Kiểm tra file rác
```bash
find . -name "*.bak" -o -name "*.tmp" -o -name ".DS_Store" | head -20
```

4. **Update CHANGELOG** — mở `docs/CHANGELOG.md`, thêm entry mới theo format:
```markdown
## [Unreleased]
### Added / Changed / Fixed / Removed
- Mô tả thay đổi
```
- Mỗi task phải có ít nhất 1 dòng trong CHANGELOG
- Dùng section phù hợp: Added, Changed, Fixed, Removed

5. **Update docs liên quan** (nếu cần):
- `docs/KNOWN_ISSUES.md` — nếu fix bug hoặc phát hiện issue mới
- `docs/PROJECT_CONTEXT.md` — nếu thêm feature mới hoặc thay đổi kiến trúc
- `docs/API_REFERENCE.md` — nếu thay đổi API/prompt structure
- `docs/USER_GUIDE.md` — nếu thêm/sửa UI flow

6. Stage all changes
```bash
git add -A
```

7. Review staged changes
```bash
git diff --cached --stat
```

8. Commit — tuân thủ rules trong `.agents/rules/git-commit.md`
```bash
git commit -m "type: mô tả đầy đủ thay đổi"
```
- Nếu thay đổi > 1 file → **bắt buộc** dùng body (multi-line commit message)
- Xem `.agents/rules/git-commit.md` để biết format chi tiết

9. Push to remote
```bash
git push
```
