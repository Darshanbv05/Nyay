import { useMemo, useState } from 'react';
import { ui } from '../i18n/uiTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';
import { localizedPoints } from '../i18n/localizedContent.js';

const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097f\u0c80-\u0cff\u0b80-\u0bff\u0c00-\u0c7f\s]/g, ' ');
const searchableText = clause => [clause.source_label, clause.original_text, clause.plain_explanation, ...(clause.plain_explanation_points || []), ...(clause.applicant_obligations || []), ...(clause.recipient_obligations || []), clause.suggested_action, clause.matched_rule_id, clause.legal_basis].filter(Boolean).join(' ');

export default function DocumentSectionSearch({ clauses = [], sectionNumber = '04', language = 'en' }) {
  const [query, setQuery] = useState('');
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results = useMemo(() => terms.length ? clauses.filter(clause => { const text = normalize(searchableText(clause)); return terms.every(term => text.includes(term)); }) : [], [clauses, query]);
  const jumpToClause = clause => document.getElementById(`review-${clause.clause_id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <section className="report-section document-search">
    <div className="section-heading"><div><span className="section-index">{sectionNumber}</span><h2>{ui(language,'search')}</h2></div></div>
    <p className="section-caption">{ui(language,'searchCaption')}</p>
    <label className="document-search-box"><span className="search-icon" aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={ui(language,'searchPlaceholder')} aria-label={ui(language,'search')} />{query && <button type="button" onClick={() => setQuery('')} aria-label={ui(language,'clear')}>{ui(language,'clear')}</button>}</label>
    {query.trim() && <div className="document-search-results" aria-live="polite"><p className="search-result-count">{results.length} {ui(language,results.length === 1 ? 'oneMatch' : 'matches')}</p>{results.length ? <div className="search-result-list">{results.map(clause => <button type="button" key={clause.clause_id} onClick={() => jumpToClause(clause)}><span className={`search-result-status ${clause.classification || (clause.flagged ? 'yellow' : 'green')}`}>{ui(language,clause.flagged ? 'needsReview' : 'acceptable')}</span><strong>{localizeSourceLabel(clause.source_label,language) || ui(language,'section')}</strong><small>{localizedPoints(clause.plain_explanation_points,language)[0] || clause.plain_explanation}</small><em>{ui(language,'viewReview')} →</em></button>)}</div> : <div className="search-no-results">{ui(language,'noMatch')}</div>}</div>}
  </section>;
}
