import type { StarterChoice } from '@/app/nuzlocke/types';
import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

/**
 * Sun/Moon bosses.
 *
 * Pass 1 (this file) populates verified canonical Melemele Island bosses:
 *   - Hau (Iki Town first battle)
 *   - Hau (Iki Town festival battle)
 *   - Captain Ilima (Trainers' School / pre-trial)
 *   - Totem Gumshoos (Sun) / Totem Alolan Raticate (Moon)
 *   - Kahuna Hala Grand Trial
 *
 * Bosses beyond Melemele remain skeleton entries with `levelCap: null` so they render as
 * "TBD" in the UI without fabricating fake caps. Future passes will replace skeletons
 * one-by-one with verified canonical teams.
 */

type SmMove = NonNullable<BossTrainerPokemon['moves']>[number];
type SmBossCategory = 'rival' | 'kahuna' | 'trial-captain' | 'totem' | 'evil-team' | 'boss' | 'elite-four' | 'champion';

const mv = (name: string, type: SmMove['type'], power: number | null = null): SmMove => ({ name, type, power });
const mon = (
  species: string,
  level: number,
  types: BossTrainerPokemon['types'],
  extras: Partial<BossTrainerPokemon> = {},
): BossTrainerPokemon => ({ species, level, types, ...extras });

const skeletonBoss = (
  id: string,
  name: string,
  location: string,
  order: number,
  category: SmBossCategory,
  todoLabel: string,
  gameOverride?: BossTrainer['game'],
): BossTrainer => ({
  id,
  name,
  category,
  game: gameOverride ?? 'Both',
  location,
  recommendedOrder: order,
  // Explicit null marks this as TBD; the converter forwards null to the UI's "TBD" path.
  levelCap: null,
  notes: `TODO: Populate canonical ${todoLabel} data.`,
  baseTeam: [],
});

const boss = (params: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: SmBossCategory;
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

// =============================================================================================
// Hau — Iki Town first battle (right after starter pickup).
// =============================================================================================
// Per Bulbapedia, Hau picks the starter weak to the player's choice (player grass → rival water).
// The variant team payload here is JUST the rival starter; the empty `baseTeam` lets the adapter
// concatenate the variant cleanly when the player's starter is known.

const hauIkiTownVariants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Popplio', 5, ['Water'], { ability: 'Torrent', moves: [mv('Pound', 'Normal', 40), mv('Water Gun', 'Water', 40)] })],
  fire: [mon('Rowlet', 5, ['Grass', 'Flying'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Leafage', 'Grass', 40)] })],
  water: [mon('Litten', 5, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Ember', 'Fire', 40)] })],
};

const hauIkiTownFestivalVariants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Popplio', 7, ['Water'], { ability: 'Torrent', moves: [mv('Pound', 'Normal', 40), mv('Water Gun', 'Water', 40), mv('Growl', 'Normal')] })],
  fire: [mon('Rowlet', 7, ['Grass', 'Flying'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Leafage', 'Grass', 40), mv('Growl', 'Normal')] })],
  water: [mon('Litten', 7, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Ember', 'Fire', 40), mv('Growl', 'Normal')] })],
};

// =============================================================================================
// Boss entries.
// =============================================================================================

export const sunMoonBosses: BossTrainer[] = [
  // -- Hau battles (Melemele) --
  boss({
    id: 'sm-rival-hau-iki',
    name: 'Hau (Iki Town intro)',
    location: 'Iki Town',
    order: 5,
    category: 'rival',
    levelCap: 5,
    baseTeam: [],
    variantsByRivalStarterChoice: hauIkiTownVariants,
    notes: 'Hau\'s first battle right after the starter pickup. Hau uses the starter weak to the player\'s choice (Lv 5).',
  }),
  boss({
    id: 'sm-rival-hau-festival',
    name: 'Hau (Iki Town festival)',
    location: 'Iki Town',
    order: 6,
    category: 'rival',
    levelCap: 7,
    baseTeam: [mon('Pichu', 6, ['Electric'], { ability: 'Static', moves: [mv('ThunderShock', 'Electric', 40), mv('Charm', 'Fairy'), mv('Tail Whip', 'Normal')] })],
    variantsByRivalStarterChoice: hauIkiTownFestivalVariants,
    notes: 'Iki Town festival battle. Pichu (Lv 6) plus the rival starter weak to the player\'s choice (Lv 7).',
  }),

  // -- Captain Ilima (Trainers' School / pre-trial Verdant Cavern showcase) --
  boss({
    id: 'sm-trial-ilima',
    name: 'Trial Captain Ilima',
    location: "Trainers' School (Hau'oli City)",
    order: 10,
    category: 'trial-captain',
    levelCap: 15,
    team: [
      mon('Smeargle', 14, ['Normal'], {
        ability: 'Technician',
        moves: [mv('Quick Attack', 'Normal', 40), mv('Ember', 'Fire', 40), mv('Water Gun', 'Water', 40), mv('Leafage', 'Grass', 40)],
      }),
      mon('Gumshoos', 15, ['Normal'], {
        ability: 'Stakeout',
        item: 'Normalium Z',
        moves: [mv('Tackle', 'Normal', 40), mv('Pursuit', 'Dark', 40), mv('Leer', 'Normal')],
        notes: 'Can Z-Move (Breakneck Blitz).',
      }),
    ],
    notes: "Ilima's pre-trial showcase battle at the Trainers' School. Per Bulbapedia, no Sun/Moon version differences.",
  }),

  // -- Totem battles — version-exclusive --
  boss({
    id: 'sm-totem-gumshoos',
    name: 'Totem Gumshoos',
    location: 'Verdant Cavern',
    order: 11,
    category: 'totem',
    levelCap: 12,
    game: 'Sun',
    team: [
      mon('Gumshoos', 12, ['Normal'], {
        ability: 'Adaptability',
        notes: 'Totem boost; calls Yungoos (Lv 10) as a Totem ally.',
      }),
      mon('Yungoos', 10, ['Normal'], {
        ability: 'Stakeout',
        notes: 'Totem ally summoned via SOS on turn 1.',
      }),
    ],
    notes: 'Sun-exclusive Totem Pokémon (Verdant Cavern). Moves not fully verified this pass — TODO.',
  }),
  boss({
    id: 'sm-totem-alolan-raticate',
    name: 'Totem Alolan Raticate',
    location: 'Verdant Cavern',
    order: 11,
    category: 'totem',
    levelCap: 12,
    game: 'Moon',
    team: [
      mon('Alolan Raticate', 12, ['Dark', 'Normal'], {
        ability: 'Gluttony',
        notes: 'Totem boost; calls Alolan Rattata (Lv 10) as a Totem ally.',
      }),
      mon('Alolan Rattata', 10, ['Dark', 'Normal'], {
        ability: 'Hustle',
        notes: 'Totem ally summoned via SOS on turn 1.',
      }),
    ],
    notes: 'Moon-exclusive Totem Pokémon (Verdant Cavern). Moves not fully verified this pass — TODO.',
  }),

  // -- Kahuna Hala Grand Trial (Melemele) --
  boss({
    id: 'sm-kahuna-hala',
    name: 'Kahuna Hala',
    location: 'Iki Town',
    order: 12,
    category: 'kahuna',
    levelCap: 15,
    team: [
      mon('Mankey', 14, ['Fighting'], {
        ability: 'Anger Point',
        moves: [mv('Karate Chop', 'Fighting', 50), mv('Focus Energy', 'Normal'), mv('Pursuit', 'Dark', 40)],
      }),
      mon('Makuhita', 14, ['Fighting'], {
        ability: 'Thick Fat',
        moves: [mv('Fake Out', 'Normal', 40), mv('Sand Attack', 'Ground'), mv('Arm Thrust', 'Fighting', 15)],
      }),
      mon('Crabrawler', 15, ['Fighting'], {
        ability: 'Iron Fist',
        item: 'Fightinium Z',
        moves: [mv('Power-Up Punch', 'Fighting', 40), mv('Pursuit', 'Dark', 40), mv('Leer', 'Normal')],
        notes: 'Hala powers up Crabrawler with All-Out Pummeling at the first opportunity.',
      }),
    ],
    notes: 'Melemele Grand Trial. Earns the Z-Crystal Fightinium Z on victory.',
  }),

  // =========================================================================================
  // SKELETON entries for everything else — kept as TBD until populated in future passes.
  // =========================================================================================

  // -- Akala captains + totems (Pass 2 verified) --
  skeletonBoss('sm-trial-lana', 'Trial Captain Lana', 'Brooklet Hill', 20, 'trial-captain', 'Captain Lana'),
  boss({
    id: 'sm-totem-wishiwashi',
    name: 'Totem Wishiwashi',
    location: 'Brooklet Hill',
    order: 21,
    category: 'totem',
    levelCap: 20,
    team: [
      mon('Wishiwashi', 20, ['Water'], {
        ability: 'Schooling',
        notes: 'Begins battle already in School Form. Aura boost: +1 Defense. Calls Wishiwashi on turn 1; calls Alomomola when HP drops below half.',
      }),
      mon('Wishiwashi', 18, ['Water'], {
        ability: 'Schooling',
        notes: 'Totem ally (Solo Form) summoned via SOS on turn 1.',
      }),
      mon('Alomomola', 18, ['Water'], {
        ability: 'Healer',
        notes: 'Totem secondary ally summoned via SOS when Wishiwashi HP < 50%.',
      }),
    ],
    notes: "Lana's Brooklet Hill trial. Moves not fully verified this pass — TODO.",
  }),
  skeletonBoss('sm-trial-kiawe', 'Trial Captain Kiawe', 'Wela Volcano Park', 22, 'trial-captain', 'Captain Kiawe'),
  boss({
    id: 'sm-totem-salazzle',
    name: 'Totem Salazzle',
    location: 'Wela Volcano Park',
    order: 23,
    category: 'totem',
    levelCap: 22,
    game: 'Sun',
    team: [
      mon('Salazzle', 22, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        notes: 'Sun-exclusive Totem. Aura boost: +1 Special Defense. Calls Salandit (male, Lv 20) repeatedly throughout the battle.',
      }),
      mon('Salandit', 20, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        notes: 'Totem ally — Salazzle keeps summoning male Salandit regardless of how many the player has defeated.',
      }),
    ],
    notes: 'Sun-exclusive Wela Volcano Park Totem. Moves not fully verified this pass — TODO.',
  }),
  boss({
    id: 'sm-totem-marowak',
    name: 'Totem Alolan Marowak',
    location: 'Wela Volcano Park',
    order: 23,
    category: 'totem',
    levelCap: 22,
    game: 'Moon',
    team: [
      mon('Alolan Marowak', 22, ['Fire', 'Ghost'], {
        notes: 'Moon-exclusive Totem. Ability/aura boost not reliably surfaced from the source this pass — TODO.',
      }),
      mon('Salazzle', 20, ['Poison', 'Fire'], {
        notes: 'Totem ally (Salazzle female).',
      }),
    ],
    notes: 'Moon-exclusive Wela Volcano Park Totem. Ability, aura boost, and moves not fully verified — TODO.',
  }),
  skeletonBoss('sm-trial-mallow', 'Trial Captain Mallow', 'Lush Jungle', 24, 'trial-captain', 'Captain Mallow'),
  boss({
    id: 'sm-totem-lurantis',
    name: 'Totem Lurantis',
    location: 'Lush Jungle',
    order: 25,
    category: 'totem',
    levelCap: 24,
    team: [
      mon('Lurantis', 24, ['Grass'], {
        ability: 'Leaf Guard',
        item: 'Power Herb',
        moves: [mv('Razor Leaf', 'Grass', 55), mv('X-Scissor', 'Bug', 80), mv('Solar Blade', 'Grass', 125), mv('Synthesis', 'Grass')],
        notes: 'Aura boost: +2 Speed. Calls Trumbeak on turn 1; calls Castform if HP drops below ~2/3.',
      }),
      mon('Trumbeak', 22, ['Normal', 'Flying'], {
        notes: 'Totem ally summoned on turn 1.',
      }),
      mon('Castform', 22, ['Normal'], {
        notes: 'Totem secondary ally summoned when Lurantis HP < ~2/3.',
      }),
    ],
    notes: "Mallow's Lush Jungle trial. Awards Grassium Z.",
  }),

  // -- Akala Kahuna (Pass 2 verified) --
  boss({
    id: 'sm-kahuna-olivia',
    name: 'Kahuna Olivia',
    location: 'Ruins of Life (Konikoni)',
    order: 26,
    category: 'kahuna',
    levelCap: 27,
    team: [
      mon('Nosepass', 26, ['Rock'], {
        ability: 'Sturdy',
        moves: [mv('Rock Slide', 'Rock', 75), mv('Spark', 'Electric', 65), mv('Thunder Wave', 'Electric')],
      }),
      mon('Boldore', 26, ['Rock'], {
        ability: 'Sturdy',
        moves: [mv('Rock Blast', 'Rock', 25), mv('Mud-Slap', 'Ground', 20), mv('Headbutt', 'Normal', 70)],
      }),
      mon('Lycanroc', 27, ['Rock'], {
        ability: 'Vital Spirit',
        item: 'Rockium Z',
        moves: [mv('Bite', 'Dark', 60), mv('Rock Throw', 'Rock', 50)],
        notes: 'Midnight Form. Uses Continental Crush (Rockium Z) at the first opportunity.',
      }),
    ],
    notes: 'Akala Grand Trial. Earns Rockium Z on victory.',
  }),

  // -- Ula'ula captains + totems (Pass 3) --
  skeletonBoss('sm-trial-sophocles', 'Trial Captain Sophocles', 'Mount Hokulani', 30, 'trial-captain', 'Captain Sophocles'),
  boss({
    id: 'sm-totem-vikavolt',
    name: 'Totem Vikavolt',
    location: 'Mount Hokulani (Hokulani Observatory)',
    order: 31,
    category: 'totem',
    levelCap: 29,
    team: [
      mon('Vikavolt', 29, ['Bug', 'Electric'], {
        notes: "Sophocles's trial Totem; uses Guillotine and calls allies during battle. Ability and exact aura boost not surfaced from source — TODO.",
      }),
      mon('Charjabug', 26, ['Bug', 'Electric'], {
        notes: 'Totem ally typically summoned during the battle — exact summon conditions not surfaced — TODO.',
      }),
    ],
    notes: 'Hokulani Observatory trial Totem. Awards Electrium Z. Ability/aura/exact moves not fully verified this pass.',
  }),
  skeletonBoss('sm-trial-acerola', 'Trial Captain Acerola', 'Thrifty Megamart (Abandoned)', 32, 'trial-captain', 'Captain Acerola'),
  boss({
    id: 'sm-totem-mimikyu',
    name: 'Totem Mimikyu',
    location: 'Thrifty Megamart (Abandoned)',
    order: 33,
    category: 'totem',
    levelCap: 33,
    team: [
      mon('Mimikyu', 33, ['Ghost', 'Fairy'], {
        ability: 'Disguise',
        item: 'Lum Berry',
        moves: [mv('Play Rough', 'Fairy', 90), mv('Shadow Claw', 'Ghost', 70), mv('Astonish', 'Ghost', 30), mv('Mimic', 'Normal')],
        notes: 'Aura boost: +1 to Atk/Def/SpA/SpD/Speed. Calls Haunter first; calls Gengar if Haunter faints.',
      }),
      mon('Haunter', 27, ['Ghost', 'Poison'], {
        moves: [mv('Hypnosis', 'Psychic'), mv('Sucker Punch', 'Dark', 70), mv('Night Shade', 'Ghost'), mv('Lick', 'Ghost', 30)],
        notes: 'Totem ally summoned when Mimikyu HP < ~2/3.',
      }),
      mon('Gengar', 27, ['Ghost', 'Poison'], {
        moves: [mv('Hypnosis', 'Psychic'), mv('Sucker Punch', 'Dark', 70), mv('Night Shade', 'Ghost'), mv('Lick', 'Ghost', 30)],
        notes: 'Totem secondary ally summoned if Haunter faints and Mimikyu still has an open ally slot.',
      }),
    ],
    notes: "Acerola's Thrifty Megamart trial Totem. Awards Ghostium Z.",
  }),

  // -- Ula'ula Kahuna (Pass 3 verified) --
  boss({
    id: 'sm-kahuna-nanu',
    name: 'Kahuna Nanu',
    location: 'Malie City',
    order: 34,
    category: 'kahuna',
    levelCap: 39,
    team: [
      mon('Sableye', 38, ['Dark', 'Ghost'], {
        ability: 'Keen Eye',
        moves: [mv('Power Gem', 'Rock', 80), mv('Shadow Ball', 'Ghost', 80), mv('Fake Out', 'Normal', 40)],
      }),
      mon('Krokorok', 38, ['Ground', 'Dark'], {
        ability: 'Intimidate',
        moves: [mv('Crunch', 'Dark', 80), mv('Assurance', 'Dark', 60), mv('Swagger', 'Normal'), mv('Earthquake', 'Ground', 100)],
      }),
      mon('Alolan Persian', 39, ['Dark'], {
        ability: 'Fur Coat',
        item: 'Darkinium Z',
        moves: [mv('Power Gem', 'Rock', 80), mv('Fake Out', 'Normal', 40), mv('Dark Pulse', 'Dark', 80)],
        notes: 'Uses Black Hole Eclipse (Darkinium Z) at the first opportunity.',
      }),
    ],
    notes: "Ula'ula Grand Trial in Malie City. Earns Darkinium Z on victory.",
  }),

  // -- Poni Island (Pass 5 verified) --
  skeletonBoss('sm-trial-mina', 'Trial Captain Mina', 'Poni Island', 40, 'trial-captain', 'Captain Mina'),
  boss({
    id: 'sm-totem-kommoo',
    name: 'Totem Kommo-o',
    location: 'Vast Poni Canyon',
    order: 41,
    category: 'totem',
    levelCap: 45,
    team: [
      mon('Kommo-o', 45, ['Dragon', 'Fighting'], {
        ability: 'Soundproof',
        item: 'Mental Herb',
        moves: [mv('Clanging Scales', 'Dragon', 110), mv('Sky Uppercut', 'Fighting', 85), mv('Flash Cannon', 'Steel', 80), mv('Protect', 'Normal')],
        notes: 'Aura boost: +1 to all stats. Calls Hakamo-o turn 1; calls Scizor when HP < 2/3.',
      }),
      mon('Hakamo-o', 32, ['Dragon', 'Fighting'], { notes: 'Totem ally summoned on turn 1.' }),
      mon('Scizor', 32, ['Bug', 'Steel'], { notes: 'Totem secondary ally summoned when Kommo-o HP < 2/3.' }),
    ],
    notes: 'Vast Poni Canyon trial Totem. Awards Dragonium Z.',
  }),

  // -- Poni Kahuna (Pass 5 verified) --
  boss({
    id: 'sm-kahuna-hapu',
    name: 'Kahuna Hapu',
    location: 'Vast Poni Canyon',
    order: 42,
    category: 'kahuna',
    levelCap: 48,
    team: [
      mon('Alolan Dugtrio', 47, ['Ground', 'Steel'], {
        ability: 'Sand Veil',
        moves: [mv('Iron Head', 'Steel', 80), mv('Earthquake', 'Ground', 100), mv('Sucker Punch', 'Dark', 70), mv('Sandstorm', 'Rock')],
      }),
      mon('Gastrodon', 47, ['Water', 'Ground'], {
        ability: 'Sticky Hold',
        moves: [mv('Muddy Water', 'Water', 90), mv('Mud Bomb', 'Ground', 65), mv('Recover', 'Normal')],
      }),
      mon('Flygon', 47, ['Ground', 'Dragon'], {
        ability: 'Levitate',
        moves: [mv('Earth Power', 'Ground', 90), mv('Dragon Breath', 'Dragon', 60)],
      }),
      mon('Mudsdale', 48, ['Ground'], {
        ability: 'Stamina',
        item: 'Groundium Z',
        moves: [mv('Heavy Slam', 'Steel'), mv('Earthquake', 'Ground', 100), mv('Double Kick', 'Fighting', 30), mv('Counter', 'Fighting')],
        notes: 'Uses Tectonic Rage (Groundium Z) at the first opportunity.',
      }),
    ],
    notes: 'Poni Grand Trial in Vast Poni Canyon. Earns Groundium Z on victory.',
  }),

  // -- Team Skull (Pass 4 expands Plumeria + Guzma Po Town) --
  boss({
    id: 'sm-skull-plumeria-1',
    name: 'Plumeria (Akala Outskirts)',
    location: 'Akala Outskirts',
    order: 27,
    category: 'evil-team',
    levelCap: 25,
    team: [
      mon('Golbat', 25, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Salandit', 25, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        moves: [mv('Flame Burst', 'Fire', 70), mv('Double Slap', 'Normal', 15), mv('Poison Gas', 'Poison')],
      }),
    ],
    notes: 'First Plumeria battle, on the Akala Outskirts.',
  }),
  boss({
    id: 'sm-skull-plumeria-2',
    name: 'Plumeria (Route 15)',
    location: 'Route 15',
    order: 33,
    category: 'evil-team',
    levelCap: 35,
    team: [
      mon('Golbat', 34, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Cutter', 'Flying', 60), mv('Confuse Ray', 'Ghost'), mv('Poison Fang', 'Poison', 50)],
      }),
      mon('Salazzle', 35, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        moves: [mv('Flame Burst', 'Fire', 70), mv('Double Slap', 'Normal', 15), mv('Toxic', 'Poison'), mv('Dragon Rage', 'Dragon')],
      }),
    ],
    notes: 'Second Plumeria battle, on Route 15 / near Aether House.',
  }),
  boss({
    id: 'sm-skull-guzma-malie',
    name: 'Guzma (Malie Garden)',
    location: 'Malie Garden',
    order: 36,
    category: 'evil-team',
    levelCap: 31,
    team: [
      mon('Golisopod', 31, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('First Impression', 'Bug', 90), mv('Razor Shell', 'Water', 75), mv('Swords Dance', 'Normal')],
      }),
      mon('Ariados', 30, ['Bug', 'Poison'], {
        ability: 'Swarm',
        moves: [mv('Fell Stinger', 'Bug', 50), mv('Sucker Punch', 'Dark', 70), mv('Shadow Sneak', 'Ghost', 40), mv('Infestation', 'Bug', 20)],
      }),
    ],
    notes: 'First Guzma main battle, in Malie Garden. Earlier Skull-related Malie battles fold into this entry.',
  }),
  boss({
    id: 'sm-skull-guzma-po-town',
    name: 'Guzma (Po Town / Shady House)',
    location: 'Po Town (Shady House)',
    order: 38,
    category: 'evil-team',
    levelCap: 37,
    team: [
      mon('Golisopod', 37, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('First Impression', 'Bug', 90), mv('Razor Shell', 'Water', 75), mv('Swords Dance', 'Normal')],
      }),
      mon('Ariados', 36, ['Bug', 'Poison'], {
        ability: 'Swarm',
        moves: [mv('Fell Stinger', 'Bug', 50), mv('Sucker Punch', 'Dark', 70), mv('Shadow Sneak', 'Ghost', 40), mv('Infestation', 'Bug', 20)],
      }),
    ],
    notes: 'Second Guzma battle, at the Shady House after pushing through Team Skull Grunts.',
  }),
  boss({
    id: 'sm-skull-guzma-aether',
    name: 'Guzma (Aether Paradise)',
    location: 'Aether Paradise',
    order: 52,
    category: 'evil-team',
    levelCap: 41,
    team: [
      mon('Golisopod', 41, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('First Impression', 'Bug', 90), mv('Razor Shell', 'Water', 75), mv('Swords Dance', 'Normal')],
      }),
      mon('Ariados', 40, ['Bug', 'Poison'], {
        ability: 'Swarm',
        moves: [mv('Fell Stinger', 'Bug', 50), mv('Sucker Punch', 'Dark', 70), mv('Shadow Sneak', 'Ghost', 40)],
      }),
      mon('Masquerain', 40, ['Bug', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Bug Buzz', 'Bug', 90), mv('Air Slash', 'Flying', 75)],
      }),
      mon('Pinsir', 40, ['Bug'], {
        ability: 'Hyper Cutter',
        moves: [mv('X-Scissor', 'Bug', 80), mv('Brick Break', 'Fighting', 75), mv('Double Hit', 'Normal', 35)],
      }),
    ],
    notes: 'Guzma battle during the Aether Paradise raid.',
  }),

  // -- Aether bosses --
  boss({
    id: 'sm-aether-faba-1',
    name: 'Aether Branch Chief Faba (1st)',
    location: 'Aether Paradise',
    order: 51,
    category: 'boss',
    levelCap: 39,
    team: [
      mon('Hypno', 39, ['Psychic'], {
        ability: 'Insomnia',
        moves: [mv('Psychic', 'Psychic', 90), mv('Hypnosis', 'Psychic'), mv('Disable', 'Normal'), mv('Nightmare', 'Ghost')],
      }),
    ],
    notes: 'First Faba battle during the Aether Paradise raid.',
  }),
  boss({
    id: 'sm-aether-faba-2',
    name: 'Aether Branch Chief Faba (2nd)',
    location: 'Aether Paradise',
    order: 52,
    category: 'boss',
    levelCap: 40,
    team: [
      mon('Slowbro', 39, ['Water', 'Psychic'], {
        ability: 'Oblivious',
        moves: [mv('Yawn', 'Normal'), mv('Psychic', 'Psychic', 90), mv('Amnesia', 'Psychic'), mv('Headbutt', 'Normal', 70)],
      }),
      mon('Bruxish', 39, ['Water', 'Psychic'], {
        ability: 'Strong Jaw',
        moves: [mv('Aqua Jet', 'Water', 40), mv('Crunch', 'Dark', 80), mv('Psychic Fangs', 'Psychic', 85)],
      }),
      mon('Hypno', 40, ['Psychic'], {
        ability: 'Insomnia',
        moves: [mv('Psychic', 'Psychic', 90), mv('Hypnosis', 'Psychic'), mv('Disable', 'Normal'), mv('Nightmare', 'Ghost')],
      }),
    ],
    notes: 'Second Faba battle (paired with an Aether Foundation Employee).',
  }),
  boss({
    id: 'sm-aether-lusamine',
    name: 'Aether President Lusamine (Aether Paradise)',
    location: 'Aether Paradise',
    order: 54,
    category: 'boss',
    levelCap: 41,
    team: [
      mon('Clefable', 41, ['Fairy'], {
        ability: 'Magic Guard',
        moves: [mv('Cosmic Power', 'Psychic'), mv('Metronome', 'Normal'), mv('Moonblast', 'Fairy', 95)],
      }),
      mon('Lilligant', 41, ['Grass'], {
        ability: 'Own Tempo',
        moves: [mv('Petal Dance', 'Grass', 120), mv('Teeter Dance', 'Normal'), mv('Stun Spore', 'Grass')],
      }),
      mon('Mismagius', 41, ['Ghost'], {
        ability: 'Levitate',
        moves: [mv('Mystical Fire', 'Fire', 75), mv('Shadow Ball', 'Ghost', 80), mv('Power Gem', 'Rock', 80)],
      }),
      mon('Milotic', 41, ['Water'], {
        ability: 'Marvel Scale',
        moves: [mv('Hydro Pump', 'Water', 110), mv('Flail', 'Normal'), mv('Safeguard', 'Normal')],
      }),
      mon('Bewear', 41, ['Normal', 'Fighting'], {
        ability: 'Fluffy',
        moves: [mv('Baby-Doll Eyes', 'Fairy'), mv('Take Down', 'Normal', 90), mv('Hammer Arm', 'Fighting', 100)],
      }),
    ],
    notes: 'First Lusamine battle, at Aether Paradise. Not mandatory to win for story progression.',
  }),
  boss({
    id: 'sm-aether-lusamine-ultra-deep-sea',
    name: 'Lusamine (Ultra Deep Sea)',
    location: 'Ultra Deep Sea',
    order: 56,
    category: 'boss',
    levelCap: 50,
    team: [
      mon('Clefable', 50, ['Fairy'], {
        ability: 'Magic Guard',
        moves: [mv('Moonblast', 'Fairy', 95), mv('Cosmic Power', 'Psychic'), mv('Metronome', 'Normal'), mv('Moonlight', 'Fairy')],
        notes: 'Totem-style aura: +1 Sp. Def.',
      }),
      mon('Lilligant', 50, ['Grass'], {
        ability: 'Own Tempo',
        moves: [mv('Leech Seed', 'Grass'), mv('Petal Dance', 'Grass', 120), mv('Teeter Dance', 'Normal'), mv('Stun Spore', 'Grass')],
        notes: 'Totem-style aura: +1 Sp. Atk.',
      }),
      mon('Mismagius', 50, ['Ghost'], {
        ability: 'Levitate',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Power Gem', 'Rock', 80), mv('Mystical Fire', 'Fire', 75), mv('Pain Split', 'Normal')],
        notes: 'Totem-style aura: +1 Speed.',
      }),
      mon('Milotic', 50, ['Water'], {
        ability: 'Marvel Scale',
        moves: [mv('Hydro Pump', 'Water', 110), mv('Recover', 'Normal'), mv('Safeguard', 'Normal'), mv('Flail', 'Normal')],
        notes: 'Totem-style aura: +1 Attack.',
      }),
      mon('Bewear', 50, ['Normal', 'Fighting'], {
        ability: 'Fluffy',
        moves: [mv('Baby-Doll Eyes', 'Fairy'), mv('Hammer Arm', 'Fighting', 100), mv('Take Down', 'Normal', 90), mv('Pain Split', 'Normal')],
        notes: 'Totem-style aura: +1 Defense.',
      }),
    ],
    notes: 'Second Lusamine battle, in Ultra Deep Sea. All team members carry Totem-style stat boosts.',
  }),

  // Hau Route 3 battle — happens between Melemele Grand Trial and Akala departure. Per Bulbapedia
  // the canonical location is Route 3 (the original Pass 1 skeleton incorrectly labeled this as
  // Ten Carat Hill); the boss ID is preserved for backward compatibility.
  boss({
    id: 'sm-rival-hau-ten-carat',
    name: 'Hau (Route 3)',
    location: 'Route 3',
    order: 13,
    category: 'rival',
    levelCap: 14,
    baseTeam: [mon('Pikachu', 13, ['Electric'], {
      ability: 'Static',
      moves: [mv('Thunder Shock', 'Electric', 40), mv('Quick Attack', 'Normal', 40), mv('Tail Whip', 'Normal'), mv('Charm', 'Fairy')],
    })],
    variantsByRivalStarterChoice: {
      grass: [mon('Brionne', 14, ['Water'], { ability: 'Torrent' })],
      fire: [mon('Dartrix', 14, ['Grass', 'Flying'], { ability: 'Overgrow' })],
      water: [mon('Torracat', 14, ['Fire'], { ability: 'Blaze' })],
    },
    notes: 'Hau battle on Route 3 after the Melemele Grand Trial. Pikachu (Lv 13) plus the evolved rival starter weak to the player\'s choice (Lv 14). Per-Pokémon move data for the rival starter is not surfaced in the source — moves left empty.',
  }),
  boss({
    id: 'sm-rival-hau-paniola',
    name: 'Hau (Paniola Town)',
    location: 'Paniola Town',
    order: 19,
    category: 'rival',
    levelCap: 17,
    baseTeam: [mon('Pikachu', 16, ['Electric'], {
      ability: 'Static',
    })],
    variantsByRivalStarterChoice: {
      grass: [mon('Brionne', 17, ['Water'], { ability: 'Torrent', item: 'Normalium Z' })],
      fire: [mon('Dartrix', 17, ['Grass', 'Flying'], { ability: 'Overgrow', item: 'Normalium Z' })],
      water: [mon('Torracat', 17, ['Fire'], { ability: 'Blaze', item: 'Normalium Z' })],
    },
    notes: 'Hau battle in Paniola Town. Pikachu (Lv 16) plus the evolved rival starter weak to the player\'s choice (Lv 17, holding Normalium Z). Per-Pokémon move data is not surfaced in the source — moves left empty.',
  }),
  boss({
    id: 'sm-rival-hau-malie',
    name: 'Hau (Malie City)',
    location: 'Malie City',
    order: 28,
    category: 'rival',
    levelCap: 29,
    baseTeam: [
      mon('Alolan Raichu', 28, ['Electric', 'Psychic'], {
        ability: 'Surge Surfer',
        moves: [mv('Electro Ball', 'Electric', null), mv('Quick Attack', 'Normal', 40), mv('Psychic', 'Psychic', 90), mv('Focus Blast', 'Fighting', 120)],
      }),
    ],
    variantsByRivalStarterChoice: {
      // Player grass (Rowlet) → Hau Flareon (counters grass) + Brionne (weak to grass) holding Waterium Z.
      grass: [
        mon('Flareon', 28, ['Fire'], { ability: 'Flash Fire', moves: [mv('Fire Fang', 'Fire', 65), mv('Quick Attack', 'Normal', 40)] }),
        mon('Brionne', 29, ['Water'], { ability: 'Torrent', item: 'Waterium Z', moves: [mv('Bubble Beam', 'Water', 65), mv('Disarming Voice', 'Fairy', 40)] }),
      ],
      // Player fire (Litten) → Hau Vaporeon (counters fire) + Dartrix (weak to fire) holding Grassium Z.
      fire: [
        mon('Vaporeon', 28, ['Water'], { ability: 'Water Absorb', moves: [mv('Water Pulse', 'Water', 60), mv('Quick Attack', 'Normal', 40)] }),
        mon('Dartrix', 29, ['Grass', 'Flying'], { ability: 'Overgrow', item: 'Grassium Z', moves: [mv('Razor Leaf', 'Grass', 55), mv('Pluck', 'Flying', 60)] }),
      ],
      // Player water (Popplio) → Hau Leafeon (counters water) + Torracat (weak to water) holding Firium Z.
      water: [
        mon('Leafeon', 28, ['Grass'], { ability: 'Leaf Guard', moves: [mv('Giga Drain', 'Grass', 75), mv('Quick Attack', 'Normal', 40)] }),
        mon('Torracat', 29, ['Fire'], { ability: 'Blaze', item: 'Firium Z', moves: [mv('Fire Fang', 'Fire', 65), mv('Bite', 'Dark', 60)] }),
      ],
    },
    notes: "Hau battle in Malie City after Sophocles's trial. Alolan Raichu (Lv 28) + an eeveelution that type-counters the player (Lv 28) + the evolved rival starter weak to the player (Lv 29, Z-crystal).",
  }),
  skeletonBoss('sm-rival-hau-vast-poni', 'Hau (Vast Poni Canyon)', 'Vast Poni Canyon', 43, 'rival', 'Hau Vast Poni Canyon battle'),
  boss({
    id: 'sm-rival-hau-league',
    name: 'Hau (Mount Lanakila)',
    location: 'Mount Lanakila',
    order: 54,
    category: 'rival',
    levelCap: 54,
    baseTeam: [
      mon('Alolan Raichu', 53, ['Electric', 'Psychic'], { ability: 'Surge Surfer' }),
      mon('Komala', 53, ['Normal'], { ability: 'Comatose' }),
    ],
    variantsByRivalStarterChoice: {
      // Player grass (Rowlet) → Hau Flareon + Primarina (weak to grass) Waterium Z.
      grass: [
        mon('Flareon', 53, ['Fire'], { ability: 'Flash Fire' }),
        mon('Primarina', 54, ['Water', 'Fairy'], { ability: 'Torrent', item: 'Waterium Z' }),
      ],
      // Player fire (Litten) → Hau Vaporeon + Decidueye (weak to fire) Grassium Z.
      fire: [
        mon('Vaporeon', 53, ['Water'], { ability: 'Water Absorb' }),
        mon('Decidueye', 54, ['Grass', 'Ghost'], { ability: 'Overgrow', item: 'Grassium Z' }),
      ],
      // Player water (Popplio) → Hau Leafeon + Incineroar (weak to water) Firium Z.
      water: [
        mon('Leafeon', 53, ['Grass'], { ability: 'Leaf Guard' }),
        mon('Incineroar', 54, ['Fire', 'Dark'], { ability: 'Blaze', item: 'Firium Z' }),
      ],
    },
    notes: 'Hau battle at Mount Lanakila just before the Pokémon League. Per-Pokémon move data not surfaced in the source — moves left empty.',
  }),

  // -- Gladion Akala-window battles (Pass 2 verified) --
  boss({
    id: 'sm-gladion-route-5',
    name: 'Gladion (Route 5)',
    location: 'Route 5',
    order: 18,
    category: 'rival',
    levelCap: 18,
    team: [
      mon('Zubat', 17, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Bite', 'Dark', 60), mv('Wing Attack', 'Flying', 60)],
      }),
      mon('Type: Null', 18, ['Normal'], {
        ability: 'Battle Armor',
        moves: [mv('Tackle', 'Normal', 40), mv('Pursuit', 'Dark', 40)],
      }),
    ],
    notes: 'First Gladion battle, triggered on Route 5.',
  }),
  boss({
    id: 'sm-gladion-battle-royal',
    name: 'Gladion (Battle Royal Dome)',
    location: 'Battle Royal Dome',
    order: 19,
    category: 'rival',
    levelCap: 19,
    team: [
      mon('Type: Null', 19, ['Normal'], {
        ability: 'Battle Armor',
        moves: [mv('Tackle', 'Normal', 40), mv('Pursuit', 'Dark', 40)],
      }),
    ],
    notes: 'Optional non-mandatory Gladion battle at the Battle Royal Dome.',
  }),
  boss({
    id: 'sm-gladion-aether-house',
    name: 'Gladion (Aether House)',
    location: 'Aether House (Route 15)',
    order: 32,
    category: 'rival',
    levelCap: 38,
    team: [
      mon('Golbat', 37, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Acrobatics', 'Flying', 55), mv('Poison Fang', 'Poison', 50)],
      }),
      mon('Sneasel', 37, ['Dark', 'Ice'], {
        ability: 'Inner Focus',
        moves: [mv('Icy Wind', 'Ice', 55), mv('Metal Claw', 'Steel', 50), mv('Feint Attack', 'Dark', 60), mv('Quick Attack', 'Normal', 40)],
      }),
      mon('Type: Null', 38, ['Normal'], {
        ability: 'Battle Armor',
        moves: [mv('Pursuit', 'Dark', 40), mv('Crush Claw', 'Normal', 75), mv('X-Scissor', 'Bug', 80)],
      }),
    ],
    notes: 'Gladion battle at the Aether House after the Skull raid.',
  }),
  boss({
    id: 'sm-gladion-aether-paradise',
    name: 'Gladion (Aether Paradise multi-battle)',
    location: 'Aether Paradise',
    order: 53,
    category: 'rival',
    levelCap: 39,
    team: [
      mon('Golbat', 38, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Type: Null', 39, ['Normal'], { ability: 'Battle Armor' }),
    ],
    notes: 'Gladion is partnered with the player in a multi-battle during the Aether Paradise raid. Per-move data not surfaced in source — TODO.',
  }),

  // -- Elite Four (Pass 5 verified) --
  boss({
    id: 'sm-e4-hala',
    name: 'Elite Four Hala',
    location: 'Pokémon League',
    order: 55,
    category: 'elite-four',
    levelCap: 55,
    team: [
      mon('Hariyama', 54, ['Fighting'], {
        ability: 'Thick Fat',
        moves: [mv('Fake Out', 'Normal', 40), mv('Close Combat', 'Fighting', 120), mv('Knock Off', 'Dark', 65)],
      }),
      mon('Primeape', 54, ['Fighting'], {
        ability: 'Anger Point',
        moves: [mv('Cross Chop', 'Fighting', 100), mv('Outrage', 'Dragon', 120), mv('Punishment', 'Dark', 60), mv('Pursuit', 'Dark', 40)],
      }),
      mon('Bewear', 54, ['Normal', 'Fighting'], {
        ability: 'Fluffy',
        moves: [mv('Hammer Arm', 'Fighting', 100), mv('Brutal Swing', 'Dark', 60)],
      }),
      mon('Poliwrath', 54, ['Water', 'Fighting'], {
        ability: 'Water Absorb',
        moves: [mv('Waterfall', 'Water', 80), mv('Submission', 'Fighting', 80)],
      }),
      mon('Crabominable', 55, ['Fighting', 'Ice'], {
        ability: 'Iron Fist',
        item: 'Fightinium Z',
        moves: [mv('Ice Hammer', 'Ice', 100), mv('Close Combat', 'Fighting', 120)],
        notes: 'Uses All-Out Pummeling (Fightinium Z) at the first opportunity.',
      }),
    ],
    notes: 'Elite Four Hala (Fighting specialist) — initial battle.',
  }),
  boss({
    id: 'sm-e4-olivia',
    name: 'Elite Four Olivia',
    location: 'Pokémon League',
    order: 56,
    category: 'elite-four',
    levelCap: 55,
    team: [
      mon('Relicanth', 54, ['Water', 'Rock'], {
        ability: 'Swift Swim',
        moves: [mv('Hydro Pump', 'Water', 110), mv('Ancient Power', 'Rock', 60), mv('Yawn', 'Normal')],
      }),
      mon('Carbink', 54, ['Rock', 'Fairy'], {
        ability: 'Clear Body',
        moves: [mv('Power Gem', 'Rock', 80), mv('Moonblast', 'Fairy', 95), mv('Reflect', 'Psychic')],
      }),
      mon('Alolan Golem', 54, ['Rock', 'Electric'], {
        ability: 'Sturdy',
        moves: [mv('Thunder Punch', 'Electric', 75), mv('Rock Blast', 'Rock', 25), mv('Steamroller', 'Bug', 65)],
      }),
      mon('Probopass', 54, ['Rock', 'Steel'], {
        ability: 'Sturdy',
        moves: [mv('Earth Power', 'Ground', 90), mv('Power Gem', 'Rock', 80), mv('Thunder Wave', 'Electric'), mv('Sandstorm', 'Rock')],
      }),
      mon('Lycanroc', 55, ['Rock'], {
        ability: 'Keen Eye',
        item: 'Rockium Z',
        moves: [mv('Crunch', 'Dark', 80), mv('Stone Edge', 'Rock', 100), mv('Counter', 'Fighting'), mv('Rock Climb', 'Normal', 90)],
        notes: 'Midnight Form. Z-Move: Continental Crush from Stone Edge.',
      }),
    ],
    notes: 'Elite Four Olivia (Rock specialist) — initial battle. Abilities/moves verified Bulbapedia.',
  }),
  boss({
    id: 'sm-e4-acerola',
    name: 'Elite Four Acerola',
    location: 'Pokémon League',
    order: 57,
    category: 'elite-four',
    levelCap: 55,
    team: [
      mon('Sableye', 54, ['Dark', 'Ghost'], {
        ability: 'Keen Eye',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Zen Headbutt', 'Psychic', 80), mv('Confuse Ray', 'Ghost'), mv('Fake Out', 'Normal', 40)],
      }),
      mon('Drifblim', 54, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Ominous Wind', 'Ghost', 60), mv('Focus Energy', 'Normal'), mv('Amnesia', 'Psychic'), mv('Baton Pass', 'Normal')],
      }),
      mon('Dhelmise', 54, ['Grass', 'Ghost'], {
        ability: 'Steelworker',
        moves: [mv('Slam', 'Normal', 80), mv('Shadow Ball', 'Ghost', 80), mv('Energy Ball', 'Grass', 90), mv('Whirlpool', 'Water', 35)],
      }),
      mon('Froslass', 54, ['Ice', 'Ghost'], {
        ability: 'Snow Cloak',
        moves: [mv('Blizzard', 'Ice', 110), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost'), mv('Ice Shard', 'Ice', 40)],
      }),
      mon('Palossand', 55, ['Ghost', 'Ground'], {
        ability: 'Water Compaction',
        item: 'Ghostium Z',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Earth Power', 'Ground', 90), mv('Giga Drain', 'Grass', 75), mv('Iron Defense', 'Steel')],
        notes: 'Uses Never-Ending Nightmare (Ghostium Z) at the first opportunity.',
      }),
    ],
    notes: 'Elite Four Acerola (Ghost specialist) — initial battle.',
  }),
  boss({
    id: 'sm-e4-kahili',
    name: 'Elite Four Kahili',
    location: 'Pokémon League',
    order: 58,
    category: 'elite-four',
    levelCap: 55,
    team: [
      mon('Skarmory', 54, ['Steel', 'Flying'], {
        ability: 'Sturdy',
        moves: [mv('Slash', 'Normal', 70), mv('Steel Wing', 'Steel', 70), mv('Feint', 'Normal', 30), mv('Spikes', 'Ground')],
      }),
      mon('Crobat', 54, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Air Slash', 'Flying', 75), mv('Swift', 'Normal', 60), mv('Supersonic', 'Normal'), mv('Poison Fang', 'Poison', 50)],
      }),
      mon('Oricorio', 54, ['Fire', 'Flying'], {
        ability: 'Dancer',
        moves: [mv('Revelation Dance', 'Fire', 90), mv('Teeter Dance', 'Normal'), mv('Air Slash', 'Flying', 75), mv('Feather Dance', 'Flying')],
        notes: 'Baile Style.',
      }),
      mon('Mandibuzz', 54, ['Dark', 'Flying'], {
        ability: 'Big Pecks',
        moves: [mv('Bone Rush', 'Ground', 25), mv('Brave Bird', 'Flying', 120), mv('Punishment', 'Dark', 60), mv('Flatter', 'Dark')],
      }),
      mon('Toucannon', 55, ['Normal', 'Flying'], {
        ability: 'Skill Link',
        item: 'Flyinium Z',
        moves: [mv('Bullet Seed', 'Grass', 25), mv('Rock Blast', 'Rock', 25), mv('Beak Blast', 'Flying', 100), mv('Screech', 'Normal')],
        notes: 'Z-Move: Supersonic Skystrike.',
      }),
    ],
    notes: 'Elite Four Kahili (Flying specialist) — initial battle.',
  }),

  // -- Champion: Professor Kukui (inaugural Champion battle) --
  boss({
    id: 'sm-champion-kukui',
    name: 'Champion Professor Kukui',
    location: 'Pokémon League',
    order: 59,
    category: 'champion',
    levelCap: 58,
    baseTeam: [
      mon('Lycanroc', 57, ['Rock'], {
        ability: 'Keen Eye',
        moves: [mv('Stone Edge', 'Rock', 100), mv('Accelerock', 'Rock', 40), mv('Crunch', 'Dark', 80), mv('Stealth Rock', 'Rock')],
      }),
      mon('Alolan Ninetales', 56, ['Ice', 'Fairy'], {
        ability: 'Snow Cloak',
        moves: [mv('Dazzling Gleam', 'Fairy', 80), mv('Blizzard', 'Ice', 110), mv('Ice Shard', 'Ice', 40), mv('Safeguard', 'Normal')],
      }),
      mon('Braviary', 56, ['Normal', 'Flying'], {
        ability: 'Keen Eye',
        moves: [mv('Crush Claw', 'Normal', 75), mv('Brave Bird', 'Flying', 120), mv('Tailwind', 'Flying'), mv('Whirlwind', 'Normal')],
      }),
      mon('Magnezone', 56, ['Electric', 'Steel'], {
        ability: 'Sturdy',
        moves: [mv('Thunderbolt', 'Electric', 90), mv('Flash Cannon', 'Steel', 80), mv('Thunder Wave', 'Electric'), mv('Mirror Coat', 'Psychic')],
      }),
      mon('Snorlax', 56, ['Normal'], {
        ability: 'Thick Fat',
        moves: [mv('Body Slam', 'Normal', 85), mv('Crunch', 'Dark', 80), mv('Heavy Slam', 'Steel'), mv('High Horsepower', 'Ground', 95)],
      }),
    ],
    variantsByRivalStarterChoice: {
      // Player grass → Kukui Incineroar (Fire/Dark, beats Grass) holding Firium Z.
      grass: [mon('Incineroar', 58, ['Fire', 'Dark'], {
        ability: 'Blaze', item: 'Firium Z',
        moves: [mv('Flare Blitz', 'Fire', 120), mv('Darkest Lariat', 'Dark', 85), mv('Outrage', 'Dragon', 120), mv('Cross Chop', 'Fighting', 100)],
      })],
      // Player fire → Kukui Primarina (Water/Fairy, beats Fire) holding Waterium Z.
      fire: [mon('Primarina', 58, ['Water', 'Fairy'], { ability: 'Torrent', item: 'Waterium Z' })],
      // Player water → Kukui Decidueye (Grass/Ghost, beats Water) holding Grassium Z.
      water: [mon('Decidueye', 58, ['Grass', 'Ghost'], { ability: 'Overgrow', item: 'Grassium Z' })],
    },
    notes: 'Inaugural Champion battle. After winning the player becomes the first Alola Champion. Starter slot is the one Kukui chose as a starter himself (the one weak to the player\'s choice).',
  }),

  // -- Champion Defense (first defense after becoming Champion) --
  skeletonBoss('sm-champion-defense-hau', 'Champion Defense vs. Hau', 'Pokémon League', 61, 'champion',
    'Champion Defense vs. Hau (postgame title defense — separate from his Mount Lanakila battle)'),
];
