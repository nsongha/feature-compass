# 🔒 Security

## Security Model

Feature Compass is a **100% client-side application**. No data is sent to any server except the Anthropic API (and only when the user explicitly triggers AI evaluation).

---

## Data Privacy

| Data | Storage | Shared With |
|------|---------|-------------|
| API key | `localStorage` (browser only) | Anthropic API (via HTTPS) |
| Feature ideas | `localStorage` (browser only) | Anthropic API (during evaluation) |
| Project context | `localStorage` (browser only) | Anthropic API (during evaluation/extraction) |
| User notes | `localStorage` (browser only) | Never |
| Settings | `localStorage` (browser only) | Never |

### Key Principles

- **No backend** — No server, no database, no user accounts
- **No telemetry** — No analytics, no tracking, no cookies
- **No external data sharing** — Only Anthropic API, only when user triggers it
- **Local persistence only** — All data in `localStorage`, stays in the browser

---

## API Key Handling

### Storage
- API key stored in `localStorage` as plain text
- Accessible only from the same origin
- Cleared when user clears browser data

### Sanitization
API keys are sanitized on load and save to prevent header injection:

```javascript
this.state.apiKey = raw.replace(/[^\x20-\x7E]/g, '').trim();
```

This strips any non-printable or non-ASCII characters that could break HTTP headers (ISO-8859-1 requirement).

### Transmission
- Sent via `x-api-key` header over HTTPS
- Uses `anthropic-dangerous-direct-browser-access: true` header for direct browser access
- Never logged or stored anywhere besides `localStorage`

---

## XSS Protection

All user-generated content is HTML-escaped before rendering:

```javascript
esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
```

This applies to:
- Idea titles and descriptions
- User notes
- Imported document names
- AI analysis text
- Context items

### InnerHTML Usage
The app uses `innerHTML` for rendering UI components. All dynamic values passed through `innerHTML` are escaped via `App.esc()` to prevent XSS injection.

---

## AI Response Handling

### JSON Parsing
AI responses go through a multi-stage parsing pipeline:
1. Direct `JSON.parse()`
2. Regex extraction of JSON block from text
3. Iterative repair (stripping trailing incomplete values, closing brackets)

This prevents malformed AI output from breaking the application, but parsed data is always escaped before rendering.

### Content Truncation
- Imported documents are truncated at 3000-4000 characters before sending to AI
- This limits data exposure and API costs

---

## CORS & Network

### Anthropic API
- Direct browser-to-API communication via `anthropic-dangerous-direct-browser-access` header
- HTTPS enforced by API endpoint (`https://api.anthropic.com`)
- No proxy server needed

### CDN Dependencies

| Resource | CDN | Risk Mitigation |
|----------|-----|-----------------|
| Google Fonts (Inter, JetBrains Mono) | Google | Non-critical — app works without fonts |
| mammoth.js | Cloudflare CDN | Only needed for DOCX import |

For maximum security, self-host both dependencies (see [Deployment Guide](./DEPLOYMENT.md)).

---

## Threat Model

| Threat | Mitigation | Status |
|--------|------------|--------|
| API key exposure via XSS | `esc()` function on all dynamic content | ✅ Mitigated |
| `localStorage` data access | Same-origin policy enforced by browser | ✅ Mitigated |
| API key in transit | HTTPS only | ✅ Mitigated |
| Malicious file import | File content treated as text, escaped before display | ✅ Mitigated |
| AI response injection | JSON parsed + HTML escaped | ✅ Mitigated |
| CDN compromise | Optional self-hosting available | ⚠️ Risk accepted |
| `localStorage` not encrypted | Data at rest on user's device | ⚠️ Risk accepted |
| API key in `localStorage` | User-controlled, same-origin protected | ⚠️ Risk accepted |

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public issue
2. Email the maintainer directly with details of the vulnerability
3. Include steps to reproduce and potential impact assessment
4. Allow reasonable time for a fix before public disclosure

---

## Recommendations for Production

1. **HTTPS only** — Required for `localStorage` and API calls
2. **Content Security Policy** — Add CSP headers to restrict script sources:
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' cdnjs.cloudflare.com; style-src 'self' fonts.googleapis.com 'unsafe-inline'; font-src fonts.gstatic.com; connect-src api.anthropic.com; img-src 'self' data:;
   ```
3. **Self-host CDN deps** — Eliminate external dependencies for maximum control
4. **Regular updates** — Keep mammoth.js and API client version current

---

## See Also

- [Architecture](./ARCHITECTURE.md) — State schema and data flow details
- [API Reference](./API_REFERENCE.md) — API key transmission and AI request format
- [Deployment](./DEPLOYMENT.md) — HTTPS setup and self-hosting CDN deps
- [Known Issues](./KNOWN_ISSUES.md) — Accepted risks and their workarounds
- [Contributing](./CONTRIBUTING.md) — Security guidelines for contributors

