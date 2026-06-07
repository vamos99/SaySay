import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/utils/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { child_id } = body;

    if (!child_id) {
      return NextResponse.json({ error: 'child_id zorunlu' }, { status: 400 });
    }

    const API_URL = getBackendBaseUrl();
    
    

    const response = await fetch(`${API_URL}/generate-full-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ child_id }),
    });

    

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend hatası:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend hatası: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route hatası:', error);
    return NextResponse.json(
      { error: `API Route hatası: ${error}` },
      { status: 500 }
    );
  }
} 
