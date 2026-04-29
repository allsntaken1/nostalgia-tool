export type PokemonChannel = {
  id: string;
  title: string;
  description: string;
  subcategories: string[];
};

export type PokemonMemory = {
  id: string;
  archiveType: 'pokemon';
  title: string;
  pokemonChannel: string;
  pokemonEra: string;
  pokemonGeneration: string;
  pokemonContext: string;
  pokemonSubcategory: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
};

export const pokemonChannels: PokemonChannel[] = [
  {
    id: 'cards',
    title: 'Cards & Collecting',
    description: 'Binders, booster packs, playground trades, card shops, promos, and collecting memories.',
    subcategories: [
      'Binder Pages',
      'Playground Trades',
      'Booster Pack Displays',
      'Card Shops',
      'Promo Events',
      'Sealed Products',
      'Schoolyard Collections',
    ],
  },
  {
    id: 'toys-merch',
    title: 'Toys & Merch',
    description: 'Plushies, Pokedex toys, fast food promos, figures, keychains, watches, and oddball merch.',
    subcategories: [
      'Plushies',
      'Electronic Pokedex Toys',
      'Fast Food Promos',
      'Figures',
      'Keychains',
      'Watches',
      'Room Decor',
    ],
  },
  {
    id: 'gaming-setups',
    title: 'Gaming Setups',
    description: 'Game Boy, Game Boy Color, link cables, Pokemon Stadium, bedroom gaming, and after-school play.',
    subcategories: [
      'Game Boy',
      'Game Boy Color',
      'Link Cable Battles',
      'N64 Pokemon Stadium',
      'Bedroom Gaming',
      'After School Gaming',
      'Handheld Accessories',
    ],
  },
  {
    id: 'stores-events',
    title: 'Stores & Events',
    description: 'Toys R Us, Walmart, Target, mall kiosks, Pokemon League, launch events, and public Pokemon spaces.',
    subcategories: [
      'Toys R Us',
      'Walmart Aisles',
      'Target Aisles',
      'Mall Kiosks',
      'Pokemon League',
      'Launch Events',
      'Store Displays',
    ],
  },
  {
    id: 'school-life',
    title: 'School Life',
    description: 'Lunch table trades, backpacks, binders, playground rumors, classroom memories, and confiscated cards.',
    subcategories: [
      'Lunch Table Trades',
      'Backpacks',
      'Playground Trades',
      'Classroom Memories',
      'Confiscated Cards',
      'School Binders',
      'Recess',
    ],
  },
  {
    id: 'media-culture',
    title: 'Media & Culture',
    description: 'TV episodes, VHS tapes, commercials, magazines, posters, and Pokemon pop culture.',
    subcategories: [
      'TV Watching',
      'VHS Tapes',
      'DVDs',
      'Commercials',
      'Magazine Pages',
      'Posters',
      'Bedroom Walls',
    ],
  },
];

export const pokemonEras = [
  'Late 90s',
  'Early 2000s',
  'Ruby/Sapphire Era',
  'Diamond/Pearl Era',
  'Black/White Era',
  'Not Sure',
];

export const pokemonGenerations = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Mixed / Not Sure'];

export const pokemonContexts = [
  'Home',
  'School',
  'Store',
  'Mall',
  'Event',
  'Vacation',
  "Friend's House",
  'Not Sure',
];

export const pokemonMockMemories: PokemonMemory[] = [
  {
    id: 'pokemon-memory-1',
    archiveType: 'pokemon',
    title: 'Binder Pages After School',
    pokemonChannel: 'cards',
    pokemonEra: 'Late 90s',
    pokemonGeneration: 'Kanto',
    pokemonContext: 'School',
    pokemonSubcategory: 'Binder Pages',
    caption: 'The lunch table economy ran on holographics and bad trades.',
    imageUrl: '',
    createdAt: '1999-ish',
  },
  {
    id: 'pokemon-memory-2',
    archiveType: 'pokemon',
    title: 'Game Boy Link Cable Night',
    pokemonChannel: 'gaming-setups',
    pokemonEra: 'Early 2000s',
    pokemonGeneration: 'Johto',
    pokemonContext: "Friend's House",
    pokemonSubcategory: 'Link Cable Battles',
    caption: 'Two Game Boys, one cable, and a room full of rumors.',
    imageUrl: '',
    createdAt: '2001-ish',
  },
  {
    id: 'pokemon-memory-3',
    archiveType: 'pokemon',
    title: 'Toy Store Pokemon Display',
    pokemonChannel: 'stores-events',
    pokemonEra: 'Late 90s',
    pokemonGeneration: 'Kanto',
    pokemonContext: 'Store',
    pokemonSubcategory: 'Store Displays',
    caption: 'That aisle glow hit different when everything had Pikachu on it.',
    imageUrl: '',
    createdAt: '1999-ish',
  },
  {
    id: 'pokemon-memory-4',
    archiveType: 'pokemon',
    title: 'Fast Food Promo Counter',
    pokemonChannel: 'toys-merch',
    pokemonEra: 'Early 2000s',
    pokemonGeneration: 'Johto',
    pokemonContext: 'Store',
    pokemonSubcategory: 'Fast Food Promos',
    caption: 'A tiny toy in a bag somehow made the whole meal feel like an event.',
    imageUrl: '',
    createdAt: '2000-ish',
  },
  {
    id: 'pokemon-memory-5',
    archiveType: 'pokemon',
    title: 'Saturday Morning VHS Stack',
    pokemonChannel: 'media-culture',
    pokemonEra: 'Late 90s',
    pokemonGeneration: 'Kanto',
    pokemonContext: 'Home',
    pokemonSubcategory: 'VHS Tapes',
    caption: 'The theme song, the orange tape labels, and a bowl of cereal before anyone else woke up.',
    imageUrl: '',
    createdAt: '1998-ish',
  },
  {
    id: 'pokemon-memory-6',
    archiveType: 'pokemon',
    title: 'Cards Hidden in a Backpack',
    pokemonChannel: 'school-life',
    pokemonEra: 'Late 90s',
    pokemonGeneration: 'Kanto',
    pokemonContext: 'School',
    pokemonSubcategory: 'Backpacks',
    caption: 'Everybody knew the rule, and everybody still brought cards anyway.',
    imageUrl: '',
    createdAt: '1999-ish',
  },
];

export function getPokemonChannel(slug: string) {
  return pokemonChannels.find((channel) => channel.id === slug);
}

export function getPokemonMemoriesByChannel(slug: string) {
  return pokemonMockMemories.filter((memory) => memory.pokemonChannel === slug);
}
