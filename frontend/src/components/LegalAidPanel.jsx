import { ui } from '../i18n/uiTranslations.js';

export default function LegalAidPanel({
  contacts = [],
  language = 'en',
}) {
  const localizedContacts = contacts.map((contact, index) => ({
    ...contact,
    name:
      language === 'en'
        ? contact.name
        : ui(
            language,
            index === 0
              ? 'stateAuthority'
              : index === 1
                ? 'districtAuthority'
                : 'nationalAuthority',
          ),
    helps_with: ui(
      language,
      index === 0
        ? 'stateHelp'
        : index === 1
          ? 'districtHelp'
          : 'nationalHelp',
    ),
    contact_method:
      contact.contact_method?.includes('NEEDS RESEARCH')
        ? ui(language, 'verifyContact')
        : contact.contact_method,
  }));
  return (
    <section className="report-section aid-panel">
      <div className="section-heading">
        <div>
          <span className="section-index">05</span>
          <h2>{ui(language, 'legalHelp')}</h2>
        </div>
      </div>
      <p className="aid-intro">{ui(language, 'legalHelpIntro')}</p>
      <div className="aid-grid">
        {localizedContacts.map((contact, index) => (
          <article key={`${contact.name}-${index}`}>
            <h3>{contact.name}</h3>
            <p>{contact.helps_with}</p>
            <div className="contact-method">{contact.contact_method}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
