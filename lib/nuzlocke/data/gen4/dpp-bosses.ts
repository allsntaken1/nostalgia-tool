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

  // -- DPP Pass 5 (Snowpoint / Candice) --

  // Candice Snowpoint Gym — DP 4-mon (Snover/Sneasel/Medicham/Abomasnow); Platinum 4-mon
  // (Sneasel/Piloswine/Abomasnow/Froslass — Snover/Medicham replaced).
  boss({
    id: 'dpp-gym-candice-d',
    name: 'Gym Leader Candice',
    location: 'Snowpoint City Gym',
    order: 48,
    category: 'gym',
    levelCap: 42,
    game: 'Diamond',
    team: [
      mon('Snover', 38, ['Grass', 'Ice'], {
        ability: 'Snow Warning',
        moves: [mv('Razor Leaf', 'Grass', 55), mv('Avalanche', 'Ice', 60), mv('Ingrain', 'Grass'), mv('Leer', 'Normal')],
      }),
      mon('Sneasel', 38, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        moves: [mv('Faint Attack', 'Dark', 60), mv('Slash', 'Normal', 70), mv('Taunt', 'Dark'), mv('Avalanche', 'Ice', 60)],
      }),
      mon('Medicham', 40, ['Fighting', 'Psychic'], {
        ability: 'Pure Power',
        moves: [mv('Force Palm', 'Fighting', 60), mv('Bulk Up', 'Fighting'), mv('Detect', 'Fighting'), mv('Ice Punch', 'Ice', 75)],
      }),
      mon('Abomasnow', 42, ['Grass', 'Ice'], {
        ability: 'Snow Warning',
        item: 'Sitrus Berry',
        moves: [mv('Wood Hammer', 'Grass', 120), mv('Swagger', 'Normal'), mv('GrassWhistle', 'Grass'), mv('Avalanche', 'Ice', 60)],
      }),
    ],
    notes: 'Diamond Snowpoint Gym (7th). Earns Icicle Badge.',
  }),
  boss({
    id: 'dpp-gym-candice-p',
    name: 'Gym Leader Candice',
    location: 'Snowpoint City Gym',
    order: 48,
    category: 'gym',
    levelCap: 42,
    game: 'Pearl',
    team: [
      mon('Snover', 38, ['Grass', 'Ice'], {
        ability: 'Snow Warning',
        moves: [mv('Razor Leaf', 'Grass', 55), mv('Avalanche', 'Ice', 60), mv('Ingrain', 'Grass'), mv('Leer', 'Normal')],
      }),
      mon('Sneasel', 38, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        moves: [mv('Faint Attack', 'Dark', 60), mv('Slash', 'Normal', 70), mv('Taunt', 'Dark'), mv('Avalanche', 'Ice', 60)],
      }),
      mon('Medicham', 40, ['Fighting', 'Psychic'], {
        ability: 'Pure Power',
        moves: [mv('Force Palm', 'Fighting', 60), mv('Bulk Up', 'Fighting'), mv('Detect', 'Fighting'), mv('Ice Punch', 'Ice', 75)],
      }),
      mon('Abomasnow', 42, ['Grass', 'Ice'], {
        ability: 'Snow Warning',
        item: 'Sitrus Berry',
        moves: [mv('Wood Hammer', 'Grass', 120), mv('Swagger', 'Normal'), mv('GrassWhistle', 'Grass'), mv('Avalanche', 'Ice', 60)],
      }),
    ],
    notes: 'Pearl Snowpoint Gym (7th). Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-gym-candice-pt',
    name: 'Gym Leader Candice',
    location: 'Snowpoint City Gym',
    order: 48,
    category: 'gym',
    levelCap: 44,
    game: 'Platinum',
    team: [
      mon('Sneasel', 40, ['Dark', 'Ice'], {
        ability: 'Keen Eye',
        moves: [mv('Faint Attack', 'Dark', 60), mv('Ice Shard', 'Ice', 40), mv('Slash', 'Normal', 70), mv('Aerial Ace', 'Flying', 60)],
      }),
      mon('Piloswine', 40, ['Ice', 'Ground'], {
        ability: 'Oblivious',
        moves: [mv('Hail', 'Ice'), mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Avalanche', 'Ice', 60)],
      }),
      mon('Abomasnow', 42, ['Grass', 'Ice'], {
        ability: 'Snow Warning',
        moves: [mv('Wood Hammer', 'Grass', 120), mv('Focus Blast', 'Fighting', 120), mv('Water Pulse', 'Water', 60), mv('Avalanche', 'Ice', 60)],
      }),
      mon('Froslass', 44, ['Ice', 'Ghost'], {
        ability: 'Snow Cloak',
        item: 'Sitrus Berry',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Double Team', 'Normal'), mv('Psychic', 'Psychic', 90), mv('Blizzard', 'Ice', 110)],
      }),
    ],
    notes: 'Platinum Snowpoint Gym (7th). Swaps Snover/Medicham → Piloswine/Froslass; ace +2 levels; Abomasnow drops Sitrus Berry (Froslass holds it instead).',
  }),

  // -- DPP Pass 6 (Galactic HQ / Spear Pillar / Distortion World) --

  // Saturn at Galactic HQ.
  boss({
    id: 'dpp-galactic-saturn-hq-d',
    name: 'Commander Saturn (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 49,
    category: 'evil-team',
    levelCap: 40,
    game: 'Diamond',
    team: [
      mon('Kadabra', 38, ['Psychic'], {
        ability: 'Synchronize',
        moves: [mv('Psychic', 'Psychic', 90), mv('Shock Wave', 'Electric', 60), mv('Recover', 'Normal'), mv('Embargo', 'Dark')],
      }),
      mon('Bronzor', 38, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Toxicroak', 40, ['Poison', 'Fighting'], {
        ability: 'Anticipation',
        item: 'Sitrus Berry',
        moves: [mv('Poison Jab', 'Poison', 80), mv('Brick Break', 'Fighting', 75), mv('X-Scissor', 'Bug', 80), mv('Swagger', 'Normal')],
      }),
    ],
    notes: 'Diamond Galactic HQ Saturn battle.',
  }),
  boss({
    id: 'dpp-galactic-saturn-hq-p',
    name: 'Commander Saturn (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 49,
    category: 'evil-team',
    levelCap: 40,
    game: 'Pearl',
    team: [
      mon('Kadabra', 38, ['Psychic'], {
        ability: 'Synchronize',
        moves: [mv('Psychic', 'Psychic', 90), mv('Shock Wave', 'Electric', 60), mv('Recover', 'Normal'), mv('Embargo', 'Dark')],
      }),
      mon('Bronzor', 38, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Toxicroak', 40, ['Poison', 'Fighting'], {
        ability: 'Anticipation',
        item: 'Sitrus Berry',
        moves: [mv('Poison Jab', 'Poison', 80), mv('Brick Break', 'Fighting', 75), mv('X-Scissor', 'Bug', 80), mv('Swagger', 'Normal')],
      }),
    ],
    notes: 'Pearl Galactic HQ Saturn battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-saturn-hq-pt',
    name: 'Commander Saturn (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 49,
    category: 'evil-team',
    levelCap: 44,
    game: 'Platinum',
    team: [
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 55), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Bronzor', 42, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Toxicroak', 44, ['Poison', 'Fighting'], {
        ability: 'Anticipation',
        item: 'Sitrus Berry',
        moves: [mv('Poison Jab', 'Poison', 80), mv('Brick Break', 'Fighting', 75), mv('X-Scissor', 'Bug', 80), mv('Faint Attack', 'Dark', 60)],
      }),
    ],
    notes: 'Platinum Galactic HQ Saturn battle. Swaps Kadabra → Golbat; levels +2-4 vs DP.',
  }),

  // Cyrus at Galactic HQ.
  boss({
    id: 'dpp-galactic-cyrus-hq-d',
    name: 'Galactic Boss Cyrus (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 50,
    category: 'evil-team',
    levelCap: 43,
    game: 'Diamond',
    team: [
      mon('Murkrow', 40, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        moves: [mv('Night Shade', 'Ghost'), mv('Embargo', 'Dark'), mv('Drill Peck', 'Flying', 80), mv('Astonish', 'Ghost', 30)],
      }),
      mon('Golbat', 40, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 55), mv('Poison Fang', 'Poison', 50), mv('Supersonic', 'Normal'), mv('Bite', 'Dark', 60)],
      }),
      mon('Sneasel', 43, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        item: 'Sitrus Berry',
        moves: [mv('Screech', 'Normal'), mv('Ice Punch', 'Ice', 75), mv('Slash', 'Normal', 70), mv('Quick Attack', 'Normal', 40)],
      }),
    ],
    notes: 'Diamond Galactic HQ Cyrus battle.',
  }),
  boss({
    id: 'dpp-galactic-cyrus-hq-p',
    name: 'Galactic Boss Cyrus (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 50,
    category: 'evil-team',
    levelCap: 43,
    game: 'Pearl',
    team: [
      mon('Murkrow', 40, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        moves: [mv('Night Shade', 'Ghost'), mv('Embargo', 'Dark'), mv('Drill Peck', 'Flying', 80), mv('Astonish', 'Ghost', 30)],
      }),
      mon('Golbat', 40, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 55), mv('Poison Fang', 'Poison', 50), mv('Supersonic', 'Normal'), mv('Bite', 'Dark', 60)],
      }),
      mon('Sneasel', 43, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        item: 'Sitrus Berry',
        moves: [mv('Screech', 'Normal'), mv('Ice Punch', 'Ice', 75), mv('Slash', 'Normal', 70), mv('Quick Attack', 'Normal', 40)],
      }),
    ],
    notes: 'Pearl Galactic HQ Cyrus battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-cyrus-hq-pt',
    name: 'Galactic Boss Cyrus (Galactic HQ)',
    location: 'Galactic HQ (Veilstone)',
    order: 50,
    category: 'evil-team',
    levelCap: 46,
    game: 'Platinum',
    team: [
      mon('Sneasel', 44, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        moves: [mv('Screech', 'Normal'), mv('Ice Punch', 'Ice', 75), mv('Slash', 'Normal', 70), mv('Quick Attack', 'Normal', 40)],
      }),
      mon('Crobat', 44, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 55), mv('Poison Fang', 'Poison', 50), mv('Supersonic', 'Normal'), mv('Bite', 'Dark', 60)],
      }),
      mon('Honchkrow', 46, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        item: 'Sitrus Berry',
        moves: [mv('Night Shade', 'Ghost'), mv('Faint Attack', 'Dark', 60), mv('Drill Peck', 'Flying', 80), mv('Astonish', 'Ghost', 30)],
      }),
    ],
    notes: 'Platinum Galactic HQ Cyrus battle. Evolved-form swaps Murkrow→Honchkrow, Golbat→Crobat; levels +3-4.',
  }),

  // Mars + Jupiter multi-battle at Spear Pillar.
  boss({
    id: 'dpp-galactic-mars-spear-pillar-d',
    name: 'Commander Mars (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 45,
    game: 'Diamond',
    team: [
      mon('Bronzor', 41, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Light Screen', 'Psychic'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 45, ['Normal'], {
        ability: 'Thick Fat',
        moves: [mv('Slash', 'Normal', 70), mv('Shadow Claw', 'Ghost', 70), mv('Aerial Ace', 'Flying', 60), mv('Hypnosis', 'Psychic')],
      }),
    ],
    notes: 'Diamond Spear Pillar multi-battle (Mars half, paired with Jupiter).',
  }),
  boss({
    id: 'dpp-galactic-mars-spear-pillar-p',
    name: 'Commander Mars (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 45,
    game: 'Pearl',
    team: [
      mon('Bronzor', 41, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Light Screen', 'Psychic'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 45, ['Normal'], {
        ability: 'Thick Fat',
        moves: [mv('Slash', 'Normal', 70), mv('Shadow Claw', 'Ghost', 70), mv('Aerial Ace', 'Flying', 60), mv('Hypnosis', 'Psychic')],
      }),
    ],
    notes: 'Pearl Spear Pillar multi-battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-mars-spear-pillar-pt',
    name: 'Commander Mars (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 46,
    game: 'Platinum',
    team: [
      mon('Bronzor', 44, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Rock Slide', 'Rock', 75), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 44, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Sludge Bomb', 'Poison', 90), mv('Air Cutter', 'Flying', 60), mv('Giga Drain', 'Grass', 75), mv('Mean Look', 'Normal')],
      }),
      mon('Purugly', 46, ['Normal'], {
        ability: 'Thick Fat',
        moves: [mv('Slash', 'Normal', 70), mv('Shadow Claw', 'Ghost', 70), mv('Aerial Ace', 'Flying', 60), mv('Hypnosis', 'Psychic')],
      }),
    ],
    notes: 'Platinum Spear Pillar multi-battle. Levels +1-3 vs DP; Bronzor swaps Light Screen → Rock Slide; Golbat moves overhauled.',
  }),

  // Jupiter Spear Pillar half — verified per Bulbapedia.
  boss({
    id: 'dpp-galactic-jupiter-spear-pillar-d',
    name: 'Commander Jupiter (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 45,
    game: 'Diamond',
    team: [
      mon('Bronzor', 41, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Light Screen', 'Psychic'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 45, ['Normal'], {
        ability: 'Thick Fat',
        item: 'Sitrus Berry',
        moves: [mv('Slash', 'Normal', 70), mv('Shadow Claw', 'Ghost', 70), mv('Aerial Ace', 'Flying', 60), mv('Hypnosis', 'Psychic')],
      }),
    ],
    notes: 'Diamond Spear Pillar multi-battle (Jupiter half, paired with Mars).',
  }),
  boss({
    id: 'dpp-galactic-jupiter-spear-pillar-p',
    name: 'Commander Jupiter (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 45,
    game: 'Pearl',
    team: [
      mon('Bronzor', 41, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Light Screen', 'Psychic'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Purugly', 45, ['Normal'], {
        ability: 'Thick Fat',
        item: 'Sitrus Berry',
        moves: [mv('Slash', 'Normal', 70), mv('Shadow Claw', 'Ghost', 70), mv('Aerial Ace', 'Flying', 60), mv('Hypnosis', 'Psychic')],
      }),
    ],
    notes: 'Pearl Spear Pillar multi-battle. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-galactic-jupiter-spear-pillar-pt',
    name: 'Commander Jupiter (Spear Pillar multi)',
    location: 'Spear Pillar',
    order: 51,
    category: 'evil-team',
    levelCap: 46,
    game: 'Platinum',
    team: [
      mon('Bronzor', 44, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Gyro Ball', 'Steel'), mv('Extrasensory', 'Psychic', 80), mv('Light Screen', 'Psychic'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Golbat', 44, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Bite', 'Dark', 60), mv('Poison Fang', 'Poison', 50), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Skuntank', 46, ['Poison', 'Dark'], {
        ability: 'Stench',
        item: 'Sitrus Berry',
        moves: [mv('Night Slash', 'Dark', 70), mv('Poison Jab', 'Poison', 80), mv('Flamethrower', 'Fire', 95), mv('Slash', 'Normal', 70)],
      }),
    ],
    notes: 'Platinum Spear Pillar multi-battle. Pt swaps Purugly → Skuntank (her canonical ace from Eterna).',
  }),

  // Cyrus at Spear Pillar — DP only.
  boss({
    id: 'dpp-galactic-cyrus-spear-pillar-d',
    name: 'Galactic Boss Cyrus (Spear Pillar)',
    location: 'Spear Pillar',
    order: 52,
    category: 'evil-team',
    levelCap: 48,
    game: 'Diamond',
    team: [
      mon('Honchkrow', 45, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        moves: [mv('Drill Peck', 'Flying', 80), mv('Dark Pulse', 'Dark', 80), mv('Steel Wing', 'Steel', 70), mv('Embargo', 'Dark')],
      }),
      mon('Gyarados', 45, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Giga Impact', 'Normal', 150), mv('Aqua Tail', 'Water', 90), mv('Ice Fang', 'Ice', 65), mv('Earthquake', 'Ground', 100)],
      }),
      mon('Crobat', 46, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Cross Poison', 'Poison', 70), mv('Air Slash', 'Flying', 75), mv('Bite', 'Dark', 60), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Weavile', 48, ['Dark', 'Ice'], {
        ability: 'Pressure',
        item: 'Sitrus Berry',
        moves: [mv('Night Slash', 'Dark', 70), mv('Ice Punch', 'Ice', 75), mv('Brick Break', 'Fighting', 75), mv('X-Scissor', 'Bug', 80)],
      }),
    ],
    notes: 'Diamond Spear Pillar Cyrus battle (final pre-Dialga summon).',
  }),
  boss({
    id: 'dpp-galactic-cyrus-spear-pillar-p',
    name: 'Galactic Boss Cyrus (Spear Pillar)',
    location: 'Spear Pillar',
    order: 52,
    category: 'evil-team',
    levelCap: 48,
    game: 'Pearl',
    team: [
      mon('Honchkrow', 45, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        moves: [mv('Drill Peck', 'Flying', 80), mv('Dark Pulse', 'Dark', 80), mv('Steel Wing', 'Steel', 70), mv('Embargo', 'Dark')],
      }),
      mon('Gyarados', 45, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Giga Impact', 'Normal', 150), mv('Aqua Tail', 'Water', 90), mv('Ice Fang', 'Ice', 65), mv('Earthquake', 'Ground', 100)],
      }),
      mon('Crobat', 46, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Cross Poison', 'Poison', 70), mv('Air Slash', 'Flying', 75), mv('Bite', 'Dark', 60), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Weavile', 48, ['Dark', 'Ice'], {
        ability: 'Pressure',
        item: 'Sitrus Berry',
        moves: [mv('Night Slash', 'Dark', 70), mv('Ice Punch', 'Ice', 75), mv('Brick Break', 'Fighting', 75), mv('X-Scissor', 'Bug', 80)],
      }),
    ],
    notes: 'Pearl Spear Pillar Cyrus battle (final pre-Palkia summon). Identical team to Diamond.',
  }),

  // Cyrus at Distortion World — Platinum only.
  boss({
    id: 'dpp-galactic-cyrus-distortion-world-pt',
    name: 'Galactic Boss Cyrus (Distortion World)',
    location: 'Distortion World',
    order: 53,
    category: 'evil-team',
    levelCap: 48,
    game: 'Platinum',
    team: [
      mon('Houndoom', 45, ['Dark', 'Fire'], {
        ability: 'Early Bird',
        moves: [mv('Flamethrower', 'Fire', 95), mv('Dark Pulse', 'Dark', 80), mv('Will-O-Wisp', 'Fire'), mv('Thunder Fang', 'Electric', 65)],
      }),
      mon('Honchkrow', 47, ['Dark', 'Flying'], {
        ability: 'Insomnia',
        moves: [mv('Drill Peck', 'Flying', 80), mv('Night Slash', 'Dark', 70), mv('Heat Wave', 'Fire', 100), mv('Psychic', 'Psychic', 90)],
      }),
      mon('Crobat', 46, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Cross Poison', 'Poison', 70), mv('Air Slash', 'Flying', 75), mv('Toxic', 'Poison'), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Gyarados', 46, ['Water', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Waterfall', 'Water', 80), mv('Ice Fang', 'Ice', 65), mv('Earthquake', 'Ground', 100), mv('Giga Impact', 'Normal', 150)],
      }),
      mon('Weavile', 48, ['Dark', 'Ice'], {
        ability: 'Pressure',
        item: 'Sitrus Berry',
        moves: [mv('Night Slash', 'Dark', 70), mv('Ice Punch', 'Ice', 75), mv('X-Scissor', 'Bug', 80), mv('Fake Out', 'Normal', 40)],
      }),
    ],
    notes: 'Platinum Distortion World Cyrus battle (pre-Giratina). Expands DP 4-mon team to 5-mon by adding Houndoom; movesets overhauled.',
  }),
];

// ===========================================================================================
// Pass 7 — Sunyshore / Elite Four / Cynthia.
// Appended via a second array merge so we don't mutate the closing `]` above repeatedly.
// ===========================================================================================
const pass7Bosses: BossTrainer[] = [
  // Volkner Sunyshore Gym — DP 4-mon (Raichu/Ambipom/Octillery/Luxray); Pt 4-mon
  // (Jolteon/Raichu/Luxray/Electivire). All movesets populated below.
  boss({
    id: 'dpp-gym-volkner-d',
    name: 'Gym Leader Volkner',
    location: 'Sunyshore City Gym',
    order: 55,
    category: 'gym',
    levelCap: 49,
    game: 'Diamond',
    team: [
      mon('Raichu', 46, ['Electric'], { ability: 'Static', moves: [mv('Charge Beam', 'Electric', 50), mv('Brick Break', 'Fighting', 75), mv('Light Screen', 'Psychic'), mv('Thunder Wave', 'Electric')] }),
      mon('Ambipom', 47, ['Normal'], { ability: 'Technician', moves: [mv('Shock Wave', 'Electric', 60), mv('Nasty Plot', 'Dark'), mv('Agility', 'Psychic'), mv('Baton Pass', 'Normal')] }),
      mon('Octillery', 47, ['Water'], { ability: 'Sniper', moves: [mv('Charge Beam', 'Electric', 50), mv('Octazooka', 'Water', 65), mv('Aurora Beam', 'Ice', 65), mv('Bullet Seed', 'Grass', 25)] }),
      mon('Luxray', 49, ['Electric'], { ability: 'Rivalry', item: 'Sitrus Berry', moves: [mv('Charge Beam', 'Electric', 50), mv('Thunder Wave', 'Electric'), mv('Thunder Fang', 'Electric', 65), mv('Crunch', 'Dark', 80)] }),
    ],
    notes: 'Diamond Sunyshore Gym (8th). Earns Beacon Badge.',
  }),
  boss({
    id: 'dpp-gym-volkner-p',
    name: 'Gym Leader Volkner',
    location: 'Sunyshore City Gym',
    order: 55,
    category: 'gym',
    levelCap: 49,
    game: 'Pearl',
    team: [
      mon('Raichu', 46, ['Electric'], { ability: 'Static', moves: [mv('Charge Beam', 'Electric', 50), mv('Brick Break', 'Fighting', 75), mv('Light Screen', 'Psychic'), mv('Thunder Wave', 'Electric')] }),
      mon('Ambipom', 47, ['Normal'], { ability: 'Technician', moves: [mv('Shock Wave', 'Electric', 60), mv('Nasty Plot', 'Dark'), mv('Agility', 'Psychic'), mv('Baton Pass', 'Normal')] }),
      mon('Octillery', 47, ['Water'], { ability: 'Sniper', moves: [mv('Charge Beam', 'Electric', 50), mv('Octazooka', 'Water', 65), mv('Aurora Beam', 'Ice', 65), mv('Bullet Seed', 'Grass', 25)] }),
      mon('Luxray', 49, ['Electric'], { ability: 'Rivalry', item: 'Sitrus Berry', moves: [mv('Charge Beam', 'Electric', 50), mv('Thunder Wave', 'Electric'), mv('Thunder Fang', 'Electric', 65), mv('Crunch', 'Dark', 80)] }),
    ],
    notes: 'Pearl Sunyshore Gym (8th). Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-gym-volkner-pt',
    name: 'Gym Leader Volkner',
    location: 'Sunyshore City Gym',
    order: 55,
    category: 'gym',
    levelCap: 50,
    game: 'Platinum',
    team: [
      mon('Jolteon', 46, ['Electric'], { ability: 'Volt Absorb', moves: [mv('Charge Beam', 'Electric', 50), mv('Thunder Wave', 'Electric'), mv('Iron Tail', 'Steel', 100), mv('Quick Attack', 'Normal', 40)] }),
      mon('Raichu', 46, ['Electric'], { ability: 'Static', moves: [mv('Charge Beam', 'Electric', 50), mv('Signal Beam', 'Bug', 75), mv('Focus Blast', 'Fighting', 120), mv('Quick Attack', 'Normal', 40)] }),
      mon('Luxray', 48, ['Electric'], { ability: 'Rivalry', moves: [mv('Thunder Fang', 'Electric', 65), mv('Ice Fang', 'Ice', 65), mv('Fire Fang', 'Fire', 65), mv('Crunch', 'Dark', 80)] }),
      mon('Electivire', 50, ['Electric'], { ability: 'Motor Drive', item: 'Sitrus Berry', moves: [mv('Thunder Punch', 'Electric', 75), mv('Fire Punch', 'Fire', 75), mv('Giga Impact', 'Normal', 150), mv('Quick Attack', 'Normal', 40)] }),
    ],
    notes: 'Platinum Sunyshore Gym (8th). Swaps Ambipom/Octillery → Jolteon/Electivire (pure Electric); ace +1 level.',
  }),

  // Elite Four — Aaron (Bug).
  boss({
    id: 'dpp-e4-aaron-d',
    name: 'Elite Four Aaron',
    location: 'Pokémon League',
    order: 60,
    category: 'elite-four',
    levelCap: 57,
    game: 'Diamond',
    team: [
      mon('Dustox', 53, ['Bug', 'Poison'], { ability: 'Shield Dust', moves: [mv('Toxic', 'Poison'), mv('Bug Buzz', 'Bug', 90), mv('Double Team', 'Normal'), mv('Light Screen', 'Psychic')] }),
      mon('Beautifly', 53, ['Bug', 'Flying'], { ability: 'Swarm', moves: [mv('Energy Ball', 'Grass', 90), mv('Bug Buzz', 'Bug', 90), mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80)] }),
      mon('Vespiquen', 54, ['Bug', 'Flying'], { ability: 'Pressure', moves: [mv('Attack Order', 'Bug', 90), mv('Defend Order', 'Bug'), mv('Heal Order', 'Bug'), mv('Power Gem', 'Rock', 80)] }),
      mon('Heracross', 54, ['Bug', 'Fighting'], { ability: 'Swarm', moves: [mv('Megahorn', 'Bug', 120), mv('Close Combat', 'Fighting', 120), mv('Night Slash', 'Dark', 70), mv('Stone Edge', 'Rock', 100)] }),
      mon('Drapion', 57, ['Poison', 'Dark'], { ability: 'Battle Armor', item: 'Sitrus Berry', moves: [mv('X-Scissor', 'Bug', 80), mv('Cross Poison', 'Poison', 70), mv('Ice Fang', 'Ice', 65), mv('Aerial Ace', 'Flying', 60)] }),
    ],
    notes: 'Diamond Elite Four Aaron (Bug specialist).',
  }),
  boss({
    id: 'dpp-e4-aaron-p',
    name: 'Elite Four Aaron',
    location: 'Pokémon League',
    order: 60,
    category: 'elite-four',
    levelCap: 57,
    game: 'Pearl',
    team: [
      mon('Dustox', 53, ['Bug', 'Poison'], { ability: 'Shield Dust', moves: [mv('Toxic', 'Poison'), mv('Bug Buzz', 'Bug', 90), mv('Double Team', 'Normal'), mv('Light Screen', 'Psychic')] }),
      mon('Beautifly', 53, ['Bug', 'Flying'], { ability: 'Swarm', moves: [mv('Energy Ball', 'Grass', 90), mv('Bug Buzz', 'Bug', 90), mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80)] }),
      mon('Vespiquen', 54, ['Bug', 'Flying'], { ability: 'Pressure', moves: [mv('Attack Order', 'Bug', 90), mv('Defend Order', 'Bug'), mv('Heal Order', 'Bug'), mv('Power Gem', 'Rock', 80)] }),
      mon('Heracross', 54, ['Bug', 'Fighting'], { ability: 'Swarm', moves: [mv('Megahorn', 'Bug', 120), mv('Close Combat', 'Fighting', 120), mv('Night Slash', 'Dark', 70), mv('Stone Edge', 'Rock', 100)] }),
      mon('Drapion', 57, ['Poison', 'Dark'], { ability: 'Battle Armor', item: 'Sitrus Berry', moves: [mv('X-Scissor', 'Bug', 80), mv('Cross Poison', 'Poison', 70), mv('Ice Fang', 'Ice', 65), mv('Aerial Ace', 'Flying', 60)] }),
    ],
    notes: 'Pearl Elite Four Aaron. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-e4-aaron-pt',
    name: 'Elite Four Aaron',
    location: 'Pokémon League',
    order: 60,
    category: 'elite-four',
    levelCap: 57,
    game: 'Platinum',
    team: [
      mon('Yanmega', 49, ['Bug', 'Flying'], {
        ability: 'Speed Boost',
        moves: [mv('Bug Buzz', 'Bug', 90), mv('Air Slash', 'Flying', 75), mv('U-turn', 'Bug', 70), mv('Double Team', 'Normal')],
      }),
      mon('Scizor', 49, ['Bug', 'Steel'], {
        ability: 'Technician',
        moves: [mv('X-Scissor', 'Bug', 80), mv('Iron Head', 'Steel', 80), mv('Night Slash', 'Dark', 70), mv('Quick Attack', 'Normal', 40)],
      }),
      mon('Vespiquen', 50, ['Bug', 'Flying'], {
        ability: 'Pressure',
        moves: [mv('Attack Order', 'Bug', 90), mv('Defend Order', 'Bug'), mv('Heal Order', 'Bug'), mv('Power Gem', 'Rock', 80)],
      }),
      mon('Heracross', 51, ['Bug', 'Fighting'], {
        ability: 'Guts',
        moves: [mv('Megahorn', 'Bug', 120), mv('Close Combat', 'Fighting', 120), mv('Night Slash', 'Dark', 70), mv('Stone Edge', 'Rock', 100)],
      }),
      mon('Drapion', 53, ['Poison', 'Dark'], {
        ability: 'Sniper',
        item: 'Sitrus Berry',
        moves: [mv('X-Scissor', 'Bug', 80), mv('Cross Poison', 'Poison', 70), mv('Ice Fang', 'Ice', 65), mv('Aerial Ace', 'Flying', 60)],
      }),
    ],
    notes: 'Platinum Elite Four Aaron. Replaces Dustox/Beautifly with Yanmega/Scizor; ace moved down to 53 (Pt feeds excess levels to Cynthia).',
  }),

  // Elite Four — Bertha (Ground). DP species lineup verified; Pt has different species set.
  boss({
    id: 'dpp-e4-bertha-d',
    name: 'Elite Four Bertha',
    location: 'Pokémon League',
    order: 61,
    category: 'elite-four',
    levelCap: 59,
    game: 'Diamond',
    team: [
      mon('Quagsire', 55, ['Water', 'Ground'], { ability: 'Damp', moves: [mv('Dig', 'Ground', 80), mv('Double Team', 'Normal'), mv('Protect', 'Normal'), mv('Sandstorm', 'Rock')] }),
      mon('Sudowoodo', 56, ['Rock'], { ability: 'Rock Head', moves: [mv('Earthquake', 'Ground', 100), mv('Sucker Punch', 'Dark', 70), mv('Hammer Arm', 'Fighting', 100), mv('Sandstorm', 'Rock')] }),
      mon('Golem', 56, ['Rock', 'Ground'], { ability: 'Sturdy', moves: [mv('Earthquake', 'Ground', 100), mv('Gyro Ball', 'Steel'), mv('Brick Break', 'Fighting', 75), mv('Sandstorm', 'Rock')] }),
      mon('Whiscash', 55, ['Water', 'Ground'], { ability: 'Anticipation', moves: [mv('Fissure', 'Ground'), mv('Aqua Tail', 'Water', 90), mv('Zen Headbutt', 'Psychic', 80), mv('Rock Slide', 'Rock', 75)] }),
      mon('Hippowdon', 59, ['Ground'], { ability: 'Sand Stream', item: 'Sitrus Berry', moves: [mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Crunch', 'Dark', 80), mv('Curse', 'Ghost')] }),
    ],
    notes: 'Diamond Elite Four Bertha (Ground specialist). All team members are female.',
  }),
  boss({
    id: 'dpp-e4-bertha-p',
    name: 'Elite Four Bertha',
    location: 'Pokémon League',
    order: 61,
    category: 'elite-four',
    levelCap: 59,
    game: 'Pearl',
    team: [
      mon('Quagsire', 55, ['Water', 'Ground'], { ability: 'Damp', moves: [mv('Dig', 'Ground', 80), mv('Double Team', 'Normal'), mv('Protect', 'Normal'), mv('Sandstorm', 'Rock')] }),
      mon('Sudowoodo', 56, ['Rock'], { ability: 'Rock Head', moves: [mv('Earthquake', 'Ground', 100), mv('Sucker Punch', 'Dark', 70), mv('Hammer Arm', 'Fighting', 100), mv('Sandstorm', 'Rock')] }),
      mon('Golem', 56, ['Rock', 'Ground'], { ability: 'Sturdy', moves: [mv('Earthquake', 'Ground', 100), mv('Gyro Ball', 'Steel'), mv('Brick Break', 'Fighting', 75), mv('Sandstorm', 'Rock')] }),
      mon('Whiscash', 55, ['Water', 'Ground'], { ability: 'Anticipation', moves: [mv('Fissure', 'Ground'), mv('Aqua Tail', 'Water', 90), mv('Zen Headbutt', 'Psychic', 80), mv('Rock Slide', 'Rock', 75)] }),
      mon('Hippowdon', 59, ['Ground'], { ability: 'Sand Stream', item: 'Sitrus Berry', moves: [mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Crunch', 'Dark', 80), mv('Curse', 'Ghost')] }),
    ],
    notes: 'Pearl Elite Four Bertha. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-e4-bertha-pt',
    name: 'Elite Four Bertha',
    location: 'Pokémon League',
    order: 61,
    category: 'elite-four',
    levelCap: 55,
    game: 'Platinum',
    team: [
      mon('Whiscash', 50, ['Water', 'Ground'], {
        ability: 'Anticipation',
        moves: [mv('Earth Power', 'Ground', 90), mv('Aqua Tail', 'Water', 90), mv('Zen Headbutt', 'Psychic', 80), mv('Sandstorm', 'Rock')],
      }),
      mon('Gliscor', 52, ['Ground', 'Flying'], {
        ability: 'Hyper Cutter',
        moves: [mv('Earthquake', 'Ground', 100), mv('Ice Fang', 'Ice', 65), mv('Fire Fang', 'Fire', 65), mv('Thunder Fang', 'Electric', 65)],
      }),
      mon('Golem', 53, ['Rock', 'Ground'], {
        ability: 'Sturdy',
        moves: [mv('Earthquake', 'Ground', 100), mv('Fire Punch', 'Fire', 75), mv('Thunder Punch', 'Electric', 75), mv('Sandstorm', 'Rock')],
      }),
      mon('Rhyperior', 55, ['Ground', 'Rock'], {
        ability: 'Solid Rock',
        moves: [mv('Earthquake', 'Ground', 100), mv('Rock Wrecker', 'Rock', 150), mv('Megahorn', 'Bug', 120), mv('Avalanche', 'Ice', 60)],
      }),
      mon('Hippowdon', 55, ['Ground'], {
        ability: 'Sand Stream',
        item: 'Sitrus Berry',
        moves: [mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Crunch', 'Dark', 80), mv('Yawn', 'Normal')],
      }),
    ],
    notes: 'Platinum Elite Four Bertha. Swaps Quagsire/Sudowoodo → Gliscor/Rhyperior; team rebalanced to Lv 50-55 (lower than DP).',
  }),

  // Elite Four — Flint (Fire). Famously mixed DP roster; Platinum corrects to pure Fire.
  boss({
    id: 'dpp-e4-flint-d',
    name: 'Elite Four Flint',
    location: 'Pokémon League',
    order: 62,
    category: 'elite-four',
    levelCap: 61,
    game: 'Diamond',
    team: [
      mon('Rapidash', 58, ['Fire'], {
        ability: 'Run Away',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Solar Beam', 'Grass', 120), mv('Bounce', 'Flying', 85), mv('Sunny Day', 'Fire')],
      }),
      mon('Steelix', 57, ['Steel', 'Ground'], {
        ability: 'Rock Head',
        moves: [mv('Fire Fang', 'Fire', 65), mv('Rock Tomb', 'Rock', 50), mv('Screech', 'Normal'), mv('Sunny Day', 'Fire')],
      }),
      mon('Drifblim', 58, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Will-O-Wisp', 'Fire'), mv('Ominous Wind', 'Ghost', 60), mv('Double Team', 'Normal'), mv('Baton Pass', 'Normal')],
      }),
      mon('Lopunny', 57, ['Normal'], {
        ability: 'Cute Charm',
        moves: [mv('Fire Punch', 'Fire', 75), mv('Charm', 'Fairy'), mv('Mirror Coat', 'Psychic'), mv('Sunny Day', 'Fire')],
      }),
      mon('Infernape', 61, ['Fire', 'Fighting'], {
        ability: 'Blaze',
        item: 'Sitrus Berry',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Thunder Punch', 'Electric', 75), mv('Mach Punch', 'Fighting', 40), mv('Earthquake', 'Ground', 100)],
      }),
    ],
    notes: 'Diamond Elite Four Flint — the notorious mixed roster. Only Rapidash and Infernape are pure Fire; the rest carry Fire-type moves but break type theme.',
  }),
  boss({
    id: 'dpp-e4-flint-p',
    name: 'Elite Four Flint',
    location: 'Pokémon League',
    order: 62,
    category: 'elite-four',
    levelCap: 61,
    game: 'Pearl',
    team: [
      mon('Rapidash', 58, ['Fire'], {
        ability: 'Run Away',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Solar Beam', 'Grass', 120), mv('Bounce', 'Flying', 85), mv('Sunny Day', 'Fire')],
      }),
      mon('Steelix', 57, ['Steel', 'Ground'], {
        ability: 'Rock Head',
        moves: [mv('Fire Fang', 'Fire', 65), mv('Rock Tomb', 'Rock', 50), mv('Screech', 'Normal'), mv('Sunny Day', 'Fire')],
      }),
      mon('Drifblim', 58, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Will-O-Wisp', 'Fire'), mv('Ominous Wind', 'Ghost', 60), mv('Double Team', 'Normal'), mv('Baton Pass', 'Normal')],
      }),
      mon('Lopunny', 57, ['Normal'], {
        ability: 'Cute Charm',
        moves: [mv('Fire Punch', 'Fire', 75), mv('Charm', 'Fairy'), mv('Mirror Coat', 'Psychic'), mv('Sunny Day', 'Fire')],
      }),
      mon('Infernape', 61, ['Fire', 'Fighting'], {
        ability: 'Blaze',
        item: 'Sitrus Berry',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Thunder Punch', 'Electric', 75), mv('Mach Punch', 'Fighting', 40), mv('Earthquake', 'Ground', 100)],
      }),
    ],
    notes: 'Pearl Elite Four Flint. Identical to Diamond — preserves the famous mixed roster.',
  }),
  boss({
    id: 'dpp-e4-flint-pt',
    name: 'Elite Four Flint',
    location: 'Pokémon League',
    order: 62,
    category: 'elite-four',
    levelCap: 57,
    game: 'Platinum',
    team: [
      mon('Houndoom', 52, ['Dark', 'Fire'], {
        ability: 'Early Bird',
        moves: [mv('Flamethrower', 'Fire', 95), mv('Sludge Bomb', 'Poison', 90), mv('Dark Pulse', 'Dark', 80), mv('Sunny Day', 'Fire')],
      }),
      mon('Flareon', 55, ['Fire'], {
        ability: 'Flash Fire',
        moves: [mv('Overheat', 'Fire', 140), mv('Giga Impact', 'Normal', 150), mv('Quick Attack', 'Normal', 40), mv('Will-O-Wisp', 'Fire')],
      }),
      mon('Rapidash', 53, ['Fire'], {
        ability: 'Run Away',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Solar Beam', 'Grass', 120), mv('Bounce', 'Flying', 85), mv('Sunny Day', 'Fire')],
      }),
      mon('Infernape', 55, ['Fire', 'Fighting'], {
        ability: 'Blaze',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Thunder Punch', 'Electric', 75), mv('Mach Punch', 'Fighting', 40), mv('Earthquake', 'Ground', 100)],
      }),
      mon('Magmortar', 57, ['Fire'], {
        ability: 'Flame Body',
        item: 'Sitrus Berry',
        moves: [mv('Flamethrower', 'Fire', 95), mv('Thunderbolt', 'Electric', 90), mv('Solar Beam', 'Grass', 120), mv('Hyper Beam', 'Normal', 150)],
      }),
    ],
    notes: 'Platinum Elite Four Flint — corrected to Fire-focused (Houndoom/Flareon/Rapidash/Infernape/Magmortar). Pt levels lower than DP per Pt rebalance.',
  }),

  // Elite Four — Lucian (Psychic).
  boss({
    id: 'dpp-e4-lucian-d',
    name: 'Elite Four Lucian',
    location: 'Pokémon League',
    order: 63,
    category: 'elite-four',
    levelCap: 63,
    game: 'Diamond',
    team: [
      mon('Mr. Mime', 59, ['Psychic'], { ability: 'Soundproof', moves: [mv('Psychic', 'Psychic', 90), mv('Thunderbolt', 'Electric', 90), mv('Reflect', 'Psychic'), mv('Light Screen', 'Psychic')] }),
      mon('Girafarig', 59, ['Normal', 'Psychic'], { ability: 'Inner Focus', moves: [mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80), mv('Double Hit', 'Normal', 35), mv('Crunch', 'Dark', 80)] }),
      mon('Medicham', 60, ['Fighting', 'Psychic'], { ability: 'Pure Power', moves: [mv('Drain Punch', 'Fighting', 75), mv('Fire Punch', 'Fire', 75), mv('Thunder Punch', 'Electric', 75), mv('Ice Punch', 'Ice', 75)] }),
      mon('Alakazam', 60, ['Psychic'], { ability: 'Synchronize', moves: [mv('Psychic', 'Psychic', 90), mv('Energy Ball', 'Grass', 90), mv('Focus Blast', 'Fighting', 120), mv('Recover', 'Normal')] }),
      mon('Bronzong', 63, ['Steel', 'Psychic'], { ability: 'Levitate', item: 'Sitrus Berry', moves: [mv('Psychic', 'Psychic', 90), mv('Gyro Ball', 'Steel'), mv('Earthquake', 'Ground', 100), mv('Calm Mind', 'Psychic')] }),
    ],
    notes: 'Diamond Elite Four Lucian (Psychic specialist).',
  }),
  boss({
    id: 'dpp-e4-lucian-p',
    name: 'Elite Four Lucian',
    location: 'Pokémon League',
    order: 63,
    category: 'elite-four',
    levelCap: 63,
    game: 'Pearl',
    team: [
      mon('Mr. Mime', 59, ['Psychic'], { ability: 'Soundproof', moves: [mv('Psychic', 'Psychic', 90), mv('Thunderbolt', 'Electric', 90), mv('Reflect', 'Psychic'), mv('Light Screen', 'Psychic')] }),
      mon('Girafarig', 59, ['Normal', 'Psychic'], { ability: 'Inner Focus', moves: [mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80), mv('Double Hit', 'Normal', 35), mv('Crunch', 'Dark', 80)] }),
      mon('Medicham', 60, ['Fighting', 'Psychic'], { ability: 'Pure Power', moves: [mv('Drain Punch', 'Fighting', 75), mv('Fire Punch', 'Fire', 75), mv('Thunder Punch', 'Electric', 75), mv('Ice Punch', 'Ice', 75)] }),
      mon('Alakazam', 60, ['Psychic'], { ability: 'Synchronize', moves: [mv('Psychic', 'Psychic', 90), mv('Energy Ball', 'Grass', 90), mv('Focus Blast', 'Fighting', 120), mv('Recover', 'Normal')] }),
      mon('Bronzong', 63, ['Steel', 'Psychic'], { ability: 'Levitate', item: 'Sitrus Berry', moves: [mv('Psychic', 'Psychic', 90), mv('Gyro Ball', 'Steel'), mv('Earthquake', 'Ground', 100), mv('Calm Mind', 'Psychic')] }),
    ],
    notes: 'Pearl Elite Four Lucian. Identical to Diamond.',
  }),
  boss({
    id: 'dpp-e4-lucian-pt',
    name: 'Elite Four Lucian',
    location: 'Pokémon League',
    order: 63,
    category: 'elite-four',
    levelCap: 59,
    game: 'Platinum',
    team: [
      mon('Mr. Mime', 53, ['Psychic'], {
        ability: 'Soundproof',
        moves: [mv('Psychic', 'Psychic', 90), mv('Thunderbolt', 'Electric', 90), mv('Reflect', 'Psychic'), mv('Light Screen', 'Psychic')],
      }),
      mon('Espeon', 55, ['Psychic'], { ability: 'Synchronize', moves: [mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80), mv('Quick Attack', 'Normal', 40), mv('Signal Beam', 'Bug', 75)] }),
      mon('Bronzong', 54, ['Steel', 'Psychic'], {
        ability: 'Levitate',
        moves: [mv('Psychic', 'Psychic', 90), mv('Gyro Ball', 'Steel'), mv('Earthquake', 'Ground', 100), mv('Calm Mind', 'Psychic')],
      }),
      mon('Alakazam', 56, ['Psychic'], {
        ability: 'Synchronize',
        moves: [mv('Psychic', 'Psychic', 90), mv('Energy Ball', 'Grass', 90), mv('Focus Blast', 'Fighting', 120), mv('Recover', 'Normal')],
      }),
      mon('Gallade', 59, ['Psychic', 'Fighting'], { ability: 'Steadfast', item: 'Sitrus Berry', moves: [mv('Drain Punch', 'Fighting', 75), mv('Psycho Cut', 'Psychic', 70), mv('Leaf Blade', 'Grass', 90), mv('Stone Edge', 'Rock', 100)] }),
    ],
    notes: 'Platinum Elite Four Lucian. Swaps Girafarig/Medicham → Espeon/Gallade; Pt rebalanced levels (lower).',
  }),

  // Champion Cynthia.
  boss({
    id: 'dpp-champion-cynthia-d',
    name: 'Champion Cynthia',
    location: 'Pokémon League',
    order: 64,
    category: 'champion',
    levelCap: 66,
    game: 'Diamond',
    team: [
      mon('Spiritomb', 61, ['Ghost', 'Dark'], { ability: 'Pressure', moves: [mv('Dark Pulse', 'Dark', 80), mv('Psychic', 'Psychic', 90), mv('Silver Wind', 'Bug', 60), mv('Embargo', 'Dark')] }),
      mon('Roserade', 60, ['Grass', 'Poison'], { ability: 'Natural Cure', moves: [mv('Energy Ball', 'Grass', 90), mv('Sludge Bomb', 'Poison', 90), mv('Shadow Ball', 'Ghost', 80), mv('Extrasensory', 'Psychic', 80)] }),
      mon('Gastrodon', 60, ['Water', 'Ground'], { ability: 'Sticky Hold', moves: [mv('Muddy Water', 'Water', 90), mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Ice Beam', 'Ice', 95)] }),
      mon('Lucario', 63, ['Fighting', 'Steel'], { ability: 'Steadfast', moves: [mv('Aura Sphere', 'Fighting', 80), mv('Dragon Pulse', 'Dragon', 85), mv('Psychic', 'Psychic', 90), mv('Earthquake', 'Ground', 100)] }),
      mon('Milotic', 63, ['Water'], { ability: 'Marvel Scale', moves: [mv('Surf', 'Water', 95), mv('Ice Beam', 'Ice', 95), mv('Mirror Coat', 'Psychic'), mv('Aqua Ring', 'Water')] }),
      mon('Garchomp', 66, ['Dragon', 'Ground'], { ability: 'Sand Veil', item: 'Sitrus Berry', moves: [mv('Dragon Rush', 'Dragon', 100), mv('Earthquake', 'Ground', 100), mv('Brick Break', 'Fighting', 75), mv('Giga Impact', 'Normal', 150)] }),
    ],
    notes: 'Diamond Champion Cynthia.',
  }),
  boss({
    id: 'dpp-champion-cynthia-p',
    name: 'Champion Cynthia',
    location: 'Pokémon League',
    order: 64,
    category: 'champion',
    levelCap: 66,
    game: 'Pearl',
    team: [
      mon('Spiritomb', 61, ['Ghost', 'Dark'], { ability: 'Pressure', moves: [mv('Dark Pulse', 'Dark', 80), mv('Psychic', 'Psychic', 90), mv('Silver Wind', 'Bug', 60), mv('Embargo', 'Dark')] }),
      mon('Roserade', 60, ['Grass', 'Poison'], { ability: 'Natural Cure', moves: [mv('Energy Ball', 'Grass', 90), mv('Sludge Bomb', 'Poison', 90), mv('Shadow Ball', 'Ghost', 80), mv('Extrasensory', 'Psychic', 80)] }),
      mon('Gastrodon', 60, ['Water', 'Ground'], { ability: 'Sticky Hold', moves: [mv('Muddy Water', 'Water', 90), mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Ice Beam', 'Ice', 95)] }),
      mon('Lucario', 63, ['Fighting', 'Steel'], { ability: 'Steadfast', moves: [mv('Aura Sphere', 'Fighting', 80), mv('Dragon Pulse', 'Dragon', 85), mv('Psychic', 'Psychic', 90), mv('Earthquake', 'Ground', 100)] }),
      mon('Milotic', 63, ['Water'], { ability: 'Marvel Scale', moves: [mv('Surf', 'Water', 95), mv('Ice Beam', 'Ice', 95), mv('Mirror Coat', 'Psychic'), mv('Aqua Ring', 'Water')] }),
      mon('Garchomp', 66, ['Dragon', 'Ground'], { ability: 'Sand Veil', item: 'Sitrus Berry', moves: [mv('Dragon Rush', 'Dragon', 100), mv('Earthquake', 'Ground', 100), mv('Brick Break', 'Fighting', 75), mv('Giga Impact', 'Normal', 150)] }),
    ],
    notes: 'Pearl Champion Cynthia. Identical team to Diamond.',
  }),
  boss({
    id: 'dpp-champion-cynthia-pt',
    name: 'Champion Cynthia',
    location: 'Pokémon League',
    order: 64,
    category: 'champion',
    levelCap: 62,
    game: 'Platinum',
    team: [
      mon('Spiritomb', 58, ['Ghost', 'Dark'], { ability: 'Pressure', moves: [mv('Dark Pulse', 'Dark', 80), mv('Psychic', 'Psychic', 90), mv('Silver Wind', 'Bug', 60), mv('Shadow Ball', 'Ghost', 80)] }),
      mon('Roserade', 58, ['Grass', 'Poison'], { ability: 'Natural Cure', moves: [mv('Energy Ball', 'Grass', 90), mv('Sludge Bomb', 'Poison', 90), mv('Toxic', 'Poison'), mv('Extrasensory', 'Psychic', 80)] }),
      mon('Togekiss', 60, ['Normal', 'Flying'], { ability: 'Hustle', moves: [mv('Air Slash', 'Flying', 75), mv('Aura Sphere', 'Fighting', 80), mv('Water Pulse', 'Water', 60), mv('Shock Wave', 'Electric', 60)] }),
      mon('Lucario', 60, ['Fighting', 'Steel'], { ability: 'Steadfast', moves: [mv('Aura Sphere', 'Fighting', 80), mv('ExtremeSpeed', 'Normal', 80), mv('Shadow Ball', 'Ghost', 80), mv('Stone Edge', 'Rock', 100)] }),
      mon('Milotic', 58, ['Water'], { ability: 'Marvel Scale', moves: [mv('Surf', 'Water', 95), mv('Ice Beam', 'Ice', 95), mv('Mirror Coat', 'Psychic'), mv('Dragon Pulse', 'Dragon', 85)] }),
      mon('Garchomp', 62, ['Dragon', 'Ground'], { ability: 'Sand Veil', item: 'Sitrus Berry', moves: [mv('Dragon Rush', 'Dragon', 100), mv('Earthquake', 'Ground', 100), mv('Flamethrower', 'Fire', 95), mv('Giga Impact', 'Normal', 150)] }),
    ],
    notes: 'Platinum Champion Cynthia (first battle, pre-Stark Mountain). Swaps Gastrodon → Togekiss; all six Pokémon have unique types per Pt design intent; levels lower than DP (Pt rebalanced).',
  }),
];

frlgBossesAppend(dppBosses, pass7Bosses);

function frlgBossesAppend<T>(target: T[], source: T[]): void {
  for (const item of source) target.push(item);
}

export function getDppBossesForGame(gameVersion: 'Diamond' | 'Pearl' | 'Platinum'): BossTrainer[] {
  return dppBosses.filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion);
}

export { dppBosses };
