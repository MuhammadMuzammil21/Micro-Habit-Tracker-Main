# Frontend Migration Checklist

## Overview
This document lists all files that need to be modified to migrate from Supabase to MERN stack API.

---

## 🔄 Files to Modify

### 1. **Create API Client** (NEW FILE)

**File:** `src/lib/api.ts`

**Purpose:** Replace Supabase client with HTTP client for Express API

**Implementation:**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', response.data.accessToken);
          // Retry original request
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 2. **Create Auth Service** (NEW FILE)

**File:** `src/services/auth.service.ts`

**Purpose:** Centralize authentication API calls

**Implementation:**
```typescript
import api from '@/lib/api';

export const authService = {
  signUp: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  signIn: async (email: string, password: string) => {
    const response = await api.post('/auth/signin', { email, password });
    // Store tokens
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  signOut: async () => {
    await api.post('/auth/signout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
```

---

### 3. **Create Auth Context** (NEW FILE)

**File:** `src/contexts/AuthContext.tsx`

**Purpose:** Manage authentication state globally

**Implementation:**
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';

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
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn(email, password);
    setUser(data.user);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const data = await authService.signUp(email, password, name);
    setUser(data.user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
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
```

---

### 4. **Update App.tsx**

**File:** `src/App.tsx`

**Changes:**
- [ ] Remove Supabase-related imports
- [ ] Add AuthProvider wrapper
- [ ] Keep QueryClientProvider (still useful for caching)

**Before:**
```typescript
import { supabase } from "@/integrations/supabase/client";
```

**After:**
```typescript
import { AuthProvider } from "@/contexts/AuthContext";
```

**Updated structure:**
```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="habitlink-theme">
        {/* ... rest of app */}
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

---

### 5. **Update ProtectedRoute.tsx**

**File:** `src/components/ProtectedRoute.tsx`

**Changes:**
- [ ] Remove Supabase imports
- [ ] Use AuthContext instead
- [ ] Remove Supabase auth state listener

**Before:**
```typescript
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // ... Supabase auth logic
};
```

**After:**
```typescript
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
```

---

### 6. **Update Auth.tsx**

**File:** `src/pages/Auth.tsx`

**Changes:**
- [ ] Remove `supabase` import
- [ ] Use `useAuth` hook
- [ ] Update signup/signin handlers

**Before:**
```typescript
import { supabase } from "@/integrations/supabase/client";

const handleSignUp = async (e: React.FormEvent) => {
  const { error } = await supabase.auth.signUp({ email, password, ... });
};
```

**After:**
```typescript
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { signUp, signIn } = useAuth();
  
  const handleSignUp = async (e: React.FormEvent) => {
    try {
      await signUp(email, password, name);
      navigate("/dashboard");
    } catch (error) {
      // Handle error
    }
  };
};
```

---

### 7. **Update Navbar.tsx**

**File:** `src/components/Navbar.tsx`

**Changes:**
- [ ] Remove `supabase` import
- [ ] Use `useAuth` hook for logout
- [ ] Update user display (get from context)

**Before:**
```typescript
import { supabase } from "@/integrations/supabase/client";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
};
```

**After:**
```typescript
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { signOut, user } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
};
```

---

### 8. **Update Dashboard.tsx**

**File:** `src/pages/Dashboard.tsx`

**Changes:**
- [ ] Remove mock data
- [ ] Fetch habits from API
- [ ] Use React Query for data fetching

**Before:**
```typescript
const [habits, setHabits] = useState(mockHabits);
```

**After:**
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

const Dashboard = () => {
  const queryClient = useQueryClient();
  
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const response = await api.get('/habits');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (habitData: any) => api.post('/habits', habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};
```

---

### 9. **Update HabitCard.tsx**

**File:** `src/components/HabitCard.tsx`

**Changes:**
- [ ] Update completion handler to call API
- [ ] Use mutation for updates

**Add:**
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

const HabitCard = ({ id, ... }) => {
  const queryClient = useQueryClient();
  
  const completeMutation = useMutation({
    mutationFn: () => api.post(`/habits/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleToggle = () => {
    if (!completed) {
      completeMutation.mutate();
    }
  };
};
```

---

### 10. **Update HabitDialog.tsx**

**File:** `src/components/HabitDialog.tsx`

**Changes:**
- [ ] Update submit handler to use API
- [ ] Use mutation for create/update

**Add:**
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

const HabitDialog = ({ habit, onSubmit, ... }) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: any) => 
      habit 
        ? api.put(`/habits/${habit.id}`, data)
        : api.post('/habits', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, description, frequency });
  };
};
```

---

### 11. **Update Analytics.tsx**

**File:** `src/pages/Analytics.tsx`

**Changes:**
- [ ] Fetch analytics data from API
- [ ] Replace mock data with API calls

**Add:**
```typescript
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const Analytics = () => {
  const { data: stats } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats');
      return response.data.data;
    },
  });

  const { data: trends } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: async () => {
      const response = await api.get('/analytics/trends');
      return response.data.data;
    },
  });
};
```

---

### 12. **Update Teams.tsx**

**File:** `src/pages/Teams.tsx`

**Changes:**
- [ ] Fetch teams from API
- [ ] Update create team handler

**Add:**
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

const Teams = () => {
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (teamData: any) => api.post('/teams', teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
```

---

### 13. **Update Contact.tsx**

**File:** `src/pages/Contact.tsx`

**Changes:**
- [ ] Remove Supabase function call
- [ ] Use API endpoint

**Before:**
```typescript
const { error } = await supabase.functions.invoke("send-contact-email", {
  body: formData,
});
```

**After:**
```typescript
import api from "@/lib/api";

const { data } = await api.post('/contact', formData);
```

---

### 14. **Update package.json**

**File:** `package.json`

**Changes:**
- [ ] Remove `@supabase/supabase-js`
- [ ] Add `axios` (if not using fetch)

**Remove:**
```json
"@supabase/supabase-js": "^2.81.1"
```

**Add:**
```json
"axios": "^1.6.0"
```

---

### 15. **Update Environment Variables**

**File:** `.env` (create if doesn't exist)

**Add:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Remove:**
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

---

### 16. **Delete Supabase Files**

**Files to Delete:**
- [ ] `src/integrations/supabase/` (entire directory)
- [ ] `supabase/` (entire directory)

---

## 📦 Additional Dependencies

Install if not already present:
```bash
npm install axios
```

---

## ✅ Testing Checklist

After migration, test:

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can sign out
- [ ] Protected routes redirect when not authenticated
- [ ] User can create a habit
- [ ] User can edit a habit
- [ ] User can delete a habit
- [ ] User can complete a habit
- [ ] Analytics page loads data
- [ ] Teams page loads data
- [ ] Contact form sends email
- [ ] Notifications load
- [ ] Token refresh works
- [ ] User stays logged in on page refresh

---

## 🐛 Common Issues

### CORS Errors
- Ensure backend CORS is configured to allow frontend origin
- Check `FRONTEND_URL` in backend `.env`

### 401 Unauthorized
- Check token is being sent in headers
- Verify token format: `Bearer <token>`
- Check token expiration

### Network Errors
- Verify `VITE_API_URL` is correct
- Ensure backend server is running
- Check firewall/port settings

---

## 📝 Notes

- Keep React Query for caching and state management
- Use optimistic updates for better UX
- Implement proper error boundaries
- Add loading states for all API calls
- Consider adding retry logic for failed requests

