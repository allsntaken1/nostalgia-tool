import type { GameVersion } from '@/app/nuzlocke/types';

export const gen2JohtoGames: GameVersion[] = ['Gold', 'Silver', 'Crystal'];

export const gen2JohtoMetadata = {
  generation: 2,
  region: 'johto',
  gameSet: 'gen2-johto',
  supportsStarterChoice: true,
  starterChoiceMode: 'type-only',
  status: 'skeleton',
};

export function supportsGen2Data(gameVersion: GameVersion) {
  return gen2JohtoGames.includes(gameVersion);
}
