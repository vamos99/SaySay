"use client";
import React, { useEffect, useState, Fragment } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../utils/AuthContext';
import { AnimatedBubbles } from '../components/AnimatedBubbles';
import LoadingScreen from '../../components/layout/LoadingScreen';

export default function RoadmapPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const [childId, setChildId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: cats } = await supabase.from('categories').select('id, name, default_verb').order('id');
      setCategories(cats || []);
      
      if (user?.id) {
        const { data: children } = await supabase.from('children').select('id');
        if (children && children.length > 0) {
          setChildId(children[0].id);
          const { data: roadmap } = await supabase.from('concept_roadmap').select('concepts_order').eq('child_id', children[0].id).single();
          if (roadmap && roadmap.concepts_order) {
            setPlan((cats || []).filter((c:any) => roadmap.concepts_order.includes(c.id.toString())));
            setCategories((cats || []).filter((c:any) => !roadmap.concepts_order.includes(c.id.toString())));
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const ALLOWED_CONCEPTS = ['Renkler', 'Sayılar', 'Büyük/Küçük', 'Duygular'];

  const handleAdd = async (cat: any) => {
    if (!childId) return;
    if (!ALLOWED_CONCEPTS.includes(cat.name)) return;
    const newPlan = [...plan, cat];
    setPlan(newPlan);
    setCategories(categories.filter(c => c.id !== cat.id));
    const concepts_order = newPlan.map((c: any) => c.name).filter((name: string) => ALLOWED_CONCEPTS.includes(name));
    if (concepts_order.length === 0) return;
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: childId,
        concepts_order
      }
    ], { onConflict: 'child_id' });
  };

  const handleRemove = async (cat: any) => {
    const newPlan = plan.filter((c: any) => c.id !== cat.id);
    setPlan(newPlan);
    setCategories([...categories, cat]);
    const concepts_order = newPlan.map((c: any) => c.name).filter((name: string) => ALLOWED_CONCEPTS.includes(name));
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: childId,
        concepts_order
      }
    ], { onConflict: 'child_id' });
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
              Kavram Oyunu Öğrenme Yolu 🗺️
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Çocuğunuzun öğrenme yolunu planlayın ve kavramları düzenleyin
            </p>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Sol: Tüm kavramlar */}
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
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>📚 Tüm Kavramlar</h3>
              
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
                    fontSize: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <span style={{fontSize:'1.5rem'}}>🎉</span> Tüm kavramlar plana eklendi!
                  </div>
                ) : categories.map(cat => (
                  <div key={cat.id} style={{
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
                      onClick={() => handleAdd(cat)}
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

            {/* Sağ: Öğrenme Planı */}
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
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>📝 Öğrenme Planı</h3>
              
              {plan.length === 0 ? (
                <div style={{
                  color: '#6b7280',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <span style={{fontSize:'1.5rem'}}>📝</span> Henüz kavram eklenmedi. Soldan ekleyin.
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {plan.map((cat, index) => (
                      <div key={cat.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        position: 'relative'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          <div style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            color: 'white'
                          }}>
                            {index + 1}
                          </div>
                          <span style={{
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            color: '#1f2937'
                          }}>{cat.name}</span>
                        </div>
                        <button 
                          onClick={() => handleRemove(cat)}
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
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => router.push('/portal')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '1rem 2rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    💾 Kaydet ve Geri Dön
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </PortalLayout>
    </Fragment>
  );
} 