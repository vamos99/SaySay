"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../utils/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from "@/components/PortalSidebar";
import { AddChildModal } from "../components/AddChildModal";
import CustomSadChildIcon from "@/components/icons/CustomSadChildIcon";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

export default function ChildrenPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Çocuk seçimi için state'ler
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childStats, setChildStats] = useState<{[key: string]: any}>({});
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase.from('children')
      .select('id, name, gender, theme, avatar, birth_year, is_literate, wants_tts')
      .eq('user_id', user.id)
      .then(async ({ data }) => {
        setChildren(data || []);
        setLoading(false);
        
        // localStorage'dan seçili çocuğu al
        const localSelectedId = localStorage.getItem('selected_child_id');
        if (localSelectedId && data?.find(c => c.id === localSelectedId)) {
          setSelectedChildId(localSelectedId);
        }
        
        // Tüm çocukların istatistiklerini yükle
        if (data && data.length > 0) {
          await loadAllChildStats();
        }
      });
  }, [user]);

  // Sayfa focus olduğunda istatistikleri yenile
  useEffect(() => {
    const handleFocus = () => {
      refreshStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [children]);

  // Tüm çocukların istatistiklerini yükle
  const loadAllChildStats = async () => {
    setStatsLoading(true);
    try {
      const stats: {[key: string]: any} = {};
      
      for (const child of children) {
        // Interaction logs'dan istatistikler
        const { data: logs } = await supabase
          .from('interaction_logs')
          .select('*')
          .eq('child_id', child.id);
        
        // AI content'ten kavram sayısı
        const { data: content } = await supabase
          .from('ai_content')
          .select('concept')
          .eq('child_id', child.id)
          .eq('is_active', true);
        
        stats[child.id] = {
          totalInteractions: logs?.length || 0,
          correctAnswers: logs?.filter(l => l.details?.is_correct).length || 0,
          conceptsLearned: content?.length || 0,
          lastPlayed: logs && logs.length > 0 ? new Date(Math.max(...logs.map(l => new Date(l.created_at).getTime()))).toLocaleDateString('tr-TR') : 'Hiç oynamamış'
        };
      }
      
      setChildStats(stats);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Çocuk seçme fonksiyonu
  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    localStorage.setItem('selected_child_id', childId);
  };

  // İstatistikleri yenile
  const refreshStats = () => {
    if (children.length > 0) {
      loadAllChildStats();
    }
  };

  const handleAddChild = async (child: any) => {
    setError("");
    if (!user?.id) return;
    // Sadece yeni çocuk ekleme için, gerekli alanlar varsa ekle
    if (!child.name || !child.birthYear || !child.gender || !child.theme) return;
    const { data, error } = await supabase.from('children').insert([
      {
        user_id: user.id,
        name: child.name,
        gender: child.gender,
        theme: child.theme,
        birth_year: child.birthYear,
        avatar: child.avatar,
        note: child.note,
        is_literate: child.is_literate,
        wants_tts: child.wants_tts,
      }
    ]).select();
    if (error) { setError("Kayıt hatası: " + error.message); return; }
    setChildren([...children, ...(data||[])]);
    setShowAdd(false);
    // Roadmap oluşturma işlemi AddChildModal'da yapılıyor, burada kaldırıldı
  };

  const handleDelete = async (id: string) => {
    await supabase.from('children').delete().eq('id', id);
    setChildren(children.filter(c => c.id !== id));
  };

  // Yaş hesaplama fonksiyonu
  const getAge = (birthYear: number) => {
    if (!birthYear) return '-';
    return new Date().getFullYear() - birthYear;
  };

  // Gender ve yaş için custom SVG ikonlar
  const GenderSVG = (g: string) => g === 'female' ? (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#f8c9d3" stroke="#e67e22" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#f8c9d3"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#e67e22"/></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#bde6f7" stroke="#2c3e50" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#bde6f7"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#7b8fa1"/><rect x="8" y="7" width="12" height="4" rx="2" fill="#7b8fa1"/></svg>
  );
  const AgeSVG = (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2"/><ellipse cx="14" cy="18" rx="7" ry="4" fill="#fff"/><ellipse cx="14" cy="18" rx="4" ry="2.2" fill="#f9d7a0"/><ellipse cx="11.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="17.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="11.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="17.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="14" cy="21.5" rx="2.2" ry="1.1" fill="#e0b97d"/></svg>
  );

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f8f8f8'}}>
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
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',background:'#f8f8f8',overflow:'auto'}}>
        <div style={{maxWidth:1440,margin:'0 auto',padding:'0 24px 40px 24px'}}>
          <h2 style={{fontWeight:900, color:'#2c3e50',marginBottom:36,fontSize:'2.3rem',textAlign:'left',letterSpacing:0.2}}>Çocuklarınızı Yönetin</h2>
          {loading ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,padding:48}}>
              <span className="loader" aria-label="Yükleniyor" />
              <span style={{color:'#7b8fa1',fontWeight:700,fontSize:18}}>Yükleniyor...</span>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(304px, 1fr))',
                gridAutoRows: '1fr',
                gap: 30,
                marginBottom: 38,
                maxWidth: 1200,
                marginLeft: 'auto',
                marginRight: 'auto',
                overflow: 'visible', // kaydırma yerine visible
                minHeight: 304,
                paddingBottom: 19, // kaydırma çubuğu için boşluk
              }}>
                {children.length === 0 ? (
                  <div style={{background:'#fff',borderRadius:21,padding:'38px 0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:266,boxShadow:'0 4px 16px #f0f0f0',fontWeight:700,fontSize:20,color:'#7b8fa1',gap:16}}>
                    <CustomSadChildIcon />
                    Henüz çocuk eklenmedi.
                  </div>
                ) : children.map(child => (
                  <div 
                    key={child.id} 
                    style={{
                      background: selectedChildId === child.id ? '#eaffea' : '#fff',
                      borderRadius:21,
                      padding:'38px 30px',
                      boxShadow:'0 4px 24px #e0e0e0',
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'flex-start',
                      gap:23,
                      minHeight:266,
                      justifyContent:'space-between',
                      transition:'box-shadow 0.2s',
                      cursor:'pointer',
                      border: selectedChildId === child.id ? '2px solid #4CAF50' : 'none'
                    }}
                    onClick={() => handleSelectChild(child.id)}
                  >
                    <div style={{display:'flex',alignItems:'center',gap:23,marginBottom:10}}>
                      {child.avatar?.startsWith('<svg') ? (
                        <span style={{display:'block',width:53,height:53}} dangerouslySetInnerHTML={{__html:child.avatar}} />
                      ) : (
                        child.avatar ? <img src={child.avatar} alt="Avatar" style={{display:'block',width:53,height:53,borderRadius:'50%'}} /> : null
                      )}
                      <div>
                        <div style={{fontWeight:900,fontSize:23,color:'#2c3e50',marginBottom:4,display:'flex',alignItems:'center',gap:10}}>
                          {child.name}
                          {selectedChildId === child.id && <span style={{color:'#4CAF50',fontSize:16}}>✓ Seçili</span>}
                          {child.birth_year && (
                            <span style={{color:'#7b8fa1',fontWeight:700,fontSize:16,marginLeft:12}}>
                              Yaş: {getAge(child.birth_year)}
                            </span>
                          )}
                        </div>
                        {child.note && <div style={{color:'#e67e22',fontWeight:700,fontSize:14,marginTop:4}}>{child.note}</div>}
                      </div>
                    </div>
                    
                    {/* Tüm çocukların istatistikleri */}
                    {childStats[child.id] && (
                      <div style={{background:'#f8f9fa',borderRadius:12,padding:16,marginBottom:16,width:'100%'}}>
                        <h4 style={{fontWeight:800,fontSize:16,marginBottom:12,color:'#2c3e50'}}>📊 İstatistikler</h4>
                        {statsLoading ? (
                          <div style={{color:'#7b8fa1',fontSize:14}}>Yükleniyor...</div>
                        ) : (
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,fontSize:14}}>
                            <div>
                              <span style={{fontWeight:700,color:'#7b8fa1'}}>Toplam Etkileşim:</span>
                              <div style={{fontWeight:900,color:'#2c3e50'}}>{childStats[child.id].totalInteractions}</div>
                            </div>
                            <div>
                              <span style={{fontWeight:700,color:'#7b8fa1'}}>Doğru Cevaplar:</span>
                              <div style={{fontWeight:900,color:'#4CAF50'}}>{childStats[child.id].correctAnswers}</div>
                            </div>
                            <div>
                              <span style={{fontWeight:700,color:'#7b8fa1'}}>Öğrenilen Kavram:</span>
                              <div style={{fontWeight:900,color:'#2c3e50'}}>{childStats[child.id].conceptsLearned}</div>
                            </div>
                            <div>
                              <span style={{fontWeight:700,color:'#7b8fa1'}}>Son Oynama:</span>
                              <div style={{fontWeight:900,color:'#e67e22'}}>{childStats[child.id].lastPlayed}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div style={{display:'flex',gap:15,flexWrap:'wrap',marginBottom:15}}>
                      <button aria-label="Profili ve Ayarları Görüntüle" style={{background:'#bde6d3',color:'#2c3e50',borderRadius:11,padding:'13px 30px',fontWeight:900,border:'none',cursor:'pointer',transition:'background 0.2s',fontSize:17,boxShadow:'0 2px 8px #bde6d3'}} onClick={(e) => {e.stopPropagation(); router.push(`/portal/children/${child.id}`);}}>Profili & Ayarları</button>
                      <button aria-label="Çocuğu Sil" style={{background:'#ffe6b3',color:'#e74c3c',borderRadius:11,padding:'13px 30px',fontWeight:900,border:'none',cursor:'pointer',transition:'background 0.2s',fontSize:17,boxShadow:'0 2px 8px #ffe6b3'}} onClick={(e) => {e.stopPropagation(); handleDelete(child.id);}}>Sil</button>
                    </div>
                  </div>
                ))}
                {/* Çocuk Ekle butonunu grid'in en sonunda kutu gibi göster */}
                <div style={{background:'#4CAF50',borderRadius:21,padding:'38px 30px',boxShadow:'0 4px 24px #bde6d3',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:266,cursor:'pointer',transition:'background 0.2s',color:'#fff',fontWeight:900,fontSize:21}} onClick={()=>setShowAdd(true)}>
                  + Çocuk Ekle
                </div>
              </div>
              {/* Hata mesajı ve modalı grid dışında tutmaya devam et */}
              <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap',marginBottom:12}}>
                {error && <div role="alert" style={{color:'#fff',background:'#e74c3c',borderRadius:12,padding:'14px 28px',display:'flex',alignItems:'center',gap:16,fontWeight:900,fontSize:19,boxShadow:'0 2px 8px #e74c3c'}}><span style={{fontWeight:900,fontSize:26}}>!</span> {error}</div>}
              </div>
              {showAdd && <AddChildModal onAdd={handleAddChild} onClose={()=>setShowAdd(false)} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 