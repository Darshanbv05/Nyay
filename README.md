# Nyay

Nyay is a stateless web app that explains residential rental agreements in plain language, preserves each original clause, and screens it against a bounded local ruleset. Users can paste text or upload a text-based PDF, choose an explanation language, review flagged clauses, generate a negotiation draft, find legal-aid escalation options, and export a PDF report.

> Nyay provides informational screening, not legal advice. The bundled Karnataka, India ruleset deliberately marks unverified citations as `[NEEDS RESEARCH]`; a qualified local legal reviewer must replace those markers before the rules are relied upon.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run install:all
copy backend\.env.example backend\.env
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001`; `GET /api/health` is the health check.

The app works in constrained demo mode without an API key. To enable native LLM explanations, add `ANTHROPIC_API_KEY` and a currently available `ANTHROPIC_MODEL` to `backend/.env`. The LLM is only allowed to match rules in `backend/src/data/ruleset.json`; returned rule IDs and citations are validated against that file.

## Test

```bash
npm test
```

For a reliable demo, paste `samples/demo-agreement.txt`. It intentionally triggers the security-deposit, unannounced-entry, essential-repair, and deposit-forfeiture checks.

## API

- `POST /api/analyze` accepts `{ text, source_type, output_language }`. Language is mandatory.
- `POST /api/extract` accepts a PDF in multipart field `file`.
- `GET /api/languages` returns the editable supported-language list.

Scanned PDF/image OCR is intentionally deferred as the specification's nice-to-have item. No document or report is persisted.
