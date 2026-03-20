/* ═══════════════════════════════════════════════
   MODULE: DOCGEN — Doc Generator
   Depends on: I18nModule, UiModule, StateModule, ApiModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const DocgenModule = (() => {
  'use strict';

  const { t } = I18nModule;
  const { esc, toast } = UiModule;
  const { state, save } = StateModule;
  const { callAnthropic, parseAIJson } = ApiModule;

  const DOC_TYPES = {
    decisions:    { name:'DECISIONS.md',    icon:'⚡', desc:'Tech & architecture decisions' },
    prd:          { name:'PRD.md',          icon:'📋', desc:'Product Requirements — features, user stories' },
    tech_stack:   { name:'TECH_STACK.md',   icon:'🔧', desc:'Technology choices & rationale' },
    data_schema:  { name:'DATA_SCHEMA.md',  icon:'🗄️', desc:'Database schema design' },
    api_contract: { name:'API_CONTRACT.md', icon:'🔌', desc:'API endpoint specifications' },
    auth_flow:    { name:'AUTH_FLOW.md',    icon:'🔐', desc:'Authentication & authorization flow' },
    deployment:   { name:'DEPLOYMENT.md',   icon:'🚀', desc:'Deploy strategy — hosting, CI/CD' },
  };

  /** Ensure docgen sub-state exists */
  function ensureState() {
    if (!state.docgen) {
      state.docgen = {
        projectDesc: '', analysis: null, selectedDocs: [],
        docs: {}, crossCheck: null, currentStep: 1, currentDoc: null,
        uploadedDocs: [], depGraph: {}, _generating: {}
      };
    }
    // Backfill for older saved state
    if (!state.docgen.depGraph) state.docgen.depGraph = {};
    if (!state.docgen._generating) state.docgen._generating = {};
  }

  // ── BUSY FLAG ── prevents navigation during AI calls
  let _busy = false;
  function setBusy(v) { _busy = v; }

  /** Check if a doc is unlocked (all deps completed with markdown) */
  function isUnlocked(d, key) {
    const deps = d.depGraph[key] || [];
    return deps.every(dep => d.docs[dep]?.markdown);
  }

  /** Check if doc has all Q&A answered */
  function isAllAnswered(doc) {
    if (!doc?.sections?.length) return false;
    return doc.sections.every(s => doc.answers[s.id] != null);
  }

  /** Get completed markdown context from finished docs */
  function getCompletedDocsContext(d) {
    return Object.entries(d.docs)
      .filter(([, v]) => v.markdown)
      .map(([k, v]) => `--- ${DOC_TYPES[k]?.name} ---\n${v.markdown}`)
      .filter(Boolean).join('\n\n');
  }

  /** Get docgen state shortcut */
  function dg() { ensureState(); return state.docgen; }

  // ── RENDERING ──

  function render() {
    const el = document.getElementById('docgen-page');
    if (!el) return;
    ensureState();
    const d = dg();

    el.innerHTML = `
      <div class="dg-wrap">
        ${renderStepNav(d)}
        <div id="dg-step-content">${renderStep(d)}</div>
      </div>
    `;
    updateProgress(d);
  }

  function renderStepNav(d) {
    const steps = [
      { n:1, label: t('dgSetup') },
      { n:2, label: t('dgPlan') },
      { n:3, label: t('dgBuilder') },
      { n:4, label: t('dgCrossCheck') },
    ];
    return `<div class="dg-steps-nav">${steps.map(s => {
      const active = s.n === d.currentStep;
      const done = stepDone(d, s.n);
      const can = canGoStep(d, s.n);
      const cls = active ? ' active' : done ? ' done' : !can ? ' locked' : '';
      return `<div class="dg-step-tab${cls}" 
        ${can && !_busy ? `onclick="App.dgGoStep(${s.n})"` : ''} 
        ${can && !_busy ? 'style="cursor:pointer"' : 'style="pointer-events:none;opacity:.5"'}
        ${!can ? `title="${esc(t('dgStepLocked'))}"` : ''}>${s.n}. ${esc(s.label)}${done ? ' ✓' : ''}</div>`;
    }).join('')}</div>`;
  }

  /** Check if step prerequisites are met */
  function canGoStep(d, n) {
    if (n === 1) return true;
    if (n === 2) return !!(d.analysis || d.uploadedDocs?.length);
    if (n === 3) return !!(d.selectedDocs.length || d.uploadedDocs?.length);
    if (n === 4) return d.selectedDocs.some(k => d.docs[k]?.markdown);
    return false;
  }

  /** Check if a step is fully completed */
  function stepDone(d, n) {
    if (n === 1) return !!(d.analysis || d.uploadedDocs?.length);
    if (n === 2) return d.selectedDocs.length > 0 && d.currentStep > 2;
    if (n === 3) return d.selectedDocs.every(k => d.docs[k]?.markdown);
    if (n === 4) return !!d.crossCheck;
    return false;
  }

  function renderStep(d) {
    switch (d.currentStep) {
      case 1: return renderSetup(d);
      case 2: return renderDocsPlan(d);
      case 3: return renderBuilder(d);
      case 4: return renderCrossCheck(d);
      default: return renderSetup(d);
    }
  }

  // ── STEP 1: SETUP ──
  function renderSetup(d) {
    return `
      <div class="sec" style="max-width:640px">
        <div class="sec-label">${esc(t('dgDescLabel'))}</div>
        <textarea class="idea-input" id="dg-proj-desc" rows="5" 
          placeholder="${esc(t('dgDescPlaceholder'))}" 
          style="resize:vertical;min-height:100px;line-height:1.6">${esc(d.projectDesc || '')}</textarea>
        <div style="font-size:10px;color:var(--tx3);margin-top:4px">${esc(t('dgDescHint'))}</div>
      </div>

      <div class="sec" style="max-width:640px">
        <div class="sec-label">${esc(t('dgUploadLabel'))}</div>
        <div class="drop-zone" id="dg-upload-zone" style="margin-bottom:8px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div class="drop-zone-text">${esc(t('dgUploadText'))}</div>
          <div class="drop-zone-hint">.md .txt .json .docx</div>
          <input type="file" id="dg-file-input" multiple accept=".md,.txt,.json,.docx,.markdown" style="display:none">
        </div>
        ${d.uploadedDocs?.length ? `
          <div style="margin-bottom:8px">
            ${d.uploadedDocs.map((doc, i) => `
              <div class="doc-item">
                <div class="doc-icon md">MD</div>
                <div class="doc-name">${esc(doc.name)}</div>
                <button class="doc-del" onclick="App.dgRemoveUpload(${i})" title="Remove">✕</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;max-width:640px">
        ${d.uploadedDocs?.length ? `<button class="btn-s btn-gold" onclick="App.dgSkipWithUploads()">${esc(t('dgSkipWithDocs'))} →</button>` : ''}
        <button class="btn-s btn-p" onclick="App.dgAnalyze()" id="dg-btn-analyze" 
          ${!state.apiKey ? 'disabled title="' + esc(t('setApiKey')) + '"' : ''}>${esc(t('dgAnalyzeBtn'))}</button>
      </div>
    `;
  }

  // ── STEP 2: DOCS PLAN ──
  function renderDocsPlan(d) {
    const a = d.analysis;
    if (!a) return `<div class="empty-state" style="height:40vh"><p>${esc(t('dgNoPlan'))}</p></div>`;
    const prioColors = { critical: 'var(--rbg);color:var(--rtx)', important: 'var(--abg);color:var(--atx)', nice_to_have: 'var(--sur2);color:var(--tx3)' };

    return `
      <div class="sec" style="max-width:640px">
        <div class="sec-label">AI Analysis</div>
        <div style="font-size:13px;line-height:1.6">${esc(a.project_summary || '')}</div>
        ${a.notes ? `<div style="font-size:11px;color:var(--tx2);margin-top:8px;padding-top:8px;border-top:0.5px solid var(--bd)">💡 ${esc(a.notes)}</div>` : ''}
      </div>

      <div style="font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--tx3);margin-bottom:8px;max-width:640px">${esc(t('dgDocsToggle'))}</div>
      <div style="max-width:640px">
        ${(a.recommended_docs || []).map(r => {
          const dt = DOC_TYPES[r.key]; if (!dt) return '';
          const sel = d.selectedDocs.includes(r.key);
          return `<div class="dg-doc-card${sel?' selected':''}" onclick="App.dgToggleDoc('${r.key}')">
            <div class="dg-doc-toggle">${sel?'✓':''}</div>
            <div class="dg-doc-info">
              <div class="dg-doc-name">${dt.icon} ${dt.name}</div>
              <div class="dg-doc-desc">${esc(r.reason)}</div>
            </div>
            <span class="ic-verdict" style="background:${prioColors[r.priority] || prioColors.nice_to_have}">${r.priority}</span>
          </div>`;
        }).join('')}
      </div>

      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:16px;max-width:640px">
        <button class="btn-s" onclick="App.dgGoStep(1)">← ${esc(t('dgBack'))}</button>
        <button class="btn-s btn-p" onclick="App.dgStartBuilder()" id="dg-btn-build">${esc(t('dgStartBuild'))} →</button>
      </div>
    `;
  }

  // ── STEP 3: BUILDER ──
  function renderBuilder(d) {
    if (!d.selectedDocs.length) return `<div class="empty-state" style="height:40vh"><p>${esc(t('dgNoDocsSelected'))}</p></div>`;

    // Check if ALL docs are completed
    const allDocsDone = d.selectedDocs.every(k => d.docs[k]?.markdown);
    if (allDocsDone) return renderBuilderComplete(d);

    const navItems = d.selectedDocs.map(k => {
      const dt = DOC_TYPES[k];
      const doc = d.docs[k];
      const done = doc?.markdown ? true : false;
      const hasQuestions = doc?.sections?.length > 0;
      const locked = !isUnlocked(d, k);
      const generating = d._generating[k];
      const active = d.currentDoc === k;
      const deps = d.depGraph[k] || [];
      const missingDeps = deps.filter(dep => !d.docs[dep]?.markdown).map(dep => DOC_TYPES[dep]?.name || dep);
      // Clickable only if unlocked AND has questions ready
      const clickable = !locked && hasQuestions && !generating;

      let statusIcon = '';
      let cls = '';
      if (done) { statusIcon = ''; cls = ' done'; }
      else if (generating) { statusIcon = ' ⏳'; cls = ' generating'; }
      else if (locked) { statusIcon = ' 🔒'; cls = ' locked'; }
      else if (!hasQuestions) { statusIcon = ' ⏳'; cls = ' generating'; } // unlocked but no questions yet

      const tooltip = locked && missingDeps.length
        ? ` title="${esc(t('dgNeedsBefore'))}: ${esc(missingDeps.join(', '))}"`
        : (!clickable && !locked ? ` title="${esc(t('dgGeneratingQs'))}"` : '');

      return `<button class="dg-nav-item${active?' active':''}${cls}"
        ${clickable ? `onclick="App.dgSelectDoc('${k}')"` : 'disabled'}${tooltip}>
        <span class="dg-nav-dot"></span>${dt?.icon || ''} ${dt?.name || k}${statusIcon}
      </button>`;
    }).join('');

    return `
      <div class="dg-builder-layout">
        <div class="dg-builder-sidebar">${navItems}</div>
        <div class="dg-builder-main" id="dg-builder-main">${renderDocContent(d)}</div>
      </div>
    `;
  }

  function renderDocContent(d) {
    const key = d.currentDoc;
    if (!key) return `<div class="empty-state" style="height:40vh"><p>${esc(t('dgSelectDoc'))}</p></div>`;

    // Locked doc
    if (!isUnlocked(d, key)) {
      const deps = (d.depGraph[key] || []).filter(dep => !d.docs[dep]?.markdown);
      const depNames = deps.map(dep => DOC_TYPES[dep]?.name || dep);
      return `<div class="empty-state" style="height:40vh">
        <div style="font-size:32px;margin-bottom:8px">🔒</div>
        <h2>${esc(t('dgLocked'))}</h2>
        <p>${esc(t('dgNeedsBefore'))}: <strong>${esc(depNames.join(', '))}</strong></p>
      </div>`;
    }

    const doc = d.docs[key];
    const dt = DOC_TYPES[key];
    if (!doc || !doc.sections) {
      const completedCount = d.selectedDocs.filter(k => d.docs[k]?.markdown).length;
      const total = d.selectedDocs.length;
      return `<div class="dg-loading-state">
        <svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" style="width:36px;height:36px"><circle cx="12" cy="12" r="10" opacity=".2"/><path d="M12 2a10 10 0 019.5 7"/></svg>
        <div class="dg-loading-title">${dt?.icon || ''} ${esc(t('dgGeneratingQs'))}</div>
        <div class="dg-loading-doc">${esc(dt?.name || key)}</div>
        <div class="dg-loading-hint">${esc(t('dgLoadingHint'))}</div>
        ${completedCount > 0 ? `<div class="dg-loading-progress">${completedCount}/${total} ${esc(t('dgDocsCompleted'))}</div>` : ''}
      </div>`;
    }

    const sections = doc.sections;
    // Find first unanswered index for auto-expand
    const firstUnanswered = sections.findIndex(s => doc.answers[s.id] == null);

    let html = `<div style="font-size:15px;font-weight:600;margin-bottom:3px">${dt?.icon || ''} ${doc.title || dt?.name}</div>
      <div style="font-size:11px;color:var(--tx2);margin-bottom:14px">${sections.length} ${esc(t('dgDecisions'))}</div>`;

    sections.forEach((sec, i) => {
      const answered = doc.answers[sec.id] != null;
      const isExpanded = !answered || i === firstUnanswered || d._expandedQ === sec.id;
      const selectedOpt = answered ? sec.options?.[doc.answers[sec.id]] : null;
      const tagColors = { recommended: 'background:var(--gbg);color:var(--gtx)', alternative: 'background:var(--abg);color:var(--atx)', advanced: 'background:var(--bbg);color:var(--btx)' };

      if (answered && !isExpanded) {
        // Collapsed answered question — click to expand
        html += `<div class="dg-q-collapsed" onclick="App.dgExpandQ('${sec.id}')">
          <span class="dg-q-check">✓</span>
          <span class="dg-q-collapsed-title">${esc(t('dgQuestion'))} ${i+1}: ${esc(sec.question)}</span>
          <span class="dg-q-collapsed-answer">${esc(selectedOpt?.label || '—')}</span>
        </div>`;
        return;
      }

      html += `<div class="sec" id="dg-q-${sec.id}">
        <div class="sec-label">${esc(t('dgQuestion'))} ${i+1}/${sections.length}${answered ? ' · ✓' : ''}</div>
        <div style="font-size:13px;font-weight:500;line-height:1.5;margin-bottom:12px">${esc(sec.question)}</div>
        ${sec.context ? `<div style="font-size:11px;color:var(--tx2);margin-bottom:10px;line-height:1.5">💡 ${esc(sec.context)}</div>` : ''}
        <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
          ${(sec.options || []).map((opt, oi) => {
            const sel = doc.answers[sec.id] === oi;
            return `<div class="dg-q-opt${sel?' sel':''}" onclick="App.dgAnswer('${key}','${sec.id}',${oi})">
              <div class="dg-q-radio"><div class="dg-q-rdot"></div></div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500;line-height:1.4">${esc(opt.label)}</div>
                ${opt.desc ? `<div style="font-size:11px;color:var(--tx2);margin-top:2px;line-height:1.45">${esc(opt.desc)}</div>` : ''}
                ${opt.tag ? `<span class="ic-verdict" style="${tagColors[opt.tag] || tagColors.alternative};font-size:9px;margin-top:3px;display:inline-block">${opt.tag}</span>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
        <textarea class="notes-area" rows="2" placeholder="${esc(t('dgNoteHint'))}" 
          oninput="App.dgSetNote('${key}','${sec.id}',this.value)" 
          style="min-height:40px;font-size:11px">${esc(doc.notes?.[sec.id] || '')}</textarea>
      </div>`;
    });

    const allAnswered = isAllAnswered(doc);
    if (!doc.markdown) {
      html += `<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button class="btn-s btn-p" onclick="App.dgGenerateMarkdown('${key}')" ${!allAnswered?'disabled':''}>${allAnswered ? esc(t('dgGenerate')) : esc(t('dgAnswerAll'))}</button>
      </div>`;
    }

    if (doc.markdown) {
      html += `<div class="dg-preview-done">
        <div class="dg-preview-header">
          <span class="dg-preview-badge">✅ ${esc(dt?.name)} ${esc(t('dgDone'))}</span>
          <div style="display:flex;gap:6px">
            <button class="btn-s" onclick="App.dgCopyDoc('${key}')">${esc(t('dgCopy'))}</button>
            <button class="btn-s" onclick="App.dgDownloadDoc('${key}')">${esc(t('dgDownload'))}</button>
            <button class="btn-s btn-p" onclick="App.dgGenerateMarkdown('${key}')">${esc(t('dgRegenerate'))}</button>
          </div>
        </div>
        <pre class="dg-md-pre">${esc(doc.markdown)}</pre>
      </div>`;
    }
    return html;
  }

  /** Completion summary — shown when ALL docs have markdown */
  function renderBuilderComplete(d) {
    const total = d.selectedDocs.length;
    const totalSize = d.selectedDocs.reduce((s, k) => s + new Blob([d.docs[k]?.markdown || '']).size, 0);
    const sizeLabel = totalSize > 1024 ? (totalSize / 1024).toFixed(1) + 'KB' : totalSize + 'B';

    const cards = d.selectedDocs.map(k => {
      const dt = DOC_TYPES[k];
      const doc = d.docs[k];
      const sz = new Blob([doc?.markdown || '']).size;
      const szLabel = sz > 1024 ? (sz / 1024).toFixed(1) + 'KB' : sz + 'B';
      return `<div class="dg-complete-card">
        <div class="dg-complete-card-info">
          <span class="dg-complete-card-icon">${dt?.icon || ''}</span>
          <div>
            <div class="dg-complete-card-name">${esc(dt?.name || k)}</div>
            <div class="dg-complete-card-size">${szLabel}</div>
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button class="btn-s" onclick="App.dgCopyDoc('${k}')">${esc(t('dgCopy'))}</button>
          <button class="btn-s" onclick="App.dgDownloadDoc('${k}')">${esc(t('dgDownload'))}</button>
          <button class="btn-s" onclick="App.dgSelectDoc('${k}');App.dgGoStep(3)" style="font-size:10px">${esc(t('imEdit'))}</button>
        </div>
      </div>`;
    }).join('');

    return `<div class="dg-complete-wrap">
      <div class="dg-complete-header">
        <div style="font-size:32px">🎉</div>
        <h2>${esc(t('dgAllDone'))}</h2>
        <p>${total} ${esc(t('dgDocFiles'))} · ${sizeLabel} ${esc(t('dgTotal'))}</p>
      </div>
      <div class="dg-complete-cards">${cards}</div>
      <div class="dg-complete-actions">
        <button class="btn-s btn-p" onclick="App.dgDownloadAll()">⬇ ${esc(t('dgDownloadAll'))}</button>
        <button class="btn-s btn-gold" onclick="App.dgGoStep(4)">→ ${esc(t('dgCrossCheck'))}</button>
        <button class="btn-s btn-gold" onclick="App.dgInjectToContext()">⚡ ${esc(t('dgInjectContext'))}</button>
      </div>
    </div>`;
  }

  /** Expand a collapsed question */
  function expandQ(secId) {
    const d = dg();
    d._expandedQ = secId;
    const main = document.getElementById('dg-builder-main');
    if (main) main.innerHTML = renderDocContent(d);
  }

  // ── STEP 4: CROSS CHECK ──
  function renderCrossCheck(d) {
    const cc = d.crossCheck;
    const hasDocs = d.selectedDocs.some(k => d.docs[k]?.markdown);

    let resultHtml = '';
    if (cc) {
      const icons = { error: '❌', warning: '⚠️', info: 'ℹ️' };
      const cls = { error: 'color:var(--red)', warning: 'color:var(--amb)', info: 'color:var(--grn)' };
      const issues = cc.issues || [];
      resultHtml = `
        <div class="sec" style="max-width:640px">
          <div style="font-size:13px;line-height:1.6">${esc(cc.summary || '')}</div>
          <div style="font-size:11px;color:var(--tx2);margin-top:6px">${issues.length} issues</div>
        </div>
        ${issues.length === 0 ? `<div class="sec" style="max-width:640px"><span style="color:var(--grn)">✅</span> ${esc(t('dgAllConsistent'))}</div>` : ''}
        ${issues.map(i => `<div class="sec" style="max-width:640px;display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.5">
          <span style="${cls[i.severity] || ''}">${icons[i.severity] || '•'}</span>
          <div style="flex:1">
            <strong>${esc(i.doc || '')}</strong> — ${esc(i.description || '')}
            ${i.suggestion ? `<div style="font-size:11px;color:var(--tx2);margin-top:2px">💡 ${esc(i.suggestion)}</div>` : ''}
          </div>
        </div>`).join('')}`;
    } else {
      resultHtml = `<div class="empty-state" style="height:30vh"><p>${esc(t('dgCrossCheckHint'))}</p></div>`;
    }

    return `
      ${resultHtml}
      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:16px;max-width:640px">
        <button class="btn-s" onclick="App.dgGoStep(3)">← ${esc(t('dgBuilder'))}</button>
        <div style="display:flex;gap:8px">
          <button class="btn-s btn-p" onclick="App.dgRunCrossCheck()" id="dg-btn-crosscheck" ${!hasDocs?'disabled':''}>${esc(t('dgRunCheck'))}</button>
          <button class="btn-s btn-gold" onclick="App.dgGoStep(5)">${esc(t('dgExport'))} →</button>
        </div>
      </div>
    `;
  }

  // ── STEP 5: EXPORT ──
  function renderExport(d) {
    const cards = d.selectedDocs.map(k => {
      const dt = DOC_TYPES[k];
      const doc = d.docs[k];
      const md = doc?.markdown || '';
      const size = new Blob([md]).size;
      return `<div class="sec" style="max-width:640px;display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div>
          <div style="font-size:13px;font-weight:500">${dt?.icon || ''} ${dt?.name || k}</div>
          <div style="font-size:11px;color:var(--tx3)">${md ? (size > 1024 ? (size/1024).toFixed(1)+'KB' : size+'B') : t('dgNotGenerated')}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-s" onclick="App.dgCopyDoc('${k}')" ${!md?'disabled':''}>Copy</button>
          <button class="btn-s" onclick="App.dgDownloadDoc('${k}')" ${!md?'disabled':''}>Download</button>
        </div>
      </div>`;
    }).join('');

    return `
      <div style="font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--tx3);margin-bottom:8px;max-width:640px">${esc(t('dgGenDocs'))}</div>
      ${cards}
      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:16px;max-width:640px">
        <button class="btn-s" onclick="App.dgGoStep(4)">← ${esc(t('dgCrossCheck'))}</button>
        <div style="display:flex;gap:8px">
          <button class="btn-s btn-p" onclick="App.dgDownloadAll()">${esc(t('dgDownloadAll'))}</button>
          <button class="btn-s btn-gold" onclick="App.dgInjectToContext()">${esc(t('dgInjectContext'))} →</button>
        </div>
      </div>
    `;
  }

  // ── ACTIONS ──

  function goStep(n) {
    if (_busy) return; // Block navigation during AI calls
    const d = dg();
    if (!canGoStep(d, n)) return;
    d.currentStep = n;
    save();
    render();
  }

  function updateProgress(d) {
    const bar = document.getElementById('dg-progress');
    const lbl = document.getElementById('dg-progress-lbl');
    if (!bar || !lbl) return;
    const total = d.selectedDocs.length || 1;
    let done = 0;
    d.selectedDocs.forEach(k => { if (d.docs[k]?.markdown) done++; });
    const pct = Math.round(done / total * 100);
    bar.style.width = pct + '%';
    lbl.textContent = done + '/' + total;
  }

  async function analyze() {
    const d = dg();
    const desc = document.getElementById('dg-proj-desc')?.value?.trim() || '';
    if (!desc || desc.length < 20) { toast(t('dgDescTooShort'), 'err'); return; }
    if (!state.apiKey) { toast(t('setApiKey'), 'err'); return; }
    d.projectDesc = desc;
    // Clear old docs to prevent stale content from previous projects
    d.docs = {};
    d.crossCheck = null;
    d.currentDoc = null;
    d._generating = {};
    save();

    setBusy(true);
    const btn = document.getElementById('dg-btn-analyze');
    if (btn) { btn.disabled = true; btn.textContent = t('dgAnalyzing'); }

    try {
      const text = await callAnthropic(state.apiKey, state.model, `You are a senior software architect helping plan project documentation.

PROJECT DESCRIPTION:
${desc}

Analyze this project and recommend which documentation files are needed. Choose from these types:
- decisions: Tech & architecture decisions
- prd: Product Requirements Document
- tech_stack: Technology choices & rationale
- data_schema: Database schema design
- api_contract: API endpoint specifications
- auth_flow: Authentication & authorization flow
- deployment: Deployment strategy

IMPORTANT: Also determine the creation order and dependency graph. Some docs must be completed before others (e.g. painpoints/decisions before PRD, PRD before data_schema). A doc should list its dependencies — docs that should be completed first to provide context.

Return ONLY valid JSON (no markdown fences):
{
  "project_summary": "<2-3 sentence summary>",
  "recommended_docs": [
    { "key": "<doc type key>", "reason": "<why needed>", "priority": "critical|important|nice_to_have" }
  ],
  "suggested_order": ["<doc key in recommended creation order, dependencies first>"],
  "dependency_graph": {
    "<doc_key>": ["<dependency_doc_key>", ...]
  },
  "notes": "<any important observations>"
}`, 4000);

      const result = parseAIJson(text);
      d.analysis = result;
      d.selectedDocs = result.suggested_order || result.recommended_docs.map(r => r.key);
      d.depGraph = result.dependency_graph || {};
      save();
      goStep(2);
      toast(t('dgAnalysisDone'), 'ok');
    } catch (e) {
      toast(t('aiError') + e.message, 'err');
    }
    if (btn) { btn.disabled = false; btn.textContent = t('dgAnalyzeBtn'); }
    setBusy(false);
  }

  function toggleDoc(key) {
    const d = dg();
    const idx = d.selectedDocs.indexOf(key);
    if (idx >= 0) d.selectedDocs.splice(idx, 1);
    else d.selectedDocs.push(key);
    save();
    render();
  }

  async function startBuilder() {
    const d = dg();
    if (!d.selectedDocs.length) { toast(t('dgNoDocsSelected'), 'err'); return; }
    setBusy(true);

    // Find docs that are unlocked (deps met) and not yet generated
    const unlocked = d.selectedDocs.filter(k => !d.docs[k] && isUnlocked(d, k));

    if (unlocked.length) {
      toast(t('dgGeneratingQs'), 'ok');
      await generateForDocs(unlocked);
    }

    // Auto-select first unlocked doc
    if (!d.currentDoc || !isUnlocked(d, d.currentDoc)) {
      d.currentDoc = d.selectedDocs.find(k => isUnlocked(d, k) && d.docs[k]) || d.selectedDocs[0];
    }
    goStep(3);
    setBusy(false);
  }

  /** Generate questions for a list of docs (PARALLEL) */
  async function generateForDocs(keys) {
    const d = dg();
    const prevDocs = getCompletedDocsContext(d);

    // Mark as generating
    keys.forEach(k => { d._generating[k] = true; });
    render();

    const promises = keys.map(key => generateDocSections(key, d.projectDesc, prevDocs));
    const results = await Promise.allSettled(promises);
    results.forEach((r, i) => {
      delete d._generating[keys[i]];
      if (r.status === 'fulfilled' && r.value) {
        d.docs[keys[i]] = r.value;
      } else if (r.status === 'rejected') {
        toast(`${DOC_TYPES[keys[i]]?.name}: ${r.reason?.message || 'Error'}`, 'err');
      }
    });
    save();
    render();
  }

  async function generateDocSections(key, projectDesc, prevDocs) {
    const dt = DOC_TYPES[key];
    const text = await callAnthropic(state.apiKey, state.model, `You are a senior architect helping create project documentation step by step.

PROJECT: ${projectDesc}
${prevDocs ? `\nALREADY COMPLETED DOCS (use these for context, reference them where relevant):\n${prevDocs}\n` : ''}

For the document type "${dt.name}" (${dt.desc}), generate ONLY the key decisions that genuinely need human input. Follow these rules:
- Ask ONLY questions where the answer is NOT obvious from the project description or completed docs
- If a decision was already made in a previous doc, DO NOT ask it again
- Simple projects need fewer questions (2-3), complex projects may need more (up to 8)
- Each question must have 2-4 distinct options with real tradeoffs
- Skip trivially obvious choices (e.g. don't ask "should we use version control?" or "should we have error handling?")
- Questions should be SPECIFIC to this project, not generic boilerplate

Return ONLY valid JSON (no markdown fences):
{
  "title": "<document title>",
  "sections": [
    {
      "id": "<unique_id>",
      "question": "<specific question requiring a real decision>",
      "context": "<why this matters for THIS project, 1-2 sentences>",
      "options": [
        { "label": "<option name>", "desc": "<description with tradeoff>", "tag": "recommended|alternative|advanced" }
      ]
    }
  ]
}`, 4000);
    const result = parseAIJson(text);
    return { ...result, answers: {}, notes: {}, markdown: '' };
  }

  function selectDoc(key) {
    const d = dg();
    if (!isUnlocked(d, key)) return; // Can't select locked doc
    d.currentDoc = key;
    d._expandedQ = null;
    save();
    render();
  }

  function answer(docKey, secId, optIdx) {
    const d = dg();
    if (!d.docs[docKey]) return;
    d.docs[docKey].answers[secId] = optIdx;
    d._expandedQ = null; // Reset expanded, let auto-expand find next unanswered
    save();
    // Re-render only builder main
    const main = document.getElementById('dg-builder-main');
    if (main) main.innerHTML = renderDocContent(d);
    updateProgress(d);
  }

  function setNote(docKey, secId, val) {
    const d = dg();
    if (!d.docs[docKey]) return;
    if (!d.docs[docKey].notes) d.docs[docKey].notes = {};
    d.docs[docKey].notes[secId] = val;
    save();
  }

  async function generateMarkdown(docKey) {
    const d = dg();
    const doc = d.docs[docKey];
    const dt = DOC_TYPES[docKey];
    if (!doc || _busy) return;

    const answersSummary = doc.sections.map(sec => {
      const opt = sec.options?.[doc.answers[sec.id]];
      const note = doc.notes?.[sec.id];
      return `Q: ${sec.question}\nA: ${opt?.label || 'Custom'} — ${opt?.desc || ''}${note ? '\nNote: ' + note : ''}`;
    }).join('\n\n');

    const otherDocs = Object.entries(d.docs)
      .filter(([k]) => k !== docKey && d.docs[k]?.markdown)
      .map(([k, v]) => `--- ${DOC_TYPES[k]?.name} ---\n${v.markdown}`)
      .join('\n\n');

    setBusy(true);
    // Disable button immediately
    const genBtn = document.querySelector(`[onclick*="dgGenerateMarkdown('${docKey}')"]`);
    if (genBtn) { genBtn.disabled = true; genBtn.textContent = t('dgGenerating') + '...'; }
    toast(`${t('dgGenerating')} ${dt?.name}...`, 'ok');

    try {
      const text = await callAnthropic(state.apiKey, state.model, `Generate a complete ${dt?.name} markdown file based on these decisions.

PROJECT: ${d.projectDesc}
${otherDocs ? `\nOTHER DOCS ALREADY CREATED:\n${otherDocs}\n` : ''}

DECISIONS MADE:
${answersSummary}

Generate a professional, complete markdown document. Use proper formatting with headers, tables, code blocks where appropriate. Reference other docs by filename when relevant but don't force references. Keep it concise and actionable.

IMPORTANT: Return ONLY the markdown content, no JSON wrapping, no code fences around the whole thing. Start directly with the # heading.`, 8000);

      doc.markdown = text.replace(/^```(?:markdown)?\n?/, '').replace(/\n?```$/, '');
      save();
      setBusy(false);
      // Render IMMEDIATELY so user sees the preview
      render();
      toast(`${dt?.name} ${t('dgDone')}!`, 'ok');

      // CASCADE UNLOCK (fire-and-forget, runs in background)
      const newlyUnlocked = d.selectedDocs.filter(k => !d.docs[k] && isUnlocked(d, k));
      if (newlyUnlocked.length) {
        toast(`${t('dgUnlocking')} ${newlyUnlocked.map(k => DOC_TYPES[k]?.name).join(', ')}`, 'ok');
        generateForDocs(newlyUnlocked); // fire-and-forget
      }

      // Auto-advance to next unlocked doc
      const nextDoc = d.selectedDocs.find(k => k !== docKey && isUnlocked(d, k) && (!d.docs[k]?.markdown));
      if (nextDoc) {
        d.currentDoc = nextDoc;
        d._expandedQ = null;
        save();
        render();
      }
    } catch (e) {
      toast(t('aiError') + e.message, 'err');
      setBusy(false);
      render();
    }
  }

  async function runCrossCheck() {
    const d = dg();
    const docs = Object.entries(d.docs)
      .filter(([k]) => d.selectedDocs.includes(k) && d.docs[k]?.markdown)
      .map(([k, v]) => `--- ${DOC_TYPES[k]?.name} ---\n${v.markdown}`)
      .join('\n\n');
    if (!docs) { toast(t('dgNoGenDocs'), 'err'); return; }

    setBusy(true);
    const btn = document.getElementById('dg-btn-crosscheck');
    if (btn) { btn.disabled = true; btn.textContent = t('dgChecking'); }

    try {
      const text = await callAnthropic(state.apiKey, state.model, `You are a senior architect reviewing project documentation for consistency.

PROJECT: ${d.projectDesc}

ALL DOCS:
${docs}

Cross-check all documents for:
1. Consistency — do they agree on tech choices, naming, architecture?
2. Completeness — is any important information missing?
3. Orphan references — does a doc reference something not defined elsewhere?
4. Redundancy — is the same info unnecessarily duplicated?

Return ONLY valid JSON:
{
  "issues": [
    { "severity": "error|warning|info", "doc": "<filename>", "description": "<what's wrong>", "suggestion": "<how to fix>" }
  ],
  "summary": "<overall assessment, 1-2 sentences>"
}`, 4000);

      d.crossCheck = parseAIJson(text);
      save();
      render();
    } catch (e) {
      toast(t('aiError') + e.message, 'err');
    }
    if (btn) { btn.disabled = false; btn.textContent = t('dgRunCheck'); }
    setBusy(false);
  }

  // ── UPLOAD ──
  function bindUpload() {
    const zone = document.getElementById('dg-upload-zone');
    const input = document.getElementById('dg-file-input');
    if (!zone || !input) return;
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); handleUploadFiles(e.dataTransfer.files); });
    input.addEventListener('change', e => { if (e.target.files.length) handleUploadFiles(e.target.files); });
  }

  async function handleUploadFiles(files) {
    const d = dg();
    if (!d.uploadedDocs) d.uploadedDocs = [];
    for (const file of files) {
      try {
        const content = await file.text();
        d.uploadedDocs.push({ name: file.name, content, type: file.name.split('.').pop() });
      } catch (e) { toast(`${file.name}: ${e.message}`, 'err'); }
    }
    save();
    render();
    // Re-bind after render
    setTimeout(() => bindUpload(), 50);
  }

  function removeUpload(idx) {
    const d = dg();
    if (d.uploadedDocs) { d.uploadedDocs.splice(idx, 1); save(); render(); }
    setTimeout(() => bindUpload(), 50);
  }

  function skipWithUploads() {
    const d = dg();
    // Auto-pass: inject uploaded docs as generated docs and go to Ideas
    d.uploadedDocs.forEach(doc => {
      // Try to match by filename
      const key = Object.keys(DOC_TYPES).find(k => DOC_TYPES[k].name.toLowerCase() === doc.name.toLowerCase());
      if (key) {
        d.docs[key] = { title: DOC_TYPES[key].name, sections: [], answers: {}, notes: {}, markdown: doc.content };
        if (!d.selectedDocs.includes(key)) d.selectedDocs.push(key);
      }
    });
    // Inject all uploaded docs into project context
    injectToContext();
    save();
    toast(t('dgDocsImported'), 'ok');
  }

  // ── EXPORT ──
  function copyDoc(key) {
    const md = dg().docs[key]?.markdown;
    if (!md) return;
    navigator.clipboard.writeText(md).then(() => toast(t('dgCopied'), 'ok')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = md; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(t('dgCopied'), 'ok'); } catch(e){}
      document.body.removeChild(ta);
    });
  }

  function downloadDoc(key) {
    const d = dg();
    const doc = d.docs[key];
    const dt = DOC_TYPES[key];
    if (!doc?.markdown) return;
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc.markdown);
    a.download = dt?.name || key + '.md';
    document.body.appendChild(a); a.click();
    setTimeout(() => document.body.removeChild(a), 200);
  }

  function downloadAll() {
    const d = dg();
    d.selectedDocs.forEach(k => { if (d.docs[k]?.markdown) downloadDoc(k); });
    toast(t('dgDownloading'), 'ok');
  }

  /** Inject generated docs into Project Context for Ideas evaluation */
  function injectToContext() {
    const d = dg();
    // Remove previously injected docs
    state.context.documents = state.context.documents.filter(doc => !doc._fromDocgen);
    // Add uploaded docs
    if (d.uploadedDocs?.length) {
      d.uploadedDocs.forEach(doc => {
        state.context.documents.push({
          id: 'dg_up_' + Date.now() + Math.random().toString(36).slice(2, 5),
          name: doc.name, content: doc.content, type: doc.type || 'md', _fromDocgen: true
        });
      });
    }
    // Add generated docs
    d.selectedDocs.forEach(k => {
      const doc = d.docs[k];
      const dt = DOC_TYPES[k];
      if (doc?.markdown) {
        state.context.documents.push({
          id: 'dg_' + k + '_' + Date.now(),
          name: dt?.name || k + '.md', content: doc.markdown, type: 'md', _fromDocgen: true
        });
      }
    });
    save();
    toast(t('dgContextInjected'), 'ok');
    // Switch to Ideas page
    if (typeof App !== 'undefined' && App.showIdeas) App.showIdeas();
  }

  /** Reset docgen state */
  function reset() {
    state.docgen = null;
    save();
    render();
  }

  return {
    DOC_TYPES, render, goStep, analyze, toggleDoc, startBuilder, selectDoc, answer, setNote,
    generateMarkdown, runCrossCheck, copyDoc, downloadDoc, downloadAll, injectToContext,
    bindUpload, handleUploadFiles, removeUpload, skipWithUploads, reset, expandQ
  };
})();
