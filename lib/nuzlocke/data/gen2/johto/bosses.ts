import type { PokemonType, StarterChoice } from '@/app/nuzlocke/types';

export type Gen2BossPokemon = {
  species: string;
  level: number;
  types: PokemonType[];
  moves: [];
};

export type Gen2BossSkeleton = {
  id: string;
  name: string;
  category: string;
  locationId: string;
  location: string;
  order: number;
  levelCap: number | null;
  baseTeam: Gen2BossPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, Gen2BossPokemon[]>>;
  notes: string[];
};

const mon = (species: string, level: number, types: PokemonType[]): Gen2BossPokemon => ({ species, level, types, moves: [] });

function boss({
  id,
  name,
  category,
  locationId,
  location,
  order,
  levelCap = null,
  baseTeam = [],
  variantsByRivalStarterChoice,
  notes = ['TODO: Populate verified Gen 2 boss team data.'],
}: {
  id: string;
  name: string;
  category: string;
  locationId: string;
  location: string;
  order: number;
  levelCap?: number | null;
  baseTeam?: Gen2BossPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, Gen2BossPokemon[]>>;
  notes?: string[];
}): Gen2BossSkeleton {
  return {
    id,
    name,
    category,
    locationId,
    location,
    order,
    levelCap,
    baseTeam,
    ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
    notes,
  };
}

export const gen2JohtoBosses: Gen2BossSkeleton[] = [
  boss({
    id: 'rival-1-gen2',
    name: 'Rival 1',
    category: 'rival',
    locationId: 'cherrygrove-city',
    location: 'Cherrygrove City',
    order: 1,
    levelCap: 5,
    variantsByRivalStarterChoice: {
      grass: [mon('Cyndaquil', 5, ['Fire'])],
      fire: [mon('Totodile', 5, ['Water'])],
      water: [mon('Chikorita', 5, ['Grass'])],
    },
    notes: [
      'Rival starter variants use the universal player starter mapping: grass -> Cyndaquil, fire -> Totodile, water -> Chikorita.',
      'TODO: Verify Gen 2 movesets before adding moves.',
    ],
  }),
  boss({
    id: 'elder-li-gen2',
    name: 'Elder Li',
    category: 'boss',
    locationId: 'sprout-tower',
    location: 'Sprout Tower',
    order: 2,
    levelCap: 10,
    baseTeam: [
      mon('Bellsprout', 7, ['Grass', 'Poison']),
      mon('Bellsprout', 7, ['Grass', 'Poison']),
      mon('Hoothoot', 10, ['Normal', 'Flying']),
    ],
    notes: ['TODO: Verify Gen 2 movesets before adding moves.'],
  }),
  boss({
    id: 'falkner-gen2',
    name: 'Falkner',
    category: 'gym',
    locationId: 'violet-city',
    location: 'Violet Gym',
    order: 3,
    levelCap: 9,
    baseTeam: [
      mon('Pidgey', 7, ['Normal', 'Flying']),
      mon('Pidgeotto', 9, ['Normal', 'Flying']),
    ],
    notes: ['TODO: Verify Gen 2 movesets before adding moves.'],
  }),
  boss({
    id: 'bugsy-gen2',
    name: 'Bugsy',
    category: 'gym',
    locationId: 'azalea-town',
    location: 'Azalea Gym',
    order: 4,
    levelCap: 16,
    baseTeam: [
      mon('Metapod', 14, ['Bug']),
      mon('Kakuna', 14, ['Bug', 'Poison']),
      mon('Scyther', 16, ['Bug', 'Flying']),
    ],
    notes: [
      'Team Rocket must be cleared from Slowpoke Well before Bugsy can be challenged.',
      'TODO: Add verified Gen 2 moves in a later move-normalization pass.',
    ],
  }),
  boss({
    id: 'rival-2-gen2',
    name: 'Rival 2',
    category: 'rival',
    locationId: 'azalea-town',
    location: 'Azalea Town / Ilex Forest Gate',
    order: 5,
    levelCap: 16,
    baseTeam: [
      mon('Gastly', 12, ['Ghost', 'Poison']),
      mon('Zubat', 14, ['Poison', 'Flying']),
    ],
    variantsByRivalStarterChoice: {
      grass: [mon('Quilava', 16, ['Fire'])],
      fire: [mon('Croconaw', 16, ['Water'])],
      water: [mon('Bayleef', 16, ['Grass'])],
    },
    notes: [
      'Rival starter variants use the universal player starter mapping: grass -> Quilava, fire -> Croconaw, water -> Bayleef.',
      'In Gen 2, the rival blocks the west exit toward Ilex Forest at Azalea Town.',
      'TODO: Add verified Gen 2 moves in a later move-normalization pass.',
    ],
  }),
  boss({
    id: 'whitney-gen2',
    name: 'Whitney',
    category: 'gym',
    locationId: 'goldenrod-city',
    location: 'Goldenrod Gym',
    order: 6,
    levelCap: 20,
    baseTeam: [
      mon('Clefairy', 18, ['Fairy']),
      mon('Miltank', 20, ['Normal']),
    ],
    notes: [
      'Plain Badge. Miltank Lv 20 is the infamous wall — Rollout + Attract + Stomp + Milk Drink in GSC.',
      'TODO: Verify original G/S/C movesets before adding moves.',
    ],
  }),
  boss({
    id: 'rival-3-gen2',
    name: 'Rival 3',
    category: 'rival',
    locationId: 'burned-tower',
    location: 'Burned Tower',
    order: 7,
    levelCap: 22,
    baseTeam: [
      mon('Haunter', 20, ['Ghost', 'Poison']),
      mon('Magnemite', 18, ['Electric', 'Steel']),
      mon('Zubat', 20, ['Poison', 'Flying']),
    ],
    variantsByRivalStarterChoice: {
      grass: [mon('Quilava', 22, ['Fire'])],
      fire: [mon('Croconaw', 22, ['Water'])],
      water: [mon('Bayleef', 22, ['Grass'])],
    },
    notes: [
      'Rival starter variants use the universal player starter mapping: grass -> Quilava, fire -> Croconaw, water -> Bayleef.',
      'TODO: Verify original G/S/C movesets before adding moves.',
    ],
  }),
  boss({
    id: 'morty-gen2',
    name: 'Morty',
    category: 'gym',
    locationId: 'ecruteak-city',
    location: 'Ecruteak Gym',
    order: 8,
    levelCap: 25,
    baseTeam: [
      mon('Gastly', 21, ['Ghost', 'Poison']),
      mon('Haunter', 21, ['Ghost', 'Poison']),
      mon('Haunter', 23, ['Ghost', 'Poison']),
      mon('Gengar', 25, ['Ghost', 'Poison']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'chuck-gen2',
    name: 'Chuck',
    category: 'gym',
    locationId: 'cianwood-city',
    location: 'Cianwood Gym',
    order: 9,
    levelCap: 30,
    baseTeam: [
      mon('Primeape', 27, ['Fighting']),
      mon('Poliwrath', 30, ['Water', 'Fighting']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'jasmine-gen2',
    name: 'Jasmine',
    category: 'gym',
    locationId: 'olivine-city',
    location: 'Olivine Gym',
    order: 10,
    levelCap: 35,
    baseTeam: [
      mon('Magnemite', 30, ['Electric', 'Steel']),
      mon('Magnemite', 30, ['Electric', 'Steel']),
      mon('Steelix', 35, ['Steel', 'Ground']),
    ],
    notes: [
      'Player may challenge Chuck before Jasmine while completing the SecretPotion route.',
      'TODO: Verify original G/S/C movesets before adding moves.',
    ],
  }),
  boss({
    id: 'pryce-gen2',
    name: 'Pryce',
    category: 'gym',
    locationId: 'mahogany-town',
    location: 'Mahogany Gym',
    order: 11,
    levelCap: 31,
    baseTeam: [
      mon('Seel', 27, ['Water']),
      mon('Dewgong', 29, ['Water', 'Ice']),
      mon('Piloswine', 31, ['Ice', 'Ground']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'rocket-admins-gen2',
    name: 'Team Rocket Executive',
    category: 'evil-team',
    locationId: 'team-rocket-hq',
    location: 'Team Rocket HQ',
    order: 12,
    levelCap: 24,
    baseTeam: [
      mon('Zubat', 22, ['Poison', 'Flying']),
      mon('Koffing', 22, ['Poison']),
      mon('Raticate', 24, ['Normal']),
    ],
    notes: [
      'Original G/S/C uses generic Rocket Executive naming here.',
      'TODO: Verify original G/S/C movesets before adding moves.',
    ],
  }),
  boss({
    id: 'clair-gen2',
    name: 'Clair',
    category: 'gym',
    locationId: 'blackthorn-city',
    location: 'Blackthorn Gym',
    order: 13,
    levelCap: 40,
    baseTeam: [
      mon('Dragonair', 37, ['Dragon']),
      mon('Dragonair', 37, ['Dragon']),
      mon('Dragonair', 37, ['Dragon']),
      mon('Kingdra', 40, ['Water', 'Dragon']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'rival-victory-road-gen2',
    name: 'Rival Victory Road',
    category: 'rival',
    locationId: 'victory-road',
    location: 'Victory Road',
    order: 14,
    levelCap: 38,
    baseTeam: [
      mon('Sneasel', 34, ['Dark', 'Ice']),
      mon('Golbat', 36, ['Poison', 'Flying']),
      mon('Magneton', 35, ['Electric', 'Steel']),
      mon('Haunter', 35, ['Ghost', 'Poison']),
      mon('Kadabra', 35, ['Psychic']),
    ],
    variantsByRivalStarterChoice: {
      grass: [mon('Typhlosion', 38, ['Fire'])],
      fire: [mon('Feraligatr', 38, ['Water'])],
      water: [mon('Meganium', 38, ['Grass'])],
    },
    notes: [
      'Rival starter variants use the universal player starter mapping: grass -> Typhlosion, fire -> Feraligatr, water -> Meganium.',
      'TODO: Verify original G/S/C movesets before adding moves.',
    ],
  }),
  boss({
    id: 'will-gen2',
    name: 'Will',
    category: 'elite-four',
    locationId: 'indigo-plateau',
    location: 'Indigo Plateau',
    order: 15,
    levelCap: 42,
    baseTeam: [
      mon('Xatu', 40, ['Psychic', 'Flying']),
      mon('Jynx', 41, ['Ice', 'Psychic']),
      mon('Exeggutor', 41, ['Grass', 'Psychic']),
      mon('Slowbro', 41, ['Water', 'Psychic']),
      mon('Xatu', 42, ['Psychic', 'Flying']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'koga-gen2',
    name: 'Koga',
    category: 'elite-four',
    locationId: 'indigo-plateau',
    location: 'Indigo Plateau',
    order: 16,
    levelCap: 44,
    baseTeam: [
      mon('Ariados', 40, ['Bug', 'Poison']),
      mon('Venomoth', 41, ['Bug', 'Poison']),
      mon('Forretress', 43, ['Bug', 'Steel']),
      mon('Muk', 42, ['Poison']),
      mon('Crobat', 44, ['Poison', 'Flying']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'bruno-gen2',
    name: 'Bruno',
    category: 'elite-four',
    locationId: 'indigo-plateau',
    location: 'Indigo Plateau',
    order: 17,
    levelCap: 46,
    baseTeam: [
      mon('Hitmontop', 42, ['Fighting']),
      mon('Hitmonlee', 42, ['Fighting']),
      mon('Hitmonchan', 42, ['Fighting']),
      mon('Onix', 43, ['Rock', 'Ground']),
      mon('Machamp', 46, ['Fighting']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'karen-gen2',
    name: 'Karen',
    category: 'elite-four',
    locationId: 'indigo-plateau',
    location: 'Indigo Plateau',
    order: 18,
    levelCap: 47,
    baseTeam: [
      mon('Umbreon', 42, ['Dark']),
      mon('Vileplume', 42, ['Grass', 'Poison']),
      mon('Murkrow', 44, ['Dark', 'Flying']),
      mon('Gengar', 45, ['Ghost', 'Poison']),
      mon('Houndoom', 47, ['Dark', 'Fire']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'lance-gen2',
    name: 'Lance',
    category: 'champion',
    locationId: 'indigo-plateau',
    location: 'Indigo Plateau',
    order: 19,
    levelCap: 50,
    baseTeam: [
      mon('Gyarados', 44, ['Water', 'Flying']),
      mon('Dragonite', 47, ['Dragon', 'Flying']),
      mon('Dragonite', 47, ['Dragon', 'Flying']),
      mon('Aerodactyl', 46, ['Rock', 'Flying']),
      mon('Charizard', 46, ['Fire', 'Flying']),
      mon('Dragonite', 50, ['Dragon', 'Flying']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'lt-surge-gen2',
    name: 'Lt. Surge',
    category: 'gym',
    locationId: 'vermilion-city',
    location: 'Vermilion Gym',
    order: 20,
    levelCap: 46,
    baseTeam: [
      mon('Raichu', 44, ['Electric']),
      mon('Electrode', 40, ['Electric']),
      mon('Magneton', 40, ['Electric', 'Steel']),
      mon('Electrode', 40, ['Electric']),
      mon('Electabuzz', 46, ['Electric']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'sabrina-gen2',
    name: 'Sabrina',
    category: 'gym',
    locationId: 'saffron-city',
    location: 'Saffron Gym',
    order: 21,
    levelCap: 48,
    baseTeam: [
      mon('Espeon', 46, ['Psychic']),
      mon('MrMime', 46, ['Psychic']),
      mon('Alakazam', 48, ['Psychic']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'misty-gen2',
    name: 'Misty',
    category: 'gym',
    locationId: 'cerulean-city',
    location: 'Cerulean Gym',
    order: 22,
    levelCap: 47,
    baseTeam: [
      mon('Golduck', 42, ['Water']),
      mon('Quagsire', 42, ['Water', 'Ground']),
      mon('Lapras', 44, ['Water', 'Ice']),
      mon('Starmie', 47, ['Water', 'Psychic']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'erika-gen2',
    name: 'Erika',
    category: 'gym',
    locationId: 'celadon-city',
    location: 'Celadon Gym',
    order: 23,
    levelCap: 46,
    baseTeam: [
      mon('Tangela', 42, ['Grass']),
      mon('Jumpluff', 41, ['Grass', 'Flying']),
      mon('Victreebel', 46, ['Grass', 'Poison']),
      mon('Bellossom', 46, ['Grass']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'janine-gen2',
    name: 'Janine',
    category: 'gym',
    locationId: 'fuchsia-city',
    location: 'Fuchsia Gym',
    order: 24,
    levelCap: 39,
    baseTeam: [
      mon('Crobat', 36, ['Poison', 'Flying']),
      mon('Weezing', 36, ['Poison']),
      mon('Weezing', 36, ['Poison']),
      mon('Ariados', 33, ['Bug', 'Poison']),
      mon('Venomoth', 39, ['Bug', 'Poison']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'brock-gen2',
    name: 'Brock',
    category: 'gym',
    locationId: 'pewter-city',
    location: 'Pewter Gym',
    order: 25,
    levelCap: 44,
    baseTeam: [
      mon('Graveler', 41, ['Rock', 'Ground']),
      mon('Rhyhorn', 41, ['Ground', 'Rock']),
      mon('Omastar', 42, ['Rock', 'Water']),
      mon('Kabutops', 42, ['Rock', 'Water']),
      mon('Onix', 44, ['Rock', 'Ground']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'blue-gen2',
    name: 'Blue',
    category: 'gym',
    locationId: 'viridian-city',
    location: 'Viridian Gym',
    order: 26,
    levelCap: 58,
    baseTeam: [
      mon('Pidgeot', 56, ['Normal', 'Flying']),
      mon('Alakazam', 54, ['Psychic']),
      mon('Rhydon', 56, ['Ground', 'Rock']),
      mon('Gyarados', 58, ['Water', 'Flying']),
      mon('Exeggutor', 58, ['Grass', 'Psychic']),
      mon('Arcanine', 58, ['Fire']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'blaine-gen2',
    name: 'Blaine',
    category: 'gym',
    locationId: 'seafoam-islands',
    location: 'Seafoam Gym',
    order: 27,
    levelCap: 50,
    baseTeam: [
      mon('Magcargo', 45, ['Fire', 'Rock']),
      mon('Magmar', 45, ['Fire']),
      mon('Rapidash', 50, ['Fire']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
  boss({
    id: 'red-gen2',
    name: 'Red',
    category: 'boss',
    locationId: 'mt-silver',
    location: 'Mt. Silver',
    order: 28,
    levelCap: 81,
    baseTeam: [
      mon('Pikachu', 81, ['Electric']),
      mon('Espeon', 73, ['Psychic']),
      mon('Snorlax', 75, ['Normal']),
      mon('Venusaur', 77, ['Grass', 'Poison']),
      mon('Charizard', 77, ['Fire', 'Flying']),
      mon('Blastoise', 77, ['Water']),
    ],
    notes: ['TODO: Verify original G/S/C movesets before adding moves.'],
  }),
];
