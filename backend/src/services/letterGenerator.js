const templates = {
  en: { hello: 'Dear Landlord,', intro: 'I am writing to request clarification and revisions to the following terms in the proposed rental agreement:', close: 'Please confirm these changes in writing before we sign. I hope we can resolve these points fairly and proceed with clear, mutually understood terms.\n\nSincerely,\nTenant' },
  hi: { hello: 'आदरणीय मकान मालिक,', intro: 'मैं प्रस्तावित किराया समझौते की निम्न शर्तों पर स्पष्टीकरण और संशोधन का अनुरोध करता/करती हूँ:', close: 'कृपया हस्ताक्षर से पहले इन बदलावों की लिखित पुष्टि करें। आशा है कि हम इन मुद्दों को निष्पक्ष रूप से सुलझाकर स्पष्ट और परस्पर सहमत शर्तों पर आगे बढ़ेंगे।\n\nसादर,\nकिरायेदार' },
  kn: { hello: 'ಆದರಣೀಯ ಮನೆಮಾಲೀಕರೇ,', intro: 'ಪ್ರಸ್ತಾವಿತ ಬಾಡಿಗೆ ಒಪ್ಪಂದದ ಕೆಳಗಿನ ಷರತ್ತುಗಳ ಕುರಿತು ಸ್ಪಷ್ಟನೆ ಮತ್ತು ತಿದ್ದುಪಡಿಯನ್ನು ಕೋರುತ್ತೇನೆ:', close: 'ಸಹಿ ಮಾಡುವ ಮೊದಲು ಈ ಬದಲಾವಣೆಗಳನ್ನು ಲಿಖಿತವಾಗಿ ದೃಢಪಡಿಸಿ. ಈ ವಿಷಯಗಳನ್ನು ನ್ಯಾಯಯುತವಾಗಿ ಬಗೆಹರಿಸಿ ಸ್ಪಷ್ಟ, ಪರಸ್ಪರ ಒಪ್ಪಿದ ಷರತ್ತುಗಳೊಂದಿಗೆ ಮುಂದುವರಿಯಬಹುದು ಎಂದು ಭಾವಿಸುತ್ತೇನೆ.\n\nವಂದನೆಗಳೊಂದಿಗೆ,\nಬಾಡಿಗೆದಾರ' },
  ta: { hello: 'மதிப்பிற்குரிய வீட்டு உரிமையாளருக்கு,', intro: 'முன்மொழியப்பட்ட வாடகை ஒப்பந்தத்தின் பின்வரும் நிபந்தனைகளுக்கு விளக்கமும் திருத்தமும் கோருகிறேன்:', close: 'கையெழுத்திடும் முன் இந்த மாற்றங்களை எழுத்தில் உறுதிப்படுத்தவும். இவற்றை நியாயமாகத் தீர்த்து, தெளிவான பரஸ்பர ஒப்புதல் நிபந்தனைகளுடன் தொடரலாம் என நம்புகிறேன்.\n\nநன்றி,\nவாடகையாளர்' },
  te: { hello: 'గౌరవనీయ ఇంటి యజమానికి,', intro: 'ప్రతిపాదిత అద్దె ఒప్పందంలోని క్రింది షరతులపై వివరణ మరియు సవరణ కోరుతున్నాను:', close: 'సంతకం ముందు ఈ మార్పులను రాతపూర్వకంగా నిర్ధారించండి. వీటిని న్యాయంగా పరిష్కరించి స్పష్టమైన, పరస్పర అంగీకార షరతులతో ముందుకు సాగగలమని ఆశిస్తున్నాను.\n\nభవదీయులు,\nఅద్దెదారు' },
  es: { hello: 'Estimado/a propietario/a:', intro: 'Solicito aclaraciones y cambios en las siguientes condiciones del contrato de alquiler propuesto:', close: 'Confirme estos cambios por escrito antes de la firma. Espero que podamos resolver estos puntos de manera justa y continuar con condiciones claras y mutuamente acordadas.\n\nAtentamente,\nInquilino/a' }
};

export function generateNegotiationLetter(clauses, languageCode, documentType = 'rental') {
  const t = documentType === 'rental' ? (templates[languageCode] || templates.en) : { hello:'Dear Other Party,',intro:`I am writing to request clarification and revisions to the following terms in the proposed ${documentType === 'general' ? '' : `${documentType} `}agreement:`,close:'Please confirm these changes in writing before we sign. I hope we can resolve these points fairly and proceed with clear, mutually understood terms.\n\nSincerely,' };
  const flagged = clauses.filter(c => c.flagged);
  if (!flagged.length) return `${t.hello}\n\n${t.intro}\n\nNo flagged issues were identified by the indexed rules. I would still like all terms confirmed in writing.\n\n${t.close}`;
  const seen = new Set();
  const requests = flagged.map(c => {
    const source = c.source_label || `Clause ${String(c.clause_id || '').replace(/^c/, '')}`;
    const explanation = c.plain_explanation_points?.[0] || c.plain_explanation || 'This term needs clarification.';
    const action = c.suggested_action || `Please revise ${source} so the parties' rights, responsibilities, limits, and notice requirements are stated clearly and fairly.`;
    const legalBasis = c.legal_basis && !/NEEDS RESEARCH/i.test(c.legal_basis) ? ` Legal reference: ${c.legal_basis}.` : '';
    const request = `${source}: ${explanation} Proposed change: ${action}${legalBasis}`;
    const key = request.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) return null;
    seen.add(key);
    return request;
  }).filter(Boolean);
  const issues = requests.map((request, i) => `${i + 1}. ${request}`).join('\n\n');
  return `${t.hello}\n\n${t.intro}\n\n${issues}\n\n${t.close}`;
}
