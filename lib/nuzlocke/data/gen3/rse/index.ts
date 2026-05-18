import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { getRseBossesForGame } from './bosses';
import { getRseEncounterOptionsForGame } from './encounters';
import { rseLocations } from './routes';
import { rseMetadata, supportsRse } from './metadata';

export { rseBosses, getRseBossesForGame } from './bosses';
export { rseEncounterAreas, rseEncounterNotes, getRseEncounterOptionsForGame } from './encounters';
export { rseLocations } from './routes';
export { rseGames, rseMetadata, supportsRse } from './metadata';

export function getRseLocations(gameVersion: GameVersion): string[] {
  if (!supportsRse(gameVersion)) return [];
  return rseLocations
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((location) => location.displayName);
}

export function getRseEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsRse(gameVersion)) return {};
  return getRseEncounterOptionsForGame(gameVersion);
}

export function getRseBosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsRse(gameVersion)) return [];
  return getRseBossesForGame(gameVersion)
    .slice()
    .sort((a, b) => (a.levelCap ?? 0) - (b.levelCap ?? 0) || a.recommendedOrder - b.recommendedOrder)
    .map((trainer) => bossTrainerToRunBoss(trainer, starterChoice));
}

export function getRseMetadata(gameVersion: GameVersion) {
  return supportsRse(gameVersion) ? rseMetadata : null;
}
