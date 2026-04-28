import { NextResponse } from 'next/server';
import {
  createArchiveItem,
  deleteArchiveItem,
  findDuplicateArchiveItem,
  listArchiveItems,
  normalizeArchiveItem,
} from '@/app/lib/storage';
import { requireAdmin } from '@/app/lib/safety';

export async function GET() {
  const items = await listArchiveItems();

  return NextResponse.json(items, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const item = normalizeArchiveItem(body);

  if (!item.imageUrl && !item.thumbUrl) {
    return NextResponse.json({ error: 'Missing image URL.' }, { status: 400 });
  }

  const items = await listArchiveItems();
  const duplicate = findDuplicateArchiveItem(item, items);

  if (duplicate) {
    return NextResponse.json(
      { error: 'This image is already archived.', item: duplicate },
      { status: 409 }
    );
  }

  const savedItem = await createArchiveItem(item);

  return NextResponse.json(savedItem, { status: 201 });
}

export async function DELETE(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing archive item id.' }, { status: 400 });
  }

  await deleteArchiveItem(id);

  return NextResponse.json({ ok: true });
}
