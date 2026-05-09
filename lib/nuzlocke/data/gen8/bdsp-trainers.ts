import { bdspChampion } from './bdsp-champion';
import { bdspEliteFour } from './bdsp-elitefour';
import { bdspGalactic } from './bdsp-galactic';
import { bdspGyms } from './bdsp-gyms';
import { bdspRivals } from './bdsp-rivals';

export const bdspTrainers = [
  ...bdspRivals,
  ...bdspGyms,
  ...bdspGalactic,
  ...bdspEliteFour,
  ...bdspChampion,
].sort((a, b) => a.recommendedOrder - b.recommendedOrder);
