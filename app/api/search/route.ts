import { NextResponse } from 'next/server';

type SerpApiImageResult = {
  title?: string;
  original?: string;
  thumbnail?: string;
  source?: string;
  link?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ error: 'Missing search query.' }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing SERPAPI_KEY in .env.local' },
      { status: 500 }
    );
  }

  try {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_images');
    url.searchParams.set('q', q);
    url.searchParams.set('api_key', apiKey);

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `SerpAPI request failed: ${response.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    const images = Array.isArray(data.images_results)
      ? data.images_results.map((img: SerpApiImageResult, index: number) => ({
          id: `${index}-${img.original ?? img.thumbnail ?? 'image'}`,
          title: img.title || 'Untitled image',
          imageUrl: img.original || img.thumbnail || '',
          thumbUrl: img.thumbnail || img.original || '',
          source: img.source || 'Unknown source',
          sourceUrl: img.link || '',
        }))
      : [];

    return NextResponse.json(images);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}