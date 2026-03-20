# 📝 Changelog

All notable changes to Feature Compass are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **Git Commit Rule** (`.agents/rules/git-commit.md`): quy tắc chi tiết cho commit messages — format, body requirements, ví dụ tốt/xấu
- **CHANGELOG + docs update steps** trong `task-completion.md` workflow (steps 4-5)

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
