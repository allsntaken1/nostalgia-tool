import type { EncounterOption } from '@/app/nuzlocke/data';
import type { GameVersion, PokemonType } from '@/app/nuzlocke/types';

type XyVersion = 'X' | 'Y' | 'Both';
type XyEncounterMethod = 'grass' | 'cave' | 'surfing' | 'fishing' | 'gift' | 'static' | 'trade' | 'special' | 'legendary';
type XyRod = 'Old Rod' | 'Good Rod' | 'Super Rod';

type XyEncounter = {
  species: string;
  types: PokemonType[];
  method: XyEncounterMethod;
  version: XyVersion;
  notes?: string;
  /** Optional rod gating for fishing entries. */
  rod?: XyRod;
  /** Optional condition annotation (e.g. "Rock Smash", subarea name, day-of-week gating). */
  condition?: string;
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
  extras: { rod?: XyRod; condition?: string } = {},
): XyEncounter => ({ species, types, method, version, notes, ...extras });

// Fishing helper — shorthand for the common rod-tagged fishing entries.
const fish = (species: string, types: PokemonType[], rod: XyRod, version: XyVersion = 'Both', notes?: string): XyEncounter =>
  encounter(species, types, 'fishing', version, notes, { rod });

// Surf helper.
const surf = (species: string, types: PokemonType[], version: XyVersion = 'Both', notes?: string): XyEncounter =>
  encounter(species, types, 'surfing', version, notes);

// Rock Smash helper — uses method "special" with a Rock Smash condition annotation.
const rockSmash = (species: string, types: PokemonType[], version: XyVersion = 'Both', notes?: string): XyEncounter =>
  encounter(species, types, 'special', version, notes, { condition: 'Rock Smash' });

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
    notes: [
      'No wild grass encounters in Santalune City. Home of Viola\'s Bug-type gym (Gym 1).',
      'TODO: Populate fishing encounters.',
      'TODO: Populate surfing encounters.',
    ],
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
      // Surfing
      surf('Psyduck', ['Water']),
      surf('Azumarill', ['Water', 'Fairy']),
      // Fishing
      fish('Magikarp', ['Water'], 'Old Rod'),
      fish('Goldeen', ['Water'], 'Good Rod'),
      fish('Carvanha', ['Water', 'Dark'], 'Good Rod'),
      fish('Seaking', ['Water'], 'Super Rod'),
      fish('Gyarados', ['Water', 'Flying'], 'Super Rod'),
      fish('Sharpedo', ['Water', 'Dark'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter.'),
    ],
    notes: [
      'Detourner Way. Verified per Bulbapedia (Route 22 page).',
    ],
  },
  {
    locationId: 'xy-route-4',
    displayName: 'Route 4',
    encounters: [
      encounter('Ledyba', ['Bug', 'Flying'], 'grass'),
      encounter('Ralts', ['Psychic', 'Fairy'], 'grass'),
      encounter('Skitty', ['Normal'], 'grass'),
      encounter('Budew', ['Grass', 'Poison'], 'grass'),
      encounter('Combee', ['Bug', 'Flying'], 'grass'),
      encounter('Flabebe', ['Fairy'], 'grass', 'Both', 'Flower color (orange/white/yellow/red) varies by patch; tracker treats all colors as one species.'),
    ],
    notes: [
      'Parterre Way. Yellow and red flower patches share the grass method in this flat schema. Verified per Bulbapedia (Route 4 page).',
      'No horde encounters documented on Route 4.',
      'Plusle/Minun/Burmy are NOT canonical Route 4 encounters per Bulbapedia.',
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
      encounter('Oddish', ['Grass', 'Poison'], 'grass'),
      encounter('Sentret', ['Normal'], 'grass'),
      encounter('Nincada', ['Bug', 'Ground'], 'grass'),
      encounter('Kecleon', ['Normal'], 'grass'),
      encounter('Espurr', ['Psychic'], 'grass'),
      encounter('Honedge', ['Steel', 'Ghost'], 'grass'),
    ],
    notes: [
      'Palais Lane. Tall (long) grass encounters listed above. Verified per Bulbapedia (Route 6 page).',
      'TODO: Populate rustling-bush encounters (Venipede, Audino) when schema supports them.',
      'Bunnelby and Pancham are NOT canonical Route 6 encounters per Bulbapedia.',
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
      encounter('Smeargle', ['Normal'], 'grass'),
      encounter('Volbeat', ['Bug'], 'grass'),
      encounter('Illumise', ['Bug'], 'grass'),
      encounter('Roselia', ['Grass', 'Poison'], 'grass'),
      encounter('Ducklett', ['Water', 'Flying'], 'grass'),
      encounter('Croagunk', ['Poison', 'Fighting'], 'grass'),
      encounter('Spritzee', ['Fairy'], 'grass', 'X', 'X-exclusive wild encounter.'),
      encounter('Swirlix', ['Fairy'], 'grass', 'Y', 'Y-exclusive wild encounter.'),
      encounter('Flabebe', ['Fairy'], 'grass', 'Both', 'Flower color (orange/white in tall grass; yellow on yellow flowers; blue on purple flowers) varies by patch.'),
    ],
    notes: [
      'Riviere Walk. Connects to the Berry Fields and Connecting Cave. Verified per Bulbapedia (Route 7 page).',
      'Volbeat and Illumise both appear in both versions per Bulbapedia (no version split).',
      'Spritzee/Swirlix are the canonical Route 7 X/Y version exclusives.',
      'TODO: Populate horde encounters if tracker adds horde support.',
      'Skiddo and Combee are NOT canonical Route 7 encounters per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-connecting-cave',
    displayName: 'Connecting Cave',
    encounters: [
      encounter('Zubat', ['Poison', 'Flying'], 'cave'),
      encounter('Whismur', ['Normal'], 'cave'),
      encounter('Meditite', ['Fighting', 'Psychic'], 'cave'),
      encounter('Axew', ['Dragon'], 'cave', 'Both', 'Rare cave encounter (10% rate) inside Connecting Cave.'),
    ],
    notes: [
      'Zubat Roost. Single-path cave linking Route 7 and Route 8. Verified per Bulbapedia (Connecting Cave page).',
      'TODO: Populate horde encounters (Zubat/Whismur/Axew hordes are notable) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-route-8',
    displayName: 'Route 8',
    encounters: [
      encounter('Spoink', ['Psychic'], 'grass'),
      encounter('Zangoose', ['Normal'], 'grass', 'X', 'X-exclusive in singles; both appear together in hordes.'),
      encounter('Seviper', ['Poison'], 'grass', 'Y', 'Y-exclusive in singles; both appear together in hordes.'),
      encounter('Absol', ['Dark'], 'grass'),
      encounter('Bagon', ['Dragon'], 'grass'),
      encounter('Drifloon', ['Ghost', 'Flying'], 'grass'),
      encounter('Mienfoo', ['Fighting'], 'grass'),
      encounter('Inkay', ['Dark', 'Psychic'], 'grass'),
      // Surfing
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wailmer', ['Water']),
      // Fishing (Old Rod)
      fish('Luvdisc', ['Water'], 'Old Rod'),
      // Fishing (Good Rod) — version split
      fish('Shellder', ['Water'], 'Good Rod', 'X', 'X-exclusive Good Rod fishing encounter.'),
      fish('Staryu', ['Water'], 'Good Rod', 'Y', 'Y-exclusive Good Rod fishing encounter.'),
      fish('Skrelp', ['Poison', 'Water'], 'Good Rod', 'X', 'X-exclusive Good Rod fishing encounter.'),
      fish('Clauncher', ['Water'], 'Good Rod', 'Y', 'Y-exclusive Good Rod fishing encounter.'),
      // Fishing (Super Rod) — version split
      fish('Cloyster', ['Water', 'Ice'], 'Super Rod', 'X', 'X-exclusive Super Rod fishing encounter.'),
      fish('Starmie', ['Water', 'Psychic'], 'Super Rod', 'Y', 'Y-exclusive Super Rod fishing encounter.'),
      fish('Qwilfish', ['Water', 'Poison'], 'Super Rod'),
      fish('Dragalge', ['Poison', 'Dragon'], 'Super Rod', 'X', 'X-exclusive Super Rod fishing encounter.'),
      fish('Clawitzer', ['Water'], 'Super Rod', 'Y', 'Y-exclusive Super Rod fishing encounter.'),
      // Rock Smash
      rockSmash('Dwebble', ['Bug', 'Rock']),
      rockSmash('Binacle', ['Rock', 'Water']),
    ],
    notes: [
      'Muraille Coast. Coastal route leading from Connecting Cave to Ambrette Town. Verified per Bulbapedia (Route 8 page).',
      'Zangoose (X) vs Seviper (Y) is the canonical singles version split. Fishing has multiple X/Y exclusives — see entries.',
      'Rock Smash encounters use method "special" with condition "Rock Smash" so they are clearly distinct from grass.',
      'TODO: Populate horde encounters if tracker adds horde support.',
      'Bunnelby and Wingull (singles) are NOT canonical Route 8 grass encounters per Bulbapedia; Wingull is horde-only.',
    ],
  },
  {
    locationId: 'xy-ambrette-town',
    displayName: 'Ambrette Town',
    encounters: [
      // Surfing (off the town's beach)
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wailmer', ['Water']),
      // Fishing
      fish('Luvdisc', ['Water'], 'Old Rod'),
      fish('Horsea', ['Water'], 'Good Rod'),
      fish('Skrelp', ['Poison', 'Water'], 'Good Rod', 'X', 'X-exclusive Good Rod fishing encounter (Skrelp is X-exclusive in Gen 6).'),
      fish('Clauncher', ['Water'], 'Good Rod', 'Y', 'Y-exclusive Good Rod fishing encounter (Clauncher is Y-exclusive in Gen 6).'),
      fish('Seadra', ['Water'], 'Super Rod'),
      fish('Relicanth', ['Water', 'Rock'], 'Super Rod'),
      fish('Dragalge', ['Poison', 'Dragon'], 'Super Rod', 'X', 'X-exclusive Super Rod fishing encounter (Skrelp line is X-exclusive).'),
      fish('Clawitzer', ['Water'], 'Super Rod', 'Y', 'Y-exclusive Super Rod fishing encounter (Clauncher line is Y-exclusive).'),
      // Rock Smash
      rockSmash('Dwebble', ['Bug', 'Rock']),
      rockSmash('Binacle', ['Rock', 'Water']),
    ],
    notes: [
      'No wild grass encounters in Ambrette Town. Verified per Bulbapedia (Ambrette Town page).',
      'Skrelp/Dragalge are X-exclusive; Clauncher/Clawitzer are Y-exclusive — consistent with Gen 6 canon and matches Route 8 / Cyllage City rod tables.',
      'TODO: Verify whether fossil restoration (Sail Fossil -> Amaura, Jaw Fossil -> Tyrunt) is tracked here as a gift/static encounter; current tracker schema convention for fossils is unverified.',
    ],
  },
  {
    locationId: 'xy-glittering-cave',
    displayName: 'Glittering Cave',
    encounters: [
      encounter('Machop', ['Fighting'], 'cave'),
      encounter('Onix', ['Rock', 'Ground'], 'cave'),
      encounter('Cubone', ['Ground'], 'cave'),
      encounter('Rhyhorn', ['Ground', 'Rock'], 'cave'),
      encounter('Kangaskhan', ['Normal'], 'cave'),
      encounter('Mawile', ['Steel', 'Fairy'], 'cave'),
      encounter('Lunatone', ['Rock', 'Psychic'], 'cave'),
      encounter('Solrock', ['Rock', 'Psychic'], 'cave'),
      // Rock Smash
      rockSmash('Onix', ['Rock', 'Ground']),
      rockSmash('Dwebble', ['Bug', 'Rock']),
    ],
    notes: [
      'Cave entered from Ambrette Town side; Team Flare event area lies deeper inside. Verified per Bulbapedia (Glittering Cave page).',
      'Neither Mawile nor Sableye is version-exclusive here per Bulbapedia; both Lunatone and Solrock appear in both versions.',
      'TODO: Verify whether Sail/Jaw fossil pickups are tracked as static encounters in this location.',
      'TODO: Populate ceiling-ambush encounters (Woobat, Ferroseed) when schema supports them.',
      'TODO: Populate horde encounters if tracker adds horde support.',
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
    locationId: 'xy-cyllage-city',
    displayName: 'Cyllage City',
    encounters: [
      // Surfing (off the city's coast)
      surf('Tentacool', ['Water', 'Poison']),
      surf('Wailmer', ['Water']),
      // Fishing
      fish('Luvdisc', ['Water'], 'Old Rod'),
      fish('Horsea', ['Water'], 'Good Rod'),
      fish('Skrelp', ['Poison', 'Water'], 'Good Rod', 'X', 'X-exclusive Good Rod fishing encounter.'),
      fish('Clauncher', ['Water'], 'Good Rod', 'Y', 'Y-exclusive Good Rod fishing encounter.'),
      fish('Seadra', ['Water'], 'Super Rod'),
      fish('Relicanth', ['Water', 'Rock'], 'Super Rod'),
      fish('Dragalge', ['Poison', 'Dragon'], 'Super Rod', 'X', 'X-exclusive Super Rod fishing encounter.'),
      fish('Clawitzer', ['Water'], 'Super Rod', 'Y', 'Y-exclusive Super Rod fishing encounter.'),
      // Rock Smash
      rockSmash('Onix', ['Rock', 'Ground']),
      rockSmash('Dwebble', ['Bug', 'Rock']),
      rockSmash('Binacle', ['Rock', 'Water'], 'X', 'Bulbapedia lists Binacle as X-only at Cyllage; verify if Y also has it.'),
    ],
    notes: [
      'Home of Grant\'s Rock-type gym (Gym 2). No wild grass encounters. Verified per Bulbapedia (Cyllage City page).',
      'Skrelp/Dragalge (X) vs Clauncher/Clawitzer (Y) is the canonical Gen 6 fishing version split.',
    ],
  },
  {
    locationId: 'xy-route-10',
    displayName: 'Route 10',
    encounters: [
      encounter('Eevee', ['Normal'], 'grass'),
      encounter('Snubbull', ['Fairy'], 'grass'),
      encounter('Houndour', ['Dark', 'Fire'], 'grass', 'X', 'X-exclusive wild encounter.'),
      encounter('Electrike', ['Electric'], 'grass', 'Y', 'Y-exclusive wild encounter.'),
      encounter('Sigilyph', ['Psychic', 'Flying'], 'grass'),
      encounter('Emolga', ['Electric', 'Flying'], 'grass'),
      encounter('Golett', ['Ground', 'Ghost'], 'grass'),
      encounter('Hawlucha', ['Fighting', 'Flying'], 'grass'),
    ],
    notes: [
      'Menhir Trail. Short rocky path between Cyllage City and Geosenge Town. Verified per Bulbapedia (Route 10 page).',
      'Houndour (X) vs Electrike (Y) is the canonical version split.',
      'Yellow flower patch has the same species set with adjusted rates.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-geosenge-town',
    displayName: 'Geosenge Town',
    encounters: [],
    notes: [
      'No wild grass encounters in Geosenge Town. Contains the Team Flare HQ entrance (locked until late game).',
    ],
  },
  {
    locationId: 'xy-route-11',
    displayName: 'Route 11',
    encounters: [
      encounter('Nidorina', ['Poison'], 'grass'),
      encounter('Nidorino', ['Poison'], 'grass'),
      encounter('Hariyama', ['Fighting'], 'grass'),
      encounter('Staravia', ['Normal', 'Flying'], 'grass'),
      encounter('Chingling', ['Psychic'], 'grass'),
      encounter('Stunky', ['Poison', 'Dark'], 'grass'),
      encounter('Sawk', ['Fighting'], 'grass', 'X', 'X-exclusive wild encounter.'),
      encounter('Throh', ['Fighting'], 'grass', 'Y', 'Y-exclusive wild encounter.'),
      encounter('Dedenne', ['Electric', 'Fairy'], 'grass'),
    ],
    notes: [
      'Miroir Way. Connects Geosenge Town to Reflection Cave. Verified per Bulbapedia (Route 11 page).',
      'Sawk (X) vs Throh (Y) is the canonical version split. Nidorina/Nidorino rates differ by version but both appear in both.',
      'TODO: Populate horde encounters if tracker adds horde support.',
      'MimeJr and Bonsly are NOT canonical Route 11 encounters per Bulbapedia (MimeJr appears in Reflection Cave hordes).',
    ],
  },
  {
    locationId: 'xy-reflection-cave',
    displayName: 'Reflection Cave',
    encounters: [
      encounter('MrMime', ['Psychic', 'Fairy'], 'cave'),
      encounter('Wobbuffet', ['Psychic'], 'cave'),
      encounter('Sableye', ['Dark', 'Ghost'], 'cave'),
      encounter('Chingling', ['Psychic'], 'cave'),
      encounter('Roggenrola', ['Rock'], 'cave'),
      encounter('Solosis', ['Psychic'], 'cave'),
      encounter('Carbink', ['Rock', 'Fairy'], 'cave', 'Both', 'Rare cave encounter inside Reflection Cave.'),
    ],
    notes: [
      'Mirror-themed cave between Route 11 and Shalour City. Verified per Bulbapedia (Reflection Cave page).',
      'Solosis appears in both versions per Bulbapedia. Gothita does NOT appear in Reflection Cave.',
      'TODO: Populate ceiling-ambush encounters (Woobat, Ferroseed) when schema supports them.',
      'TODO: Populate horde encounters (MimeJr/Roggenrola/Carbink hordes are notable) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-shalour-city',
    displayName: 'Shalour City',
    encounters: [],
    notes: [
      'No wild grass encounters in Shalour City. Home of Korrina\'s Fighting-type gym (Gym 3).',
      'TODO: Populate fishing encounters.',
      'TODO: Populate surfing encounters.',
    ],
  },
  {
    locationId: 'xy-tower-of-mastery',
    displayName: 'Tower of Mastery',
    encounters: [],
    notes: [
      'No wild encounters inside Tower of Mastery. Site of the Korrina Mega Evolution story event.',
    ],
  },
  {
    locationId: 'xy-route-12',
    displayName: 'Route 12',
    encounters: [
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Exeggcute', ['Grass', 'Psychic'], 'grass'),
      encounter('Pinsir', ['Bug'], 'grass', 'X', 'X-exclusive wild encounter.'),
      encounter('Heracross', ['Bug', 'Fighting'], 'grass', 'Y', 'Y-exclusive wild encounter.'),
      encounter('Tauros', ['Normal'], 'grass'),
      encounter('Miltank', ['Normal'], 'grass'),
      encounter('Pachirisu', ['Electric'], 'grass'),
      encounter('Chatot', ['Normal', 'Flying'], 'grass'),
      // Surfing
      surf('Tentacool', ['Water', 'Poison']),
      surf('Lapras', ['Water', 'Ice'], 'Both', 'Rare 1% surf encounter at level 27.'),
      surf('Mantyke', ['Water', 'Flying']),
      // Rock Smash
      rockSmash('Dwebble', ['Bug', 'Rock']),
      rockSmash('Binacle', ['Rock', 'Water']),
    ],
    notes: [
      'Fourrage Road. Connects Shalour City to Coumarine City; Azure Bay is accessible from this route. Verified per Bulbapedia (Route 12 page).',
      'Pinsir (X) vs Heracross (Y) is the canonical version split. Tauros and Miltank appear in BOTH versions per Bulbapedia.',
      'TODO: Populate horde encounters if tracker adds horde support.',
      'Mareep and Skiddo are NOT canonical Route 12 grass encounters per Bulbapedia (Mareep is horde-only).',
    ],
  },
  {
    locationId: 'xy-coumarine-city',
    displayName: 'Coumarine City',
    encounters: [],
    notes: [
      'No wild grass encounters in Coumarine City. Home of Ramos\' Grass-type gym (Gym 4).',
      'TODO: Populate fishing encounters.',
      'TODO: Populate surfing encounters.',
    ],
  },
  {
    locationId: 'xy-azure-bay',
    displayName: 'Azure Bay',
    encounters: [
      // Grass (Sea Spirit's Den island)
      encounter('Slowpoke', ['Water', 'Psychic'], 'grass'),
      encounter('Exeggcute', ['Grass', 'Psychic'], 'grass'),
      encounter('Chatot', ['Normal', 'Flying'], 'grass'),
      encounter('Inkay', ['Dark', 'Psychic'], 'grass'),
      // Surfing
      surf('Tentacool', ['Water', 'Poison']),
      surf('Lapras', ['Water', 'Ice'], 'Both', 'Rare 1% surf encounter at level 27 — highly desirable Nuzlocke target.'),
      surf('Mantyke', ['Water', 'Flying']),
      // Fishing
      fish('Luvdisc', ['Water'], 'Old Rod'),
      fish('Chinchou', ['Water', 'Electric'], 'Good Rod'),
      fish('Remoraid', ['Water'], 'Good Rod'),
      fish('Lanturn', ['Water', 'Electric'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter.'),
      fish('Octillery', ['Water'], 'Super Rod'),
      fish('Alomomola', ['Water'], 'Super Rod'),
      // Rock Smash
      rockSmash('Dwebble', ['Bug', 'Rock']),
      rockSmash('Binacle', ['Rock', 'Water']),
    ],
    notes: [
      'Open-water area south of Route 12 reachable by Surf. Sea Spirit\'s Den (small grass island) carries the grass encounters. Verified per Bulbapedia (Azure Bay page).',
      'Lapras is a notable 1% rare surf encounter — flag for Nuzlocke prep.',
      'TODO: Populate horde encounters (Slowpoke/Exeggcute/Wingull) if tracker adds horde support.',
      'TODO: Verify legendary/roaming encounter handling (Articuno/Zapdos/Moltres may roam through this area depending on starter choice).',
    ],
  },
  {
    locationId: 'xy-route-13',
    displayName: 'Route 13',
    encounters: [
      encounter('Trapinch', ['Ground'], 'grass'),
      encounter('Helioptile', ['Electric', 'Normal'], 'grass'),
    ],
    notes: [
      'Lumiose Badlands. Sandy/desert route east of Coumarine; Kalos Power Plant lies at the end.',
      'TODO: Verify additional Route 13 sand-patch species (Diggersby, Gible candidates).',
      'TODO: Verify whether dust-cloud encounters yield Pokemon or items only in this schema.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-kalos-power-plant',
    displayName: 'Kalos Power Plant',
    encounters: [],
    notes: [
      'No standard wild encounters inside the Kalos Power Plant. Site of a required Team Flare story event.',
      'TODO: Verify whether any static/special encounters should be tracked here.',
    ],
  },
  {
    locationId: 'xy-route-14',
    displayName: 'Route 14',
    encounters: [
      encounter('Weepinbell', ['Grass', 'Poison'], 'grass'),
      encounter('Haunter', ['Ghost', 'Poison'], 'grass'),
      encounter('Quagsire', ['Water', 'Ground'], 'grass'),
      encounter('Skorupi', ['Poison', 'Bug'], 'grass'),
      encounter('Carnivine', ['Grass'], 'grass'),
      encounter('Karrablast', ['Bug'], 'grass'),
      encounter('Shelmet', ['Bug'], 'grass'),
      encounter('Goomy', ['Dragon'], 'grass'),
      // Surfing
      surf('Quagsire', ['Water', 'Ground']),
      surf('Stunfisk', ['Ground', 'Electric']),
      surf('Goomy', ['Dragon']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Good Rod'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      'Laverre Nature Trail. Swampy route leading north into Laverre City. Verified per Bulbapedia (Route 14 page).',
      'Phantump/Pumpkaboo are NOT canonical Route 14 encounters per Bulbapedia (they appear on Route 16 / Pokémon Village area).',
      'Croagunk is NOT a canonical Route 14 wild encounter per Bulbapedia.',
      'Swamp area is reached via Surf; encounter list overlaps significantly with the standard grass list and is consolidated here.',
      'TODO: Populate horde encounters (Ekans, Bellsprout, Skorupi) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-laverre-city',
    displayName: 'Laverre City',
    encounters: [],
    notes: [
      'No wild grass encounters in Laverre City. Home of Valerie\'s Fairy-type gym and the Poké Ball Factory.',
      'TODO: Populate fishing encounters.',
    ],
  },
  {
    locationId: 'xy-poke-ball-factory',
    displayName: 'Poké Ball Factory',
    encounters: [],
    notes: [
      'No wild encounters inside the Poké Ball Factory. Site of a required Team Flare story event.',
    ],
  },
  {
    locationId: 'xy-route-15',
    displayName: 'Route 15',
    encounters: [
      encounter('Mightyena', ['Dark'], 'grass', 'X', 'X-exclusive wild encounter.'),
      encounter('Liepard', ['Dark'], 'grass', 'Y', 'Y-exclusive wild encounter.'),
      encounter('Skorupi', ['Poison', 'Bug'], 'grass'),
      encounter('Foongus', ['Grass', 'Poison'], 'grass'),
      encounter('Watchog', ['Normal'], 'grass'),
      encounter('Pawniard', ['Dark', 'Steel'], 'grass'),
      encounter('Klefki', ['Steel', 'Fairy'], 'grass'),
      // Surfing
      surf('Lombre', ['Water', 'Grass']),
      surf('Floatzel', ['Water']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y (treated as one species in this schema).'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
    ],
    notes: [
      'Brun Way. Connects Laverre City area to the Lost Hotel. Verified per Bulbapedia (Route 15 page).',
      'Mightyena (X) vs Liepard (Y) is the canonical version split.',
      'TODO: Populate horde encounters if tracker adds horde support.',
      'Sneasel is NOT a canonical Route 15 encounter per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-lost-hotel',
    displayName: 'Lost Hotel',
    encounters: [
      encounter('Magneton', ['Electric', 'Steel'], 'cave'),
      encounter('Electrode', ['Electric'], 'cave'),
      encounter('Litwick', ['Ghost', 'Fire'], 'cave'),
      encounter('Pawniard', ['Dark', 'Steel'], 'cave'),
      encounter('Klefki', ['Steel', 'Fairy'], 'cave'),
      encounter('Trubbish', ['Poison'], 'special', 'Both', 'Daily shaking-trash-can encounter; appears at lv 35 with 80% rate.'),
      encounter('Garbodor', ['Poison'], 'special', 'Both', 'Daily shaking-trash-can encounter; appears at lv 36-38 with 20% rate.'),
      encounter('Rotom', ['Electric', 'Ghost'], 'static', 'Both', 'Tuesday-only shaking-trash-can encounter; appears at lv 38. Each of 5 forms (standard/Heat/Wash/Frost/Fan/Mow) has its own appearance.'),
    ],
    notes: [
      'Abandoned hotel between Route 15 and Route 16. Verified per Bulbapedia (Lost Hotel page).',
      'Cave-method species are the standard B1F walking encounters.',
      'Trubbish/Garbodor are daily shaking-trash-can encounters (using the special method as a closest schema fit).',
      'Rotom is Tuesday-only via shaking trash cans, lv 38.',
    ],
  },
  {
    locationId: 'xy-route-16',
    displayName: 'Route 16',
    encounters: [
      encounter('Houndour', ['Dark', 'Fire'], 'grass'),
    ],
    notes: [
      'Mélancolie Path. Leads from the Lost Hotel area toward Dendemille Town.',
      'TODO: Verify additional Route 16 grass species (Phantump/Pumpkaboo, Foongus, Floette candidates).',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-dendemille-town',
    displayName: 'Dendemille Town',
    encounters: [],
    notes: [
      'No wild grass encounters in Dendemille Town.',
      'TODO: Populate fishing encounters.',
    ],
  },
  {
    locationId: 'xy-frost-cavern',
    displayName: 'Frost Cavern',
    encounters: [
      encounter('Haunter', ['Ghost', 'Poison'], 'cave'),
      encounter('Jynx', ['Ice', 'Psychic'], 'cave'),
      encounter('Piloswine', ['Ice', 'Ground'], 'cave'),
      encounter('Beartic', ['Ice'], 'cave'),
      encounter('Cryogonal', ['Ice'], 'cave'),
      encounter('Bergmite', ['Ice'], 'cave'),
      // Surfing (inside cave water sections)
      surf('Poliwhirl', ['Water']),
      surf('Floatzel', ['Water']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
    ],
    notes: [
      'Ice cave north of Dendemille Town; site of a required Team Flare event. Verified per Bulbapedia (Frost Cavern page).',
      'The story Abomasnow is an NPC battle (Team Flare-controlled); not a catchable wild encounter. The reward is Abomasite, not the Pokémon. Not tracked as an encounter.',
      'Cubchoo/Vanillite/Smoochum are HORDE encounters per Bulbapedia, not standard walking.',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-route-17',
    displayName: 'Route 17',
    encounters: [
      encounter('Snover', ['Grass', 'Ice'], 'grass'),
      encounter('Delibird', ['Ice', 'Flying'], 'grass'),
    ],
    notes: [
      'Mamoswine Road. Player traverses on a borrowed Mamoswine; encounters are limited.',
      'TODO: Verify additional Route 17 species (Smoochum, Cubchoo candidates).',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-anistar-city',
    displayName: 'Anistar City',
    encounters: [],
    notes: [
      'No wild grass encounters in Anistar City. Home of Olympia\'s Psychic-type gym.',
      'TODO: Populate fishing encounters.',
      'TODO: Populate surfing encounters.',
    ],
  },
  {
    locationId: 'xy-route-18',
    displayName: 'Route 18',
    encounters: [
      encounter('Dwebble', ['Bug', 'Rock'], 'grass'),
    ],
    notes: [
      'Vallée Étroite Way. Short rocky route between Anistar City and Couriway Town; Terminus Cave is accessible from here.',
      'TODO: Verify additional Route 18 species (Pawniard, Helioptile, Mawile/Sableye version split candidates).',
      'TODO: Populate horde encounters if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-terminus-cave',
    displayName: 'Terminus Cave',
    encounters: [
      encounter('Sandslash', ['Ground'], 'cave'),
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Pupitar', ['Rock', 'Ground'], 'cave', 'X', 'X-exclusive cave encounter.'),
      encounter('Lairon', ['Steel', 'Rock'], 'cave', 'Y', 'Y-exclusive cave encounter.'),
      encounter('Durant', ['Bug', 'Steel'], 'cave'),
      encounter('Zygarde', ['Dragon', 'Ground'], 'legendary', 'Both', 'Static legendary encounter deep inside Terminus Cave at level 70. Appears after entering the Hall of Fame; respawns on subsequent Hall of Fame entries if defeated/run from. Coded to never be shiny. Moves: Crunch, Earthquake, Camouflage, Dragon Pulse. Ability: Aura Break.'),
      // Rock Smash
      rockSmash('Graveler', ['Rock', 'Ground']),
      rockSmash('Shuckle', ['Bug', 'Rock'], 'Both', 'Rare 5% Rock Smash encounter inside Terminus Cave.'),
    ],
    notes: [
      'Optional cave south of Route 18. Site of the Zygarde static legendary encounter (post-Elite Four only). Verified per Bulbapedia (Terminus Cave page).',
      'Pupitar (X) vs Lairon (Y) is the canonical version split.',
      'TODO: Populate ceiling-ambush encounters (Ariados, Noibat).',
      'TODO: Populate horde encounters (Geodude, Larvitar X-only, Aron Y-only, Durant) if tracker adds horde support.',
      'Onix is NOT a canonical Terminus Cave wild encounter per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-couriway-town',
    displayName: 'Couriway Town',
    encounters: [
      // Surfing
      surf('Lombre', ['Water', 'Grass']),
      surf('Floatzel', ['Water']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Blue-Striped in X, Red-Striped in Y at Super Rod level (per Bulbapedia).'),
    ],
    notes: [
      'No wild grass encounters in Couriway Town itself. Verified per Bulbapedia (Couriway Town page).',
      'TODO: Verify Basculin Red/Blue Striped form alternation between Good Rod and Super Rod tables.',
    ],
  },
  {
    locationId: 'xy-route-19',
    displayName: 'Route 19',
    encounters: [
      encounter('Weepinbell', ['Grass', 'Poison'], 'grass'),
      encounter('Haunter', ['Ghost', 'Poison'], 'grass'),
      encounter('Quagsire', ['Water', 'Ground'], 'grass'),
      encounter('Drapion', ['Poison', 'Dark'], 'grass'),
      encounter('Carnivine', ['Grass'], 'grass'),
      encounter('Karrablast', ['Bug'], 'grass'),
      encounter('Shelmet', ['Bug'], 'grass'),
      encounter('Sliggoo', ['Dragon'], 'grass'),
      // Surfing
      surf('Quagsire', ['Water', 'Ground']),
      surf('Stunfisk', ['Ground', 'Electric']),
      surf('Sliggoo', ['Dragon']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Barboach', ['Water', 'Ground'], 'Good Rod'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Politoed', ['Water'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter at level 50.'),
      fish('Whiscash', ['Water', 'Ground'], 'Super Rod'),
    ],
    notes: [
      'Grande Vallée Way. Long valley route between Couriway Town and Snowbelle City. Verified per Bulbapedia (Route 19 page).',
      'Yellow and purple flower patches have the same species set with adjusted rates.',
      'Swamp encounters (via Surf) overlap with the grass list and are consolidated here.',
      'TODO: Populate horde encounters (Arbok, Weepinbell, Gligar) if tracker adds horde support.',
      'Mienfoo is NOT a canonical Route 19 encounter per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-snowbelle-city',
    displayName: 'Snowbelle City',
    encounters: [],
    notes: [
      'No wild grass encounters in Snowbelle City. Home of Wulfric\'s Ice-type gym.',
      'TODO: Populate fishing encounters.',
    ],
  },
  {
    locationId: 'xy-lysandre-labs',
    displayName: 'Lysandre Labs',
    encounters: [],
    notes: [
      'No wild encounters inside Lysandre Labs in Lumiose City. Required late-game Team Flare story dungeon.',
    ],
  },
  {
    locationId: 'xy-team-flare-secret-hq',
    displayName: 'Team Flare Secret HQ',
    encounters: [],
    notes: [
      'No standard wild encounters inside the Team Flare Secret HQ in Geosenge Town. Site of the Xerneas (X) / Yveltal (Y) static legendary encounter.',
      'TODO: Verify static legendary encounter placement (Xerneas/Yveltal) vs separate boss-entry treatment in this tracker convention.',
    ],
  },
  {
    locationId: 'xy-route-20',
    displayName: 'Route 20',
    encounters: [
      encounter('Jigglypuff', ['Normal', 'Fairy'], 'grass'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass'),
      encounter('Zoroark', ['Dark'], 'grass'),
      encounter('Gothorita', ['Psychic'], 'grass'),
      encounter('Amoonguss', ['Grass', 'Poison'], 'grass'),
      encounter('Trevenant', ['Ghost', 'Grass'], 'grass'),
    ],
    notes: [
      'Winding Woods. Forest route leading from Snowbelle City to Pokémon Village. Verified per Bulbapedia (Route 20 page).',
      'Standard tall grass and red flower patches share the same species set with adjusted rates.',
      'TODO: Populate horde encounters (Foongus, Trevenant, Sudowoodo) if tracker adds horde support.',
      'Phantump, Pumpkaboo, and Carbink are NOT canonical Route 20 encounters per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-pokemon-village',
    displayName: 'Pokémon Village',
    encounters: [
      encounter('Jigglypuff', ['Normal', 'Fairy'], 'grass'),
      encounter('Ditto', ['Normal'], 'grass'),
      encounter('Noctowl', ['Normal', 'Flying'], 'grass'),
      encounter('Zoroark', ['Dark'], 'grass'),
      encounter('Gothorita', ['Psychic'], 'grass'),
      encounter('Amoonguss', ['Grass', 'Poison'], 'grass'),
      encounter('Garbodor', ['Poison'], 'special', 'Both', 'Daily shaking-trash-can encounter; 100% rate at lv 46-50.'),
      encounter('Banette', ['Ghost'], 'special', 'Both', 'Thursday-only shaking-trash-can encounter; 100% rate at lv 46-50.'),
      // Surfing
      surf('Poliwhirl', ['Water']),
      surf('Lombre', ['Water', 'Grass']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
    ],
    notes: [
      'Hidden village deep in the woods. Site of the AZ/Floette story event. Verified per Bulbapedia (Pokémon Village page).',
      'Yellow and purple flower patches share the same grass species set with adjusted rates.',
      'TODO: Populate horde encounters (Poliwag, Lombre, Foongus) if tracker adds horde support.',
      'Lombre appears as both Surf and Horde encounter, NOT as a grass walking encounter, per Bulbapedia.',
    ],
  },
  {
    locationId: 'xy-route-21',
    displayName: 'Route 21',
    encounters: [
      encounter('Scyther', ['Bug', 'Flying'], 'grass'),
      encounter('Ursaring', ['Normal'], 'grass'),
      encounter('Spinda', ['Normal'], 'grass'),
      encounter('Altaria', ['Dragon', 'Flying'], 'grass'),
      encounter('Floatzel', ['Water'], 'grass'),
      // Surfing
      surf('Lombre', ['Water', 'Grass']),
      surf('Floatzel', ['Water']),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Dratini', ['Dragon'], 'Good Rod', 'Both', 'Rare 5% Good Rod encounter.'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Dragonair', ['Dragon'], 'Super Rod', 'Both', 'Rare 5% Super Rod encounter.'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
    ],
    notes: [
      'Dernière Way. Short route between Pokémon Village and Victory Road. Verified per Bulbapedia (Route 21 page).',
      'Purple and red flower patches share the same species set with adjusted rates.',
      'TODO: Populate horde encounters (Scyther, Spinda, Swablu) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-victory-road',
    displayName: 'Victory Road',
    encounters: [
      encounter('Graveler', ['Rock', 'Ground'], 'cave'),
      encounter('Haunter', ['Ghost', 'Poison'], 'cave'),
      encounter('Lickitung', ['Normal'], 'cave'),
      encounter('Gurdurr', ['Fighting'], 'cave'),
      encounter('Druddigon', ['Dragon'], 'cave'),
      encounter('Zweilous', ['Dark', 'Dragon'], 'cave'),
      // Surfing (outdoor + indoor sections, consolidated)
      surf('Lombre', ['Water', 'Grass'], 'Both', 'Outdoor section.'),
      surf('Floatzel', ['Water']),
      surf('Poliwhirl', ['Water'], 'Both', 'Indoor (cave) section.'),
      // Fishing
      fish('Poliwag', ['Water'], 'Old Rod'),
      fish('Poliwhirl', ['Water'], 'Good Rod'),
      fish('Basculin', ['Water'], 'Good Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      fish('Poliwhirl', ['Water'], 'Super Rod'),
      fish('Poliwrath', ['Water', 'Fighting'], 'Super Rod', 'Both', 'Super Rod only.'),
      fish('Basculin', ['Water'], 'Super Rod', 'Both', 'Red-Striped in X, Blue-Striped in Y.'),
      // Rock Smash
      rockSmash('Graveler', ['Rock', 'Ground']),
      rockSmash('Shuckle', ['Bug', 'Rock'], 'Both', 'Rare 5% Rock Smash encounter.'),
    ],
    notes: [
      'Multi-area dungeon between Route 21 and the Pokémon League. Cave-interior walking encounters listed above (levels 57-59). Verified per Bulbapedia (Victory Road Kalos page).',
      'Sky encounters (Fearow ~77%, Skarmory ~18%, Hydreigon ~5%) and ceiling-ambush drops (Graveler, Ariados, Noibat) are separate subareas not represented by this schema.',
      'Surfing is split between outdoor (Lombre/Floatzel) and indoor cave (Poliwhirl/Floatzel) subareas; consolidated here.',
      'TODO: Populate sky encounters when schema supports them (Fearow/Skarmory/Hydreigon).',
      'TODO: Populate ceiling-ambush encounters when schema supports them.',
      'TODO: Populate horde encounters (Geodude/Graveler/Lickitung/Floatzel) if tracker adds horde support.',
    ],
  },
  {
    locationId: 'xy-pokemon-league',
    displayName: 'Pokémon League',
    encounters: [],
    notes: [
      'No wild encounters inside the Pokémon League building. Site of the Elite Four and Champion battles.',
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
        ...(item.rod ? { rod: item.rod } : {}),
        ...(item.condition ? { condition: item.condition } : {}),
        // Preserve version exclusivity for UI chip rendering; only set when X/Y-specific.
        ...(item.version === 'X' || item.version === 'Y' ? { version: item.version } : {}),
      }));

    acc[area.displayName] = options;
    return acc;
  }, {});
}
