import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

type XyVersion = 'X' | 'Y' | 'Both';
type XyEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';

type XyEncounter = {
  species: string;
  types: PokemonType[];
  method: XyEncounterMethod;
  version: XyVersion;
  notes?: string;
};

type XyEncounterArea = {
  locationId: string;
  displayName: string;
  encounters: XyEncounter[];
  notes: string[];
};

const encounter = (
  species: string,
  types: PokemonType[],
  method: XyEncounterMethod,
  version: XyVersion = 'Both',
  notes?: string,
): XyEncounter => ({ species, types, method, version, notes });

export const xyEncounterAreas: XyEncounterArea[] = [
  {
    locationId: 'xy-vaniville-town',
    displayName: 'Vaniville Town',
    encounters: [],
    notes: [
      'No wild encounters in Vaniville Town.',
      'Starters (Chespin, Fennekin, Froakie) are received from Tierno in Aquacorde Town.',
    ],
  },
  {
    locationId: 'xy-route-1',
    displayName: 'Route 1',
    encounters: [],
    notes: ['No wild encounters on Route 1.'],
  },
  {
    locationId: 'xy-aquacorde-town',
    displayName: 'Aquacorde Town',
    encounters: [
      encounter('Chespin', ['Grass'], 'gift', 'Both', 'Starter choice gift from Tierno.'),
      encounter('Fennekin', ['Fire'], 'gift', 'Both', 'Starter choice gift from Tierno.'),
      encounter('Froakie', ['Water'], 'gift', 'Both', 'Starter choice gift from Tierno.'),
    ],
    notes: [
      'Starters are presented by Tierno on behalf of Professor Sycamore. Only one is chosen per run.',
      'Run model stores starter type only; all three are listed here as gift options for reference.',
    ],
  },
  {
    locationId: 'xy-route-2',
    displayName: 'Route 2',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Fletchling', ['Normal', 'Flying'], 'grass'),
      encounter('Pidgey', ['Normal', 'Flying'], 'grass'),
      encounter('Scatterbug', ['Bug'], 'grass'),
      encounter('Zigzagoon', ['Normal'], 'grass'),
    ],
    notes: [],
  },
  {
    locationId: 'xy-santalune-forest',
    displayName: 'Santalune Forest',
    encounters: [
      encounter('Caterpie', ['Bug'], 'grass', 'X'),
      encounter('Metapod', ['Bug'], 'grass', 'X'),
      encounter('Weedle', ['Bug', 'Poison'], 'grass', 'Y'),
      encounter('Kakuna', ['Bug', 'Poison'], 'grass', 'Y'),
      encounter('Pikachu', ['Electric'], 'grass'),
      encounter('Scatterbug', ['Bug'], 'grass'),
      encounter('Fletchling', ['Normal', 'Flying'], 'grass'),
      encounter('Pansage', ['Grass'], 'gift', 'Both', 'Elemental monkey gift from a Youngster in the forest. Given based on starter choice: Pansage if starter is Fennekin.'),
      encounter('Pansear', ['Fire'], 'gift', 'Both', 'Elemental monkey gift from a Youngster in the forest. Given based on starter choice: Pansear if starter is Froakie.'),
      encounter('Panpour', ['Water'], 'gift', 'Both', 'Elemental monkey gift from a Youngster in the forest. Given based on starter choice: Panpour if starter is Chespin.'),
    ],
    notes: [
      'Caterpie/Metapod are X-exclusive; Weedle/Kakuna are Y-exclusive.',
      'One elemental monkey (Pansage/Pansear/Panpour) is gifted by a Youngster based on your starter. Only one is obtainable per run.',
    ],
  },
  {
    locationId: 'xy-route-3',
    displayName: 'Route 3',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Fletchling', ['Normal', 'Flying'], 'grass'),
      encounter('Azurill', ['Normal', 'Fairy'], 'grass'),
      encounter('Pikachu', ['Electric'], 'grass'),
      encounter('Dunsparce', ['Normal'], 'grass'),
      encounter('Bidoof', ['Normal'], 'grass'),
      encounter('Burmy', ['Bug'], 'grass'),
    ],
    notes: [],
  },
  {
    locationId: 'xy-santalune-city',
    displayName: 'Santalune City',
    encounters: [],
    notes: ['TODO: Populate fishing/surfing encounters later.'],
  },
  {
    locationId: 'xy-route-22',
    displayName: 'Route 22',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Litleo', ['Fire', 'Normal'], 'grass'),
      encounter('Psyduck', ['Water'], 'grass'),
      encounter('Riolu', ['Fighting'], 'grass'),
      encounter('Azurill', ['Normal', 'Fairy'], 'grass'),
      encounter('Dunsparce', ['Normal'], 'grass'),
      encounter('Farfetchd', ['Normal', 'Flying'], 'grass'),
    ],
    notes: [],
  },
  {
    locationId: 'xy-route-4',
    displayName: 'Route 4',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Flabebe', ['Fairy'], 'grass', 'Both', 'Flower color (red/yellow/orange/blue/white) varies by route patch; tracker treats all colors as one species.'),
      encounter('Budew', ['Grass', 'Poison'], 'grass'),
      encounter('Skitty', ['Normal'], 'grass'),
      encounter('Combee', ['Bug', 'Flying'], 'grass'),
    ],
    notes: [
      'Parterre Way. Flower-tile encounters share the grass method in this flat schema.',
      'TODO: Verify additional Route 4 grass species (Plusle/Minun, Ledyba, Burmy) and any version exclusivity.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-lumiose-city',
    displayName: 'Lumiose City',
    encounters: [],
    notes: [
      'No wild grass encounters in Lumiose City.',
      'TODO: Populate fishing encounters.',
      'TODO: Populate gift Pokemon (Lapras from a sailor on Route 12 is post-Lumiose; in Lumiose itself, verify gift NPCs before adding).',
    ],
  },
  {
    locationId: 'xy-route-5',
    displayName: 'Route 5',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Skiddo', ['Grass'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Furfrou', ['Normal'], 'grass'),
    ],
    notes: [
      'Versant Road. Player obtains roller skates here.',
      'TODO: Verify additional Route 5 grass species and any version-exclusive entries.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-camphrier-town',
    displayName: 'Camphrier Town',
    encounters: [],
    notes: [
      'No wild grass encounters in Camphrier Town.',
      'TODO: Populate fishing encounters (Old Rod available in town).',
    ],
  },
  {
    locationId: 'xy-route-6',
    displayName: 'Route 6',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Pancham', ['Fighting'], 'grass'),
      encounter('Espurr', ['Psychic'], 'grass', 'Both', 'Found in the taller grass patches along the path.'),
    ],
    notes: [
      'Palais Lane. Route has both standard grass and tall-grass patches; this flat schema does not split them.',
      'TODO: Verify and split tall-grass vs short-grass encounter lists (Smeargle, Doduo, Skitty candidates).',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-parfum-palace',
    displayName: 'Parfum Palace',
    encounters: [],
    notes: [
      'No wild grass encounters inside Parfum Palace grounds.',
      'TODO: Populate horde encounters in the back gardens if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-route-7',
    displayName: 'Route 7',
    encounters: [
      encounter('Skiddo', ['Grass'], 'grass'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass'),
      encounter('Combee', ['Bug', 'Flying'], 'grass'),
    ],
    notes: [
      'Riviere Walk. Connects to the Berry Fields and Connecting Cave.',
      'TODO: Verify additional Route 7 grass species (Volbeat/Illumise version split, Smeargle candidate).',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-connecting-cave',
    displayName: 'Connecting Cave',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Whismur', ['Normal'], 'cave'),
    ],
    notes: [
      'Zubat Roost. Single-path cave linking Route 7 and Route 8.',
      'TODO: Populate horde encounters (Axew horde is a notable rare encounter) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-route-8',
    displayName: 'Route 8',
    encounters: [
      encounter('Bunnelby', ['Normal'], 'grass'),
      encounter('Inkay', ['Dark', 'Psychic'], 'grass'),
      encounter('Wingull', ['Water', 'Flying'], 'grass'),
    ],
    notes: [
      'Muraille Coast. Coastal route leading from Connecting Cave to Ambrette Town.',
      'TODO: Verify additional Route 8 grass species (Tauros/Miltank version split candidate, Slugma candidate).',
      'TODO: Populate fishing encounters.',
      'TODO: Populate surfing encounters.',
      'TODO: Populate Rock Smash encounters.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-ambrette-town',
    displayName: 'Ambrette Town',
    encounters: [],
    notes: [
      'No wild grass encounters in Ambrette Town.',
      'TODO: Populate fishing encounters.',
      'TODO: Verify whether fossil restoration (Sail Fossil -> Amaura, Jaw Fossil -> Tyrunt) is tracked here as a gift/static encounter; current tracker schema convention for fossils is unverified.',
    ],
  },
  {
    locationId: 'xy-route-9',
    displayName: 'Route 9',
    encounters: [],
    notes: [
      'Spikes Passage. Rhyhorn-riding traversal between Ambrette Town and Cyllage City; no walkable wild grass.',
      'TODO: Verify whether any horde encounters occur during the Rhyhorn ride.',
    ],
  },
  {
    locationId: 'xy-glittering-cave',
    displayName: 'Glittering Cave',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
    ],
    notes: [
      'Cave entered from Ambrette Town side; Team Flare event area lies deeper inside.',
      'TODO: Verify additional Glittering Cave species (Kecleon, Cubone candidates) before adding.',
      'TODO: Verify version-exclusive cave encounters (Mawile/Sableye split is suspected but not confirmed for this pass).',
      'TODO: Verify whether Sail/Jaw fossil pickups are tracked as static encounters in this location.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
];

export const xyEncounterNotes = {
  versionSplit: 'Encounters marked X or Y are version-exclusive. Encounters marked Both appear in both versions.',
  monkeyGift: 'The elemental monkey gift in Santalune Forest depends on your starter choice.',
};

export function getXyEncounterOptions(gameVersion: GameVersion): Record<string, EncounterOption[]> {
  if (gameVersion !== 'X' && gameVersion !== 'Y') return {};

  return xyEncounterAreas.reduce<Record<string, EncounterOption[]>>((acc, area) => {
    const options = (Array.isArray(area.encounters) ? area.encounters : [])
      .filter((item) => item.version === 'Both' || item.version === gameVersion)
      .map((item): EncounterOption => ({
        species: item.species,
        types: item.types,
        surfMethod: item.method === 'surfing' || undefined,
        fishingMethod: item.method === 'fishing' || undefined,
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
