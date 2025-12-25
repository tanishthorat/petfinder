import { NextRequest, NextResponse } from 'next/server';
import { toggleLike, getLikedPetIdsForUser } from '@/lib/supabase';

// Simple likes endpoint. Expects `x-user-id` header with user id.

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Missing x-user-id header' }, { status: 400 });

    const liked = await getLikedPetIdsForUser(userId);
    return NextResponse.json({ liked: liked ?? [] });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Missing x-user-id header' }, { status: 400 });

    const body = await request.json();
    const petId = body?.pet_id;
    const action = body?.action ?? 'like'; // 'like' or 'unlike'

    if (!petId) return NextResponse.json({ error: 'Missing pet_id in body' }, { status: 400 });

    const result = await toggleLike(userId, petId, action === 'like');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
