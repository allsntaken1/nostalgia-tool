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

  // Akala captains + totems.
  skeletonBoss('usum-trial-lana', 'Trial Captain Lana', 'Brooklet Hill', 20, 'trial-captain', 'Captain Lana'),
  skeletonBoss('usum-totem-araquanid', 'Totem Araquanid', 'Brooklet Hill', 21, 'totem', 'Totem Araquanid'),
  skeletonBoss('usum-trial-kiawe', 'Trial Captain Kiawe', 'Wela Volcano Park', 22, 'trial-captain', 'Captain Kiawe'),
  skeletonBoss('usum-totem-salazzle-marowak', 'Totem Pokémon (Wela Volcano Park)', 'Wela Volcano Park', 23, 'totem',
    'Totem Salazzle (Ultra Sun) / Totem Alolan Marowak (Ultra Moon)'),
  skeletonBoss('usum-trial-mallow', 'Trial Captain Mallow', 'Lush Jungle', 24, 'trial-captain', 'Captain Mallow'),
  skeletonBoss('usum-totem-lurantis', 'Totem Lurantis', 'Lush Jungle', 25, 'totem', 'Totem Lurantis'),

  // Akala Kahuna.
  skeletonBoss('usum-kahuna-olivia', 'Kahuna Olivia', 'Ruins of Life (Konikoni)', 26, 'kahuna', 'Kahuna Olivia'),

  // Ula'ula captains + totems — USUM swaps Acerola's totem.
  skeletonBoss('usum-trial-sophocles', 'Trial Captain Sophocles', 'Mount Hokulani', 30, 'trial-captain', 'Captain Sophocles'),
  skeletonBoss('usum-totem-togedemaru', 'Totem Togedemaru', 'Mount Hokulani', 31, 'totem', 'Totem Togedemaru'),
  skeletonBoss('usum-trial-acerola', 'Trial Captain Acerola', 'Thrifty Megamart', 32, 'trial-captain', 'Captain Acerola'),
  skeletonBoss('usum-totem-mimikyu', 'Totem Mimikyu', 'Thrifty Megamart', 33, 'totem', 'Totem Mimikyu'),

  // Ula'ula Kahuna.
  skeletonBoss('usum-kahuna-nanu', 'Kahuna Nanu', 'Malie City', 34, 'kahuna', 'Kahuna Nanu'),

  // Poni captains + totems.
  skeletonBoss('usum-trial-mina', 'Trial Captain Mina', 'Poni Island', 40, 'trial-captain', 'Captain Mina'),
  skeletonBoss('usum-totem-kommoo', "Totem Kommo-o", 'Vast Poni Canyon', 41, 'totem', "Totem Kommo-o"),
  skeletonBoss('usum-totem-ribombee', 'Totem Ribombee', 'Poni Island', 42, 'totem', 'Totem Ribombee (USUM-added Mina trial)'),

  // Poni Kahuna.
  skeletonBoss('usum-kahuna-hapu', 'Kahuna Hapu', 'Exeggutor Island', 43, 'kahuna', 'Kahuna Hapu'),

  // Team Skull.
  skeletonBoss('usum-skull-plumeria', 'Plumeria (Skull Admin)', 'Various', 50, 'evil-team', 'Plumeria battles'),
  skeletonBoss('usum-skull-guzma-po-town', 'Guzma (Po Town)', 'Po Town', 51, 'evil-team', 'Guzma at Shady House'),

  // Aether — USUM reframes Lusamine.
  skeletonBoss('usum-aether-faba', 'Aether Branch Chief Faba', 'Aether Paradise', 52, 'boss', 'Branch Chief Faba'),
  skeletonBoss('usum-aether-lusamine-altar', 'Aether President Lusamine', 'Altar of the Sunne / Altar of the Moone', 53, 'boss',
    'President Lusamine at the Altar'),

  // Ultra Recon Squad (USUM-exclusive).
  skeletonBoss('usum-urs-dulse-zossie', 'Ultra Recon Squad (Dulse / Zossie)', 'Various', 54, 'boss',
    'Ultra Recon Squad battles (Dulse/Zossie)'),
  skeletonBoss('usum-urs-soliera-phyco', 'Ultra Recon Squad (Soliera / Phyco)', 'Various', 55, 'boss',
    'Ultra Recon Squad battles (Soliera/Phyco)'),

  // Necrozma (Megalo Tower) — USUM-exclusive postgame target.
  skeletonBoss('usum-necrozma-megalo', 'Ultra Necrozma', 'Megalo Tower (Ultra Megalopolis)', 56, 'boss',
    'Ultra Necrozma fight at Megalo Tower'),

  // Later Hau battles (early Melemele/Akala battles populated above).
  skeletonBoss('usum-rival-hau-malie', 'Hau (Malie Garden)', 'Malie Garden', 35, 'rival', 'Hau Malie Garden battle'),
  skeletonBoss('usum-rival-hau-vast-poni', 'Hau (Vast Poni Canyon)', 'Vast Poni Canyon', 44, 'rival', 'Hau Vast Poni Canyon battle'),
  skeletonBoss('usum-rival-hau-league', 'Hau (League)', 'Pokémon League', 60, 'rival', 'Hau Pokémon League battle'),

  // Elite Four — USUM tweaks the lineup (Molayne replaces Hala on the panel; Hala becomes Kahuna postgame).
  skeletonBoss('usum-e4-molayne', 'Elite Four Molayne', 'Pokémon League', 57, 'elite-four', 'Elite Four Molayne'),
  skeletonBoss('usum-e4-olivia', 'Elite Four Olivia', 'Pokémon League', 58, 'elite-four', 'Elite Four Olivia'),
  skeletonBoss('usum-e4-acerola', 'Elite Four Acerola', 'Pokémon League', 59, 'elite-four', 'Elite Four Acerola'),
  skeletonBoss('usum-e4-kahili', 'Elite Four Kahili', 'Pokémon League', 60, 'elite-four', 'Elite Four Kahili'),

  // Champion — like SM, USUM has no fixed Champion; first defense is Hau again.
  skeletonBoss('usum-champion-defense-hau', 'Champion Defense vs. Hau', 'Pokémon League', 61, 'champion',
    'Champion Defense (Hau, first match — the player becomes Champion)'),
];
