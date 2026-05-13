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

const emptyStarterVariants: Partial<Record<StarterChoice, Gen2BossPokemon[]>> = { grass: [], fire: [], water: [] };

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
  boss({ id: 'bugsy-gen2', name: 'Bugsy', category: 'Gym Leader', locationId: 'azalea-town', location: 'Azalea Town', order: 4 }),
  boss({ id: 'rival-2-gen2', name: 'Rival 2', category: 'Rival', locationId: 'azalea-town', location: 'Azalea Town', order: 5, variantsByRivalStarterChoice: emptyStarterVariants }),
  boss({ id: 'whitney-gen2', name: 'Whitney', category: 'Gym Leader', locationId: 'goldenrod-city', location: 'Goldenrod City', order: 6 }),
  boss({ id: 'rival-3-gen2', name: 'Rival 3', category: 'Rival', locationId: 'burned-tower', location: 'Burned Tower', order: 7, variantsByRivalStarterChoice: emptyStarterVariants }),
  boss({ id: 'morty-gen2', name: 'Morty', category: 'Gym Leader', locationId: 'ecruteak-city', location: 'Ecruteak City', order: 8 }),
  boss({ id: 'chuck-gen2', name: 'Chuck', category: 'Gym Leader', locationId: 'cianwood-city', location: 'Cianwood City', order: 9 }),
  boss({ id: 'jasmine-gen2', name: 'Jasmine', category: 'Gym Leader', locationId: 'olivine-city', location: 'Olivine City', order: 10 }),
  boss({ id: 'pryce-gen2', name: 'Pryce', category: 'Gym Leader', locationId: 'mahogany-town', location: 'Mahogany Town', order: 11 }),
  boss({ id: 'rocket-admins-gen2', name: 'Team Rocket Admin Fights', category: 'Evil Team', locationId: 'team-rocket-hq', location: 'Team Rocket HQ', order: 12 }),
  boss({ id: 'clair-gen2', name: 'Clair', category: 'Gym Leader', locationId: 'blackthorn-city', location: 'Blackthorn City', order: 13 }),
  boss({ id: 'rival-victory-road-gen2', name: 'Rival Victory Road', category: 'Rival', locationId: 'victory-road', location: 'Victory Road', order: 14, variantsByRivalStarterChoice: emptyStarterVariants }),
  boss({ id: 'will-gen2', name: 'Will', category: 'Elite Four', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 15 }),
  boss({ id: 'koga-gen2', name: 'Koga', category: 'Elite Four', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 16 }),
  boss({ id: 'bruno-gen2', name: 'Bruno', category: 'Elite Four', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 17 }),
  boss({ id: 'karen-gen2', name: 'Karen', category: 'Elite Four', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 18 }),
  boss({ id: 'lance-gen2', name: 'Lance', category: 'Champion', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 19 }),
  boss({ id: 'red-gen2', name: 'Red', category: 'Optional Postgame', locationId: 'mt-silver', location: 'Mt. Silver', order: 20 }),
];
