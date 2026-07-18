import RiskBadge from'./RiskBadge.jsx';import ClauseCard from'./ClauseCard.jsx';import ClauseReviewSummary from'./ClauseReviewSummary.jsx';import DocumentSectionSearch from'./DocumentSectionSearch.jsx';import ReportSectionNav from'./ReportSectionNav.jsx';import DisclaimerBanner from'./DisclaimerBanner.jsx';import ApplicableLawsPanel from'./ApplicableLawsPanel.jsx';import NegotiationLetterPanel from'./NegotiationLetterPanel.jsx';import LegalAidPanel from'./LegalAidPanel.jsx';import PowerScoreGauge from'./PowerScoreGauge.jsx';import RiskDashboard from'./RiskDashboard.jsx';import SpeakButton from'./SpeakButton.jsx';import PenaltyCompensationSection from'./PenaltyCompensationSection.jsx';import HiddenCostSection from'./HiddenCostSection.jsx';import AdvocacyDashboard from'./AdvocacyDashboard.jsx';import{downloadCompleteReport}from'../utils/reportPdf.js';import{ui}from'../i18n/uiTranslations.js';import{tr}from'../i18n/reportTranslations.js';

export default function ReportView({report,onReset}){
  const l=report.output_language||'en',flagged=report.clauses.filter(c=>c.flagged).length;
  const download=()=>downloadCompleteReport(report);
  return <main className="report">
    <div className="report-actions"><button className="back" onClick={onReset}>← {tr(l,'another')}</button></div>
    <DisclaimerBanner text={l==='en'?report.disclaimer:null} language={l}/>
    <section className={`risk-hero risk-bg-${report.overall_risk}`}><div><div className="eyebrow">{tr(l,'complete')}</div><h1>{tr(l,'hasRisk')} <span>{tr(l,report.overall_risk==='high'?'unfair':report.overall_risk==='medium'?'negotiable':'safe')}</span> {tr(l,'risk')}</h1><p>{flagged} / {report.clauses.length} {tr(l,'attention')}</p></div><RiskBadge level={report.overall_risk} large language={l}/></section>
    <RiskDashboard clauses={report.clauses} level={report.overall_risk} language={l}/>
    {report.negotiation_power_score!=null&&<PowerScoreGauge score={report.negotiation_power_score} label={report.score_label} language={l}/>} 
    <ReportSectionNav language={l}/>
    <section id="report-summary" className="summary-card report-scroll-target"><div className="section-index">01</div><div><h2>{tr(l,'summary')}</h2><p>{report.summary}</p><SpeakButton text={report.summary} language={l}/></div></section>
    <AdvocacyDashboard report={report} language={l}/>
    <div id="report-laws" className="report-scroll-target"><ApplicableLawsPanel laws={report.applicable_laws} language={l}/></div>
    <div id="report-clause-summary" className="report-scroll-target"><ClauseReviewSummary clauses={report.clauses} language={l}/></div>
    <div id="report-search" className="report-scroll-target"><DocumentSectionSearch clauses={report.clauses} language={l}/></div>
    <section id="report-clause-review" className="clauses report-section report-scroll-target"><div className="section-heading"><div><span className="section-index">05</span><h2>{tr(l,'review')}</h2></div><p>{tr(l,'reviewHelp')}</p></div>{report.clauses.map(c=><div className="clause-search-target" id={`review-${c.clause_id}`} key={c.clause_id}><ClauseCard clause={c} outputLanguage={l}/></div>)}</section>
    <div id="report-penalties" className="report-scroll-target"><PenaltyCompensationSection clauses={report.clauses} language={l}/></div>
    <div id="report-hidden-costs" className="report-scroll-target"><HiddenCostSection clauses={report.clauses} language={l}/></div>
    <div id="report-letter" className="report-scroll-target"><NegotiationLetterPanel initialLetter={report.negotiation_letter} sectionNumber="08" language={l}/></div>
    <div id="report-legal-help" className="report-scroll-target"><LegalAidPanel contacts={report.legal_aid_contacts} language={l}/></div>
    <div className="download-row"><button className="primary" onClick={download}>{ui(l,'download')}</button></div>
  </main>
}
