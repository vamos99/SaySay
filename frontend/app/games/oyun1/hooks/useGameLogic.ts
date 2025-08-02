import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

export const useGameLogic = (childId: string | null) => {
  const [aiContent, setAiContent] = useState<any[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [feedback, setFeedback] = useState<'dogru' | 'yanlis' | null>(null);
  const [optionOrder, setOptionOrder] = useState<number[]>([0, 1]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lives, setLives] = useState(3); // 3 can sistemi
  const [gameOver, setGameOver] = useState(false); // Oyun bitti mi?
  const [score, setScore] = useState(0); // Skor sistemi
  const [totalQuestions, setTotalQuestions] = useState(0); // Toplam soru sayısı

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

  const preloadImages = async (content: any[]) => {
    setIsPreloading(true);
    const newLoadedImages = new Set(imagesLoaded);
    try {
      const imagePromises = content.map(async (item) => {
        const correctImg = new Image();
        const wrongImg = new Image();
        const correctPromise = new Promise((resolve) => {
          correctImg.onload = () => { newLoadedImages.add(item.correct_image_url); resolve(item.correct_image_url); };
          correctImg.onerror = () => resolve(null);
        });
        const wrongPromise = new Promise((resolve) => {
          wrongImg.onload = () => { newLoadedImages.add(item.wrong_image_url); resolve(item.wrong_image_url); };
          wrongImg.onerror = () => resolve(null);
        });
        correctImg.src = item.correct_image_url;
        wrongImg.src = item.wrong_image_url;
        return Promise.all([correctPromise, wrongPromise]);
      });
      await Promise.all(imagePromises);
      setImagesLoaded(newLoadedImages);

    } catch (error) {
      console.warn('Görsel preloading hatası:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const fetchAIContent = async (childId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vertex-ai-backend-1003061737705.us-central1.run.app';

      
      const response = await fetch(`${API_URL}/generate-full-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId })
      });
      

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('AI content fetch error:', error);
      return null;
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

  const loadGameContent = async () => {
    if (!childId) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

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

  const randomizeOptions = () => {
    const shuffled = [0, 1].sort(() => Math.random() - 0.5);
    setOptionOrder(shuffled);
  };

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

  // Her yeni soru için seçenekleri karıştır
  useEffect(() => {
    randomizeOptions();
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
    isPreloading,
    gameCompleted,
    gameOver,
    lives,
    score,
    totalQuestions,
    sessionStats,
    handleAnswer,
    randomizeOptions,
    restartGame
  };
}; 