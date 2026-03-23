import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from '../components/layout';
import { User } from '../types';
import { LoginPage } from '../pages/public';
import {
  DashboardPage,
  CompanyManagementPage,
  AdminManagementPage,
  SubscriptionManagementPage,
  AnalyticsPage,
  AuditLogsPage,
  SettingsPage as SuperAdminSettingsPage,
  ModulesManagementPage,
  SystemPage,
} from '../pages/superadmin';
import {
  AdminDashboardPage,
  SubscriptionPage,
  ModulesPage,
  SettingsPage as AdminSettingsPage,
  InventoryDashboard,
  ProductsPage,
  AddProductPage,
  MaterialDispatchPage,
  StockTransferPage,
  ProductReceivePage,
  OpeningStockPage,
  CategoriesPage,
  BrandsPage,
  UnitsPage,
  WarehousePage,
  StockAdjustmentPage,
  LowStockAlertsPage,
  CreateDispatchPage,
  CreateTransferPage,
  CreateReceivePage,
  PurchaseDashboard,
  VendorsPage,
  PurchaseInvoicesPage,
  PurchaseReturnsPage,
  VendorPaymentsPage,
  VendorCreditNotePage,
  VendorDebitNotePage,
  AddVendorPage,
  CreatePurchaseInvoicePage,
  CreatePurchaseReturnPage,
  CreateVendorPaymentPage,
  CreateVendorCreditNotePage,
  CreateVendorDebitNotePage,
  EditPurchaseReturnPage,
  EditPurchaseInvoicePage,
  EditVendorPaymentPage,
  SalesDashboard,
  CustomersPage,
  QuotationsPage,
  SalesInvoicesPage,
  SalesReturnsPage,
  CustomerPaymentsPage,
  CustomerCreditNotePage,
  CustomerDebitNotePage,
  AddCustomerPage,
  EditCustomerPage,
  CreateQuotationPage,
  EditQuotationPage,
  CreateSalesInvoicePage,
  EditSalesInvoicePage,
  CreateSalesReturnPage,
  EditSalesReturnPage,
  CreateCustomerPaymentPage,
  EditCustomerPaymentPage,
  CreateCustomerCreditNotePage,
  EditCustomerCreditNotePage,
  CreateCustomerDebitNotePage,
  EditCustomerDebitNotePage,
  AccountsDashboard,
  ChartOfAccountsPage,
  AddAccountPage,
  PaymentsPage,
  CreatePaymentVoucherPage,
  ReceiptsPage,
  CreateReceiptVoucherPage,
  JournalVoucherPage,
  CreateJournalVoucherPage,
  SalesReportsPage,
  PurchaseReportsPage,
  InventoryReportsPage,
  FinancialReportsPage,
  CompanySettingsPage,
  UsersPage,
  RolesPermissionsPage,
  TaxSettingsPage,
  NotificationSettingsPage,
  ActivityLogPage,
  LeadsPage,
  OpportunitiesPage,
  FollowUpsPage,
  CRMDashboard,
  EmployeesPage,
  AttendancePage,
  LeavePage,
  PayrollPage,
  HRDashboard,
  ProjectDashboard,
  ProjectListPage,
  TasksPage,
  TimesheetPage,
  ClientSyncPage,
  TicketsPage,
  SLAPage,
  HelpdeskDashboard,
  AssetDashboard,
  AssetManagePage,
  AssetDepreciationPage,
  MaintenancePage,
  AssetDisposalPage,
  AssetReportsPage,
  ShipmentListPage,
  DeliveryPage,
  LogisticsOrderPage,
  CarrierPartnersPage,
  CustomerFeedbackPage,
  LogisticsDashboard,
  InvoicesPage,
  RemindersPage,
  BillingDashboard,
  ProductionDashboard,
  BOMPage,
  ProductionPlanningPage,
  WorkOrdersPage,
  InventoryMovementPage,
  QualityCheckPage,
} from '../pages/admin';

interface AppRoutesProps {
  user: User | null;
  onLogin: (role: 'super_admin' | 'admin', remember: boolean) => void;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

export const AppRoutes = ({ user, onLogin, onLogout, onSwitchRole }: AppRoutesProps) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage user={user} onLogin={onLogin} />}
      />

      <Route
        path="/superadmin"
        element={
          user ? (
            <DashboardShell user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Redirect base to dashboard */}
        <Route index element={<Navigate to="/superadmin/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Super Admin only routes */}
        {user?.role === 'super_admin' && (
          <>
            <Route path="companies" element={<CompanyManagementPage />} />
            <Route path="companies/add" element={<CompanyManagementPage />} />
            <Route path="companies/:id" element={<CompanyManagementPage />} />
            <Route path="companies/:id/edit" element={<CompanyManagementPage />} />
            <Route path="users" element={<AdminManagementPage />} />
            <Route path="users/add" element={<AdminManagementPage />} />
            <Route path="users/:id" element={<AdminManagementPage />} />
            <Route path="users/:id/edit" element={<AdminManagementPage />} />
            <Route path="subscriptions" element={<SubscriptionManagementPage />} />
            <Route path="subscriptions/add" element={<SubscriptionManagementPage />} />
            <Route path="subscriptions/:id" element={<SubscriptionManagementPage />} />
            <Route path="subscriptions/:id/edit" element={<SubscriptionManagementPage />} />
            <Route path="subscriptions/assign" element={<SubscriptionManagementPage />} />
            <Route path="modules" element={<ModulesManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="system" element={<SystemPage />} />
          </>
        )}

        <Route path="settings" element={<SuperAdminSettingsPage />} />

        <Route path="*" element={<Navigate to="/superadmin/dashboard" replace />} />
      </Route>

      {/* Redirect root based on role */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={user ? (user.role === 'super_admin' ? "/superadmin/dashboard" : "/admin/dashboard") : "/login"} 
            replace 
          />
        } 
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          user?.role === 'admin' ? (
            <DashboardShell user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="modules" element={<ModulesPage />} />
        
        {/* Inventory */}
        <Route path="inventory">
          <Route path="dashboard" element={<InventoryDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="dispatch" element={<MaterialDispatchPage />} />
          <Route path="dispatch/create" element={<CreateDispatchPage />} />
          <Route path="transfer" element={<StockTransferPage />} />
          <Route path="transfer/create" element={<CreateTransferPage />} />
          <Route path="receive" element={<ProductReceivePage />} />
          <Route path="receive/create" element={<CreateReceivePage />} />
          <Route path="opening" element={<OpeningStockPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="adjustment" element={<StockAdjustmentPage />} />
          <Route path="alerts" element={<LowStockAlertsPage />} />
        </Route>

        {/* Purchase */}
        <Route path="purchase">
          <Route path="dashboard" element={<PurchaseDashboard />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="vendors/add" element={<AddVendorPage />} />
          <Route path="invoices" element={<PurchaseInvoicesPage />} />
          <Route path="invoices/create" element={<CreatePurchaseInvoicePage />} />
          <Route path="invoices/:id/edit" element={<EditPurchaseInvoicePage />} />
          <Route path="returns" element={<PurchaseReturnsPage />} />
          <Route path="returns/new" element={<CreatePurchaseReturnPage />} />
          <Route path="returns/:id/edit" element={<EditPurchaseReturnPage />} />
          <Route path="payments" element={<VendorPaymentsPage />} />
          <Route path="payments/new" element={<CreateVendorPaymentPage />} />
          <Route path="payments/:id/edit" element={<EditVendorPaymentPage />} />
          <Route path="credit-note" element={<VendorCreditNotePage />} />
          <Route path="credit-note/new" element={<CreateVendorCreditNotePage />} />
          <Route path="debit-note" element={<VendorDebitNotePage />} />
          <Route path="debit-note/new" element={<CreateVendorDebitNotePage />} />
        </Route>

        {/* Sales */}
        <Route path="sales">
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/add" element={<AddCustomerPage />} />
          <Route path="customers/:id/edit" element={<EditCustomerPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/create" element={<CreateQuotationPage />} />
          <Route path="quotations/:id/edit" element={<EditQuotationPage />} />
          <Route path="invoices" element={<SalesInvoicesPage />} />
          <Route path="invoices/create" element={<CreateSalesInvoicePage />} />
          <Route path="invoices/:id/edit" element={<EditSalesInvoicePage />} />
          <Route path="returns" element={<SalesReturnsPage />} />
          <Route path="returns/create" element={<CreateSalesReturnPage />} />
          <Route path="returns/:id/edit" element={<EditSalesReturnPage />} />
          <Route path="payments" element={<CustomerPaymentsPage />} />
          <Route path="payments/create" element={<CreateCustomerPaymentPage />} />
          <Route path="payments/:id/edit" element={<EditCustomerPaymentPage />} />
          <Route path="credit-notes" element={<CustomerCreditNotePage />} />
          <Route path="credit-notes/create" element={<CreateCustomerCreditNotePage />} />
          <Route path="credit-notes/:id/edit" element={<EditCustomerCreditNotePage />} />
          <Route path="debit-notes" element={<CustomerDebitNotePage />} />
          <Route path="debit-notes/create" element={<CreateCustomerDebitNotePage />} />
          <Route path="debit-notes/:id/edit" element={<EditCustomerDebitNotePage />} />
        </Route>

        {/* Accounts */}
        <Route path="accounts">
          <Route path="dashboard" element={<AccountsDashboard />} />
          <Route path="chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="chart-of-accounts/add" element={<AddAccountPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/create" element={<CreatePaymentVoucherPage />} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="receipts/create" element={<CreateReceiptVoucherPage />} />
          <Route path="journal" element={<JournalVoucherPage />} />
          <Route path="journal/create" element={<CreateJournalVoucherPage />} />
        </Route>

        {/* Reports */}
        <Route path="reports">
          <Route path="sales" element={<SalesReportsPage />} />
          <Route path="purchase" element={<PurchaseReportsPage />} />
          <Route path="inventory" element={<InventoryReportsPage />} />
          <Route path="financial" element={<FinancialReportsPage />} />
        </Route>

        {/* Settings */}
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="settings/company" element={<CompanySettingsPage />} />
        <Route path="settings/users" element={<UsersPage />} />
        <Route path="settings/roles" element={<RolesPermissionsPage />} />
        <Route path="settings/tax" element={<TaxSettingsPage />} />
        <Route path="settings/notifications" element={<NotificationSettingsPage />} />
        <Route path="settings/activity" element={<ActivityLogPage />} />

        {/* CRM */}
        <Route path="crm">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CRMDashboard />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="follow-ups" element={<FollowUpsPage />} />
        </Route>

        {/* HRM */}
        <Route path="hrm">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="payroll" element={<PayrollPage />} />
        </Route>

        {/* Projects */}
        <Route path="projects">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProjectDashboard />} />
          <Route path="list" element={<ProjectListPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="timesheets" element={<TimesheetPage />} />
          <Route path="client-sync" element={<ClientSyncPage />} />
        </Route>

        {/* Helpdesk */}
        <Route path="helpdesk">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HelpdeskDashboard />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="sla" element={<SLAPage />} />
        </Route>

        {/* Assets */}
        <Route path="assets">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AssetDashboard />} />
          <Route path="manage" element={<AssetManagePage />} />
          <Route path="depreciation" element={<AssetDepreciationPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="disposal" element={<AssetDisposalPage />} />
          <Route path="reports" element={<AssetReportsPage />} />
        </Route>

        {/* Logistics */}
        <Route path="logistics">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<LogisticsDashboard />} />
          <Route path="shipments" element={<ShipmentListPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="orders" element={<LogisticsOrderPage />} />
          <Route path="carriers" element={<CarrierPartnersPage />} />
          <Route path="feedback" element={<CustomerFeedbackPage />} />
        </Route>

        {/* Production */}
        <Route path="production">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProductionDashboard />} />
          <Route path="bom" element={<BOMPage />} />
          <Route path="planning" element={<ProductionPlanningPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
          <Route path="inventory-movement" element={<InventoryMovementPage />} />
          <Route path="quality-check" element={<QualityCheckPage />} />
        </Route>

        {/* Billing */}
        <Route path="billing">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BillingDashboard />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="reminders" element={<RemindersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;