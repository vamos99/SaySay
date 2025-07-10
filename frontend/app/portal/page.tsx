"use client";

import React, { useEffect, useState, useRef } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';
import { AddChildModal } from './components/AddChildModal';
import { AnimatedBubbles } from './components/AnimatedBubbles';
import { PortalCard } from './components/PortalCard';
import LoadingScreen from '@/components/LoadingScreen';

const MOTIVATION = [
  'Her çocuk bir dünyadır! 🌍',
  'Birlikte öğrenmek çok eğlenceli! 🎈',
  'Güvenli ve mutlu bir gelişim için buradayız!',
  'Her gün yeni bir keşif! 🚀',
  'Oyunla öğren, sevgiyle büyü! 💛',
  'Hayal gücünün sınırı yok!',
  'Senin için en iyisi hazırlanıyor...'
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PortalPage() {
  const { session, user, loading } = useAuth();
  const router = useRouter();
  const [showAddChild, setShowAddChild] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  // Hydration hatası için: SSR'da sabit başlat, client'ta güncelle
  const [progress, setProgress] = useState(20); // SSR'da sabit
  const [motivation, setMotivation] = useState(MOTIVATION[0]); // SSR'da sabit
  const [bubbles, setBubbles] = useState<any[]>([]); // SSR'da boş
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Rastgele motivasyon ve baloncuklar sadece client'ta
    setMotivation(MOTIVATION[getRandomInt(0, MOTIVATION.length - 1)]);
    setBubbles(Array.from({length: 3}).map((_, i) => {
      const size = getRandomInt(40, 90);
      const top = getRandomInt(20, 70);
      const left = getRandomInt(10, 80);
      const color = ['#f8c9d3','#ffe6b3','#e0b97d'][i];
      const opacity = 0.10 + 0.08 * i;
      const anim = `bubble${i+1} ${(4+i)}s infinite alternate`;
      return { size, top, left, color, opacity, anim, i };
    }));
    // Seçili çocuk localStorage'dan yükle
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected_child_id');
      if (stored) setSelectedChildId(stored);
    }
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
      return;
    }
    if (user?.id && isClient) { // localStorage erişimi sadece client'ta
      setChildrenLoading(true);
      supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          setChildren(data || []);
          setChildrenLoading(false);
          if ((!data || data.length === 0) && !localStorage.getItem('child_added_once')) {
            setShowAddChild(true);
          } else {
            setShowAddChild(false);
            // Eğer seçili çocuk yoksa ilkini seç
            if ((!selectedChildId || !(data || []).find(c=>c.id===selectedChildId)) && data && data.length > 0) {
              setSelectedChildId(data[0].id);
              localStorage.setItem('selected_child_id', data[0].id);
            }
          }
        });
    }
  }, [user, session, loading, router, isClient]);

  useEffect(() => {
    if ((loading || childrenLoading) && isClient) {
      progressRef.current = setInterval(() => {
        setProgress((p) => {
          if (p < 98) return p + getRandomInt(1, 3);
          return p;
        });
      }, 350);
    } else {
      setProgress(100);
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [loading, childrenLoading, isClient]);

  // Çocuk ekleme işlemi sonrası children'ı güncelle ve yeni çocuğu seçili yap
  const handleAddChild = async (name: string) => {
    if (!user?.id) return;
    const { data: inserted, error } = await supabase.from('children').insert([{ user_id: user.id, name }]).select();
    // Yeniden fetch et
    setChildrenLoading(true);
    const { data } = await supabase.from('children').select('*').eq('user_id', user.id);
    setChildren(data || []);
    setChildrenLoading(false);
    setShowAddChild(false);
    localStorage.setItem('child_added_once', '1');
    // Eklenen çocuğu seçili yap
    if (inserted && inserted[0]) {
      setSelectedChildId(inserted[0].id);
      localStorage.setItem('selected_child_id', inserted[0].id);
    }
  };

  // Çocuk seçimi değişince localStorage'a yaz
  useEffect(() => {
    if (selectedChildId) {
      localStorage.setItem('selected_child_id', selectedChildId);
    }
  }, [selectedChildId]);

  if (!isClient) return null;
  if (loading || childrenLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-portal-root" style={{position:'relative', overflow:'visible', zIndex:1}}>
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
      <main className="portal-main-content" style={{paddingTop: 0}}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#2c3e50", marginBottom: 12, display:'flex', alignItems:'center', gap:8 }}>
          Hoş geldiniz <WelcomeSmileHandIcon />
        </h1>
        {/* Çocuklar listesi ve seçimi */}
        <div style={{marginBottom: 18}}>
          <div style={{fontWeight:700, color:'#2c3e50', marginBottom:6}}>Çocuklarınız:</div>
          <div style={{background:'#f8c9d3',borderRadius:16,padding:'12px 10px',boxShadow:'0 2px 8px #f8c9d3',maxWidth:420,minWidth:220,height:70,display:'flex',alignItems:'center',overflowX:'auto',gap:10}}>
            {children.map(child => (
              <button key={child.id} onClick={()=>setSelectedChildId(child.id)} style={{
                padding:'6px 16px',
                borderRadius:8,
                border: child.id===selectedChildId ? '2px solid #4CAF50' : '1.5px solid #dcdcdc',
                background: child.id===selectedChildId ? '#eaffea' : '#fff',
                color:'#2c3e50',
                fontWeight:600,
                cursor:'pointer',
                outline:'none',
                boxShadow: child.id===selectedChildId ? '0 2px 8px #bde6d3' : 'none',
                transition:'all .2s',
                fontSize:15,
                minWidth:80
              }}>{child.name}</button>
            ))}
            {/* Çocuk ekleme butonu kaldırıldı, yerine yönlendirme */}
            <button onClick={()=>router.push('/portal/children')} style={{padding:'6px 16px',borderRadius:8,border:'1.5px dashed #4CAF50',background:'#f8fff8',color:'#4CAF50',fontWeight:600,cursor:'pointer',fontSize:15,minWidth:80}}>Çocukları Yönet</button>
          </div>
        </div>
        {/* Portal özet alanı */}
        <div style={{marginBottom: 24, background:'#f8f8ff', borderRadius:16, padding:24, boxShadow:'0 2px 8px #f0f0f0'}}>
          <div style={{fontWeight:700, fontSize:'1.1rem', color:'#2c3e50', marginBottom:8}}>Özet</div>
          <ul style={{margin:0, paddingLeft:18, color:'#5a6a78', fontSize:'1rem'}}>
            <li>Toplam çocuk: {children.length}</li>
            {/* Buraya roadmap, gelişim, son aktivite vb. özetler eklenebilir */}
            <li>Son aktivite: -</li>
            <li>Roadmap durumu: -</li>
          </ul>
        </div>
        {/* PortalCard ve tekrar eden kartlar kaldırıldı */}
      </main>
    </div>
  );
}

function ChildIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2"/><ellipse cx="12" cy="17" rx="7" ry="4" fill="#a9dff5" stroke="#5a6a78" strokeWidth="2"/></svg>
  );
}
function GameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="8" rx="4" fill="#bde6d3" stroke="#4b5f43" strokeWidth="2"/><circle cx="8" cy="12" r="1.5" fill="#e74c3c"/><circle cx="16" cy="12" r="1.5" fill="#e74c3c"/></svg>
  );
}
function ReportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="3" fill="#a9dff5" stroke="#5a6a78" strokeWidth="2"/><path d="M8 14L11 11L14 15L16 13" stroke="#e74c3c" strokeWidth="2"/></svg>
  );
}
function WelcomeSmileHandIcon() {
  // Modern, sade el sallayan çocuk yüzü
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2" />
      <ellipse cx="16" cy="21" rx="7" ry="4" fill="#fff" />
      <ellipse cx="16" cy="21" rx="4" ry="2.2" fill="#f9d7a0" />
      <ellipse cx="11.5" cy="15" rx="2.2" ry="2.8" fill="#fff" />
      <ellipse cx="20.5" cy="15" rx="2.2" ry="2.8" fill="#fff" />
      <ellipse cx="11.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78" />
      <ellipse cx="20.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78" />
      <ellipse cx="16" cy="24.5" rx="2.2" ry="1.1" fill="#e0b97d" />
      <path d="M12 12 Q16 9 20 12" stroke="#e0b97d" strokeWidth="1.5" fill="none" />
      <path d="M13 24 Q16 27 19 24" stroke="#e0b97d" strokeWidth="1" fill="none" />
      {/* El sallama */}
      <g>
        <ellipse cx="27" cy="8" rx="2.2" ry="1.1" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="1" transform="rotate(18 27 8)">
          <animateTransform attributeName="transform" type="rotate" from="18 27 8" to="38 27 8" dur="0.7s" repeatCount="indefinite" direction="alternate" />
        </ellipse>
        <ellipse cx="29.2" cy="10" rx="1.1" ry="0.7" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="0.7" />
      </g>
    </svg>
  );
} 