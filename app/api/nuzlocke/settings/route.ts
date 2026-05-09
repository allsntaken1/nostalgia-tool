import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns } from '@/app/lib/nuzlocke-storage';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({
        connected: false,
        totalRuns: 0,
        storageMode: 'localStorage fallback',
      });
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get('client_id')?.trim() || '';
    const runs = clientId ? await listNuzlockeRuns(clientId) : [];
    return NextResponse.json({
      connected: true,
      totalRuns: runs.length,
      storageMode: 'Dedicated Nuzlocke Supabase',
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        totalRuns: 0,
        storageMode: 'localStorage fallback',
        error: error instanceof Error ? error.message : 'Could not read Nuzlocke settings.',
      },
      { status: 500 }
    );
  }
}
