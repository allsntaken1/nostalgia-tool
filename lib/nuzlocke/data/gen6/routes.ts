export type XyRouteTag =
  | 'town'
  | 'city'
  | 'route'
  | 'cave'
  | 'forest'
  | 'dungeon'
  | 'area'
  | 'gym'
  | 'boss-area'
  | 'bridge'
  | 'tower'
  | 'optional'
  | 'postgame'
  | 'starter';

export type XyLocation = {
  id: string;
  displayName: string;
  order: number;
  region: 'kalos';
  gameSet: 'xy';
  tags: XyRouteTag[];
  notes?: string[];
};

const location = (id: string, displayName: string, order: number, tags: XyRouteTag[], notes?: string[]): XyLocation => ({
  id,
  displayName,
  order,
  region: 'kalos',
  gameSet: 'xy',
  tags,
  ...(notes ? { notes } : {}),
});

const todo = 'TODO: Populate X/Y encounters.';

export const xyLocations: XyLocation[] = [
  location('xy-vaniville-town', 'Vaniville Town', 1, ['town', 'starter']),
  location('xy-route-1', 'Route 1', 2, ['route']),
  location('xy-aquacorde-town', 'Aquacorde Town', 3, ['town', 'starter']),
  location('xy-route-2', 'Route 2', 4, ['route']),
  location('xy-santalune-forest', 'Santalune Forest', 5, ['forest']),
  location('xy-route-3', 'Route 3', 6, ['route']),
  location('xy-santalune-city', 'Santalune City', 7, ['city', 'gym', 'boss-area']),
  location('xy-route-22', 'Route 22', 8, ['route']),
  location('xy-route-4', 'Route 4', 9, ['route']),
  location('xy-lumiose-city', 'Lumiose City', 10, ['city', 'boss-area']),
  location('xy-route-5', 'Route 5', 11, ['route']),
  location('xy-camphrier-town', 'Camphrier Town', 12, ['town']),
  location('xy-route-6', 'Route 6', 13, ['route']),
  location('xy-parfum-palace', 'Parfum Palace', 14, ['area']),
  location('xy-route-7', 'Route 7', 15, ['route']),
  location('xy-connecting-cave', 'Connecting Cave', 16, ['cave']),
  location('xy-cyllage-city', 'Cyllage City', 17, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-route-8', 'Route 8', 18, ['route']),
  location('xy-ambrette-town', 'Ambrette Town', 19, ['town']),
  location('xy-glittering-cave', 'Glittering Cave', 20, ['cave']),
  location('xy-route-9', 'Route 9', 21, ['route']),
  location('xy-shalour-city', 'Shalour City', 22, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-tower-of-mastery', 'Tower of Mastery', 23, ['tower', 'boss-area'], [todo]),
  location('xy-route-10', 'Route 10', 24, ['route'], [todo]),
  location('xy-geosenge-town', 'Geosenge Town', 25, ['town'], [todo]),
  location('xy-route-11', 'Route 11', 26, ['route'], [todo]),
  location('xy-route-12', 'Route 12', 27, ['route'], [todo]),
  location('xy-azure-bay', 'Azure Bay', 28, ['area'], [todo]),
  location('xy-coumarine-city', 'Coumarine City', 29, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-route-13', 'Route 13', 30, ['route'], [todo]),
  location('xy-laverre-city', 'Laverre City', 31, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-poke-ball-factory', 'Poké Ball Factory', 32, ['dungeon', 'boss-area'], [todo]),
  location('xy-route-14', 'Route 14', 33, ['route'], [todo]),
  location('xy-route-15', 'Route 15', 34, ['route'], [todo]),
  location('xy-route-16', 'Route 16', 35, ['route'], [todo]),
  location('xy-dendemille-town', 'Dendemille Town', 36, ['town'], [todo]),
  location('xy-frost-cavern', 'Frost Cavern', 37, ['cave'], [todo]),
  location('xy-route-17', 'Route 17', 38, ['route'], [todo]),
  location('xy-anistar-city', 'Anistar City', 39, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-route-18', 'Route 18', 40, ['route'], [todo]),
  location('xy-couriway-town', 'Couriway Town', 41, ['town'], [todo]),
  location('xy-route-19', 'Route 19', 42, ['route'], [todo]),
  location('xy-snowbelle-city', 'Snowbelle City', 43, ['city', 'gym', 'boss-area'], [todo]),
  location('xy-pokemon-village', 'Pokémon Village', 44, ['area'], [todo]),
  location('xy-route-20', 'Route 20', 45, ['route'], [todo]),
  location('xy-victory-road', 'Victory Road', 46, ['cave', 'boss-area'], [todo]),
  location('xy-pokemon-league', 'Pokémon League', 47, ['boss-area'], [todo]),
];
