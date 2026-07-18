import pdf from 'pdf-parse';

export function cleanText(text = '') {
  return text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export async function extractText({ text, file }) {
  if (typeof text === 'string' && text.trim()) return cleanText(text);
  if (text != null) throw Object.assign(new Error('Document text must be a string.'), { status: 400 });
  if (!file) throw Object.assign(new Error('Provide document text or a PDF file.'), { status: 400 });
  if (file.mimetype !== 'application/pdf') throw Object.assign(new Error('Only PDF upload is supported in this MVP.'), { status: 415 });
  const result = await pdf(file.buffer);
  const output = cleanText(result.text);
  if (!output) throw Object.assign(new Error('No readable text was found in this PDF. Scanned PDFs are not yet supported.'), { status: 422 });
  return output;
}
