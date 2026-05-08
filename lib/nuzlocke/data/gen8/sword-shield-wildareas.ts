import type { Gen8EncounterArea } from './types';

export const swordShieldWildAreas: Gen8EncounterArea[] = [
  { location: 'Rolling Fields', encounters: [
    { species: 'Bunnelby', types: ['Normal'] },
    { species: 'Tyrogue', types: ['Fighting'] },
    { species: 'Budew', types: ['Grass', 'Poison'] },
  ] },
  { location: 'Dappled Grove', encounters: [
    { species: 'Oddish', types: ['Grass', 'Poison'] },
    { species: 'Bounsweet', types: ['Grass'] },
    { species: 'Nuzleaf', types: ['Grass', 'Dark'] },
  ] },
  { location: 'Watchtower Ruins', encounters: [
    { species: 'Gastly', types: ['Ghost', 'Poison'] },
    { species: 'Duskull', types: ['Ghost'] },
    { species: 'Drifloon', types: ['Ghost', 'Flying'] },
  ] },
  { location: 'East Lake Axewell', encounters: [
    { species: 'Lotad', types: ['Water', 'Grass'] },
    { species: 'Wingull', types: ['Water', 'Flying'] },
    { species: 'Magikarp', types: ['Water'], fishingMethod: true },
  ] },
  { location: 'West Lake Axewell', encounters: [
    { species: 'Tympole', types: ['Water'] },
    { species: 'Wooper', types: ['Water', 'Ground'] },
    { species: 'Krabby', types: ['Water'], fishingMethod: true },
  ] },
  { location: 'Motostoke Riverbank', encounters: [
    { species: 'Noibat', types: ['Flying', 'Dragon'] },
    { species: 'Koffing', types: ['Poison'] },
    { species: 'Eevee', types: ['Normal'] },
  ] },
  { location: 'Hammerlocke Hills', encounters: [
    { species: 'Dreepy', types: ['Dragon', 'Ghost'] },
    { species: 'Rufflet', types: ['Normal', 'Flying'] },
    { species: 'Vullaby', types: ['Dark', 'Flying'] },
  ] },
];
