import type { GameVersion, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { frlgBosses } from './bosses';
import { getFrlgEncounterAreas } from './encounters';
import { frlgLocations } from './routes';
import { supportsFrlg, frlgMetadata } from './metadata';

export { frlgBosses } from './bosses';
export { getFrlgEncounterAreas } from './encounters';
export { frlgLevelCaps } from './levelCaps';
export { frlgMetadata, supportsFrlg } from './metadata';
export { frlgLocations } from './routes';

export function getFrlgLocations(gameVersion: GameVersion) {
  if (!supportsFrlg(gameVersion)) return [];
  return frlgLocations
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((location) => location.displayName);
}

export function getFrlgEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsFrlg(gameVersion)) return {};
  return getFrlgEncounterAreas(gameVersion);
}

export function getFrlgBosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null) {
  if (!supportsFrlg(gameVersion)) return [];
  return frlgBosses.map((bossItem) => bossTrainerToRunBoss(bossItem, starterChoice));
}

export function getFrlgMetadata(gameVersion: GameVersion) {
  return supportsFrlg(gameVersion) ? frlgMetadata[gameVersion] : null;
}
