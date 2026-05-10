import type { RouteData } from '@/lib/nuzlocke/data/shared';

// TODO: Expand Gen 4 route/location coverage in future data passes.
export const gen4Routes: RouteData[] = [
  { id: 'starter', displayName: 'Starter', order: 1, region: 'sinnoh', gameSet: 'gen4', tags: ['starter'], notes: ['TODO: Populate starter encounter handling per game.'] },
  { id: 'route-201', displayName: 'Route 201', order: 2, region: 'sinnoh', gameSet: 'gen4', tags: ['route'], notes: ['TODO: Populate Diamond/Pearl/Platinum encounters.'] },
  { id: 'oreburgh-city', displayName: 'Oreburgh City', order: 3, region: 'sinnoh', gameSet: 'gen4', tags: ['town', 'gym', 'boss-area'], notes: ['TODO: Populate city metadata and gym routing.'] },
];

export const hgssRoutes: RouteData[] = [
  { id: 'starter', displayName: 'Starter', order: 1, region: 'johto', gameSet: 'hgss', tags: ['starter'], notes: ['TODO: Populate starter encounter handling per game.'] },
  { id: 'route-29', displayName: 'Route 29', order: 2, region: 'johto', gameSet: 'hgss', tags: ['route'], notes: ['TODO: Populate HeartGold/SoulSilver encounters.'] },
  { id: 'violet-city', displayName: 'Violet City', order: 3, region: 'johto', gameSet: 'hgss', tags: ['town', 'gym', 'boss-area'], notes: ['TODO: Populate city metadata and gym routing.'] },
];
