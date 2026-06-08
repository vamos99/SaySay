import { GeminiService, Oyun3Question } from './geminiService';
import { logger } from './logger';
import { TTSService } from './ttsService';
import { supabase } from './supabaseClient';

export class Oyun3Cache {
  private cache = new Map<string, Oyun3Question[]>();
  private geminiService = new GeminiService();
  private ttsService = new TTSService();
  private lastChildId: string | null = null;

  async getQuestions(childId: string, difficulty: string, theme: string): Promise<Oyun3Question[]> {
    const key = `${childId}_${difficulty}`;
    
    // Çocuk değiştiyse cache'i temizle
    if (this.lastChildId !== childId) {
      this.clearCache();
      this.lastChildId = childId;
    }

    let questions = this.cache.get(key) || [];

    // Database'den mevcut soruları al
    if (questions.length === 0) {
      questions = await this.loadFromDatabase(childId, difficulty);
      this.cache.set(key, questions);
    }

    // Eğer 2'den az soru varsa yeni üret
    if (questions.length < 2) {
      try {
        logger.debug(`Yeni soru üretiliyor... (${questions.length}/2)`);
        const newQuestions = await this.geminiService.generateOyun3Content(theme, difficulty as any);
        
        // Database'e kaydet
        for (const question of newQuestions) {
          await this.saveToDatabase(childId, question, difficulty, theme);
        }
        
        questions.push(newQuestions[0]); // Assuming the first generated question is the one to add
        this.cache.set(key, questions);
        logger.debug(`Yeni soru üretildi! (${questions.length}/2)`);
      } catch (error) {
        logger.error('Yeni soru üretme hatası:', error);
      }
    }

    return questions.slice(0, 5); // Maksimum 5 soru
  }

  private async loadFromDatabase(childId: string, difficulty: string): Promise<Oyun3Question[]> {
    try {
      const { data, error } = await supabase
        .from('oyun3_questions')
        .select('*')
        .eq('child_id', childId)
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        logger.error('Database yükleme hatası:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Database yükleme hatası:', error);
      return [];
    }
  }

  private async saveToDatabase(childId: string, question: Oyun3Question, difficulty: string, theme: string) {
    try {
      logger.debug('Database\'e kaydediliyor:', {
        childId,
        difficulty,
        theme,
        questionId: question.id
      });

      const { error } = await supabase
        .from('oyun3_questions')
        .insert({
          child_id: childId,
          text: question.text,
          blanks: question.blanks,
          options: question.options,
          difficulty,
          theme
        });

      if (error) {
        logger.error('Database kaydetme hatası:', error);
      } else {
        logger.debug('Database\'e başarıyla kaydedildi');
      }
    } catch (error) {
      logger.error('Database kaydetme exception:', error);
    }
  }

  speakQuestion(text: string[], wantTTS: boolean): void {
    if (!wantTTS) return;
    
    const cleanText = this.ttsService.cleanTextForSpeech(text);
    this.ttsService.speak(cleanText);
  }

  stopSpeaking(): void {
    this.ttsService.stop();
  }

  isSpeaking(): boolean {
    return this.ttsService.isSpeaking();
  }

  clearCache(childId?: string): void {
    if (childId) {
      // Belirli çocuğun cache'ini temizle
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(childId));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Tüm cache'i temizle
      this.cache.clear();
    }
  }

  async logGameSession(childId: string, questionId: string, correctAnswers: number, wrongAnswers: number, totalTime: number, difficulty: string): Promise<void> {
    try {
      const sessionId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('oyun3_logs')
        .insert({
          child_id: childId,
          session_id: sessionId,
          question_id: questionId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          total_time: totalTime,
          difficulty
        });

      if (error) {
        logger.error('Log kaydetme hatası:', error);
      }
    } catch (error) {
      logger.error('Log kaydetme hatası:', error);
    }
  }
}
