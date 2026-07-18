import { ui } from '../i18n/uiTranslations.js';

const categoryKeys = {
  access_to_justice: 'accessJustice',
  fair_contract_terms: 'fairTerms',
  privacy: 'privacy',
  consumer_rights: 'consumerRights',
  employment_rights: 'employmentRights',
  housing_rights: 'housingRights',
  financial_rights: 'financialRights',
};
const documentRights = {
  rental: 'housing_rights',
  employment: 'employment_rights',
  loan: 'financial_rights',
  service: 'consumer_rights',
  general: 'fair_contract_terms',
};

function normalize(data, clauses = [], documentType = 'general') {
  if (!clauses.length) return data;
  const breakdown = Object.fromEntries(
    Object.keys(categoryKeys).map(key => [key, 0]),
  );
  for (const clause of clauses) {
    const categories = new Set(
      [
        ...(clause.rights_categories || []),
        clause.rights_category,
        clause.emergency_red_flag?.rights_category,
      ].filter(Boolean),
    );
    const id = clause.matched_rule_id || '';
    const title = clause.emergency_red_flag?.title || '';
    if (clause.emergency_red_flag && !categories.size) {
      categories.add(
        /liability/i.test(title) ? 'fair_contract_terms' : 'access_to_justice',
      );
    }
    if (/arbitration|recourse|remed|recovery/.test(id)) {
      categories.add('access_to_justice');
    }
    if (clause.hidden_costs?.length) categories.add('consumer_rights');
    if (clause.penalty_items?.length || clause.compensation_items?.length) {
      categories.add('fair_contract_terms');
    }
    if (clause.flagged && !categories.size) {
      categories.add(documentRights[documentType] || 'fair_contract_terms');
    }
    for (const category of categories) {
      if (category in breakdown) breakdown[category] += 1;
    }
  }
  const violations = Object.values(breakdown).reduce(
    (sum, value) => sum + value,
    0,
  );
  const emergencies = clauses.filter(clause => clause.emergency_red_flag).length;
  const score = violations
    ? Math.min(100, violations * 15 + emergencies * 20)
    : 0;
  const severity = score >= 60 ? 'high' : score >= 25 ? 'medium' : 'low';
  return { score, severity, violations, breakdown };
}

export default function RightsHeatIndex({
  data,
  clauses,
  documentType,
  language = 'en',
}) {
  if (!data) return null;
  const indexed = normalize(data, clauses, documentType);
  return (
    <section className={`rights-heat ${indexed.severity}`}>
      <div className="heat-score">
        <strong>{indexed.score}</strong><span>/100</span>
      </div>
      <div>
        <span>{ui(language, 'rightsIndex')}</span>
        <h2>{ui(language, indexed.severity).toUpperCase()}</h2>
        <p>
          {indexed.violations
            ? `⚠ ${ui(language, 'rightsConcern')}`
            : ui(language, 'noRightsConcern')}
        </p>
        <div className="rights-breakdown">
          {Object.entries(indexed.breakdown).map(([key, value]) => (
            <div key={key}>
              <span>{ui(language, categoryKeys[key])}</span>
              <i><b style={{ width: `${Math.min(100, value * 25)}%` }} /></i>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
