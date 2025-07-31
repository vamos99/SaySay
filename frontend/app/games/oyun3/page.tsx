'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';

export default function Oyun3Page() {
  const router = useRouter();
  const { user } = useAuth();

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',background:'var(--light-blue-bg)'}}>
        <div style={{textAlign:'center',color:'#2c3e50'}}>
          <div style={{fontSize:24,fontWeight:700,marginBottom:16}}>Yönlendiriliyor...</div>
        </div>
      </div>
    );
  }

  // Portal'daki oyun3 sayfasına yönlendir
  React.useEffect(() => {
    router.push('/portal/games/oyun3');
  }, [router]);

  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',background:'var(--light-blue-bg)'}}>
      <div style={{textAlign:'center',color:'#2c3e50'}}>
        <div style={{fontSize:24,fontWeight:700,marginBottom:16}}>Oyun yükleniyor...</div>
        <div style={{fontSize:16,color:'#7b8fa1'}}>Lütfen bekleyin</div>
      </div>
    </div>
  );
} 