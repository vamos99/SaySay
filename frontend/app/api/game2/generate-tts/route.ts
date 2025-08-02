import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://say-say.vercel.app/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentence } = body;

    if (!sentence) {
      return NextResponse.json(
        { error: 'sentence zorunlu' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/game2/generate-tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sentence }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Backend hatası' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Game2 TTS generation API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 