# 📡 API Reference

## App Object

The `App` object is the single entry point for all application logic. It is globally accessible and follows a singleton pattern.

---

## Public Methods

### Initialization

| Method | Description |
|--------|-------------|
| `App.init()` | Initialize app — load state, bind events, render UI |
| `App.load()` | Load state from `localStorage` (key: `fc-state`) |
| `App.save()` | Persist current state to `localStorage` |

### Idea Management

| Method | Description |
|--------|-------------|
| `App.newIdea()` | Create a new idea and select it |
| `App.select(id)` | Select an idea by ID, render eval + context |
| `App.updateField(field, value)` | Update a field on the current idea |
| `App.setVerdict(verdict)` | Manually override verdict on current idea |
| `App.deleteIdea()` | Delete current idea (with confirmation) |
| `App.getIdea()` | Get the currently selected idea object |

### AI Evaluation

| Method | Description |
|--------|-------------|
| `App.runAI()` | Run AI evaluation on current idea |
| `App.callAI(idea)` | Send idea to Anthropic API, return parsed result |
| `App.parseAIJson(text)` | Parse AI response with JSON repair fallback |
| `App.calcVerdict(scores, ai)` | Calculate verdict from scores and AI analysis |
| `App.buildContext()` | Build context string for AI prompt |

### Context Management

| Method | Description |
|--------|-------------|
| `App.handleFiles(fileList)` | Process dropped/selected files |
| `App.importFile(file)` | Import a single file (JSON/MD/TXT/DOCX) |
| `App.removeDoc(id)` | Remove a document by ID |
| `App.extractContextBasic()` | Basic context extraction (no API) |
| `App.extractContextAI()` | AI-powered context extraction |
| `App.reExtract()` | Re-run basic extraction |
| `App.aiExtract()` | Run AI extraction |
| `App.clearContext()` | Clear all imported context |

### Export

| Method | Description |
|--------|-------------|
| `App.exportIdea()` | Export current idea as `.md` |
| `App.exportAll()` | Export all evaluated ideas as backlog `.md` |
| `App.exportConflicts()` | Export conflict report `.md` |
| `App.downloadMd(name, content)` | Trigger markdown file download |

### UI

| Method | Description |
|--------|-------------|
| `App.renderAll()` | Re-render all UI components |
| `App.renderHeader()` | Update header text (i18n) |
| `App.renderFilters()` | Update filter chip labels |
| `App.renderList()` | Render idea list with current filter |
| `App.renderEval()` | Render evaluation detail panel |
| `App.renderDim(label, key, scores, ai, color, hint)` | Render a single dimension card |
| `App.renderContext()` | Render context panel (smart or full) |
| `App.renderCtxSection(titleKey, items, icon)` | Render a context section |
| `App.showPortfolio()` | Render portfolio quadrant view |
| `App.drawQuadrant(canvas, ideas)` | Draw quadrant scatter plot |
| `App.showAllContext()` | Show unfiltered context panel |

### Settings

| Method | Description |
|--------|-------------|
| `App.openSettings()` | Open settings modal |
| `App.saveSettings()` | Save settings and close modal |
| `App.closeModal()` | Close any open modal |

### Utilities

| Method | Description |
|--------|-------------|
| `App.t(key)` | Get i18n translation string |
| `App.setLang(lang)` | Change UI language ('en' or 'vi') |
| `App.toast(msg, type)` | Show toast notification ('ok', 'err', 'info') |
| `App.esc(s)` | HTML-escape a string (XSS protection) |

---

## AI API Communication

### Endpoint

```
POST https://api.anthropic.com/v1/messages
```

### Request Headers

```json
{
  "Content-Type": "application/json",
  "x-api-key": "<user-api-key>",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"
}
```

### Request Body

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4000,
  "messages": [
    {
      "role": "user",
      "content": "<evaluation-prompt>"
    }
  ]
}
```

### AI Response Schema (Evaluation)

```json
{
  "scores": {
    "impact": { "score": 0-10, "reasoning": "string" },
    "fit": { "score": 0-10, "reasoning": "string" },
    "effort": { "score": 0-10, "reasoning": "string" },
    "conflict": { "score": 0-10, "reasoning": "string" },
    "redundancy": {
      "detected": true/false,
      "overlap_with": "feature name | null",
      "percentage": 0-100,
      "reasoning": "string"
    }
  },
  "dependencies": ["string"],
  "stack_conflicts": ["string"],
  "alternative_approaches": ["string"],
  "relevant_context": {
    "decisions": [{ "item": "string", "impact": "supports|conflicts|constrains", "reason": "string" }],
    "features": [{ "item": "string", "relation": "overlaps|depends_on|extends|conflicts", "reason": "string" }],
    "tech": [{ "item": "string", "relation": "uses|conflicts|needs_new", "reason": "string" }],
    "personas": [{ "item": "string", "relation": "primary|secondary|unaffected", "reason": "string" }],
    "tables": [{ "item": "string", "relation": "reads|writes|new_table", "reason": "string" }]
  },
  "summary": "string"
}
```

### AI Response Schema (Context Extraction)

```json
{
  "features": ["string"],
  "techStack": ["string"],
  "personas": ["string"],
  "decisions": ["string"]
}
```

---

## Verdict Types

| Key | Display Name | Conditions |
|-----|-------------|------------|
| `Build Now` | ◆ Build Now | impact ≥ 7, fit ≥ 7, conflict ≤ 3 |
| `Plan for v1.5` | → Plan v1.5 | impact ≥ 6, effort ≤ 5 (or default) |
| `Needs Prerequisite` | ⟐ Prerequisite | Has dependencies, effort ≥ 5 |
| `Stack Conflict` | ⚡ Stack Conflict | Has stack conflicts, conflict ≥ 6 |
| `Redundant` | ≋ Redundant | Redundancy ≥ 70% |
| `Scope Creep` | ✂ Scope Creep | impact ≤ 4, effort ≥ 7 |
| `Defer Indefinitely` | ◇ Defer | impact ≤ 3 |

---

## Available Models

| ID | Label | Tier |
|----|-------|------|
| `claude-haiku-4-5-20251001` | Haiku 4.5 | $ (Fast & cheap) |
| `claude-sonnet-4-20250514` | Sonnet 4 | $$ (Balanced) |
| `claude-opus-4-20250514` | Opus 4 | $$$ (Most capable) |

---

## localStorage Schema

All data is stored under the key `fc-state` as a serialized JSON string. See [Architecture — State Management](./ARCHITECTURE.md#state-management) for the complete schema.

### Migration

On load, the app migrates from legacy key `feature-compass-state` to `fc-state` if found.

---

## i18n Keys

Translations are stored in the `I18N` object with two locales: `en` (English) and `vi` (Vietnamese).

### Key Categories

| Category | Example Keys |
|----------|-------------|
| Header | `tagline`, `portfolio`, `settings`, `newBtn` |
| Filters | `all`, `build`, `plan`, `draft`, `cut` |
| Capture | `featureIdea`, `titlePlaceholder`, `evalAI` |
| Verdict | `aiVerdict`, `scoreLabelCut/Defer/Plan/Build` |
| Dimensions | `impact`, `fit`, `effort`, `conflict`, `modified` |
| Analysis | `aiAnalysis`, `redundancyDetected`, `dependencies` |
| Override | `yourCall`, `buildNow`, `planV15`, `cutVerdict` |
| Context | `projectContext`, `dropFiles`, `extracted`, `features` |
| Settings | `settingsTitle`, `apiKeyLabel`, `modelLabel` |
| Toasts | `evalComplete`, `deleted`, `exported`, `aiError` |
| Smart Context | `relevantTo`, `affectedDecisions`, `relatedFeatures` |

Access any key via `App.t('keyName')`.
