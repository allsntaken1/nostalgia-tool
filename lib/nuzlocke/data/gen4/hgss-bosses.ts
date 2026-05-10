import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

type HgssMove = NonNullable<BossTrainerPokemon['moves']>[number];
type HgssCategory = 'gym' | 'boss' | 'elite-four' | 'champion';

const mv = (name: string, type: HgssMove['type'], power: number | null = null): HgssMove => ({ name, type, power });
const mon = (species: string, level: number, types: BossTrainerPokemon['types'], extras: Partial<BossTrainerPokemon> = {}): BossTrainerPokemon => ({ species, level, types, ...extras });

const boss = ({
  id,
  name,
  location,
  order,
  category,
  levelCap,
  team,
  notes,
}: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: HgssCategory;
  levelCap: number;
  team: BossTrainerPokemon[];
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
});

export const hgssBosses: BossTrainer[] = [
  boss({
    id: 'falkner-hgss',
    name: 'Falkner',
    location: 'Violet Gym',
    order: 1,
    category: 'gym',
    levelCap: 13,
    team: [
      mon('Pidgey', 9, ['Normal', 'Flying'], { moves: [mv('Tackle', 'Normal', 35), mv('Sand-Attack', 'Ground')] }),
      mon('Pidgeotto', 13, ['Normal', 'Flying'], { moves: [mv('Tackle', 'Normal', 35), mv('Roost', 'Flying'), mv('Gust', 'Flying', 40)] }),
    ],
    notes: 'TODO: source excerpt truncated at least one low-level move slot; omitted rather than guessed.',
  }),
  boss({
    id: 'bugsy-hgss',
    name: 'Bugsy',
    location: 'Azalea Gym',
    order: 2,
    category: 'gym',
    levelCap: 17,
    team: [
      mon('Metapod', 15, ['Bug'], { moves: [mv('Tackle', 'Normal', 35)] }),
      mon('Kakuna', 15, ['Bug', 'Poison'], { moves: [mv('Poison Sting', 'Poison', 15)] }),
      mon('Scyther', 17, ['Bug', 'Flying'], { moves: [mv('U-turn', 'Bug', 70), mv('Quick Attack', 'Normal', 40), mv('Leer', 'Normal'), mv('Focus Energy', 'Normal')] }),
    ],
    notes: 'TODO: Metapod/Kakuna move excerpts were truncated; only directly exposed moves retained.',
  }),
  boss({
    id: 'whitney-hgss',
    name: 'Whitney',
    location: 'Goldenrod Gym',
    order: 3,
    category: 'gym',
    levelCap: 19,
    team: [
      mon('Clefairy', 17, ['Normal'], { moves: [mv('Mimic', 'Normal'), mv('Encore', 'Normal'), mv('DoubleSlap', 'Normal', 15), mv('Metronome', 'Normal')] }),
      mon('Miltank', 19, ['Normal'], { moves: [mv('Stomp', 'Normal', 65), mv('Rollout', 'Rock', 30), mv('Attract', 'Normal'), mv('Milk Drink', 'Normal')] }),
    ],
  }),
  boss({
    id: 'morty-hgss',
    name: 'Morty',
    location: 'Ecruteak Gym',
    order: 4,
    category: 'gym',
    levelCap: 25,
    team: [
      mon('Gastly', 21, ['Ghost', 'Poison'], { moves: [mv('Lick', 'Ghost', 20), mv('Spite', 'Ghost'), mv('Mean Look', 'Normal')] }),
      mon('Haunter', 21, ['Ghost', 'Poison'], { moves: [mv('Hypnosis', 'Psychic'), mv('Dream Eater', 'Psychic', 100), mv('Nightmare', 'Ghost')] }),
      mon('Haunter', 23, ['Ghost', 'Poison'], { moves: [mv('Night Shade', 'Ghost'), mv('Sucker Punch', 'Dark', 80), mv('Mean Look', 'Normal')] }),
      mon('Gengar', 25, ['Ghost', 'Poison'], { moves: [mv('Mean Look', 'Normal'), mv('Hypnosis', 'Psychic'), mv('Sucker Punch', 'Dark', 80), mv('Shadow Ball', 'Ghost', 80)] }),
    ],
    notes: 'TODO: Gen IV Curse uses ??? typing; omitted from flat move shape rather than mapped incorrectly.',
  }),
  boss({
    id: 'chuck-hgss',
    name: 'Chuck',
    location: 'Cianwood Gym',
    order: 5,
    category: 'gym',
    levelCap: 31,
    team: [mon('Primeape', 29, ['Fighting']), mon('Poliwrath', 31, ['Water', 'Fighting'])],
    notes: 'TODO: verified team species/levels/types included; move data was not safely recovered in this pass.',
  }),
  boss({
    id: 'pryce-hgss',
    name: 'Pryce',
    location: 'Mahogany Gym',
    order: 6,
    category: 'gym',
    levelCap: 34,
    team: [
      mon('Seel', 30, ['Water'], { moves: [mv('Icy Wind', 'Ice', 55), mv('Rest', 'Psychic'), mv('Snore', 'Normal', 40), mv('Hail', 'Ice')] }),
      mon('Dewgong', 32, ['Water', 'Ice'], { moves: [mv('Aurora Beam', 'Ice', 65), mv('Rest', 'Psychic'), mv('Sleep Talk', 'Normal'), mv('Ice Shard', 'Ice', 40)] }),
      mon('Piloswine', 34, ['Ice', 'Ground']),
    ],
    notes: 'TODO: Piloswine move data was truncated in the fetched excerpt; omitted rather than guessed.',
  }),
  boss({
    id: 'jasmine-hgss',
    name: 'Jasmine',
    location: 'Olivine Gym',
    order: 7,
    category: 'gym',
    levelCap: 35,
    team: [mon('Magnemite', 30, ['Electric', 'Steel']), mon('Magnemite', 30, ['Electric', 'Steel']), mon('Steelix', 35, ['Steel', 'Ground'])],
    notes: 'TODO: verified team species/levels/types included; move data was not safely recovered in this pass.',
  }),
  boss({
    id: 'kimono-girls-hgss',
    name: 'Kimono Girls',
    location: 'Ecruteak Dance Theater',
    order: 8,
    category: 'boss',
    levelCap: 38,
    team: [
      mon('Umbreon', 38, ['Dark']),
      mon('Espeon', 38, ['Psychic']),
      mon('Flareon', 38, ['Fire']),
      mon('Jolteon', 38, ['Electric']),
      mon('Vaporeon', 38, ['Water']),
    ],
    notes: 'Condensed sequential Kimono Girl fights into one prep entry. TODO: verified move data not recovered in this pass.',
  }),
  boss({
    id: 'clair-hgss',
    name: 'Clair',
    location: 'Blackthorn Gym',
    order: 9,
    category: 'gym',
    levelCap: 41,
    team: [mon('Gyarados', 38, ['Water', 'Flying']), mon('Dragonair', 38, ['Dragon']), mon('Dragonair', 38, ['Dragon']), mon('Kingdra', 41, ['Water', 'Dragon'])],
    notes: 'TODO: verified team species/levels/types included; move data was not safely recovered in this pass.',
  }),
  boss({
    id: 'will-hgss',
    name: 'Will',
    location: 'Indigo Plateau',
    order: 10,
    category: 'elite-four',
    levelCap: 42,
    team: [mon('Xatu', 40, ['Psychic', 'Flying']), mon('Jynx', 41, ['Ice', 'Psychic']), mon('Exeggutor', 41, ['Grass', 'Psychic']), mon('Slowbro', 41, ['Water', 'Psychic']), mon('Xatu', 42, ['Psychic', 'Flying'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'koga-e4-hgss',
    name: 'Koga',
    location: 'Indigo Plateau',
    order: 11,
    category: 'elite-four',
    levelCap: 44,
    team: [mon('Ariados', 40, ['Bug', 'Poison']), mon('Venomoth', 41, ['Bug', 'Poison']), mon('Muk', 42, ['Poison']), mon('Forretress', 43, ['Bug', 'Steel']), mon('Crobat', 44, ['Poison', 'Flying'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'bruno-hgss',
    name: 'Bruno',
    location: 'Indigo Plateau',
    order: 12,
    category: 'elite-four',
    levelCap: 46,
    team: [mon('Hitmontop', 42, ['Fighting']), mon('Hitmonlee', 42, ['Fighting']), mon('Hitmonchan', 42, ['Fighting']), mon('Onix', 43, ['Rock', 'Ground']), mon('Machamp', 46, ['Fighting'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'karen-hgss',
    name: 'Karen',
    location: 'Indigo Plateau',
    order: 13,
    category: 'elite-four',
    levelCap: 47,
    team: [
      mon('Umbreon', 42, ['Dark'], { moves: [mv('Double Team', 'Normal'), mv('Confuse Ray', 'Ghost'), mv('Faint Attack', 'Dark', 60), mv('Payback', 'Dark', 50)] }),
      mon('Vileplume', 42, ['Grass', 'Poison'], { moves: [mv('Stun Spore', 'Grass'), mv('Petal Dance', 'Grass', 90), mv('Acid', 'Poison', 40), mv('Moonlight', 'Normal')] }),
      mon('Murkrow', 44, ['Dark', 'Flying']),
      mon('Gengar', 45, ['Ghost', 'Poison']),
      mon('Houndoom', 47, ['Dark', 'Fire']),
    ],
    notes: 'TODO: Murkrow/Gengar/Houndoom move data was truncated in the fetched excerpt; omitted rather than guessed.',
  }),
  boss({
    id: 'lance-hgss',
    name: 'Lance',
    location: 'Indigo Plateau',
    order: 14,
    category: 'champion',
    levelCap: 50,
    team: [mon('Gyarados', 44, ['Water', 'Flying']), mon('Dragonite', 49, ['Dragon', 'Flying']), mon('Dragonite', 49, ['Dragon', 'Flying']), mon('Aerodactyl', 48, ['Rock', 'Flying']), mon('Charizard', 48, ['Fire', 'Flying']), mon('Dragonite', 50, ['Dragon', 'Flying'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'lt-surge-hgss',
    name: 'Lt. Surge',
    location: 'Vermilion Gym',
    order: 15,
    category: 'gym',
    levelCap: 53,
    team: [
      mon('Raichu', 51, ['Electric'], { moves: [mv('Thunder Wave', 'Electric'), mv('Shock Wave', 'Electric', 60), mv('Quick Attack', 'Normal', 40), mv('Double Team', 'Normal')] }),
      mon('Electrode', 47, ['Electric'], { moves: [mv('Mirror Shot', 'Steel', 65)] }),
      mon('Electabuzz', 53, ['Electric'], { moves: [mv('Quick Attack', 'Normal', 40), mv('Shock Wave', 'Electric', 60), mv('Light Screen', 'Psychic'), mv('Low Kick', 'Fighting')] }),
    ],
    notes: 'TODO: Electrode move excerpt was truncated; only directly exposed move retained.',
  }),
  boss({
    id: 'blaine-hgss',
    name: 'Blaine',
    location: 'Seafoam Gym',
    order: 16,
    category: 'gym',
    levelCap: 59,
    team: [mon('Magmar', 54, ['Fire']), mon('Magcargo', 54, ['Fire', 'Rock']), mon('Rapidash', 59, ['Fire'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'blue-hgss',
    name: 'Blue',
    location: 'Viridian Gym',
    order: 17,
    category: 'gym',
    levelCap: 60,
    team: [mon('Exeggutor', 55, ['Grass', 'Psychic']), mon('Machamp', 56, ['Fighting']), mon('Arcanine', 58, ['Fire']), mon('Rhydon', 58, ['Ground', 'Rock']), mon('Gyarados', 52, ['Water', 'Flying']), mon('Pidgeot', 60, ['Normal', 'Flying'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
  boss({
    id: 'red-hgss',
    name: 'Red',
    location: 'Mt. Silver',
    order: 18,
    category: 'boss',
    levelCap: 88,
    team: [mon('Pikachu', 88, ['Electric']), mon('Venusaur', 84, ['Grass', 'Poison']), mon('Charizard', 84, ['Fire', 'Flying']), mon('Blastoise', 84, ['Water']), mon('Lapras', 80, ['Water', 'Ice']), mon('Snorlax', 82, ['Normal'])],
    notes: 'TODO: verified team species/levels/types included; move data not safely recovered in this pass.',
  }),
];

export const hgssBossTodo = [
  'silver-rival-battles-hgss',
  'rocket-executives-hgss',
  'brock-hgss',
  'misty-hgss',
  'erika-hgss',
  'janine-hgss',
  'sabrina-hgss',
];
