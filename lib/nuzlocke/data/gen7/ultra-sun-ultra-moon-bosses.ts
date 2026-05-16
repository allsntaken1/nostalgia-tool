import type { StarterChoice } from '@/app/nuzlocke/types';
import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';

/**
 * Ultra Sun / Ultra Moon bosses.
 *
 * Pass 1 (this file) populates verified canonical Melemele Island + early Akala bosses:
 *   - Hau (Route 1, Iki Town festival, Route 3, Paniola Town)
 *   - Captain Ilima (Hau'oli City pre-trial)
 *   - Totem Gumshoos (Ultra Sun) / Totem Alolan Raticate (Ultra Moon) — same as SM, +1 Defense aura
 *   - Kahuna Hala Grand Trial
 *
 * Bosses beyond this scope remain skeleton entries with `levelCap: null` so they render TBD.
 */

type UsumMove = NonNullable<BossTrainerPokemon['moves']>[number];
type UsumBossCategory = 'rival' | 'kahuna' | 'trial-captain' | 'totem' | 'evil-team' | 'boss' | 'elite-four' | 'champion' | 'ultra-recon-squad';

const mv = (name: string, type: UsumMove['type'], power: number | null = null): UsumMove => ({ name, type, power });
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
  category: UsumBossCategory,
  todoLabel: string,
  gameOverride?: BossTrainer['game'],
): BossTrainer => ({
  id,
  name,
  category,
  game: gameOverride ?? 'Both',
  location,
  recommendedOrder: order,
  // Explicit null marks this entry as TBD; the converter forwards null to the UI's "TBD" path
  // instead of fabricating a fake cap of 1.
  levelCap: null,
  notes: `TODO: Populate canonical ${todoLabel} data.`,
  baseTeam: [],
});

const boss = (params: {
  id: string;
  name: string;
  location: string;
  order: number;
  category: UsumBossCategory;
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

// Hau starter-variant teams. Rival picks starter weak to player's choice (same convention as SM).
const hauRoute1Variants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Popplio', 5, ['Water'], { ability: 'Torrent', moves: [mv('Pound', 'Normal', 40), mv('Water Gun', 'Water', 40), mv('Growl', 'Normal')] })],
  fire: [mon('Rowlet', 5, ['Grass', 'Flying'], { ability: 'Overgrow', moves: [mv('Tackle', 'Normal', 40), mv('Leafage', 'Grass', 40), mv('Growl', 'Normal')] })],
  water: [mon('Litten', 5, ['Fire'], { ability: 'Blaze', moves: [mv('Scratch', 'Normal', 40), mv('Ember', 'Fire', 40), mv('Growl', 'Normal')] })],
};

const hauFestivalVariants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Popplio', 7, ['Water'], { ability: 'Torrent' })],
  fire: [mon('Rowlet', 7, ['Grass', 'Flying'], { ability: 'Overgrow' })],
  water: [mon('Litten', 7, ['Fire'], { ability: 'Blaze' })],
};

const hauRoute3Variants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Popplio', 13, ['Water'], { ability: 'Torrent' })],
  fire: [mon('Rowlet', 13, ['Grass', 'Flying'], { ability: 'Overgrow' })],
  water: [mon('Litten', 13, ['Fire'], { ability: 'Blaze' })],
};

const hauPaniolaVariants: Record<StarterChoice, BossTrainerPokemon[]> = {
  grass: [mon('Brionne', 16, ['Water'], { ability: 'Torrent', item: 'Normalium Z' })],
  fire: [mon('Dartrix', 16, ['Grass', 'Flying'], { ability: 'Overgrow', item: 'Normalium Z' })],
  water: [mon('Torracat', 16, ['Fire'], { ability: 'Blaze', item: 'Normalium Z' })],
};

const ilimaHauoliVariants: Record<StarterChoice, BossTrainerPokemon[]> = {
  // Smeargle's variable starter-coverage move per player choice.
  grass: [mon('Smeargle', 11, ['Normal'], { ability: 'Technician', moves: [mv('Tackle', 'Normal', 40), mv('Ember', 'Fire', 40)] })],
  fire: [mon('Smeargle', 11, ['Normal'], { ability: 'Technician', moves: [mv('Tackle', 'Normal', 40), mv('Water Gun', 'Water', 40)] })],
  water: [mon('Smeargle', 11, ['Normal'], { ability: 'Technician', moves: [mv('Tackle', 'Normal', 40), mv('Leafage', 'Grass', 40)] })],
};

export const ultraSunUltraMoonBosses: BossTrainer[] = [
  // -- Hau battles (Melemele + early Akala) --
  boss({
    id: 'usum-rival-hau-route-1',
    name: 'Hau (Route 1)',
    location: 'Route 1',
    order: 5,
    category: 'rival',
    levelCap: 5,
    baseTeam: [],
    variantsByRivalStarterChoice: hauRoute1Variants,
    notes: "USUM Hau first battle on Route 1 (not Iki Town like SM). Single Pokémon weak to player's choice.",
  }),
  boss({
    id: 'usum-rival-hau-festival',
    name: 'Hau (Iki Town festival)',
    location: 'Iki Town',
    order: 6,
    category: 'rival',
    levelCap: 7,
    baseTeam: [mon('Pichu', 6, ['Electric'], { ability: 'Static', moves: [mv('Thunder Shock', 'Electric', 40), mv('Charm', 'Fairy'), mv('Tail Whip', 'Normal')] })],
    variantsByRivalStarterChoice: hauFestivalVariants,
    notes: 'Iki Town festival battle. Pichu (Lv 6) + rival starter (Lv 7).',
  }),
  boss({
    id: 'usum-rival-hau-route-3',
    name: 'Hau (Route 3)',
    location: 'Route 3',
    order: 13,
    category: 'rival',
    levelCap: 13,
    baseTeam: [
      mon('Pikachu', 12, ['Electric'], { ability: 'Static' }),
      mon('Noibat', 11, ['Flying', 'Dragon'], { ability: 'Frisk', notes: 'USUM-added party member.' }),
    ],
    variantsByRivalStarterChoice: hauRoute3Variants,
    notes: "USUM Route 3 Hau battle expanded to three Pokémon (adds Noibat) vs SM's two.",
  }),
  boss({
    id: 'usum-rival-hau-paniola',
    name: 'Hau (Paniola Town)',
    location: 'Paniola Town',
    order: 19,
    category: 'rival',
    levelCap: 16,
    baseTeam: [
      mon('Pikachu', 15, ['Electric'], { ability: 'Static' }),
      mon('Noibat', 14, ['Flying', 'Dragon'], { ability: 'Frisk' }),
      mon('Eevee', 14, ['Normal'], { ability: 'Adaptability', notes: 'USUM-added Eevee on Hau\'s Paniola team.' }),
    ],
    variantsByRivalStarterChoice: hauPaniolaVariants,
    notes: "USUM Paniola Hau expanded to four Pokémon (adds Eevee) vs SM's two. Rival starter holds Normalium Z.",
  }),

  // -- Gladion early battles (USUM Pass 2 verified) --
  boss({
    id: 'usum-gladion-route-5',
    name: 'Gladion (Route 5)',
    location: 'Route 5',
    order: 18,
    category: 'rival',
    levelCap: 18,
    team: [
      mon('Zorua', 17, ['Dark'], {
        ability: 'Illusion',
        notes: 'USUM-added party member; SM had Zubat in this slot. Disguise illusion mechanic.',
      }),
      mon('Zubat', 17, ['Poison', 'Flying'], { ability: 'Inner Focus' }),
      mon('Type: Null', 18, ['Normal'], { ability: 'Battle Armor' }),
    ],
    notes: 'First USUM Gladion battle on Route 5. Adds Zorua to his roster vs SM.',
  }),
  boss({
    id: 'usum-gladion-battle-royal',
    name: 'Gladion (Battle Royal Dome)',
    location: 'Battle Royal Dome',
    order: 19,
    category: 'rival',
    levelCap: 20,
    team: [
      mon('Type: Null', 20, ['Normal'], { ability: 'Battle Armor' }),
    ],
    notes: 'Optional non-mandatory Gladion battle at the Battle Royal Dome. Level +1 vs SM (20 vs 19).',
  }),
  boss({
    id: 'usum-gladion-aether-house',
    name: 'Gladion (Aether House)',
    location: 'Aether House (Route 15)',
    order: 36,
    category: 'rival',
    levelCap: 43,
    team: [
      mon('Golbat', 42, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Acrobatics', 'Flying', 55), mv('Poison Fang', 'Poison', 50), mv('Venoshock', 'Poison', 65)],
      }),
      mon('Zoroark', 42, ['Dark'], {
        ability: 'Illusion',
        moves: [mv('Snarl', 'Dark', 55), mv('Hyper Voice', 'Normal', 90)],
        notes: 'USUM Zoroark evolves from Pass 2 Zorua; SM had Sneasel in this slot.',
      }),
      mon('Type: Null', 43, ['Normal'], {
        ability: 'Battle Armor',
        moves: [mv('Pursuit', 'Dark', 40), mv('Crush Claw', 'Normal', 75), mv('X-Scissor', 'Bug', 80)],
      }),
    ],
    notes: 'USUM Gladion at Aether House. Swaps SM Sneasel → Zoroark.',
  }),
  boss({
    id: 'usum-gladion-aether-paradise',
    name: 'Gladion (Aether Paradise multi-battle)',
    location: 'Aether Paradise',
    order: 52,
    category: 'rival',
    levelCap: 44,
    team: [
      mon('Type: Null', 44, ['Normal'], {
        ability: 'Battle Armor',
        moves: [mv('Pursuit', 'Dark', 40), mv('Crush Claw', 'Normal', 75), mv('X-Scissor', 'Bug', 80), mv('Iron Head', 'Steel', 80)],
      }),
      mon('Golbat', 43, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Acrobatics', 'Flying', 55), mv('Poison Fang', 'Poison', 50), mv('Venoshock', 'Poison', 65), mv('Steel Wing', 'Steel', 70)],
      }),
      mon('Zoroark', 43, ['Dark'], {
        ability: 'Illusion',
        moves: [mv('Snarl', 'Dark', 55), mv('Hyper Voice', 'Normal', 90), mv('Grass Knot', 'Grass')],
      }),
    ],
    notes: 'USUM Gladion partnered with the player in a multi-battle at Aether Paradise. Levels +5-6 vs SM.',
  }),

  // -- Captain Ilima (USUM places the pre-trial showcase battle at Hau'oli City, not Trainers' School) --
  boss({
    id: 'usum-trial-ilima',
    name: 'Trial Captain Ilima',
    location: "Hau'oli City",
    order: 10,
    category: 'trial-captain',
    levelCap: 11,
    baseTeam: [
      mon('Yungoos', 10, ['Normal'], {
        ability: 'Stakeout',
        moves: [mv('Tackle', 'Normal', 40), mv('Pursuit', 'Dark', 40), mv('Leer', 'Normal')],
      }),
    ],
    variantsByRivalStarterChoice: ilimaHauoliVariants,
    notes: "USUM Ilima pre-trial battle is in Hau'oli City (not Trainers' School like SM); team is Yungoos 10 + Smeargle 11 with starter-coverage move.",
  }),

  // -- Totem battles — same species as SM but +1 Defense aura (vs SM Adaptability/Gluttony abilities).
  // Bulbapedia raw notes: both Totems hold Pecha Berry; aura is +1 Defense.
  boss({
    id: 'usum-totem-gumshoos',
    name: 'Totem Gumshoos',
    location: 'Verdant Cavern',
    order: 11,
    category: 'totem',
    levelCap: 12,
    game: 'Ultra Sun',
    team: [
      mon('Gumshoos', 12, ['Normal'], {
        ability: 'Stakeout',
        item: 'Pecha Berry',
        notes: 'Ultra Sun Totem. Aura boost: +1 Defense. Calls Yungoos (Lv 10) as ally.',
      }),
      mon('Yungoos', 10, ['Normal'], { ability: 'Stakeout', notes: 'Totem ally summoned via SOS.' }),
    ],
    notes: 'Ultra Sun-exclusive Verdant Cavern Totem. Moves not fully verified this pass — TODO.',
  }),
  boss({
    id: 'usum-totem-alolan-raticate',
    name: 'Totem Alolan Raticate',
    location: 'Verdant Cavern',
    order: 11,
    category: 'totem',
    levelCap: 12,
    game: 'Ultra Moon',
    team: [
      mon('Alolan Raticate', 12, ['Dark', 'Normal'], {
        ability: 'Hustle',
        item: 'Pecha Berry',
        notes: 'Ultra Moon Totem. Aura boost: +1 Defense. Calls Alolan Rattata (Lv 10) as ally.',
      }),
      mon('Alolan Rattata', 10, ['Dark', 'Normal'], { ability: 'Hustle', notes: 'Totem ally summoned via SOS.' }),
    ],
    notes: 'Ultra Moon-exclusive Verdant Cavern Totem. Moves not fully verified this pass — TODO.',
  }),

  // -- Kahuna Hala (Melemele Grand Trial) --
  boss({
    id: 'usum-kahuna-hala',
    name: 'Kahuna Hala',
    location: 'Iki Town',
    order: 12,
    category: 'kahuna',
    levelCap: 16,
    team: [
      mon('Machop', 15, ['Fighting'], {
        ability: 'Guts',
        moves: [mv('Karate Chop', 'Fighting', 50), mv('Revenge', 'Fighting', 60), mv('Focus Energy', 'Normal')],
      }),
      mon('Makuhita', 15, ['Fighting'], {
        ability: 'Thick Fat',
        moves: [mv('Arm Thrust', 'Fighting', 15), mv('Sand Attack', 'Ground'), mv('Fake Out', 'Normal', 40)],
      }),
      mon('Crabrawler', 16, ['Fighting'], {
        ability: 'Iron Fist',
        item: 'Fightinium Z',
        moves: [mv('Pursuit', 'Dark', 40), mv('Power-Up Punch', 'Fighting', 40), mv('Leer', 'Normal')],
        notes: 'Uses All-Out Pummeling (Fightinium Z) at the first opportunity.',
      }),
    ],
    notes: "USUM Melemele Grand Trial: Hala swaps Mankey for Machop and brings slightly higher levels vs SM.",
  }),

  // -- Akala captains + totems (USUM Pass 2 verified) --
  skeletonBoss('usum-trial-lana', 'Trial Captain Lana', 'Brooklet Hill', 20, 'trial-captain', 'Captain Lana'),
  boss({
    id: 'usum-totem-araquanid',
    name: 'Totem Araquanid',
    location: 'Brooklet Hill',
    order: 21,
    category: 'totem',
    levelCap: 20,
    team: [
      mon('Araquanid', 20, ['Water', 'Bug'], {
        ability: 'Water Bubble',
        item: 'Wacan Berry',
        moves: [mv('Leech Life', 'Bug', 80), mv('Bubble', 'Water', 40), mv('Bite', 'Dark', 60), mv('Aurora Beam', 'Ice', 65)],
        notes: 'Aura boost: +1 Speed. Calls Dewpider first turn, then Masquerain (both Lv 18).',
      }),
      mon('Dewpider', 18, ['Water', 'Bug'], { notes: 'Totem ally turn 1.' }),
      mon('Masquerain', 18, ['Bug', 'Flying'], { notes: 'Totem secondary ally.' }),
    ],
    notes: 'USUM Totem Araquanid replaces SM Totem Wishiwashi for Lana\'s trial.',
  }),
  skeletonBoss('usum-trial-kiawe', 'Trial Captain Kiawe', 'Wela Volcano Park', 22, 'trial-captain', 'Captain Kiawe'),
  boss({
    id: 'usum-totem-marowak',
    name: 'Totem Alolan Marowak',
    location: 'Wela Volcano Park',
    order: 23,
    category: 'totem',
    levelCap: 22,
    team: [
      mon('Alolan Marowak', 22, ['Fire', 'Ghost'], {
        ability: 'Cursed Body',
        item: 'Thick Club',
        moves: [mv('Hex', 'Ghost', 65), mv('Flame Wheel', 'Fire', 60), mv('Brick Break', 'Fighting', 75), mv('Detect', 'Fighting')],
        notes: 'Aura boost: +2 Speed. Calls Salazzle (female, Lv 20) as ally.',
      }),
      mon('Salazzle', 20, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        moves: [mv('Poison Gas', 'Poison'), mv('Venoshock', 'Poison', 65), mv('Flame Burst', 'Fire', 70), mv('Torment', 'Dark')],
        notes: 'Totem ally.',
      }),
    ],
    notes: 'USUM unifies Wela Volcano Totem on Alolan Marowak (no Sun/Moon split). Removes the SM Salazzle Sun-exclusive Totem.',
  }),
  skeletonBoss('usum-trial-mallow', 'Trial Captain Mallow', 'Lush Jungle', 24, 'trial-captain', 'Captain Mallow'),
  boss({
    id: 'usum-totem-lurantis',
    name: 'Totem Lurantis',
    location: 'Lush Jungle',
    order: 25,
    category: 'totem',
    levelCap: 24,
    team: [
      mon('Lurantis', 24, ['Grass'], {
        ability: 'Leaf Guard',
        item: 'Power Herb',
        moves: [mv('Low Sweep', 'Fighting', 65), mv('X-Scissor', 'Bug', 80), mv('Solar Blade', 'Grass', 125), mv('Synthesis', 'Grass')],
        notes: 'Aura boost: +2 Speed. Calls Kecleon turn 1, then Comfey if HP < 2/3.',
      }),
      mon('Kecleon', 22, ['Normal'], { notes: 'Totem ally turn 1 (USUM replaces SM Trumbeak).' }),
      mon('Comfey', 22, ['Fairy'], { notes: 'Totem secondary ally (USUM replaces SM Castform).' }),
    ],
    notes: 'USUM Lurantis swaps Razor Leaf → Low Sweep, ally chain Trumbeak/Castform → Kecleon/Comfey.',
  }),

  // -- Akala Kahuna (USUM Pass 2 verified) --
  boss({
    id: 'usum-kahuna-olivia',
    name: 'Kahuna Olivia',
    location: 'Ruins of Life (Konikoni)',
    order: 26,
    category: 'kahuna',
    levelCap: 28,
    team: [
      mon('Anorith', 27, ['Rock', 'Bug'], {
        ability: 'Battle Armor',
        moves: [mv('Bug Bite', 'Bug', 60), mv('Smack Down', 'Rock', 50), mv('Metal Claw', 'Steel', 50)],
      }),
      mon('Lileep', 27, ['Rock', 'Grass'], {
        ability: 'Suction Cups',
        moves: [mv('Giga Drain', 'Grass', 75), mv('Ancient Power', 'Rock', 60), mv('Brine', 'Water', 65)],
      }),
      mon('Lycanroc', 28, ['Rock'], {
        ability: 'Vital Spirit',
        item: 'Rockium Z',
        moves: [mv('Bite', 'Dark', 60), mv('Rock Tomb', 'Rock', 60)],
        notes: 'Midnight Form. Uses Continental Crush (Rockium Z) at the first opportunity.',
      }),
    ],
    notes: 'USUM Akala Grand Trial: swaps Nosepass/Boldore for fossil pair Anorith/Lileep; +1 levels vs SM.',
  }),

  // -- Ula'ula captains + totems (USUM Pass 3) --
  skeletonBoss('usum-trial-sophocles', 'Trial Captain Sophocles', 'Mount Hokulani', 30, 'trial-captain', 'Captain Sophocles'),
  boss({
    id: 'usum-totem-togedemaru',
    name: 'Totem Togedemaru',
    location: 'Mount Hokulani (Hokulani Observatory)',
    order: 31,
    category: 'totem',
    levelCap: 33,
    team: [
      mon('Togedemaru', 33, ['Electric', 'Steel'], {
        ability: 'Lightning Rod',
        item: 'Sitrus Berry',
        moves: [mv('Zing Zap', 'Electric', 80), mv('Spiky Shield', 'Grass'), mv('Iron Head', 'Steel', 80), mv('Bounce', 'Flying', 85)],
        notes: 'Aura boost: +2 Defense. Calls Skarmory turn 1; calls Dedenne when HP < ~2/3.',
      }),
      mon('Skarmory', 31, ['Steel', 'Flying'], { notes: 'Totem ally turn 1.' }),
      mon('Dedenne', 31, ['Electric', 'Fairy'], { notes: 'Totem secondary ally.' }),
    ],
    notes: 'USUM Mount Hokulani Totem (replaces SM Vikavolt). Earns Electrium Z on victory.',
  }),
  skeletonBoss('usum-trial-acerola', 'Trial Captain Acerola', 'Thrifty Megamart (Abandoned)', 32, 'trial-captain', 'Captain Acerola'),
  boss({
    id: 'usum-totem-mimikyu',
    name: 'Totem Mimikyu',
    location: 'Thrifty Megamart (Abandoned)',
    order: 33,
    category: 'totem',
    levelCap: 35,
    team: [
      mon('Mimikyu', 35, ['Ghost', 'Fairy'], {
        ability: 'Disguise',
        item: 'Lum Berry',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Play Rough', 'Fairy', 90), mv('Leech Life', 'Bug', 80), mv('Slash', 'Normal', 70)],
        notes: 'Aura boost: +1 to Atk/Def/SpA/SpD/Speed. Calls Banette first; calls Jellicent if Banette faints.',
      }),
      mon('Banette', 32, ['Ghost'], {
        ability: 'Insomnia',
        notes: 'Totem ally (USUM replaces SM Haunter).',
      }),
      mon('Jellicent', 33, ['Water', 'Ghost'], {
        ability: 'Cursed Body',
        notes: 'Totem secondary ally (USUM replaces SM Gengar).',
      }),
    ],
    notes: 'USUM Mimikyu Totem +2 levels vs SM (35 vs 33). Swaps ally chain Haunter/Gengar → Banette/Jellicent. Moves swap Astonish/Mimic → Leech Life/Slash.',
  }),

  // -- Ula'ula Kahuna (USUM Pass 3 verified) --
  boss({
    id: 'usum-kahuna-nanu',
    name: 'Kahuna Nanu',
    location: 'Malie City',
    order: 34,
    category: 'kahuna',
    levelCap: 44,
    team: [
      mon('Sableye', 43, ['Dark', 'Ghost'], {
        ability: 'Keen Eye',
        moves: [mv('Power Gem', 'Rock', 80), mv('Shadow Ball', 'Ghost', 80), mv('Fake Out', 'Normal', 40)],
      }),
      mon('Krokorok', 43, ['Ground', 'Dark'], {
        ability: 'Intimidate',
        moves: [mv('Crunch', 'Dark', 80), mv('Assurance', 'Dark', 60), mv('Swagger', 'Normal'), mv('Earthquake', 'Ground', 100)],
      }),
      mon('Alolan Persian', 44, ['Dark'], {
        ability: 'Fur Coat',
        item: 'Darkinium Z',
        moves: [mv('Power Gem', 'Rock', 80), mv('Fake Out', 'Normal', 40), mv('Dark Pulse', 'Dark', 80)],
        notes: 'Uses Black Hole Eclipse (Darkinium Z) at the first opportunity.',
      }),
    ],
    notes: "USUM Ula'ula Grand Trial. Levels +5 vs SM (Sableye/Krokorok 38→43, Persian 39→44).",
  }),

  // -- Poni Island (USUM Pass 5 verified for Kommo-o + Hapu; Ribombee still partial) --
  skeletonBoss('usum-trial-mina', 'Trial Captain Mina', 'Poni Island', 40, 'trial-captain', 'Captain Mina'),
  boss({
    id: 'usum-totem-kommoo',
    name: 'Totem Kommo-o',
    location: 'Vast Poni Canyon',
    order: 41,
    category: 'totem',
    levelCap: 49,
    team: [
      mon('Kommo-o', 49, ['Dragon', 'Fighting'], {
        ability: 'Soundproof',
        item: 'Roseli Berry',
        moves: [mv('Drain Punch', 'Fighting', 75), mv('Dragon Claw', 'Dragon', 80), mv('Thunder Punch', 'Electric', 75), mv('Poison Jab', 'Poison', 80)],
        notes: 'Aura boost: +1 to all stats. Calls Noivern (Lv 48) first; calls Scizor (Lv 46) if needed.',
      }),
      mon('Noivern', 48, ['Flying', 'Dragon'], { notes: 'Totem ally — USUM replaces SM Hakamo-o.' }),
      mon('Scizor', 46, ['Bug', 'Steel'], { notes: 'Totem secondary ally.' }),
    ],
    notes: 'USUM Kommo-o +4 levels vs SM (49 vs 45); held item Mental Herb → Roseli Berry; movepool fully different. Ally chain Hakamo-o → Noivern.',
  }),
  // Totem Ribombee — Mina's USUM trial. Bulbapedia summary doesn't surface the Totem-specific
  // battle stats this pass (only her standard trainer team), so kept as skeleton with TODO.
  skeletonBoss('usum-totem-ribombee', 'Totem Ribombee', 'Poni Island', 42, 'totem',
    "Totem Ribombee (USUM-added Mina trial). Per-Pokémon level/ability/moves/aura/allies not surfaced by raw wikitext this pass"),

  // -- Poni Kahuna (USUM Pass 5 verified) --
  boss({
    id: 'usum-kahuna-hapu',
    name: 'Kahuna Hapu',
    location: 'Exeggutor Island',
    order: 43,
    category: 'kahuna',
    levelCap: 54,
    team: [
      mon('Golurk', 53, ['Ground', 'Ghost'], {
        ability: 'No Guard',
        moves: [mv('Hammer Arm', 'Fighting', 100), mv('Earthquake', 'Ground', 100), mv('Shadow Punch', 'Ghost', 60), mv('Stealth Rock', 'Rock')],
        notes: 'USUM-new vs SM (replaces Alolan Dugtrio).',
      }),
      mon('Gastrodon', 53, ['Water', 'Ground'], {
        ability: 'Sticky Hold',
        moves: [mv('Muddy Water', 'Water', 90), mv('Mud Bomb', 'Ground', 65), mv('Recover', 'Normal')],
      }),
      mon('Flygon', 53, ['Ground', 'Dragon'], {
        ability: 'Levitate',
        moves: [mv('Earth Power', 'Ground', 90), mv('Dragon Breath', 'Dragon', 60)],
      }),
      mon('Mudsdale', 54, ['Ground'], {
        ability: 'Stamina',
        item: 'Groundium Z',
        moves: [mv('Heavy Slam', 'Steel'), mv('Earthquake', 'Ground', 100), mv('Double Kick', 'Fighting', 30), mv('Payback', 'Dark', 50)],
        notes: 'Uses Tectonic Rage (Groundium Z) at the first opportunity.',
      }),
    ],
    notes: "USUM Poni Grand Trial. Swaps SM Alolan Dugtrio → Golurk; +6 levels overall.",
  }),

  // -- Team Skull (USUM Pass 4 verified) --
  boss({
    id: 'usum-skull-plumeria-1',
    name: 'Plumeria (Akala Outskirts)',
    location: 'Akala Outskirts',
    order: 28,
    category: 'evil-team',
    levelCap: 27,
    team: [
      mon('Golbat', 26, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Poison Fang', 'Poison', 50), mv('Wing Attack', 'Flying', 60), mv('Confuse Ray', 'Ghost')],
      }),
      mon('Salandit', 27, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        moves: [mv('Flame Burst', 'Fire', 70), mv('Dragon Rage', 'Dragon'), mv('Poison Gas', 'Poison')],
      }),
    ],
    notes: 'USUM First Plumeria battle (Akala Outskirts).',
  }),
  boss({
    id: 'usum-skull-plumeria-2',
    name: 'Plumeria (Route 15)',
    location: 'Route 15',
    order: 35,
    category: 'evil-team',
    levelCap: 38,
    team: [
      mon('Golbat', 37, ['Poison', 'Flying'], {
        ability: 'Inner Focus',
        moves: [mv('Wing Attack', 'Flying', 60), mv('Poison Fang', 'Poison', 50)],
      }),
      mon('Salazzle', 38, ['Poison', 'Fire'], {
        ability: 'Corrosion',
        moves: [mv('Dragon Pulse', 'Dragon', 85), mv('Flamethrower', 'Fire', 90), mv('Sludge Bomb', 'Poison', 90)],
      }),
    ],
    notes: 'USUM Second Plumeria battle (Route 15). Levels +3 vs SM.',
  }),
  boss({
    id: 'usum-skull-guzma-malie',
    name: 'Guzma (Malie Garden)',
    location: 'Malie Garden',
    order: 37,
    category: 'evil-team',
    levelCap: 34,
    team: [
      mon('Golisopod', 34, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('Sucker Punch', 'Dark', 70), mv('Razor Shell', 'Water', 75), mv('First Impression', 'Bug', 90)],
      }),
      mon('Masquerain', 34, ['Bug', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Air Slash', 'Flying', 75), mv('Bug Buzz', 'Bug', 90), mv('Icy Wind', 'Ice', 55)],
        notes: 'USUM swap — SM had Ariados in this slot.',
      }),
    ],
    notes: 'USUM Guzma Malie Garden battle. Swaps Ariados → Masquerain vs SM; levels +3-4.',
  }),
  boss({
    id: 'usum-skull-guzma-po-town',
    name: 'Guzma (Po Town / Shady House)',
    location: 'Po Town (Shady House)',
    order: 39,
    category: 'evil-team',
    levelCap: 41,
    team: [
      mon('Golisopod', 41, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('Sucker Punch', 'Dark', 70), mv('Razor Shell', 'Water', 75), mv('First Impression', 'Bug', 90)],
      }),
      mon('Masquerain', 41, ['Bug', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Air Slash', 'Flying', 75), mv('Bug Buzz', 'Bug', 90), mv('Icy Wind', 'Ice', 55)],
      }),
      mon('Pinsir', 41, ['Bug'], {
        ability: 'Hyper Cutter',
        moves: [mv('Throat Chop', 'Dark', 80), mv('Storm Throw', 'Fighting', 60), mv('X-Scissor', 'Bug', 80)],
      }),
    ],
    notes: 'USUM Po Town battle expanded to 3 Pokémon (vs SM 2). Levels +4-5.',
  }),
  boss({
    id: 'usum-skull-guzma-aether',
    name: 'Guzma (Aether Paradise)',
    location: 'Aether Paradise',
    order: 52,
    category: 'evil-team',
    levelCap: 45,
    team: [
      mon('Golisopod', 45, ['Bug', 'Water'], {
        ability: 'Emergency Exit',
        moves: [mv('Sucker Punch', 'Dark', 70), mv('Razor Shell', 'Water', 75), mv('First Impression', 'Bug', 90)],
      }),
      mon('Masquerain', 45, ['Bug', 'Flying'], {
        ability: 'Intimidate',
        moves: [mv('Air Slash', 'Flying', 75), mv('Bug Buzz', 'Bug', 90), mv('Icy Wind', 'Ice', 55)],
      }),
      mon('Pinsir', 45, ['Bug'], {
        ability: 'Hyper Cutter',
        moves: [mv('Throat Chop', 'Dark', 80), mv('Storm Throw', 'Fighting', 60), mv('X-Scissor', 'Bug', 80), mv('Stone Edge', 'Rock', 100)],
      }),
      mon('Vikavolt', 45, ['Bug', 'Electric'], {
        ability: 'Levitate',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Thunderbolt', 'Electric', 90), mv('Bug Buzz', 'Bug', 90), mv('Energy Ball', 'Grass', 90)],
        notes: 'USUM-new Vikavolt slot vs SM.',
      }),
    ],
    notes: 'USUM Aether Paradise Guzma — 4 Pokémon (vs SM 4); replaces SM Ariados with Vikavolt; levels +4-5.',
  }),

  // -- Aether bosses (USUM Pass 4 verified for Faba 2nd + Lusamine Aether) --
  boss({
    id: 'usum-aether-faba-2',
    name: 'Aether Branch Chief Faba (Aether Paradise)',
    location: 'Aether Paradise',
    order: 53,
    category: 'boss',
    levelCap: 45,
    team: [
      mon('Claydol', 44, ['Ground', 'Psychic'], { ability: 'Levitate' }),
      mon('Bruxish', 44, ['Water', 'Psychic'], { ability: 'Strong Jaw' }),
      mon('Hypno', 45, ['Psychic'], { ability: 'Insomnia' }),
    ],
    notes: 'USUM Faba 2nd battle at Aether Paradise. Swaps SM Slowbro → Claydol. Partnered with an Aether Foundation Employee (Ledian 42 + Pupitar 42). Per-Pokémon move data not surfaced — TODO.',
  }),
  boss({
    id: 'usum-aether-lusamine',
    name: 'Aether President Lusamine (Aether Paradise)',
    location: 'Aether Paradise',
    order: 54,
    category: 'boss',
    levelCap: 47,
    team: [
      mon('Clefable', 47, ['Fairy'], {
        ability: 'Magic Guard',
        moves: [mv('Moonblast', 'Fairy', 95), mv('Charm', 'Fairy'), mv('Psychic', 'Psychic', 90), mv('Hyper Voice', 'Normal', 90)],
      }),
      mon('Lilligant', 47, ['Grass'], {
        ability: 'Own Tempo',
        moves: [mv('Petal Dance', 'Grass', 120), mv('Teeter Dance', 'Normal'), mv('Stun Spore', 'Grass')],
      }),
      mon('Lopunny', 47, ['Normal'], {
        ability: 'Cute Charm',
        moves: [mv('Dizzy Punch', 'Normal', 70), mv('Thunder Punch', 'Electric', 75), mv('Ice Punch', 'Ice', 75), mv('Fire Punch', 'Fire', 75)],
        notes: 'USUM-new (replaces SM Mismagius slot).',
      }),
      mon('Milotic', 47, ['Water'], {
        ability: 'Marvel Scale',
        moves: [mv('Hydro Pump', 'Water', 110), mv('Icy Wind', 'Ice', 55), mv('Flail', 'Normal'), mv('Dragon Pulse', 'Dragon', 85)],
      }),
      mon('Bewear', 47, ['Normal', 'Fighting'], {
        ability: 'Fluffy',
        moves: [mv('Zen Headbutt', 'Psychic', 80), mv('Drain Punch', 'Fighting', 75), mv('Take Down', 'Normal', 90), mv('Dual Chop', 'Dragon', 40)],
      }),
    ],
    notes: 'USUM Aether Paradise Lusamine battle. Swaps SM Mismagius → Lopunny; +6 levels (41 → 47). Not mandatory to win for story progression.',
  }),

  // Original skeleton kept (Altar) — see Pass 5 for population.
  skeletonBoss('usum-aether-lusamine-altar', 'Aether President Lusamine (Altar)', 'Altar of the Sunne / Altar of the Moone', 55, 'boss',
    'President Lusamine at the Altar'),

  // Ultra Recon Squad (USUM-exclusive).
  // Ultra Recon Squad — battle 3 (Aether Paradise during Lillie rescue). Earlier URS appearances
  // (Seaward Cave / Paniola Ranch) and final Vast Poni Canyon battle remain skeletons until
  // team/level data is canonically verified.
  skeletonBoss('usum-urs-aether-paradise', 'Ultra Recon Squad (Aether Paradise)', 'Aether Paradise', 53, 'ultra-recon-squad',
    "URS blocks the player during Lillie's rescue. Dulse (Ultra Sun) / Soliera (Ultra Moon). Levels/teams not surfaced — TODO."),
  skeletonBoss('usum-urs-dulse-zossie', 'Ultra Recon Squad (Dulse / Zossie)', 'Various', 54, 'boss',
    'Ultra Recon Squad battles (Dulse/Zossie)'),
  skeletonBoss('usum-urs-soliera-phyco', 'Ultra Recon Squad (Soliera / Phyco)', 'Various', 55, 'boss',
    'Ultra Recon Squad battles (Soliera/Phyco)'),

  // Necrozma (Megalo Tower) — USUM-exclusive postgame target.
  boss({
    id: 'usum-necrozma-megalo',
    name: 'Ultra Necrozma',
    location: 'Megalo Tower (Ultra Megalopolis)',
    order: 57,
    category: 'boss',
    levelCap: 60,
    team: [
      mon('Necrozma', 60, ['Psychic'], {
        ability: 'Neuroforce',
        notes: 'Ultra Necrozma form. Aura boost: +1 Atk/Def/SpA/SpD/Speed. Cannot be caught, fled from, or made Shiny — must be defeated.',
        moves: [mv('Photon Geyser', 'Psychic', 100), mv('Smart Strike', 'Steel', 70), mv('Power Gem', 'Rock', 80), mv('Dragon Pulse', 'Dragon', 85)],
      }),
    ],
    notes: 'Mandatory USUM story boss at Megalo Tower. After victory, URS gifts the player a Poipole.',
  }),

  // Later Hau battles (early Melemele/Akala battles populated above; Malie populated below).
  boss({
    id: 'usum-rival-hau-malie',
    name: 'Hau (Malie City)',
    location: 'Malie City',
    order: 29,
    category: 'rival',
    levelCap: 30,
    baseTeam: [
      mon('Alolan Raichu', 29, ['Electric', 'Psychic'], {
        ability: 'Surge Surfer',
        moves: [mv('Electro Ball', 'Electric', null), mv('Quick Attack', 'Normal', 40), mv('Psychic', 'Psychic', 90)],
      }),
      mon('Noibat', 28, ['Flying', 'Dragon'], {
        ability: 'Frisk',
        moves: [mv('Wing Attack', 'Flying', 60), mv('Bite', 'Dark', 60)],
      }),
      mon('Tauros', 28, ['Normal'], {
        moves: [mv('Pursuit', 'Dark', 40), mv('Horn Attack', 'Normal', 65)],
        notes: 'USUM-added party member.',
      }),
    ],
    variantsByRivalStarterChoice: {
      // Player grass → Hau Flareon (counters grass) + Brionne (weak to grass) Waterium Z.
      grass: [
        mon('Flareon', 28, ['Fire'], { ability: 'Flash Fire' }),
        mon('Brionne', 30, ['Water'], { ability: 'Torrent', item: 'Waterium Z' }),
      ],
      fire: [
        mon('Vaporeon', 28, ['Water'], { ability: 'Water Absorb' }),
        mon('Dartrix', 30, ['Grass', 'Flying'], { ability: 'Overgrow', item: 'Grassium Z' }),
      ],
      water: [
        mon('Leafeon', 28, ['Grass'], { ability: 'Leaf Guard' }),
        mon('Torracat', 30, ['Fire'], { ability: 'Blaze', item: 'Firium Z' }),
      ],
    },
    notes: "USUM Malie Hau battle has 5 Pokémon (vs SM's 3): adds Noibat and Tauros, levels +1 across the board.",
  }),
  skeletonBoss('usum-rival-hau-vast-poni', 'Hau (Vast Poni Canyon)', 'Vast Poni Canyon', 44, 'rival', 'Hau Vast Poni Canyon battle'),
  boss({
    id: 'usum-rival-hau-mount-lanakila',
    name: 'Hau (Mount Lanakila pre-League)',
    location: 'Mount Lanakila',
    order: 55,
    category: 'rival',
    levelCap: 54,
    baseTeam: [
      mon('Alolan Raichu', 53, ['Electric', 'Psychic'], { ability: 'Surge Surfer' }),
      mon('Komala', 53, ['Normal'], { ability: 'Comatose' }),
    ],
    variantsByRivalStarterChoice: {
      grass: [
        mon('Flareon', 53, ['Fire'], { ability: 'Flash Fire' }),
        mon('Primarina', 54, ['Water', 'Fairy'], { ability: 'Torrent', item: 'Waterium Z' }),
      ],
      fire: [
        mon('Vaporeon', 53, ['Water'], { ability: 'Water Absorb' }),
        mon('Decidueye', 54, ['Grass', 'Ghost'], { ability: 'Overgrow', item: 'Grassium Z' }),
      ],
      water: [
        mon('Leafeon', 53, ['Grass'], { ability: 'Leaf Guard' }),
        mon('Incineroar', 54, ['Fire', 'Dark'], { ability: 'Blaze', item: 'Firium Z' }),
      ],
    },
    notes: 'USUM Hau battle at Mount Lanakila pre-League. 4 Pokémon — same overall pattern as SM.',
  }),
  boss({
    id: 'usum-rival-hau-league',
    name: 'Champion Hau (Pokémon League)',
    location: 'Pokémon League',
    order: 64,
    category: 'champion',
    levelCap: 60,
    baseTeam: [
      mon('Alolan Raichu', 59, ['Electric', 'Psychic'], { ability: 'Surge Surfer' }),
      mon('Tauros', 59, ['Normal'], { notes: 'USUM-new vs SM Kukui Champion battle.' }),
      mon('Noivern', 59, ['Flying', 'Dragon'], { ability: 'Frisk' }),
      mon('Crabominable', 59, ['Fighting', 'Ice'], { ability: 'Iron Fist' }),
    ],
    variantsByRivalStarterChoice: {
      grass: [
        mon('Flareon', 59, ['Fire'], { ability: 'Flash Fire' }),
        mon('Primarina', 60, ['Water', 'Fairy'], { ability: 'Torrent', item: 'Waterium Z' }),
      ],
      fire: [
        mon('Vaporeon', 59, ['Water'], { ability: 'Water Absorb' }),
        mon('Decidueye', 60, ['Grass', 'Ghost'], { ability: 'Overgrow', item: 'Grassium Z' }),
      ],
      water: [
        mon('Leafeon', 59, ['Grass'], { ability: 'Leaf Guard' }),
        mon('Incineroar', 60, ['Fire', 'Dark'], { ability: 'Blaze', item: 'Firium Z' }),
      ],
    },
    notes: 'USUM final boss: Hau is Champion (replaces SM Kukui). 6-Pokémon team. Per-move data not surfaced — TODO.',
  }),

  // Elite Four — USUM tweaks the lineup (Molayne replaces Hala on the panel; Hala becomes Kahuna postgame).
  boss({
    id: 'usum-e4-molayne',
    name: 'Elite Four Molayne',
    location: 'Pokémon League',
    order: 60,
    category: 'elite-four',
    levelCap: 57,
    team: [
      mon('Klefki', 56, ['Steel', 'Fairy'], {
        ability: 'Prankster',
        moves: [mv('Spikes', 'Ground'), mv('Thunder Wave', 'Electric'), mv('Flash Cannon', 'Steel', 80), mv('Reflect', 'Psychic')],
      }),
      mon('Bisharp', 56, ['Dark', 'Steel'], {
        ability: 'Defiant',
        moves: [mv('Night Slash', 'Dark', 70), mv('Iron Head', 'Steel', 80), mv('X-Scissor', 'Bug', 80), mv('Metal Sound', 'Steel')],
      }),
      mon('Magnezone', 56, ['Electric', 'Steel'], {
        ability: 'Sturdy',
        moves: [mv('Flash Cannon', 'Steel', 80), mv('Thunderbolt', 'Electric', 90), mv('Tri Attack', 'Normal', 80), mv('Screech', 'Normal')],
      }),
      mon('Metagross', 56, ['Steel', 'Psychic'], {
        ability: 'Clear Body',
        moves: [mv('Hammer Arm', 'Fighting', 100), mv('Meteor Mash', 'Steel', 90), mv('Bullet Punch', 'Steel', 40), mv('Zen Headbutt', 'Psychic', 80)],
      }),
      mon('Alolan Dugtrio', 57, ['Ground', 'Steel'], {
        ability: 'Tangling Hair',
        item: 'Steelium Z',
        moves: [mv('Earthquake', 'Ground', 100), mv('Iron Head', 'Steel', 80), mv('Sucker Punch', 'Dark', 70), mv('Fissure', 'Ground')],
        notes: 'Uses Corkscrew Crash (Steelium Z) at the first opportunity.',
      }),
    ],
    notes: 'USUM Elite Four Molayne (Steel specialist) — replaces SM Hala on the panel.',
  }),
  boss({
    id: 'usum-e4-olivia',
    name: 'Elite Four Olivia',
    location: 'Pokémon League',
    order: 61,
    category: 'elite-four',
    levelCap: 57,
    team: [
      mon('Armaldo', 56, ['Rock', 'Bug'], {
        ability: 'Battle Armor',
        moves: [mv('Crush Claw', 'Normal', 75), mv('X-Scissor', 'Bug', 80), mv('Rock Blast', 'Rock', 25)],
      }),
      mon('Cradily', 56, ['Rock', 'Grass'], {
        ability: 'Suction Cups',
        moves: [mv('Rock Tomb', 'Rock', 60), mv('Energy Ball', 'Grass', 90), mv('Stealth Rock', 'Rock')],
      }),
      mon('Gigalith', 56, ['Rock'], {
        ability: 'Sand Stream',
        moves: [mv('Stone Edge', 'Rock', 100), mv('Bulldoze', 'Ground', 60), mv('Iron Head', 'Steel', 80)],
      }),
      mon('Probopass', 56, ['Rock', 'Steel'], {
        ability: 'Sturdy',
        moves: [mv('Earth Power', 'Ground', 90), mv('Power Gem', 'Rock', 80), mv('Thunder Wave', 'Electric'), mv('Sandstorm', 'Rock')],
      }),
      mon('Lycanroc', 57, ['Rock'], {
        ability: 'Keen Eye',
        item: 'Rockium Z',
        moves: [mv('Crunch', 'Dark', 80), mv('Stone Edge', 'Rock', 100), mv('Counter', 'Fighting'), mv('Rock Climb', 'Normal', 90)],
        notes: 'Midnight Form. Z-Move Continental Crush from Stone Edge.',
      }),
    ],
    notes: 'USUM Elite Four Olivia. Swaps SM Relicanth/Carbink/Alolan Golem → Armaldo/Cradily/Gigalith.',
  }),
  boss({
    id: 'usum-e4-acerola',
    name: 'Elite Four Acerola',
    location: 'Pokémon League',
    order: 62,
    category: 'elite-four',
    levelCap: 57,
    team: [
      mon('Banette', 56, ['Ghost'], {
        ability: 'Insomnia',
        moves: [mv('Shadow Claw', 'Ghost', 70), mv('Feint Attack', 'Dark', 60), mv('Infestation', 'Bug', 20), mv('Screech', 'Normal')],
        notes: 'USUM swap (SM had Sableye in this slot).',
      }),
      mon('Drifblim', 56, ['Ghost', 'Flying'], {
        ability: 'Aftermath',
        moves: [mv('Ominous Wind', 'Ghost', 60), mv('Focus Energy', 'Normal'), mv('Amnesia', 'Psychic'), mv('Baton Pass', 'Normal')],
      }),
      mon('Dhelmise', 56, ['Grass', 'Ghost'], {
        ability: 'Steelworker',
        moves: [mv('Slam', 'Normal', 80), mv('Shadow Ball', 'Ghost', 80), mv('Energy Ball', 'Grass', 90), mv('Whirlpool', 'Water', 35)],
      }),
      mon('Froslass', 56, ['Ice', 'Ghost'], {
        ability: 'Snow Cloak',
        moves: [mv('Blizzard', 'Ice', 110), mv('Shadow Ball', 'Ghost', 80), mv('Confuse Ray', 'Ghost'), mv('Ice Shard', 'Ice', 40)],
      }),
      mon('Palossand', 57, ['Ghost', 'Ground'], {
        ability: 'Water Compaction',
        item: 'Ghostium Z',
        moves: [mv('Shadow Ball', 'Ghost', 80), mv('Earth Power', 'Ground', 90), mv('Giga Drain', 'Grass', 75), mv('Iron Defense', 'Steel')],
        notes: 'Z-Move Never-Ending Nightmare.',
      }),
    ],
    notes: 'USUM Elite Four Acerola. Swaps SM Sableye → Banette.',
  }),
  boss({
    id: 'usum-e4-kahili',
    name: 'Elite Four Kahili',
    location: 'Pokémon League',
    order: 63,
    category: 'elite-four',
    levelCap: 57,
    team: [
      mon('Braviary', 56, ['Normal', 'Flying'], {
        ability: 'Sheer Force',
        moves: [mv('Crush Claw', 'Normal', 75), mv('Brave Bird', 'Flying', 120), mv('Air Slash', 'Flying', 75), mv('Scary Face', 'Normal')],
        notes: 'USUM swap (SM had Skarmory).',
      }),
      mon('Hawlucha', 56, ['Fighting', 'Flying'], {
        ability: 'Mold Breaker',
        moves: [mv('Flying Press', 'Fighting', 100), mv('Throat Chop', 'Dark', 80), mv('Dual Chop', 'Dragon', 40), mv('Poison Jab', 'Poison', 80)],
        notes: 'USUM swap (SM had Crobat).',
      }),
      mon('Oricorio', 56, ['Fire', 'Flying'], {
        ability: 'Dancer',
        moves: [mv('Revelation Dance', 'Fire', 90), mv('Teeter Dance', 'Normal'), mv('Air Slash', 'Flying', 75), mv('Feather Dance', 'Flying')],
        notes: 'Baile Style.',
      }),
      mon('Mandibuzz', 56, ['Dark', 'Flying'], {
        ability: 'Big Pecks',
        moves: [mv('Bone Rush', 'Ground', 25), mv('Brave Bird', 'Flying', 120), mv('Punishment', 'Dark', 60), mv('Flatter', 'Dark')],
      }),
      mon('Toucannon', 57, ['Normal', 'Flying'], {
        ability: 'Skill Link',
        item: 'Flyinium Z',
        moves: [mv('Bullet Seed', 'Grass', 25), mv('Rock Blast', 'Rock', 25), mv('Beak Blast', 'Flying', 100), mv('Screech', 'Normal')],
        notes: 'Z-Move Supersonic Skystrike.',
      }),
    ],
    notes: 'USUM Elite Four Kahili. Swaps SM Skarmory→Braviary, Crobat→Hawlucha.',
  }),

  // -- Gladion Mount Lanakila (USUM Pass 5 verified) --
  boss({
    id: 'usum-gladion-mount-lanakila',
    name: 'Gladion (Mount Lanakila)',
    location: 'Mount Lanakila',
    order: 56,
    category: 'rival',
    levelCap: 55,
    baseTeam: [
      mon('Crobat', 53, ['Poison', 'Flying']),
      mon('Zoroark', 53, ['Dark'], {
        ability: 'Illusion',
        item: 'Darkinium Z',
        notes: 'Uses Black Hole Eclipse (Darkinium Z) at the first opportunity.',
      }),
    ],
    variantsByRivalStarterChoice: {
      // Silvally's type adapts to counter the player's starter.
      grass: [mon('Silvally', 55, ['Fire'], { notes: 'Fire-Memory Silvally (counters Grass player).' })],
      fire: [mon('Silvally', 55, ['Water'], { notes: 'Water-Memory Silvally (counters Fire player).' })],
      water: [mon('Silvally', 55, ['Grass'], { notes: 'Grass-Memory Silvally (counters Water player).' })],
    },
    notes: 'USUM Gladion Mount Lanakila pre-League battle. Silvally type adapts to counter player\'s starter. Lucario (in some sources) is variant-dependent and not added without verification.',
  }),

  // USUM Champion is Hau himself (see `usum-rival-hau-league` above); SM-style Champion Defense
  // skeleton retained for the postgame title-defense rotation.
  skeletonBoss('usum-champion-defense-postgame', 'Champion Defense (postgame rotation)', 'Pokémon League', 65, 'champion',
    'Postgame title-defense rotation against rotating challengers'),
];
