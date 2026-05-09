import type { Gen8EncounterArea } from './types';

export const bdspStaticEncounters: Gen8EncounterArea[] = [
  { location: 'Starter', encounters: [
    { species: 'Turtwig', types: ['Grass'] },
    { species: 'Chimchar', types: ['Fire'] },
    { species: 'Piplup', types: ['Water'] },
  ] },
  { location: 'Gift / Static', encounters: [
    { species: 'Mew', types: ['Psychic'] },
    { species: 'Jirachi', types: ['Steel', 'Psychic'] },
    { species: 'Riolu', types: ['Fighting'] },
    { species: 'Eevee', types: ['Normal'] },
    { species: 'Togepi', types: ['Fairy'] },
    { species: 'Porygon', types: ['Normal'] },
  ] },
  { location: 'Fossil Revival', encounters: [
    { species: 'Cranidos', types: ['Rock'] },
    { species: 'Shieldon', types: ['Rock', 'Steel'] },
    { species: 'Omanyte', types: ['Rock', 'Water'] },
    { species: 'Kabuto', types: ['Rock', 'Water'] },
    { species: 'Aerodactyl', types: ['Rock', 'Flying'] },
    { species: 'Lileep', types: ['Rock', 'Grass'] },
    { species: 'Anorith', types: ['Rock', 'Bug'] },
  ] },
  { location: 'Honey Trees', encounters: [
    { species: 'Burmy', types: ['Bug'] },
    { species: 'Combee', types: ['Bug', 'Flying'] },
    { species: 'Aipom', types: ['Normal'] },
    { species: 'Cherubi', types: ['Grass'] },
    { species: 'Heracross', types: ['Bug', 'Fighting'] },
    { species: 'Munchlax', types: ['Normal'] },
  ] },
  { location: 'Legendary / Static', encounters: [
    { species: 'Dialga', types: ['Steel', 'Dragon'] },
    { species: 'Palkia', types: ['Water', 'Dragon'] },
    { species: 'Uxie', types: ['Psychic'] },
    { species: 'Mesprit', types: ['Psychic'] },
    { species: 'Azelf', types: ['Psychic'] },
    { species: 'Giratina', types: ['Ghost', 'Dragon'] },
    { species: 'Heatran', types: ['Fire', 'Steel'] },
    { species: 'Regigigas', types: ['Normal'] },
    { species: 'Cresselia', types: ['Psychic'] },
  ] },
];
