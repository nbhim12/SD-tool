import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Scenario, Category, CategoryInput, CertificationThreshold, CreditDistributionInput, MandatoryComplianceInput, Credit } from '../types';
import { CERTIFICATION_THRESHOLDS } from '../types';

interface ExportData {
  scenario: Scenario;
  categories: Category[];
  totalPoints: { yes: number; maybe: number; no: number };
  achievedLevel: string | null;
}

const COLORS = {
  primary: [34, 197, 94] as [number, number, number],      // green-500
  secondary: [107, 114, 128] as [number, number, number],  // gray-500
  yes: [34, 197, 94] as [number, number, number],          // green
  maybe: [245, 158, 11] as [number, number, number],       // amber
  no: [156, 163, 175] as [number, number, number],         // gray
  header: [31, 41, 55] as [number, number, number],        // gray-800
};

function getCertificationColor(level: string): [number, number, number] {
  const threshold = CERTIFICATION_THRESHOLDS.find((t: CertificationThreshold) => t.level === level);
  if (!threshold) return COLORS.secondary;
  
  // Convert hex to RGB
  const hex = threshold.color.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function getCategoryPoints(categoryInput: CategoryInput | undefined): { yes: number; maybe: number; no: number } {
  if (!categoryInput) return { yes: 0, maybe: 0, no: 0 };
  
  return categoryInput.creditDistributions.reduce(
    (acc: { yes: number; maybe: number; no: number }, dist: CreditDistributionInput) => ({
      yes: acc.yes + dist.yesPoints,
      maybe: acc.maybe + dist.maybePoints,
      no: acc.no + dist.noPoints,
    }),
    { yes: 0, maybe: 0, no: 0 }
  );
}

export function generatePDF(data: ExportData): void {
  const { scenario, categories, totalPoints, achievedLevel } = data;
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // ============================================
  // HEADER
  // ============================================
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('IGBC Green Homes Certification', margin, 18);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Feasibility Assessment Report', margin, 28);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, 36);

  yPos = 55;

  // ============================================
  // PROJECT INFO
  // ============================================
  doc.setTextColor(...COLORS.header);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Information', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.secondary);
  
  const projectInfo = [
    ['Scenario Name:', scenario.name],
    ['Project Name:', scenario.projectName],
    ['Project Type:', scenario.projectType],
    ['Target Certification:', scenario.targetCertificationLevel.charAt(0).toUpperCase() + scenario.targetCertificationLevel.slice(1)],
  ];

  projectInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 45, yPos);
    yPos += 6;
  });

  yPos += 10;

  // ============================================
  // POINTS SUMMARY
  // ============================================
  doc.setTextColor(...COLORS.header);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Points Summary', margin, yPos);
  yPos += 10;

  // Summary boxes
  const boxWidth = (contentWidth - 20) / 4;
  const boxHeight = 25;
  
  const summaryData = [
    { label: 'Yes (Confirmed)', value: totalPoints.yes, color: COLORS.yes },
    { label: 'Maybe (Potential)', value: totalPoints.maybe, color: COLORS.maybe },
    { label: 'No (Excluded)', value: totalPoints.no, color: COLORS.no },
    { label: 'Total Possible', value: 100, color: COLORS.secondary },
  ];

  summaryData.forEach((item, index) => {
    const x = margin + (index * (boxWidth + 5));
    
    // Box background
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    // Value
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...item.color);
    doc.text(item.value.toString(), x + boxWidth / 2, yPos + 12, { align: 'center' });
    
    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.secondary);
    doc.text(item.label, x + boxWidth / 2, yPos + 20, { align: 'center' });
  });

  yPos += boxHeight + 15;

  // Achieved Level
  if (achievedLevel) {
    const levelColor = getCertificationColor(achievedLevel);
    doc.setFillColor(...levelColor);
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Achieved Level: ${achievedLevel.charAt(0).toUpperCase() + achievedLevel.slice(1)}`,
      pageWidth / 2,
      yPos + 13,
      { align: 'center' }
    );
    yPos += 30;
  } else {
    yPos += 10;
  }

  // ============================================
  // CATEGORY BREAKDOWN
  // ============================================
  doc.setTextColor(...COLORS.header);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Category Breakdown', margin, yPos);
  yPos += 5;

  const categoryTableData = categories.map(cat => {
    const catInput = scenario.categories.find((c: CategoryInput) => c.categoryCode === cat.code);
    const points = getCategoryPoints(catInput);
    const mandatoryMet = catInput?.mandatoryCompliance.filter((m: MandatoryComplianceInput) => m.isCompliant).length ?? 0;
    const totalMandatory = cat.mandatoryRequirements.length;
    
    return [
      cat.code,
      cat.name,
      cat.possiblePoints.toString(),
      points.yes.toString(),
      points.maybe.toString(),
      points.no.toString(),
      `${mandatoryMet}/${totalMandatory}`,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Code', 'Category', 'Max', 'Yes', 'Maybe', 'No', 'Mandatory']],
    body: categoryTableData,
    theme: 'striped',
    headStyles: {
      fillColor: COLORS.header,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 15, halign: 'center', textColor: COLORS.yes },
      4: { cellWidth: 18, halign: 'center', textColor: COLORS.maybe },
      5: { cellWidth: 15, halign: 'center', textColor: COLORS.no },
      6: { cellWidth: 25, halign: 'center' },
    },
    margin: { left: margin, right: margin },
  });

  // @ts-ignore - autoTable adds this property
  yPos = doc.lastAutoTable.finalY + 15;

  // ============================================
  // DETAILED CREDITS BY CATEGORY
  // ============================================
  categories.forEach(category => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const catInput = scenario.categories.find((c: CategoryInput) => c.categoryCode === category.code);

    doc.setTextColor(...COLORS.header);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${category.code} - ${category.name}`, margin, yPos);
    yPos += 8;

    // Credits table
    const creditsData = category.credits.map((credit: Credit) => {
      const dist = catInput?.creditDistributions.find((d: CreditDistributionInput) => d.creditId === credit.id);
      return [
        credit.code,
        credit.name,
        credit.maxPoints.toString(),
        (dist?.yesPoints ?? 0).toString(),
        (dist?.maybePoints ?? 0).toString(),
        (dist?.noPoints ?? 0).toString(),
        dist?.notes || '-',
      ];
    });

    if (creditsData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Code', 'Credit', 'Max', 'Yes', 'Maybe', 'No', 'Notes']],
        body: creditsData,
        theme: 'grid',
        headStyles: {
          fillColor: [229, 231, 235],
          textColor: COLORS.header,
          fontStyle: 'bold',
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 45 },
          2: { cellWidth: 12, halign: 'center' },
          3: { cellWidth: 12, halign: 'center' },
          4: { cellWidth: 14, halign: 'center' },
          5: { cellWidth: 12, halign: 'center' },
          6: { cellWidth: 45 },
        },
        margin: { left: margin, right: margin },
      });

      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 10;
    }
  });

  // ============================================
  // FOOTER
  // ============================================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.secondary);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'IGBC Green Homes Feasibility Tool',
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  const fileName = `${scenario.projectName.replace(/\s+/g, '_')}_${scenario.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
