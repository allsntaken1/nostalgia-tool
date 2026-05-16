import type { GameVersion } from '@/app/nuzlocke/types';

export type OrasGameId = 'omega-ruby' | 'alpha-sapphire';
export type OrasGameSet = 'oras';

export const orasGames: GameVersion[] = ['Omega Ruby', 'Alpha Sapphire'];

export const orasMetadata: Record<'Omega Ruby' | 'Alpha Sapphire', {
  displayName: GameVersion;
  id: OrasGameId;
  generation: 6;
  region: 'Hoenn';
  gameSet: OrasGameSet;
  moduleId: OrasGameSet;
  supportsStarterChoice: true;
  starterChoiceMode: 'type-only';
  status: 'partial';
}> = {
  'Omega Ruby': {
    displayName: 'Omega Ruby',
    id: 'omega-ruby',
    generation: 6,
    region: 'Hoenn',
    gameSet: 'oras',
    moduleId: 'oras',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'partial',
  },
  'Alpha Sapphire': {
    displayName: 'Alpha Sapphire',
    id: 'alpha-sapphire',
    generation: 6,
    region: 'Hoenn',
    gameSet: 'oras',
    moduleId: 'oras',
    supportsStarterChoice: true,
    starterChoiceMode: 'type-only',
    status: 'partial',
  },
};

export function supportsOrasData(gameVersion: GameVersion): gameVersion is 'Omega Ruby' | 'Alpha Sapphire' {
  return gameVersion === 'Omega Ruby' || gameVersion === 'Alpha Sapphire';
}
