import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: async () => ({ error: null }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session (demo mode works without Supabase configured)
    const session = localStorage.getItem('admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    // Demo admin credentials (works without Supabase)
    if (email === 'admin@premiumhub.ao' && password === 'admin123') {
      localStorage.setItem('admin_session', 'authenticated');
      setIsAuthenticated(true);
      return { error: null };
    }

    // Try Supabase if configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        localStorage.setItem('admin_session', 'authenticated');
        setIsAuthenticated(true);
        return { error: null };
      }
      return { error: error.message };
    }

    return { error: 'Credenciais inválidas' };
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    supabase.auth.signOut().catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
