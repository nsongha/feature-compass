/* ═══════════════════════════════════════════════
   MODULE: API — Anthropic API calls & JSON parsing
   No dependencies (pure functions)
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line no-unused-vars
const ApiModule = (() => {
  'use strict';

  /** Low-level Anthropic API call — returns response text */
  async function callAnthropic(apiKey, model, prompt, maxTokens = 4000) {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `API ${resp.status}`);
    }
    const data = await resp.json();
    return data.content?.[0]?.text || '';
  }

  /** Evaluate a feature idea against project context */
  async function callAI(idea, apiKey, model, contextStr, lang) {
    const langInstruction = lang === 'vi'
      ? '\n\nIMPORTANT: Respond entirely in Vietnamese (tiếng Việt). All reasoning, summary, and reason fields must be in Vietnamese.'
      : '';
    const prompt = `You are a product strategy evaluator for Feature Compass. Evaluate this feature idea thoroughly.${langInstruction}

PROJECT CONTEXT:
${contextStr || '(No project context imported)'}

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

    const text = await callAnthropic(apiKey, model, prompt);
    return parseAIJson(text);
  }

  /** Parse AI JSON response with multi-layer repair */
  function parseAIJson(text) {
    try { return JSON.parse(text); } catch(e) { /* continue */ }
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch(e) { /* continue */ } }
    let json = m ? m[0] : text;
    for (let attempt = 0; attempt < 10; attempt++) {
      const prev = json;
      json = json.replace(/,\s*"[^"]*$/, '');
      json = json.replace(/,\s*"[^"]*"\s*:\s*("[^"]*)?$/, '');
      json = json.replace(/,\s*\{[^}]*$/, '');
      json = json.replace(/,\s*\[[^\]]*$/, '');
      json = json.replace(/,\s*"[^"]*"\s*:\s*$/, '');
      json = json.replace(/,\s*$/, '');
      if (json === prev) break;
    }
    const opens = (json.match(/\[/g)||[]).length - (json.match(/\]/g)||[]).length;
    const braces = (json.match(/\{/g)||[]).length - (json.match(/\}/g)||[]).length;
    for (let i = 0; i < opens; i++) json += ']';
    for (let i = 0; i < braces; i++) json += '}';
    try { return JSON.parse(json); } catch(e) {
      console.warn('JSON repair failed, text length:', text.length);
      throw new Error('Failed to parse AI response');
    }
  }

  /** Build context string from documents and extracted data */
  function buildContext(documents, extracted) {
    if (!documents.length) return '';
    const parts = [];
    if (extracted.features.length) parts.push('EXISTING FEATURES: ' + extracted.features.join(', '));
    if (extracted.techStack.length) parts.push('TECH STACK: ' + extracted.techStack.join(', '));
    if (extracted.personas.length) parts.push('USER PERSONAS: ' + extracted.personas.join(', '));
    if (extracted.decisions.length) parts.push('KEY DECISIONS:\n' + extracted.decisions.map(d => '- ' + d).join('\n'));
    documents.forEach(d => {
      const txt = d.content.length > 3000 ? d.content.slice(0, 3000) + '\n...(truncated)' : d.content;
      parts.push(`\n--- ${d.name} ---\n${txt}`);
    });
    return parts.join('\n\n');
  }

  return { callAnthropic, callAI, parseAIJson, buildContext };
})();
