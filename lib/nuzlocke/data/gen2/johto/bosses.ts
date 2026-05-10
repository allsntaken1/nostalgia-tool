import type { StarterChoice } from '@/app/nuzlocke/types';

export type Gen2BossSkeleton = {
  id: string;
  name: string;
  category: string;
  locationId: string;
  order: number;
  baseTeam: [];
  variantsByRivalStarterChoice?: Partial<Record<StarterChoice, []>>;
};

function boss(id: string, name: string, category: string, locationId: string, order: number, rival = false): Gen2BossSkeleton {
  return {
    id,
    name,
    category,
    locationId,
    order,
    baseTeam: [],
    ...(rival ? { variantsByRivalStarterChoice: { grass: [], fire: [], water: [] } } : {}),
  };
}

export const gen2JohtoBosses: Gen2BossSkeleton[] = [
  boss('rival-1-gen2', 'Rival 1', 'Rival', 'cherrygrove-city', 1, true),
  boss('falkner-gen2', 'Falkner', 'Gym Leader', 'violet-city', 2),
  boss('bugsy-gen2', 'Bugsy', 'Gym Leader', 'azalea-town', 3),
  boss('rival-2-gen2', 'Rival 2', 'Rival', 'azalea-town', 4, true),
  boss('whitney-gen2', 'Whitney', 'Gym Leader', 'goldenrod-city', 5),
  boss('rival-3-gen2', 'Rival 3', 'Rival', 'burned-tower', 6, true),
  boss('morty-gen2', 'Morty', 'Gym Leader', 'ecruteak-city', 7),
  boss('chuck-gen2', 'Chuck', 'Gym Leader', 'cianwood-city', 8),
  boss('jasmine-gen2', 'Jasmine', 'Gym Leader', 'olivine-city', 9),
  boss('pryce-gen2', 'Pryce', 'Gym Leader', 'mahogany-town', 10),
  boss('rocket-admins-gen2', 'Team Rocket Admin Fights', 'Evil Team', 'team-rocket-hq', 11),
  boss('clair-gen2', 'Clair', 'Gym Leader', 'blackthorn-city', 12),
  boss('rival-victory-road-gen2', 'Rival Victory Road', 'Rival', 'victory-road', 13, true),
  boss('will-gen2', 'Will', 'Elite Four', 'indigo-plateau', 14),
  boss('koga-gen2', 'Koga', 'Elite Four', 'indigo-plateau', 15),
  boss('bruno-gen2', 'Bruno', 'Elite Four', 'indigo-plateau', 16),
  boss('karen-gen2', 'Karen', 'Elite Four', 'indigo-plateau', 17),
  boss('lance-gen2', 'Lance', 'Champion', 'indigo-plateau', 18),
  boss('red-gen2', 'Red', 'Optional Postgame', 'mt-silver', 19),
];
