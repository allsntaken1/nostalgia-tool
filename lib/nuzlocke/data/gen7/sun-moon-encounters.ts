import type { EncounterOption } from '@/app/nuzlocke/data';
import type { PokemonType } from '@/app/nuzlocke/types';
import { smRoutes } from './routes';

/**
 * Sun/Moon encounter schema. Mirrors the structure used by gen4/HGSS and gen6/XY so future
 * fill-in passes can adopt the same conventions:
 *   - method: 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'legendary' | 'special'
 *   - rod: 'Old Rod' | 'Good Rod' | 'Super Rod' (kept for parity — Alola fishing uses bubbling
 *     spots in canon, encoded via `condition: 'Bubbling Spot'`)
 *   - condition: free-text label for SOS / Island Scan / Totem / day/night / bubble / ambush /
 *     berry-pile, etc.
 *
 * Pass 1 (this file) populates verified canonical Melemele Island encounter tables only.
 * Locations beyond Melemele get auto-generated empty skeleton entries pending future passes.
 */

export type SmVersion = 'Sun' | 'Moon' | 'Both';
export type SmEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'legendary' | 'special';
export type SmRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

export type SmEncounter = {
  species: string;
  types: PokemonType[];
  method: SmEncounterMethod;
  version: SmVersion;
  notes?: string;
  rod?: SmRod;
  condition?: string;
};

export type SmEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: SmEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: SmEncounterMethod,
  version: SmVersion = 'Both',
  notes?: string,
  extras: { rod?: SmRod; condition?: string } = {},
): SmEncounter => ({ species, types, method, version, notes, ...extras });

const surf = (species: string, types: PokemonType[], version: SmVersion = 'Both', notes?: string): SmEncounter =>
  encounter(species, types, 'surfing', version, notes);

/** Alola fishing — "Bubbling Spot" is the rare-spot variant of normal fishing tiles. */
const fish = (
  species: string,
  types: PokemonType[],
  version: SmVersion = 'Both',
  bubbling: boolean = false,
  notes?: string,
): SmEncounter => encounter(species, types, 'fishing', version, notes, { condition: bubbling ? 'Bubbling Spot' : undefined });

const ambush = (
  species: string,
  types: PokemonType[],
  version: SmVersion = 'Both',
  notes?: string,
): SmEncounter => encounter(species, types, 'special', version, notes, { condition: 'Rustling Grass' });

const berryPile = (
  species: string,
  types: PokemonType[],
  version: SmVersion = 'Both',
  notes?: string,
): SmEncounter => encounter(species, types, 'special', version, notes, { condition: 'Berry Pile' });

// =============================================================================================
// Melemele Island — Pass 1 canonical data (Bulbapedia raw wikitext verified).
// =============================================================================================

const populatedAreas: SmEncounterArea[] = [
  {
    locationId: 'alola-iki-town',
    displayName: 'Iki Town',
    encounters: [
      encounter('Rowlet', ['Grass', 'Flying'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
      encounter('Litten', ['Fire'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
      encounter('Popplio', ['Water'], 'gift', 'Both', 'Starter gift from Professor Kukui (Lv 5).'),
    ],
    notes: ['Iki Town has no wild encounter tables — it is the starter-receiving and Kahuna trial venue.'],
  },
  {
    locationId: 'alola-route-1',
    displayName: 'Route 1',
    encounters: [
      // Grass — union of all Route 1 grass tables (fields differ slightly per Bulbapedia).
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass'),
      encounter('Pichu', ['Electric'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass', 'Both', 'Path south of Iki Town (blocked by rocks until later in story).'),
      encounter('Munchlax', ['Normal'], 'grass', 'Both', 'Path south of Iki Town (blocked by rocks until later).'),
      encounter('Pikipek', ['Normal', 'Flying'], 'static', 'Both', 'Mandatory tutorial Pikipek at Lv 3 immediately after the route tutorial.'),
    ],
    notes: ['Grass fields differ slightly within Route 1 (east bay vs. near Iki Town vs. south path); the union is shown.', 'Per Bulbapedia, Route 1 has no Sun/Moon version exclusives.'],
  },
  {
    locationId: 'alola-hauoli-outskirts',
    displayName: "Hau'oli Outskirts",
    encounters: [
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
    ],
    notes: [],
  },
  {
    locationId: 'alola-hauoli-city',
    displayName: "Hau'oli City",
    encounters: [
      // Shopping District grass.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Alolan Meowth', ['Dark'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Magnemite', ['Electric', 'Steel'], 'grass'),
      encounter('Alolan Grimer', ['Poison', 'Dark'], 'grass'),
      encounter('Pichu', ['Electric'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      // Beachfront surf.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      // Postgame static — QR Code Magearna.
      encounter('Magearna', ['Steel', 'Fairy'], 'static', 'Both', 'Postgame gift via QR Code activation; cannot be Shiny.'),
    ],
    notes: [
      "Trainers' School is folded into Hau'oli City — the school yard has trainer battles but no wild encounter table separate from the city's.",
      'Island Scan species (Klink, Thursdays only) intentionally omitted — Island Scan is TODO until schema represents the day-of-week mechanic.',
    ],
  },
  {
    locationId: 'alola-route-2',
    displayName: 'Route 2',
    encounters: [
      // Grass — union of southernmost and northernmost field tables.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Alolan Meowth', ['Dark'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Smeargle', ['Normal'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Growlithe', ['Fire'], 'grass'),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
      // Ambush (Rustling Grass) — canonical Alola ambush mechanic, schema-safe.
      ambush('Alolan Rattata', ['Dark', 'Normal']),
      ambush('Makuhita', ['Fighting']),
      ambush('Yungoos', ['Normal']),
      // Berry pile mechanic — 100% Crabrawler.
      berryPile('Crabrawler', ['Fighting']),
      // In-game trade — Machop for Spearow.
      encounter('Machop', ['Fighting'], 'special', 'Both', 'In-game trade — receive Machop (Lv 9) for a Spearow.', { condition: 'In-game Trade' }),
    ],
    notes: [
      'Hau\'oli Cemetery is a Route 2 subarea — currently not represented in the route catalog and intentionally not added this pass.',
      'Island Scan (Chikorita on Friday) and SOS-summoned species intentionally omitted — Island Scan + SOS are tracked as future TODOs.',
    ],
  },
  {
    locationId: 'alola-verdant-cavern',
    displayName: 'Verdant Cavern',
    encounters: [
      // Cave walking — shared between Sun and Moon.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'cave'),
    ],
    notes: [
      "Totem Gumshoos (Sun) / Totem Alolan Raticate (Moon) and their SOS-summoned allies are modeled as boss data — not encounter data — per the task convention.",
      'SOS ambush species (Yungoos in Sun, Alolan Rattata in Moon) intentionally omitted — SOS is a future TODO.',
    ],
  },
  {
    locationId: 'alola-route-3',
    displayName: 'Route 3',
    encounters: [
      // Grass — union of north/south of bridge.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Mankey', ['Fighting'], 'grass'),
      encounter('Delibird', ['Ice', 'Flying'], 'grass', 'Both', 'North-of-bridge fields only.'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
      encounter('Bagon', ['Dragon'], 'grass', 'Both', 'South-of-bridge field only; rare 1% spawn. SOS calls Salamence (not modeled).'),
      // Berry pile mechanic.
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: [
      'Shadow Ambush encounters (Spearow + Sun-exclusive Rufflet / Moon-exclusive Vullaby) intentionally omitted — Bulbapedia tags them as SOS/Ambush hybrid; awaiting schema clarity.',
      'Island Scan (Cyndaquil on Sunday) intentionally omitted — Island Scan is TODO.',
    ],
  },
  {
    locationId: 'alola-melemele-meadow',
    displayName: 'Melemele Meadow',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Butterfree', ['Bug', 'Flying'], 'grass', 'Both', 'Rare 1% spawn.'),
      encounter('Cottonee', ['Grass', 'Fairy'], 'grass'),
      encounter('Petilil', ['Grass'], 'grass', 'Moon', 'Moon-exclusive grass spawn (30%).'),
      encounter('Oricorio', ['Electric', 'Flying'], 'grass', 'Both', "Pom-Pom Style (the Melemele Meadow form of Oricorio)."),
      encounter('Cutiefly', ['Bug', 'Fairy'], 'grass'),
    ],
    notes: ['Petilil is Moon-exclusive at Melemele Meadow; Cottonee appears in both versions.'],
  },
  {
    locationId: 'alola-kalae-bay',
    displayName: "Kala'e Bay",
    encounters: [
      // Grass.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Bagon', ['Dragon'], 'grass', 'Both', 'Rare 10% grass spawn; SOS allies are Bagon/Shelgon (not modeled).'),
      encounter('Yungoos', ['Normal'], 'grass'),
      // Surf.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      // Fishing — normal tiles.
      fish('Shellder', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      // Fishing — Bubbling Spot (rare tile variant; same species pool with different rates per Bulbapedia).
      fish('Shellder', ['Water'], 'Both', true),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
    ],
    notes: [
      "Bubbling Spot fishing is encoded via condition: 'Bubbling Spot'.",
      'Island Scan (Horsea on a specific weekday) intentionally omitted — Island Scan is TODO.',
    ],
  },
  {
    locationId: 'alola-ten-carat-hill',
    displayName: 'Ten Carat Hill',
    encounters: [
      // Cave/walking — main interior.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'cave'),
      encounter('Roggenrola', ['Rock'], 'cave'),
      encounter('Carbink', ['Rock', 'Fairy'], 'cave'),
      // Surf in the ocean cave section.
      surf('Psyduck', ['Water']),
      // Farthest Hollow (deeper, grass-patch chamber).
      encounter('Machop', ['Fighting'], 'grass', 'Both', 'Farthest Hollow chamber.'),
      encounter('Spinda', ['Normal'], 'grass', 'Both', 'Farthest Hollow chamber.'),
      encounter('Roggenrola', ['Rock'], 'grass', 'Both', 'Farthest Hollow chamber.'),
      encounter('Carbink', ['Rock', 'Fairy'], 'grass', 'Both', 'Farthest Hollow chamber.'),
      encounter('Rockruff', ['Rock'], 'grass', 'Both', 'Farthest Hollow chamber.'),
    ],
    notes: ['Ten Carat Hill and Farthest Hollow share this entry; no Sun/Moon version exclusives per Bulbapedia.', 'Island Scan (Deino on Tuesday) intentionally omitted — Island Scan is TODO.'],
  },

  // =========================================================================================
  // Pass 2 — Akala Island canonical data (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-heahea-city',
    displayName: 'Heahea City',
    encounters: [],
    notes: ['No wild encounter table for Heahea City per Bulbapedia HGSS-style fact check. Only NPC events and shops here.'],
  },
  {
    locationId: 'alola-route-4',
    displayName: 'Route 4',
    encounters: [
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Eevee', ['Normal'], 'grass', 'Both', 'SOS allies are Espeon/Umbreon (not modeled).'),
      encounter('Igglybuff', ['Normal', 'Fairy'], 'grass', 'Both', 'SOS allies include Jigglypuff and Happiny (not modeled).'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: ['No version exclusives per Bulbapedia.', 'Island Scan (Venipede Thursday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-paniola-town',
    displayName: 'Paniola Town',
    encounters: [
      // Paniola Town is a fishing-only location per Bulbapedia HGSS-style note.
      fish('Magikarp', ['Water']),
      fish('Barboach', ['Water', 'Ground'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Barboach', ['Water', 'Ground'], 'Both', true, 'Bubbling Spot 50%.'),
      encounter('Eevee', ['Normal'], 'gift', 'Both', 'Egg from the Pokémon Nursery attendant.'),
    ],
    notes: ['No grass encounters; Paniola Town wild table is fishing-only per Bulbapedia.'],
  },
  {
    locationId: 'alola-paniola-ranch',
    displayName: 'Paniola Ranch',
    encounters: [
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Miltank', ['Normal'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
    ],
    notes: ['Tauros and Miltank can appear as SOS allies to each other (not modeled).'],
  },
  {
    locationId: 'alola-route-5',
    displayName: 'Route 5',
    encounters: [
      // Southern half grass (Lv 13-16).
      encounter('Caterpie', ['Bug'], 'grass', 'Both', 'Southern half grass.'),
      encounter('Metapod', ['Bug'], 'grass', 'Both', 'Southern half grass.'),
      encounter('Butterfree', ['Bug', 'Flying'], 'grass', 'Both', 'Southern half grass; rare 1%.'),
      encounter('Lillipup', ['Normal'], 'grass', 'Both', 'Southern half grass.'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass', 'Both', 'Southern half grass.'),
      encounter('Grubbin', ['Bug'], 'grass', 'Both', 'Southern half grass.'),
      encounter('Fomantis', ['Grass'], 'grass', 'Both', 'Southern half grass.'),
      berryPile('Crabrawler', ['Fighting']),
      // Northern half grass (Lv 18-21).
      encounter('Bonsly', ['Rock'], 'grass', 'Both', 'Northern half grass (post-Charizard Glide).'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass', 'Both', 'Northern half grass (post-Charizard Glide).'),
      // Northern half ambush (dirt clouds).
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Northern half dirt-cloud ambush.', { condition: 'Dirt Cloud Ambush' }),
    ],
    notes: ['No Sun/Moon version exclusives.', 'Island Scan (Bellsprout Friday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-brooklet-hill',
    displayName: 'Brooklet Hill',
    encounters: [
      // First field grass.
      encounter('Paras', ['Bug', 'Grass'], 'grass', 'Both', 'First field grass.'),
      encounter('Psyduck', ['Water'], 'grass'),
      encounter('Poliwag', ['Water'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Surskit', ['Bug', 'Water'], 'grass'),
      encounter('Lillipup', ['Normal'], 'grass', 'Both', 'First field grass.'),
      encounter('Dewpider', ['Water', 'Bug'], 'grass'),
      encounter('Morelull', ['Grass', 'Fairy'], 'grass', 'Both', 'First field grass.'),
      // Surfing.
      surf('Psyduck', ['Water']),
      surf('Poliwag', ['Water']),
      surf('Surskit', ['Bug', 'Water']),
      surf('Dewpider', ['Water', 'Bug']),
      // Fishing — normal.
      fish('Goldeen', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Feebas', ['Water'], 'Both', false, 'Rare normal fishing encounter.'),
      // Fishing — bubbling.
      fish('Goldeen', ['Water'], 'Both', true),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Feebas', ['Water'], 'Both', true, 'Bubbling Spot Feebas — 5%.'),
    ],
    notes: ['Totem Wishiwashi is modeled as boss data.', 'SOS allies for Totem (Wishiwashi solo / Alomomola) included in boss entry.'],
  },
  {
    locationId: 'alola-route-6',
    displayName: 'Route 6',
    encounters: [
      // Grass — note version-specific rate differences. Species appearing in only one version flagged.
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass', 'Moon', 'Moon-only on Route 6 per Bulbapedia.'),
      encounter('Eevee', ['Normal'], 'grass'),
      encounter('Igglybuff', ['Normal', 'Fairy'], 'grass', 'Sun', 'Sun-only on Route 6 per Bulbapedia.'),
      encounter('Lillipup', ['Normal'], 'grass'),
      encounter('Pikipek', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass', 'Sun', 'Sun-only on Route 6 per Bulbapedia.'),
      encounter('Grubbin', ['Bug'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      encounter('Oricorio', ['Psychic', 'Flying'], 'grass', 'Both', "Pa'u Style — the Akala-Island form."),
    ],
    notes: ['Route 6 has version-specific rate differences and version-exclusive species — split into Sun/Moon rows.', 'Island Scan (Gothita Sunday) intentionally omitted.'],
  },
  {
    locationId: 'alola-royal-avenue',
    displayName: 'Royal Avenue',
    encounters: [
      encounter('Barboach', ['Water', 'Ground'], 'special', 'Both', 'In-game trade — receive Barboach "Babo" for a Tentacool.', { condition: 'In-game Trade' }),
    ],
    notes: ['No wild encounter table for Royal Avenue per Bulbapedia. Battle Royal Dome is gameplay, not an encounter source.'],
  },
  {
    locationId: 'alola-route-7',
    displayName: 'Route 7',
    encounters: [
      // Ambush (dirt clouds).
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Dirt-cloud ambush.', { condition: 'Dirt Cloud Ambush' }),
      // Surf.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      surf('Pyukumuku', ['Water']),
      // Fishing — normal.
      fish('Staryu', ['Water'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      // Fishing — bubbling.
      fish('Staryu', ['Water'], 'Both', true, 'Bubbling Spot Staryu — 20%.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
    ],
    notes: ['No grass encounters per Bulbapedia.', 'Island Scan (Spheal Monday) intentionally omitted — Island Scan is TODO.'],
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
      'Totem Salazzle (Sun) / Totem Alolan Marowak (Moon) are modeled as boss data.',
      'Brown grass on Wela slopes; level range 16-19.',
    ],
  },
  {
    locationId: 'alola-route-8',
    displayName: 'Route 8',
    encounters: [
      encounter('Alolan Rattata', ['Dark', 'Normal'], 'grass'),
      encounter('Fletchinder', ['Fire', 'Flying'], 'grass'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Yungoos', ['Normal'], 'grass'),
      encounter('Salandit', ['Poison', 'Fire'], 'grass'),
      encounter('Stufful', ['Normal', 'Fighting'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Wimpod', ['Bug', 'Water'], 'special', 'Both', 'Wimpod ambush — flees on approach. 100% of ambush slot.', { condition: 'Wimpod Ambush' }),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Chinchou', ['Water', 'Electric'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Wishiwashi', ['Water']),
    ],
    notes: ['Island Scan (Luxio Tuesday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-lush-jungle',
    displayName: 'Lush Jungle',
    encounters: [
      // Shared species.
      encounter('Caterpie', ['Bug'], 'grass'),
      encounter('Metapod', ['Bug'], 'grass'),
      encounter('Paras', ['Bug', 'Grass'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Fomantis', ['Grass'], 'grass'),
      encounter('Morelull', ['Grass', 'Fairy'], 'grass'),
      encounter('Comfey', ['Fairy'], 'grass'),
      // Version exclusives at the mushroom area.
      encounter('Parasect', ['Bug', 'Grass'], 'grass', 'Sun', 'Sun-exclusive at the mushroom location.'),
      encounter('Shiinotic', ['Grass', 'Fairy'], 'grass', 'Moon', 'Moon-exclusive at the mushroom location.'),
      // Version-exclusive simian totems-of-the-zone.
      encounter('Passimian', ['Fighting'], 'grass', 'Sun', 'Sun-exclusive.'),
      encounter('Oranguru', ['Normal', 'Psychic'], 'grass', 'Moon', 'Moon-exclusive.'),
    ],
    notes: [
      'Totem Lurantis is modeled as boss data.',
      "Rustling grass ambush encounters in Lush Jungle's central area are not exposed in our source's species list — flagged as TODO.",
    ],
  },
  {
    locationId: 'alola-digletts-tunnel',
    displayName: "Diglett's Tunnel",
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'cave'),
      encounter('Alolan Diglett', ['Ground', 'Steel'], 'special', 'Both', 'Dirt-cloud ambush within the tunnel.', { condition: 'Dirt Cloud Ambush' }),
    ],
    notes: ['No version exclusives per Bulbapedia.'],
  },
  {
    locationId: 'alola-konikoni-city',
    displayName: 'Konikoni City',
    encounters: [
      encounter('Poliwhirl', ['Water'], 'special', 'Both', 'In-game trade at the Pokémon Center — receive Poliwhirl "Whirly" (Lv 22) for a Zubat.', { condition: 'In-game Trade' }),
    ],
    notes: ['No wild encounter table for Konikoni City per Bulbapedia.'],
  },
  {
    locationId: 'alola-memorial-hill',
    displayName: 'Memorial Hill',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Gastly', ['Ghost', 'Poison'], 'grass'),
      encounter('Phantump', ['Ghost', 'Grass'], 'grass'),
    ],
    notes: ['No Sun/Moon version exclusives per Bulbapedia.'],
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
    ],
    notes: ['Bulbapedia notes some entries are version-exclusive on this route but specific splits are not exposed in the extracted summary — flagged as TODO for a future verification pass.'],
  },
  {
    locationId: 'alola-hano-grand-resort',
    displayName: 'Hano Grand Resort',
    encounters: [],
    notes: ['No wild encounter table for Hano Grand Resort per Bulbapedia. Resort is a story-event and trainer area only.'],
  },

  // =========================================================================================
  // Pass 3 — Ula'ula Island first-half canonical data (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-malie-city',
    displayName: 'Malie City',
    encounters: [
      // Outer Cape grass.
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Magnemite', ['Electric', 'Steel'], 'grass'),
      encounter('Alolan Grimer', ['Poison', 'Dark'], 'grass'),
      encounter('Trubbish', ['Poison'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      // In-game trade.
      encounter('Happiny', ['Normal'], 'special', 'Both', 'In-game trade at Sushi High Roller — receive Happiny for a Pancham.', { condition: 'In-game Trade' }),
    ],
    notes: ['Grass tables belong to the Outer Cape subarea; Malie City proper has no wild encounters.', 'Malie Garden is treated as the same area for encounter purposes (no separate wild table surfaced).'],
  },
  {
    locationId: 'alola-route-10',
    displayName: 'Route 10',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'special', 'Both', 'Rustling-tree ambush (80%).', { condition: 'Rustling Tree' }),
      encounter('Skarmory', ['Steel', 'Flying'], 'special', 'Both', 'Rustling-tree ambush (20%).', { condition: 'Rustling Tree' }),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: ['Rustling-tree ambush species can drop wing items.', 'Island Scan (Staravia Thursday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-mount-hokulani',
    displayName: 'Mount Hokulani',
    encounters: [
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Cleffa', ['Fairy'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Beldum', ['Steel', 'Psychic'], 'grass'),
      encounter('Minior', ['Rock', 'Flying'], 'grass'),
    ],
    notes: [
      'Totem Vikavolt is modeled as boss data.',
      'Brown grass at the Observatory slopes; level range 25-28.',
      'Elekid is not present in SM Mount Hokulani (USUM-only addition per Bulbapedia).',
    ],
  },
  {
    locationId: 'alola-route-11',
    displayName: 'Route 11',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Paras', ['Bug', 'Grass'], 'grass'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Trumbeak', ['Normal', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Morelull', ['Grass', 'Fairy'], 'grass'),
      encounter('Komala', ['Normal'], 'grass'),
    ],
    notes: ['Island Scan (Vigoroth Friday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-route-12',
    displayName: 'Route 12',
    encounters: [
      encounter('Alolan Geodude', ['Rock', 'Electric'], 'grass'),
      encounter('Elekid', ['Electric'], 'grass'),
      encounter('Torkoal', ['Fire'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
    ],
    notes: ['Northern and southern fields share species at slightly different level ranges; no version exclusives.'],
  },
  {
    locationId: 'alola-blush-mountain',
    displayName: 'Blush Mountain',
    encounters: [
      encounter('Alolan Geodude', ['Rock', 'Electric'], 'grass'),
      encounter('Elekid', ['Electric'], 'grass'),
      encounter('Torkoal', ['Fire'], 'grass'),
      encounter('Charjabug', ['Bug', 'Electric'], 'grass'),
      encounter('Mudbray', ['Ground'], 'grass'),
      encounter('Turtonator', ['Fire', 'Dragon'], 'grass'),
      encounter('Togedemaru', ['Electric', 'Steel'], 'grass'),
    ],
    notes: ['No version exclusives per Bulbapedia.', 'Island Scan (Rhyhorn) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-route-13',
    displayName: 'Route 13',
    encounters: [
      // Route 13 is fishing-only per Bulbapedia.
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true, 'Bubbling Spot Bruxish — 20%.'),
    ],
    notes: ['No grass encounters on Route 13 in SM.'],
  },
  {
    locationId: 'alola-tapu-village',
    displayName: 'Tapu Village',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Alolan Sandshrew', ['Ice', 'Steel'], 'grass', 'Sun', 'Sun-exclusive.'),
      encounter('Alolan Vulpix', ['Ice'], 'grass', 'Moon', 'Moon-exclusive.'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Absol', ['Dark'], 'grass'),
      encounter('Snorunt', ['Ice'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      encounter('Alolan Graveler', ['Rock', 'Electric'], 'special', 'Both', 'In-game trade — receive Alolan Graveler (Lv 32) for a Haunter.', { condition: 'In-game Trade' }),
    ],
    notes: [
      'SOS allies (Vanillite during hail, Castform under hail/rain/sandstorm) intentionally omitted — SOS-only is TODO.',
      'Island Scan (Swinub Monday) intentionally omitted — Island Scan is TODO.',
    ],
  },
  {
    locationId: 'alola-route-14',
    displayName: 'Route 14',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true, 'Bubbling Spot Bruxish — 20%.'),
    ],
    notes: ['No grass encounters on Route 14 in SM — surf/fishing only (black sand beach).'],
  },
  {
    locationId: 'alola-ulaula-meadow',
    displayName: "Ula'ula Meadow",
    encounters: [
      encounter('Cottonee', ['Grass', 'Fairy'], 'grass', 'Sun', 'Sun-exclusive red-flower spawn.'),
      encounter('Petilil', ['Grass'], 'grass', 'Moon', 'Moon-exclusive red-flower spawn.'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Oricorio', ['Fire', 'Flying'], 'grass', 'Both', 'Baile Style — the Ula\'ula-Island form.'),
      encounter('Ribombee', ['Bug', 'Fairy'], 'grass'),
    ],
    notes: ['Constant fog has no gameplay effect besides allowing Goomy-line evolution.'],
  },
  {
    locationId: 'alola-route-15',
    displayName: 'Route 15',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Finneon', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Wishiwashi', ['Water']),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wishiwashi', ['Water'], 'Both', true),
      fish('Bruxish', ['Water', 'Psychic'], 'Both', true, 'Bubbling Spot Bruxish — 20%.'),
    ],
    notes: [],
  },
  {
    locationId: 'alola-route-16',
    displayName: 'Route 16',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Zygarde', ['Dragon', 'Ground'], 'gift', 'Both', 'Aether Base — Zygarde Cube assembly gift. Form (10% or 50%) depends on collected cells.'),
    ],
    notes: [
      'No version exclusives.',
      'Island Scan (Duosion Tuesday) intentionally omitted — Island Scan is TODO.',
      'Zygarde cells themselves are not encoded as encounters (mechanic mismatch); the assembled Zygarde is a single gift.',
    ],
  },

  // =========================================================================================
  // Pass 4 — Late Ula'ula + Aether Paradise canonical data (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-route-17',
    displayName: 'Route 17',
    encounters: [
      // Regular grass.
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Ledian', ['Bug', 'Flying'], 'grass'),
      encounter('Ariados', ['Bug', 'Poison'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      // Brown grass (mountain section).
      encounter('Alolan Graveler', ['Rock', 'Electric'], 'grass', 'Both', 'Brown grass / mountain section.'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass', 'Both', 'Brown grass / mountain section.'),
      berryPile('Crabrawler', ['Fighting']),
    ],
    notes: [
      'Weather-dependent SOS allies (Goomy in rain, Castform in rain/hail/sandstorm) intentionally omitted — SOS is a future TODO.',
      'No Island Scan species on Route 17 per source.',
    ],
  },
  {
    locationId: 'alola-thrifty-megamart',
    displayName: 'Thrifty Megamart (Abandoned)',
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'Both', 'Post-trial wild encounter.'),
      encounter('Haunter', ['Ghost', 'Poison'], 'cave', 'Both', 'Post-trial wild encounter.'),
      encounter('Klefki', ['Steel', 'Fairy'], 'cave', 'Both', 'Post-trial wild encounter.'),
      encounter('Mimikyu', ['Ghost', 'Fairy'], 'cave', 'Both', 'Post-trial wild encounter (rare 5%).'),
    ],
    notes: ["Acerola's trial site. Wild encounters become accessible only after the trial is cleared.", 'Totem Mimikyu is modeled as boss data.'],
  },
  {
    locationId: 'alola-po-town',
    displayName: 'Po Town',
    encounters: [],
    notes: ['No canonical wild encounter table for Po Town per Bulbapedia raw wikitext. Trainers and items only.'],
  },
  {
    locationId: 'alola-aether-paradise',
    displayName: 'Aether Paradise',
    encounters: [
      encounter('Type: Null', ['Normal'], 'gift', 'Both', 'Postgame gift from Gladion at the 2F Conservation area after becoming Champion.'),
    ],
    notes: [
      'No standard wild encounter table for Aether Paradise per Bulbapedia.',
      'Nihilego boss-encounter on the lower floors is mandatory story content, not a capturable wild encounter; tracked as a story event rather than an encounter slot.',
    ],
  },

  // =========================================================================================
  // Pass 5 — Poni Island + Pokémon League canonical data (Bulbapedia raw wikitext verified).
  // =========================================================================================
  {
    locationId: 'alola-seafolk-village',
    displayName: 'Seafolk Village',
    encounters: [
      // Fishing-only village.
      fish('Magikarp', ['Water']),
      fish('Wailmer', ['Water']),
      fish('Dhelmise', ['Grass', 'Ghost'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wailmer', ['Water'], 'Both', true),
      fish('Dhelmise', ['Grass', 'Ghost'], 'Both', true, 'Bubbling Spot Dhelmise — 10%.'),
    ],
    notes: ['No grass encounters; Seafolk Village wild table is fishing-only.'],
  },
  {
    locationId: 'alola-poni-wilds',
    displayName: 'Poni Wilds',
    encounters: [
      // Grass.
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Exeggcute', ['Grass', 'Psychic'], 'grass'),
      encounter('Granbull', ['Fairy'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gastrodon', ['Water', 'Ground'], 'grass', 'Both', 'East Sea form.'),
      encounter('Gumshoos', ['Normal'], 'grass'),
      berryPile('Crabrawler', ['Fighting']),
      encounter('Wimpod', ['Bug', 'Water'], 'special', 'Both', 'Wimpod ambush — flees on approach.', { condition: 'Wimpod Ambush' }),
      // Surf.
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Lapras', ['Water', 'Ice']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Gastrodon', ['Water', 'Ground']),
      surf('Lumineon', ['Water']),
      // Water splash ambush.
      encounter('Wailmer', ['Water'], 'special', 'Both', 'Water splash encounter.', { condition: 'Water Splash' }),
      encounter('Wailord', ['Water'], 'special', 'Both', 'Water splash encounter.', { condition: 'Water Splash' }),
      // Fishing.
      fish('Magikarp', ['Water']),
      fish('Wailmer', ['Water']),
      fish('Relicanth', ['Water', 'Rock'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wailmer', ['Water'], 'Both', true),
      fish('Relicanth', ['Water', 'Rock'], 'Both', true, 'Bubbling Spot Relicanth — 10%.'),
    ],
    notes: ['Island Scan (Samurott Friday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-ancient-poni-path',
    displayName: 'Ancient Poni Path',
    encounters: [
      encounter('Alolan Raticate', ['Dark', 'Normal'], 'grass'),
      encounter('Exeggcute', ['Grass', 'Psychic'], 'grass'),
      encounter('Granbull', ['Fairy'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gastrodon', ['Water', 'Ground'], 'grass', 'Both', 'East Sea form.'),
      encounter('Gumshoos', ['Normal'], 'grass'),
    ],
    notes: ['No version exclusives.', 'Island Scan (Emboar Saturday) intentionally omitted — Island Scan is TODO.'],
  },
  {
    locationId: 'alola-poni-breaker-coast',
    displayName: 'Poni Breaker Coast',
    encounters: [
      encounter('Wimpod', ['Bug', 'Water'], 'special', 'Both', 'Wimpod ambush — 100% of ambush slot.', { condition: 'Wimpod Ambush' }),
      fish('Magikarp', ['Water']),
      fish('Wailmer', ['Water']),
      fish('Sharpedo', ['Water', 'Dark'], 'Both', false, 'Rare 1% normal fishing encounter.'),
      fish('Magikarp', ['Water'], 'Both', true),
      fish('Wailmer', ['Water'], 'Both', true),
      fish('Sharpedo', ['Water', 'Dark'], 'Both', true, 'Bubbling Spot Sharpedo — 10%.'),
    ],
    notes: ['No grass encounters on Poni Breaker Coast in SM; SM does not list surfing encounters here (those appear only in USUM).'],
  },
  {
    locationId: 'alola-vast-poni-canyon',
    displayName: 'Vast Poni Canyon',
    encounters: [
      // Canyon brown grass.
      encounter('Machoke', ['Fighting'], 'grass'),
      encounter('Murkrow', ['Dark', 'Flying'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Boldore', ['Rock'], 'grass'),
      encounter('Carbink', ['Rock', 'Fairy'], 'grass'),
      encounter('Lycanroc', ['Rock'], 'grass', 'Sun', 'Lycanroc Midday — Sun-exclusive in this area.'),
      encounter('Lycanroc', ['Rock'], 'grass', 'Moon', 'Lycanroc Midnight — Moon-exclusive in this area.'),
      encounter('Jangmo-o', ['Dragon'], 'grass'),
      // Caves.
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Alolan Dugtrio', ['Ground', 'Steel'], 'cave'),
      encounter('Boldore', ['Rock'], 'cave'),
      encounter('Carbink', ['Rock', 'Fairy'], 'cave'),
      encounter('Alolan Dugtrio', ['Ground', 'Steel'], 'special', 'Both', 'Dirt-cloud ambush within caves.', { condition: 'Dirt Cloud Ambush' }),
      // Water.
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water']),
      fish('Dratini', ['Dragon'], 'Both', false, 'Rare fishing encounter.'),
      fish('Barboach', ['Water', 'Ground']),
    ],
    notes: ['Lycanroc Midday is Sun-exclusive in Vast Poni Canyon; Lycanroc Midnight is Moon-exclusive per Bulbapedia.', 'Totem Kommo-o is modeled as boss data.'],
  },
  {
    locationId: 'alola-altar',
    displayName: 'Altar of the Sunne / Altar of the Moone',
    encounters: [
      encounter('Solgaleo', ['Psychic', 'Steel'], 'legendary', 'Sun', "Sun-exclusive story legendary (Lv 55). Nebby's evolution; respawns if defeated or fled."),
      encounter('Lunala', ['Psychic', 'Ghost'], 'legendary', 'Moon', "Moon-exclusive story legendary. Nebby's evolution; respawns if defeated or fled."),
    ],
    notes: ['Cover-legendary encounters tied to game version. Lillie provides 10 Poké Balls if needed.'],
  },
  {
    locationId: 'alola-mount-lanakila',
    displayName: 'Mount Lanakila',
    encounters: [
      // Upper grass.
      encounter('Alolan Sandshrew', ['Ice', 'Steel'], 'grass'),
      encounter('Alolan Vulpix', ['Ice'], 'grass'),
      encounter('Sneasel', ['Dark', 'Ice'], 'grass'),
      encounter('Absol', ['Dark'], 'grass'),
      encounter('Snorunt', ['Ice'], 'grass'),
      // Icy cave (right path).
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Sneasel', ['Dark', 'Ice'], 'cave'),
      encounter('Absol', ['Dark'], 'cave'),
      encounter('Snorunt', ['Ice'], 'cave'),
      encounter('Drampa', ['Normal', 'Dragon'], 'cave', 'Both', 'Icy cave right path.'),
    ],
    notes: ['No version exclusives in SM at Mount Lanakila.', 'Necrozma static is USUM-only and intentionally not added here.'],
  },
  {
    locationId: 'alola-pokemon-league',
    displayName: 'Pokémon League',
    encounters: [],
    notes: ['No wild encounters at the Pokémon League itself. Elite Four and Champion battles are modeled as boss data.'],
  },
];

const populatedIds = new Set(populatedAreas.map((a) => a.locationId));

// Auto-generate empty skeleton entries for every SM route NOT yet populated. The runtime
// flatten path tolerates empty encounter arrays; future passes replace these one-by-one.
const stubAreas: SmEncounterArea[] = (Array.isArray(smRoutes) ? smRoutes : [])
  .filter((route) => !populatedIds.has(route.id))
  .map((route) => ({
    locationId: route.id,
    displayName: route.displayName,
    encounters: [],
    notes: ['TODO: Populate canonical Sun/Moon encounter data for this location.'],
  }));

export const smEncounterAreas: SmEncounterArea[] = [...populatedAreas, ...stubAreas];

export const smEncounterNotes = [
  'Schema-mismatch flags: SOS chains, Island Scan, Totem Pokémon + allies, version-exclusives, day/night, fishing bubbles, ambushes, gifts, static legendaries.',
  'Zygarde cells are not Pokémon encounters and are intentionally not encoded as encounters.',
  'Pass 1 (Melemele Island) is the first canonical population; remaining islands are still empty stubs.',
];

export const gen7EncounterTodos = [
  'SOS encounters (call-for-help mechanic) — currently omitted everywhere',
  'Island Scan day-of-week encounters — currently omitted everywhere',
  'Shadow Ambush flying-overhead encounters (Spearow + Rufflet/Vullaby on Route 3) — Bulbapedia mixes them with SOS labeling; need schema clarity',
  'Totem Pokémon battles + Totem allies — encoded as boss data, not encounter data',
  'Day/night encounter differences',
  'Fishing Bubble rare-spot encounters — partially modeled at Kala\'e Bay; needs wider audit',
  'Wormhole / Ultra Space encounters (USUM only)',
  'QR / Island Scan species tables',
  'Gift Pokémon (Type: Null, Eevee, etc.) — partially modeled (Magearna, starters)',
  'Static legendaries (Tapus, cover legendaries, etc.)',
];

export function getSmEncounterOptions(): Record<string, EncounterOption[]> {
  return smEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
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

/** Game-version-aware variant of `getSmEncounterOptions` that filters version-exclusive rows. */
export function getSmEncounterOptionsForGame(game: 'Sun' | 'Moon'): Record<string, EncounterOption[]> {
  return smEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
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
