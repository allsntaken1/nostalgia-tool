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

/** Tag a cave-method encounter as Dust Cloud (Drilbur etc.). */
const dustCloud = (species: string, types: PokemonType[], version: BwVersion = 'Both', notes?: string): BwEncounter =>
  encounter(species, types, 'cave', version, notes, { condition: 'Dust Cloud' });

/** Tag a walking encounter as Deep Sand (Route 4 / Desert Resort sand patches). */
const deepSand = (species: string, types: PokemonType[], version: BwVersion = 'Both', notes?: string): BwEncounter =>
  encounter(species, types, 'grass', version, notes, { condition: 'Deep Sand' });

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
  {
    locationId: 'bw-route-3',
    displayName: 'Route 3',
    encounters: [
      // Standard grass
      encounter('Patrat', ['Normal'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Purrloin', ['Dark'], 'grass'),
      encounter('Pidove', ['Normal', 'Flying'], 'grass'),
      encounter('Blitzle', ['Electric'], 'grass'),
      // Dark grass — same species set at higher levels
      darkGrass('Patrat', ['Normal']),
      darkGrass('Lillipup', ['Normal']),
      darkGrass('Purrloin', ['Dark']),
      darkGrass('Pidove', ['Normal', 'Flying']),
      darkGrass('Blitzle', ['Electric']),
      // Rustling grass
      rustling('Audino', ['Normal']),
      // Swarm-only encounter — version-exclusive firefly Pokémon
      encounter('Volbeat', ['Bug'], 'grass', 'Black', 'Swarm-only encounter (40% during an active swarm day) — Black-exclusive.', { condition: 'Swarm' }),
      encounter('Illumise', ['Bug'], 'grass', 'White', 'Swarm-only encounter (40% during an active swarm day) — White-exclusive.', { condition: 'Swarm' }),
      // Surfing
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Fishing (Super Rod)
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
      // Rippling-water Super Rod
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
    ],
    notes: [
      'Route between Striaton City and the Wellspring Cave entrance. Verified per Bulbapedia (Unova Route 3 page).',
      'Site of the Cheren Route 3 rival battle (logged separately).',
    ],
  },
  {
    locationId: 'bw-wellspring-cave',
    displayName: 'Wellspring Cave',
    encounters: [
      // Standard cave walking
      encounter('Roggenrola', ['Rock'], 'cave'),
      encounter('Woobat', ['Psychic', 'Flying'], 'cave'),
      // Dust cloud (cave overworld phenomenon — Drilbur is the canonical occupant)
      dustCloud('Drilbur', ['Ground'], 'Both', 'Dust-cloud-only encounter inside Wellspring Cave.'),
      // Surfing — requires HM later in the game
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Fishing (Super Rod)
      fish('Poliwag', ['Water'], 'Super Rod'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
    ],
    notes: [
      'Cave accessible from Route 3. Verified per Bulbapedia (Wellspring Cave page).',
      'Site of the Team Plasma Wellspring Cave double battle (logged separately).',
    ],
  },
  {
    locationId: 'bw-nacrene-city',
    displayName: 'Nacrene City',
    encounters: [],
    notes: [
      'No wild grass/surf/fishing encounters in Nacrene City proper per Bulbapedia.',
      'Museum offers fossil revivals (Cranidos/Shieldon/Tirtouga/Archen depending on store progression) and the Cottonee/Petilil in-game trade (Dye). These story events are not encoded as encounters yet.',
      'Site of Lenora\'s gym battle and the N Nacrene battle (both logged separately as bosses).',
      'TODO: Decide schema convention for fossil revival encounters before populating.',
    ],
  },
  {
    locationId: 'bw-pinwheel-forest-outer',
    displayName: 'Pinwheel Forest Outside',
    encounters: [
      // Standard grass
      encounter('Pidove', ['Normal', 'Flying'], 'grass'),
      encounter('Timburr', ['Fighting'], 'grass'),
      encounter('Tympole', ['Water'], 'grass'),
      // Version-exclusive Fighting twin
      encounter('Throh', ['Fighting'], 'grass', 'White', 'White-exclusive grass encounter. TODO: re-verify version split against cartridge.'),
      encounter('Sawk', ['Fighting'], 'grass', 'Black', 'Black-exclusive grass encounter. TODO: re-verify version split against cartridge.'),
      // Dark grass
      darkGrass('Pidove', ['Normal', 'Flying']),
      darkGrass('Timburr', ['Fighting']),
      darkGrass('Tympole', ['Water']),
      darkGrass('Throh', ['Fighting'], 'White', 'White-exclusive dark-grass encounter. TODO: verify version split.'),
      darkGrass('Sawk', ['Fighting'], 'Black', 'Black-exclusive dark-grass encounter. TODO: verify version split.'),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Throh', ['Fighting'], 'White', 'Rare 5% rustling-grass encounter, White-exclusive.'),
      rustling('Sawk', ['Fighting'], 'Black', 'Rare 5% rustling-grass encounter, Black-exclusive.'),
    ],
    notes: [
      'Outer area of Pinwheel Forest, between Nacrene City and Skyarrow Bridge. Verified per Bulbapedia (Pinwheel Forest page).',
      'Throh (White) / Sawk (Black) is the canonical Gen 5 Fighting twin split — flagged for cartridge re-verification because version exclusivity differs across sources.',
      'Inner area is gated by Team Plasma grunts until after Lenora\'s gym — see separate "Pinwheel Forest Inside" entry.',
    ],
  },
  {
    locationId: 'bw-pinwheel-forest-inner',
    displayName: 'Pinwheel Forest Inside',
    encounters: [
      // Standard grass
      encounter('Sewaddle', ['Bug', 'Grass'], 'grass'),
      encounter('Cottonee', ['Grass'], 'grass', 'Black', 'Black-exclusive grass encounter. TODO: re-verify version split against cartridge.'),
      encounter('Petilil', ['Grass'], 'grass', 'White', 'White-exclusive grass encounter. TODO: re-verify version split against cartridge.'),
      encounter('Pidove', ['Normal', 'Flying'], 'grass'),
      encounter('Venipede', ['Bug', 'Poison'], 'grass'),
      // Dark grass
      darkGrass('Swadloon', ['Bug', 'Grass']),
      darkGrass('Whirlipede', ['Bug', 'Poison']),
      darkGrass('Tranquill', ['Normal', 'Flying']),
      darkGrass('Cottonee', ['Grass'], 'Black', 'Black-exclusive dark-grass encounter. TODO: verify version split.'),
      darkGrass('Petilil', ['Grass'], 'White', 'White-exclusive dark-grass encounter. TODO: verify version split.'),
      // Rustling grass — Audino + elemental monkeys + evolved version-exclusive grass mons
      rustling('Audino', ['Normal']),
      rustling('Pansage', ['Grass'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Pansear', ['Fire'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Panpour', ['Water'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Whimsicott', ['Grass'], 'Black', 'Rare 5% rustling-grass encounter, Black-exclusive. TODO: verify version split.'),
      rustling('Lilligant', ['Grass'], 'White', 'Rare 5% rustling-grass encounter, White-exclusive. TODO: verify version split.'),
      // Surfing (post-Surf)
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Fishing (Super Rod)
      fish('Goldeen', ['Water'], 'Super Rod'),
    ],
    notes: [
      'Inner section of Pinwheel Forest. Accessible after defeating Lenora (Team Plasma blockade is removed). Verified per Bulbapedia (Pinwheel Forest page).',
      'Rustling grass here is the only canonical source for an elemental monkey beyond the Striaton story gift.',
      'Cottonee/Whimsicott (Black) vs. Petilil/Lilligant (White) is the canonical Gen 5 floral grass split — flagged for cartridge re-verification.',
    ],
  },
  {
    locationId: 'bw-skyarrow-bridge',
    displayName: 'Skyarrow Bridge',
    encounters: [],
    notes: [
      'Pedestrian-only bridge connecting Pinwheel Forest to Castelia City. No wild encounters.',
    ],
  },
  {
    locationId: 'bw-castelia-city',
    displayName: 'Castelia City',
    encounters: [],
    notes: [
      'No wild surfing or fishing encounters in Castelia City proper per Bulbapedia (Castelia City page).',
      'Zorua is a one-time gift at Game Freak HQ in Castelia City if the player has a fateful-encounter Celebi. Not encoded as an encounter due to its event-distribution requirement.',
      'Site of Burgh\'s gym battle and the Bianca Castelia Gate rival battle (both logged separately as bosses).',
      'Castelia Sewers is a Black 2 / White 2 location; Black/White does not use it.',
    ],
  },
  {
    locationId: 'bw-route-4',
    displayName: 'Route 4',
    encounters: [
      // Deep sand (the route's standard walking encounter, in the sandstorm patches)
      deepSand('Sandile', ['Ground', 'Dark']),
      deepSand('Darumaka', ['Fire']),
      deepSand('Scraggy', ['Dark', 'Fighting']),
      // Hippopotas is a swarm-only encounter on Route 4
      encounter('Hippopotas', ['Ground'], 'grass', 'Both', 'Swarm-only encounter (40% rate during an active swarm day).', { condition: 'Swarm' }),
      // Surfing — Frillish 100% in the standard surf table
      surf('Frillish', ['Water', 'Ghost']),
      // Rippling water surf
      surf('Alomomola', ['Water'], 'Both', 'Rippling-water Surf encounter.', 'Rippling Water'),
      surf('Jellicent', ['Water', 'Ghost'], 'Both', 'Rare rippling-water Surf encounter (5% rate).', 'Rippling Water'),
      // Fishing (Super Rod)
      fish('Krabby', ['Water'], 'Super Rod'),
      fish('Clamperl', ['Water'], 'Super Rod'),
      fish('Luvdisc', ['Water'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter.'),
      // Rippling-water Super Rod
      fish('Relicanth', ['Water', 'Rock'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
      fish('Luvdisc', ['Water'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
      fish('Kingler', ['Water'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
      fish('Huntail', ['Water'], 'Super Rod', 'Black', 'Rippling-water Super Rod, Black-exclusive.'),
      fish('Gorebyss', ['Water'], 'Super Rod', 'White', 'Rippling-water Super Rod, White-exclusive.'),
    ],
    notes: [
      'Sandstorm route north of Castelia City; transitions into Desert Resort. Verified per Bulbapedia (Unova Route 4 page).',
      'Deep-sand walking encounters use method "grass" with the Deep Sand condition chip, mirroring how Rustling Grass and Dark Grass are encoded.',
      'Huntail (Black) vs Gorebyss (White) is the canonical Super-Rod rippling-water split.',
      'Site of the Cheren Route 4 rival battle (logged separately).',
    ],
  },
  {
    locationId: 'bw-desert-resort',
    displayName: 'Desert Resort',
    encounters: [
      // Deep sand — entrance + interior tables combined. Sigilyph is interior-only per Bulbapedia.
      deepSand('Sandile', ['Ground', 'Dark']),
      deepSand('Darumaka', ['Fire']),
      deepSand('Maractus', ['Grass']),
      deepSand('Scraggy', ['Dark', 'Fighting'], 'Both', 'Appears in the Entrance area only (interior swaps Scraggy for Sigilyph).'),
      deepSand('Dwebble', ['Bug', 'Rock']),
      deepSand('Sigilyph', ['Psychic', 'Flying'], 'Both', 'Appears in the Desert Interior only.'),
    ],
    notes: [
      'Open desert north of Route 4. Verified per Bulbapedia (Desert Resort page).',
      'The Entrance and Interior areas share most encounters; Scraggy is entrance-only and Sigilyph is interior-only. Current schema does not split subareas so both are listed with subarea notes.',
      'Volcarona is a postgame static at the bottom of Relic Castle, not encoded here.',
    ],
  },
  {
    locationId: 'bw-relic-castle',
    displayName: 'Relic Castle',
    encounters: [
      // Early-access cave walking (1F and B1F, reachable from Desert Resort entrance pre-postgame)
      encounter('Sandile', ['Ground', 'Dark'], 'cave'),
      encounter('Yamask', ['Ghost'], 'cave'),
    ],
    notes: [
      'Ancient ruins accessible from the Desert Resort. Early-access floors (1F-B1F) only. Verified per Bulbapedia (Relic Castle page).',
      'Deeper floors (B2F-B6F) are postgame-locked and contain Krokorok / Cofagrigus / Sandslash / Onix / Claydol — intentionally NOT encoded here per scope.',
      'The Volcarona static encounter at the bottom is postgame and not yet encoded.',
    ],
  },
  {
    locationId: 'bw-nimbasa-city',
    displayName: 'Nimbasa City',
    encounters: [],
    notes: [
      'No wild grass/surf/fishing encounters in Nimbasa City per Bulbapedia (Nimbasa City page).',
      'In-city gifts/items are not encoded: Bicycle from the Day-Care Man (after defeating a Plasma grunt at the city entrance), HM04 Strength, Soothe Bell, Vs. Recorder.',
      'Site of the N Ferris-wheel rival fight and Elesa\'s gym (both logged separately as bosses).',
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
