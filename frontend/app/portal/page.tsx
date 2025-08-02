"use client";

import React, { useEffect, useState, Fragment } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { AIBrainIcon, CustomChartIcon, GameIcon as GameIconComponent, ReportIcon as ReportIconComponent, SettingsIcon as SettingsIconComponent } from '../components/icons/CustomIcons';
import { AddChildModal } from './components/AddChildModal';
import { PortalCard } from './components/PortalCard';
import LoadingScreen from '../components/layout/LoadingScreen';
import { ChildSelectionModal } from '@/components/modals/ChildSelectionModal';

export default function PortalPage() {
  const { session, user, loading } = useAuth();
  const router = useRouter();
  const [showAddChild, setShowAddChild] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChildSelection, setShowChildSelection] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_type', 'parent');
      const stored = localStorage.getItem('selected_child_id');
      if (stored) setSelectedChildId(stored);
    }
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
      return;
    }
    if (user?.id && isClient) {
      setChildrenLoading(true);
      supabase
        .from('children')
        .select('id, name, gender, theme, avatar, birth_year, is_literate, wants_tts')
        .eq('user_id', user.id)
        .then(({ data }) => {
          setChildren(data || []);
          setChildrenLoading(false);
          if ((!data || data.length === 0) && !localStorage.getItem('child_added_once')) {
            setShowAddChild(true);
          } else {
            setShowAddChild(false);
            if ((!selectedChildId || !(data || []).find(c=>c.id===selectedChildId)) && data && data.length > 0) {
              setSelectedChildId(data[0].id);
              localStorage.setItem('selected_child_id', data[0].id);
            }
          }
        });
    }
  }, [user, session, loading, router, isClient]);

  const handleAddChild = async (childData: any) => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('children')
      .insert([
        {
          name: childData.name,
          user_id: user.id,
          gender: childData.gender || 'other',
          theme: childData.theme || 'default',
          birth_year: childData.birthYear || new Date().getFullYear() - 5,
          is_literate: childData.is_literate || false,
          wants_tts: childData.wants_tts || true
        }
      ])
      .select();

    if (error) {
      console.error('Çocuk eklenirken hata:', error);
      return;
    }

    if (data && data.length > 0) {
      setChildren(prev => [...prev, data[0]]);
      setSelectedChildId(data[0].id);
      localStorage.setItem('selected_child_id', data[0].id);
      localStorage.setItem('child_added_once', 'true');
      setShowAddChild(false);
    }
  };

  if (loading || childrenLoading) {
    return <LoadingScreen text="Portal Yükleniyor..." />;
  }

  if (!session) {
    return <LoadingScreen text="Yönlendiriliyor..." />;
  }

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <Fragment>
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          {/* Header Section - Küçültülmüş */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.375rem, 2.8vw, 2.25rem)',
              fontWeight: 'bold',
              marginBottom: '0.375rem',
              background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Hoş Geldiniz! 👋
            </h1>
            <p style={{
              fontSize: 'clamp(0.8125rem, 1.4vw, 0.9375rem)',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Çocuğunuzun eğitim yolculuğunu birlikte keşfedelim
            </p>
          </div>

          {/* Selected Child Info - Küçültülmüş */}
          {selectedChild && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '1rem',
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
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {selectedChild.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {selectedChild.name} ✓ Seçili
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Tema: {selectedChild.theme} | Yaş: {new Date().getFullYear() - selectedChild.birth_year}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChildSelection(true)}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontWeight: '600',
                  fontSize: '0.75rem',
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

          {/* Portal Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <PortalCard
              title="Çocuklarım"
              description="Çocuklarınızın profillerini yönetin ve gelişimlerini takip edin"
              icon={<ChildIcon />}
              href="/portal/children"
              color="#3b82f6"
            />
            <PortalCard
              title="Oyun Ayarları"
              description="Eğitici oyunları yapılandırın ve çocuğunuzun seviyesini ayarlayın"
              icon={<GameIcon />}
              href="/portal/games"
              color="#8b5cf6"
            />
            <PortalCard
              title="Raporlar"
              description="Detaylı gelişim raporlarını görüntüleyin ve analiz edin"
              icon={<ReportIcon />}
              href="/portal/raporlar"
              color="#ec4899"
            />
            <PortalCard
              title="Ayarlar"
              description="Hesap ayarlarınızı ve tercihlerinizi yönetin"
              icon={<SettingsIcon />}
              href="/portal/settings"
              color="#10b981"
            />
          </div>

          {/* Quick Stats - Büyütülmüş */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📊 Hızlı İstatistikler
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  {children.length}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Aktif Çocuk
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  marginBottom: '0.5rem'
                }}>
                  3
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Aktif Oyun
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(236, 72, 153, 0.2)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#ec4899',
                  marginBottom: '0.5rem'
                }}>
                  12
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Öğrenilen Kavram
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  85%
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Başarı Oranı
                </div>
              </div>
            </div>
          </div>
      </PortalLayout>

      {showAddChild && (
        <AddChildModal
          onClose={() => setShowAddChild(false)}
          onAdd={handleAddChild}
        />
      )}

      {showChildSelection && (
        <ChildSelectionModal
          isOpen={showChildSelection}
          onClose={() => setShowChildSelection(false)}
          onChildSelect={(childId: string) => {
            setSelectedChildId(childId);
            localStorage.setItem('selected_child_id', childId);
            setShowChildSelection(false);
          }}
        />
      )}
    </Fragment>
  );
}

// Icon Components
function ChildIcon() {
  return (
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AIBrainIcon />
    </div>
  );
}

function GameIcon() {
  return (
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <GameIconComponent />
    </div>
  );
}

function ReportIcon() {
  return (
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(45deg, #ec4899, #db2777)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <CustomChartIcon />
    </div>
  );
}

function SettingsIcon() {
  return (
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(45deg, #10b981, #059669)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <SettingsIconComponent />
    </div>
  );
} 