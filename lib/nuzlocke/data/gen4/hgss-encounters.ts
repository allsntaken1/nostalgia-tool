import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

type HgssVersion = 'Both' | 'HeartGold' | 'SoulSilver';
type HgssEncounterMethod = 'grass' | 'surfing' | 'fishing' | 'special';

type HgssEncounter = {
  species: string;
  types: PokemonType[];
  method: HgssEncounterMethod;
  version: HgssVersion;
  notes?: string;
};

type HgssEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: HgssEncounter[];
  notes: string[];
};

const encounter = (species: string, types: PokemonType[], method: HgssEncounterMethod, version: HgssVersion = 'Both', notes?: string): HgssEncounter => ({
  species,
  types,
  method,
  version,
  notes,
});

export const hgssEncounterAreas: HgssEncounterArea[] = [
  {
    locationId: 'johto-route-29',
    displayName: 'Johto Route 29',
    encounters: [
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Sentret', ['Normal'], 'grass'),
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Plusle', ['Electric'], 'special', 'Both', 'Pokégear Hoenn Sound encounter.'),
      encounter('Minun', ['Electric'], 'special', 'Both', 'Pokégear Hoenn Sound encounter.'),
      encounter('Shinx', ['Electric'], 'special', 'Both', 'Pokégear Sinnoh Sound encounter.'),
    ],
    notes: [
      'Time-of-day rates are real HGSS conditions but are not represented in the current flat encounter schema.',
      'Headbutt Group A/B encounters are intentionally omitted until condition support is added.',
    ],
  },
  {
    locationId: 'johto-route-30',
    displayName: 'Johto Route 30',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'HeartGold'),
      encounter('Metapod', ['Bug'], 'grass', 'HeartGold'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Rattata', ['Normal'], 'grass'),
      encounter('Hoothoot', ['Normal', 'Flying'], 'grass'),
      encounter('Ledyba', ['Bug', 'Flying'], 'grass', 'HeartGold'),
      encounter('Spinarak', ['Bug', 'Poison'], 'grass', 'SoulSilver'),
      encounter('Poliwag', ['Water'], 'surfing'),
      encounter('Poliwhirl', ['Water'], 'surfing'),
      encounter('Poliwag', ['Water'], 'fishing'),
      encounter('Magikarp', ['Water'], 'fishing'),
    ],
    notes: [
      'Grass time/version split preserved from source notes; current UI does not expose morning/day/night.',
      'Rod tiers are collapsed to one fishing option per species in this flat UI.',
      'Headbutt and radio encounters are TODO until condition support is added.',
    ],
  },
];

export const hgssEncounterNotes = [
  'Flat schema mismatch: morning/day/night, rod tier, radio state, and headbutt group are all real HGSS encounter conditions.',
  'This pass only includes directly representable encounter options.',
];

export function getHgssEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'HeartGold' && gameVersion !== 'SoulSilver') return {};

  return hgssEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item) => ({
        species: item.species,
        types: item.types,
        surfMethod: item.method === 'surfing',
        fishingMethod: item.method === 'fishing',
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
