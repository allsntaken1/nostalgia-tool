import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

// Structured Pokémon Black/White encounter data. Mirrors the gen6/xy-encounters.ts shape
// so the same UI chips (method / rod / condition / version) work without extra wiring.
// All data verified against Bulbapedia Black/White route pages.

type BwVersion = 'Black' | 'White' | 'Both';
type BwEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';
type BwRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

type BwEncounter = {
  species: string;
  types: PokemonType[];
  method: BwEncounterMethod;
  version: BwVersion;
  notes?: string;
  rod?: BwRod;
  /** Free-text annotation for non-standard contexts (Rustling Grass, Dark Grass, Rippling Water, day-of-week). */
  condition?: string;
};

type BwEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: BwEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: BwEncounterMethod,
  version: BwVersion = 'Both',
  notes?: string,
  extras: { rod?: BwRod; condition?: string } = {},
): BwEncounter => ({ species, types, method, version, notes, ...extras });

const fish = (species: string, types: PokemonType[], rod: BwRod, version: BwVersion = 'Both', notes?: string): BwEncounter =>
  encounter(species, types, 'fishing', version, notes, { rod });

const surf = (species: string, types: PokemonType[], version: BwVersion = 'Both', notes?: string, condition?: string): BwEncounter =>
  encounter(species, types, 'surfing', version, notes, condition ? { condition } : {});

/** Tag a grass-type encounter as Dark Grass (post-badge high-level patches) for UI chip rendering. */
const darkGrass = (species: string, types: PokemonType[], version: BwVersion = 'Both', notes?: string): BwEncounter =>
  encounter(species, types, 'grass', version, notes, { condition: 'Dark Grass' });

/** Tag a grass-type encounter as Rustling Grass (rare patch shake mechanic). */
const rustling = (species: string, types: PokemonType[], version: BwVersion = 'Both', notes?: string): BwEncounter =>
  encounter(species, types, 'grass', version, notes, { condition: 'Rustling Grass' });

export const bwEncounterAreas: BwEncounterArea[] = [
  {
    locationId: 'bw-route-1',
    displayName: 'Route 1',
    encounters: [
      // Standard grass
      encounter('Patrat', ['Normal'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      // Rustling grass — Audino is the canonical encounter
      rustling('Audino', ['Normal']),
      // Dark grass (high-level patches accessible later in the game)
      darkGrass('Watchog', ['Normal']),
      darkGrass('Herdier', ['Normal']),
      darkGrass('Scraggy', ['Dark', 'Fighting']),
      // Surfing — accessible only after obtaining Surf later in the game
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-version exclusive.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-version exclusive.'),
      // Rippling water (Surf-in-rippling-patch high tier)
      surf('Feebas', ['Water'], 'Both', 'Rippling-water Surf encounter.', 'Rippling Water'),
      surf('Milotic', ['Water'], 'Both', 'Rare rippling-water Surf encounter.', 'Rippling Water'),
      // Fishing (Super Rod only on this route per Bulbapedia)
      fish('Feebas', ['Water'], 'Super Rod', 'Both', 'Rare 5% Super Rod fishing encounter.'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
    ],
    notes: [
      'First grass route after Nuvema Town. Verified per Bulbapedia (Unova Route 1 page).',
      'Surf, dark-grass, and fishing entries are gated behind story progression but listed for nuzlocke planning.',
    ],
  },
  {
    locationId: 'bw-accumula-town',
    displayName: 'Accumula Town',
    encounters: [],
    notes: [
      'No wild encounters in Accumula Town in Black/White per Bulbapedia.',
      'Site of N\'s first speech and first rival battle (logged separately as a boss entry).',
    ],
  },
  {
    locationId: 'bw-route-2',
    displayName: 'Route 2',
    encounters: [
      // Standard grass
      encounter('Patrat', ['Normal'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Purrloin', ['Dark'], 'grass'),
      // Rustling grass
      rustling('Audino', ['Normal']),
      // Swarm-only encounter — listed as condition for transparency.
      encounter('Wynaut', ['Psychic'], 'grass', 'Both', 'Swarm-only encounter (40% rate within an active swarm day).', { condition: 'Swarm' }),
    ],
    notes: [
      'Pastoral route between Accumula Town and Striaton City. Verified per Bulbapedia (Unova Route 2 page).',
      'Site of the Route 2 Bianca rival battle (logged separately).',
    ],
  },
  {
    locationId: 'bw-striaton-city',
    displayName: 'Striaton City',
    encounters: [
      // Surfing (post-Surf only)
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      surf('Basculin', ['Water'], 'Black', 'Blue-Striped via Rippling Water — note the flip vs. standard Surf.', 'Rippling Water'),
      surf('Basculin', ['Water'], 'White', 'Red-Striped via Rippling Water — note the flip vs. standard Surf.', 'Rippling Water'),
      // Fishing (Super Rod)
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
      // Rippling-water Super Rod (post-game tier)
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
      // Elemental monkey gift after the Dreamyard / Striaton Gym story event
      encounter('Pansage', ['Grass'], 'gift', 'Both', 'Given by Cilan/Chili/Cress after the Dreamyard event if the player chose Oshawott.'),
      encounter('Pansear', ['Fire'], 'gift', 'Both', 'Given by Cilan/Chili/Cress after the Dreamyard event if the player chose Snivy.'),
      encounter('Panpour', ['Water'], 'gift', 'Both', 'Given by Cilan/Chili/Cress after the Dreamyard event if the player chose Tepig.'),
    ],
    notes: [
      'No wild grass encounters in Striaton City. Verified per Bulbapedia (Striaton City page).',
      'The elemental monkey strong against your starter is gifted after the Dreamyard event; only one is obtainable per run.',
      'Site of the Cheren rival battle and the Striaton Gym (Cilan/Chili/Cress), both logged as bosses.',
    ],
  },
  {
    locationId: 'bw-dreamyard',
    displayName: 'Dreamyard',
    encounters: [
      // Standard grass
      encounter('Patrat', ['Normal'], 'grass'),
      encounter('Purrloin', ['Dark'], 'grass'),
      encounter('Munna', ['Psychic'], 'grass'),
      // Rustling grass — Musharna is the marquee rare here
      rustling('Musharna', ['Psychic'], 'Both', 'Rare rustling-grass encounter (5% rate).'),
      rustling('Audino', ['Normal']),
      // Dark grass (post-badge content)
      darkGrass('Raticate', ['Normal']),
      darkGrass('Venomoth', ['Bug', 'Poison']),
      darkGrass('Ledian', ['Bug', 'Flying']),
      darkGrass('Ariados', ['Bug', 'Poison']),
      darkGrass('Kricketune', ['Bug']),
      darkGrass('Watchog', ['Normal']),
      darkGrass('Liepard', ['Dark']),
      darkGrass('Munna', ['Psychic']),
    ],
    notes: [
      'Ruined building west of Striaton City. Verified per Bulbapedia (Dreamyard page).',
      'Story event with Team Plasma grunts logged as a separate boss entry.',
      'Dark-grass encounters are post-badge high-level patches (~level 47-50).',
    ],
  },
];

export const bwEncounterNotes = {
  versionSplit: 'Encounters marked Black or White are version-exclusive (most notably Basculin forms).',
  monkeyGift: 'The elemental monkey gift in Striaton City depends on your starter: Snivy→Pansear, Tepig→Panpour, Oshawott→Pansage.',
};

/**
 * Build the flat `EncounterOption` map for a given BW game version.
 * Filters out encounters that don't apply to the requested version and preserves the
 * rod/condition/version fields so the UI can render chips.
 */
export function getBwEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'Black' && gameVersion !== 'White') return {};

  return bwEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item): EncounterOption => ({
        species: item.species,
        types: item.types,
        surfMethod: item.method === 'surfing' || undefined,
        fishingMethod: item.method === 'fishing' || undefined,
        ...(item.rod ? { rod: item.rod } : {}),
        ...(item.condition ? { condition: item.condition } : {}),
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
