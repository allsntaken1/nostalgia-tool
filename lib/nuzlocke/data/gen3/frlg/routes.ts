export type FrlgRouteTag =
  | 'town'
  | 'route'
  | 'cave'
  | 'forest'
  | 'dungeon'
  | 'gym'
  | 'boss-area'
  | 'optional'
  | 'postgame';

export type FrlgLocation = {
  id: string;
  displayName: string;
  order: number;
  region: 'kanto';
  gameSet: 'frlg';
  tags: FrlgRouteTag[];
};

const location = (id: string, displayName: string, order: number, tags: FrlgRouteTag[]): FrlgLocation => ({
  id,
  displayName,
  order,
  region: 'kanto',
  gameSet: 'frlg',
  tags,
});

export const frlgLocations: FrlgLocation[] = [
  location('pallet-town', 'Pallet Town', 1, ['town']),
  location('route-1', 'Route 1', 2, ['route']),
  location('viridian-city', 'Viridian City', 3, ['town']),
  location('route-22', 'Route 22', 4, ['route', 'boss-area']),
  location('route-2', 'Route 2', 5, ['route']),
  location('viridian-forest', 'Viridian Forest', 6, ['forest']),
  location('pewter-city', 'Pewter City', 7, ['town', 'gym', 'boss-area']),
  location('route-3', 'Route 3', 8, ['route']),
  location('mt-moon', 'Mt. Moon', 9, ['cave', 'dungeon']),
  location('route-4', 'Route 4', 10, ['route']),
  location('cerulean-city', 'Cerulean City', 11, ['town', 'gym', 'boss-area']),
  location('route-24', 'Route 24', 12, ['route']),
  location('route-25', 'Route 25', 13, ['route']),
  location('route-5', 'Route 5', 14, ['route']),
  location('route-6', 'Route 6', 15, ['route']),
  location('vermilion-city', 'Vermilion City', 16, ['town', 'gym', 'boss-area']),
  location('ss-anne', 'S.S. Anne', 17, ['dungeon', 'boss-area']),
  location('digletts-cave', "Diglett's Cave", 18, ['cave']),
  location('route-11', 'Route 11', 19, ['route']),
  location('rock-tunnel', 'Rock Tunnel', 20, ['cave', 'dungeon']),
  location('lavender-town', 'Lavender Town', 21, ['town']),
  location('route-8', 'Route 8', 22, ['route']),
  location('celadon-city', 'Celadon City', 23, ['town', 'gym', 'boss-area']),
  location('rocket-hideout', 'Rocket Hideout', 24, ['dungeon', 'boss-area']),
  location('pokemon-tower', 'Pokemon Tower', 25, ['dungeon', 'boss-area']),
  location('route-12', 'Route 12', 26, ['route']),
  location('route-13', 'Route 13', 27, ['route']),
  location('route-14', 'Route 14', 28, ['route']),
  location('route-15', 'Route 15', 29, ['route']),
  location('fuchsia-city', 'Fuchsia City', 30, ['town', 'gym', 'boss-area']),
  location('safari-zone', 'Safari Zone', 31, ['optional']),
  location('route-16', 'Route 16', 32, ['route']),
  location('route-17', 'Route 17', 33, ['route']),
  location('route-18', 'Route 18', 34, ['route']),
  location('saffron-city', 'Saffron City', 35, ['town', 'gym', 'boss-area']),
  location('silph-co', 'Silph Co.', 36, ['dungeon', 'boss-area']),
  location('route-19', 'Route 19', 37, ['route']),
  location('route-20', 'Route 20', 38, ['route']),
  location('seafoam-islands', 'Seafoam Islands', 39, ['cave', 'dungeon']),
  location('cinnabar-island', 'Cinnabar Island', 40, ['town', 'gym', 'boss-area']),
  location('pokemon-mansion', 'Pokemon Mansion', 41, ['dungeon']),
  location('route-21', 'Route 21', 42, ['route']),
  location('viridian-gym', 'Viridian Gym', 43, ['gym', 'boss-area']),
  location('victory-road', 'Victory Road', 44, ['cave', 'dungeon']),
  location('indigo-plateau', 'Indigo Plateau', 45, ['boss-area']),
  location('cerulean-cave', 'Cerulean Cave', 46, ['cave', 'optional', 'postgame']),
];
