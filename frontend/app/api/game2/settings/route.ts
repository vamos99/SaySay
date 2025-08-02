import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://say-say.vercel.app/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { child_id } = body;

    if (!child_id) {
      return NextResponse.json({ error: 'child_id is required' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/game2/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ child_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to fetch settings' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Game2 settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 