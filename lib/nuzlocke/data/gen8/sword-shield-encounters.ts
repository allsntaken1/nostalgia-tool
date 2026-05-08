import type { Gen8EncounterArea } from './types';

export const swordShieldRouteEncounters: Gen8EncounterArea[] = [
  { location: 'Starter', encounters: [
    { species: 'Grookey', types: ['Grass'] },
    { species: 'Scorbunny', types: ['Fire'] },
    { species: 'Sobble', types: ['Water'] },
  ] },
  { location: 'Route 1', encounters: [
    { species: 'Wooloo', types: ['Normal'] },
    { species: 'Rookidee', types: ['Flying'] },
    { species: 'Skwovet', types: ['Normal'] },
  ] },
  { location: 'Route 2', encounters: [
    { species: 'Nickit', types: ['Dark'] },
    { species: 'Yamper', types: ['Electric'] },
    { species: 'Chewtle', types: ['Water'] },
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
  ] },
  { location: 'Route 3', encounters: [
    { species: 'Rolycoly', types: ['Rock'] },
    { species: 'Gossifleur', types: ['Grass'] },
    { species: 'Sizzlipede', types: ['Fire', 'Bug'] },
  ] },
  { location: 'Galar Mine', encounters: [
    { species: 'Roggenrola', types: ['Rock'] },
    { species: 'Woobat', types: ['Psychic', 'Flying'] },
    { species: 'Drilbur', types: ['Ground'] },
  ] },
  { location: 'Route 4', encounters: [
    { species: 'Milcery', types: ['Fairy'] },
    { species: 'Meowth', types: ['Steel'] },
    { species: 'Pumpkaboo', types: ['Ghost', 'Grass'] },
  ] },
  { location: 'Route 5', encounters: [
    { species: 'Applin', types: ['Grass', 'Dragon'] },
    { species: 'Eldegoss', types: ['Grass'] },
    { species: 'Stufful', types: ['Normal', 'Fighting'] },
  ] },
  { location: 'Glimwood Tangle', encounters: [
    { species: 'Impidimp', types: ['Dark', 'Fairy'] },
    { species: 'Morgrem', types: ['Dark', 'Fairy'] },
    { species: 'Ponyta', types: ['Psychic'] },
    { species: 'Sinistea', types: ['Ghost'] },
  ] },
  { location: 'Route 9', encounters: [
    { species: 'Clobbopus', types: ['Fighting'] },
    { species: 'Pincurchin', types: ['Electric'] },
    { species: 'Cramorant', types: ['Flying', 'Water'], surfMethod: true },
    { species: 'Mareanie', types: ['Poison', 'Water'], fishingMethod: true },
  ] },
  { location: 'Route 10', encounters: [
    { species: 'Darumaka', types: ['Ice'] },
    { species: 'Snom', types: ['Ice', 'Bug'] },
    { species: 'Duraludon', types: ['Steel', 'Dragon'] },
  ] },
];
