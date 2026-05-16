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

  // -- DPP Pass 2 (Eterna → Hearthome / Fantina) --

  // Jupiter at Eterna Galactic Building. DP Lv 18/20, Platinum Lv 21/23.
  boss({
    id: 'dpp-galactic-jupiter-eterna-d',
    name: 'Commander Jupiter (Eterna Galactic Building)',
    location: 'Eterna Galactic Building',
    order: 23,
    category: 'evil-team',
    levelCap: 20,
    game: 'Diamond',
    team: [
      mon('Zubat', 18, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Skuntank', 20, ['Poison', 'Dark'], { ability: 'Stench', item: 'Sitrus Berry' }),
    ],
    notes: 'Diamond Eterna Galactic Building battle. Per-Pokémon moves not surfaced — TODO.',
  }),
  boss({
    id: 'dpp-galactic-jupiter-eterna-p',
    name: 'Commander Jupiter (Eterna Galactic Building)',
    location: 'Eterna Galactic Building',
    order: 23,
    category: 'evil-team',
    levelCap: 20,
    game: 'Pearl',
    team: [
      mon('Zubat', 18, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Skuntank', 20, ['Poison', 'Dark'], { ability: 'Stench', item: 'Sitrus Berry' }),
    ],
    notes: 'Pearl Eterna Galactic Building battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-jupiter-eterna-pt',
    name: 'Commander Jupiter (Eterna Galactic Building)',
    location: 'Eterna Galactic Building',
    order: 23,
    category: 'evil-team',
    levelCap: 23,
    game: 'Platinum',
    team: [
      mon('Zubat', 21, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Skuntank', 23, ['Poison', 'Dark'], { ability: 'Stench', item: 'Sitrus Berry' }),
    ],
    notes: 'Platinum Eterna Galactic Building battle. Levels +3 vs DP. Per-Pokémon moves not surfaced — TODO.',
  }),

  // Fantina — different progression position between DP and Platinum.
  //   Platinum: 3rd Gym in Hearthome, Lv 24/24/26.
  //   Diamond/Pearl: 5th Gym in Hearthome, Lv 32/34/36.
  // Both placements live here under their canonical level caps; ordering between game versions
  // is handled by the dispatcher sort which keys on (levelCap, recommendedOrder).
  boss({
    id: 'dpp-gym-fantina-pt',
    name: 'Gym Leader Fantina',
    location: 'Hearthome City Gym',
    order: 27,
    category: 'gym',
    levelCap: 26,
    game: 'Platinum',
    team: [
      mon('Duskull', 24, ['Ghost'], {
        ability: 'Levitate',
        moves: [mv('Will-O-Wisp', 'Fire'), mv('Future Sight', 'Psychic', 120), mv('Shadow Sneak', 'Ghost', 40), mv('Pursuit', 'Dark', 40)],
      }),
      mon('Haunter', 24, ['Ghost', 'Poison'], {
        ability: 'Levitate',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Sucker Punch', 'Dark', 70), mv('Confuse Ray', 'Ghost'), mv('Hypnosis', 'Psychic')],
      }),
      mon('Mismagius', 26, ['Ghost'], {
        ability: 'Levitate',
        item: 'Sitrus Berry',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Psybeam', 'Psychic', 65), mv('Magical Leaf', 'Grass', 60), mv('Confuse Ray', 'Ghost')],
      }),
    ],
    notes: 'Platinum Hearthome Gym (3rd in order). Earns Relic Badge.',
  }),
  boss({
    id: 'dpp-gym-fantina-d',
    name: 'Gym Leader Fantina',
    location: 'Hearthome City Gym',
    order: 50,
    category: 'gym',
    levelCap: 36,
    game: 'Diamond',
    team: [
      mon('Drifblim', 32, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Ominous Wind', 'Ghost', 60), mv('Gust', 'Flying', 40), mv('Astonish', 'Ghost', 30), mv('Minimize', 'Normal')],
      }),
      mon('Gengar', 34, ['Ghost', 'Poison'], {
        ability: 'Levitate',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Poison Jab', 'Poison', 80), mv('Confuse Ray', 'Ghost'), mv('Spite', 'Ghost')],
      }),
      mon('Mismagius', 36, ['Ghost'], {
        ability: 'Levitate',
        item: 'Sitrus Berry',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Psybeam', 'Psychic', 65), mv('Magical Leaf', 'Grass', 60), mv('Confuse Ray', 'Ghost')],
      }),
    ],
    notes: 'Diamond Hearthome Gym (5th in DP order, after Maylene/Wake). Earns Relic Badge.',
  }),
  boss({
    id: 'dpp-gym-fantina-p',
    name: 'Gym Leader Fantina',
    location: 'Hearthome City Gym',
    order: 50,
    category: 'gym',
    levelCap: 36,
    game: 'Pearl',
    team: [
      mon('Drifblim', 32, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Ominous Wind', 'Ghost', 60), mv('Gust', 'Flying', 40), mv('Astonish', 'Ghost', 30), mv('Minimize', 'Normal')],
      }),
      mon('Gengar', 34, ['Ghost', 'Poison'], {
        ability: 'Levitate',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Poison Jab', 'Poison', 80), mv('Confuse Ray', 'Ghost'), mv('Spite', 'Ghost')],
      }),
      mon('Mismagius', 36, ['Ghost'], {
        ability: 'Levitate',
        item: 'Sitrus Berry',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Psybeam', 'Psychic', 65), mv('Magical Leaf', 'Grass', 60), mv('Confuse Ray', 'Ghost')],
      }),
    ],
    notes: 'Pearl Hearthome Gym (5th in DP order). Identical team to Diamond.',
  }),
];

export function getDppBossesForGame(gameVersion: 'Diamond' | 'Pearl' | 'Platinum'): BossTrainer[] {
  return dppBosses.filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion);
}

export { dppBosses };
