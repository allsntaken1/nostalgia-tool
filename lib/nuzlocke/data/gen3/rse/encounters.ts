import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';
import { rseLocations } from './routes';

/**
 * Ruby/Sapphire/Emerald encounter schema.
 *
 * Rows are tagged with one of:
 *   - 'Ruby' / 'Sapphire' / 'Emerald' — single-version exclusive
 *   - 'RS'    — appears in Ruby and Sapphire but not Emerald
 *   - 'All'   — appears in all three games
 *
 * Pass 1 covers Littleroot through Rusturf Tunnel. Later locations exist as
 * empty stubs so the picker still shows them — populate over subsequent passes.
 */

export type RseVersion = 'Ruby' | 'Sapphire' | 'Emerald' | 'RS' | 'All';
export type RseEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';
export type RseRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

export type RseEncounter = {
  species: string;
  types: PokemonType[];
  method: RseEncounterMethod;
  version: RseVersion;
  notes?: string;
  rod?: RseRod;
  condition?: string;
};

export type RseEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: RseEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: RseEncounterMethod,
  version: RseVersion = 'All',
  notes?: string,
  extras: { rod?: RseRod; condition?: string } = {},
): RseEncounter => ({ species, types, method, version, notes, ...extras });

const surf = (species: string, types: PokemonType[], version: RseVersion = 'All', notes?: string): RseEncounter =>
  encounter(species, types, 'surfing', version, notes);

const fish = (species: string, types: PokemonType[], rod: RseRod, version: RseVersion = 'All', notes?: string): RseEncounter =>
  encounter(species, types, 'fishing', version, notes, { rod });

// =====================================================================================
// RSE Pass 1 — Littleroot through Rusturf Tunnel (canonical Ruby/Sapphire/Emerald data).
// =====================================================================================

const populatedAreas: RseEncounterArea[] = [
  {
    locationId: 'littleroot-town',
    displayName: 'Littleroot Town',
    encounters: [
      encounter('Treecko', ['Grass'], 'gift', 'All', 'Starter gift from Professor Birch.'),
      encounter('Torchic', ['Fire'], 'gift', 'All', 'Starter gift from Professor Birch.'),
      encounter('Mudkip', ['Water'], 'gift', 'All', 'Starter gift from Professor Birch.'),
    ],
    notes: ['Starter delivery venue. No wild encounter table for the town itself.'],
  },
  {
    locationId: 'route-101',
    displayName: 'Route 101',
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass'),
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Wurmple', ['Bug'], 'grass', 'Emerald', 'Emerald-only addition to the grass table.'),
    ],
    notes: ['Tutorial battle vs Wild Poochyena (Birch chase) occurs here in all three games.'],
  },
  {
    locationId: 'oldale-town',
    displayName: 'Oldale Town',
    encounters: [],
    notes: ['Town venue. No wild encounter table.'],
  },
  {
    locationId: 'route-103',
    displayName: 'Route 103',
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass'),
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
    ],
    notes: ['First rival battle (May/Brendan) occurs here after defeating the Wild Poochyena.'],
  },
  {
    locationId: 'route-102',
    displayName: 'Route 102',
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass'),
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Wurmple', ['Bug'], 'grass'),
      encounter('Seedot', ['Grass'], 'grass', 'Ruby', 'Ruby-exclusive — Sapphire has Lotad instead.'),
      encounter('Seedot', ['Grass'], 'grass', 'Emerald', 'Emerald has both Seedot and Lotad.'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Sapphire', 'Sapphire-exclusive — Ruby has Seedot instead.'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Emerald'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass', 'All', 'Rare grass spawn (~4%).'),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 'Emerald', 'Emerald-only addition; swarm-style in RS (not modeled).'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
    ],
    notes: ['Seedot/Lotad split mirrors the version-pair theme. Ralts typed as Psychic/Fairy per modern-dex display convention (Gen-3 cartridge typing was Psychic-only).'],
  },
  {
    locationId: 'petalburg-city',
    displayName: 'Petalburg City',
    encounters: [
      surf('Marill', ['Water', 'Fairy']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: ["Norman's Gym is gated until the 4th badge; surf/fish accessible once you have HMs."],
  },
  {
    locationId: 'route-104',
    displayName: 'Route 104',
    encounters: [
      encounter('Wurmple', ['Bug'], 'grass'),
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Poochyena', ['Dark'], 'grass', 'All', 'South half only.'),
      encounter('Taillow', ['Normal', 'Flying'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Marill', ['Water', 'Fairy'], 'grass', 'All', 'North half only.'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Berry trees on north half. Mr. Briney lives in the cottage between the two halves.'],
  },
  {
    locationId: 'petalburg-woods',
    displayName: 'Petalburg Woods',
    encounters: [
      encounter('Wurmple', ['Bug'], 'grass'),
      encounter('Silcoon', ['Bug'], 'grass'),
      encounter('Cascoon', ['Bug', 'Poison'], 'grass'),
      encounter('Shroomish', ['Grass'], 'grass'),
      encounter('Slakoth', ['Normal'], 'grass'),
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 'Emerald', 'Emerald-only grass addition (very rare).'),
    ],
    notes: ['Team Aqua/Magma Grunt blocks the exit pre-clear (Devon Researcher cutscene). Wurmple evolves randomly to Silcoon (→Beautifly) or Cascoon (→Dustox).'],
  },
  {
    locationId: 'rustboro-city',
    displayName: 'Rustboro City',
    encounters: [
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: ['Gym city — Roxanne (Rock). Devon Corporation is the story hub. No standard grass table.'],
  },
  {
    locationId: 'route-116',
    displayName: 'Route 116',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Taillow', ['Normal', 'Flying'], 'grass'),
      encounter('Nincada', ['Bug', 'Ground'], 'grass'),
      encounter('Whismur', ['Normal'], 'grass', 'All', 'Near the Rusturf Tunnel mouth.'),
      encounter('Skitty', ['Normal'], 'grass', 'Sapphire', 'Sapphire/Emerald grass slot — Ruby does not have wild Skitty here.'),
      encounter('Skitty', ['Normal'], 'grass', 'Emerald'),
    ],
    notes: ['Connects Rustboro to Rusturf Tunnel. Skitty is Sapphire/Emerald-only on this route (Ruby has no wild Skitty in Hoenn outside Safari Zone).'],
  },
  {
    locationId: 'rusturf-tunnel',
    displayName: 'Rusturf Tunnel',
    encounters: [
      encounter('Whismur', ['Normal'], 'cave'),
    ],
    notes: ['Aqua/Magma Grunt steals the Devon Goods here — required boss-prep battle. Tunnel is sealed by a boulder until Rock Smash unlocks it later.'],
  },
];

const populatedIds = new Set(populatedAreas.map((a) => a.locationId));

const stubAreas: RseEncounterArea[] = (Array.isArray(rseLocations) ? rseLocations : [])
  .filter((route) => !populatedIds.has(route.id))
  .map((route) => ({
    locationId: route.id,
    displayName: route.displayName,
    encounters: [],
    notes: ['TODO: Populate canonical Ruby/Sapphire/Emerald encounter data for this location.'],
  }));

export const rseEncounterAreas: RseEncounterArea[] = [...populatedAreas, ...stubAreas];

export const rseEncounterNotes = [
  'Pass 1 covers Littleroot Town through Rusturf Tunnel; later locations are stubs awaiting future passes.',
  'Honey trees (Gen 4 only), Poké Radar, Pokéblocks/Safari Zone mechanics, dual-slot, day/night gating, and trainer-rematch tables are not modeled this pass.',
  'Mirage Tower / Desert Underpass / Sky Pillar legendary placements are deferred to a later legendary-focused pass.',
];

function matchesVersion(rowVersion: RseVersion, game: 'Ruby' | 'Sapphire' | 'Emerald'): boolean {
  if (rowVersion === 'All') return true;
  if (rowVersion === 'RS') return game === 'Ruby' || game === 'Sapphire';
  return rowVersion === game;
}

export function getRseEncounterOptionsForGame(game: GameVersion): Record<string, EncounterOption[]> {
  if (game !== 'Ruby' && game !== 'Sapphire' && game !== 'Emerald') return {};
  return rseEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const safeList = Array.isArray(area.encounters) ? area.encounters : [];
    acc[area.displayName] = safeList
      .filter((item) => matchesVersion(item.version, game))
      .map((item): EncounterOption => ({
        species: item.species,
        types: item.types,
        surfMethod: item.method === 'surfing' || undefined,
        fishingMethod: item.method === 'fishing' || undefined,
        ...(item.rod ? { rod: item.rod } : {}),
        ...(item.condition ? { condition: item.condition } : {}),
      }));
    return acc;
  }, {});
}
