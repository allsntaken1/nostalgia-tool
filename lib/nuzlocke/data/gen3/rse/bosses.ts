import type { BossTrainer, BossTrainerPokemon } from '@/lib/nuzlocke/data/gen8/types';
import type { GameVersion, StarterChoice } from '@/app/nuzlocke/types';

type RseBossCategory = 'rival' | 'gym' | 'evil-team' | 'elite-four' | 'champion' | 'boss';

const mon = (species: string, level: number, types: BossTrainerPokemon['types'], extras: Partial<BossTrainerPokemon> = {}): BossTrainerPokemon => ({ species, level, types, ...extras });

function boss({
  id,
  name,
  category,
  game = 'Both',
  location,
  order,
  levelCap,
  baseTeam,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  category: RseBossCategory;
  game?: GameVersion | 'Both';
  location: string;
  order: number;
  levelCap?: number | null;
  baseTeam?: BossTrainerPokemon[];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, BossTrainerPokemon[]>>;
  notes?: string;
}): BossTrainer {
  const team = baseTeam ?? [];
  return {
    id,
    name,
    category,
    game,
    location,
    recommendedOrder: order,
    levelCap: levelCap ?? (team.length > 0 ? null : null),
    notes: notes ?? `Hoenn ${category} at ${location}. Full team data coming later.`,
    baseTeam: team,
    ...(variantsByRivalStarterChoice ? { variantsByRivalStarterChoice } : {}),
  };
}

// ===========================================================================================
// Rival starter cycle (Brendan/May) — RSE rival uses the starter STRONG against player's pick:
//   player Treecko (Grass) → rival Torchic line (Fire)
//   player Torchic (Fire)  → rival Mudkip line (Water)
//   player Mudkip (Water)  → rival Treecko line (Grass)
// ===========================================================================================

export const rseBosses: BossTrainer[] = [
  // ---- POPULATED: First rival battle on Route 103 ----
  boss({
    id: 'rival-route-103-rse',
    name: 'Rival 1 (Route 103)',
    category: 'rival',
    location: 'Route 103',
    order: 1,
    levelCap: 5,
    baseTeam: [],
    variantsByRivalStarterChoice: {
      grass: [mon('Torchic', 5, ['Fire'])],
      fire: [mon('Mudkip', 5, ['Water'])],
      water: [mon('Treecko', 5, ['Grass'])],
    },
    notes: 'First rival battle (Brendan in Ruby/Emerald, May in Sapphire, or the opposite if player is male/female). Rival uses the starter strong vs yours.',
  }),

  // ---- POPULATED: Aqua/Magma Grunt at Rusturf Tunnel (Devon Goods theft) ----
  boss({
    id: 'aqua-magma-grunt-rusturf-r',
    name: 'Team Magma Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Ruby',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Ruby variant: Magma Grunt steals the Devon Goods. Defeat triggers Mr. Briney introduction.',
  }),
  boss({
    id: 'aqua-magma-grunt-rusturf-s',
    name: 'Team Aqua Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Sapphire',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Sapphire variant: Aqua Grunt steals the Devon Goods.',
  }),
  boss({
    id: 'aqua-magma-grunt-rusturf-e',
    name: 'Team Aqua Grunt (Devon Goods)',
    category: 'evil-team',
    game: 'Emerald',
    location: 'Rusturf Tunnel',
    order: 5,
    levelCap: 11,
    baseTeam: [mon('Poochyena', 11, ['Dark'])],
    notes: 'Emerald variant: Aqua Grunt steals the Devon Goods (Aqua plot in Emerald early game).',
  }),

  // ---- POPULATED: Roxanne (Rustboro Gym — Rock) — RSE first-battle team identical across versions ----
  boss({
    id: 'roxanne-gym',
    name: 'Roxanne',
    category: 'gym',
    location: 'Rustboro Gym',
    order: 6,
    levelCap: 15,
    baseTeam: [
      mon('Geodude', 12, ['Rock', 'Ground']),
      mon('Geodude', 12, ['Rock', 'Ground']),
      mon('Nosepass', 15, ['Rock']),
    ],
    notes: 'Stone Badge. Ace Nosepass at Lv 15. Movesets TODO. Emerald rematches add evolved forms — not modeled here.',
  }),

  // ---- SKELETONS: remaining Hoenn gym/E4/champion gauntlet. levelCap null so the UI renders TBD ----
  // Brawly (Dewford Gym — Fighting). RS uses a 2-mon lineup; Emerald inserts Meditite.
  boss({
    id: 'brawly-gym-r',
    name: 'Brawly',
    category: 'gym',
    game: 'Ruby',
    location: 'Dewford Gym',
    order: 11,
    levelCap: 19,
    baseTeam: [
      mon('Machop', 16, ['Fighting']),
      mon('Makuhita', 19, ['Fighting']),
    ],
    notes: 'Knuckle Badge (Fighting). Ruby team. Makuhita ace Lv 19 — Bulk Up + Vital Throw threat. Movesets TODO.',
  }),
  boss({
    id: 'brawly-gym-s',
    name: 'Brawly',
    category: 'gym',
    game: 'Sapphire',
    location: 'Dewford Gym',
    order: 11,
    levelCap: 19,
    baseTeam: [
      mon('Machop', 16, ['Fighting']),
      mon('Makuhita', 19, ['Fighting']),
    ],
    notes: 'Knuckle Badge (Fighting). Sapphire team — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'brawly-gym-e',
    name: 'Brawly',
    category: 'gym',
    game: 'Emerald',
    location: 'Dewford Gym',
    order: 11,
    levelCap: 19,
    baseTeam: [
      mon('Machop', 17, ['Fighting']),
      mon('Meditite', 17, ['Fighting', 'Psychic']),
      mon('Makuhita', 19, ['Fighting']),
    ],
    notes: 'Knuckle Badge (Fighting). Emerald inserts Meditite and bumps Machop +1 level. Movesets TODO.',
  }),

  // Wally — Mauville City introduction battle (uses his caught Ralts).
  boss({
    id: 'wally-mauville',
    name: 'Wally (Mauville)',
    category: 'rival',
    location: 'Mauville City',
    order: 14,
    levelCap: 16,
    baseTeam: [mon('Ralts', 16, ['Psychic', 'Fairy'])],
    notes: "Wally's first solo battle vs the player at Mauville City entrance, using the Ralts he caught at Petalburg. Ralts typed Psychic/Fairy per modern-dex display convention.",
  }),

  // Rival Route 110 (Brendan/May) — exact team unverified in this pass.
  boss({
    id: 'rival-route-110-rse',
    name: 'Rival 2 (Route 110)',
    category: 'rival',
    location: 'Route 110',
    order: 15,
    levelCap: 20,
    baseTeam: [mon('Wingull', 18, ['Water', 'Flying'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Slugma', 18, ['Fire']), mon('Combusken', 20, ['Fire', 'Fighting'])],
      fire: [mon('Numel', 18, ['Fire', 'Ground']), mon('Marshtomp', 20, ['Water', 'Ground'])],
      water: [mon('Wailmer', 18, ['Water']), mon('Grovyle', 20, ['Grass'])],
    },
    notes: "Second rival battle on Route 110 (north of Mr. Briney's cottage area). 3-mon team: Wingull Lv 18 + version-specific second mon + Stage-2 starter Lv 20 (strong-vs-player cycle). Movesets TODO.",
  }),

  // Wattson (Mauville Gym — Electric). RS = 3 mons cap 22; Emerald = 4 mons cap 24 with Manectric ace.
  boss({
    id: 'wattson-gym-r',
    name: 'Wattson',
    category: 'gym',
    game: 'Ruby',
    location: 'Mauville Gym',
    order: 16,
    levelCap: 22,
    baseTeam: [
      mon('Voltorb', 20, ['Electric']),
      mon('Magnemite', 20, ['Electric', 'Steel']),
      mon('Magneton', 22, ['Electric', 'Steel']),
    ],
    notes: 'Dynamo Badge (Electric). Ruby team. Magneton ace Lv 22. Movesets TODO.',
  }),
  boss({
    id: 'wattson-gym-s',
    name: 'Wattson',
    category: 'gym',
    game: 'Sapphire',
    location: 'Mauville Gym',
    order: 16,
    levelCap: 22,
    baseTeam: [
      mon('Voltorb', 20, ['Electric']),
      mon('Magnemite', 20, ['Electric', 'Steel']),
      mon('Magneton', 22, ['Electric', 'Steel']),
    ],
    notes: 'Dynamo Badge (Electric). Sapphire team — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'wattson-gym-e',
    name: 'Wattson',
    category: 'gym',
    game: 'Emerald',
    location: 'Mauville Gym',
    order: 16,
    levelCap: 24,
    baseTeam: [
      mon('Voltorb', 20, ['Electric']),
      mon('Electrike', 20, ['Electric']),
      mon('Magneton', 22, ['Electric', 'Steel']),
      mon('Manectric', 24, ['Electric']),
    ],
    notes: 'Dynamo Badge (Electric). Emerald upgrades to 4 mons with Manectric ace Lv 24 — significant difficulty bump vs RS. Movesets TODO.',
  }),
  // Mt. Chimney leader confrontation — version split unverified this pass.
  // In Ruby, Maxie is the antagonist trying to use the Meteorite to boost Mt. Chimney.
  // In Sapphire/Emerald, the leader confronted at the summit differs (Aqua arrives to stop
  // Magma in some configurations). Concrete per-version teams + admin (Tabitha/Matt) battles
  // are deferred until verified — see Bulbapedia trainer pages before populating.
  boss({
    id: 'mt-chimney-leader-r',
    name: 'Maxie (Mt. Chimney)',
    category: 'evil-team',
    game: 'Ruby',
    location: 'Mt. Chimney',
    order: 18,
    levelCap: 25,
    baseTeam: [
      mon('Mightyena', 24, ['Dark']),
      mon('Zubat', 24, ['Poison', 'Flying']),
      mon('Camerupt', 25, ['Fire', 'Ground']),
    ],
    notes: 'Ruby Mt. Chimney leader fight. Camerupt ace Lv 25. Movesets TODO.',
  }),
  boss({
    id: 'mt-chimney-leader-s',
    name: 'Archie (Mt. Chimney)',
    category: 'evil-team',
    game: 'Sapphire',
    location: 'Mt. Chimney',
    order: 18,
    levelCap: 25,
    baseTeam: [
      mon('Mightyena', 24, ['Dark']),
      mon('Golbat', 24, ['Poison', 'Flying']),
      mon('Sharpedo', 25, ['Water', 'Dark']),
    ],
    notes: 'Sapphire Mt. Chimney leader fight — Archie. Sharpedo ace Lv 25 (NPC trainer bypasses Carvanha→Sharpedo Lv 30 evolution gate). Movesets TODO.',
  }),
  boss({
    id: 'mt-chimney-leader-e',
    name: 'Archie (Mt. Chimney)',
    category: 'evil-team',
    game: 'Emerald',
    location: 'Mt. Chimney',
    order: 18,
    levelCap: 25,
    baseTeam: [
      mon('Mightyena', 24, ['Dark']),
      mon('Golbat', 24, ['Poison', 'Flying']),
      mon('Sharpedo', 25, ['Water', 'Dark']),
    ],
    notes: 'Emerald Mt. Chimney leader fight — Archie attempts to weaken the volcano with the Meteorite (Kyogre plot setup). Team identical to Sapphire variant. Movesets TODO.',
  }),
  boss({
    id: 'magma-admin-tabitha-mt-chimney',
    name: 'Magma Admin Tabitha (Mt. Chimney)',
    category: 'evil-team',
    location: 'Mt. Chimney',
    order: 17,
    levelCap: 18,
    baseTeam: [
      mon('Numel', 18, ['Fire', 'Ground']),
      mon('Mightyena', 18, ['Dark']),
    ],
    notes: 'Magma Admin Tabitha guards Mt. Chimney just before the Maxie/Archie leader fight in Ruby/Emerald. 2-mon team. Movesets TODO.',
  }),

  // Flannery (Lavaridge Gym — Fire). RS = 3 mons cap 28; Emerald = 4 mons cap 29 with Camerupt added.
  boss({
    id: 'flannery-gym-r',
    name: 'Flannery',
    category: 'gym',
    game: 'Ruby',
    location: 'Lavaridge Gym',
    order: 21,
    levelCap: 28,
    baseTeam: [
      mon('Slugma', 26, ['Fire']),
      mon('Slugma', 26, ['Fire']),
      mon('Torkoal', 28, ['Fire']),
    ],
    notes: 'Heat Badge (Fire). Ruby team. Torkoal ace Lv 28 — Overheat/Attract threat. Movesets TODO.',
  }),
  boss({
    id: 'flannery-gym-s',
    name: 'Flannery',
    category: 'gym',
    game: 'Sapphire',
    location: 'Lavaridge Gym',
    order: 21,
    levelCap: 28,
    baseTeam: [
      mon('Slugma', 26, ['Fire']),
      mon('Slugma', 26, ['Fire']),
      mon('Torkoal', 28, ['Fire']),
    ],
    notes: 'Heat Badge (Fire). Sapphire team — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'flannery-gym-e',
    name: 'Flannery',
    category: 'gym',
    game: 'Emerald',
    location: 'Lavaridge Gym',
    order: 21,
    levelCap: 29,
    baseTeam: [
      mon('Numel', 24, ['Fire', 'Ground']),
      mon('Slugma', 26, ['Fire']),
      mon('Camerupt', 26, ['Fire', 'Ground']),
      mon('Torkoal', 29, ['Fire']),
    ],
    notes: 'Heat Badge (Fire). Emerald expands to 4 mons (adds Numel + Camerupt; Torkoal ace bumped to Lv 29). Significant difficulty bump vs RS. Movesets TODO.',
  }),
  // Rival Route 119 (Brendan/May) — third rival battle, on the rain-soaked north stretch.
  boss({
    id: 'rival-route-119-rse',
    name: 'Rival 3 (Route 119)',
    category: 'rival',
    location: 'Route 119',
    order: 22,
    levelCap: null,
    baseTeam: [],
    variantsByRivalStarterChoice: {
      grass: [],
      fire: [],
      water: [],
    },
    notes: 'Third rival battle on Route 119, blocking the path to Fortree. TODO: verify version-specific teams — known to include the rival\'s Stage-2 starter (~Lv 25) plus supporting Pokémon (Wingull / Magcargo / Tropius / Wailmer variants by version).',
  }),

  // Weather Institute admin — Magma Courtney (Ruby) / Aqua Shelly (Sapphire + Emerald).
  boss({
    id: 'magma-courtney-weather-r',
    name: 'Magma Admin Courtney (Weather Institute)',
    category: 'evil-team',
    game: 'Ruby',
    location: 'Weather Institute',
    order: 23,
    levelCap: 28,
    baseTeam: [
      mon('Numel', 28, ['Fire', 'Ground']),
      mon('Numel', 28, ['Fire', 'Ground']),
    ],
    notes: 'Ruby Weather Institute admin — Courtney. Canonical double-Numel team at Lv 28. Movesets TODO.',
  }),
  boss({
    id: 'aqua-shelly-weather-s',
    name: 'Aqua Admin Shelly (Weather Institute)',
    category: 'evil-team',
    game: 'Sapphire',
    location: 'Weather Institute',
    order: 23,
    levelCap: 28,
    baseTeam: [
      mon('Carvanha', 28, ['Water', 'Dark']),
      mon('Carvanha', 28, ['Water', 'Dark']),
    ],
    notes: 'Sapphire Weather Institute admin — Shelly. Mirrors Ruby Courtney structure (2 mons same species same level). Movesets TODO.',
  }),
  boss({
    id: 'aqua-shelly-weather-e',
    name: 'Aqua Admin Shelly (Weather Institute)',
    category: 'evil-team',
    game: 'Emerald',
    location: 'Weather Institute',
    order: 23,
    levelCap: 28,
    baseTeam: [
      mon('Carvanha', 28, ['Water', 'Dark']),
      mon('Carvanha', 28, ['Water', 'Dark']),
    ],
    notes: 'Emerald Weather Institute admin — Shelly. Defeat triggers Castform gift. Team identical to Sapphire variant. Movesets TODO.',
  }),

  // Norman (Petalburg Gym — Normal). RS = 4-mon cap 31. Emerald team differs — skeleton.
  boss({
    id: 'norman-gym-r',
    name: 'Norman',
    category: 'gym',
    game: 'Ruby',
    location: 'Petalburg Gym',
    order: 26,
    levelCap: 31,
    baseTeam: [
      mon('Spinda', 27, ['Normal']),
      mon('Vigoroth', 27, ['Normal']),
      mon('Linoone', 29, ['Normal']),
      mon('Slaking', 31, ['Normal']),
    ],
    notes: 'Balance Badge (Normal). Father gym leader. Slaking ace Lv 31 — Slack Off + Facade threat. Ruby team. Movesets TODO.',
  }),
  boss({
    id: 'norman-gym-s',
    name: 'Norman',
    category: 'gym',
    game: 'Sapphire',
    location: 'Petalburg Gym',
    order: 26,
    levelCap: 31,
    baseTeam: [
      mon('Spinda', 27, ['Normal']),
      mon('Vigoroth', 27, ['Normal']),
      mon('Linoone', 29, ['Normal']),
      mon('Slaking', 31, ['Normal']),
    ],
    notes: 'Balance Badge (Normal). Sapphire team — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'norman-gym-e',
    name: 'Norman',
    category: 'gym',
    game: 'Emerald',
    location: 'Petalburg Gym',
    order: 26,
    levelCap: 31,
    baseTeam: [
      mon('Slaking', 28, ['Normal']),
      mon('Vigoroth', 30, ['Normal']),
      mon('Linoone', 31, ['Normal']),
      mon('Slaking', 31, ['Normal']),
    ],
    notes: 'Balance Badge (Normal). Emerald lineup swaps Spinda → second Slaking and bumps levels; Linoone holds Persim Berry in Emerald. Movesets TODO — verify Emerald team before committing as final.',
  }),

  // Winona (Fortree Gym — Flying). RS = 4-mon cap 33. Emerald = 5-mon cap 33.
  boss({
    id: 'winona-gym-r',
    name: 'Winona',
    category: 'gym',
    game: 'Ruby',
    location: 'Fortree Gym',
    order: 31,
    levelCap: 33,
    baseTeam: [
      mon('Swellow', 29, ['Normal', 'Flying']),
      mon('Pelipper', 30, ['Water', 'Flying']),
      mon('Skarmory', 31, ['Steel', 'Flying']),
      mon('Altaria', 33, ['Dragon', 'Flying']),
    ],
    notes: 'Feather Badge (Flying). Ruby team. Altaria ace Lv 33 — Dragon Dance + Aerial Ace threat. Movesets TODO.',
  }),
  boss({
    id: 'winona-gym-s',
    name: 'Winona',
    category: 'gym',
    game: 'Sapphire',
    location: 'Fortree Gym',
    order: 31,
    levelCap: 33,
    baseTeam: [
      mon('Swellow', 29, ['Normal', 'Flying']),
      mon('Pelipper', 30, ['Water', 'Flying']),
      mon('Skarmory', 31, ['Steel', 'Flying']),
      mon('Altaria', 33, ['Dragon', 'Flying']),
    ],
    notes: 'Feather Badge (Flying). Sapphire team — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'winona-gym-e',
    name: 'Winona',
    category: 'gym',
    game: 'Emerald',
    location: 'Fortree Gym',
    order: 31,
    levelCap: 33,
    baseTeam: [
      mon('Swablu', 29, ['Normal', 'Flying']),
      mon('Tropius', 29, ['Grass', 'Flying']),
      mon('Pelipper', 30, ['Water', 'Flying']),
      mon('Skarmory', 32, ['Steel', 'Flying']),
      mon('Altaria', 33, ['Dragon', 'Flying']),
    ],
    notes: 'Feather Badge (Flying). Emerald expands to 5-mon team (Swablu + Tropius added, swaps Swellow → Swablu evolution-baby). Altaria ace Lv 33. Movesets TODO.',
  }),
  // Tate & Liza (Mossdeep Gym — Psychic, double battle). RS = 2-mon pair; Emerald = 4-mon double.
  boss({
    id: 'tate-liza-gym-r',
    name: 'Tate & Liza',
    category: 'gym',
    game: 'Ruby',
    location: 'Mossdeep Gym',
    order: 36,
    levelCap: 42,
    baseTeam: [
      mon('Solrock', 42, ['Rock', 'Psychic']),
      mon('Lunatone', 42, ['Rock', 'Psychic']),
    ],
    notes: "Mind Badge (Psychic). Ruby double battle — Solrock + Lunatone Lv 42. Sun Stone / Moon Stone given on win. Movesets TODO.",
  }),
  boss({
    id: 'tate-liza-gym-s',
    name: 'Tate & Liza',
    category: 'gym',
    game: 'Sapphire',
    location: 'Mossdeep Gym',
    order: 36,
    levelCap: 42,
    baseTeam: [
      mon('Solrock', 42, ['Rock', 'Psychic']),
      mon('Lunatone', 42, ['Rock', 'Psychic']),
    ],
    notes: 'Mind Badge (Psychic). Sapphire double battle — identical to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'tate-liza-gym-e',
    name: 'Tate & Liza',
    category: 'gym',
    game: 'Emerald',
    location: 'Mossdeep Gym',
    order: 36,
    levelCap: 42,
    baseTeam: [
      mon('Claydol', 41, ['Ground', 'Psychic']),
      mon('Xatu', 41, ['Psychic', 'Flying']),
      mon('Lunatone', 42, ['Rock', 'Psychic']),
      mon('Solrock', 42, ['Rock', 'Psychic']),
    ],
    notes: 'Mind Badge (Psychic). Emerald upgrades to a 4-mon double battle (Claydol + Xatu added). Significant difficulty bump vs RS. Movesets TODO.',
  }),

  // Maxie / Archie Seafloor Cavern leader fight — version split; exact teams unverified this pass.
  boss({
    id: 'maxie-seafloor-r',
    name: 'Maxie (Seafloor Cavern)',
    category: 'evil-team',
    game: 'Ruby',
    location: 'Seafloor Cavern',
    order: 45,
    levelCap: 39,
    baseTeam: [
      mon('Mightyena', 37, ['Dark']),
      mon('Crobat', 38, ['Poison', 'Flying']),
      mon('Camerupt', 39, ['Fire', 'Ground']),
    ],
    notes: 'Ruby Seafloor Cavern leader fight before Groudon awakening. Camerupt ace Lv 39 — Earthquake / Take Down / Rock Slide / Amnesia. Movesets TODO.',
  }),
  boss({
    id: 'archie-seafloor-s',
    name: 'Archie (Seafloor Cavern)',
    category: 'evil-team',
    game: 'Sapphire',
    location: 'Seafloor Cavern',
    order: 45,
    levelCap: 43,
    baseTeam: [
      mon('Mightyena', 41, ['Dark']),
      mon('Crobat', 41, ['Poison', 'Flying']),
      mon('Sharpedo', 43, ['Water', 'Dark']),
    ],
    notes: 'Sapphire Seafloor Cavern leader fight before Kyogre awakening. Sharpedo ace Lv 43 — Crunch / Surf / Slash / Swagger. Movesets TODO.',
  }),
  boss({
    id: 'archie-seafloor-e',
    name: 'Archie (Seafloor Cavern)',
    category: 'evil-team',
    game: 'Emerald',
    location: 'Seafloor Cavern',
    order: 45,
    levelCap: 43,
    baseTeam: [
      mon('Mightyena', 41, ['Dark']),
      mon('Crobat', 41, ['Poison', 'Flying']),
      mon('Sharpedo', 43, ['Water', 'Dark']),
    ],
    notes: 'Emerald Seafloor Cavern — Archie awakens Kyogre. Same canonical 3-mon roster as Sapphire variant. Movesets TODO. Maxie + Magma Hideout (Jagged Pass) battle in Emerald is a separate fight tracked elsewhere.',
  }),
  // ====================================================================================
  // Sootopolis Gym — Wallace (RS) vs Juan (Emerald).
  // ====================================================================================
  boss({
    id: 'wallace-gym-r',
    name: 'Wallace',
    category: 'gym',
    game: 'Ruby',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: 43,
    baseTeam: [
      mon('Luvdisc', 40, ['Water']),
      mon('Whiscash', 40, ['Water', 'Ground']),
      mon('Sealeo', 42, ['Ice', 'Water']),
      mon('Seaking', 42, ['Water']),
      mon('Milotic', 43, ['Water']),
    ],
    notes: 'Rain Badge (Water). Ruby 8th gym leader. Milotic ace Lv 43 — Marvel Scale / Recover / Surf threat. Movesets TODO.',
  }),
  boss({
    id: 'wallace-gym-s',
    name: 'Wallace',
    category: 'gym',
    game: 'Sapphire',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: 43,
    baseTeam: [
      mon('Luvdisc', 40, ['Water']),
      mon('Whiscash', 40, ['Water', 'Ground']),
      mon('Sealeo', 42, ['Ice', 'Water']),
      mon('Seaking', 42, ['Water']),
      mon('Milotic', 43, ['Water']),
    ],
    notes: 'Rain Badge (Water). Sapphire team — identical to Ruby. Wallace becomes Emerald Champion instead. Movesets TODO.',
  }),
  boss({
    id: 'juan-gym-e',
    name: 'Juan',
    category: 'gym',
    game: 'Emerald',
    location: 'Sootopolis Gym',
    order: 41,
    levelCap: 46,
    baseTeam: [
      mon('Luvdisc', 41, ['Water']),
      mon('Whiscash', 41, ['Water', 'Ground']),
      mon('Sealeo', 43, ['Ice', 'Water']),
      mon('Crawdaunt', 43, ['Water', 'Dark']),
      mon('Kingdra', 46, ['Water', 'Dragon']),
    ],
    notes: 'Rain Badge (Water). Emerald-only — replaces Wallace as 8th gym leader (Wallace becomes Emerald Champion). Kingdra ace Lv 46 — Double Team + Rest threat. Movesets TODO.',
  }),

  // ====================================================================================
  // Elite Four — RS and Emerald teams are largely identical; Sidney has one Crawdaunt→Sharpedo
  // swap in some references. Modeled as 'Both' where teams match.
  // ====================================================================================
  boss({
    id: 'sidney-e4',
    name: 'Sidney',
    category: 'elite-four',
    location: 'Pokémon League',
    order: 50,
    levelCap: 49,
    baseTeam: [
      mon('Mightyena', 46, ['Dark']),
      mon('Shiftry', 48, ['Grass', 'Dark']),
      mon('Cacturne', 46, ['Grass', 'Dark']),
      mon('Crawdaunt', 48, ['Water', 'Dark']),
      mon('Absol', 49, ['Dark']),
    ],
    notes: 'Dark specialist. Absol ace Lv 49 — Slash / Future Sight / Rock Slide / Aerial Ace. Movesets TODO.',
  }),
  boss({
    id: 'phoebe-e4',
    name: 'Phoebe',
    category: 'elite-four',
    location: 'Pokémon League',
    order: 51,
    levelCap: 51,
    baseTeam: [
      mon('Dusclops', 48, ['Ghost']),
      mon('Banette', 49, ['Ghost']),
      mon('Sableye', 50, ['Dark', 'Ghost']),
      mon('Banette', 49, ['Ghost']),
      mon('Dusclops', 51, ['Ghost']),
    ],
    notes: 'Ghost specialist. Dusclops ace Lv 51 — Earthquake / Rock Tomb / Curse / Confuse Ray. Movesets TODO.',
  }),
  boss({
    id: 'glacia-e4',
    name: 'Glacia',
    category: 'elite-four',
    location: 'Pokémon League',
    order: 52,
    levelCap: 53,
    baseTeam: [
      mon('Sealeo', 50, ['Ice', 'Water']),
      mon('Sealeo', 52, ['Ice', 'Water']),
      mon('Glalie', 50, ['Ice']),
      mon('Glalie', 52, ['Ice']),
      mon('Walrein', 53, ['Ice', 'Water']),
    ],
    notes: 'Ice specialist. Walrein ace Lv 53 — Surf / Body Slam / Ice Beam / Sheer Cold. Movesets TODO.',
  }),
  boss({
    id: 'drake-e4',
    name: 'Drake',
    category: 'elite-four',
    location: 'Pokémon League',
    order: 53,
    levelCap: 55,
    baseTeam: [
      mon('Shelgon', 52, ['Dragon']),
      mon('Altaria', 54, ['Dragon', 'Flying']),
      mon('Flygon', 53, ['Ground', 'Dragon']),
      mon('Flygon', 53, ['Ground', 'Dragon']),
      mon('Salamence', 55, ['Dragon', 'Flying']),
    ],
    notes: 'Dragon specialist. Salamence ace Lv 55 — Protect / Dragon Claw / Fly / Crunch. Movesets TODO.',
  }),

  // Wally — final battle at Victory Road just before the League.
  boss({
    id: 'wally-victory-road',
    name: 'Wally (Victory Road)',
    category: 'rival',
    location: 'Victory Road',
    order: 49,
    levelCap: 45,
    baseTeam: [
      mon('Altaria', 44, ['Dragon', 'Flying']),
      mon('Magneton', 41, ['Electric', 'Steel']),
      mon('Roselia', 44, ['Grass', 'Poison']),
      mon('Delcatty', 43, ['Normal']),
      mon('Gardevoir', 45, ['Psychic', 'Fairy']),
    ],
    notes: "Wally's final pre-League battle. Gardevoir ace Lv 45 — Psychic / Calm Mind / Future Sight / Double Team. Movesets TODO.",
  }),

  // ====================================================================================
  // Champion — Steven (Ruby/Sapphire) vs Wallace (Emerald, replacing Steven).
  // ====================================================================================
  boss({
    id: 'champion-steven-r',
    name: 'Champion Steven',
    category: 'champion',
    game: 'Ruby',
    location: 'Pokémon League',
    order: 54,
    levelCap: 58,
    baseTeam: [
      mon('Skarmory', 57, ['Steel', 'Flying']),
      mon('Claydol', 55, ['Ground', 'Psychic']),
      mon('Aggron', 56, ['Steel', 'Rock']),
      mon('Cradily', 56, ['Rock', 'Grass']),
      mon('Armaldo', 56, ['Rock', 'Bug']),
      mon('Metagross', 58, ['Steel', 'Psychic']),
    ],
    notes: 'Ruby Champion. Metagross ace Lv 58 — Meteor Mash / Psychic / Earthquake / Sitrus Berry. Steel-themed roster. Movesets TODO.',
  }),
  boss({
    id: 'champion-steven-s',
    name: 'Champion Steven',
    category: 'champion',
    game: 'Sapphire',
    location: 'Pokémon League',
    order: 54,
    levelCap: 58,
    baseTeam: [
      mon('Skarmory', 57, ['Steel', 'Flying']),
      mon('Claydol', 55, ['Ground', 'Psychic']),
      mon('Aggron', 56, ['Steel', 'Rock']),
      mon('Cradily', 56, ['Rock', 'Grass']),
      mon('Armaldo', 56, ['Rock', 'Bug']),
      mon('Metagross', 58, ['Steel', 'Psychic']),
    ],
    notes: 'Sapphire Champion — identical team to Ruby. Movesets TODO.',
  }),
  boss({
    id: 'champion-wallace-e',
    name: 'Champion Wallace',
    category: 'champion',
    game: 'Emerald',
    location: 'Pokémon League',
    order: 54,
    levelCap: 58,
    baseTeam: [
      mon('Wailord', 57, ['Water']),
      mon('Tentacruel', 55, ['Water', 'Poison']),
      mon('Ludicolo', 56, ['Water', 'Grass']),
      mon('Whiscash', 56, ['Water', 'Ground']),
      mon('Gyarados', 56, ['Water', 'Flying']),
      mon('Milotic', 58, ['Water']),
    ],
    notes: 'Emerald Champion (replaces Steven, who moves to Meteor Falls postgame). Pure Water roster with Milotic Lv 58 ace — Recover / Ice Beam / Surf / Mirror Coat. Movesets TODO.',
  }),
  boss({
    id: 'postgame-steven-meteor-falls-e',
    name: 'Steven (Meteor Falls)',
    category: 'boss',
    game: 'Emerald',
    location: 'Meteor Falls',
    order: 99,
    levelCap: 78,
    baseTeam: [
      mon('Skarmory', 77, ['Steel', 'Flying']),
      mon('Claydol', 75, ['Ground', 'Psychic']),
      mon('Aggron', 76, ['Steel', 'Rock']),
      mon('Cradily', 76, ['Rock', 'Grass']),
      mon('Armaldo', 76, ['Rock', 'Bug']),
      mon('Metagross', 78, ['Steel', 'Psychic']),
    ],
    notes: 'Emerald postgame multi-battle vs Steven in Meteor Falls (Lv 77-78). Same composition as his Ruby/Sapphire Champion team, +20 levels. Movesets TODO.',
  }),
];

export function getRseBossesForGame(gameVersion: GameVersion): BossTrainer[] {
  return rseBosses.filter((b) => b.game === 'Both' || b.game === gameVersion);
}
