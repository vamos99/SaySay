"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../utils/AuthContext';
import { supabase } from '../../../utils/supabaseClient';
import { PortalSidebar } from "@/components/PortalSidebar";
import { AddChildModal } from '../../components/AddChildModal';
import CustomThemeIcon from "@/components/icons/CustomThemeIcon";
import CustomEditIcon from "@/components/icons/CustomEditIcon";
import CustomTrashIcon from "@/components/icons/CustomTrashIcon";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';
import LoadingScreen from '@/components/LoadingScreen';

export default function ChildProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Roadmap ve ayar state'leri
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobil kontrolünü useEffect ile state'e taşı
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [activeTab, setActiveTab] = useState<'profile'|'roadmap'>('profile');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // Yeni state'ler
  const [isLiterate, setIsLiterate] = useState(child?.is_literate ?? false);
  const [wantsTTS, setWantsTTS] = useState(child?.wants_tts ?? false);

  useEffect(() => {
    if (!user?.id || !id) return;
    setLoading(true);
    supabase.from('children').select('*').eq('id', id).eq('user_id', user.id).single().then(({ data }) => {
      setChild(data);
      setIsLiterate(data?.is_literate ?? false);
      setWantsTTS(data?.wants_tts ?? false);
      setLoading(false);
    });
  }, [user, id]);

  useEffect(() => {
    if (!id) return;
    setPlanLoading(true);
    // Kategorileri ve roadmap'i çek
    Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('concept_roadmap').select('*').eq('child_id', id) // .single() kaldırıldı
    ]).then(([catRes, roadmapRes]) => {
      const allCats = catRes.data || [];
      setCategories(allCats);
      // Gelen veri array, ilk elemanını al
      const roadmapData = roadmapRes.data?.[0]; 
      if (roadmapData && roadmapData.concepts_order) {
        const planIds = new Set(roadmapData.concepts_order);
        setRoadmap(allCats.filter((c:any) => planIds.has(c.id)));
      } else {
        setRoadmap([]);
      }
      setPlanLoading(false);
    });
  }, [id]);

  const handleAddConcept = async (cat: any) => {
    const newPlan = [...roadmap, cat];
    setRoadmap(newPlan);
    // DB'ye yaz
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: id,
        concepts_order: newPlan.map((c: any) => Number(c.id))
      }
    ], { onConflict: 'child_id' });
  };
  const handleRemoveConcept = async (cat: any) => {
    const newPlan = roadmap.filter((c: any) => c.id !== cat.id);
    setRoadmap(newPlan);
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: id,
        concepts_order: newPlan.map((c: any) => Number(c.id))
      }
    ], { onConflict: 'child_id' });
  };

  // Çocuk yaşını hesapla (doğum yılı yoksa "-" göster)
  const childAge = child?.birth_year ? (new Date().getFullYear() - child.birth_year) : '-';
  // Avatar gösterimi
  const avatar = child?.avatar ? (
    <span style={{display:'block',width:96,height:96}} dangerouslySetInnerHTML={{__html:child.avatar}} />
  ) : null;
  const GenderSVG = child?.gender === 'female' ? (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#f8c9d3" stroke="#e67e22" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#f8c9d3"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#e67e22"/></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#bde6f7" stroke="#2c3e50" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#bde6f7"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#7b8fa1"/><rect x="8" y="7" width="12" height="4" rx="2" fill="#7b8fa1"/></svg>
  );
  const AgeSVG = (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2"/><ellipse cx="14" cy="18" rx="7" ry="4" fill="#fff"/><ellipse cx="14" cy="18" rx="4" ry="2.2" fill="#f9d7a0"/><ellipse cx="11.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="17.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="11.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="17.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="14" cy="21.5" rx="2.2" ry="1.1" fill="#e0b97d"/></svg>
  );

  // Avatar güncelleme fonksiyonu
  const handleAvatarUpdate = async (newData: { avatar: string; is_literate: boolean; wants_tts: boolean }) => {
    if (!child?.id) return;
    await supabase.from('children').update({ avatar: newData.avatar, is_literate: newData.is_literate, wants_tts: newData.wants_tts }).eq('id', child.id);
    setChild({ ...child, avatar: newData.avatar, is_literate: newData.is_literate, wants_tts: newData.wants_tts });
    setIsLiterate(newData.is_literate);
    setWantsTTS(newData.wants_tts);
    setShowAvatarModal(false);
  };
  // Silme fonksiyonu
  const handleDelete = async () => {
    if (!child?.id) return;
    await supabase.from('children').delete().eq('id', child.id);
    router.push('/portal/children');
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (!child) return <div style={{padding:40}}>Çocuk bulunamadı.</div>;

  // Mobilde alt alta, masaüstünde yan yana panel
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f7f4ed'}}>
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
      <main style={{flex:1,display:'flex',flexDirection:'column',minHeight:'100vh',padding:'0'}}>
        <div style={{width:'100%',background:'#fff',boxShadow:'0 2px 8px #f0f0f0',padding:'18px 0 8px 0',position:'sticky',top:0,zIndex:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
          <h2 style={{fontWeight:800, color:'#2c3e50',fontSize:'1.5rem',textAlign:'center',flex:1}}>{child.name} Profili & Ayarları</h2>
          <div style={{width:120}} />
        </div>
        {/* Mobilde alt alta, masaüstünde yan yana panel */}
        <div style={{display:'flex',flex:1,gap:isMobile?20:40,alignItems:'flex-start',justifyContent:'center',padding:isMobile?'18px':'40px',flexWrap:'wrap',transition:'all 0.3s'}}>
          {/* Sol panel: Profil kartı + Kavramlar */}
          <section style={{flex:'1 1 360px',maxWidth:520,minWidth:320,background:'linear-gradient(135deg, #f8c9d3, #fdebe2)',borderRadius:32,padding:isMobile?'24px 18px':'40px 32px',boxShadow:'0 8px 32px rgba(248,201,211,0.2)',display:'flex',flexDirection:'column',gap:28,transition:'all 0.3s',alignSelf:'stretch'}}>
            {/* Profil Kartı */}
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:28,marginBottom:18,justifyContent:'flex-start'}}>
              {/* Avatar: 120x120 boyutunda, SVG içeriği tam kaplayacak */}
              <span className="avatar-container" style={{display:'flex',width:120,height:120,minWidth:120,minHeight:120,borderRadius:'50%',boxShadow:'0 4px 12px rgba(230,126,34,0.3)',background:'#fff',alignItems:'center',justifyContent:'center',padding:4,border:'3px solid #e67e22'}} dangerouslySetInnerHTML={{__html:child.avatar}} />
              <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
                <div style={{fontWeight:900,fontSize:28,color:'#2c3e50',letterSpacing:0.2}}>{child.name}</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {child.birth_year && (
                    <span style={{color:'#7b8fa1',fontWeight:700,fontSize:18}}>Yaş: {childAge}</span>
                  )}
                  {child.theme && (
                    <div style={{display:'flex',alignItems:'center',gap:8,color:'#7b8fa1',fontWeight:700,fontSize:18}}>
                      <CustomThemeIcon /> Tema: {child.theme}
                    </div>
                  )}
                </div>
                {child.note && <div style={{color:'#e67e22',fontWeight:700,fontSize:15,marginTop:4}}>{child.note}</div>}
              </div>
            </div>

            {/* Butonlar - responsive */}
            <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
              <button aria-label="Profili Düzenle" style={{background:'#ffe6b3',color:'#e67e22',borderRadius:12,padding:'12px 24px',fontWeight:800,border:'none',cursor:'pointer',transition:'background 0.2s',fontSize:16,boxShadow:'0 2px 8px #ffe6b3',display:'flex',alignItems:'center',gap:8}} tabIndex={0} onClick={()=>setShowAvatarModal(true)}>
                <CustomEditIcon /> Profili Düzenle
              </button>
              <button aria-label="Çocuğu Sil" style={{background:'#ffe6b3',color:'#e74c3c',borderRadius:12,padding:'12px 24px',fontWeight:800,border:'none',cursor:'pointer',transition:'background 0.2s',fontSize:16,boxShadow:'0 2px 8px #ffe6b3',display:'flex',alignItems:'center',gap:8}} tabIndex={0} onClick={handleDelete}>
                <CustomTrashIcon /> Sil
              </button>
            </div>
            
            {showAvatarModal && (
              <AddChildModal
                onAdd={handleAvatarUpdate}
                onClose={()=>setShowAvatarModal(false)}
              />
            )}
            {/* Kavramlar başlığı ve liste */}
            <h3 style={{ margin: 0, fontWeight: 900, color: '#2c3e50',fontSize:'1.18rem',marginBottom:14,letterSpacing:0.1 }}>Tüm Kavramlar</h3>
            <div style={{flex:1,overflowY:'auto',minHeight:120,maxHeight:isMobile?260:260,paddingRight:4}}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0,display:'flex',flexDirection:'column',gap:12 }}>
                {categories.length === 0 ? (
                  <li style={{color:'#7b8fa1',fontWeight:700,display:'flex',alignItems:'center',gap:10,fontSize:16}}><span style={{fontSize:24}}>🧩</span> Hiç kavram yok.</li>
                ) : categories.filter(cat => !roadmap.find((c:any)=>c.id===cat.id)).length === 0 ? (
                  <li style={{color:'#7b8fa1',fontWeight:700,display:'flex',alignItems:'center',gap:10,fontSize:16}}><span style={{fontSize:24}}>🎉</span> Tüm kavramlar plana eklendi.</li>
                ) : categories.filter(cat => !roadmap.find((c:any)=>c.id===cat.id)).map(cat => (
                  <li key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12,justifyContent:'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize:15 }}>{cat.name}</span>
                    <button aria-label="Kavramı Öğrenme Planına Ekle" style={{ background: '#4CAF50', color: '#fff', padding: '7px 18px', fontSize: 15, borderRadius: 12, border:'none',cursor:'pointer',transition:'background 0.2s',fontWeight:800,boxShadow:'0 2px 8px #bde6d3' }} onClick={() => handleAddConcept(cat)} tabIndex={0}>Ekle</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* Sağ panel: Roadmap */}
          <section style={{flex:'2 1 520px',maxWidth:900,minWidth:280,background:'#bde6d3',borderRadius:32,padding:isMobile?'24px 12px':'40px 40px',boxShadow:'0 4px 24px rgba(189,230,211,0.13)',display:'flex',flexDirection:'column',gap:28,transition:'all 0.3s'}}>
            <h3 style={{ margin: 0, fontWeight: 900, color: '#2c3e50',fontSize:'1.18rem',marginBottom:14,letterSpacing:0.1 }}>Öğrenme Planı</h3>
            {planLoading ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:32}}>
                <span className="loader" aria-label="Yükleniyor" />
                <span style={{color:'#7b8fa1',fontWeight:700,fontSize:16}}>Yükleniyor...</span>
              </div>
            ) : (
              roadmap.length === 0 ? (
                <div style={{color:'#7b8fa1',fontWeight:700,display:'flex',alignItems:'center',gap:10,fontSize:16}}><span style={{fontSize:24}}>📝</span> Henüz kavram eklenmedi. Soldan ekleyin.</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:22}}>
                  {/* Kronolojik çizgi */}
                  <div style={{display:'flex',alignItems:'center',gap:0,margin:'12px 0',overflowX:'auto',paddingBottom:8}}>
                    {roadmap.map((cat, idx) => (
                      <React.Fragment key={cat.id}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                          <div style={{width:52,height:52,borderRadius:'50%',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,color:'#4CAF50',boxShadow:'0 2px 8px #bde6d3',border:'2.5px solid #4CAF50',transition:'box-shadow 0.2s'}}>{idx+1}</div>
                          <span style={{fontSize:15,fontWeight:800,color:'#2c3e50',marginTop:2}}>{cat.name}</span>
                          <button aria-label="Kavramı Öğrenme Planından Çıkar" style={{ background: '#E57373', color: '#fff', padding: '5px 14px', fontSize: 14, borderRadius: 10, border:'none',cursor:'pointer',transition:'background 0.2s',fontWeight:800,marginTop:4,boxShadow:'0 2px 8px #f8c9d3' }} onClick={() => handleRemoveConcept(cat)} tabIndex={0}>Çıkar</button>
                        </div>
                        {idx < roadmap.length-1 && <div style={{width:36,height:4,background:'#4CAF50',borderRadius:2,margin:'0 2px'}}></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      </main>
    </div>
  );
} 