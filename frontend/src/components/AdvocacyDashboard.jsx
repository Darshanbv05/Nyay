import TimelineVisualizer from './TimelineVisualizer.jsx';
import JurisdictionPanel from './JurisdictionPanel.jsx';
import EmergencyAlerts from './EmergencyAlerts.jsx';
import RightsHeatIndex from './RightsHeatIndex.jsx';
import { ui } from '../i18n/uiTranslations.js';

export default function AdvocacyDashboard({ report, language = 'en' }) {
  return (
    <div className="advocacy-dashboard">
      <section id="adv-timeline" className="adv-section">
        <header>
          <span>{ui(language, 'section')} 1</span>
          <h2>{ui(language, 'timeline')}</h2>
        </header>
        <TimelineVisualizer events={report.timeline_events} language={language} />
      </section>

      <section id="adv-jurisdiction" className="adv-section">
        <header>
          <span>{ui(language, 'section')} 2</span>
          <h2>{ui(language, 'jurisdictionAwareness')}</h2>
        </header>
        <JurisdictionPanel jurisdiction={report.jurisdiction} language={language} />
      </section>

      <section id="adv-emergency" className="adv-section">
        <header>
          <span>{ui(language, 'section')} 3</span>
          <h2>{ui(language, 'emergency')}</h2>
        </header>
        <EmergencyAlerts clauses={report.clauses} language={language} />
        {!report.clauses.some(clause => clause.emergency_red_flag) && (
          <div className="dashboard-empty">
            {ui(language, 'noEmergency')}
          </div>
        )}
      </section>

      <section id="adv-rights" className="adv-section">
        <header>
          <span>{ui(language, 'section')} 4</span>
          <h2>{ui(language, 'rights')}</h2>
        </header>
        <RightsHeatIndex
          data={report.rights_heat_index}
          clauses={report.clauses}
          documentType={report.document_type}
          language={language}
        />
      </section>
    </div>
  );
}
