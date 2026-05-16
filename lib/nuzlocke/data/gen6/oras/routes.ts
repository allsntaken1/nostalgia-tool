export type OrasRouteTag =
  | 'town'
  | 'city'
  | 'route'
  | 'cave'
  | 'forest'
  | 'dungeon'
  | 'area'
  | 'gym'
  | 'boss-area'
  | 'tower'
  | 'optional'
  | 'postgame'
  | 'starter';

export type OrasLocation = {
  id: string;
  displayName: string;
  order: number;
  region: 'hoenn';
  gameSet: 'oras';
  tags: OrasRouteTag[];
  notes?: string[];
};

const location = (id: string, displayName: string, order: number, tags: OrasRouteTag[], notes?: string[]): OrasLocation => ({
  id,
  displayName,
  order,
  region: 'hoenn',
  gameSet: 'oras',
  tags,
  ...(notes ? { notes } : {}),
});

export const orasLocations: OrasLocation[] = [
  location('oras-littleroot-town', 'Littleroot Town', 1, ['town', 'starter']),
  location('oras-route-101', 'Route 101', 2, ['route']),
  location('oras-oldale-town', 'Oldale Town', 3, ['town']),
  location('oras-route-103', 'Route 103', 4, ['route', 'boss-area']),
  location('oras-route-102', 'Route 102', 5, ['route']),
  location('oras-petalburg-city', 'Petalburg City', 6, ['city', 'gym', 'boss-area']),
  location('oras-route-104', 'Route 104', 7, ['route']),
  location('oras-petalburg-woods', 'Petalburg Woods', 8, ['forest']),
  location('oras-rustboro-city', 'Rustboro City', 9, ['city', 'gym', 'boss-area']),
  location('oras-route-116', 'Route 116', 10, ['route']),
  location('oras-rusturf-tunnel', 'Rusturf Tunnel', 11, ['cave']),
  location('oras-dewford-town', 'Dewford Town', 12, ['town', 'gym', 'boss-area']),
  location('oras-route-106', 'Route 106', 13, ['route']),
  location('oras-granite-cave', 'Granite Cave', 14, ['cave']),
  location('oras-route-109', 'Route 109', 15, ['route']),
  location('oras-slateport-city', 'Slateport City', 16, ['city', 'boss-area']),
  location('oras-route-110', 'Route 110', 17, ['route', 'boss-area']),
  location('oras-mauville-city', 'Mauville City', 18, ['city', 'gym', 'boss-area']),
  location('oras-route-117', 'Route 117', 19, ['route']),
  location('oras-verdanturf-town', 'Verdanturf Town', 20, ['town']),
  location('oras-route-111', 'Route 111', 21, ['route']),
  location('oras-route-112', 'Route 112', 22, ['route']),
  location('oras-fiery-path', 'Fiery Path', 23, ['cave']),
  location('oras-route-113', 'Route 113', 24, ['route']),
  location('oras-fallarbor-town', 'Fallarbor Town', 25, ['town']),
  location('oras-route-114', 'Route 114', 26, ['route']),
  location('oras-meteor-falls', 'Meteor Falls', 27, ['cave', 'boss-area']),
  location('oras-route-115', 'Route 115', 28, ['route']),
  location('oras-mt-chimney', 'Mt. Chimney', 29, ['area', 'boss-area']),
  location('oras-jagged-pass', 'Jagged Pass', 30, ['route']),
  location('oras-lavaridge-town', 'Lavaridge Town', 31, ['town', 'gym', 'boss-area']),
  location('oras-route-118', 'Route 118', 32, ['route']),
  location('oras-route-119', 'Route 119', 33, ['route']),
  location('oras-weather-institute', 'Weather Institute', 34, ['boss-area']),
  location('oras-fortree-city', 'Fortree City', 35, ['city', 'gym', 'boss-area']),
  location('oras-route-120', 'Route 120', 36, ['route']),
  location('oras-route-121', 'Route 121', 37, ['route']),
  location('oras-lilycove-city', 'Lilycove City', 38, ['city', 'boss-area']),
  location('oras-mt-pyre', 'Mt. Pyre', 39, ['area', 'boss-area']),
  location('oras-route-122', 'Route 122', 40, ['route']),
  location('oras-route-123', 'Route 123', 41, ['route']),
  location('oras-team-magma-hideout', 'Team Magma Hideout', 42, ['dungeon', 'boss-area']),
  location('oras-team-aqua-hideout', 'Team Aqua Hideout', 43, ['dungeon', 'boss-area']),
  location('oras-route-124', 'Route 124', 44, ['route']),
  location('oras-mossdeep-city', 'Mossdeep City', 45, ['city', 'gym', 'boss-area']),
  location('oras-route-125', 'Route 125', 46, ['route']),
  location('oras-shoal-cave', 'Shoal Cave', 47, ['cave']),
  location('oras-route-127', 'Route 127', 48, ['route']),
  location('oras-route-128', 'Route 128', 49, ['route']),
  location('oras-seafloor-cavern', 'Seafloor Cavern', 50, ['cave', 'boss-area']),
  location('oras-sootopolis-city', 'Sootopolis City', 51, ['city', 'gym', 'boss-area']),
  location('oras-cave-of-origin', 'Cave of Origin', 52, ['cave', 'boss-area']),
  location('oras-route-126', 'Route 126', 53, ['route']),
  location('oras-route-129', 'Route 129', 54, ['route']),
  location('oras-route-130', 'Route 130', 55, ['route']),
  location('oras-route-131', 'Route 131', 56, ['route']),
  location('oras-pacifidlog-town', 'Pacifidlog Town', 57, ['town']),
  location('oras-route-132', 'Route 132', 58, ['route']),
  location('oras-route-133', 'Route 133', 59, ['route']),
  location('oras-route-134', 'Route 134', 60, ['route']),
  location('oras-ever-grande-city', 'Ever Grande City', 61, ['city']),
  location('oras-victory-road', 'Victory Road', 62, ['cave', 'boss-area']),
  location('oras-pokemon-league', 'Pokemon League', 63, ['boss-area']),
  location('oras-sky-pillar', 'Sky Pillar', 64, ['tower', 'optional', 'postgame']),
];
