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
  getCustomers: (companyId: number, page = 1, pageSize = 100) =>
    request<any>(`/api/sales/customers/${companyId}?page=${page}&pageSize=${pageSize}`),
  createCustomer: (data: any) =>
    request<any>('/api/sales/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) =>
    request<any>(`/api/sales/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) =>
    request<any>(`/api/sales/customers/${id}`, { method: 'DELETE' }),
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

/* ── Logistics API ─────────────────────────────────────── */
export const logisticsApi = {
  getCarriers: (companyId: number) =>
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
  // Chart of Accounts
  getChart: (companyId: number) =>
    request<any[]>(`/api/accounts/chart/${companyId}`),
  createAccount: (data: any) =>
    request<any>('/api/accounts/chart', { method: 'POST', body: JSON.stringify(data) }),
  updateAccount: (id: number, data: any) =>
    request<any>(`/api/accounts/chart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: (id: number) =>
    request<any>(`/api/accounts/chart/${id}`, { method: 'DELETE' }),

  // Journal Vouchers
  getJournalVouchers: (companyId: number) =>
    request<any[]>(`/api/accounts/journal-vouchers/${companyId}`),
  createJournalVoucher: (data: any) =>
    request<any>('/api/accounts/journal-vouchers', { method: 'POST', body: JSON.stringify(data) }),
  getJournalVoucher: (id: number) =>
    request<any>(`/api/accounts/journal-vouchers/detail/${id}`),

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
};
