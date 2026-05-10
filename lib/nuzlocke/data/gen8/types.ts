import type { NuzlockeBoss, PokemonType, StarterChoice, TrainerThreatMetadata } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';
import { getRivalStarterChoice } from '@/lib/nuzlocke/starter';

export type Gen8Game = 'Sword' | 'Shield' | 'Brilliant Diamond' | 'Shining Pearl' | 'Legends: Arceus';

export interface BossTrainer {
  id: string;
  name: string;
  category: string;
  game: Gen8Game | 'Both';
  location: string;
  recommendedOrder: number;
  levelCap?: number;
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

  return {
    id: trainer.id,
    name: trainer.name,
    category: trainer.category,
    levelCap: trainer.levelCap ?? Math.max(...safeTeam.map((pokemon) => pokemon.level), 1),
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
