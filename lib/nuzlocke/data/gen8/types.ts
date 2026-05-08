import type { NuzlockeBoss, PokemonType } from '@/app/nuzlocke/types';
import type { EncounterOption } from '@/app/nuzlocke/data';

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
  team: {
    species: string;
    level: number;
    types?: PokemonType[];
    ability?: string;
    item?: string;
    nature?: string;
    moves?: { name: string; type: PokemonType; power: number | null }[];
    teraType?: PokemonType;
    notes?: string;
  }[];
}

export interface Gen8EncounterArea {
  location: string;
  notes?: string;
  encounters: EncounterOption[];
}

export function bossTrainerToRunBoss(trainer: BossTrainer): NuzlockeBoss {
  return {
    id: trainer.id,
    name: trainer.name,
    category: trainer.category,
    levelCap: trainer.levelCap ?? Math.max(...trainer.team.map((pokemon) => pokemon.level), 1),
    completed: false,
    notes: trainer.notes || trainer.location,
    deaths: 0,
    pokemon: trainer.team.map((pokemon) => ({
      species: pokemon.species,
      level: pokemon.level,
      types: pokemon.types,
      ability: pokemon.ability || '',
      item: pokemon.item || '',
      nature: pokemon.nature || '',
      moves: pokemon.moves,
      teraType: pokemon.teraType,
      notes: pokemon.notes,
    })),
  };
}
