import { ui } from '../i18n/uiTranslations.js';
export default function ApplicableLawsPanel({ laws = [], sectionNumber = '02', language = 'en' }) {
  return <section className="report-section laws-panel">
    <div className="section-heading"><div><span className="section-index">{sectionNumber}</span><h2>{ui(language,'laws')}</h2></div></div>
    <p className="section-caption">{ui(language,'lawsCaption')}</p>
    {laws.length ? <div className="law-list">{laws.map((law, index) => <article className={`law-card law-${law.verification_status || 'indexed'}`} key={`${law.law_name}-${index}`}>
      <div className="law-card-heading"><h3>{law.law_name}</h3><span>{ui(language,law.verification_status === 'research' ? 'verification' : 'applicable')}</span></div>
      <p>{law.why_relevant}</p>
      {law.matched_topics?.length > 0 && <ul>{law.matched_topics.map((topic, topicIndex) => <li key={topicIndex}>{topic}</li>)}</ul>}
    </article>)}</div> : <p className="empty-note">{ui(language,'noLaws')}</p>}
  </section>;
}
