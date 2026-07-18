import ruleset from '../data/ruleset.json' with { type: 'json' };
import agreementRulesets from '../data/agreementRulesets.json' with { type: 'json' };
import { mapObligations } from './obligationEngine.js';

const ruleLibraries = { rental: ruleset, ...agreementRulesets };
export const getRuleset = documentType => ruleLibraries[documentType] || ruleLibraries.general;

const API_URL = 'https://api.anthropic.com/v1/messages';
const copy = {
  en: { clear: 'This clause does not match a known warning pattern in the reviewed ruleset.', action: 'Keep a copy and ask for clarification before signing if any wording is unclear.', summary: 'This residential rental agreement sets out the parties’ main tenancy terms. Review the clauses below, especially those marked as risks. Confirm all amounts, dates, responsibilities, and notice periods in writing before signing.', means: 'The referenced rule requires this issue to be checked as described in the verified ruleset.' },
  hi: { clear: 'यह धारा जाँचे गए नियम-संग्रह के किसी ज्ञात चेतावनी पैटर्न से मेल नहीं खाती।', action: 'प्रति सुरक्षित रखें और अस्पष्ट भाषा को हस्ताक्षर से पहले स्पष्ट कराएँ।', summary: 'यह आवासीय किराया समझौता किरायेदारी की मुख्य शर्तें बताता है। नीचे दी गई धाराओं, खासकर जोखिम वाली धाराओं, को ध्यान से जाँचें। हस्ताक्षर से पहले रकम, तारीख, जिम्मेदारियाँ और नोटिस अवधि लिखित में पक्की करें।', means: 'संदर्भित नियम के अनुसार इस मुद्दे की जाँच सत्यापित नियम-संग्रह में दिए वर्णन के आधार पर होनी चाहिए।' },
  kn: { clear: 'ಈ ಷರತ್ತು ಪರಿಶೀಲಿಸಿದ ನಿಯಮಾವಳಿಯ ಯಾವುದೇ ತಿಳಿದ ಎಚ್ಚರಿಕೆ ಮಾದರಿಗೆ ಹೊಂದುವುದಿಲ್ಲ.', action: 'ಪ್ರತಿಯನ್ನು ಉಳಿಸಿ ಮತ್ತು ಅಸ್ಪಷ್ಟ ಪದಗಳನ್ನು ಸಹಿ ಮಾಡುವ ಮೊದಲು ಸ್ಪಷ್ಟಪಡಿಸಿಕೊಳ್ಳಿ.', summary: 'ಈ ವಸತಿ ಬಾಡಿಗೆ ಒಪ್ಪಂದವು ಬಾಡಿಗೆಯ ಮುಖ್ಯ ಷರತ್ತುಗಳನ್ನು ವಿವರಿಸುತ್ತದೆ. ಕೆಳಗಿನ ಷರತ್ತುಗಳಲ್ಲಿ, ವಿಶೇಷವಾಗಿ ಅಪಾಯವೆಂದು ಗುರುತಿಸಿದವುಗಳನ್ನು ಗಮನವಾಗಿ ಪರಿಶೀಲಿಸಿ. ಸಹಿ ಮಾಡುವ ಮೊದಲು ಮೊತ್ತ, ದಿನಾಂಕ, ಜವಾಬ್ದಾರಿ ಮತ್ತು ನೋಟಿಸ್ ಅವಧಿಯನ್ನು ಲಿಖಿತವಾಗಿ ದೃಢಪಡಿಸಿ.', means: 'ಉಲ್ಲೇಖಿತ ನಿಯಮದ ಪ್ರಕಾರ ಈ ವಿಷಯವನ್ನು ಪರಿಶೀಲಿತ ನಿಯಮಾವಳಿಯ ವಿವರಣೆಯಂತೆ ಪರಿಶೀಲಿಸಬೇಕು.' },
  ta: { clear: 'இந்தப் பிரிவு பரிசோதிக்கப்பட்ட விதித்தொகுப்பின் அறியப்பட்ட எச்சரிக்கை முறையுடன் பொருந்தவில்லை.', action: 'நகலை வைத்துக்கொண்டு, தெளிவற்ற சொற்களை கையெழுத்திடும் முன் விளக்கிக் கொள்ளுங்கள்.', summary: 'இந்தக் குடியிருப்பு வாடகை ஒப்பந்தம் முக்கிய வாடகை நிபந்தனைகளை விளக்குகிறது. கீழே உள்ள பிரிவுகளில், குறிப்பாக அபாயமாகக் குறிக்கப்பட்டவற்றை கவனமாகச் சரிபார்க்கவும். கையெழுத்திடும் முன் தொகை, தேதி, பொறுப்பு மற்றும் அறிவிப்பு காலத்தை எழுத்தில் உறுதி செய்யவும்.', means: 'மேற்கோள் விதிப்படி, சரிபார்க்கப்பட்ட விதித்தொகுப்பில் உள்ள விளக்கத்தின் அடிப்படையில் இந்த விஷயம் ஆய்வு செய்யப்பட வேண்டும்.' },
  te: { clear: 'ఈ నిబంధన పరిశీలించిన నియమాల జాబితాలోని తెలిసిన హెచ్చరిక నమూనాతో సరిపోలలేదు.', action: 'ప్రతిని ఉంచుకొని, అస్పష్టమైన పదాలను సంతకం ముందు వివరించమని అడగండి.', summary: 'ఈ నివాస అద్దె ఒప్పందం ప్రధాన అద్దె షరతులను వివరిస్తుంది. క్రింద ఉన్న నిబంధనలను, ముఖ్యంగా ప్రమాదంగా గుర్తించిన వాటిని జాగ్రత్తగా చూడండి. సంతకం ముందు మొత్తాలు, తేదీలు, బాధ్యతలు, నోటీసు కాలాలను రాతపూర్వకంగా నిర్ధారించండి.', means: 'సూచించిన నియమం ప్రకారం, ధృవీకరించిన నియమాల వివరణ ఆధారంగా ఈ అంశాన్ని పరిశీలించాలి.' },
  es: { clear: 'Esta cláusula no coincide con ningún patrón de alerta conocido del conjunto de reglas revisado.', action: 'Guarde una copia y pida aclaraciones antes de firmar si algo no está claro.', summary: 'Este contrato de alquiler residencial establece las condiciones principales del arrendamiento. Revise las cláusulas siguientes, especialmente las marcadas como riesgos. Confirme por escrito importes, fechas, responsabilidades y plazos antes de firmar.', means: 'La regla citada exige revisar este asunto según la descripción del conjunto de reglas verificado.' }
};

async function callClaude(prompt, maxTokens = 1200) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const response = await fetch(API_URL, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5', max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error(`Analysis provider returned ${response.status}`);
  return (await response.json()).content?.[0]?.text;
}

function parseJson(raw) {
  return JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '').trim());
}

function clauseSpecificFallback(clause, obligations = {}) {
  const compact = clause.replace(/\s+/g, ' ').replace(/^(?:(?:clause|section)\s+)?\d+(?:\.\d+)*[.):\-]?\s*/i, '').trim();
  const subject = compact.split(/[:.!?]/)[0].trim();
  const label = subject && subject.length <= 70 ? subject : compact.slice(0, 67).trim();
  const applicant = obligations.applicant?.[0];
  const recipient = obligations.recipient?.[0];
  const points = [`This section covers ${label ? label.toLowerCase() : 'the stated agreement term'}.`];
  if (applicant) points.push(applicant.replace(/^[A-Z]/, value => value.toLowerCase()).replace(/^/, 'The applicant must '));
  if (recipient) points.push(recipient.replace(/^[A-Z]/, value => value.toLowerCase()).replace(/^/, 'The other party must '));
  if (points.length === 1) points.push(`In plain language: ${compact.slice(0, 180)}${compact.length > 180 ? '…' : ''}`);
  return points.slice(0, 3);
}

function localAnalyze(clause, language, documentType = 'general') {
  const activeRules = getRuleset(documentType);
  const found = activeRules.find(rule => rule.keywords.some(k => clause.toLowerCase().includes(k.toLowerCase()))) || (documentType === 'general' ? null : ruleLibraries.general.find(rule => rule.keywords.some(k => clause.toLowerCase().includes(k.toLowerCase()))));
  const t = copy[language] || copy.en;
  if (!found) {
    const mapped = mapObligations(clause, documentType);
    const obligations = { applicant: mapped.applicant_obligations, recipient: mapped.recipient_obligations };
    return { plain_explanation_points: language === 'en' ? clauseSpecificFallback(clause, obligations) : [t.clear], flagged: false, matched_rule_id: null, risk_level: 'none', legal_basis: null, legal_basis_explanation: null, suggested_action: null };
  }
  const specificAction = language === 'en' ? `Request a written revision that addresses this issue: ${found.check_description}` : t.action;
  return { plain_explanation_points: [language === 'en' ? found.plain_explanation_template : `${t.means} (${found.title})`, language === 'en' ? found.check_description : t.means], flagged: true, matched_rule_id: found.rule_id, risk_level: found.risk_level, rights_category: found.rights_category || null, legal_basis: found.legal_basis, legal_basis_explanation: language === 'en' ? found.check_description : t.means, suggested_action: specificAction };
}

export async function analyzeClause(clause, language, documentType = 'general') {
  const lang = language.promptLabel;
  const activeRules = [...getRuleset(documentType), ...(documentType === 'general' ? [] : ruleLibraries.general)];
  const prompt = `System: You are a legal document analysis assistant. Analyze one ${documentType} agreement clause for ${process.env.JURISDICTION_NAME || 'India'} using ONLY the supplied rules. Explain the clause as 2-4 short, distinct bullet points written entirely natively in ${lang}; never translate legal_basis, rule_id, or rights_category. Ground legal_basis_explanation strictly in check_description and never invent a risk. Return ONLY JSON with plain_explanation_points (array), flagged, matched_rule_id, risk_level, rights_category, legal_basis, legal_basis_explanation, suggested_action. Rules: ${JSON.stringify(activeRules)}\nClause to analyze: ${clause}`;
  const raw = await callClaude(prompt);
  if (!raw) return localAnalyze(clause, language.code, documentType);
  const result = parseJson(raw);
  if (!Array.isArray(result.plain_explanation_points)) throw new Error('Analysis provider returned an invalid explanation format.');
  const matched = activeRules.find(r => r.rule_id === result.matched_rule_id);
  if (result.flagged && !matched) return localAnalyze(clause, language.code, documentType);
  if (matched) { result.legal_basis = matched.legal_basis; result.risk_level = matched.risk_level; result.rights_category = matched.rights_category || null; }
  return result;
}

export async function summarizeDocument(text, language, documentType = 'general') {
  const raw = await callClaude(`Summarize this ${documentType} agreement in 3-5 plain sentences written natively in ${language.promptLabel}, with no legal jargon. Do not add legal claims. Document: ${text}`, 500);
  const fallback = documentType === 'rental' ? (copy[language.code] || copy.en).summary : `This ${documentType === 'general' ? '' : `${documentType} `}agreement sets out the parties' main terms. Review the clauses marked as risks and confirm all amounts, dates, responsibilities, remedies, and notice periods in writing before signing.`;
  return raw?.trim() || fallback;
}

export async function llmSegment(text) {
  const raw = await callClaude(`Split this legal document into clauses. Return only a JSON array of strings, preserving every word: ${text}`, 2000);
  if (!raw) throw new Error('LLM unavailable');
  return parseJson(raw);
}

export async function answerFollowUp(question, documentContext, language) {
  const documentType = documentContext.document_type || 'general', activeRules = [...getRuleset(documentType), ...(documentType === 'general' ? [] : ruleLibraries.general)];
  const prompt = `System: You are answering a follow-up question about a ${documentType} agreement that has already been analyzed. Answer ONLY using the document context and ruleset provided below—do not introduce new legal claims beyond the ruleset. If the question cannot be answered from this context, say so clearly rather than guessing. Answer in ${language.promptLabel}, in 2-4 plain sentences.\nDocument analysis context: ${JSON.stringify(documentContext)}\nRuleset reference: ${JSON.stringify(activeRules)}\nUser question: ${question}`;
  let raw = null;
  try { raw = await callClaude(prompt, 500); } catch (error) { console.warn('Follow-up provider unavailable; using grounded local answer:', error.message); }
  if (raw) return raw.trim();
  const q = question.toLowerCase();
  const intentTerms = { pay: ['pay','payment','rent','fee','charge','deposit','interest','installment','repay'], refuse: ['refuse','decline','reject','waive'], leave: ['leave','vacate','evict','termination','notice'], repair: ['repair','maintenance','damage'], sue: ['sue','court','legal','arbitration','remedy'], penalty: ['penalty','fine','late fee','forfeit','damages','compensation'] };
  const words = q.split(/\W+/).filter(Boolean); const expanded = new Set(words);
  for (const [intent, terms] of Object.entries(intentTerms)) if (words.includes(intent) || terms.some(t => q.includes(t))) terms.forEach(t => expanded.add(t));
  const scored=(documentContext.clauses||[]).map(c=>{const searchable=[c.original_text,c.source_label,...(c.plain_explanation_points||[]),c.suggested_action,...(c.applicant_obligations||[]),...(c.recipient_obligations||[])].filter(Boolean).join(' ').toLowerCase();const score=[...expanded].reduce((n,w)=>n+(w.length>2&&searchable.includes(w)?1:0),0)+(c.flagged?0.25:0);return{c,score}}).sort((a,b)=>b.score-a.score);
  const relevant=scored[0]?.score>0?scored[0].c:null;
  if (relevant) { const explanation=relevant.plain_explanation_points?.join(' ')||relevant.plain_explanation||''; const action=relevant.suggested_action||''; const citation=relevant.legal_basis?` [${relevant.legal_basis}]`:''; return `${explanation} ${action}${citation}`.trim(); }
  const fallback = { en: 'I cannot answer that from the analyzed clauses and indexed rules. Please ask about a specific clause shown in this report or consult a qualified local professional.', hi: 'विश्लेषित धाराओं और सूचीबद्ध नियमों से इसका उत्तर नहीं दिया जा सकता। इस रिपोर्ट में दिखाई गई किसी खास धारा के बारे में पूछें या योग्य स्थानीय पेशेवर से सलाह लें।', kn: 'ವಿಶ್ಲೇಷಿಸಿದ ಷರತ್ತುಗಳು ಮತ್ತು ಸೂಚಿಸಿದ ನಿಯಮಗಳಿಂದ ಇದಕ್ಕೆ ಉತ್ತರಿಸಲಾಗುವುದಿಲ್ಲ. ಈ ವರದಿಯ ನಿರ್ದಿಷ್ಟ ಷರತ್ತಿನ ಬಗ್ಗೆ ಕೇಳಿ ಅಥವಾ ಅರ್ಹ ಸ್ಥಳೀಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.' };
  return fallback[language.code] || fallback.en;
}
