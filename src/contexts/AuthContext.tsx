import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, days?: number) => void;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

const TOKEN_COOKIE = 'token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const t = getCookie(TOKEN_COOKIE);
    setToken(t);
  }, []);

  useEffect(() => {
    refresh();
    const onVisibility = () => refresh();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [refresh]);

  const login = useCallback((newToken: string, days = 7) => {
    setCookie(TOKEN_COOKIE, newToken, days);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    deleteCookie(TOKEN_COOKIE);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(token),
    token,
    login,
    logout,
    refresh,
  }), [token, login, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


