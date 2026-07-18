import { useRef, useState } from 'react';
import { extractPdf } from '../api/analyzeDocument.js';

export default function UploadBox({ onReady }) {
  const [mode, setMode] = useState('paste'); const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const input = useRef();
  const submitText = () => text.trim().length >= 40 ? onReady({ text: text.trim(), source_type: 'pasted_text', name: 'Pasted agreement' }) : setError('Paste at least a few complete clauses (40 characters minimum).');
  const handleFile = async file => {
    if (!file) return; setError('');
    if (file.type !== 'application/pdf') return setError('Please choose a PDF file.');
    if (file.size > 10 * 1024 * 1024) return setError('PDF must be smaller than 10 MB.');
    setBusy(true); try { const data = await extractPdf(file); onReady({ text: data.text, source_type: 'pdf', name: file.name }); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <section className="panel upload-panel" aria-labelledby="upload-title">
    <div className="step-label">Step 1 of 2</div><h2 id="upload-title">Add your agreement</h2><p className="muted">Rental, loan, employment, service, and general agreements are supported. Your document is not stored after analysis.</p>
    <div className="tabs"><button className={mode === 'paste' ? 'active' : ''} onClick={() => setMode('paste')}>Paste text</button><button className={mode === 'pdf' ? 'active' : ''} onClick={() => setMode('pdf')}>Upload PDF</button></div>
    {mode === 'paste' ? <><label htmlFor="agreement">Agreement text</label><textarea id="agreement" value={text} onChange={e => { setText(e.target.value); setError(''); }} placeholder="Paste the full agreement here…"/><div className="field-foot"><span>{text.length.toLocaleString()} characters</span><button className="primary" disabled={!text.trim()} onClick={submitText}>Continue</button></div></> :
      <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}><div className="file-icon">PDF</div><h3>{busy ? 'Extracting readable text…' : 'Drop your PDF here'}</h3><p>Text-based PDF, up to 10 MB</p><button className="secondary" disabled={busy} onClick={() => input.current.click()}>Choose file</button><input ref={input} hidden type="file" accept="application/pdf" onChange={e => handleFile(e.target.files[0])}/></div>}
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}
