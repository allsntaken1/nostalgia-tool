import type { StarterChoice } from '@/app/nuzlocke/types';

export function normalizeStarterChoice(value: unknown): StarterChoice | null {
  if (value === 'grass' || value === 'fire' || value === 'water') return value;
  return null;
}

export function getRivalStarterChoice(playerStarterChoice: unknown): StarterChoice | null {
  const starterChoice = normalizeStarterChoice(playerStarterChoice);
  if (starterChoice === 'grass') return 'fire';
  if (starterChoice === 'fire') return 'water';
  if (starterChoice === 'water') return 'grass';
  return null;
}

export function starterChoiceLabel(value: StarterChoice | null | undefined) {
  if (value === 'grass') return 'Grass';
  if (value === 'fire') return 'Fire';
  if (value === 'water') return 'Water';
  return 'Not selected';
}
