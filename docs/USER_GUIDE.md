# 📖 User Guide

## Getting Started

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)
- An [Anthropic API key](https://console.anthropic.com/) for AI evaluation (optional for manual use)

### Setup

1. Open `index.html` in your browser
2. Click **⚙ Settings** to configure:
   - **API Key** — Your Anthropic API key (`sk-ant-...`)
   - **Model** — Choose between Haiku 4.5 (fast), Sonnet 4 (balanced), or Opus 4 (most capable)
   - **Language** — English or Tiếng Việt

> **Note:** Your API key and all data are stored exclusively in your browser's `localStorage`. Nothing is sent to any server — only directly to the Anthropic API when you trigger evaluation.

---

## Core Workflow

### 1. Import Project Context (Optional but Recommended)

Before evaluating ideas, import your project documents to give AI better context:

1. In the **right panel**, drag & drop files into the drop zone (or click to browse)
2. Supported formats: `.json`, `.md`, `.txt`, `.docx`
3. After import, click **↻ Re-scan** for basic extraction or **⬡ AI Extract** for AI-powered extraction
4. The system will extract: **Features**, **Tech Stack**, **Personas**, **Decisions**

#### Recommended Documents to Import

| Document Type | Examples |
|---------------|----------|
| Product specs | PRD, feature list, roadmap |
| Architecture | Tech stack, ADRs, system design |
| User research | Personas, user stories |
| Constraints | Budget, timeline, team skills |

### 2. Capture a Feature Idea

1. Click **+ New** in the header (or **+ New idea** at bottom of left panel)
2. Enter a **title** — required for AI evaluation
3. Add a **description** — the more detail, the better AI analysis
   - What is the feature?
   - Why is it needed?
   - Who benefits?

### 3. AI Evaluation

1. Click **⬡ Evaluate with AI**
2. AI will score the idea across 4 dimensions:
   - **Impact** (0-10): Breadth × frequency × severity of benefit
   - **Fit** (0-10): Alignment with existing stack, features, personas
   - **Effort** (0-10): Resource cost to build & maintain (higher = more costly)
   - **Conflict** (0-10): Friction with existing system (higher = more friction)
3. AI also analyzes:
   - **Redundancy** — Overlap with existing features
   - **Dependencies** — Prerequisites that must be built first
   - **Stack Conflicts** — Technologies outside current stack
   - **Alternative Approaches** — Other ways to solve the problem

### 4. Understand the Verdict

The AI assigns one of 7 verdicts:

| Verdict | Meaning | Color |
|---------|---------|-------|
| ◆ **Build Now** | High impact, great fit — add to current sprint | 🟢 Green |
| → **Plan for v1.5** | Worth building — add to roadmap | 🔵 Blue |
| ⟐ **Needs Prerequisite** | Blocked by unbuilt dependencies | 🟡 Amber |
| ⚡ **Stack Conflict** | Requires tech outside current stack | 🟡 Amber |
| ≋ **Redundant** | Overlaps with existing feature | ⚫ Gray |
| ✂ **Scope Creep** | Low necessity, high effort | 🔴 Red |
| ◇ **Defer Indefinitely** | Low impact — archive | ⚫ Gray |

### 5. Override AI Verdict

If you disagree with the AI:

- **Adjust scores** — Use the sliders under each dimension to fine-tune; the verdict will recalculate automatically
- **Direct override** — Click any verdict button in the "Your Call" section to force a specific verdict

### 6. Add Notes

Add your own notes below the verdict — context the AI doesn't know (budget, strategy, team bandwidth).

---

## Portfolio View

Click **Portfolio** in the header to see all evaluated ideas on a quadrant chart:

```
                HIGH IMPACT
        ┌───────────┬───────────┐
        │   PLAN    │ BUILD NOW │
LOW FIT │           │           │ HIGH FIT
        ├───────────┼───────────┤
        │    CUT    │ NICE TO   │
        │           │   HAVE    │
        └───────────┴───────────┘
                LOW IMPACT
```

- **Dot size** reflects effort (smaller = less effort)
- **Dot color** matches verdict color

### Export Options

From the Portfolio view:
- **Export Backlog .md** — All evaluated ideas grouped by verdict
- **Conflict Report** — Ideas with stack conflicts or dependencies

### Individual Export

From any idea's detail view:
- **Export .md** — Single idea with scores, analysis, and notes

---

## Filtering Ideas

Use filter chips at the top of the left panel:

| Filter | Shows |
|--------|-------|
| **All** | All ideas |
| **Build** | Ideas with "Build Now" verdict |
| **Plan** | Ideas with "Plan for v1.5" verdict |
| **Draft** | Ideas not yet evaluated |
| **Cut** | Scope Creep, Defer, Redundant |

---

## Smart Context Panel

When an idea has been AI-evaluated, the right panel switches to **Smart Context** mode showing only the project context items relevant to that specific idea:

- **Affected Decisions** — Project decisions that constrain or support this idea
- **Related Features** — Existing features that overlap, extend, or conflict
- **Tech Involved** — Technologies used, conflicting, or needed
- **Target Personas** — User types affected
- **Tables Affected** — Database tables/schemas involved

Hover over any item to see the AI's reasoning for why it's relevant.

Click **All Project Context →** to see the full unfiltered context.

---

## Tips & Best Practices

1. **Import context first** — AI evaluation quality improves dramatically with project context
2. **Use AI Extract** — The AI-powered extraction is significantly better than basic scan for unstructured documents
3. **Write detailed descriptions** — "Add dark mode" gives poor results. "Add system-aware dark mode toggle with user preference persistence for our React dashboard" is much better
4. **Re-evaluate after context changes** — If you update project docs, re-evaluate existing ideas for updated analysis
5. **Use Notes liberally** — AI doesn't know about budget constraints, team politics, or strategic pivots

---

## Doc Generator (Tích hợp trong app)

Click tab **📄 Docs** trên header để mở Doc Generator — công cụ AI-guided tạo bộ docs dự án.

### Flow

1. **Setup** — Mô tả dự án + (tùy chọn) upload docs sẵn có
   - Upload docs → auto-skip Q&A → chuyển thẳng sang Ideas
2. **Docs Plan** — AI phân tích và đề xuất docs cần tạo (PRD, Tech Stack, Schema...)
3. **Builder** — Trả lời câu hỏi guided cho từng doc; AI tạo markdown (parallel calls)
4. **Cross-Check** — AI review tính nhất quán, thiếu thông tin, orphan references
5. **Export** — Download hoặc inject docs vào Project Context cho Ideas evaluation

### Supported Doc Types

| Doc | Description |
|-----|-------------|
| DECISIONS.md | Tech & architecture decisions |
| PRD.md | Product requirements, user stories |
| TECH_STACK.md | Technology choices & rationale |
| DATA_SCHEMA.md | Database schema design |
| API_CONTRACT.md | API endpoint specifications |
| AUTH_FLOW.md | Authentication flow |
| DEPLOYMENT.md | Deploy strategy |

