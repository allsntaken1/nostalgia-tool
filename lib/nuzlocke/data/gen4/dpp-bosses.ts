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

  // -- DPP Pass 3 (Veilstone / Pastoria / Maylene + Wake) --

  // Maylene Veilstone Gym — DP Lv 27/27/30, Platinum Lv 28/29/32.
  boss({
    id: 'dpp-gym-maylene-d',
    name: 'Gym Leader Maylene',
    location: 'Veilstone City Gym',
    order: 30,
    category: 'gym',
    levelCap: 30,
    game: 'Diamond',
    team: [
      mon('Meditite', 27, ['Fighting', 'Psychic'], {
        ability: 'Pure Power',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Confusion', 'Psychic', 50), mv('Detect', 'Fighting'), mv('Meditate', 'Psychic')],
      }),
      mon('Machoke', 27, ['Fighting'], {
        ability: 'Guts',
        moves: [mv('Brick Break', 'Fighting', 75), mv('Leer', 'Normal'), mv('Foresight', 'Normal'), mv('Rock Tomb', 'Rock', 60)],
      }),
      mon('Lucario', 30, ['Fighting', 'Steel'], {
        ability: 'Steadfast',
        item: 'Sitrus Berry',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Metal Claw', 'Steel', 50), mv('Bone Rush', 'Ground', 25), mv('Force Palm', 'Fighting', 60)],
      }),
    ],
    notes: 'Diamond Veilstone Gym (3rd in DP order). Earns Cobble Badge.',
  }),
  boss({
    id: 'dpp-gym-maylene-p',
    name: 'Gym Leader Maylene',
    location: 'Veilstone City Gym',
    order: 30,
    category: 'gym',
    levelCap: 30,
    game: 'Pearl',
    team: [
      mon('Meditite', 27, ['Fighting', 'Psychic'], {
        ability: 'Pure Power',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Confusion', 'Psychic', 50), mv('Detect', 'Fighting'), mv('Meditate', 'Psychic')],
      }),
      mon('Machoke', 27, ['Fighting'], {
        ability: 'Guts',
        moves: [mv('Brick Break', 'Fighting', 75), mv('Leer', 'Normal'), mv('Foresight', 'Normal'), mv('Rock Tomb', 'Rock', 60)],
      }),
      mon('Lucario', 30, ['Fighting', 'Steel'], {
        ability: 'Steadfast',
        item: 'Sitrus Berry',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Metal Claw', 'Steel', 50), mv('Bone Rush', 'Ground', 25), mv('Force Palm', 'Fighting', 60)],
      }),
    ],
    notes: 'Pearl Veilstone Gym (3rd in DP order). Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-gym-maylene-pt',
    name: 'Gym Leader Maylene',
    location: 'Veilstone City Gym',
    order: 32,
    category: 'gym',
    levelCap: 32,
    game: 'Platinum',
    team: [
      mon('Meditite', 28, ['Fighting', 'Psychic'], {
        ability: 'Pure Power',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Confusion', 'Psychic', 50), mv('Fake Out', 'Normal', 40), mv('Rock Tomb', 'Rock', 60)],
      }),
      mon('Machoke', 29, ['Fighting'], {
        ability: 'Guts',
        moves: [mv('Karate Chop', 'Fighting', 50), mv('Strength', 'Normal', 80), mv('Focus Energy', 'Normal'), mv('Rock Tomb', 'Rock', 60)],
      }),
      mon('Lucario', 32, ['Fighting', 'Steel'], {
        ability: 'Steadfast',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Metal Claw', 'Steel', 50), mv('Bone Rush', 'Ground', 25), mv('Force Palm', 'Fighting', 60)],
      }),
    ],
    notes: 'Platinum Veilstone Gym (4th in Pt order, after Fantina). Levels +1-2 vs DP; Meditite swaps Detect/Meditate → Fake Out/Rock Tomb. Lucario drops Sitrus Berry.',
  }),

  // Crasher Wake Pastoria Gym — DP Lv 27/27/30, Platinum Lv 33/34/37.
  boss({
    id: 'dpp-gym-wake-d',
    name: 'Gym Leader Crasher Wake',
    location: 'Pastoria City Gym',
    order: 38,
    category: 'gym',
    levelCap: 30,
    game: 'Diamond',
    team: [
      mon('Gyarados', 27, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Brine', 'Water', 65), mv('Bite', 'Dark', 60), mv('Dragon Rage', 'Dragon'), mv('Swagger', 'Normal')],
      }),
      mon('Quagsire', 27, ['Water', 'Ground'], {
        ability: 'Damp',
        moves: [mv('Slam', 'Normal', 80), mv('Mud Bomb', 'Ground', 65), mv('Mud Sport', 'Ground'), mv('Tail Whip', 'Normal')],
      }),
      mon('Floatzel', 30, ['Water'], {
        ability: 'Swift Swim',
        item: 'Sitrus Berry',
        moves: [mv('Brine', 'Water', 65), mv('Ice Fang', 'Ice', 65), mv('Pursuit', 'Dark', 40), mv('Swift', 'Normal', 60)],
      }),
    ],
    notes: 'Diamond Pastoria Gym (4th in DP order). Earns Fen Badge.',
  }),
  boss({
    id: 'dpp-gym-wake-p',
    name: 'Gym Leader Crasher Wake',
    location: 'Pastoria City Gym',
    order: 38,
    category: 'gym',
    levelCap: 30,
    game: 'Pearl',
    team: [
      mon('Gyarados', 27, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Brine', 'Water', 65), mv('Bite', 'Dark', 60), mv('Dragon Rage', 'Dragon'), mv('Swagger', 'Normal')],
      }),
      mon('Quagsire', 27, ['Water', 'Ground'], {
        ability: 'Damp',
        moves: [mv('Slam', 'Normal', 80), mv('Mud Bomb', 'Ground', 65), mv('Mud Sport', 'Ground'), mv('Tail Whip', 'Normal')],
      }),
      mon('Floatzel', 30, ['Water'], {
        ability: 'Swift Swim',
        item: 'Sitrus Berry',
        moves: [mv('Brine', 'Water', 65), mv('Ice Fang', 'Ice', 65), mv('Pursuit', 'Dark', 40), mv('Swift', 'Normal', 60)],
      }),
    ],
    notes: 'Pearl Pastoria Gym (4th in DP order). Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-gym-wake-pt',
    name: 'Gym Leader Crasher Wake',
    location: 'Pastoria City Gym',
    order: 38,
    category: 'gym',
    levelCap: 37,
    game: 'Platinum',
    team: [
      mon('Gyarados', 33, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Brine', 'Water', 65), mv('Waterfall', 'Water', 80), mv('Bite', 'Dark', 60), mv('Twister', 'Dragon', 40)],
      }),
      mon('Quagsire', 34, ['Water', 'Ground'], {
        ability: 'Damp',
        moves: [mv('Water Pulse', 'Water', 60), mv('Mud Shot', 'Ground', 55), mv('Rock Tomb', 'Rock', 60), mv('Yawn', 'Normal')],
      }),
      mon('Floatzel', 37, ['Water'], {
        ability: 'Swift Swim',
        item: 'Sitrus Berry',
        moves: [mv('Brine', 'Water', 65), mv('Crunch', 'Dark', 80), mv('Ice Fang', 'Ice', 65), mv('Aqua Jet', 'Water', 40)],
      }),
    ],
    notes: 'Platinum Pastoria Gym (5th in Pt order). Levels +3-7 vs DP; expanded move pools (Waterfall, Crunch, Aqua Jet).',
  }),

  // Galactic Grunt at Valor Lakefront — Lv 25 Glameow (DP) / Lv 31 Croagunk (Platinum).
  boss({
    id: 'dpp-galactic-grunt-valor-d',
    name: 'Galactic Grunt (Valor Lakefront)',
    location: 'Valor Lakefront',
    order: 39,
    category: 'evil-team',
    levelCap: 25,
    game: 'Diamond',
    team: [mon('Glameow', 25, ['Normal'], { ability: 'Limber' })],
    notes: "Diamond Valor Lakefront pursuit grunt (post-Cobble + Fen badges). Per-Pokémon moves not surfaced — TODO.",
  }),
  boss({
    id: 'dpp-galactic-grunt-valor-p',
    name: 'Galactic Grunt (Valor Lakefront)',
    location: 'Valor Lakefront',
    order: 39,
    category: 'evil-team',
    levelCap: 25,
    game: 'Pearl',
    team: [mon('Glameow', 25, ['Normal'], { ability: 'Limber' })],
    notes: 'Pearl Valor Lakefront pursuit grunt. Same team as Diamond.',
  }),
  boss({
    id: 'dpp-galactic-grunt-valor-pt',
    name: 'Galactic Grunt (Valor Lakefront)',
    location: 'Valor Lakefront',
    order: 39,
    category: 'evil-team',
    levelCap: 31,
    game: 'Platinum',
    team: [mon('Croagunk', 31, ['Poison', 'Fighting'], { ability: 'Anticipation' })],
    notes: 'Platinum Valor Lakefront pursuit grunt. Swaps Glameow → Croagunk; Lv +6 vs DP.',
  }),

  // -- DPP Pass 4 (Canalave / Byron + Lake/Galactic arc) --

  // Byron Canalave Gym — DP Lv 36/36/39 (Bronzor/Steelix/Bastiodon); Platinum Lv 37/38/41 (Magneton/Steelix/Bastiodon).
  boss({
    id: 'dpp-gym-byron-d',
    name: 'Gym Leader Byron',
    location: 'Canalave City Gym',
    order: 44,
    category: 'gym',
    levelCap: 39,
    game: 'Diamond',
    team: [
      mon('Bronzor', 36, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Extrasensory', 'Psychic', 80), mv('Confuse Ray', 'Ghost'), mv('Hypnosis', 'Psychic')],
      }),
      mon('Steelix', 36, ['Steel', 'Ground'], {
        ability: 'Sturdy',
        moves: [mv('Gyro Ball', 'Steel'), mv('Dragon Breath', 'Dragon', 60), mv('Ice Fang', 'Ice', 65), mv('Sandstorm', 'Rock')],
      }),
      mon('Bastiodon', 39, ['Rock', 'Steel'], {
        ability: 'Sturdy',
        item: 'Chesto Berry',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Ancient Power', 'Rock', 60), mv('Iron Defense', 'Steel'), mv('Rest', 'Psychic')],
      }),
    ],
    notes: 'Diamond Canalave Gym. Earns Mine Badge.',
  }),
  boss({
    id: 'dpp-gym-byron-p',
    name: 'Gym Leader Byron',
    location: 'Canalave City Gym',
    order: 44,
    category: 'gym',
    levelCap: 39,
    game: 'Pearl',
    team: [
      mon('Bronzor', 36, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Extrasensory', 'Psychic', 80), mv('Confuse Ray', 'Ghost'), mv('Hypnosis', 'Psychic')],
      }),
      mon('Steelix', 36, ['Steel', 'Ground'], {
        ability: 'Sturdy',
        moves: [mv('Gyro Ball', 'Steel'), mv('Dragon Breath', 'Dragon', 60), mv('Ice Fang', 'Ice', 65), mv('Sandstorm', 'Rock')],
      }),
      mon('Bastiodon', 39, ['Rock', 'Steel'], {
        ability: 'Sturdy',
        item: 'Chesto Berry',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Ancient Power', 'Rock', 60), mv('Iron Defense', 'Steel'), mv('Rest', 'Psychic')],
      }),
    ],
    notes: 'Pearl Canalave Gym. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-gym-byron-pt',
    name: 'Gym Leader Byron',
    location: 'Canalave City Gym',
    order: 44,
    category: 'gym',
    levelCap: 41,
    game: 'Platinum',
    team: [
      mon('Magneton', 37, ['Electric', 'Steel'], {
        ability: 'Magnet Pull',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Thunderbolt', 'Electric', 90), mv('Tri Attack', 'Normal', 80), mv('Metal Sound', 'Steel')],
      }),
      mon('Steelix', 38, ['Steel', 'Ground'], {
        ability: 'Rock Head',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Earthquake', 'Ground', 100), mv('Ice Fang', 'Ice', 65), mv('Sandstorm', 'Rock')],
      }),
      mon('Bastiodon', 41, ['Rock', 'Steel'], {
        ability: 'Sturdy',
        item: 'Sitrus Berry',
        moves: [mv('Metal Burst', 'Steel'), mv('Stone Edge', 'Rock', 100), mv('Iron Defense', 'Steel'), mv('Taunt', 'Dark')],
      }),
    ],
    notes: 'Platinum Canalave Gym. Swaps Bronzor → Magneton; +1-2 levels; expanded move pools.',
  }),

  // Mars second battle at Lake Verity — DP Lv 37/37/39; Platinum Lv 38/38/40.
  boss({
    id: 'dpp-galactic-mars-lake-verity-d',
    name: 'Commander Mars (Lake Verity)',
    location: 'Lake Verity',
    order: 46,
    category: 'evil-team',
    levelCap: 39,
    game: 'Diamond',
    team: [
      mon('Golbat', 37, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Toxic', 'Poison'), mv('Supersonic', 'Normal')],
      }),
      mon('Bronzor', 37, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Iron Defense', 'Steel'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 39, ['Normal'], {
        ability: 'Thick Fat',
        item: 'Sitrus Berry',
        moves: [mv('Slash', 'Normal', 70), mv('Faint Attack', 'Dark', 60), mv('Hypnosis', 'Psychic'), mv('Fake Out', 'Normal', 40)],
      }),
    ],
    notes: 'Diamond Lake Verity Mars second battle (after Spear Pillar prep).',
  }),
  boss({
    id: 'dpp-galactic-mars-lake-verity-p',
    name: 'Commander Mars (Lake Verity)',
    location: 'Lake Verity',
    order: 46,
    category: 'evil-team',
    levelCap: 39,
    game: 'Pearl',
    team: [
      mon('Golbat', 37, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Toxic', 'Poison'), mv('Supersonic', 'Normal')],
      }),
      mon('Bronzor', 37, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Iron Defense', 'Steel'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 39, ['Normal'], {
        ability: 'Thick Fat',
        item: 'Sitrus Berry',
        moves: [mv('Slash', 'Normal', 70), mv('Faint Attack', 'Dark', 60), mv('Hypnosis', 'Psychic'), mv('Fake Out', 'Normal', 40)],
      }),
    ],
    notes: 'Pearl Lake Verity Mars second battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-mars-lake-verity-pt',
    name: 'Commander Mars (Lake Verity)',
    location: 'Lake Verity',
    order: 46,
    category: 'evil-team',
    levelCap: 40,
    game: 'Platinum',
    team: [
      mon('Golbat', 38, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Toxic', 'Poison'), mv('Supersonic', 'Normal')],
      }),
      mon('Bronzor', 38, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Iron Defense', 'Steel'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 40, ['Normal'], {
        ability: 'Thick Fat',
        item: 'Sitrus Berry',
        moves: [mv('Slash', 'Normal', 70), mv('Faint Attack', 'Dark', 60), mv('Hypnosis', 'Psychic'), mv('Fake Out', 'Normal', 40)],
      }),
    ],
    notes: 'Platinum Lake Verity Mars second battle. Levels +1 vs DP.',
  }),
];

export function getDppBossesForGame(gameVersion: 'Diamond' | 'Pearl' | 'Platinum'): BossTrainer[] {
  return dppBosses.filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion);
}

export { dppBosses };
