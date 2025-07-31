"use client";
import React, { useEffect, useState } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useRouter } from "next/navigation";
import { GameIcon } from "@/components/icons/GameIcon";
import { SettingsIcon } from "@/components/icons/SettingsIcon";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';
import { useAuth } from '../../utils/AuthContext';
import { supabase } from '../../utils/supabaseClient';

export default function GamesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showChildSelector, setShowChildSelector] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    // Çocukları yükle
    supabase.from('children')
      .select('id, name, avatar, birth_year, theme')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setChildren(data || []);
        
        // localStorage'dan seçili çocuğu al
        const localSelectedId = localStorage.getItem('selected_child_id');
        if (localSelectedId && data?.find(c => c.id === localSelectedId)) {
          setSelectedChildId(localSelectedId);
          setSelectedChild(data.find(c => c.id === localSelectedId));
        } else if (data && data.length > 0) {
          // İlk çocuğu otomatik seç
          setSelectedChildId(data[0].id);
          setSelectedChild(data[0]);
          localStorage.setItem('selected_child_id', data[0].id);
        }
      });
  }, [user]);

  const handleSelectChild = (childId: string) => {
    const child = children.find(c => c.id === childId);
    setSelectedChildId(childId);
    setSelectedChild(child);
    localStorage.setItem('selected_child_id', childId);
    setShowChildSelector(false);
  };

  const handleStartGame = (gamePath: string) => {
    if (!selectedChildId) {
      setShowChildSelector(true);
      return;
    }
    router.push(gamePath);
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
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',background:'var(--light-blue-bg)',overflow:'auto'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <h1 style={{fontWeight:900,fontSize:'2.2rem',color:'var(--dark-text)',marginBottom:32}}>Oyunlar</h1>
          
          {/* Seçili çocuk bilgisi */}
          {selectedChild && (
            <div style={{background:'#eaffea',borderRadius:16,padding:20,marginBottom:24,border:'2px solid #4CAF50',display:'flex',alignItems:'center',gap:16}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                {selectedChild.avatar?.startsWith('<svg') ? (
                  <span style={{display:'block',width:40,height:40}} dangerouslySetInnerHTML={{__html:selectedChild.avatar}} />
                ) : (
                  selectedChild.avatar ? <img src={selectedChild.avatar} alt="Avatar" style={{display:'block',width:40,height:40,borderRadius:'50%'}} /> : null
                )}
                <div>
                  <div style={{fontWeight:900,fontSize:18,color:'#2c3e50'}}>
                    {selectedChild.name} ✓ Seçili
                  </div>
                  <div style={{fontSize:14,color:'#7b8fa1'}}>
                    Tema: {selectedChild.theme} | Yaş: {new Date().getFullYear() - selectedChild.birth_year}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChildSelector(true)}
                style={{background:'#4CAF50',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,fontSize:14,cursor:'pointer'}}
              >
                Çocuk Değiştir
              </button>
            </div>
          )}
          
          <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
            {/* Oyun 1: Kavram Oyunu */}
            <div style={{background:'var(--sidebar-bg)',borderRadius:22,padding:32,minWidth:320,maxWidth:380,boxShadow:'0 4px 24px #e0e0e0',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:18}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <GameIcon />
                <span style={{fontWeight:800,fontSize:'1.3rem',color:'var(--dark-text)'}}>Kavram Oyunu</span>
              </div>
              <div style={{color:'var(--light-text)',fontSize:16,margin:'8px 0 18px 0'}}>Çocuğunuzun kavramları temalara göre eğlenceli şekilde öğrenmesini sağlayan oyun.</div>
              <div style={{display:'flex',gap:14}}>
                <button onClick={()=>handleStartGame('/portal/games/oyun1')} style={{background:'var(--primary-yellow)',color:'#2c3e50',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:900,fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #ffd600'}}>Başlat</button>
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
                <button onClick={()=>handleStartGame('/portal/games/oyun3')} style={{background:'var(--primary-yellow)',color:'#2c3e50',border:'none',borderRadius:12,padding:'12px 32px',fontWeight:900,fontSize:17,cursor:'pointer',boxShadow:'0 2px 8px #ffd600'}}>Başlat</button>
                <button onClick={()=>router.push('/portal/games/oyun3/settings')} style={{background:'var(--white)',color:'var(--dark-text)',border:'1.5px solid #e0b97d',borderRadius:12,padding:'12px 24px',fontWeight:800,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><SettingsIcon /> Ayarlar</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Çocuk Seçici Modal */}
      {showChildSelector && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:22,padding:32,maxWidth:400}}>
            <h3 style={{fontWeight:900,fontSize:22,marginBottom:16}}>Çocuk Seç</h3>
            <p style={{marginBottom:24}}>Oynamak için bir çocuk profili seçmelisin.</p>
            {children.length === 0 && <div>Hiç çocuk profili yok. Önce çocuk ekleyin.</div>}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {children.map(child => (
                <button 
                  key={child.id} 
                  style={{
                    padding:'12px 0',
                    borderRadius:10,
                    fontWeight:800,
                    fontSize:18,
                    background: selectedChildId === child.id ? '#eaffea' : '#f8f9fa',
                    border: selectedChildId === child.id ? '2px solid #4CAF50' : '1px solid #ddd',
                    color:'#2c3e50',
                    marginBottom:8,
                    cursor:'pointer'
                  }} 
                  onClick={() => handleSelectChild(child.id)}
                >
                  {child.name} ({child.birth_year}) {selectedChildId === child.id && '✓'}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowChildSelector(false)}
              style={{width:'100%',background:'#eee',color:'#333',borderRadius:12,padding:12,fontWeight:800,marginTop:16,border:'none',cursor:'pointer'}}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 