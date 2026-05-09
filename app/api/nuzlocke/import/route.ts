import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns, saveNuzlockeRuns } from '@/app/lib/nuzlocke-storage';
import type { NuzlockeRun } from '@/app/nuzlocke/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const runs = Array.isArray(body?.runs) ? body.runs as NuzlockeRun[] : [];

    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, imported: 0, verified: false });
    }

    await saveNuzlockeRuns(runs);
    const savedRuns = await listNuzlockeRuns();
    const savedIds = new Set(savedRuns.map((run) => run.id));
    const verified = runs.every((run) => savedIds.has(run.id));

    return NextResponse.json({ configured: true, imported: runs.length, verified });
  } catch (error) {
    return NextResponse.json(
      { configured: isNuzlockeDatabaseConfigured(), imported: 0, verified: false, error: error instanceof Error ? error.message : 'Could not import Nuzlocke runs.' },
      { status: 500 }
    );
  }
}
