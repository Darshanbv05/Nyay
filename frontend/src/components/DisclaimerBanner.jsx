import { ui } from '../i18n/uiTranslations.js';

export default function DisclaimerBanner({ text, language = 'en' }) {
  return (
    <aside className="disclaimer-banner" role="note">
      <span aria-hidden="true">!</span>
      <div>
        <strong>{ui(language, 'disclaimerTitle')}</strong>
        <p>{text || ui(language, 'disclaimerFallback')}</p>
      </div>
    </aside>
  );
}
