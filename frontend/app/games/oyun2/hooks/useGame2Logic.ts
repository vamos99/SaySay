import { useState, useEffect, useCallback } from 'react';

interface Game2Object {
  id: string;
  name: string;
  image_url: string;
}

interface Game2Action {
  id: number;
  name: string;
  image_url: string;
}

interface Game2Data {
  objects: Game2Object[];
  actions: Game2Action[];
}

// Cloud Run API URL
const API_BASE_URL = 'https://vertex-ai-backend-1003061737705.us-central1.run.app';

export const useGame2Logic = (childId: string | null) => {
  const [gameData, setGameData] = useState<Game2Data | null>(null);
  const [selectedObject, setSelectedObject] = useState<Game2Object | null>(null);
  const [selectedAction, setSelectedAction] = useState<Game2Action | null>(null);
  const [generatedSentence, setGeneratedSentence] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // Yeni state: cümle tamamlandı mı?

  // Game2 verilerini yükle
  const loadGameData = useCallback(async () => {
    if (!childId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/game2/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ child_id: childId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGameData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [childId]);

  // Game2 cümle oluştur
  const generateSentence = useCallback(async (objectName: string, actionName: string) => {
    setSentenceLoading(true);
    setError(null);
    setGeneratedSentence(''); // Önceki cümleyi temizle
    setAudioUrl(''); // Önceki sesi temizle

    try {
      const response = await fetch(`${API_BASE_URL}/game2/generate-sentence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          object_name: objectName, 
          action_name: actionName 
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Cümleyi session storage'a kaydet
      sessionStorage.setItem('game2_sentence', data.sentence);
      sessionStorage.setItem('game2_object', objectName);
      sessionStorage.setItem('game2_action', actionName);
      
      setGeneratedSentence(data.sentence);
      return data.sentence;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cümle oluşturulurken hata oluştu');
      return null;
    } finally {
      setSentenceLoading(false);
    }
  }, []);

  // Game2 TTS audio oluştur
  const generateTTS = useCallback(async (sentence: string) => {
    setTtsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/game2/generate-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Ses URL'ini session storage'a kaydet
      sessionStorage.setItem('game2_audio_url', data.audio_url);
      
      setAudioUrl(data.audio_url);
      return data.audio_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ses oluşturulurken hata oluştu');
      return null;
    } finally {
      setTtsLoading(false);
    }
  }, []);

  // Nesne seç
  const selectObject = useCallback((object: Game2Object) => {
    setSelectedObject(object);
  }, []);

  // Eylem seç
  const selectAction = useCallback((action: Game2Action) => {
    setSelectedAction(action);
  }, []);

  // Ses çal
  const playAudio = useCallback(async () => {
    if (!audioUrl) return;

    setIsPlaying(true);
    setError(null);
    
    try {
      const audio = new Audio(audioUrl);
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Ses dosyası yüklenirken hata oluştu');
        setIsPlaying(false);
      };
      
      audio.oncanplaythrough = async () => {
        try {
          await audio.play();
        } catch (playError) {
          console.error('Audio play error:', playError);
          setError('Ses çalınırken hata oluştu');
          setIsPlaying(false);
        }
      };
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.load();
      
    } catch (err) {
      console.error('Audio creation error:', err);
      setError('Ses çalınırken hata oluştu');
      setIsPlaying(false);
    }
  }, [audioUrl]);

  // TTS tamamlandığında seçimleri temizle
  useEffect(() => {
    if (audioUrl && !ttsLoading && !sentenceLoading) {
      setIsCompleted(true);
      // 3 saniye sonra sadece seçimleri temizle
      const timer = setTimeout(() => {
        setSelectedObject(null);
        setSelectedAction(null);
        setIsCompleted(false);
        // Session storage'dan sadece seçimleri temizle
        sessionStorage.removeItem('game2_object');
        sessionStorage.removeItem('game2_action');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [audioUrl, ttsLoading, sentenceLoading]);

  // Seçimleri temizle
  const clearSelections = useCallback(() => {
    setSelectedObject(null);
    setSelectedAction(null);
    setGeneratedSentence('');
    setAudioUrl('');
    setIsCompleted(false);
    // Session storage'ı temizle
    sessionStorage.removeItem('game2_sentence');
    sessionStorage.removeItem('game2_audio_url');
    sessionStorage.removeItem('game2_object');
    sessionStorage.removeItem('game2_action');
  }, []);

  // Session'dan veri yükle
  const loadFromSession = useCallback(() => {
    const savedSentence = sessionStorage.getItem('game2_sentence');
    const savedAudioUrl = sessionStorage.getItem('game2_audio_url');
    const savedObject = sessionStorage.getItem('game2_object');
    const savedAction = sessionStorage.getItem('game2_action');

    if (savedSentence) {
      setGeneratedSentence(savedSentence);
    }
    if (savedAudioUrl) {
      setAudioUrl(savedAudioUrl);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadGameData();
    loadFromSession(); // Session'dan veri yükle
  }, [loadGameData, loadFromSession]);

  // Hem nesne hem eylem seçiliyse cümle oluştur
  useEffect(() => {
    if (selectedObject && selectedAction) {
      generateSentence(selectedObject.name, selectedAction.name);
    }
  }, [selectedObject, selectedAction, generateSentence]);

  // Cümle oluşturulduğunda TTS oluştur
  useEffect(() => {
    if (generatedSentence && !audioUrl) {
      generateTTS(generatedSentence);
    }
  }, [generatedSentence, audioUrl, generateTTS]);

  return {
    gameData,
    selectedObject,
    selectedAction,
    generatedSentence,
    audioUrl,
    loading,
    error,
    isPlaying,
    sentenceLoading,
    ttsLoading,
    isCompleted,
    selectObject,
    selectAction,
    playAudio,
    clearSelections,
    loadGameData,
  };
}; 