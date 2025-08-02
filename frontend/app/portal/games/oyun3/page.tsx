"use client";
import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useRouter } from "next/navigation";
import { Oyun3Cache } from "@/utils/oyun3Cache";
import { getChildTheme } from "@/utils/childThemeService";
import { Oyun3Question } from "@/utils/geminiService";

const TIMER_OPTIONS = [30, 60, 90, 120];
const LENGTH_OPTIONS = [
  { label: 'Kısa', value: 'short' },
  { label: 'Orta', value: 'medium' },
  { label: 'Uzun', value: 'long' },
];

export default function Oyun3Page() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filled, setFilled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timer, setTimer] = useState(90);
  const [length, setLength] = useState<'short'|'medium'|'long'>('medium');
  const [timeLeft, setTimeLeft] = useState(timer);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wantTTS, setWantTTS] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Oyun3Question[]>([]);
  const [difficulty, setDifficulty] = useState<'short' | 'medium' | 'long'>('medium');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const MAX_QUESTIONS = 5;

  const oyun3Cache = new Oyun3Cache();

  useEffect(() => {
    loadSettings();
    loadChildren();
  }, []);

  // Çocuk değişince cache'i temizle ve yeni sorular yükle
  useEffect(() => {
    if (selectedChild) {
      console.log('👶 Çocuk değişti:', selectedChild.name);
      // Çocuk değişince sesi durdur
      oyun3Cache.stopSpeaking();
      oyun3Cache.clearCache(selectedChild.id);
      loadQuestions();
    }
  }, [selectedChild]);

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

  // Sayfa değişince sesi durdur
  useEffect(() => {
    return () => {
      oyun3Cache.stopSpeaking();
    };
  }, []);

  // Soru değişince sesi çal
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && wantTTS && !isLoading) {
      console.log('🔊 Soru seslendiriliyor...');
      oyun3Cache.speakQuestion(currentQuestion.text, wantTTS);
    }
  }, [currentQuestionIndex, questions, wantTTS, isLoading]);

  // TTS için useEffect
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && wantTTS && !isLoading) {
      oyun3Cache.speakQuestion(currentQuestion.text, wantTTS);
    }

    // Cleanup: Component unmount olduğunda TTS'yi durdur
    return () => {
      oyun3Cache.stopSpeaking();
    };
  }, [currentQuestionIndex, questions, wantTTS, isLoading]);

  const loadSettings = () => {
    const saved = localStorage.getItem('oyun3_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timer) setTimer(parsed.timer);
        if (parsed.length) setLength(parsed.length);
        if (parsed.wantTTS !== undefined) setWantTTS(parsed.wantTTS);
      } catch {}
    }
  };

  const loadChildren = async () => {
    try {
      const { supabase } = await import('@/utils/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('user_id', user.id);
        
        setChildren(childrenData || []);
        
        // Varsayılan çocuk seç
        if (childrenData && childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
        }
      }
    } catch (error) {
      console.error('Çocuk yükleme hatası:', error);
    }
  };

  const loadQuestions = async () => {
    if (!selectedChild) return;
    
    setIsLoading(true);
    // Loading başladığında sesi durdur
    oyun3Cache.stopSpeaking();
    
    try {
      const theme = await getChildTheme(selectedChild.id);
      const newQuestions = await oyun3Cache.getQuestions(selectedChild.id, length, theme);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setFilled([]);
      setFeedback(null);
      setTimeLeft(timer);
    } catch (error) {
      console.error('Soru yükleme hatası:', error);
      setFeedback('Soru yüklenirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = async (word: string) => {
    if (!currentQuestion || filled.length >= currentQuestion.blanks.length) return;
    
    const correct = currentQuestion.blanks[filled.length] === word;
    
    if (correct) {
      const newFilled = [...filled, word];
      setFilled(newFilled);
      
      if (newFilled.length === currentQuestion.blanks.length) {
        // Soru tamamlandı
        setFeedback('Doğru! Harika iş!');
        setQuestionsAnswered(prev => prev + 1);
        
        // Log kaydet
        await oyun3Cache.logGameSession(
          selectedChild!.id,
          currentQuestion.id || '',
          newFilled.length,
          0,
          timer - timeLeft,
          length
        );
        
        // Sonraki soruya geç veya oyunu bitir
        setTimeout(() => {
          if (questionsAnswered + 1 >= MAX_QUESTIONS) {
            // Oyun bitti
            setGameCompleted(true);
            setFeedback(`Tebrikler! ${MAX_QUESTIONS} soruyu tamamladınız!`);
          } else {
            // Sonraki soru
            setCurrentQuestionIndex(prev => prev + 1);
            setFilled([]);
            setFeedback(null);
            setTimeLeft(timer);
          }
        }, 1500);
      }
    } else {
      setFeedback('Yanlış, tekrar dene!');
    }
  };

  const handleEndGame = async () => {
    if (!selectedChild) return;
    
    setGameCompleted(true);
    setFeedback(`Oyun erken bitirildi! ${questionsAnswered} soru tamamlandı.`);
    
    // Son log kaydet
    if (currentQuestion) {
      await oyun3Cache.logGameSession(
        selectedChild.id,
        currentQuestion.id || '',
        filled.length,
        currentQuestion.blanks.length - filled.length,
        timer - timeLeft,
        length
      );
    }
  };

  const handleTTSToggle = () => {
    setWantTTS(!wantTTS);
    localStorage.setItem('oyun3_settings', JSON.stringify({
      timer,
      length,
      wantTTS: !wantTTS
    }));
  };

  if (isLoading) {
    return (
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
          color: '#6b7280'
        }}>
          Sorular yükleniyor...
        </div>
      </PortalLayout>
    );
  }

  if (!selectedChild || children.length === 0) {
    return (
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
          color: '#6b7280'
        }}>
          Çocuk seçilmedi veya çocuk bulunamadı.
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative'
      }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Boşluk Doldurma Oyunu
              </h1>
              
              {/* Erken Bitirme Butonu - Sadece Ebeveyn Portalında */}
              {!gameCompleted && questionsAnswered > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={handleEndGame}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    Oyunu Bitir ({questionsAnswered}/{MAX_QUESTIONS})
                  </button>
                </div>
              )}
            </div>

            {/* Oyun Tamamlandı Ekranı */}
            {gameCompleted && (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#059669',
                  marginBottom: '1rem'
                }}>
                  🎉 Oyun Tamamlandı!
                </h2>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#374151',
                  marginBottom: '1rem'
                }}>
                  {questionsAnswered} soru başarıyla tamamlandı!
                </p>
                <button
                  onClick={() => {
                    setGameCompleted(false);
                    setQuestionsAnswered(0);
                    setCurrentQuestionIndex(0);
                    setFilled([]);
                    setFeedback(null);
                    setTimeLeft(timer);
                    loadQuestions();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Yeni Oyun Başlat
                </button>
              </div>
            )}

            {/* Oyun İçeriği - Sadece oyun tamamlanmadığında göster */}
            {!gameCompleted && (
              <div style={{
                textAlign: 'center',
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem'
              }}>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
                  Soru {currentQuestionIndex + 1} / {questions.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Tamamlanan: {questionsAnswered} / {MAX_QUESTIONS}
                </div>
              </div>
            )}

        {/* Çocuk Seçici */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontWeight: '600', color: '#374151' }}>Çocuk: </span>
              <span style={{ color: '#6b7280' }}>
                {children.find(c => c.id === selectedChild?.id)?.name || 'Seçilmedi'}
              </span>
            </div>
            <button
              onClick={() => setShowChildSelector(!showChildSelector)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #3b82f6',
                background: 'white',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Değiştir
            </button>
          </div>
          
          {showChildSelector && (
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChild(child);
                    setShowChildSelector(false);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: selectedChild?.id === child.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    background: selectedChild?.id === child.id ? '#3b82f6' : 'white',
                    color: selectedChild?.id === child.id ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timer ve Ayarlar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>⏰ {timeLeft} sn</span>
              <span style={{ color: '#6b7280' }}>
                Zorluk: {length === 'short' ? 'Kısa' : length === 'medium' ? 'Orta' : 'Uzun'}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <button
                onClick={handleTTSToggle}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #f59e0b',
                  background: wantTTS ? '#f59e0b' : 'white',
                  color: wantTTS ? 'white' : '#f59e0b',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {wantTTS ? '🔊' : '🔇'} TTS
              </button>
            </div>
          </div>
        </div>

        {/* Oyun Alanı */}
        {currentQuestion && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            {/* Metin */}
            <div style={{
              fontSize: '1.2rem',
              lineHeight: '1.8',
              marginBottom: '2rem',
              color: '#1f2937'
            }}>
              {currentQuestion.text.map((part: string, i: number) => (
                <React.Fragment key={i}>
                  {part}
                  {i < currentQuestion.blanks.length && (
                    <span style={{
                      display: 'inline-block',
                      minWidth: '80px',
                      borderBottom: '2px solid #e0b97d',
                      margin: '0 6px',
                      color: filled[i] ? '#27ae60' : '#e67e22',
                      fontWeight: '700',
                      textAlign: 'center'
                    }}>
                      {filled[i] || '____'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Seçenekler */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
                              {currentQuestion.options[filled.length]?.map((word: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(word)}
                  disabled={filled.includes(word)}
                  style={{
                    background: filled.includes(word) ? '#e5e7eb' : 'var(--primary-yellow)',
                    color: filled.includes(word) ? '#9ca3af' : '#2c3e50',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: filled.includes(word) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!filled.includes(word)) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!filled.includes(word)) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                    }
                  }}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <div style={{
                color: feedback.includes('Doğru') ? '#10b981' : '#ef4444',
                fontWeight: '600',
                fontSize: '1.1rem',
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                {feedback}
              </div>
            )}

            {/* Progress */}
            <div style={{
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Soru {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
            )}

        {/* Ayarlar Butonu */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => router.push('/portal/games/oyun3/settings')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #3b82f6',
              background: 'white',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ⚙️ Oyun Ayarları
          </button>
        </div>
      </div>
    </PortalLayout>
  );
} 