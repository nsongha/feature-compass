/* ═══════════════════════════════════════════════
   MODULE: RENDERER — DOM rendering
   Depends on: I18nModule, UiModule, StateModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const RendererModule = (() => {
  'use strict';

  const { t, VERDICT_KEYS, VERDICT_DESC_KEYS, VERDICT_CFG, CUT_VERDICTS } = I18nModule;
  const { esc } = UiModule;
  const { state, getCurrentId, getFilter, save, getIdea, calcVerdict } = StateModule;

  let _verdictTimer = null;

  function emptyStateHTML() {
    return `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h2>${esc(t('noIdeaTitle'))}</h2>
      <p>${esc(t('noIdeaDesc'))}</p>
      <button class="btn-s btn-p" onclick="App.newIdea()" style="margin-top:4px">${esc(t('captureFirst'))}</button>
    </div>`;
  }

  function renderAll() {
    renderHeader();
    renderFilters();
    renderList();
    renderContext();
    if (getCurrentId()) renderEval();
    else document.getElementById('center-inner').innerHTML = emptyStateHTML();
  }

  function renderHeader() {
    document.getElementById('hdr-sub').textContent = t('tagline');
    document.querySelector('[onclick="App.showPortfolio()"]').textContent = t('portfolio');
    document.querySelector('[onclick="App.openSettings()"]').textContent = t('settings');
    document.querySelector('.hdr-right [onclick="App.newIdea()"]').textContent = t('newBtn');
    document.querySelector('.add-btn').textContent = t('newIdea');
    document.querySelector('.panel-title').innerHTML = `${esc(t('ideas'))} (<span id="idea-total">${state.ideas.length}</span>)`;
    const ctxTitle = document.querySelector('.ctx-title');
    if (ctxTitle) ctxTitle.textContent = t('projectContext');
    const dropText = document.querySelector('.drop-zone-text');
    if (dropText) dropText.textContent = t('dropFiles');
  }

  function renderFilters() {
    const chips = document.querySelectorAll('.fchip');
    const map = { 'all': 'all', 'Build Now': 'build', 'Plan for v1.5': 'plan', 'draft': 'draft', 'cut': 'cut' };
    chips.forEach(c => { c.textContent = t(map[c.dataset.f] || c.dataset.f); });
  }

  function renderList() {
    const ideas = state.ideas;
    const filter = getFilter();
    const currentId = getCurrentId();
    let filtered = ideas;
    if (filter === 'draft') filtered = ideas.filter(i => !i.verdict);
    else if (filter === 'cut') filtered = ideas.filter(i => CUT_VERDICTS.includes(i.verdict));
    else if (filter !== 'all') filtered = ideas.filter(i => i.verdict === filter);

    document.getElementById('idea-list').innerHTML = filtered.map(idea => {
      const v = idea.verdict;
      const vc = VERDICT_CFG[v];
      const s = idea.overrides || idea.scores;
      const total = s ? s.impact + s.fit + (10 - s.effort) + (10 - s.conflict) : null;
      const badgeCls = vc ? `background:var(--${vc.pill.split('/')[0]});color:var(--${vc.pill.split('/')[1]})` : 'background:var(--sur3);color:var(--tx3)';
      return `<div class="idea-card${currentId === idea.id ? ' sel' : ''}" onclick="App.select('${esc(idea.id)}')">
        <div class="ic-top">
          <div class="ic-title">${esc(idea.title || t('untitled'))}</div>
          <span class="ic-verdict" style="${badgeCls}">${v ? (esc(vc.icon + ' ') + esc(t(VERDICT_KEYS[v]))) : esc(t('draft'))}</span>
        </div>
        <div class="ic-meta">
          ${idea.description ? `<span class="ic-tag">${esc(idea.description.slice(0, 30))}${idea.description.length > 30 ? '…' : ''}</span>` : ''}
          ${total != null ? `<span class="ic-score">${total}/40</span>` : ''}
        </div>
      </div>`;
    }).join('') || `<div style="text-align:center;color:var(--tx3);font-size:11px;padding:20px">${esc(t('noMatch'))}</div>`;

    document.getElementById('idea-total').textContent = ideas.length;
    updateCounts();
  }

  function updateCounts() {
    let build = 0, plan = 0, cut = 0;
    state.ideas.forEach(i => {
      if (i.verdict === 'Build Now') build++;
      else if (i.verdict === 'Plan for v1.5') plan++;
      else if (CUT_VERDICTS.includes(i.verdict)) cut++;
    });
    document.getElementById('cnt-build').textContent = build + ' ' + t('build');
    document.getElementById('cnt-plan').textContent = plan + ' ' + t('plan');
    document.getElementById('cnt-cut').textContent = cut + ' ' + t('cut');
  }

  function renderEval() {
    const idea = getIdea();
    const inner = document.getElementById('center-inner');
    if (!idea) { inner.innerHTML = emptyStateHTML(); return; }

    const scores = idea.overrides || idea.scores;
    const ai = idea.aiResult;
    const v = idea.verdict;
    const vc = VERDICT_CFG[v];
    const total = scores ? scores.impact + scores.fit + (10 - scores.effort) + (10 - scores.conflict) : null;
    const pct = total != null ? Math.round(total / 40 * 100) : 0;
    const barColor = total >= 30 ? 'var(--grn)' : total >= 22 ? 'var(--blu)' : total >= 14 ? 'var(--amb)' : 'var(--red)';

    inner.innerHTML = `
      <!-- CAPTURE -->
      <div class="sec">
        <div class="sec-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          ${esc(t('featureIdea'))}
        </div>
        <textarea class="idea-input" placeholder="${esc(t('titlePlaceholder'))}" oninput="App.updateField('title',this.value)" style="height:auto;min-height:36px">${esc(idea.title || '')}</textarea>
        <textarea class="desc-input" placeholder="${esc(t('descPlaceholder'))}" rows="3" oninput="App.updateField('description',this.value)">${esc(idea.description || '')}</textarea>
        <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
          <button class="btn-s btn-gold" onclick="App.runAI()" id="btn-eval" ${!idea.title ? 'disabled' : ''}>
            ${idea.aiResult ? esc(t('reEvalAI')) : esc(t('evalAI'))}
          </button>
          ${!state.apiKey ? `<span style="font-size:10px;color:var(--red)">${esc(t('setApiFirst'))}</span>` : ''}
          <button class="btn-s" onclick="App.deleteIdea()" style="margin-left:auto;color:var(--tx3)">${esc(t('deleteBtn'))}</button>
        </div>
      </div>

      ${idea._loading ? `
        <div class="loading-wrap">
          <svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" opacity=".2"/><path d="M12 2a10 10 0 019.5 7"/>
          </svg>
          <div class="loading-text">${esc(t('aiEvaluating'))}</div>
        </div>
      ` : ''}

      ${v && vc ? `
        <!-- VERDICT -->
        <div class="verdict-card ${vc.cls}">
          <div class="v-label" style="color:${vc.color}">${esc(t('aiVerdict'))}</div>
          <div class="v-title" style="color:${vc.color}">${esc(vc.icon)} ${esc(t(VERDICT_KEYS[v]))}</div>
          <div class="v-reason">${ai?.summary ? esc(ai.summary) : esc(t(VERDICT_DESC_KEYS[v]))}</div>
          ${scores ? (() => {
            const noteMap = { 'Needs Prerequisite': 'verdictNote_prereq', 'Stack Conflict': 'verdictNote_conflict', 'Redundant': 'verdictNote_redundant', 'Scope Creep': 'verdictNote_creep' };
            const noteKey = noteMap[v];
            return `
            <div class="score-summary">
              <div>
                <div class="score-total" style="color:${vc.color}">${total}</div>
                <div class="score-max">/ 40</div>
              </div>
              <div style="flex:1">
                <div style="position:relative;margin-bottom:3px">
                  <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--tx3)">
                    <span>${esc(t('scoreLabelCut'))}</span><span>${esc(t('scoreLabelDefer'))}</span><span>${esc(t('scoreLabelPlan'))}</span><span>${esc(t('scoreLabelBuild'))}</span>
                  </div>
                </div>
                <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${vc.color}"></div></div>
                ${noteKey ? `<div style="font-size:9px;color:${vc.color};margin-top:4px;font-style:italic">⚠ ${esc(t(noteKey))}</div>` : ''}
              </div>
            </div>`;
          })() : ''}
        </div>
      ` : ''}

      ${scores ? `
        <!-- DIMENSIONS -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            ${esc(t('scoresOverride'))}
          </div>
        </div>
        <div class="dim-grid">
          ${renderDim(t('impact'), 'impact', scores, ai, 'var(--grn)', t('impactHint'))}
          ${renderDim(t('fit'), 'fit', scores, ai, 'var(--blu)', t('fitHint'))}
          ${renderDim(t('effort'), 'effort', scores, ai, 'var(--amb)', t('effortHint'))}
          ${renderDim(t('conflict'), 'conflict', scores, ai, 'var(--red)', t('conflictHint'))}
        </div>
      ` : ''}

      ${ai ? `
        <!-- AI ANALYSIS -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${esc(t('aiAnalysis'))}
          </div>
          ${ai.scores?.redundancy?.detected ? `
            <div class="analysis-block">
              <h4 style="color:var(--amb)">≋ ${esc(t('redundancyDetected'))}</h4>
              <p>${esc(ai.scores.redundancy.reasoning || '')}${ai.scores.redundancy.overlap_with ? ` — overlaps with <strong>${esc(ai.scores.redundancy.overlap_with)}</strong> (${ai.scores.redundancy.percentage || 0}%)` : ''}</p>
            </div>
          ` : ''}
          ${ai.dependencies?.length ? `
            <div class="analysis-block">
              <h4>⟐ ${esc(t('dependencies'))}</h4>
              <ul>${ai.dependencies.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${ai.stack_conflicts?.length ? `
            <div class="analysis-block">
              <h4 style="color:var(--red)">⚡ ${esc(t('stackConflicts'))}</h4>
              <ul>${ai.stack_conflicts.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${ai.alternative_approaches?.length ? `
            <div class="analysis-block">
              <h4>↗ ${esc(t('altApproaches'))}</h4>
              <ul>${ai.alternative_approaches.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${ai ? `
        <!-- USER OVERRIDE VERDICT -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v-2"/><polyline points="17 8 21 4 17 0"/></svg>
            ${esc(t('yourCall'))}
          </div>
          <div class="override-btns">
            <button class="btn-s" style="background:var(--gbg);color:var(--gtx);border-color:var(--grn)" onclick="App.setVerdict('Build Now')">${esc(t('buildNow'))}</button>
            <button class="btn-s" style="background:var(--bbg);color:var(--btx);border-color:var(--blu)" onclick="App.setVerdict('Plan for v1.5')">${esc(t('planV15'))}</button>
            <button class="btn-s" style="background:var(--abg);color:var(--atx);border-color:var(--amb)" onclick="App.setVerdict('Needs Prerequisite')">${esc(t('prerequisite'))}</button>
            <button class="btn-s" style="background:var(--rbg);color:var(--rtx);border-color:var(--red)" onclick="App.setVerdict('Scope Creep')">${esc(t('cutVerdict'))}</button>
            <button class="btn-s" style="background:var(--grybg);color:var(--gry);border-color:var(--gry)" onclick="App.setVerdict('Defer Indefinitely')">${esc(t('deferVerdict'))}</button>
          </div>
        </div>

        <!-- NOTES -->
        <div class="sec">
          <div class="sec-label">${esc(t('yourNotes'))}</div>
          <textarea class="notes-area" placeholder="${esc(t('notesPlaceholder'))}" oninput="App.updateField('userNotes',this.value)">${esc(idea.userNotes || '')}</textarea>
          <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
            <button class="btn-s" onclick="App.exportIdea()">${esc(t('exportMd'))}</button>
          </div>
        </div>
      ` : ''}
    `;

    // Bind sliders
    inner.querySelectorAll('.dim-slider').forEach(sl => {
      sl.addEventListener('input', e => {
        const dim = e.target.dataset.dim;
        const val = parseInt(e.target.value);
        e.target.closest('.slider-row').querySelector('.slider-val').textContent = val;
        const idea = getIdea();
        if (!idea) return;
        if (!idea.overrides) idea.overrides = { ...(idea.scores || {}) };
        idea.overrides[dim] = val;
        idea.verdict = calcVerdict(idea.overrides, idea.aiResult);
        save();
        const card = e.target.closest('.dim-card');
        const fill = card.querySelector('.dim-bar-fill');
        if (fill) fill.style.width = (val * 10) + '%';
        clearTimeout(_verdictTimer);
        _verdictTimer = setTimeout(() => { renderEval(); renderList(); }, 300);
      });
    });
  }

  function renderDim(label, key, scores, ai, color, hint) {
    const val = scores[key] ?? 5;
    const aiVal = ai?.scores?.[key]?.score ?? val;
    const reasoning = ai?.scores?.[key]?.reasoning || '';
    const modified = val !== aiVal;
    return `
      <div class="dim-card">
        <div class="dim-label">${esc(label)} ${modified ? `<span style="font-size:9px;color:var(--gold)">${esc(t('modified'))}</span>` : ''}</div>
        <div class="dim-score" style="color:${color}">${val}<span style="font-size:11px;opacity:.4">/10</span></div>
        <div class="dim-bar"><div class="dim-bar-fill" style="width:${val * 10}%;background:${color}"></div></div>
        ${reasoning ? `<div class="dim-reasoning">${esc(reasoning)}</div>` : ''}
        <div class="dim-override">
          <div class="dim-override-label">${esc(t('override'))}</div>
          <div class="slider-row">
            <input type="range" class="dim-slider" data-dim="${key}" min="0" max="10" value="${val}">
            <span class="slider-val">${val}</span>
          </div>
          <div style="font-size:9px;color:var(--tx3);margin-top:2px">${esc(hint)}</div>
        </div>
      </div>
    `;
  }

  function renderContext() {
    const docs = state.context.documents;
    const ext = state.context.extracted;
    const idea = getIdea();
    const rc = idea?.aiResult?.relevant_context;

    document.getElementById('doc-list').innerHTML = docs.length ? `
      <div>
        <div class="ctx-title">${esc(t('documents'))} (${docs.length})</div>
        ${docs.map(d => `
          <div class="doc-item">
            <div class="doc-icon ${esc(d.type)}">${esc(d.type.toUpperCase())}</div>
            <div class="doc-name">${esc(d.name)}</div>
            <button class="doc-del" onclick="App.removeDoc('${esc(d.id)}')" title="Remove">✕</button>
          </div>
        `).join('')}
      </div>
    ` : '';

    const actionBtns = docs.length ? `<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap">
      <button class="btn-s" style="font-size:10px;padding:3px 8px" onclick="App.reExtract()">${esc(t('reScan'))}</button>
      <button class="btn-s btn-gold" style="font-size:10px;padding:3px 8px" onclick="App.aiExtract()">${esc(t('aiExtract'))}</button>
      <button class="btn-s" style="font-size:10px;padding:3px 8px;color:var(--red)" onclick="App.clearContext()">${esc(t('clear'))}</button>
    </div>` : '';

    if (rc && idea) {
      const total = (rc.decisions?.length || 0) + (rc.features?.length || 0) + (rc.tech?.length || 0) + (rc.personas?.length || 0) + (rc.tables?.length || 0);
      document.getElementById('ctx-extracted').innerHTML = `
        <div>
          ${actionBtns}
          <div class="ctx-mode-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            ${esc(t('relevantTo'))} (${total})
          </div>
          <div style="font-size:9px;color:var(--tx3);margin-bottom:8px">${esc(t('clickToExpand'))}</div>
          ${renderCtxSection('affectedDecisions', rc.decisions, '⚖')}
          ${renderCtxSection('relatedFeatures', rc.features, '◈')}
          ${renderCtxSection('techInvolved', rc.tech, '⚡')}
          ${renderCtxSection('targetPersonas', rc.personas, '◉')}
          ${renderCtxSection('tablesAffected', rc.tables, '⬡')}
          <div style="margin-top:10px">
            <button class="btn-s" style="font-size:10px;padding:3px 8px;width:100%" onclick="App.showAllContext()">${esc(t('allContext'))} →</button>
          </div>
        </div>
      `;
      return;
    }

    const total = ext.features.length + ext.techStack.length + ext.personas.length + ext.decisions.length;
    document.getElementById('ctx-extracted').innerHTML = `
      <div>
        ${actionBtns}
        ${idea && !idea.aiResult && docs.length ? `<div class="ctx-empty-hint">${esc(t('noRelevantCtx'))}</div>` : ''}
        ${total ? `
          <div class="ctx-title">${esc(t('extracted'))}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.features.length}</div><div class="ctx-stat-label">${esc(t('features'))}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.techStack.length}</div><div class="ctx-stat-label">${esc(t('tech'))}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.personas.length}</div><div class="ctx-stat-label">${esc(t('personas'))}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.decisions.length}</div><div class="ctx-stat-label">${esc(t('decisions'))}</div></div>
          </div>
          ${ext.techStack.length ? `<div class="ctx-title" style="font-size:9px">${esc(t('techStack'))}</div><div class="ctx-tags" style="margin-bottom:8px">${ext.techStack.slice(0, 15).map(t => `<span class="ctx-tag">${esc(t)}</span>`).join('')}</div>` : ''}
          ${ext.personas.length ? `<div class="ctx-title" style="font-size:9px">${esc(t('personas'))}</div><div class="ctx-tags" style="margin-bottom:8px">${ext.personas.slice(0, 10).map(p => `<span class="ctx-tag">${esc(p)}</span>`).join('')}</div>` : ''}
          ${ext.decisions.length ? `<div class="ctx-title" style="font-size:9px">${esc(t('decisions'))} (${ext.decisions.length})</div><div class="ctx-tags" style="margin-bottom:8px">${ext.decisions.slice(0, 12).map(d => `<span class="ctx-tag">${esc(d.length > 40 ? d.slice(0, 38) + '…' : d)}</span>`).join('')}</div>` : ''}
          ${ext.features.length ? `<div class="ctx-title" style="font-size:9px">${esc(t('features'))} (${ext.features.length})</div><div class="ctx-tags">${ext.features.slice(0, 20).map(f => `<span class="ctx-tag">${esc(f.length > 30 ? f.slice(0, 28) + '…' : f)}</span>`).join('')}</div>` : ''}
        ` : (docs.length ? `<div style="font-size:11px;color:var(--tx3);padding:8px 0">${esc(t('reScanHint'))}</div>` : '')}
      </div>
    `;
  }

  function renderCtxSection(titleKey, items, icon) {
    if (!items?.length) return '';
    return `
      <div class="ctx-section">
        <div class="ctx-section-hdr">${esc(icon)} ${esc(t(titleKey))} <span class="ctx-count">${items.length}</span></div>
        ${items.map(i => {
          const rel = i.impact || i.relation || 'supports';
          return `<div class="ctx-rel-item">
            <div class="ctx-rel-name">
              <span>${esc(i.item)}</span>
              <span class="ctx-rel-badge badge-${esc(rel)}">${esc(t(rel))}</span>
            </div>
            <div class="ctx-rel-reason">${esc(i.reason || '')}</div>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  return { emptyStateHTML, renderAll, renderHeader, renderFilters, renderList, updateCounts, renderEval, renderDim, renderContext, renderCtxSection };
})();
