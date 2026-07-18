import { useState } from 'react';
import RiskBadge from './RiskBadge.jsx';
import SpeakButton from './SpeakButton.jsx';
import ClauseAdvocacy from './ClauseAdvocacy.jsx';
import RuleMatchCard from './RuleMatchCard.jsx';
import { deriveObligations } from '../utils/obligationFallback.js';
import { tr } from '../i18n/reportTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';
import { localizedPoints } from '../i18n/localizedContent.js';

export default function ClauseCard({ clause, outputLanguage = 'en' }) {
  const [open, setOpen] = useState(false);
  const original = clause.original_text || '';
  const fallback = deriveObligations(clause, outputLanguage);
  const english = outputLanguage === 'en';
  const mapped = {
    ...clause,
    applicant_label:
      (english && clause.applicant_label) || fallback.applicant_label,
    recipient_label:
      (english && clause.recipient_label) || fallback.recipient_label,
    applicant_obligations:
      english && clause.applicant_obligations?.length
        ? clause.applicant_obligations
        : fallback.applicant_obligations,
    recipient_obligations:
      english && clause.recipient_obligations?.length
        ? clause.recipient_obligations
        : fallback.recipient_obligations,
  };
  const rawPoints = clause.plain_explanation_points?.length
    ? clause.plain_explanation_points
    : [clause.plain_explanation || '—'];
  const points = localizedPoints(rawPoints, outputLanguage);
  const color =
    clause.classification || (clause.flagged ? 'yellow' : 'green');
  const ruleId =
    clause.matched_rule_id ||
    clause.penalty_rule_id ||
    clause.obligation_rule_id;

  const obligationBox = (title, party, items) => (
    <section>
      <h4>
        {title} <small>({party})</small>
      </h4>
      <ul>
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </section>
  );

  return (
    <article className={`clause-card clause-${color}`}>
      <header>
        <div className="source-reference">
          <span className={`classification-pill ${color}`}>
            {tr(
              outputLanguage,
              color === 'green'
                ? 'safe'
                : color === 'yellow'
                  ? 'negotiable'
                  : 'unfair',
            )}
          </span>
          <strong>{localizeSourceLabel(clause.source_label, outputLanguage) || original.slice(0, 64)}</strong>
          {clause.flagged && (
            <RiskBadge level={clause.risk_level} language={outputLanguage} />
          )}
        </div>
        <button className="expand" onClick={() => setOpen(!open)}>
          {tr(outputLanguage, open ? 'collapse' : 'viewOriginal')}{' '}
          {open ? '−' : '+'}
        </button>
      </header>

      {clause.flagged && (
        <RuleMatchCard ruleId={ruleId} riskLevel={clause.risk_level} language={outputLanguage} />
      )}

      <h3>{tr(outputLanguage, 'simplified')}</h3>
      <ul className="explanation-points">
        {points.map((point, index) => <li key={index}>{point}</li>)}
      </ul>
      <SpeakButton text={points.join('. ')} language={outputLanguage} />

      <div className="obligation-grid">
        {obligationBox(
          tr(outputLanguage, 'applicant'),
          mapped.applicant_label,
          mapped.applicant_obligations,
        )}
        {obligationBox(
          tr(outputLanguage, 'recipient'),
          mapped.recipient_label,
          mapped.recipient_obligations,
        )}
      </div>

      <ClauseAdvocacy clause={clause} />

      {clause.flagged && (
        <div className="action visible-action">
          <h4>{tr(outputLanguage, 'negotiation')}</h4>
          <p>{clause.suggested_action}</p>
        </div>
      )}

      {mapped.obligation_reference && (
        <details className="obligation-reference">
          <summary>{tr(outputLanguage, 'reference')}</summary>
          <p>{mapped.obligation_reference}</p>
          {mapped.obligation_source_url && (
            <a
              href={mapped.obligation_source_url}
              target="_blank"
              rel="noreferrer"
            >
              {tr(outputLanguage, 'official')} ↗
            </a>
          )}
        </details>
      )}

      {open && (
        <div className="details">
          <div className="original">
            <h4>{tr(outputLanguage, 'original')}</h4>
            <blockquote>{original}</blockquote>
          </div>
        </div>
      )}
    </article>
  );
}
