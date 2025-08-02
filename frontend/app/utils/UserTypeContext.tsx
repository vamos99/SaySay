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

// localStorage güvenli erişim fonksiyonları
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage erişim hatası:', error);
      return null;
    }
  }
  return null;
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage yazma hatası:', error);
    }
  }
};

const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage silme hatası:', error);
    }
  }
};

export const UserTypeProvider: React.FC<UserTypeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const determineUserType = async (): Promise<UserType> => {
    if (!user) return null;

    try {
      // localStorage'dan user_type'ı kontrol et
      const storedUserType = getLocalStorage('user_type');
      if (storedUserType === 'parent' || storedUserType === 'child') {
        return storedUserType as UserType;
      }

      // Kullanıcının çocukları var mı kontrol et
      const { data: children, error } = await supabase
        .from('children')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Çocuk bilgileri alınamadı:', error);
        return 'parent';
      }

      // Eğer çocuk yoksa parent
      if (!children || children.length === 0) {
        setLocalStorage('user_type', 'parent');
        return 'parent';
      }

      // Eğer sadece 1 çocuk varsa child
      if (children.length === 1) {
        const childId = children[0].id;
        setLocalStorage('selected_child_id', childId);
        setLocalStorage('user_type', 'child');
        return 'child';
      }

      // Birden fazla çocuk varsa parent
      setLocalStorage('user_type', 'parent');
      return 'parent';
    } catch (error) {
      console.error('Kullanıcı tipi belirlenirken hata:', error);
      return 'parent';
    }
  };

  const refreshUserType = async () => {
    setIsLoading(true);
    try {
      const type = await determineUserType();
      setUserType(type);
      
      // selectedChildId'yi localStorage'dan al
      const storedChildId = getLocalStorage('selected_child_id');
      setSelectedChildId(storedChildId);
    } catch (error) {
      console.error('UserType refresh hatası:', error);
      setUserType('parent');
      setSelectedChildId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshUserType();
    } else {
      setUserType(null);
      setSelectedChildId(null);
      setIsLoading(false);
    }
  }, [user]); // Sadece user dependency

  const setSelectedChildIdWithStorage = (id: string | null) => {
    setSelectedChildId(id);
    if (id) {
      setLocalStorage('selected_child_id', id);
    } else {
      removeLocalStorage('selected_child_id');
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