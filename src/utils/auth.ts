import { User } from '../types';

const AUTH_USER_KEY = 'erp_user';
const AUTH_TOKEN_KEY = 'erp_token';

export const getStoredUser = (): User | null => {
  const raw = window.localStorage.getItem(AUTH_USER_KEY)
           || window.sessionStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    // Map the JWT login response shape → User type
    // The login page stores: { name, email, role, companyId, companyName, allowedModules, ... }
    return {
      id:                   String(data.id ?? data.companyId ?? '0'),
      fullName:             data.fullName ?? data.name ?? data.email ?? 'User',
      email:                data.email ?? '',
      role:                 normalizeRole(data.role),
      companyId:            data.companyId ? String(data.companyId) : undefined,
      companyName:          data.companyName,
      allowedModules:       data.allowedModules ?? [],
      isTrialActive:        data.isTrialActive ?? false,
      hasActiveSubscription:data.hasActiveSubscription ?? false,
      daysRemaining:        data.daysRemaining ?? 0,
    } as User;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User, remember: boolean = false) => {
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => Boolean(getStoredUser());

// Normalize role string from backend → frontend enum
function normalizeRole(role: string): 'super_admin' | 'admin' {
  if (!role) return 'admin';
  const r = role.toLowerCase().replace(/\s/g, '_');
  if (r === 'superadmin' || r === 'super_admin') return 'super_admin';
  return 'admin';
}
