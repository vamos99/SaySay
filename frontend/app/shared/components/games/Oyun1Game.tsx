"use client";

import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../../../portal/games/oyun1/hooks/useGameLogic';
import { FeedbackAnimation, CompletionModal } from '../../../portal/games/oyun1/components/GameAnimations';
import LoadingScreen from '../../../components/layout/LoadingScreen';
import { TrophyIcon } from '../../../components/icons/CustomIcons';

interface Oyun1GameProps {
  childId: string;
  onGameComplete?: () => void;
  onBackToMenu?: () => void;
  isChildPortal?: boolean;
}

export const Oyun1Game: React.FC<Oyun1GameProps> = ({ 
  childId, 
  onGameComplete, 
  onBackToMenu,
  isChildPortal = false 
}) => {

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const {
    aiContent,
    currentConceptIndex,
    optionOrder,
    lives,
    gameCompleted,
    gameOver,
    feedback,
    loading,
    error,
    handleAnswer,
    restartGame,
    playAudio,
    score
  } = useGameLogic(childId);

  // childId değişince oyunu sıfırla
  useEffect(() => {
    if (childId) {
      restartGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  const [showChildSelection, setShowChildSelection] = useState(false);

  useEffect(() => {
    if (gameCompleted && onGameComplete) {
      onGameComplete();
    }
  }, [gameCompleted, onGameComplete]);

  // Küçük UI/UX: Modal kapandığında focus ana butona gelsin
  useEffect(() => {
    if (!loading && !error && document) {
      const mainBtn = document.querySelector('button');
      if (mainBtn) (mainBtn as HTMLButtonElement).focus();
    }
  }, [loading, error, childId]);

  if (loading) {
    return <LoadingScreen text="Oyun Yükleniyor..." />;
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
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
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '1rem'
          }}>Oyun Yüklenemedi</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            {error}
          </p>
          <button
            onClick={restartGame}
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
            autoFocus
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!aiContent || aiContent.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
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
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Oyun İçeriği Bulunamadı</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Bu çocuk için henüz oyun içeriği oluşturulmamış. Lütfen önce roadmap'te kavramları ekleyin.
          </p>
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
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
              autoFocus
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Menüye Dön
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentConcept = aiContent[currentConceptIndex];
  if (!currentConcept) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive',
      position: 'relative'
    }}>
      {/* Game Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            🎮 Kavram Oyunu
          </h1>
          <div style={{
            fontSize: '0.875rem',
            color: '#10b981',
            fontWeight: '600',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrophyIcon size={16} style={{ color: '#10b981' }} />
            Skor: {currentConceptIndex} / {aiContent.length}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#ef4444'
          }}>
            <span style={{ fontSize: '1.25rem' }}>❤️</span>
            {lives}
          </div>
          
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#6b7280',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Menüye Dön
            </button>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Question */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          textAlign: 'center',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            {currentConcept.question}
          </h2>
          
          {/* Images */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleAnswer(optionOrder[0] === 0)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <img 
                src={optionOrder[0] === 0 ? currentConcept.correct_image_url : currentConcept.wrong_image_url}
                alt="Seçenek 1"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
            
            <div style={{
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleAnswer(optionOrder[1] === 0)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <img 
                src={optionOrder[1] === 0 ? currentConcept.correct_image_url : currentConcept.wrong_image_url}
                alt="Seçenek 2"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          </div>

          {/* Audio Player */}
          {currentConcept.audio_url && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}>
              <button
                onClick={() => {
                  // Ses çalarken buton devre dışı bırak
                  if (isAudioPlaying) {
                    return;
                  }
                  setIsAudioPlaying(true);
                  playAudio(currentConcept.audio_url);
                  
                  // Ses bittiğinde state'i güncelle
                  if (window.currentAudio) {
                    window.currentAudio.onended = () => setIsAudioPlaying(false);
                    window.currentAudio.onerror = () => setIsAudioPlaying(false);
                  }
                }}
                style={{
                  background: isAudioPlaying 
                    ? 'linear-gradient(to right, #6b7280, #4b5563)' 
                    : 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isAudioPlaying ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                {isAudioPlaying ? '⏸️' : '🔊'}
              </button>
            </div>
          )}
        </div>

        {/* Feedback Animation */}
        {feedback && (
          <FeedbackAnimation type={feedback} questionIndex={currentConceptIndex} />
        )}
      </div>

      {/* Completion Modal */}
      {(gameCompleted || gameOver) && (
        <CompletionModal
          onRestart={restartGame}
          isGameOver={gameOver}
          gameCompleted={gameCompleted}
          score={score}
          totalQuestions={aiContent.length}
        />
      )}
    </div>
  );
}; 