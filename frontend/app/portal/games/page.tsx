"use client";
import React from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useRouter } from "next/navigation";
import { GameIcon } from "@/components/icons/GameIcon";
import { SettingsIcon } from "@/components/icons/SettingsIcon";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

export default function GamesPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
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
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <h1 style={{fontWeight:900,fontSize:'2.2rem',color:'var(--dark-text)',marginBottom:32}}>Oyunlar</h1>
          <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
            {/* Oyun 1: Kavram Oyunu */}
            <div style={{background:'var(--sidebar-bg)',borderRadius:22,padding:32,minWidth:320,maxWidth:380,boxShadow:'0 4px 24px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:18}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <GameIcon />
                <span style={{fontWeight:800,fontSize:'1.3rem',color:'var(--dark-text)'}}>Kavram Oyunu</span>
              </div>
              <div style={{color:'var(--light-text)',fontSize:16,margin:'8px 0 18px 0'}}>Çocuğunuzun kavramları temalara göre eğlenceli şekilde öğrenmesini sağlayan oyun.</div>
              <div style={{display:'flex',gap:14}}>
                <button onClick={()=>router.push('/portal/games/oyun1')} style={{background:'var(--primary-yellow)',color:'#2c3e50',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:900,fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #ffd600'}}>Başlat</button>
                <button onClick={()=>router.push('/portal/roadmap')} style={{background:'var(--white)',color:'var(--dark-text)',border:'1.5px solid #e0b97d',borderRadius:12,padding:'12px 24px',fontWeight:800,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><SettingsIcon /> Ayarlar</button>
              </div>
            </div>
            {/* Oyun 2: Gelecekte eklenecek oyunlar için boş kart */}
            <div style={{background:'var(--sidebar-bg)',borderRadius:22,padding:32,minWidth:320,maxWidth:380,boxShadow:'0 4px 24px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:18,opacity:0.5,filter:'grayscale(0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <GameIcon />
                <span style={{fontWeight:800,fontSize:'1.3rem',color:'var(--dark-text)'}}>Oyun 2 (Yakında)</span>
              </div>
              <div style={{color:'var(--light-text)',fontSize:16,margin:'8px 0 18px 0'}}>Yeni oyunlar çok yakında burada olacak!</div>
              <div style={{display:'flex',gap:14}}>
                <button disabled style={{background:'#eee',color:'#aaa',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:900,fontSize:17,cursor:'not-allowed'}}>Başlat</button>
                <button disabled style={{background:'#fff',color:'#aaa',border:'1.5px solid #e0b97d',borderRadius:12,padding:'12px 24px',fontWeight:800,fontSize:16,cursor:'not-allowed',display:'flex',alignItems:'center',gap:8}}><SettingsIcon /> Ayarlar</button>
              </div>
            </div>
            {/* Oyun 3: Yeni aktif oyun kartı */}
            <div style={{background:'var(--sidebar-bg)',borderRadius:22,padding:32,minWidth:320,maxWidth:380,boxShadow:'0 4px 24px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:18}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <GameIcon />
                <span style={{fontWeight:800,fontSize:'1.3rem',color:'var(--dark-text)'}}>Oyun 3</span>
              </div>
              <div style={{color:'var(--light-text)',fontSize:16,margin:'8px 0 18px 0'}}>Yeni bir oyun! Eğlenceli ve öğretici içerikler çok yakında burada.</div>
              <div style={{display:'flex',gap:14}}>
                <button onClick={()=>router.push('/portal/games/oyun3')} style={{background:'var(--primary-yellow)',color:'#2c3e50',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:900,fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #ffd600'}}>Başlat</button>
                <button onClick={()=>router.push('/portal/games/oyun3/settings')} style={{background:'var(--white)',color:'var(--dark-text)',border:'1.5px solid #e0b97d',borderRadius:12,padding:'12px 24px',fontWeight:800,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><SettingsIcon /> Ayarlar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 