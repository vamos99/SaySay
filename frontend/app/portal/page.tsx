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
        .eq('parent_id', user.id)
        .then(({ data }) => {
          setChildren(data || []);
          setChildrenLoading(false);
          if ((!data || data.length === 0) && !localStorage.getItem('child_added_once')) {
            setShowAddChild(true);
          } else {
            setShowAddChild(false);
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

  // Çocuk ekleme işlemi sonrası children'ı güncelle
  const handleAddChild = async (name: string) => {
    if (!user?.id) return;
    await supabase.from('children').insert([{ parent_id: user.id, name }]);
    // Yeniden fetch et
    setChildrenLoading(true);
    const { data } = await supabase.from('children').select('*').eq('parent_id', user.id);
    setChildren(data || []);
    setChildrenLoading(false);
    setShowAddChild(false);
    localStorage.setItem('child_added_once', '1'); // Artık tekrar popup açılmasın
  };

  if (!isClient) return null; // SSR'da hiç render etme, client'ta başlat
  if (loading || childrenLoading) {
    // Random baloncuklar (artık state'ten)
    const bubbleEls = bubbles.map(({size, top, left, color, opacity, anim, i}) => (
      <div key={i} style={{position:'absolute',top:`${top}%`,left:`${left}%`,opacity,animation:anim,zIndex:0}}>
        <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={size/2-3} fill={color} /></svg>
      </div>
    ));
    // Custom SVG çocuk yüzü
    const ChildFaceSVG = (
      <svg width="120" height="120" viewBox="0 0 120 120" style={{display:'block'}}>
        <circle cx="60" cy="60" r="56" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="4" />
        <ellipse cx="60" cy="80" rx="32" ry="18" fill="#fff" />
        <ellipse cx="60" cy="80" rx="18" ry="10" fill="#f9d7a0" />
        <ellipse cx="42" cy="60" rx="7" ry="9" fill="#fff" />
        <ellipse cx="78" cy="60" rx="7" ry="9" fill="#fff" />
        <ellipse cx="42" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
        <ellipse cx="78" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
        <ellipse cx="60" cy="92" rx="7" ry="3.5" fill="#e0b97d" />
        <path d="M50 50 Q60 40 70 50" stroke="#e0b97d" strokeWidth="3" fill="none" />
        <path d="M48 90 Q60 100 72 90" stroke="#e0b97d" strokeWidth="2" fill="none" />
        <ellipse cx="35" cy="48" rx="7" ry="4" fill="#e0b97d" opacity="0.18" />
        <ellipse cx="85" cy="48" rx="7" ry="4" fill="#e0b97d" opacity="0.18" />
        <ellipse cx="60" cy="30" rx="18" ry="10" fill="#e0b97d" opacity="0.18" />
      </svg>
    );
    // Custom SVG dönen oyuncak ikonları
    const OrbitSVG = (
      <svg width="180" height="180" style={{position:'absolute',top:-30,left:-30,animation:'orbit 3.5s linear infinite',zIndex:2}}>
        {/* Ayı */}
        <g transform="rotate(0 90 90)">
          <circle cx="90" cy="30" r="18" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2" />
          <ellipse cx="90" cy="25" rx="5" ry="3" fill="#fff" opacity="0.7" />
          <circle cx="82" cy="28" r="3" fill="#e0b97d" />
          <circle cx="98" cy="28" r="3" fill="#e0b97d" />
        </g>
        {/* Balon */}
        <g transform="rotate(120 90 90)">
          <ellipse cx="90" cy="30" rx="10" ry="16" fill="#e0b97d" stroke="#e0b97d" strokeWidth="2" />
          <rect x="87" y="46" width="6" height="8" rx="2" fill="#5a6a78" />
          <path d="M90 54 Q92 58 94 54" stroke="#5a6a78" strokeWidth="2" fill="none" />
        </g>
        {/* Puzzle */}
        <g transform="rotate(240 90 90)">
          <rect x="80" y="18" width="20" height="20" rx="5" fill="#fff6e0" stroke="#e0b97d" strokeWidth="2" />
          <circle cx="90" cy="18" r="4" fill="#fff" stroke="#5a6a78" strokeWidth="1" />
          <circle cx="100" cy="28" r="4" fill="#fff" stroke="#5a6a78" strokeWidth="1" />
        </g>
      </svg>
    );
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'linear-gradient(135deg,#fffef7 60%,#ffe6b3 100%)',position:'relative',overflow:'hidden'}}>
        {bubbleEls}
        {/* Ortada custom çocuk yüzü ve etrafında dönen SVG oyuncaklar */}
        <div style={{position:'relative',width:120,height:120,marginBottom:24,zIndex:2}}>
          {ChildFaceSVG}
          {OrbitSVG}
        </div>
        <div style={{fontWeight:800, fontSize: '1.4rem', color:'#e74c3c', marginBottom:8,letterSpacing:1,zIndex:1}}>SaySay Yükleniyor...</div>
        <div style={{width:240, height:16, background:'#e0b97d', borderRadius:10, overflow:'hidden', marginBottom:12,boxShadow:'0 2px 8px #ffe6b3',zIndex:1}}>
          <div style={{width: `${progress}%`, height:'100%', background:'linear-gradient(90deg,#ffe6b3 0%,#e0b97d 100%)', transition:'width 0.7s', borderRadius:10}}></div>
        </div>
        <div style={{color:'#2c3e50', fontSize:'1.05rem',fontWeight:700,marginBottom:4,zIndex:1}}>{progress < 100 ? `Veriler hazırlanıyor... %${progress}` : 'Hazır!'}</div>
        <div style={{color:'#5a6a78', fontSize:'0.95rem',zIndex:1}}>{motivation}</div>
        <style>{`
          @keyframes orbit {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bubble1 {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-30px) scale(1.08); }
          }
          @keyframes bubble2 {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(24px) scale(1.12); }
          }
          @keyframes bubble3 {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-18px) scale(1.05); }
          }
        `}</style>
      </div>
    );
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
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", position: 'relative', alignItems: 'flex-start', marginTop: 0, minHeight: 'calc(100vh - 64px)', width: '100%' }}>
          {/* Animasyonlu arka plan baloncukları */}
          <AnimatedBubbles />
          <PortalCard type="children" count={children.length} onAddChild={()=>setShowAddChild(true)} />
          <PortalCard type="game" />
          <PortalCard type="report" />
        </div>
        {showAddChild && <AddChildModal onAdd={handleAddChild} onClose={()=>setShowAddChild(false)} />}
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