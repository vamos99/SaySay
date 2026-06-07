import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/utils/env';

const BACKEND_URL = getBackendBaseUrl();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { child_id, selected_object_ids, selected_action_ids } = body;

    if (!child_id) {
      return NextResponse.json({ success: false, error: 'child_id is required' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/game2/settings/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        child_id, 
        selected_object_ids: selected_object_ids || [], 
        selected_action_ids: selected_action_ids || [] 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: data.error || 'Failed to update settings' 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Game2 settings update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 
