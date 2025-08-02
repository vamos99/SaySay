'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { gameCache } from './gameCache';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session getirme hatası:', error);
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session getirme exception:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message || null };
    } catch (error) {
      console.error('Login exception:', error);
      return { error: 'Giriş yapılırken bir hata oluştu' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error?.message || null };
    } catch (error) {
      console.error('Register exception:', error);
      return { error: 'Kayıt olurken bir hata oluştu' };
    }
  };

  const logout = async () => {
    try {
      // Çıkış yaparken cache'i temizle
      gameCache.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout hatası:', error);
      }
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 