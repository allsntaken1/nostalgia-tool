import type { GameVersion } from '@/app/nuzlocke/types';
import type { BossTrainer, GymLeader } from '@/lib/nuzlocke/data/shared';
import { b2w2Gyms } from './b2w2-gyms';
import { bwGyms } from './bw-gyms';
import { gen5Rivals } from './gen5-rivals';

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

export function getGen5TrainerSkeletons(gameVersion: GameVersion): BossTrainer[] {
  const gyms =
    gameVersion === 'Black' || gameVersion === 'White'
      ? bwGyms.map((gym) => gymToBoss(gym, gameVersion))
      : gameVersion === 'Black 2' || gameVersion === 'White 2'
        ? b2w2Gyms.map((gym) => gymToBoss(gym, gameVersion))
        : [];

  const rivals: BossTrainer[] = gen5Rivals.map((rival) => ({
    id: `${rival.id}-${gameVersion.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: rival.name,
    category: 'Rival',
    game: gameVersion,
    locationId: rival.locationId,
    location: rival.locationId,
    recommendedOrder: rival.order,
    // Skeleton rival: cap unknown until canonical data is populated. Adapter forwards null
    // to the UI's TBD path instead of fabricating Cap 1 (matches gen4-trainers.ts pattern).
    levelCap: null,
    team: [],
    baseTeam: [],
    variantsByRivalStarterChoice: rival.variantsByRivalStarterChoice,
    notes: rival.notes,
  }));

  return [...rivals, ...gyms].sort((a, b) => (a.levelCap || 0) - (b.levelCap || 0) || a.recommendedOrder - b.recommendedOrder);
}
