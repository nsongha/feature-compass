# 🧭 Feature Compass

**Evaluate features before they hit the backlog.**

Feature Compass is a client-side web tool that helps product teams make smarter prioritization decisions using AI-powered evaluation. Drop in your project context, capture feature ideas, and get structured verdicts — all without a server.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20(Static)-orange)
![AI](https://img.shields.io/badge/AI-Anthropic%20Claude-blueviolet)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **AI Evaluation** | Scores features across 4 dimensions (Impact, Fit, Effort, Conflict) using Claude API |
| **7 Verdict Types** | Build Now, Plan v1.5, Prerequisite, Stack Conflict, Redundant, Scope Creep, Defer |
| **Smart Context** | Import `.json`, `.md`, `.txt`, `.docx` project docs — AI extracts features, tech stack, personas, decisions |
| **Portfolio Quadrant** | Visualize all evaluated ideas on an Impact × Fit scatter plot |
| **User Override** | Adjust AI scores with sliders, override verdict with one click |
| **Export** | Export individual ideas, full backlog, or conflict reports as `.md` |
| **i18n** | English 🇬🇧 and Vietnamese 🇻🇳 built-in |
| **Dark Mode** | Automatic via `prefers-color-scheme` |
| **Zero Backend** | 100% client-side, data stored in `localStorage` |

---

## 🚀 Quick Start

### 1. Clone & Open

```bash
git clone https://github.com/your-username/feature-compass.git
cd feature-compass
open index.html    # macOS
# or: xdg-open index.html (Linux) / start index.html (Windows)
```

### 2. Configure API Key

1. Click **⚙ Settings** in the header
2. Enter your [Anthropic API key](https://console.anthropic.com/)
3. Choose a model (Haiku 4.5 / Sonnet 4 / Opus 4)
4. Select language (English / Tiếng Việt)
5. Click **Save**

### 3. Capture & Evaluate

1. Click **+ New** to create a feature idea
2. Add a title and description
3. Click **⬡ Evaluate with AI** to get scores and verdict
4. Adjust scores or override the verdict as needed
5. View all ideas in the **Portfolio** quadrant

---

## 📁 Project Structure

```
feature-compass/
├── index.html          # Single-page HTML shell
├── app.js              # Application logic (1500+ lines)
├── style.css           # Design system & responsive layout
├── README.md           # This file
├── LICENSE             # MIT License
└── docs/
    ├── ARCHITECTURE.md     # System design & flow
    ├── USER_GUIDE.md       # End-user documentation
    ├── API_REFERENCE.md    # Technical API reference
    ├── DEPLOYMENT.md       # Hosting & deployment guide
    ├── CONTRIBUTING.md     # Contribution guidelines
    ├── CHANGELOG.md        # Version history
    ├── SECURITY.md         # Security considerations
    ├── PROJECT_CONTEXT.md  # Project context overview
    └── KNOWN_ISSUES.md     # Known issues & workarounds
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | Vanilla HTML5 |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Styling** | Vanilla CSS with custom properties |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |
| **AI** | Anthropic Claude API (direct browser access) |
| **DOCX Parsing** | mammoth.js (CDN) |
| **Storage** | Browser localStorage |

---

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

Requires `prefers-color-scheme` media query and CSS `color-mix()` support.

---

## 📄 License

[MIT](./LICENSE) — free for personal and commercial use.

---

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) — System design, state management, verdict logic
- [User Guide](./docs/USER_GUIDE.md) — Step-by-step usage instructions
- [API Reference](./docs/API_REFERENCE.md) — App methods, schemas, i18n keys
- [Deployment](./docs/DEPLOYMENT.md) — Hosting options & optimization
- [Contributing](./docs/CONTRIBUTING.md) — Development guidelines & PR workflow
- [Changelog](./docs/CHANGELOG.md) — Release history
- [Security](./docs/SECURITY.md) — Security model & best practices
- [Project Context](./docs/PROJECT_CONTEXT.md) — Tech stack, decisions, constraints
- [Known Issues](./docs/KNOWN_ISSUES.md) — Known issues & workarounds
