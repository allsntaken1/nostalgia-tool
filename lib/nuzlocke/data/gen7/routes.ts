export type Gen7RouteTag =
  | 'town'
  | 'city'
  | 'route'
  | 'cave'
  | 'tunnel'
  | 'beach'
  | 'meadow'
  | 'jungle'
  | 'volcano'
  | 'mountain'
  | 'island-area'
  | 'resort'
  | 'desert'
  | 'starter'
  | 'aether'
  | 'team-skull'
  | 'gym'
  | 'trial'
  | 'boss-area'
  | 'postgame'
  | 'legendary'
  | 'ultra-space'
  | 'usum-extra';

export type Gen7Location = {
  id: string;
  displayName: string;
  order: number;
  region: 'alola';
  gameSet: 'sm' | 'usum' | 'both';
  tags: Gen7RouteTag[];
  notes?: string[];
};

const location = (
  id: string,
  displayName: string,
  order: number,
  gameSet: Gen7Location['gameSet'],
  tags: Gen7RouteTag[],
  notes?: string[],
): Gen7Location => ({
  id,
  displayName,
  order,
  region: 'alola',
  gameSet,
  tags,
  ...(notes ? { notes } : {}),
});

// Shared Alola progression locations — present in both SM and USUM. USUM has minor reorders for
// some story beats, but the location set is largely identical. Differences are encoded by adding
// USUM-only entries below.
const sharedLocations: Gen7Location[] = [
  location('alola-iki-town', 'Iki Town', 1, 'both', ['town', 'starter']),
  location('alola-route-1', 'Route 1', 2, 'both', ['route']),
  location('alola-hauoli-outskirts', "Hau'oli Outskirts", 3, 'both', ['route']),
  location('alola-hauoli-city', "Hau'oli City", 4, 'both', ['city']),
  location('alola-route-2', 'Route 2', 5, 'both', ['route']),
  location('alola-verdant-cavern', 'Verdant Cavern', 6, 'both', ['cave', 'trial']),
  location('alola-route-3', 'Route 3', 7, 'both', ['route']),
  location('alola-melemele-meadow', 'Melemele Meadow', 8, 'both', ['meadow']),
  location('alola-kalae-bay', "Kala'e Bay", 9, 'both', ['beach']),
  location('alola-ten-carat-hill', 'Ten Carat Hill', 10, 'both', ['cave']),
  location('alola-heahea-city', 'Heahea City', 11, 'both', ['city']),
  location('alola-route-4', 'Route 4', 12, 'both', ['route']),
  location('alola-paniola-town', 'Paniola Town', 13, 'both', ['town']),
  location('alola-paniola-ranch', 'Paniola Ranch', 14, 'both', ['island-area']),
  location('alola-route-5', 'Route 5', 15, 'both', ['route']),
  location('alola-brooklet-hill', 'Brooklet Hill', 16, 'both', ['island-area', 'trial']),
  location('alola-route-6', 'Route 6', 17, 'both', ['route']),
  location('alola-royal-avenue', 'Royal Avenue', 18, 'both', ['town']),
  location('alola-route-7', 'Route 7', 19, 'both', ['route']),
  location('alola-wela-volcano-park', 'Wela Volcano Park', 20, 'both', ['volcano', 'trial']),
  location('alola-route-8', 'Route 8', 21, 'both', ['route']),
  location('alola-lush-jungle', 'Lush Jungle', 22, 'both', ['jungle', 'trial']),
  location('alola-digletts-tunnel', "Diglett's Tunnel", 23, 'both', ['tunnel']),
  location('alola-konikoni-city', 'Konikoni City', 24, 'both', ['city']),
  location('alola-memorial-hill', 'Memorial Hill', 25, 'both', ['island-area']),
  location('alola-akala-outskirts', 'Akala Outskirts', 26, 'both', ['island-area']),
  location('alola-hano-grand-resort', 'Hano Grand Resort', 27, 'both', ['resort']),
  location('alola-malie-city', 'Malie City', 28, 'both', ['city']),
  location('alola-route-10', 'Route 10', 29, 'both', ['route']),
  location('alola-mount-hokulani', 'Mount Hokulani', 30, 'both', ['mountain', 'trial']),
  location('alola-route-11', 'Route 11', 31, 'both', ['route']),
  location('alola-route-12', 'Route 12', 32, 'both', ['route']),
  location('alola-blush-mountain', 'Blush Mountain', 33, 'both', ['mountain']),
  location('alola-route-13', 'Route 13', 34, 'both', ['route']),
  location('alola-tapu-village', 'Tapu Village', 35, 'both', ['town']),
  location('alola-route-14', 'Route 14', 36, 'both', ['route']),
  location('alola-route-15', 'Route 15', 37, 'both', ['route']),
  location('alola-route-16', 'Route 16', 38, 'both', ['route']),
  location('alola-ulaula-meadow', "Ula'ula Meadow", 39, 'both', ['meadow']),
  location('alola-route-17', 'Route 17', 40, 'both', ['route']),
  location('alola-thrifty-megamart', 'Thrifty Megamart (Abandoned)', 40.5, 'both', ['trial', 'island-area']),
  location('alola-po-town', 'Po Town', 41, 'both', ['town', 'team-skull']),
  location('alola-haina-desert', 'Haina Desert', 42, 'both', ['desert']),
  location('alola-aether-paradise', 'Aether Paradise', 43, 'both', ['aether', 'boss-area']),
  location('alola-seafolk-village', 'Seafolk Village', 44, 'both', ['town']),
  location('alola-poni-wilds', 'Poni Wilds', 45, 'both', ['island-area']),
  location('alola-ancient-poni-path', 'Ancient Poni Path', 46, 'both', ['route']),
  location('alola-poni-breaker-coast', 'Poni Breaker Coast', 47, 'both', ['beach']),
  location('alola-vast-poni-canyon', 'Vast Poni Canyon', 48, 'both', ['mountain', 'trial']),
  location('alola-altar', 'Altar of the Sunne / Altar of the Moone', 49, 'both', ['legendary', 'boss-area']),
  location('alola-mount-lanakila', 'Mount Lanakila', 50, 'both', ['mountain', 'boss-area']),
  location('alola-pokemon-league', 'Pokémon League', 51, 'both', ['boss-area']),
];

// USUM-exclusive or USUM-distinct locations. Sorted with high `order` values so they appear after
// shared locations when filtered to USUM only; the encounter files reference these IDs.
const usumExclusiveLocations: Gen7Location[] = [
  location('alola-pikachu-valley', 'Pikachu Valley', 60, 'usum', ['island-area', 'usum-extra'], [
    'USUM-only sidearea on Akala Island; primarily a Pikachu encounter spot.',
  ]),
  location('alola-mantine-surf', 'Mantine Surf', 61, 'usum', ['beach', 'usum-extra'], [
    'USUM-only inter-island Mantine Surf minigame beaches; not modeled as a wild encounter table this pass.',
  ]),
  location('alola-ultra-megalopolis', 'Ultra Megalopolis', 62, 'usum', ['ultra-space', 'usum-extra', 'boss-area'], [
    'USUM-only postgame area. Necrozma forme battle is staged here.',
    'TODO: Necrozma battle data not in this skeleton pass.',
  ]),
  location('alola-ultra-space', 'Ultra Space / Ultra Warp Ride', 63, 'usum', ['ultra-space', 'usum-extra', 'legendary'], [
    'USUM-only postgame procedural-encounter dimension. Hosts many legendary encounters.',
    'TODO: Ultra Warp Ride encounter mechanics need a future pass — not modeled as a flat encounter table.',
  ]),
];

export const smRoutes: Gen7Location[] = sharedLocations.filter((loc) => loc.gameSet === 'both' || loc.gameSet === 'sm');
export const usumRoutes: Gen7Location[] = [
  ...sharedLocations.filter((loc) => loc.gameSet === 'both' || loc.gameSet === 'usum'),
  ...usumExclusiveLocations,
];
export const gen7AllLocations: Gen7Location[] = [...sharedLocations, ...usumExclusiveLocations];
