/* ═══════════════════════════════════════════════
   MODULE: IMPACTMAP — Document Impact Visualizer
   Depends on: I18nModule, UiModule, StateModule, ApiModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const ImpactMapModule = (() => {
  'use strict';

  const { t } = I18nModule;
  const { esc, toast } = UiModule;
  const { state, save } = StateModule;
  const { callAnthropic, parseAIJson } = ApiModule;

  // ── EDGE COLORS ──
  const EDGE_COLORS = {
    supports:   { light: '#1D9E75', dark: '#6FD4A8' },
    conflicts:  { light: '#D94444', dark: '#F09595' },
    constrains: { light: '#D48A0A', dark: '#F0C060' },
  };

  const EDGE_DASH = {
    supports: [],
    conflicts: [],
    constrains: [6, 4],
  };

  let _editingNodeId = null;
  let _hoveredEdge = null;
  let _tooltipEl = null;
  let _canvasEl = null;
  let _containerEl = null;
  let _resizeObserver = null;

  // ── STATE ──

  function ensureState() {
    if (!state.impactMap) {
      state.impactMap = { nodes: [], edges: [], analyzed: false };
    }
  }

  function im() { ensureState(); return state.impactMap; }

  // ── SPLITTING DOCS INTO NODES ──

  function splitDocsToNodes(docs) {
    const nodes = [];
    let yOffset = 0;

    docs.forEach((doc, di) => {
      const sections = splitMarkdownSections(doc.content || '');
      const xBase = di * 320;

      if (sections.length === 0) {
        // Whole doc as single node
        nodes.push({
          id: `im_${doc.id || di}_0`,
          docId: doc.id || `d${di}`,
          docName: doc.name,
          sectionTitle: doc.name,
          content: (doc.content || '').slice(0, 500),
          originalContent: (doc.content || '').slice(0, 500),
          x: xBase,
          y: 0,
          edited: false,
        });
      } else {
        sections.forEach((sec, si) => {
          nodes.push({
            id: `im_${doc.id || di}_${si}`,
            docId: doc.id || `d${di}`,
            docName: doc.name,
            sectionTitle: sec.title,
            content: sec.content.slice(0, 500),
            originalContent: sec.content.slice(0, 500),
            x: xBase,
            y: si * 180,
            edited: false,
          });
        });
      }
      yOffset = 0;
    });

    return nodes;
  }

  function splitMarkdownSections(md) {
    const lines = md.split('\n');
    const sections = [];
    let currentTitle = '';
    let currentLines = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        if (currentTitle || currentLines.length) {
          sections.push({ title: currentTitle || 'Introduction', content: currentLines.join('\n').trim() });
        }
        currentTitle = match[2].trim();
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentTitle || currentLines.length) {
      sections.push({ title: currentTitle || 'Content', content: currentLines.join('\n').trim() });
    }
    return sections;
  }

  // ── LAYOUT ──

  function layoutNodes(nodes) {
    // Group by doc
    const groups = {};
    nodes.forEach(n => {
      if (!groups[n.docId]) groups[n.docId] = [];
      groups[n.docId].push(n);
    });

    const groupKeys = Object.keys(groups);
    const colWidth = 300;
    const colGap = 60;
    const rowHeight = 160;
    const rowGap = 20;
    const startX = 20;
    const startY = 20;

    groupKeys.forEach((gk, gi) => {
      const group = groups[gk];
      group.forEach((node, ni) => {
        node.x = startX + gi * (colWidth + colGap);
        node.y = startY + ni * (rowHeight + rowGap);
      });
    });
  }

  // ── RENDERING ──

  function render() {
    const el = document.getElementById('impactmap-page');
    if (!el) return;
    ensureState();

    const docs = state.context?.documents || [];
    const d = im();

    // Rebuild nodes from docs if needed
    if (docs.length && (!d.nodes.length || d.nodes.length === 0)) {
      d.nodes = splitDocsToNodes(docs);
      layoutNodes(d.nodes);
      save();
    }

    if (!docs.length) {
      el.innerHTML = `
        <div class="im-wrap">
          <div class="empty-state" style="height:70vh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <h2>${esc(t('imEmpty'))}</h2>
            <p>${esc(t('imEmptyHint'))}</p>
            <button class="btn-s btn-p" onclick="App.showIdeas()" style="margin-top:4px">${esc(t('imNoDocsHint'))}</button>
          </div>
        </div>`;
      return;
    }

    const nodeCount = d.nodes.length;
    const edgeCount = d.edges.length;
    const editedCount = d.nodes.filter(n => n.edited).length;

    // Calculate canvas dimensions
    let maxX = 0, maxY = 0;
    d.nodes.forEach(n => {
      if (n.x + 280 > maxX) maxX = n.x + 280;
      if (n.y + 140 > maxY) maxY = n.y + 140;
    });
    maxX += 40;
    maxY += 40;

    el.innerHTML = `
      <div class="im-wrap">
        <div class="im-toolbar">
          <div class="im-toolbar-left">
            <div class="im-toolbar-title">${esc(t('imTitle'))}</div>
            <div class="im-toolbar-stats">
              <span class="pill" style="background:var(--sur2);color:var(--tx2)">${nodeCount} ${esc(t('imSections'))}</span>
              <span class="pill" style="background:var(--sur2);color:var(--tx2)">${edgeCount} ${esc(t('imRelations'))}</span>
              ${editedCount ? `<span class="pill" style="background:var(--abg);color:var(--atx)">${editedCount} ${esc(t('imEditedLabel'))}</span>` : ''}
            </div>
          </div>
          <div class="im-toolbar-right">
            <button class="btn-s btn-gold" onclick="App.imAnalyze()" id="im-btn-analyze"
              ${!state.apiKey ? 'disabled title="' + esc(t('setApiKey')) + '"' : ''}>
              ${d.analyzed ? esc(t('imReAnalyze')) : esc(t('imAnalyze'))}
            </button>
          </div>
        </div>
        <div class="im-legend">
          <span class="im-legend-item"><span class="im-legend-dot" style="background:var(--grn)"></span>${esc(t('imSupports'))}</span>
          <span class="im-legend-item"><span class="im-legend-dot" style="background:var(--red)"></span>${esc(t('imConflict'))}</span>
          <span class="im-legend-item"><span class="im-legend-dot" style="background:var(--amb)"></span>${esc(t('imConstrains'))}</span>
        </div>
        <div class="im-canvas-wrap" id="im-canvas-wrap">
          <canvas id="im-canvas" width="${maxX * 2}" height="${maxY * 2}" style="width:${maxX}px;height:${maxY}px"></canvas>
          <div id="im-nodes-overlay" style="width:${maxX}px;height:${maxY}px;position:relative"></div>
          <div class="im-edge-tooltip" id="im-edge-tooltip" style="display:none"></div>
        </div>
      </div>`;

    _canvasEl = document.getElementById('im-canvas');
    _containerEl = document.getElementById('im-canvas-wrap');
    _tooltipEl = document.getElementById('im-edge-tooltip');

    renderNodes(d);
    drawEdges(d);
    bindCanvasHover(d);
  }

  function renderNodes(d) {
    const overlay = document.getElementById('im-nodes-overlay');
    if (!overlay) return;

    overlay.innerHTML = d.nodes.map(node => {
      const isEditing = _editingNodeId === node.id;
      const truncated = node.content.length > 120 ? node.content.slice(0, 120) + '…' : node.content;

      return `<div class="im-node${node.edited ? ' edited' : ''}" style="left:${node.x}px;top:${node.y}px" id="imn-${node.id}">
        <div class="im-node-doc">${esc(node.docName)}</div>
        <div class="im-node-title">${esc(node.sectionTitle)}${node.edited ? ` <span class="im-edited-badge">${esc(t('imEditedLabel'))}</span>` : ''}</div>
        ${isEditing ? `
          <textarea class="im-node-editor" id="im-editor-${node.id}">${esc(node.content)}</textarea>
          <div class="im-node-actions">
            <button class="btn-s btn-p" onclick="App.imSave('${node.id}')">${esc(t('imSave'))}</button>
            <button class="btn-s" onclick="App.imCancel()">${esc(t('imCancel'))}</button>
          </div>
        ` : `
          <div class="im-node-content">${esc(truncated) || '<em style="color:var(--tx3)">—</em>'}</div>
          <div class="im-node-actions">
            <button class="btn-s" onclick="App.imEdit('${node.id}')" title="${esc(t('imEdit'))}">✏️ ${esc(t('imEdit'))}</button>
            ${node.edited ? `<button class="btn-s" onclick="App.imRevert('${node.id}')" title="${esc(t('imRevert'))}">↩ ${esc(t('imRevert'))}</button>` : ''}
          </div>
        `}
      </div>`;
    }).join('');

    // Focus editor if editing
    if (_editingNodeId) {
      const editor = document.getElementById(`im-editor-${_editingNodeId}`);
      if (editor) setTimeout(() => editor.focus(), 50);
    }
  }

  // ── CANVAS EDGE DRAWING ──

  function drawEdges(d) {
    if (!_canvasEl) return;
    const ctx = _canvasEl.getContext('2d');
    const dpr = 2; // retina
    ctx.clearRect(0, 0, _canvasEl.width, _canvasEl.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    d.edges.forEach(edge => {
      const fromNode = d.nodes.find(n => n.id === edge.from);
      const toNode = d.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const nodeW = 260;
      const nodeH = 130;
      const fromCx = fromNode.x + nodeW / 2;
      const fromCy = fromNode.y + nodeH;
      const toCx = toNode.x + nodeW / 2;
      const toCy = toNode.y;

      const colors = EDGE_COLORS[edge.type] || EDGE_COLORS.supports;
      const color = isDark ? colors.dark : colors.light;
      const dash = EDGE_DASH[edge.type] || [];

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = edge.type === 'conflicts' ? 2.5 : 1.8;
      ctx.setLineDash(dash);

      // Bezier curve
      const cpOffset = Math.abs(fromCy - toCy) * 0.4 + 40;
      ctx.moveTo(fromCx, fromCy);
      ctx.bezierCurveTo(fromCx, fromCy + cpOffset, toCx, toCy - cpOffset, toCx, toCy);
      ctx.stroke();

      // Arrow head
      const arrowSize = 6;
      const angle = Math.atan2(toCy - (toCy - cpOffset), toCx - toCx) || Math.PI / 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(toCx, toCy);
      ctx.lineTo(toCx - arrowSize * Math.cos(angle - 0.4), toCy - arrowSize * Math.sin(angle - 0.4));
      ctx.lineTo(toCx - arrowSize * Math.cos(angle + 0.4), toCy - arrowSize * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();

      // Store edge geometry for hover detection
      edge._fromCx = fromCx; edge._fromCy = fromCy;
      edge._toCx = toCx; edge._toCy = toCy;
      edge._color = color;
    });

    ctx.restore();
  }

  // ── CANVAS HOVER (tooltips on edges) ──

  function bindCanvasHover(d) {
    if (!_canvasEl || !_tooltipEl) return;

    _canvasEl.addEventListener('mousemove', e => {
      const rect = _canvasEl.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (const edge of d.edges) {
        if (!edge._fromCx) continue;
        // Simple proximity check: distance to line midpoint
        const midX = (edge._fromCx + edge._toCx) / 2;
        const midY = (edge._fromCy + edge._toCy) / 2;
        const dist = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2);
        if (dist < 30) { found = edge; break; }
      }

      if (found && found !== _hoveredEdge) {
        _hoveredEdge = found;
        const typeLabel = t(`im${found.type.charAt(0).toUpperCase() + found.type.slice(1)}`) || found.type;
        _tooltipEl.innerHTML = `<strong>${esc(typeLabel)}</strong><div style="margin-top:3px">${esc(found.reason || '')}</div>`;
        _tooltipEl.style.display = 'block';
        const midX = (found._fromCx + found._toCx) / 2;
        const midY = (found._fromCy + found._toCy) / 2;
        _tooltipEl.style.left = midX + 'px';
        _tooltipEl.style.top = (midY - 10) + 'px';
      } else if (!found) {
        _hoveredEdge = null;
        _tooltipEl.style.display = 'none';
      }
    });

    _canvasEl.addEventListener('mouseleave', () => {
      _hoveredEdge = null;
      if (_tooltipEl) _tooltipEl.style.display = 'none';
    });
  }

  // ── ACTIONS ──

  function edit(nodeId) {
    _editingNodeId = nodeId;
    const d = im();
    renderNodes(d);
  }

  function saveEdit(nodeId) {
    const textarea = document.getElementById(`im-editor-${nodeId}`);
    if (!textarea) return;
    const d = im();
    const node = d.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newContent = textarea.value.trim();
    if (newContent !== node.originalContent) {
      node.content = newContent;
      node.edited = true;
    }
    _editingNodeId = null;
    save();
    toast(t('imEdited'), 'ok');

    // Re-render and check if edges need updating
    renderNodes(d);
    if (d.analyzed) {
      markConflictEdges(d, nodeId);
      drawEdges(d);
    }
  }

  function cancelEdit() {
    _editingNodeId = null;
    renderNodes(im());
  }

  function revert(nodeId) {
    const d = im();
    const node = d.nodes.find(n => n.id === nodeId);
    if (!node) return;
    node.content = node.originalContent;
    node.edited = false;
    _editingNodeId = null;
    save();
    toast(t('imReverted'), 'info');
    renderNodes(d);
    if (d.analyzed) {
      // Revert edge colors
      markConflictEdges(d, nodeId);
      drawEdges(d);
    }
  }

  /** After edit, mark edges from/to this node as conflicts if content changed */
  function markConflictEdges(d, nodeId) {
    const node = d.nodes.find(n => n.id === nodeId);
    if (!node) return;

    d.edges.forEach(edge => {
      if (edge.from === nodeId || edge.to === nodeId) {
        if (node.edited) {
          edge._originalType = edge._originalType || edge.type;
          edge.type = 'conflicts';
          if (!edge._originalReason) edge._originalReason = edge.reason;
          edge.reason = `Content modified — was: "${node.originalContent.slice(0, 80)}…"`;
        } else {
          // Revert
          if (edge._originalType) { edge.type = edge._originalType; delete edge._originalType; }
          if (edge._originalReason) { edge.reason = edge._originalReason; delete edge._originalReason; }
        }
      }
    });
    save();
  }

  // ── AI ANALYSIS ──

  async function analyzeImpact() {
    const d = im();
    if (!d.nodes.length) return;
    if (!state.apiKey) { toast(t('setApiKey'), 'err'); return; }

    const btn = document.getElementById('im-btn-analyze');
    if (btn) { btn.disabled = true; btn.textContent = t('imAnalyzing'); }

    // Build node summary for AI
    const nodeSummary = d.nodes.map(n =>
      `[${n.id}] ${n.docName} > ${n.sectionTitle}: ${n.content.slice(0, 200)}`
    ).join('\n');

    try {
      const text = await callAnthropic(state.apiKey, state.model, `You are analyzing relationships between document sections in a software project.

DOCUMENT SECTIONS:
${nodeSummary}

For each meaningful relationship between sections, identify:
1. The source section ID (from)
2. The target section ID (to)  
3. The relationship type: "supports" (one enables/helps the other), "conflicts" (contradicts/incompatible), or "constrains" (limits/restricts options)
4. A brief reason explaining the relationship (1 sentence, max 15 words)

Only include relationships where there is a CLEAR, MEANINGFUL dependency or impact. Do NOT create edges between every pair — be selective. Prefer top-down relationships (earlier docs → later docs).

Return ONLY valid JSON (no markdown fences):
{
  "edges": [
    { "from": "<section_id>", "to": "<section_id>", "type": "supports|conflicts|constrains", "reason": "<why>" }
  ]
}`, 4000);

      const result = parseAIJson(text);
      // Validate edges reference real nodes
      const nodeIds = new Set(d.nodes.map(n => n.id));
      d.edges = (result.edges || []).filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
      d.analyzed = true;
      save();
      toast(t('imAnalyzed'), 'ok');
    } catch (e) {
      toast(t('aiError') + e.message, 'err');
    }

    if (btn) { btn.disabled = false; btn.textContent = d.analyzed ? t('imReAnalyze') : t('imAnalyze'); }
    render();
  }

  /** Rebuild nodes from current docs (call when docs change) */
  function rebuild() {
    const d = im();
    const docs = state.context?.documents || [];
    if (!docs.length) {
      d.nodes = [];
      d.edges = [];
      d.analyzed = false;
      save();
      return;
    }
    d.nodes = splitDocsToNodes(docs);
    layoutNodes(d.nodes);
    d.edges = [];
    d.analyzed = false;
    save();
  }

  return {
    render, analyzeImpact, edit, saveEdit, cancelEdit, revert, rebuild,
  };
})();
