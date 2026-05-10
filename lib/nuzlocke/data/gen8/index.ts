import type { GameVersion, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { bdspEncounterAreas } from './bdsp-encounters';
import { bdspTrainers } from './bdsp-trainers';
import { legendsArceusBosses, legendsArceusEncounterAreas } from './legends-arceus';
import { swordShieldRouteEncounters } from './sword-shield-encounters';
import { swordShieldGyms } from './sword-shield-gyms';
import { swordShieldRivals } from './sword-shield-rivals';
import { swordShieldWildAreas } from './sword-shield-wildareas';
import { bossTrainerToRunBoss, type BossTrainer, type Gen8EncounterArea, type Gen8Game } from './types';

function isGen8Game(gameVersion: GameVersion): gameVersion is Gen8Game {
  return ['Sword', 'Shield', 'Brilliant Diamond', 'Shining Pearl', 'Legends: Arceus'].includes(gameVersion);
}

function forGame<T extends { game: Gen8Game | 'Both' }>(gameVersion: GameVersion, items: T[]) {
  if (!isGen8Game(gameVersion)) return [];
  return (Array.isArray(items) ? items : []).filter((item) => item.game === 'Both' || item.game === gameVersion);
}

function areasToMap(areas: Gen8EncounterArea[]) {
  return (Array.isArray(areas) ? areas : []).reduce<Record<string, EncounterOption[]>>((acc, area) => {
    if (!area?.location) return acc;
    acc[area.location] = Array.isArray(area.encounters) ? area.encounters : [];
    return acc;
  }, {});
}

function gameAreas(gameVersion: GameVersion): Gen8EncounterArea[] {
  if (gameVersion === 'Sword' || gameVersion === 'Shield') return [...swordShieldRouteEncounters, ...swordShieldWildAreas];
  if (gameVersion === 'Brilliant Diamond' || gameVersion === 'Shining Pearl') return bdspEncounterAreas;
  if (gameVersion === 'Legends: Arceus') return legendsArceusEncounterAreas;
  return [];
}

function gameBosses(gameVersion: GameVersion): BossTrainer[] {
  if (gameVersion === 'Sword' || gameVersion === 'Shield') return forGame(gameVersion, [...swordShieldRivals, ...swordShieldGyms]).sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  if (gameVersion === 'Brilliant Diamond' || gameVersion === 'Shining Pearl') return bdspTrainers;
  if (gameVersion === 'Legends: Arceus') return legendsArceusBosses.sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  return [];
}

export function supportsGen8Data(gameVersion: GameVersion) {
  return isGen8Game(gameVersion);
}

export function getGen8Locations(gameVersion: GameVersion) {
  return gameAreas(gameVersion).map((area) => area.location);
}

export function getGen8EncounterOptions(gameVersion: GameVersion) {
  return areasToMap(gameAreas(gameVersion));
}

export function getGen8Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null) {
  return gameBosses(gameVersion).map((boss) => bossTrainerToRunBoss(boss, starterChoice));
}

export function getGen8EncounterGroupsForTypeLookup() {
  return [
    areasToMap([...swordShieldRouteEncounters, ...swordShieldWildAreas]),
    areasToMap(bdspEncounterAreas),
    areasToMap(legendsArceusEncounterAreas),
  ];
}
