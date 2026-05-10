import type { GameVersion } from '@/app/nuzlocke/types';
import type { GenerationMetadata } from '@/lib/nuzlocke/data/shared';

export const gen5Games: GameVersion[] = ['Black', 'White', 'Black 2', 'White 2'];

export const gen5Metadata: GenerationMetadata = {
  generation: 5,
  region: 'unova',
  gameSet: 'gen5',
  games: gen5Games,
  supportsStarterChoice: true,
  starterChoiceMode: 'type-only',
  dataStatus: 'Skeleton',
};

export function supportsGen5Data(gameVersion: GameVersion) {
  return gen5Games.includes(gameVersion);
}
