// Central API client — all requests go through here
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vivifysoft.in/ERP';

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
