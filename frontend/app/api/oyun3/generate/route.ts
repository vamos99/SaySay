import { NextRequest, NextResponse } from 'next/server';

type Difficulty = 'short' | 'medium' | 'long';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const theme = typeof body.theme === 'string' && body.theme.trim() ? body.theme.trim() : 'genel';
    const difficulty = normalizeDifficulty(body.difficulty);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 503 });
    }

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(theme, difficulty) }],
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Gemini request failed with ${response.status}.` }, { status: 502 });
    }

    const data = await response.json();
    const questions = extractQuestions(data);

    if (!questions.length) {
      return NextResponse.json({ error: 'Gemini response did not include valid JSON questions.' }, { status: 502 });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Oyun3 generate route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function normalizeDifficulty(value: unknown): Difficulty {
  return value === 'short' || value === 'long' || value === 'medium' ? value : 'medium';
}

function buildPrompt(theme: string, difficulty: Difficulty): string {
  const difficultySettings = {
    short: { minWords: 5, maxWords: 10, minBlanks: 2, maxBlanks: 3 },
    medium: { minWords: 12, maxWords: 16, minBlanks: 3, maxBlanks: 4 },
    long: { minWords: 18, maxWords: 22, minBlanks: 4, maxBlanks: 5 },
  };
  const settings = difficultySettings[difficulty];

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

function extractQuestions(response: any): unknown[] {
  const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof content !== 'string') {
    return [];
  }

  let jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) {
    jsonMatch = content.match(/\[[\s\S]*\]/);
  }

  if (!jsonMatch) {
    return [];
  }

  try {
    const questions = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return Array.isArray(questions) ? questions : [];
  } catch {
    return [];
  }
}
