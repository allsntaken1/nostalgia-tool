import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

type HgssVersion = 'Both' | 'HeartGold' | 'SoulSilver';
type HgssEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';
type HgssRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

type HgssEncounter = {
  species: string;
  types: PokemonType[];
  method: HgssEncounterMethod;
  version: HgssVersion;
  notes?: string;
  /** Optional rod tier for fishing entries (passes through to UI chip). */
  rod?: HgssRod;
  /** Optional condition annotation: "Rock Smash", "Headbutt", "Morning", "Day", "Night", etc. */
  condition?: string;
};

type HgssEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: HgssEncounter[];
  notes: string[];
};

const conditionTodo = 'TODO: condition-specific encounter data not fully represented: morning/day/night/radio/swarm/etc.';
const rodTodo = 'Fishing rod tiers were collapsed to a single fishing option per species in earlier passes; Pass 2 adds the optional `rod` field where verified, leaving legacy entries unchanged.';

const encounter = (
  species: string,
  types: PokemonType[],
  method: HgssEncounterMethod,
  version: HgssVersion = 'Both',
  notes?: string,
  extras: { rod?: HgssRod; condition?: string } = {},
): HgssEncounter => ({
  species,
  types,
  method,
  version,
  notes,
  ...extras,
});

/** Fishing helper with explicit rod tier. */
const fish = (
  species: string,
  types: PokemonType[],
  rod: HgssRod,
  version: HgssVersion = 'Both',
  notes?: string,
): HgssEncounter => encounter(species, types, 'fishing', version, notes, { rod });

/** Rock Smash helper — uses method "special" + condition annotation (matches BW pattern). */
const rockSmash = (
  species: string,
  types: PokemonType[],
  version: HgssVersion = 'Both',
  notes?: string,
): HgssEncounter => encounter(species, types, 'special', version, notes, { condition: 'Rock Smash' });

/** Headbutt helper — uses method "special" + condition annotation. */
const headbutt = (
  species: string,
  types: PokemonType[],
  version: HgssVersion = 'Both',
  notes?: string,
): HgssEncounter => encounter(species, types, 'special', version, notes, { condition: 'Headbutt' });

export const hgssEncounterAreas: HgssEncounterArea[] = [
  {
    locationId: 'new-bark-town',
    displayName: 'New Bark Town',
    encounters: [
      encounter('Chikorita', ['Grass'], 'gift', 'Both', 'Professor Elm starter gift.'),
      encounter('Cyndaquil', ['Fire'], 'gift', 'Both', 'Professor Elm starter gift.'),
      encounter('Totodile', ['Water'], 'gift', 'Both', 'Professor Elm starter gift.'),
    ],
    notes: ['Starter choice is represented as gift options here; the run model still stores starter type only.'],
  },
  {
    locationId: 'johto-route-29',
    displayName: 'Johto Route 29',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Sentret', ['Normal'], 'grass'),
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Plusle', ['Electric'], 'special', 'Both', 'Pokegear Hoenn Sound encounter.'),
      encounter('Minun', ['Electric'], 'special', 'Both', 'Pokegear Hoenn Sound encounter.'),
      encounter('Shinx', ['Electric'], 'special', 'Both', 'Pokegear Sinnoh Sound encounter.'),
    ],
    notes: [
      'Time-of-day rates are real HGSS conditions but are not represented in the current flat encounter schema.',
      'Headbutt Group A/B encounters are intentionally omitted until condition support is added.',
    ],
  },
  {
    locationId: 'johto-route-30',
    displayName: 'Johto Route 30',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'HeartGold'),
      encounter('Metapod', ['Bug'], 'grass', 'HeartGold'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass', 'HeartGold'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [
      'Grass time/version split preserved from source notes; current UI does not expose morning/day/night.',
      rodTodo,
      'Headbutt and radio encounters are TODO until condition support is added.',
    ],
  },
  {
    locationId: 'johto-route-31',
    displayName: 'Johto Route 31',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'HeartGold'),
      encounter('Metapod', ['Bug'], 'grass', 'HeartGold'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass', 'SoulSilver'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass', 'HeartGold'),
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'violet-city',
    displayName: 'Violet City',
    encounters: [
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Togepi', ['Normal'], 'gift', 'Both', 'Professor Elm aide Egg gift after Violet Gym.'),
    ],
    notes: [rodTodo, 'Swarm-specific fishing data is TODO until condition support is added.'],
  },
  {
    locationId: 'sprout-tower',
    displayName: 'Sprout Tower',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Gastly', ['Ghost', 'Poison'], 'cave'),
    ],
    notes: ['Sprout Tower floors are collapsed into one area for now.', conditionTodo],
  },
  {
    locationId: 'johto-route-32',
    displayName: 'Johto Route 32',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Ekans', ['Poison'], 'grass', 'SoulSilver'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Bellsprout', ['Grass', 'Poison'], 'grass'),
      encounter('Mareep', ['Electric'], 'grass'),
      encounter('Hoppip', ['Grass', 'Flying'], 'grass'),
      encounter('Wooper', ['Water', 'Ground'], 'grass'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Quagsire', ['Water', 'Ground'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Route 32 page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Good Rod'),
      fish('Qwilfish', ['Water', 'Poison'], 'Good Rod', 'Both', 'Rare 5% Good Rod encounter.'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Tentacool', ['Water', 'Poison'], 'Super Rod'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter (Route 32 is the primary Qwilfish route).'),
      // Headbutt — Group A/B per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
    ],
    notes: ['Qwilfish has a documented swarm-fishing modifier on Route 32; current data lists baseline tiered rates only.', conditionTodo],
  },
  {
    locationId: 'ruins-of-alph',
    displayName: 'Ruins of Alph',
    encounters: [
      encounter('Natu', ['Psychic', 'Flying'], 'cave'),
      encounter('Smeargle', ['Normal'], 'cave'),
      encounter('Unown', ['Psychic'], 'cave'),
      encounter('Wooper', ['Water', 'Ground'], 'surfing'),
      encounter('Quagsire', ['Water', 'Ground'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: ['Ruins chambers, Unown puzzle state, and radio conditions are collapsed into one area for now.', conditionTodo],
  },
  {
    locationId: 'union-cave',
    displayName: 'Union Cave',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Sandshrew', ['Ground'], 'cave', 'HeartGold'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Onix', ['Rock', 'Ground'], 'cave'),
      encounter('Raticate', ['Normal'], 'cave'),
      encounter('Wooper', ['Water', 'Ground'], 'surfing'),
      encounter('Quagsire', ['Water', 'Ground'], 'surfing'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      // Fishing — 1F/B1F (Goldeen line) — Old Rod / Good Rod / Super Rod tiers per Bulbapedia.
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Fishing — B2F (Krabby line + Corsola) — Old Rod / Good Rod / Super Rod tiers per Bulbapedia.
      fish('Magikarp', ['Water'], 'Old Rod', 'Both', 'B2F fishing.'),
      fish('Krabby', ['Water'], 'Old Rod', 'Both', 'B2F fishing.'),
      fish('Magikarp', ['Water'], 'Good Rod', 'Both', 'B2F fishing.'),
      fish('Krabby', ['Water'], 'Good Rod', 'Both', 'B2F fishing.'),
      fish('Corsola', ['Water', 'Rock'], 'Good Rod', 'Both', 'B2F fishing.'),
      fish('Magikarp', ['Water'], 'Super Rod', 'Both', 'B2F fishing.'),
      fish('Krabby', ['Water'], 'Super Rod', 'Both', 'B2F fishing.'),
      fish('Kingler', ['Water'], 'Super Rod', 'Both', 'B2F fishing.'),
      fish('Corsola', ['Water', 'Rock'], 'Super Rod', 'Both', 'B2F fishing.'),
      // Staryu retained as Super Rod placeholder — Bulbapedia HG/SS table did not list it; flagging for verify.
      encounter('Staryu', ['Water'], 'fishing', 'Both', 'TODO: verify Staryu fishing slot at Union Cave; not surfaced on Bulbapedia HG/SS table this pass.'),
      encounter('Lapras', ['Water', 'Ice'], 'static', 'HeartGold', 'Friday static encounter in the lower Union Cave pool.'),
    ],
    notes: [
      'Union Cave floors are collapsed into one area; rod tiers split per Bulbapedia (Union Cave page).',
      'B2F has the Krabby/Corsola tables; 1F/B1F have the Goldeen/Seaking table.',
      'Friday Lapras and Arceus event conditions are real HGSS conditions but not fully represented by the current schema.',
      conditionTodo,
    ],
  },
  {
    locationId: 'johto-route-33',
    displayName: 'Johto Route 33',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Ekans', ['Poison'], 'grass', 'SoulSilver'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Hoppip', ['Grass', 'Flying'], 'grass'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'azalea-town',
    displayName: 'Azalea Town',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Azalea Town.'],
  },
  {
    locationId: 'slowpoke-well',
    displayName: 'Slowpoke Well',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'cave'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'surfing'),
      encounter('Slowbro', ['Water', 'Psychic'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Slowpoke Well page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Pokégear radio encounters — B1F entrance.
      encounter('Makuhita', ['Fighting'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter (B1F).', { condition: 'Hoenn Sound' }),
      encounter('Absol', ['Dark'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter (B1F).', { condition: 'Hoenn Sound' }),
      encounter('Chingling', ['Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter (B1F).', { condition: 'Sinnoh Sound' }),
      encounter('Bronzor', ['Steel', 'Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter (B1F).', { condition: 'Sinnoh Sound' }),
    ],
    notes: ['B1F and B2F walking tables differ (B2F adds Golbat); fishing/surf tables shared. Verified per Bulbapedia (Slowpoke Well page).', conditionTodo],
  },
  {
    locationId: 'ilex-forest',
    displayName: 'Ilex Forest',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'HeartGold'),
      encounter('Metapod', ['Bug'], 'grass', 'HeartGold'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Paras', ['Bug', 'Grass'], 'grass'),
      encounter('Psyduck', ['Water'], 'surfing'),
      encounter('Golduck', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Ilex Forest page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Poliwag', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Poliwag', ['Water'], 'Super Rod'),
      // Headbutt — Group A (Lv 3-5) + Group B (Lv 6-8) per Bulbapedia.
      headbutt('Caterpie', ['Bug'], 'Both', 'Headbutt Group A.'),
      headbutt('Metapod', ['Bug'], 'Both', 'Headbutt Group A.'),
      headbutt('Weedle', ['Bug', 'Poison'], 'Both', 'Headbutt Group A.'),
      headbutt('Kakuna', ['Bug', 'Poison'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B trees.'),
      headbutt('Butterfree', ['Bug', 'Flying'], 'Both', 'Headbutt Group B.'),
      headbutt('Beedrill', ['Bug', 'Poison'], 'Both', 'Headbutt Group B.'),
      headbutt('Noctowl', ['Normal', 'Flying'], 'Both', 'Headbutt Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group B.'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'johto-route-34',
    displayName: 'Johto Route 34',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Krabby', ['Water'], 'fishing'),
      encounter('Kingler', ['Water'], 'fishing'),
      encounter('Staryu', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Corsola', ['Water', 'Rock'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'goldenrod-city',
    displayName: 'Goldenrod City',
    encounters: [
      encounter('Spearow', ['Normal', 'Flying'], 'gift', 'Both', 'Kenya gift Spearow delivery sidequest.'),
      encounter('Eevee', ['Normal'], 'gift', 'Both', 'Bill gift Eevee.'),
    ],
    notes: ['Game Corner prize Pokemon are TODO because coin-cost conditions are not represented in the current schema.'],
  },
  {
    locationId: 'johto-route-35',
    displayName: 'Johto Route 35',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('NidoranF', ['Poison'], 'grass'),
      encounter('NidoranM', ['Poison'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Yanma', ['Bug', 'Flying'], 'grass'),
      encounter('Psyduck', ['Water'], 'surfing'),
      encounter('Golduck', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Route 35 page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Poliwag', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Poliwag', ['Water'], 'Super Rod'),
      // Headbutt — Group A/B per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      headbutt('Ledyba', ['Bug', 'Flying'], 'HeartGold', 'Headbutt Group B, HeartGold-only.'),
      headbutt('Spinarak', ['Bug', 'Poison'], 'SoulSilver', 'Headbutt Group B, SoulSilver-only.'),
    ],
    notes: ['Yanma swarm available on Route 35.', conditionTodo],
  },
  {
    locationId: 'national-park',
    displayName: 'National Park',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'HeartGold'),
      encounter('Metapod', ['Bug'], 'grass', 'HeartGold'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Sunkern', ['Grass'], 'grass'),
      // Headbutt — Group A (Lv 10-12) per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      // Headbutt — Group B (Lv 13-15) per Bulbapedia.
      headbutt('Ledyba', ['Bug', 'Flying'], 'HeartGold', 'Headbutt Group B, HeartGold-only.'),
      headbutt('Spinarak', ['Bug', 'Poison'], 'SoulSilver', 'Headbutt Group B, SoulSilver-only.'),
      // Northeast cliff Headbutt trees (Rock Climb required, Lv 18-25).
      headbutt('Cherubi', ['Grass'], 'Both', 'Northeast cliff Headbutt tree (requires Rock Climb).'),
    ],
    notes: [
      'Bug-Catching Contest data is TODO until condition support is added.',
      'Northeast cliff Headbutt trees require Rock Climb (post-badge progression).',
      conditionTodo,
    ],
  },
  {
    locationId: 'johto-route-36',
    displayName: 'Johto Route 36',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('NidoranF', ['Poison'], 'grass'),
      encounter('NidoranM', ['Poison'], 'grass'),
      encounter('Growlithe', ['Fire'], 'grass', 'HeartGold'),
      encounter('Vulpix', ['Fire'], 'grass', 'SoulSilver'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Stantler', ['Normal'], 'grass'),
      encounter('Sudowoodo', ['Rock'], 'static', 'Both', 'SquirtBottle static encounter.'),
      // Headbutt — Group A (Lv 4-5) per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      // Headbutt — Group B (Lv 6-7) per Bulbapedia.
      headbutt('Ledyba', ['Bug', 'Flying'], 'HeartGold', 'Headbutt Group B, HeartGold-only.'),
      headbutt('Spinarak', ['Bug', 'Poison'], 'SoulSilver', 'Headbutt Group B, SoulSilver-only.'),
      // Pokégear radio encounters.
      encounter('Plusle', ['Electric'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Minun', ['Electric'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Shinx', ['Electric'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter.', { condition: 'Sinnoh Sound' }),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'johto-route-37',
    displayName: 'Johto Route 37',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Pidgeotto', ['Normal', 'Flying'], 'grass'),
      encounter('Growlithe', ['Fire'], 'grass', 'HeartGold'),
      encounter('Vulpix', ['Fire'], 'grass', 'SoulSilver'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass', 'SoulSilver'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass', 'SoulSilver'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass', 'HeartGold'),
      encounter('Stantler', ['Normal'], 'grass'),
      // Headbutt — Group A (Lv 12-14) + Group B (Lv 15-17) per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      headbutt('Ledyba', ['Bug', 'Flying'], 'Both', 'Headbutt Group B (Route 37 page lists Ledyba in both versions; existing grass split may differ).'),
      headbutt('Spinarak', ['Bug', 'Poison'], 'Both', 'Headbutt Group B (Route 37 page lists Spinarak in both versions; existing grass split may differ).'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'ecruteak-city',
    displayName: 'Ecruteak City',
    encounters: [
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [rodTodo],
  },
  {
    locationId: 'burned-tower',
    displayName: 'Burned Tower',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Raticate', ['Normal'], 'cave'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Koffing', ['Poison'], 'cave'),
      encounter('Magmar', ['Fire'], 'cave'),
    ],
    notes: ['Burned Tower floors are collapsed into one area for now.', conditionTodo],
  },
  {
    locationId: 'johto-route-38',
    displayName: 'Johto Route 38',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass', 'HeartGold'),
      encounter('Meowth', ['Normal'], 'grass', 'SoulSilver'),
      encounter('Farfetchd', ['Normal', 'Flying'], 'grass'),
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Snubbull', ['Normal'], 'grass'),
      encounter('Miltank', ['Normal'], 'grass'),
      // Headbutt — Group A (Lv 13-14) per Bulbapedia.
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt Group A.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      // Headbutt — Group B (Lv 15-16) per Bulbapedia.
      headbutt('Ledyba', ['Bug', 'Flying'], 'HeartGold', 'Headbutt Group B, HeartGold-only.'),
      headbutt('Spinarak', ['Bug', 'Poison'], 'SoulSilver', 'Headbutt Group B, SoulSilver-only.'),
      // Special eastern Route 38 tree (via Route 39 connection) — Heracross-adjacent tree.
      headbutt('Burmy', ['Bug'], 'Both', 'Special eastern Headbutt tree (Plant Cloak).'),
    ],
    notes: [
      conditionTodo,
      'Group-A vs Group-B Headbutt trees are aggregated under method "special" + condition "Headbutt"; the per-tree grouping detail lives in the per-entry notes.',
    ],
  },
  {
    locationId: 'johto-route-39',
    displayName: 'Johto Route 39',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass', 'HeartGold'),
      encounter('Raticate', ['Normal'], 'grass'),
      encounter('Meowth', ['Normal'], 'grass', 'SoulSilver'),
      encounter('Farfetchd', ['Normal', 'Flying'], 'grass'),
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Miltank', ['Normal'], 'grass'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'olivine-city',
    displayName: 'Olivine City',
    encounters: [
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Krabby', ['Water'], 'fishing'),
      encounter('Kingler', ['Water'], 'fishing'),
      encounter('Staryu', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Corsola', ['Water', 'Rock'], 'fishing'),
    ],
    notes: [rodTodo],
  },
  {
    locationId: 'olivine-lighthouse',
    displayName: 'Olivine Lighthouse',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Olivine Lighthouse.'],
  },
  {
    locationId: 'johto-route-40',
    displayName: 'Johto Route 40',
    encounters: [
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Route 40 page). Corsola is day-only and Staryu is night-only at this route.
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Krabby', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Krabby', ['Water'], 'Good Rod'),
      fish('Corsola', ['Water', 'Rock'], 'Good Rod', 'Both', 'Day-only Good Rod encounter (10%).'),
      fish('Staryu', ['Water'], 'Good Rod', 'Both', 'Night-only Good Rod encounter (10%).'),
      fish('Krabby', ['Water'], 'Super Rod'),
      fish('Kingler', ['Water'], 'Super Rod'),
      fish('Corsola', ['Water', 'Rock'], 'Super Rod', 'Both', 'Day-only Super Rod encounter (30%).'),
      fish('Staryu', ['Water'], 'Super Rod', 'Both', 'Night-only Super Rod encounter (30%).'),
    ],
    notes: ['Corsola is day-only and Staryu is night-only on Route 40 fishing; time-of-day matrix is not yet rendered as a chip.'],
  },
  {
    locationId: 'johto-route-41',
    displayName: 'Johto Route 41',
    encounters: [
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Mantine', ['Water', 'Flying'], 'surfing', 'HeartGold'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Shellder', ['Water'], 'fishing'),
      encounter('Chinchou', ['Water', 'Electric'], 'fishing'),
      encounter('Lanturn', ['Water', 'Electric'], 'fishing'),
    ],
    notes: ['Route 41 was verified from Pokemon Database because PokéAPI does not expose a HGSS location-area for it.', rodTodo],
  },
  {
    locationId: 'cianwood-city',
    displayName: 'Cianwood City',
    encounters: [
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Krabby', ['Water'], 'fishing'),
      encounter('Kingler', ['Water'], 'fishing'),
      encounter('Staryu', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Corsola', ['Water', 'Rock'], 'fishing'),
      encounter('Shuckle', ['Bug', 'Rock'], 'gift', 'Both', 'Mania gift Shuckle sidequest.'),
    ],
    notes: [rodTodo, 'Rock Smash encounters are TODO until condition support is added.'],
  },
  {
    locationId: 'johto-route-42',
    displayName: 'Johto Route 42',
    encounters: [
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Zubat', ['Poison', 'Flying'], 'grass'),
      encounter('Mankey', ['Fighting'], 'grass', 'HeartGold'),
      encounter('Mareep', ['Electric'], 'grass'),
      encounter('Flaaffy', ['Electric'], 'grass'),
      encounter('Goldeen', ['Water'], 'surfing'),
      encounter('Seaking', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia.
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Headbutt — Group A (Lv 13-14) includes Heracross (a notable signature route).
      headbutt('Spearow', ['Normal', 'Flying'], 'Both', 'Headbutt Group A.'),
      headbutt('Aipom', ['Normal'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Heracross', ['Bug', 'Fighting'], 'Both', 'Headbutt Group A (Route 42 is the canonical Heracross route — 30% rate).'),
    ],
    notes: ['Heracross is reliably encountered via Route 42 Headbutt at 30% rate per Bulbapedia.', conditionTodo],
  },
  {
    locationId: 'mt-mortar',
    displayName: 'Mt. Mortar',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Raticate', ['Normal'], 'cave'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Machop', ['Fighting'], 'cave'),
      encounter('Machoke', ['Fighting'], 'cave'),
      encounter('Marill', ['Water'], 'cave'),
      encounter('Goldeen', ['Water'], 'surfing'),
      encounter('Seaking', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Mt. Mortar page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      encounter('Tyrogue', ['Fighting'], 'gift', 'Both', 'Karate King Kiyo gift after battle.'),
    ],
    notes: ['Mt. Mortar floors are collapsed into one area; rod tiers split per Bulbapedia.', conditionTodo],
  },
  {
    locationId: 'mahogany-town',
    displayName: 'Mahogany Town',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Mahogany Town.'],
  },
  {
    locationId: 'johto-route-43',
    displayName: 'Johto Route 43',
    encounters: [
      encounter('Pidgeotto', ['Normal', 'Flying'], 'grass'),
      encounter('Venonat', ['Bug', 'Poison'], 'grass'),
      encounter('Mareep', ['Electric'], 'grass'),
      encounter('Flaaffy', ['Electric'], 'grass'),
      encounter('Girafarig', ['Normal', 'Psychic'], 'grass'),
      encounter('Magikarp', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'lake-of-rage',
    displayName: 'Lake of Rage',
    encounters: [
      encounter('Magikarp', ['Water'], 'surfing'),
      encounter('Gyarados', ['Water', 'Flying'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Lake of Rage page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Good Rod', 'Both', 'Rare 10% Good Rod encounter.'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod', 'Both', 'Super Rod encounter (30% rate).'),
      // Headbutt — Group A (Lv 14-16) + Group B (Lv 17-19).
      headbutt('Exeggcute', ['Grass', 'Psychic'], 'Both', 'Headbutt Group A.'),
      headbutt('Hoothoot', ['Normal', 'Flying'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Pineco', ['Bug'], 'Both', 'Headbutt Group A.'),
      headbutt('Venonat', ['Bug', 'Poison'], 'Both', 'Headbutt Group B.'),
      encounter('Gyarados', ['Water', 'Flying'], 'static', 'Both', 'Red (shiny) Gyarados story encounter at level 30; respawns after Hall of Fame.'),
    ],
    notes: ['Rod tiers split per Bulbapedia.', 'Red Gyarados is a guaranteed shiny static at level 30 in the lake center.'],
  },
  {
    locationId: 'team-rocket-hq',
    displayName: 'Team Rocket HQ',
    encounters: [
      encounter('Electrode', ['Electric'], 'static', 'Both', 'Generator room static encounters.'),
      encounter('Voltorb', ['Electric'], 'special', 'Both', 'Security trap encounter.'),
      encounter('Koffing', ['Poison'], 'special', 'Both', 'Security trap encounter.'),
      encounter('Geodude', ['Rock', 'Ground'], 'special', 'Both', 'Security trap encounter.'),
    ],
    notes: ['Rocket HQ security traps and generator statics are special HGSS conditions.'],
  },
  {
    locationId: 'johto-route-44',
    displayName: 'Johto Route 44',
    encounters: [
      encounter('Weepinbell', ['Grass', 'Poison'], 'grass'),
      encounter('Lickitung', ['Normal'], 'grass'),
      encounter('Tangela', ['Grass'], 'grass'),
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Route 44 page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Poliwag', ['Water'], 'Good Rod'),
      fish('Remoraid', ['Water'], 'Good Rod', 'Both', 'Rare 5% Good Rod encounter.'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Poliwag', ['Water'], 'Super Rod'),
      fish('Remoraid', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Headbutt — Group A includes Heracross 30%, second canonical HGSS Heracross route after Route 42.
      headbutt('Spearow', ['Normal', 'Flying'], 'Both', 'Headbutt Group A.'),
      headbutt('Aipom', ['Normal'], 'Both', 'Headbutt — appears in both Group A and Group B.'),
      headbutt('Heracross', ['Bug', 'Fighting'], 'Both', 'Headbutt Group A (Route 44 is the second canonical Heracross Headbutt route — 30% rate).'),
    ],
    notes: ['Heracross also appears here via Headbutt at 30% (matches Route 42 pattern).', conditionTodo],
  },
  {
    locationId: 'ice-path',
    displayName: 'Ice Path',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Jynx', ['Ice', 'Psychic'], 'cave'),
      encounter('Swinub', ['Ice', 'Ground'], 'cave'),
      encounter('Delibird', ['Ice', 'Flying'], 'cave', 'HeartGold', 'HeartGold-only cave encounter (20% rate).'),
      // Pokégear-radio encounters (Hoenn/Sinnoh Sound) — flagged for future radio-condition support.
      encounter('Makuhita', ['Fighting'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Absol', ['Dark'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Chingling', ['Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter.', { condition: 'Sinnoh Sound' }),
      encounter('Bronzor', ['Steel', 'Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter.', { condition: 'Sinnoh Sound' }),
    ],
    notes: [
      'Ice Path floors (1F-B3F) are collapsed into one area; encounter sets are near-identical across floors per Bulbapedia.',
      'Radio-call encounters use condition "Hoenn Sound" / "Sinnoh Sound" so future UI can filter them.',
      conditionTodo,
    ],
  },
  {
    locationId: 'blackthorn-city',
    displayName: 'Blackthorn City',
    encounters: [
      encounter('Magikarp', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [rodTodo],
  },
  {
    locationId: 'dragons-den',
    displayName: "Dragon's Den",
    encounters: [
      encounter('Magikarp', ['Water'], 'surfing'),
      encounter('Dratini', ['Dragon'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Dragon's Den page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Dratini', ['Dragon'], 'Good Rod', 'Both', 'Rare 10% Good Rod encounter.'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Dratini', ['Dragon'], 'Super Rod'),
      fish('Dragonair', ['Dragon'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      encounter('Dratini', ['Dragon'], 'gift', 'Both', 'Elder gift after the Dragon Shrine quiz.'),
    ],
    notes: ['Rod tiers split per Bulbapedia.', 'Dragon Shrine quiz gift is a one-time post-Clair story reward.'],
  },
  {
    locationId: 'johto-route-45',
    displayName: 'Johto Route 45',
    encounters: [
      encounter('Graveler', ['Rock', 'Ground'], 'grass'),
      encounter('Gligar', ['Ground', 'Flying'], 'grass', 'HeartGold'),
      encounter('Teddiursa', ['Normal'], 'grass', 'SoulSilver'),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass', 'SoulSilver'),
      encounter('Phanpy', ['Ground'], 'grass', 'HeartGold'),
      encounter('Magikarp', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'dark-cave',
    displayName: 'Dark Cave',
    encounters: [
      // Cave walking — Route 31 entrance side
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Dunsparce', ['Normal'], 'cave', 'Both', 'Rare 1% Route 31 side encounter.'),
      // Cave walking — Route 45 entrance side
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 'Both', 'Route 45 side cave encounter.'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave', 'Both', 'Route 45 side cave encounter.'),
      encounter('Wobbuffet', ['Psychic'], 'cave', 'Both', 'Route 45 side cave encounter.'),
      // Surfing — same Magikarp table both sides
      encounter('Magikarp', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Dark Cave page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Magikarp', ['Water'], 'Super Rod'),
      fish('Goldeen', ['Water'], 'Super Rod'),
      fish('Seaking', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Rock Smash — Geodude + Dunsparce (rare Dunsparce signature encounter).
      rockSmash('Geodude', ['Rock', 'Ground']),
      rockSmash('Dunsparce', ['Normal'], 'Both', 'Rock Smash is the main route for Dunsparce in HGSS (80% rate).'),
    ],
    notes: [
      'Dark Cave Route 31 side and Route 45 side share fishing/surf but have distinct cave walking tables; consolidated per-entry via notes.',
      'Rock Smash adds Dunsparce as a much more reliable encounter than the 1% cave-walking rate.',
      conditionTodo,
    ],
  },
  {
    locationId: 'johto-route-46',
    displayName: 'Johto Route 46',
    encounters: [
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Geodude', ['Rock', 'Ground'], 'grass'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'bellchime-trail',
    displayName: 'Bellchime Trail',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Bellchime Trail.'],
  },
  {
    locationId: 'bell-tower',
    displayName: 'Bell Tower',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Gastly', ['Ghost', 'Poison'], 'cave'),
      encounter('Ho-Oh', ['Fire', 'Flying'], 'legendary', 'HeartGold', 'Version-featured Tin Tower/Bell Tower legendary encounter.'),
    ],
    notes: ['Bell Tower floors are collapsed into one area for now.', conditionTodo, 'Ho-Oh is listed here as the HeartGold story legendary; postgame/version-cross access is not modeled.'],
  },
  {
    locationId: 'whirl-islands',
    displayName: 'Whirl Islands',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Seel', ['Water'], 'cave'),
      encounter('Krabby', ['Water'], 'cave'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Horsea', ['Water'], 'surfing'),
      // Fishing — rod tiers per Bulbapedia (Whirl Islands page).
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Krabby', ['Water'], 'Old Rod'),
      fish('Magikarp', ['Water'], 'Good Rod'),
      fish('Krabby', ['Water'], 'Good Rod'),
      fish('Horsea', ['Water'], 'Good Rod', 'Both', 'Rare 10% Good Rod encounter.'),
      fish('Krabby', ['Water'], 'Super Rod'),
      fish('Kingler', ['Water'], 'Super Rod'),
      fish('Horsea', ['Water'], 'Super Rod'),
      fish('Seadra', ['Water'], 'Super Rod', 'Both', 'Rare 10% Super Rod encounter.'),
      // Pokégear radio encounters.
      encounter('Makuhita', ['Fighting'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Absol', ['Dark'], 'special', 'Both', 'Pokégear Hoenn Sound radio encounter.', { condition: 'Hoenn Sound' }),
      encounter('Chingling', ['Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter.', { condition: 'Sinnoh Sound' }),
      encounter('Bronzor', ['Steel', 'Psychic'], 'special', 'Both', 'Pokégear Sinnoh Sound radio encounter.', { condition: 'Sinnoh Sound' }),
      encounter('Lugia', ['Psychic', 'Flying'], 'legendary', 'SoulSilver', 'Version-featured Whirl Islands legendary encounter.'),
    ],
    notes: ['Whirl Islands floors (1F-B3F) are collapsed into one area; rod tiers split per Bulbapedia.', conditionTodo, 'Lugia is listed here as the SoulSilver story legendary; postgame/version-cross access is not modeled.'],
  },
  {
    locationId: 'johto-route-27',
    displayName: 'Johto Route 27',
    encounters: [
      encounter('Raticate', ['Normal'], 'grass'),
      encounter('Sandslash', ['Ground'], 'grass', 'HeartGold'),
      encounter('Arbok', ['Poison'], 'grass', 'SoulSilver'),
      encounter('Ponyta', ['Fire'], 'grass'),
      encounter('Doduo', ['Normal', 'Flying'], 'grass'),
      encounter('Dodrio', ['Normal', 'Flying'], 'grass', 'SoulSilver'),
      encounter('Quagsire', ['Water', 'Ground'], 'grass'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'fishing'),
      encounter('Shellder', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Chinchou', ['Water', 'Electric'], 'fishing'),
      encounter('Lanturn', ['Water', 'Electric'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'tohjo-falls',
    displayName: 'Tohjo Falls',
    encounters: [
      encounter('Rattata', ['Normal'], 'cave'),
      encounter('Raticate', ['Normal'], 'cave'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'cave'),
      encounter('Slowpoke', ['Water', 'Psychic'], 'surfing'),
      encounter('Goldeen', ['Water'], 'surfing'),
      encounter('Seaking', ['Water'], 'surfing'),
      encounter('Goldeen', ['Water'], 'fishing'),
      encounter('Seaking', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'johto-route-26',
    displayName: 'Johto Route 26',
    encounters: [
      encounter('Raticate', ['Normal'], 'grass'),
      encounter('Sandslash', ['Ground'], 'grass', 'HeartGold'),
      encounter('Arbok', ['Poison'], 'grass', 'SoulSilver'),
      encounter('Doduo', ['Normal', 'Flying'], 'grass'),
      encounter('Dodrio', ['Normal', 'Flying'], 'grass', 'HeartGold'),
      encounter('Quagsire', ['Water', 'Ground'], 'grass'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'fishing'),
      encounter('Shellder', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Chinchou', ['Water', 'Electric'], 'fishing'),
      encounter('Lanturn', ['Water', 'Electric'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
  },
  {
    locationId: 'victory-road-kanto',
    displayName: 'Victory Road',
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Donphan', ['Ground'], 'cave', 'HeartGold'),
      encounter('Ursaring', ['Normal'], 'cave', 'SoulSilver'),
      encounter('Onix', ['Rock', 'Ground'], 'cave'),
      encounter('Rhyhorn', ['Ground', 'Rock'], 'cave'),
    ],
    notes: ['Victory Road is stored with the existing victory-road-kanto route id.', conditionTodo],
  },
  {
    locationId: 'indigo-plateau',
    displayName: 'Indigo Plateau',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Indigo Plateau.'],
  },
  {
    locationId: 'cliff-edge-gate',
    displayName: 'Cliff Edge Gate',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Cliff Edge Gate.'],
  },
  {
    locationId: 'johto-route-47',
    displayName: 'Johto Route 47',
    encounters: [
      encounter('Raticate', ['Normal'], 'grass'),
      encounter('Spearow', ['Normal', 'Flying'], 'grass'),
      encounter('Fearow', ['Normal', 'Flying'], 'grass'),
      encounter('Gloom', ['Grass', 'Poison'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Misdreavus', ['Ghost'], 'grass'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing'),
      encounter('Seel', ['Water'], 'surfing'),
      encounter('Staryu', ['Water'], 'surfing'),
      encounter('Wooper', ['Water', 'Ground'], 'surfing'),
      encounter('Quagsire', ['Water', 'Ground'], 'surfing'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing'),
      encounter('Tentacruel', ['Water', 'Poison'], 'fishing'),
      encounter('Shellder', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Chinchou', ['Water', 'Electric'], 'fishing'),
      encounter('Lanturn', ['Water', 'Electric'], 'fishing'),
      encounter('Poliwag', ['Water'], 'fishing'),
    ],
    notes: ['Route 47 and its cave-gate subareas are partially collapsed here.', conditionTodo, rodTodo, 'Rock Smash encounters are TODO until condition support is added.'],
  },
  {
    locationId: 'cliff-cave',
    displayName: 'Cliff Cave',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave'),
      encounter('Machoke', ['Fighting'], 'cave'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Wooper', ['Water', 'Ground'], 'cave'),
      encounter('Quagsire', ['Water', 'Ground'], 'cave'),
      encounter('Misdreavus', ['Ghost'], 'cave'),
      encounter('Steelix', ['Steel', 'Ground'], 'cave'),
    ],
    notes: ['Cliff Cave is separated from Route 47 for usability, although PokéAPI groups some of this data under Route 47 subareas.', conditionTodo],
  },
  {
    locationId: 'embedded-tower',
    displayName: 'Embedded Tower',
    encounters: [
      encounter('Kyogre', ['Water'], 'legendary', 'HeartGold', 'Requires Blue Orb.'),
      encounter('Groudon', ['Ground'], 'legendary', 'SoulSilver', 'Requires Red Orb.'),
      encounter('Rayquaza', ['Dragon', 'Flying'], 'legendary', 'Both', 'Requires Jade Orb after showing both Groudon and Kyogre to Professor Oak.'),
    ],
    notes: ['Embedded Tower legendary prerequisites are special conditions and are summarized in encounter notes.'],
  },
  {
    locationId: 'johto-route-48',
    displayName: 'Johto Route 48',
    encounters: [
      encounter('Growlithe', ['Fire'], 'grass', 'HeartGold'),
      encounter('Vulpix', ['Fire'], 'grass', 'SoulSilver'),
      encounter('Diglett', ['Ground'], 'grass'),
      encounter('Farfetchd', ['Normal', 'Flying'], 'grass'),
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Hoppip', ['Grass', 'Flying'], 'grass'),
      encounter('Girafarig', ['Normal', 'Psychic'], 'grass'),
    ],
    notes: [conditionTodo],
  },
  {
    locationId: 'safari-zone-gate',
    displayName: 'Safari Zone Gate',
    encounters: [],
    notes: ['No standard wild encounter table is currently represented for Safari Zone Gate.'],
  },
  {
    locationId: 'johto-safari-zone',
    displayName: 'Johto Safari Zone',
    encounters: [],
    notes: [
      'Safari Zone encounter data depends on zone arrangement, object/block placement, and block upgrade timing.',
      'TODO: Safari Zone block/object mechanics are not represented in the current flat encounter schema, so the tracker does not flatten these encounters yet.',
    ],
  },
];

export const hgssEncounterNotes = [
  'Flat schema mismatch: morning/day/night, rod tier, radio state, swarm state, Bug-Catching Contest, Game Corner costs, and headbutt group are all real HGSS encounter conditions.',
  'Roaming legendaries are not tied to one normal route in this schema: Raikou and Entei roam Johto; Latias roams Kanto in HeartGold; Latios roams Kanto in SoulSilver.',
  'Suicune is a static encounter in Kanto after the Johto roaming/event sequence; it is noted here but not assigned to a Johto route.',
  'This pass only includes directly representable encounter options.',
];

export function getHgssEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'HeartGold' && gameVersion !== 'SoulSilver') return {};

  return hgssEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
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
