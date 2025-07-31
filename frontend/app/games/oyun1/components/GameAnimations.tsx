import React from 'react';

interface FeedbackProps {
  type: 'dogru' | 'yanlis';
  questionIndex: number;
}

export const FeedbackAnimation: React.FC<FeedbackProps> = ({ type, questionIndex }) => {
  // Sadece ilk 3 soruda animasyon göster
  const shouldShowAnimation = questionIndex < 3;
  
  if (type === 'dogru') {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        animation: shouldShowAnimation ? 'bounceIn 0.5s ease-out' : 'none'
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#fff',
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '100px',
          justifyContent: 'center',
          border: '2px solid #fff',
          animation: shouldShowAnimation ? 'happyBounce 0.6s ease-in-out' : 'none'
        }}>
          <span style={{
            fontSize: 18,
            animation: shouldShowAnimation ? 'spin 0.5s ease-in-out' : 'none'
          }}>
            •
          </span>
          Harika!
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      animation: shouldShowAnimation ? 'shakeIn 0.5s ease-out' : 'none'
    }}>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #FF9800, #F57C00)',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '100px',
        justifyContent: 'center',
        border: '2px solid #fff',
        animation: shouldShowAnimation ? 'encourageBounce 0.6s ease-in-out' : 'none'
      }}>
        <span style={{
          fontSize: 18,
          animation: shouldShowAnimation ? 'wiggle 0.5s ease-in-out' : 'none'
        }}>
          •
        </span>
        Tekrar Dene!
      </div>
    </div>
  );
};

interface CompletionModalProps {
  onRestart: () => void;
  isGameOver?: boolean;
  gameCompleted?: boolean;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ onRestart, isGameOver = false, gameCompleted = false }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '25px',
        textAlign: 'center',
        color: '#fff',
        maxWidth: '450px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: 'celebrationBounce 0.8s ease-out',
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
        {/* Confetti Effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: '8px',
              height: '8px',
              background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
              borderRadius: '50%',
              animation: `confetti ${2 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        <div style={{
          fontSize: 48,
          fontWeight: 900,
          marginBottom: 20,
          animation: isGameOver ? 'wrongShake 0.6s ease-in-out' : 'trophyGlow 1.5s ease-in-out infinite'
        }}>
          {isGameOver ? '✗' : '✓'}
        </div>
        
        <div style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 16,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {isGameOver ? 'Oyun Bitti!' : 'Tebrikler!'}
        </div>
        
        <div style={{
          fontSize: 18,
          marginBottom: 30,
          opacity: 0.9,
          lineHeight: 1.4
        }}>
          {isGameOver 
            ? 'Canların bitti! Tekrar denemek ister misin?' 
            : 'Tüm soruları başarıyla tamamladın!'
          }
        </div>
        
        {!isGameOver && (
          <div style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 30
          }}>
            <div style={{
              fontSize: 16,
              animation: 'starTwinkle 1.2s ease-in-out infinite'
            }}>
              ✨
            </div>
            <div style={{
              fontSize: 16,
              animation: 'starTwinkle 1.2s ease-in-out infinite 0.3s'
            }}>
              ✨
            </div>
            <div style={{
              fontSize: 16,
              animation: 'starTwinkle 1.2s ease-in-out infinite 0.6s'
            }}>
              ✨
            </div>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={onRestart}
            style={{
              background: isGameOver 
                ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
                : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
              color: '#fff',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '15px',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isGameOver 
                ? '0 8px 25px rgba(231, 76, 60, 0.4)' 
                : '0 8px 25px rgba(255, 107, 107, 0.4)',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = isGameOver 
                ? '0 12px 35px rgba(231, 76, 60, 0.6)' 
                : '0 12px 35px rgba(255, 107, 107, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isGameOver 
                ? '0 8px 25px rgba(231, 76, 60, 0.4)' 
                : '0 8px 25px rgba(255, 107, 107, 0.4)';
            }}
          >
            {isGameOver ? 'Tekrar Dene' : 'Tekrar Oyna'}
          </button>
          
          <button
            onClick={() => window.location.href = '/child-dashboard'}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '15px',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}; 