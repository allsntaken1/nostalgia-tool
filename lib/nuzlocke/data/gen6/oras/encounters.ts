import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';
import { orasLocations } from './routes';
import { supportsOrasData } from './metadata';

type OrasVersion = 'Omega Ruby' | 'Alpha Sapphire' | 'Both';
type OrasEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special';

type OrasEncounter = {
  species: string;
  types: PokemonType[];
  method: OrasEncounterMethod;
  version: OrasVersion;
  notes?: string;
  minLevel?: number;
  maxLevel?: number;
  rate?: number;
  condition?: string;
};

type OrasEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: OrasEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: OrasEncounterMethod,
  minLevel: number,
  maxLevel: number,
  rate: number,
  condition?: string,
  version: OrasVersion = 'Both',
): OrasEncounter => ({
  species,
  types,
  method,
  version,
  minLevel,
  maxLevel,
  rate,
  ...(condition ? { condition } : {}),
});

const starter = (species: string, types: PokemonType[]): OrasEncounter => ({
  species,
  types,
  method: 'gift',
  version: 'Both',
  minLevel: 5,
  maxLevel: 5,
  rate: 100,
});

export const orasStarterEncounters: EncounterOption[] = [
  starter('Treecko', ['Grass']),
  starter('Torchic', ['Fire']),
  starter('Mudkip', ['Water']),
].map((encounter) => ({
  species: encounter.species,
  types: encounter.types,
  method: encounter.method,
  version: encounter.version,
  minLevel: encounter.minLevel,
  maxLevel: encounter.maxLevel,
  rate: encounter.rate,
}));

const oldRod = 'Old Rod';
const goodRod = 'Good Rod';
const superRod = 'Super Rod';

const hoennSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
  encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 30, 40, 100, superRod),
];

const carvanhaSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
  encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Carvanha', ['Water', 'Dark'], 'fishing', 25, 25, 5, goodRod),
  encounter('Carvanha', ['Water', 'Dark'], 'fishing', 30, 35, 95, superRod),
  encounter('Sharpedo', ['Water', 'Dark'], 'fishing', 40, 40, 5, superRod),
];

const easternSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 25, 25, 50),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 35, 35),
  encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 30, 30, 15),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 30, 40, 100, superRod),
];

const easternUnderwaterEncounters = (): OrasEncounter[] => [
  encounter('Chinchou', ['Water', 'Electric'], 'special', 25, 25, 50, 'Underwater seaweed'),
  encounter('Clamperl', ['Water'], 'special', 30, 30, 30, 'Underwater seaweed'),
  encounter('Lanturn', ['Water', 'Electric'], 'special', 30, 30, 15, 'Underwater seaweed'),
  encounter('Relicanth', ['Water', 'Rock'], 'special', 30, 35, 5, 'Underwater seaweed'),
];

const horseaSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 25, 25, 50),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 35, 35),
  encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 30, 30, 15),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 35, 35, 60, superRod),
  encounter('Horsea', ['Water'], 'fishing', 30, 30, 35, superRod),
  encounter('Seadra', ['Water'], 'fishing', 40, 40, 5, superRod),
];

const luvdiscSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 25, 25, 50),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 35, 35),
  encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 30, 30, 15),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Luvdisc', ['Water'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Luvdisc', ['Water'], 'fishing', 35, 35, 60, superRod),
  encounter('Wailmer', ['Water'], 'fishing', 30, 30, 35, superRod),
  encounter('Corsola', ['Water', 'Rock'], 'fishing', 40, 40, 5, superRod),
];

const hideoutSeaEncounters = (): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
  encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
  encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 30, 35, 95, superRod),
  encounter('Staryu', ['Water'], 'fishing', 40, 40, 5, superRod),
];

const route128UnderwaterEncounters = (): OrasEncounter[] => [
  encounter('Chinchou', ['Water', 'Electric'], 'special', 25, 25, 50, 'Route 128 underwater seaweed'),
  encounter('Clamperl', ['Water'], 'special', 30, 30, 30, 'Route 128 underwater seaweed'),
  encounter('Lanturn', ['Water', 'Electric'], 'special', 30, 30, 15, 'Route 128 underwater seaweed'),
  encounter('Corsola', ['Water', 'Rock'], 'special', 30, 30, 4, 'Route 128 underwater seaweed'),
  encounter('Relicanth', ['Water', 'Rock'], 'special', 35, 35, 1, 'Route 128 underwater seaweed'),
];

const sootopolisWaterEncounters = (): OrasEncounter[] => [
  encounter('Magikarp', ['Water'], 'surfing', 25, 35, 100),
  encounter('Magikarp', ['Water'], 'fishing', 5, 15, 100, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 100, goodRod),
  encounter('Magikarp', ['Water'], 'fishing', 30, 35, 95, superRod),
  encounter('Gyarados', ['Water', 'Flying'], 'fishing', 40, 40, 5, superRod),
];

const seafloorWaterEncounters = (): OrasEncounter[] => [
  encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 25, 30, 65),
  encounter('Golbat', ['Poison', 'Flying'], 'surfing', 25, 35, 35),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
  encounter('Wailmer', ['Water'], 'fishing', 30, 40, 100, superRod),
];

const victoryRoadSeaEncounters = (subarea: string): OrasEncounter[] => [
  encounter('Tentacool', ['Water', 'Poison'], 'surfing', 25, 25, 50, `${subarea} water`),
  encounter('Golbat', ['Poison', 'Flying'], 'surfing', 30, 40, 35, `${subarea} water`),
  encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 35, 35, 15, `${subarea} water`),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, `${subarea} Old Rod`),
  encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, `${subarea} Old Rod`),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, `${subarea} Good Rod`),
  encounter('Luvdisc', ['Water'], 'fishing', 25, 25, 35, `${subarea} Good Rod`),
  encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, `${subarea} Good Rod`),
  encounter('Luvdisc', ['Water'], 'fishing', 35, 35, 60, `${subarea} Super Rod`),
  encounter('Wailmer', ['Water'], 'fishing', 30, 40, 40, `${subarea} Super Rod`),
];

const victoryRoad2fWaterEncounters = (): OrasEncounter[] => [
  encounter('Golbat', ['Poison', 'Flying'], 'surfing', 25, 40, 100, '2F water'),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, '2F Old Rod'),
  encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, '2F Old Rod'),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, '2F Good Rod'),
  encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, '2F Good Rod'),
  encounter('Barboach', ['Water', 'Ground'], 'fishing', 25, 25, 5, '2F Good Rod'),
  encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 40, 100, '2F Super Rod'),
];

const hoennPondEncounters = (): OrasEncounter[] => [
  encounter('Marill', ['Water', 'Fairy'], 'surfing', 15, 15, 50),
  encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 25, 31),
  encounter('Surskit', ['Bug', 'Water'], 'surfing', 15, 15, 15),
  encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, goodRod),
  encounter('Corphish', ['Water'], 'fishing', 25, 25, 5, goodRod),
];

const barboachPondEncounters = (): OrasEncounter[] => [
  encounter('Marill', ['Water', 'Fairy'], 'surfing', 15, 15, 50),
  encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 25, 31),
  encounter('Surskit', ['Bug', 'Water'], 'surfing', 20, 20, 15),
  encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4),
  encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
  encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, oldRod),
  encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
  encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, goodRod),
  encounter('Barboach', ['Water', 'Ground'], 'fishing', 25, 25, 5, goodRod),
  encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 40, 100, superRod),
];

const noWild = (detail: string): Pick<OrasEncounterArea, 'encounters' | 'notes'> => ({
  encounters: [],
  notes: [detail],
});

const earlyEncounterData: Record<string, Pick<OrasEncounterArea, 'encounters' | 'notes'>> = {
  'Littleroot Town': noWild('Starter selection is handled by the Starter Pokemon pseudo-location. No wild encounters are available in town.'),
  'Oldale Town': noWild('No wild encounter options are available in Oldale Town.'),
  'Rustboro City': {
    encounters: [
      encounter('Makuhita', ['Fighting'], 'trade', 9, 9, 100, 'Trade Slakoth for Makuhita'),
    ],
    notes: ['ORAS in-game trade: Slakoth for Makuhita.'],
  },
  'Route 101': {
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass', 2, 2, 20),
      encounter('Zigzagoon', ['Normal'], 'grass', 2, 2, 40),
      encounter('Wurmple', ['Bug'], 'grass', 2, 2, 40),
    ],
    notes: [
      'Wild Pokemon on Route 101 have a 100% catch rate in ORAS.',
      'TODO: Add dedicated DexNav/hidden Pokemon handling before representing the tutorial Poochyena and post-Groudon/Kyogre hidden Pokemon.',
      'TODO: Add Horde encounter subsystem before representing Horde-only tables.',
    ],
  },
  'Route 102': {
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass', 2, 3, 20),
      encounter('Zigzagoon', ['Normal'], 'grass', 2, 3, 30),
      encounter('Wurmple', ['Bug'], 'grass', 2, 3, 30),
      encounter('Lotad', ['Water', 'Grass'], 'grass', 2, 3, 15, undefined, 'Alpha Sapphire'),
      encounter('Seedot', ['Grass'], 'grass', 2, 3, 15, undefined, 'Omega Ruby'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass', 3, 3, 4),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 3, 3, 1),
      encounter('Marill', ['Water', 'Fairy'], 'surfing', 15, 15, 50),
      encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 25, 31),
      encounter('Surskit', ['Bug', 'Water'], 'surfing', 20, 20, 15),
      encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4),
      encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
      encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, goodRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 30, 40, 100, superRod),
    ],
    notes: [
      'Version-exclusive normal grass encounters: Seedot in Omega Ruby, Lotad in Alpha Sapphire.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 103': {
    encounters: [
      encounter('Poochyena', ['Dark'], 'grass', 2, 3, 40),
      encounter('Zigzagoon', ['Normal'], 'grass', 2, 3, 40),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 2, 3, 20),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
      encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
      encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Wailmer', ['Water'], 'fishing', 30, 40, 100, superRod),
    ],
    notes: [
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Petalburg City': {
    encounters: [
      encounter('Marill', ['Water', 'Fairy'], 'surfing', 15, 15, 50),
      encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 25, 31),
      encounter('Surskit', ['Bug', 'Water'], 'surfing', 15, 15, 15),
      encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4),
      encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
      encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, goodRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 30, 40, 100, superRod),
    ],
    notes: ['Water encounters are late-access after Surf/fishing rods.'],
  },
  'Route 104': {
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass', 2, 5, 40, 'South section'),
      encounter('Wurmple', ['Bug'], 'grass', 2, 5, 40, 'South section'),
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 3, 5, 5, 'South section'),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 3, 5, 15, 'South section'),
      encounter('Zigzagoon', ['Normal'], 'grass', 4, 7, 40, 'North section'),
      encounter('Wurmple', ['Bug'], 'grass', 4, 7, 40, 'North section'),
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 5, 7, 15, 'North section'),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 5, 7, 5, 'North section'),
      encounter('Wingull', ['Water', 'Flying'], 'surfing', 15, 20, 95),
      encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 25, 5),
      encounter('Magikarp', ['Water'], 'fishing', 5, 15, 100, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 100, goodRod),
      encounter('Magikarp', ['Water'], 'fishing', 30, 40, 100, superRod),
    ],
    notes: [
      'Route 104 has distinct south and north grass tables around Petalburg Woods.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Petalburg Woods': {
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass', 4, 6, 30),
      encounter('Wurmple', ['Bug'], 'grass', 4, 6, 30),
      encounter('Silcoon', ['Bug'], 'grass', 6, 6, 10),
      encounter('Cascoon', ['Bug'], 'grass', 6, 6, 10),
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 5, 5, 5),
      encounter('Shroomish', ['Grass'], 'grass', 5, 5, 10),
      encounter('Slakoth', ['Normal'], 'grass', 5, 5, 5),
    ],
    notes: [
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 116': {
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass', 6, 8, 30),
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 6, 8, 15),
      encounter('Nincada', ['Bug', 'Ground'], 'grass', 6, 8, 20),
      encounter('Whismur', ['Normal'], 'grass', 5, 7, 30),
      encounter('Skitty', ['Normal'], 'grass', 8, 8, 5),
    ],
    notes: [
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Rusturf Tunnel': {
    encounters: [
      encounter('Whismur', ['Normal'], 'cave', 7, 10, 100),
      encounter('Geodude', ['Rock', 'Ground'], 'special', 14, 17, 100, 'Rock Smash'),
    ],
    notes: [
      'Rock Smash encounters are represented as special encounters with a Rock Smash condition.',
      'TODO: Add Horde encounter subsystem before representing Horde-only tables.',
    ],
  },
  'Dewford Town': {
    encounters: hoennSeaEncounters(),
    notes: ['Water encounters are late-access after Surf/fishing rods.'],
  },
  'Route 106': {
    encounters: hoennSeaEncounters(),
    notes: [
      'Water encounters are late-access after Surf/fishing rods.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Krabby, Frillish, Skrelp, or Clauncher.',
    ],
  },
  'Granite Cave': {
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 9, 12, 40, '1F'),
      encounter('Makuhita', ['Fighting'], 'cave', 9, 12, 40, '1F'),
      encounter('Abra', ['Psychic'], 'cave', 10, 12, 15, '1F'),
      encounter('Geodude', ['Rock', 'Ground'], 'cave', 10, 12, 5, '1F'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 10, 12, 30, 'B1F'),
      encounter('Aron', ['Steel', 'Rock'], 'cave', 10, 12, 30, 'B1F'),
      encounter('Makuhita', ['Fighting'], 'cave', 10, 12, 20, 'B1F'),
      encounter('Abra', ['Psychic'], 'cave', 10, 12, 20, 'B1F'),
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 10, 12, 30, 'B2F'),
      encounter('Aron', ['Steel', 'Rock'], 'cave', 10, 12, 30, 'B2F'),
      encounter('Abra', ['Psychic'], 'cave', 10, 12, 20, 'B2F'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 10, 12, 20, 'B2F', 'Omega Ruby'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 10, 12, 20, 'B2F', 'Alpha Sapphire'),
      encounter('Geodude', ['Rock', 'Ground'], 'special', 10, 12, 84, 'B2F Rock Smash'),
      encounter('Nosepass', ['Rock'], 'special', 10, 12, 16, 'B2F Rock Smash'),
    ],
    notes: [
      'Granite Cave has distinct 1F, B1F, and B2F cave tables; conditions preserve the floor instead of flattening them.',
      'B1F/B2F normal cave tables require later Mach Bike access in ORAS.',
      'Rock Smash encounters are represented as special encounters with a Rock Smash condition.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 109': {
    encounters: hoennSeaEncounters(),
    notes: [
      'Water encounters are late-access after Surf/fishing rods; the first visit is beach-only unless fishing is used.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Krabby, Frillish, Skrelp, or Clauncher.',
    ],
  },
  'Slateport City': {
    encounters: [
      ...hoennSeaEncounters(),
      encounter('Pikachu', ['Electric'], 'gift', 20, 20, 100, 'Cosplay Pikachu gift after first Pokemon Contest Spectacular'),
    ],
    notes: [
      'Cosplay Pikachu is represented as a Slateport gift because Slateport Contest Hall is the first available Contest Hall.',
      'Water encounters are late-access after Surf/fishing rods.',
    ],
  },
  'Route 110': {
    encounters: [
      encounter('Electrike', ['Electric'], 'grass', 10, 13, 40),
      encounter('Minun', ['Electric'], 'grass', 11, 13, 16, undefined, 'Omega Ruby'),
      encounter('Plusle', ['Electric'], 'grass', 11, 13, 16, undefined, 'Alpha Sapphire'),
      encounter('Oddish', ['Grass', 'Poison'], 'grass', 13, 13, 10),
      encounter('Zigzagoon', ['Normal'], 'grass', 13, 13, 10),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 13, 13, 10),
      encounter('Gulpin', ['Poison'], 'grass', 13, 13, 10),
      encounter('Voltorb', ['Electric'], 'grass', 13, 13, 4),
      ...hoennSeaEncounters(),
    ],
    notes: [
      'Version-exclusive normal grass encounters: Minun in Omega Ruby, Plusle in Alpha Sapphire.',
      'Water encounters are late-access after Surf/fishing rods.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Mauville City': noWild('No wild encounter options are available in Mauville City.'),
  'Route 117': {
    encounters: [
      encounter('Zigzagoon', ['Normal'], 'grass', 12, 14, 30),
      encounter('Roselia', ['Grass', 'Poison'], 'grass', 12, 14, 20),
      encounter('Marill', ['Water', 'Fairy'], 'grass', 11, 13, 20),
      encounter('Oddish', ['Grass', 'Poison'], 'grass', 14, 14, 15),
      encounter('Illumise', ['Bug'], 'grass', 11, 14, 20, undefined, 'Omega Ruby'),
      encounter('Volbeat', ['Bug'], 'grass', 11, 14, 4, undefined, 'Omega Ruby'),
      encounter('Volbeat', ['Bug'], 'grass', 11, 14, 20, undefined, 'Alpha Sapphire'),
      encounter('Illumise', ['Bug'], 'grass', 11, 14, 4, undefined, 'Alpha Sapphire'),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 14, 14, 1),
      ...hoennPondEncounters(),
      encounter('Corphish', ['Water'], 'fishing', 30, 35, 95, superRod),
      encounter('Crawdaunt', ['Water', 'Dark'], 'fishing', 40, 40, 5, superRod),
    ],
    notes: [
      'Version-exclusive rarity split: Illumise is common in Omega Ruby and rare in Alpha Sapphire; Volbeat is common in Alpha Sapphire and rare in Omega Ruby.',
      'Water encounters are late-access after Surf/fishing rods.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Verdanturf Town': noWild('No wild encounter options are available in Verdanturf Town.'),
  'Route 111': {
    encounters: [
      encounter('Geodude', ['Rock', 'Ground'], 'special', 13, 16, 65, 'South side Rock Smash'),
      ...barboachPondEncounters().map((item) => ({
        ...item,
        condition: item.condition ? `South side pond ${item.condition}` : 'South side pond',
      })),
      encounter('Sandshrew', ['Ground'], 'special', 20, 23, 40, 'Desert deep sand'),
      encounter('Trapinch', ['Ground'], 'special', 20, 22, 20, 'Desert deep sand'),
      encounter('Cacnea', ['Grass'], 'special', 21, 23, 20, 'Desert deep sand'),
      encounter('Baltoy', ['Ground', 'Psychic'], 'special', 21, 23, 20, 'Desert deep sand'),
    ],
    notes: [
      'Route 111 is split into south side, desert, and north side areas; south side water requires Surf and desert deep sand requires Go-Goggles.',
      'Rock Smash and desert deep sand are represented as special encounters because the encounter method model has no dedicated rock-smash or deep-sand method.',
      'No normal grass encounters are available on Route 111 north/south in ORAS.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 112': {
    encounters: [
      encounter('Numel', ['Fire', 'Ground'], 'grass', 13, 16, 60, 'South side'),
      encounter('Machop', ['Fighting'], 'grass', 13, 16, 40, 'South side'),
      encounter('Numel', ['Fire', 'Ground'], 'grass', 14, 17, 65, 'North side'),
      encounter('Machop', ['Fighting'], 'grass', 14, 17, 35, 'North side'),
    ],
    notes: [
      'Route 112 has separate south and north grass tables divided by Fiery Path.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Fiery Path': {
    encounters: [
      encounter('Numel', ['Fire', 'Ground'], 'cave', 13, 16, 40),
      encounter('Koffing', ['Poison'], 'cave', 14, 16, 30, undefined, 'Omega Ruby'),
      encounter('Grimer', ['Poison'], 'cave', 14, 16, 30, undefined, 'Alpha Sapphire'),
      encounter('Grimer', ['Poison'], 'cave', 15, 15, 5, undefined, 'Omega Ruby'),
      encounter('Koffing', ['Poison'], 'cave', 15, 15, 5, undefined, 'Alpha Sapphire'),
      encounter('Slugma', ['Fire'], 'cave', 15, 15, 10),
      encounter('Torkoal', ['Fire'], 'cave', 15, 15, 10),
      encounter('Machop', ['Fighting'], 'cave', 15, 15, 5),
    ],
    notes: [
      'Version-exclusive rarity split: Koffing is common in Omega Ruby and rare in Alpha Sapphire; Grimer is common in Alpha Sapphire and rare in Omega Ruby.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 113': {
    encounters: [
      encounter('Spinda', ['Normal'], 'grass', 15, 18, 60),
      encounter('Sandshrew', ['Ground'], 'grass', 15, 18, 35),
      encounter('Skarmory', ['Steel', 'Flying'], 'grass', 16, 18, 5),
    ],
    notes: [
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Fallarbor Town': noWild('No wild encounter options are available in Fallarbor Town.'),
  'Route 114': {
    encounters: [
      encounter('Swablu', ['Normal', 'Flying'], 'grass', 16, 19, 40),
      encounter('Nuzleaf', ['Grass', 'Dark'], 'grass', 16, 19, 40, undefined, 'Omega Ruby'),
      encounter('Lombre', ['Water', 'Grass'], 'grass', 16, 19, 40, undefined, 'Alpha Sapphire'),
      encounter('Zangoose', ['Normal'], 'grass', 19, 19, 19, undefined, 'Omega Ruby'),
      encounter('Seviper', ['Poison'], 'grass', 19, 19, 19, undefined, 'Alpha Sapphire'),
      encounter('Surskit', ['Bug', 'Water'], 'grass', 19, 19, 1),
      encounter('Geodude', ['Rock', 'Ground'], 'special', 5, 20, 65, 'Rock Smash'),
      ...barboachPondEncounters(),
    ],
    notes: [
      'Version-exclusive normal grass encounters: Nuzleaf and Zangoose in Omega Ruby, Lombre and Seviper in Alpha Sapphire.',
      'Rock Smash encounters are represented as special encounters with a Rock Smash condition.',
      'Water encounters are late-access after Surf/fishing rods.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Meteor Falls': {
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave', 16, 19, 75, '1F'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave', 16, 19, 25, '1F', 'Omega Ruby'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave', 16, 19, 25, '1F', 'Alpha Sapphire'),
      encounter('Zubat', ['Poison', 'Flying'], 'surfing', 15, 20, 80, '1F'),
      encounter('Golbat', ['Poison', 'Flying'], 'surfing', 25, 25, 4, '1F'),
      encounter('Solrock', ['Rock', 'Psychic'], 'surfing', 20, 25, 16, '1F', 'Omega Ruby'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'surfing', 20, 25, 16, '1F', 'Alpha Sapphire'),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, '1F Old Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, '1F Old Rod'),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, '1F Good Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, '1F Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 25, 25, 5, '1F Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 40, 100, '1F Super Rod'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 37, 40, 75, '2F/B1F'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave', 37, 40, 25, '2F/B1F', 'Omega Ruby'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave', 37, 40, 25, '2F/B1F', 'Alpha Sapphire'),
      encounter('Golbat', ['Poison', 'Flying'], 'surfing', 30, 35, 80, '2F/B1F'),
      encounter('Solrock', ['Rock', 'Psychic'], 'surfing', 30, 40, 20, '2F/B1F', 'Omega Ruby'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'surfing', 30, 40, 20, '2F/B1F', 'Alpha Sapphire'),
      encounter('Magikarp', ['Water'], 'fishing', 5, 10, 65, '2F/B1F Old Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 10, 10, 35, '2F/B1F Old Rod'),
      encounter('Magikarp', ['Water'], 'fishing', 30, 30, 60, '2F/B1F Good Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 30, 30, 35, '2F/B1F Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 30, 5, '2F/B1F Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 35, 95, '2F/B1F Super Rod'),
      encounter('Whiscash', ['Water', 'Ground'], 'fishing', 40, 40, 5, '2F/B1F Super Rod'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 37, 40, 40, 'B1F deepest room'),
      encounter('Bagon', ['Dragon'], 'cave', 37, 40, 35, 'B1F deepest room'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave', 37, 40, 25, 'B1F deepest room', 'Omega Ruby'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave', 37, 40, 25, 'B1F deepest room', 'Alpha Sapphire'),
    ],
    notes: [
      'Meteor Falls has 1F, 2F/B1F, and B1F deepest-room tables; conditions preserve those subareas instead of flattening them.',
      '2F, B1F, and deepest-room encounters require late Surf/Waterfall progression.',
      'Version-exclusive encounters: Solrock in Omega Ruby, Lunatone in Alpha Sapphire.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 115': {
    encounters: [
      encounter('Taillow', ['Normal', 'Flying'], 'grass', 17, 20, 40),
      encounter('Swablu', ['Normal', 'Flying'], 'grass', 17, 20, 40),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 20, 20, 10),
      encounter('Jigglypuff', ['Normal', 'Fairy'], 'grass', 18, 20, 10),
      ...hoennSeaEncounters(),
    ],
    notes: [
      'Much of Route 115 is late-access via Surf from Meteor Falls/Rustboro side.',
      'Water encounters are late-access after Surf/fishing rods.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Mt. Chimney': noWild('No wild encounter options are available on Mt. Chimney.'),
  'Jagged Pass': {
    encounters: [
      encounter('Numel', ['Fire', 'Ground'], 'grass', 18, 21, 40),
      encounter('Machop', ['Fighting'], 'grass', 18, 21, 40),
      encounter('Spoink', ['Psychic'], 'grass', 18, 21, 20),
    ],
    notes: [
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Lavaridge Town': {
    encounters: [
      encounter('Wynaut', ['Psychic'], 'gift', 1, 1, 100, 'Egg gift from old woman by the hot springs'),
      encounter('Togepi', ['Fairy'], 'gift', 1, 1, 100, 'Post-Groudon/Kyogre Egg gift from old woman by the hot springs'),
    ],
    notes: [
      'Wynaut is available on first Lavaridge visit as an Egg gift.',
      'Togepi is a later Egg gift after the Cave of Origin story event, represented here because the gift location is Lavaridge Town.',
    ],
  },
  'Route 118': {
    encounters: [
      encounter('Linoone', ['Normal'], 'grass', 21, 24, 40, 'Tall grass'),
      encounter('Electrike', ['Electric'], 'grass', 21, 24, 40, 'Tall grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 22, 24, 15, 'Tall grass'),
      encounter('Kecleon', ['Normal'], 'grass', 24, 24, 5, 'Tall grass'),
      encounter('Linoone', ['Normal'], 'grass', 21, 23, 40, 'Long grass'),
      encounter('Electrike', ['Electric'], 'grass', 21, 24, 40, 'Long grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 22, 24, 15, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'grass', 24, 24, 5, 'Long grass'),
      ...carvanhaSeaEncounters(),
    ],
    notes: [
      'Route 118 has separate tall-grass, long-grass, and water tables; eastern grass requires Surf from the west side.',
      'Good Rod is obtained on Route 118 after crossing with Surf.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 119': {
    encounters: [
      encounter('Gloom', ['Grass', 'Poison'], 'grass', 22, 25, 40, 'Long grass'),
      encounter('Linoone', ['Normal'], 'grass', 22, 25, 40, 'Long grass'),
      encounter('Tropius', ['Grass', 'Flying'], 'grass', 23, 25, 15, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'grass', 25, 25, 5, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'special', 30, 30, 100, 'Devon Scope special encounter near upper waterfall'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
      encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
      encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
      encounter('Magikarp', ['Water'], 'fishing', 10, 10, 60, oldRod),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
      encounter('Feebas', ['Water'], 'fishing', 15, 15, 5, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Carvanha', ['Water', 'Dark'], 'fishing', 25, 25, 35, goodRod),
      encounter('Feebas', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Carvanha', ['Water', 'Dark'], 'fishing', 35, 35, 60, superRod),
      encounter('Sharpedo', ['Water', 'Dark'], 'fishing', 40, 40, 35, superRod),
      encounter('Feebas', ['Water'], 'fishing', 35, 35, 5, superRod),
    ],
    notes: [
      'Route 119 has major long-grass, water, bike, waterfall, and Weather Institute progression splits; encounter conditions preserve the represented subareas.',
      'The Devon Scope Kecleon near the upper waterfall is represented as a special encounter.',
      'Feebas is available anywhere on Route 119 water in ORAS rather than limited tiles.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Weather Institute': {
    encounters: [
      encounter('Castform', ['Normal'], 'gift', 30, 30, 100, 'Gift after clearing Team Magma/Aqua from the Weather Institute'),
    ],
    notes: ['Castform holds Mystic Water in ORAS; held items are not represented in encounter options.'],
  },
  'Fortree City': {
    encounters: [
      {
        species: 'Skitty',
        types: ['Normal'],
        method: 'trade',
        version: 'Both',
        condition: 'Trade Spinda for Skitty in the northwest treehouse',
      },
    ],
    notes: ['ORAS in-game trade: Spinda for Skitty. Level matches the traded Spinda, so no fixed level is encoded.'],
  },
  'Route 120': {
    encounters: [
      encounter('Gloom', ['Grass', 'Poison'], 'grass', 24, 27, 40, 'Long grass'),
      encounter('Linoone', ['Normal'], 'grass', 24, 27, 40, 'Long grass'),
      encounter('Tropius', ['Grass', 'Flying'], 'grass', 27, 27, 10, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'grass', 27, 27, 5, 'Long grass'),
      encounter('Absol', ['Dark'], 'grass', 27, 27, 5, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'special', 30, 30, 100, 'Devon Scope special encounter by the northern lake'),
      encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 30, 66, 'Main route water'),
      encounter('Surskit', ['Bug', 'Water'], 'surfing', 20, 20, 30, 'Main route water'),
      encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4, 'Main route water'),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, 'Main route water Old Rod'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, 'Main route water Old Rod'),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, 'Main route water Good Rod'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, 'Main route water Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 25, 25, 5, 'Main route water Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 40, 100, 'Main route water Super Rod'),
      encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 20, 30, 66, 'Ancient Tomb area water'),
      encounter('Surskit', ['Bug', 'Water'], 'surfing', 20, 20, 30, 'Ancient Tomb area water'),
      encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4, 'Ancient Tomb area water'),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, 'Ancient Tomb area Old Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, 'Ancient Tomb area Old Rod'),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, 'Ancient Tomb area Good Rod'),
      encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, 'Ancient Tomb area Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 25, 25, 5, 'Ancient Tomb area Good Rod'),
      encounter('Barboach', ['Water', 'Ground'], 'fishing', 30, 40, 100, 'Ancient Tomb area Super Rod'),
    ],
    notes: [
      'Route 120 has separate main-route and Ancient Tomb-area water tables; conditions preserve those subareas.',
      'The Devon Scope Kecleon by the northern lake is represented as a special encounter.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 121': {
    encounters: [
      encounter('Gloom', ['Grass', 'Poison'], 'grass', 28, 30, 30, 'Tall grass'),
      encounter('Linoone', ['Normal'], 'grass', 28, 30, 30, 'Tall grass'),
      encounter('Shuppet', ['Ghost'], 'grass', 27, 29, 30, 'Tall grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 30, 30, 5, 'Tall grass'),
      encounter('Kecleon', ['Normal'], 'grass', 30, 30, 5, 'Tall grass'),
      encounter('Gloom', ['Grass', 'Poison'], 'grass', 28, 30, 30, 'Long grass'),
      encounter('Linoone', ['Normal'], 'grass', 28, 30, 30, 'Long grass'),
      encounter('Shuppet', ['Ghost'], 'grass', 27, 29, 30, 'Long grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 30, 30, 5, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'grass', 30, 30, 5, 'Long grass'),
    ],
    notes: [
      'Route 121 tall and long grass share the same ORAS encounter table.',
      'Safari Zone is intentionally separate from Route 121 and is not represented in this route slot.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Lilycove City': {
    encounters: [
      encounter('Graveler', ['Rock', 'Ground'], 'special', 28, 31, 100, 'Rock Smash'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing', 20, 25, 65),
      encounter('Wingull', ['Water', 'Flying'], 'surfing', 20, 20, 30),
      encounter('Pelipper', ['Water', 'Flying'], 'surfing', 25, 30, 5),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, goodRod),
      encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Wailmer', ['Water'], 'fishing', 30, 35, 95, superRod),
      encounter('Staryu', ['Water'], 'fishing', 40, 40, 5, superRod),
    ],
    notes: [
      'Rock Smash encounters are represented as special encounters with a Rock Smash condition.',
      'Water encounters are late-access after Surf/fishing rods.',
    ],
  },
  'Mt. Pyre': {
    encounters: [
      encounter('Shuppet', ['Ghost'], 'cave', 28, 31, 70, 'Interior'),
      encounter('Duskull', ['Ghost'], 'cave', 28, 31, 30, 'Interior'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'grass', 28, 31, 40, 'Exterior'),
      encounter('Shuppet', ['Ghost'], 'grass', 28, 31, 40, 'Exterior'),
      encounter('Vulpix', ['Fire'], 'grass', 29, 31, 15, 'Exterior'),
      encounter('Wingull', ['Water', 'Flying'], 'grass', 30, 30, 5, 'Exterior'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'grass', 28, 31, 40, 'Summit'),
      encounter('Shuppet', ['Ghost'], 'grass', 28, 31, 40, 'Summit'),
      encounter('Vulpix', ['Fire'], 'grass', 29, 31, 15, 'Summit'),
      encounter('Chimecho', ['Psychic'], 'grass', 30, 30, 5, 'Summit'),
    ],
    notes: [
      'Mt. Pyre has interior, exterior, and summit tables; conditions preserve those subareas.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 122': {
    encounters: hoennSeaEncounters(),
    notes: [
      'Route 122 is water-only in ORAS and connects Route 121/123 to Mt. Pyre.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 123': {
    encounters: [
      encounter('Gloom', ['Grass', 'Poison'], 'grass', 29, 31, 30, 'Long grass'),
      encounter('Linoone', ['Normal'], 'grass', 29, 31, 30, 'Long grass'),
      encounter('Shuppet', ['Ghost'], 'grass', 28, 30, 30, 'Long grass'),
      encounter('Pelipper', ['Water', 'Flying'], 'grass', 31, 31, 5, 'Long grass'),
      encounter('Kecleon', ['Normal'], 'grass', 31, 31, 5, 'Long grass'),
      encounter('Marill', ['Water', 'Fairy'], 'surfing', 20, 20, 50),
      encounter('Azumarill', ['Water', 'Fairy'], 'surfing', 25, 30, 16),
      encounter('Surskit', ['Bug', 'Water'], 'surfing', 20, 20, 30),
      encounter('Masquerain', ['Bug', 'Flying'], 'surfing', 25, 25, 4),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, oldRod),
      encounter('Goldeen', ['Water'], 'fishing', 5, 5, 35, oldRod),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, goodRod),
      encounter('Goldeen', ['Water'], 'fishing', 25, 25, 35, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 25, 25, 5, goodRod),
      encounter('Corphish', ['Water'], 'fishing', 30, 35, 95, superRod),
      encounter('Crawdaunt', ['Water', 'Dark'], 'fishing', 40, 40, 5, superRod),
    ],
    notes: [
      'Route 123 includes long grass and pond water/fishing encounters.',
      'TODO: Add Horde encounter subsystem before representing Horde-only tables.',
    ],
  },
  'Team Magma Hideout': {
    encounters: [
      ...hideoutSeaEncounters(),
      encounter('Electrode', ['Electric'], 'static', 40, 40, 100, "Maxie's room disguised item", 'Omega Ruby'),
    ],
    notes: [
      'Omega Ruby location. Hideout water encounters match the shared ORAS Team Aqua/Magma Hideout water table.',
      'Two disguised Electrode encounters are represented as one static option because the tracker stores encounter species options, not duplicate overworld objects.',
    ],
  },
  'Team Aqua Hideout': {
    encounters: [
      ...hideoutSeaEncounters(),
      encounter('Electrode', ['Electric'], 'static', 40, 40, 100, "Archie's room disguised item", 'Alpha Sapphire'),
    ],
    notes: [
      'Alpha Sapphire location. Hideout water encounters match the shared ORAS Team Aqua/Magma Hideout water table.',
      'Two disguised Electrode encounters are represented as one static option because the tracker stores encounter species options, not duplicate overworld objects.',
    ],
  },
  'Route 124': {
    encounters: [
      ...easternSeaEncounters(),
      ...easternUnderwaterEncounters(),
    ],
    notes: [
      'Dive encounters are represented as special encounters with an Underwater seaweed condition.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Mossdeep City': {
    encounters: [
      ...easternSeaEncounters(),
      encounter('Beldum', ['Steel', 'Psychic'], 'gift', 1, 1, 100, "Post-Hall of Fame gift in Steven's house"),
    ],
    notes: [
      'Beldum is a post-Hall of Fame gift at Steven\'s house; it is included here because the gift location is Mossdeep City.',
      'Delta Episode Kecleon in the Space Center is intentionally deferred with other Delta Episode content.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 125': {
    encounters: easternSeaEncounters(),
    notes: [
      'Route 125 is water-only and provides access to Shoal Cave.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Seel, Finneon, or Frillish.',
    ],
  },
  'Shoal Cave': {
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 31, 34, 40, 'High tide cave'),
      encounter('Sealeo', ['Ice', 'Water'], 'cave', 32, 34, 40, 'High tide cave'),
      encounter('Spheal', ['Ice', 'Water'], 'cave', 31, 31, 20, 'High tide cave'),
      encounter('Tentacool', ['Water', 'Poison'], 'surfing', 25, 25, 50, 'High tide water'),
      encounter('Golbat', ['Poison', 'Flying'], 'surfing', 25, 35, 35, 'High tide water'),
      encounter('Tentacruel', ['Water', 'Poison'], 'surfing', 30, 30, 15, 'High tide water'),
      encounter('Magikarp', ['Water'], 'fishing', 10, 15, 65, 'High tide Old Rod'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 5, 5, 35, 'High tide Old Rod'),
      encounter('Magikarp', ['Water'], 'fishing', 25, 25, 60, 'High tide Good Rod'),
      encounter('Tentacool', ['Water', 'Poison'], 'fishing', 25, 25, 35, 'High tide Good Rod'),
      encounter('Wailmer', ['Water'], 'fishing', 25, 25, 5, 'High tide Good Rod'),
      encounter('Wailmer', ['Water'], 'fishing', 30, 40, 100, 'High tide Super Rod'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 31, 34, 40, 'Low tide cave'),
      encounter('Sealeo', ['Ice', 'Water'], 'cave', 32, 34, 35, 'Low tide cave'),
      encounter('Spheal', ['Ice', 'Water'], 'cave', 31, 31, 20, 'Low tide cave'),
      encounter('Snorunt', ['Ice'], 'cave', 34, 34, 5, 'Low tide cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'special', 31, 34, 100, 'Low tide Rock Smash'),
      encounter('Snorunt', ['Ice'], 'cave', 31, 34, 40, 'Ice Room'),
      encounter('Sealeo', ['Ice', 'Water'], 'cave', 32, 34, 30, 'Ice Room'),
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 31, 34, 20, 'Ice Room'),
      encounter('Spheal', ['Ice', 'Water'], 'cave', 31, 31, 10, 'Ice Room'),
    ],
    notes: [
      'Shoal Cave tide windows: low tide 3:00-8:59 and 15:00-20:59; high tide 9:00-14:59 and 21:00-2:59.',
      'High tide, low tide, and Ice Room tables are preserved as encounter conditions instead of flattened.',
      'Rock Smash encounters are represented as special encounters with a Rock Smash condition.',
      'TODO: Add DexNav/hidden Pokemon and Horde encounter subsystems before representing those tables.',
    ],
  },
  'Route 127': {
    encounters: easternSeaEncounters(),
    notes: [
      'Route 127 has Dive navigation, but the verified ORAS location table lists standard water encounters only.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 128': {
    encounters: [
      ...luvdiscSeaEncounters(),
      ...route128UnderwaterEncounters(),
    ],
    notes: [
      'Route 128 has a route-specific underwater table with Corsola at 4% and Relicanth at 1%.',
      'Dive encounters are represented as special encounters with an Underwater seaweed condition.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Seafloor Cavern': {
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 33, 36, 100, 'Cave'),
      ...seafloorWaterEncounters(),
    ],
    notes: [
      'Seafloor Cavern normal cave encounters are Golbat only in verified ORAS tables.',
      'TODO: Add Horde encounter subsystem before representing Horde-only Zubat.',
    ],
  },
  'Sootopolis City': {
    encounters: sootopolisWaterEncounters(),
    notes: ['Sootopolis water has a Magikarp-only Surf/Old Rod/Good Rod table, with Gyarados only on Super Rod.'],
  },
  'Cave of Origin': {
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 25, 30, 69),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 33, 36, 31, undefined, 'Omega Ruby'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 33, 36, 31, undefined, 'Alpha Sapphire'),
      encounter('Primal Groudon', ['Ground', 'Fire'], 'static', 45, 45, 100, 'Story encounter', 'Omega Ruby'),
      encounter('Primal Kyogre', ['Water'], 'static', 45, 45, 100, 'Story encounter', 'Alpha Sapphire'),
    ],
    notes: [
      'Version-exclusive cave encounter: Mawile in Omega Ruby, Sableye in Alpha Sapphire.',
      'Primal Groudon/Kyogre is represented as a static story encounter because the tracker supports static methods.',
    ],
  },
  'Route 126': {
    encounters: [
      ...easternSeaEncounters(),
      ...easternUnderwaterEncounters(),
    ],
    notes: [
      'Dive encounters are represented as special encounters with an Underwater seaweed condition.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 129': {
    encounters: [
      ...easternSeaEncounters(),
      ...easternUnderwaterEncounters(),
    ],
    notes: [
      'Dive encounters are represented as special encounters with an Underwater seaweed condition.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 130': {
    encounters: [
      ...horseaSeaEncounters(),
      ...easternUnderwaterEncounters(),
    ],
    notes: [
      'Route 130 uses the Horsea/Seadra Super Rod table and has verified underwater seaweed encounters.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 131': {
    encounters: horseaSeaEncounters(),
    notes: [
      'Route 131 has no Dive spots in ORAS; Sky Pillar remains deferred with Delta Episode/postgame content.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Pacifidlog Town': {
    encounters: [
      ...easternSeaEncounters(),
      {
        species: 'Corsola',
        types: ['Water', 'Rock'],
        method: 'trade',
        version: 'Both',
        condition: 'Trade Bellossom for Corsola in the southeast house',
        notes: 'Trade Corsola has Regenerator and holds a Heart Scale; held items are not represented in encounter options.',
      },
    ],
    notes: ['ORAS in-game trade: Bellossom for Corsola. Level matches the traded Bellossom, so no fixed level is encoded.'],
  },
  'Route 132': {
    encounters: horseaSeaEncounters(),
    notes: [
      'Route 132 uses the Horsea/Seadra Super Rod table and has west-flowing current navigation.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 133': {
    encounters: horseaSeaEncounters(),
    notes: [
      'Route 133 uses the Horsea/Seadra Super Rod table and has west-flowing current navigation.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Route 134': {
    encounters: horseaSeaEncounters(),
    notes: [
      'Route 134 uses the Horsea/Seadra Super Rod table; verified ORAS data lists no wild Pokemon underwater on this route.',
      'TODO: Add DexNav/hidden Pokemon handling before representing Finneon, Frillish, or Alomomola.',
    ],
  },
  'Ever Grande City': {
    encounters: luvdiscSeaEncounters(),
    notes: ['Ever Grande City water uses the Luvdisc/Wailmer/Corsola Super Rod table.'],
  },
  'Victory Road': {
    encounters: [
      encounter('Golbat', ['Poison', 'Flying'], 'cave', 37, 39, 20, '1F/B1F cave'),
      encounter('Loudred', ['Normal'], 'cave', 37, 39, 20, '1F/B1F cave'),
      encounter('Lairon', ['Steel', 'Rock'], 'cave', 37, 39, 20, '1F/B1F cave'),
      encounter('Hariyama', ['Fighting'], 'cave', 38, 40, 15, '1F/B1F cave'),
      encounter('Medicham', ['Fighting', 'Psychic'], 'cave', 38, 40, 15, '1F/B1F cave'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave', 40, 40, 10, '1F/B1F cave', 'Omega Ruby'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave', 40, 40, 10, '1F/B1F cave', 'Alpha Sapphire'),
      ...victoryRoadSeaEncounters('1F'),
      ...victoryRoadSeaEncounters('B1F'),
      ...victoryRoad2fWaterEncounters(),
    ],
    notes: [
      'Victory Road 1F and B1F cave tables match; water tables are preserved by floor/condition.',
      'TODO: Add Horde encounter subsystem before representing Horde-only Zubat, Aron, and Loudred.',
    ],
  },
  'Pokemon League': noWild('No wild encounter options are available at the Pokemon League.'),
};

export const orasEncounterAreas: OrasEncounterArea[] = orasLocations.map((location) => {
  const populated = earlyEncounterData[location.displayName];
  return {
    locationId: location.id,
    displayName: location.displayName,
    encounters: populated?.encounters ?? [],
    notes: populated?.notes ?? ['TODO: Populate canonical ORAS encounter data.'],
  };
});

export const orasEncounterNotes = {
  versionSplit: 'Encounters marked Omega Ruby or Alpha Sapphire are version-exclusive. Encounters marked Both appear in both versions.',
  dexNav: 'DexNav-only encounter handling is intentionally deferred until the tracker has a dedicated DexNav condition model.',
};

export function getOrasEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsOrasData(gameVersion)) return {};

  return orasEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item): EncounterOption => ({
        species: item.species,
        types: item.types,
        method: item.method,
        version: item.version,
        surfMethod: item.method === 'surfing' || undefined,
        fishingMethod: item.method === 'fishing' || undefined,
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
