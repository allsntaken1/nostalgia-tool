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
      fire: [mon('Pidove', 12, ['Normal', 'Flying'], { moves: TODO_MOVES }), mon('Pansage', 12, ['Grass'], { moves: TODO_MOVES }), mon('Tepig', 14, ['Fire'], { moves: TODO_MOVES })],
      water: [mon('Pidove', 12, ['Normal', 'Flying'], { moves: TODO_MOVES }), mon('Panpour', 12, ['Water'], { moves: TODO_MOVES }), mon('Oshawott', 14, ['Water'], { moves: TODO_MOVES })],
      grass: [mon('Pidove', 12, ['Normal', 'Flying'], { moves: TODO_MOVES }), mon('Pansear', 12, ['Fire'], { moves: TODO_MOVES }), mon('Snivy', 14, ['Grass'], { moves: TODO_MOVES })],
    }),
    notes: 'Route 3 rival battle. TODO: verified move extraction for this battle.',
  }),
  boss({
    id: 'n-2-bw',
    name: 'N',
    location: 'Nacrene City',
    order: 10,
    category: 'boss',
    levelCap: 13,
    team: [
      mon('Pidove', 13, ['Normal', 'Flying'], { moves: TODO_MOVES }),
      mon('Tympole', 13, ['Water'], { moves: TODO_MOVES }),
      mon('Timburr', 13, ['Fighting'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for early N battle.',
  }),
  boss({
    id: 'lenora-bw',
    name: 'Lenora',
    location: 'Nacrene Gym',
    order: 11,
    category: 'gym',
    levelCap: 20,
    team: [mon('Herdier', 18, ['Normal'], { moves: TODO_MOVES }), mon('Watchog', 20, ['Normal'], { moves: TODO_MOVES })],
    notes: 'TODO: verified move extraction for Lenora.',
  }),
  boss({
    id: 'burgh-bw',
    name: 'Burgh',
    location: 'Castelia Gym',
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
    id: 'n-3-bw',
    name: 'N',
    location: 'Nimbasa City',
    order: 13,
    category: 'boss',
    levelCap: 22,
    team: [
      mon('Sandile', 22, ['Ground', 'Dark'], { moves: TODO_MOVES }),
      mon('Darumaka', 22, ['Fire'], { moves: TODO_MOVES }),
      mon('Scraggy', 22, ['Dark', 'Fighting'], { moves: TODO_MOVES }),
      mon('Sigilyph', 22, ['Psychic', 'Flying'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for Nimbasa N battle.',
  }),
  boss({
    id: 'elesa-bw',
    name: 'Elesa',
    location: 'Nimbasa Gym',
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
      mon('Boldore', 28, ['Rock'], { moves: TODO_MOVES }),
      mon('Ferroseed', 28, ['Grass', 'Steel'], { moves: TODO_MOVES }),
      mon('Joltik', 28, ['Bug', 'Electric'], { moves: TODO_MOVES }),
      mon('Klink', 28, ['Steel'], { moves: TODO_MOVES }),
    ],
    notes: 'TODO: verified move extraction for Chargestone Cave N battle.',
  }),
  boss({
    id: 'clay-bw',
    name: 'Clay',
    location: 'Driftveil Gym',
    order: 16,
    category: 'gym',
    levelCap: 31,
    team: [
      mon('Krokorok', 29, ['Ground', 'Dark'], { moves: [mv('Swagger', 'Normal'), mv('Torment', 'Dark'), mv('Crunch', 'Dark', 80), mv('Bulldoze', 'Ground', 60)] }),
      mon('Palpitoad', 29, ['Water', 'Ground'], { moves: [mv('Aqua Ring', 'Water'), mv('BubbleBeam', 'Water', 65), mv('Muddy Water', 'Water', 95), mv('Bulldoze', 'Ground', 60)] }),
      mon('Excadrill', 31, ['Ground', 'Steel'], { moves: [mv('Hone Claws', 'Dark'), mv('Slash', 'Normal', 70), mv('Rock Slide', 'Rock', 75), mv('Bulldoze', 'Ground', 60)] }),
    ],
  }),
  boss({
    id: 'skyla-bw',
    name: 'Skyla',
    location: 'Mistralton Gym',
    order: 17,
    category: 'gym',
    levelCap: 35,
    team: [
      mon('Swoobat', 33, ['Psychic', 'Flying'], { moves: [mv('Acrobatics', 'Flying', 55), mv('Amnesia', 'Psychic'), mv('Assurance', 'Dark', 50), mv('Heart Stamp', 'Psychic', 60)] }),
      mon('Unfezant', 33, ['Normal', 'Flying'], { moves: [mv('Leer', 'Normal'), mv('Quick Attack', 'Normal', 40), mv('Air Slash', 'Flying', 75), mv('Razor Wind', 'Normal', 80)] }),
      mon('Swanna', 35, ['Water', 'Flying'], { moves: [mv('Aqua Ring', 'Water'), mv('Aerial Ace', 'Flying', 60), mv('BubbleBeam', 'Water', 65), mv('Air Slash', 'Flying', 75)] }),
    ],
  }),
  boss({
    id: 'brycen-bw',
    name: 'Brycen',
    location: 'Icirrus Gym',
    order: 18,
    category: 'gym',
    levelCap: 39,
    team: [
      mon('Vanillish', 37, ['Ice'], { moves: [mv('Acid Armor', 'Poison'), mv('Astonish', 'Ghost', 30), mv('Mirror Shot', 'Steel', 65), mv('Frost Breath', 'Ice', 40)] }),
      mon('Cryogonal', 37, ['Ice'], { moves: [mv('Reflect', 'Psychic'), mv('Rapid Spin', 'Normal', 20), mv('Aurora Beam', 'Ice', 65), mv('Frost Breath', 'Ice', 40)] }),
      mon('Beartic', 39, ['Ice'], { moves: [mv('Swagger', 'Normal'), mv('Brine', 'Water', 65), mv('Slash', 'Normal', 70), mv('Icicle Crash', 'Ice', 85)] }),
    ],
  }),
  boss({
    id: 'drayden-black-bw',
    name: 'Drayden',
    location: 'Opelucid Gym',
    order: 19,
    category: 'gym',
    levelCap: 43,
    game: 'Black',
    team: [
      mon('Fraxure', 41, ['Dragon'], { moves: [mv('Dragon Dance', 'Dragon'), mv('Dragon Rage', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Dragon Tail', 'Dragon', 60)] }),
      mon('Druddigon', 41, ['Dragon'], { moves: [mv('Revenge', 'Fighting', 60), mv('Chip Away', 'Normal', 70), mv('Night Slash', 'Dark', 70), mv('Dragon Tail', 'Dragon', 60)] }),
      mon('Haxorus', 43, ['Dragon'], { moves: [mv('Dragon Dance', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Slash', 'Normal', 70), mv('Dragon Tail', 'Dragon', 60)] }),
    ],
  }),
  boss({
    id: 'iris-white-bw',
    name: 'Iris',
    location: 'Opelucid Gym',
    order: 19,
    category: 'gym',
    levelCap: 43,
    game: 'White',
    team: [
      mon('Fraxure', 41, ['Dragon'], { moves: [mv('Dragon Tail', 'Dragon', 60), mv('Dragon Dance', 'Dragon'), mv('Assurance', 'Dark', 50), mv('Dragon Rage', 'Dragon')] }),
      mon('Druddigon', 41, ['Dragon'], { moves: [mv('Dragon Tail', 'Dragon', 60), mv('Revenge', 'Fighting', 60), mv('Night Slash', 'Dark', 70), mv('Chip Away', 'Normal', 70)] }),
      mon('Haxorus', 43, ['Dragon'], { moves: [mv('Dragon Tail', 'Dragon', 60), mv('Dragon Dance', 'Dragon'), mv('Slash', 'Normal', 70), mv('Assurance', 'Dark', 50)] }),
    ],
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
