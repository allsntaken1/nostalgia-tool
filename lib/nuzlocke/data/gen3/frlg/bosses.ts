import type { BossTrainer } from '@/lib/nuzlocke/data/gen8/types';
import { frlgLevelCaps } from './levelCaps';

type FrlgBossCategory = 'rival' | 'gym' | 'evil-team' | 'elite-four' | 'champion';
type FrlgBossPokemon = NonNullable<BossTrainer['team']>[number];

const cap = (id: string, fallback: number) => frlgLevelCaps.find((item) => item.id === id)?.cap ?? fallback;
const mon = (species: string, level: number, types: FrlgBossPokemon['types']): FrlgBossPokemon => ({ species, level, types });

const boss = ({
  id,
  name,
  locationId,
  location,
  order,
  category,
  levelCap,
  team,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  locationId: string;
  location: string;
  order: number;
  category: FrlgBossCategory;
  levelCap?: number;
  team?: FrlgBossPokemon[];
  variantsByRivalStarterChoice?: BossTrainer['variantsByRivalStarterChoice'];
  notes?: string;
}): BossTrainer => ({
  id,
  name,
  category,
  game: 'Both',
  location,
  recommendedOrder: order,
  levelCap,
  notes: notes ?? (team?.length ? location : `FRLG skeleton boss at ${location}. Full team data coming later.`),
  progressionStage: locationId,
  baseTeam: team ?? [],
  ...(category === 'rival'
    ? {
        variantsByRivalStarterChoice: variantsByRivalStarterChoice ?? {
          grass: [],
          fire: [],
          water: [],
        },
      }
    : {}),
});

export const frlgBosses: BossTrainer[] = [
  boss({
    id: 'rival-route-22-1-frlg',
    name: 'Rival 1',
    locationId: 'route-22',
    location: 'Route 22',
    order: 1,
    category: 'rival',
    levelCap: 9,
    team: [mon('Pidgey', 9, ['Normal', 'Flying'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Bulbasaur', 9, ['Grass', 'Poison'])],
      fire: [mon('Charmander', 9, ['Fire'])],
      water: [mon('Squirtle', 9, ['Water'])],
    },
  }),
  boss({
    id: 'brock-frlg',
    name: 'Brock',
    locationId: 'pewter-city',
    location: 'Pewter City',
    order: 2,
    category: 'gym',
    levelCap: cap('brock-frlg', 14),
    team: [mon('Geodude', 12, ['Rock', 'Ground']), mon('Onix', 14, ['Rock', 'Ground'])],
  }),
  boss({
    id: 'rival-cerulean-frlg',
    name: 'Rival 2',
    locationId: 'cerulean-city',
    location: 'Cerulean City',
    order: 3,
    category: 'rival',
    levelCap: 18,
    team: [mon('Pidgeotto', 17, ['Normal', 'Flying']), mon('Abra', 16, ['Psychic']), mon('Rattata', 15, ['Normal'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Bulbasaur', 18, ['Grass', 'Poison'])],
      fire: [mon('Charmander', 18, ['Fire'])],
      water: [mon('Squirtle', 18, ['Water'])],
    },
  }),
  boss({ id: 'misty-frlg', name: 'Misty', locationId: 'cerulean-city', location: 'Cerulean City', order: 4, category: 'gym', levelCap: cap('misty-frlg', 21), team: [mon('Staryu', 18, ['Water']), mon('Starmie', 21, ['Water', 'Psychic'])] }),
  boss({
    id: 'rival-ss-anne-frlg',
    name: 'Rival 3',
    locationId: 'ss-anne',
    location: 'S.S. Anne',
    order: 5,
    category: 'rival',
    levelCap: 20,
    team: [mon('Pidgeotto', 19, ['Normal', 'Flying']), mon('Raticate', 16, ['Normal']), mon('Kadabra', 18, ['Psychic'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Ivysaur', 20, ['Grass', 'Poison'])],
      fire: [mon('Charmeleon', 20, ['Fire'])],
      water: [mon('Wartortle', 20, ['Water'])],
    },
  }),
  boss({ id: 'surge-frlg', name: 'Lt. Surge', locationId: 'vermilion-city', location: 'Vermilion City', order: 6, category: 'gym', levelCap: cap('surge-frlg', 24), team: [mon('Voltorb', 21, ['Electric']), mon('Pikachu', 18, ['Electric']), mon('Raichu', 24, ['Electric'])] }),
  boss({ id: 'giovanni-rocket-hideout-frlg', name: 'Giovanni 1', locationId: 'rocket-hideout', location: 'Rocket Hideout', order: 7, category: 'evil-team', levelCap: 29, team: [mon('Onix', 25, ['Rock', 'Ground']), mon('Rhyhorn', 24, ['Ground', 'Rock']), mon('Kangaskhan', 29, ['Normal'])] }),
  boss({ id: 'erika-frlg', name: 'Erika', locationId: 'celadon-city', location: 'Celadon City', order: 8, category: 'gym', levelCap: cap('erika-frlg', 29), team: [mon('Victreebel', 29, ['Grass', 'Poison']), mon('Tangela', 24, ['Grass']), mon('Vileplume', 29, ['Grass', 'Poison'])] }),
  boss({ id: 'rival-pokemon-tower-frlg', name: 'Rival 4', locationId: 'pokemon-tower', location: 'Pokemon Tower', order: 9, category: 'rival' }),
  boss({ id: 'koga-frlg', name: 'Koga', locationId: 'fuchsia-city', location: 'Fuchsia City', order: 10, category: 'gym', levelCap: cap('koga-frlg', 43) }),
  boss({ id: 'sabrina-frlg', name: 'Sabrina', locationId: 'saffron-city', location: 'Saffron City', order: 11, category: 'gym', levelCap: cap('sabrina-frlg', 43) }),
  boss({ id: 'blaine-frlg', name: 'Blaine', locationId: 'cinnabar-island', location: 'Cinnabar Island', order: 12, category: 'gym', levelCap: cap('blaine-frlg', 47) }),
  boss({ id: 'giovanni-silph-frlg', name: 'Giovanni 2', locationId: 'silph-co', location: 'Silph Co.', order: 13, category: 'evil-team' }),
  boss({ id: 'giovanni-viridian-frlg', name: 'Giovanni 3', locationId: 'viridian-gym', location: 'Viridian Gym', order: 14, category: 'gym', levelCap: cap('giovanni-viridian-frlg', 50) }),
  boss({ id: 'rival-route-22-5-frlg', name: 'Rival 5', locationId: 'route-22', location: 'Route 22', order: 15, category: 'rival' }),
  boss({ id: 'lorelei-frlg', name: 'Lorelei', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 16, category: 'elite-four', levelCap: cap('lorelei-frlg', 54) }),
  boss({ id: 'bruno-frlg', name: 'Bruno', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 17, category: 'elite-four', levelCap: cap('bruno-frlg', 56) }),
  boss({ id: 'agatha-frlg', name: 'Agatha', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 18, category: 'elite-four', levelCap: cap('agatha-frlg', 58) }),
  boss({ id: 'lance-frlg', name: 'Lance', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 19, category: 'elite-four', levelCap: cap('lance-frlg', 60) }),
  boss({ id: 'champion-rival-frlg', name: 'Champion Rival', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 20, category: 'champion', levelCap: cap('champion-rival-frlg', 63) }),
];
