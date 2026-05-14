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
  location('xy-lumiose-city', 'Lumiose City', 10, ['city', 'gym', 'boss-area']),
  location('xy-route-5', 'Route 5', 11, ['route']),
  location('xy-camphrier-town', 'Camphrier Town', 12, ['town']),
  location('xy-route-6', 'Route 6', 13, ['route']),
  location('xy-parfum-palace', 'Parfum Palace', 14, ['area']),
  location('xy-route-7', 'Route 7', 15, ['route']),
  location('xy-connecting-cave', 'Connecting Cave', 16, ['cave']),
  location('xy-route-8', 'Route 8', 17, ['route']),
  location('xy-ambrette-town', 'Ambrette Town', 18, ['town']),
  location('xy-glittering-cave', 'Glittering Cave', 19, ['cave']),
  location('xy-route-9', 'Route 9', 20, ['route']),
  location('xy-cyllage-city', 'Cyllage City', 21, ['city', 'gym', 'boss-area']),
  location('xy-route-10', 'Route 10', 22, ['route']),
  location('xy-geosenge-town', 'Geosenge Town', 23, ['town']),
  location('xy-route-11', 'Route 11', 24, ['route']),
  location('xy-reflection-cave', 'Reflection Cave', 25, ['cave']),
  location('xy-shalour-city', 'Shalour City', 26, ['city', 'gym', 'boss-area']),
  location('xy-tower-of-mastery', 'Tower of Mastery', 27, ['tower', 'boss-area']),
  location('xy-route-12', 'Route 12', 28, ['route']),
  location('xy-coumarine-city', 'Coumarine City', 29, ['city', 'gym', 'boss-area']),
  location('xy-azure-bay', 'Azure Bay', 30, ['area']),
  location('xy-route-13', 'Route 13', 31, ['route']),
  location('xy-kalos-power-plant', 'Kalos Power Plant', 32, ['dungeon', 'boss-area']),
  location('xy-route-14', 'Route 14', 33, ['route']),
  location('xy-laverre-city', 'Laverre City', 34, ['city', 'gym', 'boss-area']),
  location('xy-poke-ball-factory', 'Poké Ball Factory', 35, ['dungeon', 'boss-area']),
  location('xy-route-15', 'Route 15', 36, ['route']),
  location('xy-lost-hotel', 'Lost Hotel', 37, ['dungeon']),
  location('xy-route-16', 'Route 16', 38, ['route']),
  location('xy-dendemille-town', 'Dendemille Town', 39, ['town']),
  location('xy-frost-cavern', 'Frost Cavern', 40, ['cave']),
  location('xy-route-17', 'Route 17', 41, ['route']),
  location('xy-anistar-city', 'Anistar City', 42, ['city', 'gym', 'boss-area']),
  location('xy-lysandre-labs', 'Lysandre Labs', 43, ['dungeon', 'boss-area']),
  location('xy-team-flare-secret-hq', 'Team Flare Secret HQ', 44, ['dungeon', 'boss-area']),
  location('xy-route-18', 'Route 18', 45, ['route']),
  location('xy-terminus-cave', 'Terminus Cave', 46, ['cave', 'boss-area']),
  location('xy-couriway-town', 'Couriway Town', 47, ['town']),
  location('xy-route-19', 'Route 19', 48, ['route']),
  location('xy-snowbelle-city', 'Snowbelle City', 49, ['city', 'gym', 'boss-area']),
  location('xy-route-20', 'Route 20', 50, ['route', 'forest']),
  location('xy-pokemon-village', 'Pokémon Village', 51, ['area', 'forest']),
  location('xy-route-21', 'Route 21', 52, ['route']),
  location('xy-victory-road', 'Victory Road', 53, ['cave', 'boss-area']),
  location('xy-pokemon-league', 'Pokémon League', 54, ['boss-area']),
];
