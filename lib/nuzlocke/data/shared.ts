import type { GameVersion, PokemonType, StarterChoice, TrainerThreatMetadata } from '@/app/nuzlocke/types';

export type DataStatus = 'Skeleton' | 'Partial' | 'Working Complete' | 'Complete';

export interface BossPokemon {
  species: string;
  level: number;
  types?: PokemonType[];
  ability?: string;
  heldItem?: string;
  moves?: { name: string; type: PokemonType; power: number | null }[];
  notes?: string;
}

export interface GymLeader {
  id: string;
  name: string;
  city: string;
  badge: string;
  levelCap: number;
  team: BossPokemon[];
  notes: string[];
}

export interface RivalBattle {
  id: string;
  name: string;
  locationId: string;
  order: number;
  baseTeam: BossPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossPokemon[]>>;
  notes: string[];
}

export interface EliteFourMember {
  id: string;
  name: string;
  order: number;
  levelCap: number;
  team: BossPokemon[];
  notes: string[];
}

export interface RouteData {
  id: string;
  displayName: string;
  order: number;
  region: string;
  gameSet: string;
  tags: string[];
  notes?: string[];
}

export interface EncounterTable {
  locationId: string;
  encounters: BossPokemon[];
  notes: string[];
}

export interface StaticEncounter {
  id: string;
  locationId: string;
  species?: string;
  level?: number;
  types?: PokemonType[];
  notes: string[];
}

export interface LevelCap {
  id: string;
  label: string;
  cap: number;
  category: string;
}

export interface BossTrainer {
  id: string;
  name: string;
  category: string;
  game: GameVersion | 'Both';
  locationId: string;
  location: string;
  recommendedOrder: number;
  levelCap?: number;
  team: BossPokemon[];
  baseTeam?: BossPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossPokemon[]>>;
  threatMetadata?: TrainerThreatMetadata;
  notes: string[];
}

export interface GenerationMetadata {
  generation: number;
  region: string;
  gameSet: string;
  games: GameVersion[];
  supportsStarterChoice: boolean;
  starterChoiceMode: 'type-only';
  dataStatus: DataStatus;
}
