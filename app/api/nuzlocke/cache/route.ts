import { NextResponse } from 'next/server';
import { isNuzlockeSupabaseConfigured, nuzlockeSupabaseHeaders, nuzlockeSupabaseRequest } from '@/lib/nuzlocke/supabase/server';

export const dynamic = 'force-dynamic';

function tableFor(kind: string) {
  if (kind === 'pokemon') return 'pokemon_species_cache';
  if (kind === 'move') return 'pokemon_move_cache';
  if (kind === 'ability') return 'pokemon_ability_cache';
  return '';
}

export async function GET(requestInfo: Request) {
  const url = new URL(requestInfo.url);
  const kind = url.searchParams.get('kind') || '';
  const slug = url.searchParams.get('slug') || '';
  const table = tableFor(kind);

  if (!table || !slug || !isNuzlockeSupabaseConfigured()) return NextResponse.json({ configured: isNuzlockeSupabaseConfigured(), data: null });

  const rows = await nuzlockeSupabaseRequest<{ data: unknown }[]>(`/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=data&limit=1`, {
    headers: nuzlockeSupabaseHeaders(),
  });

  return NextResponse.json({ configured: true, data: rows[0]?.data ?? null });
}

export async function PUT(requestInfo: Request) {
  const body = await requestInfo.json();
  const kind = String(body?.kind || '');
  const slug = String(body?.slug || '');
  const data = body?.data;
  const table = tableFor(kind);

  if (!table || !slug || !isNuzlockeSupabaseConfigured()) return NextResponse.json({ configured: isNuzlockeSupabaseConfigured(), saved: false });

  await nuzlockeSupabaseRequest(`/rest/v1/${table}`, {
    method: 'POST',
    headers: nuzlockeSupabaseHeaders('resolution=merge-duplicates'),
    body: JSON.stringify([{ slug, data, updated_at: new Date().toISOString() }]),
  });

  return NextResponse.json({ configured: true, saved: true });
}
