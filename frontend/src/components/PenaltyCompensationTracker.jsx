import { ui } from '../i18n/uiTranslations.js';
import { localizeSourceLabel } from '../i18n/sourceLabels.js';

/**
 * Renders document sections that contain a penalty or compensation consequence.
 *
 * @param {{ sections: Array<{
 *   sectionNumber: string | number,
 *   sectionTitle: string,
 *   trigger: string,
 *   consequence: string
 * }> }} props
 */
export default function PenaltyCompensationTracker({ sections = [], language = 'en' }) {
  if (!sections.length) return null;

  return (
    <div className="penalty-compensation-tracker">
      {sections.map((section, index) => (
        <article
          className="penalty-section-card"
          key={`${section.sectionNumber}-${section.sectionTitle}-${index}`}
        >
          <header className="penalty-section-header">
            <span className="penalty-card-index" aria-hidden="true">
              {index + 1}
            </span>
            <h3>
              {ui(language,'section')} {section.sectionNumber} — {localizeSourceLabel(section.sectionTitle,language)}
            </h3>
          </header>

          <section
            className="penalty-tracker-card"
            aria-labelledby={`penalty-heading-${index}`}
          >
            <h4 id={`penalty-heading-${index}`}>
              <span aria-hidden="true">₹</span>
              {ui(language,'tracker')}
            </h4>

            <div className="penalty-details">
              <h5>{ui(language,'applicantPenalties')}</h5>
              <dl>
                <div>
                  <dt>{ui(language,'trigger')}:</dt>
                  <dd>{section.trigger}</dd>
                </div>
                <div>
                  <dt>{ui(language,'consequence')}:</dt>
                  <dd>{section.consequence}</dd>
                </div>
              </dl>
            </div>

            <p className="penalty-fairness-note">
              <strong>{ui(language,'fairness')}:</strong> {ui(language,'fairnessNote')}
            </p>
          </section>
        </article>
      ))}
    </div>
  );
}
