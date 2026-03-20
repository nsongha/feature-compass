---
name: Vanilla DOM Patterns
description: Guide for rendering UI and handling events without frameworks in Feature Compass
---

# Vanilla DOM Patterns

Feature Compass render toàn bộ UI bằng vanilla JavaScript — không dùng framework hay virtual DOM.

## Core Render Pattern

### innerHTML + Template Literals
```javascript
document.getElementById('container').innerHTML = `
  <div class="card">
    <h3>${this.esc(title)}</h3>
    <p>${this.esc(description)}</p>
    <button onclick="App.doSomething('${id}')">Action</button>
  </div>
`;
```

### Render Flow
```
App.renderAll()
  ├── App.renderHeader()    — update header text theo i18n
  ├── App.renderFilters()   — update filter chip text
  ├── App.renderList()      — rebuild idea list HTML
  ├── App.renderContext()   — rebuild right panel
  └── App.renderEval()      — rebuild center panel (selected idea)
```

### Khi nào re-render
- `App.select(id)` → `renderList()` + `renderEval()` + `renderContext()`
- `App.setVerdict()` → `renderEval()` + `renderList()`
- `App.setLang()` → `renderAll()`
- Slider input → debounced `renderEval()` + `renderList()` (300ms)

## Event Binding

### Inline onclick — cho simple actions
```javascript
`<button onclick="App.newIdea()">+ New</button>`
`<button onclick="App.select('${idea.id}')">Select</button>`
`<button onclick="App.removeDoc('${doc.id}')">✕</button>`
```

### addEventListener — cho complex logic
```javascript
// Event delegation trên parent
document.getElementById('filter-row').addEventListener('click', e => {
  const btn = e.target.closest('.fchip');
  if (!btn) return;
  // handle filter change
});

// Slider input với debounce
inner.querySelectorAll('.dim-slider').forEach(sl => {
  sl.addEventListener('input', e => { /* ... */ });
});
```

### Quy tắc chọn pattern
| Scenario | Pattern |
|---|---|
| Simple click → call App method | Inline `onclick` |
| Event delegation trên list | `addEventListener` trên parent |
| Input/change cần debounce | `addEventListener` + `setTimeout` |
| Modal close on bg click | `addEventListener` check `e.target === e.currentTarget` |

## XSS Prevention — `App.esc()`

```javascript
esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
```

### BẮT BUỘC escape
- `idea.title`, `idea.description`, `idea.userNotes`
- `doc.name` (imported file names)
- `ai.summary`, `ai.scores[dim].reasoning`
- Bất kỳ string nào từ user input hoặc AI response

### KHÔNG cần escape
- i18n strings từ `App.t()` — controlled by developer
- CSS class names, HTML structure

## Dynamic Content Patterns

### Conditional rendering
```javascript
${idea.verdict ? `<div class="verdict">${this.esc(verdict)}</div>` : ''}
${scores ? `<div class="scores">...</div>` : ''}
```

### List rendering
```javascript
ideas.map(idea => `<div class="card">${this.esc(idea.title)}</div>`).join('')
```

### IIFE trong template (complex logic)
```javascript
${scores ? (() => {
  const noteKey = noteMap[v];
  return `<div>...</div>`;
})() : ''}
```

## CSS Integration

### Dùng CSS variables cho dynamic styling
```javascript
`<span style="background:var(--${pill.split('/')[0]});color:var(--${pill.split('/')[1]})">`
```

### Dark mode tự động
- CSS handles via `@media(prefers-color-scheme:dark)` — JS không cần detect
- Canvas drawing (`drawQuadrant`) check `window.matchMedia('(prefers-color-scheme:dark)').matches`

## Modal Pattern
```javascript
// Open
document.getElementById('modal-bg').classList.add('open');
// Close
document.getElementById('modal-bg').classList.remove('open');
// Close on bg click
modal.addEventListener('click', e => {
  if (e.target === e.currentTarget) App.closeModal();
});
```
