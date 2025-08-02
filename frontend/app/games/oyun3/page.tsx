"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../utils/AuthContext';
import LoadingScreen from '../../components/layout/LoadingScreen';

const sampleParagraphs = [
  {
    text: ["Ali sabah ", "____", " kalktı ve hemen dişlerini ", "____", "."],
    blanks: ["erken", "fırçaladı"],
    options: ["fırçaladı", "geç", "erken", "oynadı"],
    length: 'short',
  },
  {
    text: ["Ayşe okuldan sonra ", "____", " yaptı ve annesine ", "____", "."],
    blanks: ["ödev", "yardım etti"],
    options: ["yardım etti", "ödev", "koştu", "yemek"],
    length: 'medium',
  },
  {
    text: ["Bir gün Elif ve kardeşi parka gitmek için hazırlandılar. Elif annesine ", "____", " giydi ve kardeşiyle birlikte dışarı çıktı. Parkta ", "____", " oynadılar ve çok eğlendiler."],
    blanks: ["montunu", "salıncakta"],
    options: ["salıncakta", "montunu", "kitap", "koştu"],
    length: 'long',
  },
];

const TIMER_OPTIONS = [30, 60, 90, 120];
const LENGTH_OPTIONS = [
  { label: 'Kısa', value: 'short' },
  { label: 'Orta', value: 'medium' },
  { label: 'Uzun', value: 'long' },
];

export default function Oyun3Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [filled, setFilled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timer, setTimer] = useState(90);
  const [length, setLength] = useState<'short'|'medium'|'long'>('medium');
  const [filteredParagraphs, setFilteredParagraphs] = useState(sampleParagraphs);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [showSettings, setShowSettings] = useState(false);

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const saved = localStorage.getItem('oyun3_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timer) setTimer(parsed.timer);
        if (parsed.length) setLength(parsed.length);
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Filter paragraphs by selected length
    const filtered = sampleParagraphs.filter(p => p.length === length);
    setFilteredParagraphs(filtered.length > 0 ? filtered : sampleParagraphs);
    setCurrent(0);
    setFilled([]);
    setTimeLeft(timer);
  }, [length, timer]);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setFeedback('Süre doldu!');
    }
  }, [timeLeft]);

  const paragraph = filteredParagraphs[current] || filteredParagraphs[0];

  const handleOptionClick = (word: string) => {
    if (filled.length >= paragraph.blanks.length) return;
    const correct = paragraph.blanks[filled.length] === word;
    if (correct) {
      setFilled([...filled, word]);
      if (filled.length + 1 === paragraph.blanks.length) {
        setTimeout(() => {
          setFilled([]);
          setCurrent((prev) => (prev + 1) % filteredParagraphs.length);
        }, 1200);
      }
    } else {
      setFeedback("Tekrar dene!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setFilled([]);
    setTimeLeft(timer);
    setFeedback(null);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('oyun3_settings', JSON.stringify({ timer, length }));
    setShowSettings(false);
  };

  if (!user) {
    return <LoadingScreen text="Yönlendiriliyor..." />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Floating Animated Elements */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '8%',
        width: '50px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '12%',
        width: '35px',
        height: '35px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '15%',
        width: '40px',
        height: '40px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite'
      }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              💬 İletişim Panosu
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#6b7280',
              fontWeight: '600'
            }}>
              ⏱️ Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
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
              ⚙️ Ayarlar
            </button>

            <button
              onClick={() => router.push('/child-dashboard')}
              style={{
                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
              🏠 Ana Sayfa
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            {paragraph.text.map((part, index) => (
              <span key={index}>
                {part === "____" ? (
                  <span style={{
                    display: 'inline-block',
                    minWidth: '80px',
                    height: '2rem',
                    border: '2px dashed #3b82f6',
                    borderRadius: '0.5rem',
                    margin: '0 0.5rem',
                    background: filled[index] ? '#dbeafe' : 'transparent',
                    color: '#3b82f6',
                    fontWeight: '700',
                    padding: '0.25rem 0.5rem',
                    verticalAlign: 'middle'
                  }}>
                    {filled[index] || ''}
                  </span>
                ) : (
                  part
                )}
              </span>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {paragraph.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={filled.length >= paragraph.blanks.length}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: filled.length >= paragraph.blanks.length ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: filled.length >= paragraph.blanks.length ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (filled.length < paragraph.blanks.length) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filled.length < paragraph.blanks.length) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: feedback.includes('Tekrar') ? '#ef4444' : '#10b981',
              marginBottom: '1rem',
              padding: '1rem',
              background: feedback.includes('Tekrar') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderRadius: '0.5rem',
              border: `2px solid ${feedback.includes('Tekrar') ? '#ef4444' : '#10b981'}`
            }}>
              {feedback}
            </div>
          )}

          <button
            onClick={handleReset}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            🔄 Yeniden Başla
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setShowSettings(false)}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              textAlign: 'center'
            }}>
              ⚙️ Oyun Ayarları
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                ⏱️ Süre (saniye)
              </label>
              <select
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #d1d5db',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                {TIMER_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📝 Metin Uzunluğu
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as 'short'|'medium'|'long')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #d1d5db',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                {LENGTH_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                İptal
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
} 