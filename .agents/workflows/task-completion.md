---
description: Post-task verification, commit, and push
---

# Task Completion

Chạy workflow này SAU KHI hoàn thành bất kỳ task nào có thay đổi code.

// turbo-all

## Steps

1. Verify app chạy bình thường — mở `index.html` trong browser, kiểm tra không có lỗi
```bash
# Kiểm tra syntax errors trong JavaScript
node --check app.js
```

2. Nếu có tests — chạy test suite
```bash
# Mở test runner trong browser và verify tất cả PASS
open tests/test.html
```

3. Kiểm tra không có file rác
```bash
find . -name "*.bak" -o -name "*.tmp" -o -name ".DS_Store" | head -20
```

4. Stage all changes
```bash
git add -A
```

5. Review staged changes
```bash
git diff --cached --stat
```

6. Commit với Conventional Commits format (tiếng Việt)
```bash
git commit -m "feat: mô tả ngắn gọn"
```

Format commit message:
- `feat:` — tính năng mới
- `fix:` — sửa lỗi
- `refactor:` — refactor không thay đổi behavior
- `docs:` — chỉ thay đổi docs
- `chore:` — maintenance tasks
- `test:` — thêm/sửa tests
- `style:` — thay đổi CSS/formatting

7. Push to remote
```bash
git push
```
