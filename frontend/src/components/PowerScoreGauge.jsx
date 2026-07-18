import { ui } from '../i18n/uiTranslations.js';
export default function PowerScoreGauge({ score = 0, label, language = 'en' }) {
  return <section className="power-score"><div className="power-number">{score}<small>/100</small></div><div><span>{ui(language,'power')}</span><h2>{label}</h2><div className="power-track"><i style={{ width: `${score}%` }}/></div><p>{ui(language,'powerNote')}</p></div></section>;
}
