import type { GameVersion } from '@/app/nuzlocke/types';

export type FrlgGameId = 'firered' | 'leafgreen';
export type FrlgGameSet = 'frlg';

export const frlgMetadata: Record<'FireRed' | 'LeafGreen', {
  displayName: GameVersion;
  id: FrlgGameId;
  generation: 3;
  region: 'Kanto';
  gameSet: FrlgGameSet;
  moduleId: FrlgGameSet;
  supportsStarterChoice: true;
  starterChoiceMode: 'type-only';
  status: 'in-audit';
}> = {
  FireRed: {
    displayName: 'FireRed',
    id: 'firered',
    generation: 3,
    region: 'Kanto',
    gameSet: 'frlg',
    moduleId: 'frlg',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'in-audit',
  },
  LeafGreen: {
    displayName: 'LeafGreen',
    id: 'leafgreen',
    generation: 3,
    region: 'Kanto',
    gameSet: 'frlg',
    moduleId: 'frlg',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'in-audit',
  },
};

export function supportsFrlg(gameVersion: GameVersion): gameVersion is 'FireRed' | 'LeafGreen' {
  return gameVersion === 'FireRed' || gameVersion === 'LeafGreen';
}
