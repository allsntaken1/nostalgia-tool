import { NextResponse } from 'next/server';
import {
  createArchiveItem,
  findDuplicateArchiveItem,
  listArchiveItems,
  normalizeArchiveItem,
} from '@/app/lib/storage';
import { requireAdmin } from '@/app/lib/safety';

const ALLOWED_DECADES = new Set(['80s', '90s', '2000s', 'Not Sure']);
const ALLOWED_CATEGORIES = new Set([
  'STORES',
  'MALLS',
  'THEME PARKS',
  'RESTAURANTS',
  'HOME LIFE',
  'SCHOOLS',
  'ARCADES & GAMING',
  'MOVIES & ENTERTAINMENT',
  'TRAVEL & VACATION',
  'OUTDOORS',
  'CARS & ROAD LIFE',
  'EVERYDAY SPACES',
  'Unsorted',
]);

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
  };
}

function cleanString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function cleanTagLabel(value: string) {
  return value
    .replace(/[^\w\s&'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTags(value: unknown) {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(value.filter((tag): tag is string => typeof tag === 'string').map(cleanTagLabel).filter(Boolean))
    );
  }

  if (typeof value === 'string') {
    return Array.from(new Set(value.split(',').map(cleanTagLabel).filter(Boolean)));
  }

  return [];
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) {
    return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401, headers: corsHeaders() });
  }

  const body = await request.json().catch(() => null);
  const imageUrl = cleanString(body?.imageUrl);
  const sourceUrl = cleanString(body?.sourceUrl);

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL.' }, { status: 400, headers: corsHeaders() });
  }

  const decade = cleanString(body?.decade, 'Not Sure');
  const category = cleanString(body?.category, 'Unsorted');
  const title = cleanString(body?.title) || cleanString(body?.pageTitle) || cleanString(body?.altText) || 'Chrome Extension Save';
  const notes = cleanString(body?.notes);
  const savedBy = cleanString(body?.savedBy, 'admin');
  const customTags = cleanTags(body?.customTags);
  const subTags = cleanTags(body?.subTags);
  const extraTags = cleanTags(body?.extraTags);

  const item = normalizeArchiveItem({
    id: crypto.randomUUID(),
    title,
    imageUrl,
    thumbUrl: imageUrl,
    source: 'Chrome Extension',
    sourceUrl,
    originalQuery: [
      cleanString(body?.pageTitle),
      cleanString(body?.altText),
      notes ? `Notes: ${notes}` : '',
    ].filter(Boolean).join(' / '),
    decade: ALLOWED_DECADES.has(decade) ? decade : 'Not Sure',
    category: ALLOWED_CATEGORIES.has(category) ? category : 'Unsorted',
    subTags,
    extraTags: [
      ...extraTags,
      ...customTags,
      'Chrome Extension',
      'Extension Save',
      savedBy ? `Saved by: ${savedBy}` : '',
      notes ? `Notes: ${notes}` : '',
    ].filter(Boolean),
    savedAt: new Date().toLocaleString(),
  });

  const items = await listArchiveItems();
  const duplicate = findDuplicateArchiveItem(item, items);

  if (duplicate) {
    return NextResponse.json(
      { duplicate: true, error: 'This image is already archived.', item: duplicate },
      { status: 409, headers: corsHeaders() }
    );
  }

  const savedItem = await createArchiveItem(item);

  return NextResponse.json(
    { duplicate: false, item: savedItem },
    { status: 201, headers: corsHeaders() }
  );
}
