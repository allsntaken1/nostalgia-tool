import type { StarterChoice } from '@/app/nuzlocke/types';
import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

/**
 * Diamond / Pearl / Platinum bosses (DPP Pass 1).
 *
 * Covers: Barry Route 203, Roark (Oreburgh Gym), Mars (Valley Windworks), Gardenia (Eterna Gym).
 *
 * Diamond and Pearl share boss teams exactly for the gyms verified in this pass; Platinum
 * occasionally diverges (Gardenia swaps Cherubi → Cherrim and a single move). Where Platinum
 * differs, a second `boss({...game: 'Platinum'})` entry is added.
 */

type DppMove = NonNullable<BossTrainerPokemon['moves']>[number];
type DppBossCategory = 'rival' | 'gym' | 'evil-team' | 'boss' | 'elite-four' | 'champion';

const mv = (name: string, type: DppMove['type'], power: number | null = null): DppMove => ({ name, type, power });
const mon = (
  species: string,
  level: number,
  types: BossTrainerPokemon['types'],
  extras: Partial<BossTrainerPokemon> = {},
): BossTrainerPokemon => ({ species, level, types, ...extras });

const boss = (params: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: DppBossCategory;
  levelCap: number;
  team?: BossTrainerPokemon[];
  baseTeam?: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossTrainerPokemon[]>>;
  notes?: string;
  game?: BossTrainer['game'];
}): BossTrainer => ({
  id: params.id,
  name: params.name,
  category: params.category,
  game: params.game ?? 'Both',
  location: params.location,
  recommendedOrder: params.order,
  levelCap: params.levelCap,
  notes: params.notes ?? params.location,
  baseTeam: Array.isArray(params.baseTeam) ? params.baseTeam : Array.isArray(params.team) ? params.team : [],
  ...(params.variantsByRivalStarterChoice ? { variantsByRivalStarterChoice: params.variantsByRivalStarterChoice } : {}),
});

// Barry picks the starter STRONG against the player's choice (canonical Sinnoh rival rule):
//   player Turtwig (Grass) → Barry Chimchar (Fire)
//   player Chimchar (Fire) → Barry Piplup   (Water)
//   player Piplup  (Water) → Barry Turtwig  (Grass)
const barryRoute203Variants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Chimchar', 9, ['Fire'], { ability: 'Blaze' })],
  fire: [mon('Piplup', 9, ['Water'], { ability: 'Torrent' })],
  water: [mon('Turtwig', 9, ['Grass'], { ability: 'Overgrow' })],
};

const dppBosses: BossTrainer[] = [
  boss({
    id: 'dpp-rival-barry-route-203',
    name: 'Barry (Route 203)',
    location: 'Route 203',
    order: 7,
    category: 'rival',
    levelCap: 9,
    baseTeam: [
      mon('Starly', 7, ['Normal', 'Flying'], { ability: 'Keen Eye' }),
    ],
    variantsByRivalStarterChoice: barryRoute203Variants,
    notes: "Barry's Route 203 battle. Starly (Lv 7) + rival starter strong against the player (Lv 9). Per-Pokémon move data not surfaced — TODO.",
  }),

  // Roark — identical across Diamond, Pearl, AND Platinum per Bulbapedia.
  boss({
    id: 'dpp-gym-roark',
    name: 'Gym Leader Roark',
    location: 'Oreburgh City Gym',
    order: 10,
    category: 'gym',
    levelCap: 14,
    team: [
      mon('Geodude', 12, ['Rock', 'Ground'], {
        ability: 'Rock Head',
        moves: [mv('Rock Throw', 'Rock', 50), mv('Stealth Rock', 'Rock')],
      }),
      mon('Onix', 12, ['Rock', 'Ground'], {
        ability: 'Rock Head',
        moves: [mv('Rock Throw', 'Rock', 50), mv('Screech', 'Normal'), mv('Stealth Rock', 'Rock')],
      }),
      mon('Cranidos', 14, ['Rock'], {
        ability: 'Mold Breaker',
        moves: [mv('Headbutt', 'Normal', 70), mv('Pursuit', 'Dark', 40), mv('Leer', 'Normal')],
      }),
    ],
    notes: 'Oreburgh Gym (Coal Badge). Teams identical across Diamond, Pearl, and Platinum.',
  }),

  // Mars at Valley Windworks — DP team is Lv 14/16; Platinum is Lv 15/17.
  boss({
    id: 'dpp-galactic-mars-valley-windworks',
    name: 'Commander Mars (Valley Windworks)',
    location: 'Valley Windworks',
    order: 15,
    category: 'evil-team',
    levelCap: 16,
    game: 'Diamond',
    team: [
      mon('Zubat', 14, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Purugly', 16, ['Normal'], { ability: 'Thick Fat', item: 'Oran Berry' }),
    ],
    notes: 'Diamond Valley Windworks Galactic raid. Per-Pokémon move data not surfaced — TODO.',
  }),
  boss({
    id: 'dpp-galactic-mars-valley-windworks-pearl',
    name: 'Commander Mars (Valley Windworks)',
    location: 'Valley Windworks',
    order: 15,
    category: 'evil-team',
    levelCap: 16,
    game: 'Pearl',
    team: [
      mon('Zubat', 14, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Purugly', 16, ['Normal'], { ability: 'Thick Fat', item: 'Oran Berry' }),
    ],
    notes: 'Pearl Valley Windworks Galactic raid. Per-Pokémon move data not surfaced — TODO.',
  }),
  boss({
    id: 'dpp-galactic-mars-valley-windworks-pt',
    name: 'Commander Mars (Valley Windworks)',
    location: 'Valley Windworks',
    order: 15,
    category: 'evil-team',
    levelCap: 17,
    game: 'Platinum',
    team: [
      mon('Zubat', 15, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Purugly', 17, ['Normal'], { ability: 'Thick Fat', item: 'Oran Berry' }),
    ],
    notes: 'Platinum Valley Windworks Galactic raid. Levels +1 vs DP.',
  }),

  // Gardenia — Diamond/Pearl: Cherubi/Turtwig/Roserade (Lv 19/19/22). Platinum: Cherrim/Turtwig/Roserade (Lv 20/20/22).
  boss({
    id: 'dpp-gym-gardenia',
    name: 'Gym Leader Gardenia',
    location: 'Eterna City Gym',
    order: 22,
    category: 'gym',
    levelCap: 22,
    game: 'Diamond',
    team: [
      mon('Cherubi', 19, ['Grass'], {
        ability: 'Chlorophyll',
        moves: [mv('Grass Knot', 'Grass'), mv('Leech Seed', 'Grass'), mv('Safeguard', 'Normal'), mv('Growth', 'Normal')],
      }),
      mon('Turtwig', 19, ['Grass'], {
        ability: 'Overgrow',
        moves: [mv('Grass Knot', 'Grass'), mv('Razor Leaf', 'Grass', 55), mv('Withdraw', 'Water'), mv('Reflect', 'Psychic')],
      }),
      mon('Roserade', 22, ['Grass', 'Poison'], {
        ability: 'Natural Cure',
        item: 'Sitrus Berry',
        moves: [mv('Grass Knot', 'Grass'), mv('Magical Leaf', 'Grass', 60), mv('Poison Sting', 'Poison', 15), mv('Stun Spore', 'Grass')],
      }),
    ],
    notes: 'Diamond Eterna Gym (Forest Badge).',
  }),
  boss({
    id: 'dpp-gym-gardenia-pearl',
    name: 'Gym Leader Gardenia',
    location: 'Eterna City Gym',
    order: 22,
    category: 'gym',
    levelCap: 22,
    game: 'Pearl',
    team: [
      mon('Cherubi', 19, ['Grass'], {
        ability: 'Chlorophyll',
        moves: [mv('Grass Knot', 'Grass'), mv('Leech Seed', 'Grass'), mv('Safeguard', 'Normal'), mv('Growth', 'Normal')],
      }),
      mon('Turtwig', 19, ['Grass'], {
        ability: 'Overgrow',
        moves: [mv('Grass Knot', 'Grass'), mv('Razor Leaf', 'Grass', 55), mv('Withdraw', 'Water'), mv('Reflect', 'Psychic')],
      }),
      mon('Roserade', 22, ['Grass', 'Poison'], {
        ability: 'Natural Cure',
        item: 'Sitrus Berry',
        moves: [mv('Grass Knot', 'Grass'), mv('Magical Leaf', 'Grass', 60), mv('Poison Sting', 'Poison', 15), mv('Stun Spore', 'Grass')],
      }),
    ],
    notes: 'Pearl Eterna Gym (Forest Badge). Same team as Diamond.',
  }),
  boss({
    id: 'dpp-gym-gardenia-pt',
    name: 'Gym Leader Gardenia',
    location: 'Eterna City Gym',
    order: 22,
    category: 'gym',
    levelCap: 22,
    game: 'Platinum',
    team: [
      mon('Turtwig', 20, ['Grass'], {
        ability: 'Overgrow',
        moves: [mv('Grass Knot', 'Grass'), mv('Razor Leaf', 'Grass', 55), mv('Sunny Day', 'Fire'), mv('Reflect', 'Psychic')],
      }),
      mon('Cherrim', 20, ['Grass'], {
        ability: 'Flower Gift',
        moves: [mv('Grass Knot', 'Grass'), mv('Magical Leaf', 'Grass', 60), mv('Leech Seed', 'Grass'), mv('Safeguard', 'Normal')],
      }),
      mon('Roserade', 22, ['Grass', 'Poison'], {
        ability: 'Natural Cure',
        item: 'Sitrus Berry',
        moves: [mv('Grass Knot', 'Grass'), mv('Magical Leaf', 'Grass', 60), mv('Poison Sting', 'Poison', 15), mv('Stun Spore', 'Grass')],
      }),
    ],
    notes: 'Platinum Eterna Gym. Cherubi → Cherrim; Turtwig swaps Withdraw → Sunny Day; levels +1 on first two slots.',
  }),
];

export function getDppBossesForGame(gameVersion: 'Diamond' | 'Pearl' | 'Platinum'): BossTrainer[] {
  return dppBosses.filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion);
}

export { dppBosses };
