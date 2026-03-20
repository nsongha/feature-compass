/* ═══════════════════════════════════════════════
   FEATURE COMPASS — Entry Point
   Composes all modules into the global App object
   ═══════════════════════════════════════════════ */
const App = (() => {
  'use strict';

  const { t, setLang, MODELS } = I18nModule;
  const { esc, toast, closeModal, openSettings, readSettingsValues, toggleDrawer, closeDrawer, toggleSheet, closeMobileOverlays } = UiModule;
  const { state, getCurrentId, setCurrentId, getFilter, setFilter, load, save, getIdea, addIdea, removeIdea, updateField: stateUpdateField, setVerdict: stateSetVerdict, calcVerdict, exportState, importState } = StateModule;
  const { callAI, buildContext } = ApiModule;
  const { handleFiles, removeDoc: ctxRemoveDoc, clearContext: ctxClearContext, reExtract: ctxReExtract, extractContextAI, bindDrop } = ContextModule;
  const { renderAll, renderList, renderEval, renderContext, emptyStateHTML } = RendererModule;
  const { showPortfolio: pfShowPortfolio, exportIdea: pfExportIdea, exportAll: pfExportAll, exportConflicts: pfExportConflicts } = PortfolioModule;
  const DG = DocgenModule;
  const IM = ImpactMapModule;

  let _currentPage = 'ideas';

  return {
    init() {
      load();
      this.bindNav();
      bindDrop(() => renderContext());
      document.getElementById('modal-bg').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
      document.getElementById('drawer-overlay').addEventListener('click', () => closeMobileOverlays());
      renderAll();
      if (state.ideas.length) this.select(state.ideas[0].id);
    },

    bindNav() {
      document.getElementById('filter-row').addEventListener('click', e => {
        const btn = e.target.closest('.fchip');
        if (!btn) return;
        setFilter(btn.dataset.f);
        document.querySelectorAll('.fchip').forEach(b => b.classList.toggle('active', b === btn));
        renderList();
      });
    },

    // ── PAGE SWITCHING ──
    showDocs() {
      _currentPage = 'docs';
      document.getElementById('ideas-page').style.display = 'none';
      document.getElementById('docgen-page').style.display = '';
      document.getElementById('impactmap-page').style.display = 'none';
      document.querySelectorAll('.page-tab').forEach(t => t.classList.toggle('active', t.dataset.page === 'docs'));
      DG.render();
      // Bind upload zone after render
      setTimeout(() => DG.bindUpload(), 50);
    },
    showIdeas() {
      _currentPage = 'ideas';
      document.getElementById('docgen-page').style.display = 'none';
      document.getElementById('impactmap-page').style.display = 'none';
      document.getElementById('ideas-page').style.display = '';
      document.querySelectorAll('.page-tab').forEach(t => t.classList.toggle('active', t.dataset.page === 'ideas'));
      renderAll();
    },
    showImpactMap() {
      _currentPage = 'impactmap';
      document.getElementById('ideas-page').style.display = 'none';
      document.getElementById('docgen-page').style.display = 'none';
      document.getElementById('impactmap-page').style.display = '';
      document.querySelectorAll('.page-tab').forEach(t => t.classList.toggle('active', t.dataset.page === 'impactmap'));
      IM.render();
    },

    select(id) {
      setCurrentId(id);
      closeMobileOverlays();
      renderList();
      renderEval();
      renderContext();
    },

    newIdea() {
      if (_currentPage !== 'ideas') this.showIdeas();
      const idea = addIdea();
      this.select(idea.id);
      setTimeout(() => { const el = document.querySelector('.idea-input'); if (el) el.focus(); }, 50);
    },

    updateField(field, val) {
      stateUpdateField(field, val);
      if (field === 'title') {
        const btn = document.getElementById('btn-eval');
        if (btn) btn.disabled = !val.trim();
        renderList();
      }
    },

    setVerdict(v) {
      stateSetVerdict(v);
      renderEval();
      renderList();
    },

    deleteIdea() {
      if (!confirm(t('deleteConfirm'))) return;
      const id = getCurrentId();
      removeIdea(id);
      setCurrentId(null);
      document.getElementById('center-inner').innerHTML = emptyStateHTML();
      renderList();
      toast(t('deleted'), 'info');
    },

    async runAI() {
      const idea = getIdea();
      if (!idea || !idea.title) return;
      if (!state.apiKey) { toast(t('setApiKey'), 'err'); this.openSettings(); return; }

      idea._loading = true;
      renderEval();

      try {
        const contextStr = buildContext(state.context.documents, state.context.extracted);
        const result = await callAI(idea, state.apiKey, state.model, contextStr, state.lang);
        idea.aiResult = result;
        idea.scores = {
          impact: Math.min(10, Math.max(0, result.scores?.impact?.score ?? 5)),
          fit: Math.min(10, Math.max(0, result.scores?.fit?.score ?? 5)),
          effort: Math.min(10, Math.max(0, result.scores?.effort?.score ?? 5)),
          conflict: Math.min(10, Math.max(0, result.scores?.conflict?.score ?? 5)),
        };
        idea.overrides = { ...idea.scores };
        idea.verdict = calcVerdict(idea.scores, result);
        toast(t('evalComplete'), 'ok');
      } catch (err) {
        console.error(err);
        toast(t('aiError') + err.message, 'err');
      }

      idea._loading = false;
      save();
      renderEval();
      renderList();
      renderContext();
    },

    // ── Context panel actions ──
    removeDoc(id) { ctxRemoveDoc(id); renderContext(); },
    reExtract() { ctxReExtract(); renderContext(); },
    async aiExtract() {
      if (!state.apiKey) { toast(t('setApiKey'), 'err'); this.openSettings(); return; }
      if (!state.context.documents.length) { toast(t('importFirst'), 'err'); return; }
      await extractContextAI();
      save();
      renderContext();
    },
    clearContext() { if (ctxClearContext()) renderContext(); },
    showAllContext() {
      const savedId = getCurrentId();
      setCurrentId(null);
      renderContext();
      setCurrentId(savedId);
    },

    // ── Portfolio ──
    showPortfolio() { pfShowPortfolio(() => renderList()); },
    exportIdea() { pfExportIdea(); },
    exportAll() { pfExportAll(); },
    exportConflicts() { pfExportConflicts(); },

    // ── Settings ──
    openSettings() {
      openSettings(state, {
        exportData: () => exportState(),
        importData: (file) => importState(file),
      });
    },
    saveSettings() {
      const { apiKey, model, lang } = readSettingsValues();
      state.apiKey = apiKey;
      if (model) state.model = model;
      if (lang) { state.lang = lang; setLang(lang); }
      save();
      closeModal();
      const m = MODELS.find(m => m.id === state.model);
      toast(`${t('savedUsing')} ${m?.label || 'Sonnet 4'}`, 'ok');
      renderAll();
    },
    closeModal() { closeModal(); },

    // ── Mobile responsive ──
    toggleDrawer() { toggleDrawer(); },
    toggleSheet() { toggleSheet(); },

    // ── Doc Generator ──
    dgGoStep(n) { DG.goStep(n); setTimeout(() => DG.bindUpload(), 50); },
    dgAnalyze() { DG.analyze(); },
    dgToggleDoc(k) { DG.toggleDoc(k); },
    dgStartBuilder() { DG.startBuilder(); },
    dgSelectDoc(k) { DG.selectDoc(k); },
    dgAnswer(dk, si, oi) { DG.answer(dk, si, oi); },
    dgSetNote(dk, si, v) { DG.setNote(dk, si, v); },
    dgGenerateMarkdown(k) { DG.generateMarkdown(k); },
    dgRunCrossCheck() { DG.runCrossCheck(); },
    dgCopyDoc(k) { DG.copyDoc(k); },
    dgDownloadDoc(k) { DG.downloadDoc(k); },
    dgDownloadAll() { DG.downloadAll(); },
    dgInjectToContext() { DG.injectToContext(); },
    dgRemoveUpload(i) { DG.removeUpload(i); },
    dgSkipWithUploads() { DG.skipWithUploads(); },

    // ── Exposed utils for inline handlers ──
    esc,
    t,

    // ── Impact Map ──
    imAnalyze() { IM.analyzeImpact(); },
    imEdit(id) { IM.edit(id); },
    imSave(id) { IM.saveEdit(id); },
    imRevert(id) { IM.revert(id); },
    imCancel() { IM.cancelEdit(); },
  };
})();

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => App.init());

