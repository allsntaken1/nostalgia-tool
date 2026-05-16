import type { NuzlockeBoss, NuzlockeBossPokemon, NuzlockeMove, PokemonType, StarterChoice } from '@/app/nuzlocke/types';
import { normalizeStarterChoice } from '@/lib/nuzlocke/starter';

export type B2W2BossVersion = 'Black 2' | 'White 2' | 'Both';

export type B2W2Boss = {
  id: string;
  name: string;
  locationId: string;
  location: string;
  category: string;
  game: B2W2BossVersion;
  levelCap: number | null;
  team: NuzlockeBossPokemon[];
  variantsByPlayerStarterChoice?: Partial<Record<StarterChoice, NuzlockeBossPokemon[]>>;
  notes: string[];
};

const TODO_NOTE = 'TODO: Populate canonical Black 2 / White 2 boss data.';

const move = (name: string, type: PokemonType, power: number | null = null): NuzlockeMove => ({ name, type, power });

const pokemon = (
  species: string,
  level: number,
  types: PokemonType[],
  ability?: string,
  moves?: NuzlockeMove[],
  item?: string,
): NuzlockeBossPokemon => ({
  species,
  level,
  types,
  nature: '',
  ability: ability ?? '',
  item: item ?? '',
  moves: moves ?? [],
});

const boss = ({
  id,
  name,
  locationId,
  location,
  category,
  levelCap = null,
  team = [],
  variantsByPlayerStarterChoice,
  notes = [TODO_NOTE],
  game = 'Both',
}: {
  id: string;
  name: string;
  locationId: string;
  location: string;
  category: string;
  levelCap?: number | null;
  team?: NuzlockeBossPokemon[];
  variantsByPlayerStarterChoice?: B2W2Boss['variantsByPlayerStarterChoice'];
  notes?: string[];
  game?: B2W2BossVersion;
}): B2W2Boss => ({
  id,
  name,
  locationId,
  location,
  category,
  game,
  levelCap,
  team,
  ...(variantsByPlayerStarterChoice ? { variantsByPlayerStarterChoice } : {}),
  notes,
});

const hughStarterVariants = (level: number): Record<StarterChoice, NuzlockeBossPokemon[]> => ({
  grass: [
    pokemon('Tepig', level, ['Fire'], 'Blaze', [
      move('Tackle', 'Normal', 50),
      move('Tail Whip', 'Normal'),
    ]),
  ],
  fire: [
    pokemon('Oshawott', level, ['Water'], 'Torrent', [
      move('Tackle', 'Normal', 50),
      move('Tail Whip', 'Normal'),
    ]),
  ],
  water: [
    pokemon('Snivy', level, ['Grass'], 'Overgrow', [
      move('Tackle', 'Normal', 50),
      move('Leer', 'Normal'),
    ]),
  ],
});

const pwtHughVariants = (): Record<StarterChoice, NuzlockeBossPokemon[]> => ({
  grass: [
    pokemon('Pignite', 25, ['Fire', 'Fighting'], 'Blaze'),
    pokemon('Simipour', 25, ['Water'], 'Gluttony'),
    pokemon('Tranquill', 25, ['Normal', 'Flying'], 'Super Luck'),
  ],
  fire: [
    pokemon('Dewott', 25, ['Water'], 'Torrent'),
    pokemon('Simisage', 25, ['Grass'], 'Gluttony'),
    pokemon('Tranquill', 25, ['Normal', 'Flying'], 'Super Luck'),
  ],
  water: [
    pokemon('Servine', 25, ['Grass'], 'Overgrow'),
    pokemon('Simisear', 25, ['Fire'], 'Gluttony'),
    pokemon('Tranquill', 25, ['Normal', 'Flying'], 'Super Luck'),
  ],
});

const undellaHughVariants = (): Record<StarterChoice, NuzlockeBossPokemon[]> => ({
  grass: [
    pokemon('Pignite', 41, ['Fire', 'Fighting']),
    pokemon('Simipour', 39, ['Water']),
  ],
  fire: [
    pokemon('Dewott', 41, ['Water']),
    pokemon('Simisage', 39, ['Grass']),
  ],
  water: [
    pokemon('Servine', 41, ['Grass']),
    pokemon('Simisear', 39, ['Fire']),
  ],
});

const lateHughVariants = (starterLevel: number, monkeyLevel: number): Record<StarterChoice, NuzlockeBossPokemon[]> => ({
  grass: [
    pokemon(starterLevel >= 57 ? 'Emboar' : 'Pignite', starterLevel, ['Fire', 'Fighting']),
    pokemon('Simipour', monkeyLevel, ['Water']),
  ],
  fire: [
    pokemon(starterLevel >= 57 ? 'Samurott' : 'Dewott', starterLevel, ['Water']),
    pokemon('Simisage', monkeyLevel, ['Grass']),
  ],
  water: [
    pokemon(starterLevel >= 57 ? 'Serperior' : 'Servine', starterLevel, ['Grass']),
    pokemon('Simisear', monkeyLevel, ['Fire']),
  ],
});

export const b2w2Bosses: B2W2Boss[] = [
  boss({
    id: 'b2w2-hugh-aspertia',
    name: 'Hugh',
    locationId: 'aspertia-city',
    location: 'Aspertia City',
    category: 'rival',
    levelCap: 5,
    variantsByPlayerStarterChoice: hughStarterVariants(5),
    notes: ['First Hugh battle. Hugh uses the starter strong against the player: grass -> Tepig, fire -> Oshawott, water -> Snivy.'],
  }),
  boss({
    id: 'b2w2-hugh-floccesy-ranch',
    name: 'Hugh',
    locationId: 'floccesy-ranch',
    location: 'Floccesy Ranch',
    category: 'rival',
    levelCap: 8,
    variantsByPlayerStarterChoice: hughStarterVariants(8),
    notes: ['Second Hugh battle at Floccesy Ranch. Hugh uses the starter strong against the player.'],
  }),
  boss({
    id: 'b2w2-team-plasma-floccesy-ranch',
    name: 'Team Plasma Grunt',
    locationId: 'floccesy-ranch',
    location: 'Floccesy Ranch',
    category: 'evil-team',
    levelCap: 6,
    team: [pokemon('Purrloin', 6, ['Dark'])],
    notes: ['Required Floccesy Ranch Team Plasma story fight. Moves/ability omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-cheren',
    name: 'Cheren',
    locationId: 'aspertia-city',
    location: 'Aspertia City',
    category: 'gym',
    levelCap: 13,
    team: [
      pokemon('Patrat', 11, ['Normal'], 'Keen Eye', [
        move('Work Up', 'Normal'),
        move('Tackle', 'Normal', 50),
        move('Bite', 'Dark', 60),
      ]),
      pokemon('Lillipup', 13, ['Normal'], 'Vital Spirit', [
        move('Work Up', 'Normal'),
        move('Tackle', 'Normal', 50),
        move('Bite', 'Dark', 60),
      ]),
    ],
    notes: ['Aspertia Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are not represented yet.'],
  }),
  boss({
    id: 'b2w2-roxie',
    name: 'Roxie',
    locationId: 'virbank-city',
    location: 'Virbank City',
    category: 'gym',
    levelCap: 18,
    team: [
      pokemon('Koffing', 16, ['Poison'], 'Levitate', [
        move('Assurance', 'Dark', 60),
        move('Tackle', 'Normal', 50),
        move('Smog', 'Poison', 30),
      ]),
      pokemon('Whirlipede', 18, ['Bug', 'Poison'], 'Poison Point', [
        move('Venoshock', 'Poison', 65),
        move('Protect', 'Normal'),
        move('Poison Sting', 'Poison', 15),
        move('Pursuit', 'Dark', 40),
      ]),
    ],
    notes: ['Virbank Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are not represented yet.'],
  }),
  boss({
    id: 'b2w2-burgh',
    name: 'Burgh',
    locationId: 'castelia-city',
    location: 'Castelia City',
    category: 'gym',
    levelCap: 24,
    team: [
      pokemon('Swadloon', 22, ['Bug', 'Grass']),
      pokemon('Dwebble', 22, ['Bug', 'Rock']),
      pokemon('Leavanny', 24, ['Bug', 'Grass']),
    ],
    notes: ['Castelia Gym Leader. Normal Mode team/levels are represented; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-team-plasma-castelia-sewers',
    name: 'Team Plasma Grunts',
    locationId: 'castelia-sewers',
    location: 'Castelia Sewers',
    category: 'evil-team',
    levelCap: 16,
    team: [
      pokemon('Scraggy', 16, ['Dark', 'Fighting']),
      pokemon('Sandile', 16, ['Ground', 'Dark']),
    ],
    notes: [
      'Required Castelia Sewers Multi Battle with Hugh as partner.',
      'Enemy moves/abilities TODO: cartridge verification needed.',
    ],
  }),
  boss({
    id: 'b2w2-colress-route-4',
    name: 'Colress',
    locationId: 'route-4',
    location: 'Route 4',
    category: 'boss',
    levelCap: 23,
    team: [
      pokemon('Magnemite', 21, ['Electric', 'Steel'], 'Sturdy'),
      pokemon('Klink', 23, ['Steel']),
    ],
    notes: ['Route 4 battle after Burgh. Moves/items are omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-elesa',
    name: 'Elesa',
    locationId: 'nimbasa-city',
    location: 'Nimbasa City',
    category: 'gym',
    levelCap: 30,
    team: [
      pokemon('Emolga', 28, ['Electric', 'Flying'], 'Static', [
        move('Quick Attack', 'Normal', 40),
        move('Pursuit', 'Dark', 40),
        move('Volt Switch', 'Electric', 70),
      ]),
      pokemon('Flaaffy', 28, ['Electric'], 'Static', [
        move('Thunder Wave', 'Electric'),
        move('Volt Switch', 'Electric', 70),
        move('Take Down', 'Normal', 90),
      ]),
      pokemon('Zebstrika', 30, ['Electric'], 'Motor Drive', [
        move('Flame Charge', 'Fire', 50),
        move('Pursuit', 'Dark', 40),
        move('Volt Switch', 'Electric', 70),
        move('Quick Attack', 'Normal', 40),
      ], 'Sitrus Berry'),
    ],
    notes: ['Nimbasa Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-clay',
    name: 'Clay',
    locationId: 'driftveil-city',
    location: 'Driftveil City',
    category: 'gym',
    levelCap: 33,
    team: [
      pokemon('Krokorok', 31, ['Ground', 'Dark'], 'Intimidate', [
        move('Crunch', 'Dark', 80),
        move('Sand Tomb', 'Ground', 35),
        move('Bulldoze', 'Ground', 60),
        move('Torment', 'Dark'),
      ]),
      pokemon('Sandslash', 31, ['Ground'], 'Sand Veil', [
        move('Crush Claw', 'Normal', 75),
        move('Bulldoze', 'Ground', 60),
        move('Fury Cutter', 'Bug', 40),
        move('Rollout', 'Rock', 30),
      ]),
      pokemon('Excadrill', 33, ['Ground', 'Steel'], 'Sand Force', [
        move('Slash', 'Normal', 70),
        move('Rock Slide', 'Rock', 75),
        move('Metal Claw', 'Steel', 50),
        move('Bulldoze', 'Ground', 60),
      ], 'Sitrus Berry'),
    ],
    notes: ['Driftveil Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-hugh-pwt',
    name: 'Hugh',
    locationId: 'pwt',
    location: 'PWT',
    category: 'rival',
    levelCap: 25,
    variantsByPlayerStarterChoice: pwtHughVariants(),
    notes: ['Required first-visit Driftveil Tournament battle. Hugh uses the starter strong against the player; tournament teams are fixed at level 25 for this story event.'],
  }),
  boss({
    id: 'b2w2-colress-pwt',
    name: 'Colress',
    locationId: 'pwt',
    location: 'PWT',
    category: 'boss',
    levelCap: 25,
    team: [
      pokemon('Magneton', 25, ['Electric', 'Steel']),
      pokemon('Elgyem', 25, ['Psychic']),
      pokemon('Klink', 25, ['Steel']),
    ],
    notes: ['Required first-visit Driftveil Tournament battle. Abilities/moves are omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-team-plasma-pwt',
    name: 'Team Plasma Grunts',
    locationId: 'pwt',
    location: 'PWT',
    category: 'evil-team',
    levelCap: 33,
    notes: [
      'Team Plasma interrupts immediately after the first Driftveil Tournament.',
      'TODO: Populate canonical Black 2 / White 2 early Plasma Frigate grunt data if the tracker should flatten this required story sequence.',
    ],
  }),
  boss({
    id: 'b2w2-team-plasma-plasma-frigate-pwt',
    name: 'Team Plasma Frigate',
    locationId: 'plasma-frigate',
    location: 'Plasma Frigate',
    category: 'evil-team',
    levelCap: 33,
    notes: [
      'Required Plasma Frigate boarding sequence after the PWT.',
      'TODO: Populate canonical Black 2 / White 2 grunt teams/levels for this sequence.',
    ],
  }),
  boss({
    id: 'b2w2-skyla',
    name: 'Skyla',
    locationId: 'mistralton-city',
    location: 'Mistralton City',
    category: 'gym',
    levelCap: 39,
    team: [
      pokemon('Swoobat', 37, ['Psychic', 'Flying'], 'Unaware', [
        move('Heart Stamp', 'Psychic', 60),
        move('Attract', 'Normal'),
        move('Acrobatics', 'Flying', 55),
        move('Assurance', 'Dark', 60),
      ]),
      pokemon('Skarmory', 37, ['Steel', 'Flying'], 'Sturdy', [
        move('Air Cutter', 'Flying', 60),
        move('Agility', 'Psychic'),
        move('Steel Wing', 'Steel', 70),
        move('Fury Attack', 'Normal', 15),
      ]),
      pokemon('Swanna', 39, ['Water', 'Flying'], 'Big Pecks', [
        move('FeatherDance', 'Flying'),
        move('Roost', 'Flying'),
        move('BubbleBeam', 'Water', 65),
        move('Air Slash', 'Flying', 75),
      ], 'Sitrus Berry'),
    ],
    notes: ['Mistralton Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-hugh-undella-town',
    name: 'Hugh',
    locationId: 'undella-town',
    location: 'Undella Town',
    category: 'rival',
    levelCap: 41,
    team: [pokemon('Unfezant', 39, ['Normal', 'Flying'])],
    variantsByPlayerStarterChoice: undellaHughVariants(),
    notes: ['Required Undella Town rival battle. Hugh uses the starter strong against the player; moves/abilities are omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-team-plasma-lacunosa-town',
    name: 'Zinzolin and Team Plasma Grunt',
    locationId: 'lacunosa-town',
    location: 'Lacunosa Town',
    category: 'evil-team',
    levelCap: 44,
    team: [
      pokemon('Cryogonal', 42, ['Ice'], 'Levitate', [
        move('Ice Beam', 'Ice', 90),
        move('Light Screen', 'Psychic'),
        move('Slash', 'Normal', 70),
        move('Reflect', 'Psychic'),
      ]),
      pokemon('Sneasel', 44, ['Dark', 'Ice'], 'Inner Focus', [
        move('Snatch', 'Dark'),
        move('Slash', 'Normal', 70),
        move('Punishment', 'Dark'),
        move('Screech', 'Normal'),
      ]),
      pokemon('Golbat', 39, ['Poison', 'Flying'], 'Inner Focus'),
      pokemon('Garbodor', 39, ['Poison'], 'Weak Armor'),
    ],
    notes: [
      'Required Lacunosa Town Multi Battle with Hugh as partner.',
      'Zinzolin team is represented with the accompanying Grunt Pokemon flattened into the same boss-prep entry.',
      'Grunt moves are omitted pending cartridge verification.',
    ],
  }),
  boss({
    id: 'b2w2-drayden',
    name: 'Drayden',
    locationId: 'opelucid-city',
    location: 'Opelucid City',
    category: 'gym',
    levelCap: 48,
    team: [
      pokemon('Druddigon', 46, ['Dragon'], 'Sheer Force', [
        move('Revenge', 'Fighting', 60),
        move('Crunch', 'Dark', 80),
        move('Slash', 'Normal', 70),
        move('Dragon Tail', 'Dragon', 60),
      ]),
      pokemon('Flygon', 46, ['Ground', 'Dragon'], 'Levitate', [
        move('Rock Slide', 'Rock', 75),
        move('Earth Power', 'Ground', 90),
        move('Crunch', 'Dark', 80),
        move('Dragon Tail', 'Dragon', 60),
      ]),
      pokemon('Haxorus', 48, ['Dragon'], 'Mold Breaker', [
        move('Dragon Dance', 'Dragon'),
        move('Dragon Tail', 'Dragon', 60),
        move('Slash', 'Normal', 70),
        move('Assurance', 'Dark', 60),
      ], 'Sitrus Berry'),
    ],
    notes: ['Opelucid Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-zinzolin-opelucid',
    name: 'Zinzolin',
    locationId: 'opelucid-city',
    location: 'Opelucid City',
    category: 'evil-team',
    levelCap: 48,
    team: [
      pokemon('Cryogonal', 46, ['Ice'], 'Levitate', [
        move('Slash', 'Normal', 70),
        move('Ice Beam', 'Ice', 90),
        move('Confuse Ray', 'Ghost'),
        move('Reflect', 'Psychic'),
      ]),
      pokemon('Cryogonal', 46, ['Ice'], 'Levitate', [
        move('Slash', 'Normal', 70),
        move('Ice Beam', 'Ice', 90),
        move('Confuse Ray', 'Ghost'),
        move('Light Screen', 'Psychic'),
      ]),
      pokemon('Weavile', 48, ['Dark', 'Ice'], 'Pressure', [
        move('Slash', 'Normal', 70),
        move('Metal Claw', 'Steel', 50),
        move('Night Slash', 'Dark', 70),
        move('Ice Shard', 'Ice', 40),
      ]),
    ],
    notes: ['Required Opelucid City Team Plasma fight after Drayden. Later Plasma Frigate Zinzolin fights remain separate TODO entries.'],
  }),
  boss({
    id: 'b2w2-marlon',
    name: 'Marlon',
    locationId: 'humilau-city',
    location: 'Humilau City',
    category: 'gym',
    levelCap: 51,
    team: [
      pokemon('Carracosta', 49, ['Water', 'Rock']),
      pokemon('Wailord', 49, ['Water']),
      pokemon('Jellicent', 51, ['Water', 'Ghost']),
    ],
    notes: ['Humilau Gym Leader. Normal Mode levels are used; Easy Mode and Challenge Mode variants are intentionally deferred.'],
  }),
  boss({
    id: 'b2w2-colress-plasma-frigate',
    name: 'Colress',
    locationId: 'plasma-frigate',
    location: 'Plasma Frigate',
    category: 'boss',
    levelCap: 52,
    team: [
      pokemon('Magneton', 50, ['Electric', 'Steel']),
      pokemon('Magnezone', 50, ['Electric', 'Steel']),
      pokemon('Beheeyem', 50, ['Psychic']),
      pokemon('Metang', 50, ['Steel', 'Psychic']),
      pokemon('Klinklang', 52, ['Steel']),
    ],
    notes: ['Required Plasma Frigate boss battle. Moves/abilities/items are omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-team-plasma-zinzolin',
    name: 'Zinzolin and Team Plasma Grunt',
    locationId: 'plasma-frigate',
    location: 'Plasma Frigate',
    category: 'evil-team',
    levelCap: 50,
    team: [
      pokemon('Cryogonal', 48, ['Ice'], 'Levitate'),
      pokemon('Cryogonal', 48, ['Ice'], 'Levitate'),
      pokemon('Weavile', 50, ['Dark', 'Ice'], 'Pressure'),
    ],
    notes: [
      'Required Plasma Frigate Multi Battle with Hugh as partner.',
      'Zinzolin core team is represented; accompanying Grunt Pokemon/moves TODO: cartridge verification needed.',
    ],
  }),
  boss({
    id: 'b2w2-team-plasma-shadow-triad',
    name: 'Shadow Triad',
    locationId: 'plasma-frigate',
    location: 'Plasma Frigate',
    category: 'evil-team',
    levelCap: 51,
    notes: [
      'Required Plasma Frigate Shadow Triad sequence before the Giant Chasm climax.',
      'TODO: Populate exact Shadow Triad teams/moves/abilities/items after cartridge verification.',
    ],
  }),
  boss({
    id: 'b2w2-ghetsis',
    name: 'Ghetsis',
    locationId: 'giant-chasm',
    location: 'Giant Chasm',
    category: 'evil-team',
    levelCap: 52,
    team: [
      pokemon('Cofagrigus', 50, ['Ghost']),
      pokemon('Seismitoad', 50, ['Water', 'Ground']),
      pokemon('Eelektross', 50, ['Electric']),
      pokemon('Drapion', 50, ['Poison', 'Dark']),
      pokemon('Toxicroak', 50, ['Poison', 'Fighting']),
      pokemon('Hydreigon', 52, ['Dark', 'Dragon']),
    ],
    notes: [
      'Final Team Plasma battle in Giant Chasm. Moves/abilities/items are omitted pending cartridge verification.',
      'Black Kyurem/White Kyurem is a forced story battle before Ghetsis and is not represented as a catchable encounter.',
    ],
  }),
  boss({
    id: 'b2w2-hugh-victory-road',
    name: 'Hugh',
    locationId: 'victory-road',
    location: 'Victory Road',
    category: 'rival',
    levelCap: 57,
    team: [
      pokemon('Unfezant', 55, ['Normal', 'Flying']),
      pokemon('Bouffalant', 55, ['Normal']),
      pokemon('Eelektross', 55, ['Electric']),
    ],
    variantsByPlayerStarterChoice: lateHughVariants(57, 55),
    notes: ['Victory Road rival battle. Hugh uses the starter strong against the player; moves/abilities are omitted pending cartridge verification.'],
  }),
  boss({
    id: 'b2w2-elite-four-shauntal',
    name: 'Shauntal',
    locationId: 'pokemon-league',
    location: 'Pokemon League',
    category: 'elite-four',
    levelCap: 58,
    team: [
      pokemon('Cofagrigus', 56, ['Ghost']),
      pokemon('Drifblim', 56, ['Ghost', 'Flying']),
      pokemon('Golurk', 56, ['Ground', 'Ghost']),
      pokemon('Chandelure', 58, ['Ghost', 'Fire']),
    ],
    notes: ['Initial Pokemon League Elite Four battle. Rematch and Challenge Mode teams are deferred.'],
  }),
  boss({
    id: 'b2w2-elite-four-grimsley',
    name: 'Grimsley',
    locationId: 'pokemon-league',
    location: 'Pokemon League',
    category: 'elite-four',
    levelCap: 58,
    team: [
      pokemon('Liepard', 56, ['Dark']),
      pokemon('Scrafty', 56, ['Dark', 'Fighting']),
      pokemon('Krookodile', 56, ['Ground', 'Dark']),
      pokemon('Bisharp', 58, ['Dark', 'Steel']),
    ],
    notes: ['Initial Pokemon League Elite Four battle. Rematch and Challenge Mode teams are deferred.'],
  }),
  boss({
    id: 'b2w2-elite-four-caitlin',
    name: 'Caitlin',
    locationId: 'pokemon-league',
    location: 'Pokemon League',
    category: 'elite-four',
    levelCap: 58,
    team: [
      pokemon('Musharna', 56, ['Psychic']),
      pokemon('Sigilyph', 56, ['Psychic', 'Flying']),
      pokemon('Reuniclus', 56, ['Psychic']),
      pokemon('Gothitelle', 58, ['Psychic']),
    ],
    notes: ['Initial Pokemon League Elite Four battle. Rematch and Challenge Mode teams are deferred.'],
  }),
  boss({
    id: 'b2w2-elite-four-marshal',
    name: 'Marshal',
    locationId: 'pokemon-league',
    location: 'Pokemon League',
    category: 'elite-four',
    levelCap: 58,
    team: [
      pokemon('Throh', 56, ['Fighting']),
      pokemon('Sawk', 56, ['Fighting']),
      pokemon('Mienshao', 56, ['Fighting']),
      pokemon('Conkeldurr', 58, ['Fighting']),
    ],
    notes: ['Initial Pokemon League Elite Four battle. Rematch and Challenge Mode teams are deferred.'],
  }),
  boss({
    id: 'b2w2-champion-iris',
    name: 'Iris',
    locationId: 'pokemon-league',
    location: 'Pokemon League',
    category: 'champion',
    levelCap: 59,
    team: [
      pokemon('Hydreigon', 57, ['Dark', 'Dragon']),
      pokemon('Druddigon', 57, ['Dragon']),
      pokemon('Aggron', 57, ['Steel', 'Rock']),
      pokemon('Archeops', 57, ['Rock', 'Flying']),
      pokemon('Lapras', 57, ['Water', 'Ice']),
      pokemon('Haxorus', 59, ['Dragon']),
    ],
    notes: ['Initial Champion battle. Rematch and Challenge Mode teams are deferred.'],
  }),
];

function resolveTeam(trainer: B2W2Boss, starterChoice?: StarterChoice | null) {
  const playerStarterChoice = normalizeStarterChoice(starterChoice);
  const variantTeam = playerStarterChoice && trainer.variantsByPlayerStarterChoice
    ? trainer.variantsByPlayerStarterChoice[playerStarterChoice]
    : null;

  if (Array.isArray(variantTeam) && variantTeam.length > 0) return [...trainer.team, ...variantTeam];
  return trainer.team;
}

export function getB2W2Bosses(gameVersion: 'Black 2' | 'White 2', starterChoice?: StarterChoice | null): NuzlockeBoss[] {
  return b2w2Bosses
    .filter((trainer) => trainer.game === 'Both' || trainer.game === gameVersion)
    .map((trainer) => {
      const team = resolveTeam(trainer, starterChoice);
      const needsStarterChoice = Boolean(trainer.variantsByPlayerStarterChoice) && !normalizeStarterChoice(starterChoice);
      return {
        id: trainer.id,
        name: trainer.name,
        category: trainer.category,
        levelCap: trainer.levelCap,
        completed: false,
        notes: [...trainer.notes, needsStarterChoice ? 'Choose your starter type to sync Hugh battles.' : ''].filter(Boolean).join(' '),
        deaths: 0,
        pokemon: team,
        locationId: trainer.locationId,
        location: trainer.location,
      };
    });
}
