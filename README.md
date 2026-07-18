# Nyay

Nyay is a stateless legal-document screening app for Indian agreements. It reads pasted text or text-based PDFs, preserves the original clauses, detects the likely document type and Indian jurisdiction, explains obligations in plain language, and flags terms that match its indexed legal-risk rules.

The analyzer has specialized checks for rental, loan, employment, and service agreements. Every other agreement or legal document uses a general Indian-contract baseline, so an unfamiliar document type is analyzed instead of being rejected. Reports include clause-level risks, obligations, hidden costs, penalties, timelines, negotiation suggestions, applicable-law references, jurisdiction warnings, and a downloadable PDF.

> Nyay is an informational issue-spotting tool, not a lawyer, court, or complete legal research system. It does not contain every Indian Act, rule, amendment, judgment, custom, or local requirement. A result marked safe only means that no indexed warning pattern matched. A licensed Indian advocate must verify current law, jurisdiction, enforceability, and the facts before anyone relies on a report.

## Legal coverage

The indexed baseline currently includes:

- General Indian contract-risk patterns, including free consent, access to legal proceedings, one-sided liability, unilateral changes, forfeiture, and hidden charges.
- Official references to the Indian Contract Act, 1872 for selected issues.
- Electronic-record, electronic-signature, and electronic-contract issue spotting under the Information Technology Act, 2000.
- Constitutional-principle issue spotting for terms involving government or public-authority action, including Articles 14, 19, 21, 32, and 39A of the Constitution of India.
- Type-specific rule libraries for rental, loan, employment, and service agreements.
- Selected Karnataka rental references.
- Detection of Indian states and Union Territories, with a warning when state-specific rules, stamp duty, registration, procedure, amendments, or court interpretation are not indexed.

Constitutional rights commonly regulate State action; they do not automatically invalidate a private agreement. Nyay therefore presents constitutional references as issues for legal review, not as automatic findings that a clause is unconstitutional.

Primary sources used by the indexed rules:

- [Constitution of India — Legislative Department](https://legislative.gov.in/constitution-of-india/)
- [Indian Contract Act, 1872 — India Code](https://www.indiacode.nic.in/handle/123456789/2187)
- [Information Technology Act, 2000 — India Code](https://www.indiacode.nic.in/handle/123456789/13683)
- [Consumer Protection Act, 2019 — India Code](https://www.indiacode.nic.in/handle/123456789/15256)
- [Karnataka Rent Act, 1999 — India Code](https://www.indiacode.nic.in/handle/123456789/7810)

Rules without a verified primary citation remain marked `[NEEDS RESEARCH]` and are shown as requiring professional verification.

## Supported input

- Pasted document text
- Text-based PDF files up to 10 MB
- Up to 100,000 extracted characters per analysis
- Up to 50 analyzed clauses per report

Scanned/image-only PDFs and OCR are not currently supported. “Any agreement” refers to the document’s subject matter; it does not mean every file format or every possible law is fully covered.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run install:all
copy backend\.env.example backend\.env
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001`; `GET /api/health` is the health check.

The app works in constrained local mode without an API key. To enable LLM-generated explanations, add `ANTHROPIC_API_KEY` and an available `ANTHROPIC_MODEL` to `backend/.env`. Model output is constrained to the supplied indexed rules, and returned rule IDs and citations are validated against those rules.

## Deploy the backend on Render

The included `render.yaml` configures the backend as an npm service:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check: `/api/health`

Set `FRONTEND_ORIGIN` to the deployed frontend origin. Set `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` in Render if LLM-generated explanations are required. Do not set `PORT`; Render provides it automatically.

For an existing manually configured Render service, apply the same Root Directory, Build Command, and Start Command in its Settings. Select npm rather than Yarn and keep `package-lock.json`; it provides reproducible npm installs.

## Test

```bash
npm test
```

For a rental demo, paste `samples/demo-agreement.txt`.

## API

- `POST /api/analyze` accepts `{ text, source_type, output_language }`.
- `POST /api/extract` accepts a text-based PDF in multipart field `file`.
- `POST /api/ask` answers questions from the analyzed document and indexed rules.
- `GET /api/languages` returns the supported explanation languages.

Documents are anonymized before analysis and are not intentionally persisted by the application.
