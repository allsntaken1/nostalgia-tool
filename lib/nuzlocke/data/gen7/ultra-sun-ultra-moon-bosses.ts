import type { BossTrainer } from '@/lib/nuzlocke/data/gen8/types';

/**
 * Ultra Sun / Ultra Moon boss skeleton. Placeholder entries only. Populating canonical teams,
 * levels, abilities, moves, items requires verified data — out of scope this pass.
 */

type UsumBossCategory = 'rival' | 'kahuna' | 'trial-captain' | 'totem' | 'evil-team' | 'boss' | 'elite-four' | 'champion';

const skeletonBoss = (
  id: string,
  name: string,
  location: string,
  order: number,
  category: UsumBossCategory,
  todoLabel: string,
): BossTrainer => ({
  id,
  name,
  category,
  game: 'Both',
  location,
  recommendedOrder: order,
  // Explicit null marks this entry as TBD; the converter forwards null to the UI's "TBD" path
  // instead of fabricating a fake cap of 1.
  levelCap: null,
  notes: `TODO: Populate canonical ${todoLabel} data.`,
  baseTeam: [],
});

export const ultraSunUltraMoonBosses: BossTrainer[] = [
  // Trial captains + Totems — Melemele.
  skeletonBoss('usum-trial-ilima', 'Trial Captain Ilima', 'Verdant Cavern', 10, 'trial-captain', 'Captain Ilima'),
  skeletonBoss('usum-totem-gumshoos-raticate', 'Totem Pokémon (Verdant Cavern)', 'Verdant Cavern', 11, 'totem',
    'Totem Gumshoos (Ultra Sun) / Totem Alolan Raticate (Ultra Moon)'),

  // Melemele Kahuna.
  skeletonBoss('usum-kahuna-hala', 'Kahuna Hala', 'Iki Town', 12, 'kahuna', 'Kahuna Hala'),

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

  // Rivals — Hau scaling, like SM.
  skeletonBoss('usum-rival-hau-iki', 'Hau (Iki Town intro)', 'Iki Town', 5, 'rival', 'Hau Iki Town battle'),
  skeletonBoss('usum-rival-hau-ten-carat', 'Hau (Ten Carat Hill)', 'Ten Carat Hill', 13, 'rival', 'Hau Ten Carat Hill battle'),
  skeletonBoss('usum-rival-hau-paniola', 'Hau (Paniola Town)', 'Paniola Town', 14, 'rival', 'Hau Paniola Town battle'),
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
