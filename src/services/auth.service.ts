import api from '@/lib/api';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    // Store tokens
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', data);
    // Store tokens
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data.data;
  },

  signOut: async (): Promise<void> => {
    try {
      await api.post('/auth/signout');
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};

