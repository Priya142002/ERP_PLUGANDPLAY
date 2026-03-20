export { default as AdminDashboardPage } from './DashboardPage';
export { default as SubscriptionPage } from './SubscriptionPage';
export { default as ModulesPage } from './ModulesPage';
export { default as SettingsPage } from './SettingsPage';
export * from './PageTemplate';

// Inventory
export * from './inventory/InventoryDashboard';
export * from './inventory/ProductsPage';
export * from './inventory/AddProductPage';
export * from './inventory/MaterialDispatchPage';
export * from './inventory/StockTransferPage';
export * from './inventory/ProductReceivePage';
export * from './inventory/OpeningStockPage';
export * from './inventory/CategoriesPage';
export * from './inventory/BrandsPage';
export * from './inventory/UnitsPage';
export * from './inventory/WarehousePage';
export * from './inventory/StockAdjustmentPage';
export * from './inventory/LowStockAlertsPage';
export * from './inventory/CreateDispatchPage';
export * from './inventory/CreateTransferPage';
export * from './inventory/CreateReceivePage';

// Purchase
export * from './purchase/PurchaseDashboard';
export * from './purchase/VendorsPage';
export * from './purchase/AddVendorPage';
export * from './purchase/PurchaseInvoicesPage';
export * from './purchase/CreatePurchaseInvoicePage';
export * from './purchase/PurchaseReturnsPage';
export * from './purchase/CreatePurchaseReturnPage';
export * from './purchase/VendorPaymentsPage';
export * from './purchase/CreateVendorPaymentPage';
export * from './purchase/VendorCreditNotePage';
export * from './purchase/CreateVendorCreditNotePage';
export * from './purchase/VendorDebitNotePage';
export * from './purchase/CreateVendorDebitNotePage';

// Sales
export * from './sales/SalesDashboard';
export * from './sales/CustomersPage';
export * from './sales/AddCustomerPage';
export * from './sales/QuotationsPage';
export * from './sales/CreateQuotationPage';
export * from './sales/SalesInvoicesPage';
export * from './sales/CreateSalesInvoicePage';
export * from './sales/SalesReturnsPage';
export * from './sales/CreateSalesReturnPage';
export * from './sales/CustomerPaymentsPage';
export * from './sales/CreateCustomerPaymentPage';
export * from './sales/CustomerCreditNotePage';
export * from './sales/CreateCustomerCreditNotePage';
export * from './sales/CustomerDebitNotePage';
export * from './sales/CreateCustomerDebitNotePage';

// Accounts
export * from './accounts/AccountsDashboard';
export * from './accounts/ChartOfAccountsPage';
export * from './accounts/AddAccountPage';
export * from './accounts/PaymentsPage';
export * from './accounts/CreatePaymentVoucherPage';
export * from './accounts/ReceiptsPage';
export * from './accounts/CreateReceiptVoucherPage';
export * from './accounts/JournalVoucherPage';
export * from './accounts/CreateJournalVoucherPage';

// Reports
export * from './reports/SalesReportsPage';
export * from './reports/PurchaseReportsPage';
export * from './reports/InventoryReportsPage';
export * from './reports/FinancialReportsPage';
export * from './reports/ProductionReportsPage';

// Settings
export * from './settings/CompanySettingsPage';
export * from './settings/UsersPage';
export * from './settings/RolesPermissionsPage';
export * from './settings/TaxSettingsPage';
export * from './settings/NotificationSettingsPage';
export * from './settings/ActivityLogPage';

// Business Modules
export * from './crm';
export * from './hrm';
export * from './projects';
export * from './helpdesk';

// Advanced Modules
export * from './assets';
export * from './logistics';
export * from './billing';
export * from './production';
