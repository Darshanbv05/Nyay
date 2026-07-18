import { ui } from '../i18n/uiTranslations.js';

export default function JurisdictionPanel({ jurisdiction, language = 'en' }) {
  const missing = !jurisdiction?.name;
  return (
    <section
      className={`jurisdiction-panel ${missing ? 'missing' : jurisdiction.status}`}
    >
      <div>
        <span>{ui(language, 'jurisdiction')}</span>
        <strong>
          {jurisdiction?.name || ui(language, 'notSpecified')}
        </strong>
      </div>
      <p>
        {missing
          ? `⚠ ${ui(language, 'jurisdictionMissing')}`
          : language === 'en'
            ? jurisdiction.note
            : ui(language, 'jurisdictionAwareness')}
      </p>
    </section>
  );
}
