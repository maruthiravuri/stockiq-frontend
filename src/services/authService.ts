import api, { clearAuth } from './api';

export interface LoginRequest { usernameOrEmail: string; password: string; }
export interface RegisterRequest { email: string; username: string; password: string; }
export interface AuthUser { id: string; email: string; username: string; role: string; }
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export const authService = {
  async login(req: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/v1/auth/login', req);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(req: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/v1/auth/register', req);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      clearAuth();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/v1/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/api/v1/auth/reset-password', { token, newPassword });
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
