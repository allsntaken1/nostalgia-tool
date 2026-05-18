import type { GameVersion, NuzlockeBoss, PokemonType, StarterChoice, TrainerThreatMetadata } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { getRivalStarterChoice } from '@/lib/nuzlocke/starter';

export type Gen8Game = 'Sword' | 'Shield' | 'Brilliant Diamond' | 'Shining Pearl';

export interface BossTrainer {
  id: string;
  name: string;
  category: string;
  game: GameVersion | 'Both';
  location: string;
  recommendedOrder: number;
  /**
   * Numeric level cap. Pass `null` (or omit) to mark the boss as a skeleton entry with no
   * known cap — the converter forwards `null` into the run model and the UI renders it as
   * "TBD" rather than fabricating a number. Numeric values pass through unchanged.
   */
  levelCap?: number | null;
  notes?: string;
  badge?: string;
  city?: string;
  progressionStage?: string;
  threatMetadata?: TrainerThreatMetadata;
  team?: BossTrainerPokemon[];
  baseTeam?: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossTrainerPokemon[]>>;
}

export type BossTrainerPokemon = {
  species: string;
  level: number;
  types?: PokemonType[];
  ability?: string;
  item?: string;
  nature?: string;
  moves?: { name: string; type: PokemonType; power: number | null }[];
  teraType?: PokemonType;
  notes?: string;
};

export interface Gen8EncounterArea {
  location: string;
  notes?: string;
  encounters: EncounterOption[];
}

function resolveTrainerTeam(trainer: BossTrainer, playerStarterChoice?: StarterChoice | null) {
  const legacyTeam = Array.isArray(trainer.team) ? trainer.team : [];
  const baseTeam = Array.isArray(trainer.baseTeam) ? trainer.baseTeam : legacyTeam;
  const rivalStarterChoice = getRivalStarterChoice(playerStarterChoice);
  const variantTeam = rivalStarterChoice && trainer.variantsByRivalStarterChoice
    ? trainer.variantsByRivalStarterChoice[rivalStarterChoice]
    : null;

  if (Array.isArray(variantTeam) && variantTeam.length > 0) {
    return [...baseTeam, ...variantTeam];
  }

  return baseTeam;
}

export function bossTrainerToRunBoss(trainer: BossTrainer, playerStarterChoice?: StarterChoice | null): NuzlockeBoss {
  const team = resolveTrainerTeam(trainer, playerStarterChoice);
  const needsStarterChoice = Boolean(trainer.variantsByRivalStarterChoice) && !getRivalStarterChoice(playerStarterChoice);
  const warning = needsStarterChoice ? 'Choose your starter type to sync rival battles.' : '';
  const notes = [trainer.notes || trainer.location, warning].filter(Boolean).join(' ');
  const safeTeam = Array.isArray(team) ? team : [];

  // Level cap resolution:
  //   1. Explicit numeric `trainer.levelCap` wins.
  //   2. Explicit `null` (skeleton intent) stays null.
  //   3. Undefined + non-empty team => derive from highest Pokémon level.
  //   4. Undefined + empty team => null (don't fabricate a fake level cap of 1).
  let resolvedLevelCap: number | null;
  if (typeof trainer.levelCap === 'number') {
    resolvedLevelCap = trainer.levelCap;
  } else if (trainer.levelCap === null) {
    resolvedLevelCap = null;
  } else if (safeTeam.length > 0) {
    resolvedLevelCap = Math.max(...safeTeam.map((pokemon) => pokemon.level), 1);
  } else {
    resolvedLevelCap = null;
  }

  return {
    id: trainer.id,
    name: trainer.name,
    category: trainer.category,
    levelCap: resolvedLevelCap,
    completed: false,
    notes,
    deaths: 0,
    pokemon: safeTeam.map((pokemon) => ({
      species: pokemon.species,
      level: pokemon.level,
      types: Array.isArray(pokemon.types) ? pokemon.types : undefined,
      ability: pokemon.ability || '',
      item: pokemon.item || '',
      nature: pokemon.nature || '',
      moves: pokemon.moves,
      teraType: pokemon.teraType,
      notes: pokemon.notes,
    })),
    threatMetadata: trainer.threatMetadata,
  };
}
