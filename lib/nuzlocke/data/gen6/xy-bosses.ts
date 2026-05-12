import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

type XyMove = NonNullable<BossTrainerPokemon['moves']>[number];
type XyCategory = 'rival' | 'gym' | 'boss' | 'evil-team' | 'elite-four' | 'champion';

const mv = (name: string, type: XyMove['type'], power: number | null = null): XyMove => ({ name, type, power });
const mon = (
  species: string,
  level: number,
  types: BossTrainerPokemon['types'],
  extras: Partial<BossTrainerPokemon> = {},
): BossTrainerPokemon => ({ species, level, types, ...extras });

const boss = ({
  id,
  name,
  location,
  order,
  category,
  levelCap,
  team,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: XyCategory;
  levelCap: number;
  team: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: BossTrainer['variantsByRivalStarterChoice'];
  notes?: string;
}): BossTrainer => ({
  id,
  name,
  category,
  game: 'Both',
  location,
  recommendedOrder: order,
  levelCap,
  notes: notes ?? location,
  baseTeam: Array.isArray(team) ? team : [],
  ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
});

// Player's starter type maps to which starter the rival owns.
// Shauna picks the starter WEAK to the player.
//   player grass (Chespin) -> Shauna Froakie (water)
//   player fire (Fennekin) -> Shauna Chespin (grass)
//   player water (Froakie) -> Shauna Fennekin (fire)
const shaunaStarterVariants = (
  froakie: BossTrainerPokemon[],
  chespin: BossTrainerPokemon[],
  fennekin: BossTrainerPokemon[],
): BossTrainer['variantsByRivalStarterChoice'] => ({
  grass: froakie,
  fire: chespin,
  water: fennekin,
});

// NOTE: When the Calem/Serena rival battles are populated later, the rival picks the starter
// STRONG against the player: grass -> Fennekin, fire -> Froakie, water -> Chespin.
// (Mirror shaunaStarterVariants with the appropriate args.)

export const xyBosses: BossTrainer[] = [
  boss({
    id: 'xy-shauna-aquacorde',
    name: 'Shauna',
    location: 'Aquacorde Town',
    order: 1,
    category: 'rival',
    levelCap: 5,
    team: [],
    variantsByRivalStarterChoice: shaunaStarterVariants(
      [mon('Froakie', 5, ['Water'], { ability: 'Torrent', moves: [mv('Pound', 'Normal', 40), mv('Growl', 'Normal')] })],
      [mon('Chespin', 5, ['Grass'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Growl', 'Normal')] })],
      [mon('Fennekin', 5, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Tail Whip', 'Normal')] })],
    ),
    notes: 'First battle in Aquacorde Town immediately after picking your starter. Shauna picks the starter weak to yours. TODO: verify move slots beyond starting two.',
  }),
  boss({
    id: 'xy-viola',
    name: 'Viola',
    location: 'Santalune City',
    order: 2,
    category: 'gym',
    levelCap: 12,
    team: [
      mon('Surskit', 10, ['Bug', 'Water']),
      mon('Vivillon', 12, ['Bug', 'Flying']),
    ],
    notes: 'Santalune Gym Leader (Bug-type). Awards the Bug Badge. TODO: verify Viola team moves and abilities for X/Y cartridge.',
  }),
];

// TODO: Populate the first Calem/Serena rival battle when later XY data is filled in.
// Per canonical X/Y, this fight happens on Route 4 (Parterre Way) AFTER defeating Viola,
// so it is intentionally not included in the pre-Gym 1 boss list.
