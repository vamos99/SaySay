import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://say-say.vercel.app/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { object_name, action_name } = body;

    if (!object_name || !action_name) {
      return NextResponse.json(
        { error: 'object_name ve action_name zorunlu' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/game2/generate-sentence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ object_name, action_name }),
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
    console.error('Game2 sentence generation API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 