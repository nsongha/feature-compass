/* ═══════════════════════════════════════════════
   MODULE: UI — Toast, Modal, Drawer, Utils
   Depends on: I18nModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const UiModule = (() => {
  'use strict';

  const { t, MODELS } = I18nModule;

  /** HTML-escape user/AI content to prevent XSS */
  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /** Show toast notification */
  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    const box = document.getElementById('toasts');
    if (box) box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 2500);
  }

  /** Open modal */
  function openModal() { document.getElementById('modal-bg').classList.add('open'); }

  /** Close modal */
  function closeModal() { document.getElementById('modal-bg').classList.remove('open'); }

  /** Toggle mobile sidebar drawer */
  function toggleDrawer() {
    const left = document.querySelector('.left');
    const overlay = document.getElementById('drawer-overlay');
    if (!left || !overlay) return;
    const open = left.classList.toggle('drawer-open');
    overlay.classList.toggle('open', open);
    // Close sheet if open
    if (open) {
      const right = document.getElementById('right-panel');
      if (right) right.classList.remove('sheet-open');
    }
  }

  /** Close mobile drawer */
  function closeDrawer() {
    const left = document.querySelector('.left');
    const overlay = document.getElementById('drawer-overlay');
    if (left) left.classList.remove('drawer-open');
    if (overlay) overlay.classList.remove('open');
  }

  /** Toggle mobile context bottom sheet */
  function toggleSheet() {
    const right = document.getElementById('right-panel');
    const overlay = document.getElementById('drawer-overlay');
    if (!right || !overlay) return;
    const open = right.classList.toggle('sheet-open');
    overlay.classList.toggle('open', open);
    // Close drawer if open
    if (open) {
      const left = document.querySelector('.left');
      if (left) left.classList.remove('drawer-open');
    }
  }

  /** Close all mobile overlays */
  function closeMobileOverlays() {
    closeDrawer();
    const right = document.getElementById('right-panel');
    const overlay = document.getElementById('drawer-overlay');
    if (right) right.classList.remove('sheet-open');
    if (overlay) overlay.classList.remove('open');
  }

  /** Render Settings modal content */
  function openSettings(state, onSave) {
    const currentModel = state.model || 'claude-sonnet-4-20250514';
    const currentLang = state.lang || 'en';
    document.getElementById('modal-body').innerHTML = `
      <h2>${t('settingsTitle')}</h2>
      <p>${t('settingsDesc')}</p>
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:4px">${t('apiKeyLabel')}</div>
        <input type="password" class="idea-input" id="api-key-input" value="${esc(state.apiKey)}" placeholder="sk-ant-..." style="font-family:var(--mono);font-size:12px">
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:6px">${t('modelLabel')}</div>
        <div style="display:flex;flex-direction:column;gap:4px" id="model-selector">
          ${MODELS.map(m => `
            <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--r);border:1.5px solid ${m.id === currentModel ? 'var(--gold)' : 'var(--bd)'};background:${m.id === currentModel ? 'color-mix(in srgb, var(--gold) 5%, var(--sur))' : 'var(--sur)'};cursor:pointer;transition:all .15s">
              <input type="radio" name="model" value="${m.id}" ${m.id === currentModel ? 'checked' : ''} style="accent-color:var(--gold)">
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${esc(m.label)}</div>
                <div style="font-size:10px;color:var(--tx3)">${t(m.descKey)}</div>
              </div>
              <div style="font-size:10px;font-weight:700;color:var(--tx3);font-family:var(--mono)">${esc(m.tier)}</div>
            </label>
          `).join('')}
        </div>
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:6px">${t('langLabel')}</div>
        <div style="display:flex;gap:6px" id="lang-selector">
          <button class="btn-s${currentLang==='en'?' btn-gold':''}" data-lang="en" style="flex:1;text-align:center">🇬🇧 English</button>
          <button class="btn-s${currentLang==='vi'?' btn-gold':''}" data-lang="vi" style="flex:1;text-align:center">🇻🇳 Tiếng Việt</button>
        </div>
      </div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;color:var(--tx2);margin-bottom:6px">${t('dataSection')}</div>
        <div style="display:flex;gap:6px">
          <button class="btn-s" id="btn-export-data" style="flex:1;text-align:center">${t('exportData')}</button>
          <button class="btn-s" id="btn-import-data" style="flex:1;text-align:center">${t('importData')}</button>
          <input type="file" id="backup-input" accept=".json" style="display:none">
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-s" onclick="App.closeModal()">${t('cancel')}</button>
        <button class="btn-s btn-p" onclick="App.saveSettings()">${t('save')}</button>
      </div>
    `;
    // Bind model radio visual update
    document.getElementById('model-selector').addEventListener('change', () => {
      document.querySelectorAll('#model-selector label').forEach(l => {
        const r = l.querySelector('input');
        l.style.borderColor = r.checked ? 'var(--gold)' : 'var(--bd)';
        l.style.background = r.checked ? 'color-mix(in srgb, var(--gold) 5%, var(--sur))' : 'var(--sur)';
      });
    });
    // Bind lang toggle
    document.getElementById('lang-selector').addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;
      document.querySelectorAll('#lang-selector .btn-s').forEach(b => b.classList.remove('btn-gold'));
      btn.classList.add('btn-gold');
    });
    // Bind backup buttons
    document.getElementById('btn-export-data').addEventListener('click', () => {
      if (onSave && onSave.exportData) onSave.exportData();
    });
    const backupInput = document.getElementById('backup-input');
    document.getElementById('btn-import-data').addEventListener('click', () => backupInput.click());
    backupInput.addEventListener('change', e => {
      if (e.target.files[0] && onSave && onSave.importData) onSave.importData(e.target.files[0]);
    });

    openModal();
    setTimeout(() => document.getElementById('api-key-input')?.focus(), 100);
  }

  /** Read values from the settings modal */
  function readSettingsValues() {
    const raw = document.getElementById('api-key-input')?.value || '';
    const apiKey = raw.replace(/[^\x20-\x7E]/g, '').trim();
    const selected = document.querySelector('input[name="model"]:checked');
    const model = selected ? selected.value : null;
    const langBtn = document.querySelector('#lang-selector .btn-gold');
    const lang = langBtn ? langBtn.dataset.lang : null;
    return { apiKey, model, lang };
  }

  return { esc, toast, openModal, closeModal, openSettings, readSettingsValues, toggleDrawer, closeDrawer, toggleSheet, closeMobileOverlays };
})();
