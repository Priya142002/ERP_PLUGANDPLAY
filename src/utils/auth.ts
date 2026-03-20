import { User } from '../types';

const AUTH_USER_KEY = 'erp_user';

export const getStoredUser = (): User | null => {
  const raw = window.localStorage.getItem(AUTH_USER_KEY) || window.sessionStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User, remember: boolean = false) => {
  if (remember) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    window.sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const clearStoredUser = () => {
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => Boolean(getStoredUser());
