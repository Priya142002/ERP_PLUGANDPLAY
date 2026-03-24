import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// =============================================================================
// TYPES
// =============================================================================

export interface ReportMetadata {
  companyName: string;
  reportTitle: string;
  reportType: 'inventory' | 'purchase' | 'sales' | 'accounts' | 'general';
  generatedBy?: string;
  dateRange?: string;
}

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface ReportSection {
  title: string;
  type: 'stats' | 'table' | 'text' | 'list';
  data: StatCard[] | TableData | string | string[];
}

export interface ReportData {
  metadata: ReportMetadata;
  sections: ReportSection[];
}

// =============================================================================
// PDF GENERATION UTILITIES
// =============================================================================

/**
 * Generate a formatted date string for file naming
 */
export const getFormattedDate = (): string => {
  const date = new Date();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month}_${year}`;
};

/**
 * Generate a formatted date-time string for display
 */
export const getFormattedDateTime = (): string => {
  const date = new Date();
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Generate PDF report from structured data
 */
export const generatePDFReport = (reportData: ReportData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header Section
  doc.setFillColor(0, 33, 71); // #002147
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(reportData.metadata.companyName, pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(reportData.metadata.reportTitle, pageWidth / 2, 28, { align: 'center' });

  yPosition = 50;

  // Date & Time
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${getFormattedDateTime()}`, 14, yPosition);
  
  if (reportData.metadata.generatedBy) {
    doc.text(`By: ${reportData.metadata.generatedBy}`, pageWidth - 14, yPosition, { align: 'right' });
  }

  yPosition += 15;

  // Render Sections
  reportData.sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Section Title
    doc.setTextColor(0, 33, 71);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 14, yPosition);
    yPosition += 8;

    // Render based on section type
    switch (section.type) {
      case 'stats':
        renderStatsSection(doc, section.data as StatCard[], yPosition, pageWidth);
        yPosition += Math.ceil((section.data as StatCard[]).length / 2) * 25 + 10;
        break;

      case 'table':
        const tableData = section.data as TableData;
        autoTable(doc, {
          startY: yPosition,
          head: [tableData.headers],
          body: tableData.rows,
          theme: 'grid',
          headStyles: {
            fillColor: [0, 33, 71],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [50, 50, 50]
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250]
          },
          margin: { left: 14, right: 14 }
        });
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        break;

      case 'text':
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(section.data as string, pageWidth - 28);
        doc.text(textLines, 14, yPosition);
        yPosition += textLines.length * 6 + 10;
        break;

      case 'list':
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        (section.data as string[]).forEach((item) => {
          doc.text(`• ${item}`, 18, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
        break;
    }
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `${reportData.metadata.reportType.toUpperCase()} REPORT`,
      14,
      pageHeight - 10
    );
    doc.text(
      getFormattedDate(),
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Download PDF
  const fileName = `${reportData.metadata.reportType}_Report_${getFormattedDate()}.pdf`;
  doc.save(fileName);
};

/**
 * Render stats cards in PDF
 */
const renderStatsSection = (
  doc: jsPDF,
  stats: StatCard[],
  startY: number,
  pageWidth: number
): void => {
  const cardWidth = (pageWidth - 42) / 2; // 2 columns with margins
  const cardHeight = 20;
  let xPosition = 14;
  let yPosition = startY;

  stats.forEach((stat, index) => {
    if (index > 0 && index % 2 === 0) {
      yPosition += cardHeight + 5;
      xPosition = 14;
    }

    // Card background
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(xPosition, yPosition, cardWidth, cardHeight, 2, 2, 'F');

    // Card border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPosition, yPosition, cardWidth, cardHeight, 2, 2, 'S');

    // Title
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.title.toUpperCase(), xPosition + 3, yPosition + 5);

    // Value
    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(String(stat.value), xPosition + 3, yPosition + 12);

    // Trend or Description
    if (stat.trend) {
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(stat.trend, xPosition + 3, yPosition + 17);
    }

    xPosition += cardWidth + 14;
  });
};

// =============================================================================
// EXCEL GENERATION UTILITIES
// =============================================================================

export interface ExcelSheetData {
  sheetName: string;
  headers: string[];
  data: (string | number)[][];
}

/**
 * Export data to Excel format
 */
export const exportToExcel = (
  data: ExcelSheetData[],
  fileName: string
): void => {
  const workbook = XLSX.utils.book_new();

  data.forEach((sheet) => {
    // Create worksheet from data
    const worksheetData = [sheet.headers, ...sheet.data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const columnWidths = sheet.headers.map((header) => ({
      wch: Math.max(header.length, 15)
    }));
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });

  // Generate file name
  const formattedFileName = `${fileName}_${getFormattedDate()}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, formattedFileName);
};

/**
 * Simple export for single sheet
 */
export const exportSingleSheetToExcel = (
  headers: string[],
  data: (string | number)[][],
  fileName: string
): void => {
  exportToExcel(
    [
      {
        sheetName: 'Data',
        headers,
        data
      }
    ],
    fileName
  );
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format currency for reports
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number | string): string => {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  return numValue.toLocaleString('en-IN');
};

/**
 * Clean data for export (remove special characters, format properly)
 */
export const cleanDataForExport = (value: any): string | number => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  
  // Remove currency symbols and format
  const cleaned = String(value).replace(/[₹$,]/g, '').trim();
  const asNumber = parseFloat(cleaned);
  
  return isNaN(asNumber) ? cleaned : asNumber;
};
