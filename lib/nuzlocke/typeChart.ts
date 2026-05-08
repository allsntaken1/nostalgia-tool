import type { PokemonType } from '@/app/nuzlocke/types';

export const pokemonTypes: PokemonType[] = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

export const typeEffectiveness: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export function getAttackMultiplier(attackType: PokemonType, defenderTypes: PokemonType[]) {
  return (defenderTypes || []).reduce((total, defenderType) => total * (typeEffectiveness[attackType]?.[defenderType] ?? 1), 1);
}

export function getDefensiveMatchups(types: PokemonType[]): {
  weak4x: PokemonType[];
  weak2x: PokemonType[];
  neutral1x: PokemonType[];
  resistHalf: PokemonType[];
  resistQuarter: PokemonType[];
  immune0x: PokemonType[];
} {
  const normalizedTypes = Array.from(new Set(types || []));

  return pokemonTypes.reduce(
    (matchups, attackType) => {
      const multiplier = getAttackMultiplier(attackType, normalizedTypes);

      if (multiplier === 4) matchups.weak4x.push(attackType);
      else if (multiplier === 2) matchups.weak2x.push(attackType);
      else if (multiplier === 1) matchups.neutral1x.push(attackType);
      else if (multiplier === 0.5) matchups.resistHalf.push(attackType);
      else if (multiplier === 0.25) matchups.resistQuarter.push(attackType);
      else if (multiplier === 0) matchups.immune0x.push(attackType);

      return matchups;
    },
    {
      weak4x: [],
      weak2x: [],
      neutral1x: [],
      resistHalf: [],
      resistQuarter: [],
      immune0x: [],
    } as {
      weak4x: PokemonType[];
      weak2x: PokemonType[];
      neutral1x: PokemonType[];
      resistHalf: PokemonType[];
      resistQuarter: PokemonType[];
      immune0x: PokemonType[];
    }
  );
}

export function getStabStrongAgainst(types: PokemonType[]) {
  return pokemonTypes.filter((defenderType) => (types || []).some((attackType) => (typeEffectiveness[attackType]?.[defenderType] ?? 1) > 1));
}
