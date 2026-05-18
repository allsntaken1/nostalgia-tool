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
    id: 'rival-nemona',
    name: 'Nemona Rival Fights',
    category: 'Rival',
    game: 'Both',
    location: 'Mesagoza',
    recommendedOrder: 25,
    levelCap: 66,
    team: [
      { species: 'Lycanroc', level: 65, types: ['Rock'] },
      { species: 'Goodra', level: 65, types: ['Dragon'] },
      { species: 'Dudunsparce', level: 65, types: ['Normal'] },
      { species: 'Orthworm', level: 65, types: ['Steel'] },
      { species: 'Pawmot', level: 65, types: ['Electric', 'Fighting'] },
      { species: 'Starter Ace', level: 66, types: ['Normal'], notes: 'Starter final evolution varies by your starter.' },
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
