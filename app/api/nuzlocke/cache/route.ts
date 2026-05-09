import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function supabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let url = rawUrl;

  if (url) {
    url = url
      .replace(/\/rest\/v1$/i, '')
      .replace(/\/storage\/v1$/i, '')
      .replace(/\/auth\/v1$/i, '');
  }

  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
}

function headers(prefer?: string) {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function tableFor(kind: string) {
  if (kind === 'pokemon') return 'pokemon_species_cache';
  if (kind === 'move') return 'pokemon_move_cache';
  if (kind === 'ability') return 'pokemon_ability_cache';
  return '';
}

async function request<T>(pathName: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');
  const response = await fetch(`${config.url}${pathName}`, { ...init, cache: 'no-store' });
  if (!response.ok) throw new Error(await response.text());
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export async function GET(requestInfo: Request) {
  const url = new URL(requestInfo.url);
  const kind = url.searchParams.get('kind') || '';
  const slug = url.searchParams.get('slug') || '';
  const table = tableFor(kind);

  if (!table || !slug || !supabaseConfig()) return NextResponse.json({ configured: Boolean(supabaseConfig()), data: null });

  const rows = await request<{ data: unknown }[]>(`/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=data&limit=1`, {
    headers: headers(),
  });

  return NextResponse.json({ configured: true, data: rows[0]?.data ?? null });
}

export async function PUT(requestInfo: Request) {
  const body = await requestInfo.json();
  const kind = String(body?.kind || '');
  const slug = String(body?.slug || '');
  const data = body?.data;
  const table = tableFor(kind);

  if (!table || !slug || !supabaseConfig()) return NextResponse.json({ configured: Boolean(supabaseConfig()), saved: false });

  await request(`/rest/v1/${table}`, {
    method: 'POST',
    headers: headers('resolution=merge-duplicates'),
    body: JSON.stringify([{ slug, data, updated_at: new Date().toISOString() }]),
  });

  return NextResponse.json({ configured: true, saved: true });
}
