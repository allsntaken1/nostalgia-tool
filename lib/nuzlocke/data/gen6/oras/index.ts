import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bossTrainerToRunBoss } from '@/lib/nuzlocke/data/gen8/types';
import { supportsOrasData, orasMetadata } from './metadata';
import { orasLocations } from './routes';
import { getOrasEncounterOptions } from './encounters';
import { orasBosses } from './bosses';

export { supportsOrasData, orasGames, orasMetadata } from './metadata';
export { orasLocations } from './routes';
export { getOrasEncounterOptions, orasEncounterAreas, orasEncounterNotes, orasStarterEncounters } from './encounters';
export { orasBosses } from './bosses';

export function getOrasLocations(gameVersion: GameVersion): string[] {
  if (!supportsOrasData(gameVersion)) return [];
  return orasLocations
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((loc) => loc.displayName);
}

export function getOrasEncounterOptionsForGame(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (!supportsOrasData(gameVersion)) return {};
  return getOrasEncounterOptions(gameVersion);
}

function sharedLookupChoiceForOrasPlayerStarter(starterChoice?: StarterChoice | null): StarterChoice | null {
  if (starterChoice === 'grass') return 'water';
  if (starterChoice === 'fire') return 'grass';
  if (starterChoice === 'water') return 'fire';
  return null;
}

export function getOrasBosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsOrasData(gameVersion)) return [];
  const safeBosses = Array.isArray(orasBosses) ? orasBosses : [];
  const sharedLookupChoice = sharedLookupChoiceForOrasPlayerStarter(starterChoice);
  return safeBosses
    .filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion)
    .slice()
    .sort((a, b) => a.recommendedOrder - b.recommendedOrder || (a.levelCap ?? 0) - (b.levelCap ?? 0))
    .map((trainer) => {
      const runBoss = bossTrainerToRunBoss(trainer, sharedLookupChoice);
      return {
        ...runBoss,
        levelCap: trainer.levelCap ?? null,
        pokemon: Array.isArray(runBoss.pokemon) ? runBoss.pokemon : [],
      };
    });
}

export function getOrasMetadata(gameVersion: GameVersion) {
  return supportsOrasData(gameVersion) ? orasMetadata[gameVersion] : null;
}
