import type { EncounterOption } from '@/app/nuzlocke/data';
import type { PokemonType } from '@/app/nuzlocke/types';
import { usumRoutes } from './routes';

/** USUM encounter schema. Same shape as the SM schema, intentionally duplicated so each game
 *  set can diverge cleanly when canonical data is added (USUM has different encounter slots,
 *  added totems, Ultra Beasts available in the main story, and Ultra Warp Ride mechanics). */

export type UsumVersion = 'Ultra Sun' | 'Ultra Moon' | 'Both';
export type UsumEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'legendary' | 'special';
export type UsumRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

export type UsumEncounter = {
  species: string;
  types: PokemonType[];
  method: UsumEncounterMethod;
  version: UsumVersion;
  notes?: string;
  rod?: UsumRod;
  condition?: string;
};

export type UsumEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: UsumEncounter[];
  notes: string[];
};

export const usumEncounterAreas: UsumEncounterArea[] = usumRoutes.map((route) => ({
  locationId: route.id,
  displayName: route.displayName,
  encounters: [],
  notes: ['TODO: Populate canonical Ultra Sun / Ultra Moon encounter data for this location.'],
}));

export const usumEncounterNotes = [
  'Schema-mismatch flags: SOS chains, Island Scan, Totem Pokémon + allies, version-exclusives, day/night, fishing bubbles, ambushes, gifts, static legendaries, Ultra Warp Ride encounters.',
  'Mantine Surf, Festival Plaza, and Team Rainbow Rocket events are NOT main-story encounter content and are out of scope for the skeleton.',
  'Zygarde cells are not Pokémon encounters and are intentionally not encoded as encounters.',
  'This pass only registers location slots; species lists will be filled in a later pass.',
];

export function getUsumEncounterOptions(): Record<string, EncounterOption[]> {
  return usumEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const safeList = Array.isArray(area.encounters) ? area.encounters : [];
    acc[area.displayName] = safeList.map((item): EncounterOption => ({
      species: item.species,
      types: item.types,
      surfMethod: item.method === 'surfing' || undefined,
      fishingMethod: item.method === 'fishing' || undefined,
      ...(item.rod ? { rod: item.rod } : {}),
      ...(item.condition ? { condition: item.condition } : {}),
    }));
    return acc;
  }, {});
}
