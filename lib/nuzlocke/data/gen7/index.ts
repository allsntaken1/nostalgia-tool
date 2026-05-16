import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { smRoutes, usumRoutes } from './routes';
import { getSmEncounterOptions, getSmEncounterOptionsForGame, smEncounterAreas } from './sun-moon-encounters';
import { getUsumEncounterOptions, getUsumEncounterOptionsForGame, usumEncounterAreas } from './ultra-sun-ultra-moon-encounters';
import { sunMoonBosses } from './sun-moon-bosses';
import { ultraSunUltraMoonBosses } from './ultra-sun-ultra-moon-bosses';
import { gen7Metadata, isSunMoon, isUltraSunUltraMoon, supportsGen7Data } from './metadata';

export { gen7Metadata, supportsGen7Data, isSunMoon, isUltraSunUltraMoon } from './metadata';
export { smRoutes, usumRoutes, gen7AllLocations } from './routes';
export {
  smEncounterAreas,
  smEncounterNotes,
  gen7EncounterTodos,
  getSmEncounterOptions,
  getSmEncounterOptionsForGame,
} from './sun-moon-encounters';
export {
  usumEncounterAreas,
  usumEncounterNotes,
  getUsumEncounterOptions,
  getUsumEncounterOptionsForGame,
} from './ultra-sun-ultra-moon-encounters';
export { sunMoonBosses } from './sun-moon-bosses';
export { ultraSunUltraMoonBosses } from './ultra-sun-ultra-moon-bosses';

function routeSet(gameVersion: GameVersion) {
  if (isUltraSunUltraMoon(gameVersion)) return usumRoutes;
  return smRoutes;
}

export function getGen7Locations(gameVersion: GameVersion): string[] {
  if (!supportsGen7Data(gameVersion)) return [];
  const routes = routeSet(gameVersion);
  return (Array.isArray(routes) ? routes : [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((loc) => loc.displayName);
}

export function getGen7EncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsGen7Data(gameVersion)) return {};
  if (isUltraSunUltraMoon(gameVersion)) return getUsumEncounterOptionsForGame(gameVersion);
  if (isSunMoon(gameVersion)) return getSmEncounterOptionsForGame(gameVersion);
  return {};
}

export function getGen7Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsGen7Data(gameVersion)) return [];
  const source = isUltraSunUltraMoon(gameVersion) ? ultraSunUltraMoonBosses : sunMoonBosses;
  const safe = Array.isArray(source) ? source : [];
  return safe
    .filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion)
    .slice()
    .sort((a, b) => (a.levelCap ?? 0) - (b.levelCap ?? 0) || a.recommendedOrder - b.recommendedOrder)
    .map((trainer) => bossTrainerToRunBoss(trainer, starterChoice));
}

export function getGen7EncounterGroupsForTypeLookup() {
  // Use the unfiltered SM options here so a type lookup covers both version-exclusive lists.
  return [getSmEncounterOptions(), getUsumEncounterOptions()];
}

export function getGen7Metadata(gameVersion: GameVersion) {
  return supportsGen7Data(gameVersion) ? gen7Metadata[gameVersion] : null;
}

// Surface the underlying areas too, so callers that want to render TODO areas can do so.
export const gen7AreasByGameSet = {
  sm: smEncounterAreas,
  usum: usumEncounterAreas,
};
