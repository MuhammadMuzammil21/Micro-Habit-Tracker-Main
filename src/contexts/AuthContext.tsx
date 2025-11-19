import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, SignUpData, SignInData } from '@/services/auth.service';
import { initializeSocket, disconnectSocket } from '@/lib/socket';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Initialize Socket.io connection
          initializeSocket(token);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          disconnectSocket();
        }
      }
      setLoading(false);
    };
    checkAuth();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn({ email, password });
    setUser(data.user);
    // Initialize Socket.io after login
    const token = localStorage.getItem('accessToken');
    if (token) {
      initializeSocket(token);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const data = await authService.signUp({ email, password, name });
    setUser(data.user);
    // Initialize Socket.io after signup
    const token = localStorage.getItem('accessToken');
    if (token) {
      initializeSocket(token);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    // Disconnect Socket.io on logout
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

