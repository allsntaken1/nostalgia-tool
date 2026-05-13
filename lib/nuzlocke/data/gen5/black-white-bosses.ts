import type { StarterChoice } from '@/app/nuzlocke/types';
import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

type BwMove = NonNullable<BossTrainerPokemon['moves']>[number];
type BwBossCategory = 'rival' | 'gym' | 'boss' | 'evil-team' | 'elite-four' | 'champion';

const mv = (name: string, type: BwMove['type'], power: number | null = null): BwMove => ({ name, type, power });
const mon = (species: string, level: number, types: BossTrainerPokemon['types'], extras: Partial<BossTrainerPokemon> = {}): BossTrainerPokemon => ({ species, level, types, ...extras });
const TODO_MOVES: BwMove[] = [];

const rivalVariants = (variants: Record<StarterChoice, BossTrainerPokemon[]>): BossTrainer['variantsByRivalStarterChoice'] => variants;

const boss = ({
  id,
  name,
  location,
  order,
  category,
  levelCap,
  game = 'Both',
  team,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: BwBossCategory;
  levelCap?: number;
  game?: BossTrainer['game'];
  team?: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: BossTrainer['variantsByRivalStarterChoice'];
  notes?: string;
}): BossTrainer => ({
  id,
  name,
  category,
  game,
  location,
  recommendedOrder: order,
  levelCap,
  notes: notes ?? location,
  baseTeam: Array.isArray(team) ? team : [],
  ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
});

// Variant keys match the app's rival starter convention:
// grass/fire/water represent the rival starter returned by getRivalStarterChoice(playerStarterChoice).
// For Cheren this is his actual starter. For Bianca this maps to her weaker leftover starter.
export const blackWhiteBosses: BossTrainer[] = [
  boss({
    id: 'bianca-1-bw',
    name: 'Bianca',
    location: 'Nuvema Town',
    order: 1,
    category: 'rival',
    levelCap: 5,
    variantsByRivalStarterChoice: rivalVariants({
      fire: [mon('Oshawott', 5, ['Water'], { moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal')] })],
      water: [mon('Snivy', 5, ['Grass'], { moves: [mv('Tackle', 'Normal', 50), mv('Leer', 'Normal')] })],
      grass: [mon('Tepig', 5, ['Fire'], { moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal')] })],
    }),
  }),
  boss({
    id: 'cheren-1-bw',
    name: 'Cheren',
    location: 'Nuvema Town',
    order: 2,
    category: 'rival',
    levelCap: 5,
    variantsByRivalStarterChoice: rivalVariants({
      fire: [mon('Tepig', 5, ['Fire'], { moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal')] })],
      water: [mon('Oshawott', 5, ['Water'], { moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal')] })],
      grass: [mon('Snivy', 5, ['Grass'], { moves: [mv('Tackle', 'Normal', 50), mv('Leer', 'Normal')] })],
    }),
  }),
  boss({
    id: 'bianca-2-bw',
    name: 'Bianca',
    location: 'Route 2',
    order: 3,
    category: 'rival',
    levelCap: 7,
    variantsByRivalStarterChoice: rivalVariants({
      // Variant keys are the RIVAL's starter type (returned by getRivalStarterChoice).
      // Bianca picks the starter weak to the player; her variant.fire team is shown
      // when the player chose Snivy, etc.
      fire: [
        mon('Lillipup', 6, ['Normal'], { ability: 'Vital Spirit', moves: [mv('Leer', 'Normal'), mv('Tackle', 'Normal', 50), mv('Odor Sleuth', 'Normal')] }),
        mon('Oshawott', 7, ['Water'], { ability: 'Torrent', moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal'), mv('Water Gun', 'Water', 40)] }),
      ],
      water: [
        mon('Lillipup', 6, ['Normal'], { ability: 'Vital Spirit', moves: [mv('Leer', 'Normal'), mv('Tackle', 'Normal', 50), mv('Odor Sleuth', 'Normal')] }),
        mon('Snivy', 7, ['Grass'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 50), mv('Leer', 'Normal'), mv('Vine Whip', 'Grass', 35)] }),
      ],
      grass: [
        mon('Lillipup', 6, ['Normal'], { ability: 'Vital Spirit', moves: [mv('Leer', 'Normal'), mv('Tackle', 'Normal', 50), mv('Odor Sleuth', 'Normal')] }),
        mon('Tepig', 7, ['Fire'], { ability: 'Blaze', moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal'), mv('Ember', 'Fire', 40)] }),
      ],
    }),
    notes: 'Route 2 rival battle. Verified per Bulbapedia (Bianca page).',
  }),
  boss({
    id: 'n-1-bw',
    name: 'N',
    location: 'Accumula Town',
    order: 4,
    category: 'boss',
    levelCap: 7,
    team: [
      mon('Purrloin', 7, ['Dark'], { ability: 'Unburden', moves: [mv('Scratch', 'Normal', 40), mv('Growl', 'Normal')] }),
    ],
    notes: 'First N battle, in the Accumula Town square after his speech. Verified per Bulbapedia (Accumula Town page).',
  }),
  boss({
    id: 'cheren-2-bw',
    name: 'Cheren',
    location: 'Striaton City',
    order: 5,
    category: 'rival',
    levelCap: 8,
    variantsByRivalStarterChoice: rivalVariants({
      fire: [
        mon('Purrloin', 8, ['Dark'], { ability: 'Unburden', moves: [mv('Scratch', 'Normal', 40), mv('Growl', 'Normal'), mv('Assist', 'Normal')] }),
        mon('Tepig', 8, ['Fire'], { ability: 'Blaze', item: 'Oran Berry', moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal'), mv('Ember', 'Fire', 40)] }),
      ],
      water: [
        mon('Purrloin', 8, ['Dark'], { ability: 'Unburden', moves: [mv('Scratch', 'Normal', 40), mv('Growl', 'Normal'), mv('Assist', 'Normal')] }),
        mon('Oshawott', 8, ['Water'], { ability: 'Torrent', item: 'Oran Berry', moves: [mv('Tackle', 'Normal', 50), mv('Tail Whip', 'Normal'), mv('Water Gun', 'Water', 40)] }),
      ],
      grass: [
        mon('Purrloin', 8, ['Dark'], { ability: 'Unburden', moves: [mv('Scratch', 'Normal', 40), mv('Growl', 'Normal'), mv('Assist', 'Normal')] }),
        mon('Snivy', 8, ['Grass'], { ability: 'Overgrow', item: 'Oran Berry', moves: [mv('Tackle', 'Normal', 50), mv('Leer', 'Normal'), mv('Vine Whip', 'Grass', 35)] }),
      ],
    }),
    notes: 'Striaton City rival battle. Starter holds an Oran Berry. Verified per Bulbapedia (Cheren page).',
  }),
  boss({
    id: 'team-plasma-dreamyard-bw',
    name: 'Team Plasma (Dreamyard)',
    location: 'Dreamyard',
    order: 5,
    category: 'evil-team',
    levelCap: 10,
    team: [
      mon('Patrat', 10, ['Normal'], { moves: TODO_MOVES }),
      mon('Purrloin', 10, ['Dark'], { moves: TODO_MOVES }),
    ],
    notes: 'Required story double-battle versus two Team Plasma Grunts at the Dreamyard, fought alongside Cheren after Bianca\'s Musharna is attacked. Each grunt brings one Pokémon at level 10 (Patrat and Purrloin, one per grunt). Verified per Bulbapedia (Dreamyard page). TODO: confirm exact Patrat/Purrloin movesets for these specific grunts.',
  }),
  boss({
    id: 'chili-bw',
    name: 'Chili',
    location: 'Striaton Gym',
    order: 6,
    category: 'gym',
    levelCap: 14,
    team: [
      mon('Lillipup', 12, ['Normal'], { moves: [mv('Bite', 'Dark', 60), mv('Work Up', 'Normal')] }),
      mon('Pansear', 14, ['Fire'], { moves: [mv('Incinerate', 'Fire', 30), mv('Work Up', 'Normal')] }),
    ],
    notes: 'Used when the player chose Snivy.',
  }),
  boss({
    id: 'cress-bw',
    name: 'Cress',
    location: 'Striaton Gym',
    order: 7,
    category: 'gym',
    levelCap: 14,
    team: [
      mon('Lillipup', 12, ['Normal'], { moves: [mv('Bite', 'Dark', 60), mv('Work Up', 'Normal')] }),
      mon('Panpour', 14, ['Water'], { moves: [mv('Water Gun', 'Water', 40), mv('Work Up', 'Normal')] }),
    ],
    notes: 'Used when the player chose Tepig.',
  }),
  boss({
    id: 'cilan-bw',
    name: 'Cilan',
    location: 'Striaton Gym',
    order: 8,
    category: 'gym',
    levelCap: 14,
    team: [
      mon('Lillipup', 12, ['Normal'], { moves: [mv('Bite', 'Dark', 60), mv('Work Up', 'Normal')] }),
      mon('Pansage', 14, ['Grass'], { moves: [mv('Vine Whip', 'Grass', 45), mv('Work Up', 'Normal')] }),
    ],
    notes: 'Used when the player chose Oshawott.',
  }),
  boss({
    id: 'cheren-3-bw',
    name: 'Cheren',
    location: 'Route 3',
    order: 9,
    category: 'rival',
    levelCap: 14,
    variantsByRivalStarterChoice: rivalVariants({
      // Cheren picks the starter strong against the player. Starter holds an Oran Berry.
      // Verified per Bulbapedia (Cheren page).
      fire: [
        mon('Purrloin', 12, ['Dark'], { ability: 'Unburden', moves: [mv('Fury Swipes', 'Normal', 18), mv('Growl', 'Normal'), mv('Assist', 'Normal'), mv('Sand-Attack', 'Ground')] }),
        mon('Tepig', 14, ['Fire'], { ability: 'Blaze', item: 'Oran Berry', moves: [mv('Odor Sleuth', 'Normal'), mv('Tail Whip', 'Normal'), mv('Ember', 'Fire', 40), mv('Defense Curl', 'Normal')] }),
      ],
      water: [
        mon('Purrloin', 12, ['Dark'], { ability: 'Unburden', moves: [mv('Fury Swipes', 'Normal', 18), mv('Growl', 'Normal'), mv('Assist', 'Normal'), mv('Sand-Attack', 'Ground')] }),
        mon('Oshawott', 14, ['Water'], { ability: 'Torrent', item: 'Oran Berry', moves: [mv('Focus Energy', 'Normal'), mv('Tail Whip', 'Normal'), mv('Water Gun', 'Water', 40), mv('Water Sport', 'Water')] }),
      ],
      grass: [
        mon('Purrloin', 12, ['Dark'], { ability: 'Unburden', moves: [mv('Fury Swipes', 'Normal', 18), mv('Growl', 'Normal'), mv('Assist', 'Normal'), mv('Sand-Attack', 'Ground')] }),
        mon('Snivy', 14, ['Grass'], { ability: 'Overgrow', item: 'Oran Berry', moves: [mv('Growth', 'Normal'), mv('Leer', 'Normal'), mv('Vine Whip', 'Grass', 35), mv('Wrap', 'Normal', 15)] }),
      ],
    }),
    notes: 'Route 3 rival battle. Cheren\'s starter holds an Oran Berry. Verified per Bulbapedia (Cheren page).',
  }),
  boss({
    id: 'team-plasma-wellspring-cave-bw',
    name: 'Team Plasma (Wellspring Cave)',
    location: 'Wellspring Cave',
    order: 9,
    category: 'evil-team',
    levelCap: 12,
    team: [
      mon('Patrat', 12, ['Normal'], { moves: TODO_MOVES }),
      mon('Patrat', 12, ['Normal'], { moves: TODO_MOVES }),
    ],
    notes: 'Required story double-battle versus two Team Plasma Grunts on 1F of Wellspring Cave, fought alongside Cheren. Each grunt brings a single Patrat at level 12. Verified per Bulbapedia (Wellspring Cave page). TODO: confirm exact Patrat movesets for these specific grunts.',
  }),
  boss({
    id: 'n-2-bw',
    name: 'N',
    location: 'Nacrene City',
    order: 10,
    category: 'boss',
    levelCap: 13,
    team: [
      mon('Pidove', 13, ['Normal', 'Flying'], { ability: 'Big Pecks', moves: [mv('Gust', 'Flying', 40), mv('Quick Attack', 'Normal', 40), mv('Leer', 'Normal'), mv('Growl', 'Normal')] }),
      mon('Timburr', 13, ['Fighting'], { ability: 'Sheer Force', moves: [mv('Low Kick', 'Fighting'), mv('Focus Energy', 'Normal'), mv('Bide', 'Normal'), mv('Leer', 'Normal')] }),
      mon('Tympole', 13, ['Water'], { ability: 'Swift Swim', moves: [mv('Supersonic', 'Normal'), mv('BubbleBeam', 'Water', 65), mv('Growl', 'Normal'), mv('Round', 'Normal', 60)] }),
    ],
    notes: 'Second N battle, in front of the Nacrene City museum. Verified per Bulbapedia (N page).',
  }),
  boss({
    id: 'lenora-bw',
    name: 'Lenora',
    location: 'Nacrene City',
    order: 11,
    category: 'gym',
    levelCap: 20,
    team: [
      mon('Herdier', 18, ['Normal'], { ability: 'Intimidate', moves: [mv('Take Down', 'Normal', 90), mv('Bite', 'Dark', 60), mv('Retaliate', 'Normal', 70), mv('Leer', 'Normal')] }),
      mon('Watchog', 20, ['Normal'], { ability: 'Illuminate', moves: [mv('Leer', 'Normal'), mv('Crunch', 'Dark', 80), mv('Retaliate', 'Normal', 70), mv('Hypnosis', 'Psychic')] }),
    ],
    notes: 'Nacrene Gym Leader (Normal-type). Awards the Basic Badge. Verified per Bulbapedia (Lenora page).',
  }),
  boss({
    id: 'team-plasma-pinwheel-forest-bw',
    name: 'Team Plasma (Pinwheel Forest)',
    location: 'Pinwheel Forest Inside',
    order: 11,
    category: 'evil-team',
    levelCap: 14,
    team: [],
    notes: 'Required story event chasing the stolen Dragon Skull through Pinwheel Forest, fought alongside Burgh. Multiple grunts. Verified that the encounter occurs per Bulbapedia (Pinwheel Forest page), but exact grunt teams and movesets are not surfaced. TODO: populate per-grunt teams when a cartridge-verified source is available.',
  }),
  boss({
    id: 'bianca-3-bw',
    name: 'Bianca',
    location: 'Castelia City',
    order: 11,
    category: 'rival',
    levelCap: 20,
    variantsByRivalStarterChoice: rivalVariants({
      // Bianca picks the starter weak to the player. Verified per Bulbapedia (Bianca page).
      // Fought at Castelia Gate (the building between Skyarrow Bridge and Castelia proper).
      fire: [
        mon('Herdier', 18, ['Normal'], { ability: 'Intimidate', moves: [mv('Odor Sleuth', 'Normal'), mv('Bite', 'Dark', 60), mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90)] }),
        mon('Pansear', 18, ['Fire'], { ability: 'Gluttony', moves: [mv('Lick', 'Ghost', 30), mv('Incinerate', 'Fire', 30), mv('Fury Swipes', 'Normal', 18), mv('Yawn', 'Normal')] }),
        mon('Munna', 18, ['Psychic'], { ability: 'Forewarn', moves: [mv('Yawn', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Imprison', 'Psychic'), mv('Moonlight', 'Normal')] }),
        mon('Dewott', 20, ['Water'], { ability: 'Torrent', moves: [mv('Water Sport', 'Water'), mv('Focus Energy', 'Normal'), mv('Razor Shell', 'Water', 75), mv('Fury Cutter', 'Bug', 20)] }),
      ],
      water: [
        mon('Herdier', 18, ['Normal'], { ability: 'Intimidate', moves: [mv('Odor Sleuth', 'Normal'), mv('Bite', 'Dark', 60), mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90)] }),
        mon('Pansage', 18, ['Grass'], { ability: 'Gluttony', moves: [mv('Lick', 'Ghost', 30), mv('Vine Whip', 'Grass', 35), mv('Fury Swipes', 'Normal', 18), mv('Leech Seed', 'Grass')] }),
        mon('Munna', 18, ['Psychic'], { ability: 'Forewarn', moves: [mv('Yawn', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Imprison', 'Psychic'), mv('Moonlight', 'Normal')] }),
        mon('Servine', 20, ['Grass'], { ability: 'Overgrow', moves: [mv('Wrap', 'Normal', 15), mv('Growth', 'Normal'), mv('Leaf Tornado', 'Grass', 65), mv('Leech Seed', 'Grass')] }),
      ],
      grass: [
        mon('Herdier', 18, ['Normal'], { ability: 'Intimidate', moves: [mv('Odor Sleuth', 'Normal'), mv('Bite', 'Dark', 60), mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90)] }),
        mon('Panpour', 18, ['Water'], { ability: 'Gluttony', moves: [mv('Lick', 'Ghost', 30), mv('Water Gun', 'Water', 40), mv('Fury Swipes', 'Normal', 18), mv('Water Sport', 'Water')] }),
        mon('Munna', 18, ['Psychic'], { ability: 'Forewarn', moves: [mv('Yawn', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Imprison', 'Psychic'), mv('Moonlight', 'Normal')] }),
        mon('Pignite', 20, ['Fire', 'Fighting'], { ability: 'Blaze', moves: [mv('Defense Curl', 'Normal'), mv('Flame Charge', 'Fire', 50), mv('Arm Thrust', 'Fighting', 15), mv('Smog', 'Poison', 30)] }),
      ],
    }),
    notes: 'Third Bianca rival battle, fought at Castelia Gate (the building between Skyarrow Bridge and Castelia City). Bianca brings 4 Pokémon including an evolved starter. Verified per Bulbapedia (Bianca page).',
  }),
  boss({
    id: 'burgh-bw',
    name: 'Burgh',
    location: 'Castelia City',
    order: 12,
    category: 'gym',
    levelCap: 23,
    team: [
      mon('Whirlipede', 21, ['Bug', 'Poison'], { moves: [mv('Screech', 'Normal'), mv('Pursuit', 'Dark', 40), mv('Poison Tail', 'Poison', 50), mv('Struggle Bug', 'Bug', 50)] }),
      mon('Dwebble', 21, ['Bug', 'Rock'], { moves: [mv('Sand-Attack', 'Ground'), mv('Faint Attack', 'Dark', 60), mv('Smack Down', 'Rock', 50), mv('Struggle Bug', 'Bug', 50)] }),
      mon('Leavanny', 23, ['Bug', 'Grass'], { moves: [mv('Protect', 'Normal'), mv('String Shot', 'Bug'), mv('Razor Leaf', 'Grass', 55), mv('Struggle Bug', 'Bug', 50)] }),
    ],
  }),
  boss({
    id: 'cheren-4-bw',
    name: 'Cheren',
    location: 'Route 4',
    order: 13,
    category: 'rival',
    levelCap: 22,
    variantsByRivalStarterChoice: rivalVariants({
      // Cheren picks the starter strong against the player. Starter holds a Sitrus Berry.
      // Verified per Bulbapedia (Cheren page).
      fire: [
        mon('Pidove', 20, ['Normal', 'Flying'], { ability: 'Super Luck', moves: [mv('Quick Attack', 'Normal', 40), mv('Leer', 'Normal'), mv('Air Cutter', 'Flying', 55), mv('Roost', 'Flying')] }),
        mon('Pansage', 20, ['Grass'], { ability: 'Gluttony', moves: [mv('Bite', 'Dark', 60), mv('Vine Whip', 'Grass', 35), mv('Leech Seed', 'Grass'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Liepard', 20, ['Dark'], { ability: 'Unburden', moves: [mv('Pursuit', 'Dark', 40), mv('Torment', 'Dark'), mv('Sand-Attack', 'Ground'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Pignite', 22, ['Fire', 'Fighting'], { ability: 'Blaze', item: 'Sitrus Berry', moves: [mv('Flame Charge', 'Fire', 50), mv('Defense Curl', 'Normal'), mv('Arm Thrust', 'Fighting', 15), mv('Smog', 'Poison', 30)] }),
      ],
      water: [
        mon('Pidove', 20, ['Normal', 'Flying'], { ability: 'Super Luck', moves: [mv('Quick Attack', 'Normal', 40), mv('Leer', 'Normal'), mv('Air Cutter', 'Flying', 55), mv('Roost', 'Flying')] }),
        mon('Pansear', 20, ['Fire'], { ability: 'Gluttony', moves: [mv('Bite', 'Dark', 60), mv('Incinerate', 'Fire', 30), mv('Yawn', 'Normal'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Liepard', 20, ['Dark'], { ability: 'Unburden', moves: [mv('Pursuit', 'Dark', 40), mv('Torment', 'Dark'), mv('Sand-Attack', 'Ground'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Dewott', 22, ['Water'], { ability: 'Torrent', item: 'Sitrus Berry', moves: [mv('Razor Shell', 'Water', 75), mv('Focus Energy', 'Normal'), mv('Water Sport', 'Water'), mv('Fury Cutter', 'Bug', 20)] }),
      ],
      grass: [
        mon('Pidove', 20, ['Normal', 'Flying'], { ability: 'Super Luck', moves: [mv('Quick Attack', 'Normal', 40), mv('Leer', 'Normal'), mv('Air Cutter', 'Flying', 55), mv('Roost', 'Flying')] }),
        mon('Panpour', 20, ['Water'], { ability: 'Gluttony', moves: [mv('Bite', 'Dark', 60), mv('Water Gun', 'Water', 40), mv('Water Sport', 'Water'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Liepard', 20, ['Dark'], { ability: 'Unburden', moves: [mv('Pursuit', 'Dark', 40), mv('Torment', 'Dark'), mv('Sand-Attack', 'Ground'), mv('Fury Swipes', 'Normal', 18)] }),
        mon('Servine', 22, ['Grass'], { ability: 'Overgrow', item: 'Sitrus Berry', moves: [mv('Leaf Tornado', 'Grass', 65), mv('Wrap', 'Normal', 15), mv('Leech Seed', 'Grass'), mv('Growth', 'Normal')] }),
      ],
    }),
    notes: 'Fourth Cheren rival battle, fought on Route 4 after Burgh\'s gym. Cheren\'s starter holds a Sitrus Berry. Verified per Bulbapedia (Cheren page).',
  }),
  boss({
    id: 'n-3-bw',
    name: 'N',
    location: 'Nimbasa City',
    order: 13,
    category: 'boss',
    levelCap: 22,
    team: [
      mon('Sandile', 22, ['Ground', 'Dark'], { ability: 'Moxie', moves: [mv('Assurance', 'Dark', 60), mv('Embargo', 'Dark'), mv('Sand Tomb', 'Ground', 35), mv('Mud-Slap', 'Ground', 20)] }),
      mon('Scraggy', 22, ['Dark', 'Fighting'], { ability: 'Shed Skin', moves: [mv('Swagger', 'Normal'), mv('Brick Break', 'Fighting', 75), mv('Headbutt', 'Normal', 70), mv('Faint Attack', 'Dark', 60)] }),
      mon('Darumaka', 22, ['Fire'], { ability: 'Hustle', moves: [mv('Fire Punch', 'Fire', 75), mv('Headbutt', 'Normal', 70), mv('Facade', 'Normal', 70), mv('Uproar', 'Normal', 90)] }),
      mon('Sigilyph', 22, ['Psychic', 'Flying'], { ability: 'Magic Guard', moves: [mv('Whirlwind', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Tailwind', 'Flying'), mv('Air Cutter', 'Flying', 55)] }),
    ],
    notes: 'Third N battle, at the Rondez-View Ferris Wheel in Nimbasa City. Verified per Bulbapedia (Nimbasa City page).',
  }),
  boss({
    id: 'elesa-bw',
    name: 'Elesa',
    location: 'Nimbasa City',
    order: 14,
    category: 'gym',
    levelCap: 27,
    team: [
      mon('Emolga', 25, ['Electric', 'Flying'], { moves: [mv('Quick Attack', 'Normal', 40), mv('Pursuit', 'Dark', 40), mv('Aerial Ace', 'Flying', 60), mv('Volt Switch', 'Electric', 70)] }),
      mon('Emolga', 25, ['Electric', 'Flying'], { moves: [mv('Quick Attack', 'Normal', 40), mv('Pursuit', 'Dark', 40), mv('Aerial Ace', 'Flying', 60), mv('Volt Switch', 'Electric', 70)] }),
      mon('Zebstrika', 27, ['Electric'], { moves: [mv('Quick Attack', 'Normal', 40), mv('Flame Charge', 'Fire', 50), mv('Spark', 'Electric', 65), mv('Volt Switch', 'Electric', 70)] }),
    ],
  }),
  boss({
    id: 'n-4-bw',
    name: 'N',
    location: 'Chargestone Cave',
    order: 15,
    category: 'boss',
    levelCap: 28,
    team: [
      mon('Boldore', 28, ['Rock'], { ability: 'Sturdy', moves: [mv('Mud-Slap', 'Ground', 20), mv('Iron Defense', 'Steel'), mv('Smack Down', 'Rock', 50), mv('Power Gem', 'Rock', 80)] }),
      mon('Ferroseed', 28, ['Grass', 'Steel'], { ability: 'Iron Barbs', moves: [mv('Metal Claw', 'Steel', 50), mv('Pin Missile', 'Bug', 25), mv('Gyro Ball', 'Steel'), mv('Iron Defense', 'Steel')] }),
      mon('Joltik', 28, ['Bug', 'Electric'], { ability: 'Unnerve', moves: [mv('Electroweb', 'Electric', 55), mv('Bug Bite', 'Bug', 60), mv('Gastro Acid', 'Poison'), mv('Slash', 'Normal', 70)] }),
      mon('Klink', 28, ['Steel'], { ability: 'Plus', moves: [mv('Gear Grind', 'Steel', 50), mv('ThunderShock', 'Electric', 40), mv('Bind', 'Normal', 15), mv('Charge Beam', 'Electric', 50)] }),
    ],
    notes: 'Fourth N battle, deep inside Chargestone Cave. Verified per Bulbapedia (Chargestone Cave page).',
  }),
  boss({
    id: 'bianca-4-bw',
    name: 'Bianca',
    location: 'Driftveil City',
    order: 15,
    category: 'rival',
    levelCap: 28,
    variantsByRivalStarterChoice: rivalVariants({
      // Bianca picks the starter weak to the player. Verified per Bulbapedia (Bianca page).
      fire: [
        mon('Herdier', 26, ['Normal'], { ability: 'Intimidate', moves: [mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90), mv('Work Up', 'Normal'), mv('Crunch', 'Dark', 80)] }),
        mon('Pansear', 26, ['Fire'], { ability: 'Gluttony', moves: [mv('Yawn', 'Normal'), mv('Bite', 'Dark', 60), mv('Flame Burst', 'Fire', 70), mv('Amnesia', 'Psychic')] }),
        mon('Musharna', 26, ['Psychic'], { ability: 'Forewarn', moves: [mv('Defense Curl', 'Normal'), mv('Lucky Chant', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Hypnosis', 'Psychic')] }),
        mon('Dewott', 28, ['Water'], { ability: 'Torrent', moves: [mv('Razor Shell', 'Water', 75), mv('Fury Cutter', 'Bug', 20), mv('Water Pulse', 'Water', 60), mv('Revenge', 'Fighting', 60)] }),
      ],
      water: [
        mon('Herdier', 26, ['Normal'], { ability: 'Intimidate', moves: [mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90), mv('Work Up', 'Normal'), mv('Crunch', 'Dark', 80)] }),
        mon('Pansage', 26, ['Grass'], { ability: 'Gluttony', moves: [mv('Yawn', 'Normal'), mv('Bite', 'Dark', 60), mv('Vine Whip', 'Grass', 35), mv('Amnesia', 'Psychic')] }),
        mon('Musharna', 26, ['Psychic'], { ability: 'Forewarn', moves: [mv('Defense Curl', 'Normal'), mv('Lucky Chant', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Hypnosis', 'Psychic')] }),
        mon('Servine', 28, ['Grass'], { ability: 'Overgrow', moves: [mv('Leaf Tornado', 'Grass', 65), mv('Leech Seed', 'Grass'), mv('Mega Drain', 'Grass', 40), mv('Slam', 'Normal', 80)] }),
      ],
      grass: [
        mon('Herdier', 26, ['Normal'], { ability: 'Intimidate', moves: [mv('Helping Hand', 'Normal'), mv('Take Down', 'Normal', 90), mv('Work Up', 'Normal'), mv('Crunch', 'Dark', 80)] }),
        mon('Panpour', 26, ['Water'], { ability: 'Gluttony', moves: [mv('Yawn', 'Normal'), mv('Bite', 'Dark', 60), mv('Water Gun', 'Water', 40), mv('Amnesia', 'Psychic')] }),
        mon('Musharna', 26, ['Psychic'], { ability: 'Forewarn', moves: [mv('Defense Curl', 'Normal'), mv('Lucky Chant', 'Normal'), mv('Psybeam', 'Psychic', 65), mv('Hypnosis', 'Psychic')] }),
        mon('Pignite', 28, ['Fire', 'Fighting'], { ability: 'Blaze', moves: [mv('Arm Thrust', 'Fighting', 15), mv('Smog', 'Poison', 30), mv('Rollout', 'Rock', 30), mv('Take Down', 'Normal', 90)] }),
      ],
    }),
    notes: 'Fourth Bianca rival battle, fought in Driftveil City after the Cold Storage Team Plasma sequence. Bianca brings 4 Pokémon including her evolved starter at lv 28. Verified per Bulbapedia (Bianca page).',
  }),
  boss({
    id: 'team-plasma-cold-storage-bw',
    name: 'Team Plasma (Cold Storage)',
    location: 'Cold Storage',
    order: 15,
    category: 'evil-team',
    levelCap: 24,
    team: [],
    notes: 'Required Team Plasma story sequence inside the Cold Storage facility, fought alongside Cheren as Clay closes in. Multiple grunts at lv 23-24 using Watchog / Scraggy / Liepard / Trubbish / Sandile. Verified per Bulbapedia (Cold Storage page) that the encounter is canonical. TODO: populate exact per-grunt teams and movesets when a cartridge-verified source is available.',
  }),
  boss({
    id: 'clay-bw',
    name: 'Clay',
    location: 'Driftveil City',
    order: 16,
    category: 'gym',
    levelCap: 31,
    team: [
      mon('Krokorok', 29, ['Ground', 'Dark'], { ability: 'Moxie', moves: [mv('Swagger', 'Normal'), mv('Torment', 'Dark'), mv('Crunch', 'Dark', 80), mv('Bulldoze', 'Ground', 60)] }),
      mon('Palpitoad', 29, ['Water', 'Ground'], { ability: 'Swift Swim', moves: [mv('Aqua Ring', 'Water'), mv('BubbleBeam', 'Water', 65), mv('Muddy Water', 'Water', 95), mv('Bulldoze', 'Ground', 60)] }),
      mon('Excadrill', 31, ['Ground', 'Steel'], { ability: 'Sand Rush', moves: [mv('Hone Claws', 'Dark'), mv('Slash', 'Normal', 70), mv('Rock Slide', 'Rock', 75), mv('Bulldoze', 'Ground', 60)] }),
    ],
    notes: 'Driftveil Gym Leader (Ground-type). Awards the Quake Badge. Verified per Bulbapedia (Clay page).',
  }),
  boss({
    id: 'skyla-bw',
    name: 'Skyla',
    location: 'Mistralton City',
    order: 17,
    category: 'gym',
    levelCap: 35,
    team: [
      mon('Swoobat', 33, ['Psychic', 'Flying'], { ability: 'Unaware', moves: [mv('Acrobatics', 'Flying', 55), mv('Amnesia', 'Psychic'), mv('Assurance', 'Dark', 50), mv('Heart Stamp', 'Psychic', 60)] }),
      mon('Unfezant', 33, ['Normal', 'Flying'], { ability: 'Big Pecks', moves: [mv('Leer', 'Normal'), mv('Quick Attack', 'Normal', 40), mv('Air Slash', 'Flying', 75), mv('Razor Wind', 'Normal', 80)] }),
      mon('Swanna', 35, ['Water', 'Flying'], { ability: 'Keen Eye', moves: [mv('Aqua Ring', 'Water'), mv('Aerial Ace', 'Flying', 60), mv('BubbleBeam', 'Water', 65), mv('Air Slash', 'Flying', 75)] }),
    ],
    notes: 'Mistralton Gym Leader (Flying-type). Awards the Jet Badge. Verified per Bulbapedia (Skyla page).',
  }),
  boss({
    id: 'brycen-bw',
    name: 'Brycen',
    location: 'Icirrus City',
    order: 18,
    category: 'gym',
    levelCap: 39,
    team: [
      mon('Vanillish', 37, ['Ice'], { ability: 'Ice Body', moves: [mv('Acid Armor', 'Poison'), mv('Astonish', 'Ghost', 30), mv('Mirror Shot', 'Steel', 65), mv('Frost Breath', 'Ice', 40)] }),
      mon('Cryogonal', 37, ['Ice'], { ability: 'Levitate', moves: [mv('Reflect', 'Psychic'), mv('Rapid Spin', 'Normal', 20), mv('Aurora Beam', 'Ice', 65), mv('Frost Breath', 'Ice', 40)] }),
      mon('Beartic', 39, ['Ice'], { ability: 'Snow Cloak', moves: [mv('Swagger', 'Normal'), mv('Brine', 'Water', 65), mv('Slash', 'Normal', 70), mv('Icicle Crash', 'Ice', 85)] }),
    ],
    notes: 'Icirrus Gym Leader (Ice-type). Awards the Freeze Badge. Verified per Bulbapedia (Brycen page).',
  }),
  boss({
    id: 'drayden-black-bw',
    name: 'Drayden',
    location: 'Opelucid City',
    order: 19,
    category: 'gym',
    levelCap: 43,
    game: 'Black',
    team: [
      mon('Fraxure', 41, ['Dragon'], { ability: 'Rivalry', moves: [mv('Dragon Dance', 'Dragon'), mv('Dragon Rage', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Dragon Tail', 'Dragon', 60)] }),
      mon('Druddigon', 41, ['Dragon'], { ability: 'Rough Skin', moves: [mv('Revenge', 'Fighting', 60), mv('Chip Away', 'Normal', 70), mv('Night Slash', 'Dark', 70), mv('Dragon Tail', 'Dragon', 60)] }),
      mon('Haxorus', 43, ['Dragon'], { ability: 'Rivalry', moves: [mv('Dragon Dance', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Slash', 'Normal', 70), mv('Dragon Tail', 'Dragon', 60)] }),
    ],
    notes: 'Opelucid Gym Leader (Dragon-type) in Black. Awards the Legend Badge. Verified per Bulbapedia (Drayden page).',
  }),
  boss({
    id: 'iris-white-bw',
    name: 'Iris',
    location: 'Opelucid City',
    order: 19,
    category: 'gym',
    levelCap: 43,
    game: 'White',
    team: [
      mon('Fraxure', 41, ['Dragon'], { ability: 'Rivalry', moves: [mv('Dragon Tail', 'Dragon', 60), mv('Dragon Dance', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Dragon Rage', 'Dragon')] }),
      mon('Druddigon', 41, ['Dragon'], { ability: 'Sheer Force', moves: [mv('Dragon Tail', 'Dragon', 60), mv('Revenge', 'Fighting', 60), mv('Night Slash', 'Dark', 70), mv('Chip Away', 'Normal', 70)] }),
      mon('Haxorus', 43, ['Dragon'], { ability: 'Mold Breaker', moves: [mv('Dragon Tail', 'Dragon', 60), mv('Dragon Dance', 'Dragon'), mv('Slash', 'Normal', 70), mv('Assurance', 'Dark', 50)] }),
    ],
    notes: 'Opelucid Gym Leader (Dragon-type) in White. Awards the Legend Badge. Verified per Bulbapedia (Iris page).',
  }),
  boss({
    id: 'shauntal-bw',
    name: 'Shauntal',
    location: 'Pokemon League',
    order: 20,
    category: 'elite-four',
    levelCap: 50,
    team: [
      mon('Cofagrigus', 48, ['Ghost'], { moves: [mv('Psychic', 'Psychic', 90), mv('Will-O-Wisp', 'Fire'), mv('Shadow Ball', 'Ghost', 80), mv('Grass Knot', 'Grass')] }),
      mon('Jellicent', 48, ['Water', 'Ghost'], { moves: [mv('Shadow Ball', 'Ghost', 80), mv('Surf', 'Water', 95), mv('Energy Ball', 'Grass', 80), mv('Recover', 'Normal')] }),
      mon('Golurk', 48, ['Ground', 'Ghost'], { moves: TODO_MOVES }),
      mon('Chandelure', 50, ['Ghost', 'Fire'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for Golurk and Chandelure.',
  }),
  boss({
    id: 'grimsley-bw',
    name: 'Grimsley',
    location: 'Pokemon League',
    order: 21,
    category: 'elite-four',
    levelCap: 50,
    team: [
      mon('Scrafty', 48, ['Dark', 'Fighting'], { moves: [mv('Sand-Attack', 'Ground'), mv('Crunch', 'Dark', 80), mv('Poison Jab', 'Poison', 80), mv('Brick Break', 'Fighting', 75)] }),
      mon('Krookodile', 48, ['Ground', 'Dark'], { moves: [mv('Crunch', 'Dark', 80), mv('Dragon Claw', 'Dragon', 80), mv('Foul Play', 'Dark', 95), mv('Earthquake', 'Ground', 100)] }),
      mon('Liepard', 48, ['Dark'], { moves: [mv('Fake Out', 'Normal', 40), mv('Attract', 'Normal'), mv('Aerial Ace', 'Flying', 60), mv('Night Slash', 'Dark', 70)] }),
      mon('Bisharp', 50, ['Dark', 'Steel'], { moves: [mv('X-Scissor', 'Bug', 80), mv('Night Slash', 'Dark', 70), mv('Metal Claw', 'Steel', 50), mv('Aerial Ace', 'Flying', 60)] }),
    ],
  }),
  boss({
    id: 'caitlin-bw',
    name: 'Caitlin',
    location: 'Pokemon League',
    order: 22,
    category: 'elite-four',
    levelCap: 50,
    team: [
      mon('Reuniclus', 48, ['Psychic'], { moves: [mv('Energy Ball', 'Grass', 80), mv('Thunder', 'Electric', 120), mv('Focus Blast', 'Fighting', 120), mv('Psychic', 'Psychic', 90)] }),
      mon('Musharna', 48, ['Psychic'], { moves: [mv('Reflect', 'Psychic'), mv('Charge Beam', 'Electric', 50), mv('Shadow Ball', 'Ghost', 80), mv('Psychic', 'Psychic', 90)] }),
      mon('Sigilyph', 48, ['Psychic', 'Flying'], { moves: TODO_MOVES }),
      mon('Gothitelle', 50, ['Psychic'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for Sigilyph and Gothitelle.',
  }),
  boss({
    id: 'marshal-bw',
    name: 'Marshal',
    location: 'Pokemon League',
    order: 23,
    category: 'elite-four',
    levelCap: 50,
    team: [
      mon('Throh', 48, ['Fighting'], { moves: TODO_MOVES }),
      mon('Sawk', 48, ['Fighting'], { moves: TODO_MOVES }),
      mon('Conkeldurr', 48, ['Fighting'], { moves: TODO_MOVES }),
      mon('Mienshao', 50, ['Fighting'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for Marshal.',
  }),
  boss({
    id: 'n-final-black-bw',
    name: 'N',
    location: "N's Castle",
    order: 24,
    category: 'boss',
    levelCap: 52,
    game: 'Black',
    team: [
      mon('Zekrom', 52, ['Dragon', 'Electric'], { moves: [mv('Fusion Bolt', 'Electric', 100), mv('Zen Headbutt', 'Psychic', 80), mv('Giga Impact', 'Normal', 150), mv('Light Screen', 'Psychic')] }),
      mon('Carracosta', 50, ['Water', 'Rock'], { moves: [mv('Stone Edge', 'Rock', 100), mv('Aqua Jet', 'Water', 40), mv('Crunch', 'Dark', 80), mv('Waterfall', 'Water', 80)] }),
      mon('Vanilluxe', 50, ['Ice'], { moves: [mv('Blizzard', 'Ice', 120), mv('Hail', 'Ice'), mv('Flash Cannon', 'Steel', 80), mv('Frost Breath', 'Ice', 40)] }),
      mon('Archeops', 50, ['Rock', 'Flying'], { moves: [mv('Stone Edge', 'Rock', 100), mv('Acrobatics', 'Flying', 55), mv('Dragon Claw', 'Dragon', 80), mv('Crunch', 'Dark', 80)] }),
      mon('Zoroark', 50, ['Dark'], { moves: [mv('Flamethrower', 'Fire', 95), mv('Focus Blast', 'Fighting', 120), mv('Night Slash', 'Dark', 70), mv('Retaliate', 'Normal', 70)] }),
      mon('Klinklang', 50, ['Steel'], { moves: [mv('Flash Cannon', 'Steel', 80), mv('Metal Sound', 'Steel'), mv('Hyper Beam', 'Normal', 150), mv('Thunderbolt', 'Electric', 95)] }),
    ],
  }),
  boss({
    id: 'n-final-white-bw',
    name: 'N',
    location: "N's Castle",
    order: 24,
    category: 'boss',
    levelCap: 52,
    game: 'White',
    team: [
      mon('Reshiram', 52, ['Dragon', 'Fire'], { moves: [mv('Hyper Beam', 'Normal', 150), mv('Fusion Flare', 'Fire', 100), mv('Extrasensory', 'Psychic', 80), mv('Reflect', 'Psychic')] }),
      mon('Carracosta', 50, ['Water', 'Rock'], { moves: [mv('Stone Edge', 'Rock', 100), mv('Aqua Jet', 'Water', 40), mv('Crunch', 'Dark', 80), mv('Waterfall', 'Water', 80)] }),
      mon('Vanilluxe', 50, ['Ice'], { moves: [mv('Blizzard', 'Ice', 120), mv('Hail', 'Ice'), mv('Flash Cannon', 'Steel', 80), mv('Frost Breath', 'Ice', 40)] }),
      mon('Archeops', 50, ['Rock', 'Flying'], { moves: [mv('Stone Edge', 'Rock', 100), mv('Acrobatics', 'Flying', 55), mv('Dragon Claw', 'Dragon', 80), mv('Crunch', 'Dark', 80)] }),
      mon('Zoroark', 50, ['Dark'], { moves: [mv('Flamethrower', 'Fire', 95), mv('Focus Blast', 'Fighting', 120), mv('Night Slash', 'Dark', 70), mv('Retaliate', 'Normal', 70)] }),
      mon('Klinklang', 50, ['Steel'], { moves: [mv('Flash Cannon', 'Steel', 80), mv('Metal Sound', 'Steel'), mv('Hyper Beam', 'Normal', 150), mv('Thunderbolt', 'Electric', 95)] }),
    ],
  }),
  boss({
    id: 'ghetsis-bw',
    name: 'Ghetsis',
    location: "N's Castle",
    order: 25,
    category: 'evil-team',
    levelCap: 54,
    team: [
      mon('Cofagrigus', 52, ['Ghost'], { moves: [mv('Shadow Ball', 'Ghost', 80), mv('Protect', 'Normal'), mv('Psychic', 'Psychic', 90), mv('Toxic', 'Poison')] }),
      mon('Bouffalant', 52, ['Normal'], { moves: [mv('Head Charge', 'Normal', 120), mv('Wild Charge', 'Electric', 90), mv('Earthquake', 'Ground', 100), mv('Poison Jab', 'Poison', 80)] }),
      mon('Seismitoad', 52, ['Water', 'Ground'], { moves: [mv('Muddy Water', 'Water', 95), mv('Rain Dance', 'Water'), mv('Earthquake', 'Ground', 100), mv('Sludge Wave', 'Poison', 95)] }),
      mon('Bisharp', 52, ['Dark', 'Steel'], { moves: [mv('Night Slash', 'Dark', 70), mv('Stone Edge', 'Rock', 100), mv('X-Scissor', 'Bug', 80), mv('Metal Burst', 'Steel')] }),
      mon('Eelektross', 52, ['Electric'], { moves: [mv('Wild Charge', 'Electric', 90), mv('Flamethrower', 'Fire', 95), mv('Acrobatics', 'Flying', 55), mv('Crunch', 'Dark', 80)] }),
      mon('Hydreigon', 54, ['Dark', 'Dragon'], { moves: [mv('Dragon Pulse', 'Dragon', 90), mv('Fire Blast', 'Fire', 120), mv('Surf', 'Water', 95), mv('Focus Blast', 'Fighting', 120)] }),
    ],
  }),
  boss({
    id: 'alder-bw',
    name: 'Alder',
    location: 'Pokemon League',
    order: 26,
    category: 'champion',
    levelCap: 77,
    team: [
      mon('Accelgor', 75, ['Bug'], { moves: TODO_MOVES }),
      mon('Bouffalant', 75, ['Normal'], { moves: TODO_MOVES }),
      mon('Druddigon', 75, ['Dragon'], { moves: TODO_MOVES }),
      mon('Escavalier', 75, ['Bug', 'Steel'], { moves: TODO_MOVES }),
      mon('Vanilluxe', 75, ['Ice'], { moves: TODO_MOVES }),
      mon('Volcarona', 77, ['Bug', 'Fire'], { moves: TODO_MOVES }),
    ],
    notes: 'Postgame-only Champion battle. TODO: verified move extraction for Alder.',
  }),
];
