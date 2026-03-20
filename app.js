/* ═══════════════════════════════════════════════════════════
   FEATURE COMPASS
   Flow: Capture → AI Evaluate → User Override → Final Verdict
   ═══════════════════════════════════════════════════════════ */

// ── i18n ──
const I18N = {
  en: {
    // Header
    tagline: 'Evaluate features before they hit the backlog',
    portfolio: 'Portfolio',
    settings: '⚙ Settings',
    newBtn: '+ New',
    build: 'Build', plan: 'Plan', cut: 'Cut',
    // Filters
    all: 'All', draft: 'Draft',
    // Left panel
    ideas: 'Ideas',
    newIdea: '+ New idea',
    noMatch: 'No ideas match',
    // Empty state
    noIdeaTitle: 'No idea selected',
    noIdeaDesc: 'Click "+ New" to capture a feature idea, or select one from the list to review.',
    captureFirst: '+ Capture first idea',
    // Capture
    featureIdea: 'Feature Idea',
    titlePlaceholder: 'Feature title...',
    descPlaceholder: 'Describe the feature — what, why, for whom...',
    evalAI: '⬡ Evaluate with AI',
    reEvalAI: '↻ Re-evaluate with AI',
    setApiFirst: 'Set API key first →',
    deleteBtn: 'Delete',
    aiEvaluating: 'AI is evaluating against project context...',
    // Verdict
    aiVerdict: 'AI Verdict',
    scoreLabelCut: 'Cut', scoreLabelDefer: 'Defer', scoreLabelPlan: 'Plan', scoreLabelBuild: 'Build',
    verdictNote_prereq: 'Score suggests higher, but blocked by dependencies',
    verdictNote_conflict: 'Score suggests higher, but stack conflicts detected',
    verdictNote_redundant: 'Overlaps significantly with existing feature',
    verdictNote_creep: 'Low impact relative to high effort',
    // Dimensions
    scoresOverride: 'Scores — adjust to override AI',
    impact: 'Impact', fit: 'Fit', effort: 'Effort', conflict: 'Conflict',
    modified: 'MODIFIED',
    override: 'Override',
    impactHint: 'Higher = more valuable. Breadth × frequency × severity.',
    fitHint: 'Higher = better alignment with stack, features, personas.',
    effortHint: 'Higher = more costly to build & maintain.',
    conflictHint: 'Higher = more friction with existing system.',
    // AI Analysis
    aiAnalysis: 'AI Analysis',
    redundancyDetected: 'Redundancy Detected',
    dependencies: 'Dependencies',
    stackConflicts: 'Stack Conflicts',
    altApproaches: 'Alternative Approaches',
    // User override
    yourCall: 'Your Call — override verdict if you disagree',
    buildNow: '◆ Build Now',
    planV15: '→ Plan v1.5',
    prerequisite: '⟐ Prerequisite',
    cutVerdict: '✂ Cut',
    deferVerdict: '◇ Defer',
    // Notes
    yourNotes: 'Your Notes',
    notesPlaceholder: 'Add context AI doesn\'t know — budget, strategy, team bandwidth...',
    exportMd: 'Export .md',
    // Portfolio
    portfolioQuadrant: 'Portfolio — Quadrant View',
    allEvaluated: 'All Evaluated Ideas',
    exportBacklog: 'Export Backlog .md',
    conflictReport: 'Conflict Report',
    highImpact: 'HIGH IMPACT', lowImpact: 'LOW IMPACT',
    highFit: 'HIGH FIT', lowFit: 'LOW FIT',
    buildNowQ: 'BUILD NOW', planQ: 'PLAN', niceToHave: 'NICE TO HAVE', cutQ: 'CUT',
    // Context
    projectContext: 'Project Context',
    dropFiles: 'Drop files or click',
    dropHint: '.json .md .txt .docx',
    documents: 'Documents',
    reScan: '↻ Re-scan',
    aiExtract: '⬡ AI Extract',
    clear: '✕ Clear',
    extracted: 'Extracted',
    features: 'Features', tech: 'Tech', personas: 'Personas', decisions: 'Decisions',
    techStack: 'Tech Stack',
    reScanHint: 'Click "Re-extract" to analyze imported documents',
    // Settings
    settingsTitle: 'Settings',
    settingsDesc: 'API key and model. Stored locally only.',
    apiKeyLabel: 'API Key',
    modelLabel: 'Model',
    langLabel: 'Language',
    cancel: 'Cancel', save: 'Save',
    // Toasts
    evalComplete: 'Evaluation complete',
    deleted: 'Deleted',
    exported: 'Exported',
    imported: 'Imported',
    ctxExtracted: 'Context extracted',
    ctxCleared: 'Context cleared',
    ctxReExtracted: 'Context re-extracted',
    aiExtracting: 'AI extracting context...',
    aiFailed: 'AI extraction failed, using basic mode',
    noEvalIdeas: 'No evaluated ideas yet',
    setApiKey: 'Set your API key first',
    importFirst: 'Import files first',
    deleteConfirm: 'Delete this idea?',
    clearConfirm: 'Clear all imported context?',
    savedUsing: 'Saved — using',
    failedImport: 'Failed',
    aiError: 'AI error: ',
    // Verdicts
    vBuildNow: 'Build Now',
    vPlan: 'Plan for v1.5',
    vPrereq: 'Needs Prerequisite',
    vConflict: 'Stack Conflict',
    vRedundant: 'Redundant',
    vCreep: 'Scope Creep',
    vDefer: 'Defer Indefinitely',
    // Verdict descriptions
    vdBuildNow: 'High impact, great fit — add to current sprint',
    vdPlan: 'Worth building — add to roadmap',
    vdPrereq: 'Blocked by unbuilt dependencies',
    vdConflict: 'Requires tech outside current stack',
    vdRedundant: 'Overlaps with existing feature — merge instead',
    vdCreep: 'Low necessity, high effort — cut',
    vdDefer: 'Low impact — archive',
    // Models
    mFast: 'Fast & cheap', mBalanced: 'Balanced', mCapable: 'Most capable',
    untitled: 'Untitled',
    // Smart context
    relevantTo: 'Relevant to this idea',
    affectedDecisions: 'Affected Decisions',
    relatedFeatures: 'Related Features',
    techInvolved: 'Tech Involved',
    targetPersonas: 'Target Personas',
    tablesAffected: 'Tables Affected',
    clickToExpand: 'Hover for details',
    noRelevantCtx: 'Run AI evaluation to see relevant context',
    allContext: 'All Project Context',
    supports: 'supports', conflicts: 'conflicts', constrains: 'constrains',
    overlaps: 'overlaps', depends_on: 'depends on', extends: 'extends',
    uses: 'uses', needs_new: 'needs new', reads: 'reads', writes: 'writes', new_table: 'new table',
    primary: 'primary', secondary: 'secondary', unaffected: 'unaffected',
  },
  vi: {
    tagline: 'Đánh giá tính năng trước khi đưa vào backlog',
    portfolio: 'Tổng quan',
    settings: '⚙ Cài đặt',
    newBtn: '+ Mới',
    build: 'Xây dựng', plan: 'Kế hoạch', cut: 'Cắt',
    all: 'Tất cả', draft: 'Nháp',
    ideas: 'Ý tưởng',
    newIdea: '+ Ý tưởng mới',
    noMatch: 'Không có ý tưởng phù hợp',
    noIdeaTitle: 'Chưa chọn ý tưởng',
    noIdeaDesc: 'Nhấn "+ Mới" để ghi nhận ý tưởng, hoặc chọn từ danh sách.',
    captureFirst: '+ Ghi nhận ý tưởng đầu tiên',
    featureIdea: 'Ý tưởng tính năng',
    titlePlaceholder: 'Tên tính năng...',
    descPlaceholder: 'Mô tả tính năng — cái gì, tại sao, cho ai...',
    evalAI: '⬡ AI đánh giá',
    reEvalAI: '↻ AI đánh giá lại',
    setApiFirst: 'Cần nhập API key trước →',
    deleteBtn: 'Xóa',
    aiEvaluating: 'AI đang đánh giá dựa trên context dự án...',
    aiVerdict: 'Kết luận AI',
    scoreLabelCut: 'Cắt', scoreLabelDefer: 'Hoãn', scoreLabelPlan: 'Lên kế hoạch', scoreLabelBuild: 'Xây dựng',
    verdictNote_prereq: 'Điểm cao nhưng bị chặn bởi phụ thuộc chưa hoàn thiện',
    verdictNote_conflict: 'Điểm cao nhưng xung đột với stack hiện tại',
    verdictNote_redundant: 'Trùng lặp đáng kể với tính năng đã có',
    verdictNote_creep: 'Tác động thấp so với nỗ lực cao',
    scoresOverride: 'Điểm — kéo slider để điều chỉnh',
    impact: 'Tác động', fit: 'Phù hợp', effort: 'Nỗ lực', conflict: 'Xung đột',
    modified: 'ĐÃ SỬA',
    override: 'Điều chỉnh',
    impactHint: 'Cao = giá trị lớn. Phạm vi × tần suất × mức độ.',
    fitHint: 'Cao = phù hợp stack, tính năng, persona hiện tại.',
    effortHint: 'Cao = tốn nhiều chi phí xây dựng & bảo trì.',
    conflictHint: 'Cao = xung đột nhiều với hệ thống hiện tại.',
    aiAnalysis: 'Phân tích AI',
    redundancyDetected: 'Phát hiện trùng lặp',
    dependencies: 'Phụ thuộc',
    stackConflicts: 'Xung đột Stack',
    altApproaches: 'Phương án thay thế',
    yourCall: 'Quyết định của bạn — ghi đè nếu không đồng ý',
    buildNow: '◆ Build Now',
    planV15: '→ Plan v1.5',
    prerequisite: '⟐ Cần hoàn thiện trước',
    cutVerdict: '✂ Cắt bỏ',
    deferVerdict: '◇ Hoãn vô thời hạn',
    yourNotes: 'Ghi chú của bạn',
    notesPlaceholder: 'Thêm context mà AI không biết — ngân sách, chiến lược, bandwidth team...',
    exportMd: 'Xuất .md',
    portfolioQuadrant: 'Tổng quan — Biểu đồ góc phần tư',
    allEvaluated: 'Tất cả ý tưởng đã đánh giá',
    exportBacklog: 'Xuất Backlog .md',
    conflictReport: 'Báo cáo xung đột',
    highImpact: 'TÁC ĐỘNG CAO', lowImpact: 'TÁC ĐỘNG THẤP',
    highFit: 'PHÙ HỢP CAO', lowFit: 'PHÙ HỢP THẤP',
    buildNowQ: 'BUILD NGAY', planQ: 'LÊN KẾ HOẠCH', niceToHave: 'CÓ THÌ TỐT', cutQ: 'CẮT BỎ',
    projectContext: 'Context dự án',
    dropFiles: 'Kéo thả file hoặc nhấn',
    dropHint: '.json .md .txt .docx',
    documents: 'Tài liệu',
    reScan: '↻ Quét lại',
    aiExtract: '⬡ AI trích xuất',
    clear: '✕ Xóa hết',
    extracted: 'Đã trích xuất',
    features: 'Tính năng', tech: 'Công nghệ', personas: 'Persona', decisions: 'Quyết định',
    techStack: 'Tech Stack',
    reScanHint: 'Nhấn "Quét lại" để phân tích tài liệu đã import',
    settingsTitle: 'Cài đặt',
    settingsDesc: 'API key và model. Chỉ lưu trên máy bạn.',
    apiKeyLabel: 'API Key',
    modelLabel: 'Model',
    langLabel: 'Ngôn ngữ',
    cancel: 'Hủy', save: 'Lưu',
    evalComplete: 'Đánh giá hoàn tất',
    deleted: 'Đã xóa',
    exported: 'Đã xuất',
    imported: 'Đã import',
    ctxExtracted: 'Đã trích xuất context',
    ctxCleared: 'Đã xóa context',
    ctxReExtracted: 'Đã quét lại context',
    aiExtracting: 'AI đang trích xuất context...',
    aiFailed: 'AI trích xuất thất bại, dùng chế độ cơ bản',
    noEvalIdeas: 'Chưa có ý tưởng nào được đánh giá',
    setApiKey: 'Cần nhập API key trước',
    importFirst: 'Cần import file trước',
    deleteConfirm: 'Xóa ý tưởng này?',
    clearConfirm: 'Xóa toàn bộ context đã import?',
    savedUsing: 'Đã lưu — đang dùng',
    failedImport: 'Lỗi',
    aiError: 'Lỗi AI: ',
    vBuildNow: 'Build Now',
    vPlan: 'Plan for v1.5',
    vPrereq: 'Cần hoàn thiện trước',
    vConflict: 'Xung đột Stack',
    vRedundant: 'Trùng lặp',
    vCreep: 'Scope Creep',
    vDefer: 'Hoãn vô thời hạn',
    vdBuildNow: 'Tác động cao, phù hợp tốt — thêm vào sprint hiện tại',
    vdPlan: 'Đáng build — thêm vào roadmap',
    vdPrereq: 'Cần build các phần phụ thuộc trước',
    vdConflict: 'Cần công nghệ ngoài stack hiện tại',
    vdRedundant: 'Trùng với tính năng đã có — nên merge',
    vdCreep: 'Ít cần thiết, tốn nhiều công — cắt bỏ',
    vdDefer: 'Tác động thấp — lưu trữ',
    mFast: 'Nhanh & rẻ', mBalanced: 'Cân bằng', mCapable: 'Mạnh nhất',
    untitled: 'Chưa đặt tên',
    relevantTo: 'Liên quan đến ý tưởng này',
    affectedDecisions: 'Decisions bị ảnh hưởng',
    relatedFeatures: 'Features liên quan',
    techInvolved: 'Tech liên quan',
    targetPersonas: 'Personas mục tiêu',
    tablesAffected: 'Tables bị ảnh hưởng',
    clickToExpand: 'Hover để xem chi tiết',
    noRelevantCtx: 'Chạy AI đánh giá để xem context liên quan',
    allContext: 'Toàn bộ Context',
    supports: 'hỗ trợ', conflicts: 'xung đột', constrains: 'ràng buộc',
    overlaps: 'trùng lặp', depends_on: 'phụ thuộc', extends: 'mở rộng',
    uses: 'sử dụng', needs_new: 'cần mới', reads: 'đọc', writes: 'ghi', new_table: 'table mới',
    primary: 'chính', secondary: 'phụ', unaffected: 'không ảnh hưởng',
  }
};

const VERDICT_KEYS = {
  'Build Now': 'vBuildNow', 'Plan for v1.5': 'vPlan', 'Needs Prerequisite': 'vPrereq',
  'Stack Conflict': 'vConflict', 'Redundant': 'vRedundant', 'Scope Creep': 'vCreep', 'Defer Indefinitely': 'vDefer',
};
const VERDICT_DESC_KEYS = {
  'Build Now': 'vdBuildNow', 'Plan for v1.5': 'vdPlan', 'Needs Prerequisite': 'vdPrereq',
  'Stack Conflict': 'vdConflict', 'Redundant': 'vdRedundant', 'Scope Creep': 'vdCreep', 'Defer Indefinitely': 'vdDefer',
};

const VERDICT_CFG = {
  'Build Now':          { cls:'v-build',    pill:'gbg/gtx',   icon:'◆', color:'var(--grn)' },
  'Plan for v1.5':      { cls:'v-plan',     pill:'bbg/btx',   icon:'→', color:'var(--blu)' },
  'Needs Prerequisite': { cls:'v-prereq',   pill:'abg/atx',   icon:'⟐', color:'var(--amb)' },
  'Stack Conflict':     { cls:'v-conflict', pill:'abg/atx',   icon:'⚡', color:'var(--amb)' },
  'Redundant':          { cls:'v-redundant',pill:'grybg/gry',  icon:'≋', color:'var(--gry)' },
  'Scope Creep':        { cls:'v-creep',    pill:'rbg/rtx',   icon:'✂', color:'var(--red)' },
  'Defer Indefinitely': { cls:'v-defer',    pill:'grybg/gry',  icon:'◇', color:'var(--gry)' },
};

const CUT_VERDICTS = ['Scope Creep','Defer Indefinitely','Redundant'];

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', descKey: 'mFast', tier: '$' },
  { id: 'claude-sonnet-4-20250514', label: 'Sonnet 4', descKey: 'mBalanced', tier: '$$' },
  { id: 'claude-opus-4-20250514', label: 'Opus 4', descKey: 'mCapable', tier: '$$$' },
];

const App = {
  state: { apiKey:'', model:'claude-sonnet-4-20250514', lang:'en', ideas:[], context:{ documents:[], extracted:{ features:[], techStack:[], personas:[], decisions:[] } } },
  currentId: null,
  filter: 'all',

  t(key) { return (I18N[this.state.lang] || I18N.en)[key] || I18N.en[key] || key; },

  emptyStateHTML() {
    return `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h2>${this.t('noIdeaTitle')}</h2>
      <p>${this.t('noIdeaDesc')}</p>
      <button class="btn-s btn-p" onclick="App.newIdea()" style="margin-top:4px">${this.t('captureFirst')}</button>
    </div>`;
  },

  init() {
    this.load();
    this.bindNav();
    this.bindDrop();
    this.renderAll();
    if (this.state.ideas.length) this.select(this.state.ideas[0].id);
  },

  renderAll() {
    this.renderHeader();
    this.renderFilters();
    this.renderList();
    this.renderContext();
    if (this.currentId) this.renderEval();
    else document.getElementById('center-inner').innerHTML = this.emptyStateHTML();
  },

  renderHeader() {
    document.getElementById('hdr-sub').textContent = this.t('tagline');
    document.querySelector('[onclick="App.showPortfolio()"]').textContent = this.t('portfolio');
    document.querySelector('[onclick="App.openSettings()"]').textContent = this.t('settings');
    document.querySelector('.hdr-right [onclick="App.newIdea()"]').textContent = this.t('newBtn');
    document.querySelector('.add-btn').textContent = this.t('newIdea');
    document.querySelector('.panel-title').innerHTML = `${this.t('ideas')} (<span id="idea-total">${this.state.ideas.length}</span>)`;
    // Context panel title
    document.querySelector('.ctx-title')&&(document.querySelector('.right > div > .ctx-title').textContent = this.t('projectContext'));
    document.querySelector('.drop-zone-text')&&(document.querySelector('.drop-zone-text').textContent = this.t('dropFiles'));
  },

  renderFilters() {
    const chips = document.querySelectorAll('.fchip');
    const map = { 'all': 'all', 'Build Now': 'build', 'Plan for v1.5': 'plan', 'draft': 'draft', 'cut': 'cut' };
    chips.forEach(c => {
      const f = c.dataset.f;
      c.textContent = this.t(map[f] || f);
    });
  },

  setLang(lang) {
    this.state.lang = lang;
    this.save();
    this.renderAll();
  },

  load() {
    try {
      // Migrate from old key
      const old = localStorage.getItem('feature-compass-state');
      if (old && !localStorage.getItem('fc-state')) {
        localStorage.setItem('fc-state', old);
        localStorage.removeItem('feature-compass-state');
      }
      const s = localStorage.getItem('fc-state');
      if (s) this.state = { ...this.state, ...JSON.parse(s) };
      // Sanitize API key — strip non-ASCII chars that break fetch headers
      if (this.state.apiKey) this.state.apiKey = this.state.apiKey.replace(/[^\x20-\x7E]/g, '').trim();
    } catch(e){}
  },
  save() { try { localStorage.setItem('fc-state', JSON.stringify(this.state)); } catch(e){} },

  // ── NAV ──
  bindNav() {
    document.getElementById('filter-row').addEventListener('click', e => {
      const btn = e.target.closest('.fchip');
      if (!btn) return;
      this.filter = btn.dataset.f;
      document.querySelectorAll('.fchip').forEach(b => b.classList.toggle('active', b === btn));
      this.renderList();
    });
  },

  // ── LIST ──
  renderList() {
    const ideas = this.state.ideas;
    let filtered = ideas;
    if (this.filter === 'draft') filtered = ideas.filter(i => !i.verdict);
    else if (this.filter === 'cut') filtered = ideas.filter(i => CUT_VERDICTS.includes(i.verdict));
    else if (this.filter !== 'all') filtered = ideas.filter(i => i.verdict === this.filter);

    document.getElementById('idea-list').innerHTML = filtered.map(idea => {
      const v = idea.verdict;
      const vc = VERDICT_CFG[v];
      const s = idea.overrides || idea.scores;
      const total = s ? s.impact + s.fit + (10 - s.effort) + (10 - s.conflict) : null;
      const badgeCls = vc ? `background:var(--${vc.pill.split('/')[0]});color:var(--${vc.pill.split('/')[1]})` : 'background:var(--sur3);color:var(--tx3)';
      return `<div class="idea-card${this.currentId===idea.id?' sel':''}" onclick="App.select('${idea.id}')">
        <div class="ic-top">
          <div class="ic-title">${this.esc(idea.title || this.t('untitled'))}</div>
          <span class="ic-verdict" style="${badgeCls}">${v ? (vc.icon + ' ' + this.t(VERDICT_KEYS[v])) : this.t('draft')}</span>
        </div>
        <div class="ic-meta">
          ${idea.description ? `<span class="ic-tag">${this.esc(idea.description.slice(0,30))}${idea.description.length>30?'…':''}</span>` : ''}
          ${total != null ? `<span class="ic-score">${total}/40</span>` : ''}
        </div>
      </div>`;
    }).join('') || `<div style="text-align:center;color:var(--tx3);font-size:11px;padding:20px">${this.t('noMatch')}</div>`;

    document.getElementById('idea-total').textContent = ideas.length;
    this.updateCounts();
  },

  updateCounts() {
    const ideas = this.state.ideas;
    let build=0, plan=0, cut=0;
    ideas.forEach(i => {
      if (i.verdict === 'Build Now') build++;
      else if (i.verdict === 'Plan for v1.5') plan++;
      else if (CUT_VERDICTS.includes(i.verdict)) cut++;
    });
    document.getElementById('cnt-build').textContent = build + ' ' + this.t('build');
    document.getElementById('cnt-plan').textContent = plan + ' ' + this.t('plan');
    document.getElementById('cnt-cut').textContent = cut + ' ' + this.t('cut');
  },

  // ── SELECT & RENDER EVAL ──
  select(id) {
    this.currentId = id;
    this.renderList();
    this.renderEval();
    this.renderContext();
  },

  renderEval() {
    const idea = this.state.ideas.find(i => i.id === this.currentId);
    const inner = document.getElementById('center-inner');
    if (!idea) {
      inner.innerHTML = this.emptyStateHTML();
      return;
    }

    const scores = idea.overrides || idea.scores;
    const ai = idea.aiResult;
    const v = idea.verdict;
    const vc = VERDICT_CFG[v];

    // Total: impact + fit + (10-effort) + (10-conflict) = max 40
    const total = scores ? scores.impact + scores.fit + (10 - scores.effort) + (10 - scores.conflict) : null;
    const pct = total != null ? Math.round(total / 40 * 100) : 0;
    const barColor = total >= 30 ? 'var(--grn)' : total >= 22 ? 'var(--blu)' : total >= 14 ? 'var(--amb)' : 'var(--red)';

    inner.innerHTML = `
      <!-- CAPTURE -->
      <div class="sec">
        <div class="sec-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          ${this.t('featureIdea')}
        </div>
        <textarea class="idea-input" placeholder="${this.t('titlePlaceholder')}" oninput="App.updateField('title',this.value)" style="height:auto;min-height:36px">${this.esc(idea.title||'')}</textarea>
        <textarea class="desc-input" placeholder="${this.t('descPlaceholder')}" rows="3" oninput="App.updateField('description',this.value)">${this.esc(idea.description||'')}</textarea>
        <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
          <button class="btn-s btn-gold" onclick="App.runAI()" id="btn-eval" ${!idea.title ? 'disabled' : ''}>
            ${idea.aiResult ? this.t('reEvalAI') : this.t('evalAI')}
          </button>
          ${!this.state.apiKey ? `<span style="font-size:10px;color:var(--red)">${this.t('setApiFirst')}</span>` : ''}
          <button class="btn-s" onclick="App.deleteIdea()" style="margin-left:auto;color:var(--tx3)">${this.t('deleteBtn')}</button>
        </div>
      </div>

      ${idea._loading ? `
        <div class="loading-wrap">
          <svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" opacity=".2"/><path d="M12 2a10 10 0 019.5 7"/>
          </svg>
          <div class="loading-text">${this.t('aiEvaluating')}</div>
        </div>
      ` : ''}

      ${v && vc ? `
        <!-- VERDICT -->
        <div class="verdict-card ${vc.cls}">
          <div class="v-label" style="color:${vc.color}">${this.t('aiVerdict')}</div>
          <div class="v-title" style="color:${vc.color}">${vc.icon} ${this.t(VERDICT_KEYS[v])}</div>
          <div class="v-reason">${ai?.summary ? this.esc(ai.summary) : this.t(VERDICT_DESC_KEYS[v])}</div>
          ${scores ? (() => {
            const noteMap = { 'Needs Prerequisite':'verdictNote_prereq', 'Stack Conflict':'verdictNote_conflict', 'Redundant':'verdictNote_redundant', 'Scope Creep':'verdictNote_creep' };
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
                    <span>${this.t('scoreLabelCut')}</span><span>${this.t('scoreLabelDefer')}</span><span>${this.t('scoreLabelPlan')}</span><span>${this.t('scoreLabelBuild')}</span>
                  </div>
                </div>
                <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${vc.color}"></div></div>
                ${noteKey ? `<div style="font-size:9px;color:${vc.color};margin-top:4px;font-style:italic">⚠ ${this.t(noteKey)}</div>` : ''}
              </div>
            </div>`;
          })() : ''}
        </div>
      ` : ''}

      ${scores ? `
        <!-- DIMENSIONS — AI scored, user can override -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            ${this.t('scoresOverride')}
          </div>
        </div>
        <div class="dim-grid">
          ${this.renderDim(this.t('impact'), 'impact', scores, ai, 'var(--grn)', this.t('impactHint'))}
          ${this.renderDim(this.t('fit'), 'fit', scores, ai, 'var(--blu)', this.t('fitHint'))}
          ${this.renderDim(this.t('effort'), 'effort', scores, ai, 'var(--amb)', this.t('effortHint'))}
          ${this.renderDim(this.t('conflict'), 'conflict', scores, ai, 'var(--red)', this.t('conflictHint'))}
        </div>
      ` : ''}

      ${ai ? `
        <!-- AI ANALYSIS -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${this.t('aiAnalysis')}
          </div>
          ${ai.scores?.redundancy?.detected ? `
            <div class="analysis-block">
              <h4 style="color:var(--amb)">≋ ${this.t('redundancyDetected')}</h4>
              <p>${this.esc(ai.scores.redundancy.reasoning || '')}${ai.scores.redundancy.overlap_with ? ` — overlaps with <strong>${this.esc(ai.scores.redundancy.overlap_with)}</strong> (${ai.scores.redundancy.percentage||0}%)` : ''}</p>
            </div>
          ` : ''}
          ${ai.dependencies?.length ? `
            <div class="analysis-block">
              <h4>⟐ ${this.t('dependencies')}</h4>
              <ul>${ai.dependencies.map(d => `<li>${this.esc(d)}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${ai.stack_conflicts?.length ? `
            <div class="analysis-block">
              <h4 style="color:var(--red)">⚡ ${this.t('stackConflicts')}</h4>
              <ul>${ai.stack_conflicts.map(c => `<li>${this.esc(c)}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${ai.alternative_approaches?.length ? `
            <div class="analysis-block">
              <h4>↗ ${this.t('altApproaches')}</h4>
              <ul>${ai.alternative_approaches.map(a => `<li>${this.esc(a)}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${ai ? `
        <!-- USER OVERRIDE VERDICT -->
        <div class="sec">
          <div class="sec-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v-2"/><polyline points="17 8 21 4 17 0"/></svg>
            ${this.t('yourCall')}
          </div>
          <div class="override-btns">
            <button class="btn-s" style="background:var(--gbg);color:var(--gtx);border-color:var(--grn)" onclick="App.setVerdict('Build Now')">${this.t('buildNow')}</button>
            <button class="btn-s" style="background:var(--bbg);color:var(--btx);border-color:var(--blu)" onclick="App.setVerdict('Plan for v1.5')">${this.t('planV15')}</button>
            <button class="btn-s" style="background:var(--abg);color:var(--atx);border-color:var(--amb)" onclick="App.setVerdict('Needs Prerequisite')">${this.t('prerequisite')}</button>
            <button class="btn-s" style="background:var(--rbg);color:var(--rtx);border-color:var(--red)" onclick="App.setVerdict('Scope Creep')">${this.t('cutVerdict')}</button>
            <button class="btn-s" style="background:var(--grybg);color:var(--gry);border-color:var(--gry)" onclick="App.setVerdict('Defer Indefinitely')">${this.t('deferVerdict')}</button>
          </div>
        </div>

        <!-- NOTES -->
        <div class="sec">
          <div class="sec-label">${this.t('yourNotes')}</div>
          <textarea class="notes-area" placeholder="${this.t('notesPlaceholder')}" oninput="App.updateField('userNotes',this.value)">${this.esc(idea.userNotes||'')}</textarea>
          <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
            <button class="btn-s" onclick="App.exportIdea()">${this.t('exportMd')}</button>
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
        const idea = this.getIdea();
        if (!idea) return;
        if (!idea.overrides) idea.overrides = { ...(idea.scores || {}) };
        idea.overrides[dim] = val;
        idea.verdict = this.calcVerdict(idea.overrides, idea.aiResult);
        this.save();
        // Update bar fill inline
        const card = e.target.closest('.dim-card');
        const fill = card.querySelector('.dim-bar-fill');
        if (fill) fill.style.width = (val * 10) + '%';
        // Re-render to update verdict
        clearTimeout(this._verdictTimer);
        this._verdictTimer = setTimeout(() => { this.renderEval(); this.renderList(); }, 300);
      });
    });
  },

  renderDim(label, key, scores, ai, color, hint) {
    const val = scores[key] ?? 5;
    const aiVal = ai?.scores?.[key]?.score ?? val;
    const reasoning = ai?.scores?.[key]?.reasoning || '';
    const modified = val !== aiVal;
    return `
      <div class="dim-card">
        <div class="dim-label">${label} ${modified ? `<span style="font-size:9px;color:var(--gold)">${this.t('modified')}</span>` : ''}</div>
        <div class="dim-score" style="color:${color}">${val}<span style="font-size:11px;opacity:.4">/10</span></div>
        <div class="dim-bar"><div class="dim-bar-fill" style="width:${val*10}%;background:${color}"></div></div>
        ${reasoning ? `<div class="dim-reasoning">${this.esc(reasoning)}</div>` : ''}
        <div class="dim-override">
          <div class="dim-override-label">${this.t('override')}</div>
          <div class="slider-row">
            <input type="range" class="dim-slider" data-dim="${key}" min="0" max="10" value="${val}">
            <span class="slider-val">${val}</span>
          </div>
          <div style="font-size:9px;color:var(--tx3);margin-top:2px">${hint}</div>
        </div>
      </div>
    `;
  },

  // ── AI EVALUATION ──
  async runAI() {
    const idea = this.getIdea();
    if (!idea || !idea.title) return;
    if (!this.state.apiKey) { this.toast(this.t('setApiKey'), 'err'); this.openSettings(); return; }

    idea._loading = true;
    this.renderEval();

    try {
      const result = await this.callAI(idea);
      idea.aiResult = result;
      idea.scores = {
        impact: Math.min(10, Math.max(0, result.scores?.impact?.score ?? 5)),
        fit: Math.min(10, Math.max(0, result.scores?.fit?.score ?? 5)),
        effort: Math.min(10, Math.max(0, result.scores?.effort?.score ?? 5)),
        conflict: Math.min(10, Math.max(0, result.scores?.conflict?.score ?? 5)),
      };
      idea.overrides = { ...idea.scores };
      idea.verdict = this.calcVerdict(idea.scores, result);
      this.toast(this.t('evalComplete'), 'ok');
    } catch(err) {
      console.error(err);
      this.toast(this.t('aiError') + err.message, 'err');
    }

    idea._loading = false;
    this.save();
    this.renderEval();
    this.renderList();
    this.renderContext();
  },

  async callAI(idea) {
    const ctx = this.buildContext();
    const lang = this.state.lang || 'en';
    const langInstruction = lang === 'vi'
      ? '\n\nIMPORTANT: Respond entirely in Vietnamese (tiếng Việt). All reasoning, summary, and reason fields must be in Vietnamese.'
      : '';
    const prompt = `You are a product strategy evaluator for Feature Compass. Evaluate this feature idea thoroughly.${langInstruction}

PROJECT CONTEXT:
${ctx || '(No project context imported)'}

FEATURE IDEA:
Title: ${idea.title}
Description: ${idea.description || '(no description)'}

Evaluate using these 8 internal dimensions to inform your scoring:
1. Impact breadth — who benefits, what % of users, how often?
2. Problem validation — what's the current workaround?
3. Redundancy — does an existing feature already cover this?
4. Dependencies — what must be built first?
5. Stack fit — can current tech handle it?
6. Necessity — does the product work without it?
7. Strategic value — differentiator or just parity?
8. Real cost — design + build + test + maintain?

Score 4 dimensions (0-10 each):
- impact: breadth × frequency × severity. 0=no impact, 10=massive
- fit: alignment with existing features, tech stack, personas. 0=misfit, 10=perfect
- effort: resource cost. 0=trivial, 10=extremely expensive
- conflict: friction with existing system. 0=none, 10=severe breaking changes

Also analyze redundancy, dependencies, stack conflicts, and alternatives.

IMPORTANT: Also identify which specific items from the project context are RELEVANT to this feature — decisions that constrain it, existing features it overlaps or depends on, tech stack it uses or conflicts with, personas it serves, and database tables/schemas it would touch. For each relevant item, explain WHY it matters for this feature in 1 short sentence.

Return ONLY valid JSON (no markdown fences):
{
  "scores": {
    "impact": { "score": <0-10>, "reasoning": "<1-2 sentences>" },
    "fit": { "score": <0-10>, "reasoning": "<1-2 sentences>" },
    "effort": { "score": <0-10>, "reasoning": "<1-2 sentences>" },
    "conflict": { "score": <0-10>, "reasoning": "<1-2 sentences>" },
    "redundancy": { "detected": <bool>, "overlap_with": "<feature or null>", "percentage": <0-100>, "reasoning": "<1 sentence>" }
  },
  "dependencies": ["<dependency>"],
  "stack_conflicts": ["<conflict>"],
  "alternative_approaches": ["<approach>"],
  "relevant_context": {
    "decisions": [{ "item": "<exact decision text from context>", "impact": "supports|conflicts|constrains", "reason": "<why>" }],
    "features": [{ "item": "<exact feature name>", "relation": "overlaps|depends_on|extends|conflicts", "reason": "<why>" }],
    "tech": [{ "item": "<exact tech name>", "relation": "uses|conflicts|needs_new", "reason": "<why>" }],
    "personas": [{ "item": "<exact persona>", "relation": "primary|secondary|unaffected", "reason": "<why>" }],
    "tables": [{ "item": "<table/schema name>", "relation": "reads|writes|new_table", "reason": "<why>" }]
  },
  "summary": "<2-3 sentence overall assessment>"
}`;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.state.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: this.state.model || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `API ${resp.status}`);
    }
    const data = await resp.json();
    const text = data.content?.[0]?.text || '';
    return this.parseAIJson(text);
  },

  parseAIJson(text) {
    // Try direct parse
    try { return JSON.parse(text); } catch(e) {}
    // Try extracting JSON block
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch(e) {} }
    // Try repairing truncated JSON — close open brackets/braces
    let json = m ? m[0] : text;
    // Iterative repair: try progressively stripping trailing garbage
    for (let attempt = 0; attempt < 10; attempt++) {
      let prev = json;
      // Remove trailing incomplete string value (unterminated quote)
      json = json.replace(/,\s*"[^"]*$/, '');
      // Remove trailing incomplete key-value pair
      json = json.replace(/,\s*"[^"]*"\s*:\s*("[^"]*)?$/, '');
      // Remove trailing incomplete object in array
      json = json.replace(/,\s*\{[^}]*$/, '');
      // Remove trailing incomplete array value
      json = json.replace(/,\s*\[[^\]]*$/, '');
      // Remove trailing colon after key with no value
      json = json.replace(/,\s*"[^"]*"\s*:\s*$/, '');
      // Remove trailing comma
      json = json.replace(/,\s*$/, '');
      if (json === prev) break;
    }
    // Count and close open brackets/braces
    const opens = (json.match(/\[/g)||[]).length - (json.match(/\]/g)||[]).length;
    const braces = (json.match(/\{/g)||[]).length - (json.match(/\}/g)||[]).length;
    for (let i = 0; i < opens; i++) json += ']';
    for (let i = 0; i < braces; i++) json += '}';
    try { return JSON.parse(json); } catch(e) {
      console.warn('JSON repair failed, text length:', text.length);
      throw new Error('Failed to parse AI response');
    }
  },

  buildContext() {
    const docs = this.state.context.documents;
    if (!docs.length) return '';
    const ext = this.state.context.extracted;
    const parts = [];
    if (ext.features.length) parts.push('EXISTING FEATURES: ' + ext.features.join(', '));
    if (ext.techStack.length) parts.push('TECH STACK: ' + ext.techStack.join(', '));
    if (ext.personas.length) parts.push('USER PERSONAS: ' + ext.personas.join(', '));
    if (ext.decisions.length) parts.push('KEY DECISIONS:\n' + ext.decisions.map(d => '- ' + d).join('\n'));
    docs.forEach(d => {
      const t = d.content.length > 3000 ? d.content.slice(0, 3000) + '\n...(truncated)' : d.content;
      parts.push(`\n--- ${d.name} ---\n${t}`);
    });
    return parts.join('\n\n');
  },

  // ── VERDICT CALC ──
  calcVerdict(scores, ai) {
    if (!scores) return null;
    const { impact, fit, effort, conflict } = scores;
    const redundancy = ai?.scores?.redundancy;
    const deps = ai?.dependencies || [];
    const stackConflicts = ai?.stack_conflicts || [];

    if (redundancy?.detected && (redundancy.percentage || 0) >= 70) return 'Redundant';
    if (stackConflicts.length > 0 && conflict >= 6) return 'Stack Conflict';
    if (deps.length > 0 && deps.some(d => d.length > 5 && !/none/i.test(d))) {
      if (effort >= 5) return 'Needs Prerequisite';
    }
    if (impact >= 7 && fit >= 7 && conflict <= 3) return 'Build Now';
    if (impact >= 6 && effort <= 5) return 'Plan for v1.5';
    if (impact <= 4 && effort >= 7) return 'Scope Creep';
    if (impact <= 3) return 'Defer Indefinitely';
    return 'Plan for v1.5';
  },

  // ── ACTIONS ──
  newIdea() {
    const idea = {
      id: 'i' + Date.now(),
      title: '',
      description: '',
      scores: null,
      overrides: null,
      aiResult: null,
      verdict: null,
      userNotes: '',
      createdAt: Date.now()
    };
    this.state.ideas.unshift(idea);
    this.save();
    this.select(idea.id);
    setTimeout(() => { const el = document.querySelector('.idea-input'); if (el) el.focus(); }, 50);
  },

  updateField(field, val) {
    const idea = this.getIdea();
    if (!idea) return;
    idea[field] = val;
    this.save();
    if (field === 'title') {
      const btn = document.getElementById('btn-eval');
      if (btn) btn.disabled = !val.trim();
      this.renderList();
    }
  },

  setVerdict(v) {
    const idea = this.getIdea();
    if (!idea) return;
    idea.verdict = v;
    this.save();
    this.renderEval();
    this.renderList();
  },

  deleteIdea() {
    if (!confirm(this.t('deleteConfirm'))) return;
    this.state.ideas = this.state.ideas.filter(i => i.id !== this.currentId);
    this.currentId = null;
    this.save();
    document.getElementById('center-inner').innerHTML = this.emptyStateHTML();
    this.renderList();
    this.toast(this.t('deleted'), 'info');
  },

  getIdea() { return this.state.ideas.find(i => i.id === this.currentId); },

  // ── EXPORT ──
  exportIdea() {
    const idea = this.getIdea();
    if (!idea) return;
    const s = idea.overrides || idea.scores || {};
    const ai = idea.aiResult || {};
    let md = `# ${idea.title}\n\n`;
    md += `**Verdict:** ${idea.verdict || 'Draft'}\n`;
    md += `**Date:** ${new Date(idea.createdAt).toISOString().split('T')[0]}\n\n`;
    if (idea.description) md += `## Description\n${idea.description}\n\n`;
    if (s.impact != null) {
      md += `## Scores\n| Dimension | Score | Notes |\n|---|---|---|\n`;
      md += `| Impact | ${s.impact}/10 | ${ai.scores?.impact?.reasoning||''} |\n`;
      md += `| Fit | ${s.fit}/10 | ${ai.scores?.fit?.reasoning||''} |\n`;
      md += `| Effort | ${s.effort}/10 | ${ai.scores?.effort?.reasoning||''} |\n`;
      md += `| Conflict | ${s.conflict}/10 | ${ai.scores?.conflict?.reasoning||''} |\n\n`;
    }
    if (ai.dependencies?.length) md += `## Dependencies\n${ai.dependencies.map(d=>`- ${d}`).join('\n')}\n\n`;
    if (ai.stack_conflicts?.length) md += `## Stack Conflicts\n${ai.stack_conflicts.map(c=>`- ${c}`).join('\n')}\n\n`;
    if (ai.summary) md += `## AI Summary\n${ai.summary}\n\n`;
    if (idea.userNotes) md += `## Notes\n${idea.userNotes}\n\n`;
    md += `---\n*Evaluated by Feature Compass*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(idea.title||'idea').replace(/[^a-zA-Z0-9]/g,'_')}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast(this.t('exported'), 'ok');
  },

  // ── PORTFOLIO ──
  showPortfolio() {
    const ideas = this.state.ideas.filter(i => i.verdict);
    if (!ideas.length) { this.toast(this.t('noEvalIdeas'), 'err'); return; }
    this.currentId = null;
    this.renderList();
    const inner = document.getElementById('center-inner');
    inner.innerHTML = `
      <div class="sec">
        <div class="sec-label">${this.t('portfolioQuadrant')}</div>
        <div class="quadrant-wrap">
          <canvas class="quadrant-canvas" id="q-canvas" width="460" height="460"></canvas>
        </div>
      </div>
      <div class="sec">
        <div class="sec-label">${this.t('allEvaluated')} (${ideas.length})</div>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <button class="btn-s" onclick="App.exportAll()">${this.t('exportBacklog')}</button>
          <button class="btn-s" onclick="App.exportConflicts()">${this.t('conflictReport')}</button>
        </div>
        ${ideas.map(idea => {
          const vc = VERDICT_CFG[idea.verdict] || {};
          const s = idea.overrides || idea.scores || {};
          return `<div class="idea-card" onclick="App.select('${idea.id}')" style="margin-bottom:4px">
            <div class="ic-top">
              <div class="ic-title">${this.esc(idea.title)}</div>
              <span class="ic-verdict" style="background:var(--${(vc.pill||'grybg/gry').split('/')[0]});color:var(--${(vc.pill||'grybg/gry').split('/')[1]})">${vc.icon||''} ${this.t(VERDICT_KEYS[idea.verdict] || idea.verdict)}</span>
            </div>
            <div class="ic-meta">
              <span class="ic-tag">I:${s.impact??'-'} F:${s.fit??'-'} E:${s.effort??'-'} C:${s.conflict??'-'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;
    this.drawQuadrant(document.getElementById('q-canvas'), ideas);
  },

  drawQuadrant(canvas, ideas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const pad = 36;

    // BG
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--sur2').trim();
    ctx.fillRect(0, 0, W, H);

    // Quadrant fills
    const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    ctx.globalAlpha = isDark ? 0.3 : 0.5;
    ctx.fillStyle = isDark ? '#0e2e1e' : '#E6F5ED'; ctx.fillRect(W/2, pad, W/2-pad, H/2-pad);
    ctx.fillStyle = isDark ? '#0c2240' : '#E6F0FB'; ctx.fillRect(pad, pad, W/2-pad, H/2-pad);
    ctx.fillStyle = isDark ? '#2e1e06' : '#FDF2DD'; ctx.fillRect(W/2, H/2, W/2-pad, H/2-pad);
    ctx.fillStyle = isDark ? '#3a1414' : '#FCEBEB'; ctx.fillRect(pad, H/2, W/2-pad, H/2-pad);
    ctx.globalAlpha = 1;

    // Labels
    ctx.font = '600 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isDark ? '#6FD4A8' : '#186B4F'; ctx.fillText(App.t('buildNowQ'), W*0.75, pad+14);
    ctx.fillStyle = isDark ? '#7AB8F0' : '#1A4F8A'; ctx.fillText(App.t('planQ'), W*0.25, pad+14);
    ctx.fillStyle = isDark ? '#F0C060' : '#7A4F08'; ctx.fillText(App.t('niceToHave'), W*0.75, H-pad-6);
    ctx.fillStyle = isDark ? '#F09595' : '#A32D2D'; ctx.fillText(App.t('cutQ'), W*0.25, H-pad-6);

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(pad,H/2); ctx.lineTo(W-pad,H/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2,pad); ctx.lineTo(W/2,H-pad); ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    const txMuted = isDark ? '#5e5d56' : '#8a8980';
    ctx.fillStyle = txMuted;
    ctx.font = '600 8px Inter, sans-serif';
    ctx.fillText(App.t('highImpact'), W/2, pad-4);
    ctx.fillText(App.t('lowImpact'), W/2, H-pad+12);
    ctx.save(); ctx.translate(pad-6, H/2); ctx.rotate(-Math.PI/2); ctx.fillText(App.t('lowFit'), 0, 0); ctx.restore();
    ctx.save(); ctx.translate(W-pad+8, H/2); ctx.rotate(Math.PI/2); ctx.fillText(App.t('highFit'), 0, 0); ctx.restore();

    // Plot
    const verdictColors = {
      'Build Now':'#1D9E75','Plan for v1.5':'#2566B0','Needs Prerequisite':'#D48A0A',
      'Stack Conflict':'#D48A0A','Redundant':'#7A7A88','Scope Creep':'#D94444','Defer Indefinitely':'#7A7A88'
    };
    ideas.forEach(idea => {
      const s = idea.overrides || idea.scores;
      if (!s) return;
      const x = pad + (s.fit / 10) * (W - 2*pad);
      const y = pad + ((10 - s.impact) / 10) * (H - 2*pad);
      const r = Math.max(6, 16 - s.effort);

      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = verdictColors[idea.verdict] || '#888';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#1c1c1a' : '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '500 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#e2e0d8' : '#141410';
      const label = idea.title.length > 18 ? idea.title.slice(0,16)+'…' : idea.title;
      ctx.fillText(label, x, y + r + 12);
    });
  },

  exportAll() {
    const ideas = this.state.ideas.filter(i => i.verdict);
    if (!ideas.length) return;
    let md = `# Feature Compass — Backlog\n\nGenerated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const groups = {};
    ideas.forEach(i => { (groups[i.verdict] = groups[i.verdict] || []).push(i); });
    Object.entries(groups).forEach(([v, items]) => {
      const vc = VERDICT_CFG[v] || {};
      md += `## ${vc.icon||''} ${v}\n\n`;
      items.forEach(i => {
        const s = i.overrides || i.scores || {};
        md += `### ${i.title}\n- Impact: ${s.impact}/10 · Fit: ${s.fit}/10 · Effort: ${s.effort}/10 · Conflict: ${s.conflict}/10\n`;
        if (i.aiResult?.summary) md += `- ${i.aiResult.summary}\n`;
        if (i.userNotes) md += `- *Note:* ${i.userNotes}\n`;
        md += '\n';
      });
    });
    this.downloadMd('feature-compass-backlog.md', md);
  },

  exportConflicts() {
    const ideas = this.state.ideas.filter(i => i.aiResult);
    let md = `# Feature Compass — Conflict Report\n\nGenerated: ${new Date().toISOString().split('T')[0]}\n\n`;
    const conflicts = ideas.filter(i => i.aiResult.stack_conflicts?.length || i.aiResult.dependencies?.length);
    if (!conflicts.length) { md += 'No conflicts detected.\n'; }
    else conflicts.forEach(i => {
      const ai = i.aiResult;
      md += `## ${i.title} (${i.verdict})\n`;
      if (ai.stack_conflicts?.length) md += `### Stack Conflicts\n${ai.stack_conflicts.map(c=>`- ${c}`).join('\n')}\n\n`;
      if (ai.dependencies?.length) md += `### Dependencies\n${ai.dependencies.map(d=>`- ${d}`).join('\n')}\n\n`;
    });
    this.downloadMd('feature-compass-conflicts.md', md);
  },

  downloadMd(name, content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }));
    a.download = name; a.click(); URL.revokeObjectURL(a.href);
    this.toast(this.t('exported') + ' ' + name, 'ok');
  },

  // ── CONTEXT IMPORT ──
  bindDrop() {
    const dz = document.getElementById('drop-zone');
    const fi = document.getElementById('file-input');
    dz.addEventListener('click', () => fi.click());
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); this.handleFiles(e.dataTransfer.files); });
    fi.addEventListener('change', e => this.handleFiles(e.target.files));
  },

  async handleFiles(fileList) {
    for (const f of fileList) {
      try { await this.importFile(f); } catch(e) { this.toast(`${this.t('failedImport')}: ${f.name} — ${e.message}`, 'err'); }
    }
    this.extractContextBasic();
    this.save();
    this.renderContext();
  },

  async importFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    let content = '', type = 'txt';
    if (ext === 'json') { content = await file.text(); type = 'json'; }
    else if (ext === 'md' || ext === 'markdown') { content = await file.text(); type = 'md'; }
    else if (ext === 'txt') { content = await file.text(); type = 'txt'; }
    else if (ext === 'docx') {
      if (typeof mammoth === 'undefined') throw new Error('DOCX parser not loaded');
      const buf = await file.arrayBuffer();
      const r = await mammoth.extractRawText({ arrayBuffer: buf });
      content = r.value; type = 'docx';
    } else throw new Error('Unsupported: .' + ext);

    this.state.context.documents.push({ id: 'd'+Date.now()+Math.random().toString(36).slice(2,6), name: file.name, type, content, importedAt: Date.now() });
    this.toast(this.t('imported') + ' ' + file.name, 'ok');
  },

  removeDoc(id) {
    this.state.context.documents = this.state.context.documents.filter(d => d.id !== id);
    this.extractContextBasic();
    this.save();
    this.renderContext();
  },

  // ── AI-POWERED EXTRACTION — handles any format ──
  async extractContextAI() {
    const docs = this.state.context.documents;
    if (!docs.length) { this.state.context.extracted = { features:[], techStack:[], personas:[], decisions:[] }; return; }

    const docSummaries = docs.map(d => {
      const truncated = d.content.length > 4000 ? d.content.slice(0, 4000) + '\n...(truncated)' : d.content;
      return `=== ${d.name} (${d.type}) ===\n${truncated}`;
    }).join('\n\n');

    this.toast(this.t('aiExtracting'), 'info');

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.state.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: this.state.model || 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: `Extract structured project context from these documents. Read carefully regardless of format, language, or structure.

DOCUMENTS:
${docSummaries}

Extract into these 4 categories:
- features: existing product features, modules, components, database tables, pages, screens
- techStack: technologies, frameworks, libraries, services, infrastructure
- personas: user types, target audiences, roles (just the name/label, not full descriptions)
- decisions: architectural decisions, locked choices, agreed constraints, rules

Return ONLY valid JSON (no markdown fences):
{
  "features": ["feature1", "feature2"],
  "techStack": ["tech1", "tech2"],
  "personas": ["persona1", "persona2"],
  "decisions": ["decision1", "decision2"]
}

Rules:
- Keep each item short (under 80 chars), descriptive enough to be useful
- For decisions, include the decision ID if present (e.g. "ADR-001: Use tRPC")
- For features, prefix database tables with [table] (e.g. "[table] users")
- Extract everything relevant, don't skip items
- If a category has nothing, use empty array` }]
        })
      });

      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const text = data.content?.[0]?.text || '';
      let parsed;
      try { parsed = JSON.parse(text); } catch(e) {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]); else throw new Error('Parse failed');
      }

      this.state.context.extracted = {
        features: [...new Set(parsed.features || [])].filter(Boolean),
        techStack: [...new Set(parsed.techStack || [])].filter(Boolean),
        personas: [...new Set(parsed.personas || [])].filter(Boolean),
        decisions: [...new Set(parsed.decisions || [])].filter(Boolean),
      };
      this.toast(this.t('ctxExtracted'), 'ok');
    } catch(err) {
      console.error('AI extraction failed:', err);
      this.toast(this.t('aiFailed'), 'err');
      this.extractContextBasic();
    }
  },

  // ── BASIC FALLBACK — no API key needed ──
  extractContextBasic() {
    const ext = { features: [], techStack: [], personas: [], decisions: [] };

    // ── 1. JSON docs — structured data ──
    this.state.context.documents.filter(d => d.type === 'json').forEach(d => {
      try {
        const obj = JSON.parse(d.content);
        const pick = (keys) => { for (const k of keys) { if (obj[k]) return [].concat(obj[k]); } return []; };
        const str = item => typeof item === 'string' ? item : item?.name || item?.title || item?.label || item?.description || JSON.stringify(item);

        pick(['features','modules','components','pages','screens','endpoints']).forEach(f => ext.features.push(str(f)));
        pick(['techStack','tech_stack','stack','technologies','tech','deps','dependencies']).forEach(t => ext.techStack.push(str(t)));
        pick(['personas','users','userTypes','user_types','roles','audience','actors']).forEach(p => ext.personas.push(str(p)));
        pick(['decisions','adrs','constraints','rules','principles','agreements']).forEach(d => ext.decisions.push(str(d)));
        pick(['tables','schemas','models','entities','collections']).forEach(t => ext.features.push('[table] ' + str(t)));

        Object.entries(obj).forEach(([key, val]) => {
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            if (/feature|module/i.test(key) && val.list) [].concat(val.list).forEach(f => ext.features.push(str(f)));
            if (/persona|user/i.test(key) && val.list) [].concat(val.list).forEach(p => ext.personas.push(str(p)));
          }
        });
      } catch(e) {}
    });

    // ── 2. Per-document text extraction ──
    this.state.context.documents.filter(d => d.type !== 'json').forEach(doc => {
      const fname = doc.name.toLowerCase();
      const lines = doc.content.split('\n');

      const fileHint =
        /decision|adr|constraint|rule|principle/i.test(fname) ? 'decision' :
        /persona|user.?type|audience|actor|role/i.test(fname) ? 'persona' :
        /feature|module|scope|mvp|backlog|roadmap|epic/i.test(fname) ? 'feature' :
        /prd|spec|requirement|brief/i.test(fname) ? 'mixed' :
        /stack|tech|architect|infra|setup/i.test(fname) ? 'tech' :
        /pain.?point|problem|issue|challenge/i.test(fname) ? 'feature' :
        null;

      let sectionHint = fileHint || '';

      lines.forEach((line) => {
        const t = line.trim();
        if (!t || t === '---' || t === '===') return;

        // ── Heading detection ──
        const headingMatch = t.match(/^(#{1,4})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const heading = headingMatch[2].trim();
          const hLow = heading.toLowerCase();

          if (/decision|adr|dec[\s-]?\d|constraint|rule|principle|locked|chosen|agreed|policy/i.test(hLow)) {
            sectionHint = 'decision';
            if (/adr|dec[\s-]?\d/i.test(hLow) || (fileHint === 'decision' && level >= 2)) {
              ext.decisions.push(heading);
            }
          } else if (/persona|user.?type|target.?user|audience|who.?use|customer|actor|role|stakeholder/i.test(hLow)) {
            sectionHint = 'persona';
            if (level >= 2 && !(/^(persona|user|target|audience|stakeholder|role)/i.test(hLow))) {
              ext.personas.push(heading);
            } else if (level >= 2) {
              const name = heading.replace(/^(persona|user|target\s*user|stakeholder)\s*\d*\s*[:—–\-]\s*/i, '').trim();
              if (name && name.length > 1 && name.length < 80) ext.personas.push(name);
            }
          } else if (/feature|module|component|function|capability|screen|page|endpoint|api|service/i.test(hLow)) {
            sectionHint = 'feature';
            if (level >= 2 && fileHint === 'feature') ext.features.push(heading);
          } else if (/stack|tech|infra|architect|tool|framework|library|depend/i.test(hLow)) {
            sectionHint = 'tech';
          } else if (/scope|mvp|v1|phase|sprint|milestone|roadmap|backlog|epic/i.test(hLow)) {
            sectionHint = 'feature';
          } else if (/pain|problem|issue|challenge|frustrat|gap/i.test(hLow)) {
            sectionHint = 'painpoint';
          } else {
            if (fileHint === 'decision' && level >= 2 && heading.length > 3) {
              ext.decisions.push(heading);
              sectionHint = 'decision-detail';
            } else if (fileHint === 'persona' && level >= 2 && heading.length > 1) {
              const name = heading.replace(/^(persona|user)\s*\d*\s*[:—–\-]\s*/i, '').trim();
              if (name) ext.personas.push(name);
              sectionHint = 'persona-detail';
            } else {
              sectionHint = fileHint || sectionHint;
            }
          }
          return;
        }

        // ── Content lines ──
        const isList = /^[-*•]\s+/.test(t) || /^\d+[.)]\s+/.test(t);
        const content = t.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '').replace(/^\*{1,2}(.+?)\*{1,2}/, '$1').trim();
        if (content.length < 2 || content.length > 200) return;

        const kvMatch = t.match(/^\*{0,2}([^:*]+?)\*{0,2}\s*[:：]\s*(.+)/);
        const kvKey = kvMatch ? kvMatch[1].trim().toLowerCase() : '';
        const kvVal = kvMatch ? kvMatch[2].replace(/\*{1,2}/g, '').trim() : '';

        if (kvKey && /^(decision|quyết định|rationale|lý do|context|bối cảnh|chosen|selected)$/i.test(kvKey) && kvVal.length > 3) {
          ext.decisions.push(kvVal);
          return;
        }

        if (kvKey && /^(status|trạng thái|state)$/i.test(kvKey) && sectionHint.startsWith('decision')) {
          const last = ext.decisions[ext.decisions.length - 1];
          if (last && !last.includes('[')) ext.decisions[ext.decisions.length - 1] = last + ' [' + kvVal + ']';
          return;
        }

        if (kvKey && /^(frontend|backend|database|db|realtime|ai|media|hosting|deploy|infra|auth|payment|stack|runtime|language|framework|library|service|cdn|storage|ci|monitoring)$/i.test(kvKey) && kvVal.length < 120) {
          ext.techStack.push(kvVal);
          return;
        }

        if (isList && content.length > 2) {
          switch(sectionHint) {
            case 'decision':
              ext.decisions.push(content);
              break;
            case 'persona':
              if (content.length < 80) ext.personas.push(content);
              break;
            case 'feature': case 'painpoint':
              if (content.length < 120) ext.features.push(content);
              break;
            case 'tech':
              // Only short items are likely real tech; long sentences are design decisions
              if (content.length < 80) ext.techStack.push(content);
              else ext.features.push(content); // long items are likely feature descriptions
              break;
            case 'mixed':
              if (/user|audience|persona|role|customer/i.test(content) && content.length < 60) ext.personas.push(content);
              else if (/decided|locked|must|shall|always|never|constraint/i.test(content)) ext.decisions.push(content);
              else if (content.length < 100) ext.features.push(content);
              break;
            default:
              if (/we decided|decision:|locked|agreed|constraint|must not|shall/i.test(content)) ext.decisions.push(content);
              break;
          }
        }

        if (t.startsWith('|') && t.endsWith('|') && !t.match(/^\|[\s-:|]+\|$/)) {
          const cells = t.split('|').map(c => c.trim()).filter(Boolean);
          if (cells.length >= 2 && cells[0].length > 2) {
            if (sectionHint === 'decision') ext.decisions.push(cells.join(' — '));
            else if (sectionHint === 'feature') ext.features.push(cells[0]);
            else if (sectionHint === 'persona') ext.personas.push(cells[0]);
          }
        }
      });
    });

    // ── 3. Tech stack — broad pattern matching across all text ──
    const allText = this.state.context.documents.map(d => d.content).join('\n\n');
    const techRe = /\b(Next\.?js|React|Vue\.?js|Angular|Svelte|SvelteKit|Nuxt|Remix|Astro|Gatsby|Supabase|Firebase|Postgres(?:QL)?|MySQL|MariaDB|MongoDB|Redis|SQLite|DynamoDB|CockroachDB|PlanetScale|Neon|Cassandra|ElasticSearch|Node\.?js|Deno|Bun|Python|Django|Flask|FastAPI|Ruby|Rails|PHP|Laravel|Go|Rust|Java|Spring|Kotlin|Swift|\.NET|C#|AWS|GCP|Azure|Vercel|Netlify|Cloudflare|Railway|Render|Fly\.io|Heroku|Docker|Kubernetes|K8s|Terraform|Ansible|GraphQL|gRPC|tRPC|REST\s*API|WebSocket|Tailwind(?:\s*CSS)?|Prisma|Drizzle|TypeORM|Sequelize|Mongoose|Stripe|PayPal|Auth0|Clerk|NextAuth|Supabase\s*Auth|Passport|JWT|OAuth|Gemini|OpenAI|Claude|Anthropic|Hugging\s*Face|LangChain|Expo|React\s*Native|Flutter|Ionic|Capacitor|PWA|Electron|Tauri|Vite|Webpack|esbuild|Turbo|Turborepo|pnpm|Yarn|npm|Bun|Jest|Vitest|Cypress|Playwright|Storybook|Figma|Zod|Yup|Zustand|Redux|Jotai|TanStack|Sentry|Datadog|Grafana|Prometheus|RabbitMQ|Kafka|BullMQ|Celery|Cron|GitHub\s*Actions|CircleCI|Jenkins|Cloudflare\s*Workers|Edge\s*Functions|S3|R2|Blob\s*Storage|CDN|Nginx|Caddy|Apache|PM2|Supervisor)\b/gi;
    const techMatches = allText.match(techRe);
    if (techMatches) {
      const normalized = techMatches.map(t => {
        const low = t.trim().toLowerCase();
        const map = {'nextjs':'Next.js','nodejs':'Node.js','vuejs':'Vue.js','postgresql':'PostgreSQL','postgres':'PostgreSQL','mysql':'MySQL','mongodb':'MongoDB','graphql':'GraphQL','tailwindcss':'Tailwind CSS','tailwind css':'Tailwind CSS','react native':'React Native','rest api':'REST API','github actions':'GitHub Actions','cloudflare workers':'Cloudflare Workers','edge functions':'Edge Functions'};
        return map[low] || t.trim();
      });
      ext.techStack.push(...normalized);
    }

    // ── 4. Deduplicate ──
    ext.features = [...new Set(ext.features)].filter(Boolean);
    ext.personas = [...new Set(ext.personas)].filter(Boolean);
    ext.decisions = [...new Set(ext.decisions)].filter(Boolean);

    const techSeen = new Map();
    ext.techStack.filter(Boolean).forEach(t => {
      const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!techSeen.has(key)) techSeen.set(key, t);
    });
    ext.techStack = [...techSeen.values()];

    this.state.context.extracted = ext;
  },

  renderContext() {
    const docs = this.state.context.documents;
    const ext = this.state.context.extracted;
    const idea = this.getIdea();
    const rc = idea?.aiResult?.relevant_context;

    // Documents list
    document.getElementById('doc-list').innerHTML = docs.length ? `
      <div>
        <div class="ctx-title">${this.t('documents')} (${docs.length})</div>
        ${docs.map(d => `
          <div class="doc-item">
            <div class="doc-icon ${d.type}">${d.type.toUpperCase()}</div>
            <div class="doc-name">${this.esc(d.name)}</div>
            <button class="doc-del" onclick="App.removeDoc('${d.id}')" title="Remove">✕</button>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Action buttons
    const actionBtns = docs.length ? `<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap">
      <button class="btn-s" style="font-size:10px;padding:3px 8px" onclick="App.reExtract()">${this.t('reScan')}</button>
      <button class="btn-s btn-gold" style="font-size:10px;padding:3px 8px" onclick="App.aiExtract()">${this.t('aiExtract')}</button>
      <button class="btn-s" style="font-size:10px;padding:3px 8px;color:var(--red)" onclick="App.clearContext()">${this.t('clear')}</button>
    </div>` : '';

    // Smart filtered view when idea has relevant_context
    if (rc && idea) {
      const total = (rc.decisions?.length||0) + (rc.features?.length||0) + (rc.tech?.length||0) + (rc.personas?.length||0) + (rc.tables?.length||0);
      document.getElementById('ctx-extracted').innerHTML = `
        <div>
          ${actionBtns}
          <div class="ctx-mode-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            ${this.t('relevantTo')} (${total})
          </div>
          <div style="font-size:9px;color:var(--tx3);margin-bottom:8px">${this.t('clickToExpand')}</div>

          ${this.renderCtxSection('affectedDecisions', rc.decisions, '⚖')}
          ${this.renderCtxSection('relatedFeatures', rc.features, '◈')}
          ${this.renderCtxSection('techInvolved', rc.tech, '⚡')}
          ${this.renderCtxSection('targetPersonas', rc.personas, '◉')}
          ${this.renderCtxSection('tablesAffected', rc.tables, '⬡')}

          <div style="margin-top:10px">
            <button class="btn-s" style="font-size:10px;padding:3px 8px;width:100%" onclick="App.showAllContext()">${this.t('allContext')} →</button>
          </div>
        </div>
      `;
      return;
    }

    // Default: show all extracted context
    const total = ext.features.length + ext.techStack.length + ext.personas.length + ext.decisions.length;
    document.getElementById('ctx-extracted').innerHTML = `
      <div>
        ${actionBtns}
        ${idea && !idea.aiResult && docs.length ? `<div class="ctx-empty-hint">${this.t('noRelevantCtx')}</div>` : ''}
        ${total ? `
          <div class="ctx-title">${this.t('extracted')}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.features.length}</div><div class="ctx-stat-label">${this.t('features')}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.techStack.length}</div><div class="ctx-stat-label">${this.t('tech')}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.personas.length}</div><div class="ctx-stat-label">${this.t('personas')}</div></div>
            <div class="ctx-stat"><div class="ctx-stat-val">${ext.decisions.length}</div><div class="ctx-stat-label">${this.t('decisions')}</div></div>
          </div>
          ${ext.techStack.length ? `<div class="ctx-title" style="font-size:9px">${this.t('techStack')}</div><div class="ctx-tags" style="margin-bottom:8px">${ext.techStack.slice(0,15).map(t=>`<span class="ctx-tag">${this.esc(t)}</span>`).join('')}</div>` : ''}
          ${ext.personas.length ? `<div class="ctx-title" style="font-size:9px">${this.t('personas')}</div><div class="ctx-tags" style="margin-bottom:8px">${ext.personas.slice(0,10).map(p=>`<span class="ctx-tag">${this.esc(p)}</span>`).join('')}</div>` : ''}
          ${ext.decisions.length ? `<div class="ctx-title" style="font-size:9px">${this.t('decisions')} (${ext.decisions.length})</div><div class="ctx-tags" style="margin-bottom:8px">${ext.decisions.slice(0,12).map(d=>`<span class="ctx-tag">${this.esc(d.length>40?d.slice(0,38)+'…':d)}</span>`).join('')}</div>` : ''}
          ${ext.features.length ? `<div class="ctx-title" style="font-size:9px">${this.t('features')} (${ext.features.length})</div><div class="ctx-tags">${ext.features.slice(0,20).map(f=>`<span class="ctx-tag">${this.esc(f.length>30?f.slice(0,28)+'…':f)}</span>`).join('')}</div>` : ''}
        ` : (docs.length ? `<div style="font-size:11px;color:var(--tx3);padding:8px 0">${this.t('reScanHint')}</div>` : '')}
      </div>
    `;
  },

  renderCtxSection(titleKey, items, icon) {
    if (!items?.length) return '';
    return `
      <div class="ctx-section">
        <div class="ctx-section-hdr">${icon} ${this.t(titleKey)} <span class="ctx-count">${items.length}</span></div>
        ${items.map(i => {
          const rel = i.impact || i.relation || 'supports';
          return `<div class="ctx-rel-item">
            <div class="ctx-rel-name">
              <span>${this.esc(i.item)}</span>
              <span class="ctx-rel-badge badge-${rel}">${this.t(rel)}</span>
            </div>
            <div class="ctx-rel-reason">${this.esc(i.reason || '')}</div>
          </div>`;
        }).join('')}
      </div>
    `;
  },

  showAllContext() {
    // Temporarily clear currentId to force full context view
    const savedId = this.currentId;
    this.currentId = null;
    this.renderContext();
    this.currentId = savedId;
  },

  reExtract() {
    this.extractContextBasic();
    this.save();
    this.renderContext();
    this.toast(this.t('ctxReExtracted'), 'ok');
  },

  async aiExtract() {
    if (!this.state.apiKey) { this.toast(this.t('setApiKey'), 'err'); this.openSettings(); return; }
    if (!this.state.context.documents.length) { this.toast(this.t('importFirst'), 'err'); return; }
    await this.extractContextAI();
    this.save();
    this.renderContext();
  },

  clearContext() {
    if (!confirm(this.t('clearConfirm'))) return;
    this.state.context = { documents: [], extracted: { features:[], techStack:[], personas:[], decisions:[] } };
    this.save();
    this.renderContext();
    this.toast(this.t('ctxCleared'), 'info');
  },

  // ── SETTINGS ──
  openSettings() {
    const currentModel = this.state.model || 'claude-sonnet-4-20250514';
    const currentLang = this.state.lang || 'en';
    document.getElementById('modal-body').innerHTML = `
      <h2>${this.t('settingsTitle')}</h2>
      <p>${this.t('settingsDesc')}</p>
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:4px">${this.t('apiKeyLabel')}</div>
        <input type="password" class="idea-input" id="api-key-input" value="${this.esc(this.state.apiKey)}" placeholder="sk-ant-..." style="font-family:var(--mono);font-size:12px">
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:6px">${this.t('modelLabel')}</div>
        <div style="display:flex;flex-direction:column;gap:4px" id="model-selector">
          ${MODELS.map(m => `
            <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--r);border:1.5px solid ${m.id === currentModel ? 'var(--gold)' : 'var(--bd)'};background:${m.id === currentModel ? 'color-mix(in srgb, var(--gold) 5%, var(--sur))' : 'var(--sur)'};cursor:pointer;transition:all .15s">
              <input type="radio" name="model" value="${m.id}" ${m.id === currentModel ? 'checked' : ''} style="accent-color:var(--gold)">
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${m.label}</div>
                <div style="font-size:10px;color:var(--tx3)">${this.t(m.descKey)}</div>
              </div>
              <div style="font-size:10px;font-weight:700;color:var(--tx3);font-family:var(--mono)">${m.tier}</div>
            </label>
          `).join('')}
        </div>
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:6px">${this.t('langLabel')}</div>
        <div style="display:flex;gap:6px" id="lang-selector">
          <button class="btn-s${currentLang==='en'?' btn-gold':''}" data-lang="en" style="flex:1;text-align:center">🇬🇧 English</button>
          <button class="btn-s${currentLang==='vi'?' btn-gold':''}" data-lang="vi" style="flex:1;text-align:center">🇻🇳 Tiếng Việt</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-s" onclick="App.closeModal()">${this.t('cancel')}</button>
        <button class="btn-s btn-p" onclick="App.saveSettings()">${this.t('save')}</button>
      </div>
    `;
    document.getElementById('model-selector').addEventListener('change', e => {
      document.querySelectorAll('#model-selector label').forEach(l => {
        const r = l.querySelector('input');
        l.style.borderColor = r.checked ? 'var(--gold)' : 'var(--bd)';
        l.style.background = r.checked ? 'color-mix(in srgb, var(--gold) 5%, var(--sur))' : 'var(--sur)';
      });
    });
    document.getElementById('lang-selector').addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;
      document.querySelectorAll('#lang-selector .btn-s').forEach(b => { b.classList.remove('btn-gold'); });
      btn.classList.add('btn-gold');
    });
    document.getElementById('modal-bg').classList.add('open');
    setTimeout(() => document.getElementById('api-key-input')?.focus(), 100);
  },

  saveSettings() {
    // Strip non-ASCII chars that break fetch headers (ISO-8859-1 requirement)
    const raw = document.getElementById('api-key-input')?.value || '';
    this.state.apiKey = raw.replace(/[^\x20-\x7E]/g, '').trim();
    const selected = document.querySelector('input[name="model"]:checked');
    if (selected) this.state.model = selected.value;
    const langBtn = document.querySelector('#lang-selector .btn-gold');
    if (langBtn) this.state.lang = langBtn.dataset.lang;
    this.save();
    this.closeModal();
    const m = MODELS.find(m => m.id === this.state.model);
    this.toast(`${this.t('savedUsing')} ${m?.label || 'Sonnet 4'}`, 'ok');
    this.renderAll();
  },

  closeModal() { document.getElementById('modal-bg').classList.remove('open'); },

  // ── TOAST ──
  toast(msg, type='info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 2500);
  },

  // ── UTILS ──
  esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; },
};

// Close modal on bg click
document.getElementById('modal-bg').addEventListener('click', e => { if (e.target === e.currentTarget) App.closeModal(); });

// Init
document.addEventListener('DOMContentLoaded', () => App.init());
