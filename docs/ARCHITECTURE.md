# 🏗️ Architecture

## Overview

Feature Compass is a **single-page, client-side** application with zero server dependencies. All logic runs in the browser; the only external communication is optional AI evaluation via the Anthropic Claude API.

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ index.html│  │   app.js     │  │  style.css   │  │
│  │  (Shell)  │  │ (App Logic)  │  │ (Design Sys) │  │
│  └──────────┘  └──────┬───────┘  └──────────────┘  │
│                       │                             │
│              ┌────────┴────────┐                    │
│              │   localStorage  │                    │
│              │   (fc-state)    │                    │
│              └─────────────────┘                    │
│                       │                             │
│              ┌────────┴────────┐                    │
│              │ Anthropic API   │ ← optional         │
│              │ (Claude Models) │                    │
│              └─────────────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## Core Flow

```
Capture → AI Evaluate → User Override → Final Verdict
```

### Step-by-step:

1. **Capture** — User creates a feature idea (title + description)
2. **Context** — Project documents are imported and context is extracted (features, tech, personas, decisions)
3. **AI Evaluate** — Claude scores 4 dimensions (Impact, Fit, Effort, Conflict) and analyzes redundancy, dependencies, stack conflicts
4. **Verdict Calculation** — Algorithm maps scores + AI analysis to one of 7 verdict types
5. **User Override** — User can adjust individual scores via sliders or directly override the verdict
6. **Portfolio** — All evaluated ideas are visualized on a quadrant chart

---

## File Structure

### `index.html` (84 lines)
- Semantic HTML shell with 3-column layout
- Header with navigation, counters, action buttons
- Left panel (idea list), Center (evaluation detail), Right (project context)
- Modal and toast containers
- External dependencies: mammoth.js (CDN), Google Fonts

### `app.js` (1567 lines)
Single `App` object containing all application logic:

| Section | Lines | Responsibility |
|---------|-------|----------------|
| `I18N` | 1–266 | English + Vietnamese translation strings |
| `VERDICT_CFG` | 268–293 | Verdict metadata, colors, icons, model config |
| `App.init/load/save` | 295–369 | Initialization, localStorage persistence |
| `App.renderAll/renderList` | 319–423 | UI rendering (list, header, filters, counters) |
| `App.renderEval/renderDim` | 433–628 | Evaluation detail panel with score sliders |
| `App.runAI/callAI` | 631–777 | AI evaluation pipeline, JSON parsing with repair |
| `App.calcVerdict` | 796–813 | Verdict calculation algorithm |
| `App.newIdea/updateField/delete` | 816–865 | CRUD operations |
| `App.exportIdea/exportAll` | 868–1048 | Markdown export (individual, backlog, conflicts) |
| `App.bindDrop/handleFiles` | 1052–1086 | File import (JSON, MD, TXT, DOCX) |
| `App.extractContextAI/Basic` | 1096–1349 | Context extraction (AI-powered + basic fallback) |
| `App.renderContext` | 1351–1452 | Smart context panel (filtered vs. full view) |
| `App.openSettings/saveSettings` | 1478–1547 | Settings modal (API key, model, language) |
| `App.toast/esc` | 1549–1567 | Toast notifications, XSS escaping |

### `style.css` (234 lines)
- CSS custom properties (design tokens) for light & dark themes
- Component styles: header, panel, cards, verdict, dimensions, portfolio
- Responsive breakpoints: 900px, 640px, 480px

---

## State Management

All state is persisted in `localStorage` under key `fc-state`:

```javascript
{
  apiKey: string,           // Anthropic API key (sanitized)
  model: string,            // Claude model ID
  lang: 'en' | 'vi',        // UI language
  ideas: [
    {
      id: string,            // Unique ID ('i' + timestamp)
      title: string,
      description: string,
      scores: {              // AI-generated scores
        impact: 0-10,
        fit: 0-10,
        effort: 0-10,
        conflict: 0-10
      },
      overrides: {...},      // User-modified scores (same shape)
      aiResult: {            // Full AI response
        scores: {...},
        dependencies: string[],
        stack_conflicts: string[],
        alternative_approaches: string[],
        relevant_context: {
          decisions: [{item, impact, reason}],
          features: [{item, relation, reason}],
          tech: [{item, relation, reason}],
          personas: [{item, relation, reason}],
          tables: [{item, relation, reason}]
        },
        summary: string
      },
      verdict: string | null,
      userNotes: string,
      createdAt: number      // Unix timestamp
    }
  ],
  context: {
    documents: [{id, name, type, content, importedAt}],
    extracted: {
      features: string[],
      techStack: string[],
      personas: string[],
      decisions: string[]
    }
  }
}
```

---

## Verdict Calculation Algorithm

The `calcVerdict()` function uses a decision tree based on scores and AI analysis:

```
1. IF redundancy >= 70% → "Redundant"
2. IF stack_conflicts exist AND conflict >= 6 → "Stack Conflict"
3. IF dependencies exist AND effort >= 5 → "Needs Prerequisite"
4. IF impact >= 7 AND fit >= 7 AND conflict <= 3 → "Build Now"
5. IF impact >= 6 AND effort <= 5 → "Plan for v1.5"
6. IF impact <= 4 AND effort >= 7 → "Scope Creep"
7. IF impact <= 3 → "Defer Indefinitely"
8. DEFAULT → "Plan for v1.5"
```

### Composite Score

```
Total = impact + fit + (10 - effort) + (10 - conflict)
Max = 40
```

The bar visualization maps total to percentage with color thresholds:
- ≥ 30: Green (Build)
- ≥ 22: Blue (Plan)
- ≥ 14: Amber (Watch)
- < 14: Red (Cut)

---

## Context Extraction Pipeline

### Basic Mode (no API key required)
1. **JSON docs** — Reads structured keys (`features`, `techStack`, `personas`, `decisions`, `tables`)
2. **Text docs** — Parses headings and list items with section-aware classification
3. **Tech detection** — Regex matching for 100+ known technologies across all text
4. **Deduplication** — Normalized case-insensitive dedup

### AI Mode (requires API key)
1. Sends all document content (truncated at 4000 chars each) to Claude
2. Claude extracts structured data into 4 categories
3. Falls back to Basic mode on failure

---

## Design System (CSS Custom Properties)

### Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | `#f4f3ef` | `#0f0f0e` | Page background |
| `--sur` | `#fff` | `#1c1c1a` | Surface (cards) |
| `--tx` | `#141410` | `#e2e0d8` | Primary text |
| `--grn` | `#1D9E75` | — | Build Now / positive |
| `--blu` | `#2566B0` | — | Plan / informational |
| `--amb` | `#D48A0A` | — | Warning / prerequisite |
| `--red` | `#D94444` | — | Cut / negative |
| `--gold` | `#B8860B` | — | Accent / brand |

### Responsive Breakpoints

| Breakpoint | Change |
|-----------|--------|
| ≤ 900px | Right panel hidden |
| ≤ 640px | Left panel narrowed, center padding reduced |
| ≤ 480px | Left panel + subtitle hidden |

---

## i18n System

Simple key-value lookup with fallback:

```javascript
t(key) {
  return (I18N[this.state.lang] || I18N.en)[key] || I18N.en[key] || key;
}
```

- Primary: current language (`en` or `vi`)
- Fallback: English
- Last resort: raw key string
