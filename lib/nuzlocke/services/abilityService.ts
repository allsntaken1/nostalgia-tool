import type { PokemonType } from '@/app/nuzlocke/types';
import { getAttackMultiplier } from '@/lib/nuzlocke/typeChart';

export interface PokemonAbility {
  id: number;
  name: string;
  isHidden: boolean;
  slot: number;
  shortEffect?: string;
  fullEffect?: string;
}

const pokemonAbilityCache = new Map<string, PokemonAbility[]>();
const abilityDetailCache = new Map<string, Omit<PokemonAbility, 'isHidden' | 'slot'>>();

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pokemonSlug(name: string) {
  const mapped: Record<string, string> = {
    MrMime: 'mr-mime',
    'Mr. Rime': 'mr-rime',
    NidoranF: 'nidoran-f',
    NidoranM: 'nidoran-m',
    "Sirfetch'd": 'sirfetchd',
  };
  return mapped[name] ?? slug(name);
}

function titleCase(value: string) {
  return value.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

async function fetchAbilityDetail(name: string) {
  const abilitySlug = slug(name);
  const cached = abilityDetailCache.get(abilitySlug);
  if (cached) return cached;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilitySlug}`);
    if (!response.ok) return null;
    const data = await response.json();
    const shortEntry = data.effect_entries?.find((entry: { language?: { name?: string } }) => entry.language?.name === 'en');
    const flavorEntry = data.flavor_text_entries?.find((entry: { language?: { name?: string } }) => entry.language?.name === 'en');
    const detail = {
      id: Number(data.id) || 0,
      name: titleCase(data.name || name),
      shortEffect: flavorEntry?.flavor_text?.replace(/\s+/g, ' ').trim() || shortEntry?.short_effect?.replace(/\s+/g, ' ').trim(),
      fullEffect: shortEntry?.effect?.replace(/\s+/g, ' ').trim(),
    };
    abilityDetailCache.set(abilitySlug, detail);
    return detail;
  } catch {
    return null;
  }
}

export async function getPokemonAbilities(species: string): Promise<PokemonAbility[]> {
  const key = pokemonSlug(species);
  if (!key) return [];
  const cached = pokemonAbilityCache.get(key);
  if (cached) return cached;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);
    if (!response.ok) return [];
    const data = await response.json();
    const abilities = await Promise.all((data.abilities || []).map(async (entry: { ability?: { name?: string }; is_hidden?: boolean; slot?: number }) => {
      const name = entry.ability?.name || '';
      const detail = await fetchAbilityDetail(name);
      return {
        id: detail?.id || 0,
        name: detail?.name || titleCase(name),
        isHidden: Boolean(entry.is_hidden),
        slot: Number(entry.slot) || 0,
        shortEffect: detail?.shortEffect,
        fullEffect: detail?.fullEffect,
      };
    }));
    pokemonAbilityCache.set(key, abilities);
    return abilities;
  } catch {
    return [];
  }
}

export function applyDefensiveAbilityMultiplier(ability: string | undefined, attackType: PokemonType, defenderTypes: PokemonType[]) {
  const normalized = (ability || '').toLowerCase();
  const base = getAttackMultiplier(attackType, defenderTypes);

  if (normalized === 'levitate' && attackType === 'Ground') return 0;
  if (normalized === 'flash fire' && attackType === 'Fire') return 0;
  if (normalized === 'water absorb' && attackType === 'Water') return 0;
  if (normalized === 'volt absorb' && attackType === 'Electric') return 0;
  if (normalized === 'lightning rod' && attackType === 'Electric') return 0;
  if (normalized === 'sap sipper' && attackType === 'Grass') return 0;
  if (normalized === 'storm drain' && attackType === 'Water') return 0;
  if (normalized === 'motor drive' && attackType === 'Electric') return 0;
  if (normalized === 'wonder guard') return base > 1 ? base : 0;
  if (normalized === 'dry skin' && attackType === 'Water') return 0;
  if (normalized === 'dry skin' && attackType === 'Fire') return base * 1.25;
  if (normalized === 'thick fat' && (attackType === 'Fire' || attackType === 'Ice')) return base * 0.5;
  if (normalized === 'heatproof' && attackType === 'Fire') return base * 0.5;

  return base;
}
