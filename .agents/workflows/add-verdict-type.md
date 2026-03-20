---
description: Guide to add a new verdict type to Feature Compass
---

# Add Verdict Type

Feature Compass hiện có 7 verdict types. Quy trình thêm verdict mới.

## Các file cần sửa

Tất cả trong `app.js` trừ CSS.

## Steps

1. **Thêm vào `VERDICT_CFG`** (line ~277)
```javascript
'My New Verdict': { cls:'v-mynew', pill:'pbg/ptx', icon:'⬢', color:'var(--pur)' },
```
- `cls`: CSS class cho verdict card
- `pill`: background/text color variables (format: `bgVar/textVar`)
- `icon`: Unicode icon
- `color`: CSS variable cho accent color

2. **Thêm vào `VERDICT_KEYS`** (line ~268)
```javascript
'My New Verdict': 'vMyNewVerdict',
```

3. **Thêm vào `VERDICT_DESC_KEYS`** (line ~272)
```javascript
'My New Verdict': 'vdMyNewVerdict',
```

4. **Nếu là verdict "cut" (negative)** → thêm vào `CUT_VERDICTS` (line ~287)
```javascript
const CUT_VERDICTS = ['Scope Creep','Defer Indefinitely','Redundant','My New Verdict'];
```

5. **Thêm i18n keys** — cả `en` và `vi`
```javascript
en: {
  vMyNewVerdict: 'My New Verdict',
  vdMyNewVerdict: 'Description of when this verdict applies',
},
vi: {
  vMyNewVerdict: 'Verdict mới',
  vdMyNewVerdict: 'Mô tả khi nào verdict này áp dụng',
},
```

6. **Thêm CSS** — trong `style.css`
```css
.verdict-card.v-mynew{background:var(--pbg);border:1.5px solid var(--pur)}
```

7. **Update `calcVerdict()`** (line ~796)
- Thêm condition mới vào đúng vị trí trong logic chain
- Nhớ: thứ tự conditions quan trọng — verdict ưu tiên cao hơn đặt trước

8. **Thêm override button** trong `renderEval()` (line ~564-569)
```javascript
<button class="btn-s" style="background:var(--pbg);color:var(--ptx);border-color:var(--pur)"
  onclick="App.setVerdict('My New Verdict')">⬢ ${this.t('myNewVerdictBtn')}</button>
```

9. **Update `drawQuadrant()`** (line ~984)
```javascript
const verdictColors = {
  // ... existing
  'My New Verdict': '#6F67D4',
};
```

10. **Test toàn bộ**
- Tạo idea → AI evaluate → verify verdict logic
- Override sang verdict mới → verify UI
- Portfolio view → verify quadrant rendering
- Export .md → verify verdict xuất đúng

11. **Update unit tests** — `tests/tests.js`
- Thêm test case cho `calcVerdict()` với verdict mới

12. **Chạy `/task-completion`** workflow
