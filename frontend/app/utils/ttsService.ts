export class TTSService {
  private currentSpeech: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking = false;

  speak(text: string): void {
    // Önceki sesi durdur
    this.stop();
    
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('TTS kullanılamıyor');
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Türkçe ses seç
      const voices = window.speechSynthesis.getVoices();
      const turkishVoice = voices.find(voice => 
        voice.lang.includes('tr') || voice.lang.includes('TR')
      );
      if (turkishVoice) {
        utterance.voice = turkishVoice;
      }

      this.currentSpeech = utterance;
      this.isCurrentlySpeaking = true;

      utterance.onstart = () => {
        console.log('🔊 TTS başladı');
        this.isCurrentlySpeaking = true;
      };

      utterance.onend = () => {
        console.log('🔊 TTS bitti');
        this.isCurrentlySpeaking = false;
        this.currentSpeech = null;
      };

      utterance.onerror = (event) => {
        console.warn('❌ TTS hatası:', event.error);
        this.isCurrentlySpeaking = false;
        this.currentSpeech = null;
        
        // interrupted hatası için özel handling
        if (event.error === 'interrupted') {
          console.log('🔄 TTS interrupted, yeniden deneniyor...');
          // Kısa bir bekleme sonrası yeniden dene
          setTimeout(() => {
            if (this.isCurrentlySpeaking) {
              this.speak(text);
            }
          }, 100);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS başlatma hatası:', error);
      this.isCurrentlySpeaking = false;
    }
  }

  stop(): void {
    if (typeof window === 'undefined') return;
    
    if (this.currentSpeech) {
      window.speechSynthesis.cancel();
      this.currentSpeech = null;
      this.isCurrentlySpeaking = false;
      console.log('⏹️ TTS durduruldu');
    }
  }

  pause(): void {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.pause();
  }

  resume(): void {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.resume();
  }

  isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  cleanTextForSpeech(text: string[]): string {
    return text.join(' ').replace(/____/g, '...');
  }
} 