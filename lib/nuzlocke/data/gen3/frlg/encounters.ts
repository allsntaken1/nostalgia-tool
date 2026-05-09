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
const ghostPoison = (species: string): EncounterOption => ({ species, types: ['Ghost', 'Poison'] });
const grassPoison = (species: string): EncounterOption => ({ species, types: ['Grass', 'Poison'] });
const ground = (species: string): EncounterOption => ({ species, types: ['Ground'] });
const rockGround = (species: string): EncounterOption => ({ species, types: ['Rock', 'Ground'] });
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
  'Route 5': [flying('Pidgey'), normal('Meowth')],
  'Route 6': [flying('Pidgey'), normal('Meowth'), water('Magikarp', 'fishing'), water('Poliwag', 'fishing'), water('Goldeen', 'fishing')],
  'Vermilion City': [water('Magikarp', 'fishing'), water('Tentacool', 'surfing')],
  "Diglett's Cave": [ground('Diglett'), ground('Dugtrio')],
  'Route 11': [flying('Spearow'), normal('Drowzee'), water('Magikarp', 'fishing'), water('Tentacool', 'surfing')],
  'Route 9': [normal('Rattata'), flying('Spearow')],
  'Route 10': [flying('Spearow'), { species: 'Voltorb', types: ['Electric'] }, water('Magikarp', 'fishing'), water('Poliwag', 'fishing'), water('Tentacool', 'surfing')],
  'Rock Tunnel': [{ species: 'Zubat', types: ['Poison', 'Flying'] }, rockGround('Geodude'), { species: 'Machop', types: ['Fighting'] }, rockGround('Onix')],
  'Lavender Town': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Route 8': [flying('Pidgey'), normal('Meowth')],
  'Route 7': [flying('Pidgey'), normal('Meowth')],
  'Celadon City': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Pokemon Tower': [ghostPoison('Gastly'), ghostPoison('Haunter'), ground('Cubone')],
  'Route 12': [flying('Pidgey'), flying('Pidgeotto'), { species: 'Venonat', types: ['Bug', 'Poison'] }, water('Magikarp', 'fishing'), water('Poliwag', 'fishing'), water('Tentacool', 'surfing'), normal('Snorlax')],
  'Route 13': [flying('Pidgey'), flying('Pidgeotto'), { species: 'Venonat', types: ['Bug', 'Poison'] }, normal('Ditto')],
  'Route 14': [flying('Pidgey'), flying('Pidgeotto'), { species: 'Venonat', types: ['Bug', 'Poison'] }, normal('Ditto')],
  'Route 15': [flying('Pidgey'), flying('Pidgeotto'), { species: 'Venonat', types: ['Bug', 'Poison'] }, normal('Ditto')],
  'Fuchsia City': [water('Magikarp', 'fishing'), water('Goldeen', 'fishing'), water('Seaking', 'fishing'), water('Tentacool', 'surfing')],
  'Safari Zone': [poison('NidoranF'), poison('NidoranM'), { species: 'Paras', types: ['Bug', 'Grass'] }, grassPoison('Exeggcute'), ground('Rhyhorn'), normal('Kangaskhan'), normal('Tauros'), normal('Chansey'), flying('Doduo'), { species: 'Venonat', types: ['Bug', 'Poison'] }, water('Dratini', 'fishing')],
  'Route 24': [flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }],
  'Route 25': [flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }],
};

const versionSpecific: Record<FrlgVersion, FrlgEncounterMap> = {
  FireRed: {
    'Route 22': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('NidoranF')],
    'Route 4': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('Ekans')],
    'Route 5': [grassPoison('Oddish')],
    'Route 6': [grassPoison('Oddish')],
    'Route 7': [grassPoison('Oddish'), poison('Ekans'), { species: 'Growlithe', types: ['Fire'] }],
    'Route 8': [grassPoison('Oddish'), poison('Ekans'), { species: 'Growlithe', types: ['Fire'] }],
    'Route 9': [poison('Ekans')],
    'Route 10': [poison('Ekans')],
    'Route 11': [poison('Ekans')],
    'Route 12': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Route 13': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Route 14': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Route 15': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Safari Zone': [{ species: 'Scyther', types: ['Bug', 'Flying'] }],
    'Route 24': [bug('Caterpie'), bug('Metapod'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Oddish', types: ['Grass', 'Poison'] }],
    'Route 25': [bug('Caterpie'), bug('Metapod'), flying('Pidgey'), { species: 'Abra', types: ['Psychic'] }, { species: 'Oddish', types: ['Grass', 'Poison'] }],
  },
  LeafGreen: {
    'Route 22': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, poison('NidoranM')],
    'Route 4': [normal('Rattata'), flying('Spearow'), { species: 'Mankey', types: ['Fighting'] }, { species: 'Sandshrew', types: ['Ground'] }],
    'Route 5': [grassPoison('Bellsprout')],
    'Route 6': [grassPoison('Bellsprout')],
    'Route 7': [grassPoison('Bellsprout'), ground('Sandshrew'), { species: 'Vulpix', types: ['Fire'] }],
    'Route 8': [grassPoison('Bellsprout'), ground('Sandshrew'), { species: 'Vulpix', types: ['Fire'] }],
    'Route 9': [ground('Sandshrew')],
    'Route 10': [ground('Sandshrew')],
    'Route 11': [ground('Sandshrew')],
    'Route 12': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Route 13': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Route 14': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Route 15': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Safari Zone': [{ species: 'Pinsir', types: ['Bug'] }],
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
