import { NextResponse } from 'next/server';
import { isNuzlockeDatabaseConfigured, listNuzlockeRuns, saveNuzlockeRuns } from '@/app/lib/nuzlocke-storage';
import type { NuzlockeRun } from '@/app/nuzlocke/types';

export const dynamic = 'force-dynamic';

function clientIdFromUrl(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get('client_id')?.trim() || '';
}

function clientIdFromBody(body: unknown) {
  return typeof (body as { clientId?: unknown })?.clientId === 'string'
    ? ((body as { clientId: string }).clientId).trim()
    : '';
}

export async function GET(request: Request) {
  try {
    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, runs: [] });
    }

    const clientId = clientIdFromUrl(request);
    if (!clientId) return NextResponse.json({ configured: true, runs: [] });

    const runs = await listNuzlockeRuns(clientId);
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
    const body = await request.json().catch(() => null);
    const runs = Array.isArray(body?.runs) ? body.runs as NuzlockeRun[] : [];
    const clientId = clientIdFromBody(body);

    if (!isNuzlockeDatabaseConfigured()) {
      return NextResponse.json({ configured: false, saved: 0 });
    }

    if (!clientId) {
      return NextResponse.json({ configured: true, saved: 0, error: 'Missing client_id.' }, { status: 400 });
    }

    const result = await saveNuzlockeRuns(clientId, runs);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { configured: isNuzlockeDatabaseConfigured(), saved: 0, error: error instanceof Error ? error.message : 'Could not save Nuzlocke runs.' },
      { status: 500 }
    );
  }
}
