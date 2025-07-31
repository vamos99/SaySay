"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../utils/AuthContext';
import { useUserType } from '../utils/UserTypeContext';

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

  // Korumalı sayfalar (giriş yapmış kullanıcılar erişemez)
  const protectedFromAuth = ['/login', '/register', '/forgot-password', '/reset-password'];
  
  // Korumalı sayfalar (giriş yapmamış kullanıcılar erişemez)
  const protectedFromUnauth = ['/portal', '/child-dashboard'];

  useEffect(() => {
    if (loading || userTypeLoading) return; // Yükleme sırasında bekle

    // Giriş yapmış kullanıcı korumalı sayfalara erişmeye çalışırsa
    if (user && protectedFromAuth.some(path => pathname.startsWith(path))) {
      // Kullanıcı tipine göre yönlendir
      if (userType === 'child') {
        router.push('/child-dashboard');
      } else {
        router.push('/portal');
      }
      return;
    }

    // Giriş yapmamış kullanıcı portal sayfalarına erişmeye çalışırsa
    if (!user && protectedFromUnauth.some(path => pathname.startsWith(path))) {
      router.push('/login');
      return;
    }

    // Kullanıcı tipine göre yönlendirme
    if (user && userType) {
      // Çocuk kullanıcı portal'a erişmeye çalışıyorsa
      if (userType === 'child' && pathname.startsWith('/portal')) {
        router.push('/child-dashboard');
        return;
      }

      // Parent kullanıcı child-dashboard'a erişmeye çalışıyorsa
      if (userType === 'parent' && pathname.startsWith('/child-dashboard')) {
        router.push('/portal');
        return;
      }
    }

    setIsChecking(false);
  }, [user, loading, userType, userTypeLoading, pathname, router]);

  // Yükleme sırasında loading göster
  if (loading || userTypeLoading || isChecking) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light-blue-bg)'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            Yükleniyor...
          </div>
          <div style={{ fontSize: 16, color: '#7b8fa1' }}>Lütfen bekleyin</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 