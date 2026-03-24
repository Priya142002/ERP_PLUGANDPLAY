import type { ReportData, ExcelSheetData } from './reportGenerator';

// =============================================================================
// PURCHASE REPORT DATA GENERATORS
// =============================================================================

/**
 * Generate Purchase Meta Report Data
 */
export const generatePurchaseMetaReport = (companyName: string = 'Your Company'): ReportData => {
  return {
    metadata: {
      companyName,
      reportTitle: 'Purchase Meta Report',
      reportType: 'purchase',
      dateRange: 'March 2026'
    },
    sections: [
      {
        title: 'Purchase Overview',
        type: 'stats',
        data: [
          {
            title: 'Procurement Capital',
            value: '₹1,24,500',
            trend: '+8.4% Rise',
            description: 'Gross purchase expenditure'
          },
          {
            title: 'Strategic Vendors',
            value: '48',
            trend: '+2 Active',
            description: 'Qualified supplier base'
          },
          {
            title: 'Capital Outflow',
            value: '₹12,380',
            trend: '-5.2% Drop',
            description: 'Pending settlements'
          },
          {
            title: 'Doc Compliance',
            value: '156',
            trend: '+12% Vol',
            description: 'Verified monthly invoices'
          }
        ]
      },
      {
        title: 'Recent Purchase Invoices',
        type: 'table',
        data: {
          headers: ['Invoice No.', 'Vendor', 'Date', 'Amount', 'Status'],
          rows: [
            ['PINV-2026-001', 'TechNova Solutions', '2026-03-16', '₹4,200.00', 'Settled'],
            ['PINV-2026-002', 'Global Logistics', '2026-03-15', '₹1,850.50', 'Pending'],
            ['PINV-2026-003', 'Office Essentials', '2026-03-14', '₹850.00', 'Settled'],
            ['PINV-2026-004', 'Vertex Industries', '2026-03-14', '₹12,400.00', 'Partial'],
            ['PINV-2026-005', 'Pure Water Co.', '2026-03-13', '₹120.00', 'Settled']
          ]
        }
      },
      {
        title: 'Vendor Performance',
        type: 'table',
        data: {
          headers: ['Vendor Name', 'Total Orders', 'Total Amount', 'On-Time Delivery', 'Rating'],
          rows: [
            ['TechNova Solutions', '24', '₹98,450', '95%', '4.8/5'],
            ['Global Logistics', '18', '₹45,230', '88%', '4.5/5'],
            ['Office Essentials', '32', '₹28,900', '92%', '4.6/5'],
            ['Vertex Industries', '12', '₹156,780', '90%', '4.7/5'],
            ['Pure Water Co.', '45', '₹5,400', '98%', '4.9/5']
          ]
        }
      },
      {
        title: 'Procurement Category Breakdown',
        type: 'list',
        data: [
          'Raw Materials: 65% (₹80,925) - Primary procurement focus',
          'Finished Goods: 20% (₹24,900) - Ready-to-sell inventory',
          'Critical Supplies: 10% (₹12,450) - Operational essentials',
          'Cloud Services: 5% (₹6,225) - Digital infrastructure'
        ]
      },
      {
        title: 'Summary',
        type: 'text',
        data: 'The purchase operations for March 2026 demonstrate efficient procurement management with a total capital deployment of ₹1,24,500 across 48 strategic vendors. Document compliance remains at 100% with all 156 invoices properly verified. The pending settlements have decreased by 5.2%, indicating improved cash flow management. Vendor performance metrics show strong on-time delivery rates averaging 92.6% across all suppliers.'
      }
    ]
  };
};

/**
 * Generate Purchase Excel Export Data
 */
export const generatePurchaseExcelData = (): ExcelSheetData[] => {
  return [
    {
      sheetName: 'Purchase Invoices',
      headers: ['Invoice No.', 'Vendor', 'Date', 'Amount', 'Tax', 'Total', 'Status', 'Payment Terms'],
      data: [
        ['PINV-2026-001', 'TechNova Solutions', '2026-03-16', 4200.00, 756.00, 4956.00, 'Settled', 'Net 30'],
        ['PINV-2026-002', 'Global Logistics', '2026-03-15', 1850.50, 333.09, 2183.59, 'Pending', 'Net 15'],
        ['PINV-2026-003', 'Office Essentials', '2026-03-14', 850.00, 153.00, 1003.00, 'Settled', 'Net 30'],
        ['PINV-2026-004', 'Vertex Industries', '2026-03-14', 12400.00, 2232.00, 14632.00, 'Partial', 'Net 45'],
        ['PINV-2026-005', 'Pure Water Co.', '2026-03-13', 120.00, 21.60, 141.60, 'Settled', 'Net 7'],
        ['PINV-2026-006', 'TechNova Solutions', '2026-03-12', 3500.00, 630.00, 4130.00, 'Settled', 'Net 30'],
        ['PINV-2026-007', 'Office Essentials', '2026-03-11', 1250.00, 225.00, 1475.00, 'Settled', 'Net 30'],
        ['PINV-2026-008', 'Global Logistics', '2026-03-10', 2800.00, 504.00, 3304.00, 'Pending', 'Net 15'],
        ['PINV-2026-009', 'Vertex Industries', '2026-03-09', 8900.00, 1602.00, 10502.00, 'Settled', 'Net 45'],
        ['PINV-2026-010', 'Pure Water Co.', '2026-03-08', 120.00, 21.60, 141.60, 'Settled', 'Net 7']
      ]
    },
    {
      sheetName: 'Vendor Summary',
      headers: ['Vendor Name', 'Contact Person', 'Email', 'Phone', 'Total Orders', 'Total Amount', 'Outstanding', 'Rating'],
      data: [
        ['TechNova Solutions', 'Rajesh Kumar', 'rajesh@technova.com', '+91-9876543210', 24, 98450.00, 0, '4.8/5'],
        ['Global Logistics', 'Priya Sharma', 'priya@globallog.com', '+91-9876543211', 18, 45230.00, 2183.59, '4.5/5'],
        ['Office Essentials', 'Amit Patel', 'amit@officeess.com', '+91-9876543212', 32, 28900.00, 0, '4.6/5'],
        ['Vertex Industries', 'Sunita Reddy', 'sunita@vertex.com', '+91-9876543213', 12, 156780.00, 14632.00, '4.7/5'],
        ['Pure Water Co.', 'Vikram Singh', 'vikram@purewater.com', '+91-9876543214', 45, 5400.00, 0, '4.9/5']
      ]
    },
    {
      sheetName: 'Payment Status',
      headers: ['Invoice No.', 'Vendor', 'Invoice Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Days Overdue'],
      data: [
        ['PINV-2026-001', 'TechNova Solutions', '2026-03-16', '2026-04-15', 4956.00, 4956.00, 0, 0],
        ['PINV-2026-002', 'Global Logistics', '2026-03-15', '2026-03-30', 2183.59, 0, 2183.59, 0],
        ['PINV-2026-003', 'Office Essentials', '2026-03-14', '2026-04-13', 1003.00, 1003.00, 0, 0],
        ['PINV-2026-004', 'Vertex Industries', '2026-03-14', '2026-04-28', 14632.00, 7316.00, 7316.00, 0],
        ['PINV-2026-005', 'Pure Water Co.', '2026-03-13', '2026-03-20', 141.60, 141.60, 0, 0]
      ]
    },
    {
      sheetName: 'Category Analysis',
      headers: ['Category', 'Number of Orders', 'Total Amount', 'Percentage', 'Average Order Value'],
      data: [
        ['Raw Materials', 45, 80925.00, '65%', 1798.33],
        ['Finished Goods', 28, 24900.00, '20%', 889.29],
        ['Critical Supplies', 18, 12450.00, '10%', 691.67],
        ['Cloud Services', 12, 6225.00, '5%', 518.75]
      ]
    }
  ];
};
