import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns, saveNuzlockeRuns } from '@/app/lib/nuzlocke-storage';
import type { NuzlockeRun } from '@/app/nuzlocke/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, runs: [] });
    }

    const runs = await listNuzlockeRuns();
    return NextResponse.json({ configured: true, runs });
  } catch (error) {
    return NextResponse.json(
      { configured: isNuzlockeDatabaseConfigured(), runs: [], error: error instanceof Error ? error.message : 'Could not load Nuzlocke runs.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const runs = Array.isArray(body?.runs) ? body.runs as NuzlockeRun[] : [];

    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, saved: 0 });
    }

    const result = await saveNuzlockeRuns(runs);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { configured: isNuzlockeDatabaseConfigured(), saved: 0, error: error instanceof Error ? error.message : 'Could not save Nuzlocke runs.' },
      { status: 500 }
    );
  }
}
