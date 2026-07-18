import { Router } from 'express';
import multer from 'multer';
import languages from '../data/languages.json' with { type: 'json' };
import { extractText } from '../services/extractText.js';
import { describeSourceSection, segmentClauses } from '../services/segmentClauses.js';
import { analyzeClause, answerFollowUp, getRuleset, llmSegment, summarizeDocument } from '../services/llmService.js';
import { aggregateRisk, collectApplicableLaws, negotiationPower } from '../services/ruleEngine.js';
import { generateNegotiationLetter } from '../services/letterGenerator.js';
import legalAidContacts from '../data/legalAidContacts.json' with { type: 'json' };
import precedents from '../data/precedents.json' with { type: 'json' };
import rightsFaq from '../data/rightsFaq.json' with { type: 'json' };
import { anonymizeText } from '../services/anonymize.js';
import { detectDocumentType, mapObligations } from '../services/obligationEngine.js';
import { trackPenalties } from '../services/penaltyEngine.js';
import { detectHiddenCosts } from '../services/hiddenCostEngine.js';
import { analyzePattern, detectJurisdiction, extractTimeline, inferRightsCategories, rightsHeatIndex } from '../services/advancedAnalysis.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/languages', (_req, res) => res.json(languages.map(({ promptLabel, ...item }) => item)));
router.get('/legal-aid', (_req, res) => res.json(legalAidContacts));
router.post('/extract', upload.single('file'), async (req, res, next) => { try { res.json({ text: await extractText({ file: req.file }) }); } catch (e) { next(e); } });
router.post('/analyze', async (req, res, next) => {
  try {
    const { text, source_type = 'pasted_text', output_language } = req.body;
    const language = languages.find(l => l.code === output_language);
    if (!output_language) return res.status(400).json({ error: 'Choose an explanation language.' });
    if (!language) return res.status(400).json({ error: 'Unsupported explanation language.' });
    const clean = anonymizeText(await extractText({ text }));
    if (clean.length < 40) return res.status(400).json({ error: 'Document text is too short to analyze.' });
    if (clean.length > 100000) return res.status(413).json({ error: 'Document is too long (maximum 100,000 characters).' });
    const document_type = detectDocumentType(clean), jurisdiction=detectJurisdiction(clean), timeline_events=extractTimeline(clean); const rawClauses = await segmentClauses(clean, llmSegment);
    const analyses = await Promise.all(rawClauses.slice(0, 50).map((clause, index) => analyzeClause(clause, language, document_type).then(result => { const penalty=trackPenalties(clause,document_type),hidden_costs=detectHiddenCosts(clause),pattern=analyzePattern(clause); const penaltyFlag=penalty.penalty_items.length||penalty.compensation_items.length,hiddenFlag=hidden_costs.length,emergency=!!pattern.emergency_red_flag; const level=(hiddenFlag||emergency)?'high':result.flagged?result.risk_level:(penalty.penalty_risk_level||result.risk_level),analysis=({ clause_id: `c${index + 1}`, ...describeSourceSection(clause), ...mapObligations(clause, document_type), ...penalty, ...pattern, hidden_costs, original_text: clause, ...result, flagged:result.flagged||!!penaltyFlag||!!hiddenFlag||emergency, risk_level:level, classification:(hiddenFlag||emergency)?'red':(result.flagged||penaltyFlag)?(level==='high'?'red':'yellow'):'green', precedent: result.flagged ? precedents[result.matched_rule_id] || null : null, rights_faq: result.flagged ? rightsFaq[result.matched_rule_id] || null : null }); analysis.rights_categories=inferRightsCategories({...analysis,rights_categories:[analysis.rights_category,pattern.rights_category].filter(Boolean)},document_type);analysis.rights_category=analysis.rights_categories[0]||null;return analysis })));
    const activeRules=[...getRuleset(document_type),...(document_type==='general'?[]:getRuleset('general'))];
    res.json({ output_language, source_type, document_type, jurisdiction, legal_coverage:{country:'India',scope:'Indexed central-law rules, constitutional-principle issue spotting, and selected document/state rules',limitations:'Not an exhaustive database of every Act, rule, amendment, judgment, custom, or local requirement. Constitutional rights often govern State action and do not automatically invalidate private contract terms.'}, timeline_events, rights_heat_index:rightsHeatIndex(analyses,document_type), overall_risk: aggregateRisk(analyses), ...negotiationPower(analyses, output_language, document_type), summary: await summarizeDocument(clean, language, document_type), applicable_laws: collectApplicableLaws(analyses, activeRules, output_language), clauses: analyses, negotiation_letter: generateNegotiationLetter(analyses, output_language, document_type), legal_aid_contacts: legalAidContacts, disclaimer: 'This is an automated informational screening, not legal advice or a complete legal opinion. Coverage is limited to indexed rules. Consult a licensed Indian advocate to verify jurisdiction, current law, enforceability, and court interpretation.' });
  } catch (e) { next(e); }
});
router.post('/ask', async (req, res, next) => { try { const { question, output_language, document_context } = req.body; const language = languages.find(l => l.code === output_language); if (!question?.trim()) return res.status(400).json({ error: 'Enter a question.' }); if (!language) return res.status(400).json({ error: 'Choose a supported language.' }); if (!document_context?.clauses) return res.status(400).json({ error: 'Valid analyzed document context is required.' }); res.json({ answer: await answerFollowUp(question.trim(), document_context, language) }); } catch (e) { next(e); } });
export default router;
