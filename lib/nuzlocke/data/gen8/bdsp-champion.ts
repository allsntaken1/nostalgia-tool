import type { BossTrainer } from './types';

export const bdspChampion: BossTrainer[] = [
  {
    id: 'cynthia-bdsp',
    name: 'Cynthia',
    category: 'Champion',
    game: 'Both',
    location: 'Pokemon League',
    recommendedOrder: 34,
    levelCap: 66,
    threatMetadata: {
      overallDifficulty: 'Run Killer',
      notes: ['BDSP Cynthia is built like a serious competitive team compared with most story fights.'],
      notableThreats: [
        { species: 'Garchomp', threatLevel: 'Extreme', reasons: ['Fast physical sweeper', 'Yache Berry softens Ice counterplay', 'Swords Dance can end a run'], dangerousMoves: ['Earthquake', 'Dragon Claw', 'Poison Jab', 'Swords Dance'], dangerousAbilities: ['Rough Skin'], suggestedCounters: ['Bulky Ice coverage', 'Fairy with Poison coverage covered', 'Intimidate cycling'] },
        { species: 'Milotic', threatLevel: 'High', reasons: ['Marvel Scale makes status plans risky', 'Mirror Coat can delete special attackers'], dangerousMoves: ['Scald', 'Mirror Coat'], dangerousAbilities: ['Marvel Scale'], suggestedCounters: ['Physical Grass/Electric pressure'] },
        { species: 'Lucario', threatLevel: 'High', reasons: ['Coverage into many defensive types', 'Nasty Plot threat'], dangerousMoves: ['Aura Sphere', 'Flash Cannon'], suggestedCounters: ['Ground', 'Fire'] },
      ],
      recommendedCoverage: ['Ice', 'Fairy', 'Ground', 'Electric', 'Dark'],
      dangerousMatchups: ['No safe switch into Garchomp Earthquake is a major danger signal.', 'Special-only plans can be punished by Milotic Mirror Coat.'],
      setupSweepers: ['Garchomp', 'Lucario'],
      abilityThreats: ['Rough Skin', 'Marvel Scale', 'Levitate'],
    },
    team: [
      { species: 'Spiritomb', level: 61, types: ['Ghost', 'Dark'], ability: 'Pressure', moves: [{ name: 'Shadow Ball', type: 'Ghost', power: 80 }, { name: 'Dark Pulse', type: 'Dark', power: 80 }, { name: 'Psychic', type: 'Psychic', power: 90 }] },
      { species: 'Roserade', level: 60, types: ['Grass', 'Poison'], ability: 'Poison Point', moves: [{ name: 'Energy Ball', type: 'Grass', power: 90 }, { name: 'Sludge Bomb', type: 'Poison', power: 90 }, { name: 'Dazzling Gleam', type: 'Fairy', power: 80 }] },
      { species: 'Gastrodon', level: 60, types: ['Water', 'Ground'], ability: 'Storm Drain', moves: [{ name: 'Scald', type: 'Water', power: 80 }, { name: 'Earthquake', type: 'Ground', power: 100 }, { name: 'Sludge Bomb', type: 'Poison', power: 90 }] },
      { species: 'Lucario', level: 63, types: ['Fighting', 'Steel'], ability: 'Inner Focus', moves: [{ name: 'Aura Sphere', type: 'Fighting', power: 80 }, { name: 'Flash Cannon', type: 'Steel', power: 80 }, { name: 'Dragon Pulse', type: 'Dragon', power: 85 }, { name: 'Nasty Plot', type: 'Dark', power: null }] },
      { species: 'Milotic', level: 63, types: ['Water'], ability: 'Marvel Scale', item: 'Flame Orb', moves: [{ name: 'Scald', type: 'Water', power: 80 }, { name: 'Ice Beam', type: 'Ice', power: 90 }, { name: 'Mirror Coat', type: 'Psychic', power: null }, { name: 'Recover', type: 'Normal', power: null }] },
      { species: 'Garchomp', level: 66, types: ['Dragon', 'Ground'], ability: 'Rough Skin', item: 'Yache Berry', moves: [{ name: 'Earthquake', type: 'Ground', power: 100 }, { name: 'Dragon Claw', type: 'Dragon', power: 80 }, { name: 'Poison Jab', type: 'Poison', power: 80 }, { name: 'Swords Dance', type: 'Normal', power: null }] },
    ],
  },
];
