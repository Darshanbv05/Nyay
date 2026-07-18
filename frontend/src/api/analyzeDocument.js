async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please retry.');
  return data;
}
const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const apiUrl = path => `${apiOrigin}${path}`;

export async function extractPdf(file) {
  const body = new FormData(); body.append('file', file);
  return parse(await fetch(apiUrl('/api/extract'), { method: 'POST', body }));
}
export async function analyzeDocument(payload) {
  return parse(await fetch(apiUrl('/api/analyze'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
}
export async function getLanguages() { return parse(await fetch(apiUrl('/api/languages'))); }
export async function askDocument(payload) { return parse(await fetch(apiUrl('/api/ask'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })); }
