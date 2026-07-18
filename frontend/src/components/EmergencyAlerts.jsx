import { ui } from '../i18n/uiTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';

export default function EmergencyAlerts({ clauses = [], language = 'en' }) {
  const alerts = clauses.filter(clause => clause.emergency_red_flag);
  if (!alerts.length) return null;

  return (
    <section className="emergency-section">
      <h2>⚠ {ui(language, 'emergencyHeading')}</h2>
      <p>{ui(language, 'emergencyIntro')}</p>
      {alerts.map(clause => {
        const alert = clause.emergency_red_flag;
        const rights = language === 'en' && alert.violated_rights?.length
          ? alert.violated_rights
          : [{
              name: ui(
                language,
                clause.rights_category === 'fair_contract_terms'
                  ? 'fairTerms'
                  : 'accessJustice',
              ),
              explanation: ui(language, 'reviewExplanation'),
            }];

        return (
          <article key={clause.clause_id}>
            <strong>{localizeSourceLabel(clause.source_label, language)}</strong>
            <span>
              {language === 'en' ? alert.title : ui(language, 'emergencyHeading')}
            </span>
            <p>
              {language === 'en' ? alert.warning : ui(language, 'emergencyIntro')}
            </p>
            <div className="violated-rights">
              <h3>{ui(language, 'violatedRights')}</h3>
              <ul>
                {rights.map(right => (
                  <li key={right.name}>
                    <strong>{right.name}</strong>
                    <span>{right.explanation}</span>
                  </li>
                ))}
              </ul>
              <small>{ui(language, 'legalEffect')}</small>
            </div>
          </article>
        );
      })}
    </section>
  );
}
