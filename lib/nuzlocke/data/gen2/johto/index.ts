import type { GameVersion, NuzlockeBoss, StarterChoice } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { gen2JohtoBosses } from './bosses';
import { gen2JohtoEncounterAreas } from './encounters';
import { gen2JohtoLevelCaps } from './levelCaps';
import { gen2JohtoLocations } from './routes';
import { gen2JohtoMetadata, supportsGen2Data } from './metadata';

export { gen2JohtoBosses } from './bosses';
export { gen2JohtoEncounterAreas } from './encounters';
export { gen2JohtoLevelCaps } from './levelCaps';
export { gen2JohtoLocations } from './routes';
export { gen2JohtoMetadata, supportsGen2Data } from './metadata';

const starterLocation = 'Starter Pokémon';

const gen2StarterOptions: EncounterOption[] = [
  { species: 'Chikorita', types: ['Grass'], method: 'gift', version: 'Both', rate: 100, minLevel: 5, maxLevel: 5 },
  { species: 'Cyndaquil', types: ['Fire'], method: 'gift', version: 'Both', rate: 100, minLevel: 5, maxLevel: 5 },
  { species: 'Totodile', types: ['Water'], method: 'gift', version: 'Both', rate: 100, minLevel: 5, maxLevel: 5 },
];

const capByBossName = new Map(gen2JohtoLevelCaps.map((cap) => [cap.label.toLowerCase(), cap.cap]));

export function getGen2Locations(gameVersion: GameVersion) {
  if (!supportsGen2Data(gameVersion)) return [];
  return [starterLocation, ...gen2JohtoLocations.map((location) => location.displayName)];
}

function optionMatchesVersion(option: EncounterOption, gameVersion: GameVersion) {
  return !option.version || option.version === 'Both' || option.version === gameVersion;
}

function normalizeEncounterOption(option: EncounterOption): EncounterOption {
  return {
    ...option,
    fishingMethod: option.fishingMethod || option.method === 'fishing' || undefined,
    surfMethod: option.surfMethod || option.method === 'surfing' || undefined,
  };
}

function uniqueEncounterOptions(options: EncounterOption[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = [option.species, option.method ?? '', option.condition ?? ''].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getGen2EncounterOptions(gameVersion: GameVersion) {
  if (!supportsGen2Data(gameVersion)) return {};
  const encountersByLocation = gen2JohtoEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    acc[area.displayName] = uniqueEncounterOptions(area.encounters.filter((option) => optionMatchesVersion(option, gameVersion)).map(normalizeEncounterOption));
    return acc;
  }, { [starterLocation]: gen2StarterOptions });

  return gen2JohtoLocations.reduce<Record<string, EncounterOption[]>>((acc, location) => {
    acc[location.displayName] = encountersByLocation[location.displayName] ?? [];
    return acc;
  }, encountersByLocation);
}

function resolveGen2BossTeam(boss: (typeof gen2JohtoBosses)[number], starterChoice?: StarterChoice | null) {
  const baseTeam = Array.isArray(boss.baseTeam) ? boss.baseTeam : [];
  const variantTeam = starterChoice && boss.variantsByRivalStarterChoice
    ? boss.variantsByRivalStarterChoice[starterChoice]
    : null;

  if (Array.isArray(variantTeam) && variantTeam.length > 0) return [...baseTeam, ...variantTeam];
  return baseTeam;
}

export function getGen2Bosses(gameVersion: GameVersion, starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  if (!supportsGen2Data(gameVersion)) return [];
  return gen2JohtoBosses.map((boss) => {
    const team = resolveGen2BossTeam(boss, starterChoice);
    const needsStarterChoice = Boolean(boss.variantsByRivalStarterChoice) && !starterChoice;
    const notes = [
      boss.location,
      ...(Array.isArray(boss.notes) ? boss.notes : []),
      needsStarterChoice ? 'Choose your starter type to sync rival battles.' : '',
    ].filter(Boolean).join(' ');

    return {
      id: boss.id,
      name: boss.name,
      category: boss.category,
      levelCap: boss.levelCap ?? capByBossName.get(boss.name.toLowerCase()) ?? null,
      completed: false,
      notes,
      deaths: 0,
      pokemon: team.map((pokemon) => ({
        species: pokemon.species,
        level: pokemon.level,
        types: pokemon.types,
        ability: '',
        item: '',
        nature: '',
        moves: pokemon.moves,
      })),
    };
  });
}

export function getGen2EncounterGroupsForTypeLookup() {
  return [getGen2EncounterOptions('Gold'), getGen2EncounterOptions('Silver'), getGen2EncounterOptions('Crystal')];
}

export function getGen2Metadata(gameVersion: GameVersion) {
  return supportsGen2Data(gameVersion) ? gen2JohtoMetadata : null;
}
