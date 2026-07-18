import { ui } from '../i18n/uiTranslations.js';

function formatRuleName(ruleId, language) {
  if (!ruleId || ruleId === 'indexed_rule') {
    return ui(language, 'automatedReview');
  }
  return ruleId
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

export default function RuleMatchCard({
  ruleId,
  riskLevel = 'medium',
  language = 'en',
}) {
  return (
    <aside
      className={`rule-match-card rule-match-${riskLevel}`}
      aria-label={ui(language, 'reviewReason')}
    >
      <span className="rule-match-icon" aria-hidden="true">!</span>
      <div className="rule-match-content">
        <span className="rule-match-eyebrow">{ui(language, 'reviewReason')}</span>
        <strong>{formatRuleName(ruleId, language)}</strong>
        <p>{ui(language, 'reviewExplanation')}</p>
      </div>
      <span className="rule-match-status">{ui(language, 'needsAttention')}</span>
    </aside>
  );
}
