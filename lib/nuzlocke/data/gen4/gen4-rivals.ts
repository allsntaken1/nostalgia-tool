import type { RivalBattle } from '@/lib/nuzlocke/data/shared';

// TODO: Add verified rival variants by starter choice for each Gen 4 game.
export const gen4Rivals: RivalBattle[] = [
  { id: 'rival-early-gen4', name: 'Rival Early Battle', locationId: 'route-201', order: 1, baseTeam: [], variantsByRivalStarterChoice: { grass: [], fire: [], water: [] }, notes: ['TODO: Populate verified rival battle data.'] },
];
