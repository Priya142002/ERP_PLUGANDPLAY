import type { ReportData, ExcelSheetData } from './reportGenerator';

// =============================================================================
// SALES REPORT DATA GENERATORS
// =============================================================================

/**
 * Generate Sales Meta Report Data
 */
export const generateSalesMetaReport = (companyName: string = 'Your Company'): ReportData => {
  return {
    metadata: {
      companyName,
      reportTitle: 'Sales Meta Report',
      reportType: 'sales',
      dateRange: 'March 2026'
    },
    sections: [
      {
        title: 'Sales Overview',
        type: 'stats',
        data: [
          {
            title: 'Total Revenue',
            value: '₹2,45,680',
            trend: '+15.8% Growth',
            description: 'Gross sales revenue'
          },
          {
            title: 'Orders Completed',
            value: '342',
            trend: '+22 Orders',
            description: 'Successfully fulfilled'
          },
          {
            title: 'Active Customers',
            value: '156',
            trend: '+12 New',
            description: 'Engaged customer base'
          },
          {
            title: 'Average Order Value',
            value: '₹718',
            trend: '+8.2% Rise',
            description: 'Per transaction average'
          }
        ]
      },
      {
        title: 'Top Selling Products',
        type: 'table',
        data: {
          headers: ['Product Name', 'Category', 'Units Sold', 'Revenue', 'Growth'],
          rows: [
            ['Premium Headphones', 'Electronics', '145', '₹62,355', '+18%'],
            ['Smart Watch v2', 'Wearables', '89', '₹25,374', '+12%'],
            ['Wireless Mouse', 'Accessories', '234', '₹22,230', '+25%'],
            ['Bluetooth Speaker', 'Electronics', '178', '₹44,482', '+20%'],
            ['Laptop Stand', 'Accessories', '67', '₹5,695', '+8%']
          ]
        }
      },
      {
        title: 'Customer Segments',
        type: 'table',
        data: {
          headers: ['Segment', 'Customers', 'Revenue', 'Avg. Order', 'Retention'],
          rows: [
            ['Premium', '45', '₹98,450', '₹2,188', '92%'],
            ['Regular', '78', '₹89,230', '₹1,144', '85%'],
            ['New', '33', '₹58,000', '₹1,758', 'N/A']
          ]
        }
      },
      {
        title: 'Sales Channels Performance',
        type: 'list',
        data: [
          'Online Store: 55% (₹1,35,124) - Primary revenue channel',
          'Retail POS: 30% (₹73,704) - In-store transactions',
          'Mobile App: 10% (₹24,568) - Growing channel',
          'Partner Network: 5% (₹12,284) - B2B sales'
        ]
      },
      {
        title: 'Summary',
        type: 'text',
        data: 'Sales performance for March 2026 shows strong growth with total revenue of ₹2,45,680, representing a 15.8% increase from the previous period. The customer base expanded by 12 new active customers, bringing the total to 156. Average order value increased by 8.2% to ₹718, indicating improved sales quality. Online channels continue to dominate with 55% of total revenue, while the mobile app shows promising growth potential.'
      }
    ]
  };
};

/**
 * Generate Sales Excel Export Data
 */
export const generateSalesExcelData = (): ExcelSheetData[] => {
  return [
    {
      sheetName: 'Sales Summary',
      headers: ['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total', 'Status'],
      data: [
        ['SO-2026-001', '2026-03-24', 'Rajesh Kumar', 'Premium Headphones', 2, 4299.00, 8598.00, 'Completed'],
        ['SO-2026-002', '2026-03-24', 'Priya Sharma', 'Smart Watch v2', 1, 2850.50, 2850.50, 'Completed'],
        ['SO-2026-003', '2026-03-23', 'Amit Patel', 'Wireless Mouse', 5, 950.00, 4750.00, 'Completed'],
        ['SO-2026-004', '2026-03-23', 'Sunita Reddy', 'Bluetooth Speaker', 3, 2499.00, 7497.00, 'Pending'],
        ['SO-2026-005', '2026-03-22', 'Vikram Singh', 'Laptop Stand', 2, 850.00, 1700.00, 'Completed'],
        ['SO-2026-006', '2026-03-22', 'Neha Gupta', 'USB-C Cable', 10, 299.00, 2990.00, 'Completed'],
        ['SO-2026-007', '2026-03-21', 'Arjun Mehta', 'Desk Lamp', 1, 1299.00, 1299.00, 'Completed'],
        ['SO-2026-008', '2026-03-21', 'Kavita Desai', 'Keyboard', 2, 1899.00, 3798.00, 'Completed'],
        ['SO-2026-009', '2026-03-20', 'Rohit Verma', 'Mouse Pad', 8, 199.00, 1592.00, 'Completed'],
        ['SO-2026-010', '2026-03-20', 'Anjali Nair', 'Webcam HD', 1, 4599.00, 4599.00, 'Shipped']
      ]
    },
    {
      sheetName: 'Customer Analysis',
      headers: ['Customer Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Last Order', 'Segment'],
      data: [
        ['Rajesh Kumar', 'rajesh@email.com', '+91-9876543210', 12, 45680.00, '2026-03-24', 'Premium'],
        ['Priya Sharma', 'priya@email.com', '+91-9876543211', 8, 28450.00, '2026-03-24', 'Regular'],
        ['Amit Patel', 'amit@email.com', '+91-9876543212', 15, 52340.00, '2026-03-23', 'Premium'],
        ['Sunita Reddy', 'sunita@email.com', '+91-9876543213', 6, 18900.00, '2026-03-23', 'Regular'],
        ['Vikram Singh', 'vikram@email.com', '+91-9876543214', 3, 8450.00, '2026-03-22', 'New'],
        ['Neha Gupta', 'neha@email.com', '+91-9876543215', 9, 34560.00, '2026-03-22', 'Regular'],
        ['Arjun Mehta', 'arjun@email.com', '+91-9876543216', 2, 5680.00, '2026-03-21', 'New'],
        ['Kavita Desai', 'kavita@email.com', '+91-9876543217', 11, 42890.00, '2026-03-21', 'Premium'],
        ['Rohit Verma', 'rohit@email.com', '+91-9876543218', 7, 23450.00, '2026-03-20', 'Regular'],
        ['Anjali Nair', 'anjali@email.com', '+91-9876543219', 4, 12340.00, '2026-03-20', 'Regular']
      ]
    },
    {
      sheetName: 'Product Performance',
      headers: ['Product Name', 'Category', 'Units Sold', 'Revenue', 'Cost', 'Profit', 'Margin %'],
      data: [
        ['Premium Headphones', 'Electronics', 145, 62355.00, 43448.50, 18906.50, '30.3%'],
        ['Smart Watch v2', 'Wearables', 89, 25374.00, 17761.80, 7612.20, '30.0%'],
        ['Wireless Mouse', 'Accessories', 234, 22230.00, 15561.00, 6669.00, '30.0%'],
        ['Bluetooth Speaker', 'Electronics', 178, 44482.00, 31137.40, 13344.60, '30.0%'],
        ['Laptop Stand', 'Accessories', 67, 5695.00, 3986.50, 1708.50, '30.0%'],
        ['USB-C Cable', 'Accessories', 456, 13644.00, 9550.80, 4093.20, '30.0%'],
        ['Desk Lamp', 'Furniture', 23, 2987.00, 2090.90, 896.10, '30.0%'],
        ['Keyboard', 'Electronics', 123, 23357.00, 16349.90, 7007.10, '30.0%'],
        ['Mouse Pad', 'Accessories', 567, 11283.00, 7898.10, 3384.90, '30.0%'],
        ['Webcam HD', 'Electronics', 34, 15637.00, 10945.90, 4691.10, '30.0%']
      ]
    },
    {
      sheetName: 'Channel Performance',
      headers: ['Channel', 'Orders', 'Revenue', 'Percentage', 'Avg Order Value', 'Growth'],
      data: [
        ['Online Store', 188, 135124.00, '55%', 718.75, '+18%'],
        ['Retail POS', 103, 73704.00, '30%', 715.57, '+12%'],
        ['Mobile App', 34, 24568.00, '10%', 722.59, '+25%'],
        ['Partner Network', 17, 12284.00, '5%', 722.59, '+8%']
      ]
    }
  ];
};
