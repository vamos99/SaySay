export interface Oyun3Question {
  id?: string;
  text: string[];        // ["Ali sabah ", "____", " kalktı"]
  blanks: string[];      // ["erken", "fırçaladı"]
  options: string[][];   // [["erken", "geç", "oynadı"], ["fırçaladı", "yedi", "koştu"]]
  difficulty: 'short' | 'medium' | 'long';
  theme: string;
  child_id?: string;
  created_at?: string;
}

export class GeminiService {
  async generateOyun3Content(childTheme: string, difficulty: 'short' | 'medium' | 'long'): Promise<Oyun3Question[]> {
    try {
      const response = await fetch('/api/oyun3/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: childTheme, difficulty })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Oyun3 içerik API hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return this.validateQuestions(data.questions, childTheme, difficulty);
    } catch (error) {
      console.error('Oyun3 içerik üretim hatası:', error);
      return this.getFallbackQuestion();
    }
  }

  private validateQuestions(
    questions: unknown,
    theme: string,
    difficulty: 'short' | 'medium' | 'long'
  ): Oyun3Question[] {
    try {
      if (!Array.isArray(questions)) {
        return this.getFallbackQuestion();
      }

      const validQuestions = questions.filter((q, index) => {
        if (!q || typeof q !== 'object') {
          console.error(`❌ Soru ${index + 1}: Obje değil`);
          return false;
        }

        const question = q as Partial<Oyun3Question>;
        if (!question.text || !question.blanks || !question.options) {
          console.error(`❌ Soru ${index + 1}: Eksik alanlar`);
          return false;
        }

        if (!Array.isArray(question.text) || !Array.isArray(question.blanks) || !Array.isArray(question.options)) {
          console.error(`❌ Soru ${index + 1}: Array değil`);
          return false;
        }

        if (question.blanks.length !== question.options.length) {
          console.error(`❌ Soru ${index + 1}: Boşluk ve seçenek sayısı uyuşmuyor`);
          return false;
        }

        const totalWords = question.text.join(' ').split(' ').length;
        if (totalWords < 8 || totalWords > 25) {
          console.error(`❌ Soru ${index + 1}: Uzunluk uygun değil (${totalWords} kelime)`);
          return false;
        }

        if (question.blanks.length < 2 || question.blanks.length > 5) {
          console.error(`❌ Soru ${index + 1}: Boşluk sayısı uygun değil (${question.blanks.length})`);
          return false;
        }

        for (let i = 0; i < question.options.length; i++) {
          if (!Array.isArray(question.options[i]) || question.options[i].length !== 4) {
            console.error(`❌ Soru ${index + 1}: Seçenek ${i + 1} geçersiz`);
            return false;
          }
        }

        return true;
      });

      if (validQuestions.length === 0) {
        console.error('❌ Hiç geçerli soru yok');
        return this.getFallbackQuestion();
      }

      return validQuestions.map(q => ({
        id: crypto.randomUUID(),
        text: q.text,
        blanks: q.blanks,
        options: q.options,
        difficulty,
        theme
      }));

    } catch (error) {
      console.error('❌ Oyun3 doğrulama hatası:', error);
      return this.getFallbackQuestion();
    }
  }

  private getFallbackQuestion(): Oyun3Question[] {
    // Tema bazlı fallback sorular
    const themeQuestions = {
      hayvanlar: {
        short: {
          text: ["Kedi ", "____", " yemek yedi."],
          blanks: ["sabah"],
          options: [["sabah", "gece", "öğle", "akşam"]]
        },
        medium: {
          text: ["Köpek parkta ", "____", " oynadı ve ", "____", " koştu."],
          blanks: ["top", "hızlı"],
          options: [["top", "çiçek", "ağaç", "kuş"], ["hızlı", "yavaş", "uzun", "kısa"]]
        },
        long: {
          text: ["Bir gün tavşan ve kaplumbağa yarış yapmaya karar verdiler. Tavşan ", "____", " koştu ama kaplumbağa ", "____", " yürüdü. Sonunda kaplumbağa ", "____", " oldu."],
          blanks: ["hızlı", "yavaş", "kazanan"],
          options: [["hızlı", "yavaş", "uzun", "kısa"], ["yavaş", "hızlı", "dikkatli", "dikkatsiz"], ["kazanan", "kaybeden", "birinci", "sonuncu"]]
        }
      },
      renkler: {
        short: {
          text: ["Gökyüzü ", "____", " renkte."],
          blanks: ["mavi"],
          options: [["mavi", "kırmızı", "yeşil", "sarı"]]
        },
        medium: {
          text: ["Çiçek ", "____", " renkte ve yaprak ", "____", " renkte."],
          blanks: ["kırmızı", "yeşil"],
          options: [["kırmızı", "mavi", "sarı", "turuncu"], ["yeşil", "kahverengi", "gri", "siyah"]]
        },
        long: {
          text: ["Gökkuşağında yedi renk vardır. En üstte ", "____", " renk, ortada ", "____", " renk ve en altta ", "____", " renk bulunur."],
          blanks: ["kırmızı", "yeşil", "mor"],
          options: [["kırmızı", "mavi", "sarı", "turuncu"], ["yeşil", "mavi", "sarı", "turuncu"], ["mor", "kırmızı", "mavi", "yeşil"]]
        }
      },
      sayılar: {
        short: {
          text: ["Bir artı bir ", "____", " eder."],
          blanks: ["iki"],
          options: [["iki", "üç", "dört", "beş"]]
        },
        medium: {
          text: ["Beş artı üç ", "____", " eder ve on eksi ", "____", " altı eder."],
          blanks: ["sekiz", "dört"],
          options: [["sekiz", "yedi", "dokuz", "altı"], ["dört", "üç", "beş", "iki"]]
        },
        long: {
          text: ["Matematik dersinde öğrenciler sayıları öğrendi. Bir artı bir ", "____", " eder, iki artı iki ", "____", " eder ve üç artı üç ", "____", " eder."],
          blanks: ["iki", "dört", "altı"],
          options: [["iki", "üç", "dört", "beş"], ["dört", "beş", "altı", "yedi"], ["altı", "yedi", "sekiz", "dokuz"]]
        }
      }
    };

    // Genel fallback sorular kullan
    // Genel fallback sorular
    const generalFallback = {
      short: {
        text: ["Ali", "sabah", "erken", "kalktı", "ve", "dişlerini", "fırçaladı"],
        blanks: ["erken", "fırçaladı"],
        options: [
          ["erken", "geç", "oynadı", "yedi"],
          ["fırçaladı", "yedi", "koştu", "okudu"]
        ]
      },
      medium: {
        text: ["Ayşe", "okuldan", "sonra", "evde", "ödevini", "yaptı", "ve", "annesi", "ona", "çikolata", "verdi"],
        blanks: ["yaptı", "verdi"],
        options: [
          ["yaptı", "yapmadı", "yapıyor", "yapacak"],
          ["verdi", "vermedi", "veriyor", "verecek"]
        ]
      },
      long: {
        text: ["Mehmet", "parkta", "arkadaşlarıyla", "futbol", "oynadı", "ve", "çok", "eğlendi", "sonra", "evine", "döndü"],
        blanks: ["oynadı", "eğlendi", "döndü"],
        options: [
          ["oynadı", "oynamadı", "oynuyor", "oynayacak"],
          ["eğlendi", "eğlenmedi", "eğleniyor", "eğlenecek"],
          ["döndü", "dönmedi", "dönüyor", "dönecek"]
        ]
      }
    };

    const fallback = generalFallback.medium;
    
    return [
      {
        ...fallback,
        difficulty: 'medium' as 'short' | 'medium' | 'long',
        theme: 'genel'
      }
    ];
  }
} 
