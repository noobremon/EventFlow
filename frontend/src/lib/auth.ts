import { User } from '@/types';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

export const setAuth = (token: string, user: User) => {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));
  // Clean legacy persisted values to avoid auto-login from previous builds.
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = sessionStorage.getItem('user') || localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
