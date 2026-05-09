import type { Gen8EncounterArea } from './types';

export const swordShieldWildAreas: Gen8EncounterArea[] = [
  { location: 'Meetup Spot', encounters: [
    { species: 'Bunnelby', types: ['Normal'] },
    { species: 'Rookidee', types: ['Flying'] },
    { species: 'Skwovet', types: ['Normal'] },
  ] },
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
  { location: 'Axew Eye', encounters: [
    { species: 'Axew', types: ['Dragon'] },
    { species: 'Haxorus', types: ['Dragon'] },
    { species: 'Dottler', types: ['Bug', 'Psychic'] },
  ] },
  { location: 'South Lake Miloch', encounters: [
    { species: 'Wingull', types: ['Water', 'Flying'] },
    { species: 'Corphish', types: ['Water'] },
    { species: 'Gyarados', types: ['Water', 'Flying'], surfMethod: true },
  ] },
  { location: 'North Lake Miloch', encounters: [
    { species: 'Stufful', types: ['Normal', 'Fighting'] },
    { species: 'Natu', types: ['Psychic', 'Flying'] },
    { species: 'Goldeen', types: ['Water'], fishingMethod: true },
  ] },
  { location: 'Giant Seat', encounters: [
    { species: 'Machop', types: ['Fighting'] },
    { species: 'Sawk', types: ['Fighting'] },
    { species: 'Throh', types: ['Fighting'] },
  ] },
  { location: 'Bridge Field', encounters: [
    { species: 'Golett', types: ['Ground', 'Ghost'] },
    { species: 'Karrablast', types: ['Bug'] },
    { species: 'Shelmet', types: ['Bug'] },
  ] },
  { location: 'Motostoke Riverbank', encounters: [
    { species: 'Noibat', types: ['Flying', 'Dragon'] },
    { species: 'Koffing', types: ['Poison'] },
    { species: 'Eevee', types: ['Normal'] },
  ] },
  { location: 'Stony Wilderness', encounters: [
    { species: 'Rhyhorn', types: ['Ground', 'Rock'] },
    { species: 'Carkol', types: ['Rock', 'Fire'] },
    { species: 'Gurdurr', types: ['Fighting'] },
  ] },
  { location: 'Dusty Bowl', encounters: [
    { species: 'Trapinch', types: ['Ground'] },
    { species: 'Hippopotas', types: ['Ground'] },
    { species: 'Torkoal', types: ['Fire'] },
  ] },
  { location: 'Giant Mirror', encounters: [
    { species: 'Hatenna', types: ['Psychic'] },
    { species: 'Impidimp', types: ['Dark', 'Fairy'] },
    { species: 'Bronzor', types: ['Steel', 'Psychic'] },
  ] },
  { location: 'Giant Cap', encounters: [
    { species: 'Sneasel', types: ['Dark', 'Ice'] },
    { species: 'Snorunt', types: ['Ice'] },
    { species: 'Delibird', types: ['Ice', 'Flying'] },
  ] },
  { location: 'Hammerlocke Hills', encounters: [
    { species: 'Dreepy', types: ['Dragon', 'Ghost'] },
    { species: 'Rufflet', types: ['Normal', 'Flying'] },
    { species: 'Vullaby', types: ['Dark', 'Flying'] },
  ] },
  { location: 'Lake of Outrage', encounters: [
    { species: 'Ditto', types: ['Normal'] },
    { species: 'Dreepy', types: ['Dragon', 'Ghost'] },
    { species: 'Gyarados', types: ['Water', 'Flying'], surfMethod: true },
  ] },
];
