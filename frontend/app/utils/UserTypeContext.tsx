'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

type UserType = 'parent' | 'child' | null;

interface UserTypeContextType {
  userType: UserType;
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  isLoading: boolean;
  refreshUserType: () => Promise<void>;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};

interface UserTypeProviderProps {
  children: ReactNode;
}

export const UserTypeProvider: React.FC<UserTypeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(() => {
    // localStorage'dan çocuk ID'sini al
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected_child_id');
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const determineUserType = async (): Promise<UserType> => {
    if (!user) return null;

    // Önce localStorage'dan user_type'ı kontrol et
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('user_type');
      if (storedUserType === 'parent' || storedUserType === 'child') {
        return storedUserType as UserType;
      }
    }

    try {
      // Kullanıcının çocukları var mı kontrol et
      const { data: children, error } = await supabase
        .from('children')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Çocuk bilgileri alınamadı:', error);
        return 'parent'; // Hata durumunda parent olarak varsay
      }

      // Eğer çocuk yoksa parent (ilk giriş)
      if (!children || children.length === 0) {
        console.log('Çocuk bulunamadı, parent olarak ayarlandı');
        return 'parent';
      }

      // Eğer çocuk varsa, kullanıcı tipini belirle
      // Şimdilik basit mantık: çocuk sayısına göre
      // Gerçek uygulamada daha karmaşık mantık olabilir
      
      // Eğer sadece 1 çocuk varsa ve o çocuk ise
      if (children.length === 1) {
        // Çocuk olarak kabul et ve ID'sini seç
        const childId = children[0].id;
        setSelectedChildId(childId);
        // localStorage'a da kaydet
        localStorage.setItem('selected_child_id', childId);
        // user_type'ı sadece localStorage'da yoksa ayarla
        if (!localStorage.getItem('user_type')) {
          localStorage.setItem('user_type', 'child');
        }
        return 'child';
      }

      // Birden fazla çocuk varsa parent olarak kabul et
      if (!localStorage.getItem('user_type')) {
        localStorage.setItem('user_type', 'parent');
      }
      return 'parent';
    } catch (error) {
      console.error('Kullanıcı tipi belirlenirken hata:', error);
      return 'parent';
    }
  };

  const refreshUserType = async () => {
    setIsLoading(true);
    const type = await determineUserType();
    setUserType(type);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      refreshUserType();
    } else {
      setUserType(null);
      setSelectedChildId(null);
      setIsLoading(false);
    }
    
    // localStorage'dan selected_child_id'yi yükle
    if (typeof window !== 'undefined') {
      const storedChildId = localStorage.getItem('selected_child_id');
      if (storedChildId && !selectedChildId) {
        setSelectedChildId(storedChildId);
      }
    }
  }, [user, selectedChildId]);

  // localStorage'daki user_type değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserType = localStorage.getItem('user_type');
      if (storedUserType === 'parent' || storedUserType === 'child') {
        setUserType(storedUserType as UserType);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setSelectedChildIdWithStorage = (id: string | null) => {
    setSelectedChildId(id);
    if (id) {
      localStorage.setItem('selected_child_id', id);
    } else {
      localStorage.removeItem('selected_child_id');
    }
  };

  const value: UserTypeContextType = {
    userType,
    selectedChildId,
    setSelectedChildId: setSelectedChildIdWithStorage,
    isLoading,
    refreshUserType,
  };

  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  );
}; 