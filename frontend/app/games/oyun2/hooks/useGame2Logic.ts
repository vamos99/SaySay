import { useState, useEffect, useCallback } from 'react';

interface Game2Object {
  id: number;
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

export const useGame2Logic = (childId: string | null) => {
  const [gameData, setGameData] = useState<Game2Data | null>(null);
  const [selectedObject, setSelectedObject] = useState<Game2Object | null>(null);
  const [selectedAction, setSelectedAction] = useState<Game2Action | null>(null);
  const [generatedSentence, setGeneratedSentence] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Oyun verilerini yükle
  const loadGameData = useCallback(async () => {
    if (!childId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/game2/data', {
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

      if (data.objects.length === 0 && data.actions.length === 0) {
        throw new Error('Veritabanında nesne veya eylem bulunamadı. Lütfen Supabase veritabanınızı kontrol edin.');
      }

      setGameData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [childId]);

  // Cümle oluştur
  const generateSentence = useCallback(async (objectName: string, actionName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/game2/generate-sentence', {
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

      setGeneratedSentence(data.sentence);
      return data.sentence;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cümle oluşturulurken hata oluştu');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // TTS audio oluştur
  const generateTTS = useCallback(async (sentence: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/game2/generate-tts', {
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

      setAudioUrl(data.audio_url);
      return data.audio_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ses oluşturulurken hata oluştu');
      return null;
    } finally {
      setLoading(false);
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
      
      // Audio yükleme hatalarını yakala
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Ses dosyası yüklenirken hata oluştu');
        setIsPlaying(false);
      };
      
      // Audio yüklendiğinde çal
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
      
      // Audio'yu yükle
      audio.load();
      
    } catch (err) {
      console.error('Audio creation error:', err);
      setError('Ses çalınırken hata oluştu');
      setIsPlaying(false);
    }
  }, [audioUrl]);

  // Seçimleri temizle
  const clearSelections = useCallback(() => {
    setSelectedObject(null);
    setSelectedAction(null);
    setGeneratedSentence('');
    setAudioUrl('');
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  // Hem nesne hem eylem seçiliyse cümle oluştur
  useEffect(() => {
    if (selectedObject && selectedAction) {
      generateSentence(selectedObject.name, selectedAction.name);
    }
  }, [selectedObject, selectedAction, generateSentence]);

  // Cümle oluşturulduğunda TTS oluştur
  useEffect(() => {
    if (generatedSentence) {
      generateTTS(generatedSentence);
    }
  }, [generatedSentence, generateTTS]);

  return {
    gameData,
    selectedObject,
    selectedAction,
    generatedSentence,
    audioUrl,
    loading,
    error,
    isPlaying,
    selectObject,
    selectAction,
    playAudio,
    clearSelections,
    loadGameData,
  };
}; 