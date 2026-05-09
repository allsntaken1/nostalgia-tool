import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns, saveNuzlockeRuns } from '@/app/lib/nuzlocke-storage';
import type { NuzlockeRun } from '@/app/nuzlocke/types';

export const dynamic = 'force-dynamic';

function clientIdFromBody(body: unknown) {
  return typeof (body as { clientId?: unknown })?.clientId === 'string'
    ? ((body as { clientId: string }).clientId).trim()
    : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const runs = Array.isArray(body?.runs) ? body.runs as NuzlockeRun[] : [];
    const clientId = clientIdFromBody(body);

    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, imported: 0, verified: false });
    }

    if (!clientId) {
      return NextResponse.json({ configured: true, imported: 0, verified: false, error: 'Missing client_id.' }, { status: 400 });
    }

    await saveNuzlockeRuns(clientId, runs);
    const savedRuns = await listNuzlockeRuns(clientId);
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
