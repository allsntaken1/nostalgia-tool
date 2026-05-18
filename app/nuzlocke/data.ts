import type { GameVersion, NuzlockeBoss, NuzlockeBossPokemon, NuzlockeMove, PokemonType, RunType, StarterChoice } from './types';
import { getScarletVioletBosses } from '@/lib/nuzlocke/data/scarlet-violet-bosses';
import { getGen2Bosses, getGen2EncounterGroupsForTypeLookup, getGen2EncounterOptions, getGen2Locations, supportsGen2Data } from '@/lib/nuzlocke/data/gen2/johto';
import { getFrlgBosses, getFrlgEncounterOptions, getFrlgLocations, supportsFrlg } from '@/lib/nuzlocke/data/gen3/frlg';
import { getRseBosses, getRseEncounterOptions, getRseLocations, supportsRse } from '@/lib/nuzlocke/data/gen3/rse';
import { getGen4Bosses, getGen4EncounterGroupsForTypeLookup, getGen4EncounterOptions, getGen4Locations, supportsGen4Data } from '@/lib/nuzlocke/data/gen4';
import { getGen5Bosses, getGen5EncounterGroupsForTypeLookup, getGen5EncounterOptions, getGen5Locations, supportsGen5Data } from '@/lib/nuzlocke/data/gen5';
import { getGen6Bosses, getGen6EncounterOptions, getGen6Locations, getXyEncounterGroupsForTypeLookup, supportsGen6Data, supportsOrasData } from '@/lib/nuzlocke/data/gen6';
import { getGen7Bosses, getGen7EncounterGroupsForTypeLookup, getGen7EncounterOptions, getGen7Locations, supportsGen7Data } from '@/lib/nuzlocke/data/gen7';
import { getGen8Bosses, getGen8EncounterGroupsForTypeLookup, getGen8EncounterOptions, getGen8Locations, supportsGen8Data } from '@/lib/nuzlocke/data/gen8';
import { getRivalStarterChoice } from '@/lib/nuzlocke/starter';
import { getCachedPokemonSpriteUrl } from '@/lib/nuzlocke/data/pokemon-cache';

export const nuzlockeStorageKey = 'repeatchannel_nuzlocke_runs';

type GameDataStatus = 'Skeleton' | 'Partial' | 'In Audit' | 'Working Complete' | 'Complete';

export const gameGroups: { generation: string; games: { name: GameVersion; supported: boolean; dataStatus?: GameDataStatus }[] }[] = [
  { generation: 'Gen 1', games: ['Red', 'Blue', 'Yellow'].map((name) => ({ name: name as GameVersion, supported: true, dataStatus: 'Complete' as GameDataStatus })) },
  { generation: 'Gen 2', games: ['Gold', 'Silver', 'Crystal'].map((name) => ({ name: name as GameVersion, supported: true, dataStatus: 'Partial' })) },
  {
    generation: 'Gen 3',
    games: ['Ruby', 'Sapphire', 'Emerald', 'FireRed', 'LeafGreen'].map((name) => ({
      name: name as GameVersion,
      supported: true,
      dataStatus: (name === 'FireRed' || name === 'LeafGreen' ? 'In Audit' : 'Partial') as GameDataStatus,
    })),
  },
  {
    generation: 'Gen 4',
    games: ['Diamond', 'Pearl', 'Platinum', 'HeartGold', 'SoulSilver'].map((name) => ({
      name: name as GameVersion,
      supported: true,
      dataStatus: name === 'HeartGold' || name === 'SoulSilver' ? 'Partial' : 'Partial',
    })),
  },
  {
    generation: 'Gen 5',
    games: ['Black', 'White', 'Black 2', 'White 2'].map((name) => ({
      name: name as GameVersion,
      supported: true,
      dataStatus: 'Partial' as GameDataStatus,
    })),
  },
  {
    generation: 'Gen 6',
    games: ['X', 'Y', 'Omega Ruby', 'Alpha Sapphire'].map((name) => ({
      name: name as GameVersion,
      supported: true,
      dataStatus: 'Partial' as GameDataStatus,
    })),
  },
  { generation: 'Gen 7', games: ['Sun', 'Moon', 'Ultra Sun', 'Ultra Moon'].map((name) => ({ name: name as GameVersion, supported: true, dataStatus: 'Partial' as GameDataStatus })) },
  {
    generation: 'Gen 8',
    games: ['Sword', 'Shield', 'Brilliant Diamond', 'Shining Pearl', 'Legends: Arceus'].map((name) => ({
      name: name as GameVersion,
      supported: true,
      dataStatus: 'Complete' as GameDataStatus,
    })),
  },
  { generation: 'Gen 9', games: ['Scarlet', 'Violet'].map((name) => ({ name: name as GameVersion, supported: true, dataStatus: 'Partial' as GameDataStatus })) },
];

export const runTypes: RunType[] = [
  'Standard Nuzlocke',
  'Hardcore Nuzlocke',
  'Monotype',
  'Randomizer',
  'Soul Link',
  'Egglocke',
  'Custom Rules',
];

export const pokemonTypes: PokemonType[] = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

export const scarletVioletLocations = [
  'Starter',
  'Cabo Poco',
  'Poco Path',
  'South Province Area One',
  'South Province Area Two',
  'South Province Area Three',
  'South Province Area Four',
  'South Province Area Five',
  'South Province Area Six',
  'West Province Area One',
  'West Province Area Two',
  'West Province Area Three',
  'East Province Area One',
  'East Province Area Two',
  'East Province Area Three',
  'North Province Area One',
  'North Province Area Two',
  'North Province Area Three',
  'Asado Desert',
  'Tagtree Thicket',
  'Glaseado Mountain',
  'Casseroya Lake',
  'Socarrat Trail',
  'The Great Crater of Paldea',
  'Area Zero',
  'Tera Raid',
  'Gift / Static',
];

export const kantoLocations = [
  'Starter',
  'Route 1',
  'Route 2',
  'Viridian Forest',
  'Route 3',
  'Mt. Moon',
  'Route 4',
  'Route 24',
  'Route 25',
  'Route 5',
  'Route 6',
  'Route 7',
  'Route 8',
  'Route 9',
  'Route 10',
  'Rock Tunnel',
  'Route 11',
  'Diglett Cave',
  'Route 12',
  'Route 13',
  'Route 14',
  'Route 15',
  'Route 16',
  'Route 17',
  'Route 18',
  'Pokemon Tower',
  'Safari Zone',
  'Route 19',
  'Route 20',
  'Seafoam Islands',
  'Route 21',
  'Pallet Town',
  'Pokemon Mansion',
  'Power Plant',
  'Route 22',
  'Route 23',
  'Victory Road',
  'Gift / Static',
];

export type EncounterOption = {
  species: string;
  types: PokemonType[];
  abilities?: string[];
  surfMethod?: boolean;
  fishingMethod?: boolean;
  method?: 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary' | 'headbutt' | string;
  /** Optional rod gating for fishing encounters (Old/Good/Super). Rendered as a chip when present. */
  rod?: 'Old Rod' | 'Good Rod' | 'Super Rod';
  /** Optional condition annotation (e.g. "Rock Smash", "Daily", "Tuesdays only", subarea name). Rendered as a chip when present. */
  condition?: string;
  /** Optional version-exclusivity marker. Only set for entries that are NOT broadly available. */
  version?: GameVersion | 'Both';
  rate?: number;
  minLevel?: number;
  maxLevel?: number;
  notes?: string;
};

export const natureOptions = [
  'Not Sure',
  'Hardy (neutral)',
  'Lonely (+Atk / -Def)',
  'Brave (+Atk / -Spe)',
  'Adamant (+Atk / -SpA)',
  'Naughty (+Atk / -SpD)',
  'Bold (+Def / -Atk)',
  'Docile (neutral)',
  'Relaxed (+Def / -Spe)',
  'Impish (+Def / -SpA)',
  'Lax (+Def / -SpD)',
  'Timid (+Spe / -Atk)',
  'Hasty (+Spe / -Def)',
  'Serious (neutral)',
  'Jolly (+Spe / -SpA)',
  'Naive (+Spe / -SpD)',
  'Modest (+SpA / -Atk)',
  'Mild (+SpA / -Def)',
  'Quiet (+SpA / -Spe)',
  'Bashful (neutral)',
  'Rash (+SpA / -SpD)',
  'Calm (+SpD / -Atk)',
  'Gentle (+SpD / -Def)',
  'Sassy (+SpD / -Spe)',
  'Careful (+SpD / -SpA)',
  'Quirky (neutral)',
];

export const heldItemOptions = [
  'None',
  'Not Sure',
  'Ability Shield',
  'Assault Vest',
  'Berry',
  'Black Sludge',
  'Booster Energy',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Clear Amulet',
  'Covert Cloak',
  'Eviolite',
  'Expert Belt',
  'Focus Sash',
  'Leftovers',
  'Life Orb',
  'Loaded Dice',
  'Mirror Herb',
  'Muscle Band',
  'Oran Berry',
  'Punching Glove',
  'Rocky Helmet',
  'Shell Bell',
  'Sitrus Berry',
  'Type-boosting Item',
  'Wise Glasses',
  'Other',
];

export const commonAbilityOptions = [
  'Not Sure',
  'Primary Ability',
  'Secondary Ability',
  'Hidden Ability',
];

const genOneAbilityOptions = ['No abilities in Gen 1'];

const genOneSpecies = new Set([
  'Abra',
  'Aerodactyl',
  'Alakazam',
  'Arbok',
  'Arcanine',
  'Beedrill',
  'Bellsprout',
  'Blastoise',
  'Bulbasaur',
  'Butterfree',
  'Caterpie',
  'Chansey',
  'Charizard',
  'Charmander',
  'Charmeleon',
  'Clefairy',
  'Cloyster',
  'Cubone',
  'Dewgong',
  'Diglett',
  'Ditto',
  'Doduo',
  'Dragonair',
  'Dragonite',
  'Drowzee',
  'Dugtrio',
  'Eevee',
  'Ekans',
  'Electabuzz',
  'Electrode',
  'Exeggcute',
  'Exeggutor',
  'Fearow',
  'Gastly',
  'Gengar',
  'Geodude',
  'Gloom',
  'Golbat',
  'Growlithe',
  'Gyarados',
  'Haunter',
  'Hitmonchan',
  'Hitmonlee',
  'Hypno',
  'Ivysaur',
  'Jigglypuff',
  'Jynx',
  'Kadabra',
  'Kakuna',
  'Koffing',
  'Lapras',
  'Machamp',
  'Machoke',
  'Machop',
  'Magikarp',
  'Magnemite',
  'Magneton',
  'Mankey',
  'Marowak',
  'Meowth',
  'Metapod',
  'Moltres',
  'MrMime',
  'Muk',
  'Nidoking',
  'Nidoqueen',
  'NidoranF',
  'NidoranM',
  'Nidorina',
  'Nidorino',
  'Ninetales',
  'Oddish',
  'Onix',
  'Paras',
  'Persian',
  'Pidgeot',
  'Pidgeotto',
  'Pidgey',
  'Pikachu',
  'Pinsir',
  'Ponyta',
  'Primeape',
  'Psyduck',
  'Raichu',
  'Rapidash',
  'Raticate',
  'Rattata',
  'Rhydon',
  'Rhyhorn',
  'Sandshrew',
  'Sandslash',
  'Scyther',
  'Seel',
  'Shellder',
  'Slowbro',
  'Slowpoke',
  'Spearow',
  'Squirtle',
  'Starmie',
  'Staryu',
  'Tangela',
  'Tauros',
  'Tentacool',
  'Venomoth',
  'Venonat',
  'Venusaur',
  'Victreebel',
  'Vileplume',
  'Voltorb',
  'Vulpix',
  'Wartortle',
  'Weedle',
  'Weepinbell',
  'Weezing',
  'Zubat',
]);

export const speciesAbilityOptions: Record<string, string[]> = {
  Bulbasaur: ['Not Sure'],
  Charmander: ['Not Sure'],
  Squirtle: ['Not Sure'],
  Pikachu: ['Not Sure'],
  Pidgey: ['Not Sure'],
  Rattata: ['Not Sure'],
  Spearow: ['Not Sure'],
  Caterpie: ['Not Sure'],
  Weedle: ['Not Sure'],
  Metapod: ['Not Sure'],
  Kakuna: ['Not Sure'],
  NidoranF: ['Not Sure'],
  NidoranM: ['Not Sure'],
  Jigglypuff: ['Not Sure'],
  Zubat: ['Not Sure'],
  Geodude: ['Not Sure'],
  Paras: ['Not Sure'],
  Clefairy: ['Not Sure'],
  Sandshrew: ['Not Sure'],
  Ekans: ['Not Sure'],
  Mankey: ['Not Sure'],
  Abra: ['Not Sure'],
  Bellsprout: ['Not Sure'],
  Oddish: ['Not Sure'],
  Meowth: ['Not Sure'],
  Vulpix: ['Not Sure'],
  Growlithe: ['Not Sure'],
  Diglett: ['Not Sure'],
  Drowzee: ['Not Sure'],
  Voltorb: ['Not Sure'],
  Magnemite: ['Not Sure'],
  Machop: ['Not Sure'],
  Gastly: ['Not Sure'],
  Cubone: ['Not Sure'],
  Koffing: ['Not Sure'],
  Rhyhorn: ['Not Sure'],
  Chansey: ['Not Sure'],
  Tangela: ['Not Sure'],
  Scyther: ['Not Sure'],
  Pinsir: ['Not Sure'],
  Tauros: ['Not Sure'],
  Magikarp: ['Not Sure'],
  Tentacool: ['Not Sure'],
  Seel: ['Not Sure'],
  Ponyta: ['Not Sure'],
  Grimer: ['Not Sure'],
  Electabuzz: ['Not Sure'],
  Sprigatito: ['Overgrow', 'Protean', 'Not Sure'],
  Fuecoco: ['Blaze', 'Unaware', 'Not Sure'],
  Quaxly: ['Torrent', 'Moxie', 'Not Sure'],
  Lechonk: ['Aroma Veil', 'Gluttony', 'Thick Fat', 'Not Sure'],
  Tarountula: ['Insomnia', 'Stakeout', 'Not Sure'],
  Fletchling: ['Big Pecks', 'Gale Wings', 'Not Sure'],
  Hoppip: ['Chlorophyll', 'Leaf Guard', 'Infiltrator', 'Not Sure'],
  Pawmi: ['Static', 'Natural Cure', 'Iron Fist', 'Not Sure'],
  Scatterbug: ['Shield Dust', 'Compound Eyes', 'Friend Guard', 'Not Sure'],
  Yungoos: ['Stakeout', 'Strong Jaw', 'Adaptability', 'Not Sure'],
  Fidough: ['Own Tempo', 'Klutz', 'Not Sure'],
  Smoliv: ['Early Bird', 'Harvest', 'Not Sure'],
  Mareep: ['Static', 'Plus', 'Not Sure'],
  Maschiff: ['Intimidate', 'Run Away', 'Stakeout', 'Not Sure'],
  Shinx: ['Rivalry', 'Intimidate', 'Guts', 'Not Sure'],
  Ralts: ['Synchronize', 'Trace', 'Telepathy', 'Not Sure'],
  Nacli: ['Purifying Salt', 'Sturdy', 'Clear Body', 'Not Sure'],
  Charcadet: ['Flash Fire', 'Flame Body', 'Not Sure'],
  Tinkatink: ['Mold Breaker', 'Own Tempo', 'Pickpocket', 'Not Sure'],
  Cyclizar: ['Shed Skin', 'Regenerator', 'Not Sure'],
  Frigibax: ['Thermal Exchange', 'Ice Body', 'Not Sure'],
  Gimmighoul: ['Rattled', 'Not Sure'],
};

export function getAbilityOptions(species: string) {
  if (genOneSpecies.has(species)) return genOneAbilityOptions;
  return speciesAbilityOptions[species] ?? commonAbilityOptions;
}

export const pokemonSpriteIds: Record<string, number> = {
  Bulbasaur: 1,
  Ivysaur: 2,
  Venusaur: 3,
  Charmander: 4,
  Charmeleon: 5,
  Charizard: 6,
  Squirtle: 7,
  Wartortle: 8,
  Blastoise: 9,
  Caterpie: 10,
  Metapod: 11,
  Butterfree: 12,
  Weedle: 13,
  Kakuna: 14,
  Beedrill: 15,
  Pidgey: 16,
  Pidgeotto: 17,
  Rattata: 19,
  Raticate: 20,
  Spearow: 21,
  Fearow: 22,
  Ekans: 23,
  Arbok: 24,
  Pikachu: 25,
  Raichu: 26,
  Sandshrew: 27,
  NidoranF: 29,
  'Nidoran♀': 29,
  'Nidoran Female': 29,
  Nidorina: 30,
  Nidoqueen: 31,
  NidoranM: 32,
  'Nidoran♂': 32,
  'Nidoran Male': 32,
  Nidorino: 33,
  Nidoking: 34,
  Clefairy: 35,
  Vulpix: 37,
  Ninetales: 38,
  Jigglypuff: 39,
  Zubat: 41,
  Golbat: 42,
  Oddish: 43,
  Gloom: 44,
  Vileplume: 45,
  Paras: 46,
  Venonat: 48,
  Venomoth: 49,
  Diglett: 50,
  Meowth: 52,
  Persian: 53,
  Mankey: 56,
  Primeape: 57,
  Growlithe: 58,
  Arcanine: 59,
  Psyduck: 54,
  Slowpoke: 79,
  Geodude: 74,
  Onix: 95,
  Abra: 63,
  Kadabra: 64,
  Alakazam: 65,
  Machop: 66,
  Machoke: 67,
  Machamp: 68,
  Bellsprout: 69,
  Weepinbell: 70,
  Victreebel: 71,
  Tentacool: 72,
  Ponyta: 77,
  Rapidash: 78,
  Slowbro: 80,
  Magnemite: 81,
  Magneton: 82,
  Farfetchd: 83,
  "Farfetch'd": 83,
  Seel: 86,
  Dewgong: 87,
  Grimer: 88,
  Muk: 89,
  Shellder: 90,
  Cloyster: 91,
  Gastly: 92,
  Haunter: 93,
  Gengar: 94,
  Drowzee: 96,
  Hypno: 97,
  Voltorb: 100,
  Electrode: 101,
  Cubone: 104,
  Marowak: 105,
  Hitmonlee: 106,
  Hitmonchan: 107,
  Koffing: 109,
  Weezing: 110,
  Rhyhorn: 111,
  Rhydon: 112,
  Chansey: 113,
  Tangela: 114,
  Kangaskhan: 115,
  Exeggcute: 102,
  Eevee: 133,
  Ditto: 132,
  Doduo: 84,
  Moltres: 146,
  MrMime: 122,
  'Mr. Mime': 122,
  'Mr Mime': 122,
  Scyther: 123,
  Pinsir: 127,
  Jynx: 124,
  Electabuzz: 125,
  Magikarp: 129,
  Gyarados: 130,
  Lapras: 131,
  Staryu: 120,
  Starmie: 121,
  Dugtrio: 51,
  Pidgeot: 18,
  Sandslash: 28,
  Exeggutor: 103,
  Aerodactyl: 142,
  Dragonair: 148,
  Dragonite: 149,
  Sprigatito: 906,
  Fuecoco: 909,
  Quaxly: 912,
  Lechonk: 915,
  Tarountula: 917,
  Fletchling: 661,
  Hoppip: 187,
  Pawmi: 921,
  Scatterbug: 664,
  Yungoos: 734,
  Fidough: 926,
  Smoliv: 928,
  Igglybuff: 174,
  Combee: 415,
  Mareep: 179,
  Maschiff: 942,
  Shinx: 403,
  Nacli: 932,
  Rookidee: 821,
  Charcadet: 935,
  Tadbulb: 938,
  Makuhita: 296,
  Shroodle: 944,
  Squawkabilly: 931,
  Applin: 840,
  Deerling: 585,
  Pineco: 204,
  Mudbray: 749,
  Teddiursa: 216,
  Sudowoodo: 185,
  Flittle: 955,
  Pawmo: 922,
  Goomy: 704,
  Croagunk: 453,
  Toxel: 848,
  Capsakid: 951,
  Tinkatink: 957,
  Gible: 443,
  Larvitar: 246,
  Bagon: 371,
  Meditite: 307,
  Salandit: 757,
  Noibat: 714,
  Axew: 610,
  Nymble: 919,
  Wattrel: 940,
  Finizen: 963,
  Bombirdier: 962,
  Girafarig: 203,
  Tauros: 128,
  Silicobra: 843,
  Rufflet: 627,
  Toedscool: 948,
  Foongus: 590,
  Dunsparce: 206,
  Komala: 775,
  Zorua: 570,
  Mimikyu: 778,
  Shuppet: 353,
  Pincurchin: 871,
  Eelektrik: 603,
  Cyclizar: 967,
  Varoom: 965,
  Oricorio: 741,
  Murkrow: 198,
  Mareanie: 747,
  Bramblin: 946,
  Orthworm: 968,
  Sandile: 551,
  Cacnea: 331,
  Rolycoly: 837,
  Numel: 322,
  Spoink: 325,
  Glimmet: 969,
  Klefki: 707,
  Cufant: 878,
  Torkoal: 324,
  Bronzor: 436,
  Sableye: 302,
  Tinkatuff: 958,
  Bisharp: 625,
  Sneasel: 215,
  Hawlucha: 701,
  Falinks: 870,
  Noivern: 715,
  Lurantis: 754,
  Heracross: 214,
  Forretress: 205,
  Tropius: 357,
  Ursaring: 217,
  Cetoddle: 974,
  Snom: 872,
  Eiscue: 875,
  Bergmite: 712,
  Cubchoo: 613,
  Frigibax: 996,
  Rellor: 953,
  Hippopotas: 449,
  Grafaiai: 945,
  Impidimp: 859,
  Morgrem: 860,
  Toedscruel: 949,
  Cryogonal: 615,
  Snorunt: 361,
  Greavard: 971,
  Dondozo: 977,
  Tatsugiri: 978,
  Veluza: 976,
  Dratini: 147,
  Glimmora: 970,
  Whiscash: 340,
  Camerupt: 323,
  Donphan: 232,
  Clodsire: 980,
  Copperajah: 879,
  Magnezone: 462,
  Tinkaton: 959,
  Haxorus: 612,
  Dragalge: 691,
  Flapple: 841,
  Baxcalibur: 998,
  Flamigo: 973,
  Meowscarada: 908,
  Skeledirge: 911,
  Quaquaval: 914,
  Umbreon: 197,
  Vaporeon: 134,
  Jolteon: 135,
  Flareon: 136,
  Leafeon: 470,
  Sylveon: 700,
  Hatterene: 858,
  Corviknight: 823,
  Medicham: 308,
  Espathra: 956,
  Farigiraf: 981,
  'Great Tusk': 984,
  'Iron Treads': 990,
  'Scream Tail': 985,
  'Iron Bundle': 991,
  'Roaring Moon': 1005,
  'Iron Valiant': 1006,
  Wooper: 194,
  Petilil: 548,
  Bellibolt: 939,
  Luxio: 404,
  Wugtrio: 961,
  Crabominable: 740,
  Mismagius: 429,
  Dudunsparce: 982,
  Staraptor: 398,
  Banette: 354,
  Houndstone: 972,
  Toxtricity: 849,
  Gardevoir: 282,
  Florges: 671,
  Frosmoth: 873,
  Beartic: 614,
  Cetitan: 975,
  Altaria: 334,
  Klawf: 950,
  Pawniard: 624,
  Skuntank: 435,
  Revavroom: 966,
  Azumarill: 184,
  Wigglytuff: 40,
  Dachsbun: 927,
  Toxicroak: 454,
  Passimian: 766,
  Lucario: 448,
  Annihilape: 979,
  Lycanroc: 745,
  Pawmot: 923,
  Goodra: 706,
  Gogoat: 673,
  Avalugg: 713,
  Kingambit: 983,
  Grookey: 810,
  Scorbunny: 813,
  Sobble: 816,
  Wooloo: 831,
  Skwovet: 819,
  Nickit: 827,
  Yamper: 835,
  Chewtle: 833,
  Gossifleur: 829,
  Eldegoss: 830,
  Arrokuda: 846,
  Drednaw: 834,
  Sizzlipede: 850,
  Centiskorch: 851,
  Roggenrola: 524,
  Woobat: 527,
  Drilbur: 529,
  Milcery: 868,
  Pumpkaboo: 710,
  Stufful: 759,
  Sinistea: 854,
  Clobbopus: 852,
  Darumaka: 554,
  Duraludon: 884,
  Bunnelby: 659,
  Tyrogue: 236,
  Budew: 406,
  Bounsweet: 761,
  Nuzleaf: 274,
  Duskull: 355,
  Drifloon: 425,
  Lotad: 270,
  Wingull: 278,
  Tympole: 535,
  Krabby: 98,
  Dreepy: 885,
  Vullaby: 629,
  Goldeen: 118,
  Hitmontop: 237,
  Pangoro: 675,
  "Sirfetch'd": 865,
  Yamask: 562,
  Cursola: 864,
  Mawile: 303,
  Togekiss: 468,
  Alcremie: 869,
  Barbaracle: 689,
  Shuckle: 213,
  Stonjourner: 874,
  Coalossal: 839,
  Darmanitan: 555,
  Scrafty: 560,
  Malamar: 687,
  Obstagoon: 862,
  Gigalith: 526,
  Flygon: 330,
  Sandaconda: 844,
  Aegislash: 681,
  Dragapult: 887,
  Seismitoad: 537,
  'Mr. Rime': 866,
  Solosis: 577,
  Gothita: 574,
  Hatenna: 856,
  Scraggy: 559,
  Morpeko: 877,
  Turtwig: 387,
  Chimchar: 390,
  Piplup: 393,
  Starly: 396,
  Bidoof: 399,
  Cranidos: 408,
  Cherubi: 420,
  Roserade: 407,
  Spiritomb: 442,
  Gastrodon: 423,
  Milotic: 350,
  Garchomp: 445,
  Rowlet: 722,
  Cyndaquil: 155,
  Oshawott: 501,
  Munchlax: 446,
  Kleavor: 900,
};

/**
 * Form-name overrides for species whose PokéAPI / Showdown slug is not a plain lowercase form
 * of the display name. Shared between sprite lookup and PokéAPI name resolution.
 * Add new entries here when a sprite or PokéAPI fetch fails for a multi-form species.
 */
export const pokemonFormSlugOverrides: Record<string, string> = {
  MrMime: 'mr-mime',
  'Mr. Mime': 'mr-mime',
  'Mr. Rime': 'mr-rime',
  Farfetchd: 'farfetchd',
  "Farfetch'd": 'farfetchd',
  'Farfetch’d': 'farfetchd',
  NidoranF: 'nidoran-f',
  NidoranM: 'nidoran-m',
  'Nidoran♀': 'nidoran-f',
  'Nidoran♂': 'nidoran-m',
  'Nidoran Female': 'nidoran-f',
  'Nidoran Male': 'nidoran-m',
  'Nidoran-F': 'nidoran-f',
  'Nidoran-M': 'nidoran-m',
  Flabebe: 'flabebe',
  // Form-sensitive species — pick the default battle form so a sprite always resolves.
  Aegislash: 'aegislash-shield',
  Pumpkaboo: 'pumpkaboo-average',
  Gourgeist: 'gourgeist-average',
  Wormadam: 'wormadam-plant',
  Basculin: 'basculin-red-striped',
  Darmanitan: 'darmanitan-standard',
  Tornadus: 'tornadus-incarnate',
  Thundurus: 'thundurus-incarnate',
  Landorus: 'landorus-incarnate',
  Keldeo: 'keldeo-ordinary',
  Meloetta: 'meloetta-aria',
  Meowstic: 'meowstic-male',
  Zygarde: 'zygarde-50',
  // Existing dispatcher entries kept for compatibility:
  'Great Tusk': 'great-tusk',
  'Iron Treads': 'iron-treads',
  'Segin Starmobile': 'revavroom',
  'Schedar Starmobile': 'revavroom',
  'Navi Starmobile': 'revavroom',
  'Ruchbah Starmobile': 'revavroom',
  'Caph Starmobile': 'revavroom',
};

/** Convert an internal display name to the PokéAPI / Showdown slug for sprite/data fetches. */
export function pokemonSpeciesSlug(species: string): string {
  const cleanSpecies = species.split('/')[0]?.trim() ?? '';
  if (!cleanSpecies) return '';
  const overridden = pokemonFormSlugOverrides[cleanSpecies];
  if (overridden) return overridden;
  return cleanSpecies
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve a sprite URL for a Pokémon by name.
 *
 * Strategy:
 *   1. If we have a hardcoded national-dex ID, use the PokéAPI GitHub mirror (stable, cached).
 *   2. Otherwise, fall back to a slug-based Showdown URL (Gen 5 style stills cover all
 *      Pokémon including Gen 6+ forms via the override map above).
 *   3. If both fail at render time, the `<img onError>` handler in MonsterToken hides the
 *      broken image and shows initials instead — so this function returning a URL is safe.
 */
export function getPokemonSpriteUrl(species: string) {
  const cleanSpecies = species.split('/')[0]?.trim();
  if (!cleanSpecies) return '';
  // 1. Prefer the local cache (populated by scripts/generate-pokemon-cache.ts).
  //    This is the only path that hits no network on render — pure JSON lookup.
  const cachedSprite = getCachedPokemonSpriteUrl(cleanSpecies);
  if (cachedSprite) return cachedSprite;
  // 2. Hardcoded national-dex IDs from this file (legacy fast-path; survives
  //    until the cache is regenerated and covers the species).
  const id = pokemonSpriteIds[cleanSpecies];
  if (id) return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  // 3. Final slug-based fallback to Showdown sprites (no API call; static CDN).
  const slug = pokemonSpeciesSlug(species);
  if (!slug) return '';
  return `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`;
}

const starterOptions: EncounterOption[] = [
  { species: 'Sprigatito', types: ['Grass'] },
  { species: 'Fuecoco', types: ['Fire'] },
  { species: 'Quaxly', types: ['Water'] },
];

// Per-game starter rosters used by the dispatcher to inject a "Starter Pokémon" location.
// Order matches canonical pokedex order (Grass / Fire / Water) for each gen.
const frlgStarterOptions: EncounterOption[] = [
  { species: 'Bulbasaur', types: ['Grass', 'Poison'] },
  { species: 'Charmander', types: ['Fire'] },
  { species: 'Squirtle', types: ['Water'] },
];
const hgssStarterOptions: EncounterOption[] = [
  { species: 'Chikorita', types: ['Grass'] },
  { species: 'Cyndaquil', types: ['Fire'] },
  { species: 'Totodile', types: ['Water'] },
];
const bwStarterOptions: EncounterOption[] = [
  { species: 'Snivy', types: ['Grass'] },
  { species: 'Tepig', types: ['Fire'] },
  { species: 'Oshawott', types: ['Water'] },
];
const bdspStarterOptions: EncounterOption[] = [
  { species: 'Turtwig', types: ['Grass'] },
  { species: 'Chimchar', types: ['Fire'] },
  { species: 'Piplup', types: ['Water'] },
];
const swshStarterOptions: EncounterOption[] = [
  { species: 'Grookey', types: ['Grass'] },
  { species: 'Scorbunny', types: ['Fire'] },
  { species: 'Sobble', types: ['Water'] },
];
const xyStarterOptions: EncounterOption[] = [
  { species: 'Chespin', types: ['Grass'] },
  { species: 'Fennekin', types: ['Fire'] },
  { species: 'Froakie', types: ['Water'] },
];
const orasStarterOptions: EncounterOption[] = [
  { species: 'Treecko', types: ['Grass'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
  { species: 'Torchic', types: ['Fire'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
  { species: 'Mudkip', types: ['Water'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
];
const rseStarterOptions: EncounterOption[] = [
  { species: 'Treecko', types: ['Grass'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
  { species: 'Torchic', types: ['Fire'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
  { species: 'Mudkip', types: ['Water'], method: 'gift', version: 'Both', minLevel: 5, maxLevel: 5, rate: 100 },
];
const gen7StarterOptions: EncounterOption[] = [
  { species: 'Rowlet', types: ['Grass', 'Flying'] },
  { species: 'Litten', types: ['Fire'] },
  { species: 'Popplio', types: ['Water'] },
];

/**
 * Universal "Starter Pokémon" pseudo-location name. Used by every game that doesn't
 * already have an existing "Starter" entry baked into its location list. Runs that
 * log a starter use this string as the encounter location.
 */
export const STARTER_PSEUDO_LOCATION = 'Starter Pokémon';

/** Return the canonical 3 starters for a game, or [] if the game is unsupported. */
function getStarterOptionsForGame(gameVersion: GameVersion): EncounterOption[] {
  switch (gameVersion) {
    case 'X':
    case 'Y':
      return xyStarterOptions;
    case 'Omega Ruby':
    case 'Alpha Sapphire':
      return orasStarterOptions;
    case 'Sun':
    case 'Moon':
    case 'Ultra Sun':
    case 'Ultra Moon':
      return gen7StarterOptions;
    case 'FireRed':
    case 'LeafGreen':
      return frlgStarterOptions;
    case 'Ruby':
    case 'Sapphire':
    case 'Emerald':
      return rseStarterOptions;
    case 'HeartGold':
    case 'SoulSilver':
      return hgssStarterOptions;
    case 'Black':
    case 'White':
    case 'Black 2':
    case 'White 2':
      return bwStarterOptions;
    case 'Brilliant Diamond':
    case 'Shining Pearl':
      return bdspStarterOptions;
    case 'Diamond':
    case 'Pearl':
    case 'Platinum':
      // Sinnoh starters are the same line as BDSP — reuse the existing helper.
      return bdspStarterOptions;
    case 'Sword':
    case 'Shield':
      return swshStarterOptions;
    default:
      // Kanto (Red/Blue/Yellow) and Scarlet/Violet already include an explicit "Starter"
      // entry in their hardcoded location lists below — no injection needed.
      return [];
  }
}

const redBlueStarterOptions: EncounterOption[] = [
  { species: 'Bulbasaur', types: ['Grass', 'Poison'] },
  { species: 'Charmander', types: ['Fire'] },
  { species: 'Squirtle', types: ['Water'] },
];

const yellowStarterOptions: EncounterOption[] = [
  { species: 'Pikachu', types: ['Electric'] },
];

const kantoSharedEncounters: Record<string, EncounterOption[]> = {
  'Pallet Town': [
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
    { species: 'Tentacool', types: ['Water', 'Poison'], fishingMethod: true },
  ],
  'Route 1': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Rattata', types: ['Normal'] },
  ],
  'Route 2': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Caterpie', types: ['Bug'] },
    { species: 'Weedle', types: ['Bug', 'Poison'] },
  ],
  'Viridian Forest': [
    { species: 'Caterpie', types: ['Bug'] },
    { species: 'Metapod', types: ['Bug'] },
    { species: 'Weedle', types: ['Bug', 'Poison'] },
    { species: 'Kakuna', types: ['Bug', 'Poison'] },
    { species: 'Pikachu', types: ['Electric'] },
  ],
  'Route 3': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Jigglypuff', types: ['Normal'] },
  ],
  'Mt. Moon': [
    { species: 'Zubat', types: ['Poison', 'Flying'] },
    { species: 'Geodude', types: ['Rock', 'Ground'] },
    { species: 'Paras', types: ['Bug', 'Grass'] },
    { species: 'Clefairy', types: ['Normal'] },
  ],
  'Route 4': [
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Ekans', types: ['Poison'] },
    { species: 'Sandshrew', types: ['Ground'] },
  ],
  'Route 24': [
    { species: 'Caterpie', types: ['Bug'] },
    { species: 'Weedle', types: ['Bug', 'Poison'] },
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Abra', types: ['Psychic'] },
  ],
  'Route 25': [
    { species: 'Caterpie', types: ['Bug'] },
    { species: 'Weedle', types: ['Bug', 'Poison'] },
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Abra', types: ['Psychic'] },
  ],
  'Route 5': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bellsprout', types: ['Grass', 'Poison'] },
    { species: 'Meowth', types: ['Normal'] },
    { species: 'Mankey', types: ['Fighting'] },
  ],
  'Route 6': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bellsprout', types: ['Grass', 'Poison'] },
    { species: 'Meowth', types: ['Normal'] },
    { species: 'Mankey', types: ['Fighting'] },
  ],
  'Route 7': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bellsprout', types: ['Grass', 'Poison'] },
    { species: 'Vulpix', types: ['Fire'] },
    { species: 'Growlithe', types: ['Fire'] },
  ],
  'Route 8': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Ekans', types: ['Poison'] },
    { species: 'Sandshrew', types: ['Ground'] },
    { species: 'Vulpix', types: ['Fire'] },
    { species: 'Growlithe', types: ['Fire'] },
  ],
  'Route 9': [
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Ekans', types: ['Poison'] },
    { species: 'Sandshrew', types: ['Ground'] },
  ],
  'Route 10': [
    { species: 'Voltorb', types: ['Electric'] },
    { species: 'Magnemite', types: ['Electric', 'Steel'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
  ],
  'Rock Tunnel': [
    { species: 'Zubat', types: ['Poison', 'Flying'] },
    { species: 'Geodude', types: ['Rock', 'Ground'] },
    { species: 'Machop', types: ['Fighting'] },
    { species: 'Onix', types: ['Rock', 'Ground'] },
  ],
  'Route 11': [
    { species: 'Drowzee', types: ['Psychic'] },
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
  ],
  'Diglett Cave': [
    { species: 'Diglett', types: ['Ground'] },
  ],
  'Route 12': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bellsprout', types: ['Grass', 'Poison'] },
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
    { species: 'Tentacool', types: ['Water', 'Poison'], surfMethod: true },
  ],
  'Route 13': [
    { species: 'Pidgey', types: ['Normal', 'Flying'] },
    { species: 'Ditto', types: ['Normal'] },
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bellsprout', types: ['Grass', 'Poison'] },
  ],
  'Route 14': [
    { species: 'Pidgeotto', types: ['Normal', 'Flying'] },
    { species: 'Ditto', types: ['Normal'] },
    { species: 'Venonat', types: ['Bug', 'Poison'] },
  ],
  'Route 15': [
    { species: 'Pidgeotto', types: ['Normal', 'Flying'] },
    { species: 'Ditto', types: ['Normal'] },
    { species: 'Venonat', types: ['Bug', 'Poison'] },
  ],
  'Route 16': [
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Doduo', types: ['Normal', 'Flying'] },
  ],
  'Route 17': [
    { species: 'Raticate', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Doduo', types: ['Normal', 'Flying'] },
  ],
  'Route 18': [
    { species: 'Raticate', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Doduo', types: ['Normal', 'Flying'] },
  ],
  'Pokemon Tower': [
    { species: 'Gastly', types: ['Ghost', 'Poison'] },
    { species: 'Haunter', types: ['Ghost', 'Poison'] },
    { species: 'Cubone', types: ['Ground'] },
  ],
  'Safari Zone': [
    { species: 'NidoranF', types: ['Poison'] },
    { species: 'NidoranM', types: ['Poison'] },
    { species: 'Rhyhorn', types: ['Ground', 'Rock'] },
    { species: 'Exeggcute', types: ['Grass', 'Psychic'] },
    { species: 'Chansey', types: ['Normal'] },
    { species: 'Scyther', types: ['Bug', 'Flying'] },
    { species: 'Pinsir', types: ['Bug'] },
    { species: 'Tauros', types: ['Normal'] },
  ],
  'Route 19': [
    { species: 'Tentacool', types: ['Water', 'Poison'], surfMethod: true },
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
  ],
  'Route 20': [
    { species: 'Tentacool', types: ['Water', 'Poison'], surfMethod: true },
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
  ],
  'Seafoam Islands': [
    { species: 'Zubat', types: ['Poison', 'Flying'] },
    { species: 'Golbat', types: ['Poison', 'Flying'] },
    { species: 'Seel', types: ['Water'] },
    { species: 'Psyduck', types: ['Water'] },
    { species: 'Slowpoke', types: ['Water', 'Psychic'] },
  ],
  'Route 21': [
    { species: 'Pidgeotto', types: ['Normal', 'Flying'] },
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Tangela', types: ['Grass'] },
    { species: 'Tentacool', types: ['Water', 'Poison'], surfMethod: true },
  ],
  'Pokemon Mansion': [
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Raticate', types: ['Normal'] },
    { species: 'Grimer', types: ['Poison'] },
    { species: 'Koffing', types: ['Poison'] },
    { species: 'Growlithe', types: ['Fire'] },
    { species: 'Vulpix', types: ['Fire'] },
  ],
  'Power Plant': [
    { species: 'Voltorb', types: ['Electric'] },
    { species: 'Magnemite', types: ['Electric', 'Steel'] },
    { species: 'Pikachu', types: ['Electric'] },
    { species: 'Electabuzz', types: ['Electric'] },
  ],
  'Route 22': [
    { species: 'Rattata', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Mankey', types: ['Fighting'] },
    { species: 'NidoranF', types: ['Poison'] },
    { species: 'NidoranM', types: ['Poison'] },
  ],
  'Route 23': [
    { species: 'Ditto', types: ['Normal'] },
    { species: 'Spearow', types: ['Normal', 'Flying'] },
    { species: 'Fearow', types: ['Normal', 'Flying'] },
  ],
  'Victory Road': [
    { species: 'Zubat', types: ['Poison', 'Flying'] },
    { species: 'Geodude', types: ['Rock', 'Ground'] },
    { species: 'Onix', types: ['Rock', 'Ground'] },
    { species: 'Machop', types: ['Fighting'] },
    { species: 'Moltres', types: ['Fire', 'Flying'] },
  ],
  'Gift / Static': [
    { species: 'Magikarp', types: ['Water'] },
    { species: 'Eevee', types: ['Normal'] },
    { species: 'Lapras', types: ['Water', 'Ice'] },
    { species: 'Hitmonlee', types: ['Fighting'] },
    { species: 'Hitmonchan', types: ['Fighting'] },
  ],
};

export const redBlueEncounterOptions: Record<string, EncounterOption[]> = {
  Starter: redBlueStarterOptions,
  ...kantoSharedEncounters,
};

export const yellowEncounterOptions: Record<string, EncounterOption[]> = {
  Starter: yellowStarterOptions,
  ...kantoSharedEncounters,
};

export const scarletVioletEncounterOptions: Record<string, EncounterOption[]> = {
  Starter: starterOptions,
  'Cabo Poco': [
    { species: 'Lechonk', types: ['Normal'] },
    { species: 'Tarountula', types: ['Bug'] },
    { species: 'Fletchling', types: ['Normal', 'Flying'] },
    { species: 'Hoppip', types: ['Grass', 'Flying'] },
  ],
  'Poco Path': [
    { species: 'Lechonk', types: ['Normal'] },
    { species: 'Tarountula', types: ['Bug'] },
    { species: 'Pawmi', types: ['Electric'] },
    { species: 'Hoppip', types: ['Grass', 'Flying'] },
    { species: 'Scatterbug', types: ['Bug'] },
    { species: 'Fletchling', types: ['Normal', 'Flying'] },
    { species: 'Yungoos', types: ['Normal'] },
  ],
  'South Province Area One': [
    { species: 'Lechonk', types: ['Normal'] },
    { species: 'Tarountula', types: ['Bug'] },
    { species: 'Pawmi', types: ['Electric'] },
    { species: 'Fletchling', types: ['Normal', 'Flying'] },
    { species: 'Hoppip', types: ['Grass', 'Flying'] },
    { species: 'Scatterbug', types: ['Bug'] },
    { species: 'Azurill', types: ['Normal', 'Fairy'], surfMethod: true },
    { species: 'Buizel', types: ['Water'], surfMethod: true },
    { species: 'Wooper', types: ['Poison', 'Ground'] },
    { species: 'Ralts', types: ['Psychic', 'Fairy'] },
    { species: 'Psyduck', types: ['Water'], surfMethod: true },
  ],
  'South Province Area Two': [
    { species: 'Fidough', types: ['Fairy'] },
    { species: 'Smoliv', types: ['Grass', 'Normal'] },
    { species: 'Igglybuff', types: ['Normal', 'Fairy'] },
    { species: 'Combee', types: ['Bug', 'Flying'] },
    { species: 'Mareep', types: ['Electric'] },
    { species: 'Maschiff', types: ['Dark'] },
    { species: 'Shinx', types: ['Electric'] },
    { species: 'Drowzee', types: ['Psychic'] },
  ],
  'South Province Area Three': [
    { species: 'Nacli', types: ['Rock'] },
    { species: 'Rookidee', types: ['Flying'] },
    { species: 'Charcadet', types: ['Fire'] },
    { species: 'Tadbulb', types: ['Electric'] },
    { species: 'Makuhita', types: ['Fighting'] },
    { species: 'Shroodle', types: ['Poison', 'Normal'] },
    { species: 'Squawkabilly', types: ['Normal', 'Flying'] },
  ],
  'South Province Area Four': [
    { species: 'Pikachu', types: ['Electric'] },
    { species: 'Applin', types: ['Grass', 'Dragon'] },
    { species: 'Deerling', types: ['Normal', 'Grass'] },
    { species: 'Pineco', types: ['Bug'] },
    { species: 'Mudbray', types: ['Ground'] },
    { species: 'Teddiursa', types: ['Normal'] },
    { species: 'Combee', types: ['Bug', 'Flying'] },
  ],
  'South Province Area Five': [
    { species: 'Flittle', types: ['Psychic'] },
    { species: 'Pawmo', types: ['Electric', 'Fighting'] },
    { species: 'Goomy', types: ['Dragon'] },
    { species: 'Croagunk', types: ['Poison', 'Fighting'] },
    { species: 'Toxel', types: ['Electric', 'Poison'] },
    { species: 'Capsakid', types: ['Grass'] },
    { species: 'Tinkatink', types: ['Fairy', 'Steel'] },
  ],
  'South Province Area Six': [
    { species: 'Gible', types: ['Dragon', 'Ground'] },
    { species: 'Larvitar', types: ['Rock', 'Ground'] },
    { species: 'Bagon', types: ['Dragon'] },
    { species: 'Meditite', types: ['Fighting', 'Psychic'] },
    { species: 'Salandit', types: ['Poison', 'Fire'] },
    { species: 'Noibat', types: ['Flying', 'Dragon'] },
    { species: 'Axew', types: ['Dragon'] },
  ],
  'West Province Area One': [
    { species: 'Nymble', types: ['Bug'] },
    { species: 'Wattrel', types: ['Electric', 'Flying'] },
    { species: 'Finizen', types: ['Water'], surfMethod: true },
    { species: 'Maschiff', types: ['Dark'] },
    { species: 'Bombirdier', types: ['Flying', 'Dark'] },
    { species: 'Tadbulb', types: ['Electric'] },
    { species: 'Shroodle', types: ['Poison', 'Normal'] },
  ],
  'West Province Area Two': [
    { species: 'Girafarig', types: ['Normal', 'Psychic'] },
    { species: 'Tauros', types: ['Fighting'] },
    { species: 'Capsakid', types: ['Grass'] },
    { species: 'Silicobra', types: ['Ground'] },
    { species: 'Rufflet', types: ['Normal', 'Flying'] },
    { species: 'Toedscool', types: ['Ground', 'Grass'] },
    { species: 'Foongus', types: ['Grass', 'Poison'] },
  ],
  'West Province Area Three': [
    { species: 'Dunsparce', types: ['Normal'] },
    { species: 'Komala', types: ['Normal'] },
    { species: 'Zorua', types: ['Dark'] },
    { species: 'Mimikyu', types: ['Ghost', 'Fairy'] },
    { species: 'Shuppet', types: ['Ghost'] },
    { species: 'Pincurchin', types: ['Electric'] },
    { species: 'Eelektrik', types: ['Electric'] },
  ],
  'East Province Area One': [
    { species: 'Cyclizar', types: ['Dragon', 'Normal'] },
    { species: 'Wattrel', types: ['Electric', 'Flying'] },
    { species: 'Varoom', types: ['Steel', 'Poison'] },
    { species: 'Oricorio', types: ['Fire', 'Flying'] },
    { species: 'Murkrow', types: ['Dark', 'Flying'] },
    { species: 'Mareanie', types: ['Poison', 'Water'], fishingMethod: true },
    { species: 'Toxel', types: ['Electric', 'Poison'] },
  ],
  'East Province Area Two': [
    { species: 'Bramblin', types: ['Grass', 'Ghost'] },
    { species: 'Orthworm', types: ['Steel'] },
    { species: 'Sandile', types: ['Ground', 'Dark'] },
    { species: 'Cacnea', types: ['Grass'] },
    { species: 'Rolycoly', types: ['Rock'] },
    { species: 'Numel', types: ['Fire', 'Ground'] },
    { species: 'Spoink', types: ['Psychic'] },
  ],
  'East Province Area Three': [
    { species: 'Varoom', types: ['Steel', 'Poison'] },
    { species: 'Glimmet', types: ['Rock', 'Poison'] },
    { species: 'Klefki', types: ['Steel', 'Fairy'] },
    { species: 'Cufant', types: ['Steel'] },
    { species: 'Torkoal', types: ['Fire'] },
    { species: 'Bronzor', types: ['Steel', 'Psychic'] },
    { species: 'Sableye', types: ['Dark', 'Ghost'] },
  ],
  'North Province Area One': [
    { species: 'Tinkatuff', types: ['Fairy', 'Steel'] },
    { species: 'Bisharp', types: ['Dark', 'Steel'] },
    { species: 'Sneasel', types: ['Dark', 'Ice'] },
    { species: 'Hawlucha', types: ['Fighting', 'Flying'] },
    { species: 'Falinks', types: ['Fighting'] },
    { species: 'Noivern', types: ['Flying', 'Dragon'] },
    { species: 'Lurantis', types: ['Grass'] },
  ],
  'North Province Area Two': [
    { species: 'Bisharp', types: ['Dark', 'Steel'] },
    { species: 'Heracross', types: ['Bug', 'Fighting'] },
    { species: 'Scyther', types: ['Bug', 'Flying'] },
    { species: 'Forretress', types: ['Bug', 'Steel'] },
    { species: 'Venomoth', types: ['Bug', 'Poison'] },
    { species: 'Tropius', types: ['Grass', 'Flying'] },
    { species: 'Ursaring', types: ['Normal'] },
  ],
  'North Province Area Three': [
    { species: 'Cetoddle', types: ['Ice'] },
    { species: 'Snom', types: ['Ice', 'Bug'] },
    { species: 'Sneasel', types: ['Dark', 'Ice'] },
    { species: 'Eiscue', types: ['Ice'] },
    { species: 'Bergmite', types: ['Ice'] },
    { species: 'Cubchoo', types: ['Ice'] },
    { species: 'Frigibax', types: ['Dragon', 'Ice'] },
  ],
  'Asado Desert': [
    { species: 'Sandile', types: ['Ground', 'Dark'] },
    { species: 'Silicobra', types: ['Ground'] },
    { species: 'Rellor', types: ['Bug'] },
    { species: 'Cacnea', types: ['Grass'] },
    { species: 'Hippopotas', types: ['Ground'] },
    { species: 'Bramblin', types: ['Grass', 'Ghost'] },
    { species: 'Capsakid', types: ['Grass'] },
  ],
  'Tagtree Thicket': [
    { species: 'Shroodle', types: ['Poison', 'Normal'] },
    { species: 'Grafaiai', types: ['Poison', 'Normal'] },
    { species: 'Impidimp', types: ['Dark', 'Fairy'] },
    { species: 'Morgrem', types: ['Dark', 'Fairy'] },
    { species: 'Foongus', types: ['Grass', 'Poison'] },
    { species: 'Toedscool', types: ['Ground', 'Grass'] },
    { species: 'Zorua', types: ['Dark'] },
  ],
  'Glaseado Mountain': [
    { species: 'Cetoddle', types: ['Ice'] },
    { species: 'Snom', types: ['Ice', 'Bug'] },
    { species: 'Bergmite', types: ['Ice'] },
    { species: 'Cryogonal', types: ['Ice'] },
    { species: 'Snorunt', types: ['Ice'] },
    { species: 'Frigibax', types: ['Dragon', 'Ice'] },
    { species: 'Greavard', types: ['Ghost'] },
  ],
  'Casseroya Lake': [
    { species: 'Dondozo', types: ['Water'], surfMethod: true },
    { species: 'Tatsugiri', types: ['Dragon', 'Water'], surfMethod: true },
    { species: 'Veluza', types: ['Water', 'Psychic'], surfMethod: true },
    { species: 'Dratini', types: ['Dragon'], fishingMethod: true },
    { species: 'Gyarados', types: ['Water', 'Flying'], fishingMethod: true },
    { species: 'Slowpoke', types: ['Water', 'Psychic'], surfMethod: true },
    { species: 'Mareanie', types: ['Poison', 'Water'], fishingMethod: true },
  ],
  'Socarrat Trail': [
    { species: 'Zorua', types: ['Dark'] },
    { species: 'Mimikyu', types: ['Ghost', 'Fairy'] },
    { species: 'Komala', types: ['Normal'] },
    { species: 'Persian', types: ['Normal'] },
    { species: 'Dunsparce', types: ['Normal'] },
    { species: 'Toedscruel', types: ['Ground', 'Grass'] },
    { species: 'Grafaiai', types: ['Poison', 'Normal'] },
  ],
  'The Great Crater of Paldea': [
    { species: 'Glimmet', types: ['Rock', 'Poison'] },
    { species: 'Glimmora', types: ['Rock', 'Poison'] },
    { species: 'Dugtrio', types: ['Ground'] },
    { species: 'Corviknight', types: ['Flying', 'Steel'] },
    { species: 'Raichu', types: ['Electric'] },
    { species: 'Medicham', types: ['Fighting', 'Psychic'] },
    { species: 'Espathra', types: ['Psychic'] },
  ],
  'Area Zero': [
    { species: 'Glimmora', types: ['Rock', 'Poison'] },
    { species: 'Dudunsparce', types: ['Normal'] },
    { species: 'Farigiraf', types: ['Normal', 'Psychic'] },
    { species: 'Great Tusk', types: ['Ground', 'Fighting'] },
    { species: 'Iron Treads', types: ['Ground', 'Steel'] },
    { species: 'Scream Tail', types: ['Fairy', 'Psychic'] },
    { species: 'Iron Bundle', types: ['Ice', 'Water'], surfMethod: true },
    { species: 'Roaring Moon', types: ['Dragon', 'Dark'] },
    { species: 'Iron Valiant', types: ['Fairy', 'Fighting'] },
  ],
  'Tera Raid': [
    { species: 'Tera Raid Encounter', types: ['Normal'] },
    { species: 'Raid Den Choice', types: ['Normal'] },
  ],
  'Gift / Static': [
    { species: 'Mystery Gift / Static', types: ['Normal'] },
    { species: 'Gimmighoul', types: ['Ghost'] },
    { species: 'Charcadet', types: ['Fire'] },
    { species: 'Wooper', types: ['Poison', 'Ground'] },
  ],
};

const move = (name: string, type: PokemonType, power: number | null): NuzlockeMove => ({ name, type, power });

const bossPokemon = (species: string, level: number, ability = 'Not listed', item = 'None listed', nature = 'Not listed', moves: NuzlockeMove[] = []) => ({
  species,
  level,
  ability,
  item,
  nature,
  moves,
});

export const redBlueBosses: NuzlockeBoss[] = [
  { id: 'brock-rb', name: 'Brock', category: 'Pewter Gym', levelCap: 14, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Geodude', 12, 'No abilities in Gen 1', 'None', '', [move('Tackle', 'Normal', 35), move('Defense Curl', 'Normal', null)]), bossPokemon('Onix', 14, 'No abilities in Gen 1', 'None', '', [move('Tackle', 'Normal', 35), move('Screech', 'Normal', null), move('Bide', 'Normal', null), move('Bind', 'Normal', 15)])] },
  { id: 'misty-rb', name: 'Misty', category: 'Cerulean Gym', levelCap: 21, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Staryu', 18, 'No abilities in Gen 1', 'None', '', [move('Tackle', 'Normal', 35), move('Water Gun', 'Water', 40)]), bossPokemon('Starmie', 21, 'No abilities in Gen 1', 'None', '', [move('Tackle', 'Normal', 35), move('Water Gun', 'Water', 40), move('BubbleBeam', 'Water', 65), move('Recover', 'Normal', null)])] },
  { id: 'surge-rb', name: 'Lt. Surge', category: 'Vermilion Gym', levelCap: 24, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Voltorb', 21, 'No abilities in Gen 1', 'None', '', [move('Tackle', 'Normal', 35), move('SonicBoom', 'Normal', null), move('Screech', 'Normal', null)]), bossPokemon('Pikachu', 18, 'No abilities in Gen 1', 'None', '', [move('ThunderShock', 'Electric', 40), move('Growl', 'Normal', null), move('Quick Attack', 'Normal', 40)]), bossPokemon('Raichu', 24, 'No abilities in Gen 1', 'None', '', [move('Thunderbolt', 'Electric', 95), move('Mega Punch', 'Normal', 80), move('Mega Kick', 'Normal', 120)])] },
  { id: 'erika-rb', name: 'Erika', category: 'Celadon Gym', levelCap: 29, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Victreebel', 29), bossPokemon('Tangela', 24), bossPokemon('Vileplume', 29)] },
  { id: 'koga-rb', name: 'Koga', category: 'Fuchsia Gym', levelCap: 43, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Koffing', 37), bossPokemon('Muk', 39), bossPokemon('Koffing', 37), bossPokemon('Weezing', 43)] },
  { id: 'sabrina-rb', name: 'Sabrina', category: 'Saffron Gym', levelCap: 43, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Kadabra', 38), bossPokemon('MrMime', 37), bossPokemon('Venomoth', 38), bossPokemon('Alakazam', 43)] },
  { id: 'blaine-rb', name: 'Blaine', category: 'Cinnabar Gym', levelCap: 47, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Growlithe', 42), bossPokemon('Ponyta', 40), bossPokemon('Rapidash', 42), bossPokemon('Arcanine', 47)] },
  { id: 'giovanni-rb', name: 'Giovanni', category: 'Viridian Gym', levelCap: 50, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Rhyhorn', 45), bossPokemon('Dugtrio', 42), bossPokemon('Nidoqueen', 44), bossPokemon('Nidoking', 45), bossPokemon('Rhydon', 50)] },
  { id: 'lorelei-rb', name: 'Lorelei', category: 'Elite Four', levelCap: 56, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Dewgong', 54), bossPokemon('Cloyster', 53), bossPokemon('Slowbro', 54), bossPokemon('Jynx', 56), bossPokemon('Lapras', 56)] },
  { id: 'bruno-rb', name: 'Bruno', category: 'Elite Four', levelCap: 58, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Onix', 53), bossPokemon('Hitmonchan', 55), bossPokemon('Hitmonlee', 55), bossPokemon('Onix', 56), bossPokemon('Machamp', 58)] },
  { id: 'agatha-rb', name: 'Agatha', category: 'Elite Four', levelCap: 60, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Gengar', 56), bossPokemon('Golbat', 56), bossPokemon('Haunter', 55), bossPokemon('Arbok', 58), bossPokemon('Gengar', 60)] },
  { id: 'lance-rb', name: 'Lance', category: 'Elite Four', levelCap: 62, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Gyarados', 58), bossPokemon('Dragonair', 56), bossPokemon('Dragonair', 56), bossPokemon('Aerodactyl', 60), bossPokemon('Dragonite', 62)] },
  { id: 'champion-rb', name: 'Champion Rival', category: 'Pokemon League', levelCap: 65, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Pidgeot', 61), bossPokemon('Alakazam', 59), bossPokemon('Rhydon', 61), bossPokemon('Starter Ace', 65)] },
];

export const yellowBosses: NuzlockeBoss[] = [
  { id: 'brock-y', name: 'Brock', category: 'Pewter Gym', levelCap: 12, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Geodude', 10), bossPokemon('Onix', 12)] },
  { id: 'misty-y', name: 'Misty', category: 'Cerulean Gym', levelCap: 21, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Staryu', 18), bossPokemon('Starmie', 21)] },
  { id: 'surge-y', name: 'Lt. Surge', category: 'Vermilion Gym', levelCap: 28, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Raichu', 28)] },
  { id: 'erika-y', name: 'Erika', category: 'Celadon Gym', levelCap: 32, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Tangela', 30), bossPokemon('Weepinbell', 32), bossPokemon('Gloom', 32)] },
  { id: 'koga-y', name: 'Koga', category: 'Fuchsia Gym', levelCap: 50, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Venonat', 44), bossPokemon('Venonat', 46), bossPokemon('Venonat', 48), bossPokemon('Venomoth', 50)] },
  { id: 'sabrina-y', name: 'Sabrina', category: 'Saffron Gym', levelCap: 50, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Abra', 50), bossPokemon('Kadabra', 50), bossPokemon('Alakazam', 50)] },
  { id: 'blaine-y', name: 'Blaine', category: 'Cinnabar Gym', levelCap: 54, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Ninetales', 48), bossPokemon('Rapidash', 50), bossPokemon('Arcanine', 54)] },
  { id: 'giovanni-y', name: 'Giovanni', category: 'Viridian Gym', levelCap: 55, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Dugtrio', 50), bossPokemon('Persian', 53), bossPokemon('Nidoqueen', 53), bossPokemon('Nidoking', 55), bossPokemon('Rhydon', 55)] },
  { id: 'lorelei-y', name: 'Lorelei', category: 'Elite Four', levelCap: 56, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Dewgong', 54), bossPokemon('Cloyster', 53), bossPokemon('Slowbro', 54), bossPokemon('Jynx', 56), bossPokemon('Lapras', 56)] },
  { id: 'bruno-y', name: 'Bruno', category: 'Elite Four', levelCap: 58, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Onix', 53), bossPokemon('Hitmonchan', 55), bossPokemon('Hitmonlee', 55), bossPokemon('Onix', 56), bossPokemon('Machamp', 58)] },
  { id: 'agatha-y', name: 'Agatha', category: 'Elite Four', levelCap: 60, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Gengar', 56), bossPokemon('Golbat', 56), bossPokemon('Haunter', 55), bossPokemon('Arbok', 58), bossPokemon('Gengar', 60)] },
  { id: 'lance-y', name: 'Lance', category: 'Elite Four', levelCap: 62, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Gyarados', 58), bossPokemon('Dragonair', 56), bossPokemon('Dragonair', 56), bossPokemon('Aerodactyl', 60), bossPokemon('Dragonite', 62)] },
  { id: 'champion-y', name: 'Champion Rival', category: 'Pokemon League', levelCap: 65, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Sandslash', 61), bossPokemon('Alakazam', 59), bossPokemon('Exeggutor', 61), bossPokemon('Starter Ace', 65)] },
];

export const scarletVioletBosses: NuzlockeBoss[] = [
  /*
   * Legacy export kept only for compatibility with older imports.
   * Current Scarlet/Violet boss data lives in lib/nuzlocke/data/scarlet-violet-bosses.ts.
   */
  { id: 'katy', name: 'Katy', category: 'Victory Road Gym', levelCap: 15, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Nymble', 14, 'Swarm', 'None'), bossPokemon('Tarountula', 14, 'Insomnia', 'None'), bossPokemon('Teddiursa', 15, 'Pickup', 'None')] },
  { id: 'brassius', name: 'Brassius', category: 'Victory Road Gym', levelCap: 17, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Petilil', 16, 'Own Tempo', 'None'), bossPokemon('Smoliv', 16, 'Early Bird', 'None'), bossPokemon('Sudowoodo', 17, 'Sturdy', 'None')] },
  { id: 'iono', name: 'Iono', category: 'Victory Road Gym', levelCap: 24, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Wattrel', 23, 'Wind Power', 'None'), bossPokemon('Bellibolt', 23, 'Electromorphosis', 'None'), bossPokemon('Luxio', 23, 'Intimidate', 'None'), bossPokemon('Mismagius', 24, 'Levitate', 'None')] },
  { id: 'kofu', name: 'Kofu', category: 'Victory Road Gym', levelCap: 30, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Veluza', 29, 'Mold Breaker', 'None'), bossPokemon('Wugtrio', 29, 'Gooey', 'None'), bossPokemon('Crabominable', 30, 'Iron Fist', 'None')] },
  { id: 'larry', name: 'Larry', category: 'Victory Road Gym', levelCap: 36, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Komala', 35, 'Comatose', 'None'), bossPokemon('Dudunsparce', 35, 'Serene Grace', 'None'), bossPokemon('Staraptor', 36, 'Intimidate', 'None')] },
  { id: 'ryme', name: 'Ryme', category: 'Victory Road Gym', levelCap: 42, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Mimikyu', 41, 'Disguise', 'None'), bossPokemon('Banette', 41, 'Insomnia', 'None'), bossPokemon('Houndstone', 41, 'Sand Rush', 'None'), bossPokemon('Toxtricity', 42, 'Punk Rock', 'None')] },
  { id: 'tulip', name: 'Tulip', category: 'Victory Road Gym', levelCap: 45, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Farigiraf', 44, 'Armor Tail', 'None'), bossPokemon('Gardevoir', 44, 'Synchronize', 'None'), bossPokemon('Espathra', 44, 'Opportunist', 'None'), bossPokemon('Florges', 45, 'Flower Veil', 'None')] },
  { id: 'grusha', name: 'Grusha', category: 'Victory Road Gym', levelCap: 48, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Frosmoth', 47, 'Shield Dust', 'None'), bossPokemon('Beartic', 47, 'Snow Cloak', 'None'), bossPokemon('Cetitan', 47, 'Thick Fat', 'None'), bossPokemon('Altaria', 48, 'Natural Cure', 'None')] },
  { id: 'klawf', name: 'Stony Cliff Titan', category: 'Path of Legends Titan', levelCap: 16, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Klawf', 16)] },
  { id: 'bombirdier', name: 'Open Sky Titan', category: 'Path of Legends Titan', levelCap: 20, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Bombirdier', 20)] },
  { id: 'orthworm', name: 'Lurking Steel Titan', category: 'Path of Legends Titan', levelCap: 29, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Orthworm', 29)] },
  { id: 'great-tusk-iron-treads', name: 'Quaking Earth Titan', category: 'Path of Legends Titan', levelCap: 45, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Great Tusk / Iron Treads', 45)] },
  { id: 'tatsugiri', name: 'False Dragon Titan', category: 'Path of Legends Titan', levelCap: 57, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Dondozo', 56), bossPokemon('Tatsugiri', 57)] },
  { id: 'giacomo', name: 'Giacomo', category: 'Starfall Street Base', levelCap: 21, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Pawniard', 21), bossPokemon('Segin Starmobile', 20)] },
  { id: 'mela', name: 'Mela', category: 'Starfall Street Base', levelCap: 27, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Torkoal', 27), bossPokemon('Schedar Starmobile', 26)] },
  { id: 'atticus', name: 'Atticus', category: 'Starfall Street Base', levelCap: 33, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Skuntank', 32), bossPokemon('Muk', 32), bossPokemon('Revavroom', 33), bossPokemon('Navi Starmobile', 32)] },
  { id: 'ortega', name: 'Ortega', category: 'Starfall Street Base', levelCap: 51, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Azumarill', 50), bossPokemon('Wigglytuff', 50), bossPokemon('Dachsbun', 51), bossPokemon('Ruchbah Starmobile', 50)] },
  { id: 'eri', name: 'Eri', category: 'Starfall Street Base', levelCap: 56, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Toxicroak', 55), bossPokemon('Passimian', 55), bossPokemon('Lucario', 55), bossPokemon('Annihilape', 56), bossPokemon('Caph Starmobile', 56)] },
  { id: 'rival-nemona', name: 'Nemona Rival Fights', category: 'Rival', levelCap: 66, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Lycanroc', 65), bossPokemon('Goodra', 65), bossPokemon('Dudunsparce', 65), bossPokemon('Orthworm', 65), bossPokemon('Pawmot', 65), bossPokemon('Starter Ace', 66)] },
  { id: 'rika', name: 'Rika', category: 'Pokemon League Elite Four', levelCap: 58, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Whiscash', 57), bossPokemon('Camerupt', 57), bossPokemon('Donphan', 57), bossPokemon('Dugtrio', 57), bossPokemon('Clodsire', 58)] },
  { id: 'poppy', name: 'Poppy', category: 'Pokemon League Elite Four', levelCap: 59, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Copperajah', 58), bossPokemon('Magnezone', 58), bossPokemon('Bronzong', 58), bossPokemon('Corviknight', 58), bossPokemon('Tinkaton', 59)] },
  { id: 'larry-e4', name: 'Larry', category: 'Pokemon League Elite Four', levelCap: 60, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Tropius', 59), bossPokemon('Oricorio', 59), bossPokemon('Altaria', 59), bossPokemon('Staraptor', 59), bossPokemon('Flamigo', 60)] },
  { id: 'hassel', name: 'Hassel', category: 'Pokemon League Elite Four', levelCap: 61, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Noivern', 60), bossPokemon('Haxorus', 60), bossPokemon('Dragalge', 60), bossPokemon('Flapple', 60), bossPokemon('Baxcalibur', 61)] },
  { id: 'champion-geeta', name: 'Champion Geeta', category: 'Pokemon League', levelCap: 62, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Espathra', 61), bossPokemon('Gogoat', 61), bossPokemon('Veluza', 61), bossPokemon('Avalugg', 61), bossPokemon('Kingambit', 61), bossPokemon('Glimmora', 62)] },
  { id: 'penny', name: 'Penny', category: 'Finale', levelCap: 63, completed: false, notes: '', deaths: 0, pokemon: [bossPokemon('Umbreon', 62), bossPokemon('Vaporeon', 62), bossPokemon('Jolteon', 62), bossPokemon('Flareon', 62), bossPokemon('Leafeon', 62), bossPokemon('Sylveon', 63)] },
];

function getBaseNuzlockeLocations(gameVersion: GameVersion): string[] {
  if (gameVersion === 'Red' || gameVersion === 'Blue' || gameVersion === 'Yellow') return kantoLocations;
  if (supportsGen2Data(gameVersion)) return getGen2Locations(gameVersion);
  if (supportsFrlg(gameVersion)) return getFrlgLocations(gameVersion);
  if (supportsRse(gameVersion)) return getRseLocations(gameVersion);
  if (supportsGen4Data(gameVersion)) return getGen4Locations(gameVersion);
  if (supportsGen5Data(gameVersion)) return getGen5Locations(gameVersion);
  if (supportsGen6Data(gameVersion)) return getGen6Locations(gameVersion);
  if (supportsGen7Data(gameVersion)) return getGen7Locations(gameVersion);
  if (supportsGen8Data(gameVersion)) return getGen8Locations(gameVersion);
  return scarletVioletLocations;
}

function getBaseNuzlockeEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion === 'Yellow') return yellowEncounterOptions;
  if (gameVersion === 'Red' || gameVersion === 'Blue') return redBlueEncounterOptions;
  if (supportsGen2Data(gameVersion)) return getGen2EncounterOptions(gameVersion);
  if (supportsFrlg(gameVersion)) return getFrlgEncounterOptions(gameVersion);
  if (supportsRse(gameVersion)) return getRseEncounterOptions(gameVersion);
  if (supportsGen4Data(gameVersion)) return getGen4EncounterOptions(gameVersion);
  if (supportsGen5Data(gameVersion)) return getGen5EncounterOptions(gameVersion);
  if (supportsGen6Data(gameVersion)) return getGen6EncounterOptions(gameVersion);
  if (supportsGen7Data(gameVersion)) return getGen7EncounterOptions(gameVersion);
  if (supportsGen8Data(gameVersion)) return getGen8EncounterOptions(gameVersion);
  return scarletVioletEncounterOptions;
}

export function getNuzlockeLocations(gameVersion: GameVersion) {
  const base = Array.isArray(getBaseNuzlockeLocations(gameVersion)) ? getBaseNuzlockeLocations(gameVersion) : [];
  const starters = getStarterOptionsForGame(gameVersion);
  if (starters.length === 0) return base;
  // Don't double-prepend if the base list (or an existing "Starter" sentinel) is already first.
  if (base.includes(STARTER_PSEUDO_LOCATION) || base[0] === 'Starter') return base;
  return [STARTER_PSEUDO_LOCATION, ...base];
}

export function getNuzlockeEncounterOptions(gameVersion: GameVersion) {
  const base = getBaseNuzlockeEncounterOptions(gameVersion) ?? {};
  const starters = getStarterOptionsForGame(gameVersion);
  if (starters.length === 0) return base;
  if (base[STARTER_PSEUDO_LOCATION]) return { ...base, [STARTER_PSEUDO_LOCATION]: starters };
  return { [STARTER_PSEUDO_LOCATION]: starters, ...base };
}

export function isEncounterSkeletonGame(gameVersion: GameVersion) {
  return supportsFrlg(gameVersion) || supportsGen2Data(gameVersion) || supportsGen4Data(gameVersion) || supportsGen5Data(gameVersion) || supportsGen6Data(gameVersion) || supportsGen7Data(gameVersion) || supportsRse(gameVersion);
}

export function getEncounterDataWarning(gameVersion: GameVersion) {
  if (gameVersion === 'Black' || gameVersion === 'White') {
    return {
      title: 'Partial data available',
      message: 'Encounter and boss data for this game is partially complete. Some late-game areas, optional encounters, or special mechanics may still be missing.',
      emptyState: 'No listed encounters match the current filters.',
    };
  }

  if (gameVersion === 'Black 2' || gameVersion === 'White 2') {
    return {
      title: 'Partial data available',
      message: 'Black 2 / White 2 encounters and boss teams are live through Champion Iris; deferred systems and refinements remain TODO.',
      emptyState: 'No listed encounters match the current filters.',
    };
  }

  if (supportsOrasData(gameVersion)) {
    return {
      title: 'ORAS data in progress',
      message: 'Omega Ruby / Alpha Sapphire encounters and boss teams are live through the Pokemon League; postgame and deferred encounter systems remain TODO.',
      emptyState: 'No standard ORAS encounter is currently tracked for this location.',
    };
  }

  if (supportsGen7Data(gameVersion)) {
    return {
      title: 'Partial data available',
      message: 'Sun/Moon and Ultra Sun/Ultra Moon main-story encounters and bosses are live through the Pokemon League. SOS chains, Island Scan, day/night condition rows, Episode RR, and a few Totem/URS detail fields remain TODO.',
      emptyState: 'No standard encounter is currently tracked for this location.',
    };
  }

  if (gameVersion === 'X' || gameVersion === 'Y') {
    return {
      title: 'Partial data available',
      message: 'X / Y encounters and boss teams are live through the Pokemon League. Some optional encounters, Hidden Power slots, and version-difference refinements remain TODO.',
      emptyState: 'No standard XY encounter is currently tracked for this location.',
    };
  }

  if (supportsGen4Data(gameVersion) && (gameVersion === 'HeartGold' || gameVersion === 'SoulSilver')) {
    return {
      title: 'Partial data available',
      message: 'HeartGold / SoulSilver encounters and boss teams are live through the Kanto Pokemon League. SOS-style swarms, full day-of-week/time matrices, Bug-Catching Contest, Safari Zone block mechanics, and a few minor TODOs remain.',
      emptyState: 'No standard HGSS encounter is currently tracked for this location.',
    };
  }

  if (gameVersion === 'Diamond' || gameVersion === 'Pearl' || gameVersion === 'Platinum') {
    return {
      title: 'Partial data available',
      message: 'Diamond / Pearl / Platinum main-story encounters and boss teams are live through Champion Cynthia. Postgame: Stark Mountain (+ Heatran), Snowpoint Temple (+ Regigigas), Turnback Cave (+ Giratina DP), Route 224, and Battle Zone Routes 225-230 are populated. Honey-tree encounters are live across canonical Sinnoh honey-tree sites; Poké Radar species are populated where canonically sourced (partial coverage). Munchlax personalized 4-tree mechanic, remaining Poké Radar gaps, Battle Frontier / Pal Park, event-key mythicals/legendaries (Shaymin / Darkrai / Arceus, plus Regirock-Pt), full Great Marsh rotation, swarms, dual-slot, day/night gating, and a few minor boss/encounter detail gaps remain TODO.',
      emptyState: 'No standard DPP encounter is currently tracked for this location.',
    };
  }

  if (supportsFrlg(gameVersion)) {
    return {
      title: 'Data in audit',
      message: 'FireRed / LeafGreen main-story data is populated and currently in audit. Some optional encounters and minor refinements may still be pending verification.',
      emptyState: 'No standard FRLG encounter is currently tracked for this location.',
    };
  }

  if (supportsRse(gameVersion)) {
    return {
      title: 'Hoenn support in progress',
      message: 'Ruby / Sapphire / Emerald data is populated through Mauville / Wattson: Pass 1 (Littleroot through Rusturf + Roxanne) and Pass 2 (Dewford, Granite Cave, Routes 106-109, Slateport, Route 110, Mauville, Route 117, Verdanturf + Brawly + Wally Mauville + Wattson) are live. Rival Route 110 team, later Hoenn routes (Route 111 onward), remaining gym/E4/champion teams, evil-team branches (Aqua/Magma full chain), legendaries (Groudon/Kyogre/Rayquaza/regis), Safari Zone, Trick House, Abandoned Ship, and New Mauville interior remain TODO.',
      emptyState: 'No standard RSE encounter is currently tracked for this location.',
    };
  }

  if (supportsGen2Data(gameVersion)) {
    return {
      title: 'Partial data available',
      message: 'Gold / Silver / Crystal Johto encounters and bosses are partially populated. Kanto post-Champion content, radio swarms, and time-of-day refinements remain TODO.',
      emptyState: 'No standard GSC encounter is currently tracked for this location.',
    };
  }

  if (!isEncounterSkeletonGame(gameVersion)) return null;

  return {
    title: 'Encounter data coming soon',
    message: 'Encounter data for this game is still in progress. Some routes, methods, bosses, or version differences may be missing.',
    emptyState: 'Encounter data coming soon.',
  };
}

export function getNuzlockeBosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null) {
  const bosses =
    gameVersion === 'Yellow'
      ? yellowBosses
      : gameVersion === 'Red' || gameVersion === 'Blue'
        ? redBlueBosses
        : supportsGen2Data(gameVersion)
          ? getGen2Bosses(gameVersion, starterChoice)
          : supportsFrlg(gameVersion)
            ? getFrlgBosses(gameVersion, starterChoice)
            : supportsGen4Data(gameVersion)
              ? getGen4Bosses(gameVersion, starterChoice)
              : supportsGen5Data(gameVersion)
                ? getGen5Bosses(gameVersion, starterChoice)
                : supportsGen6Data(gameVersion)
                  ? getGen6Bosses(gameVersion, starterChoice)
                  : supportsGen7Data(gameVersion)
                    ? getGen7Bosses(gameVersion, starterChoice)
                    : supportsGen8Data(gameVersion)
                      ? getGen8Bosses(gameVersion, starterChoice)
                      : supportsRse(gameVersion)
                        ? getRseBosses(gameVersion, starterChoice)
                        : getScarletVioletBosses(gameVersion);

  const rivalStarterChoice = getRivalStarterChoice(starterChoice);
  const starterWarning = rivalStarterChoice ? '' : 'Choose your starter type to sync rival battles.';

  return bosses.map((boss) => {
    const hasStarterAce = (boss.pokemon || []).some((pokemon) => pokemon.species === 'Starter Ace');
    return {
      ...boss,
      notes: hasStarterAce && starterWarning ? [boss.notes, starterWarning].filter(Boolean).join(' ') : boss.notes,
      pokemon: (boss.pokemon || []).map((pokemon) => resolveStarterAce(gameVersion, pokemon, rivalStarterChoice)),
    };
  }).sort((a, b) => (a.levelCap || 0) - (b.levelCap || 0) || a.name.localeCompare(b.name));
}

function resolveStarterAce(gameVersion: GameVersion, pokemon: NuzlockeBossPokemon, rivalStarterChoice: StarterChoice | null) {
  if (pokemon.species !== 'Starter Ace' || !rivalStarterChoice) return { ...pokemon };

  const finalStarterByGame: Partial<Record<GameVersion, Record<StarterChoice, { species: string; types: PokemonType[] }>>> = {
    Red: {
      grass: { species: 'Venusaur', types: ['Grass', 'Poison'] },
      fire: { species: 'Charizard', types: ['Fire', 'Flying'] },
      water: { species: 'Blastoise', types: ['Water'] },
    },
    Blue: {
      grass: { species: 'Venusaur', types: ['Grass', 'Poison'] },
      fire: { species: 'Charizard', types: ['Fire', 'Flying'] },
      water: { species: 'Blastoise', types: ['Water'] },
    },
    Yellow: {
      grass: { species: 'Jolteon', types: ['Electric'] },
      fire: { species: 'Flareon', types: ['Fire'] },
      water: { species: 'Vaporeon', types: ['Water'] },
    },
    Scarlet: {
      grass: { species: 'Meowscarada', types: ['Grass', 'Dark'] },
      fire: { species: 'Skeledirge', types: ['Fire', 'Ghost'] },
      water: { species: 'Quaquaval', types: ['Water', 'Fighting'] },
    },
    Violet: {
      grass: { species: 'Meowscarada', types: ['Grass', 'Dark'] },
      fire: { species: 'Skeledirge', types: ['Fire', 'Ghost'] },
      water: { species: 'Quaquaval', types: ['Water', 'Fighting'] },
    },
  };
  const resolved = finalStarterByGame[gameVersion]?.[rivalStarterChoice];
  if (!resolved) return { ...pokemon };
  return { ...pokemon, species: resolved.species, types: resolved.types, notes: pokemon.notes || 'Resolved from starter type sync.' };
}

export function getPokemonTypesFromData(species: string) {
  const encounterGroups = [redBlueEncounterOptions, yellowEncounterOptions, ...getGen2EncounterGroupsForTypeLookup(), getFrlgEncounterOptions('FireRed'), ...getGen4EncounterGroupsForTypeLookup(), ...getGen5EncounterGroupsForTypeLookup(), ...getXyEncounterGroupsForTypeLookup(), ...getGen7EncounterGroupsForTypeLookup(), scarletVioletEncounterOptions, ...getGen8EncounterGroupsForTypeLookup()];
  for (const group of encounterGroups) {
    for (const options of Object.values(group)) {
      const safeOptions = Array.isArray(options) ? options : [];
      const match = safeOptions.find((option) => option.species === species);
      if (match) return match.types || [];
    }
  }
  return [] as PokemonType[];
}

export const typeColors: Record<PokemonType, string> = {
  Normal: 'bg-[#A8A77A] text-white',
  Fire: 'bg-[#EE8130] text-white',
  Water: 'bg-[#6390F0] text-white',
  Electric: 'bg-[#F7D02C] text-[#282000]',
  Grass: 'bg-[#7AC74C] text-[#08260a]',
  Ice: 'bg-[#96D9D6] text-[#09242d]',
  Fighting: 'bg-[#C22E28] text-white',
  Poison: 'bg-[#A33EA1] text-white',
  Ground: 'bg-[#E2BF65] text-[#271a04]',
  Flying: 'bg-[#A98FF3] text-white',
  Psychic: 'bg-[#F95587] text-white',
  Bug: 'bg-[#A6B91A] text-white',
  Rock: 'bg-[#B6A136] text-white',
  Ghost: 'bg-[#735797] text-white',
  Dragon: 'bg-[#6F35FC] text-white',
  Dark: 'bg-[#705746] text-white',
  Steel: 'bg-[#B7B7CE] text-[#20252d]',
  Fairy: 'bg-[#D685AD] text-white',
};
