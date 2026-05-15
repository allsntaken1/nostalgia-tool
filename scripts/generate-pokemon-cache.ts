/**
 * Generate `lib/nuzlocke/data/pokemon-cache.json` from PokéAPI.
 *
 * USAGE
 *   npx tsx scripts/generate-pokemon-cache.ts
 *
 * Optional environment variables:
 *   POKEMON_CACHE_LIMIT=1025      Hard cap on species count (default: all listed)
 *   POKEMON_CACHE_CONCURRENCY=10  Parallel HTTP requests (default: 10)
 *   POKEMON_CACHE_SKIP_EVO=1      Skip evolution chain fetches
 *   POKEMON_CACHE_OFFLINE=1       Don't hit the network; produce an empty seed file
 *
 * The script is dev-only — it must never run during a production build or
 * normal app render. The output JSON is what the app reads at runtime.
 *
 * Source: https://pokeapi.co/api/v2 (PokéAPI is the canonical, free, no-auth
 * Pokémon REST API. We do not scrape Bulbapedia.)
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type SpeciesIndexEntry = { name: string; url: string };
type PokemonApiType = { type?: { name?: string } };
type PokemonApiAbility = { ability?: { name?: string }; is_hidden?: boolean; slot?: number };
type EvolutionLink = { species?: { name?: string }; evolves_to?: EvolutionLink[] };

type CachedPokemon = {
  id: number;
  name: string;
  slug: string;
  types: string[];
  spriteUrl: string;
  generation: number;
  evolution?: string[];
  /** Non-hidden abilities, in PokéAPI slot order, capitalized for display. */
  abilities?: string[];
  /** Hidden ability slot(s), if any. Capitalized for display. */
  hiddenAbilities?: string[];
};

const API_BASE = 'https://pokeapi.co/api/v2';
const CONCURRENCY = Math.max(1, Number(process.env.POKEMON_CACHE_CONCURRENCY) || 10);
const LIMIT = Math.max(0, Number(process.env.POKEMON_CACHE_LIMIT) || 0);
const SKIP_EVO = Boolean(process.env.POKEMON_CACHE_SKIP_EVO);
const OFFLINE = Boolean(process.env.POKEMON_CACHE_OFFLINE);

const __filename = fileURLToPath(import.meta.url);
const OUTPUT_PATH = resolve(
  dirname(__filename),
  '..',
  'lib',
  'nuzlocke',
  'data',
  'pokemon-cache.json',
);

const TYPE_NAMES = new Set([
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
  'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark',
  'Steel', 'Fairy',
]);

const GEN_ORDINAL: Record<string, number> = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
};

function capitalizeType(name: string): string {
  if (!name) return '';
  const t = name.charAt(0).toUpperCase() + name.slice(1);
  return TYPE_NAMES.has(t) ? t : '';
}

/** "flash-fire" -> "Flash Fire", "overgrow" -> "Overgrow". */
function formatAbilityName(name: string): string {
  if (!name) return '';
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function getJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function mapWithConcurrency<TIn, TOut>(
  items: TIn[],
  limit: number,
  worker: (item: TIn, index: number) => Promise<TOut>,
): Promise<TOut[]> {
  const results: TOut[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = await worker(items[index], index);
      } catch (err) {
        // Mark this slot as undefined; we'll filter later.
        results[index] = undefined as unknown as TOut;
        process.stderr.write(`  ! worker error at index ${index}: ${(err as Error).message}\n`);
      }
    }
  });
  await Promise.all(runners);
  return results;
}

function flattenEvolutionChain(node: EvolutionLink | undefined, out: string[] = []): string[] {
  if (!node) return out;
  if (node.species?.name) out.push(node.species.name);
  if (Array.isArray(node.evolves_to)) {
    for (const child of node.evolves_to) flattenEvolutionChain(child, out);
  }
  return out;
}

async function generate(): Promise<void> {
  if (OFFLINE) {
    await writeOutput([], 'offline-mode');
    return;
  }

  console.log(`Fetching species index from ${API_BASE}...`);
  const indexUrl = `${API_BASE}/pokemon-species?limit=2000`;
  const index = await getJson<{ count: number; results: SpeciesIndexEntry[] }>(indexUrl);
  if (!index || !Array.isArray(index.results)) {
    throw new Error('Could not load PokéAPI species index.');
  }
  let species = index.results;
  if (LIMIT > 0) species = species.slice(0, LIMIT);
  console.log(`Will process ${species.length} species (concurrency=${CONCURRENCY}, skipEvo=${SKIP_EVO}).`);

  const chainCache = new Map<string, string[]>();

  const entries = await mapWithConcurrency(species, CONCURRENCY, async (entry, i): Promise<CachedPokemon | null> => {
    if (i % 50 === 0) console.log(`  ...${i}/${species.length}`);

    const speciesData = await getJson<{
      id: number;
      name: string;
      generation?: { name?: string };
      evolution_chain?: { url?: string };
      varieties?: { is_default?: boolean; pokemon?: { name?: string; url?: string } }[];
    }>(entry.url);
    if (!speciesData) return null;

    const defaultVariety = (speciesData.varieties || []).find((v) => v.is_default) || (speciesData.varieties || [])[0];
    const pokemonUrl = defaultVariety?.pokemon?.url;
    const pokemonData = pokemonUrl
      ? await getJson<{
          id: number;
          sprites?: { front_default?: string | null };
          types?: PokemonApiType[];
          abilities?: PokemonApiAbility[];
        }>(pokemonUrl)
      : null;

    const types = (pokemonData?.types || [])
      .map((t) => capitalizeType(t?.type?.name ?? ''))
      .filter((t): t is string => t !== '');

    // Abilities — split hidden vs. non-hidden, preserve PokéAPI slot order.
    const abilityRows = (pokemonData?.abilities || [])
      .slice()
      .sort((a, b) => (a?.slot ?? 99) - (b?.slot ?? 99));
    const abilities: string[] = [];
    const hiddenAbilities: string[] = [];
    for (const row of abilityRows) {
      const formatted = formatAbilityName(row?.ability?.name ?? '');
      if (!formatted) continue;
      if (row?.is_hidden) hiddenAbilities.push(formatted);
      else abilities.push(formatted);
    }

    const id = speciesData.id || pokemonData?.id || 0;
    const slug = speciesData.name;
    const generation = GEN_ORDINAL[speciesData.generation?.name ?? ''] ?? 0;
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    let evolution: string[] | undefined;
    if (!SKIP_EVO && speciesData.evolution_chain?.url) {
      const cached = chainCache.get(speciesData.evolution_chain.url);
      if (cached) {
        evolution = cached;
      } else {
        const chainData = await getJson<{ chain?: EvolutionLink }>(speciesData.evolution_chain.url);
        const flat = flattenEvolutionChain(chainData?.chain);
        chainCache.set(speciesData.evolution_chain.url, flat);
        evolution = flat.length > 0 ? flat : undefined;
      }
    }

    return {
      id,
      name: slug,
      slug,
      types,
      spriteUrl,
      generation,
      ...(evolution ? { evolution } : {}),
      ...(abilities.length > 0 ? { abilities } : {}),
      ...(hiddenAbilities.length > 0 ? { hiddenAbilities } : {}),
    };
  });

  const filtered: CachedPokemon[] = entries.filter((e): e is CachedPokemon => !!e && !!e.slug && e.id > 0);
  filtered.sort((a, b) => a.id - b.id);

  console.log(`Done. ${filtered.length}/${species.length} species captured.`);
  await writeOutput(filtered, 'pokeapi');
}

async function writeOutput(pokemon: CachedPokemon[], source: string): Promise<void> {
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    source: source === 'pokeapi' ? `${API_BASE}` : source,
    schemaVersion: 2,
    pokemon,
  };
  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${OUTPUT_PATH} (${pokemon.length} entries).`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
