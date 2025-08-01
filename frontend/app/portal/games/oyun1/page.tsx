"use client";

import React, { useEffect, useState } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";
import LoadingScreen from "@/components/LoadingScreen";

import { useSecureCache } from "../../../utils/cacheManager";
import { GameButton } from './components/GameButton';
import { FeedbackAnimation } from './components/GameAnimations';
import { CompletionModal } from './components/GameAnimations';
import { GameStyles } from './components/GameStyles';
import { useGameLogic } from './hooks/useGameLogic';

export default function Oyun1Page() {
  const router = useRouter();
  const { getCached, setCached, clearCache } = useSecureCache();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [childList, setChildList] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showChildModal, setShowChildModal] = useState(false);

  const {
    aiContent,
    currentConceptIndex,
    feedback,
    optionOrder,
    loading,
    isPreloading,
    isGameCompleted,
    lives,
    gameCompleted,
    gameOver,
    handleAnswer,
    randomizeOptions
  } = useGameLogic(selectedChildId);

  // Çocuk listesini yükle
  useEffect(() => {
    async function fetchChildren() {
      try {
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
        
        // Eğer çocuk varsa ilkini seç
        if (children && children.length > 0) {
          setSelectedChildId(children[0].id);
          setChild(children[0]);
        }
      } catch (error) {
        console.error('Children fetch error:', error);
        setError('Çocuk bilgileri yüklenemedi');
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

  if (loading || isPreloading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            {isPreloading ? 'Görseller Hazırlanıyor...' : 'Oyun Yükleniyor...'}
          </div>
          <div style={{ fontSize: 16, color: '#7b8fa1' }}>Lütfen bekleyin</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Hata!</div>
          <div style={{ fontSize: 16 }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Çocuk Seçin</div>
          <button
            onClick={() => setShowChildModal(true)}
            style={{
              background: '#e0b97d',
              color: '#2c3e50',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Çocuk Seç
          </button>
        </div>
      </div>
    );
  }

  const currentContent = aiContent[currentConceptIndex];

  if (!currentContent) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>İçerik Bulunamadı</div>
          <div style={{ fontSize: 16 }}>Bu çocuk için oyun içeriği henüz hazırlanmamış.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--light-blue-bg)' }}>
      <GameStyles />
      
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main style={{
        flex: 1,
        padding: '24px',
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: 16, color: '#7b8fa1' }}>
                Kavram: {currentContent.concept} | {currentConceptIndex + 1} / {aiContent.length}
              </div>
            </div>
          </div>
          
          {/* Can göstergesi */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: 16, color: '#7b8fa1', marginRight: '8px' }}>
              Canlar:
            </span>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: index < lives ? '#e74c3c' : '#ecf0f1',
                  border: '2px solid #e74c3c',
                  transition: 'all 0.3s ease',
                  animation: index >= lives ? 'pulse 1s ease-in-out infinite' : 'none'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setShowChildModal(true)}
            style={{
              background: '#e0b97d',
              color: '#2c3e50',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d4af37';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#e0b97d';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Çocuk Değiştir
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="question-text" style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '32px',
            padding: '20px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px #f0f0f0',
            border: '2px solid #e0b97d',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 20px #d0d0d0';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 12px #f0f0f0';
          }}>
            {currentContent.question}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <GameButton
              imageUrl={optionOrder[0] === 0 ? currentContent.correct_image_url : currentContent.wrong_image_url}
              altText={optionOrder[0] === 0 ? "Doğru cevap" : "Yanlış cevap"}
              isCorrect={optionOrder[0] === 0}
              onClick={() => handleAnswer(optionOrder[0] === 0)}
              feedback={feedback}
              optionOrder={optionOrder}
              index={0}
            />

            <GameButton
              imageUrl={optionOrder[1] === 0 ? currentContent.correct_image_url : currentContent.wrong_image_url}
              altText={optionOrder[1] === 0 ? "Doğru cevap" : "Yanlış cevap"}
              isCorrect={optionOrder[1] === 0}
              onClick={() => handleAnswer(optionOrder[1] === 0)}
              feedback={feedback}
              optionOrder={optionOrder}
              index={1}
            />
          </div>

          {feedback && <FeedbackAnimation type={feedback as 'dogru' | 'yanlis'} questionIndex={currentConceptIndex} />}
        </div>

        {/* Çocuk seçim modalı */}
        {showChildModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowChildModal(false)}>
            <div style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 24,
                color: '#2c3e50'
              }}>
                Çocuk Seçin
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {childList.map((childItem) => (
                  <button
                    key={childItem.id}
                    onClick={() => handleSelectChild(childItem.id)}
                    style={{
                      background: selectedChildId === childItem.id ? '#e0b97d' : '#f8f9fa',
                      color: '#2c3e50',
                      border: '2px solid #e0b97d',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {childItem.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Oyun tamamlama modalı */}
        {isGameCompleted && (
          <CompletionModal 
            onRestart={() => window.location.reload()} 
            isGameOver={gameOver}
            gameCompleted={gameCompleted}
          />
        )}
      </main>
    </div>
  );
} 