export type GameVersion =
  | 'Red'
  | 'Blue'
  | 'Yellow'
  | 'Gold'
  | 'Silver'
  | 'Crystal'
  | 'Ruby'
  | 'Sapphire'
  | 'Emerald'
  | 'FireRed'
  | 'LeafGreen'
  | 'Diamond'
  | 'Pearl'
  | 'Platinum'
  | 'HeartGold'
  | 'SoulSilver'
  | 'Black'
  | 'White'
  | 'Black 2'
  | 'White 2'
  | 'X'
  | 'Y'
  | 'Omega Ruby'
  | 'Alpha Sapphire'
  | 'Sun'
  | 'Moon'
  | 'Ultra Sun'
  | 'Ultra Moon'
  | 'Sword'
  | 'Shield'
  | 'Brilliant Diamond'
  | 'Shining Pearl'
  | 'Legends: Arceus'
  | 'Scarlet'
  | 'Violet';

export type RunType =
  | 'Standard Nuzlocke'
  | 'Hardcore Nuzlocke'
  | 'Monotype'
  | 'Randomizer'
  | 'Soul Link'
  | 'Egglocke'
  | 'Custom Rules';

export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';

export type PokemonStatus = 'Party' | 'Boxed' | 'Dead' | 'Released';
export type EncounterStatus = 'Caught' | 'Failed' | 'Skipped' | 'Dead';

export type NuzlockeRules = {
  dupesClause: boolean;
  shinyClause: boolean;
  levelCaps: boolean;
  setMode: boolean;
  noItemsInBattle: boolean;
  starterCountsAsFirstEncounter: boolean;
  giftPokemonAllowed: boolean;
  staticEncountersAllowed: boolean;
  teraRaidEncountersAllowed: boolean;
  monotype?: PokemonType;
};

export type NuzlockePokemon = {
  id: string;
  encounterId?: string;
  metLocation?: string;
  species: string;
  nickname: string;
  level: number;
  types: PokemonType[];
  nature: string;
  ability: string;
  heldItem: string;
  status: PokemonStatus;
  notes: string;
  levelDied?: number;
  causeOfDeath?: string;
  deathLocation?: string;
};

export type NuzlockeEncounter = {
  id: string;
  location: string;
  pokemon: string;
  nickname: string;
  levelMet: number;
  status: EncounterStatus;
  types: PokemonType[];
  nature: string;
  ability: string;
  notes: string;
};

export type NuzlockeBoss = {
  id: string;
  name: string;
  category: string;
  levelCap: number;
  completed: boolean;
  notes: string;
  deaths: number;
  pokemon?: NuzlockeBossPokemon[];
};

export type NuzlockeBossPrep = {
  bossId: string;
  leadPokemonId?: string;
  plannedTeamIds: string[];
  heldItems: Record<string, string>;
  movePrepNotes: string;
  battlePlanNotes: string;
  postFightNotes: string;
  completed: boolean;
};

export type NuzlockeBossPokemon = {
  species: string;
  level: number;
  nature: string;
  ability: string;
  item: string;
  types?: PokemonType[];
  teraType?: PokemonType;
  notes?: string;
  moves?: NuzlockeMove[];
};

export type NuzlockeMove = {
  name: string;
  type: PokemonType;
  power: number | null;
};

export type NuzlockeTimelineEvent = {
  id: string;
  createdAt: string;
  type: string;
  message: string;
};

export type NuzlockeRun = {
  id: string;
  runName: string;
  gameVersion: GameVersion;
  runType: RunType;
  rules: NuzlockeRules;
  team: NuzlockePokemon[];
  encounters: NuzlockeEncounter[];
  bosses: NuzlockeBoss[];
  bossPrep: NuzlockeBossPrep[];
  timeline: NuzlockeTimelineEvent[];
  createdAt: string;
  updatedAt: string;
};
