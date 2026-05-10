import type { BossTrainer, GymLeader } from '@/lib/nuzlocke/data/shared';
import type { GameVersion } from '@/app/nuzlocke/types';
import { diamondPearlGyms } from './diamond-pearl-gyms';
import { gen4Rivals } from './gen4-rivals';
import { hgssGyms } from './hgss-gyms';
import { platinumGyms } from './platinum-gyms';

function gymToBoss(gym: GymLeader, game: BossTrainer['game']): BossTrainer {
  return {
    id: gym.id,
    name: gym.name,
    category: 'Gym Leader',
    game,
    locationId: gym.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    location: gym.city,
    recommendedOrder: gym.levelCap,
    levelCap: gym.levelCap,
    team: [],
    notes: gym.notes,
  };
}

export function getGen4TrainerSkeletons(gameVersion: GameVersion): BossTrainer[] {
  const gyms =
    gameVersion === 'Platinum'
      ? platinumGyms.map((gym) => gymToBoss(gym, 'Platinum'))
      : gameVersion === 'HeartGold' || gameVersion === 'SoulSilver'
        ? hgssGyms.map((gym) => gymToBoss(gym, gameVersion))
        : gameVersion === 'Diamond' || gameVersion === 'Pearl'
          ? diamondPearlGyms.map((gym) => gymToBoss(gym, gameVersion))
          : [];

  const rivals: BossTrainer[] = gen4Rivals.map((rival) => ({
    id: `${rival.id}-${gameVersion.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: rival.name,
    category: 'Rival',
    game: gameVersion,
    locationId: rival.locationId,
    location: rival.locationId,
    recommendedOrder: rival.order,
    levelCap: 1,
    team: [],
    baseTeam: [],
    variantsByRivalStarterChoice: rival.variantsByRivalStarterChoice,
    notes: rival.notes,
  }));

  return [...rivals, ...gyms].sort((a, b) => (a.levelCap || 0) - (b.levelCap || 0) || a.recommendedOrder - b.recommendedOrder);
}
