import { NextResponse } from 'next/server';

type SerpApiImageResult = {
  title?: string;
  original?: string;
  thumbnail?: string;
  source?: string;
  link?: string;
};

function normalizeResult(img: SerpApiImageResult, index: number, prefix: string) {
  return {
    id: `${prefix}-${index}-${img.original ?? img.thumbnail ?? 'image'}`,
    title: img.title || 'Untitled image',
    imageUrl: img.original || img.thumbnail || '',
    thumbUrl: img.thumbnail || img.original || '',
    source: img.source || 'Unknown source',
    sourceUrl: img.link || '',
  };
}

function resultKey(item: ReturnType<typeof normalizeResult>) {
  return (item.imageUrl || item.thumbUrl || item.sourceUrl).trim().toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const source = searchParams.get('source')?.trim() || 'facebook';

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

  const runSerpSearch = async (query: string, prefix: string) => {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_images');
    url.searchParams.set('q', query);
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

    return Array.isArray(data.images_results)
      ? data.images_results.map((img: SerpApiImageResult, index: number) => normalizeResult(img, index, prefix))
      : [];
  };

  try {
    const searches =
      source === 'facebook'
        ? [
            runSerpSearch(`site:facebook.com ${q}`, 'facebook'),
            runSerpSearch(q, 'general'),
          ]
        : [runSerpSearch(q, 'general')];
    const results = (await Promise.all(searches)).flat();
    const seen = new Set<string>();
    const images = results.filter((item) => {
      const key = resultKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(images);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
