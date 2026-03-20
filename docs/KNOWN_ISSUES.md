# ⚠️ Known Issues

Danh sách các issues đã biết và workaround tương ứng.

---

## Active Issues

### 1. localStorage Size Limit

**Mô tả:** Browser localStorage giới hạn ~5MB. Khi lưu quá nhiều ideas với AI results dài, có thể chạm giới hạn.

**Tác động:** `App.save()` fail silently (caught by try/catch), data mới không được persist.

**Workaround:** Export và xóa ideas cũ định kỳ.

**Giải pháp dài hạn:** Xem xét IndexedDB hoặc file-based export/import cho large datasets.

---

### 2. API Key Stored in Plain Text

**Mô tả:** API key lưu trong localStorage dưới dạng plain text, không encrypt.

**Tác động:** Bất kỳ script nào chạy trên cùng origin đều có thể đọc được.

**Workaround:** Không cài extension không tin cậy, sử dụng API key riêng cho Feature Compass.

**Giải pháp dài hạn:** Xem xét Web Crypto API để encrypt API key.

---

### 3. AI JSON Response Truncation

**Mô tả:** Với model Haiku hoặc khi idea description quá dài, AI response có thể bị cắt ngắn (hit max_tokens).

**Tác động:** JSON repair logic cố fix nhưng đôi khi fail → error "Failed to parse AI response".

**Workaround:** Giảm độ dài description hoặc dùng model Sonnet/Opus (max_tokens cao hơn).

---

### 4. No Undo/Redo

**Mô tả:** Không có chức năng undo khi xóa idea hoặc clear context.

**Tác động:** Data mất vĩnh viễn sau khi confirm delete.

**Workaround:** Export backlog trước khi xóa.

---

### 5. Single-user Only

**Mô tả:** Không có chức năng collaboration hoặc share.

**Tác động:** Mỗi browser/device có dataset riêng, không sync.

**Workaround:** Export markdown và share thủ công.

---

## Resolved Issues

_Chưa có issues nào được resolve._

---

## Reporting Issues

Khi phát hiện issue mới:

1. Kiểm tra danh sách trên xem đã có chưa
2. Ghi rõ: mô tả, steps to reproduce, expected vs actual behavior
3. Thêm vào file này theo format:
   ```markdown
   ### N. Title
   **Mô tả:** ...
   **Tác động:** ...
   **Workaround:** ...
   **Giải pháp dài hạn:** ...
   ```

---

## See Also

- [Security](./SECURITY.md) — Threat model and security mitigations
- [Architecture](./ARCHITECTURE.md) — State management and localStorage details
- [API Reference](./API_REFERENCE.md) — JSON parsing and repair logic
- [Project Context](./PROJECT_CONTEXT.md) — Design constraints behind these issues
- [Deployment](./DEPLOYMENT.md) — Production deployment considerations

