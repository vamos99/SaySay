"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../utils/AuthContext';
import { supabase } from '../../../utils/supabaseClient';

import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { AddChildModal } from '../../components/AddChildModal';
import { CustomThemeIcon, CustomEditIcon, CustomTrashIcon, ExpandSidebarIcon } from '../../../components/icons/CustomIcons';
import LoadingScreen from '../../../components/layout/LoadingScreen';
import { createChildPIN, updateChildPIN } from '../../../utils/pinUtils';

export default function ChildProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile'|'roadmap'>('profile');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isLiterate, setIsLiterate] = useState(child?.is_literate ?? false);
  const [wantsTTS, setWantsTTS] = useState(child?.wants_tts ?? false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingConcept, setPendingConcept] = useState<any>(null);
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinMessage, setPinMessage] = useState('');
  const [newPIN, setNewPIN] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!user?.id || !id) return;
    setLoading(true);
    supabase.from('children')
      .select('id, name, gender, theme, avatar, birth_year, is_literate, wants_tts, note')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }: { data: any }) => {
        setChild(data);
        setIsLiterate(data?.is_literate ?? false);
        setWantsTTS(data?.wants_tts ?? false);
        setLoading(false);
      });
  }, [user, id]);

  useEffect(() => {
    if (!id) return;
    setPlanLoading(true);
    Promise.all([
      supabase.from('categories').select('id, name, default_verb').order('id'),
      supabase.from('concept_roadmap').select('concepts_order').eq('child_id', id)
    ]).then(([catRes, roadmapRes]) => {
      const allCats = catRes.data || [];
      const roadmapData = roadmapRes.data?.[0];
      if (roadmapData && roadmapData.concepts_order) {
        const planNames = new Set(roadmapData.concepts_order);
        setRoadmap(allCats.filter((c:any) => planNames.has(c.name)));
      } else {
        setRoadmap([]);
      }
      setCategories(allCats);
      setPlanLoading(false);
    });
  }, [id]);

  const handleAddConcept = async (cat: any) => {
    setPendingConcept(cat);
    setShowApprovalModal(true);
  };

  const handleConfirmAddConcept = async () => {
    if (!pendingConcept) return;
    
    const newPlan = [...roadmap, pendingConcept];
    setRoadmap(newPlan);
    
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: id,
        concepts_order: newPlan.map((c: any) => c.name)
      }
    ], { onConflict: 'child_id' });
    
    try {
      await fetch('https://vertex-ai-backend-1003061737705.us-central1.run.app/generate-full-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: id })
      });
    } catch (error) {
      console.error('İçerik üretme hatası:', error);
    }
    
    setShowApprovalModal(false);
    setPendingConcept(null);
  };

  const handleCancelAddConcept = () => {
    setShowApprovalModal(false);
    setPendingConcept(null);
  };

  const handleRemoveConcept = async (cat: any) => {
    const newPlan = roadmap.filter((c: any) => c.id !== cat.id);
    setRoadmap(newPlan);
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: id,
        concepts_order: newPlan.map((c: any) => c.name)
      }
    ], { onConflict: 'child_id' });
  };

  const childAge = child?.birth_year ? (new Date().getFullYear() - child.birth_year) : '-';
  
  const avatar = child?.avatar?.startsWith('<svg') ? (
    <span style={{display:'block',width:96,height:96}} dangerouslySetInnerHTML={{__html:child.avatar}} />
  ) : child?.avatar ? (
    <img src={child.avatar} alt="Avatar" style={{display:'block',width:96,height:96,borderRadius:'50%'}} />
  ) : null;

  const handleAvatarUpdate = async (newData: { avatar: string; is_literate: boolean; wants_tts: boolean }) => {
    if (!child?.id) return;
    await supabase.from('children').update({ avatar: newData.avatar, is_literate: newData.is_literate, wants_tts: newData.wants_tts }).eq('id', child.id);
    setChild({ ...child, avatar: newData.avatar, is_literate: newData.is_literate, wants_tts: newData.wants_tts });
    setIsLiterate(newData.is_literate);
    setWantsTTS(newData.wants_tts);
    setShowAvatarModal(false);
  };

  const handleDelete = async () => {
    if (!child?.id) return;
    await supabase.from('children').delete().eq('id', child.id);
    router.push('/portal/children');
  };

  const handleCreatePIN = async () => {
    try {
      setPinError('');
      setPinSuccess('');
      setNewPIN('');
      
      const { data: existingPin } = await supabase
        .from('children')
        .select('pin_hash')
        .eq('id', id)
        .single();
      
      if (existingPin?.pin_hash) {
        setPinMessage(`Mevcut PIN: ${existingPin.pin_hash}`);
      } else {
        setPinMessage('Henüz PIN oluşturulmamış. Lütfen "PIN Güncelle" butonunu kullanın.');
      }
      setShowPINModal(true);
    } catch (error) {
      setPinMessage('PIN bilgisi alınamadı');
      setShowPINModal(true);
    }
  };

  const handleUpdatePIN = async () => {
    setPinError('');
    setPinSuccess('');
    setNewPIN('');
    setShowPINModal(true);
  };

  const handleSubmitPIN = async () => {
    if (!newPIN) {
      setPinError('PIN giriniz');
      return;
    }
    
    if (newPIN.length !== 4) {
      setPinError('PIN 4 haneli olmalıdır');
      return;
    }
    
    if (!/^\d+$/.test(newPIN)) {
      setPinError('PIN sadece rakam içermelidir');
      return;
    }
    
    try {
      await updateChildPIN(id as string, newPIN);
      setPinSuccess(`PIN güncellendi: ${newPIN}`);
      setNewPIN('');
      
      setTimeout(() => {
        setShowPINModal(false);
        setPinSuccess('');
        setPinError('');
      }, 2000);
    } catch (error) {
      setPinError('PIN güncellenemedi');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (!child) return <div style={{padding:40}}>Çocuk bulunamadı.</div>;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {!sidebarOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <ExpandSidebarIcon />
        </button>
      )}

      <main style={{
        flex: 1,
        padding: '2rem',
        minHeight: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Floating Animated Elements */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '12%',
          width: '35px',
          height: '35px',
          background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #10b981, #3b82f6)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 7s ease-in-out infinite'
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {child.name} Profili & Ayarları 👶
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Çocuğunuzun profilini düzenleyin ve öğrenme planını yönetin
            </p>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Sol Panel: Profil Kartı */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Profil Bilgileri */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                  border: '3px solid #fff'
                }}>
                  {avatar}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>{child.name}</h2>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {child.birth_year && (
                      <div style={{
                        color: '#6b7280',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>Yaş: {childAge}</div>
                    )}
                    {child.theme && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#6b7280',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>
                        <CustomThemeIcon /> Tema: {child.theme}
                      </div>
                    )}
                  </div>
                  {child.note && (
                    <div style={{
                      color: '#f59e0b',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem'
                    }}>{child.note}</div>
                  )}
                </div>
              </div>

              {/* Butonlar */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <CustomEditIcon /> Profili Düzenle
                </button>
                <button 
                  onClick={handleCreatePIN}
                  style={{
                    background: 'linear-gradient(to right, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔐 PIN Görüntüle
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={handleUpdatePIN}
                  style={{
                    background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔄 PIN Güncelle
                </button>
                <button 
                  onClick={handleDelete}
                  style={{
                    background: 'linear-gradient(to right, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <CustomTrashIcon /> Sil
                </button>
              </div>

              {/* Kavramlar Listesi */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>📚 Tüm Kavramlar</h3>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {categories.length === 0 ? (
                      <div style={{
                        color: '#6b7280',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                      }}>
                        <span style={{fontSize:'1.5rem'}}>🧩</span> Hiç kavram yok.
                      </div>
                    ) : categories.filter(cat => !roadmap.find((c:any)=>c.id===cat.id)).length === 0 ? (
                      <div style={{
                        color: '#6b7280',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                      }}>
                        <span style={{fontSize:'1.5rem'}}>🎉</span> Tüm kavramlar plana eklendi.
                      </div>
                    ) : categories.filter(cat => !roadmap.find((c:any)=>c.id===cat.id)).map((cat, index) => (
                      <div key={`category-${cat.id}-${index}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          color: '#1f2937'
                        }}>{cat.name}</span>
                        <button 
                          onClick={() => handleAddConcept(cat)}
                          style={{
                            background: 'linear-gradient(to right, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Panel: Öğrenme Planı */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>📝 Öğrenme Planı</h3>
              
              {planLoading ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '2rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    border: '3px solid #10b981',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span style={{
                    color: '#6b7280',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>Yükleniyor...</span>
                </div>
              ) : roadmap.length === 0 ? (
                <div style={{
                  color: '#6b7280',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <span style={{fontSize:'1.5rem'}}>📝</span> Henüz kavram eklenmedi. Soldan ekleyin.
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  {/* Kronolojik çizgi */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    margin: '1rem 0',
                    overflowX: 'auto',
                    paddingBottom: '1rem'
                  }}>
                    {roadmap.map((cat, idx) => (
                      <Fragment key={`roadmap-${cat.id}-${idx}`}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          minWidth: '120px'
                        }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            border: '2px solid #fff'
                          }}>
                            {idx+1}
                          </div>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            textAlign: 'center'
                          }}>{cat.name}</span>
                          <button 
                            onClick={() => handleRemoveConcept(cat)}
                            style={{
                              background: 'linear-gradient(to right, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              padding: '0.5rem 1rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            Çıkar
                          </button>
                        </div>
                        {idx < roadmap.length-1 && (
                          <div style={{
                            width: '2rem',
                            height: '0.25rem',
                            background: 'linear-gradient(to right, #10b981, #059669)',
                            borderRadius: '0.125rem',
                            margin: '0 0.5rem'
                          }}></div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAvatarModal && (
        <AddChildModal
          onAdd={handleAvatarUpdate}
          onClose={() => setShowAvatarModal(false)}
          isEditMode={true}
          childId={id as string}
        />
      )}

      {showApprovalModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>Kavram Ekleme Onayı</h3>
            <p style={{
              marginBottom: '0.75rem',
              color: '#1f2937',
              lineHeight: '1.5'
            }}>
              <strong>{pendingConcept?.name}</strong> kavramını öğrenme planına eklemek istiyor musunuz?
            </p>
            <p style={{
              marginBottom: '1.5rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              Bu kavram için AI tarafından özel içerik üretilecek ve oyunlarda kullanılacak.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={handleConfirmAddConcept}
                style={{
                  flex: 1,
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Onayla
              </button>
              <button 
                onClick={handleCancelAddConcept}
                style={{
                  flex: 1,
                  background: 'linear-gradient(to right, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(107, 114, 128, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {showPINModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>PIN Yönetimi</h3>
            
            {pinMessage ? (
              <p style={{
                marginBottom: '1.5rem',
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>{pinMessage}</p>
            ) : (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  display: 'block',
                  color: '#374151'
                }}>
                  Yeni PIN (4 haneli):
                </label>
                <input
                  type="password"
                  value={newPIN}
                  onChange={(e) => setNewPIN(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease'
                  }}
                  placeholder="0000"
                  maxLength={4}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button 
                  onClick={handleSubmitPIN}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  PIN Güncelle
                </button>
              </div>
            )}
            
            {pinError && (
              <div style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: '600',
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>{pinError}</div>
            )}
            {pinSuccess && (
              <div style={{
                color: '#059669',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: '600',
                padding: '0.75rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>{pinSuccess}</div>
            )}
            
            <button 
              onClick={() => {
                setShowPINModal(false);
                setPinMessage('');
                setPinError('');
                setPinSuccess('');
                setNewPIN('');
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #6b7280, #4b5563)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(107, 114, 128, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 