import { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';

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
      console.log('Görseller yüklendi:', newLoadedImages.size, 'adet');
    } catch (error) {
      console.warn('Görsel preloading hatası:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const fetchAIContent = async (childId: string) => {
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI content fetch error:', error);
      return null;
    }
  };

  const logInteraction = async (childId: string, concept: string, isCorrect: boolean, question: string) => {
    try {
      const { error } = await supabase
        .from('interaction_logs')
        .insert({
          child_id: childId,
          event_type: 'oyun1',
          details: {
            concept: concept,
            is_correct: isCorrect,
            question: question
          },
          response_time_ms: 0 // Şimdilik 0, sonra hesaplanabilir
        });

      if (error) {
        console.error('Interaction log error:', error);
      } else {
        console.log('Interaction logged successfully');
      }
    } catch (error) {
      console.error('Interaction log error:', error);
    }
  };

  const loadGameContent = async () => {
    if (!childId) return;

    try {
      // Oyun state'ini sıfırla
      setGameCompleted(false);
      setGameOver(false);
      setCurrentConceptIndex(0);
      setFeedback(null);
      setLives(3); // Canları sıfırla
      
      // Önce DB'den kontrol et
      const { data: dbContent } = await supabase
        .from('ai_content')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (dbContent && dbContent.length > 0) {
        setAiContent(dbContent);
        setCurrentConceptIndex(0);
        preloadImages(dbContent);
        setLoading(false);
        return;
      }

      // DB'de yoksa backend'den çek
      const aiContent = await fetchAIContent(childId);
      if (aiContent && aiContent.all_concepts) {
        const filteredContent = aiContent.all_concepts.filter((c: any) => !c.error);
        setAiContent(filteredContent);
        setCurrentConceptIndex(0);
        preloadImages(filteredContent);
      }
    } catch (error) {
      console.error('Game content load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!childId || !aiContent[currentConceptIndex]) return;

    const currentContent = aiContent[currentConceptIndex];
    setFeedback(isCorrect ? 'dogru' : 'yanlis');

    // Interaction log kaydet
    await logInteraction(
      childId,
      currentContent.concept,
      isCorrect,
      currentContent.question
    );

    // 1.5 saniye sonra işlem yap
    setTimeout(() => {
      setFeedback(null);
      
      if (isCorrect) {
        // Doğru cevap - sonraki soruya geç
        if (currentConceptIndex < aiContent.length - 1) {
          setCurrentConceptIndex(currentConceptIndex + 1);
        } else {
          // Tüm sorular tamamlandı
          setGameCompleted(true);
        }
      } else {
        // Yanlış cevap - can azalt
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          // Canlar bitti - oyun bitti
          setGameOver(true);
        } else {
          // Hala can var - aynı soruyu tekrar dene
          // Sadece seçenekleri karıştır
          randomizeOptions();
        }
      }
    }, 1500);
  };

  // Oyun tamamlandı mı kontrolü
  const isGameCompleted = gameCompleted || gameOver;

  const randomizeOptions = () => {
    setOptionOrder([Math.random(), Math.random()].map((_, i) => i).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    loadGameContent();
  }, [childId]);

  useEffect(() => {
    randomizeOptions();
  }, [currentConceptIndex]);

  return {
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
  };
}; 