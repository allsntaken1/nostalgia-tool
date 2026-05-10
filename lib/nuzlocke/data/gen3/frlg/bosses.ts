import type { BossTrainer } from '@/lib/nuzlocke/data/gen8/types';
import { frlgLevelCaps } from './levelCaps';

type FrlgBossCategory = 'rival' | 'gym' | 'evil-team' | 'elite-four' | 'champion';
type FrlgBossPokemon = NonNullable<BossTrainer['team']>[number];
type FrlgMove = NonNullable<FrlgBossPokemon['moves']>[number];

const cap = (id: string, fallback: number) => frlgLevelCaps.find((item) => item.id === id)?.cap ?? fallback;
const mv = (name: string, type: FrlgMove['type'], power: number | null = null): FrlgMove => ({ name, type, power });
const mon = (species: string, level: number, types: FrlgBossPokemon['types'], extras: Partial<FrlgBossPokemon> = {}): FrlgBossPokemon => ({ species, level, types, ...extras });

const boss = ({
  id,
  name,
  locationId,
  location,
  order,
  category,
  levelCap,
  team,
  variantsByRivalStarterChoice,
  notes,
}: {
  id: string;
  name: string;
  locationId: string;
  location: string;
  order: number;
  category: FrlgBossCategory;
  levelCap?: number;
  team?: FrlgBossPokemon[];
  variantsByRivalStarterChoice?: BossTrainer['variantsByRivalStarterChoice'];
  notes?: string;
}): BossTrainer => ({
  id,
  name,
  category,
  game: 'Both',
  location,
  recommendedOrder: order,
  levelCap,
  notes: notes ?? (team?.length ? location : `FRLG skeleton boss at ${location}. Full team data coming later.`),
  progressionStage: locationId,
  baseTeam: team ?? [],
  ...(category === 'rival'
    ? {
        variantsByRivalStarterChoice: variantsByRivalStarterChoice ?? {
          grass: [],
          fire: [],
          water: [],
        },
      }
    : {}),
});

export const frlgBosses: BossTrainer[] = [
  boss({
    id: 'rival-route-22-1-frlg',
    name: 'Rival 1',
    locationId: 'route-22',
    location: 'Route 22',
    order: 1,
    category: 'rival',
    levelCap: 9,
    team: [mon('Pidgey', 9, ['Normal', 'Flying'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Bulbasaur', 9, ['Grass', 'Poison'])],
      fire: [mon('Charmander', 9, ['Fire'])],
      water: [mon('Squirtle', 9, ['Water'])],
    },
  }),
  boss({
    id: 'brock-frlg',
    name: 'Brock',
    locationId: 'pewter-city',
    location: 'Pewter City',
    order: 2,
    category: 'gym',
    levelCap: cap('brock-frlg', 14),
    team: [mon('Geodude', 12, ['Rock', 'Ground']), mon('Onix', 14, ['Rock', 'Ground'])],
  }),
  boss({
    id: 'rival-cerulean-frlg',
    name: 'Rival 2',
    locationId: 'cerulean-city',
    location: 'Cerulean City',
    order: 3,
    category: 'rival',
    levelCap: 18,
    team: [mon('Pidgeotto', 17, ['Normal', 'Flying']), mon('Abra', 16, ['Psychic']), mon('Rattata', 15, ['Normal'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Bulbasaur', 18, ['Grass', 'Poison'])],
      fire: [mon('Charmander', 18, ['Fire'])],
      water: [mon('Squirtle', 18, ['Water'])],
    },
  }),
  boss({ id: 'misty-frlg', name: 'Misty', locationId: 'cerulean-city', location: 'Cerulean City', order: 4, category: 'gym', levelCap: cap('misty-frlg', 21), team: [mon('Staryu', 18, ['Water']), mon('Starmie', 21, ['Water', 'Psychic'])] }),
  boss({
    id: 'rival-ss-anne-frlg',
    name: 'Rival 3',
    locationId: 'ss-anne',
    location: 'S.S. Anne',
    order: 5,
    category: 'rival',
    levelCap: 20,
    team: [mon('Pidgeotto', 19, ['Normal', 'Flying']), mon('Raticate', 16, ['Normal']), mon('Kadabra', 18, ['Psychic'])],
    variantsByRivalStarterChoice: {
      grass: [mon('Ivysaur', 20, ['Grass', 'Poison'])],
      fire: [mon('Charmeleon', 20, ['Fire'])],
      water: [mon('Wartortle', 20, ['Water'])],
    },
  }),
  boss({ id: 'surge-frlg', name: 'Lt. Surge', locationId: 'vermilion-city', location: 'Vermilion City', order: 6, category: 'gym', levelCap: cap('surge-frlg', 24), team: [mon('Voltorb', 21, ['Electric']), mon('Pikachu', 18, ['Electric']), mon('Raichu', 24, ['Electric'])] }),
  boss({ id: 'giovanni-rocket-hideout-frlg', name: 'Giovanni 1', locationId: 'rocket-hideout', location: 'Rocket Hideout', order: 7, category: 'evil-team', levelCap: 29, team: [mon('Onix', 25, ['Rock', 'Ground']), mon('Rhyhorn', 24, ['Ground', 'Rock']), mon('Kangaskhan', 29, ['Normal'])] }),
  boss({ id: 'erika-frlg', name: 'Erika', locationId: 'celadon-city', location: 'Celadon City', order: 8, category: 'gym', levelCap: cap('erika-frlg', 29), team: [mon('Victreebel', 29, ['Grass', 'Poison']), mon('Tangela', 24, ['Grass']), mon('Vileplume', 29, ['Grass', 'Poison'])] }),
  boss({
    id: 'rival-pokemon-tower-frlg',
    name: 'Rival 4',
    locationId: 'pokemon-tower',
    location: 'Pokemon Tower',
    order: 9,
    category: 'rival',
    levelCap: 25,
    variantsByRivalStarterChoice: {
      grass: [
        mon('Pidgeotto', 25, ['Normal', 'Flying'], { ability: 'Keen Eye', moves: [mv('Wing Attack', 'Flying', 60), mv('Quick Attack', 'Normal', 40), mv('Sand Attack', 'Ground'), mv('Whirlwind', 'Normal')] }),
        mon('Gyarados', 23, ['Water', 'Flying'], { ability: 'Intimidate', moves: [mv('Bite', 'Dark', 60), mv('Dragon Rage', 'Dragon'), mv('Leer', 'Normal'), mv('Water Pulse', 'Water', 60)] }),
        mon('Growlithe', 22, ['Fire'], { ability: 'Intimidate', moves: [mv('Ember', 'Fire', 40), mv('Bite', 'Dark', 60), mv('Roar', 'Normal'), mv('Take Down', 'Normal', 90)] }),
        mon('Kadabra', 20, ['Psychic'], { ability: 'Synchronize', moves: [mv('Confusion', 'Psychic', 50), mv('Disable', 'Normal'), mv('Reflect', 'Psychic'), mv('Recover', 'Normal')] }),
        mon('Ivysaur', 25, ['Grass', 'Poison'], { ability: 'Overgrow', moves: [mv('Razor Leaf', 'Grass', 55), mv('Sleep Powder', 'Grass'), mv('Leech Seed', 'Grass'), mv('Vine Whip', 'Grass', 35)] }),
      ],
      fire: [
        mon('Pidgeotto', 25, ['Normal', 'Flying'], { ability: 'Keen Eye', moves: [mv('Wing Attack', 'Flying', 60), mv('Quick Attack', 'Normal', 40), mv('Sand Attack', 'Ground'), mv('Whirlwind', 'Normal')] }),
        mon('Gyarados', 23, ['Water', 'Flying'], { ability: 'Intimidate', moves: [mv('Bite', 'Dark', 60), mv('Dragon Rage', 'Dragon'), mv('Leer', 'Normal'), mv('Water Pulse', 'Water', 60)] }),
        mon('Exeggcute', 22, ['Grass', 'Psychic'], { ability: 'Chlorophyll', moves: [mv('Leech Seed', 'Grass'), mv('Confusion', 'Psychic', 50), mv('Stun Spore', 'Grass'), mv('Sleep Powder', 'Grass')] }),
        mon('Kadabra', 20, ['Psychic'], { ability: 'Synchronize', moves: [mv('Confusion', 'Psychic', 50), mv('Disable', 'Normal'), mv('Reflect', 'Psychic'), mv('Recover', 'Normal')] }),
        mon('Charmeleon', 25, ['Fire'], { ability: 'Blaze', moves: [mv('Ember', 'Fire', 40), mv('Metal Claw', 'Steel', 50), mv('Smokescreen', 'Normal'), mv('Dragon Rage', 'Dragon')] }),
      ],
      water: [
        mon('Pidgeotto', 25, ['Normal', 'Flying'], { ability: 'Keen Eye', moves: [mv('Wing Attack', 'Flying', 60), mv('Quick Attack', 'Normal', 40), mv('Sand Attack', 'Ground'), mv('Whirlwind', 'Normal')] }),
        mon('Growlithe', 23, ['Fire'], { ability: 'Intimidate', moves: [mv('Ember', 'Fire', 40), mv('Bite', 'Dark', 60), mv('Roar', 'Normal'), mv('Take Down', 'Normal', 90)] }),
        mon('Gyarados', 22, ['Water', 'Flying'], { ability: 'Intimidate', moves: [mv('Bite', 'Dark', 60), mv('Dragon Rage', 'Dragon'), mv('Leer', 'Normal'), mv('Water Pulse', 'Water', 60)] }),
        mon('Kadabra', 20, ['Psychic'], { ability: 'Synchronize', moves: [mv('Confusion', 'Psychic', 50), mv('Disable', 'Normal'), mv('Reflect', 'Psychic'), mv('Recover', 'Normal')] }),
        mon('Wartortle', 25, ['Water'], { ability: 'Torrent', moves: [mv('Water Pulse', 'Water', 60), mv('Bite', 'Dark', 60), mv('Withdraw', 'Water'), mv('Rapid Spin', 'Normal', 20)] }),
      ],
    },
  }),
  boss({
    id: 'koga-frlg',
    name: 'Koga',
    locationId: 'fuchsia-city',
    location: 'Fuchsia City',
    order: 10,
    category: 'gym',
    levelCap: cap('koga-frlg', 43),
    team: [
      mon('Koffing', 37, ['Poison'], { ability: 'Levitate', moves: [mv('Sludge', 'Poison', 65), mv('Smokescreen', 'Normal'), mv('Selfdestruct', 'Normal', 200), mv('Toxic', 'Poison')] }),
      mon('Muk', 39, ['Poison'], { ability: 'Stench', moves: [mv('Minimize', 'Normal'), mv('Acid Armor', 'Poison'), mv('Sludge', 'Poison', 65), mv('Toxic', 'Poison')] }),
      mon('Koffing', 37, ['Poison'], { ability: 'Levitate', moves: [mv('Sludge', 'Poison', 65), mv('Smokescreen', 'Normal'), mv('Selfdestruct', 'Normal', 200), mv('Toxic', 'Poison')] }),
      mon('Weezing', 43, ['Poison'], { ability: 'Levitate', moves: [mv('Sludge', 'Poison', 65), mv('Smokescreen', 'Normal'), mv('Toxic', 'Poison'), mv('Explosion', 'Normal', 250)] }),
    ],
  }),
  boss({
    id: 'sabrina-frlg',
    name: 'Sabrina',
    locationId: 'saffron-city',
    location: 'Saffron City',
    order: 11,
    category: 'gym',
    levelCap: cap('sabrina-frlg', 43),
    team: [
      mon('Kadabra', 38, ['Psychic'], { ability: 'Synchronize', moves: [mv('Psychic', 'Psychic', 90), mv('Calm Mind', 'Psychic'), mv('Reflect', 'Psychic'), mv('Recover', 'Normal')] }),
      mon('MrMime', 37, ['Psychic'], { ability: 'Soundproof', moves: [mv('Psychic', 'Psychic', 90), mv('Light Screen', 'Psychic'), mv('Reflect', 'Psychic'), mv('Baton Pass', 'Normal')] }),
      mon('Venomoth', 38, ['Bug', 'Poison'], { ability: 'Shield Dust', moves: [mv('Psychic', 'Psychic', 90), mv('Supersonic', 'Normal'), mv('Giga Drain', 'Grass', 60), mv('Toxic', 'Poison')] }),
      mon('Alakazam', 43, ['Psychic'], { ability: 'Synchronize', moves: [mv('Psychic', 'Psychic', 90), mv('Calm Mind', 'Psychic'), mv('Recover', 'Normal'), mv('Reflect', 'Psychic')] }),
    ],
  }),
  boss({
    id: 'blaine-frlg',
    name: 'Blaine',
    locationId: 'cinnabar-island',
    location: 'Cinnabar Island',
    order: 12,
    category: 'gym',
    levelCap: cap('blaine-frlg', 47),
    team: [
      mon('Growlithe', 42, ['Fire'], { ability: 'Intimidate', moves: [mv('Flamethrower', 'Fire', 95), mv('Take Down', 'Normal', 90), mv('Roar', 'Normal'), mv('Bite', 'Dark', 60)] }),
      mon('Ponyta', 40, ['Fire'], { ability: 'Run Away', moves: [mv('Fire Blast', 'Fire', 120), mv('Bounce', 'Flying', 85), mv('Take Down', 'Normal', 90), mv('Agility', 'Psychic')] }),
      mon('Rapidash', 42, ['Fire'], { ability: 'Run Away', moves: [mv('Flamethrower', 'Fire', 95), mv('Bounce', 'Flying', 85), mv('Agility', 'Psychic'), mv('Fire Spin', 'Fire', 15)] }),
      mon('Arcanine', 47, ['Fire'], { ability: 'Intimidate', moves: [mv('Flamethrower', 'Fire', 95), mv('ExtremeSpeed', 'Normal', 80), mv('Bite', 'Dark', 60), mv('Roar', 'Normal')] }),
    ],
  }),
  boss({
    id: 'giovanni-silph-frlg',
    name: 'Giovanni 2',
    locationId: 'silph-co',
    location: 'Silph Co.',
    order: 13,
    category: 'evil-team',
    levelCap: 41,
    team: [
      mon('Nidorino', 37, ['Poison'], { ability: 'Poison Point', moves: [mv('Double Kick', 'Fighting', 30), mv('Poison Sting', 'Poison', 15), mv('Fury Attack', 'Normal', 15), mv('Helping Hand', 'Normal')] }),
      mon('Kangaskhan', 35, ['Normal'], { ability: 'Early Bird', moves: [mv('Mega Punch', 'Normal', 80), mv('Tail Whip', 'Normal'), mv('Dizzy Punch', 'Normal', 70), mv('Rage', 'Normal', 20)] }),
      mon('Rhyhorn', 37, ['Ground', 'Rock'], { ability: 'Rock Head', moves: [mv('Rock Blast', 'Rock', 25), mv('Scary Face', 'Normal'), mv('Take Down', 'Normal', 90), mv('Earthquake', 'Ground', 100)] }),
      mon('Nidoqueen', 41, ['Poison', 'Ground'], { ability: 'Poison Point', moves: [mv('Body Slam', 'Normal', 85), mv('Earthquake', 'Ground', 100), mv('Toxic', 'Poison'), mv('Double Kick', 'Fighting', 30)] }),
    ],
  }),
  boss({
    id: 'giovanni-viridian-frlg',
    name: 'Giovanni 3',
    locationId: 'viridian-gym',
    location: 'Viridian Gym',
    order: 14,
    category: 'gym',
    levelCap: cap('giovanni-viridian-frlg', 50),
    team: [
      mon('Rhyhorn', 45, ['Ground', 'Rock'], { ability: 'Rock Head', moves: [mv('Earthquake', 'Ground', 100), mv('Rock Blast', 'Rock', 25), mv('Scary Face', 'Normal'), mv('Take Down', 'Normal', 90)] }),
      mon('Dugtrio', 42, ['Ground'], { ability: 'Arena Trap', moves: [mv('Earthquake', 'Ground', 100), mv('Slash', 'Normal', 70), mv('Sand Tomb', 'Ground', 15), mv('Rock Tomb', 'Rock', 50)] }),
      mon('Nidoqueen', 44, ['Poison', 'Ground'], { ability: 'Poison Point', moves: [mv('Earthquake', 'Ground', 100), mv('Body Slam', 'Normal', 85), mv('Toxic', 'Poison'), mv('Double Kick', 'Fighting', 30)] }),
      mon('Nidoking', 45, ['Poison', 'Ground'], { ability: 'Poison Point', moves: [mv('Earthquake', 'Ground', 100), mv('Thrash', 'Normal', 90), mv('Megahorn', 'Bug', 120), mv('Rock Tomb', 'Rock', 50)] }),
      mon('Rhydon', 50, ['Ground', 'Rock'], { ability: 'Rock Head', moves: [mv('Earthquake', 'Ground', 100), mv('Rock Tomb', 'Rock', 50), mv('Take Down', 'Normal', 90), mv('Megahorn', 'Bug', 120)] }),
    ],
  }),
  boss({ id: 'rival-route-22-5-frlg', name: 'Rival 5', locationId: 'route-22', location: 'Route 22', order: 15, category: 'rival' }),
  boss({ id: 'lorelei-frlg', name: 'Lorelei', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 16, category: 'elite-four', levelCap: cap('lorelei-frlg', 54) }),
  boss({ id: 'bruno-frlg', name: 'Bruno', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 17, category: 'elite-four', levelCap: cap('bruno-frlg', 56) }),
  boss({ id: 'agatha-frlg', name: 'Agatha', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 18, category: 'elite-four', levelCap: cap('agatha-frlg', 58) }),
  boss({ id: 'lance-frlg', name: 'Lance', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 19, category: 'elite-four', levelCap: cap('lance-frlg', 60) }),
  boss({ id: 'champion-rival-frlg', name: 'Champion Rival', locationId: 'indigo-plateau', location: 'Indigo Plateau', order: 20, category: 'champion', levelCap: cap('champion-rival-frlg', 63) }),
];
