import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('reviewlens_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('reviewlens_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('reviewlens_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setToken(storedToken);
            localStorage.setItem('reviewlens_user', JSON.stringify(data.user));
          } else {
            // Invalid session
            localStorage.removeItem('reviewlens_token');
            localStorage.removeItem('reviewlens_user');
            setUser(null);
            setToken(null);
          }
        } catch {
          // Keep cached user if offline
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: 'owner' | 'customer'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('reviewlens_token', data.token);
      localStorage.setItem('reviewlens_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Network error communicating with authentication server.' };
    }
  };

  const signup = async (formData: {
    name: string;
    email: string;
    password: string;
    role: 'owner' | 'customer';
    phone?: string;
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
    businessDescription?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('reviewlens_token', data.token);
      localStorage.setItem('reviewlens_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Network error creating account.' };
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Password reset failed' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error resetting password.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('reviewlens_token');
    localStorage.removeItem('reviewlens_user');
    setUser(null);
    setToken(null);
  };

  const loginAsDemo = async (
    role: 'owner' | 'customer',
    specificOwner?: 'alex' | 'sarah' | 'david'
  ) => {
    let email = '';
    let password = '';

    if (role === 'owner') {
      if (specificOwner === 'sarah') {
        email = 'sarah.owner@reviewlens.ai';
        password = 'owner123';
      } else if (specificOwner === 'david') {
        email = 'david.owner@reviewlens.ai';
        password = 'owner123';
      } else {
        email = 'alex.owner@reviewlens.ai';
        password = 'owner123';
      }
    } else {
      email = 'elena.customer@gmail.com';
      password = 'customer123';
    }

    await login(email, password, role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
