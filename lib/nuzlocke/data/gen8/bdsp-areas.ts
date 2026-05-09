import { bdspEncounterAreas } from './bdsp-encounters';

export const bdspAreas = bdspEncounterAreas.map((area, index) => ({
  id: area.location.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  displayName: area.location,
  recommendedOrder: index + 1,
  notes: area.notes,
}));
