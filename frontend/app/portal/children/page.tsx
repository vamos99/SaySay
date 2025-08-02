"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from '../../utils/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { PortalLayout } from "@/components/layout/PortalLayout";
import { AddChildModal } from "../components/AddChildModal";
import { CustomSadChildIcon } from '../../components/icons/CustomIcons';

export default function ChildrenPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        
        const localSelectedId = localStorage.getItem('selected_child_id');
        if (localSelectedId && data?.find(c => c.id === localSelectedId)) {
          setSelectedChildId(localSelectedId);
        }
        
        if (data && data.length > 0) {
          await loadAllChildStats();
        }
      });
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      refreshStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [children]);

  const loadAllChildStats = async () => {
    setStatsLoading(true);
    try {
      const stats: {[key: string]: any} = {};
      
      // Tüm çocuk ID'lerini topla
      const childIds = children.map(child => child.id);
      
      if (childIds.length === 0) {
        setStatsLoading(false);
        return;
      }
      
      // Tek seferde tüm interaction_logs'ları çek
      const { data: allLogs } = await supabase
        .from('interaction_logs')
        .select('*')
        .in('child_id', childIds);
      
      // Tek seferde tüm ai_content'leri çek
      const { data: allContent } = await supabase
        .from('ai_content')
        .select('child_id, concept')
        .in('child_id', childIds)
        .eq('is_active', true);
      
      // Her çocuk için istatistikleri hesapla
      for (const child of children) {
        const childLogs = allLogs?.filter(log => log.child_id === child.id) || [];
        const childContent = allContent?.filter(content => content.child_id === child.id) || [];
        
        stats[child.id] = {
          totalInteractions: childLogs.length,
          correctAnswers: childLogs.filter(l => l.details?.is_correct).length,
          conceptsLearned: childContent.length,
          lastPlayed: childLogs.length > 0 
            ? new Date(Math.max(...childLogs.map(l => new Date(l.created_at).getTime()))).toLocaleDateString('tr-TR') 
            : 'Hiç oynamamış'
        };
      }
      
      setChildStats(stats);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    localStorage.setItem('selected_child_id', childId);
  };

  const refreshStats = () => {
    if (children.length > 0) {
      loadAllChildStats();
    }
  };

  const handleAddChild = async (child: any) => {
    setError("");
    if (!user?.id) return;
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
  };

  const handleDelete = async (id: string) => {
    await supabase.from('children').delete().eq('id', id);
    setChildren(children.filter(c => c.id !== id));
  };

  const getAge = (birthYear: number) => {
    if (!birthYear) return '-';
    return new Date().getFullYear() - birthYear;
  };

  const GenderSVG = (g: string) => g === 'female' ? (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#f8c9d3" stroke="#e67e22" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#f8c9d3"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#e67e22"/></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#bde6f7" stroke="#2c3e50" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#bde6f7"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#7b8fa1"/><rect x="8" y="7" width="12" height="4" rx="2" fill="#7b8fa1"/></svg>
  );
  const AgeSVG = (
    <svg width="22" height="22" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2"/><ellipse cx="14" cy="18" rx="7" ry="4" fill="#fff"/><ellipse cx="14" cy="18" rx="4" ry="2.2" fill="#f9d7a0"/><ellipse cx="11.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="17.5" cy="15" rx="2.2" ry="2.8" fill="#fff"/><ellipse cx="11.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="17.5" cy="15.7" rx="1.1" ry="1.4" fill="#5a6a78"/><ellipse cx="14" cy="21.5" rx="2.2" ry="1.1" fill="#e0b97d"/></svg>
  );

  return (
    <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
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
              Çocuklarınızı Yönetin 👶
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Çocuklarınızın profillerini düzenleyin ve gelişimlerini takip edin
            </p>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid #3b82f6',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{
                color: '#6b7280',
                fontWeight: '600',
                fontSize: '1.125rem'
              }}>Yükleniyor...</span>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {children.length === 0 ? (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    color: '#6b7280',
                    gap: '1rem'
                  }}>
                    <CustomSadChildIcon />
                    Henüz çocuk eklenmedi.
                  </div>
                ) : children.map(child => (
                  <div 
                    key={child.id} 
                    style={{
                      background: selectedChildId === child.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      minHeight: '300px',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: selectedChildId === child.id ? '2px solid #10b981' : '1px solid rgba(59, 130, 246, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleSelectChild(child.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      {child.avatar?.startsWith('<svg') ? (
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                          <span style={{display:'block',width:32,height:32}} dangerouslySetInnerHTML={{__html:child.avatar}} />
                        </div>
                      ) : (
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                          {child.avatar ? (
                            <img src={child.avatar} alt="Avatar" style={{width:32,height:32,borderRadius:'50%'}} />
                          ) : (
                            <span style={{color:'white',fontWeight:'bold',fontSize:'1.25rem'}}>
                              {child.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                      <div>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '1.25rem',
                          color: '#1f2937',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {child.name}
                          {selectedChildId === child.id && (
                            <span style={{
                              color: '#10b981',
                              fontSize: '0.875rem',
                              background: 'rgba(16, 185, 129, 0.1)',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.5rem',
                              fontWeight: '600'
                            }}>✓ Seçili</span>
                          )}
                        </div>
                        {child.birth_year && (
                          <div style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            Yaş: {getAge(child.birth_year)} | Tema: {child.theme}
                          </div>
                        )}
                        {child.note && (
                          <div style={{
                            color: '#f59e0b',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            marginTop: '0.25rem'
                          }}>{child.note}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* İstatistikler */}
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      marginBottom: '1rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <h4 style={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        marginBottom: '0.75rem',
                        color: '#1f2937'
                      }}>📊 İstatistikler</h4>
                      {statsLoading ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#6b7280',
                          fontSize: '0.875rem'
                        }}>
                          <div style={{
                            width: '1rem',
                            height: '1rem',
                            border: '2px solid #3b82f6',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          İstatistikler yükleniyor...
                        </div>
                      ) : childStats[child.id] ? (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          fontSize: '0.875rem'
                        }}>
                          <div>
                            <span style={{fontWeight:'600',color:'#6b7280'}}>Toplam Etkileşim:</span>
                            <div style={{fontWeight:'bold',color:'#1f2937'}}>{childStats[child.id].totalInteractions}</div>
                          </div>
                          <div>
                            <span style={{fontWeight:'600',color:'#6b7280'}}>Doğru Cevaplar:</span>
                            <div style={{fontWeight:'bold',color:'#10b981'}}>{childStats[child.id].correctAnswers}</div>
                          </div>
                          <div>
                            <span style={{fontWeight:'600',color:'#6b7280'}}>Öğrenilen Kavram:</span>
                            <div style={{fontWeight:'bold',color:'#1f2937'}}>{childStats[child.id].conceptsLearned}</div>
                          </div>
                          <div>
                            <span style={{fontWeight:'600',color:'#6b7280'}}>Son Oynama:</span>
                            <div style={{fontWeight:'bold',color:'#f59e0b'}}>{childStats[child.id].lastPlayed}</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          fontStyle: 'italic'
                        }}>
                          İstatistik bulunamadı
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      <button 
                        aria-label="Profili ve Ayarları Görüntüle" 
                        style={{
                          background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          flex: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          router.push(`/portal/children/${child.id}`);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        Profili & Ayarları
                      </button>
                      <button 
                        aria-label="Çocuğu Sil" 
                        style={{
                          background: 'linear-gradient(to right, #ef4444, #dc2626)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '0.875rem',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                          flex: 1
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleDelete(child.id);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Çocuk Ekle Butonu */}
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }} 
                  onClick={() => setShowAdd(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    fontSize: '2rem'
                  }}>
                    +
                  </div>
                  Çocuk Ekle
                </div>
              </div>
              
              {/* Hata Mesajı */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  color: '#dc2626',
                  fontWeight: '600'
                }}>
                  <span style={{fontSize:'1.5rem'}}>⚠️</span> {error}
                </div>
              )}
              
              {showAdd && <AddChildModal onAdd={handleAddChild} onClose={() => setShowAdd(false)} />}
            </>
          )}
    </PortalLayout>
  );
} 