import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { xyLocations } from './routes';
import { getXyEncounterOptions } from './xy-encounters';
import { supportsXyData, xyMetadata } from './metadata';
import { xyBosses } from './xy-bosses';

export { xyLocations } from './routes';
export { getXyEncounterOptions, xyEncounterAreas, xyEncounterNotes } from './xy-encounters';
export { supportsXyData, xyMetadata } from './metadata';
export { xyBosses } from './xy-bosses';

export function getXyLocations(gameVersion: GameVersion): string[] {
  if (!supportsXyData(gameVersion)) return [];
  return xyLocations
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((loc) => loc.displayName);
}

export function getXyEncounterOptionsForGame(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsXyData(gameVersion)) return {};
  return getXyEncounterOptions(gameVersion);
}

export function getXyBosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsXyData(gameVersion)) return [];
  const safeBosses = Array.isArray(xyBosses) ? xyBosses : [];
  return safeBosses
    .filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion)
    .slice()
    .sort((a, b) => a.recommendedOrder - b.recommendedOrder || (a.levelCap ?? 0) - (b.levelCap ?? 0))
    .map((trainer) => bossTrainerToRunBoss(trainer, starterChoice));
}

export function getXyEncounterGroupsForTypeLookup() {
  return [getXyEncounterOptions('X')];
}

export function getXyMetadata(gameVersion: GameVersion) {
  return supportsXyData(gameVersion) ? xyMetadata[gameVersion] : null;
}
