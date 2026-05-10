import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { b2w2Routes, bwRoutes } from './gen5-routes';
import { getGen5TrainerSkeletons } from './gen5-trainers';
import { gen5Metadata, supportsGen5Data } from './metadata';

export { b2w2Gyms } from './b2w2-gyms';
export { bwGyms } from './bw-gyms';
export { gen5Encounters } from './gen5-encounters';
export { gen5EliteFour } from './gen5-elitefour';
export { gen5LevelCaps } from './gen5-levelcaps';
export { gen5Rivals } from './gen5-rivals';
export { b2w2Routes, bwRoutes } from './gen5-routes';
export { gen5StaticEncounters } from './gen5-static-encounters';
export { getGen5TrainerSkeletons } from './gen5-trainers';
export { gen5Metadata, supportsGen5Data } from './metadata';

function routeSet(gameVersion: GameVersion) {
  return gameVersion === 'Black 2' || gameVersion === 'White 2' ? b2w2Routes : bwRoutes;
}

export function getGen5Locations(gameVersion: GameVersion) {
  if (!supportsGen5Data(gameVersion)) return [];
  return routeSet(gameVersion).map((route) => route.displayName);
}

export function getGen5EncounterOptions(gameVersion: GameVersion) {
  if (!supportsGen5Data(gameVersion)) return {};
  return routeSet(gameVersion).reduce<Record<string, EncounterOption[]>>((acc, route) => {
    acc[route.displayName] = [];
    return acc;
  }, {});
}

export function getGen5Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  void starterChoice;
  if (!supportsGen5Data(gameVersion)) return [];
  return getGen5TrainerSkeletons(gameVersion).map((trainer) => ({
    id: trainer.id,
    name: trainer.name,
    category: trainer.category,
    levelCap: trainer.levelCap ?? 1,
    completed: false,
    notes: trainer.notes.join(' '),
    deaths: 0,
    pokemon: [],
  }));
}

export function getGen5EncounterGroupsForTypeLookup() {
  return [getGen5EncounterOptions('Black')];
}

export function getGen5Metadata(gameVersion: GameVersion) {
  return supportsGen5Data(gameVersion) ? gen5Metadata : null;
}
