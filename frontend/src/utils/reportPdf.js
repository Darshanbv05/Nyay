import { jsPDF } from 'jspdf';
import { deriveHiddenCosts } from './hiddenCostFallback.js';
import { derivePenalties } from './penaltyFallback.js';

const PAGE = {
  width: 210,
  height: 297,
  left: 16,
  right: 16,
  top: 22,
  bottom: 20,
};

const clean = value =>
  String(value ?? '')
    .replace(/\u2014|\u2013/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

const list = value => (Array.isArray(value) ? value.filter(Boolean) : []);

export function downloadCompleteReport(report) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const usableWidth = PAGE.width - PAGE.left - PAGE.right;
  let y = PAGE.top;

  const newPage = () => {
    doc.addPage();
    y = PAGE.top;
  };

  const ensureSpace = height => {
    if (y + height > PAGE.height - PAGE.bottom) newPage();
  };

  const write = (
    value,
    { size = 10, color = [54, 71, 75], bold = false, indent = 0, gap = 2 } = {},
  ) => {
    const text = clean(value);
    if (!text) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, usableWidth - indent);
    const lineHeight = size * 0.42;
    let remaining = [...lines];

    while (remaining.length) {
      let availableHeight = PAGE.height - PAGE.bottom - y;
      if (availableHeight < lineHeight) {
        newPage();
        availableHeight = PAGE.height - PAGE.bottom - y;
      }
      const linesThatFit = Math.max(1, Math.floor(availableHeight / lineHeight));
      const pageLines = remaining.splice(0, linesThatFit);
      doc.text(pageLines, PAGE.left + indent, y);
      y += pageLines.length * lineHeight;

      if (remaining.length) newPage();
    }

    y += gap;
  };

  const heading = (number, title) => {
    ensureSpace(18);
    y += 4;
    doc.setFillColor(18, 59, 67);
    doc.roundedRect(PAGE.left, y - 5, 10, 10, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(number), PAGE.left + 5, y + 1.4, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(18, 59, 67);
    doc.text(clean(title), PAGE.left + 15, y + 2);
    y += 12;
  };

  const subheading = title => {
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(18, 59, 67);
    doc.text(clean(title), PAGE.left, y);
    y += 7;
  };

  const labelValue = (label, value, indent = 0) => {
    const text = clean(value);
    if (!text) return;
    write(`${label}: ${text}`, { bold: false, indent });
  };

  const bullets = (items, indent = 4) => {
    list(items).forEach(item => write(`- ${item}`, { indent }));
  };

  const divider = () => {
    ensureSpace(5);
    doc.setDrawColor(215, 221, 217);
    doc.line(PAGE.left, y, PAGE.width - PAGE.right, y);
    y += 5;
  };

  // Cover and report overview
  doc.setFillColor(18, 59, 67);
  doc.rect(0, 0, PAGE.width, 48, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('NYAY REPORT', PAGE.left, 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Complete agreement examination', PAGE.left, 32);
  y = 61;

  const clauses = list(report.clauses);
  const flagged = clauses.filter(clause => clause.flagged).length;
  labelValue('Document type', clean(report.document_type).replace(/_/g, ' '));
  labelValue('Overall risk', clean(report.overall_risk).toUpperCase());
  labelValue('Clauses examined', clauses.length);
  labelValue('Clauses needing attention', flagged);
  if (report.negotiation_power_score != null) {
    labelValue(
      'Negotiation power',
      `${report.negotiation_power_score}/100${
        report.score_label ? ` - ${report.score_label}` : ''
      }`,
    );
  }

  heading(1, 'Agreement summary');
  write(report.summary || 'No summary was generated.', { size: 11 });

  heading(2, 'Jurisdiction');
  labelValue('Detected jurisdiction', report.jurisdiction?.name || 'Not specified');
  write(
    report.jurisdiction?.note ||
      'The agreement does not clearly specify the governing jurisdiction.',
  );

  heading(3, 'Timeline and notice periods');
  const events = list(report.timeline_events);
  if (!events.length) {
    write('No clear timeline or notice period was detected.');
  } else {
    events.forEach((event, index) => {
      subheading(`${index + 1}. ${event.label || 'Timeline event'}`);
      labelValue(
        'Date or duration',
        event.iso_date || event.duration_value || event.day_of_period,
        4,
      );
      labelValue('Event type', clean(event.event_type).replace(/_/g, ' '), 4);
      write(event.source_excerpt, { indent: 4 });
    });
  }

  heading(4, 'Rights violation heat index');
  const heat = report.rights_heat_index || {};
  labelValue('Score', heat.score != null ? `${heat.score}/100` : 'Not available');
  labelValue('Severity', heat.severity);
  labelValue('Potential violations', heat.violations);
  Object.entries(heat.breakdown || {}).forEach(([category, count]) => {
    labelValue(clean(category).replace(/_/g, ' '), count, 4);
  });

  heading(5, 'Applicable laws and rules');
  const laws = list(report.applicable_laws);
  if (!laws.length) {
    write('No legal reference was activated by the matched rules.');
  } else {
    laws.forEach((law, index) => {
      subheading(`${index + 1}. ${law.law_name || 'Legal reference'}`);
      labelValue(
        'Status',
        law.verification_status === 'research'
          ? 'Verification needed'
          : 'Applicable reference',
        4,
      );
      write(law.why_relevant, { indent: 4 });
      bullets(law.matched_topics, 8);
    });
  }

  heading(6, 'Complete clause-by-clause review');
  clauses.forEach((clause, index) => {
    ensureSpace(38);
    subheading(
      `${index + 1}. ${clause.source_label || clause.clause_id || 'Agreement clause'}`,
    );
    labelValue(
      'Assessment',
      `${clause.flagged ? 'Needs attention' : 'No issue detected'}${
        clause.risk_level ? ` - ${clause.risk_level} risk` : ''
      }`,
      4,
    );

    const ruleId =
      clause.matched_rule_id ||
      clause.penalty_rule_id ||
      clause.obligation_rule_id;
    if (ruleId) {
      labelValue('Review reason', clean(ruleId).replace(/[_-]+/g, ' '), 4);
    }

    write('Simplified explanation', {
      bold: true,
      color: [8, 125, 117],
      indent: 4,
    });
    bullets(
      clause.plain_explanation_points?.length
        ? clause.plain_explanation_points
        : [clause.plain_explanation],
      8,
    );

    if (list(clause.applicant_obligations).length) {
      write(clause.applicant_label || 'Applicant obligations', {
        bold: true,
        indent: 4,
      });
      bullets(clause.applicant_obligations, 8);
    }
    if (list(clause.recipient_obligations).length) {
      write(clause.recipient_label || 'Recipient obligations', {
        bold: true,
        indent: 4,
      });
      bullets(clause.recipient_obligations, 8);
    }

    if (clause.suggested_action) {
      labelValue('Suggested negotiation', clause.suggested_action, 4);
    }
    if (clause.legal_basis) {
      labelValue('Legal basis', clause.legal_basis, 4);
    }
    if (clause.legal_basis_explanation) {
      write(clause.legal_basis_explanation, { indent: 4 });
    }

    write('Original examined text', {
      bold: true,
      color: [8, 125, 117],
      indent: 4,
    });
    write(clause.original_text, { size: 9, color: [80, 96, 99], indent: 8 });
    divider();
  });

  heading(7, 'Penalties and compensation');
  let penaltyCount = 0;
  clauses.forEach(clause => {
    const fallback = derivePenalties(clause);
    const penalties = clause.penalty_items?.length
      ? clause.penalty_items
      : fallback.penalty_items;
    const compensation = clause.compensation_items?.length
      ? clause.compensation_items
      : fallback.compensation_items;

    [...penalties, ...compensation].forEach(item => {
      penaltyCount += 1;
      subheading(
        `${penaltyCount}. ${clause.source_label || clause.clause_id || 'Clause'}`,
      );
      labelValue('Trigger', item.trigger, 4);
      labelValue('Consequence', item.consequence, 4);
      labelValue(
        'Fairness check',
        clause.penalty_fairness ||
          fallback.penalty_fairness ||
          'Check whether this consequence is clear, mutual, capped, and proportionate.',
        4,
      );
    });
  });
  if (!penaltyCount) write('No penalties or compensation were detected.');

  heading(8, 'Hidden costs');
  let hiddenCostCount = 0;
  clauses.forEach(clause => {
    const costs = clause.hidden_costs?.length
      ? clause.hidden_costs
      : deriveHiddenCosts(clause);
    costs.forEach(cost => {
      hiddenCostCount += 1;
      subheading(
        `${hiddenCostCount}. ${cost.label || clause.source_label || 'Potential cost'}`,
      );
      labelValue('Source section', clause.source_label, 4);
      labelValue('Matched wording', cost.matched_term, 4);
      labelValue(
        'Detected amount',
        list(cost.amounts).length ? cost.amounts.join(', ') : 'No amount stated',
        4,
      );
      write(cost.warning, { indent: 4 });
    });
  });
  if (!hiddenCostCount) write('No hidden-cost pattern was detected.');

  heading(9, 'Negotiation letter');
  write(
    report.negotiation_letter ||
      'No negotiation letter was generated for this agreement.',
    { size: 10 },
  );

  heading(10, 'Legal help');
  const contacts = list(report.legal_aid_contacts);
  if (!contacts.length) {
    write('No legal-help contacts were included.');
  } else {
    contacts.forEach((contact, index) => {
      subheading(`${index + 1}. ${contact.name || 'Legal-help organization'}`);
      write(contact.helps_with, { indent: 4 });
      labelValue('Contact', contact.contact_method, 4);
    });
  }

  heading(11, 'Important disclaimer');
  write(
    report.disclaimer ||
      'This report is informational and is not a substitute for legal advice.',
    { size: 10, color: [102, 83, 29] },
  );

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(215, 221, 217);
    doc.line(PAGE.left, 284, PAGE.width - PAGE.right, 284);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(105, 121, 123);
    doc.text('NYAY - Complete agreement examination', PAGE.left, 290);
    doc.text(`Page ${page} of ${pageCount}`, PAGE.width - PAGE.right, 290, {
      align: 'right',
    });
  }

  doc.save('nyay-complete-report.pdf');
}
