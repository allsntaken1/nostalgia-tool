import type { EncounterOption } from '@/app/nuzlocke/data';
import type { PokemonType } from '@/app/nuzlocke/types';
import { usumRoutes } from './routes';

/**
 * USUM encounter schema. Same shape as the SM schema, intentionally kept separate so each game
 * set diverges cleanly when canonical data is added. USUM has different encounter slots, added
 * Totems, Ultra Beasts available in the main story, and Ultra Warp Ride mechanics.
 *
 * Pass 1 (this file) populates verified canonical Melemele Island + early Akala encounter tables.
 * Locations beyond that get auto-generated empty skeleton entries pending future passes.
 */

export type UsumVersion = 'Ultra Sun' | 'Ultra Moon' | 'Both';
export type UsumEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'legendary' | 'special';
export type UsumRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

export type UsumEncounter = {
  species: string;
  types: PokemonType[];
  method: UsumEncounterMethod;
  version: UsumVersion;
  notes?: string;
  rod?: UsumRod;
  condition?: string;
};

export type UsumEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: UsumEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: UsumEncounterMethod,
  version: UsumVersion = 'Both',
  notes?: string,
  extras: { rod?: UsumRod; condition?: string } = {},
): UsumEncounter => ({ species, types, method, version, notes, ...extras });

const surf = (species: string, types: PokemonType[], version: UsumVersion = 'Both', notes?: string): UsumEncounter =>
  encounter(species, types, 'surfing', version, notes);

const fish = (
  species: string,
  types: PokemonType[],
  version: UsumVersion = 'Both',
  bubbling: boolean = false,
  notes?: string,
): UsumEncounter => encounter(species, types, 'fishing', version, notes, { condition: bubbling ? 'Bubbling Spot' : undefined });

const ambush = (species: string, types: PokemonType[], version: UsumVersion = 'Both', notes?: string): UsumEncounter =>
  encounter(species, types, 'special', version, notes, { condition: 'Rustling Grass' });

const berryPile = (species: string, types: PokemonType[], version: UsumVersion = 'Both', notes?: string): UsumEncounter =>
  encounter(species, types, 'special', version, notes, { condition: 'Berry Pile' });

// =============================================================================================
// USUM Pass 1 — Melemele Island + early Akala canonical data (Bulbapedia raw wikitext verified).
// =============================================================================================

const populatedAreas: UsumEncounterArea[] = [
  {
    locationId: 'alola-iki-town',
    displayName: 'Iki Town',
    encounters: [
      encounter('Rowlet', ['Grass', 'Flying'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
      encounter('Litten', ['Fire'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
      encounter('Popplio', ['Water'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
    ],
    notes: ['Iki Town has no wild encounter tables — starter-receiving and Kahuna trial venue.'],
  },
  {
    locationId: 'alola-route-1',
    displayName: 'Route 1',
    encounters: [
      // Grass — USUM has Buneary and Rockruff additions vs SM. No version exclusives.
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass'),
      encounter('Pichu', ['Electric'], 'grass'),
      encounter('Buneary', ['Normal'], 'grass', 'Both', 'USUM-new vs SM.'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass', 'Both', 'Blocked southern path (Lv 11-14).'),
      encounter('Munchlax', ['Normal'], 'grass', 'Both', 'Blocked southern path (Lv 11-14).'),
      encounter('Rockruff', ['Rock'], 'grass', 'Both', 'USUM-new blocked-path encounter (Lv 11-14).'),
    ],
    notes: ['USUM additions vs SM: Buneary (early fields), Rockruff (south path). Pikipek tutorial encounter still present.'],
  },
  {
    locationId: 'alola-hauoli-outskirts',
    displayName: "Hau'oli Outskirts",
    encounters: [
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Inkay', ['Dark', 'Psychic'], 'grass', 'Both', 'USUM-exclusive Hauoli Outskirts addition.'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Mantyke', ['Water', 'Flying'], 'Both', 'USUM-new surf encounter.'),
      surf('Finneon', ['Water']),
    ],
    notes: ['USUM additions vs SM: Inkay (grass), Mantyke (surf).'],
  },
  {
    locationId: 'alola-hauoli-city',
    displayName: "Hau'oli City",
    encounters: [
      // Shopping District grass — USUM adds Mime Jr. and Furfrou, drops Pichu/Yungoos vs SM.
      encounter('Alolan Meowth', ['Dark'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Magnemite', ['Electric', 'Steel'], 'grass'),
      encounter('Alolan Grimer', ['Poison', 'Dark'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Mime Jr.', ['Psychic', 'Fairy'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Furfrou', ['Normal'], 'grass', 'Both', 'USUM-new grass species.'),
      // Surfing.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Mantyke', ['Water', 'Flying'], 'Both', 'USUM-new surf species.'),
      encounter('Magearna', ['Steel', 'Fairy'], 'static', 'Both', 'Postgame gift via QR Code activation; cannot be Shiny.'),
    ],
    notes: ["Trainers' School folded into Hau'oli City; no separate wild encounter table.", 'USUM grass replaces SM Pichu/Yungoos with Mime Jr./Furfrou.'],
  },
  {
    locationId: 'alola-route-2',
    displayName: 'Route 2',
    encounters: [
      // Grass — USUM adds Ekans, Makuhita, Dunsparce (ambush), Furfrou vs SM.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Ekans', ['Poison'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass', 'Both', 'Northern fields.'),
      encounter('Alolan Meowth', ['Dark'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Growlithe', ['Fire'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Smeargle', ['Normal'], 'grass'),
      encounter('Makuhita', ['Fighting'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Furfrou', ['Normal'], 'grass', 'Both', 'USUM-new grass species (southernmost fields).'),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      // Rustling grass ambush.
      ambush('Ekans', ['Poison'], 'Both', 'USUM-new ambush species.'),
      ambush('Drowzee', ['Psychic'], 'Both', 'USUM-new ambush species.'),
      ambush('Dunsparce', ['Normal'], 'Both', 'USUM-new rustling-grass species.'),
      ambush('Makuhita', ['Fighting']),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Machop', ['Fighting'], 'special', 'Both', 'In-game trade — receive Machop for a Spearow.', { condition: 'In-game Trade' }),
    ],
    notes: ['USUM additions vs SM: Ekans/Makuhita/Furfrou (grass), Dunsparce/Ekans/Drowzee (rustling).', 'Island Scan and SOS species omitted — schema TODOs.'],
  },
  {
    locationId: 'alola-verdant-cavern',
    displayName: 'Verdant Cavern',
    encounters: [
      // Cave — USUM adds Noibat.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'cave'),
      encounter('Noibat', ['Flying', 'Dragon'], 'cave', 'Both', 'USUM-new cave species.'),
      // Dirt-cloud ambush — version-exclusive.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'special', 'Ultra Moon', 'Dirt-cloud ambush, Ultra Moon-only.', { condition: 'Dirt Cloud Ambush' }),
      encounter('Yungoos', ['Normal'], 'special', 'Ultra Sun', 'Dirt-cloud ambush, Ultra Sun-only.', { condition: 'Dirt Cloud Ambush' }),
    ],
    notes: ['Totem Gumshoos (Ultra Sun) / Totem Alolan Raticate (Ultra Moon) handled as boss data.', 'Cave gains Noibat in USUM vs SM.'],
  },
  {
    locationId: 'alola-route-3',
    displayName: 'Route 3',
    encounters: [
      // Grass — USUM drops Delibird/Yungoos/A.Rattata vs SM, adds Hawlucha.
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Mankey', ['Fighting'], 'grass'),
      encounter('Hawlucha', ['Fighting', 'Flying'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
      encounter('Bagon', ['Dragon'], 'grass', 'Both', 'South-of-bridge field only; rare 1% spawn. SOS calls Salamence (not modeled).'),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: [
      'Shadow-ambush encounters (Spearow + Sun-exclusive Rufflet / Moon-exclusive Vullaby) omitted — schema/SOS TODO.',
      'Island Scan (Charmander) omitted — Island Scan is TODO.',
    ],
  },
  {
    locationId: 'alola-melemele-meadow',
    displayName: 'Melemele Meadow',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Butterfree', ['Bug', 'Flying'], 'grass', 'Both', 'Rare 1%.'),
      encounter('Cottonee', ['Grass', 'Fairy'], 'grass'),
      encounter('Petilil', ['Grass'], 'grass', 'Ultra Moon', 'Ultra Moon-exclusive red-flower spawn.'),
      encounter('Oricorio', ['Electric', 'Flying'], 'grass', 'Both', "Pom-Pom Style — Melemele form."),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
      encounter('Flabébé', ['Fairy'], 'grass', 'Both', 'USUM-new Yellow Flower form.'),
    ],
    notes: ['Petilil is Ultra Moon-only at Melemele Meadow.', 'Flabébé added in USUM vs SM. Encounter rates differ from SM (Cottonee/Cutiefly reduced to 20%).'],
  },
  {
    locationId: 'alola-kalae-bay',
    displayName: "Kala'e Bay",
    encounters: [
      // Grass.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Bagon', ['Dragon'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      // Surf — USUM adds Mantyke.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Mantyke', ['Water', 'Flying'], 'Both', 'USUM-new surf species.'),
      // Fishing — USUM table differs from SM (adds Remoraid).
      fish('Shellder', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Remoraid', ['Water'], 'Both', false, 'USUM-new fishing species.'),
      fish('Wishiwashi', ['Water']),
      fish('Shellder', ['Water'], 'Both', true),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Remoraid', ['Water'], 'Both', true, 'Bubbling Spot Remoraid — USUM-new.'),
      fish('Wishiwashi', ['Water'], 'Both', true),
    ],
    notes: ['USUM additions vs SM: Mantyke (surf), Remoraid (fishing + bubbling).', 'Island Scan (Horsea Wednesday) omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-ten-carat-hill',
    displayName: 'Ten Carat Hill',
    encounters: [
      // Cave — USUM swaps Roggenrola distribution and adds Mawile.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Psyduck', ['Water'], 'cave', 'Both', 'USUM-new cave species.'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'Both', 'USUM-new cave species.'),
      encounter('Roggenrola', ['Rock'], 'cave'),
      encounter('Carbink', ['Rock', 'Fairy'], 'cave'),
      // Surf inside the ocean cave.
      surf('Zubat', ['Poison', 'Flying'], 'Both', 'USUM ocean-cave surf — Zubat dominates here at 95%.'),
      surf('Psyduck', ['Water']),
      // Farthest Hollow — same species as SM.
      encounter('Machop', ['Fighting'], 'grass', 'Both', 'Farthest Hollow.'),
      encounter('Spinda', ['Normal'], 'grass', 'Both', 'Farthest Hollow.'),
      encounter('Roggenrola', ['Rock'], 'grass', 'Both', 'Farthest Hollow.'),
      encounter('Carbink', ['Rock', 'Fairy'], 'grass', 'Both', 'Farthest Hollow.'),
      encounter('Rockruff', ['Rock'], 'grass', 'Both', 'Farthest Hollow.'),
    ],
    notes: ['USUM cave additions vs SM: Psyduck, Mawile. Surf table changed dramatically (Zubat-dominant).'],
  },
  {
    locationId: 'alola-pikachu-valley',
    displayName: 'Pikachu Valley',
    encounters: [
      encounter('Pikachu', ['Electric'], 'gift', 'Both', 'Partner Cap Pikachu (Lv 21) via QR Code activation. Can be Shiny via a known glitch.'),
    ],
    notes: ['USUM-exclusive sidearea. No wild encounter table per Bulbapedia; only the Partner Cap Pikachu gift and the Pikashunium Z reward NPC.'],
  },
  {
    locationId: 'alola-heahea-city',
    displayName: 'Heahea City',
    encounters: [
      encounter('Pikachu', ['Electric'], 'gift', 'Both', 'Surfing Pikachu (Lv 40) from the Surf Association after high-scoring all four Mantine Surf courses. Knows Surf, holds Gold Bottle Cap.'),
    ],
    notes: ['USUM-only Surfing Pikachu gift via the Surf Association branch. No standard wild encounter table.'],
  },
  {
    locationId: 'alola-route-4',
    displayName: 'Route 4',
    encounters: [
      // Grass — same shared list as SM Route 4 per Bulbapedia.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Eevee', ['Normal'], 'grass'),
      encounter('Igglybuff', ['Normal', 'Fairy'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: ['USUM Route 4 grass table mirrors SM; trainer roster differs (extra Sightseer w/ Meowth).'],
  },
  {
    locationId: 'alola-paniola-town',
    displayName: 'Paniola Town',
    encounters: [
      // Fishing-only. USUM rates shift (Barboach 10% normal, 60% bubbling — much higher than SM 1%/50%).
      fish('Magikarp', ['Water']),
      fish('Barboach', ['Water', 'Ground'], 'Both', false, 'USUM normal-fishing rate raised to 10% vs SM 1%.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Barboach', ['Water', 'Ground'], 'Both', true, 'USUM Bubbling Spot — 60%.'),
      encounter('Eevee', ['Normal'], 'gift', 'Both', 'Egg from the Pokémon Nursery attendant.'),
    ],
    notes: ['Fishing-only village; rate changes vs SM noted.'],
  },
  {
    locationId: 'alola-paniola-ranch',
    displayName: 'Paniola Ranch',
    encounters: [
      // USUM adds Mareep vs SM.
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Miltank', ['Normal'], 'grass'),
      encounter('Mareep', ['Electric'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      encounter('Eevee', ['Normal'], 'gift', 'Both', 'Egg from the Nursery lady (hatches at Lv 1).'),
    ],
    notes: ['USUM addition vs SM: Mareep (30% grass).'],
  },

  // =========================================================================================
  // USUM Pass 2 — Akala Island progression (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-route-5',
    displayName: 'Route 5',
    encounters: [
      // Southern grass.
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Butterfree', ['Bug', 'Flying'], 'grass', 'Both', 'Southern half, rare 1%.'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Fomantis', ['Grass'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      // Northern grass + dirt-cloud ambush.
      encounter('Bonsly', ['Rock'], 'grass', 'Both', 'Northern half.'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass', 'Both', 'Northern half.'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Northern half dirt-cloud ambush.', { condition: 'Dirt Cloud Ambush' }),
    ],
    notes: ['Encounter list matches SM; trainer roster differs in USUM. Island Scan (Grovyle Fri) omitted.'],
  },
  {
    locationId: 'alola-brooklet-hill',
    displayName: 'Brooklet Hill',
    encounters: [
      // Brooklet Hill proper grass.
      encounter('Paras', ['Bug', 'Grass'], 'grass'),
      encounter('Psyduck', ['Water'], 'grass'),
      encounter('Poliwag', ['Water'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Surskit', ['Bug', 'Water'], 'grass'),
      encounter('Dewpider', ['Water', 'Bug'], 'grass'),
      encounter('Morelull', ['Grass', 'Fairy'], 'grass'),
      // Brooklet Hill proper surf.
      surf('Psyduck', ['Water']),
      surf('Poliwag', ['Water']),
      surf('Surskit', ['Bug', 'Water']),
      surf('Dewpider', ['Water', 'Bug']),
      // Brooklet Hill proper fishing — USUM adds Basculin.
      fish('Goldeen', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Feebas', ['Water']),
      fish('Basculin', ['Water'], 'Both', false, 'USUM-new fishing species.'),
      fish('Goldeen', ['Water'], 'Both', true),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Feebas', ['Water'], 'Both', true),
      fish('Basculin', ['Water'], 'Both', true, 'USUM-new Bubbling Spot species.'),
      // Totem's Den (post-trial).
      surf('Tentacool', ['Water', 'Poison'], 'Both', "Totem's Den area surf."),
      surf('Wingull', ['Water', 'Flying'], 'Both', "Totem's Den area surf."),
      surf('Finneon', ['Water'], 'Both', "Totem's Den area surf."),
      fish('Alomomola', ['Water'], 'Both', false, "Totem's Den area fishing."),
      fish('Wishiwashi', ['Water'], 'Both', false, "Totem's Den area fishing."),
    ],
    notes: ['Totem Araquanid replaces SM Totem Wishiwashi — modeled as boss data.', 'USUM adds Basculin to fishing pool.', "Totem's Den has its own surf/fish tables accessible after trial completion."],
  },
  {
    locationId: 'alola-route-6',
    displayName: 'Route 6',
    encounters: [
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Eevee', ['Normal'], 'grass'),
      encounter('Igglybuff', ['Normal', 'Fairy'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      encounter('Oricorio', ['Psychic', 'Flying'], 'grass', 'Both', "Pa'u Style — southern fields only."),
    ],
    notes: ['USUM Route 6 drops the SM Sun/Moon version splits; species are unified per Bulbapedia.', 'Island Scan (Ralts) omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-royal-avenue',
    displayName: 'Royal Avenue',
    encounters: [
      encounter('Barboach', ['Water', 'Ground'], 'special', 'Both', 'In-game trade — Barboach "Babo" (Lv 21, holds Pecha Berry) for a Tentacool.', { condition: 'In-game Trade' }),
    ],
    notes: ['No wild encounter table for Royal Avenue per Bulbapedia.'],
  },
  {
    locationId: 'alola-route-7',
    displayName: 'Route 7',
    encounters: [
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Dirt-cloud ambush.', { condition: 'Dirt Cloud Ambush' }),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Pyukumuku', ['Water']),
      // Fishing — USUM rates differ from SM significantly.
      fish('Staryu', ['Water'], 'Both', false, 'USUM normal fishing 5% (vs SM 1%).'),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Staryu', ['Water'], 'Both', true, 'USUM Bubbling Spot Staryu — 35%.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
    ],
    notes: ['USUM fishing rates differ markedly from SM.', 'Island Scan (Spheal Mon, knows Belly Drum in USUM vs Aqua Ring in SM) omitted.'],
  },
  {
    locationId: 'alola-wela-volcano-park',
    displayName: 'Wela Volcano Park',
    encounters: [
      encounter('Cubone', ['Ground'], 'grass'),
      encounter('Kangaskhan', ['Normal'], 'grass', 'Both', 'Rare 1%.'),
      encounter('Magby', ['Fire'], 'grass'),
      encounter('Fletchling', ['Normal', 'Flying'], 'grass'),
      encounter('Salandit', ['Poison', 'Fire'], 'grass'),
    ],
    notes: [
      'USUM Totem is Alolan Marowak in both versions (SM split this Sun/Moon-only). Modeled as boss data.',
    ],
  },
  {
    locationId: 'alola-route-8',
    displayName: 'Route 8',
    encounters: [
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Fletchling', ['Normal', 'Flying'], 'grass', 'Both', 'USUM uses Fletchling here, not Fletchinder as in SM.'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Salandit', ['Poison', 'Fire'], 'grass'),
      encounter('Stufful', ['Normal', 'Fighting'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Wimpod', ['Bug', 'Water'], 'special', 'Both', 'Wimpod ambush — flees on approach.', { condition: 'Wimpod Ambush' }),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Mantyke', ['Water', 'Flying'], 'Both', 'USUM-new surf species.'),
      fish('Magikarp', ['Water']),
      fish('Chinchou', ['Water', 'Electric']),
      fish('Remoraid', ['Water'], 'Both', false, 'USUM-new fishing species.'),
      fish('Wishiwashi', ['Water']),
    ],
    notes: [
      'USUM swaps Fletchinder → Fletchling, adds Mantyke (surf) and Remoraid (fishing).',
      'Island Scan (Combusken in USUM vs Luxio in SM) omitted.',
    ],
  },
  {
    locationId: 'alola-lush-jungle',
    displayName: 'Lush Jungle',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Paras', ['Bug', 'Grass'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Fomantis', ['Grass'], 'grass'),
      encounter('Morelull', ['Grass', 'Fairy'], 'grass'),
      encounter('Steenee', ['Grass'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Comfey', ['Fairy'], 'grass'),
    ],
    notes: [
      'Totem Lurantis modeled as boss data.',
      'USUM main-area grass adds Steenee.',
      'USUM trial structure differs from SM (item-selection mechanic).',
      'USUM Sun/Moon-style Parasect/Shiinotic/Passimian/Oranguru splits are not confirmed identical — left out of grass list to avoid contamination.',
    ],
  },
  {
    locationId: 'alola-digletts-tunnel',
    displayName: "Diglett's Tunnel",
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'cave'),
      encounter('Larvitar', ['Rock', 'Ground'], 'cave', 'Both', 'USUM-exclusive 10% cave encounter.'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Dirt-cloud ambush.', { condition: 'Dirt Cloud Ambush' }),
    ],
    notes: ['USUM addition vs SM: Larvitar in cave. Encounter levels +1 vs SM (20-23 instead of 19-22).'],
  },
  {
    locationId: 'alola-konikoni-city',
    displayName: 'Konikoni City',
    encounters: [
      encounter('Poliwhirl', ['Water'], 'special', 'Both', 'In-game trade — Poliwhirl "Whirly" (Lv 22) for a Zubat.', { condition: 'In-game Trade' }),
    ],
    notes: ['No wild encounter table for Konikoni City per Bulbapedia.', 'Ditto Five mini-event added in USUM (not modeled as encounters).'],
  },
  {
    locationId: 'alola-memorial-hill',
    displayName: 'Memorial Hill',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Gastly', ['Ghost', 'Poison'], 'grass'),
      encounter('Phantump', ['Ghost', 'Grass'], 'grass'),
    ],
    notes: ['Species identical to SM; USUM bumps levels 21-24 (vs SM 20-23) and adds Zubat/Golbat SOS-ally chains (not modeled).'],
  },
  {
    locationId: 'alola-akala-outskirts',
    displayName: 'Akala Outskirts',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Nosepass', ['Rock'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Stufful', ['Normal', 'Fighting'], 'grass'),
      encounter('Natu', ['Psychic', 'Flying'], 'grass', 'Both', 'USUM-new grass species.'),
    ],
    notes: ['USUM addition vs SM: Natu (20% grass). Gumshoos/Stufful rate shifts in USUM.'],
  },
  {
    locationId: 'alola-hano-grand-resort',
    displayName: 'Hano Grand Resort',
    encounters: [],
    notes: ['No wild encounter table for Hano Grand Resort per Bulbapedia.'],
  },

  // =========================================================================================
  // USUM Pass 3 — Early/Mid Ula'ula Island progression (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-malie-city',
    displayName: 'Malie City',
    encounters: [
      // Outer Cape grass — USUM swaps in Minccino, removes A.Raticate/Gumshoos.
      encounter('Magnemite', ['Electric', 'Steel'], 'grass'),
      encounter('Alolan Grimer', ['Poison', 'Dark'], 'grass'),
      encounter('Trubbish', ['Poison'], 'grass'),
      encounter('Minccino', ['Normal'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Happiny', ['Normal'], 'special', 'Both', 'In-game trade at Sushi High Roller — receive Happiny for a Pancham.', { condition: 'In-game Trade' }),
    ],
    notes: ['USUM Outer Cape grass replaces SM Raticate/Gumshoos with Minccino; levels bumped to 25-28.'],
  },
  {
    locationId: 'alola-route-10',
    displayName: 'Route 10',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'special', 'Both', 'Rustling-tree ambush.', { condition: 'Rustling Tree' }),
      encounter('Pineco', ['Bug'], 'special', 'Both', 'USUM-new rustling-tree species.', { condition: 'Rustling Tree' }),
      encounter('Skarmory', ['Steel', 'Flying'], 'special', 'Both', 'Rustling-tree ambush.', { condition: 'Rustling Tree' }),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: ['USUM adds Pineco to rustling-tree ambush. Encounter levels bumped to 26-29. Island Scan (Pidgeot Thu) omitted.'],
  },
  {
    locationId: 'alola-mount-hokulani',
    displayName: 'Mount Hokulani',
    encounters: [
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Cleffa', ['Fairy'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Elekid', ['Electric'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Beldum', ['Steel', 'Psychic'], 'grass'),
      encounter('Elgyem', ['Psychic'], 'grass', 'Both', 'USUM-new grass species.'),
      encounter('Minior', ['Rock', 'Flying'], 'grass'),
    ],
    notes: [
      'USUM Totem is Togedemaru (replaces SM Vikavolt). Modeled as boss data.',
      'USUM additions vs SM: Elekid, Elgyem.',
    ],
  },
  {
    locationId: 'alola-route-11',
    displayName: 'Route 11',
    encounters: [
      // USUM replaces Alolan Raticate with nothing; promotes Paras→Parasect, Morelull→Shiinotic.
      encounter('Parasect', ['Bug', 'Grass'], 'grass', 'Both', 'USUM replaces SM Paras with evolved Parasect.'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Shiinotic', ['Grass', 'Fairy'], 'grass', 'Both', 'USUM replaces SM Morelull with evolved Shiinotic.'),
      encounter('Komala', ['Normal'], 'grass'),
    ],
    notes: ['USUM removes Alolan Raticate; promotes Paras→Parasect and Morelull→Shiinotic; Komala rate raised 10%→30%.', 'Island Scan (Monferno Fri in USUM, was Vigoroth in SM) omitted.'],
  },
  {
    locationId: 'alola-route-12',
    displayName: 'Route 12',
    encounters: [
      // USUM significantly different from SM: Geodude/Elekid removed, replaced with Graveler + version exclusives.
      encounter('Alolan Graveler', ['Rock', 'Electric'], 'grass', 'Both', 'USUM swap (SM had Geodude).'),
      encounter('Houndoom', ['Dark', 'Fire'], 'grass', 'Ultra Sun', 'Ultra Sun-exclusive 20%.'),
      encounter('Manectric', ['Electric'], 'grass', 'Ultra Moon', 'Ultra Moon-exclusive 20%.'),
      encounter('Torkoal', ['Fire'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
    ],
    notes: ['USUM Route 12 introduces Sun/Moon version split via Houndoom/Manectric. SM had no version exclusives here.'],
  },
  {
    locationId: 'alola-blush-mountain',
    displayName: 'Blush Mountain',
    encounters: [
      encounter('Alolan Graveler', ['Rock', 'Electric'], 'grass', 'Both', 'USUM swap (SM had Alolan Geodude).'),
      encounter('Elekid', ['Electric'], 'grass'),
      encounter('Torkoal', ['Fire'], 'grass'),
      encounter('Charjabug', ['Bug', 'Electric'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      encounter('Turtonator', ['Fire', 'Dragon'], 'grass'),
      encounter('Togedemaru', ['Electric', 'Steel'], 'grass', 'Both', 'USUM rate reduced vs SM.'),
      encounter('Dedenne', ['Electric', 'Fairy'], 'grass', 'Both', 'USUM-new grass species.'),
    ],
    notes: ['USUM swaps Geodude→Graveler and adds Dedenne. Magnetic Field area (Magneton/Nosepass/Charjabug evolve here).', 'Island Scan (Rhyhorn, knows Guard Split in USUM vs Skull Bash in SM) omitted.'],
  },
  {
    locationId: 'alola-route-13',
    displayName: 'Route 13',
    encounters: [
      // Fishing-only — USUM rate shifts.
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', false, 'USUM 5% (vs SM 1%).'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true, 'USUM Bubbling Spot 25%.'),
    ],
    notes: ['Fishing-only route. USUM rates differ from SM; bubbling-spot levels can reach Lv 38.'],
  },
  {
    locationId: 'alola-tapu-village',
    displayName: 'Tapu Village',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Alolan Sandshrew', ['Ice', 'Steel'], 'grass', 'Ultra Sun', 'Ultra Sun-exclusive.'),
      encounter('Alolan Vulpix', ['Ice'], 'grass', 'Ultra Moon', 'Ultra Moon-exclusive.'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Absol', ['Dark'], 'grass'),
      encounter('Snorunt', ['Ice'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Phantump', ['Ghost', 'Grass'], 'special', 'Both', 'USUM in-game trade — receive Phantump (evolves into Trevenant on trade).', { condition: 'In-game Trade' }),
    ],
    notes: ['USUM replaces SM Alolan Graveler trade with Phantump → Trevenant trade.', 'Weather SOS allies (Vanillite hail, Castform rain/sandstorm) omitted — SOS TODO.', 'Island Scan (Swinub Mon) omitted.'],
  },
  {
    locationId: 'alola-route-14',
    displayName: 'Route 14',
    encounters: [
      surf('Tentacruel', ['Water', 'Poison'], 'Both', 'USUM uses Tentacruel here, not Tentacool.'),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Frillish', ['Water', 'Ghost'], 'Both', 'USUM-new surf species.'),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic']),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true),
    ],
    notes: ['USUM adds Frillish to surf and swaps Tentacool→Tentacruel. No grass encounters.'],
  },
  {
    locationId: 'alola-ulaula-meadow',
    displayName: "Ula'ula Meadow",
    encounters: [
      // USUM removes SM Sun/Moon version split for Cottonee/Petilil — both appear in both versions.
      encounter('Cottonee', ['Grass', 'Fairy'], 'grass', 'Both', 'USUM removes SM Sun-only restriction.'),
      encounter('Petilil', ['Grass'], 'grass', 'Both', 'USUM removes SM Moon-only restriction.'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Oricorio', ['Fire', 'Flying'], 'grass', 'Both', 'Baile Style — Ula\'ula form.'),
      encounter('Ribombee', ['Bug', 'Fairy'], 'grass'),
      encounter('Floette', ['Fairy'], 'grass', 'Both', 'USUM-new — Red Flower form. Appears in both Red Flowers and Long Grass.'),
    ],
    notes: ['USUM merges Red Flowers + Long Grass tables; adds Floette and unifies Cottonee/Petilil across versions.'],
  },
  {
    locationId: 'alola-route-15',
    displayName: 'Route 15',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      surf('Tentacruel', ['Water', 'Poison'], 'Both', 'USUM uses Tentacruel here.'),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Clamperl', ['Water'], 'Both', false, 'USUM-new fishing species.'),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic']),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Clamperl', ['Water'], 'Both', true, 'USUM-new Bubbling Spot species.'),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true, 'USUM Bubbling Spot rate raised (35%).'),
    ],
    notes: ['USUM adds Clamperl to fishing pool; surf swaps Tentacool→Tentacruel.'],
  },
  {
    locationId: 'alola-route-16',
    displayName: 'Route 16',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Scraggy', ['Dark', 'Fighting'], 'grass', 'Both', 'USUM-new grass species (replaces a SM slot).'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Zygarde', ['Dragon', 'Ground'], 'gift', 'Both', "USUM Zygarde gift differs from SM: requires defeating Dexio's 10% Forme Zygarde at Resolution Cave first; then receive Zygarde + 40 cells from him."),
    ],
    notes: ['USUM addition vs SM: Scraggy in grass.', 'Zygarde acquisition flow differs from SM.'],
  },
];

const populatedIds = new Set(populatedAreas.map((a) => a.locationId));

const stubAreas: UsumEncounterArea[] = (Array.isArray(usumRoutes) ? usumRoutes : [])
  .filter((route) => !populatedIds.has(route.id))
  .map((route) => ({
    locationId: route.id,
    displayName: route.displayName,
    encounters: [],
    notes: ['TODO: Populate canonical Ultra Sun / Ultra Moon encounter data for this location.'],
  }));

export const usumEncounterAreas: UsumEncounterArea[] = [...populatedAreas, ...stubAreas];

export const usumEncounterNotes = [
  'Schema-mismatch flags: SOS chains, Island Scan, Totem Pokémon + allies, version-exclusives, day/night, fishing bubbles, ambushes, gifts, static legendaries, Ultra Warp Ride encounters.',
  'Mantine Surf, Festival Plaza, and Team Rainbow Rocket events are NOT main-story encounter content and are out of scope.',
  'Zygarde cells are not Pokémon encounters and are intentionally not encoded as encounters.',
  'USUM Pass 1 (Melemele + early Akala) is the first canonical population; remaining islands and Ultra Space are still empty stubs.',
];

export function getUsumEncounterOptions(): Record<string, EncounterOption[]> {
  return usumEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const safeList = Array.isArray(area.encounters) ? area.encounters : [];
    acc[area.displayName] = safeList.map((item): EncounterOption => ({
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

/** Game-version-aware variant — filters Ultra Sun / Ultra Moon version-exclusive rows. */
export function getUsumEncounterOptionsForGame(game: 'Ultra Sun' | 'Ultra Moon'): Record<string, EncounterOption[]> {
  return usumEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const safeList = Array.isArray(area.encounters) ? area.encounters : [];
    acc[area.displayName] = safeList
      .filter((item) => item.version === 'Both' || item.version === game)
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
