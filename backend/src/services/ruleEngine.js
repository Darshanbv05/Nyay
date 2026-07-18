export function aggregateRisk(clauses) {
  if (clauses.some(c => c.risk_level === 'high')) return 'high';
  if (clauses.some(c => c.risk_level === 'medium')) return 'medium';
  return 'low';
}

export function negotiationPower(clauses, languageCode = 'en', documentType = 'general') {
  const counts = { high: 0, medium: 0, low: 0 };
  clauses.filter(c => c.flagged).forEach(c => { if (counts[c.risk_level] != null) counts[c.risk_level]++; });
  const score = Math.max(0, 100 - counts.high * 15 - counts.medium * 8 - counts.low * 3);
  const labels = {
    en: ['Strongly Landlord-Favored', 'Moderately Landlord-Favored', 'Relatively Balanced'],
    hi: ['मकान मालिक के बहुत अधिक पक्ष में', 'मकान मालिक के कुछ पक्ष में', 'तुलनात्मक रूप से संतुलित'],
    kn: ['ಮನೆಮಾಲೀಕರಿಗೆ ಹೆಚ್ಚು ಅನುಕೂಲ', 'ಮನೆಮಾಲೀಕರಿಗೆ ಸ್ವಲ್ಪ ಅನುಕೂಲ', 'ತುಲನಾತ್ಮಕವಾಗಿ ಸಮತೋಲನ'],
    ta: ['வீட்டு உரிமையாளருக்கு மிகவும் சாதகம்', 'வீட்டு உரிமையாளருக்கு ஓரளவு சாதகம்', 'ஒப்பீட்டளவில் சமநிலை'],
    te: ['ఇంటి యజమానికి బాగా అనుకూలం', 'ఇంటి యజమానికి కొంత అనుకూలం', 'సాపేక్షంగా సమతుల్యం'],
    es: ['Muy favorable al propietario', 'Moderadamente favorable al propietario', 'Relativamente equilibrado']
  };
  const index = score < 45 ? 0 : score < 75 ? 1 : 2;
  const genericLabels = ['Strongly One-Sided', 'Moderately One-Sided', 'Relatively Balanced'];
  return { negotiation_power_score: score, score_label: (documentType === 'rental' ? (labels[languageCode] || labels.en) : genericLabels)[index] };
}

export function collectApplicableLaws(clauses, ruleset, languageCode = 'en') {
  const matchedIds = new Set(clauses.filter(c => c.flagged).map(c => c.matched_rule_id));
  const relevant = ruleset.filter(rule => matchedIds.has(rule.rule_id));
  const grouped = new Map();
  for (const rule of relevant) {
    const law = rule.legal_basis || '[NEEDS RESEARCH]';
    if (!grouped.has(law)) grouped.set(law, []);
    grouped.get(law).push(rule.check_description);
  }
  const localized = {
    hi: count => `यह संदर्भ प्रासंगिक है क्योंकि इससे जुड़े ${count} सत्यापित नियम इस किराया समझौते में पहचाने गए मुद्दों को शामिल करते हैं।`,
    kn: count => `ಈ ಉಲ್ಲೇಖವು ಪ್ರಸ್ತುತವಾಗಿದೆ, ಏಕೆಂದರೆ ಇದಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ${count} ಪರಿಶೀಲಿತ ನಿಯಮಗಳು ಈ ಬಾಡಿಗೆ ಒಪ್ಪಂದದಲ್ಲಿ ಗುರುತಿಸಿದ ವಿಷಯಗಳನ್ನು ಒಳಗೊಂಡಿವೆ.`,
    ta: count => `இந்த மேற்கோள் பொருத்தமானது; இதனுடன் தொடர்புடைய ${count} சரிபார்க்கப்பட்ட விதிகள் இந்த வாடகை ஒப்பந்தத்தில் கண்டறியப்பட்ட விஷயங்களை உள்ளடக்குகின்றன.`,
    te: count => `ఈ సూచన సంబంధితమైనది, ఎందుకంటే దీనికి సంబంధించిన ${count} ధృవీకరించిన నియమాలు ఈ అద్దె ఒప్పందంలో గుర్తించిన అంశాలను కవర్ చేస్తాయి.`,
    es: count => `Esta referencia es pertinente porque ${count} reglas verificadas asociadas cubren los problemas detectados en este contrato de alquiler.`
  };
  return [...grouped].map(([law_name, topics]) => ({
    law_name: /NEEDS RESEARCH/i.test(law_name) ? 'Legal reference requires verification' : law_name,
    verification_status: /NEEDS RESEARCH/i.test(law_name) ? 'research' : 'indexed',
    matched_topics: topics,
    why_relevant: languageCode === 'en' ? `This reference was activated because the indexed rules cover: ${topics.join(' ')}` : localized[languageCode]?.(topics.length) || `This reference is tied to ${topics.length} matched rule(s).`
  }));
}
