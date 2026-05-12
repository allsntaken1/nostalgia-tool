import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

type HgssVersion = 'Both' | 'HeartGold' | 'SoulSilver';
type HgssEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'special';

type HgssEncounter = {
  species: string;
  types: PokemonType[];
  method: HgssEncounterMethod;
  version: HgssVersion;
  notes?: string;
};

type HgssEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: HgssEncounter[];
  notes: string[];
};

const conditionTodo = 'TODO: condition-specific encounter data not fully represented: morning/day/night/headbutt/radio/swarm/etc.';
const rodTodo = 'Fishing rod tiers are collapsed to one fishing option per species in this flat UI.';

const encounter = (species: string, types: PokemonType[], method: HgssEncounterMethod, version: HgssVersion = 'Both', notes?: string): HgssEncounter => ({
  species,
  types,
  method,
  version,
  notes,
});

export const hgssEncounterAreas: HgssEncounterArea[] = [
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
      encounter('Tentacool', ['Water', 'Poison'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Qwilfish', ['Water', 'Poison'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
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
      encounter('Goldeen', ['Water'], 'fishing'),
      encounter('Seaking', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
      encounter('Krabby', ['Water'], 'fishing'),
      encounter('Kingler', ['Water'], 'fishing'),
      encounter('Staryu', ['Water'], 'fishing'),
      encounter('Corsola', ['Water', 'Rock'], 'fishing'),
      encounter('Lapras', ['Water', 'Ice'], 'static', 'HeartGold', 'Friday static encounter in the lower Union Cave pool.'),
    ],
    notes: [
      'Union Cave floors are collapsed into one area for now.',
      'Friday Lapras and Arceus event conditions are real HGSS conditions but not fully represented by the current schema.',
      conditionTodo,
      rodTodo,
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
      encounter('Goldeen', ['Water'], 'fishing'),
      encounter('Seaking', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: ['Slowpoke Well floors are collapsed into one area for now.', conditionTodo, rodTodo],
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
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
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
      encounter('Nidoran F', ['Poison'], 'grass'),
      encounter('Nidoran M', ['Poison'], 'grass'),
      encounter('Abra', ['Psychic'], 'grass'),
      encounter('Drowzee', ['Psychic'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Yanma', ['Bug', 'Flying'], 'grass'),
      encounter('Psyduck', ['Water'], 'surfing'),
      encounter('Golduck', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [conditionTodo, rodTodo],
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
    ],
    notes: ['Bug-Catching Contest data is TODO until condition support is added.', conditionTodo],
  },
  {
    locationId: 'johto-route-36',
    displayName: 'Johto Route 36',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Nidoran F', ['Poison'], 'grass'),
      encounter('Nidoran M', ['Poison'], 'grass'),
      encounter('Growlithe', ['Fire'], 'grass', 'HeartGold'),
      encounter('Vulpix', ['Fire'], 'grass', 'SoulSilver'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Stantler', ['Normal'], 'grass'),
      encounter('Sudowoodo', ['Rock'], 'static', 'Both', 'SquirtBottle static encounter.'),
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
];

export const hgssEncounterNotes = [
  'Flat schema mismatch: morning/day/night, rod tier, radio state, swarm state, Bug-Catching Contest, Game Corner costs, and headbutt group are all real HGSS encounter conditions.',
  'This pass only includes directly representable encounter options.',
];

export function getHgssEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'HeartGold' && gameVersion !== 'SoulSilver') return {};

  return hgssEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item) => ({
        species: item.species,
        types: item.types,
        surfMethod: item.method === 'surfing',
        fishingMethod: item.method === 'fishing',
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
