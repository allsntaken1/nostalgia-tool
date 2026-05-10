export type Gen2Location = {
  id: string;
  displayName: string;
  order: number;
  region: 'johto' | 'kanto';
  gameSet: 'gen2-johto';
  tags: string[];
};

const johtoProgression = [
  ['new-bark-town', 'New Bark Town', ['town']],
  ['route-29', 'Route 29', ['route']],
  ['cherrygrove-city', 'Cherrygrove City', ['town']],
  ['route-30', 'Route 30', ['route']],
  ['route-31', 'Route 31', ['route']],
  ['violet-city', 'Violet City', ['town', 'gym']],
  ['sprout-tower', 'Sprout Tower', ['dungeon', 'boss-area']],
  ['route-32', 'Route 32', ['route']],
  ['union-cave', 'Union Cave', ['cave']],
  ['route-33', 'Route 33', ['route']],
  ['azalea-town', 'Azalea Town', ['town', 'gym']],
  ['slowpoke-well', 'Slowpoke Well', ['cave', 'boss-area']],
  ['ilex-forest', 'Ilex Forest', ['forest']],
  ['route-34', 'Route 34', ['route']],
  ['goldenrod-city', 'Goldenrod City', ['town', 'gym']],
  ['national-park', 'National Park', ['optional']],
  ['route-35', 'Route 35', ['route']],
  ['route-36', 'Route 36', ['route']],
  ['route-37', 'Route 37', ['route']],
  ['ecruteak-city', 'Ecruteak City', ['town', 'gym']],
  ['burned-tower', 'Burned Tower', ['dungeon', 'boss-area']],
  ['route-38', 'Route 38', ['route']],
  ['route-39', 'Route 39', ['route']],
  ['olivine-city', 'Olivine City', ['town', 'gym']],
  ['route-40', 'Route 40', ['route']],
  ['route-41', 'Route 41', ['route']],
  ['cianwood-city', 'Cianwood City', ['town', 'gym']],
  ['route-42', 'Route 42', ['route']],
  ['mt-mortar', 'Mt. Mortar', ['cave']],
  ['mahogany-town', 'Mahogany Town', ['town', 'gym']],
  ['lake-of-rage', 'Lake of Rage', ['boss-area']],
  ['team-rocket-hq', 'Team Rocket HQ', ['dungeon', 'boss-area']],
  ['route-43', 'Route 43', ['route']],
  ['ice-path', 'Ice Path', ['cave']],
  ['blackthorn-city', 'Blackthorn City', ['town', 'gym']],
  ['dragons-den', "Dragon's Den", ['cave', 'boss-area']],
  ['route-45', 'Route 45', ['route']],
  ['dark-cave', 'Dark Cave', ['cave']],
  ['route-46', 'Route 46', ['route']],
  ['bell-tower', 'Tin Tower / Bell Tower', ['dungeon', 'optional']],
  ['whirl-islands', 'Whirl Islands', ['cave', 'optional']],
  ['route-27', 'Route 27', ['route']],
  ['tohjo-falls', 'Tohjo Falls', ['cave']],
  ['route-26', 'Route 26', ['route']],
  ['victory-road', 'Victory Road', ['cave', 'boss-area']],
  ['indigo-plateau', 'Indigo Plateau', ['boss-area']],
] as const;

const kantoPostgame = [
  ['vermilion-city', 'Vermilion City'],
  ['saffron-city', 'Saffron City'],
  ['celadon-city', 'Celadon City'],
  ['fuchsia-city', 'Fuchsia City'],
  ['cerulean-city', 'Cerulean City'],
  ['power-plant', 'Power Plant'],
  ['pewter-city', 'Pewter City'],
  ['viridian-city', 'Viridian City'],
  ['pallet-town', 'Pallet Town'],
  ['cinnabar-island', 'Cinnabar Island'],
  ['seafoam-islands', 'Seafoam Islands'],
  ['route-28', 'Route 28'],
  ['mt-silver', 'Mt. Silver'],
] as const;

export const gen2JohtoLocations: Gen2Location[] = [
  ...johtoProgression.map(([id, displayName, tags], index) => ({
    id,
    displayName,
    order: index + 1,
    region: 'johto' as const,
    gameSet: 'gen2-johto' as const,
    tags: [...tags],
  })),
  ...kantoPostgame.map(([id, displayName], index) => ({
    id,
    displayName,
    order: johtoProgression.length + index + 1,
    region: 'kanto' as const,
    gameSet: 'gen2-johto' as const,
    tags: ['postgame', 'optional'],
  })),
];
