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
  minLevel?: number;
  maxLevel?: number;
  rate?: number;
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
  extras: Pick<Partial<BwEncounter>, 'rod' | 'condition' | 'minLevel' | 'maxLevel' | 'rate'> = {},
): BwEncounter => ({ species, types, method, version, notes, ...extras });

const details = (minLevel: number, maxLevel: number, rate?: number, condition?: string) => ({
  minLevel,
  maxLevel,
  ...(typeof rate === 'number' ? { rate } : {}),
  ...(condition ? { condition } : {}),
});

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
  // TODO: BW encounter locationIds are currently bw-prefixed while route IDs are not.
  // Runtime maps these areas by displayName, so leave ids unchanged until saved-run migration is planned.
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
      // Version-exclusive Fighting twin — Throh is Black-exclusive, Sawk is White-exclusive
      // (corrected in Pass 4 against Bulbapedia Lostlorn Forest cross-reference).
      encounter('Throh', ['Fighting'], 'grass', 'Black', 'Black-exclusive grass encounter.'),
      encounter('Sawk', ['Fighting'], 'grass', 'White', 'White-exclusive grass encounter.'),
      // Dark grass
      darkGrass('Pidove', ['Normal', 'Flying']),
      darkGrass('Timburr', ['Fighting']),
      darkGrass('Tympole', ['Water']),
      darkGrass('Throh', ['Fighting'], 'Black', 'Black-exclusive dark-grass encounter.'),
      darkGrass('Sawk', ['Fighting'], 'White', 'White-exclusive dark-grass encounter.'),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Throh', ['Fighting'], 'Black', 'Rare 5% rustling-grass encounter, Black-exclusive.'),
      rustling('Sawk', ['Fighting'], 'White', 'Rare 5% rustling-grass encounter, White-exclusive.'),
    ],
    notes: [
      'Outer area of Pinwheel Forest, between Nacrene City and Skyarrow Bridge. Verified per Bulbapedia (Pinwheel Forest page).',
      'Throh (Black) / Sawk (White) is the canonical Gen 5 Fighting twin split (verified against Bulbapedia Lostlorn Forest cross-reference in Pass 4; Pass 2 entry had the split inverted and has been corrected).',
      'Inner area is gated by Team Plasma grunts until after Lenora\'s gym — see separate "Pinwheel Forest Inside" entry.',
    ],
  },
  {
    locationId: 'bw-pinwheel-forest-inner',
    displayName: 'Pinwheel Forest Inside',
    encounters: [
      // Standard grass
      encounter('Sewaddle', ['Bug', 'Grass'], 'grass'),
      // Cottonee/Whimsicott is White-exclusive, Petilil/Lilligant is Black-exclusive
      // (corrected in Pass 4 against Bulbapedia Lostlorn Forest cross-reference).
      encounter('Cottonee', ['Grass'], 'grass', 'White', 'White-exclusive grass encounter.'),
      encounter('Petilil', ['Grass'], 'grass', 'Black', 'Black-exclusive grass encounter.'),
      encounter('Pidove', ['Normal', 'Flying'], 'grass'),
      encounter('Venipede', ['Bug', 'Poison'], 'grass'),
      // Dark grass
      darkGrass('Swadloon', ['Bug', 'Grass']),
      darkGrass('Whirlipede', ['Bug', 'Poison']),
      darkGrass('Tranquill', ['Normal', 'Flying']),
      darkGrass('Cottonee', ['Grass'], 'White', 'White-exclusive dark-grass encounter.'),
      darkGrass('Petilil', ['Grass'], 'Black', 'Black-exclusive dark-grass encounter.'),
      // Rustling grass — Audino + elemental monkeys + evolved version-exclusive grass mons
      rustling('Audino', ['Normal']),
      rustling('Pansage', ['Grass'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Pansear', ['Fire'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Panpour', ['Water'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Whimsicott', ['Grass'], 'White', 'Rare 5% rustling-grass encounter, White-exclusive.'),
      rustling('Lilligant', ['Grass'], 'Black', 'Rare 5% rustling-grass encounter, Black-exclusive.'),
      // Surfing (post-Surf)
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Fishing (Super Rod)
      fish('Goldeen', ['Water'], 'Super Rod'),
    ],
    notes: [
      'Inner section of Pinwheel Forest. Accessible after defeating Lenora (Team Plasma blockade is removed). Verified per Bulbapedia (Pinwheel Forest page).',
      'Rustling grass here is the only canonical source for an elemental monkey beyond the Striaton story gift.',
      'Cottonee/Whimsicott (White) vs. Petilil/Lilligant (Black) is the canonical Gen 5 floral grass split (verified against Bulbapedia Lostlorn Forest cross-reference in Pass 4; Pass 2 entry had the split inverted and has been corrected).',
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
  {
    locationId: 'bw-route-5',
    displayName: 'Route 5',
    encounters: [
      // Regular grass
      encounter('Liepard', ['Dark'], 'grass'),
      encounter('Trubbish', ['Poison'], 'grass'),
      encounter('Minccino', ['Normal'], 'grass'),
      encounter('Gothita', ['Psychic'], 'grass', 'Black', 'Black-exclusive grass encounter.'),
      encounter('Solosis', ['Psychic'], 'grass', 'White', 'White-exclusive grass encounter.'),
      // Dark grass
      darkGrass('Liepard', ['Dark']),
      darkGrass('Trubbish', ['Poison']),
      darkGrass('Minccino', ['Normal']),
      darkGrass('Gothita', ['Psychic'], 'Black', 'Black-exclusive dark-grass encounter.'),
      darkGrass('Solosis', ['Psychic'], 'White', 'White-exclusive dark-grass encounter.'),
      // Rustling grass — Audino mostly, with Cinccino and Emolga as rare entries
      rustling('Audino', ['Normal']),
      rustling('Cinccino', ['Normal'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rare 10% rustling-grass encounter.'),
      // Swarm (Smeargle)
      encounter('Smeargle', ['Normal'], 'grass', 'Both', 'Swarm-only encounter (40% rate during an active swarm day).', { condition: 'Swarm' }),
    ],
    notes: [
      'Mid-game route connecting Nimbasa City to Driftveil Drawbridge. Verified per Bulbapedia (Unova Route 5 page).',
      'Gothita (Black) vs. Solosis (White) is the canonical Psychic-line version split.',
      'No Surf/Fishing tables on Route 5 itself; the route\'s water access is via the Driftveil Drawbridge.',
    ],
  },
  {
    locationId: 'bw-driftveil-drawbridge',
    displayName: 'Driftveil Drawbridge',
    encounters: [
      // Flying-Pokémon shadow ambush — encoded as method: 'special' with a Bridge Shadow condition
      // so the UI surfaces it distinctly from grass/cave entries.
      encounter('Ducklett', ['Water', 'Flying'], 'special', 'Both', 'Bridge-shadow ambush encounter (100% rate) when a flying Pokémon\'s shadow passes overhead.', { condition: 'Bridge Shadow' }),
    ],
    notes: [
      'Drawbridge between Route 5 and Driftveil City. Wild encounters occur via the flying-Pokémon shadow mechanic; the same shadow can drop wing items. Verified per Bulbapedia (Driftveil Drawbridge page).',
    ],
  },
  {
    locationId: 'bw-driftveil-city',
    displayName: 'Driftveil City',
    encounters: [
      // Surfing
      surf('Frillish', ['Water', 'Ghost']),
      // Rippling-water surf
      surf('Alomomola', ['Water'], 'Both', 'Rippling-water Surf encounter (95% rate).', 'Rippling Water'),
      surf('Jellicent', ['Water', 'Ghost'], 'Both', 'Rare rippling-water Surf encounter (5% rate).', 'Rippling Water'),
      // Fishing (Super Rod)
      fish('Krabby', ['Water'], 'Super Rod'),
      fish('Chinchou', ['Water', 'Electric'], 'Super Rod'),
      fish('Luvdisc', ['Water'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter.'),
      // Rippling-water Super Rod
      fish('Kingler', ['Water'], 'Super Rod', 'Both', 'Rippling-water Super Rod encounter.'),
      fish('Lanturn', ['Water', 'Electric'], 'Super Rod', 'Both', 'Rare rippling-water Super Rod encounter.'),
    ],
    notes: [
      'Port city housing Clay\'s gym (Gym 5). Verified per Bulbapedia (Driftveil City page).',
      'In-game Minccino-for-Basculin trade (Red-Striped in Black, Blue-Striped in White) is not encoded as a wild encounter.',
      'Site of the Bianca Driftveil rival fight and Clay\'s gym battle (both logged separately as bosses).',
    ],
  },
  {
    locationId: 'bw-route-6',
    displayName: 'Route 6',
    encounters: [
      // Regular grass — seasonal swaps for Tranquill/Swadloon (spring/summer/autumn) vs Vanillite (winter)
      encounter('Tranquill', ['Normal', 'Flying'], 'grass', 'Both', 'Spring / Summer / Autumn only.', { condition: 'Spring/Summer/Autumn' }),
      encounter('Swadloon', ['Bug', 'Grass'], 'grass', 'Both', 'Spring / Summer / Autumn only.', { condition: 'Spring/Summer/Autumn' }),
      encounter('Vanillite', ['Ice'], 'grass', 'Both', 'Winter only.', { condition: 'Winter' }),
      encounter('Deerling', ['Normal', 'Grass'], 'grass', 'Both', 'Form (Spring / Summer / Autumn / Winter) varies by season.'),
      encounter('Karrablast', ['Bug'], 'grass'),
      encounter('Foongus', ['Grass', 'Poison'], 'grass'),
      // Dark grass — same seasonal pattern at higher levels
      darkGrass('Tranquill', ['Normal', 'Flying'], 'Both', 'Spring / Summer / Autumn only.'),
      darkGrass('Swadloon', ['Bug', 'Grass'], 'Both', 'Spring / Summer / Autumn only.'),
      darkGrass('Vanillite', ['Ice'], 'Both', 'Winter only.'),
      darkGrass('Deerling', ['Normal', 'Grass'], 'Both', 'Form varies by season.'),
      darkGrass('Karrablast', ['Bug']),
      darkGrass('Foongus', ['Grass', 'Poison']),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Unfezant', ['Normal', 'Flying'], 'Both', 'Rare 5% rustling-grass encounter (Spring/Summer/Autumn).'),
      rustling('Leavanny', ['Bug', 'Grass'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rare 20% rustling-grass encounter.'),
      // Surfing
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Rippling-water Surf
      surf('Basculin', ['Water'], 'Both', 'Rippling-water Surf (form varies by version).', 'Rippling Water'),
      surf('Politoed', ['Water'], 'Both', 'Rare 5% rippling-water Surf encounter.', 'Rippling Water'),
      // Fishing (Super Rod)
      fish('Poliwag', ['Water'], 'Super Rod'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      // Swarm (version-exclusive)
      encounter('Plusle', ['Electric'], 'grass', 'Black', 'Swarm-only encounter (40% during an active swarm day), Black-exclusive.', { condition: 'Swarm' }),
      encounter('Minun', ['Electric'], 'grass', 'White', 'Swarm-only encounter (40% during an active swarm day), White-exclusive.', { condition: 'Swarm' }),
    ],
    notes: [
      'Forest route between Driftveil City and Chargestone Cave. Verified per Bulbapedia (Unova Route 6 page).',
      'Seasonal swaps: Tranquill / Swadloon appear Spring/Summer/Autumn; Vanillite replaces them in Winter. Deerling\'s form changes with the season but is available year-round.',
      'Plusle (Black) vs Minun (White) is the canonical swarm version split.',
    ],
  },
  {
    locationId: 'bw-chargestone-cave',
    displayName: 'Chargestone Cave',
    encounters: [
      // Cave walking — 1F/B1F and B2F have nearly identical tables; merging since schema doesn't split floors
      encounter('Boldore', ['Rock'], 'cave'),
      encounter('Joltik', ['Bug', 'Electric'], 'cave'),
      encounter('Ferroseed', ['Grass', 'Steel'], 'cave'),
      encounter('Klink', ['Steel'], 'cave'),
      encounter('Tynamo', ['Electric'], 'cave', 'Both', 'Rare cave encounter (2% on 1F/B1F, 8% on B2F).'),
      // Dust cloud
      dustCloud('Drilbur', ['Ground'], 'Both', 'Dust-cloud-only encounter inside Chargestone Cave (all floors).'),
    ],
    notes: [
      'Electromagnetic cave connecting Route 6 to Mistralton City. Verified per Bulbapedia (Chargestone Cave page).',
      'Floor tables (1F/B1F vs B2F) share the same species set with slight rate differences; schema does not split subareas so the union is listed here.',
      'Site of the required N Chargestone Cave story battle (logged separately as a boss).',
    ],
  },
  {
    locationId: 'bw-mistralton-city',
    displayName: 'Mistralton City',
    encounters: [],
    notes: [
      'No standard wild grass/surf/fishing encounter table for Mistralton City in Bulbapedia\'s primary page.',
      'Cargo plane town housing Skyla\'s gym (Gym 6). Larvesta egg from Cedric Juniper is part of the post-Skyla Route 18 sequence and is not encoded as a Mistralton encounter.',
      'Site of Skyla\'s gym battle (logged separately as a boss).',
      'TODO: Verify whether Mistralton has any reachable Surf/Fishing tiles during the main story; Bulbapedia did not surface a table for this Pass.',
    ],
  },
  {
    locationId: 'bw-celestial-tower',
    displayName: 'Celestial Tower',
    encounters: [
      // Tower walking — Litwick on lower floors, Elgyem rising in frequency higher up
      encounter('Litwick', ['Ghost', 'Fire'], 'cave'),
      encounter('Elgyem', ['Psychic'], 'cave', 'Both', 'Appears on 3F-5F, rate climbs from 15% on 3F to 50% on 5F.'),
    ],
    notes: [
      'Bell tower west of Mistralton City reachable via Route 7. Tower-walking method is encoded as "cave" since the project does not split tower interiors. Verified per Bulbapedia (Celestial Tower page).',
      'Litwick dominates 2F (100%) and tapers off ascending floors as Elgyem becomes more common.',
    ],
  },
  {
    locationId: 'bw-route-7',
    displayName: 'Route 7',
    encounters: [
      // Regular grass
      encounter('Watchog', ['Normal'], 'grass'),
      encounter('Zebstrika', ['Electric'], 'grass'),
      encounter('Foongus', ['Grass', 'Poison'], 'grass'),
      encounter('Deerling', ['Normal', 'Grass'], 'grass', 'Both', 'Form varies by season.'),
      encounter('Tranquill', ['Normal', 'Flying'], 'grass'),
      encounter('Cubchoo', ['Ice'], 'grass', 'Both', 'Winter only.', { condition: 'Winter' }),
      // Dark grass
      darkGrass('Watchog', ['Normal']),
      darkGrass('Zebstrika', ['Electric']),
      darkGrass('Foongus', ['Grass', 'Poison']),
      darkGrass('Tranquill', ['Normal', 'Flying']),
      darkGrass('Deerling', ['Normal', 'Grass'], 'Both', 'Form varies by season.'),
      darkGrass('Cubchoo', ['Ice'], 'Both', 'Winter only.'),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Unfezant', ['Normal', 'Flying'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rare 10% rustling-grass encounter.'),
    ],
    notes: [
      'Mountainous route between Mistralton City, Celestial Tower, and Twist Mountain. Verified per Bulbapedia (Unova Route 7 page).',
      'Cubchoo is winter-only; Deerling\'s sprite form changes with the season but is available year-round.',
      'Story-position note: Route 7 is canonically accessed post-Skyla in BW; included in Pass 5 per the explicit scope list. Twist Mountain (eastern continuation) is post-Skyla and not yet populated.',
      'TODO: Populate Mistralton-area Bouffalant trade reference if the tracker convention starts encoding in-game trades as encounter entries.',
    ],
  },
  {
    locationId: 'bw-mistralton-cave',
    displayName: 'Mistralton Cave',
    encounters: [
      encounter('Boldore', ['Rock'], 'cave', 'Both', undefined, details(28, 31, 50)),
      encounter('Woobat', ['Psychic', 'Flying'], 'cave', 'Both', undefined, details(28, 30, 30)),
      encounter('Axew', ['Dragon'], 'cave', 'Both', undefined, details(30, 31, 20)),
      dustCloud('Drilbur', ['Ground'], 'Both', 'Dust-cloud-only encounter, 100% of Pokemon dust clouds.',),
      encounter('Cobalion', ['Steel', 'Fighting'], 'legendary', 'Both', 'Static legendary in Guidance Chamber after reaching the chamber. Respawns after Hall of Fame if defeated or run from.', details(42, 42, 100, 'Guidance Chamber')),
    ],
    notes: [
      'Optional cave reached from Route 6 using Surf. Verified per Bulbapedia (Mistralton Cave page).',
      '1F-2F and Guidance Chamber share the same Black/White walking table; schema does not split floors.',
      'Cobalion is encoded as legendary because the schema already supports one-time legendary encounters.',
    ],
  },
  {
    locationId: 'bw-twist-mountain',
    displayName: 'Twist Mountain',
    encounters: [
      encounter('Boldore', ['Rock'], 'cave', 'Both', 'Seasonal rates vary across non-winter and winter tables.', details(28, 31)),
      encounter('Woobat', ['Psychic', 'Flying'], 'cave', 'Both', 'Seasonal rates vary across spring/summer/autumn/winter tables.', details(28, 31)),
      encounter('Gurdurr', ['Fighting'], 'cave', 'Both', 'Seasonal rates vary across non-winter and winter tables.', details(28, 30)),
      encounter('Cubchoo', ['Ice'], 'cave', 'Both', 'Appears more frequently in winter.', details(28, 31)),
      encounter('Cryogonal', ['Ice'], 'cave', 'Both', 'Rare cave encounter; seasonal rates vary.', details(28, 31)),
      dustCloud('Drilbur', ['Ground'], 'Both', 'Dust-cloud-only encounter, 100% of Pokemon dust clouds.'),
    ],
    notes: [
      'Cave between Route 7 and Icirrus City, accessible after the Jet Badge in Black/White. Verified per Bulbapedia (Twist Mountain page).',
      'Rates differ by season and floor grouping; this flat entry preserves species, level ranges, and season notes without flattening rates incorrectly.',
    ],
  },
  {
    locationId: 'bw-icirrus-city',
    displayName: 'Icirrus City',
    encounters: [],
    notes: [
      'No standard wild encounter table is listed for Icirrus City itself in Black/White; nearby encounters live in Twist Mountain, Dragonspiral Tower, Route 8, and Moor of Icirrus.',
    ],
  },
  {
    locationId: 'bw-dragonspiral-tower',
    displayName: 'Dragonspiral Tower',
    encounters: [
      encounter('Tranquill', ['Normal', 'Flying'], 'grass', 'Both', 'Entrance/outside grass in spring, summer, and autumn.', details(30, 32, 30, 'Spring/Summer/Autumn')),
      encounter('Vanillite', ['Ice'], 'grass', 'Both', 'Winter-only grass encounter.', details(31, 33, 30, 'Winter')),
      encounter('Deerling', ['Normal', 'Grass'], 'grass', 'Both', 'Form varies by season.', details(30, 32, 30)),
      encounter('Mienfoo', ['Fighting'], 'grass', 'Both', undefined, details(30, 33, 30)),
      encounter('Druddigon', ['Dragon'], 'grass', 'Both', 'Not available in winter grass outside/entrance.', details(31, 33, 10, 'Spring/Summer/Autumn')),
      encounter('Cubchoo', ['Ice'], 'grass', 'Both', 'Winter-only grass encounter.', details(33, 33, 10, 'Winter')),
      darkGrass('Vanillish', ['Ice'], 'Both', 'Winter-only dark grass.'),
      darkGrass('Sawsbuck', ['Normal', 'Grass'], 'Both', 'Winter-only dark grass; form varies by season in detailed tables.'),
      darkGrass('Mienfoo', ['Fighting'], 'Both', 'Winter-only dark grass.'),
      darkGrass('Beartic', ['Ice'], 'Both', 'Winter-only dark grass.'),
      rustling('Audino', ['Normal'], 'Both', 'Rustling grass; 85% outside non-winter, 90% in winter.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rustling grass, 10%.'),
      rustling('Unfezant', ['Normal', 'Flying'], 'Both', 'Rustling grass, 5% outside non-winter.'),
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.', undefined),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.', undefined),
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via rippling-water Surf.', 'Rippling Water'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via rippling-water Surf.', 'Rippling Water'),
      fish('Dratini', ['Dragon'], 'Super Rod', 'Both', 'Super Rod encounter, 55%.'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
      fish('Dragonair', ['Dragon'], 'Super Rod', 'Both', 'Super Rod encounter, 5%; also appears in rippling-water fishing.'),
      encounter('Golett', ['Ground', 'Ghost'], 'cave', 'Both', 'Interior 1F/2F encounter; encoded as cave for tower interiors.', details(30, 33)),
      encounter('Druddigon', ['Dragon'], 'cave', 'Both', 'Interior 1F encounter; encoded as cave for tower interiors.', details(30, 33)),
      encounter('Mienfoo', ['Fighting'], 'cave', 'Both', 'Interior 1F encounter; encoded as cave for tower interiors.', details(33, 33)),
    ],
    notes: [
      'Black/White Dragonspiral Tower has entrance/outside seasonal grass plus interior tower encounters. Verified per Bulbapedia (Dragonspiral Tower page).',
      'Schema does not split entrance/outside/interior floors cleanly, so subarea details are preserved in notes/conditions.',
      'Reshiram/Zekrom fallback appearance at Dragonspiral is not encoded here; the normal story legendary is represented at N\'s Castle.',
    ],
  },
  {
    locationId: 'bw-route-8',
    displayName: 'Route 8',
    encounters: [
      encounter('Palpitoad', ['Water', 'Ground'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle grass encounters in winter.', details(30, 33, 40, 'Puddle: Spring/Summer/Autumn')),
      encounter('Shelmet', ['Bug'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle grass encounters in winter.', details(30, 33, 40, 'Puddle: Spring/Summer/Autumn')),
      encounter('Stunfisk', ['Ground', 'Electric'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle grass encounters in winter.', details(31, 32, 20, 'Puddle: Spring/Summer/Autumn')),
      surf('Stunfisk', ['Ground', 'Electric'], 'Both', 'Surf encounter, 100%.'),
      surf('Stunfisk', ['Ground', 'Electric'], 'Both', 'Rippling-water Surf encounter, 95%.', 'Rippling Water'),
      surf('Seismitoad', ['Water', 'Ground'], 'Both', 'Rare rippling-water Surf encounter, 5%.', 'Rippling Water'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod', 'Both', 'Super Rod encounter, 60%; also appears while fishing in rippling water.'),
      fish('Stunfisk', ['Ground', 'Electric'], 'Super Rod', 'Both', 'Super Rod encounter, 40%; also appears while fishing in rippling water.'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 20%.'),
      encounter('Croagunk', ['Poison', 'Fighting'], 'grass', 'Both', 'Swarm-only puddle encounter in spring/summer/autumn.', details(15, 55, 40, 'Swarm')),
    ],
    notes: [
      'Wet route between Icirrus City and Tubeline Bridge. Verified per Bulbapedia (Unova Route 8 page).',
      'Puddle encounters are seasonal and absent in winter; Surf/Fishing encounters remain representable with method chips.',
    ],
  },
  {
    locationId: 'bw-moor-of-icirrus',
    displayName: 'Moor of Icirrus',
    encounters: [
      encounter('Palpitoad', ['Water', 'Ground'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle encounters in winter.', details(30, 33, 40, 'Puddle: Spring/Summer/Autumn')),
      encounter('Shelmet', ['Bug'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle encounters in winter.', details(30, 33, 40, 'Puddle: Spring/Summer/Autumn')),
      encounter('Stunfisk', ['Ground', 'Electric'], 'grass', 'Both', 'Puddle encounter in spring/summer/autumn; no puddle encounters in winter.', details(31, 32, 20, 'Puddle: Spring/Summer/Autumn')),
      surf('Stunfisk', ['Ground', 'Electric'], 'Both', 'Surf encounter, 100%.'),
      surf('Stunfisk', ['Ground', 'Electric'], 'Both', 'Rippling-water Surf encounter, 95%.', 'Rippling Water'),
      surf('Seismitoad', ['Water', 'Ground'], 'Both', 'Rare rippling-water Surf encounter, 5%.', 'Rippling Water'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod', 'Both', 'Super Rod encounter, 60%; also appears while fishing in rippling water.'),
      fish('Stunfisk', ['Ground', 'Electric'], 'Super Rod', 'Both', 'Super Rod encounter, 40%; also appears while fishing in rippling water.'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 20%.'),
    ],
    notes: [
      'Optional wetland north of Route 8. Verified per Bulbapedia (Moor of Icirrus page).',
      'Puddle encounter table mirrors Route 8; winter freezes the wetlands and removes puddle encounter slots.',
    ],
  },
  {
    locationId: 'bw-tubeline-bridge',
    displayName: 'Tubeline Bridge',
    encounters: [],
    notes: [
      'No wild encounter table for Tubeline Bridge in Black/White.',
    ],
  },
  {
    locationId: 'bw-route-9',
    displayName: 'Route 9',
    encounters: [
      encounter('Liepard', ['Dark'], 'grass', 'Both', undefined, details(33, 33, 10)),
      encounter('Garbodor', ['Poison'], 'grass', 'Both', undefined, details(31, 33, 20)),
      encounter('Minccino', ['Normal'], 'grass', 'Both', undefined, details(32, 32, 20)),
      encounter('Gothorita', ['Psychic'], 'grass', 'Black', 'Black-exclusive grass encounter.', details(31, 34, 30)),
      encounter('Duosion', ['Psychic'], 'grass', 'White', 'White-exclusive grass encounter.', details(31, 34, 30)),
      encounter('Pawniard', ['Dark', 'Steel'], 'grass', 'Both', undefined, details(31, 34, 20)),
      darkGrass('Liepard', ['Dark'], 'Both', 'Dark grass, 10%.'),
      darkGrass('Garbodor', ['Poison'], 'Both', 'Dark grass, 20%.'),
      darkGrass('Minccino', ['Normal'], 'Both', 'Dark grass, 20%.'),
      darkGrass('Gothorita', ['Psychic'], 'Black', 'Black-exclusive dark-grass encounter, 30%.'),
      darkGrass('Duosion', ['Psychic'], 'White', 'White-exclusive dark-grass encounter, 30%.'),
      darkGrass('Pawniard', ['Dark', 'Steel'], 'Both', 'Dark grass, 20%; level/rate rows vary by version.'),
      rustling('Audino', ['Normal'], 'Both', 'Rustling grass, 80%.'),
      rustling('Cinccino', ['Normal'], 'Both', 'Rustling grass, 5%.'),
      rustling('Gothitelle', ['Psychic'], 'Black', 'Black-exclusive rustling grass, 5%.'),
      rustling('Reuniclus', ['Psychic'], 'White', 'White-exclusive rustling grass, 5%.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rustling grass, 10%.'),
      encounter('Houndour', ['Dark', 'Fire'], 'grass', 'Black', 'Swarm-only encounter, Black-exclusive.', details(15, 55, 40, 'Swarm')),
      encounter('Poochyena', ['Dark'], 'grass', 'White', 'Swarm-only encounter, White-exclusive.', details(15, 55, 40, 'Swarm')),
    ],
    notes: [
      'Short route between Tubeline Bridge and Opelucid City. Verified per Bulbapedia (Unova Route 9 page).',
      'Challenger\'s Cave entrance is postgame-only and not encoded in this Route 9 table.',
    ],
  },
  {
    locationId: 'bw-opelucid-city',
    displayName: 'Opelucid City',
    encounters: [],
    notes: [
      'No standard wild encounter table for Opelucid City in Black/White.',
    ],
  },
  {
    locationId: 'bw-route-10',
    displayName: 'Route 10',
    encounters: [
      encounter('Herdier', ['Normal'], 'grass', 'Both', undefined, details(33, 34, 30)),
      encounter('Throh', ['Fighting'], 'grass', 'White', 'White-exclusive grass encounter.', details(33, 36, 10)),
      encounter('Sawk', ['Fighting'], 'grass', 'Black', 'Black-exclusive grass encounter.', details(33, 36, 10)),
      encounter('Foongus', ['Grass', 'Poison'], 'grass', 'Both', undefined, details(34, 35, 10)),
      encounter('Bouffalant', ['Normal'], 'grass', 'Both', undefined, details(34, 35, 20)),
      encounter('Rufflet', ['Normal', 'Flying'], 'grass', 'White', 'White-exclusive grass encounter.', details(34, 36, 30)),
      encounter('Vullaby', ['Dark', 'Flying'], 'grass', 'Black', 'Black-exclusive grass encounter.', details(34, 36, 30)),
      darkGrass('Herdier', ['Normal'], 'Both', 'Dark grass, 30%.'),
      darkGrass('Throh', ['Fighting'], 'White', 'White-exclusive dark grass, 10%.'),
      darkGrass('Sawk', ['Fighting'], 'Black', 'Black-exclusive dark grass, 10%.'),
      darkGrass('Amoonguss', ['Grass', 'Poison'], 'Both', 'Dark grass, 10%.'),
      darkGrass('Bouffalant', ['Normal'], 'Both', 'Dark grass, 20%.'),
      darkGrass('Rufflet', ['Normal', 'Flying'], 'White', 'White-exclusive dark grass, 30%.'),
      darkGrass('Vullaby', ['Dark', 'Flying'], 'Black', 'Black-exclusive dark grass, 30%.'),
      rustling('Audino', ['Normal'], 'Both', 'Rustling grass, 80%.'),
      rustling('Stoutland', ['Normal'], 'Both', 'Rustling grass, 5%.'),
      rustling('Throh', ['Fighting'], 'White', 'White-exclusive rustling grass, 5%.'),
      rustling('Sawk', ['Fighting'], 'Black', 'Black-exclusive rustling grass, 5%.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rustling grass, 10%.'),
      encounter('Tyrogue', ['Fighting'], 'grass', 'Both', 'Swarm-only encounter.', details(15, 55, 40, 'Swarm')),
      encounter('Foongus', ['Grass', 'Poison'], 'static', 'Both', 'Fake item encounter near Opelucid entrance.', details(30, 30, 100, 'Fake Item')),
      encounter('Amoonguss', ['Grass', 'Poison'], 'static', 'Both', 'Fake item encounters in dark grass.', details(40, 40, 100, 'Fake Item')),
    ],
    notes: [
      'Final route before Badge Check Gates and Victory Road. Verified per Bulbapedia (Unova Route 10 page).',
      'Static fake-item Foongus/Amoonguss are encoded because they are catchable one-time encounters and the schema supports static encounters.',
    ],
  },
  {
    locationId: 'bw-victory-road',
    displayName: 'Victory Road',
    encounters: [
      encounter('Fraxure', ['Dragon'], 'grass', 'Both', 'Outside rough terrain encounter.', details(40, 40, 5, 'Outside Rough')),
      encounter('Mienfoo', ['Fighting'], 'grass', 'Both', 'Outside rough terrain and cave encounter.', details(38, 41)),
      encounter('Rufflet', ['Normal', 'Flying'], 'grass', 'White', 'White-exclusive outside rough terrain encounter.', details(37, 40, 35, 'Outside Rough')),
      encounter('Vullaby', ['Dark', 'Flying'], 'grass', 'Black', 'Black-exclusive outside rough terrain encounter.', details(37, 40, 35, 'Outside Rough')),
      encounter('Heatmor', ['Fire'], 'grass', 'Both', 'Outside rough terrain encounter.', details(37, 40, 45, 'Outside Rough')),
      encounter('Boldore', ['Rock'], 'cave', 'Both', 'Cave floor rates/levels vary by room.', details(37, 41)),
      encounter('Woobat', ['Psychic', 'Flying'], 'cave', 'Both', 'Cave floor rates/levels vary by room.', details(37, 42)),
      encounter('Durant', ['Bug', 'Steel'], 'cave', 'Both', 'Common cave encounter across rooms.', details(37, 42, 40)),
      encounter('Deino', ['Dark', 'Dragon'], 'cave', 'Both', '1F middle/rightmost room encounter.', details(38, 40, 20)),
      dustCloud('Excadrill', ['Ground', 'Steel'], 'Both', 'Dust-cloud-only encounter, 100% of Pokemon dust clouds.'),
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      fish('Poliwag', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 45%.'),
      fish('Poliwhirl', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 15%; also appears in rippling-water fishing.'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
      fish('Poliwrath', ['Water', 'Fighting'], 'Super Rod', 'Both', 'Rare rippling-water fishing encounter, 5%.'),
      encounter('Terrakion', ['Rock', 'Fighting'], 'legendary', 'Both', 'Static legendary in Trial Chamber after battling Cobalion in Mistralton Cave.', details(42, 42, 100, 'Trial Chamber')),
    ],
    notes: [
      'Victory Road has multiple room tables; this flat entry preserves the union of Black/White species with level/rate notes where safe. Verified per Bulbapedia (Victory Road Black and White page).',
      'Terrakion is encoded as legendary because the schema already supports one-time legendary encounters.',
    ],
  },
  {
    locationId: 'bw-pokemon-league',
    displayName: 'Pokemon League',
    encounters: [],
    notes: [
      'No wild encounter table for the Pokemon League in Black/White.',
    ],
  },
  {
    locationId: 'bw-ns-castle',
    displayName: "N's Castle",
    encounters: [
      encounter('Reshiram', ['Dragon', 'Fire'], 'legendary', 'Black', 'Story legendary before N in Pokemon Black.', details(50, 50, 100, 'Story Legendary')),
      encounter('Zekrom', ['Dragon', 'Electric'], 'legendary', 'White', 'Story legendary before N in Pokemon White.', details(50, 50, 100, 'Story Legendary')),
    ],
    notes: [
      'N\'s Castle has no normal wild encounter table in Black/White.',
      'The story legendary is encoded here as a legendary encounter because the schema supports one-time legendary encounters.',
    ],
  },
  {
    locationId: 'bw-route-17',
    displayName: 'Route 17',
    encounters: [
      surf('Frillish', ['Water', 'Ghost'], 'Both', 'Surf encounter, 100%.'),
      surf('Alomomola', ['Water'], 'Both', 'Rippling-water Surf encounter, 95%.', 'Rippling Water'),
      surf('Jellicent', ['Water', 'Ghost'], 'Both', 'Rare rippling-water Surf encounter, 5%.', 'Rippling Water'),
      fish('Finneon', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 45%.'),
      fish('Horsea', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 55%.'),
      fish('Seadra', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Lumineon', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 15%.'),
      fish('Kingdra', ['Water', 'Dragon'], 'Super Rod', 'Both', 'Rare rippling-water fishing encounter, 5%.'),
    ],
    notes: [
      'Sea route west of Route 1. Verified per Bulbapedia (Unova Route 17 page).',
      'This is Surf-access optional content in Black/White, not B2W2 data.',
    ],
  },
  {
    locationId: 'bw-route-18',
    displayName: 'Route 18',
    encounters: [
      encounter('Watchog', ['Normal'], 'grass', 'Both', undefined, details(28, 30, 20)),
      encounter('Throh', ['Fighting'], 'grass', 'White', 'White-exclusive grass encounter.', details(29, 31, 10)),
      encounter('Sawk', ['Fighting'], 'grass', 'Black', 'Black-exclusive grass encounter.', details(29, 31, 10)),
      encounter('Dwebble', ['Bug', 'Rock'], 'grass', 'Both', undefined, details(30, 31, 30)),
      encounter('Scraggy', ['Dark', 'Fighting'], 'grass', 'Both', undefined, details(28, 31, 40)),
      darkGrass('Watchog', ['Normal'], 'Both', 'Dark grass, 20%.'),
      darkGrass('Throh', ['Fighting'], 'White', 'White-exclusive dark grass, 10%.'),
      darkGrass('Sawk', ['Fighting'], 'Black', 'Black-exclusive dark grass, 10%.'),
      darkGrass('Crustle', ['Bug', 'Rock'], 'Both', 'Dark grass, 30%.'),
      darkGrass('Scraggy', ['Dark', 'Fighting'], 'Both', 'Dark grass, 40%.'),
      rustling('Audino', ['Normal'], 'Both', 'Rustling grass, 95%.'),
      rustling('Throh', ['Fighting'], 'White', 'White-exclusive rustling grass, 5%.'),
      rustling('Sawk', ['Fighting'], 'Black', 'Black-exclusive rustling grass, 5%.'),
      surf('Frillish', ['Water', 'Ghost'], 'Both', 'Surf encounter, 100%.'),
      surf('Alomomola', ['Water'], 'Both', 'Rippling-water Surf encounter, 95%.', 'Rippling Water'),
      surf('Jellicent', ['Water', 'Ghost'], 'Both', 'Rare rippling-water Surf encounter, 5%.', 'Rippling Water'),
      fish('Horsea', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 55%.'),
      fish('Chinchou', ['Water', 'Electric'], 'Super Rod', 'Both', 'Rare Super Rod encounter, 1%.'),
      fish('Finneon', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 44%.'),
      fish('Seadra', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Kingdra', ['Water', 'Dragon'], 'Super Rod', 'Both', 'Rare rippling-water fishing encounter, 5%.'),
      fish('Lumineon', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 15%.'),
      encounter('Exeggcute', ['Grass', 'Psychic'], 'grass', 'Both', 'Swarm-only encounter.', details(15, 55, 40, 'Swarm')),
      encounter('Larvesta', ['Bug', 'Fire'], 'gift', 'Both', 'Egg gift from the Route 18 house.', details(1, 1, 100, 'Egg Gift')),
    ],
    notes: [
      'Island route west of Route 17. Verified per Bulbapedia (Unova Route 18 page).',
      'Larvesta is represented as a gift encounter because the schema supports gift encounters; egg handling itself is not modeled beyond level/condition.',
    ],
  },
  {
    locationId: 'bw-p2-laboratory',
    displayName: 'P2 Laboratory',
    encounters: [
      encounter('Watchog', ['Normal'], 'grass', 'Both', undefined, details(28, 31, 36)),
      encounter('Herdier', ['Normal'], 'grass', 'Both', undefined, details(28, 31, 36)),
      encounter('Scraggy', ['Dark', 'Fighting'], 'grass', 'Both', undefined, details(29, 31, 14)),
      encounter('Klink', ['Steel'], 'grass', 'Both', undefined, details(29, 31, 14)),
      rustling('Audino', ['Normal'], 'Both', 'Rustling grass, 95%.'),
      rustling('Stoutland', ['Normal'], 'Both', 'Rustling grass, 5%.'),
      surf('Frillish', ['Water', 'Ghost'], 'Both', 'Surf encounter, 100%.'),
      surf('Alomomola', ['Water'], 'Both', 'Rippling-water Surf encounter, 95%.', 'Rippling Water'),
      surf('Jellicent', ['Water', 'Ghost'], 'Both', 'Rare rippling-water Surf encounter, 5%.', 'Rippling Water'),
      fish('Horsea', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 55%.'),
      fish('Finneon', ['Water'], 'Super Rod', 'Both', 'Super Rod encounter, 45%.'),
      fish('Seadra', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 40%.'),
      fish('Kingdra', ['Water', 'Dragon'], 'Super Rod', 'Both', 'Rare rippling-water fishing encounter, 5%.'),
      fish('Lumineon', ['Water'], 'Super Rod', 'Both', 'Rippling-water fishing encounter, 15%.'),
    ],
    notes: [
      'Optional island facility reached from Route 17. Verified per Bulbapedia (P2 Laboratory page).',
      'Genesect Drive event requires an event Genesect and is not encoded as an encounter.',
    ],
  },
  {
    locationId: 'bw-cold-storage',
    displayName: 'Cold Storage',
    encounters: [
      // Exterior grass — the storage building interior has no wild encounters
      encounter('Herdier', ['Normal'], 'grass'),
      encounter('Timburr', ['Fighting'], 'grass'),
      encounter('Minccino', ['Normal'], 'grass'),
      encounter('Vanillite', ['Ice'], 'grass'),
      // Dark grass (post-badge tier)
      darkGrass('Herdier', ['Normal']),
      darkGrass('Timburr', ['Fighting']),
      darkGrass('Minccino', ['Normal']),
      darkGrass('Vanillite', ['Ice']),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Stoutland', ['Normal'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Cinccino', ['Normal'], 'Both', 'Rare 5% rustling-grass encounter.'),
    ],
    notes: [
      'Refrigerated storage facility south of Driftveil City. All wild encounters occur on the exterior grass; the storage warehouse building itself has no wild Pokémon. Verified per Bulbapedia (Cold Storage page).',
      'Site of the required Team Plasma story sequence (logged as a separate boss entry).',
      'Schema does not split interior vs exterior subareas; the absence of interior wild encounters is captured in this note.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Postgame staging area
// ---------------------------------------------------------------------------
//
// Black/White encounter areas that are ONLY accessible after defeating the
// Pokémon League / Ghetsis and the credits roll. They are kept here as
// canonical reference data but are NOT exported via `bwEncounterAreas` and
// therefore do not appear in the main-story BW UI. A future postgame
// rendering layer can consume `bwPostgameEncounterAreas` directly.
//
// Route 16 / Lostlorn Forest / Marvelous Bridge are unreachable in BW until
// the Marvelous Bridge is built after the credits, so they were incorrectly
// surfaced in the main-story list during BW Pass 4 and have been moved here
// for Pass 4 cleanup.
//
// ---------------------------------------------------------------------------

export const bwPostgameEncounterAreas: BwEncounterArea[] = [
  {
    locationId: 'bw-route-16',
    displayName: 'Route 16',
    encounters: [
      // Regular grass
      encounter('Liepard', ['Dark'], 'grass'),
      encounter('Trubbish', ['Poison'], 'grass'),
      encounter('Minccino', ['Normal'], 'grass'),
      encounter('Gothita', ['Psychic'], 'grass', 'Black', 'Black-exclusive grass encounter.'),
      encounter('Solosis', ['Psychic'], 'grass', 'White', 'White-exclusive grass encounter.'),
      // Dark grass
      darkGrass('Liepard', ['Dark']),
      darkGrass('Trubbish', ['Poison']),
      darkGrass('Minccino', ['Normal']),
      darkGrass('Gothita', ['Psychic'], 'Black', 'Black-exclusive dark-grass encounter.'),
      darkGrass('Solosis', ['Psychic'], 'White', 'White-exclusive dark-grass encounter.'),
      // Rustling grass
      rustling('Audino', ['Normal']),
      rustling('Cinccino', ['Normal'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rare 10% rustling-grass encounter.'),
      // Swarm (Pineco — Route 16 specific)
      encounter('Pineco', ['Bug'], 'grass', 'Both', 'Swarm-only encounter (40% rate during an active swarm day).', { condition: 'Swarm' }),
    ],
    notes: [
      'Route between the Marvelous Bridge and Lostlorn Forest. POSTGAME ONLY in Black/White — accessible only after the Marvelous Bridge is built post-credits. Verified per Bulbapedia (Unova Route 16 page).',
      'Encounter table closely mirrors Route 5 with Pineco swap replacing Smeargle as the swarm slot.',
    ],
  },
  {
    locationId: 'bw-lostlorn-forest',
    displayName: 'Lostlorn Forest',
    encounters: [
      // Regular grass
      encounter('Tranquill', ['Normal', 'Flying'], 'grass'),
      encounter('Swadloon', ['Bug', 'Grass'], 'grass'),
      encounter('Venipede', ['Bug', 'Poison'], 'grass'),
      encounter('Cottonee', ['Grass'], 'grass', 'White', 'White-exclusive grass encounter.'),
      encounter('Petilil', ['Grass'], 'grass', 'Black', 'Black-exclusive grass encounter.'),
      // Dark grass
      darkGrass('Tranquill', ['Normal', 'Flying']),
      darkGrass('Swadloon', ['Bug', 'Grass']),
      darkGrass('Venipede', ['Bug', 'Poison']),
      darkGrass('Cottonee', ['Grass'], 'White', 'White-exclusive dark-grass encounter.'),
      darkGrass('Petilil', ['Grass'], 'Black', 'Black-exclusive dark-grass encounter.'),
      // Rustling grass — Audino majority, plus monkey trio and version-exclusive evolved grass mons
      rustling('Audino', ['Normal']),
      rustling('Pansage', ['Grass'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Pansear', ['Fire'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Panpour', ['Water'], 'Both', 'Rare 10% rustling-grass encounter.'),
      rustling('Unfezant', ['Normal', 'Flying'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Leavanny', ['Bug', 'Grass'], 'Both', 'Rare 5% rustling-grass encounter.'),
      rustling('Whimsicott', ['Grass'], 'White', 'Rare 5% rustling-grass encounter, White-exclusive.'),
      rustling('Lilligant', ['Grass'], 'Black', 'Rare 5% rustling-grass encounter, Black-exclusive.'),
      rustling('Emolga', ['Electric', 'Flying'], 'Both', 'Rare 10% rustling-grass encounter.'),
      // Surfing
      surf('Basculin', ['Water'], 'Black', 'Red-Striped form via Surf, Black-only.'),
      surf('Basculin', ['Water'], 'White', 'Blue-Striped form via Surf, White-only.'),
      // Fishing
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Black', 'Red-Striped form, Black-only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'White', 'Blue-Striped form, White-only.'),
    ],
    notes: [
      'Hidden forest accessible via Route 16. POSTGAME ONLY in Black/White — reachable only after the Marvelous Bridge is built post-credits. Verified per Bulbapedia (Lostlorn Forest page).',
      'The mysterious Zoroark NPC event (requires event Shiny Legendary Beast) is not encoded as an encounter — it is a distribution-gated event similar to the Castelia Zorua gift.',
      'TODO: Verify Heracross/Pinsir static availability in BW Lostlorn (some sources mention them via foreign-trainer overworld interaction).',
    ],
  },
  {
    locationId: 'bw-marvelous-bridge',
    displayName: 'Marvelous Bridge',
    encounters: [
      // Flying-Pokémon shadow ambush
      encounter('Swanna', ['Water', 'Flying'], 'special', 'Both', 'Bridge-shadow ambush encounter (100% rate) when a flying Pokémon\'s shadow passes overhead.', { condition: 'Bridge Shadow' }),
    ],
    notes: [
      'Bridge connecting Opelucid City to Route 15. POSTGAME ONLY in Black/White — opens only after defeating Ghetsis and the credits roll. Verified per Bulbapedia (Marvelous Bridge page).',
      'The Magikarp Salesman ($500) is not encoded as a wild encounter (it is a purchase event).',
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
 * method/rod/condition/version fields so the UI can render chips and future filters.
 */
export function getBwEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'Black' && gameVersion !== 'White') return {};

  return bwEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item): EncounterOption => ({
        species: item.species,
        types: item.types,
        method: item.method,
        version: item.version,
        surfMethod: item.method === 'surfing' || undefined,
        fishingMethod: item.method === 'fishing' || undefined,
        ...(item.rod ? { rod: item.rod } : {}),
        ...(item.condition ? { condition: item.condition } : {}),
        ...(typeof item.minLevel === 'number' ? { minLevel: item.minLevel } : {}),
        ...(typeof item.maxLevel === 'number' ? { maxLevel: item.maxLevel } : {}),
        ...(typeof item.rate === 'number' ? { rate: item.rate } : {}),
        ...(item.notes ? { notes: item.notes } : {}),
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
