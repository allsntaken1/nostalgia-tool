import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns } from '@/app/lib/nuzlocke-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({
        connected: false,
        totalRuns: 0,
        storageMode: 'localStorage fallback',
      });
    }

    const runs = await listNuzlockeRuns();
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
