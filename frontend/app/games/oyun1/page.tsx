"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { Oyun1Game } from "../../shared/components/games/Oyun1Game";
import LoadingScreen from "../../components/layout/LoadingScreen";

export default function Oyun1Page() {
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [childList, setChildList] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showChildModal, setShowChildModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChildren() {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: children, error } = await supabase
          .from('children')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Children fetch error:', error);
          setError('Çocuk bilgileri yüklenemedi');
          return;
        }

        setChildList(children || []);
        
        if (children && children.length > 0) {
          // Oyun ayarlarından seçilen çocuğu kontrol et
          const localSelectedId = localStorage.getItem('selected_child_id');
          if (localSelectedId && children.find(c => c.id === localSelectedId)) {
            setSelectedChildId(localSelectedId);
            setChild(children.find(c => c.id === localSelectedId));
          } else {
            setSelectedChildId(children[0].id);
            setChild(children[0]);
          }
        }
      } catch (error) {
        console.error('Children fetch error:', error);
        setError('Çocuk bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, [router]);

  const handleSelectChild = (id: string) => {
    const selectedChild = childList.find(c => c.id === id);
    setSelectedChildId(id);
    setChild(selectedChild);
    setShowChildModal(false);
  };

  if (loading) {
    return <LoadingScreen text="Yükleniyor..." />;
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          textAlign: 'center',
          color: '#dc2626'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>❌ Hata!</div>
          <div style={{
            fontSize: '1rem'
          }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          textAlign: 'center',
          color: '#2c3e50'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>👶 Çocuk Seçin</div>
          <div style={{
            fontSize: '1rem',
            marginBottom: '1.5rem'
          }}>Oyun oynamak için bir çocuk seçmelisiniz.</div>
          <button
            onClick={() => setShowChildModal(true)}
            style={{
              background: 'linear-gradient(to right, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            Çocuk Seç
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Oyun1Game 
        key={selectedChildId} // childId değişince component yeniden render edilir
        childId={selectedChildId!}
        onBackToMenu={() => router.push('/child-dashboard')}
        isChildPortal={true}
      />

      {/* Child Selection Modal */}
      {showChildModal && (
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
            
            {childList.length === 0 && (
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
              {childList.map(child => (
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
              onClick={() => setShowChildModal(false)}
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
    </>
  );
} 