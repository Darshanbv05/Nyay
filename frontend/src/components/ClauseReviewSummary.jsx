import { ui } from '../i18n/uiTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';
import { localizedPoints } from '../i18n/localizedContent.js';

const explanationFor = (clause, fallback, language) =>
  localizedPoints(clause.plain_explanation_points, language).join(' ') ||
  clause.plain_explanation ||
  fallback;

function ClauseList({ clauses, language, fallback }) {
  if (!clauses.length) {
    return <p className="clause-summary-empty">{ui(language, 'noneGroup')}</p>;
  }
  return (
    <ol>
      {clauses.map(clause => (
        <li key={clause.clause_id}>
          <strong>
            {localizeSourceLabel(clause.source_label, language) ||
              clause.original_text?.slice(0, 80) ||
              ui(language, 'section')}
          </strong>
          <p>{explanationFor(clause, fallback, language)}</p>
          {clause.flagged && clause.suggested_action && (
            <small>
              <b>{ui(language, 'recommended')}:</b> {clause.suggested_action}
            </small>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function ClauseReviewSummary({
  clauses = [],
  language = 'en',
  sectionNumber = '03',
}) {
  const acceptable = clauses.filter(
    clause =>
      !clause.flagged && (clause.classification || 'green') === 'green',
  );
  const attention = clauses.filter(
    clause =>
      clause.flagged || ['yellow', 'red'].includes(clause.classification),
  );
  return (
    <section className="report-section clause-review-summary">
      <div className="section-heading">
        <div>
          <span className="section-index">{sectionNumber}</span>
          <h2>{ui(language, 'clauseSummary')}</h2>
        </div>
      </div>
      <p className="section-caption">{ui(language, 'clauseSummaryCaption')}</p>
      <div className="clause-summary-totals">
        <span className="summary-safe">
          <b>{acceptable.length}</b> {ui(language, 'acceptable')}
        </span>
        <span className="summary-review">
          <b>{attention.length}</b> {ui(language, 'needsReview')}
        </span>
      </div>
      <div className="clause-summary-columns">
        <article className="acceptable">
          <h3><span>✓</span>{ui(language, 'acceptable')}</h3>
          <p className="group-explanation">{ui(language, 'safeWhy')}</p>
          <ClauseList
            clauses={acceptable}
            language={language}
            fallback={ui(language, 'safeWhy')}
          />
        </article>
        <article className="attention">
          <h3><span>!</span>{ui(language, 'needsReview')}</h3>
          <p className="group-explanation">{ui(language, 'reviewWhy')}</p>
          <ClauseList
            clauses={attention}
            language={language}
            fallback={ui(language, 'reviewWhy')}
          />
        </article>
      </div>
    </section>
  );
}
