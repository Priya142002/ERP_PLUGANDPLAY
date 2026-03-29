// Central API client — all requests go through here
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vivifysoft.in/ERP';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
  expiry: string;
  companyId?: number;
  companyName?: string;
  isTrialActive: boolean;
  trialEndDate?: string;
  hasActiveSubscription: boolean;
  daysRemaining: number;
  allowedModules: string[];
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('erp_token') || sessionStorage.getItem('erp_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const json = await res.json();
  return json as ApiResponse<T>;
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (idToken: string) =>
    request<AuthResponse>('/api/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  trialStatus: () =>
    request<{
      companyId: number;
      companyName: string;
      isTrialActive: boolean;
      trialEndDate: string;
      hasActiveSubscription: boolean;
      daysRemaining: number;
      isExpired: boolean;
    }>('/api/auth/trial-status'),
};

export default request;

// ── SuperAdmin ────────────────────────────────────────────────
export const superAdminApi = {
  // Companies
  getCompanies: (page = 1, pageSize = 50, search = '') =>
    request<any>(`/api/superadmin/companies?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`),
  createCompany: (data: any) =>
    request<any>('/api/superadmin/companies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id: number, data: any) =>
    request<any>(`/api/superadmin/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompany: (id: number) =>
    request<any>(`/api/superadmin/companies/${id}`, { method: 'DELETE' }),
  toggleCompanyStatus: (id: number) =>
    request<any>(`/api/superadmin/companies/${id}/toggle-status`, { method: 'PUT' }),

  // Subscriptions
  getSubscriptions: () =>
    request<any>('/api/superadmin/subscriptions'),
  getPlans: () =>
    request<any>('/api/superadmin/subscriptions/plans'),
  assignPlan: (data: any) =>
    request<any>('/api/superadmin/subscriptions/assign', { method: 'POST', body: JSON.stringify(data) }),
  createPlan: (data: any) =>
    request<any>('/api/superadmin/subscriptions/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id: number, data: any) =>
    request<any>(`/api/superadmin/subscriptions/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id: number) =>
    request<any>(`/api/superadmin/subscriptions/plans/${id}`, { method: 'DELETE' }),
  cancelSubscription: (id: number) =>
    request<any>(`/api/superadmin/subscriptions/${id}/cancel`, { method: 'PUT' }),

  // Billing history per company
  getCompanyBilling: (companyId: number) =>
    request<any>(`/api/superadmin/subscriptions/billing/${companyId}`),
  recordPayment: (data: any) =>
    request<any>('/api/superadmin/subscriptions/billing', { method: 'POST', body: JSON.stringify(data) }),
  markPaymentPaid: (id: number, data: any) =>
    request<any>(`/api/superadmin/subscriptions/billing/${id}/mark-paid`, { method: 'PUT', body: JSON.stringify(data) }),
  sendPaymentReminder: (id: number) =>
    request<any>(`/api/superadmin/subscriptions/billing/${id}/send-reminder`, { method: 'POST' }),
  sendBulkReminders: () =>
    request<any>('/api/superadmin/subscriptions/billing/send-bulk-reminders', { method: 'POST' }),

  // Module Access
  getModules: (companyId: number) =>
    request<any>(`/api/admin/modules/${companyId}/allowed`),
  setTrialModules: (companyId: number, moduleIds: string[]) =>
    request<any>(`/api/admin/modules/${companyId}/trial-modules`, {
      method: 'PUT', body: JSON.stringify({ moduleIds }),
    }),
  getCompanyModules: (companyId: number) =>
    request<any>(`/api/admin/modules/${companyId}`),
  toggleCompanyModule: (companyId: number, moduleId: string, isEnabled: boolean) =>
    request<any>('/api/admin/modules/toggle', {
      method: 'PATCH', body: JSON.stringify({ companyId, moduleId, isEnabled }),
    }),

  // Global Modules
  getGlobalModules: () =>
    request<any>('/api/admin/modules/global'),
  createGlobalModule: (data: { moduleId: string; name: string; description: string; category: string; icon?: string }) =>
    request<any>('/api/admin/modules/global', { method: 'POST', body: JSON.stringify(data) }),
  toggleGlobalModule: (id: number) =>
    request<any>(`/api/admin/modules/global/${id}/toggle`, { method: 'PUT' }),
  deleteGlobalModule: (id: number) =>
    request<any>(`/api/admin/modules/global/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () =>
    request<any>('/api/superadmin/analytics/platform'),
  getCompanyAnalytics: (id: number) =>
    request<any>(`/api/superadmin/analytics/company/${id}`),
  getRevenueStats: () =>
    request<any>('/api/superadmin/analytics/revenue'),

  // System
  getSystemSettings: () =>
    request<any>('/api/superadmin/system/settings'),
  updateSystemSettings: (settings: Record<string, string>) =>
    request<any>('/api/superadmin/system/settings', { method: 'POST', body: JSON.stringify(settings) }),
  getSystemHealth: () =>
    request<any>('/api/superadmin/system/health'),

  // Dropdown options (persisted custom items)
  getDropdownOptions: (key: 'company_types' | 'industries' | 'countries') =>
    request<string[]>(`/api/superadmin/system/dropdown/${key}`),
  saveDropdownOptions: (key: 'company_types' | 'industries' | 'countries', items: string[]) =>
    request<any>(`/api/superadmin/system/dropdown/${key}`, { method: 'POST', body: JSON.stringify(items) }),

  // Users
  getUsers: (filter?: string) =>
    request<any>(`/api/superadmin/users${filter ? `?filter=${filter}` : ''}`),
  getUserById: (id: number) =>
    request<any>(`/api/superadmin/users/${id}`),
  toggleUser: (id: number) =>
    request<any>(`/api/superadmin/users/${id}/toggle`, { method: 'PUT' }),
};

/* ── Inventory API ─────────────────────────────────────── */
export const inventoryApi = {
  getDashboard: (companyId: number, lowStockThreshold?: number) =>
    request<any>(`/api/inventory/dashboard/${companyId}${lowStockThreshold ? `?lowStockThreshold=${lowStockThreshold}` : ''}`),

  getProducts: (companyId: number, search?: string) =>
    request<any>(`/api/inventory/products/${companyId}${search ? `?search=${search}` : ''}`),
  createProduct: (data: any) =>
    request<any>('/api/inventory/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) =>
    request<any>(`/api/inventory/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<any>(`/api/inventory/products/${id}`, { method: 'DELETE' }),
  getProduct: (id: string) =>
    request<any>(`/api/inventory/product/${id}`),

  updateStock: (data: any) =>
    request<any>('/api/inventory/stock/update', { method: 'POST', body: JSON.stringify(data) }),
  getStockHistory: (productId: string) =>
    request<any>(`/api/inventory/stock/history/${productId}`),

  getCategories: (companyId: number) =>
    request<any>(`/api/inventory/categories/${companyId}`),
  createCategory: (data: any) =>
    request<any>('/api/inventory/categories', { method: 'POST', body: JSON.stringify(data) }),

  getBrands: (companyId: number) =>
    request<any>(`/api/inventory/brands/${companyId}`),
  createBrand: (data: any) =>
    request<any>('/api/inventory/brands', { method: 'POST', body: JSON.stringify(data) }),

  getUnits: (companyId: number) =>
    request<any>(`/api/inventory/units/${companyId}`),
  createUnit: (data: any) =>
    request<any>('/api/inventory/units', { method: 'POST', body: JSON.stringify(data) }),

  getTaxTypes: (companyId: number) =>
    request<any>(`/api/inventory/taxtypes/${companyId}`),
  createTaxType: (data: any) =>
    request<any>('/api/inventory/taxtypes', { method: 'POST', body: JSON.stringify(data) }),

  // Warehouses
  getWarehouses: (companyId: number, search?: string) =>
    request<any>(
      `/api/inventory/warehouses/${companyId}${search ? `?search=${encodeURIComponent(search)}&page=1&pageSize=100` : '?page=1&pageSize=100'}`
    ),
  createWarehouse: (data: any) =>
    request<any>('/api/inventory/warehouses', { method: 'POST', body: JSON.stringify(data) }),
  updateWarehouse: (id: number, data: any) =>
    request<any>(`/api/inventory/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWarehouse: (id: number) =>
    request<any>(`/api/inventory/warehouses/${id}`, { method: 'DELETE' }),

  // Material Dispatch
  getDispatches: (companyId: number, search?: string) =>
    request<any>(`/api/inventory/dispatch/${companyId}${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getDispatch: (id: string) =>
    request<any>(`/api/inventory/dispatch/detail/${id}`),
  createDispatch: (data: any) =>
    request<any>('/api/inventory/dispatch', { method: 'POST', body: JSON.stringify(data) }),
  updateDispatchStatus: (id: number, status: string) =>
    request<any>(`/api/inventory/dispatch/${id}/status?status=${status}`, { method: 'PUT' }),

  // Product Transfer
  getTransfers: (companyId: number, search?: string) =>
    request<any>(`/api/inventory/transfer/${companyId}${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createTransfer: (data: any) =>
    request<any>('/api/inventory/transfer', { method: 'POST', body: JSON.stringify(data) }),
  updateTransferStatus: (id: number, status: string) =>
    request<any>(`/api/inventory/transfer/${id}/status?status=${status}`, { method: 'PUT' }),

  // Product Receive (GRN)
  getReceives: (companyId: number, search?: string) =>
    request<any>(`/api/inventory/receive/${companyId}${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createReceive: (data: any) =>
    request<any>('/api/inventory/receive', { method: 'POST', body: JSON.stringify(data) }),
};

/* ── Sales API ────────────────────────────────────────── */
export const salesApi = {
  // Customers
  getCustomers: (companyId: number, page = 1, pageSize = 100) =>
    request<any>(`/api/sales/customers/${companyId}?page=${page}&pageSize=${pageSize}`),
  createCustomer: (data: any) =>
    request<any>('/api/sales/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) =>
    request<any>(`/api/sales/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) =>
    request<any>(`/api/sales/customers/${id}`, { method: 'DELETE' }),

  // Quotations
  getQuotations: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/sales/quotations/${companyId}?page=${page}&pageSize=${pageSize}`),
  createQuotation: (data: any) =>
    request<any>('/api/sales/quotations', { method: 'POST', body: JSON.stringify(data) }),
  getQuotation: (id: number) =>
    request<any>(`/api/sales/quotations/${id}`),
  updateQuotationStatus: (id: number, status: string) =>
    request<any>(`/api/sales/quotations/${id}/status?status=${status}`, { method: 'PUT' }),

  // Sales Invoices
  getInvoices: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/sales/invoices/${companyId}?page=${page}&pageSize=${pageSize}`),
  createInvoice: (data: any) =>
    request<any>('/api/sales/invoices', { method: 'POST', body: JSON.stringify(data) }),
  getInvoice: (id: number) =>
    request<any>(`/api/sales/invoices/${id}`),
  cancelInvoice: (id: number) =>
    request<any>(`/api/sales/invoices/${id}/cancel`, { method: 'PUT' }),
  createFromQuotation: (quotationId: number) =>
    request<any>(`/api/sales/invoices/from-quotation/${quotationId}`, { method: 'POST' }),

  // Sales Returns
  getReturns: (companyId: number) =>
    request<any>(`/api/sales/returns/${companyId}`),
  createReturn: (data: any) =>
    request<any>('/api/sales/returns', { method: 'POST', body: JSON.stringify(data) }),
  approveReturn: (id: number, status: string) =>
    request<any>(`/api/sales/returns/${id}/approve?status=${status}`, { method: 'PUT' }),

  // Customer Payments
  getPayments: (companyId: number) =>
    request<any>(`/api/sales/payments/${companyId}`),
  createPayment: (data: any) =>
    request<any>('/api/sales/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Credit / Debit Notes
  getCreditNotes: (companyId: number) =>
    request<any>(`/api/sales/credit-notes/${companyId}`),
  createCreditNote: (data: any) =>
    request<any>('/api/sales/credit-notes', { method: 'POST', body: JSON.stringify(data) }),
  getDebitNotes: (companyId: number) =>
    request<any>(`/api/sales/debit-notes/${companyId}`),
  createDebitNote: (data: any) =>
    request<any>('/api/sales/debit-notes', { method: 'POST', body: JSON.stringify(data) }),
};

/* ── File API ─────────────────────────────────────────── */
export const fileApi = {
  upload: (file: File, folder = "products") => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('erp_token') || sessionStorage.getItem('erp_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return fetch(`${BASE_URL}/api/file/upload?folder=${folder}`, {
      method: 'POST',
      body: formData,
      headers
    }).then(res => res.json() as Promise<ApiResponse<{ fileName: string, url: string }>>);
  }
};

/* ── Purchase API ─────────────────────────────────────── */
export const purchaseApi = {
  // Vendors
  getVendors: (companyId: number, page = 1, pageSize = 100) =>
    request<any>(`/api/purchase/vendors/${companyId}?page=${page}&pageSize=${pageSize}`),
  createVendor: (data: any) =>
    request<any>('/api/purchase/vendors', { method: 'POST', body: JSON.stringify(data) }),
  updateVendor: (id: number, data: any) =>
    request<any>(`/api/purchase/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVendor: (id: number) =>
    request<any>(`/api/purchase/vendors/${id}`, { method: 'DELETE' }),

  // Purchase Invoices
  getInvoices: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/purchase/invoices/${companyId}?page=${page}&pageSize=${pageSize}`),
  createInvoice: (data: any) =>
    request<any>('/api/purchase/invoices', { method: 'POST', body: JSON.stringify(data) }),
  getInvoice: (id: number) =>
    request<any>(`/api/purchase/invoices/${id}`),
  cancelInvoice: (id: number) =>
    request<any>(`/api/purchase/invoices/${id}/cancel`, { method: 'PUT' }),

  // Purchase Returns
  getReturns: (companyId: number) =>
    request<any>(`/api/purchase/returns/${companyId}`),
  createReturn: (data: any) =>
    request<any>('/api/purchase/returns', { method: 'POST', body: JSON.stringify(data) }),
  approveReturn: (id: number, status: string) =>
    request<any>(`/api/purchase/returns/${id}/approve?status=${status}`, { method: 'PUT' }),

  // Vendor Payments
  getPayments: (companyId: number) =>
    request<any>(`/api/purchase/payments/${companyId}`),
  createPayment: (data: any) =>
    request<any>('/api/purchase/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Credit / Debit Notes
  getCreditNotes: (companyId: number) =>
    request<any>(`/api/purchase/credit-notes/${companyId}`),
  createCreditNote: (data: any) =>
    request<any>('/api/purchase/credit-notes', { method: 'POST', body: JSON.stringify(data) }),
  getDebitNotes: (companyId: number) =>
    request<any>(`/api/purchase/debit-notes/${companyId}`),
  createDebitNote: (data: any) =>
    request<any>('/api/purchase/debit-notes', { method: 'POST', body: JSON.stringify(data) }),
};

/* ── HRM API ──────────────────────────────────────────── */
export const hrmApi = {
  // Employees
  getEmployees: (companyId: number, page = 1, pageSize = 100) =>
    request<any>(`/api/hrm/employees/${companyId}?page=${page}&pageSize=${pageSize}`),
  createEmployee: (data: any) =>
    request<any>('/api/hrm/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id: number, data: any) =>
    request<any>(`/api/hrm/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id: number) =>
    request<any>(`/api/hrm/employees/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (companyId: number, month: number, year: number) =>
    request<any>(`/api/hrm/attendance/${companyId}?month=${month}&year=${year}`),
  markAttendance: (data: any) =>
    request<any>('/api/hrm/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Leave
  getLeaveRequests: (companyId: number) =>
    request<any>(`/api/hrm/leave/${companyId}`),
  createLeaveRequest: (data: any) =>
    request<any>('/api/hrm/leave', { method: 'POST', body: JSON.stringify(data) }),
  approveLeave: (id: number, status: string) =>
    request<any>(`/api/hrm/leave/${id}/approve?status=${status}`, { method: 'PUT' }),

  // Payroll
  getPayroll: (companyId: number, month: number, year: number) =>
    request<any>(`/api/hrm/payroll/${companyId}?month=${month}&year=${year}`),
  processPayroll: (data: any) =>
    request<any>('/api/hrm/payroll/process', { method: 'POST', body: JSON.stringify(data) }),
};

/* ── CRM API ──────────────────────────────────────────── */
export const crmApi = {
  // Leads
  getLeads: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/crm/leads/${companyId}?page=${page}&pageSize=${pageSize}`),
  createLead: (data: any) =>
    request<any>('/api/crm/leads', { method: 'POST', body: JSON.stringify(data) }),
  updateLead: (id: number, data: any) =>
    request<any>(`/api/crm/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLead: (id: number) =>
    request<any>(`/api/crm/leads/${id}`, { method: 'DELETE' }),

  // Opportunities
  getOpportunities: (companyId: number) =>
    request<any>(`/api/crm/opportunities/${companyId}`),
  createOpportunity: (data: any) =>
    request<any>('/api/crm/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  updateOpportunity: (id: number, data: any) =>
    request<any>(`/api/crm/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Activities
  getActivities: (companyId: number) =>
    request<any>(`/api/crm/activities/${companyId}`),
  createActivity: (data: any) =>
    request<any>('/api/crm/activities', { method: 'POST', body: JSON.stringify(data) }),
};

/* ── Projects API ─────────────────────────────────────── */
export const projectsApi = {
  getProjects: (companyId: number) =>
    request<any>(`/api/projects/${companyId}`),
  createProject: (data: any) =>
    request<any>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: any) =>
    request<any>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) =>
    request<any>(`/api/projects/${id}`, { method: 'DELETE' }),

  getTasks: (projectId: number) =>
    request<any>(`/api/projects/${projectId}/tasks`),
  createTask: (data: any) =>
    request<any>('/api/projects/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTaskStatus: (id: number, status: string) =>
    request<any>(`/api/projects/tasks/${id}/status?status=${status}`, { method: 'PUT' }),
};

/* ── Helpdesk API ─────────────────────────────────────── */
export const helpdeskApi = {
  getTickets: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/helpdesk/tickets/${companyId}?page=${page}&pageSize=${pageSize}`),
  createTicket: (data: any) =>
    request<any>('/api/helpdesk/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (id: number, data: any) =>
    request<any>(`/api/helpdesk/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addComment: (ticketId: number, data: any) =>
    request<any>(`/api/helpdesk/tickets/${ticketId}/comments`, { method: 'POST', body: JSON.stringify(data) }),
};

/* ── Assets API ───────────────────────────────────────── */
export const assetsApi = {
  getAssets: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/assets/${companyId}?page=${page}&pageSize=${pageSize}`),
  createAsset: (data: any) =>
    request<any>('/api/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id: number, data: any) =>
    request<any>(`/api/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id: number) =>
    request<any>(`/api/assets/${id}`, { method: 'DELETE' }),
  disposeAsset: (id: number, data: any) =>
    request<any>(`/api/assets/${id}/dispose`, { method: 'PUT', body: JSON.stringify(data) }),
};

/* ── POS API ──────────────────────────────────────────── */
export const posApi = {
  getDashboard: (companyId: number) =>
    request<any>(`/api/pos/dashboard/${companyId}`),
  getOrders: (companyId: number, page = 1, pageSize = 50) =>
    request<any>(`/api/pos/orders/${companyId}?page=${page}&pageSize=${pageSize}`),
  createOrder: (data: any) =>
    request<any>('/api/pos/orders', { method: 'POST', body: JSON.stringify(data) }),
  getProducts: (companyId: number) =>
    request<any>(`/api/pos/products/${companyId}`),
};

/* ── Logistics API ─────────────────────────────────────── */
export const logisticsApi = {  getCarriers: (companyId: number) =>
    request<any>(`/api/logistics/carriers/${companyId}`),
  createCarrier: (data: any) =>
    request<any>('/api/logistics/carriers', { method: 'POST', body: JSON.stringify(data) }),
  deleteCarrier: (id: number) =>
    request<any>(`/api/logistics/carriers/${id}`, { method: 'DELETE' }),
};

/* ── Admin API ────────────────────────────────────────── */
export const adminApi = {
  // Company
  getCompanies: (page = 1, pageSize = 10, search = '') =>
    request<any>(`/api/company/list?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`),
  createCompany: (data: any) =>
    request<any>('/api/company/create', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id: number, data: any) =>
    request<any>(`/api/company/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompany: (id: number) =>
    request<any>(`/api/company/delete/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: (page = 1, pageSize = 10, search = '') =>
    request<any>(`/api/admin/users?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`),
  createUser: (data: any) =>
    request<any>('/api/admin/users/create', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: any) =>
    request<any>(`/api/admin/users/update/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleUserStatus: (id: number) =>
    request<any>(`/api/admin/users/toggle-status/${id}`, { method: 'POST' }),

  // Access
  getRoles: () =>
    request<any>('/api/admin/roles'),
  getPermissions: () =>
    request<any>('/api/admin/permissions'),
  getRolePermissions: (roleId: number) =>
    request<any>(`/api/admin/roles/${roleId}/permissions`),
  assignPermissions: (data: any) =>
    request<any>('/api/admin/roles/assign-permissions', { method: 'POST', body: JSON.stringify(data) }),

  // Audit Logs
  getAuditLogs: (page: number, pageSize: number, search: string) =>
    request<any>(`/api/admin/audit-logs?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`),
};

/* ── Accounts API ─────────────────────────────────────── */
export const accountsApi = {
  // Financial Years
  getFinancialYears: (companyId: number) =>
    request<any>(`/api/accounts/financial-years/${companyId}`),
  createFinancialYear: (data: any) =>
    request<any>('/api/accounts/financial-years', { method: 'POST', body: JSON.stringify(data) }),
  closeFinancialYear: (id: number) =>
    request<any>(`/api/accounts/financial-years/${id}/close`, { method: 'PUT' }),
  yearEndClose: (id: number, data: {
    newYearName?: string;
    carryForwardVendors: boolean;
    carryForwardCustomers: boolean;
    carryForwardProducts: boolean;
    carryForwardAccounts: boolean;
  }) =>
    request<any>(`/api/accounts/financial-years/${id}/year-end-close`, { method: 'POST', body: JSON.stringify(data) }),
  setActiveFinancialYear: (id: number) =>
    request<any>(`/api/accounts/financial-years/${id}/set-active`, { method: 'PUT' }),

  // Chart of Accounts
  getChart: (companyId: number) =>
    request<any[]>(`/api/accounts/chart/${companyId}`),
  getAccountDetail: (id: number) =>
    request<any>(`/api/accounts/chart/detail/${id}`),
  createAccount: (data: any) =>
    request<any>('/api/accounts/chart', { method: 'POST', body: JSON.stringify(data) }),
  updateAccount: (id: number, data: any) =>
    request<any>(`/api/accounts/chart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: (id: number) =>
    request<any>(`/api/accounts/chart/${id}`, { method: 'DELETE' }),

  // Journal Vouchers
  getJournalVouchers: (companyId: number, status?: string) =>
    request<any[]>(`/api/accounts/journal-vouchers/${companyId}${status ? `?status=${status}` : ''}`),
  createJournalVoucher: (data: any) =>
    request<any>('/api/accounts/journal-vouchers', { method: 'POST', body: JSON.stringify(data) }),
  getJournalVoucher: (id: number) =>
    request<any>(`/api/accounts/journal-vouchers/detail/${id}`),
  postJournalVoucher: (id: number) =>
    request<any>(`/api/accounts/journal-vouchers/${id}/post`, { method: 'PUT' }),
  cancelJournalVoucher: (id: number, reason: string) =>
    request<any>(`/api/accounts/journal-vouchers/${id}/cancel`, { method: 'PUT', body: JSON.stringify(reason) }),

  // Payment Vouchers
  getPaymentVouchers: (companyId: number) =>
    request<any[]>(`/api/accounts/payment-vouchers/${companyId}`),
  createPaymentVoucher: (data: any) =>
    request<any>('/api/accounts/payment-vouchers', { method: 'POST', body: JSON.stringify(data) }),

  // Receipt Vouchers
  getReceiptVouchers: (companyId: number) =>
    request<any[]>(`/api/accounts/receipt-vouchers/${companyId}`),
  createReceiptVoucher: (data: any) =>
    request<any>('/api/accounts/receipt-vouchers', { method: 'POST', body: JSON.stringify(data) }),

  // Bank Accounts
  getBankAccounts: (companyId: number) =>
    request<any>(`/api/accounts/bank-accounts/${companyId}`),
  createBankAccount: (data: any) =>
    request<any>('/api/accounts/bank-accounts', { method: 'POST', body: JSON.stringify(data) }),

  // Payment Modes
  getPaymentModes: (companyId: number) =>
    request<any>(`/api/accounts/payment-modes/${companyId}`),
  createPaymentMode: (data: any) =>
    request<any>('/api/accounts/payment-modes', { method: 'POST', body: JSON.stringify(data) }),

  // Cost Centers
  getCostCenters: (companyId: number) =>
    request<any>(`/api/accounts/cost-centers/${companyId}`),
  createCostCenter: (data: any) =>
    request<any>('/api/accounts/cost-centers', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  getAccountBalance: (accountId: number, asOnDate?: string) =>
    request<any>(`/api/accounts/balance/${accountId}${asOnDate ? `?asOnDate=${asOnDate}` : ''}`),
  getAccountLedger: (accountId: number, fromDate: string, toDate: string) =>
    request<any>(`/api/accounts/ledger/${accountId}?fromDate=${fromDate}&toDate=${toDate}`),
  getTrialBalance: (companyId: number, financialYearId: number, asOnDate: string) =>
    request<any>(`/api/accounts/trial-balance/${companyId}/${financialYearId}?asOnDate=${asOnDate}`),
  getProfitLoss: (companyId: number, fromDate: string, toDate: string) =>
    request<any>(`/api/accounts/profit-loss/${companyId}?fromDate=${fromDate}&toDate=${toDate}`),
  getBalanceSheet: (companyId: number, asOnDate: string) =>
    request<any>(`/api/accounts/balance-sheet/${companyId}?asOnDate=${asOnDate}`),
};
