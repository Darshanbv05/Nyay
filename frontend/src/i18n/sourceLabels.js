const topics = {
  en: {
    'risk summary':'Risk summary','security deposit':'Security deposit','automatic renewal':'Automatic renewal','rent payment':'Rent payment','ending agreement':'Ending agreement','notice period':'Notice period','repairs maintenance':'Repairs and maintenance','property access':'Property access','utility services':'Utility services','dispute resolution':'Dispute resolution','legal liability':'Legal liability','fees penalties':'Fees and penalties','subletting rules':'Subletting rules','agreement registration':'Agreement registration','independent contractor services':'Independent contractor services','scope services':'Scope of services','payment terms':'Payment terms','agreement term':'Agreement term',
  },
  hi: {
    'risk summary':'जोखिम सारांश','security deposit':'सुरक्षा जमा','automatic renewal':'स्वचालित नवीनीकरण','rent payment':'किराया भुगतान','ending agreement':'समझौते की समाप्ति','notice period':'नोटिस अवधि','repairs maintenance':'मरम्मत और रखरखाव','property access':'संपत्ति में प्रवेश','utility services':'उपयोगिता सेवाएँ','dispute resolution':'विवाद समाधान','legal liability':'कानूनी दायित्व','fees penalties':'शुल्क और जुर्माना','subletting rules':'उप-किराया नियम','agreement registration':'समझौता पंजीकरण','independent contractor services':'स्वतंत्र ठेकेदार सेवाएँ','scope services':'सेवाओं का दायरा','payment terms':'भुगतान की शर्तें','agreement term':'समझौते की शर्त',
  },
  kn: {
    'risk summary':'ಅಪಾಯ ಸಾರಾಂಶ','security deposit':'ಭದ್ರತಾ ಠೇವಣಿ','automatic renewal':'ಸ್ವಯಂಚಾಲಿತ ನವೀಕರಣ','rent payment':'ಬಾಡಿಗೆ ಪಾವತಿ','ending agreement':'ಒಪ್ಪಂದ ಮುಕ್ತಾಯ','notice period':'ನೋಟಿಸ್ ಅವಧಿ','repairs maintenance':'ದುರಸ್ತಿ ಮತ್ತು ನಿರ್ವಹಣೆ','property access':'ಆಸ್ತಿ ಪ್ರವೇಶ','utility services':'ಉಪಯುಕ್ತ ಸೇವೆಗಳು','dispute resolution':'ವಿವಾದ ಪರಿಹಾರ','legal liability':'ಕಾನೂನು ಹೊಣೆಗಾರಿಕೆ','fees penalties':'ಶುಲ್ಕ ಮತ್ತು ದಂಡಗಳು','subletting rules':'ಉಪಬಾಡಿಗೆ ನಿಯಮಗಳು','agreement registration':'ಒಪ್ಪಂದ ನೋಂದಣಿ','independent contractor services':'ಸ್ವತಂತ್ರ ಗುತ್ತಿಗೆದಾರ ಸೇವೆಗಳು','scope services':'ಸೇವೆಗಳ ವ್ಯಾಪ್ತಿ','payment terms':'ಪಾವತಿ ಷರತ್ತುಗಳು','agreement term':'ಒಪ್ಪಂದದ ಷರತ್ತು',
  },
  ta: {
    'risk summary':'அபாயச் சுருக்கம்','security deposit':'பாதுகாப்பு வைப்புத்தொகை','automatic renewal':'தானியங்கி புதுப்பிப்பு','rent payment':'வாடகை செலுத்துதல்','ending agreement':'ஒப்பந்த முடிவு','notice period':'அறிவிப்பு காலம்','repairs maintenance':'பழுது மற்றும் பராமரிப்பு','property access':'சொத்து அணுகல்','utility services':'பயன்பாட்டு சேவைகள்','dispute resolution':'தகராறு தீர்வு','legal liability':'சட்டப் பொறுப்பு','fees penalties':'கட்டணம் மற்றும் அபராதம்','subletting rules':'துணை வாடகை விதிகள்','agreement registration':'ஒப்பந்தப் பதிவு','independent contractor services':'சுயாதீன ஒப்பந்ததாரர் சேவைகள்','scope services':'சேவைகளின் வரம்பு','payment terms':'கட்டண விதிகள்','agreement term':'ஒப்பந்த விதி',
  },
  te: {
    'risk summary':'ప్రమాద సారాంశం','security deposit':'భద్రతా డిపాజిట్','automatic renewal':'స్వయంచాలక పునరుద్ధరణ','rent payment':'అద్దె చెల్లింపు','ending agreement':'ఒప్పంద ముగింపు','notice period':'నోటీసు వ్యవధి','repairs maintenance':'మరమ్మతులు మరియు నిర్వహణ','property access':'ఆస్తి ప్రవేశం','utility services':'వినియోగ సేవలు','dispute resolution':'వివాద పరిష్కారం','legal liability':'చట్టపరమైన బాధ్యత','fees penalties':'రుసుములు మరియు జరిమానాలు','subletting rules':'ఉపఅద్దె నియమాలు','agreement registration':'ఒప్పంద నమోదు','independent contractor services':'స్వతంత్ర కాంట్రాక్టర్ సేవలు','scope services':'సేవల పరిధి','payment terms':'చెల్లింపు నిబంధనలు','agreement term':'ఒప్పంద నిబంధన',
  },
  es: {
    'risk summary':'Resumen de riesgo','security deposit':'Depósito de seguridad','automatic renewal':'Renovación automática','rent payment':'Pago del alquiler','ending agreement':'Finalización del acuerdo','notice period':'Plazo de aviso','repairs maintenance':'Reparaciones y mantenimiento','property access':'Acceso a la propiedad','utility services':'Servicios públicos','dispute resolution':'Resolución de disputas','legal liability':'Responsabilidad legal','fees penalties':'Tasas y penalizaciones','subletting rules':'Reglas de subarriendo','agreement registration':'Registro del acuerdo','independent contractor services':'Servicios de contratista independiente','scope services':'Alcance de los servicios','payment terms':'Condiciones de pago','agreement term':'Condición del acuerdo',
  },
};

const sectionWords = {
  en: 'Section', hi: 'अनुभाग', kn: 'ವಿಭಾಗ', ta: 'பிரிவு', te: 'విభాగం', es: 'Sección',
};

export function localizeSourceLabel(label, language = 'en') {
  if (!label || language === 'en') return label;
  const match = label.match(/^Section\s+([\d.]+)\s*[—–-]\s*(.+)$/i);
  const rawTopic = (match?.[2] || label).trim();
  const translated =
    topics[language]?.[rawTopic.toLowerCase()] ||
    topics[language]?.[
      Object.keys(topics.en).find(
        key => topics.en[key].toLowerCase() === rawTopic.toLowerCase(),
      )
    ] ||
    rawTopic;
  return match
    ? `${sectionWords[language]} ${match[1]} — ${translated}`
    : translated;
}
