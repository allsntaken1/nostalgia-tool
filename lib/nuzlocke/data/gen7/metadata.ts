import type { GameVersion } from '@/app/nuzlocke/types';

export type Gen7Game = 'Sun' | 'Moon' | 'Ultra Sun' | 'Ultra Moon';
export type Gen7GameSet = 'sm' | 'usum';

export const gen7Games: GameVersion[] = ['Sun', 'Moon', 'Ultra Sun', 'Ultra Moon'];

type Gen7MetadataEntry = {
  displayName: GameVersion;
  generation: 7;
  region: 'Alola';
  gameSet: Gen7GameSet;
  moduleId: Gen7GameSet;
  supportsStarterChoice: true;
  starterChoiceMode: 'type-only';
  status: 'skeleton';
};

export const gen7Metadata: Record<Gen7Game, Gen7MetadataEntry> = {
  Sun: {
    displayName: 'Sun',
    generation: 7,
    region: 'Alola',
    gameSet: 'sm',
    moduleId: 'sm',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'skeleton',
  },
  Moon: {
    displayName: 'Moon',
    generation: 7,
    region: 'Alola',
    gameSet: 'sm',
    moduleId: 'sm',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'skeleton',
  },
  'Ultra Sun': {
    displayName: 'Ultra Sun',
    generation: 7,
    region: 'Alola',
    gameSet: 'usum',
    moduleId: 'usum',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'skeleton',
  },
  'Ultra Moon': {
    displayName: 'Ultra Moon',
    generation: 7,
    region: 'Alola',
    gameSet: 'usum',
    moduleId: 'usum',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'skeleton',
  },
};

export function supportsGen7Data(gameVersion: GameVersion): gameVersion is Gen7Game {
  return (
    gameVersion === 'Sun' ||
    gameVersion === 'Moon' ||
    gameVersion === 'Ultra Sun' ||
    gameVersion === 'Ultra Moon'
  );
}

export function isSunMoon(gameVersion: GameVersion): gameVersion is 'Sun' | 'Moon' {
  return gameVersion === 'Sun' || gameVersion === 'Moon';
}

export function isUltraSunUltraMoon(gameVersion: GameVersion): gameVersion is 'Ultra Sun' | 'Ultra Moon' {
  return gameVersion === 'Ultra Sun' || gameVersion === 'Ultra Moon';
}
