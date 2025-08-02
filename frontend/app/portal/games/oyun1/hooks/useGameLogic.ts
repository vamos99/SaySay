import { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import { gameCache } from '../../../../utils/gameCache';

// Window tipini genişlet
declare global {
  interface Window {
    currentAudio?: HTMLAudioElement;
  }
}

export const useGameLogic = (childId: string | null) => {
  const [aiContent, setAiContent] = useState<any[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [feedback, setFeedback] = useState<'dogru' | 'yanlis' | null>(null);
  const [optionOrder, setOptionOrder] = useState([0, 1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Session yönetimi için state'ler
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correctCount: 0,
    wrongCount: 0,
    totalAttempts: 0,
    totalResponseTime: 0
  });

  // Görselleri önceden yükle
  const preloadImages = async (content: any[]) => {
    const imageUrls = content.flatMap(item => [
      item.correct_image_url,
      item.wrong_image_url
    ]).filter(Boolean);

    const preloadPromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      await Promise.all(preloadPromises);
    } catch (error) {
      console.error('Image preload error:', error);
    }
  };

  // AI içeriğini çek
  const fetchAIContent = async (childId: string) => {
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ child_id: childId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('AI content fetch failed');
      }

      return await response.json();
    } catch (error) {
      console.error('AI content fetch error:', error);
      throw error;
    }
  };

  // Session başlat
  const startSession = () => {
    const newSessionId = crypto.randomUUID();
    const startTime = Date.now();
    setSessionId(newSessionId);
    setSessionStartTime(startTime);
    setQuestionStartTime(startTime);
    setSessionStats({
      correctCount: 0,
      wrongCount: 0,
      totalAttempts: 0,
      totalResponseTime: 0
    });
  };

  // Session'ı sonlandır ve logla
  const endSession = async () => {
    if (!sessionId || !sessionStartTime || !childId) return;

    const endTime = Date.now();
    const sessionDuration = Math.round((endTime - sessionStartTime) / 1000);
    const avgResponseTime = sessionStats.totalAttempts > 0 
      ? Math.round(sessionStats.totalResponseTime / sessionStats.totalAttempts) 
      : 0;

    try {
      // Mevcut session'ı güncelle
      const { error: updateError } = await supabase
        .from('interaction_logs')
        .update({
          correct_count: sessionStats.correctCount,
          wrong_count: sessionStats.wrongCount,
          total_attempts: sessionStats.totalAttempts,
          avg_response_time_ms: avgResponseTime,
          session_duration_seconds: sessionDuration,
          session_end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (updateError) {
        console.error('Session update error:', updateError);
      }
    } catch (error) {
      console.error('Session end error:', error);
    }
  };

  // Yeni soru başlat
  const startNewQuestion = () => {
    setQuestionStartTime(Date.now());
  };

  // Cevap logla
  const logAnswer = async (concept: string, isCorrect: boolean) => {
    if (!sessionId || !childId || !questionStartTime) return;

    const responseTime = Date.now() - questionStartTime;
    
    // Session stats'ı güncelle
    setSessionStats(prev => ({
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
      totalAttempts: prev.totalAttempts + 1,
      totalResponseTime: prev.totalResponseTime + responseTime
    }));

    // İlk cevap ise session log'u oluştur
    if (sessionStats.totalAttempts === 0) {
      try {
        const { error: insertError } = await supabase
          .from('interaction_logs')
          .insert({
            child_id: childId,
            session_id: sessionId,
            game_type: 'oyun1',
            concept: concept,
            question_count: totalQuestions,
            correct_count: isCorrect ? 1 : 0,
            wrong_count: isCorrect ? 0 : 1,
            total_attempts: 1,
            avg_response_time_ms: responseTime,
            session_start_time: new Date(sessionStartTime!).toISOString()
          });

        if (insertError) {
          console.error('Session log insert error:', insertError);
        }
      } catch (error) {
        console.error('Session log error:', error);
      }
    }
  };

  // Oyun içeriğini yükle
  const loadGameContent = async () => {
    if (!childId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Önce cache'den kontrol et
      const cachedContent = gameCache.get(childId);
      if (cachedContent) {
        setAiContent(cachedContent);
        setTotalQuestions(cachedContent.length);
        setCurrentConceptIndex(0);
        preloadImages(cachedContent);
        setLoading(false);
        return;
      }
      
      // Cache'de yoksa backend'den çek
      const aiContent = await fetchAIContent(childId);
      
      if (aiContent && aiContent.all_concepts) {
        const filteredContent = aiContent.all_concepts.filter((c: any) => !c.error);
        setAiContent(filteredContent);
        setTotalQuestions(filteredContent.length);
        setCurrentConceptIndex(0);
        preloadImages(filteredContent);
      } else {
        console.error('No valid AI content received from backend');
      }
    } catch (error) {
      console.error('Game content load error:', error);
      setError('Oyun içeriği yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Oyunu sıfırla
  const resetGame = () => {
    setGameCompleted(false);
    setGameOver(false);
    setCurrentConceptIndex(0);
    setFeedback(null);
    setLives(3);
    setScore(0);
    setSessionStats({
      correctCount: 0,
      wrongCount: 0,
      totalAttempts: 0,
      totalResponseTime: 0
    });
    randomizeOptions();
  };

  // Otomatik seslendirme
  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      // Önceki sesi durdur
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.currentTime = 0;
      }
      
      // Yeni ses oluştur ve çal
      const audio = new Audio(audioUrl);
      window.currentAudio = audio;
      
      audio.play().catch(error => {
        console.error('Audio play error:', error);
      });
    }
  };

  // Cevap işle
  const handleAnswer = async (isCorrect: boolean) => {
    if (!childId || !aiContent[currentConceptIndex]) return;

    const currentContent = aiContent[currentConceptIndex];
    setFeedback(isCorrect ? 'dogru' : 'yanlis');

    // Cevabı logla
    await logAnswer(currentContent.concept, isCorrect);

    // 1.5 saniye sonra işlem yap
    setTimeout(() => {
      setFeedback(null);
      
      if (isCorrect) {
        // Doğru cevap - skor artır ve sonraki soruya geç
        setScore(score + 1);
        
        if (currentConceptIndex < aiContent.length - 1) {
          setCurrentConceptIndex(currentConceptIndex + 1);
          startNewQuestion();
          randomizeOptions();
        } else {
          // Tüm sorular tamamlandı
          setGameCompleted(true);
          endSession();
        }
      } else {
        // Yanlış cevap - can azalt
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          // Canlar bitti - oyun bitti
          setGameOver(true);
          endSession();
        } else {
          // Hala can var - aynı soruyu tekrar dene
          startNewQuestion();
          randomizeOptions();
        }
      }
    }, 1500);
  };

  // Oyun tamamlandı mı kontrolü
  const isGameCompleted = gameCompleted || gameOver;

  // Seçenekleri karıştır
  const randomizeOptions = () => {
    const shuffled = [0, 1].sort(() => Math.random() - 0.5);
    setOptionOrder(shuffled);
  };

  // Oyunu yeniden başlat
  const restartGame = () => {
    resetGame();
    startSession();
    loadGameContent();
  };

  // childId değişince oyunu yeniden yükle
  useEffect(() => {
    if (childId) {
      loadGameContent();
    }
  }, [childId]);

  // Her yeni soru için seçenekleri karıştır ve seslendirme yap
  useEffect(() => {
    randomizeOptions();
    
    // Otomatik seslendirme
    if (aiContent[currentConceptIndex]?.audio_url) {
      setTimeout(() => {
        playAudio(aiContent[currentConceptIndex].audio_url);
      }, 500); // 0.5 saniye bekle
    }
  }, [currentConceptIndex, aiContent]);

  // Oyun başladığında session başlat
  useEffect(() => {
    if (aiContent.length > 0 && !sessionId) {
      startSession();
    }
  }, [aiContent, sessionId]);

  return {
    aiContent,
    currentConceptIndex,
    feedback,
    optionOrder,
    loading,
    isGameCompleted,
    lives,
    gameCompleted,
    gameOver,
    score,
    totalQuestions,
    error,
    sessionStats,
    handleAnswer,
    randomizeOptions,
    restartGame,
    playAudio
  };
}; 