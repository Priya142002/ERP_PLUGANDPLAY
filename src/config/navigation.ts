import { NavigationItem } from '../types';
import { filterNavigationByPlan, SubscriptionPlan } from '../utils/subscriptionAccess';

// Super Admin Navigation - Streamlined for Multi-Tenant ERP Platform
export const superAdminNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/superadmin/dashboard',
    roles: ['super_admin']
  },
  {
    id: 'companies',
    label: 'Companies',
    icon: 'building',
    path: '/superadmin/companies',
    roles: ['super_admin']
  },
  {
    id: 'all-users',
    label: 'Users',
    icon: 'users',
    path: '/superadmin/all-users',
    roles: ['super_admin']
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions & Plans',
    icon: 'credit-card',
    path: '/superadmin/subscriptions',
    roles: ['super_admin']
  },
  {
    id: 'modules',
    label: 'ERP Modules',
    icon: 'puzzle',
    path: '/superadmin/modules',
    roles: ['super_admin']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'chart-bar',
    path: '/superadmin/analytics',
    roles: ['super_admin']
  },
  {
    id: 'system',
    label: 'System',
    icon: 'cog',
    path: '/superadmin/system',
    roles: ['super_admin']
  }
];

export const adminNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/admin/dashboard',
    roles: ['admin']
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'archive',
    roles: ['admin'],
    children: [
      { id: 'inv-dashboard', label: 'Dashboard', path: '/admin/inventory/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'inv-products', label: 'Products', path: '/admin/inventory/products', roles: ['admin'], icon: 'cube' },
      { id: 'inv-dispatch', label: 'Material Dispatch', path: '/admin/inventory/dispatch', roles: ['admin'], icon: 'truck' },
      { id: 'inv-transfer', label: 'Product Transfer', path: '/admin/inventory/transfer', roles: ['admin'], icon: 'switch-horizontal' },
      { id: 'inv-receive', label: 'Product Receive', path: '/admin/inventory/receive', roles: ['admin'], icon: 'clipboard-check' },
      { id: 'inv-reports', label: 'Inventory Reports', path: '/admin/reports/inventory', roles: ['admin'], icon: 'document-report' },
    ]
  },
  {
    id: 'purchase',
    label: 'Purchase',
    icon: 'shopping-cart',
    roles: ['admin'],
    children: [
      { id: 'pur-dashboard', label: 'Dashboard', path: '/admin/purchase/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'pur-vendors', label: 'Vendor', path: '/admin/purchase/vendors', roles: ['admin'], icon: 'users' },
      { id: 'pur-invoices', label: 'Purchase Invoice', path: '/admin/purchase/invoices', roles: ['admin'], icon: 'document-text' },
      { id: 'pur-returns', label: 'Purchase Return', path: '/admin/purchase/returns', roles: ['admin'], icon: 'reply' },
      { id: 'pur-payments', label: 'Vendor Payment', path: '/admin/purchase/payments', roles: ['admin'], icon: 'credit-card' },
      { id: 'pur-credit-note', label: 'Vendor Credit Note', path: '/admin/purchase/credit-note', roles: ['admin'], icon: 'file-text' },
      { id: 'pur-debit-note', label: 'Vendor Debit Note', path: '/admin/purchase/debit-note', roles: ['admin'], icon: 'file-text' },
      { id: 'pur-reports', label: 'Purchase Reports', path: '/admin/reports/purchase', roles: ['admin'], icon: 'chart-bar' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: 'presentation-chart-line',
    roles: ['admin'],
    children: [
      { id: 'sal-dashboard', label: 'Dashboard', path: '/admin/sales/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'sal-customers', label: 'Customer', path: '/admin/sales/customers', roles: ['admin'], icon: 'user-group' },
      { id: 'sal-quotations', label: 'Quotation', path: '/admin/sales/quotations', roles: ['admin'], icon: 'document-duplicate' },
      { id: 'sal-invoices', label: 'Sales Invoice', path: '/admin/sales/invoices', roles: ['admin'], icon: 'receipt-tax' },
      { id: 'sal-returns', label: 'Sales Return', path: '/admin/sales/returns', roles: ['admin'], icon: 'refresh' },
      { id: 'sal-payments', label: 'Customer Payment', path: '/admin/sales/payments', roles: ['admin'], icon: 'cash' },
      { id: 'sal-credit-note', label: 'Customer Credit Note', path: '/admin/sales/credit-notes', roles: ['admin'], icon: 'file-text' },
      { id: 'sal-debit-note', label: 'Customer Debit Note', path: '/admin/sales/debit-notes', roles: ['admin'], icon: 'file-text' },
      { id: 'sal-reports', label: 'Sales Reports', path: '/admin/reports/sales', roles: ['admin'], icon: 'chart-pie' },
    ]
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: 'book-open',
    roles: ['admin'],
    children: [
      { id: 'acc-dashboard', label: 'Dashboard', path: '/admin/accounts/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'acc-chart', label: 'Chart of Accounts', path: '/admin/accounts/chart-of-accounts', roles: ['admin'], icon: 'list-bullet' },
      { id: 'acc-payments', label: 'Payment Voucher', path: '/admin/accounts/payments', roles: ['admin'], icon: 'credit-card' },
      { id: 'acc-receipts', label: 'Receipt Voucher', path: '/admin/accounts/receipts', roles: ['admin'], icon: 'receipt-refund' },
      { id: 'acc-journal', label: 'Journal Voucher', path: '/admin/accounts/journal', roles: ['admin'], icon: 'pencil-alt' },
      { id: 'acc-reports', label: 'Financial Reports', path: '/admin/reports/financial', roles: ['admin'], icon: 'chart-bar' },
    ]
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: 'user-group',
    roles: ['admin'],
    children: [
      { id: 'crm-dash', label: 'CRM Dashboard', path: '/admin/crm/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'crm-leads', label: 'Leads Management', path: '/admin/crm/leads', roles: ['admin'], icon: 'users' },
      { id: 'crm-opps', label: 'Opportunities', path: '/admin/crm/opportunities', roles: ['admin'], icon: 'presentation-chart-line' },
      { id: 'crm-follows', label: 'Activities & Follow-ups', path: '/admin/crm/follow-ups', roles: ['admin'], icon: 'calendar' },
    ]
  },
  {
    id: 'hrm',
    label: 'HRM',
    icon: 'user-group',
    roles: ['admin'],
    children: [
      { id: 'hrm-dash', label: 'HR Dashboard', path: '/admin/hrm/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'hrm-employees', label: 'Employee Directory', path: '/admin/hrm/employees', roles: ['admin'], icon: 'users' },
      { id: 'hrm-attendance', label: 'Attendance Calendar', path: '/admin/hrm/attendance', roles: ['admin'], icon: 'clipboard-check' },
      { id: 'hrm-leave', label: 'Leave Management', path: '/admin/hrm/leave', roles: ['admin'], icon: 'calendar' },
      { id: 'hrm-payroll', label: 'Payroll Dashboard', path: '/admin/hrm/payroll', roles: ['admin'], icon: 'cash' },
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'clipboard-list',
    roles: ['admin'],
    children: [
      { id: 'prj-dash', label: 'Project Dynamics', path: '/admin/projects/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'prj-list', label: 'Projects & Status', path: '/admin/projects/list', roles: ['admin'], icon: 'list' },
      { id: 'prj-tasks', label: 'Task Board', path: '/admin/projects/tasks', roles: ['admin'], icon: 'check-circle' },
    ]
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    icon: 'support',
    roles: ['admin'],
    children: [
      { id: 'hpd-dash', label: 'Ticket Dashboard', path: '/admin/helpdesk/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'hpd-tickets', label: 'Ticket Management', path: '/admin/helpdesk/tickets', roles: ['admin'], icon: 'ticket' },
      { id: 'hpd-sla', label: 'SLA Monitoring', path: '/admin/helpdesk/sla', roles: ['admin'], icon: 'clock' },
    ]
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: 'archive',
    roles: ['admin'],
    children: [
      { id: 'ast-dash', label: 'Asset Intelligence', path: '/admin/assets/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'ast-manage', label: 'Management & Allocation', path: '/admin/assets/manage', roles: ['admin'], icon: 'list' },
      { id: 'ast-rep', label: 'Asset Reports', path: '/admin/assets/reports', roles: ['admin'], icon: 'document-report' },
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics',
    icon: 'truck',
    roles: ['admin'],
    children: [
      { id: 'log-dash', label: 'Fleet Intelligence', path: '/admin/logistics/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'log-order', label: 'Order Processing', path: '/admin/logistics/orders', roles: ['admin'], icon: 'clipboard-list' },
      { id: 'log-ship', label: 'Shipment Tracking', path: '/admin/logistics/shipments', roles: ['admin'], icon: 'truck' },
      { id: 'log-del', label: 'Delivery Routes', path: '/admin/logistics/delivery', roles: ['admin'], icon: 'map' },
      { id: 'log-carrier', label: 'Carrier Partners', path: '/admin/logistics/carriers', roles: ['admin'], icon: 'building' },
      { id: 'log-feedback', label: 'Customer Feedback', path: '/admin/logistics/feedback', roles: ['admin'], icon: 'chat-alt-2' },
    ]
  },
  {
    id: 'production',
    label: 'Production',
    icon: 'factory',
    roles: ['admin'],
    children: [
      { id: 'prod-dash', label: 'Production Dashboard', path: '/admin/production/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'prod-bom', label: 'Bill of Materials', path: '/admin/production/bom', roles: ['admin'], icon: 'clipboard-list' },
      { id: 'prod-plan', label: 'Production Planning', path: '/admin/production/planning', roles: ['admin'], icon: 'calendar' },
      { id: 'prod-wo', label: 'Work Orders', path: '/admin/production/work-orders', roles: ['admin'], icon: 'factory' },
      { id: 'prod-inv', label: 'Inventory Movement', path: '/admin/production/inventory-movement', roles: ['admin'], icon: 'truck' },
      { id: 'prod-qc', label: 'Quality Check', path: '/admin/production/quality-check', roles: ['admin'], icon: 'clipboard-check' },
    ]
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'receipt-tax',
    roles: ['admin'],
    children: [
      { id: 'bill-dash', label: 'Billing Dashboard', path: '/admin/billing/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'bill-inv', label: 'Invoice Management', path: '/admin/billing/invoices', roles: ['admin'], icon: 'document-text' },
      { id: 'bill-rem', label: 'Payment Reminders', path: '/admin/billing/reminders', roles: ['admin'], icon: 'bell' },
    ]
  },
  {
    id: 'pos',
    label: 'POS',
    icon: 'receipt-tax',
    roles: ['admin'],
    children: [
      { id: 'pos-dash', label: 'POS Dashboard', path: '/admin/pos/dashboard', roles: ['admin'], icon: 'dashboard' },
      { id: 'pos-billing', label: 'Billing / Sales Screen', path: '/admin/pos/billing', roles: ['admin'], icon: 'shopping-cart' },
      { id: 'pos-customers', label: 'Customer Management', path: '/admin/pos/customers', roles: ['admin'], icon: 'user-group' },
      { id: 'pos-inventory', label: 'Inventory Sync', path: '/admin/pos/inventory-sync', roles: ['admin'], icon: 'refresh' },
      { id: 'pos-invoice', label: 'Invoice & Receipt', path: '/admin/pos/invoice', roles: ['admin'], icon: 'receipt-tax' },
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'shield-check',
    roles: ['admin'],
    children: [
      { id: 'admin-company', label: 'Company', path: '/admin/admin/company', roles: ['admin'], icon: 'building' },
      { id: 'admin-user', label: 'User', path: '/admin/admin/user', roles: ['admin'], icon: 'users' },
      { id: 'admin-user-access', label: 'User Access', path: '/admin/admin/user-access', roles: ['admin'], icon: 'lock' },
      { id: 'admin-audit', label: 'Audit Logs', path: '/admin/admin/audit-logs', roles: ['admin'], icon: 'clipboard-list' },
    ]
  },
  {
    id: 'subscription',
    label: 'My Subscription',
    icon: 'credit-card',
    path: '/admin/subscription',
    roles: ['admin']
  },
  {
    id: 'modules',
    label: 'My Modules',
    icon: 'puzzle',
    path: '/admin/modules',
    roles: ['admin']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'cog',
    path: '/admin/settings',
    roles: ['admin']
  }
];

// Helper function to get custom module order from localStorage
function getCustomModuleOrder(): string[] | null {
  try {
    const saved = localStorage.getItem('moduleOrder');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Helper function to sort navigation items by custom order
function sortNavigationByCustomOrder(navigation: NavigationItem[]): NavigationItem[] {
  const customOrder = getCustomModuleOrder();
  if (!customOrder) return navigation;

  const moduleItems = navigation.filter(item => 
    item.id !== 'dashboard' && 
    item.id !== 'subscription' && 
    item.id !== 'modules' && 
    item.id !== 'settings'
  );
  
  const fixedItems = navigation.filter(item => 
    item.id === 'dashboard' || 
    item.id === 'subscription' || 
    item.id === 'modules' || 
    item.id === 'settings'
  );

  const sortedModules = customOrder
    .map(id => moduleItems.find(item => item.id === id))
    .filter(Boolean) as NavigationItem[];

  // Add any modules not in custom order at the end
  const remainingModules = moduleItems.filter(
    item => !customOrder.includes(item.id)
  );

  return [
    fixedItems.find(item => item.id === 'dashboard')!,
    ...sortedModules,
    ...remainingModules,
    fixedItems.find(item => item.id === 'subscription')!,
    fixedItems.find(item => item.id === 'modules')!,
    fixedItems.find(item => item.id === 'settings')!,
  ].filter(Boolean);
}

// Helper function to filter navigation items based on user role
export function getNavigationForRole(role: 'super_admin' | 'admin', subscriptionPlan?: SubscriptionPlan): NavigationItem[] {
  if (role === 'super_admin') {
    return superAdminNavigation;
  }
  
  // For admin role, filter based on subscription plan
  let navigation = adminNavigation;
  if (subscriptionPlan) {
    navigation = filterNavigationByPlan(adminNavigation, subscriptionPlan);
  }
  
  // Apply custom order
  return sortNavigationByCustomOrder(navigation);
}