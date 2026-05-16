import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';
import { gen4Routes } from './gen4-routes';

/**
 * Diamond / Pearl / Platinum encounter schema.
 *
 * Encounter rows can be tagged with one of:
 *   - 'Diamond' / 'Pearl' / 'Platinum' — version-exclusive to that single game
 *   - 'DP' — appears in Diamond AND Pearl but not Platinum
 *   - 'All' — appears in all three games
 *
 * Honey-tree mechanics, Poké Radar chains, swarm species, and Pal Park/dual-slot
 * cross-Gen-III entries are intentionally NOT modeled this pass.
 */

export type DppVersion = 'Diamond' | 'Pearl' | 'Platinum' | 'DP' | 'All';
export type DppEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';
export type DppRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

export type DppEncounter = {
  species: string;
  types: PokemonType[];
  method: DppEncounterMethod;
  version: DppVersion;
  notes?: string;
  rod?: DppRod;
  condition?: string;
};

export type DppEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: DppEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: DppEncounterMethod,
  version: DppVersion = 'All',
  notes?: string,
  extras: { rod?: DppRod; condition?: string } = {},
): DppEncounter => ({ species, types, method, version, notes, ...extras });

const surf = (species: string, types: PokemonType[], version: DppVersion = 'All', notes?: string): DppEncounter =>
  encounter(species, types, 'surfing', version, notes);

const fish = (species: string, types: PokemonType[], rod: DppRod, version: DppVersion = 'All', notes?: string): DppEncounter =>
  encounter(species, types, 'fishing', version, notes, { rod });

// ==============================================================================================
// DPP Pass 1 — Twinleaf through Eterna City (Bulbapedia raw wikitext verified).
// ==============================================================================================

const populatedAreas: DppEncounterArea[] = [
  {
    locationId: 'twinleaf-town',
    displayName: 'Twinleaf Town',
    encounters: [
      encounter('Turtwig', ['Grass'], 'gift', 'All', 'Starter gift from Professor Rowan.'),
      encounter('Chimchar', ['Fire'], 'gift', 'All', 'Starter gift from Professor Rowan.'),
      encounter('Piplup', ['Water'], 'gift', 'All', 'Starter gift from Professor Rowan.'),
    ],
    notes: ['Starter delivery venue. No wild encounter table for the town itself.'],
  },
  {
    locationId: 'route-201',
    displayName: 'Route 201',
    encounters: [
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass', 'Platinum', 'Platinum-exclusive grass spawn (10%).'),
    ],
    notes: ['Swarm/Poké Radar/dual-slot species (Doduo swarm, Nidoran lines, Growlithe) intentionally omitted — schema TODO.'],
  },
  {
    locationId: 'lake-verity',
    displayName: 'Lake Verity',
    encounters: [
      // Surf — accessible only after late-game story event raises water level. Kept for completeness.
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      // Fishing — rod tiers per Bulbapedia.
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Seaking', ['Water'], 'Good Rod', 'Platinum', 'Platinum-only Good Rod 5%.'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Surf access gated until late-game story event. Storyline lake-trio sequence not modeled as encounters.'],
  },
  {
    locationId: 'sandgem-town',
    displayName: 'Sandgem Town',
    encounters: [],
    notes: ["Professor Rowan's lab venue. No wild encounter table per Bulbapedia."],
  },
  {
    locationId: 'route-202',
    displayName: 'Route 202',
    encounters: [
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass'),
      encounter('Shinx', ['Electric'], 'grass'),
    ],
    notes: ['Swarm (Zigzagoon), Poké Radar (Sentret), and dual-slot (Growlithe) entries omitted — schema TODO.'],
  },
  {
    locationId: 'jubilife-city',
    displayName: 'Jubilife City',
    encounters: [],
    notes: ['No wild encounter table for Jubilife City proper. Trainer School and TV station are NPC-only.'],
  },
  {
    locationId: 'route-203',
    displayName: 'Route 203',
    encounters: [
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass', 'All', 'Common but flees on encounter.'),
      // Water — accessible after acquiring Surf later.
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
    ],
    notes: ['Surf-side species gated until HM03 obtained.'],
  },
  {
    locationId: 'oreburgh-gate',
    displayName: 'Oreburgh Gate',
    encounters: [
      // 1F — cave.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      // B1F — cave (post-HM-Rock-Smash access).
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 'All', 'B1F (post-Rock Smash).'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'DP', 'B1F (DP only, post-Rock Smash).'),
      encounter('Psyduck', ['Water'], 'cave', 'All', 'B1F (post-Rock Smash).'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave', 'All', 'B1F (post-Rock Smash).'),
      // Surf (B1F).
      surf('Zubat', ['Poison', 'Flying']),
      surf('Golbat', ['Poison', 'Flying']),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      // Fishing (B1F).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod', 'DP', 'DP-only Super Rod encounter; removed in Platinum.'),
    ],
    notes: ['B1F is gated behind Rock Smash. Pearl/Diamond keep Whiscash on the Super Rod table; Platinum removes it.'],
  },
  {
    locationId: 'oreburgh-city',
    displayName: 'Oreburgh City',
    encounters: [],
    notes: ['Town/gym venue. No wild encounter table.'],
  },
  {
    locationId: 'oreburgh-mine',
    displayName: 'Oreburgh Mine',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Onix', ['Rock', 'Ground'], 'cave'),
    ],
    notes: ['Both B1F and B2F share the same species list per Bulbapedia (rates differ slightly between DP and Platinum).'],
  },
  {
    locationId: 'route-204-south',
    displayName: 'Route 204 (South)',
    encounters: [
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass'),
      encounter('Shinx', ['Electric'], 'grass'),
      encounter('Budew', ['Grass', 'Poison'], 'grass'),
      encounter('Wurmple', ['Bug'], 'grass', 'Platinum', 'Platinum-only grass spawn.'),
    ],
    notes: ['Surf/fishing tables are shared with the north half (same body of water).'],
  },
  {
    locationId: 'ravaged-path',
    displayName: 'Ravaged Path',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Psyduck', ['Water'], 'cave', 'All', 'Rate jumps from 2% (DP) to 35% (Platinum).'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      surf('Zubat', ['Poison', 'Flying']),
      surf('Golbat', ['Poison', 'Flying']),
      surf('Psyduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition (45%).'),
    ],
    notes: ['Psyduck rate differs sharply between DP (2%) and Platinum (35%).'],
  },
  {
    locationId: 'route-204-north',
    displayName: 'Route 204 (North)',
    encounters: [
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass'),
      encounter('Shinx', ['Electric'], 'grass'),
      encounter('Budew', ['Grass', 'Poison'], 'grass'),
    ],
    notes: ['Higher levels than south half (Lv 6-11). Poké Radar / dual-slot species (Caterpie/Weedle/Pineco/Sunkern) omitted.'],
  },
  {
    locationId: 'floaroma-town',
    displayName: 'Floaroma Town',
    encounters: [],
    notes: ['Town venue. No wild encounter table.'],
  },
  {
    locationId: 'floaroma-meadow',
    displayName: 'Floaroma Meadow',
    encounters: [],
    notes: [
      "All Floaroma Meadow wild encounters happen via the Honey Tree mechanic, which isn't modeled this pass.",
      'TODO: Honey-tree Combee/Burmy/etc. need future schema support.',
    ],
  },
  {
    locationId: 'valley-windworks',
    displayName: 'Valley Windworks',
    encounters: [
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Pachirisu', ['Electric'], 'grass'),
      encounter('Buizel', ['Water'], 'grass'),
      encounter('Shellos', ['Water'], 'grass'),
      encounter('Shinx', ['Electric'], 'grass', 'Platinum', 'Platinum-only grass spawn (20%).'),
      surf('Bibarel', ['Normal', 'Water']),
      surf('Psyduck', ['Water']),
      surf('Shellos', ['Water']),
      surf('Tentacool', ['Water', 'Poison']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      // Drifloon static — split: DP Lv 22, Platinum Lv 15. Friday weekly availability after defeating Mars.
      encounter('Drifloon', ['Ghost', 'Flying'], 'static', 'DP', 'Outside the Windworks every Friday after defeating Commander Mars (Lv 22 in Diamond/Pearl).'),
      encounter('Drifloon', ['Ghost', 'Flying'], 'static', 'Platinum', 'Outside the Windworks every Friday after defeating Commander Mars (Lv 15 in Platinum).'),
    ],
    notes: ['Drifloon Friday static differs Lv 22 (DP) vs Lv 15 (Platinum). Mars Commander battle modeled as boss data.'],
  },
  {
    locationId: 'route-205-south',
    displayName: 'Route 205 (South)',
    encounters: [
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Pachirisu', ['Electric'], 'grass'),
      encounter('Buizel', ['Water'], 'grass'),
      encounter('Shellos', ['Water'], 'grass'),
    ],
    notes: ['Platinum adds several Poké Radar / Headbutt-style species not modeled this pass.'],
  },
  {
    locationId: 'eterna-forest',
    displayName: 'Eterna Forest',
    encounters: [
      encounter('Wurmple', ['Bug'], 'grass'),
      encounter('Silcoon', ['Bug'], 'grass'),
      encounter('Cascoon', ['Bug'], 'grass'),
      encounter('Budew', ['Grass', 'Poison'], 'grass'),
      encounter('Murkrow', ['Dark', 'Flying'], 'grass'),
      encounter('Misdreavus', ['Ghost'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass', 'DP', 'DP-only grass spawn (Platinum removes Hoothoot).'),
    ],
    notes: ['Slakoth is a Platinum swarm-only species (not modeled). Old Chateau interior encounters are deferred to a later pass.'],
  },
  {
    locationId: 'route-205-north',
    displayName: 'Route 205 (North)',
    encounters: [
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Pachirisu', ['Electric'], 'grass'),
      encounter('Buizel', ['Water'], 'grass'),
      encounter('Shellos', ['Water'], 'grass'),
    ],
    notes: ['Platinum expands the grass slot list significantly (Hoothoot/Wurmple line/Kricketot/Budew per Bulbapedia) — Platinum-specific additions deferred for canonical confirmation in a follow-up.'],
  },
  {
    locationId: 'eterna-city',
    displayName: 'Eterna City',
    encounters: [],
    notes: ['City/gym venue. No wild encounter table. Old Chateau is a separate dungeon (not added this pass).'],
  },
];

const populatedIds = new Set(populatedAreas.map((a) => a.locationId));

const stubAreas: DppEncounterArea[] = (Array.isArray(gen4Routes) ? gen4Routes : [])
  .filter((route) => !populatedIds.has(route.id))
  .map((route) => ({
    locationId: route.id,
    displayName: route.displayName,
    encounters: [],
    notes: ['TODO: Populate canonical Diamond/Pearl/Platinum encounter data for this location.'],
  }));

export const dppEncounterAreas: DppEncounterArea[] = [...populatedAreas, ...stubAreas];

export const dppEncounterNotes = [
  'Honey-tree, Poké Radar, dual-slot (Gen III cartridge insertion), swarm, and Pal Park species are intentionally not modeled this pass.',
  'Old Chateau Rotom and other story-gated statics are deferred until canonical timing/Gym-prereq handling is in place.',
  'DPP Pass 1 covers Twinleaf through Eterna City; later passes expand the rest of Sinnoh.',
];

function matchesVersion(rowVersion: DppVersion, game: 'Diamond' | 'Pearl' | 'Platinum'): boolean {
  if (rowVersion === 'All') return true;
  if (rowVersion === 'DP') return game === 'Diamond' || game === 'Pearl';
  return rowVersion === game;
}

export function getDppEncounterOptionsForGame(game: GameVersion): Record<string, EncounterOption[]> {
  if (game !== 'Diamond' && game !== 'Pearl' && game !== 'Platinum') return {};
  return dppEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
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
