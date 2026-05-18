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

const devonScope = (species: string, types: PokemonType[], version: RseVersion = 'All', notes?: string): RseEncounter =>
  encounter(species, types, 'special', version, notes, { condition: 'Devon Scope' });

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

  // =====================================================================================
  // RSE Pass 2 — Dewford through Mauville / Wattson.
  // =====================================================================================
  {
    locationId: 'dewford-town',
    displayName: 'Dewford Town',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Brawly Gym city — no wild grass. Sail in via Mr. Briney from Route 104.'],
  },
  {
    locationId: 'route-106',
    displayName: 'Route 106',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Water route between Dewford and Granite Cave dock. Surf/fish only.'],
  },
  {
    locationId: 'granite-cave',
    displayName: 'Granite Cave',
    encounters: [
      // 1F + B1F + B2F species union per Bulbapedia. Rates differ per floor; species set documented below.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Makuhita', ['Fighting'], 'cave', 'All', '1F.'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave', 'All', '1F + B1F.'),
      encounter('Abra', ['Psychic'], 'cave', 'All', 'B1F.'),
      encounter('Aron', ['Steel', 'Rock'], 'cave', 'All', 'B1F + B2F.'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 'Ruby', 'B2F Ruby-exclusive — Sapphire swaps with Mawile.'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 'Emerald', 'B2F — appears in Emerald alongside Mawile (rate split).'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'Sapphire', 'B2F Sapphire-exclusive — Ruby swaps with Sableye.'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'Emerald', 'B2F — appears in Emerald alongside Sableye (rate split).'),
    ],
    notes: [
      'Floors 1F / B1F / B2F collapsed into one area; per-floor rates differ per Bulbapedia.',
      'Sableye is Ruby-exclusive, Mawile is Sapphire-exclusive on B2F; Emerald has both (rate-split).',
      'Mawile typed Steel/Fairy per modern-dex display convention (Gen-3 cartridge typing was Steel-only).',
      'Steven gives the Letter from Mr. Stone here — cutscene, no battle.',
    ],
  },
  {
    locationId: 'route-107',
    displayName: 'Route 107',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Water route east of Dewford. Connects to Routes 108/109.'],
  },
  {
    locationId: 'route-108',
    displayName: 'Route 108',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Water route with the Abandoned Ship (deferred — no canonical wild table baked here).'],
  },
  {
    locationId: 'route-109',
    displayName: 'Route 109',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Slateport Beach. Wingull appear on the sand but no grass table.'],
  },
  {
    locationId: 'slateport-city',
    displayName: 'Slateport City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Port city — Oceanic Museum, Stern docks, market. No wild grass.',
      'Captain Stern / Devon Goods plotline runs here; Aqua/Magma Slateport battles vary by version and remain TODO this pass.',
    ],
  },
  {
    locationId: 'route-110',
    displayName: 'Route 110',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Plusle', ['Electric'], 'grass'),
      encounter('Minun', ['Electric'], 'grass'),
      encounter('Electrike', ['Electric'], 'grass', 'Emerald', 'Emerald-only grass addition on Route 110 (RS push Electrike to Route 118).'),
      encounter('Gulpin', ['Poison'], 'grass', 'Emerald', 'Emerald-only grass addition.'),
      surf('Marill', ['Water', 'Fairy']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      'Cycling Road runs through Route 110. The bike path itself has no encounters.',
      'Plusle/Minun appear in all three games but with version-asymmetric rates.',
      'Marill typed Water/Fairy per modern-dex display convention.',
      'Trick House sits on Route 110 — TODO: model as a separate location if/when boss-prep schema supports trick-room style trainer puzzles.',
    ],
  },
  {
    locationId: 'mauville-city',
    displayName: 'Mauville City',
    encounters: [
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      'Wattson Gym city. No wild grass; fishing accessible from the small pond.',
      'New Mauville is accessible after Wattson — deferred to a follow-up pass (requires Basement Key + power events).',
    ],
  },
  {
    locationId: 'route-117',
    displayName: 'Route 117',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Marill', ['Water', 'Fairy'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Seedot', ['Grass'], 'grass', 'Ruby', 'Ruby-only — Sapphire has Lotad instead.'),
      encounter('Seedot', ['Grass'], 'grass', 'Emerald'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Sapphire', 'Sapphire-only — Ruby has Seedot instead.'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Emerald'),
      encounter('Volbeat', ['Bug'], 'grass', 'Ruby', 'Ruby-only firefly.'),
      encounter('Volbeat', ['Bug'], 'grass', 'Emerald'),
      encounter('Illumise', ['Bug'], 'grass', 'Sapphire', 'Sapphire-only firefly.'),
      encounter('Illumise', ['Bug'], 'grass', 'Emerald'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass', 'Emerald', 'Emerald-only grass addition.'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: ['Day Care is here. Seedot/Lotad and Volbeat/Illumise mirror the version-pair theme.'],
  },
  {
    locationId: 'verdanturf-town',
    displayName: 'Verdanturf Town',
    encounters: [],
    notes: ['Town venue. No wild encounter table. Rusturf Tunnel back-exit (post Rock Smash) opens here.'],
  },

  // =====================================================================================
  // RSE Pass 3 — Mauville through Fallarbor / Meteor Falls / Lavaridge.
  // =====================================================================================
  {
    locationId: 'route-111',
    displayName: 'Route 111',
    encounters: [
      // South-of-desert grass section (the populated stretch before the sandstorm wall).
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Sandshrew', ['Ground'], 'grass'),
      surf('Goldeen', ['Water']),
      surf('Magikarp', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      'South stretch (grass) populated; north desert section (Trapinch/Cacnea/Baltoy/Sandshrew, gated by Go-Goggles) deferred.',
      'Mirage Tower is Emerald-exclusive and contains an Anorith Fossil (vs Claw Fossil) choice — TODO once fossil-revival schema is in place.',
    ],
  },
  {
    locationId: 'route-112',
    displayName: 'Route 112',
    encounters: [
      encounter('Numel', ['Fire', 'Ground'], 'grass'),
      encounter('Spoink', ['Psychic'], 'grass'),
      encounter('Machop', ['Fighting'], 'grass'),
    ],
    notes: ['Volcanic slope route connecting Fiery Path entrance to the Mt. Chimney cable car.'],
  },
  {
    locationId: 'fiery-path',
    displayName: 'Fiery Path',
    encounters: [
      encounter('Slugma', ['Fire'], 'cave'),
      encounter('Numel', ['Fire', 'Ground'], 'cave'),
      encounter('Torkoal', ['Fire'], 'cave'),
      encounter('Grimer', ['Poison'], 'cave'),
      encounter('Koffing', ['Poison'], 'cave'),
      encounter('Machop', ['Fighting'], 'cave'),
    ],
    notes: ['Cave shortcut between Route 112 and Route 111 (north of Fallarbor). Strength required to access fully.'],
  },
  {
    locationId: 'route-113',
    displayName: 'Route 113',
    encounters: [
      encounter('Spinda', ['Normal'], 'grass'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass'),
      encounter('Slugma', ['Fire'], 'grass'),
      encounter('Sandshrew', ['Ground'], 'grass'),
    ],
    notes: ['Permanent ash-fall route. Glass Workshop NPC trades volcanic ash for items.'],
  },
  {
    locationId: 'fallarbor-town',
    displayName: 'Fallarbor Town',
    encounters: [],
    notes: ['Town venue. No wild encounter table. Move Tutor (Draco Meteor — Emerald postgame), Battle Tent, Cosmo / Meteorite plot hub.'],
  },
  {
    locationId: 'route-114',
    displayName: 'Route 114',
    encounters: [
      encounter('Swablu', ['Normal', 'Flying'], 'grass'),
      encounter('Seedot', ['Grass'], 'grass', 'Ruby', 'Ruby-only — Sapphire has Lotad on this route instead.'),
      encounter('Seedot', ['Grass'], 'grass', 'Emerald'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Sapphire', 'Sapphire-only — Ruby has Seedot here.'),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 'Emerald'),
      encounter('Nuzleaf', ['Grass', 'Dark'], 'grass', 'Ruby', 'Ruby-only evolved Seedot.'),
      encounter('Nuzleaf', ['Grass', 'Dark'], 'grass', 'Emerald'),
      encounter('Lombre', ['Water', 'Grass'], 'grass', 'Sapphire', 'Sapphire-only evolved Lotad.'),
      encounter('Lombre', ['Water', 'Grass'], 'grass', 'Emerald'),
      encounter('Zangoose', ['Normal'], 'grass', 'Ruby', 'Ruby-only — Sapphire has Seviper.'),
      encounter('Zangoose', ['Normal'], 'grass', 'Emerald'),
      encounter('Seviper', ['Poison'], 'grass', 'Sapphire', 'Sapphire-only — Ruby has Zangoose.'),
      encounter('Seviper', ['Poison'], 'grass', 'Emerald'),
      surf('Marill', ['Water', 'Fairy']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: ['Lakefront route leading to Meteor Falls. Seedot/Lotad + Zangoose/Seviper version-pair theme.'],
  },
  {
    locationId: 'meteor-falls',
    displayName: 'Meteor Falls',
    encounters: [
      // 1F + B1F species union per Bulbapedia.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'All', 'Deeper floors.'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave', 'Ruby', 'Ruby-exclusive — Sapphire swaps with Lunatone.'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave', 'Emerald'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave', 'Sapphire', 'Sapphire-exclusive — Ruby swaps with Solrock.'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave', 'Emerald'),
      encounter('Bagon', ['Dragon'], 'cave', 'All', 'B1F deep interior (post-Waterfall area).'),
      surf('Goldeen', ['Water']),
      surf('Magikarp', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      '1F + B1F species union. Deep interior + Waterfall sections gated until later.',
      'Solrock is Ruby-exclusive, Lunatone is Sapphire-exclusive; Emerald has both.',
      'Bagon is in the deep interior (post-Waterfall) — accessible later but listed here for catalog completeness.',
      'Emerald postgame: Steven Stone multi-battle happens here (not modeled in this pass — see Pass 1 skeleton).',
    ],
  },
  {
    locationId: 'route-115',
    displayName: 'Route 115',
    encounters: [
      encounter('Taillow', ['Normal', 'Flying'], 'grass'),
      encounter('Swablu', ['Normal', 'Flying'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Jigglypuff', ['Normal', 'Fairy'], 'grass', 'Emerald', 'Emerald-only grass addition.'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
    ],
    notes: [
      'Beach route north of Rustboro. South half requires Surf; north half reaches Meteor Falls entrance.',
      'Jigglypuff typed Normal/Fairy per modern-dex display convention.',
    ],
  },
  {
    locationId: 'jagged-pass',
    displayName: 'Jagged Pass',
    encounters: [
      encounter('Numel', ['Fire', 'Ground'], 'grass'),
      encounter('Spoink', ['Psychic'], 'grass'),
      encounter('Machop', ['Fighting'], 'grass'),
    ],
    notes: ['Descent from Mt. Chimney summit to Lavaridge. Same core species as Route 112.'],
  },
  {
    locationId: 'mt-chimney-summit',
    displayName: 'Mt. Chimney',
    encounters: [],
    notes: [
      'Volcanic summit. No wild encounter table — only Magma/Aqua trainer battles and the leader confrontation.',
      'Reachable via Cable Car from Route 112; descent via Jagged Pass to Lavaridge.',
    ],
  },
  {
    locationId: 'lavaridge-town',
    displayName: 'Lavaridge Town',
    encounters: [
      encounter('Wynaut', ['Psychic'], 'gift', 'Emerald', 'Wynaut Egg gift from old woman in Lavaridge (Emerald only). Wynaut typed Psychic per modern-dex convention.'),
    ],
    notes: [
      'Hot springs town. Flannery Gym (Fire). No wild grass table.',
      'Egg gift: Wynaut Egg available in Emerald only (RS gives Wynaut Egg at Lavaridge too — verify? deferred to TODO if version-uncertain).',
    ],
  },

  // =====================================================================================
  // RSE Pass 4 — Route 118 through Fortree / Weather Institute / Norman / Lilycove / Mt. Pyre.
  // Bridges Pass 3 (Lavaridge/Flannery) into Pass 5 (Mossdeep onward).
  // =====================================================================================
  {
    locationId: 'route-118',
    displayName: 'Route 118',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Linoone', ['Normal'], 'grass'),
      encounter('Electrike', ['Electric'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Kecleon', ['Normal'], 'grass'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
      devonScope('Kecleon', ['Normal'], 'All', 'Invisible Kecleon blocks the bridge to Route 119 — revealed after picking up the Devon Scope from Steven. Story-mandatory encounter.'),
    ],
    notes: [
      'East of Mauville. The Kecleon on the bridge is a story-mandatory Devon Scope encounter.',
      'Steven gives the Devon Scope here — story event.',
    ],
  },
  {
    locationId: 'route-119',
    displayName: 'Route 119',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Linoone', ['Normal'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Wurmple', ['Bug'], 'grass'),
      encounter('Tropius', ['Grass', 'Flying'], 'grass', 'All', 'Rare grass spawn (~1%).'),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 'Emerald', 'Emerald-only grass addition.'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Magikarp', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
      fish('Carvanha', ['Water', 'Dark'], 'Super Rod', 'Emerald', 'Emerald-only Super Rod addition.'),
      devonScope('Kecleon', ['Normal'], 'All', 'Invisible Kecleon block(s) along Route 119; revealed by Devon Scope.'),
    ],
    notes: [
      'Long northbound route to Fortree, permanent rain in the upper grass section.',
      'Feebas: Route 119 hosts the Feebas tile mechanic — only 6 of ~400 tiles spawn Feebas, deterministic per save by Trainer ID. TODO: model once tile-coordinate / Trainer-ID hashing convention exists; not faked here.',
      'Weather Institute is a side-building off this route — separate location entry.',
    ],
  },
  {
    locationId: 'weather-institute',
    displayName: 'Weather Institute',
    encounters: [
      encounter('Castform', ['Normal'], 'gift', 'All', 'Castform Lv 25 gift from the Weather Institute scientist after defeating the Aqua/Magma admin. Available in all three versions.'),
    ],
    notes: [
      'Side-building on Route 119 occupied by Team Magma (Ruby) or Team Aqua (Sapphire / Emerald). Admin boss fight inside — see boss data.',
      'No wild grass table.',
    ],
  },
  {
    locationId: 'fortree-city',
    displayName: 'Fortree City',
    encounters: [],
    notes: ['Treehouse city. Winona Gym (Flying). No wild grass table. Kecleon blocks Route 120 entrance until Devon Scope.'],
  },
  {
    locationId: 'route-120',
    displayName: 'Route 120',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Linoone', ['Normal'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Marill', ['Water', 'Fairy'], 'grass'),
      encounter('Kecleon', ['Normal'], 'grass'),
      encounter('Absol', ['Dark'], 'grass', 'All', 'Rare grass spawn.'),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 'Emerald', 'Emerald-only grass addition.'),
      surf('Marill', ['Water', 'Fairy']),
      surf('Lotad', ['Water', 'Grass'], 'Sapphire'),
      surf('Lotad', ['Water', 'Grass'], 'Emerald'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Super Rod'),
      devonScope('Kecleon', ['Normal'], 'All', 'Invisible Kecleon blocks the Fortree exit bridge. Revealed by Devon Scope. Mandatory progression encounter.'),
    ],
    notes: ['Forest route east of Fortree. Marill typed Water/Fairy per modern-dex convention.'],
  },
  {
    locationId: 'route-121',
    displayName: 'Route 121',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Linoone', ['Normal'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 'All', 'Rare grass spawn (~1%).'),
      encounter('Shuppet', ['Ghost'], 'grass', 'Emerald', 'Emerald-only grass addition (night/Mt.Pyre-adjacent).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Coastal route between Route 120 and Lilycove. Safari Zone entrance is on this route — Safari Zone interior is deferred (separate area-partitioning system).',
    ],
  },
  {
    locationId: 'safari-zone',
    displayName: 'Safari Zone',
    encounters: [],
    notes: [
      'TODO: Safari Zone requires per-area partition handling (Area 1 / 2 / 3 / 4 in RS; expanded Areas 5-6 in Emerald with Doduo/Aipom/etc.). Not modeled this pass.',
      'Notable Safari-Zone-only species: Pikachu (RS), Pinsir, Heracross (E only Areas 5-6), Phanpy, Doduo, Aipom (E), Stantler (E), Sunkern, Wobbuffet (E), etc.',
    ],
  },
  {
    locationId: 'lilycove-city',
    displayName: 'Lilycove City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Coastal hub. Department Store, Contest Hall, Pokémon Trainer Fan Club.',
      'Aqua Hideout entrance is in Lilycove in Sapphire/Emerald — separate Hideout entry already populated.',
      'Move Tutor for Dive (Emerald) — story-gated.',
    ],
  },
  {
    locationId: 'mt-pyre',
    displayName: 'Mt. Pyre',
    encounters: [
      // Interior floors 1F-6F + exterior summit species union per Bulbapedia.
      encounter('Shuppet', ['Ghost'], 'cave'),
      encounter('Duskull', ['Ghost'], 'cave'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'cave', 'All', 'Exterior summit slope.'),
      encounter('Vulpix', ['Fire'], 'cave', 'All', 'Exterior summit slope (rare).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
    ],
    notes: [
      'Cemetery mountain. Interior floors (1F-6F) + exterior summit collapsed into one entry; species union listed. Per-floor rates differ.',
      'Story event: Magma (Ruby) steals the Red Orb / Aqua (Sapphire/Emerald) steals the Blue Orb from the summit. Old Couple gives the other Orb to the player after.',
    ],
  },
  {
    locationId: 'route-122',
    displayName: 'Route 122',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Surf-only water route between Mt. Pyre island and the surrounding sea.'],
  },
  {
    locationId: 'route-123',
    displayName: 'Route 123',
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass'),
      encounter('Linoone', ['Normal'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Gloom', ['Grass', 'Poison'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 'All', 'Rare grass spawn (~1%).'),
      encounter('Shuppet', ['Ghost'], 'grass', 'Emerald', 'Emerald-only grass addition (Mt. Pyre proximity).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Route west of Lilycove / east of Mauville-Route-118 area. Berry trees + Mt. Pyre approach.'],
  },

  // =====================================================================================
  // RSE Pass 5 — Lilycove eastern arc through Mossdeep / Seafloor Cavern / Sootopolis.
  // NOTE: Pass 4 (Fortree / Weather Institute / Norman) was skipped — Routes 118-123,
  // Petalburg Gym, Winona, Mt. Pyre, etc. remain skeleton/stub pending Pass 4.
  // =====================================================================================
  {
    locationId: 'route-124',
    displayName: 'Route 124',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Open ocean between Lilycove and Mossdeep.',
      'Dive spots (Clamperl / Chinchou / Relicanth, etc.) deferred — current encounter schema has no dive method; tracked as TODO.',
    ],
  },
  {
    locationId: 'route-125',
    displayName: 'Route 125',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Ocean north of Mossdeep, gateway to Shoal Cave.'],
  },
  {
    locationId: 'shoal-cave',
    displayName: 'Shoal Cave',
    encounters: [
      // Union across all four chambers + tide states per Bulbapedia.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'All', 'Deeper rooms.'),
      encounter('Spheal', ['Ice', 'Water'], 'cave'),
      encounter('Snorunt', ['Ice'], 'cave', 'All', 'Ice Room only (rare).'),
      surf('Tentacool', ['Water', 'Poison']),
      surf('Spheal', ['Ice', 'Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Multi-room cave with tidal mechanics — Low Tide opens Ice Room/Lower Chamber, High Tide submerges sections. Species union listed; per-room/per-tide rates deferred.',
      'TODO: model tide mechanic + per-chamber gating once schema supports time/condition gating.',
      'Postgame: old man Shoal Salt/Shoal Shell trade for Shell Bell (not modeled here).',
    ],
  },
  {
    locationId: 'mossdeep-city',
    displayName: 'Mossdeep City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Tate & Liza Gym (Psychic, double battle). Space Center on the south side.',
      "Steven's house here gives HM08 Dive (RS) — story-gated.",
    ],
  },
  {
    locationId: 'route-127',
    displayName: 'Route 127',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: [
      'Ocean east of Mossdeep, connects to Route 128.',
      'Dive spots deferred (Clamperl/Relicanth/Chinchou) — see Route 124 note.',
    ],
  },
  {
    locationId: 'route-128',
    displayName: 'Route 128',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Luvdisc', ['Water'], 'Super Rod'),
    ],
    notes: [
      'Ocean route directly above Seafloor Cavern entrance.',
      'Dive spot leads to Seafloor Cavern.',
    ],
  },
  {
    locationId: 'seafloor-cavern',
    displayName: 'Seafloor Cavern',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
    ],
    notes: [
      'Endgame cave where Aqua/Magma awaken the legendary. Multi-floor with current-puzzle gating.',
      'Leader battle here is version-split (see boss data). Kyogre/Groudon awakening cutscene plays after the leader fight — capture happens at Cave of Origin (RS) or postgame (Emerald).',
    ],
  },
  {
    locationId: 'route-126',
    displayName: 'Route 126',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Wailmer', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Ocean surrounding Sootopolis. Dive spot leads down into the underwater entrance to Sootopolis.'],
  },
  {
    locationId: 'sootopolis-city',
    displayName: 'Sootopolis City',
    encounters: [
      surf('Magikarp', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
    ],
    notes: [
      'Crater city accessed by Dive (or via Wallace/Juan story event). Sootopolis Gym (Water).',
      'Emerald story: Groudon vs Kyogre clash in the city center — Rayquaza descent + Sky Pillar climb resolves it.',
    ],
  },
  {
    locationId: 'cave-of-origin',
    displayName: 'Cave of Origin',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Groudon', ['Ground'], 'legendary', 'Ruby', 'Ruby static legendary at Lv 45 — story-mandatory.'),
      encounter('Kyogre', ['Water'], 'legendary', 'Sapphire', 'Sapphire static legendary at Lv 45 — story-mandatory.'),
    ],
    notes: [
      'Sootopolis-floor cave. Wallace/Juan unlocks entry after the Sootopolis clash cutscene.',
      'Ruby: Groudon Lv 45 captured here. Sapphire: Kyogre Lv 45 captured here.',
      'Emerald: neither legendary is captured here — story shows both clashing, then both flee. Postgame captures happen at Terra Cave (Groudon) / Marine Cave (Kyogre) via roaming weather events — deferred.',
    ],
  },
  {
    locationId: 'aqua-magma-hideout',
    displayName: 'Team Aqua / Team Magma Hideout',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      surf('Magikarp', ['Water']),
    ],
    notes: [
      'Lilycove Aqua Hideout (Sapphire / Emerald) and Jagged Pass Magma Hideout (Emerald) collapsed into one entry. Ruby Magma Hideout is at Mt. Chimney area — separate. TODO: split if per-version layout differs meaningfully for tracking.',
      'Wild encounter table is the same minimal Zubat/Golbat/Magikarp set across all hideouts.',
    ],
  },

  // =====================================================================================
  // RSE Final Mainline + Legendary Sweep — Pacifidlog through League + regis + Rayquaza.
  // =====================================================================================
  {
    locationId: 'route-129',
    displayName: 'Route 129',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Wailord', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Ocean route between Sootopolis and the eastern islands.'],
  },
  {
    locationId: 'route-130',
    displayName: 'Route 130',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Ocean route — Mirage Island is canonically here (Wynaut wild encounters when active; pseudo-RNG appearance, deferred).'],
  },
  {
    locationId: 'route-131',
    displayName: 'Route 131',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Ocean route leading to Pacifidlog Town.'],
  },
  {
    locationId: 'pacifidlog-town',
    displayName: 'Pacifidlog Town',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
    ],
    notes: ['Floating logs village. No grass; Move Tutor (Mimic / Dynamic Punch in Emerald).'],
  },
  {
    locationId: 'sky-pillar',
    displayName: 'Sky Pillar',
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave'),
      encounter('Claydol', ['Ground', 'Psychic'], 'cave'),
      encounter('Banette', ['Ghost'], 'cave'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'All', 'Rare cave spawn.'),
      encounter('Altaria', ['Dragon', 'Flying'], 'cave'),
      encounter('Rayquaza', ['Dragon', 'Flying'], 'legendary', 'Emerald', 'Story-mandatory Lv 70 capture in Emerald — descend Sky Pillar to stop Groudon/Kyogre at Sootopolis.'),
      encounter('Rayquaza', ['Dragon', 'Flying'], 'legendary', 'RS', 'Postgame Lv 70 static at the Sky Pillar summit in Ruby/Sapphire (requires Mach Bike to ascend, accessible after defeating the League).'),
    ],
    notes: [
      'Spiral tower south of Pacifidlog. Mach Bike required for the upper-floor cracked-tile traversal.',
      'Rayquaza Lv 70 at the summit: story-mandatory in Emerald (must catch/defeat to calm Groudon/Kyogre clash); postgame static in Ruby/Sapphire.',
    ],
  },
  {
    locationId: 'route-132',
    displayName: 'Route 132',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      surf('Sharpedo', ['Water', 'Dark'], 'All', 'Surf encounter — common in deeper ocean.'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Horsea', ['Water'], 'Super Rod', 'All', 'Rare Super Rod encounter in deep ocean.'),
    ],
    notes: ['Open ocean east of Pacifidlog. Sharpedo populations increase.'],
  },
  {
    locationId: 'route-133',
    displayName: 'Route 133',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      surf('Sharpedo', ['Water', 'Dark']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Horsea', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
    ],
    notes: ['Open ocean continuing east toward Ever Grande.'],
  },
  {
    locationId: 'route-134',
    displayName: 'Route 134',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      surf('Wailmer', ['Water']),
      surf('Sharpedo', ['Water', 'Dark']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Horsea', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
    ],
    notes: ['Final ocean approach to Ever Grande City. Strong currents.'],
  },
  {
    locationId: 'ever-grande-city',
    displayName: 'Ever Grande City',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wingull', ['Water', 'Flying']),
      surf('Pelipper', ['Water', 'Flying']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
      fish('Luvdisc', ['Water'], 'Super Rod', 'All', 'Pink coral beach Super Rod.'),
    ],
    notes: ['Island city housing Victory Road + Pokémon League. Coral beach + Wallace plotline (Emerald).'],
  },
  {
    locationId: 'victory-road-hoenn',
    displayName: 'Victory Road',
    encounters: [
      // 3 floors union per Bulbapedia.
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Whismur', ['Normal'], 'cave'),
      encounter('Loudred', ['Normal'], 'cave'),
      encounter('Aron', ['Steel', 'Rock'], 'cave'),
      encounter('Lairon', ['Steel', 'Rock'], 'cave'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 'Ruby', 'Ruby-exclusive — Sapphire swaps with Mawile.'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 'Emerald'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'Sapphire', 'Sapphire-exclusive — Ruby swaps with Sableye.'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 'Emerald'),
      encounter('Hariyama', ['Fighting'], 'cave'),
      encounter('Medicham', ['Fighting', 'Psychic'], 'cave'),
      surf('Golbat', ['Poison', 'Flying']),
      surf('Whiscash', ['Water', 'Ground']),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      '3-floor cave union; per-floor rates differ per Bulbapedia.',
      'Sableye Ruby-exclusive vs Mawile Sapphire-exclusive (B2F-ish split, both in Emerald).',
    ],
  },
  {
    locationId: 'pokemon-league-hoenn',
    displayName: 'Pokémon League',
    encounters: [],
    notes: ['No wild encounter table. Elite Four + Champion modeled as boss data.'],
  },
  {
    locationId: 'sealed-chamber',
    displayName: 'Sealed Chamber',
    encounters: [],
    notes: [
      'Underwater chamber south of Pacifidlog. Solving the braille puzzle (with Relicanth + Wailord in the party, Dig in front of the back wall) unlocks the three Regi tombs across Hoenn.',
      'No wild encounters. Puzzle prerequisites: Surf + Dive HMs, Wailord (front of party) + Relicanth (back of party).',
    ],
  },
  {
    locationId: 'desert-ruins',
    displayName: 'Desert Ruins',
    encounters: [
      encounter('Regirock', ['Rock'], 'legendary', 'All', 'Lv 40 static legendary. Braille puzzle: take 2 steps right + 2 down from center → Strength on the boulder. Requires Sealed Chamber unlock first.'),
    ],
    notes: ['Northern desert (Route 111). Contains Regirock at Lv 40 after solving the braille puzzle (post-Sealed Chamber).'],
  },
  {
    locationId: 'island-cave',
    displayName: 'Island Cave',
    encounters: [
      encounter('Regice', ['Ice'], 'legendary', 'All', 'Lv 40 static legendary. Braille puzzle differs by version (RS: wait 2 minutes after reading inscription; Emerald: walk around the perimeter without stopping). Requires Sealed Chamber unlock first.'),
    ],
    notes: ['Route 105 island. Contains Regice at Lv 40 after solving the braille puzzle (post-Sealed Chamber). Puzzle solution differs RS vs Emerald — documented in row note.'],
  },
  {
    locationId: 'ancient-tomb',
    displayName: 'Ancient Tomb',
    encounters: [
      encounter('Registeel', ['Steel'], 'legendary', 'All', 'Lv 40 static legendary. Braille puzzle: stand in the center and use Flash (RS) / Fly (Emerald). Requires Sealed Chamber unlock first.'),
    ],
    notes: ['Route 120 tomb. Contains Registeel at Lv 40 after solving the braille puzzle (post-Sealed Chamber).'],
  },
  {
    locationId: 'new-mauville',
    displayName: 'New Mauville',
    encounters: [
      encounter('Voltorb', ['Electric'], 'cave'),
      encounter('Magnemite', ['Electric', 'Steel'], 'cave'),
      encounter('Magneton', ['Electric', 'Steel'], 'cave', 'All', 'Deeper interior.'),
      encounter('Electrode', ['Electric'], 'cave', 'All', 'Deeper interior.'),
    ],
    notes: ['Underground power facility beneath Mauville. Accessed via the Mauville back-room after speaking to Wattson (post-gym). Story event: solve the generator puzzle to receive Thunderstone.'],
  },
  {
    locationId: 'abandoned-ship',
    displayName: 'Abandoned Ship',
    encounters: [
      surf('Tentacool', ['Water', 'Poison']),
      fish('Tentacool', ['Water', 'Poison'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
      fish('Wailmer', ['Water'], 'Super Rod'),
    ],
    notes: [
      'Wrecked S.S. Cactus on Route 108. Interior is trainer/item content (no wild grass).',
      'Storage Key + Devon Scope upgrades + Scanner item are story-relevant. Wild encounters limited to surf/fish around the wreck.',
    ],
  },
  {
    locationId: 'mirage-tower',
    displayName: 'Mirage Tower / Desert Underpass',
    encounters: [
      encounter('Trapinch', ['Ground'], 'cave', 'Emerald', 'Mirage Tower interior (Emerald-exclusive structure in Route 111 desert).'),
      encounter('Sandshrew', ['Ground'], 'cave', 'Emerald', 'Mirage Tower interior.'),
      encounter('Cacnea', ['Grass'], 'cave', 'Emerald', 'Mirage Tower interior.'),
      encounter('Anorith', ['Rock', 'Bug'], 'gift', 'All', 'Claw Fossil revival at Devon Corporation (Rustboro). Choose between Anorith (Claw Fossil) and Lileep (Root Fossil) — the unchosen fossil + Pokémon become unobtainable in your save.'),
      encounter('Lileep', ['Rock', 'Grass'], 'gift', 'All', 'Root Fossil revival at Devon Corporation (Rustboro). Mutually exclusive with Anorith choice above.'),
    ],
    notes: [
      'Mirage Tower is Emerald-exclusive (Route 111 desert) and collapses after fossil retrieval — Trapinch/Sandshrew/Cacnea wild encounters only available before the collapse cutscene.',
      'In Ruby/Sapphire the fossil choice happens at the Desert Underpass / desert ruins area instead.',
      'Fossil revival at Devon Corp = gift encounter. Anorith vs Lileep are mutually exclusive.',
    ],
  },
  {
    locationId: 'southern-island',
    displayName: 'Southern Island',
    encounters: [
      encounter('Latias', ['Dragon', 'Psychic'], 'legendary', 'Sapphire', 'Lv 50 static — requires Eon Ticket (Mystery Gift event item). RS: opposite Eon Pokémon is the roamer; the static here is the version-paired Eon Pokémon.'),
      encounter('Latios', ['Dragon', 'Psychic'], 'legendary', 'Ruby', 'Lv 50 static — requires Eon Ticket. RS Eon Ticket logic: Ruby gets Latias roamer (TODO) + Latios static here; Sapphire gets Latios roamer (TODO) + Latias static here.'),
      encounter('Latias', ['Dragon', 'Psychic'], 'legendary', 'Emerald', 'Lv 40 static — Emerald: player chooses Latias OR Latios via TV event at home (Littleroot), then the other appears here with the Eon Ticket.'),
      encounter('Latios', ['Dragon', 'Psychic'], 'legendary', 'Emerald'),
    ],
    notes: [
      'Eon Ticket event island. Mechanics differ significantly between RS and Emerald.',
      'RS roaming Latias/Latios (the version-opposite Eon Pokémon) intentionally NOT modeled — roaming legendary tracking is schema TODO. Only the Eon Ticket static is listed here.',
    ],
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
  'Pass 1 covers Littleroot through Rusturf Tunnel; Pass 2 extends through Dewford / Granite Cave / Slateport / Mauville / Verdanturf; Pass 3 extends through Route 111 / Fiery Path / Fallarbor / Meteor Falls / Mt. Chimney / Lavaridge; Pass 4 extends through Routes 118-123 / Weather Institute / Fortree / Lilycove / Mt. Pyre; Pass 5 extends through Routes 124-128 / Shoal Cave / Mossdeep / Sootopolis / Cave of Origin / Seafloor Cavern / Aqua-Magma Hideout. Route 119 Feebas tile mechanic + Safari Zone area partitioning remain TODO.',
  'Honey trees (Gen 4 only), Poké Radar, Pokéblocks/Safari Zone mechanics, dual-slot, day/night gating, and trainer-rematch tables are not modeled this pass.',
  'Mirage Tower / Desert Underpass / Sky Pillar legendary placements are deferred to a later legendary-focused pass.',
  'New Mauville interior, Trick House, and Abandoned Ship require dedicated handling and are deferred.',
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
