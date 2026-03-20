# 📝 Changelog

All notable changes to Feature Compass are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Doc Generator Integration** — tích hợp trực tiếp vào app chính thay vì standalone HTML
  - Page navigation: tabs `📄 Docs` / `💡 Ideas` trên header
  - Module `js/docgen.js` — reuse `ApiModule`, `StateModule`, `UiModule`
  - Upload docs sẵn có → auto-skip Q&A → chuyển thẳng Ideas
  - Parallel AI calls (1 call/doc) thay vì 1 call lớn — tối ưu tốc độ Step 3
  - Docs tạo ra tự động inject vào Project Context
  - i18n keys EN + VI
- **Document Impact Visualizer** — trang `🗺️ Impact Map` mới
  - Module `js/impactmap.js` — tách docs thành sections, vẽ Canvas graph
  - Node cards hiển thị từng section với edit/revert
  - AI phân tích quan hệ giữa sections (supports/conflicts/constrains)
  - Canvas Bezier edges + hover tooltip giải thích quan hệ
  - Empty state với hướng dẫn khi chưa import docs
  - i18n keys EN + VI (24 keys)

### Removed
- `doc-generator.html` standalone file

### Changed
- `index.html` — thêm page tabs, wrap body trong pages
- `style.css` — thêm ~70 lines CSS cho doc generator + ~30 lines cho Impact Map
- `js/app.js` — wire DocgenModule + ImpactMapModule, page switching logic (3 pages)
- `js/i18n.js` — thêm 24 i18n keys cho Impact Map (EN + VI)
- **Git Commit Rule** (`.agents/rules/git-commit.md`): quy tắc chi tiết cho commit messages — format, body requirements, ví dụ tốt/xấu
- **Docs Update Rule** (`.agents/rules/docs-update.md`): ma trận bắt buộc update docs theo loại thay đổi
- **CHANGELOG + docs update steps** trong `task-completion.md` workflow (steps 4-5)
- **Docs update step** trong `add-verdict-type.md` workflow (step 10)

---

## [1.0.0] — 2026-03-20

### Added

- **Core Workflow**: Capture → AI Evaluate → Override → Verdict
- **AI Evaluation**: 4-dimension scoring via Anthropic Claude API (Impact, Fit, Effort, Conflict)
- **7 Verdict Types**: Build Now, Plan v1.5, Needs Prerequisite, Stack Conflict, Redundant, Scope Creep, Defer Indefinitely
- **Score Override**: Slider controls for each dimension with real-time verdict recalculation
- **User Override**: Manual verdict selection with one-click buttons
- **Project Context Import**: Support for `.json`, `.md`, `.txt`, `.docx` files
- **Context Extraction**: Basic (regex-based) and AI-powered extraction of features, tech stack, personas, decisions
- **Smart Context Panel**: Filtered context view showing only items relevant to the selected idea
- **Portfolio Quadrant**: Canvas-based scatter plot (Impact × Fit) with color-coded verdict dots
- **Export**: Individual idea, full backlog, and conflict report as markdown files
- **3 Model Options**: Haiku 4.5 ($), Sonnet 4 ($$), Opus 4 ($$$)
- **i18n**: English and Vietnamese language support
- **Dark Mode**: Automatic via `prefers-color-scheme` media query
- **Responsive Design**: Breakpoints at 900px, 640px, 480px
- **localStorage Persistence**: All data saved locally with migration from legacy key
- **API Key Sanitization**: Strip non-ASCII characters from API key input
- **JSON Repair**: Iterative repair for truncated AI responses
- **XSS Protection**: HTML escaping via `esc()` utility function
- **Production Documentation**: README, Architecture, User Guide, API Reference, Deployment, Contributing, Security, Changelog
