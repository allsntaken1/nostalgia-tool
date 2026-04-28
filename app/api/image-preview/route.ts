import { NextResponse } from 'next/server';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing image URL.' }, { status: 400 });
  }

  let imageUrl: URL;

  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.has(imageUrl.protocol)) {
    return NextResponse.json({ error: 'Unsupported image URL.' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl.toString(), {
      cache: 'no-store',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Image preview failed: ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const body = await response.arrayBuffer();

    return new Response(body, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image preview failed.';

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
