import { useState } from 'react';
import { ui } from '../i18n/uiTranslations.js';

export default function NegotiationLetterPanel({
  initialLetter = '',
  sectionNumber = '06',
  language = 'en',
}) {
  const [letter, setLetter] = useState(initialLetter);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="report-section letter-panel">
      <div className="section-heading">
        <div>
          <span className="section-index">{sectionNumber}</span>
          <h2>{ui(language, 'letter')}</h2>
        </div>
        <button className="secondary" onClick={copy}>
          {ui(language, copied ? 'copied' : 'copy')}
        </button>
      </div>
      <p className="section-caption">{ui(language, 'letterCaption')}</p>
      <textarea
        aria-label={ui(language, 'letter')}
        value={letter}
        onChange={event => setLetter(event.target.value)}
      />
    </section>
  );
}
