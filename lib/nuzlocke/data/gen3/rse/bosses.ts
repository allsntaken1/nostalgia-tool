import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';
import type { GameVersion, StarterChoice } from '@/app/nuzlocke/types';

type RseBossCategory = 'rival' | 'gym' | 'evil-team' | 'elite-four' | 'champion' | 'boss';

const mon = (species: string, level: number, types: BossTrainerPokemon['types'], extras: Partial<BossTrainerPokemon> = {}): BossTrainerPokemon => ({ species, level, types, ...extras });

function boss({
  id,
  name,
  category,
  game = 'Both',
  location,
  order,
  levelCap,
  baseTeam,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  category: RseBossCategory;
  game?: GameVersion | 'Both';
  location: string;
  order: number;
  levelCap?: number | null;
  baseTeam?: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossTrainerPokemon[]>>;
  notes?: string;
}): BossTrainer {
  const team = baseTeam ?? [];
  return {
    id,
    name,
    category,
    game,
    location,
    recommendedOrder: order,
    levelCap: levelCap ?? (team.length > 0 ? null : null),
    notes: notes ?? `Hoenn ${category} at ${location}. Full team data coming later.`,
    baseTeam: team,
    ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
  };
}

// ===========================================================================================
// Rival starter cycle (Brendan/May) — RSE rival uses the starter STRONG against player's pick:
//   player Treecko (Grass) → rival Torchic line (Fire)
//   player Torchic (Fire)  → rival Mudkip line (Water)
//   player Mudkip (Water)  → rival Treecko line (Grass)
// ===========================================================================================

export const rseBosses: BossTrainer[] = [
  // ---- POPULATED: First rival battle on Route 103 ----
  boss({
    id: 'rival-route-103-rse',
    name: 'Rival 1 (Route 103)',
    category: 'rival',
    location: 'Route 103',
    order: 1,
    levelCap: 5,
    baseTeam: [],
    variantsByRivalStarterChoice: {
      grass: [mon('Torchic', 5, ['Fire'])],
      fire: [mon('Mudkip', 5, ['Water'])],
      water: [mon('Treecko', 5, ['Grass'])],
    },
    notes: 'First rival battle (Brendan in Ruby/Emerald, May in Sapphire, or the opposite if player is male/female). Rival uses the starter strong vs yours.',
  }),

  // ---- POPULATED: Aqua/Magma Grunt at Rusturf Tunnel (Devon Goods theft) ----
  boss({
    id: 'aqua-magma-grunt-rusturf-r',
    name: 'Team Magma Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Ruby',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Ruby variant: Magma Grunt steals the Devon Goods. Defeat triggers Mr. Briney introduction.',
  }),
  boss({
    id: 'aqua-magma-grunt-rusturf-s',
    name: 'Team Aqua Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Sapphire',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Sapphire variant: Aqua Grunt steals the Devon Goods.',
  }),
  boss({
    id: 'aqua-magma-grunt-rusturf-e',
    name: 'Team Aqua Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Emerald',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Emerald variant: Aqua Grunt steals the Devon Goods (Aqua plot in Emerald early game).',
  }),

  // ---- POPULATED: Roxanne (Rustboro Gym — Rock) — RSE first-battle team identical across versions ----
  boss({
    id: 'roxanne-gym',
    name: 'Roxanne',
    category: 'gym',
    location: 'Rustboro Gym',
    order: 6,
    levelCap: 15,
    baseTeam: [
      mon('Geodude', 12, ['Rock', 'Ground']),
      mon('Geodude', 12, ['Rock', 'Ground']),
      mon('Nosepass', 15, ['Rock']),
    ],
    notes: 'Stone Badge. Ace Nosepass at Lv 15. Movesets TODO. Emerald rematches add evolved forms — not modeled here.',
  }),

  // ---- SKELETONS: remaining Hoenn gym/E4/champion gauntlet. levelCap null so the UI renders TBD ----
  boss({ id: 'brawly-gym', name: 'Brawly', category: 'gym', location: 'Dewford Gym', order: 11, levelCap: null, baseTeam: [], notes: 'Knuckle Badge (Fighting). TODO: populate team.' }),
  boss({ id: 'wattson-gym', name: 'Wattson', category: 'gym', location: 'Mauville Gym', order: 16, levelCap: null, baseTeam: [], notes: 'Dynamo Badge (Electric). TODO: populate team — Voltorb/Electrike/Magneton/Manectric (Emerald), different lineup in RS.' }),
  boss({ id: 'flannery-gym', name: 'Flannery', category: 'gym', location: 'Lavaridge Gym', order: 21, levelCap: null, baseTeam: [], notes: 'Heat Badge (Fire). TODO: populate team.' }),
  boss({ id: 'norman-gym', name: 'Norman', category: 'gym', location: 'Petalburg Gym', order: 26, levelCap: null, baseTeam: [], notes: 'Balance Badge (Normal). Father gym leader; Slaking ace. TODO: populate team.' }),
  boss({ id: 'winona-gym', name: 'Winona', category: 'gym', location: 'Fortree Gym', order: 31, levelCap: null, baseTeam: [], notes: 'Feather Badge (Flying). Altaria ace. TODO: populate team.' }),
  boss({ id: 'tate-liza-gym', name: 'Tate & Liza', category: 'gym', location: 'Mossdeep Gym', order: 36, levelCap: null, baseTeam: [], notes: 'Mind Badge (Psychic). Double battle — Solrock/Lunatone in RS, expanded team in Emerald. TODO: populate.' }),
  boss({
    id: 'juan-gym',
    name: 'Juan',
    category: 'gym',
    game: 'Emerald',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: null,
    baseTeam: [],
    notes: 'Rain Badge (Water). Emerald-only — replaces Wallace as the 8th gym leader. TODO: populate team.',
  }),
  boss({
    id: 'wallace-gym',
    name: 'Wallace',
    category: 'gym',
    game: 'Ruby',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: null,
    baseTeam: [],
    notes: 'Rain Badge (Water). Ruby/Sapphire 8th gym leader (becomes Emerald Champion instead). TODO: populate team.',
  }),
  boss({
    id: 'wallace-gym-s',
    name: 'Wallace',
    category: 'gym',
    game: 'Sapphire',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: null,
    baseTeam: [],
    notes: 'Rain Badge (Water). Ruby/Sapphire 8th gym leader. TODO: populate team.',
  }),

  // Elite Four — same lineup of opponents in all three games, but Emerald rebalances teams.
  boss({ id: 'sidney-e4', name: 'Sidney', category: 'elite-four', location: 'Pokémon League', order: 50, levelCap: null, baseTeam: [], notes: 'Dark specialist. Mightyena ace. TODO: populate Ruby/Sapphire and Emerald teams.' }),
  boss({ id: 'phoebe-e4', name: 'Phoebe', category: 'elite-four', location: 'Pokémon League', order: 51, levelCap: null, baseTeam: [], notes: 'Ghost specialist. Dusclops + Banettes. TODO: populate Ruby/Sapphire and Emerald teams.' }),
  boss({ id: 'glacia-e4', name: 'Glacia', category: 'elite-four', location: 'Pokémon League', order: 52, levelCap: null, baseTeam: [], notes: 'Ice specialist. Walrein ace. TODO: populate Ruby/Sapphire and Emerald teams.' }),
  boss({ id: 'drake-e4', name: 'Drake', category: 'elite-four', location: 'Pokémon League', order: 53, levelCap: null, baseTeam: [], notes: 'Dragon specialist. Salamence ace. TODO: populate Ruby/Sapphire and Emerald teams.' }),

  // Champion — version split.
  boss({
    id: 'champion-steven-r',
    name: 'Champion Steven',
    category: 'champion',
    game: 'Ruby',
    location: 'Pokémon League',
    order: 54,
    levelCap: null,
    baseTeam: [],
    notes: 'Ruby Champion. Metagross ace. TODO: populate canonical Steven team.',
  }),
  boss({
    id: 'champion-steven-s',
    name: 'Champion Steven',
    category: 'champion',
    game: 'Sapphire',
    location: 'Pokémon League',
    order: 54,
    levelCap: null,
    baseTeam: [],
    notes: 'Sapphire Champion. Metagross ace. TODO: populate canonical Steven team.',
  }),
  boss({
    id: 'champion-wallace-e',
    name: 'Champion Wallace',
    category: 'champion',
    game: 'Emerald',
    location: 'Pokémon League',
    order: 54,
    levelCap: null,
    baseTeam: [],
    notes: 'Emerald Champion (replaces Steven, who moves to Meteor Falls postgame). Milotic ace. TODO: populate team.',
  }),
  boss({
    id: 'postgame-steven-meteor-falls-e',
    name: 'Steven (Meteor Falls)',
    category: 'boss',
    game: 'Emerald',
    location: 'Meteor Falls',
    order: 99,
    levelCap: null,
    baseTeam: [],
    notes: 'Emerald postgame multi-battle vs Steven in Meteor Falls. TODO: populate canonical team.',
  }),
];

export function getRseBossesForGame(gameVersion: GameVersion): BossTrainer[] {
  return rseBosses.filter((b) => b.game === 'Both' || b.game === gameVersion);
}
