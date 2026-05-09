import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion } from '@/app/nuzlocke/types';
import { frlgLocations } from './routes';

type FrlgVersion = 'FireRed' | 'LeafGreen';
type FrlgEncounterMap = Record<string, EncounterOption[]>;

const normal = (species: string): EncounterOption => ({ species, types: ['Normal'] });
const flying = (species: string): EncounterOption => ({ species, types: ['Normal', 'Flying'] });
const poison = (species: string): EncounterOption => ({ species, types: ['Poison'] });
const bug = (species: string): EncounterOption => ({ species, types: ['Bug'] });
const bugPoison = (species: string): EncounterOption => ({ species, types: ['Bug', 'Poison'] });
const water = (species: string, method?: 'fishing' | 'surfing'): EncounterOption => ({
  species,
  types: ['Water'],
  fishingMethod: method === 'fishing' || undefined,
  surfMethod: method === 'surfing' || undefined,
});

const shared: FrlgEncounterMap = {
  'Pallet Town': [water('Magikarp', 'fishing'), water('Tentacool', 'surfing')],
  'Route 1': [flying('Pidgey'), normal('Rattata')],
  'Viridian City': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Route 2': [flying('Pidgey'), normal('Rattata'), bug('Caterpie'), bugPoison('Weedle')],
  'Viridian Forest': [bug('Caterpie'), bug('Metapod'), bugPoison('Weedle'), bugPoison('Kakuna'), { species: 'Pikachu', types: ['Electric'] }],
  'Pewter City': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Route 3': [flying('Pidgey'), flying('Spearow'), normal('Jigglypuff'), poison('NidoranF'), poison('NidoranM'), { species: 'Mankey', types: ['Fighting'] }],
  'Mt. Moon': [{ species: 'Zubat', types: ['Poison', 'Flying'] }, { species: 'Geodude', types: ['Rock', 'Ground'] }, { species: 'Paras', types: ['Bug', 'Grass'] }, normal('Clefairy')],
  'Cerulean City': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing'), water('Goldeen', 'fishing')],
  'Route 24': [flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }],
  'Route 25': [flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }],
};

const versionSpecific: Record<FrlgVersion, FrlgEncounterMap> = {
  FireRed: {
    'Route 22': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('NidoranF')],
    'Route 4': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('Ekans')],
    'Route 24': [bug('Caterpie'), bug('Metapod'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Oddish', types: ['Grass', 'Poison'] }],
    'Route 25': [bug('Caterpie'), bug('Metapod'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Oddish', types: ['Grass', 'Poison'] }],
  },
  LeafGreen: {
    'Route 22': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('NidoranM')],
    'Route 4': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, { species: 'Sandshrew', types: ['Ground'] }],
    'Route 24': [bugPoison('Weedle'), bugPoison('Kakuna'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Bellsprout', types: ['Grass', 'Poison'] }],
    'Route 25': [bugPoison('Weedle'), bugPoison('Kakuna'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Bellsprout', types: ['Grass', 'Poison'] }],
  },
};

function dedupe(options: EncounterOption[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = `${option.species}-${option.fishingMethod ? 'fish' : ''}-${option.surfMethod ? 'surf' : ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getFrlgEncounterAreas(gameVersion: GameVersion): FrlgEncounterMap {
  const version = gameVersion === 'LeafGreen' ? 'LeafGreen' : 'FireRed';
  return frlgLocations.reduce<FrlgEncounterMap>((acc, location) => {
    const base = shared[location.displayName] ?? [];
    const extra = versionSpecific[version][location.displayName] ?? [];
    acc[location.displayName] = dedupe([...base, ...extra]);
    return acc;
  }, {});
}
