import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { gen2JohtoBosses } from './bosses';
import { gen2JohtoLocations } from './routes';
import { gen2JohtoMetadata, supportsGen2Data } from './metadata';

export { gen2JohtoBosses } from './bosses';
export { gen2JohtoLevelCaps } from './levelCaps';
export { gen2JohtoLocations } from './routes';
export { gen2JohtoMetadata, supportsGen2Data } from './metadata';

export function getGen2Locations(gameVersion: GameVersion) {
  if (!supportsGen2Data(gameVersion)) return [];
  return gen2JohtoLocations.map((location) => location.displayName);
}

export function getGen2EncounterOptions(gameVersion: GameVersion) {
  if (!supportsGen2Data(gameVersion)) return {};
  return gen2JohtoLocations.reduce<Record<string, EncounterOption[]>>((acc, location) => {
    acc[location.displayName] = [];
    return acc;
  }, {});
}

export function getGen2Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  void starterChoice;
  if (!supportsGen2Data(gameVersion)) return [];
  return gen2JohtoBosses.map((boss) => ({
    id: boss.id,
    name: boss.name,
    category: boss.category,
    levelCap: 1,
    completed: false,
    notes: `${boss.locationId}. Gen 2 boss team data coming soon.`,
    deaths: 0,
    pokemon: [],
  }));
}

export function getGen2EncounterGroupsForTypeLookup() {
  return [getGen2EncounterOptions('Gold')];
}

export function getGen2Metadata(gameVersion: GameVersion) {
  return supportsGen2Data(gameVersion) ? gen2JohtoMetadata : null;
}
