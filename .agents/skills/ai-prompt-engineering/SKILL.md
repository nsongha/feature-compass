---
name: AI Prompt Engineering
description: Guide for crafting and maintaining AI prompts used in Feature Compass evaluation and context extraction
---

# AI Prompt Engineering

Feature Compass dùng Anthropic Claude API cho 2 use cases:
1. **Feature Evaluation** (`App.callAI()`) — đánh giá feature idea
2. **Context Extraction** (`App.extractContextAI()`) — trích xuất project context từ imported docs

## Prompt Structure cho Feature Evaluation

### Template (line 669-718 trong `app.js`)
```
1. Role setup: "You are a product strategy evaluator"
2. Language instruction: Vietnamese nếu lang === 'vi'
3. PROJECT CONTEXT: output của App.buildContext()
4. FEATURE IDEA: title + description
5. 8 evaluation dimensions (internal guide)
6. 4 scored dimensions: impact, fit, effort, conflict (0-10)
7. Additional analysis: redundancy, dependencies, stack conflicts, alternatives
8. Relevant context mapping: decisions, features, tech, personas, tables
9. JSON response format (strict schema)
```

### Nguyên tắc khi sửa prompt
- Luôn giữ instruction "Return ONLY valid JSON (no markdown fences)"
- Giữ `max_tokens: 4000` cho evaluation — prompt response lớn
- Giữ `max_tokens: 2000` cho context extraction — response nhỏ hơn
- Test với cả model Haiku (rẻ, hay truncate) và Sonnet (balanced)

## JSON Response Parsing

### `App.parseAIJson(text)` — 3-tier strategy
1. **Direct parse**: `JSON.parse(text)` — nếu AI trả JSON clean
2. **Extract JSON block**: regex `/{[\s\S]*}/` — nếu AI wrap trong markdown fences
3. **Repair truncated JSON**: iterative stripping + bracket closing — nếu response bị cắt do `max_tokens`

### Repair logic (line 752-776)
```
Loop tối đa 10 lần:
  - Xóa trailing incomplete string value
  - Xóa trailing incomplete key-value pair
  - Xóa trailing incomplete object in array
  - Xóa trailing comma
Sau đó:
  - Đếm open brackets/braces chưa đóng
  - Append closing brackets/braces
```

### Khi sửa response schema
- Nếu thêm field mới vào expected JSON → update prompt template
- Nếu field optional → code phải handle `undefined` gracefully
- Test `parseAIJson()` với truncated responses (simulate bằng unit test)

## Model Selection

| Model ID | Label | Use case |
|---|---|---|
| `claude-haiku-4-5-20251001` | Haiku 4.5 | Fast & cheap, hay truncate response |
| `claude-sonnet-4-20250514` | Sonnet 4 | Default, balanced |
| `claude-opus-4-20250514` | Opus 4 | Most capable, expensive |

## Context Extraction Prompt

### `App.extractContextAI()` (line 1096-1168)
- Input: concatenated document contents (max 4000 chars/doc)
- Output: `{ features[], techStack[], personas[], decisions[] }`
- Fallback: nếu AI extraction fail → `extractContextBasic()` (regex-based)
- Deduplication: `[...new Set(array)]` sau khi parse

## Checklist khi thay đổi prompt
- [ ] Test với idea có description dài (>500 chars)
- [ ] Test với project context trống
- [ ] Test với project context lớn (nhiều documents)
- [ ] Verify JSON parse thành công với cả 3 models
- [ ] Verify i18n — response trong đúng ngôn ngữ
- [ ] Update unit tests trong `tests/tests.js` nếu response schema thay đổi
