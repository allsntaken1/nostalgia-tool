import type { RouteData } from '@/lib/nuzlocke/data/shared';

// TODO: Expand Unova route/location coverage in future data passes.
export const bwRoutes: RouteData[] = [
  { id: 'starter', displayName: 'Starter', order: 1, region: 'unova', gameSet: 'bw', tags: ['starter'], notes: ['TODO: Populate starter encounter handling.'] },
  { id: 'route-1', displayName: 'Route 1', order: 2, region: 'unova', gameSet: 'bw', tags: ['route'], notes: ['TODO: Populate Black/White encounters.'] },
  { id: 'striaton-city', displayName: 'Striaton City', order: 3, region: 'unova', gameSet: 'bw', tags: ['town', 'gym', 'boss-area'], notes: ['TODO: Populate gym routing.'] },
];

export const b2w2Routes: RouteData[] = [
  { id: 'starter', displayName: 'Starter', order: 1, region: 'unova', gameSet: 'b2w2', tags: ['starter'], notes: ['TODO: Populate starter encounter handling.'] },
  { id: 'route-19', displayName: 'Route 19', order: 2, region: 'unova', gameSet: 'b2w2', tags: ['route'], notes: ['TODO: Populate Black 2/White 2 encounters.'] },
  { id: 'aspertia-city', displayName: 'Aspertia City', order: 3, region: 'unova', gameSet: 'b2w2', tags: ['town', 'gym', 'boss-area'], notes: ['TODO: Populate gym routing.'] },
];
