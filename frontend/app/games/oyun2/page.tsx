"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { Game2Card } from './components/Game2Card';
import { Game2Styles } from './components/Game2Styles';
import { useGame2Logic } from './hooks/useGame2Logic';

export default function Oyun2Page() {
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [childList, setChildList] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const {
    gameData,
    selectedObject,
    selectedAction,
    generatedSentence,
    audioUrl,
    loading,
    error: gameError,
    isPlaying,
    selectObject,
    selectAction,
    playAudio,
    clearSelections,
    loadGameData,
  } = useGame2Logic(selectedChildId);

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

  if (loading && !gameData) {
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
            Oyun Yükleniyor...
          </div>
          <div style={{ fontSize: 16, color: '#7b8fa1' }}>Lütfen bekleyin</div>
        </div>
      </div>
    );
  }

  if (error || gameError) {
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
          <div style={{ fontSize: 16 }}>{error || gameError}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#e0b97d',
              color: '#2c3e50',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Tekrar Dene
          </button>
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
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Çocuk Bulunamadı</div>
          <button
            onClick={() => window.location.href = '/child-dashboard'}
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
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Oyun Verisi Bulunamadı</div>
          <div style={{ fontSize: 16 }}>Bu çocuk için oyun içeriği henüz hazırlanmamış.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--light-blue-bg)' }}>
      <Game2Styles />
      
      <main style={{
        flex: 1,
        padding: '24px',
        overflow: 'auto'
      }}>
        <div className="game2-container">
          {/* Header */}
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
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2c3e50', marginBottom: '4px' }}>
                  Oyun 2: Nesne ve Eylem
                </div>
                <div style={{ fontSize: 16, color: '#7b8fa1' }}>
                  Bir nesne ve bir eylem seç, cümle oluştur!
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={clearSelections}
                style={{
                  background: '#ecf0f1',
                  color: '#7b8fa1',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#d5dbdb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ecf0f1';
                }}
              >
                Temizle
              </button>

              <button
                onClick={() => router.push('/games/oyun2/settings')}
                style={{
                  background: '#3498db',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2980b9';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3498db';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ⚙️ Ayarlar
              </button>

              <button
                onClick={() => window.location.href = '/child-dashboard'}
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
                Ana Sayfaya Dön
              </button>
            </div>
          </div>

          {/* Ana İçerik */}
          <div style={{
            display: 'flex',
            gap: '32px',
            height: 'calc(100vh - 200px)'
          }}>
            {/* Sol Taraf - Nesneler */}
            <div className="game2-section" style={{
              flex: 1,
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e0b97d'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#2c3e50',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                📦 Nesneler
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                maxHeight: 'calc(100% - 60px)',
                overflowY: 'auto',
                padding: '8px'
              }}>
                {gameData.objects.map((object) => (
                  <Game2Card
                    key={object.id}
                    id={object.id}
                    name={object.name}
                    imageUrl={object.image_url}
                    isSelected={selectedObject?.id === object.id}
                    onClick={() => selectObject(object)}
                    type="object"
                  />
                ))}
              </div>
            </div>

            {/* Sağ Taraf - Eylemler */}
            <div className="game2-section" style={{
              flex: 1,
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e0b97d'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#2c3e50',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🎯 Eylemler
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                maxHeight: 'calc(100% - 60px)',
                overflowY: 'auto',
                padding: '8px'
              }}>
                {gameData.actions.map((action) => (
                  <Game2Card
                    key={action.id}
                    id={action.id}
                    name={action.name}
                    imageUrl={action.image_url}
                    isSelected={selectedAction?.id === action.id}
                    onClick={() => selectAction(action)}
                    type="action"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Alt Kısım - Cümle ve Ses */}
          {(selectedObject || selectedAction || generatedSentence) && (
            <div className="game2-section" style={{
              marginTop: '24px',
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e0b97d',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
              }}>
                {/* Seçimler */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flex: 1
                }}>
                  {selectedObject && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8f9fa',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid #e0b97d'
                    }}>
                      <span style={{ fontSize: '14px', color: '#7b8fa1' }}>Nesne:</span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
                        {selectedObject.name}
                      </span>
                    </div>
                  )}
                  
                  {selectedAction && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8f9fa',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid #e0b97d'
                    }}>
                      <span style={{ fontSize: '14px', color: '#7b8fa1' }}>Eylem:</span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#2c3e50' }}>
                        {selectedAction.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cümle */}
                {generatedSentence && (
                  <div className="game2-sentence" style={{
                    flex: 2,
                    textAlign: 'center',
                    padding: '16px 24px',
                    background: '#e8f5e8',
                    borderRadius: '12px',
                    border: '2px solid #27ae60'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#2c3e50',
                      lineHeight: '1.4'
                    }}>
                      "{generatedSentence}"
                    </div>
                  </div>
                )}

                {/* Ses Butonu */}
                {audioUrl && (
                  <button
                    onClick={playAudio}
                    disabled={isPlaying || loading}
                    className="game2-audio-button"
                    style={{
                      background: isPlaying ? '#e74c3c' : '#e0b97d',
                      color: '#fff',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '50%',
                      fontSize: '24px',
                      cursor: isPlaying || loading ? 'not-allowed' : 'pointer',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isPlaying || loading ? 0.7 : 1
                    }}
                  >
                    {isPlaying ? '⏸️' : loading ? '⏳' : '🔊'}
                  </button>
                )}
              </div>

              {/* Yükleme Göstergesi */}
              {loading && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  color: '#7b8fa1',
                  fontSize: '14px'
                }}>
                  <div className="game2-loading">Cümle oluşturuluyor...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 