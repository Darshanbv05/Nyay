import PenaltyCompensationTracker from './PenaltyCompensationTracker.jsx';
import { derivePenalties } from '../utils/penaltyFallback.js';
import { ui } from '../i18n/uiTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';

function parseSource(clause, fallbackNumber, language) {
  const label =
    localizeSourceLabel(clause.source_label?.trim(), language) || '';
  const match = label.match(/^Section\s+([\d.]+)\s*[—–-]\s*(.+)$/i);

  if (match) {
    return {
      sectionNumber: match[1],
      sectionTitle: match[2].trim(),
    };
  }

  const originalNumber = clause.original_text?.match(
    /^(?:(?:clause|section)\s+)?(\d+(?:\.\d+)*)[.):\-]?\s*/i,
  )?.[1];

  return {
    sectionNumber: originalNumber || fallbackNumber,
    sectionTitle: label || ui(language, 'agreementTerm'),
  };
}

function toTrackerSections(clauses = [], language = 'en') {
  return clauses.flatMap((clause, clauseIndex) => {
    const fallback = derivePenalties(clause);
    const penalties = clause.penalty_items?.length
      ? clause.penalty_items
      : fallback.penalty_items;
    const compensation = clause.compensation_items?.length
      ? clause.compensation_items
      : fallback.compensation_items;
    const source = parseSource(clause, clauseIndex + 1, language);

    return [...penalties, ...compensation].map(item => ({
      ...source,
      trigger:
        language === 'en'
          ? item.trigger || ui(language, 'obligationNotMet')
          : ui(language, 'obligationNotMet'),
      consequence:
        language === 'en' && item.consequence
          ? item.consequence
          : `${ui(language, 'contractualConsequence')} — ${
              item.amounts?.length
                ? item.amounts.join(', ')
                : ui(language, 'noAmount')
            }`,
    }));
  });
}

export default function PenaltyCompensationSection({
  clauses = [],
  language = 'en',
}) {
  const sections = toTrackerSections(clauses, language);

  return (
    <section className="report-section penalty-summary">
      <div className="section-heading">
        <div>
          <span className="section-index">04</span>
          <h2>{ui(language, 'penaltyTitle')}</h2>
        </div>
      </div>
      <p className="section-caption">{ui(language, 'penaltyCaption')}</p>

      {sections.length ? (
        <PenaltyCompensationTracker sections={sections} language={language} />
      ) : (
        <div className="penalty-empty">✓ {ui(language, 'noPenalty')}</div>
      )}
    </section>
  );
}
