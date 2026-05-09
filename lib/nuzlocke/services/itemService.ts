export interface PokemonItem {
  id: number;
  name: string;
  iconUrl: string;
}

const memoryCache = new Map<string, PokemonItem | null>();

export function itemSlug(item: string) {
  return item
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(value: string) {
  return value.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function readSession(slug: string) {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.sessionStorage.getItem(`nuzlocke_item_${slug}`);
    return raw ? JSON.parse(raw) as PokemonItem | null : undefined;
  } catch {
    return undefined;
  }
}

function writeSession(slug: string, item: PokemonItem | null) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(`nuzlocke_item_${slug}`, JSON.stringify(item));
  } catch {
    // Session cache is best-effort only.
  }
}

export async function getItemData(itemName: string): Promise<PokemonItem | null> {
  const slug = itemSlug(itemName);
  if (!slug || ['none', 'not-sure', 'other', 'type-boosting-item'].includes(slug)) return null;

  if (memoryCache.has(slug)) return memoryCache.get(slug) ?? null;
  const session = readSession(slug);
  if (session !== undefined) {
    memoryCache.set(slug, session);
    return session;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/item/${slug}`);
    if (!response.ok) {
      memoryCache.set(slug, null);
      writeSession(slug, null);
      return null;
    }
    const data = await response.json();
    const item: PokemonItem = {
      id: Number(data.id) || 0,
      name: titleCase(data.name || slug),
      iconUrl: typeof data.sprites?.default === 'string' ? data.sprites.default : '',
    };
    const normalized = item.iconUrl ? item : null;
    memoryCache.set(slug, normalized);
    writeSession(slug, normalized);
    return normalized;
  } catch {
    memoryCache.set(slug, null);
    writeSession(slug, null);
    return null;
  }
}
