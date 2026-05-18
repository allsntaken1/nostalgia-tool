export type RseRouteTag =
  | 'town'
  | 'route'
  | 'cave'
  | 'forest'
  | 'dungeon'
  | 'gym'
  | 'boss-area'
  | 'optional'
  | 'postgame'
  | 'evil-team'
  | 'legendary'
  | 'water-route';

export type RseLocation = {
  id: string;
  displayName: string;
  order: number;
  region: 'hoenn';
  gameSet: 'rse';
  tags: RseRouteTag[];
};

const location = (id: string, displayName: string, order: number, tags: RseRouteTag[]): RseLocation => ({
  id,
  displayName,
  order,
  region: 'hoenn',
  gameSet: 'rse',
  tags,
});

// Main-story Hoenn route catalog (Ruby/Sapphire/Emerald). Population is incremental — locations
// with no encounter data yet still appear in the picker so users can log custom encounters.
export const rseLocations: RseLocation[] = [
  location('littleroot-town', 'Littleroot Town', 1, ['town']),
  location('route-101', 'Route 101', 2, ['route']),
  location('oldale-town', 'Oldale Town', 3, ['town']),
  location('route-103', 'Route 103', 4, ['route', 'boss-area']),
  location('route-102', 'Route 102', 5, ['route']),
  location('petalburg-city', 'Petalburg City', 6, ['town', 'gym']),
  location('route-104', 'Route 104', 7, ['route']),
  location('petalburg-woods', 'Petalburg Woods', 8, ['forest']),
  location('rustboro-city', 'Rustboro City', 9, ['town', 'gym', 'boss-area']),
  location('route-116', 'Route 116', 10, ['route']),
  location('rusturf-tunnel', 'Rusturf Tunnel', 11, ['cave']),
  location('dewford-town', 'Dewford Town', 12, ['town', 'gym']),
  location('route-106', 'Route 106', 13, ['water-route']),
  location('granite-cave', 'Granite Cave', 14, ['cave', 'dungeon']),
  location('route-107', 'Route 107', 15, ['water-route']),
  location('route-108', 'Route 108', 16, ['water-route']),
  location('route-109', 'Route 109', 17, ['water-route']),
  location('slateport-city', 'Slateport City', 18, ['town']),
  location('route-110', 'Route 110', 19, ['route']),
  location('mauville-city', 'Mauville City', 20, ['town', 'gym']),
  location('route-117', 'Route 117', 21, ['route']),
  location('verdanturf-town', 'Verdanturf Town', 22, ['town']),
  location('route-111', 'Route 111', 23, ['route']),
  location('route-112', 'Route 112', 24, ['route']),
  location('fiery-path', 'Fiery Path', 25, ['cave']),
  location('mt-chimney-summit', 'Mt. Chimney', 25.5, ['boss-area', 'evil-team']),
  location('route-113', 'Route 113', 26, ['route']),
  location('fallarbor-town', 'Fallarbor Town', 27, ['town']),
  location('route-114', 'Route 114', 28, ['route']),
  location('meteor-falls', 'Meteor Falls', 29, ['cave', 'legendary']),
  location('route-115', 'Route 115', 30, ['route']),
  location('jagged-pass', 'Jagged Pass', 31, ['route']),
  location('lavaridge-town', 'Lavaridge Town', 32, ['town', 'gym']),
  location('mirage-tower', 'Mirage Tower / Desert Underpass', 33, ['cave', 'optional']),
  location('route-118', 'Route 118', 34, ['route']),
  location('route-119', 'Route 119', 35, ['route', 'boss-area']),
  location('weather-institute', 'Weather Institute', 36, ['evil-team', 'boss-area']),
  location('fortree-city', 'Fortree City', 37, ['town', 'gym']),
  location('route-120', 'Route 120', 38, ['route']),
  location('route-121', 'Route 121', 39, ['route']),
  location('safari-zone', 'Safari Zone', 40, ['optional']),
  location('lilycove-city', 'Lilycove City', 41, ['town']),
  location('mt-pyre', 'Mt. Pyre', 42, ['cave', 'dungeon']),
  location('route-122', 'Route 122', 43, ['water-route']),
  location('route-123', 'Route 123', 44, ['route']),
  location('aqua-magma-hideout', 'Team Aqua / Team Magma Hideout', 45, ['evil-team', 'boss-area']),
  location('route-124', 'Route 124', 46, ['water-route']),
  location('mossdeep-city', 'Mossdeep City', 47, ['town', 'gym']),
  location('route-125', 'Route 125', 48, ['water-route']),
  location('shoal-cave', 'Shoal Cave', 49, ['cave']),
  location('route-127', 'Route 127', 50, ['water-route']),
  location('route-128', 'Route 128', 51, ['water-route']),
  location('seafloor-cavern', 'Seafloor Cavern', 52, ['cave', 'boss-area', 'evil-team']),
  location('route-126', 'Route 126', 53, ['water-route']),
  location('sootopolis-city', 'Sootopolis City', 54, ['town', 'gym', 'boss-area']),
  location('cave-of-origin', 'Cave of Origin', 55, ['cave', 'legendary']),
  location('route-129', 'Route 129', 56, ['water-route']),
  location('route-130', 'Route 130', 57, ['water-route']),
  location('route-131', 'Route 131', 58, ['water-route']),
  location('pacifidlog-town', 'Pacifidlog Town', 59, ['town']),
  location('sky-pillar', 'Sky Pillar', 60, ['cave', 'legendary', 'postgame']),
  location('sealed-chamber', 'Sealed Chamber', 60.1, ['cave', 'optional']),
  location('desert-ruins', 'Desert Ruins', 60.2, ['cave', 'legendary', 'optional']),
  location('island-cave', 'Island Cave', 60.3, ['cave', 'legendary', 'optional']),
  location('ancient-tomb', 'Ancient Tomb', 60.4, ['cave', 'legendary', 'optional']),
  location('new-mauville', 'New Mauville', 60.5, ['cave', 'optional']),
  location('abandoned-ship', 'Abandoned Ship', 60.6, ['dungeon', 'optional']),
  location('southern-island', 'Southern Island', 60.7, ['legendary', 'optional', 'postgame']),
  location('ever-grande-city', 'Ever Grande City', 61, ['town']),
  location('victory-road-hoenn', 'Victory Road', 62, ['cave', 'dungeon']),
  location('pokemon-league-hoenn', 'Pokémon League', 63, ['boss-area']),
];
