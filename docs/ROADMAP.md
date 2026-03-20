# 🗺️ Roadmap

Kế hoạch phát triển Feature Compass. Các item được sắp xếp theo mức ưu tiên trong từng phase.

> [!NOTE]
> Roadmap này là **living document** — sẽ được cập nhật khi có thay đổi ưu tiên hoặc khi hoàn thành các item.
> Dùng workflow `/add-feature` khi bắt đầu implement bất kỳ item nào.

---

## Phase 1: Stability & Data Safety 🛡️

Ưu tiên cao nhất — giải quyết các known issues ảnh hưởng trực tiếp đến trải nghiệm.

- [ ] **Data Backup & Restore** — Export/import toàn bộ data dưới dạng JSON file
- [ ] **Undo/Redo** — Undo khi xóa idea hoặc clear context (Known Issue #4)
- [ ] **localStorage overflow handling** — Warning khi gần đầy, auto-suggest export (Known Issue #1)
- [ ] **API key encryption** — Dùng Web Crypto API thay vì plain text (Known Issue #2)

---

## Phase 2: UX Improvements ✨

Nâng cao trải nghiệm người dùng hàng ngày.

- [ ] **Batch evaluation** — Đánh giá nhiều ideas cùng lúc thay vì từng cái
- [ ] **Side-by-side comparison** — So sánh 2 ideas cạnh nhau
- [ ] **Search & Filter** — Tìm kiếm idea theo tên, verdict, score range
- [ ] **Sort options** — Sắp xếp theo score, date, verdict, alphabetical
- [ ] **Keyboard shortcuts** — Phím tắt cho các thao tác thường dùng

---

## Phase 3: Analytics & Insights 📊

Giúp user ra quyết định tốt hơn dựa trên data.

- [ ] **Dashboard view** — Tổng quan portfolio: phân bố verdict, avg scores, trends
- [ ] **Priority matrix** — Ma trận Impact × Effort với quadrant labels
- [ ] **Score history** — Theo dõi thay đổi đánh giá theo thời gian
- [ ] **Conflict detection** — Tự động phát hiện ideas xung đột với nhau

---

## Phase 4: Collaboration & Sharing 🤝

Mở rộng từ single-user sang team sử dụng (Known Issue #5).

- [ ] **Share via link** — Tạo shareable URL cho individual idea hoặc full backlog
- [ ] **Export formats** — PDF, CSV ngoài markdown hiện tại
- [ ] **Team templates** — Pre-defined context templates cho team/project type

---

## Phase 5: Advanced AI 🤖

Tận dụng AI sâu hơn.

- [ ] **Multi-provider support** — Hỗ trợ OpenAI, Gemini bên cạnh Claude
- [ ] **Custom evaluation criteria** — User tự define dimensions thay vì fixed 4
- [ ] **AI re-evaluation** — Tự suggest re-evaluate khi context thay đổi
- [ ] **Natural language query** — Hỏi AI câu hỏi về portfolio ("which features conflict?")

---

## Completed ✅

- [x] Core workflow: Capture → AI Evaluate → Override → Verdict _(v1.0.0)_
- [x] 7 verdict types với color coding _(v1.0.0)_
- [x] Project context import (.json, .md, .txt, .docx) _(v1.0.0)_
- [x] Portfolio quadrant chart _(v1.0.0)_
- [x] i18n EN/VI + Dark mode + Responsive _(v1.0.0)_
- [x] Production documentation _(v1.0.0)_
