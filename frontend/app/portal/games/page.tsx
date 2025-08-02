"use client";
import React, { useEffect, useState, Fragment } from "react";
import { PortalLayout } from "../../components/layout/PortalLayout";
import { useRouter } from "next/navigation";
import { GameIcon, SettingsIcon } from '../../components/icons/CustomIcons';
import { useAuth } from '../../utils/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { gameCache } from '../../utils/gameCache';

export default function GamesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    supabase.from('children')
      .select('id, name, avatar, birth_year, theme')
      .eq('user_id', user.id)
      .then(({ data }: { data: any }) => {
        setChildren(data || []);
        
        const localSelectedId = localStorage.getItem('selected_child_id');
        if (localSelectedId && data?.find((c: any) => c.id === localSelectedId)) {
          setSelectedChildId(localSelectedId);
          setSelectedChild(data.find((c: any) => c.id === localSelectedId));
        } else if (data && data.length > 0) {
          setSelectedChildId(data[0].id);
          setSelectedChild(data[0]);
          localStorage.setItem('selected_child_id', data[0].id);
        }
      });
  }, [user]);

  const handleSelectChild = (childId: string) => {
    const child = children.find(c => c.id === childId);
    
    // Cache'de yoksa içerik yükle
    if (!gameCache.has(childId)) {
      loadChildContent(childId, child?.name || '');
    }
    
    setSelectedChildId(childId);
    setSelectedChild(child);
    localStorage.setItem('selected_child_id', childId);
    setShowChildSelector(false);
  };

  const loadChildContent = async (childId: string, childName: string) => {
    try {
      setIsLoadingContent(true);
      
      // Backend'den içerik çek
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ child_id: childId })
      });

      if (!response.ok) {
        throw new Error('Backend isteği başarısız');
      }

      const data = await response.json();
      
      if (data.all_concepts && data.all_concepts.length > 0) {
        const filteredContent = data.all_concepts.filter((c: any) => !c.error);
        gameCache.set(childId, filteredContent, childName);
      } else {
        console.error('❌ Geçerli içerik alınamadı');
      }
    } catch (error) {
      console.error('❌ İçerik yükleme hatası:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleStartGame = (gamePath: string) => {
    if (!selectedChildId) {
      setShowChildSelector(true);
      return;
    }
    
    router.push(gamePath);
  };

  return (
    <Fragment>
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
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
              Eğitici Oyunlar 🎮
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Çocuğunuzun öğrenme yolculuğunu eğlenceli oyunlarla destekleyin
            </p>
          </div>

          {/* Seçili çocuk bilgisi */}
          {selectedChild && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
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
                  {selectedChild.avatar?.startsWith('<svg') ? (
                    <span style={{display:'block',width:32,height:32}} dangerouslySetInnerHTML={{__html:selectedChild.avatar}} />
                  ) : (
                    selectedChild.avatar ? (
                      <img src={selectedChild.avatar} alt="Avatar" style={{width:32,height:32,borderRadius:'50%'}} />
                    ) : (
                      <span style={{color:'white',fontWeight:'bold',fontSize:'1.25rem'}}>
                        {selectedChild.name.charAt(0).toUpperCase()}
                      </span>
                    )
                  )}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {selectedChild.name} ✓ Seçili
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Tema: {selectedChild.theme} | Yaş: {new Date().getFullYear() - selectedChild.birth_year}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChildSelector(true)}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
                Çocuk Değiştir
              </button>
            </div>
          )}
          
          {/* Games Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Oyun 1: Kavram Oyunu */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <GameIcon />
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#1f2937',
                  margin: 0
                }}>Kavram Oyunu</h3>
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: '1.5',
                margin: 0
              }}>Çocuğunuzun kavramları temalara göre eğlenceli şekilde öğrenmesini sağlayan oyun.</p>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: 'auto'
              }}>
                              <button 
                onClick={() => handleStartGame('/portal/games/oyun1')} 
                disabled={isLoadingContent}
                style={{
                  background: isLoadingContent 
                    ? 'linear-gradient(to right, #9ca3af, #6b7280)' 
                    : 'linear-gradient(to right, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: isLoadingContent ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  flex: 1
                }}
                  onMouseEnter={(e) => {
                    if (!isLoadingContent) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  {isLoadingContent ? 'Yükleniyor...' : 'Başlat'}
                </button>
                <button 
                  onClick={() => router.push('/portal/roadmap')} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  }}
                >
                  <SettingsIcon /> Ayarlar
                </button>
              </div>
            </div>

            {/* Oyun 2: Gelecekte eklenecek oyunlar için boş kart */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(156, 163, 175, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              opacity: 0.6,
              filter: 'grayscale(0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(45deg, #9ca3af, #6b7280)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7
                }}>
                  <GameIcon />
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#9ca3af',
                  margin: 0
                }}>Oyun 2 (Yakında)</h3>
              </div>
              <p style={{
                color: '#9ca3af',
                fontSize: '1rem',
                lineHeight: '1.5',
                margin: 0
              }}>Yeni oyunlar çok yakında burada olacak!</p>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: 'auto'
              }}>
                <button 
                  disabled 
                  style={{
                    background: '#f3f4f6',
                    color: '#9ca3af',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'not-allowed',
                    flex: 1
                  }}
                >
                  Başlat
                </button>
                <button 
                  disabled 
                  style={{
                    background: '#f3f4f6',
                    color: '#9ca3af',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <SettingsIcon /> Ayarlar
                </button>
              </div>
            </div>

            {/* Oyun 3: Yeni aktif oyun kartı */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(45deg, #ec4899, #db2777)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}>
                  <GameIcon />
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: '#1f2937',
                  margin: 0
                }}>Oyun 3</h3>
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: '1.5',
                margin: 0
              }}>Yeni bir oyun! Eğlenceli ve öğretici içerikler çok yakında burada.</p>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: 'auto'
              }}>
                <button 
                  onClick={() => handleStartGame('/portal/games/oyun3')} 
                  style={{
                    background: 'linear-gradient(to right, #ec4899, #db2777)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
                  }}
                >
                  Başlat
                </button>
                <button 
                  onClick={() => router.push('/portal/games/oyun3/settings')} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  }}
                >
                  <SettingsIcon /> Ayarlar
                </button>
              </div>
            </div>
          </div>
        </div>
      </PortalLayout>

      {/* Çocuk Seçici Modal */}
      {showChildSelector && (
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
            }}>Çocuk Seç</h3>
            <p style={{
              marginBottom: '1.5rem',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>Oynamak için bir çocuk profili seçmelisin.</p>
            
            {children.length === 0 && (
              <div style={{
                color: '#6b7280',
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(156, 163, 175, 0.1)',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                Hiç çocuk profili yok. Önce çocuk ekleyin.
              </div>
            )}
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              {children.map(child => (
                <button 
                  key={child.id} 
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    background: selectedChildId === child.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                    border: selectedChildId === child.id ? '2px solid #10b981' : '1px solid rgba(59, 130, 246, 0.1)',
                    color: '#1f2937',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }} 
                  onClick={() => handleSelectChild(child.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>{child.name} ({child.birth_year})</span>
                  {selectedChildId === child.id && (
                    <span style={{
                      color: '#10b981',
                      fontWeight: 'bold'
                    }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowChildSelector(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #6b7280, #4b5563)',
                color: 'white',
                borderRadius: '0.75rem',
                padding: '1rem',
                fontWeight: '600',
                border: 'none',
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
              Kapat
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
} 