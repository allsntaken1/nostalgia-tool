import type { GameVersion } from '@/app/nuzlocke/types';
import type { GenerationMetadata } from '@/lib/nuzlocke/data/shared';

export const gen4Games: GameVersion[] = ['Diamond', 'Pearl', 'Platinum', 'HeartGold', 'SoulSilver'];

export const gen4Metadata: GenerationMetadata = {
  generation: 4,
  region: 'sinnoh/johto',
  gameSet: 'gen4',
  games: gen4Games,
  supportsStarterChoice: true,
  starterChoiceMode: 'type-only',
  dataStatus: 'Partial',
};

export function supportsGen4Data(gameVersion: GameVersion) {
  return gen4Games.includes(gameVersion);
}
