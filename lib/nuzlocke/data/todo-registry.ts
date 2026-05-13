/**
 * Nuzlocke TODO registry.
 *
 * Hand-maintained list of known data gaps across the Nuzlocke static data. The
 * admin page at /nuzlocke/todo reads from this file. A future scripts/generator
 * pass can scan lib/nuzlocke/data/** for inline TODO markers and append/replace
 * entries here, but starting with a curated list keeps the page useful without
 * a build-time scanner.
 */

export type TodoStatus = 'missing' | 'needs_verification' | 'incomplete';
export type TodoEntityType =
  | 'boss'
  | 'encounter'
  | 'pokemon'
  | 'route'
  | 'metadata'
  | 'sprite'
  | 'move'
  | 'other';

export type TodoItem = {
  id: string;
  generation: number;
  gameId: string;
  gameLabel: string;
  filePath: string;
  entityType: TodoEntityType;
  entityId: string;
  entityLabel: string;
  fieldPath: string;
  currentValue: unknown;
  status: TodoStatus;
  instructions: string;
  sourceNote?: string;
};

export type TodoGameGroup = {
  generation: number;
  gameId: string;
  gameLabel: string;
};

export const TODO_GAME_GROUPS: TodoGameGroup[] = [
  { generation: 1, gameId: 'rb', gameLabel: 'Red / Blue' },
  { generation: 1, gameId: 'yellow', gameLabel: 'Yellow' },
  { generation: 2, gameId: 'gsc', gameLabel: 'Gold / Silver / Crystal' },
  { generation: 3, gameId: 'rse', gameLabel: 'Ruby / Sapphire / Emerald' },
  { generation: 3, gameId: 'frlg', gameLabel: 'FireRed / LeafGreen' },
  { generation: 4, gameId: 'dppt', gameLabel: 'Diamond / Pearl / Platinum' },
  { generation: 4, gameId: 'hgss', gameLabel: 'HeartGold / SoulSilver' },
  { generation: 5, gameId: 'bw', gameLabel: 'Black / White' },
  { generation: 5, gameId: 'b2w2', gameLabel: 'Black 2 / White 2' },
  { generation: 6, gameId: 'xy', gameLabel: 'X / Y' },
  { generation: 6, gameId: 'oras', gameLabel: 'Omega Ruby / Alpha Sapphire' },
  { generation: 7, gameId: 'sm', gameLabel: 'Sun / Moon / Ultra Sun / Ultra Moon' },
  { generation: 8, gameId: 'swsh', gameLabel: 'Sword / Shield' },
  { generation: 8, gameId: 'bdsp', gameLabel: 'Brilliant Diamond / Shining Pearl' },
];

const todo = (item: TodoItem): TodoItem => item;

export const todoRegistry: TodoItem[] = [
  // ---------------------- FRLG ----------------------
  todo({
    id: 'frlg-rival-silph-co-team',
    generation: 3,
    gameId: 'frlg',
    gameLabel: 'FireRed / LeafGreen',
    filePath: 'lib/nuzlocke/data/gen3/frlg/bosses.ts',
    entityType: 'boss',
    entityId: 'rival-silph-co-frlg',
    entityLabel: 'Rival 5 (Silph Co.)',
    fieldPath: 'team + variantsByRivalStarterChoice',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Enter the canonical FRLG Rival 5 team at Silph Co. with starter variants (rival picks the starter strong against player). Verified levels are ~Lv 35-41; ace is starter at Lv 41.',
    sourceNote: 'Bulbapedia: "Rival (game)" → Silph Co. battle section.',
  }),

  // ---------------------- BW ----------------------
  todo({
    id: 'bw-plasma-dreamyard-grunts',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/black-white-bosses.ts',
    entityType: 'boss',
    entityId: 'team-plasma-dreamyard-bw',
    entityLabel: 'Team Plasma (Dreamyard)',
    fieldPath: 'team[0..1].moves',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Patrat Lv 10 + Purrloin Lv 10 grunt movesets (the two grunts in the Munna kick event).',
    sourceNote: 'Bulbapedia: Dreamyard page → trainer encounters.',
  }),
  todo({
    id: 'bw-plasma-wellspring-grunts',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/black-white-bosses.ts',
    entityType: 'boss',
    entityId: 'team-plasma-wellspring-cave-bw',
    entityLabel: 'Team Plasma (Wellspring Cave)',
    fieldPath: 'team[0..1].moves',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Two grunts × Patrat Lv 12 — exact movesets.',
    sourceNote: 'Bulbapedia: Wellspring Cave page.',
  }),
  todo({
    id: 'bw-plasma-pinwheel-roster',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/black-white-bosses.ts',
    entityType: 'boss',
    entityId: 'team-plasma-pinwheel-forest-bw',
    entityLabel: 'Team Plasma (Pinwheel Forest)',
    fieldPath: 'team',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Per-grunt teams for the Dragon Skull chase (5 grunts, fought alongside Burgh).',
    sourceNote: 'Bulbapedia: Pinwheel Forest page → trainer section.',
  }),
  todo({
    id: 'bw-plasma-cold-storage-roster',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/black-white-bosses.ts',
    entityType: 'boss',
    entityId: 'team-plasma-cold-storage-bw',
    entityLabel: 'Team Plasma (Cold Storage)',
    fieldPath: 'team',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Per-grunt teams for the 5-grunt sequence at Cold Storage (Watchog/Scraggy/Liepard/Trubbish/Sandile, Lv 23-24).',
    sourceNote: 'Bulbapedia: Cold Storage page.',
  }),
  todo({
    id: 'bw-cheren-route7',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/black-white-bosses.ts',
    entityType: 'boss',
    entityId: 'cheren-route-7-bw',
    entityLabel: 'Cheren (Route 7)',
    fieldPath: 'team',
    currentValue: 'not present',
    status: 'needs_verification',
    instructions: 'Confirm whether a canonical Cheren rival battle exists on Route 7 in BW. If yes, populate full team per starter variant.',
    sourceNote: 'Bulbapedia: Cheren battle list.',
  }),
  todo({
    id: 'bw-twist-mountain-encounters',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/bw-encounters.ts',
    entityType: 'encounter',
    entityId: 'bw-twist-mountain',
    entityLabel: 'Twist Mountain',
    fieldPath: 'encounters',
    currentValue: 'not present',
    status: 'missing',
    instructions: 'Cave encounters by floor (Cubchoo, Gurdurr, Boldore, Excadrill, Woobat, Onix candidates).',
    sourceNote: 'Bulbapedia: Twist Mountain page.',
  }),
  todo({
    id: 'bw-mistralton-wild-table',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/bw-encounters.ts',
    entityType: 'encounter',
    entityId: 'bw-mistralton-city',
    entityLabel: 'Mistralton City',
    fieldPath: 'encounters',
    currentValue: '[]',
    status: 'needs_verification',
    instructions: 'Verify if Mistralton has any reachable Surf/Fishing tiles during the main story.',
  }),
  todo({
    id: 'bw-nacrene-fossils',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/bw-encounters.ts',
    entityType: 'encounter',
    entityId: 'bw-nacrene-city',
    entityLabel: 'Nacrene City — Museum fossils',
    fieldPath: 'encounters / convention',
    currentValue: 'not encoded',
    status: 'needs_verification',
    instructions: 'Decide schema convention for fossil revival encounters (Cranidos / Shieldon / Tirtouga / Archen).',
  }),
  todo({
    id: 'bw-castelia-zorua',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/bw-encounters.ts',
    entityType: 'encounter',
    entityId: 'bw-castelia-city',
    entityLabel: 'Castelia City — Zorua event gift',
    fieldPath: 'encounters',
    currentValue: 'not encoded',
    status: 'needs_verification',
    instructions: 'Decide handling for the event-distribution Zorua gift (requires fateful-encounter Celebi).',
  }),
  todo({
    id: 'bw-lostlorn-foreign-trainer',
    generation: 5,
    gameId: 'bw',
    gameLabel: 'Black / White',
    filePath: 'lib/nuzlocke/data/gen5/bw-encounters.ts',
    entityType: 'encounter',
    entityId: 'bw-lostlorn-forest',
    entityLabel: 'Lostlorn Forest — foreign trainer',
    fieldPath: 'encounters',
    currentValue: 'not encoded',
    status: 'needs_verification',
    instructions: 'Confirm Heracross/Pinsir static availability via the foreign-trainer overworld interaction.',
  }),

  // ---------------------- B2W2 ----------------------
  todo({
    id: 'b2w2-skeleton-encounters',
    generation: 5,
    gameId: 'b2w2',
    gameLabel: 'Black 2 / White 2',
    filePath: 'lib/nuzlocke/data/gen5/gen5-routes.ts',
    entityType: 'encounter',
    entityId: 'b2w2-all',
    entityLabel: 'B2W2 — all locations',
    fieldPath: 'encounter tables',
    currentValue: 'skeleton',
    status: 'missing',
    instructions: 'B2W2 is currently skeleton-only. Populate canonical encounter tables route-by-route.',
  }),
  todo({
    id: 'b2w2-skeleton-bosses',
    generation: 5,
    gameId: 'b2w2',
    gameLabel: 'Black 2 / White 2',
    filePath: 'lib/nuzlocke/data/gen5/gen5-trainers.ts',
    entityType: 'boss',
    entityId: 'b2w2-all',
    entityLabel: 'B2W2 — all bosses',
    fieldPath: 'trainer rosters',
    currentValue: 'skeleton',
    status: 'missing',
    instructions: 'Populate gym leaders, Elite Four, Champion, rivals.',
  }),

  // ---------------------- GSC ----------------------
  todo({
    id: 'gsc-skeleton',
    generation: 2,
    gameId: 'gsc',
    gameLabel: 'Gold / Silver / Crystal',
    filePath: 'lib/nuzlocke/data/gen2/johto/',
    entityType: 'other',
    entityId: 'gsc-all',
    entityLabel: 'GSC — full pass needed',
    fieldPath: '*',
    currentValue: 'skeleton',
    status: 'missing',
    instructions: 'Johto is skeleton-only. Populate encounter tables and trainers per route.',
  }),

  // ---------------------- XY (carry-over verification) ----------------------
  todo({
    id: 'xy-pinwheel-moves-grunt-set',
    generation: 6,
    gameId: 'xy',
    gameLabel: 'X / Y',
    filePath: 'lib/nuzlocke/data/gen6/xy-bosses.ts',
    entityType: 'boss',
    entityId: 'team-flare-glittering-cave-xy',
    entityLabel: 'Team Flare (Glittering Cave)',
    fieldPath: 'team',
    currentValue: 'partial',
    status: 'needs_verification',
    instructions: 'Verify per-grunt teams (Houndour-line candidates) and choose between per-grunt entries vs consolidated event entry.',
  }),
  todo({
    id: 'xy-team-flare-power-plant',
    generation: 6,
    gameId: 'xy',
    gameLabel: 'X / Y',
    filePath: 'lib/nuzlocke/data/gen6/xy-bosses.ts',
    entityType: 'boss',
    entityId: 'team-flare-kalos-power-plant',
    entityLabel: 'Team Flare (Kalos Power Plant)',
    fieldPath: 'team',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Populate the required Power Plant grunt roster + admin fight (Aliana candidate).',
  }),
  todo({
    id: 'xy-poke-ball-factory',
    generation: 6,
    gameId: 'xy',
    gameLabel: 'X / Y',
    filePath: 'lib/nuzlocke/data/gen6/xy-bosses.ts',
    entityType: 'boss',
    entityId: 'team-flare-poke-ball-factory',
    entityLabel: 'Team Flare (Poké Ball Factory)',
    fieldPath: 'team',
    currentValue: '[]',
    status: 'missing',
    instructions: 'Populate the Poké Ball Factory required Team Flare lineup (Celosia candidate at end).',
  }),

  // ---------------------- Generic / cross-game placeholders ----------------------
  todo({
    id: 'sprite-fallback-trainer-mappings',
    generation: 0,
    gameId: 'shared',
    gameLabel: 'Shared / Sprites',
    filePath: 'app/nuzlocke/components.tsx',
    entityType: 'sprite',
    entityId: 'trainer-sprite-slug-map',
    entityLabel: 'TrainerSprite slug overrides',
    fieldPath: 'trainerSpriteSlug() mapped record',
    currentValue: 'partial',
    status: 'needs_verification',
    instructions: 'Add mappings for project-specific names ("Rival 1", "Rival 2", "Rival Silph Co.", BW Cheren/Bianca etc.) so Showdown sprites resolve instead of falling back to initials.',
  }),
];

export const todoCountByGame = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of todoRegistry) {
    counts[item.gameId] = (counts[item.gameId] ?? 0) + 1;
  }
  return counts;
};
