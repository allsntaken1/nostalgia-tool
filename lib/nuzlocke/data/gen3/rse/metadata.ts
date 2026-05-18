import type { GameVersion } from '@/app/nuzlocke/types';
import type { GenerationMetadata } from '@/lib/nuzlocke/data/shared';

export const rseGames: GameVersion[] = ['Ruby', 'Sapphire', 'Emerald'];

export const rseMetadata: GenerationMetadata = {
  generation: 3,
  region: 'hoenn',
  gameSet: 'gen3-rse',
  games: rseGames,
  supportsStarterChoice: true,
  starterChoiceMode: 'type-only',
  dataStatus: 'Partial',
};

export function supportsRse(gameVersion: GameVersion): gameVersion is 'Ruby' | 'Sapphire' | 'Emerald' {
  return gameVersion === 'Ruby' || gameVersion === 'Sapphire' || gameVersion === 'Emerald';
}
