import type { BossTrainer } from './types';

export const swordShieldRivals: BossTrainer[] = [
  {
    id: 'hop-route-2-swsh',
    name: 'Hop',
    category: 'Rival',
    game: 'Both',
    location: 'Route 2',
    recommendedOrder: 0,
    levelCap: 8,
    team: [
      { species: 'Wooloo', level: 6, types: ['Normal'], ability: 'Fluffy' },
      { species: 'Starter Ace', level: 8, types: ['Normal'], notes: 'Starter varies by your choice.' },
    ],
  },
  {
    id: 'bede-galar-mine-swsh',
    name: 'Bede',
    category: 'Rival',
    game: 'Both',
    location: 'Galar Mine',
    recommendedOrder: 2,
    levelCap: 16,
    team: [
      { species: 'Solosis', level: 13, types: ['Psychic'], ability: 'Magic Guard' },
      { species: 'Gothita', level: 15, types: ['Psychic'], ability: 'Competitive' },
      { species: 'Hatenna', level: 16, types: ['Psychic'], ability: 'Healer' },
    ],
  },
  {
    id: 'marnie-motostoke-swsh',
    name: 'Marnie',
    category: 'Rival',
    game: 'Both',
    location: 'Motostoke',
    recommendedOrder: 3,
    levelCap: 26,
    team: [
      { species: 'Croagunk', level: 24, types: ['Poison', 'Fighting'], ability: 'Anticipation' },
      { species: 'Scraggy', level: 24, types: ['Dark', 'Fighting'], ability: 'Shed Skin' },
      { species: 'Morpeko', level: 26, types: ['Electric', 'Dark'], ability: 'Hunger Switch' },
    ],
  },
  {
    id: 'champion-leon-swsh',
    name: 'Leon',
    category: 'Champion Cup',
    game: 'Both',
    location: 'Wyndon Stadium',
    recommendedOrder: 99,
    levelCap: 65,
    team: [
      { species: 'Aegislash', level: 62, types: ['Steel', 'Ghost'], ability: 'Stance Change' },
      { species: 'Dragapult', level: 62, types: ['Dragon', 'Ghost'], ability: 'Clear Body' },
      { species: 'Haxorus', level: 63, types: ['Dragon'], ability: 'Mold Breaker' },
      { species: 'Seismitoad', level: 64, types: ['Water', 'Ground'], ability: 'Swift Swim', notes: 'Team slot varies by starter choice.' },
      { species: 'Mr. Rime', level: 64, types: ['Ice', 'Psychic'], ability: 'Tangled Feet', notes: 'Team slot varies by starter choice.' },
      { species: 'Charizard', level: 65, types: ['Fire', 'Flying'], ability: 'Blaze' },
    ],
  },
];
