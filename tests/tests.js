/* ═══════════════════════════════════════════════════════════
   FEATURE COMPASS — Unit Test Suite
   Tests core logic functions without requiring API calls
   ═══════════════════════════════════════════════════════════ */

const TestRunner = {
  results: [],
  suites: {},

  assert(condition, name, detail = '') {
    const passed = !!condition;
    this.results.push({ name, passed, detail, suite: this._currentSuite });
    if (!this.suites[this._currentSuite]) this.suites[this._currentSuite] = [];
    this.suites[this._currentSuite].push({ name, passed, detail });
  },

  assertEqual(actual, expected, name) {
    const passed = actual === expected;
    this.assert(passed, name, passed ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  },

  assertDeepEqual(actual, expected, name) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    this.assert(passed, name, passed ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  },

  suite(name, fn) {
    this._currentSuite = name;
    try { fn(); } catch (e) {
      this.assert(false, `Suite "${name}" threw error`, e.message);
    }
  },

  render() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;

    document.getElementById('summary').innerHTML = `
      <div class="stat total"><div class="stat-val">${total}</div><div class="stat-label">Total</div></div>
      <div class="stat pass"><div class="stat-val">${passed}</div><div class="stat-label">Passed</div></div>
      <div class="stat fail"><div class="stat-val">${failed}</div><div class="stat-label">Failed</div></div>
    `;

    let html = '';
    for (const [suite, tests] of Object.entries(this.suites)) {
      html += `<div class="suite"><div class="suite-name">${suite}</div>`;
      for (const t of tests) {
        html += `<div class="test ${t.passed ? 'pass' : 'fail'}">
          <span class="icon">${t.passed ? '✓' : '✗'}</span>
          <span class="name">${t.name}</span>
          ${t.detail ? `<span class="detail">${t.detail}</span>` : ''}
        </div>`;
      }
      html += '</div>';
    }
    document.getElementById('results').innerHTML = html;
    document.getElementById('time').textContent = `Completed at ${new Date().toLocaleTimeString()}`;
  }
};


// ═══════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════

// ── App.esc() — XSS Prevention ──
TestRunner.suite('App.esc() — XSS Prevention', () => {
  TestRunner.assertEqual(App.esc(''), '', 'empty string returns empty');
  TestRunner.assertEqual(App.esc(null), '', 'null returns empty');
  TestRunner.assertEqual(App.esc(undefined), '', 'undefined returns empty');
  TestRunner.assertEqual(App.esc('hello'), 'hello', 'plain text unchanged');
  TestRunner.assertEqual(App.esc('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;', 'escapes script tags');
  TestRunner.assertEqual(App.esc('<img onerror="alert(1)">'), '&lt;img onerror="alert(1)"&gt;', 'escapes img onerror');
  TestRunner.assertEqual(App.esc('a & b'), 'a &amp; b', 'escapes ampersand');
  TestRunner.assertEqual(App.esc('"hello"'), '"hello"', 'preserves double quotes in textContent');
  TestRunner.assertEqual(App.esc("Test's"), "Test's", 'preserves single quotes');
});


// ── App.t() — i18n ──
TestRunner.suite('App.t() — i18n', () => {
  const origLang = App.state.lang;

  App.state.lang = 'en';
  TestRunner.assertEqual(App.t('build'), 'Build', 'EN: returns English text');
  TestRunner.assertEqual(App.t('ideas'), 'Ideas', 'EN: returns correct key');

  App.state.lang = 'vi';
  TestRunner.assertEqual(App.t('build'), 'Xây dựng', 'VI: returns Vietnamese text');
  TestRunner.assertEqual(App.t('ideas'), 'Ý tưởng', 'VI: returns correct key');

  TestRunner.assertEqual(App.t('nonexistent_key_xyz'), 'nonexistent_key_xyz', 'missing key returns key itself');

  App.state.lang = 'fr';
  TestRunner.assertEqual(App.t('build'), 'Build', 'unknown lang falls back to EN');

  App.state.lang = origLang;
});


// ── App.calcVerdict() — Verdict Logic ──
TestRunner.suite('App.calcVerdict() — Verdict Logic', () => {
  // Build Now: impact >= 7, fit >= 7, conflict <= 3
  TestRunner.assertEqual(
    App.calcVerdict({ impact: 8, fit: 8, effort: 3, conflict: 2 }, {}),
    'Build Now',
    'high impact + high fit + low conflict = Build Now'
  );

  // Plan for v1.5: impact >= 6, effort <= 5
  TestRunner.assertEqual(
    App.calcVerdict({ impact: 7, fit: 5, effort: 4, conflict: 4 }, {}),
    'Plan for v1.5',
    'good impact + moderate effort = Plan for v1.5'
  );

  // Scope Creep: impact <= 4, effort >= 7
  TestRunner.assertEqual(
    App.calcVerdict({ impact: 3, fit: 5, effort: 8, conflict: 3 }, {}),
    'Scope Creep',
    'low impact + high effort = Scope Creep'
  );

  // Defer Indefinitely: impact <= 3
  TestRunner.assertEqual(
    App.calcVerdict({ impact: 2, fit: 5, effort: 3, conflict: 2 }, {}),
    'Defer Indefinitely',
    'very low impact = Defer Indefinitely'
  );

  // Redundant: redundancy detected >= 70%
  TestRunner.assertEqual(
    App.calcVerdict(
      { impact: 8, fit: 8, effort: 3, conflict: 2 },
      { scores: { redundancy: { detected: true, percentage: 80 } } }
    ),
    'Redundant',
    'high redundancy = Redundant (overrides score)'
  );

  // Stack Conflict: stack_conflicts present + conflict >= 6
  TestRunner.assertEqual(
    App.calcVerdict(
      { impact: 8, fit: 8, effort: 3, conflict: 7 },
      { stack_conflicts: ['Requires WebSocket'] }
    ),
    'Stack Conflict',
    'stack conflicts + high conflict score = Stack Conflict'
  );

  // Needs Prerequisite: dependencies + effort >= 5
  TestRunner.assertEqual(
    App.calcVerdict(
      { impact: 8, fit: 8, effort: 6, conflict: 2 },
      { dependencies: ['Build auth module first'] }
    ),
    'Needs Prerequisite',
    'dependencies + high effort = Needs Prerequisite'
  );

  // Edge: null scores
  TestRunner.assertEqual(
    App.calcVerdict(null, {}),
    null,
    'null scores returns null'
  );

  // Default fallback: Plan for v1.5
  TestRunner.assertEqual(
    App.calcVerdict({ impact: 5, fit: 5, effort: 5, conflict: 5 }, {}),
    'Plan for v1.5',
    'moderate everything defaults to Plan for v1.5'
  );
});


// ── App.parseAIJson() — JSON Parsing ──
TestRunner.suite('App.parseAIJson() — JSON Parsing', () => {
  // Valid JSON
  const valid = '{"scores":{"impact":{"score":7}},"summary":"test"}';
  const parsed = App.parseAIJson(valid);
  TestRunner.assertEqual(parsed.summary, 'test', 'parses valid JSON');
  TestRunner.assertEqual(parsed.scores.impact.score, 7, 'nested values correct');

  // JSON in markdown fences
  const fenced = '```json\n{"summary":"fenced"}\n```';
  TestRunner.assertEqual(App.parseAIJson(fenced).summary, 'fenced', 'extracts JSON from markdown fences');

  // JSON with leading text
  const withText = 'Here is my analysis:\n{"summary":"with text"}';
  TestRunner.assertEqual(App.parseAIJson(withText).summary, 'with text', 'extracts JSON from surrounding text');

  // Truncated JSON — missing closing braces
  const truncated = '{"scores":{"impact":{"score":7},"fit":{"score":5}}';
  const repaired = App.parseAIJson(truncated);
  TestRunner.assertEqual(repaired.scores.impact.score, 7, 'repairs truncated JSON — nested value preserved');
  TestRunner.assertEqual(repaired.scores.fit.score, 5, 'repairs truncated JSON — second value preserved');

  // Truncated JSON with trailing incomplete array
  const trailingArr = '{"scores":{"impact":{"score":7}},"deps":["auth"';
  const repaired2 = App.parseAIJson(trailingArr);
  TestRunner.assertEqual(repaired2.scores.impact.score, 7, 'repairs truncated array — preserves earlier values');

  // JSON with extra text after closing brace
  const extraText = '{"summary":"ok"}\n\nHope this helps!';
  TestRunner.assertEqual(App.parseAIJson(extraText).summary, 'ok', 'ignores text after JSON block');

  // Invalid JSON throws
  let threw = false;
  try { App.parseAIJson('not json at all'); } catch (e) { threw = true; }
  TestRunner.assert(threw, 'throws on completely invalid text');
});


// ── App.buildContext() — Context Building ──
TestRunner.suite('App.buildContext() — Context Building', () => {
  const origCtx = JSON.parse(JSON.stringify(App.state.context));

  // Empty context
  App.state.context = { documents: [], extracted: { features: [], techStack: [], personas: [], decisions: [] } };
  TestRunner.assertEqual(App.buildContext(), '', 'empty documents returns empty string');

  // With documents and extracted context
  App.state.context = {
    documents: [{ name: 'test.md', content: 'Hello world' }],
    extracted: {
      features: ['Auth', 'Dashboard'],
      techStack: ['React', 'Node.js'],
      personas: ['Admin', 'User'],
      decisions: ['Use REST API']
    }
  };
  const ctx = App.buildContext();
  TestRunner.assert(ctx.includes('EXISTING FEATURES: Auth, Dashboard'), 'includes features');
  TestRunner.assert(ctx.includes('TECH STACK: React, Node.js'), 'includes tech stack');
  TestRunner.assert(ctx.includes('USER PERSONAS: Admin, User'), 'includes personas');
  TestRunner.assert(ctx.includes('Use REST API'), 'includes decisions');
  TestRunner.assert(ctx.includes('--- test.md ---'), 'includes document name');
  TestRunner.assert(ctx.includes('Hello world'), 'includes document content');

  // Restore
  App.state.context = origCtx;
});


// ── App.extractContextBasic() — Basic Extraction ──
TestRunner.suite('App.extractContextBasic() — Basic Extraction', () => {
  const origCtx = JSON.parse(JSON.stringify(App.state.context));

  // JSON document extraction
  App.state.context = {
    documents: [{
      id: 'd1', name: 'project.json', type: 'json',
      content: JSON.stringify({
        features: ['Auth', 'Dashboard'],
        techStack: ['React', 'PostgreSQL'],
        personas: ['Admin'],
        decisions: ['Use tRPC']
      })
    }],
    extracted: { features: [], techStack: [], personas: [], decisions: [] }
  };
  App.extractContextBasic();
  const ext = App.state.context.extracted;
  TestRunner.assert(ext.features.includes('Auth'), 'extracts features from JSON');
  TestRunner.assert(ext.features.includes('Dashboard'), 'extracts multiple features');
  TestRunner.assert(ext.techStack.some(t => t.includes('React')), 'extracts tech from JSON');
  TestRunner.assert(ext.personas.includes('Admin'), 'extracts personas from JSON');
  TestRunner.assert(ext.decisions.includes('Use tRPC'), 'extracts decisions from JSON');

  // Markdown list extraction under feature-hinted file
  App.state.context = {
    documents: [{
      id: 'd2', name: 'features.md', type: 'md',
      content: '# Scope\n\n## Feature Modules\n- User Authentication\n- Payment Gateway\n- Dashboard Panel'
    }],
    extracted: { features: [], techStack: [], personas: [], decisions: [] }
  };
  App.extractContextBasic();
  const ext2 = App.state.context.extracted;
  // extractContextBasic pushes list items when sectionHint='feature'
  TestRunner.assert(ext2.features.includes('User Authentication'), 'extracts features from list items');
  TestRunner.assert(ext2.features.includes('Payment Gateway'), 'extracts multiple features from list');
  TestRunner.assert(ext2.features.includes('Dashboard Panel'), 'extracts all list features');

  // Tech regex matching
  App.state.context = {
    documents: [{
      id: 'd3', name: 'notes.txt', type: 'txt',
      content: 'We use React with Next.js and PostgreSQL for the database. Deployed on Vercel.'
    }],
    extracted: { features: [], techStack: [], personas: [], decisions: [] }
  };
  App.extractContextBasic();
  const ext3 = App.state.context.extracted;
  TestRunner.assert(ext3.techStack.some(t => /react/i.test(t)), 'detects React via regex');
  TestRunner.assert(ext3.techStack.some(t => /next/i.test(t)), 'detects Next.js via regex');
  TestRunner.assert(ext3.techStack.some(t => /postgres/i.test(t)), 'detects PostgreSQL via regex');
  TestRunner.assert(ext3.techStack.some(t => /vercel/i.test(t)), 'detects Vercel via regex');

  // Deduplication
  App.state.context = {
    documents: [{
      id: 'd4', name: 'stack.json', type: 'json',
      content: JSON.stringify({ techStack: ['React', 'React', 'Node.js'] })
    }],
    extracted: { features: [], techStack: [], personas: [], decisions: [] }
  };
  App.extractContextBasic();
  const ext4 = App.state.context.extracted;
  const reactCount = ext4.techStack.filter(t => /^react$/i.test(t)).length;
  TestRunner.assert(reactCount <= 1, 'deduplicates tech stack entries');

  // Restore
  App.state.context = origCtx;
});


// ── VERDICT_CFG Consistency ──
TestRunner.suite('VERDICT_CFG — Data Consistency', () => {
  const verdictNames = Object.keys(VERDICT_CFG);

  // All verdicts have required config
  for (const v of verdictNames) {
    const cfg = VERDICT_CFG[v];
    TestRunner.assert(cfg.cls, `${v}: has CSS class`);
    TestRunner.assert(cfg.pill, `${v}: has pill colors`);
    TestRunner.assert(cfg.icon, `${v}: has icon`);
    TestRunner.assert(cfg.color, `${v}: has color`);
  }

  // All verdicts have i18n keys
  for (const v of verdictNames) {
    const key = VERDICT_KEYS[v];
    TestRunner.assert(key, `${v}: has VERDICT_KEYS entry`);
    TestRunner.assert(I18N.en[key], `${v}: has EN i18n for verdict name`);
    TestRunner.assert(I18N.vi[key], `${v}: has VI i18n for verdict name`);

    const descKey = VERDICT_DESC_KEYS[v];
    TestRunner.assert(descKey, `${v}: has VERDICT_DESC_KEYS entry`);
    TestRunner.assert(I18N.en[descKey], `${v}: has EN i18n for description`);
    TestRunner.assert(I18N.vi[descKey], `${v}: has VI i18n for description`);
  }

  // CUT_VERDICTS are valid verdict names
  for (const cv of CUT_VERDICTS) {
    TestRunner.assert(VERDICT_CFG[cv], `CUT_VERDICTS: "${cv}" exists in VERDICT_CFG`);
  }
});


// ── I18N Completeness ──
TestRunner.suite('I18N — Completeness Check', () => {
  const enKeys = Object.keys(I18N.en);
  const viKeys = Object.keys(I18N.vi);

  // Every EN key should exist in VI
  const missingInVi = enKeys.filter(k => !(k in I18N.vi));
  TestRunner.assert(
    missingInVi.length === 0,
    `all EN keys exist in VI`,
    missingInVi.length ? `missing: ${missingInVi.join(', ')}` : ''
  );

  // Every VI key should exist in EN
  const missingInEn = viKeys.filter(k => !(k in I18N.en));
  TestRunner.assert(
    missingInEn.length === 0,
    `all VI keys exist in EN`,
    missingInEn.length ? `missing: ${missingInEn.join(', ')}` : ''
  );

  // Key count matches
  TestRunner.assertEqual(enKeys.length, viKeys.length, `EN and VI have same number of keys (${enKeys.length})`);
});


// ── MODELS Config ──
TestRunner.suite('MODELS — Config Validation', () => {
  TestRunner.assert(MODELS.length >= 2, `has at least 2 models (got ${MODELS.length})`);

  for (const m of MODELS) {
    TestRunner.assert(m.id, `model "${m.label}": has id`);
    TestRunner.assert(m.label, `model "${m.id}": has label`);
    TestRunner.assert(m.descKey, `model "${m.label}": has descKey`);
    TestRunner.assert(I18N.en[m.descKey], `model "${m.label}": descKey "${m.descKey}" exists in EN i18n`);
    TestRunner.assert(m.tier, `model "${m.label}": has tier`);
  }

  // Default model exists in MODELS list
  const defaultModel = App.state.model || 'claude-sonnet-4-20250514';
  TestRunner.assert(
    MODELS.some(m => m.id === defaultModel),
    `default model "${defaultModel}" exists in MODELS list`
  );
});


// ═══════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════
TestRunner.render();
