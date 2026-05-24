import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService, AuthUser, LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (req: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await authService.login(req);
      setUser(resp.user);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Login failed';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (req: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await authService.register(req);
      setUser(resp.user);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Registration failed';
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login, register, logout,
      error, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
