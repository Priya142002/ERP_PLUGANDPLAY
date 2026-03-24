import type { ReportData, ExcelSheetData } from './reportGenerator';

// =============================================================================
// INVENTORY REPORT DATA GENERATORS
// =============================================================================

/**
 * Generate Inventory Meta Report Data
 */
export const generateInventoryMetaReport = (companyName: string = 'Your Company'): ReportData => {
  return {
    metadata: {
      companyName,
      reportTitle: 'Inventory Meta Report',
      reportType: 'inventory',
      dateRange: 'March 2026'
    },
    sections: [
      {
        title: 'Inventory Overview',
        type: 'stats',
        data: [
          {
            title: 'Active Products',
            value: '1,248',
            trend: '+12.5% Growth',
            description: 'Successfully indexed SKUs'
          },
          {
            title: 'Minimum Level',
            value: '42',
            trend: '8 Attention Items',
            description: 'Approaching safety stock'
          },
          {
            title: 'Reorder Required',
            value: '15',
            trend: 'Critical Priority',
            description: 'Stockouts imminent'
          },
          {
            title: 'Zero Inventory',
            value: '05',
            trend: 'System Depleted',
            description: 'Currently unavailable'
          }
        ]
      },
      {
        title: 'Performance Leaders - Top Products',
        type: 'table',
        data: {
          headers: ['Product Name', 'Category', 'Velocity', 'Units Sold', 'Revenue'],
          rows: [
            ['Premium Headphones', 'Electronics', '+12%', '15', 'Rs. 4,299.00'],
            ['Smart Watch v2', 'Wearables', '+8%', '12', 'Rs. 2,850.50'],
            ['Coffee Maker', 'Appliances', '+5%', '8', 'Rs. 1,599.00'],
            ['Wireless Mouse', 'Accessories', '+15%', '20', 'Rs. 950.00'],
            ['Laptop Stand', 'Accessories', '+3%', '10', 'Rs. 850.00']
          ]
        }
      },
      {
        title: 'Recent Operation Logs',
        type: 'table',
        data: {
          headers: ['Item', 'Action', 'Warehouse', 'Quantity', 'Time'],
          rows: [
            ['Nike Air Max', 'Stock In', 'Main WH', '+50', '10 mins ago'],
            ['iPhone 13 Case', 'Dispatch', 'Sub WH', '-12', '25 mins ago'],
            ['Dell Monitor', 'Transfer', 'Central', '20', '1 hour ago'],
            ['Sony WH-1000XM4', 'Adjustment', 'Main WH', '-2', '2 hours ago']
          ]
        }
      },
      {
        title: 'Summary',
        type: 'text',
        data: 'This inventory meta report provides a comprehensive overview of current stock levels, product performance, and recent warehouse activities. The data indicates healthy inventory turnover with strategic attention needed for 15 products requiring immediate reorder. Performance leaders show strong growth trends, particularly in the accessories category.'
      }
    ]
  };
};

/**
 * Generate Inventory Excel Export Data
 */
export const generateInventoryExcelData = (): ExcelSheetData[] => {
  return [
    {
      sheetName: 'Inventory Summary',
      headers: ['Product Name', 'Category', 'Stock', 'Velocity', 'Revenue', 'Status'],
      data: [
        ['Premium Headphones', 'Electronics', 145, '+12%', 4299.00, 'In Stock'],
        ['Smart Watch v2', 'Wearables', 89, '+8%', 2850.50, 'In Stock'],
        ['Coffee Maker', 'Appliances', 34, '+5%', 1599.00, 'Low Stock'],
        ['Wireless Mouse', 'Accessories', 234, '+15%', 950.00, 'In Stock'],
        ['Laptop Stand', 'Accessories', 67, '+3%', 850.00, 'In Stock'],
        ['USB-C Cable', 'Accessories', 456, '+20%', 299.00, 'In Stock'],
        ['Desk Lamp', 'Furniture', 23, '-2%', 1299.00, 'Low Stock'],
        ['Ergonomic Chair', 'Furniture', 12, '+5%', 8999.00, 'Reorder'],
        ['Bluetooth Speaker', 'Electronics', 178, '+18%', 2499.00, 'In Stock'],
        ['Phone Stand', 'Accessories', 345, '+10%', 399.00, 'In Stock'],
        ['Monitor Arm', 'Accessories', 45, '+7%', 3499.00, 'In Stock'],
        ['Keyboard', 'Electronics', 123, '+9%', 1899.00, 'In Stock'],
        ['Mouse Pad', 'Accessories', 567, '+25%', 199.00, 'In Stock'],
        ['Webcam HD', 'Electronics', 8, '-5%', 4599.00, 'Reorder'],
        ['Microphone', 'Electronics', 34, '+12%', 3299.00, 'Low Stock']
      ]
    },
    {
      sheetName: 'Low Stock Alerts',
      headers: ['Product Name', 'Current Stock', 'Minimum Level', 'Reorder Quantity', 'Priority'],
      data: [
        ['Coffee Maker', 34, 50, 100, 'Medium'],
        ['Desk Lamp', 23, 30, 50, 'Medium'],
        ['Ergonomic Chair', 12, 20, 30, 'High'],
        ['Webcam HD', 8, 15, 25, 'High'],
        ['Microphone', 34, 40, 50, 'Low']
      ]
    },
    {
      sheetName: 'Recent Activities',
      headers: ['Date', 'Item', 'Action', 'Warehouse', 'Quantity', 'User'],
      data: [
        ['2026-03-24 10:30', 'Nike Air Max', 'Stock In', 'Main WH', 50, 'Admin'],
        ['2026-03-24 10:05', 'iPhone 13 Case', 'Dispatch', 'Sub WH', -12, 'Admin'],
        ['2026-03-24 09:15', 'Dell Monitor', 'Transfer', 'Central', 20, 'Manager'],
        ['2026-03-24 08:45', 'Sony WH-1000XM4', 'Adjustment', 'Main WH', -2, 'Admin'],
        ['2026-03-23 16:20', 'Laptop Stand', 'Stock In', 'Main WH', 30, 'Admin'],
        ['2026-03-23 15:10', 'Wireless Mouse', 'Dispatch', 'Sub WH', -45, 'Manager'],
        ['2026-03-23 14:30', 'USB-C Cable', 'Stock In', 'Central', 100, 'Admin']
      ]
    }
  ];
};
