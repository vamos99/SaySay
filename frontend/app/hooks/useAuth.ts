import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { AuthState, LoginCredentials, RegisterCredentials, AuthError } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });

  useEffect(() => {
    // Sadece bir kez session'ı al
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user || null,
        session,
        loading: false
      });
    };

    getInitialSession();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user || null,
          session,
          loading: false
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthError | null> => {
    try {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
        return { message: error.message, code: error.name };
      }
      return null;
    } catch (error) {
      return { message: 'Giriş yapılırken bir hata oluştu' };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthError | null> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            date_of_birth: credentials.dateOfBirth,
            phone: credentials.phone,
            gender: credentials.gender
          }
        }
      });
      
      if (error) {
        return { message: error.message, code: error.name };
      }
      return null;
    } catch (error) {
      return { message: 'Kayıt olurken bir hata oluştu' };
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string): Promise<AuthError | null> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { message: error.message, code: error.name };
      }
      return null;
    } catch (error) {
      return { message: 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu' };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    resetPassword
  };
}; 