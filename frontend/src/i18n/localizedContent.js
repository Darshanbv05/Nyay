const scripts = {
  hi: /[\u0900-\u097f]/,
  kn: /[\u0c80-\u0cff]/,
  ta: /[\u0b80-\u0bff]/,
  te: /[\u0c00-\u0c7f]/,
};

export function localizedPoints(points = [], language = 'en') {
  const values = points.filter(Boolean);
  const script = scripts[language];
  if (!script) return values;
  const translated = values.filter(value => script.test(String(value)));
  return translated.length ? translated : values.slice(0, 1);
}
