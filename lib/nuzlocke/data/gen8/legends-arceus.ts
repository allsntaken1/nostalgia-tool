import type { BossTrainer, Gen8EncounterArea } from './types';

export const legendsArceusBosses: BossTrainer[] = [
  { id: 'mai-la', name: 'Mai', category: 'Warden', game: 'Legends: Arceus', location: 'Obsidian Fieldlands', recommendedOrder: 1, levelCap: 10, team: [
    { species: 'Munchlax', level: 10, types: ['Normal'] },
  ] },
  { id: 'kleavor-la', name: 'Lord Kleavor', category: 'Noble Pokemon', game: 'Legends: Arceus', location: 'Grandtree Arena', recommendedOrder: 2, levelCap: 18, team: [
    { species: 'Kleavor', level: 18, types: ['Bug', 'Rock'] },
  ] },
  { id: 'avalugg-la', name: 'Lord Avalugg', category: 'Noble Pokemon', game: 'Legends: Arceus', location: 'Alabaster Icelands', recommendedOrder: 5, levelCap: 56, team: [
    { species: 'Avalugg', level: 56, types: ['Ice', 'Rock'] },
  ] },
];

export const legendsArceusEncounterAreas: Gen8EncounterArea[] = [
  { location: 'Starter', encounters: [
    { species: 'Rowlet', types: ['Grass', 'Flying'] },
    { species: 'Cyndaquil', types: ['Fire'] },
    { species: 'Oshawott', types: ['Water'] },
  ] },
  { location: 'Obsidian Fieldlands', encounters: [
    { species: 'Bidoof', types: ['Normal'] },
    { species: 'Starly', types: ['Normal', 'Flying'] },
    { species: 'Shinx', types: ['Electric'] },
  ] },
  { location: 'Crimson Mirelands', encounters: [
    { species: 'Budew', types: ['Grass', 'Poison'] },
    { species: 'Croagunk', types: ['Poison', 'Fighting'] },
    { species: 'Psyduck', types: ['Water'] },
  ] },
];
