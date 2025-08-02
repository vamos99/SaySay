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
  private apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  async generateOyun3Content(childTheme: string, difficulty: 'short' | 'medium' | 'long'): Promise<Oyun3Question[]> {
    try {
      if (!this.apiKey) {
        console.warn('API key bulunamadı, fallback kullanılıyor');
        return this.getFallbackQuestion();
      }

      const prompt = this.buildPrompt(childTheme, difficulty);
      console.log('Gemini prompt:', prompt);
      
      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return this.parseGeminiResponse(data);
    } catch (error) {
      console.error('Gemini API hatası:', error);
      console.log('Fallback soru kullanılıyor...');
      return this.getFallbackQuestion();
    }
  }

  private buildPrompt(theme: string, difficulty: string): string {
    const difficultySettings = {
      short: { minWords: 5, maxWords: 10, minBlanks: 2, maxBlanks: 3 },
      medium: { minWords: 12, maxWords: 16, minBlanks: 3, maxBlanks: 4 },
      long: { minWords: 18, maxWords: 22, minBlanks: 4, maxBlanks: 5 }
    };

    const settings = difficultySettings[difficulty as keyof typeof difficultySettings] || difficultySettings.medium;

    return `Sen bir Türkçe öğretmenisin. ${theme} temasıyla ilgili boşluk doldurma soruları oluştur.

KURALLAR:
1. Sadece JSON formatında cevap ver
2. Her soru için:
   - text: Cümle parçaları dizisi (${settings.minWords}-${settings.maxWords} kelime)
   - blanks: Doğru cevaplar dizisi (${settings.minBlanks}-${settings.maxBlanks} adet)
   - options: Her boşluk için 4 seçenek (doğru + 3 yanlış)
3. Cümleler ${theme} temasıyla ilgili olmalı
4. Boşluklar mantıklı yerlerde olmalı
5. Seçenekler aynı kelime türünde olmalı
6. Yanlış seçenekler mantıklı ama yanlış olmalı

ÖRNEK:
\`\`\`json
[
  {
    "text": ["Ayşe", "okuldan", "sonra", "evde", "ödevini", "yaptı", "ve", "annesi", "ona", "çikolata", "verdi"],
    "blanks": ["yaptı", "verdi"],
    "options": [
      ["yaptı", "yapmadı", "yapıyor", "yapacak"],
      ["verdi", "vermedi", "veriyor", "verecek"]
    ]
  }
]
\`\`\`

Lütfen 2 adet soru oluştur.`;
  }

  private parseGeminiResponse(response: any): Oyun3Question[] {
    try {
      console.log('🔍 Raw response:', response);
      
      if (!response || !response.candidates || !response.candidates[0]) {
        console.error('❌ Geçersiz response formatı');
        return this.getFallbackQuestion();
      }

      const content = response.candidates[0].content.parts[0].text;
      console.log('📝 Content:', content);

      // JSON çıkar
      let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        jsonMatch = content.match(/\[[\s\S]*\]/);
      }

      if (!jsonMatch) {
        console.error('❌ JSON bulunamadı');
        return this.getFallbackQuestion();
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      console.log('🔧 JSON string:', jsonStr);

      const questions = JSON.parse(jsonStr);
      console.log('✅ Parsed questions:', questions);

      if (!Array.isArray(questions)) {
        console.error('❌ Questions array değil');
        return this.getFallbackQuestion();
      }

      // Her soru için validasyon
      const validQuestions = questions.filter((q, index) => {
        if (!q.text || !q.blanks || !q.options) {
          console.error(`❌ Soru ${index + 1}: Eksik alanlar`);
          return false;
        }

        if (!Array.isArray(q.text) || !Array.isArray(q.blanks) || !Array.isArray(q.options)) {
          console.error(`❌ Soru ${index + 1}: Array değil`);
          return false;
        }

        if (q.blanks.length !== q.options.length) {
          console.error(`❌ Soru ${index + 1}: Boşluk ve seçenek sayısı uyuşmuyor`);
          return false;
        }

        // Uzunluk kontrolü
        const totalWords = q.text.join(' ').split(' ').length;
        if (totalWords < 8 || totalWords > 25) {
          console.error(`❌ Soru ${index + 1}: Uzunluk uygun değil (${totalWords} kelime)`);
          return false;
        }

        if (q.blanks.length < 2 || q.blanks.length > 5) {
          console.error(`❌ Soru ${index + 1}: Boşluk sayısı uygun değil (${q.blanks.length})`);
          return false;
        }

        // Her seçenek için kontrol
        for (let i = 0; i < q.options.length; i++) {
          if (!Array.isArray(q.options[i]) || q.options[i].length !== 4) {
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

      console.log(`✅ ${validQuestions.length} geçerli soru bulundu`);
      return validQuestions.map(q => ({
        id: crypto.randomUUID(),
        text: q.text,
        blanks: q.blanks,
        options: q.options,
        difficulty: 'medium' as 'short' | 'medium' | 'long',
        theme: 'genel'
      }));

    } catch (error) {
      console.error('❌ Parse hatası:', error);
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