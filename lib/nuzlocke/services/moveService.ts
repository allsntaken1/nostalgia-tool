export interface PokemonMove {
  id: number;
  name: string;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  effect?: string;
}

const memoryCache = new Map<string, PokemonMove>();

function moveSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function titleCase(value: string) {
  return value.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function normalizeCategory(value?: string): PokemonMove['category'] {
  if (value === 'physical') return 'Physical';
  if (value === 'special') return 'Special';
  return 'Status';
}

function readSession(slug: string) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(`nuzlocke_move_${slug}`);
    return raw ? JSON.parse(raw) as PokemonMove : null;
  } catch {
    return null;
  }
}

function writeSession(slug: string, move: PokemonMove) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(`nuzlocke_move_${slug}`, JSON.stringify(move));
  } catch {
    // Session cache is best-effort only.
  }
}

export async function getMoveData(name: string): Promise<PokemonMove | null> {
  const slug = moveSlug(name);
  if (!slug) return null;

  const cached = memoryCache.get(slug) ?? readSession(slug);
  if (cached) {
    memoryCache.set(slug, cached);
    return cached;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
    if (!response.ok) return null;
    const data = await response.json();
    const effectEntry = data.effect_entries?.find((entry: { language?: { name?: string } }) => entry.language?.name === 'en');
    const move: PokemonMove = {
      id: Number(data.id) || 0,
      name: titleCase(data.name || slug),
      type: titleCase(data.type?.name || 'unknown'),
      category: normalizeCategory(data.damage_class?.name),
      power: typeof data.power === 'number' ? data.power : null,
      accuracy: typeof data.accuracy === 'number' ? data.accuracy : null,
      pp: typeof data.pp === 'number' ? data.pp : null,
      priority: typeof data.priority === 'number' ? data.priority : 0,
      effect: effectEntry?.short_effect?.replace(/\$effect_chance/g, String(data.effect_chance ?? '')).trim(),
    };

    memoryCache.set(slug, move);
    writeSession(slug, move);
    return move;
  } catch {
    return null;
  }
}
