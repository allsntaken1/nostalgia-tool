import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

// All XY boss data verified against Bulbapedia trainer pages (X/Y main story, not rematches/ORAS).

type XyMove = NonNullable<BossTrainerPokemon['moves']>[number];
type XyCategory = 'rival' | 'gym' | 'boss' | 'evil-team' | 'elite-four' | 'champion';
type XyBossGame = BossTrainer['game'];

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
  game,
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
  game?: XyBossGame;
}): BossTrainer => ({
  id,
  name,
  category,
  game: game ?? 'Both',
  location,
  recommendedOrder: order,
  levelCap,
  notes: notes ?? location,
  baseTeam: Array.isArray(team) ? team : [],
  ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
});

// Variant keys are the rival starter type after the shared resolver maps the player's choice.
// Shauna picks the starter WEAK to the player.
//   rival fire key (player grass/Chespin) -> Shauna Froakie (water)
//   rival water key (player fire/Fennekin) -> Shauna Chespin (grass)
//   rival grass key (player water/Froakie) -> Shauna Fennekin (fire)
const shaunaStarterVariants = (
  froakie: BossTrainerPokemon[],
  chespin: BossTrainerPokemon[],
  fennekin: BossTrainerPokemon[],
): BossTrainer['variantsByRivalStarterChoice'] => ({
  fire: froakie,
  water: chespin,
  grass: fennekin,
});

// Serena/Calem (the rival) picks the starter STRONG against the player.
//   rival fire key (player grass/Chespin) -> rival Fennekin (fire)
//   rival water key (player fire/Fennekin) -> rival Froakie (water)
//   rival grass key (player water/Froakie) -> rival Chespin (grass)
const calemStarterVariants = (
  fennekin: BossTrainerPokemon[],
  froakie: BossTrainerPokemon[],
  chespin: BossTrainerPokemon[],
): BossTrainer['variantsByRivalStarterChoice'] => ({
  fire: fennekin,
  water: froakie,
  grass: chespin,
});

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
      // rival fire key (player grass) -> Shauna Froakie
      [mon('Froakie', 5, ['Water'], { ability: 'Torrent', moves: [mv('Pound', 'Normal', 40), mv('Growl', 'Normal'), mv('Bubble', 'Water', 40)] })],
      // rival water key (player fire) -> Shauna Chespin
      [mon('Chespin', 5, ['Grass'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Growl', 'Normal'), mv('Vine Whip', 'Grass', 45)] })],
      // rival grass key (player water) -> Shauna Fennekin
      [mon('Fennekin', 5, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Tail Whip', 'Normal'), mv('Ember', 'Fire', 40)] })],
    ),
    notes: 'First battle in Aquacorde Town immediately after picking your starter. Shauna picks the starter weak to yours. Winning is not mandatory (no whiteout). Verified per Bulbapedia (Shauna page).',
  }),
  boss({
    id: 'xy-viola',
    name: 'Viola',
    location: 'Santalune City',
    order: 2,
    category: 'gym',
    levelCap: 12,
    team: [
      mon('Surskit', 10, ['Bug', 'Water'], { ability: 'Swift Swim', moves: [mv('Quick Attack', 'Normal', 40), mv('Bubble', 'Water', 40), mv('Water Sport', 'Water')] }),
      mon('Vivillon', 12, ['Bug', 'Flying'], { ability: 'Shield Dust', moves: [mv('Harden', 'Normal'), mv('Infestation', 'Bug', 20), mv('Tackle', 'Normal', 40)] }),
    ],
    notes: 'Santalune Gym Leader (Bug-type). Awards the Bug Badge. Verified per Bulbapedia (Viola page).',
  }),
  boss({
    id: 'xy-sycamore-lumiose',
    name: 'Professor Sycamore',
    location: 'Lumiose City',
    order: 3,
    category: 'boss',
    levelCap: 10,
    team: [
      mon('Bulbasaur', 10, ['Grass', 'Poison'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Growl', 'Normal'), mv('Leech Seed', 'Grass'), mv('Vine Whip', 'Grass', 45)] }),
      mon('Charmander', 10, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Growl', 'Normal'), mv('Ember', 'Fire', 40), mv('Smokescreen', 'Normal')] }),
      mon('Squirtle', 10, ['Water'], { ability: 'Torrent', moves: [mv('Tackle', 'Normal', 40), mv('Tail Whip', 'Normal'), mv('Water Gun', 'Water', 40), mv('Withdraw', 'Water')] }),
    ],
    notes: 'Sycamore battle inside his Lumiose City lab after defeating Viola. He uses the three KANTO starters (Bulbasaur/Charmander/Squirtle) at level 10. After the battle he gifts you one of the Kanto starters (strong against your Kalos starter). Verified per Bulbapedia (Professor Sycamore page).',
  }),
  boss({
    id: 'xy-team-flare-glittering-cave',
    name: 'Team Flare Grunts (Glittering Cave)',
    location: 'Glittering Cave',
    order: 4,
    category: 'evil-team',
    levelCap: 18,
    team: [],
    notes: 'Major Team Flare story event inside Glittering Cave (fossil theft). Skipped minor required grunts; add later only if boss-prep mode expands to mandatory trainers.',
  }),
  boss({
    id: 'xy-grant',
    name: 'Grant',
    location: 'Cyllage City',
    order: 5,
    category: 'gym',
    levelCap: 25,
    team: [
      mon('Amaura', 25, ['Rock', 'Ice'], { ability: 'Refrigerate', moves: [mv('Aurora Beam', 'Ice', 65), mv('Rock Tomb', 'Rock', 60), mv('Thunder Wave', 'Electric'), mv('Take Down', 'Normal', 90)] }),
      mon('Tyrunt', 25, ['Rock', 'Dragon'], { ability: 'Strong Jaw', moves: [mv('Rock Tomb', 'Rock', 60), mv('Bite', 'Dark', 60), mv('Stomp', 'Normal', 65)] }),
    ],
    notes: 'Cyllage Gym Leader (Rock-type). Awards the Cliff Badge. Verified per Bulbapedia (Grant page).',
  }),
  boss({
    id: 'xy-korrina-tower-of-mastery',
    name: 'Korrina (Mega Evolution)',
    location: 'Tower of Mastery',
    order: 6,
    category: 'boss',
    levelCap: 32,
    team: [
      mon('Lucario', 32, ['Fighting', 'Steel'], { ability: 'Steadfast', item: 'Lucarionite', moves: [mv('Swords Dance', 'Normal'), mv('Power-Up Punch', 'Fighting', 40), mv('Metal Sound', 'Steel'), mv('Bone Rush', 'Ground', 25)], notes: 'Mega-evolves into Mega Lucario (Fighting/Steel) during the battle.' }),
    ],
    notes: 'Story battle inside the Tower of Mastery where Korrina demonstrates Mega Evolution. Lucario holds Lucarionite. Verified per Bulbapedia (Korrina page).',
  }),
  boss({
    id: 'xy-korrina',
    name: 'Korrina',
    location: 'Shalour City',
    order: 7,
    category: 'gym',
    levelCap: 32,
    team: [
      mon('Mienfoo', 29, ['Fighting'], { ability: 'Inner Focus', moves: [mv('Power-Up Punch', 'Fighting', 40), mv('Fake Out', 'Normal', 40), mv('Double Slap', 'Normal', 15)] }),
      mon('Machoke', 28, ['Fighting'], { ability: 'Guts', moves: [mv('Power-Up Punch', 'Fighting', 40), mv('Rock Tomb', 'Rock', 60), mv('Leer', 'Normal')] }),
      mon('Hawlucha', 32, ['Fighting', 'Flying'], { ability: 'Unburden', moves: [mv('Flying Press', 'Fighting', 80), mv('Hone Claws', 'Dark'), mv('Power-Up Punch', 'Fighting', 40)] }),
    ],
    notes: 'Shalour Gym Leader (Fighting-type). Awards the Rumble Badge. Verified per Bulbapedia (Korrina page).',
  }),
  boss({
    id: 'xy-calem-serena-tower-of-mastery',
    name: 'Calem/Serena (Tower of Mastery)',
    location: 'Tower of Mastery',
    order: 8,
    category: 'rival',
    levelCap: 30,
    team: [
      mon('Meowstic', 28, ['Psychic'], { ability: 'Keen Eye', moves: [mv('Fake Out', 'Normal', 40), mv('Light Screen', 'Psychic'), mv('Psybeam', 'Psychic', 65), mv('Disarming Voice', 'Fairy', 40)] }),
      mon('Absol', 28, ['Dark'], { ability: 'Super Luck', moves: [mv('Bite', 'Dark', 60), mv('Slash', 'Normal', 70), mv('Quick Attack', 'Normal', 40)] }),
    ],
    variantsByRivalStarterChoice: calemStarterVariants(
      // rival fire key (player grass) -> rival Braixen (Fennekin line)
      [mon('Braixen', 30, ['Fire'], { ability: 'Blaze', moves: [mv('Psybeam', 'Psychic', 65), mv('Fire Spin', 'Fire', 35)] })],
      // rival water key (player fire) -> rival Frogadier (Froakie line)
      [mon('Frogadier', 30, ['Water'], { ability: 'Torrent', moves: [mv('Quick Attack', 'Normal', 40), mv('Water Pulse', 'Water', 60)] })],
      // rival grass key (player water) -> rival Quilladin (Chespin line)
      [mon('Quilladin', 30, ['Grass'], { ability: 'Overgrow', moves: [mv('Bite', 'Dark', 60), mv('Needle Arm', 'Grass', 60)] })],
    ),
    notes: 'Rival battle in Shalour City after Korrina\'s Mega story. Rival uses Meowstic + Absol + evolved starter strong against yours. Verified per Bulbapedia (Calem page).',
  }),
  boss({
    id: 'xy-team-flare-kalos-power-plant',
    name: 'Team Flare (Kalos Power Plant)',
    location: 'Kalos Power Plant',
    order: 9,
    category: 'evil-team',
    levelCap: 36,
    team: [],
    notes: 'Required Team Flare story event inside the Kalos Power Plant. Skipped minor required grunts; add later only if boss-prep mode expands to mandatory trainers.',
  }),
  boss({
    id: 'xy-ramos',
    name: 'Ramos',
    location: 'Coumarine City',
    order: 10,
    category: 'gym',
    levelCap: 34,
    team: [
      mon('Jumpluff', 30, ['Grass', 'Flying'], { ability: 'Chlorophyll', moves: [mv('Grass Knot', 'Grass'), mv('Acrobatics', 'Flying', 55), mv('Leech Seed', 'Grass')] }),
      mon('Weepinbell', 31, ['Grass', 'Poison'], { ability: 'Chlorophyll', moves: [mv('Grass Knot', 'Grass'), mv('Acid', 'Poison', 40), mv('Poison Powder', 'Poison'), mv('Gastro Acid', 'Poison')] }),
      mon('Gogoat', 34, ['Grass'], { ability: 'Sap Sipper', moves: [mv('Grass Knot', 'Grass'), mv('Bulldoze', 'Ground', 60), mv('Take Down', 'Normal', 90)] }),
    ],
    notes: 'Coumarine Gym Leader (Grass-type). Awards the Plant Badge. Verified per Bulbapedia (Ramos page).',
  }),
  boss({
    id: 'xy-clemont',
    name: 'Clemont',
    location: 'Lumiose City',
    order: 11,
    category: 'gym',
    levelCap: 37,
    team: [
      mon('Emolga', 35, ['Electric', 'Flying'], { ability: 'Static', moves: [mv('Volt Switch', 'Electric', 70), mv('Quick Attack', 'Normal', 40), mv('Aerial Ace', 'Flying', 60)] }),
      mon('Magneton', 35, ['Electric', 'Steel'], { ability: 'Sturdy', moves: [mv('Thunderbolt', 'Electric', 90), mv('Electric Terrain', 'Electric'), mv('Mirror Shot', 'Steel', 65)] }),
      mon('Heliolisk', 37, ['Electric', 'Normal'], { ability: 'Dry Skin', moves: [mv('Thunderbolt', 'Electric', 90), mv('Quick Attack', 'Normal', 40), mv('Grass Knot', 'Grass')] }),
    ],
    notes: 'Lumiose Gym Leader (Electric-type). Awards the Voltage Badge. Gym unlocks after the Coumarine story segment. Verified per Bulbapedia (Clemont page).',
  }),
  boss({
    id: 'xy-team-flare-poke-ball-factory',
    name: 'Team Flare (Poké Ball Factory)',
    location: 'Poké Ball Factory',
    order: 12,
    category: 'evil-team',
    levelCap: 39,
    team: [],
    notes: 'Required Team Flare story event inside the Poké Ball Factory in Laverre City. Skipped minor required grunts; add later only if boss-prep mode expands to mandatory trainers.',
  }),
  boss({
    id: 'xy-valerie',
    name: 'Valerie',
    location: 'Laverre City',
    order: 13,
    category: 'gym',
    levelCap: 42,
    team: [
      mon('Mawile', 38, ['Steel', 'Fairy'], { ability: 'Hyper Cutter', moves: [mv('Feint Attack', 'Dark', 60), mv('Crunch', 'Dark', 80), mv('Iron Defense', 'Steel')] }),
      mon('MrMime', 39, ['Psychic', 'Fairy'], { ability: 'Soundproof', moves: [mv('Light Screen', 'Psychic'), mv('Reflect', 'Psychic'), mv('Psychic', 'Psychic', 90), mv('Dazzling Gleam', 'Fairy', 80)] }),
      mon('Sylveon', 42, ['Fairy'], { ability: 'Cute Charm', moves: [mv('Dazzling Gleam', 'Fairy', 80), mv('Quick Attack', 'Normal', 40), mv('Swift', 'Normal', 60), mv('Charm', 'Fairy')] }),
    ],
    notes: 'Laverre Gym Leader (Fairy-type). Awards the Fairy Badge. Verified per Bulbapedia (Valerie page).',
  }),
  boss({
    id: 'xy-olympia',
    name: 'Olympia',
    location: 'Anistar City',
    order: 14,
    category: 'gym',
    levelCap: 48,
    team: [
      mon('Sigilyph', 44, ['Psychic', 'Flying'], { ability: 'Magic Guard', moves: [mv('Psychic', 'Psychic', 90), mv('Air Slash', 'Flying', 75), mv('Light Screen', 'Psychic'), mv('Reflect', 'Psychic')] }),
      mon('Slowking', 45, ['Water', 'Psychic'], { ability: 'Oblivious', moves: [mv('Psychic', 'Psychic', 90), mv('Calm Mind', 'Psychic'), mv('Power Gem', 'Rock', 80), mv('Yawn', 'Normal')] }),
      mon('Meowstic', 48, ['Psychic'], { ability: 'Infiltrator', moves: [mv('Psychic', 'Psychic', 90), mv('Calm Mind', 'Psychic'), mv('Fake Out', 'Normal', 40), mv('Shadow Ball', 'Ghost', 80)] }),
    ],
    notes: 'Anistar Gym Leader (Psychic-type). Awards the Psychic Badge. Verified per Bulbapedia (Olympia page).',
  }),
  boss({
    id: 'xy-aliana-lysandre-labs',
    name: 'Aliana',
    location: 'Lysandre Labs',
    order: 15,
    category: 'evil-team',
    levelCap: 48,
    team: [
      mon('Mightyena', 46, ['Dark'], { ability: 'Intimidate', moves: [mv('Taunt', 'Dark'), mv('Sucker Punch', 'Dark', 70), mv('Crunch', 'Dark', 80), mv('Embargo', 'Dark')] }),
      mon('Druddigon', 48, ['Dragon'], { ability: 'Sheer Force', moves: [mv('Dragon Claw', 'Dragon', 80), mv('Crunch', 'Dark', 80), mv('Shadow Claw', 'Ghost', 70), mv('Surf', 'Water', 90)] }),
    ],
    notes: 'Team Flare Scientist boss inside Lysandre Labs (Lumiose City). Verified per Bulbapedia (Aliana page).',
  }),
  boss({
    id: 'xy-bryony-lysandre-labs',
    name: 'Bryony',
    location: 'Lysandre Labs',
    order: 16,
    category: 'evil-team',
    levelCap: 48,
    team: [
      mon('Liepard', 46, ['Dark'], { ability: 'Limber', moves: [mv('Fake Out', 'Normal', 40), mv('Sucker Punch', 'Dark', 70), mv('Taunt', 'Dark'), mv('Slash', 'Normal', 70)] }),
      mon('Bisharp', 48, ['Dark', 'Steel'], { ability: 'Inner Focus', moves: [mv('Night Slash', 'Dark', 70), mv('Iron Head', 'Steel', 80), mv('X-Scissor', 'Bug', 80), mv('Shadow Claw', 'Ghost', 70)] }),
    ],
    notes: 'Team Flare Scientist boss inside Lysandre Labs. Verified per Bulbapedia (Bryony page).',
  }),
  boss({
    id: 'xy-celosia-lysandre-labs',
    name: 'Celosia',
    location: 'Lysandre Labs',
    order: 17,
    category: 'evil-team',
    levelCap: 48,
    team: [
      mon('Manectric', 46, ['Electric'], { ability: 'Static', moves: [mv('Thunderbolt', 'Electric', 90), mv('Quick Attack', 'Normal', 40), mv('Flamethrower', 'Fire', 90), mv('Thunder Wave', 'Electric')] }),
      mon('Drapion', 48, ['Poison', 'Dark'], { ability: 'Battle Armor', moves: [mv('Night Slash', 'Dark', 70), mv('X-Scissor', 'Bug', 80), mv('Poison Jab', 'Poison', 80), mv('Acupressure', 'Normal')] }),
    ],
    notes: 'Team Flare Scientist boss inside Lysandre Labs. Verified per Bulbapedia (Celosia page).',
  }),
  boss({
    id: 'xy-mable-lysandre-labs',
    name: 'Mable',
    location: 'Lysandre Labs',
    order: 18,
    category: 'evil-team',
    levelCap: 48,
    team: [
      mon('Houndoom', 46, ['Dark', 'Fire'], { ability: 'Early Bird', moves: [mv('Snarl', 'Dark', 55), mv('Flamethrower', 'Fire', 90), mv('Sludge Bomb', 'Poison', 90), mv('Foul Play', 'Dark', 95)] }),
      mon('Weavile', 48, ['Dark', 'Ice'], { ability: 'Pressure', moves: [mv('Night Slash', 'Dark', 70), mv('Quick Attack', 'Normal', 40), mv('Ice Shard', 'Ice', 40), mv('Low Sweep', 'Fighting', 65)] }),
    ],
    notes: 'Team Flare Scientist boss inside Lysandre Labs. Verified per Bulbapedia (Mable page).',
  }),
  boss({
    id: 'xy-xerosic-lysandre-labs',
    name: 'Xerosic',
    location: 'Lysandre Labs',
    order: 19,
    category: 'evil-team',
    levelCap: 48,
    team: [
      mon('Crobat', 46, ['Poison', 'Flying'], { ability: 'Inner Focus', moves: [mv('X-Scissor', 'Bug', 80), mv('Cross Poison', 'Poison', 70), mv('Steel Wing', 'Steel', 70), mv('Air Slash', 'Flying', 75)] }),
      mon('Malamar', 48, ['Dark', 'Psychic'], { ability: 'Contrary', moves: [mv('Superpower', 'Fighting', 120), mv('Payback', 'Dark', 50), mv('Psycho Cut', 'Psychic', 70), mv('Retaliate', 'Normal', 70)] }),
    ],
    notes: 'Team Flare Scientist boss inside Lysandre Labs. Verified per Bulbapedia (Xerosic page).',
  }),
  boss({
    id: 'xy-lysandre-labs-fight',
    name: 'Lysandre (Lysandre Labs)',
    location: 'Lysandre Labs',
    order: 20,
    category: 'evil-team',
    levelCap: 51,
    team: [
      mon('Mienshao', 47, ['Fighting'], { ability: 'Inner Focus', moves: [mv('Swords Dance', 'Normal'), mv('High Jump Kick', 'Fighting', 130), mv('Acrobatics', 'Flying', 55)] }),
      mon('Honchkrow', 47, ['Dark', 'Flying'], { ability: 'Insomnia', moves: [mv('Night Slash', 'Dark', 70), mv('Aerial Ace', 'Flying', 60), mv('Retaliate', 'Normal', 70), mv('Steel Wing', 'Steel', 70)] }),
      mon('Pyroar', 49, ['Fire', 'Normal'], { ability: 'Unnerve', moves: [mv('Hyper Voice', 'Normal', 90), mv('Fire Blast', 'Fire', 110), mv('Dark Pulse', 'Dark', 80)] }),
      mon('Gyarados', 51, ['Water', 'Flying'], { ability: 'Intimidate', moves: [mv('Aqua Tail', 'Water', 90), mv('Earthquake', 'Ground', 100), mv('Iron Head', 'Steel', 80), mv('Outrage', 'Dragon', 120)] }),
    ],
    notes: 'First Lysandre boss battle inside Lysandre Labs in Lumiose City. Verified per Bulbapedia (Lysandre page).',
  }),
  boss({
    id: 'xy-lysandre-team-flare-hq',
    name: 'Lysandre (Team Flare Secret HQ)',
    location: 'Team Flare Secret HQ',
    order: 21,
    category: 'evil-team',
    levelCap: 53,
    team: [
      mon('Mienshao', 49, ['Fighting'], { ability: 'Inner Focus', moves: [mv('Swords Dance', 'Normal'), mv('High Jump Kick', 'Fighting', 130), mv('Acrobatics', 'Flying', 55)] }),
      mon('Honchkrow', 49, ['Dark', 'Flying'], { ability: 'Super Luck', moves: [mv('Night Slash', 'Dark', 70), mv('Aerial Ace', 'Flying', 60), mv('Retaliate', 'Normal', 70), mv('Steel Wing', 'Steel', 70)] }),
      mon('Pyroar', 51, ['Fire', 'Normal'], { ability: 'Unnerve', moves: [mv('Hyper Voice', 'Normal', 90), mv('Fire Blast', 'Fire', 110), mv('Dark Pulse', 'Dark', 80)] }),
      mon('Gyarados', 53, ['Water', 'Flying'], { ability: 'Intimidate', item: 'Gyaradosite', moves: [mv('Aqua Tail', 'Water', 90), mv('Earthquake', 'Ground', 100), mv('Iron Head', 'Steel', 80), mv('Outrage', 'Dragon', 120)], notes: 'Mega-evolves into Mega Gyarados (Water/Dark) during the battle.' }),
    ],
    notes: 'Second Lysandre boss battle inside the Team Flare Secret HQ in Geosenge Town. Mega Gyarados confirmed. Verified per Bulbapedia (Lysandre page).',
  }),
  boss({
    id: 'xy-xerneas-team-flare-hq',
    name: 'Xerneas',
    location: 'Team Flare Secret HQ',
    order: 22,
    category: 'boss',
    levelCap: 50,
    team: [
      mon('Xerneas', 50, ['Fairy']),
    ],
    notes: 'Static legendary encounter inside the Team Flare Secret HQ in Pokémon X.',
    game: 'X',
  }),
  boss({
    id: 'xy-yveltal-team-flare-hq',
    name: 'Yveltal',
    location: 'Team Flare Secret HQ',
    order: 23,
    category: 'boss',
    levelCap: 50,
    team: [
      mon('Yveltal', 50, ['Dark', 'Flying']),
    ],
    notes: 'Static legendary encounter inside the Team Flare Secret HQ in Pokémon Y.',
    game: 'Y',
  }),
  boss({
    id: 'xy-wulfric',
    name: 'Wulfric',
    location: 'Snowbelle City',
    order: 24,
    category: 'gym',
    levelCap: 59,
    team: [
      mon('Abomasnow', 56, ['Grass', 'Ice'], { ability: 'Snow Warning', moves: [mv('Ice Beam', 'Ice', 90), mv('Ice Shard', 'Ice', 40), mv('Energy Ball', 'Grass', 90)] }),
      mon('Cryogonal', 55, ['Ice'], { ability: 'Levitate', moves: [mv('Ice Beam', 'Ice', 90), mv('Confuse Ray', 'Ghost'), mv('Flash Cannon', 'Steel', 80), mv('Hail', 'Ice')] }),
      mon('Avalugg', 59, ['Ice'], { ability: 'Ice Body', moves: [mv('Avalanche', 'Ice', 60), mv('Crunch', 'Dark', 80), mv('Curse', 'Ghost'), mv('Gyro Ball', 'Steel')] }),
    ],
    notes: 'Snowbelle Gym Leader (Ice-type). Awards the Iceberg Badge. Verified per Bulbapedia (Wulfric page).',
  }),
  boss({
    id: 'xy-calem-serena-victory-road',
    name: 'Calem/Serena (Pre-League)',
    location: 'Victory Road',
    order: 25,
    category: 'rival',
    levelCap: 63,
    team: [],
    notes: 'Final pre-Elite Four rival battle. Bulbapedia\'s rival battle list (Tower of Mastery, Coumarine City, Route 14, Poké Ball Factory multi, Anistar City, Kiloude City) does not include a separate Victory Road encounter; the late-game rival fights between Snowbelle and the League are the Anistar fight + Kiloude (postgame). TODO: verify whether this entry should instead represent the Coumarine City, Route 14, or Anistar City rival fight, and populate verified team/levels.',
  }),
  boss({
    id: 'xy-malva',
    name: 'Malva',
    location: 'Pokémon League',
    order: 26,
    category: 'elite-four',
    levelCap: 65,
    team: [
      mon('Pyroar', 63, ['Fire', 'Normal'], { ability: 'Rivalry', moves: [mv('Hyper Voice', 'Normal', 90), mv('Flamethrower', 'Fire', 90), mv('Wild Charge', 'Electric', 90), mv('Noble Roar', 'Normal')] }),
      mon('Torkoal', 63, ['Fire'], { ability: 'White Smoke', moves: [mv('Curse', 'Ghost'), mv('Earthquake', 'Ground', 100), mv('Stone Edge', 'Rock', 100), mv('Flame Wheel', 'Fire', 60)] }),
      mon('Chandelure', 63, ['Ghost', 'Fire'], { ability: 'Flame Body', moves: [mv('Flamethrower', 'Fire', 90), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost'), mv('Confide', 'Normal')] }),
      mon('Talonflame', 65, ['Fire', 'Flying'], { ability: 'Flame Body', moves: [mv('Brave Bird', 'Flying', 120), mv('Quick Attack', 'Normal', 40), mv('Flare Blitz', 'Fire', 120), mv('Flail', 'Normal')] }),
    ],
    notes: 'Elite Four (Fire-type). Verified per Bulbapedia (Malva page).',
  }),
  boss({
    id: 'xy-siebold',
    name: 'Siebold',
    location: 'Pokémon League',
    order: 27,
    category: 'elite-four',
    levelCap: 65,
    team: [
      mon('Clawitzer', 63, ['Water'], { ability: 'Mega Launcher', moves: [mv('Water Pulse', 'Water', 60), mv('Dark Pulse', 'Dark', 80), mv('Dragon Pulse', 'Dragon', 85), mv('Aura Sphere', 'Fighting', 80)] }),
      mon('Gyarados', 63, ['Water', 'Flying'], { ability: 'Intimidate', moves: [mv('Waterfall', 'Water', 80), mv('Ice Fang', 'Ice', 65), mv('Earthquake', 'Ground', 100), mv('Dragon Dance', 'Dragon')] }),
      mon('Starmie', 63, ['Water', 'Psychic'], { ability: 'Illuminate', moves: [mv('Dazzling Gleam', 'Fairy', 80), mv('Psychic', 'Psychic', 90), mv('Surf', 'Water', 90), mv('Light Screen', 'Psychic')] }),
      mon('Barbaracle', 65, ['Rock', 'Water'], { ability: 'Tough Claws', moves: [mv('Cross Chop', 'Fighting', 100), mv('Stone Edge', 'Rock', 100), mv('Razor Shell', 'Water', 75), mv('X-Scissor', 'Bug', 80)] }),
    ],
    notes: 'Elite Four (Water-type). Verified per Bulbapedia (Siebold page).',
  }),
  boss({
    id: 'xy-wikstrom',
    name: 'Wikstrom',
    location: 'Pokémon League',
    order: 28,
    category: 'elite-four',
    levelCap: 65,
    team: [
      mon('Klefki', 63, ['Steel', 'Fairy'], { ability: 'Prankster', moves: [mv('Dazzling Gleam', 'Fairy', 80), mv('Flash Cannon', 'Steel', 80), mv('Torment', 'Dark'), mv('Spikes', 'Ground')] }),
      mon('Probopass', 63, ['Rock', 'Steel'], { ability: 'Sturdy', moves: [mv('Earth Power', 'Ground', 90), mv('Power Gem', 'Rock', 80), mv('Discharge', 'Electric', 80), mv('Flash Cannon', 'Steel', 80)] }),
      mon('Scizor', 63, ['Bug', 'Steel'], { ability: 'Technician', moves: [mv('Bullet Punch', 'Steel', 40), mv('X-Scissor', 'Bug', 80), mv('Iron Head', 'Steel', 80), mv('Night Slash', 'Dark', 70)] }),
      mon('Aegislash', 65, ['Steel', 'Ghost'], { ability: 'Stance Change', moves: [mv('King\'s Shield', 'Steel'), mv('Sacred Sword', 'Fighting', 90), mv('Shadow Claw', 'Ghost', 70), mv('Iron Head', 'Steel', 80)] }),
    ],
    notes: 'Elite Four (Steel-type). Verified per Bulbapedia (Wikstrom page).',
  }),
  boss({
    id: 'xy-drasna',
    name: 'Drasna',
    location: 'Pokémon League',
    order: 29,
    category: 'elite-four',
    levelCap: 65,
    team: [
      mon('Dragalge', 63, ['Poison', 'Dragon'], { ability: 'Poison Point', moves: [mv('Dragon Pulse', 'Dragon', 85), mv('Surf', 'Water', 90), mv('Sludge Bomb', 'Poison', 90), mv('Thunderbolt', 'Electric', 90)] }),
      mon('Druddigon', 63, ['Dragon'], { ability: 'Rough Skin', moves: [mv('Dragon Tail', 'Dragon', 60), mv('Revenge', 'Fighting', 60), mv('Retaliate', 'Normal', 70), mv('Chip Away', 'Normal', 70)] }),
      mon('Altaria', 63, ['Dragon', 'Flying'], { ability: 'Natural Cure', moves: [mv('Moonblast', 'Fairy', 95), mv('Dragon Pulse', 'Dragon', 85), mv('Cotton Guard', 'Grass'), mv('Sing', 'Normal')] }),
      mon('Noivern', 65, ['Flying', 'Dragon'], { ability: 'Frisk', moves: [mv('Air Slash', 'Flying', 75), mv('Dragon Pulse', 'Dragon', 85), mv('Flamethrower', 'Fire', 90), mv('Super Fang', 'Normal')] }),
    ],
    notes: 'Elite Four (Dragon-type). Verified per Bulbapedia (Drasna page).',
  }),
  boss({
    id: 'xy-diantha',
    name: 'Diantha',
    location: 'Pokémon League',
    order: 30,
    category: 'champion',
    levelCap: 68,
    team: [
      mon('Hawlucha', 64, ['Fighting', 'Flying'], { ability: 'Limber', moves: [mv('Swords Dance', 'Normal'), mv('Flying Press', 'Fighting', 80), mv('X-Scissor', 'Bug', 80), mv('Poison Jab', 'Poison', 80)] }),
      mon('Tyrantrum', 65, ['Rock', 'Dragon'], { ability: 'Strong Jaw', moves: [mv('Head Smash', 'Rock', 150), mv('Earthquake', 'Ground', 100), mv('Dragon Claw', 'Dragon', 80), mv('Crunch', 'Dark', 80)] }),
      mon('Aurorus', 65, ['Rock', 'Ice'], { ability: 'Refrigerate', moves: [mv('Thunder', 'Electric', 110), mv('Blizzard', 'Ice', 110), mv('Light Screen', 'Psychic'), mv('Reflect', 'Psychic')] }),
      mon('Gourgeist', 65, ['Ghost', 'Grass'], { ability: 'Pickup', moves: [mv('Trick-or-Treat', 'Ghost'), mv('Phantom Force', 'Ghost', 90), mv('Seed Bomb', 'Grass', 80), mv('Shadow Sneak', 'Ghost', 40)] }),
      mon('Goodra', 66, ['Dragon'], { ability: 'Sap Sipper', moves: [mv('Dragon Pulse', 'Dragon', 85), mv('Muddy Water', 'Water', 90), mv('Fire Blast', 'Fire', 110), mv('Focus Blast', 'Fighting', 120)] }),
      mon('Gardevoir', 68, ['Psychic', 'Fairy'], { ability: 'Trace', item: 'Gardevoirite', moves: [mv('Moonblast', 'Fairy', 95), mv('Psychic', 'Psychic', 90), mv('Shadow Ball', 'Ghost', 80), mv('Thunderbolt', 'Electric', 90)], notes: 'Mega-evolves into Mega Gardevoir (Psychic/Fairy) during the battle.' }),
    ],
    notes: 'Kalos Champion. Mega-evolves her Gardevoir (Gardevoirite) during the battle. Verified per Bulbapedia (Diantha page).',
  }),
  boss({
    id: 'xy-az-lumiose',
    name: 'AZ',
    location: 'Lumiose City',
    order: 31,
    category: 'boss',
    levelCap: 60,
    team: [
      mon('Torkoal', 60, ['Fire'], { ability: 'White Smoke', moves: [mv('Lava Plume', 'Fire', 80), mv('Stone Edge', 'Rock', 100), mv('Body Slam', 'Normal', 85), mv('Return', 'Normal')] }),
      mon('Golurk', 60, ['Ground', 'Ghost'], { ability: 'No Guard', moves: [mv('Phantom Force', 'Ghost', 90), mv('Heavy Slam', 'Steel'), mv('Mega Punch', 'Normal', 80), mv('Return', 'Normal')] }),
      mon('Sigilyph', 60, ['Psychic', 'Flying'], { ability: 'Magic Guard', moves: [mv('Psychic', 'Psychic', 90), mv('Air Slash', 'Flying', 75), mv('Cosmic Power', 'Psychic'), mv('Return', 'Normal')] }),
    ],
    notes: 'Post-Champion story battle in Lumiose City (NOT Couriway as previously stated). Winning is not mandatory (no whiteout). Verified per Bulbapedia (AZ page).',
  }),
];

// Tierno/Trevor/Shauna group multi-battles (Route 7 multi, Coumarine area, etc.) are not yet populated
// as standalone boss-prep entries; they appear with rival/partner support in the canonical story.
// TODO: Populate Tierno/Trevor/Shauna group battles if the tracker later adds explicit entries.
// TODO: Populate the canonical late-game rival battles separately (Coumarine City, Route 14, Anistar City)
// instead of (or alongside) the placeholder Victory Road entry once decided.
