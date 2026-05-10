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
const electric = (species: string): EncounterOption => ({ species, types: ['Electric'] });
const fire = (species: string): EncounterOption => ({ species, types: ['Fire'] });
const fireFlying = (species: string): EncounterOption => ({ species, types: ['Fire', 'Flying'] });
const ghostPoison = (species: string): EncounterOption => ({ species, types: ['Ghost', 'Poison'] });
const grassPoison = (species: string): EncounterOption => ({ species, types: ['Grass', 'Poison'] });
const ground = (species: string): EncounterOption => ({ species, types: ['Ground'] });
const poisonGround = (species: string): EncounterOption => ({ species, types: ['Poison', 'Ground'] });
const poisonFlying = (species: string): EncounterOption => ({ species, types: ['Poison', 'Flying'] });
const psychic = (species: string): EncounterOption => ({ species, types: ['Psychic'] });
const rockGround = (species: string): EncounterOption => ({ species, types: ['Rock', 'Ground'] });
const waterIce = (species: string): EncounterOption => ({ species, types: ['Water', 'Ice'] });
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
  'Route 16': [flying('Spearow'), flying('Fearow'), flying('Doduo'), normal('Raticate'), normal('Snorlax')],
  'Route 17': [flying('Spearow'), flying('Fearow'), flying('Doduo'), normal('Raticate')],
  'Route 18': [flying('Spearow'), flying('Fearow'), flying('Doduo'), normal('Raticate')],
  'Silph Co.': [waterIce('Lapras')],
  'Route 19': [water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Magikarp', 'fishing'), water('Horsea', 'fishing'), water('Shellder', 'fishing')],
  'Route 20': [water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Magikarp', 'fishing'), water('Horsea', 'fishing'), water('Shellder', 'fishing')],
  'Seafoam Islands': [poisonFlying('Zubat'), poisonFlying('Golbat'), waterIce('Seel'), waterIce('Dewgong'), water('Magikarp', 'fishing'), water('Horsea', 'fishing'), waterIce('Articuno')],
  'Cinnabar Island': [water('Magikarp', 'fishing'), water('Tentacool', 'surfing'), water('Tentacruel', 'surfing')],
  'Pokemon Mansion': [normal('Rattata'), normal('Raticate'), poison('Koffing'), poison('Weezing'), poison('Grimer'), poison('Muk'), fire('Vulpix'), fire('Growlithe'), fire('Magmar')],
  'Route 21': [flying('Pidgey'), flying('Pidgeotto'), normal('Rattata'), normal('Raticate'), normal('Tangela'), water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Magikarp', 'fishing'), water('Horsea', 'fishing'), water('Shellder', 'fishing')],
  'Route 23': [flying('Spearow'), flying('Fearow'), normal('Raticate'), ground('Sandslash'), poison('Nidorina'), poison('Nidorino'), water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Victory Road': [poisonFlying('Zubat'), poisonFlying('Golbat'), rockGround('Geodude'), rockGround('Graveler'), rockGround('Onix'), { species: 'Machop', types: ['Fighting'] }, { species: 'Machoke', types: ['Fighting'] }, normal('Marowak'), fireFlying('Moltres')],
  'Power Plant': [electric('Pikachu'), electric('Voltorb'), electric('Electrode'), electric('Magnemite'), electric('Magneton'), electric('Zapdos')],
  'One Island': [water('Magikarp', 'fishing'), water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Horsea', 'fishing')],
  'Kindle Road': [flying('Spearow'), flying('Fearow'), fire('Ponyta'), fire('Rapidash'), water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Magikarp', 'fishing'), water('Horsea', 'fishing')],
  'Mt. Ember': [flying('Spearow'), flying('Fearow'), rockGround('Geodude'), rockGround('Graveler'), { species: 'Machop', types: ['Fighting'] }, { species: 'Machoke', types: ['Fighting'] }, fireFlying('Moltres')],
  'Treasure Beach': [water('Tentacool', 'surfing'), water('Tentacruel', 'surfing'), water('Magikarp', 'fishing'), water('Horsea', 'fishing')],
  'Two Island': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Cape Brink': [flying('Spearow'), flying('Fearow'), grassPoison('Bellsprout'), grassPoison('Weepinbell'), grassPoison('Oddish'), grassPoison('Gloom'), water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Three Island': [water('Magikarp', 'fishing'), water('Poliwag', 'fishing')],
  'Bond Bridge': [normal('Meowth'), flying('Pidgey'), flying('Pidgeotto'), grassPoison('Oddish'), grassPoison('Gloom'), grassPoison('Bellsprout'), grassPoison('Weepinbell'), water('Magikarp', 'fishing'), water('Horsea', 'fishing')],
  'Berry Forest': [flying('Pidgey'), flying('Pidgeotto'), grassPoison('Oddish'), grassPoison('Gloom'), grassPoison('Bellsprout'), grassPoison('Weepinbell'), psychic('Hypno')],
  'Cerulean Cave': [poisonFlying('Golbat'), psychic('Kadabra'), psychic('Drowzee'), psychic('Hypno'), normal('Ditto'), rockGround('Graveler'), normal('Rhydon'), water('Magikarp', 'fishing'), water('Poliwag', 'fishing'), psychic('Mewtwo')],
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
    'Route 16': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Route 17': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Route 18': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Seafoam Islands': [water('Psyduck'), water('Golduck'), water('Psyduck', 'surfing'), water('Golduck', 'surfing')],
    'Cinnabar Island': [water('Krabby', 'fishing'), water('Kingler', 'fishing')],
    'Pokemon Mansion': [fire('Growlithe')],
    'Route 21': [grassPoison('Oddish'), grassPoison('Gloom'), water('Krabby', 'fishing'), water('Kingler', 'fishing')],
    'Route 23': [poison('Nidorina'), poisonGround('Nidoqueen'), water('Psyduck', 'fishing'), water('Golduck', 'fishing')],
    'Victory Road': [poison('Nidorina'), poisonGround('Nidoqueen'), ground('Sandslash')],
    'Kindle Road': [water('Krabby', 'fishing'), water('Kingler', 'fishing')],
    'Mt. Ember': [fire('Magmar')],
    'Treasure Beach': [water('Krabby', 'fishing'), water('Kingler', 'fishing')],
    'Cape Brink': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Bond Bridge': [grassPoison('Oddish'), grassPoison('Gloom'), water('Krabby', 'fishing'), water('Kingler', 'fishing')],
    'Berry Forest': [grassPoison('Oddish'), grassPoison('Gloom')],
    'Cerulean Cave': [water('Psyduck', 'surfing'), water('Golduck', 'surfing'), water('Slowpoke', 'fishing')],
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
    'Route 16': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Route 17': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Route 18': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Seafoam Islands': [water('Slowpoke'), water('Slowbro'), water('Slowpoke', 'surfing'), water('Slowbro', 'surfing')],
    'Cinnabar Island': [water('Staryu', 'fishing'), water('Starmie', 'fishing')],
    'Pokemon Mansion': [fire('Vulpix')],
    'Route 21': [grassPoison('Bellsprout'), grassPoison('Weepinbell'), water('Staryu', 'fishing'), water('Starmie', 'fishing')],
    'Route 23': [poison('Nidorino'), poisonGround('Nidoking'), water('Slowpoke', 'fishing'), water('Slowbro', 'fishing')],
    'Victory Road': [poison('Nidorino'), poisonGround('Nidoking'), poison('Arbok')],
    'Kindle Road': [water('Staryu', 'fishing'), water('Starmie', 'fishing')],
    'Treasure Beach': [water('Staryu', 'fishing'), water('Starmie', 'fishing')],
    'Cape Brink': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Bond Bridge': [grassPoison('Bellsprout'), grassPoison('Weepinbell'), water('Staryu', 'fishing'), water('Starmie', 'fishing')],
    'Berry Forest': [grassPoison('Bellsprout'), grassPoison('Weepinbell')],
    'Cerulean Cave': [water('Slowpoke', 'surfing'), water('Slowbro', 'surfing'), water('Psyduck', 'fishing')],
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
