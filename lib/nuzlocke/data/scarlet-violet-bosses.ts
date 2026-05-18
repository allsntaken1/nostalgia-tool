import type { GameVersion, NuzlockeBoss, NuzlockeBossPokemon, PokemonType } from '@/app/nuzlocke/types';

export type CuratedBossPokemon = {
  species: string;
  level: number;
  types: PokemonType[];
  ability?: string;
  moves?: string[];
  teraType?: PokemonType;
  notes?: string;
};

export type CuratedBoss = {
  id: string;
  name: string;
  category: string;
  game: 'Scarlet' | 'Violet' | 'Both';
  location: string;
  recommendedOrder: number;
  levelCap: number;
  team: CuratedBossPokemon[];
};

const bossPokemon = (member: CuratedBossPokemon): NuzlockeBossPokemon => ({
  species: member.species,
  level: member.level,
  ability: member.ability ?? '',
  item: '',
  nature: '',
  notes: member.notes,
  teraType: member.teraType,
  types: member.types,
  moves: (member.moves || []).map((name) => ({ name, type: member.teraType ?? member.types[0] ?? 'Normal', power: null })),
});

export const scarletVioletBosses: CuratedBoss[] = [
  {
    id: 'katy',
    name: 'Katy',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Cortondo',
    recommendedOrder: 1,
    levelCap: 15,
    team: [
      { species: 'Nymble', level: 14, types: ['Bug'] },
      { species: 'Tarountula', level: 14, types: ['Bug'] },
      { species: 'Teddiursa', level: 15, types: ['Normal'], teraType: 'Bug' },
    ],
  },
  {
    id: 'klawf',
    name: 'Stony Cliff Titan',
    category: 'Path of Legends Titan',
    game: 'Both',
    location: 'South Province Area Three',
    recommendedOrder: 2,
    levelCap: 16,
    team: [{ species: 'Klawf', level: 16, types: ['Rock'] }],
  },
  {
    id: 'brassius',
    name: 'Brassius',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Artazon',
    recommendedOrder: 3,
    levelCap: 17,
    team: [
      { species: 'Petilil', level: 16, types: ['Grass'] },
      { species: 'Smoliv', level: 16, types: ['Grass', 'Normal'] },
      { species: 'Sudowoodo', level: 17, types: ['Rock'], teraType: 'Grass' },
    ],
  },
  {
    id: 'bombirdier',
    name: 'Open Sky Titan',
    category: 'Path of Legends Titan',
    game: 'Both',
    location: 'West Province Area One',
    recommendedOrder: 4,
    levelCap: 20,
    team: [{ species: 'Bombirdier', level: 20, types: ['Flying', 'Dark'] }],
  },
  {
    id: 'giacomo',
    name: 'Giacomo',
    category: 'Starfall Street Base',
    game: 'Both',
    location: 'West Province Area One',
    recommendedOrder: 5,
    levelCap: 21,
    team: [
      { species: 'Pawniard', level: 21, types: ['Dark', 'Steel'] },
      { species: 'Segin Starmobile', level: 20, types: ['Dark'], notes: 'Team Star Starmobile' },
    ],
  },
  {
    id: 'iono',
    name: 'Iono',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Levincia',
    recommendedOrder: 6,
    levelCap: 24,
    team: [
      { species: 'Wattrel', level: 23, types: ['Electric', 'Flying'] },
      { species: 'Bellibolt', level: 23, types: ['Electric'] },
      { species: 'Luxio', level: 23, types: ['Electric'] },
      { species: 'Mismagius', level: 24, types: ['Ghost'], teraType: 'Electric' },
    ],
  },
  {
    id: 'mela',
    name: 'Mela',
    category: 'Starfall Street Base',
    game: 'Both',
    location: 'East Province Area One',
    recommendedOrder: 7,
    levelCap: 27,
    team: [
      { species: 'Torkoal', level: 27, types: ['Fire'] },
      { species: 'Schedar Starmobile', level: 26, types: ['Fire'], notes: 'Team Star Starmobile' },
    ],
  },
  {
    id: 'orthworm',
    name: 'Lurking Steel Titan',
    category: 'Path of Legends Titan',
    game: 'Both',
    location: 'East Province Area Three',
    recommendedOrder: 8,
    levelCap: 29,
    team: [{ species: 'Orthworm', level: 29, types: ['Steel'] }],
  },
  {
    id: 'kofu',
    name: 'Kofu',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Cascarrafa',
    recommendedOrder: 9,
    levelCap: 30,
    team: [
      { species: 'Veluza', level: 29, types: ['Water', 'Psychic'] },
      { species: 'Wugtrio', level: 29, types: ['Water'] },
      { species: 'Crabominable', level: 30, types: ['Fighting', 'Ice'], teraType: 'Water' },
    ],
  },
  {
    id: 'atticus',
    name: 'Atticus',
    category: 'Starfall Street Base',
    game: 'Both',
    location: 'Tagtree Thicket',
    recommendedOrder: 10,
    levelCap: 33,
    team: [
      { species: 'Skuntank', level: 32, types: ['Poison', 'Dark'] },
      { species: 'Muk', level: 32, types: ['Poison'] },
      { species: 'Revavroom', level: 33, types: ['Steel', 'Poison'] },
      { species: 'Navi Starmobile', level: 32, types: ['Poison'], notes: 'Team Star Starmobile' },
    ],
  },
  {
    id: 'larry',
    name: 'Larry',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Medali',
    recommendedOrder: 11,
    levelCap: 36,
    team: [
      { species: 'Komala', level: 35, types: ['Normal'] },
      { species: 'Dudunsparce', level: 35, types: ['Normal'] },
      { species: 'Staraptor', level: 36, types: ['Normal', 'Flying'], teraType: 'Normal' },
    ],
  },
  {
    id: 'ryme',
    name: 'Ryme',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Montenevera',
    recommendedOrder: 12,
    levelCap: 42,
    team: [
      { species: 'Mimikyu', level: 41, types: ['Ghost', 'Fairy'] },
      { species: 'Banette', level: 41, types: ['Ghost'] },
      { species: 'Houndstone', level: 41, types: ['Ghost'] },
      { species: 'Toxtricity', level: 42, types: ['Electric', 'Poison'], teraType: 'Ghost' },
    ],
  },
  {
    id: 'great-tusk-iron-treads',
    name: 'Quaking Earth Titan',
    category: 'Path of Legends Titan',
    game: 'Both',
    location: 'Asado Desert',
    recommendedOrder: 13,
    levelCap: 45,
    team: [{ species: 'Great Tusk / Iron Treads', level: 45, types: ['Ground'], notes: 'Great Tusk in Scarlet, Iron Treads in Violet.' }],
  },
  {
    id: 'tulip',
    name: 'Tulip',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Alfornada',
    recommendedOrder: 14,
    levelCap: 45,
    team: [
      { species: 'Farigiraf', level: 44, types: ['Normal', 'Psychic'] },
      { species: 'Gardevoir', level: 44, types: ['Psychic', 'Fairy'] },
      { species: 'Espathra', level: 44, types: ['Psychic'] },
      { species: 'Florges', level: 45, types: ['Fairy'], teraType: 'Psychic' },
    ],
  },
  {
    id: 'grusha',
    name: 'Grusha',
    category: 'Victory Road Gym',
    game: 'Both',
    location: 'Glaseado Mountain',
    recommendedOrder: 15,
    levelCap: 48,
    team: [
      { species: 'Frosmoth', level: 47, types: ['Ice', 'Bug'] },
      { species: 'Beartic', level: 47, types: ['Ice'] },
      { species: 'Cetitan', level: 47, types: ['Ice'] },
      { species: 'Altaria', level: 48, types: ['Dragon', 'Flying'], teraType: 'Ice' },
    ],
  },
  {
    id: 'ortega',
    name: 'Ortega',
    category: 'Starfall Street Base',
    game: 'Both',
    location: 'North Province Area Three',
    recommendedOrder: 16,
    levelCap: 51,
    team: [
      { species: 'Azumarill', level: 50, types: ['Water', 'Fairy'] },
      { species: 'Wigglytuff', level: 50, types: ['Normal', 'Fairy'] },
      { species: 'Dachsbun', level: 51, types: ['Fairy'] },
      { species: 'Ruchbah Starmobile', level: 50, types: ['Fairy'], notes: 'Team Star Starmobile' },
    ],
  },
  {
    id: 'eri',
    name: 'Eri',
    category: 'Starfall Street Base',
    game: 'Both',
    location: 'North Province Area One',
    recommendedOrder: 17,
    levelCap: 56,
    team: [
      { species: 'Toxicroak', level: 55, types: ['Poison', 'Fighting'] },
      { species: 'Passimian', level: 55, types: ['Fighting'] },
      { species: 'Lucario', level: 55, types: ['Fighting', 'Steel'] },
      { species: 'Annihilape', level: 56, types: ['Fighting', 'Ghost'] },
      { species: 'Caph Starmobile', level: 56, types: ['Fighting'], notes: 'Team Star Starmobile' },
    ],
  },
  {
    id: 'tatsugiri',
    name: 'False Dragon Titan',
    category: 'Path of Legends Titan',
    game: 'Both',
    location: 'Casseroya Lake',
    recommendedOrder: 18,
    levelCap: 57,
    team: [
      { species: 'Dondozo', level: 56, types: ['Water'] },
      { species: 'Tatsugiri', level: 57, types: ['Dragon', 'Water'] },
    ],
  },
  {
    id: 'rika',
    name: 'Rika',
    category: 'Pokemon League Elite Four',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 19,
    levelCap: 58,
    team: [
      { species: 'Whiscash', level: 57, types: ['Water', 'Ground'] },
      { species: 'Camerupt', level: 57, types: ['Fire', 'Ground'] },
      { species: 'Donphan', level: 57, types: ['Ground'] },
      { species: 'Dugtrio', level: 57, types: ['Ground'] },
      { species: 'Clodsire', level: 58, types: ['Poison', 'Ground'], teraType: 'Ground' },
    ],
  },
  {
    id: 'poppy',
    name: 'Poppy',
    category: 'Pokemon League Elite Four',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 20,
    levelCap: 59,
    team: [
      { species: 'Copperajah', level: 58, types: ['Steel'] },
      { species: 'Magnezone', level: 58, types: ['Electric', 'Steel'] },
      { species: 'Bronzong', level: 58, types: ['Steel', 'Psychic'] },
      { species: 'Corviknight', level: 58, types: ['Flying', 'Steel'] },
      { species: 'Tinkaton', level: 59, types: ['Fairy', 'Steel'], teraType: 'Steel' },
    ],
  },
  {
    id: 'larry-e4',
    name: 'Larry',
    category: 'Pokemon League Elite Four',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 21,
    levelCap: 60,
    team: [
      { species: 'Tropius', level: 59, types: ['Grass', 'Flying'] },
      { species: 'Oricorio', level: 59, types: ['Electric', 'Flying'] },
      { species: 'Altaria', level: 59, types: ['Dragon', 'Flying'] },
      { species: 'Staraptor', level: 59, types: ['Normal', 'Flying'] },
      { species: 'Flamigo', level: 60, types: ['Flying', 'Fighting'], teraType: 'Flying' },
    ],
  },
  {
    id: 'hassel',
    name: 'Hassel',
    category: 'Pokemon League Elite Four',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 22,
    levelCap: 61,
    team: [
      { species: 'Noivern', level: 60, types: ['Flying', 'Dragon'] },
      { species: 'Haxorus', level: 60, types: ['Dragon'] },
      { species: 'Dragalge', level: 60, types: ['Poison', 'Dragon'] },
      { species: 'Flapple', level: 60, types: ['Grass', 'Dragon'] },
      { species: 'Baxcalibur', level: 61, types: ['Dragon', 'Ice'], teraType: 'Dragon' },
    ],
  },
  {
    id: 'champion-geeta',
    name: 'Champion Geeta',
    category: 'Pokemon League',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 23,
    levelCap: 62,
    team: [
      { species: 'Espathra', level: 61, types: ['Psychic'] },
      { species: 'Gogoat', level: 61, types: ['Grass'] },
      { species: 'Veluza', level: 61, types: ['Water', 'Psychic'] },
      { species: 'Avalugg', level: 61, types: ['Ice'] },
      { species: 'Kingambit', level: 61, types: ['Dark', 'Steel'] },
      { species: 'Glimmora', level: 62, types: ['Rock', 'Poison'], teraType: 'Rock' },
    ],
  },
  {
    id: 'penny',
    name: 'Penny (Cassiopeia)',
    category: 'Starfall Street Finale',
    game: 'Both',
    location: 'Academy Schoolyard',
    recommendedOrder: 24,
    levelCap: 63,
    team: [
      { species: 'Umbreon', level: 62, types: ['Dark'] },
      { species: 'Vaporeon', level: 62, types: ['Water'] },
      { species: 'Jolteon', level: 62, types: ['Electric'] },
      { species: 'Flareon', level: 62, types: ['Fire'] },
      { species: 'Leafeon', level: 62, types: ['Grass'] },
      { species: 'Sylveon', level: 63, types: ['Fairy'], teraType: 'Fairy' },
    ],
  },
  {
    id: 'rival-nemona-final',
    name: 'Nemona (Champion-rank challenge)',
    category: 'Rival Final',
    game: 'Both',
    location: 'Poco Path Lighthouse',
    recommendedOrder: 28,
    levelCap: 66,
    team: [
      { species: 'Lycanroc (Midday)', level: 65, types: ['Rock'], ability: 'Sand Rush', moves: ['Accelerock', 'Drill Run', 'Stone Edge', 'Stealth Rock'] },
      { species: 'Goodra', level: 65, types: ['Dragon'], ability: 'Sap Sipper', moves: ['Dragon Pulse', 'Muddy Water', 'Ice Beam', 'Sludge Bomb'] },
      { species: 'Dudunsparce', level: 65, types: ['Normal'], ability: 'Serene Grace', moves: ['Hyper Drill', 'Drill Run', 'Dragon Rush', 'Coil'] },
      { species: 'Orthworm', level: 65, types: ['Steel'], ability: 'Earth Eater', moves: ['Iron Tail', 'Body Press', 'Earthquake', 'Rock Blast'] },
      { species: 'Pawmot', level: 65, types: ['Electric', 'Fighting'], ability: 'Volt Absorb', moves: ['Double Shock', 'Close Combat', 'Ice Punch', 'Quick Attack'] },
      {
        species: 'Starter ace (Meowscarada / Skeledirge / Quaquaval)',
        level: 66,
        types: ['Normal'],
        notes:
          "Nemona's starter is weak vs the player's starter. Player Sprigatito → Quaquaval (Water, Tera Water, Aqua Step / Brick Break / Aerial Ace / Ice Spinner). Player Fuecoco → Meowscarada (Grass, Tera Grass, Flower Trick / Thunder Punch / Shadow Claw / Play Rough). Player Quaxly → Skeledirge (Fire, Tera Fire, Torch Song / Earth Power / Shadow Ball / Snarl).",
      },
    ],
  },
  // ====================================================================================
  // Nemona — earlier canonical rival battles. Her starter is one rotation weak vs player's:
  //   Player Sprigatito → Nemona Quaxly line
  //   Player Fuecoco   → Nemona Sprigatito line
  //   Player Quaxly    → Nemona Fuecoco line
  // ====================================================================================
  {
    id: 'rival-nemona-1-cabo-poco',
    name: 'Nemona (Cabo Poco)',
    category: 'Rival',
    game: 'Both',
    location: 'Cabo Poco',
    recommendedOrder: 0,
    levelCap: 5,
    team: [
      {
        species: 'Starter (Sprigatito / Fuecoco / Quaxly)',
        level: 5,
        types: ['Normal'],
        notes:
          "Opening tutorial battle right after receiving your starter. Nemona uses the starter weak to yours: player Sprigatito → Nemona Quaxly; player Fuecoco → Nemona Sprigatito; player Quaxly → Nemona Fuecoco. Moves are the starter's default Lv 5 set.",
      },
    ],
  },
  {
    id: 'rival-nemona-2-inlet-grotto',
    name: 'Nemona (Inlet Grotto)',
    category: 'Rival',
    game: 'Both',
    location: 'South Province (Area One)',
    recommendedOrder: 1,
    levelCap: 9,
    team: [
      { species: 'Pawmi', level: 8, types: ['Electric'], ability: 'Static', moves: ['Thunder Shock'], notes: 'Remaining moves not surfaced — TODO.' },
      {
        species: 'Starter Stage 1 (Floragato / Crocalor / Quaxwell)',
        level: 9,
        types: ['Normal'],
        notes:
          "Starter follows the cycle: player Sprigatito → Quaxwell; player Fuecoco → Floragato; player Quaxly → Crocalor. Movesets vary by species; full sets TODO.",
      },
    ],
  },
  {
    id: 'rival-nemona-3-post-3rd-gym',
    name: 'Nemona (Western Province crossroads)',
    category: 'Rival',
    game: 'Both',
    location: 'West Province (Area One)',
    recommendedOrder: 7,
    levelCap: 22,
    team: [
      { species: 'Rockruff', level: 21, types: ['Rock'], ability: 'Vital Spirit', moves: ['Double Team', 'Rock Throw', 'Howl', 'Bite'] },
      { species: 'Pawmi', level: 21, types: ['Electric'], ability: 'Static', moves: ['Charge', 'Nuzzle', 'Dig', 'Bite'] },
      {
        species: 'Starter Stage 2 (Floragato / Crocalor / Quaxwell)',
        level: 22,
        types: ['Normal'],
        notes:
          "Tera matches the starter's primary type. Movesets vary (e.g. Quaxwell: Double Hit / Water Pulse / Wing Attack / Work Up).",
      },
    ],
  },
  {
    id: 'rival-nemona-4-post-5th-gym',
    name: 'Nemona (mid-game challenge)',
    category: 'Rival',
    game: 'Both',
    location: 'Casseroya area',
    recommendedOrder: 12,
    levelCap: 37,
    team: [
      { species: 'Lycanroc (Midday)', level: 36, types: ['Rock'], ability: 'Sand Rush', notes: 'Moves not surfaced — TODO.' },
      { species: 'Goomy', level: 36, types: ['Dragon'], ability: 'Sap Sipper', notes: 'Moves not surfaced — TODO.' },
      { species: 'Pawmo', level: 36, types: ['Electric', 'Fighting'], ability: 'Volt Absorb', notes: 'Moves not surfaced — TODO.' },
      {
        species: 'Starter final stage (Meowscarada / Skeledirge / Quaquaval)',
        level: 37,
        types: ['Normal'],
        notes: "Tera matches starter's primary type. Movesets TODO.",
      },
    ],
  },
  {
    id: 'rival-nemona-5-post-7th-gym',
    name: 'Nemona (late-game challenge)',
    category: 'Rival',
    game: 'Both',
    location: 'Glaseado Mountain area',
    recommendedOrder: 15,
    levelCap: 43,
    team: [
      { species: 'Lycanroc (Midday)', level: 42, types: ['Rock'], ability: 'Sand Rush', notes: 'Moves not surfaced — TODO.' },
      { species: 'Sliggoo', level: 42, types: ['Dragon'], ability: 'Sap Sipper', notes: 'Moves not surfaced — TODO.' },
      { species: 'Pawmot', level: 42, types: ['Electric', 'Fighting'], ability: 'Volt Absorb', notes: 'Moves not surfaced — TODO.' },
      {
        species: 'Starter final stage (Meowscarada / Skeledirge / Quaquaval)',
        level: 43,
        types: ['Normal'],
        notes: "Tera matches starter's primary type. Movesets TODO.",
      },
    ],
  },
  // ====================================================================================
  // Arven — Poco Path tutorial battle + Path of Legends lighthouse finale.
  // ====================================================================================
  {
    id: 'arven-1-poco-path',
    name: 'Arven (Poco Path opening)',
    category: 'Story Boss',
    game: 'Both',
    location: 'Poco Path',
    recommendedOrder: 2,
    levelCap: 5,
    team: [
      { species: 'Skwovet', level: 5, types: ['Normal'], ability: 'Cheek Pouch', moves: ['Tackle', 'Tail Whip', 'Bite'], notes: 'Fourth move not surfaced — TODO.' },
    ],
  },
  {
    id: 'arven-lighthouse-finale',
    name: 'Arven (Path of Legends finale)',
    category: 'Path of Legends Finale',
    game: 'Both',
    location: 'Poco Path Lighthouse',
    recommendedOrder: 24,
    levelCap: 63,
    team: [
      { species: 'Greedent', level: 58, types: ['Normal'], ability: 'Cheek Pouch', moves: ['Bullet Seed', 'Body Slam', 'Psychic Fangs', 'Earthquake'] },
      { species: 'Cloyster', level: 59, types: ['Water', 'Ice'], ability: 'Skill Link', moves: ['Rock Blast', 'Icicle Spear', 'Liquidation', 'Light Screen'] },
      { species: 'Scovillain', level: 60, types: ['Grass', 'Fire'], ability: 'Chlorophyll', moves: ['Fire Blast', 'Energy Ball', 'Zen Headbutt', 'Crunch'] },
      { species: 'Toedscruel', level: 61, types: ['Ground', 'Grass'], ability: 'Mycelium Might', moves: ['Power Whip', 'Earth Power', 'Spore', 'Sludge Bomb'] },
      { species: 'Garganacl', level: 62, types: ['Rock'], ability: 'Purifying Salt', moves: ['Stone Edge', 'Earthquake', 'Body Press', 'Stealth Rock'] },
      {
        species: 'Mabosstiff',
        level: 63,
        types: ['Dark'],
        ability: 'Intimidate',
        teraType: 'Rock',
        moves: ['Crunch', 'Psychic Fangs', 'Fire Fang', 'Play Rough'],
        notes: 'Tera Type unverified between research source and common reference (research said Dark; community references commonly list Rock). Marked Tera Rock here — verify against cartridge if a discrepancy is reported.',
      },
    ],
  },
  // ====================================================================================
  // Area Zero finale — Professor Sada (Scarlet) / Professor Turo (Violet) Paradox lineup,
  // followed by the Paradise Protection Protocol battle vs Guardian Koraidon/Miraidon.
  // All six Paradox mons are caught in Master Balls (cannot be re-fought).
  // ====================================================================================
  {
    id: 'sada-zero-lab',
    name: 'Professor Sada (Zero Lab)',
    category: 'Area Zero Finale',
    game: 'Scarlet',
    location: 'Zero Lab',
    recommendedOrder: 26,
    levelCap: 67,
    team: [
      { species: 'Slither Wing', level: 66, types: ['Bug', 'Fighting'], ability: 'Protosynthesis', moves: ['Lunge', 'Leech Life', 'Low Sweep', 'Zen Headbutt'] },
      { species: 'Scream Tail', level: 66, types: ['Fairy', 'Psychic'], ability: 'Protosynthesis', moves: ['Play Rough', 'Drain Punch', 'Ice Punch', 'Zen Headbutt'] },
      { species: 'Brute Bonnet', level: 66, types: ['Grass', 'Dark'], ability: 'Protosynthesis', moves: ['Earth Power', 'Giga Drain', 'Payback', 'Sucker Punch'] },
      { species: 'Flutter Mane', level: 66, types: ['Ghost', 'Fairy'], ability: 'Protosynthesis', moves: ['Power Gem', 'Mystical Fire', 'Shadow Ball', 'Thunderbolt'] },
      { species: 'Sandy Shocks', level: 66, types: ['Electric', 'Ground'], ability: 'Protosynthesis', moves: ['Discharge', 'Earth Power', 'Flash Cannon', 'Power Gem'] },
      {
        species: 'Roaring Moon',
        level: 67,
        types: ['Dragon', 'Dark'],
        ability: 'Protosynthesis',
        moves: ['Dragon Claw', 'Night Slash', 'Stone Edge', 'Earthquake'],
        notes: 'Holds Booster Energy. Tera Type not surfaced in research — verify.',
      },
    ],
  },
  {
    id: 'turo-zero-lab',
    name: 'Professor Turo (Zero Lab)',
    category: 'Area Zero Finale',
    game: 'Violet',
    location: 'Zero Lab',
    recommendedOrder: 26,
    levelCap: 67,
    team: [
      { species: 'Iron Moth', level: 66, types: ['Fire', 'Poison'], ability: 'Quark Drive', moves: ['Sludge Wave', 'Fiery Dance', 'Discharge', 'Air Slash'] },
      { species: 'Iron Bundle', level: 66, types: ['Ice', 'Water'], ability: 'Quark Drive', moves: ['Drill Peck', 'Water Pulse', 'Freeze-Dry', 'Snowscape'] },
      { species: 'Iron Hands', level: 66, types: ['Fighting', 'Electric'], ability: 'Quark Drive', moves: ['Thunder Punch', 'Drain Punch', 'Iron Head', 'Fake Out'] },
      { species: 'Iron Jugulis', level: 66, types: ['Dark', 'Flying'], ability: 'Quark Drive', moves: ['Air Slash', 'Dark Pulse', 'Flamethrower', 'Flash Cannon'] },
      { species: 'Iron Thorns', level: 66, types: ['Rock', 'Electric'], ability: 'Quark Drive', moves: ['Thunder Punch', 'Brick Break', 'Stone Edge', 'Earthquake'] },
      {
        species: 'Iron Valiant',
        level: 67,
        types: ['Fairy', 'Fighting'],
        ability: 'Quark Drive',
        moves: ['Psycho Cut', 'Brick Break', 'Spirit Break', 'Poison Jab'],
        notes: 'Holds Booster Energy. Tera Type not surfaced in research — verify.',
      },
    ],
  },
  {
    id: 'guardian-koraidon',
    name: 'Guardian of Paradise (Koraidon)',
    category: 'Paradise Protection Protocol',
    game: 'Scarlet',
    location: 'Great Crater of Paldea',
    recommendedOrder: 27,
    levelCap: 72,
    team: [
      {
        species: 'Koraidon',
        level: 72,
        types: ['Fighting', 'Dragon'],
        ability: 'Orichalcum Pulse',
        notes: 'Final boss — player rides their own Koraidon vs Guardian Koraidon. Moves not surfaced in research — TODO.',
      },
    ],
  },
  {
    id: 'guardian-miraidon',
    name: 'Guardian of Paradise (Miraidon)',
    category: 'Paradise Protection Protocol',
    game: 'Violet',
    location: 'Great Crater of Paldea',
    recommendedOrder: 27,
    levelCap: 72,
    team: [
      {
        species: 'Miraidon',
        level: 72,
        types: ['Electric', 'Dragon'],
        ability: 'Hadron Engine',
        moves: ['Hyper Beam', 'Charge', 'Taunt', 'Power Gem'],
        notes: 'Holds Terrain Extender. Final boss — player rides their own Miraidon vs Guardian Miraidon.',
      },
    ],
  },
];

export function getScarletVioletBosses(gameVersion: GameVersion): NuzlockeBoss[] {
  return scarletVioletBosses
    .filter((boss) => boss.game === 'Both' || boss.game === gameVersion)
    .sort((a, b) => a.recommendedOrder - b.recommendedOrder)
    .map((boss) => ({
      id: boss.id,
      name: boss.name,
      category: `${boss.category} / ${boss.location}`,
      levelCap: boss.levelCap,
      completed: false,
      notes: '',
      deaths: 0,
      pokemon: boss.team.map(bossPokemon),
    }));
}
