import { ui } from '../i18n/uiTranslations.js';

export default function TimelineVisualizer({ events = [], language = 'en' }) {
  return (
    <section className="report-section timeline-panel">
      <div className="section-heading">
        <div>
          <span className="section-index">06</span>
          <h2>{ui(language, 'timelinePeriods')}</h2>
        </div>
      </div>
      {events.length ? (
        <div className="timeline-track">
          {events.map((event, index) => (
            <article key={index}>
              <span>
                {event.iso_date || event.duration_value || event.day_of_period}
              </span>
              <h3>{ui(language,event.event_type==='notice_period'?'noticePeriod':event.event_type==='date'?'date':event.event_type==='recurring_deadline'?'deadline':'duration')}</h3>
              <strong>{event.iso_date || (event.duration_value ? `${event.duration_value} ${ui(language,event.event_type==='notice_period'?'noticePeriod':'duration')}` : event.label)}</strong>
              <p>{event.source_excerpt}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="feature-warning">⚠ {ui(language, 'noTimeline')}</div>
      )}
    </section>
  );
}
