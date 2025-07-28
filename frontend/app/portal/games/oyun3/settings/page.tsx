"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalSidebar } from "@/components/PortalSidebar";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

const TIMER_OPTIONS = [30, 60, 90, 120];
const LENGTH_OPTIONS = [
  { label: 'Kısa', value: 'short' },
  { label: 'Orta', value: 'medium' },
  { label: 'Uzun', value: 'long' },
];

export default function Oyun3SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timer, setTimer] = useState(90);
  const [length, setLength] = useState<'short'|'medium'|'long'>('medium');

  useEffect(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('oyun3_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timer) setTimer(parsed.timer);
        if (parsed.length) setLength(parsed.length);
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('oyun3_settings', JSON.stringify({ timer, length }));
    router.push('/portal/games');
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {!sidebarOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
        >
          <ExpandSidebarIcon />
        </button>
      )}
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'0 24px',position:'relative'}}>
          <h1 style={{fontWeight:900,fontSize:'2rem',color:'var(--dark-text)',marginBottom:24}}>Boşluk Doldurma Ayarları</h1>
          <div style={{background:'#fff',borderRadius:18,padding:32,boxShadow:'0 4px 24px #e0e0e0',marginBottom:32}}>
            <div style={{marginBottom:24}}>
              <label style={{fontWeight:700,marginRight:12}}>Süre:</label>
              {TIMER_OPTIONS.map(opt => (
                <button key={opt} onClick={()=>setTimer(opt)} style={{marginRight:8,padding:'6px 16px',borderRadius:8,border:timer===opt?'2px solid #ffd600':'1.5px solid #e0b97d',background:timer===opt?'#ffe066':'#fff',fontWeight:timer===opt?800:600,cursor:'pointer'}}>{opt} sn</button>
              ))}
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontWeight:700,marginRight:12}}>Metin Uzunluğu:</label>
              {LENGTH_OPTIONS.map(opt => (
                <button key={opt.value} onClick={()=>setLength(opt.value as any)} style={{marginRight:8,padding:'6px 16px',borderRadius:8,border:length===opt.value?'2px solid #ffd600':'1.5px solid #e0b97d',background:length===opt.value?'#ffe066':'#fff',fontWeight:length===opt.value?800:600,cursor:'pointer'}}>{opt.label}</button>
              ))}
            </div>
            <button onClick={handleSave} style={{marginTop:12,background:'#ffd600',color:'#2c3e50',border:'none',borderRadius:10,padding:'10px 28px',fontWeight:900,fontSize:16,cursor:'pointer'}}>Kaydet ve Geri Dön</button>
          </div>
        </div>
      </main>
    </div>
  );
} 