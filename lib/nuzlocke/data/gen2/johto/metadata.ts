import type { GameVersion } from '@/app/nuzlocke/types';
import type { GenerationMetadata } from '@/lib/nuzlocke/data/shared';

export const gen2JohtoGames: GameVersion[] = ['Gold', 'Silver', 'Crystal'];

export const gen2JohtoMetadata: GenerationMetadata = {
  generation: 2,
  region: 'johto',
  gameSet: 'gen2-johto',
  games: gen2JohtoGames,
  supportsStarterChoice: true,
  starterChoiceMode: 'type-only',
  dataStatus: 'Partial',
};

export function supportsGen2Data(gameVersion: GameVersion) {
  return gen2JohtoGames.includes(gameVersion);
}
