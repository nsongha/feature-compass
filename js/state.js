/* ═══════════════════════════════════════════════
   MODULE: STATE — State management & localStorage
   Depends on: I18nModule, UiModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const StateModule = (() => {
  'use strict';

  const { t, setLang } = I18nModule;
  const { toast } = UiModule;

  const DEFAULT_STATE = {
    apiKey: '', model: 'claude-sonnet-4-20250514', lang: 'en', ideas: [],
    context: { documents: [], extracted: { features: [], techStack: [], personas: [], decisions: [] } }
  };

  const state = { ...DEFAULT_STATE, ideas: [], context: { documents: [], extracted: { features: [], techStack: [], personas: [], decisions: [] } } };
  let currentId = null;
  let filter = 'all';

  function getCurrentId() { return currentId; }
  function setCurrentId(id) { currentId = id; }
  function getFilter() { return filter; }
  function setFilter(f) { filter = f; }

  /** Load state from localStorage with migration & error handling */
  function load() {
    try {
      const old = localStorage.getItem('feature-compass-state');
      if (old && !localStorage.getItem('fc-state')) {
        localStorage.setItem('fc-state', old);
        localStorage.removeItem('feature-compass-state');
      }
      const s = localStorage.getItem('fc-state');
      if (s) {
        const parsed = JSON.parse(s);
        Object.assign(state, parsed);
        // Ensure nested structures exist
        if (!state.context) state.context = DEFAULT_STATE.context;
        if (!state.context.extracted) state.context.extracted = DEFAULT_STATE.context.extracted;
        if (!state.context.documents) state.context.documents = [];
      }
      if (state.apiKey) state.apiKey = state.apiKey.replace(/[^\x20-\x7E]/g, '').trim();
      setLang(state.lang || 'en');
    } catch (e) {
      console.error('Load failed:', e);
      toast(t('loadFailed'), 'err');
    }
  }

  /** Save state to localStorage with error handling */
  function save() {
    try {
      localStorage.setItem('fc-state', JSON.stringify(state));
    } catch (e) {
      console.error('Save failed:', e);
      toast(t('storageFull'), 'err');
    }
  }

  function getIdea() { return state.ideas.find(i => i.id === currentId); }

  /** Create new idea and return it */
  function addIdea() {
    const idea = {
      id: 'i' + Date.now() + Math.random().toString(36).slice(2, 6),
      title: '', description: '',
      scores: null, overrides: null, aiResult: null, verdict: null,
      userNotes: '', createdAt: Date.now()
    };
    state.ideas.unshift(idea);
    save();
    return idea;
  }

  function removeIdea(id) {
    state.ideas = state.ideas.filter(i => i.id !== id);
    save();
  }

  function updateField(field, val) {
    const idea = getIdea();
    if (!idea) return;
    idea[field] = val;
    save();
  }

  function setVerdict(v) {
    const idea = getIdea();
    if (!idea) return;
    idea.verdict = v;
    save();
  }

  /** Calculate verdict from scores & AI result */
  function calcVerdict(scores, ai) {
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
  }

  /** Export all state as downloadable JSON backup */
  function exportState() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = URL.createObjectURL(blob);
    a.download = `feature-compass-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t('backupExported'), 'ok');
  }

  /** Import state from JSON file */
  async function importState(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Validate structure
      if (!parsed.ideas || !Array.isArray(parsed.ideas)) throw new Error('Missing ideas array');
      if (!confirm(t('importConfirm'))) return;
      Object.assign(state, parsed);
      if (!state.context) state.context = DEFAULT_STATE.context;
      if (!state.context.extracted) state.context.extracted = DEFAULT_STATE.context.extracted;
      setLang(state.lang || 'en');
      save();
      toast(t('backupImported'), 'ok');
      setTimeout(() => location.reload(), 800);
    } catch (e) {
      console.error('Import failed:', e);
      toast(t('backupInvalid') + ': ' + e.message, 'err');
    }
  }

  return {
    state, getCurrentId, setCurrentId, getFilter, setFilter,
    load, save, getIdea, addIdea, removeIdea, updateField, setVerdict,
    calcVerdict, exportState, importState
  };
})();
