import { NextResponse } from 'next/server';
import { listVolumeStats, updateVolumeStats } from '@/app/lib/storage';

export async function GET() {
  try {
    const stats = await listVolumeStats();

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load volume stats.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === 'string' ? body.id : '';
  const vote = body?.vote === 1 || body?.vote === -1 ? body.vote : 0;
  const previousVote = body?.previousVote === 1 || body?.previousVote === -1 ? body.previousVote : 0;

  if (!id) {
    return NextResponse.json({ error: 'Missing archive item id.' }, { status: 400 });
  }

  if (vote !== 1 && vote !== -1) {
    return NextResponse.json({ error: 'Invalid volume vote.' }, { status: 400 });
  }

  try {
    const stats = await updateVolumeStats(id, vote, previousVote);

    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update volume.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
