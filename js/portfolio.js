/* ═══════════════════════════════════════════════
   MODULE: PORTFOLIO — Quadrant view & exports
   Depends on: I18nModule, UiModule, StateModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const PortfolioModule = (() => {
  'use strict';

  const { t, VERDICT_KEYS, VERDICT_CFG, CUT_VERDICTS } = I18nModule;
  const { esc, toast } = UiModule;
  const { state, getCurrentId, setCurrentId, getIdea } = StateModule;

  function showPortfolio(onSelectCb) {
    const ideas = state.ideas.filter(i => i.verdict);
    if (!ideas.length) { toast(t('noEvalIdeas'), 'err'); return; }
    setCurrentId(null);

    const inner = document.getElementById('center-inner');
    inner.innerHTML = `
      <div class="sec">
        <div class="sec-label">${esc(t('portfolioQuadrant'))}</div>
        <div class="quadrant-wrap"><canvas class="quadrant-canvas" id="q-canvas" width="460" height="460"></canvas></div>
      </div>
      <div class="sec">
        <div class="sec-label">${esc(t('allEvaluated'))} (${ideas.length})</div>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <button class="btn-s" onclick="App.exportAll()">${esc(t('exportBacklog'))}</button>
          <button class="btn-s" onclick="App.exportConflicts()">${esc(t('conflictReport'))}</button>
        </div>
        ${ideas.map(idea => {
          const vc = VERDICT_CFG[idea.verdict] || {};
          const s = idea.overrides || idea.scores || {};
          return `<div class="idea-card" onclick="App.select('${esc(idea.id)}')" style="margin-bottom:4px">
            <div class="ic-top">
              <div class="ic-title">${esc(idea.title)}</div>
              <span class="ic-verdict" style="background:var(--${(vc.pill || 'grybg/gry').split('/')[0]});color:var(--${(vc.pill || 'grybg/gry').split('/')[1]})">${esc((vc.icon || '') + ' ' + t(VERDICT_KEYS[idea.verdict] || idea.verdict))}</span>
            </div>
            <div class="ic-meta">
              <span class="ic-tag">I:${s.impact ?? '-'} F:${s.fit ?? '-'} E:${s.effort ?? '-'} C:${s.conflict ?? '-'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
    drawQuadrant(document.getElementById('q-canvas'), ideas);
    if (onSelectCb) onSelectCb();
  }

  function drawQuadrant(canvas, ideas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const pad = 36;
    const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--sur2').trim();
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = isDark ? 0.3 : 0.5;
    ctx.fillStyle = isDark ? '#0e2e1e' : '#E6F5ED'; ctx.fillRect(W / 2, pad, W / 2 - pad, H / 2 - pad);
    ctx.fillStyle = isDark ? '#0c2240' : '#E6F0FB'; ctx.fillRect(pad, pad, W / 2 - pad, H / 2 - pad);
    ctx.fillStyle = isDark ? '#2e1e06' : '#FDF2DD'; ctx.fillRect(W / 2, H / 2, W / 2 - pad, H / 2 - pad);
    ctx.fillStyle = isDark ? '#3a1414' : '#FCEBEB'; ctx.fillRect(pad, H / 2, W / 2 - pad, H / 2 - pad);
    ctx.globalAlpha = 1;

    ctx.font = '600 9px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = isDark ? '#6FD4A8' : '#186B4F'; ctx.fillText(t('buildNowQ'), W * 0.75, pad + 14);
    ctx.fillStyle = isDark ? '#7AB8F0' : '#1A4F8A'; ctx.fillText(t('planQ'), W * 0.25, pad + 14);
    ctx.fillStyle = isDark ? '#F0C060' : '#7A4F08'; ctx.fillText(t('niceToHave'), W * 0.75, H - pad - 6);
    ctx.fillStyle = isDark ? '#F09595' : '#A32D2D'; ctx.fillText(t('cutQ'), W * 0.25, H - pad - 6);

    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(pad, H / 2); ctx.lineTo(W - pad, H / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2, pad); ctx.lineTo(W / 2, H - pad); ctx.stroke();
    ctx.setLineDash([]);

    const txMuted = isDark ? '#5e5d56' : '#8a8980';
    ctx.fillStyle = txMuted; ctx.font = '600 8px Inter, sans-serif';
    ctx.fillText(t('highImpact'), W / 2, pad - 4);
    ctx.fillText(t('lowImpact'), W / 2, H - pad + 12);
    ctx.save(); ctx.translate(pad - 6, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(t('lowFit'), 0, 0); ctx.restore();
    ctx.save(); ctx.translate(W - pad + 8, H / 2); ctx.rotate(Math.PI / 2); ctx.fillText(t('highFit'), 0, 0); ctx.restore();

    const verdictColors = {
      'Build Now': '#1D9E75', 'Plan for v1.5': '#2566B0', 'Needs Prerequisite': '#D48A0A',
      'Stack Conflict': '#D48A0A', 'Redundant': '#7A7A88', 'Scope Creep': '#D94444', 'Defer Indefinitely': '#7A7A88'
    };
    ideas.forEach(idea => {
      const s = idea.overrides || idea.scores;
      if (!s) return;
      const x = pad + (s.fit / 10) * (W - 2 * pad);
      const y = pad + ((10 - s.impact) / 10) * (H - 2 * pad);
      const r = Math.max(6, 16 - s.effort);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = verdictColors[idea.verdict] || '#888'; ctx.fill();
      ctx.strokeStyle = isDark ? '#1c1c1a' : '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = '500 9px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#e2e0d8' : '#141410';
      const label = idea.title.length > 18 ? idea.title.slice(0, 16) + '…' : idea.title;
      ctx.fillText(label, x, y + r + 12);
    });
  }

  function exportIdea() {
    const idea = getIdea();
    if (!idea) return;
    const s = idea.overrides || idea.scores || {};
    const ai = idea.aiResult || {};
    let md = `# ${idea.title}\n\n`;
    md += `**Verdict:** ${idea.verdict || 'Draft'}\n`;
    md += `**Date:** ${new Date(idea.createdAt).toISOString().split('T')[0]}\n\n`;
    if (idea.description) md += `## Description\n${idea.description}\n\n`;
    if (s.impact != null) {
      md += `## Scores\n| Dimension | Score | Notes |\n|---|---|---|\n`;
      md += `| Impact | ${s.impact}/10 | ${ai.scores?.impact?.reasoning || ''} |\n`;
      md += `| Fit | ${s.fit}/10 | ${ai.scores?.fit?.reasoning || ''} |\n`;
      md += `| Effort | ${s.effort}/10 | ${ai.scores?.effort?.reasoning || ''} |\n`;
      md += `| Conflict | ${s.conflict}/10 | ${ai.scores?.conflict?.reasoning || ''} |\n\n`;
    }
    if (ai.dependencies?.length) md += `## Dependencies\n${ai.dependencies.map(d => `- ${d}`).join('\n')}\n\n`;
    if (ai.stack_conflicts?.length) md += `## Stack Conflicts\n${ai.stack_conflicts.map(c => `- ${c}`).join('\n')}\n\n`;
    if (ai.summary) md += `## AI Summary\n${ai.summary}\n\n`;
    if (idea.userNotes) md += `## Notes\n${idea.userNotes}\n\n`;
    md += `---\n*Evaluated by Feature Compass*\n`;
    downloadMd(`${(idea.title || 'idea').replace(/[^a-zA-Z0-9]/g, '_')}.md`, md);
  }

  function exportAll() {
    const ideas = state.ideas.filter(i => i.verdict);
    if (!ideas.length) return;
    let md = `# Feature Compass — Backlog\n\nGenerated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const groups = {};
    ideas.forEach(i => { (groups[i.verdict] = groups[i.verdict] || []).push(i); });
    Object.entries(groups).forEach(([v, items]) => {
      const vc = VERDICT_CFG[v] || {};
      md += `## ${vc.icon || ''} ${v}\n\n`;
      items.forEach(i => {
        const s = i.overrides || i.scores || {};
        md += `### ${i.title}\n- Impact: ${s.impact}/10 · Fit: ${s.fit}/10 · Effort: ${s.effort}/10 · Conflict: ${s.conflict}/10\n`;
        if (i.aiResult?.summary) md += `- ${i.aiResult.summary}\n`;
        if (i.userNotes) md += `- *Note:* ${i.userNotes}\n`;
        md += '\n';
      });
    });
    downloadMd('feature-compass-backlog.md', md);
  }

  function exportConflicts() {
    const ideas = state.ideas.filter(i => i.aiResult);
    let md = `# Feature Compass — Conflict Report\n\nGenerated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const conflicts = ideas.filter(i => i.aiResult.stack_conflicts?.length || i.aiResult.dependencies?.length);
    if (!conflicts.length) { md += 'No conflicts detected.\n'; }
    else conflicts.forEach(i => {
      const ai = i.aiResult;
      md += `## ${i.title} (${i.verdict})\n`;
      if (ai.stack_conflicts?.length) md += `### Stack Conflicts\n${ai.stack_conflicts.map(c => `- ${c}`).join('\n')}\n\n`;
      if (ai.dependencies?.length) md += `### Dependencies\n${ai.dependencies.map(d => `- ${d}`).join('\n')}\n\n`;
    });
    downloadMd('feature-compass-conflicts.md', md);
  }

  function downloadMd(name, content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }));
    a.download = name; a.click(); URL.revokeObjectURL(a.href);
    toast(t('exported') + ' ' + name, 'ok');
  }

  return { showPortfolio, drawQuadrant, exportIdea, exportAll, exportConflicts, downloadMd };
})();
