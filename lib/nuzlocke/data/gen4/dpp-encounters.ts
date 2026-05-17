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

  // ============================================================================================
  // DPP Pass 2 — Eterna through Hearthome / Fantina (Bulbapedia raw wikitext verified).
  // ============================================================================================
  {
    locationId: 'route-206',
    displayName: 'Route 206 (Cycling Road)',
    encounters: [
      // Grass — shared core; Gligar is DP-only, Machop is Platinum-only.
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
      encounter('Ponyta', ['Fire'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Stunky', ['Poison', 'Dark'], 'grass'),
      encounter('Bronzor', ['Steel', 'Psychic'], 'grass'),
      encounter('Gligar', ['Ground', 'Flying'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Machop', ['Fighting'], 'grass', 'Platinum', 'Platinum-only grass spawn.'),
    ],
    notes: ['Poké Radar / Honey-tree species (Baltoy, etc.) intentionally omitted — schema TODO.'],
  },
  {
    locationId: 'wayward-cave',
    displayName: 'Wayward Cave',
    encounters: [
      // Main floor (1F).
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Bronzor', ['Steel', 'Psychic'], 'cave'),
      encounter('Sandshrew', ['Ground'], 'cave', 'All', 'Conditional encounter slot.'),
      // Hidden Basement (B1F) — accessible via the southern entrance with a partner.
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 'All', 'Hidden Basement (B1F).'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave', 'All', 'Hidden Basement (B1F).'),
      encounter('Bronzor', ['Steel', 'Psychic'], 'cave', 'All', 'Hidden Basement (B1F).'),
      encounter('Gible', ['Dragon', 'Ground'], 'cave', 'All', 'Hidden Basement (B1F). Platinum increases the rate from 15% to 20%.'),
      encounter('Sandshrew', ['Ground'], 'cave', 'All', 'Hidden Basement (B1F).'),
    ],
    notes: ['Gible is the canonical hidden-basement headline encounter. Rates differ DP→Pt; species list is identical.'],
  },
  {
    locationId: 'route-207',
    displayName: 'Route 207',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Machop', ['Fighting'], 'grass'),
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
      encounter('Kricketot', ['Bug'], 'grass'),
      encounter('Ponyta', ['Fire'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Gligar', ['Ground', 'Flying'], 'grass', 'DP', 'DP-only rare grass spawn.'),
    ],
    notes: ['Phanpy swarm + Poké Radar species (Stantler, Larvitar) intentionally omitted — schema TODO.'],
  },
  {
    locationId: 'mt-coronet-1f',
    displayName: 'Mt. Coronet 1F (West Entrance)',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Machop', ['Fighting'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Cleffa', ['Fairy'], 'cave', 'All', 'Rare 5% encounter (Cleffa is Fairy in newer dex but Normal in Gen IV — kept Fairy for display continuity).'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'cave'),
      encounter('Chingling', ['Psychic'], 'cave'),
      encounter('Clefairy', ['Fairy'], 'cave', 'Platinum', 'Platinum-only addition (10%).'),
      encounter('Nosepass', ['Rock'], 'cave', 'Platinum', 'Platinum-only addition (5%).'),
      encounter('Bronzor', ['Steel', 'Psychic'], 'cave', 'Platinum', 'Platinum-only addition (20%).'),
      surf('Zubat', ['Poison', 'Flying']),
      surf('Golbat', ['Poison', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Good Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Mt. Coronet floors are collapsed into the 1F west-entrance area for this pass.', 'Cleffa typing displayed as Fairy for cross-generation continuity — note that in Gen IV the species was Normal-type.'],
  },
  {
    locationId: 'route-208',
    displayName: 'Route 208',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass', 'DP', 'DP-only — removed in Platinum.'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass', 'Platinum', 'Platinum-only addition (15%).'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass', 'Platinum', 'Platinum-only addition (15%).'),
      encounter('Budew', ['Grass', 'Poison'], 'grass', 'Platinum', 'Platinum-only addition.'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod', 'Platinum', 'Platinum-only Good Rod addition.'),
      fish('Barboach', ['Water', 'Ground'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition.'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Dunsparce swarm differs by version (Lv 16 DP / Lv 18 Pt); Poké Radar species omitted — schema TODO.'],
  },
  {
    locationId: 'hearthome-city',
    displayName: 'Hearthome City',
    encounters: [
      encounter('Eevee', ['Normal'], 'gift', 'All', 'One-time gift from Bebe (Eevee owner) at Hearthome.'),
    ],
    notes: ['Hearthome City has no wild encounter table. Amity Square is a stroll-only area with no captures.', 'Bebe Eevee gift available after first visit.'],
  },
  {
    locationId: 'route-209',
    displayName: 'Route 209',
    encounters: [
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Bonsly', ['Rock'], 'grass'),
      encounter('Mime Jr.', ['Psychic', 'Fairy'], 'grass'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass', 'Platinum', 'Platinum-only addition.'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass', 'Platinum', 'Platinum-only addition (25%).'),
      encounter('Duskull', ['Ghost'], 'grass', 'Platinum', 'Platinum-only addition (10%).'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Tauros/Miltank Poké Radar gender splits differ DP→Pt — Poké Radar omitted.'],
  },
  {
    locationId: 'lost-tower',
    displayName: 'Lost Tower',
    encounters: [
      // 1F-2F lower floors.
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 'All', '1F-2F.'),
      encounter('Gastly', ['Ghost', 'Poison'], 'cave', 'All', '1F-2F (Platinum raises rate to ~65%).'),
      // Upper floors.
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'All', 'Upper floors.'),
      encounter('Murkrow', ['Dark', 'Flying'], 'cave', 'All', 'Upper floors.'),
      encounter('Misdreavus', ['Ghost'], 'cave', 'All', 'Upper floors.'),
      encounter('Duskull', ['Ghost'], 'cave', 'All', 'Upper floors.'),
    ],
    notes: ['Platinum adds fog mechanic requiring Defog on upper floors; rewards differ (HM04 Strength in DP vs Spell Tag in Platinum).'],
  },
  {
    locationId: 'solaceon-town',
    displayName: 'Solaceon Town',
    encounters: [],
    notes: ['Town venue. Daycare and Pokémon News Press are NPC-only; no wild encounter table.'],
  },
  {
    locationId: 'solaceon-ruins',
    displayName: 'Solaceon Ruins',
    encounters: [
      encounter('Unown', ['Psychic'], 'cave', 'All', 'Letters F/R/I/E/N/D in main-sequence rooms (100% per room). Other letters via dead-end rooms (5%); ? and ! forms in the Maniac Tunnel post-completion (50%).'),
    ],
    notes: ['Unown form distribution is identical between DP and Platinum. Platinum adds a HM05 Defog item in the final room.'],
  },
  {
    locationId: 'route-210-south',
    displayName: 'Route 210 (South)',
    encounters: [
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
      encounter('Ponyta', ['Fire'], 'grass'),
      encounter('Chansey', ['Normal'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass', 'All', 'Night-only encounter (day/night not yet modeled).'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass', 'All', 'Night-only encounter (day/night not yet modeled).'),
      encounter('Scyther', ['Bug', 'Flying'], 'grass', 'DP', 'DP-only grass spawn (15-20%).'),
    ],
    notes: ['Day/night gating not yet modeled — Hoothoot/Noctowl flagged in row notes.'],
  },
  {
    locationId: 'route-215',
    displayName: 'Route 215',
    encounters: [
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Kadabra', ['Psychic'], 'grass'),
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
      encounter('Ponyta', ['Fire'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Scyther', ['Bug', 'Flying'], 'grass', 'DP', 'DP-only grass spawn (20-22%).'),
      encounter('Marill', ['Water', 'Fairy'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Staravia', ['Normal', 'Flying'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Lickitung', ['Normal'], 'grass', 'Platinum', 'Platinum-only grass spawn.'),
    ],
    notes: ['Route 215 weather is permanent rain. Drowzee swarm omitted — schema TODO.'],
  },

  // ============================================================================================
  // DPP Pass 3 — Veilstone / Pastoria / Maylene + Wake (Bulbapedia raw wikitext verified).
  // ============================================================================================
  {
    locationId: 'veilstone-city',
    displayName: 'Veilstone City',
    encounters: [],
    notes: ['City/gym venue. No wild encounter table. Department Store and Galactic HQ are story content.'],
  },
  {
    locationId: 'route-214',
    displayName: 'Route 214',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      encounter('Rhyhorn', ['Ground', 'Rock'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      encounter('Houndour', ['Dark', 'Fire'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
    ],
    notes: ['Honey-tree species and Poké Radar additions intentionally omitted.'],
  },
  {
    locationId: 'maniac-tunnel',
    displayName: 'Maniac Tunnel',
    encounters: [
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Hippopotas', ['Ground'], 'cave', 'All', 'Hippopotas rate scales by total Unown captured (5% / 10% / 20%). Maniac Tunnel is the only Sinnoh-region source of wild Hippopotas.'),
    ],
    notes: ['Encounter rates scale with total Unown captured by the Ruin Maniac. Levels DP 22-24 / Pt 22-26.'],
  },
  {
    locationId: 'valor-lakefront',
    displayName: 'Valor Lakefront',
    encounters: [
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
      encounter('Graveler', ['Rock', 'Ground'], 'grass'),
      encounter('Girafarig', ['Normal', 'Psychic'], 'grass'),
      encounter('Staravia', ['Normal', 'Flying'], 'grass'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Houndour', ['Dark', 'Fire'], 'grass', 'Platinum', 'Platinum-only grass spawn (Lv 27-28).'),
    ],
    notes: ['Poké Radar (Nidorina/Nidorino) intentionally omitted. Pre-Lake Valor Galactic Grunt battle modeled as boss data.'],
  },
  {
    locationId: 'route-213',
    displayName: 'Route 213',
    encounters: [
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Buizel', ['Water'], 'grass'),
      encounter('Floatzel', ['Water'], 'grass'),
      encounter('Shellos', ['Water'], 'grass', 'All', 'East Sea form.'),
      encounter('Chatot', ['Normal', 'Flying'], 'grass', 'Platinum', 'Platinum-only grass spawn (Lv 23-25).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Coastal beach route. Honey-tree species omitted.'],
  },
  {
    locationId: 'pastoria-city',
    displayName: 'Pastoria City',
    encounters: [],
    notes: ['City/gym venue. Great Marsh is a separate area (see great-marsh).'],
  },
  {
    locationId: 'great-marsh',
    displayName: 'Great Marsh',
    encounters: [
      // Permanent core species shared across all six areas in DP and Platinum.
      encounter('Psyduck', ['Water'], 'grass'),
      encounter('Wooper', ['Water', 'Ground'], 'grass'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Starly', ['Normal', 'Flying'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
    ],
    notes: [
      "Great Marsh is Sinnoh's Safari Zone — rotating daily species and per-area subdivisions are not yet modeled.",
      'Only the permanent core species are listed. The full ~34-species rotation, daily-change slots (Golduck/Staravia/Noctowl in DP, restricted in Pt), per-area divisions, and post-National-Dex unlocks remain TODO.',
    ],
  },
  {
    locationId: 'route-212-south',
    displayName: 'Route 212 (South)',
    encounters: [
      encounter('Wooper', ['Water', 'Ground'], 'grass'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
      encounter('Buizel', ['Water'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Shellos', ['Water'], 'grass', 'DP', 'DP-only grass spawn.'),
      encounter('Croagunk', ['Poison', 'Fighting'], 'grass', 'DP', 'DP-only grass spawn.'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      surf('Tentacool', ['Water', 'Poison'], 'Platinum', 'Platinum-only surf addition.'),
      surf('Tentacruel', ['Water', 'Poison'], 'Platinum', 'Platinum-only surf addition.'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Remoraid', ['Water'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition.'),
      fish('Octillery', ['Water'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition.'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition.'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod', 'Platinum', 'Platinum-only Super Rod addition.'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Permanent rain on south half. Pokémon Mansion is on this route (separate trainer venue).'],
  },
  {
    locationId: 'route-212-north',
    displayName: 'Route 212 (North)',
    encounters: [
      encounter('Marill', ['Water', 'Fairy'], 'grass'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Kricketune', ['Bug'], 'grass'),
    ],
    notes: ['Marill consolidated to single slot in Platinum; Ralts removed; Smeargle Poké Radar level shifted (not modeled).'],
  },
  {
    locationId: 'route-210-north',
    displayName: 'Route 210 (North)',
    encounters: [
      // Foggy northern section accessed after Secret Medicine cures the blockading Psyduck.
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass', 'All', 'Foggy section.'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass', 'DP', 'DP-only foggy section spawn.'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Machoke', ['Fighting'], 'grass'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'grass'),
      encounter('Ponyta', ['Fire'], 'grass'),
      encounter('Rapidash', ['Fire'], 'grass'),
      encounter('Scyther', ['Bug', 'Flying'], 'grass', 'DP', 'DP-only spawn (Lv 19/21).'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Foggy half accessed after Secret Medicine cures the Psyduck blockade. Poké Radar species (Kecleon/Bagon/Zangoose/Seviper) omitted.'],
  },

  // ============================================================================================
  // DPP Pass 4 — Canalave / Byron + Lake/Galactic arc (Bulbapedia raw wikitext verified).
  // ============================================================================================
  {
    locationId: 'route-218',
    displayName: 'Route 218',
    encounters: [
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass'),
      encounter('Gastrodon', ['Water', 'Ground'], 'grass', 'All', 'West Sea form.'),
      encounter('Floatzel', ['Water'], 'grass'),
      encounter('Glameow', ['Normal'], 'grass', 'DP', 'DP-only grass spawn (15%).'),
      encounter('Chatot', ['Normal', 'Flying'], 'grass', 'Platinum', 'Platinum-only grass spawn (20%).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Shellos', ['Water'], 'Platinum', 'Platinum-only surf addition (West Sea form).'),
      surf('Gastrodon', ['Water', 'Ground'], 'Platinum', 'Platinum-only surf addition.'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Poké Radar (Ditto) and swarm (Voltorb) omitted.'],
  },
  {
    locationId: 'canalave-city',
    displayName: 'Canalave City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying'], 'DP', 'DP-only surf addition.'),
      surf('Pelipper', ['Water', 'Flying'], 'DP', 'DP-only surf addition.'),
      surf('Shellos', ['Water'], 'Platinum', 'Platinum-only — West Sea form.'),
      surf('Gastrodon', ['Water', 'Ground'], 'Platinum', 'Platinum-only — West Sea form.'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Staryu', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
    ],
    notes: ['Surf-only access to the harbor. Sailor NPCs route to Iron Island and (postgame) Newmoon Island.'],
  },
  {
    locationId: 'iron-island',
    displayName: 'Iron Island',
    encounters: [
      // Cave levels — main shared species across B1F-B3F.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Onix', ['Rock', 'Ground'], 'cave'),
      encounter('Steelix', ['Steel', 'Ground'], 'cave', 'All', 'Deeper basement floors.'),
      // Surfing around the island dock.
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      // Fishing on the dock.
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
      encounter('Riolu', ['Fighting'], 'gift', 'All', 'Egg gift from Riley after defeating Team Galactic Grunts on B2F.'),
    ],
    notes: ['Cave floors collapsed into one area. Sableye/Mawile Poké Radar omitted — schema TODO.'],
  },
  {
    locationId: 'fuego-ironworks',
    displayName: 'Fuego Ironworks',
    encounters: [
      encounter('Magnemite', ['Electric', 'Steel'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      encounter('Magmar', ['Fire'], 'grass', 'DP', 'DP-only grass spawn (removed in Platinum).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison'], 'DP', 'DP-only surf 5%.'),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Shellder', ['Water'], 'Super Rod', 'DP', 'DP-only Super Rod 15%.'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
    ],
    notes: ['Accessed by surfing west on Route 205. Platinum trims grass + Tentacruel/Shellder fishing; Mr. Fuego trades star pieces for shards instead of a one-time Fire Stone.'],
  },
  {
    locationId: 'lake-valor',
    displayName: 'Lake Valor',
    encounters: [
      // Grass — only accessible after the Galactic bombing drains the lake; lake-bed encounter.
      encounter('Psyduck', ['Water'], 'grass'),
      encounter('Golduck', ['Water'], 'grass'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass'),
      encounter('Staravia', ['Normal', 'Flying'], 'grass'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Chingling', ['Psychic'], 'grass'),
      // Surf (post-restoration) — limited table.
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      encounter('Azelf', ['Psychic'], 'legendary', 'All', 'Valor Cavern static legendary (Lv 50). DP: respawns on leaving the area if run from. Pt: respawns after Hall of Fame if defeated or fled.'),
    ],
    notes: ['Lake-bed grass encounters are accessible only after the Galactic bombing drains the lake.'],
  },
  {
    locationId: 'lake-verity-return',
    displayName: 'Lake Verity (Return)',
    encounters: [
      encounter('Mesprit', ['Psychic'], 'legendary', 'All', 'Lake Verity legendary (Lv 50). After the Galactic story event, Mesprit awakens and roams Sinnoh.'),
    ],
    notes: ['Mars second battle is modeled as boss data. After the Galactic event, Mesprit awakens (roaming legendary — encounter happens elsewhere on the map).'],
  },
  {
    locationId: 'route-219',
    displayName: 'Route 219',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
      fish('Clamperl', ['Water'], 'Super Rod', 'All', 'Rare Super Rod encounter.'),
    ],
    notes: ['Surf-only route; no grass encounters.'],
  },
  {
    locationId: 'route-220',
    displayName: 'Route 220',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Lumineon', ['Water'], 'Good Rod', 'Platinum', 'Platinum-only Good Rod 5%.'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Chinchou', ['Water', 'Electric'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
      fish('Lanturn', ['Water', 'Electric'], 'Super Rod'),
    ],
    notes: ['Surf-only route to Pal Park / Route 226 — accessible postgame via Surf.'],
  },
  {
    locationId: 'route-221',
    displayName: 'Route 221',
    encounters: [
      encounter('Roselia', ['Grass', 'Poison'], 'grass'),
      encounter('Floatzel', ['Water'], 'grass'),
      encounter('Shellos', ['Water'], 'grass'),
      encounter('Gastrodon', ['Water', 'Ground'], 'grass'),
      encounter('Sudowoodo', ['Rock'], 'grass'),
      encounter('Girafarig', ['Normal', 'Psychic'], 'grass', 'Platinum', 'Platinum-only grass spawn (25%).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
    ],
    notes: ['Farfetch\'d swarm and Nidorina/Nidorino Poké Radar omitted.'],
  },

  // ============================================================================================
  // DPP Pass 5 — Snowpoint / Lake Acuity / Candice (Bulbapedia raw wikitext verified).
  // ============================================================================================
  {
    locationId: 'route-216',
    displayName: 'Route 216',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Sneasel', ['Dark', 'Ice'], 'grass'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'grass'),
      encounter('Medicham', ['Fighting', 'Psychic'], 'grass'),
      encounter('Snover', ['Grass', 'Ice'], 'grass'),
      encounter('Snorunt', ['Ice'], 'grass', 'Platinum', 'Platinum-only grass spawn (Lv 33).'),
    ],
    notes: ['Delibird swarm (Lv 32, 40%) intentionally omitted — schema TODO.', 'Snorunt is DP Poké Radar-only / Platinum grass-direct — only the Platinum grass slot is modeled here.'],
  },
  {
    locationId: 'route-217',
    displayName: 'Route 217',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Machoke', ['Fighting'], 'grass'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass'),
      encounter('Sneasel', ['Dark', 'Ice'], 'grass'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'grass'),
      encounter('Medicham', ['Fighting', 'Psychic'], 'grass'),
      encounter('Snover', ['Grass', 'Ice'], 'grass'),
      encounter('Snorunt', ['Ice'], 'grass', 'All', 'Lv 33.'),
      encounter('Swinub', ['Ice', 'Ground'], 'grass', 'Platinum', 'Platinum-only grass spawn (35%, Lv 32-34).'),
    ],
    notes: ['Persistent blizzard route. DP Swinub/Delibird swarms + DP Ursaring special encounter omitted — schema TODOs.', 'Piloswine Poké Radar (Platinum) omitted.'],
  },
  {
    locationId: 'acuity-lakefront',
    displayName: 'Acuity Lakefront',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Bibarel', ['Normal', 'Water'], 'grass'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass'),
      encounter('Sneasel', ['Dark', 'Ice'], 'grass'),
      encounter('Snover', ['Grass', 'Ice'], 'grass'),
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: ['Gateway between Route 216/217 and Lake Acuity.'],
  },
  {
    locationId: 'lake-acuity',
    displayName: 'Lake Acuity',
    encounters: [
      surf('Psyduck', ['Water']),
      surf('Golduck', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      encounter('Uxie', ['Psychic'], 'legendary', 'All', 'Lake Acuity cavern static legendary (Lv 50). Accessible after Galactic story event. Respawns after Hall of Fame in Platinum if defeated.'),
    ],
    notes: ['Jupiter\'s Lake Acuity appearance is a cutscene (she defeats the rival off-screen) — no player battle here.'],
  },
  {
    locationId: 'snowpoint-city',
    displayName: 'Snowpoint City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Tentacruel', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Good Rod'),
      fish('Finneon', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Lumineon', ['Water'], 'Super Rod'),
    ],
    notes: ['Snowpoint Temple is postgame-gated (Regigigas event) and intentionally not added as a main-story area this pass.'],
  },

  // ============================================================================================
  // DPP Pass 6 — Galactic HQ / Spear Pillar / Distortion World.
  // ============================================================================================
  {
    locationId: 'galactic-hq',
    displayName: 'Galactic HQ',
    encounters: [],
    notes: ['Veilstone Galactic HQ / Warehouse. No wild encounter table; trainer battles only. Saturn + Cyrus battles modeled as boss data.'],
  },
  {
    locationId: 'mt-coronet-summit',
    displayName: 'Mt. Coronet Summit',
    encounters: [
      // Upper-floor interior (4F / 5F+ approach to Spear Pillar).
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Machop', ['Fighting'], 'cave'),
      encounter('Machoke', ['Fighting'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Chingling', ['Psychic'], 'cave'),
      encounter('Nosepass', ['Rock'], 'cave', 'Platinum', 'Platinum-only addition.'),
      encounter('Noctowl', ['Normal', 'Flying'], 'cave', 'All', 'Upper-floor encounter.'),
      encounter('Bronzong', ['Steel', 'Psychic'], 'cave', 'All', 'Upper-floor encounter.'),
      encounter('Absol', ['Dark'], 'cave', 'All', 'Upper-floor encounter.'),
    ],
    notes: ['Mt. Coronet upper floors collapsed into one area; species list is the union of 4F-summit per Bulbapedia. Snow-section / outdoor 6F not separated.'],
  },
  {
    locationId: 'spear-pillar',
    displayName: 'Spear Pillar',
    encounters: [
      encounter('Dialga', ['Steel', 'Dragon'], 'legendary', 'Diamond', 'Diamond-exclusive cover legendary (Lv 47). Storyline-mandatory; respawns after Hall of Fame in DP.'),
      encounter('Palkia', ['Water', 'Dragon'], 'legendary', 'Pearl', 'Pearl-exclusive cover legendary (Lv 47). Storyline-mandatory; respawns after Hall of Fame in DP.'),
      encounter('Dialga', ['Steel', 'Dragon'], 'legendary', 'Platinum', 'In Platinum, Dialga appears with Palkia at Spear Pillar but flees to the Distortion World after summoning Giratina — not catchable here. Capturable postgame elsewhere.'),
      encounter('Palkia', ['Water', 'Dragon'], 'legendary', 'Platinum', 'In Platinum, Palkia appears with Dialga at Spear Pillar but flees after the Giratina cutscene. Not catchable here; capturable postgame.'),
    ],
    notes: ['Spear Pillar has no wild encounter table; only cover-legendary story encounters.', 'Cyrus Spear Pillar (DP only) and Mars+Jupiter multi-battle modeled as boss data.'],
  },
  {
    locationId: 'distortion-world',
    displayName: 'Distortion World',
    encounters: [
      encounter('Giratina', ['Ghost', 'Dragon'], 'legendary', 'Platinum', 'Platinum-exclusive cover legendary (Lv 47, Origin Forme during the cutscene). Storyline-mandatory; Cyrus battle precedes the Giratina battle.'),
    ],
    notes: ['Distortion World is Platinum-only and has no standard wild encounters — just navigation puzzles, the Cyrus battle, and the Giratina static.', 'Turnback Cave is postgame-gated and intentionally not added this pass.'],
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
