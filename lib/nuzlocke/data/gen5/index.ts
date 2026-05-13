import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { blackWhiteBosses } from './black-white-bosses';
import { b2w2Routes, bwRoutes } from './gen5-routes';
import { getGen5TrainerSkeletons } from './gen5-trainers';
import { gen5Metadata, supportsGen5Data } from './metadata';
import { getBwEncounterOptions } from './bw-encounters';

export { blackWhiteBosses } from './black-white-bosses';
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
export { bwEncounterAreas, bwEncounterNotes, bwPostgameEncounterAreas, getBwEncounterOptions } from './bw-encounters';

function routeSet(gameVersion: GameVersion) {
  return gameVersion === 'Black 2' || gameVersion === 'White 2' ? b2w2Routes : bwRoutes;
}

/**
 * Routes available during the main-story progression for the given game version.
 * For BW we strip 'postgame'-tagged routes (Route 16, Lostlorn Forest, Marvelous Bridge)
 * because their canonical encounters are unreachable until after the credits.
 * Postgame data is preserved separately in `bwPostgameEncounterAreas`.
 */
function mainStoryRoutes(gameVersion: GameVersion) {
  const routes = routeSet(gameVersion);
  if (gameVersion === 'Black' || gameVersion === 'White') {
    return routes.filter((route) => !route.tags.includes('postgame'));
  }
  return routes;
}

export function getGen5Locations(gameVersion: GameVersion) {
  if (!supportsGen5Data(gameVersion)) return [];
  return mainStoryRoutes(gameVersion).map((route) => route.displayName);
}

export function getGen5EncounterOptions(gameVersion: GameVersion) {
  if (!supportsGen5Data(gameVersion)) return {};
  // BW pulls from the structured `bwEncounterAreas` (rich data per location); any location
  // not present in that map falls back to an empty option list so the UI still renders the
  // route name without crashing. Postgame entries are intentionally excluded — they live in
  // `bwPostgameEncounterAreas` and are surfaced only through a future postgame-aware path.
  if (gameVersion === 'Black' || gameVersion === 'White') {
    const populated = getBwEncounterOptions(gameVersion);
    return mainStoryRoutes(gameVersion).reduce<Record<string, EncounterOption[]>>((acc, route) => {
      acc[route.displayName] = populated[route.displayName] ?? [];
      return acc;
    }, {});
  }
  // B2W2 still uses the skeleton fallback until structured data lands.
  return mainStoryRoutes(gameVersion).reduce<Record<string, EncounterOption[]>>((acc, route) => {
    acc[route.displayName] = [];
    return acc;
  }, {});
}

export function getGen5Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsGen5Data(gameVersion)) return [];
  if (gameVersion === 'Black' || gameVersion === 'White') {
    return blackWhiteBosses
      .filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion)
      .slice()
      .sort((a, b) => (a.levelCap ?? 0) - (b.levelCap ?? 0) || a.recommendedOrder - b.recommendedOrder)
      .map((trainer) => bossTrainerToRunBoss(trainer, starterChoice));
  }
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
