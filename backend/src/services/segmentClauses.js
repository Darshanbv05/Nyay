export function segmentByPattern(text) {
  const normalized = text.trim();
  const numbered = normalized.split(/\n(?=(?:clause\s+)?\d+(?:\.\d+)*[.):\-]\s+)/i).map(s => s.trim()).filter(Boolean);
  if (numbered.length > 1) return numbered;
  return normalized.split(/\n\s*\n|(?<=[.;])\s+(?=[A-Z][A-Za-z ]{2,30}:)/).map(s => s.trim()).filter(s => s.length > 20);
}
export async function segmentClauses(text, llmSegmenter) {
  const local = segmentByPattern(text);
  if (local.length > 1 || !llmSegmenter) return local.length ? local : [text];
  try { return await llmSegmenter(text); } catch { return [text]; }
}
const topicPatterns = [[/overall\s+risk|flagged\s+clause|risk\s+level/i,'Risk summary'],[/security\s+deposit|refundable\s+deposit/i,'Security deposit'],[/automatic\s+renew|renewal/i,'Automatic renewal'],[/rent\s+(?:payment|amount|due)|monthly\s+rent/i,'Rent payment'],[/termination|terminate|vacate|evict/i,'Ending agreement'],[/notice\s+period|written\s+notice/i,'Notice period'],[/repair|maintenance/i,'Repairs maintenance'],[/landlord\s+entry|enter\s+the\s+premises|access\s+to\s+premises/i,'Property access'],[/electricity|water|utilit/i,'Utility services'],[/arbitration|dispute|court|legal\s+remed/i,'Dispute resolution'],[/liability|indemnif|hold\s+harmless/i,'Legal liability'],[/late\s+fee|penalty|interest\s+on\s+unpaid/i,'Fees penalties'],[/sublet|subletting/i,'Subletting rules'],[/registration|registered\s+agreement/i,'Agreement registration']];
const shortTopic=text=>{const matched=topicPatterns.find(([pattern])=>pattern.test(text));if(matched)return matched[1];const words=text.replace(/^(?:(?:clause|section)\s+)?\d+(?:\.\d+)*[.):\-]?\s*/i,'').replace(/[^A-Za-z0-9\s]/g,' ').split(/\s+/).filter(word=>word.length>2&&!/^(the|and|for|this|that|shall|with|from|into|agreement|clause|section)$/i.test(word)).slice(0,3);return words.length?words.map(word=>word[0].toUpperCase()+word.slice(1).toLowerCase()).join(' '):'Agreement term'};
export function describeSourceSection(clause) {
  const compact=clause.replace(/\s+/g,' ').trim();
  const numbered=compact.match(/^(?:(?:clause|section)\s+)?(\d+(?:\.\d+)*)[.):\-]?\s*([A-Z][A-Z /&-]{2,50}|[A-Z][A-Za-z /&-]{2,50}:)/);
  if(numbered)return{source_label:`Section ${numbered[1]} — ${shortTopic(numbered[2])}`,source_excerpt:compact.slice(0,140)};
  const heading=compact.match(/^([A-Z][A-Z /&-]{3,60})(?=\s|:)/);
  if(heading)return{source_label:shortTopic(heading[1]),source_excerpt:compact.slice(0,140)};
  return{source_label:shortTopic(compact),source_excerpt:compact.slice(0,140)};
}
