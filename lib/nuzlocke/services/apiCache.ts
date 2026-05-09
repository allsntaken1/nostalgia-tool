export async function readNuzlockeApiCache<T>(kind: 'pokemon' | 'move' | 'ability', slug: string): Promise<T | null> {
  if (typeof window === 'undefined' || !slug) return null;

  try {
    const response = await fetch(`/api/nuzlocke/cache?kind=${encodeURIComponent(kind)}&slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
}

export async function writeNuzlockeApiCache(kind: 'pokemon' | 'move' | 'ability', slug: string, data: unknown) {
  if (typeof window === 'undefined' || !slug || !data) return;

  try {
    await fetch('/api/nuzlocke/cache', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, slug, data }),
    });
  } catch {
    // Cache writes are best-effort only.
  }
}
