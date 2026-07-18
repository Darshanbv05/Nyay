import { ui } from '../i18n/uiTranslations.js';

const sections = [
  ['report-summary', 'navSummary'],
  ['adv-timeline', 'navTimeline'],
  ['adv-jurisdiction', 'navJurisdiction'],
  ['adv-emergency', 'navEmergency'],
  ['adv-rights', 'navRights'],
  ['report-laws', 'navLaws'],
  ['report-clause-summary', 'navClauseSummary'],
  ['report-search', 'navSearch'],
  ['report-clause-review', 'navReview'],
  ['report-penalties', 'navPenalties'],
  ['report-hidden-costs', 'navHidden'],
  ['report-letter', 'navLetter'],
  ['report-legal-help', 'navHelp'],
];

export default function ReportSectionNav({ language = 'en' }) {
  const go = id =>
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  return (
    <nav
      className="report-section-nav"
      aria-label={ui(language, 'reportSections')}
    >
      <div className="report-nav-heading">
        <strong>{ui(language, 'reportSections')}</strong>
        <span>{ui(language, 'selectSection')}</span>
      </div>
      <div className="report-nav-scroll">
        {sections.map(([id, key], index) => (
          <button type="button" key={id} onClick={() => go(id)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b>{ui(language, key)}</b>
          </button>
        ))}
      </div>
    </nav>
  );
}
