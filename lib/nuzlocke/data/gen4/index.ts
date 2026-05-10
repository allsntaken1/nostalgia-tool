import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { hgssBosses } from './hgss-bosses';
import { getHgssEncounterOptions } from './hgss-encounters';
import { gen4Routes, hgssRoutes } from './gen4-routes';
import { getGen4TrainerSkeletons } from './gen4-trainers';
import { gen4Metadata, supportsGen4Data } from './metadata';

export { diamondPearlGyms } from './diamond-pearl-gyms';
export { gen4Encounters } from './gen4-encounters';
export { gen4EliteFour } from './gen4-elitefour';
export { gen4LevelCaps } from './gen4-levelcaps';
export { gen4Rivals } from './gen4-rivals';
export { gen4Routes, hgssRoutes } from './gen4-routes';
export { gen4StaticEncounters } from './gen4-static-encounters';
export { getGen4TrainerSkeletons } from './gen4-trainers';
export { hgssBosses } from './hgss-bosses';
export { getHgssEncounterOptions, hgssEncounterAreas, hgssEncounterNotes } from './hgss-encounters';
export { hgssGyms } from './hgss-gyms';
export { gen4Metadata, supportsGen4Data } from './metadata';
export { platinumGyms } from './platinum-gyms';

function routeSet(gameVersion: GameVersion) {
  return gameVersion === 'HeartGold' || gameVersion === 'SoulSilver' ? hgssRoutes : gen4Routes;
}

export function getGen4Locations(gameVersion: GameVersion) {
  if (!supportsGen4Data(gameVersion)) return [];
  return routeSet(gameVersion).map((route) => route.displayName);
}

export function getGen4EncounterOptions(gameVersion: GameVersion) {
  if (!supportsGen4Data(gameVersion)) return {};
  if (gameVersion === 'HeartGold' || gameVersion === 'SoulSilver') return getHgssEncounterOptions(gameVersion);
  return routeSet(gameVersion).reduce<Record<string, EncounterOption[]>>((acc, route) => {
    acc[route.displayName] = [];
    return acc;
  }, {});
}

export function getGen4Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsGen4Data(gameVersion)) return [];
  if (gameVersion === 'HeartGold' || gameVersion === 'SoulSilver') {
    return hgssBosses
      .slice()
      .sort((a, b) => (a.levelCap ?? 0) - (b.levelCap ?? 0) || a.recommendedOrder - b.recommendedOrder)
      .map((boss) => bossTrainerToRunBoss(boss, starterChoice));
  }
  return getGen4TrainerSkeletons(gameVersion).map((trainer) => ({
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

export function getGen4EncounterGroupsForTypeLookup() {
  return [getGen4EncounterOptions('Diamond')];
}

export function getGen4Metadata(gameVersion: GameVersion) {
  return supportsGen4Data(gameVersion) ? gen4Metadata : null;
}
