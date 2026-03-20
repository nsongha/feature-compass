/* ═══════════════════════════════════════════════
   MODULE: CONTEXT — File import & extraction
   Depends on: I18nModule, UiModule, ApiModule, StateModule
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const ContextModule = (() => {
  'use strict';

  const { t } = I18nModule;
  const { toast, esc } = UiModule;
  const { callAnthropic } = ApiModule;
  const { state, save } = StateModule;

  /** Import a single file and return parsed doc object */
  async function importFile(file) {
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

    return { id: 'd' + Date.now() + Math.random().toString(36).slice(2, 6), name: file.name, type, content, importedAt: Date.now() };
  }

  /** Handle multiple file imports */
  async function handleFiles(fileList) {
    for (const f of fileList) {
      try {
        const doc = await importFile(f);
        state.context.documents.push(doc);
        toast(t('imported') + ' ' + esc(f.name), 'ok');
      } catch (e) {
        toast(`${t('failedImport')}: ${esc(f.name)} — ${esc(e.message)}`, 'err');
      }
    }
    extractContextBasic();
    save();
  }

  function removeDoc(id) {
    state.context.documents = state.context.documents.filter(d => d.id !== id);
    extractContextBasic();
    save();
  }

  function clearContext() {
    if (!confirm(t('clearConfirm'))) return false;
    state.context = { documents: [], extracted: { features: [], techStack: [], personas: [], decisions: [] } };
    save();
    toast(t('ctxCleared'), 'info');
    return true;
  }

  function reExtract() {
    extractContextBasic();
    save();
    toast(t('ctxReExtracted'), 'ok');
  }

  /** AI-powered context extraction */
  async function extractContextAI() {
    const docs = state.context.documents;
    if (!docs.length) {
      state.context.extracted = { features: [], techStack: [], personas: [], decisions: [] };
      return;
    }
    const docSummaries = docs.map(d => {
      const truncated = d.content.length > 4000 ? d.content.slice(0, 4000) + '\n...(truncated)' : d.content;
      return `=== ${d.name} (${d.type}) ===\n${truncated}`;
    }).join('\n\n');

    toast(t('aiExtracting'), 'info');

    try {
      const prompt = `Extract structured project context from these documents. Read carefully regardless of format, language, or structure.

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
- If a category has nothing, use empty array`;

      const text = await callAnthropic(state.apiKey, state.model, prompt, 2000);
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]); else throw new Error('Parse failed');
      }
      state.context.extracted = {
        features: [...new Set(parsed.features || [])].filter(Boolean),
        techStack: [...new Set(parsed.techStack || [])].filter(Boolean),
        personas: [...new Set(parsed.personas || [])].filter(Boolean),
        decisions: [...new Set(parsed.decisions || [])].filter(Boolean),
      };
      toast(t('ctxExtracted'), 'ok');
    } catch (err) {
      console.error('AI extraction failed:', err);
      toast(t('aiFailed'), 'err');
      extractContextBasic();
    }
  }

  /** Basic regex-based context extraction (no API key needed) */
  function extractContextBasic() {
    const ext = { features: [], techStack: [], personas: [], decisions: [] };

    // 1. JSON docs
    state.context.documents.filter(d => d.type === 'json').forEach(d => {
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
      } catch (e) { /* ignore parse errors */ }
    });

    // 2. Text-based extraction
    state.context.documents.filter(d => d.type !== 'json').forEach(doc => {
      const fname = doc.name.toLowerCase();
      const lines = doc.content.split('\n');
      const fileHint =
        /decision|adr|constraint|rule|principle/i.test(fname) ? 'decision' :
        /persona|user.?type|audience|actor|role/i.test(fname) ? 'persona' :
        /feature|module|scope|mvp|backlog|roadmap|epic/i.test(fname) ? 'feature' :
        /prd|spec|requirement|brief/i.test(fname) ? 'mixed' :
        /stack|tech|architect|infra|setup/i.test(fname) ? 'tech' :
        /pain.?point|problem|issue|challenge/i.test(fname) ? 'feature' : null;
      let sectionHint = fileHint || '';

      lines.forEach((line) => {
        const tr = line.trim();
        if (!tr || tr === '---' || tr === '===') return;
        const headingMatch = tr.match(/^(#{1,4})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const heading = headingMatch[2].trim();
          const hLow = heading.toLowerCase();
          if (/decision|adr|dec[\s-]?\d|constraint|rule|principle|locked|chosen|agreed|policy/i.test(hLow)) {
            sectionHint = 'decision';
            if (/adr|dec[\s-]?\d/i.test(hLow) || (fileHint === 'decision' && level >= 2)) ext.decisions.push(heading);
          } else if (/persona|user.?type|target.?user|audience|who.?use|customer|actor|role|stakeholder/i.test(hLow)) {
            sectionHint = 'persona';
            if (level >= 2 && !(/^(persona|user|target|audience|stakeholder|role)/i.test(hLow))) ext.personas.push(heading);
            else if (level >= 2) {
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
            if (fileHint === 'decision' && level >= 2 && heading.length > 3) { ext.decisions.push(heading); sectionHint = 'decision-detail'; }
            else if (fileHint === 'persona' && level >= 2 && heading.length > 1) {
              const name = heading.replace(/^(persona|user)\s*\d*\s*[:—–\-]\s*/i, '').trim();
              if (name) ext.personas.push(name);
              sectionHint = 'persona-detail';
            } else { sectionHint = fileHint || sectionHint; }
          }
          return;
        }
        const isList = /^[-*•]\s+/.test(tr) || /^\d+[.)]\s+/.test(tr);
        const content = tr.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '').replace(/^\*{1,2}(.+?)\*{1,2}/, '$1').trim();
        if (content.length < 2 || content.length > 200) return;
        const kvMatch = tr.match(/^\*{0,2}([^:*]+?)\*{0,2}\s*[:：]\s*(.+)/);
        const kvKey = kvMatch ? kvMatch[1].trim().toLowerCase() : '';
        const kvVal = kvMatch ? kvMatch[2].replace(/\*{1,2}/g, '').trim() : '';
        if (kvKey && /^(decision|quyết định|rationale|lý do|context|bối cảnh|chosen|selected)$/i.test(kvKey) && kvVal.length > 3) { ext.decisions.push(kvVal); return; }
        if (kvKey && /^(status|trạng thái|state)$/i.test(kvKey) && sectionHint.startsWith('decision')) {
          const last = ext.decisions[ext.decisions.length - 1];
          if (last && !last.includes('[')) ext.decisions[ext.decisions.length - 1] = last + ' [' + kvVal + ']';
          return;
        }
        if (kvKey && /^(frontend|backend|database|db|realtime|ai|media|hosting|deploy|infra|auth|payment|stack|runtime|language|framework|library|service|cdn|storage|ci|monitoring)$/i.test(kvKey) && kvVal.length < 120) { ext.techStack.push(kvVal); return; }
        if (isList && content.length > 2) {
          switch (sectionHint) {
            case 'decision': ext.decisions.push(content); break;
            case 'persona': if (content.length < 80) ext.personas.push(content); break;
            case 'feature': case 'painpoint': if (content.length < 120) ext.features.push(content); break;
            case 'tech': if (content.length < 80) ext.techStack.push(content); else ext.features.push(content); break;
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
        if (tr.startsWith('|') && tr.endsWith('|') && !tr.match(/^\|[\s-:|]+\|$/)) {
          const cells = tr.split('|').map(c => c.trim()).filter(Boolean);
          if (cells.length >= 2 && cells[0].length > 2) {
            if (sectionHint === 'decision') ext.decisions.push(cells.join(' — '));
            else if (sectionHint === 'feature') ext.features.push(cells[0]);
            else if (sectionHint === 'persona') ext.personas.push(cells[0]);
          }
        }
      });
    });

    // 3. Tech stack pattern matching
    const allText = state.context.documents.map(d => d.content).join('\n\n');
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

    // 4. Deduplicate
    ext.features = [...new Set(ext.features)].filter(Boolean);
    ext.personas = [...new Set(ext.personas)].filter(Boolean);
    ext.decisions = [...new Set(ext.decisions)].filter(Boolean);
    const techSeen = new Map();
    ext.techStack.filter(Boolean).forEach(t => {
      const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!techSeen.has(key)) techSeen.set(key, t);
    });
    ext.techStack = [...techSeen.values()];

    state.context.extracted = ext;
  }

  /** Bind drop zone events */
  function bindDrop(onFilesImported) {
    const dz = document.getElementById('drop-zone');
    const fi = document.getElementById('file-input');
    dz.addEventListener('click', () => fi.click());
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', async e => { e.preventDefault(); dz.classList.remove('over'); await handleFiles(e.dataTransfer.files); if (onFilesImported) onFilesImported(); });
    fi.addEventListener('change', async e => { await handleFiles(e.target.files); if (onFilesImported) onFilesImported(); });
  }

  return { importFile, handleFiles, removeDoc, clearContext, reExtract, extractContextAI, extractContextBasic, bindDrop };
})();
