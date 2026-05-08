import type { BossTrainer, Gen8EncounterArea } from './types';

export const bdspBosses: BossTrainer[] = [
  { id: 'roark-bdsp', name: 'Roark', category: 'Gym Leader', game: 'Both', location: 'Oreburgh Gym', recommendedOrder: 1, levelCap: 14, team: [
    { species: 'Geodude', level: 12, types: ['Rock', 'Ground'] },
    { species: 'Onix', level: 12, types: ['Rock', 'Ground'] },
    { species: 'Cranidos', level: 14, types: ['Rock'] },
  ] },
  { id: 'gardenia-bdsp', name: 'Gardenia', category: 'Gym Leader', game: 'Both', location: 'Eterna Gym', recommendedOrder: 2, levelCap: 22, team: [
    { species: 'Cherubi', level: 19, types: ['Grass'] },
    { species: 'Turtwig', level: 19, types: ['Grass'] },
    { species: 'Roserade', level: 22, types: ['Grass', 'Poison'] },
  ] },
  { id: 'cynthia-bdsp', name: 'Cynthia', category: 'Champion', game: 'Both', location: 'Pokemon League', recommendedOrder: 99, levelCap: 66, team: [
    { species: 'Spiritomb', level: 61, types: ['Ghost', 'Dark'] },
    { species: 'Roserade', level: 60, types: ['Grass', 'Poison'] },
    { species: 'Gastrodon', level: 60, types: ['Water', 'Ground'] },
    { species: 'Lucario', level: 63, types: ['Fighting', 'Steel'] },
    { species: 'Milotic', level: 63, types: ['Water'] },
    { species: 'Garchomp', level: 66, types: ['Dragon', 'Ground'] },
  ] },
];

export const bdspEncounterAreas: Gen8EncounterArea[] = [
  { location: 'Starter', encounters: [
    { species: 'Turtwig', types: ['Grass'] },
    { species: 'Chimchar', types: ['Fire'] },
    { species: 'Piplup', types: ['Water'] },
  ] },
  { location: 'Route 201', encounters: [
    { species: 'Starly', types: ['Normal', 'Flying'] },
    { species: 'Bidoof', types: ['Normal'] },
  ] },
  { location: 'Oreburgh Gate', encounters: [
    { species: 'Zubat', types: ['Poison', 'Flying'] },
    { species: 'Geodude', types: ['Rock', 'Ground'] },
    { species: 'Psyduck', types: ['Water'], surfMethod: true },
  ] },
];
