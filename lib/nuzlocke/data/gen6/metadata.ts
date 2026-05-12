import type { GameVersion } from '@/app/nuzlocke/types';

export type XyGameId = 'x' | 'y';
export type XyGameSet = 'xy';

export const xyGames: GameVersion[] = ['X', 'Y'];

export const xyMetadata: Record<'X' | 'Y', {
  displayName: GameVersion;
  id: XyGameId;
  generation: 6;
  region: 'Kalos';
  gameSet: XyGameSet;
  moduleId: XyGameSet;
  supportsStarterChoice: true;
  starterChoiceMode: 'type-only';
  status: 'partial';
}> = {
  X: {
    displayName: 'X',
    id: 'x',
    generation: 6,
    region: 'Kalos',
    gameSet: 'xy',
    moduleId: 'xy',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'partial',
  },
  Y: {
    displayName: 'Y',
    id: 'y',
    generation: 6,
    region: 'Kalos',
    gameSet: 'xy',
    moduleId: 'xy',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'partial',
  },
};

export function supportsXyData(gameVersion: GameVersion): gameVersion is 'X' | 'Y' {
  return gameVersion === 'X' || gameVersion === 'Y';
}
