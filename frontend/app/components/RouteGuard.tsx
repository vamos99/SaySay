"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../utils/AuthContext';
import { useUserType } from '../utils/UserTypeContext';
import LoadingScreen from './layout/LoadingScreen';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Portal sayfaları için body class'ını ayarla
  useEffect(() => {
    if (pathname.startsWith('/portal') || pathname.startsWith('/child-dashboard')) {
      document.body.className = 'app-root-body app-portal-root';
    } else {
      document.body.className = 'app-root-body';
    }
  }, [pathname]);

  useEffect(() => {
    if (loading || userTypeLoading) return;

    // Giriş yapmış kullanıcı korumalı sayfalara erişmeye çalışırsa
    if (user && ['/login', '/register', '/forgot-password', '/reset-password'].some(path => pathname.startsWith(path))) {
      if (userType === 'child') {
        router.push('/child-dashboard');
      } else {
        router.push('/portal');
      }
      return;
    }

    // Giriş yapmamış kullanıcı portal sayfalarına erişmeye çalışırsa
    if (!user && ['/portal', '/child-dashboard'].some(path => pathname.startsWith(path))) {
      router.push('/login');
      return;
    }

    // Kullanıcı tipine göre yönlendirme
    if (user && userType) {
      if (userType === 'child' && pathname.startsWith('/portal')) {
        router.push('/child-dashboard');
        return;
      }

      if (userType === 'parent' && pathname.startsWith('/child-dashboard')) {
        router.push('/portal');
        return;
      }
    }

    setIsChecking(false);
  }, [user, loading, userType, userTypeLoading, pathname, router]);

  // Yükleme sırasında loading göster
  if (loading || userTypeLoading || isChecking) {
    return <LoadingScreen text="Yükleniyor..." />;
  }

  return <>{children}</>;
}; 