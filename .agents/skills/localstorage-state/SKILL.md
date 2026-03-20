---
name: LocalStorage State Management
description: Guide for managing application state via localStorage in Feature Compass
---

# LocalStorage State Management

Feature Compass lưu toàn bộ state trong localStorage — không có backend, không có database.

## State Structure

```javascript
App.state = {
  apiKey: '',                    // Anthropic API key (sanitized)
  model: 'claude-sonnet-4-20250514',  // Selected model
  lang: 'en',                   // UI language ('en' | 'vi')
  ideas: [],                    // Array of idea objects
  context: {
    documents: [],               // Imported files (raw content)
    extracted: {                 // Parsed project context
      features: [],
      techStack: [],
      personas: [],
      decisions: []
    }
  }
}
```

## Idea Object Schema

```javascript
{
  id: 'i1710901234567',          // 'i' + Date.now()
  title: 'Feature name',
  description: 'What, why, for whom',
  scores: {                      // AI-generated scores
    impact: 7, fit: 8, effort: 4, conflict: 2
  },
  overrides: {                   // User-adjusted scores (copy of scores initially)
    impact: 7, fit: 8, effort: 4, conflict: 2
  },
  aiResult: { ... },             // Full AI response (scores, analysis, relevant_context)
  verdict: 'Build Now',          // Computed or overridden verdict
  userNotes: '',                 // Free-text notes
  createdAt: 1710901234567       // Timestamp
}
```

## Save/Load Pattern

### Save
```javascript
save() {
  try {
    localStorage.setItem('fc-state', JSON.stringify(this.state));
  } catch(e) {}
}
```
- Gọi `App.save()` sau **MỌI** mutation của `App.state`
- Silent fail — localStorage full hoặc disabled không crash app

### Load
```javascript
load() {
  // 1. Migrate old key
  const old = localStorage.getItem('feature-compass-state');
  if (old && !localStorage.getItem('fc-state')) {
    localStorage.setItem('fc-state', old);
    localStorage.removeItem('feature-compass-state');
  }
  // 2. Load + merge with defaults
  const s = localStorage.getItem('fc-state');
  if (s) this.state = { ...this.state, ...JSON.parse(s) };
  // 3. Sanitize API key
  if (this.state.apiKey) {
    this.state.apiKey = this.state.apiKey.replace(/[^\x20-\x7E]/g, '').trim();
  }
}
```

## Key Migration Strategy

- Old key: `feature-compass-state`
- New key: `fc-state`
- Migration chạy 1 lần trong `load()` — copy old → new, delete old
- Khi cần migrate schema trong tương lai, thêm logic tương tự trong `load()`

## API Key Sanitization

```javascript
raw.replace(/[^\x20-\x7E]/g, '').trim()
```

**Tại sao cần?**
- `fetch()` headers chỉ chấp nhận ISO-8859-1 characters
- Copy-paste từ web có thể kèm invisible Unicode chars
- Non-ASCII chars gây lỗi `TypeError: Failed to fetch` khó debug

## Quy tắc khi sửa state

1. **Thêm field mới vào state** → thêm default value trong `App.state` initialization
2. **Load merge** dùng `{ ...this.state, ...JSON.parse(s) }` — field mới tự có default
3. **Xóa field cũ** → không cần migration, field cũ tự bị ignore khi load
4. **Rename field** → cần migration logic trong `load()`, tương tự key migration
5. **Luôn gọi `App.save()`** sau khi thay đổi state
6. **Không mutate state** mà không save — sẽ bị mất khi refresh
