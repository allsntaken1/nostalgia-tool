'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { type CSSProperties, FormEvent, useEffect, useState } from 'react';
import { Skull } from 'lucide-react';
import { getDefensiveMatchups, getStabStrongAgainst } from '@/lib/nuzlocke/typeChart';
import {
  type EncounterOption,
  gameGroups,
  getAbilityOptions,
  getNuzlockeBosses,
  getNuzlockeEncounterOptions,
  getNuzlockeLocations,
  getPokemonTypesFromData,
  getPokemonSpriteUrl,
  heldItemOptions,
  natureOptions,
  nuzlockeStorageKey,
  pokemonTypes,
  runTypes,
  typeColors,
} from './data';
import type {
  EncounterStatus,
  GameVersion,
  NuzlockeBoss,
  NuzlockeBossPokemon,
  NuzlockeEncounter,
  NuzlockeMove,
  NuzlockePokemon,
  NuzlockeRules,
  NuzlockeRun,
  PokemonStatus,
  PokemonType,
  RunType,
} from './types';

type Tab = 'Overview' | 'Team / Box' | 'Encounters' | 'Badges / Bosses' | 'Graveyard' | 'Timeline';

const defaultRules: NuzlockeRules = {
  dupesClause: true,
  shinyClause: true,
  levelCaps: true,
  setMode: true,
  noItemsInBattle: false,
  starterCountsAsFirstEncounter: true,
  giftPokemonAllowed: true,
  staticEncountersAllowed: true,
  teraRaidEncountersAllowed: false,
};

const ruleLabels: { key: keyof NuzlockeRules; label: string }[] = [
  { key: 'dupesClause', label: 'Dupes Clause' },
  { key: 'shinyClause', label: 'Shiny Clause' },
  { key: 'levelCaps', label: 'Level Caps' },
  { key: 'setMode', label: 'Set Mode' },
  { key: 'noItemsInBattle', label: 'No Items in Battle' },
  { key: 'starterCountsAsFirstEncounter', label: 'Starter Counts as First Encounter' },
  { key: 'giftPokemonAllowed', label: 'Gift Pokemon Allowed' },
  { key: 'staticEncountersAllowed', label: 'Static Encounters Allowed' },
  { key: 'teraRaidEncountersAllowed', label: 'Tera Raid Encounters Allowed' },
];

const panelClass = 'rounded-2xl border border-white/75 bg-white/90 p-4 shadow-[0_18px_50px_rgba(24,42,64,0.10)] backdrop-blur';
const softPanelClass = 'rounded-xl bg-white/65 p-3 shadow-sm';
const fieldClass = 'rounded-lg border border-[#c9d4e2] bg-white px-3 py-2 font-bold outline-none focus:border-[#182a40]';
const smallButtonClass = 'rounded-lg border border-[#c9d4e2] bg-white px-3 py-2 text-xs font-black shadow-sm hover:-translate-y-0.5';
const readableFont = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const typeHex: Record<PokemonType, string> = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
};

function trackerTheme(game?: GameVersion | '') {
  if (game === 'Red') {
    return 'bg-[linear-gradient(135deg,#ffdce1_0%,#fff1c7_45%,#ffe3e7_100%)]';
  }

  if (game === 'Blue') {
    return 'bg-[linear-gradient(135deg,#dcecff_0%,#eaf7ff_45%,#d7e2ff_100%)]';
  }

  if (game === 'Yellow') {
    return 'bg-[linear-gradient(135deg,#fff1a8_0%,#fff9dc_45%,#ffe0a3_100%)]';
  }

  if (game === 'Scarlet') {
    return 'bg-[linear-gradient(135deg,#ffe8ee_0%,#fff8dc_42%,#ffd6e1_100%)]';
  }

  if (game === 'Violet') {
    return 'bg-[linear-gradient(135deg,#eee7ff_0%,#e4fbff_48%,#f6ddff_100%)]';
  }

  return 'bg-[linear-gradient(135deg,#eef8ff_0%,#fff7da_48%,#efffea_100%)]';
}

function trackerVars(game?: GameVersion | ''): CSSProperties {
  if (game === 'Red') {
    return {
      '--nuz-accent': '#d62839',
      '--nuz-accent-soft': '#ffd7dd',
    } as CSSProperties;
  }

  if (game === 'Blue') {
    return {
      '--nuz-accent': '#2364d2',
      '--nuz-accent-soft': '#d8e7ff',
    } as CSSProperties;
  }

  if (game === 'Yellow') {
    return {
      '--nuz-accent': '#d19a00',
      '--nuz-accent-soft': '#fff0a6',
    } as CSSProperties;
  }

  if (game === 'Scarlet') {
    return {
      '--nuz-accent': '#e8415f',
      '--nuz-accent-soft': '#ffe1e8',
    } as CSSProperties;
  }

  if (game === 'Violet') {
    return {
      '--nuz-accent': '#7552ff',
      '--nuz-accent-soft': '#eee7ff',
    } as CSSProperties;
  }

  return {
    '--nuz-accent': '#2f7bc7',
    '--nuz-accent-soft': '#e6f3ff',
  } as CSSProperties;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowLabel() {
  return new Date().toLocaleString();
}

function safeNumber(value: string, fallback = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isRun(value: unknown): value is NuzlockeRun {
  if (!value || typeof value !== 'object') return false;
  const run = value as Partial<NuzlockeRun>;
  return typeof run.id === 'string' && typeof run.runName === 'string' && typeof run.gameVersion === 'string';
}

function normalizeRuns(value: unknown): NuzlockeRun[] {
  if (!Array.isArray(value)) return [];

  const mergeBossDefaults = (bosses: NuzlockeBoss[], gameVersion: GameVersion) =>
    getNuzlockeBosses(gameVersion).map((defaultBoss) => {
      const boss = bosses.find((item) => item.id === defaultBoss.id) ?? defaultBoss;
      const defaultPokemon = defaultBoss?.pokemon ?? [];
      const pokemon = Array.isArray(boss.pokemon) && boss.pokemon.length > 0
        ? boss.pokemon.map((member) => {
            const defaultMember = defaultPokemon.find((item) => item.species === member.species);
            return {
              ...member,
              ability: cleanBossDetail(member.ability) || defaultMember?.ability || '',
              item: cleanBossDetail(member.item) || defaultMember?.item || '',
              nature: cleanBossDetail(member.nature) || defaultMember?.nature || '',
              moves: member.moves?.length ? member.moves : defaultMember?.moves,
              types: member.types?.length ? member.types : defaultMember?.types,
              teraType: member.teraType || defaultMember?.teraType,
              notes: member.notes || defaultMember?.notes,
            };
          })
        : defaultPokemon;

      return {
        ...boss,
        category: defaultBoss.category,
        levelCap: boss.levelCap || defaultBoss.levelCap,
        pokemon,
      };
    });

  return value.filter(isRun).map((run) => ({
    ...run,
    team: Array.isArray(run.team) ? run.team.map((pokemon) => ({ ...pokemon, heldItem: pokemon.heldItem || 'None' })) : [],
    encounters: Array.isArray(run.encounters) ? run.encounters : [],
    bosses: Array.isArray(run.bosses) ? mergeBossDefaults(run.bosses, run.gameVersion) : getNuzlockeBosses(run.gameVersion),
    timeline: Array.isArray(run.timeline) ? run.timeline : [],
    rules: run.rules || defaultRules,
  }));
}

function typeStyle(types: PokemonType[] = []) {
  const primary = types[0] ?? 'Normal';
  const secondary = types[1] ?? primary;
  return {
    '--type-primary': typeHex[primary],
    '--type-secondary': typeHex[secondary],
  } as CSSProperties;
}

function typeCardStyle(types: PokemonType[] = []) {
  const primary = types[0] ?? 'Normal';
  const secondary = types[1] ?? primary;
  return {
    ...typeStyle(types),
    background: `linear-gradient(135deg, ${typeHex[primary]}26, white 48%, ${typeHex[secondary]}18)`,
  } as CSSProperties;
}

function TypeBadge({ type }: { type: PokemonType }) {
  return <span className={`rounded-full px-2 py-1 text-[11px] font-black shadow-sm ${typeColors[type] ?? 'bg-white text-[#182a40]'}`}>{type}</span>;
}

function BadgeToken({ name, types }: { name: string; types: PokemonType[] }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
  const primary = types[0] ?? 'Normal';
  const secondary = types[1] ?? primary;

  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-[inset_0_0_0_3px_rgba(24,42,64,0.18),0_8px_20px_rgba(24,42,64,0.14)]"
      title={name}
      style={{ background: `linear-gradient(135deg, ${typeHex[primary]}, ${typeHex[secondary]})` }}
    >
      <div
        className="absolute inset-[7px] rounded-full bg-white/42"
      />
      <div className="relative text-sm font-black text-[#182a40] drop-shadow-[1px_1px_0_rgba(255,255,255,0.65)]">
        {initials}
      </div>
    </div>
  );
}

function SpriteSelect({
  options,
  value,
  onChange,
}: {
  options: EncounterOption[];
  value: string;
  onChange: (species: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.species === value) ?? options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-md border border-[#9baec8] bg-white px-3 py-2 text-left font-bold"
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected ? <MonsterToken species={selected.species} types={selected.types} compact /> : null}
          <span className="truncate">{selected?.species || 'Not listed'}</span>
        </span>
        <span className="shrink-0 text-xs">v</span>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border-2 border-[#182a40] bg-white shadow-[0_12px_30px_rgba(24,42,64,0.16)]">
          {(options || []).map((option) => (
            <button
              key={option.species}
              type="button"
              onClick={() => {
                onChange(option.species);
                setOpen(false);
              }}
              style={option.species === value ? typeCardStyle(option.types) : typeStyle(option.types)}
              className={`flex w-full items-center gap-3 border-b border-[#d7e1ef] px-3 py-2 text-left font-black hover:bg-[var(--nuz-accent-soft)] ${
                option.species === value ? 'bg-[#e7f1ff]' : 'bg-white'
              }`}
            >
              <MonsterToken species={option.species} types={option.types} compact />
              <span className="min-w-0 flex-1">{option.species}</span>
              <span className="flex shrink-0 gap-1">{(option.types || []).map((type) => <TypeBadge key={type} type={type} />)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function cleanBossDetail(value: string) {
  if (!value || value === 'Not listed' || value === 'None listed' || value === 'N/A') return '';
  return value;
}

function itemSlug(item: string) {
  return item
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getItemSpriteUrl(item: string) {
  if (!item || ['None', 'Not Sure', 'Other', 'Type-boosting Item'].includes(item)) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemSlug(item)}.png`;
}

function ItemSprite({ item }: { item: string }) {
  const src = getItemSpriteUrl(item);
  if (!src) return null;

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
      <img src={src} alt={item} className="h-8 w-8 object-contain" style={{ imageRendering: 'pixelated' }} />
    </span>
  );
}

function NatureEffect({ nature }: { nature: string }) {
  const match = nature.match(/\(([^)]+)\)/);
  const effect = match?.[1] ?? '';
  if (!effect || effect === 'neutral') {
    return <div className="text-[11px] font-black text-[#6f7b8d]">Neutral nature</div>;
  }

  const [up, down] = effect.split('/').map((piece) => piece.trim());

  return (
    <div className="flex flex-wrap gap-2 text-[11px] font-black">
      {up ? <span className="rounded-full bg-[#e5f7df] px-2 py-1 text-[#267a38]">{up}</span> : null}
      {down ? <span className="rounded-full bg-[#ffe2de] px-2 py-1 text-[#a43128]">{down}</span> : null}
    </div>
  );
}

function isGenOneGame(gameVersion: GameVersion) {
  return gameVersion === 'Red' || gameVersion === 'Blue' || gameVersion === 'Yellow';
}

function BossPokemonRow({
  pokemon,
  bossId,
  selected,
  onSelect,
}: {
  pokemon: NonNullable<NuzlockeBoss['pokemon']>[number];
  bossId: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const details = [cleanBossDetail(pokemon.nature), cleanBossDetail(pokemon.ability), cleanBossDetail(pokemon.item)].filter(Boolean);
  const types = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);

  return (
    <button
      type="button"
      key={`${bossId}-${pokemon.species}-${pokemon.level}`}
      style={typeCardStyle(types)}
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-xl p-2 text-left text-xs font-bold shadow-sm transition hover:-translate-y-0.5 ${selected ? 'ring-2 ring-[var(--nuz-accent)]' : ''}`}
    >
      <MonsterToken species={pokemon.species} types={types} large />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 font-black">
          <span className="truncate">{pokemon.species}</span>
          <span className="shrink-0">Lv {pokemon.level}</span>
        </div>
        {details.length > 0 ? <div className="mt-1 text-[11px] leading-5 text-[#506078]">{details.join(' / ')}</div> : null}
        {types.length > 0 ? <div className="mt-2 flex flex-wrap gap-1">{types.map((type) => <TypeBadge key={type} type={type} />)}</div> : null}
      </div>
    </button>
  );
}

function ChoiceButtons<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T | string;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(options || []).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-lg px-3 py-2 text-xs font-black shadow-sm transition ${
            value === option
              ? 'bg-[var(--nuz-accent)] text-white'
              : 'bg-white text-[#182a40] hover:-translate-y-0.5'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function pokemonTypesForSpecies(species: string) {
  const fromEncounters = getPokemonTypesFromData(species);
  if (fromEncounters.length > 0) return fromEncounters;

  const known: Record<string, PokemonType[]> = {
    Ivysaur: ['Grass', 'Poison'],
    Venusaur: ['Grass', 'Poison'],
    Charmeleon: ['Fire'],
    Charizard: ['Fire', 'Flying'],
    Wartortle: ['Water'],
    Blastoise: ['Water'],
    Raticate: ['Normal'],
    Pidgeot: ['Normal', 'Flying'],
    Sandslash: ['Ground'],
    Dugtrio: ['Ground'],
    Persian: ['Normal'],
    Growlithe: ['Fire'],
    Ponyta: ['Fire'],
    Rapidash: ['Fire'],
    Staryu: ['Water'],
    Starmie: ['Water', 'Psychic'],
    Voltorb: ['Electric'],
    Pikachu: ['Electric'],
    Raichu: ['Electric'],
    Weepinbell: ['Grass', 'Poison'],
    Victreebel: ['Grass', 'Poison'],
    Gloom: ['Grass', 'Poison'],
    Vileplume: ['Grass', 'Poison'],
    Koffing: ['Poison'],
    Muk: ['Poison'],
    Weezing: ['Poison'],
    Abra: ['Psychic'],
    Kadabra: ['Psychic'],
    Alakazam: ['Psychic'],
    MrMime: ['Psychic'],
    Venonat: ['Bug', 'Poison'],
    Venomoth: ['Bug', 'Poison'],
    Ninetales: ['Fire'],
    Arcanine: ['Fire'],
    Nidoqueen: ['Poison', 'Ground'],
    Nidoking: ['Poison', 'Ground'],
    Rhyhorn: ['Ground', 'Rock'],
    Rhydon: ['Ground', 'Rock'],
    Dewgong: ['Water', 'Ice'],
    Cloyster: ['Water', 'Ice'],
    Slowbro: ['Water', 'Psychic'],
    Jynx: ['Ice', 'Psychic'],
    Lapras: ['Water', 'Ice'],
    Hitmonchan: ['Fighting'],
    Hitmonlee: ['Fighting'],
    Machamp: ['Fighting'],
    Gengar: ['Ghost', 'Poison'],
    Haunter: ['Ghost', 'Poison'],
    Golbat: ['Poison', 'Flying'],
    Arbok: ['Poison'],
    Aerodactyl: ['Rock', 'Flying'],
    Gyarados: ['Water', 'Flying'],
    Dragonair: ['Dragon'],
    Dragonite: ['Dragon', 'Flying'],
    Exeggutor: ['Grass', 'Psychic'],
    Nymble: ['Bug'],
    Tarountula: ['Bug'],
    Teddiursa: ['Normal'],
    Petilil: ['Grass'],
    Smoliv: ['Grass', 'Normal'],
    Sudowoodo: ['Rock'],
    Wattrel: ['Electric', 'Flying'],
    Bellibolt: ['Electric'],
    Luxio: ['Electric'],
    Mismagius: ['Ghost'],
    Veluza: ['Water', 'Psychic'],
    Wugtrio: ['Water'],
    Crabominable: ['Fighting', 'Ice'],
    Komala: ['Normal'],
    Dudunsparce: ['Normal'],
    Staraptor: ['Normal', 'Flying'],
    Mimikyu: ['Ghost', 'Fairy'],
    Banette: ['Ghost'],
    Houndstone: ['Ghost'],
    Toxtricity: ['Electric', 'Poison'],
    Farigiraf: ['Normal', 'Psychic'],
    Gardevoir: ['Psychic', 'Fairy'],
    Espathra: ['Psychic'],
    Florges: ['Fairy'],
    Frosmoth: ['Ice', 'Bug'],
    Beartic: ['Ice'],
    Cetitan: ['Ice'],
    Altaria: ['Dragon', 'Flying'],
    Klawf: ['Rock'],
    Bombirdier: ['Flying', 'Dark'],
    Orthworm: ['Steel'],
    Dondozo: ['Water'],
    Tatsugiri: ['Dragon', 'Water'],
    Pawniard: ['Dark', 'Steel'],
    Torkoal: ['Fire'],
    Skuntank: ['Poison', 'Dark'],
    Revavroom: ['Steel', 'Poison'],
    Azumarill: ['Water', 'Fairy'],
    Wigglytuff: ['Normal', 'Fairy'],
    Dachsbun: ['Fairy'],
    Toxicroak: ['Poison', 'Fighting'],
    Passimian: ['Fighting'],
    Lucario: ['Fighting', 'Steel'],
    Annihilape: ['Fighting', 'Ghost'],
    Lycanroc: ['Rock'],
    Pawmot: ['Electric', 'Fighting'],
    Goodra: ['Dragon'],
    Gogoat: ['Grass'],
    Avalugg: ['Ice'],
    Kingambit: ['Dark', 'Steel'],
    Glimmora: ['Rock', 'Poison'],
    Whiscash: ['Water', 'Ground'],
    Camerupt: ['Fire', 'Ground'],
    Donphan: ['Ground'],
    Clodsire: ['Poison', 'Ground'],
    Copperajah: ['Steel'],
    Magnezone: ['Electric', 'Steel'],
    Bronzong: ['Steel', 'Psychic'],
    Tinkaton: ['Fairy', 'Steel'],
    Haxorus: ['Dragon'],
    Dragalge: ['Poison', 'Dragon'],
    Flapple: ['Grass', 'Dragon'],
    Baxcalibur: ['Dragon', 'Ice'],
    Flamigo: ['Flying', 'Fighting'],
    Meowscarada: ['Grass', 'Dark'],
    Skeledirge: ['Fire', 'Ghost'],
    Quaquaval: ['Water', 'Fighting'],
    Umbreon: ['Dark'],
    Vaporeon: ['Water'],
    Jolteon: ['Electric'],
    Flareon: ['Fire'],
    Leafeon: ['Grass'],
    Sylveon: ['Fairy'],
    Hatterene: ['Psychic', 'Fairy'],
    'Starter Ace': ['Normal'],
  };

  return known[species] ?? [];
}

const evolutionTypeHints: Record<string, PokemonType[]> = {
  Bulbasaur: ['Grass', 'Poison'],
  Ivysaur: ['Grass', 'Poison'],
  Charmander: ['Fire', 'Flying'],
  Charmeleon: ['Fire', 'Flying'],
  Squirtle: ['Water'],
  Wartortle: ['Water'],
  Caterpie: ['Bug', 'Flying'],
  Metapod: ['Bug', 'Flying'],
  Weedle: ['Bug', 'Poison'],
  Kakuna: ['Bug', 'Poison'],
  Pidgey: ['Normal', 'Flying'],
  Pidgeotto: ['Normal', 'Flying'],
  Rattata: ['Normal'],
  Spearow: ['Normal', 'Flying'],
  Ekans: ['Poison'],
  Pikachu: ['Electric'],
  Sandshrew: ['Ground'],
  NidoranF: ['Poison', 'Ground'],
  Nidorina: ['Poison', 'Ground'],
  NidoranM: ['Poison', 'Ground'],
  Nidorino: ['Poison', 'Ground'],
  Clefairy: ['Fairy'],
  Vulpix: ['Fire'],
  Jigglypuff: ['Normal', 'Fairy'],
  Zubat: ['Poison', 'Flying'],
  Oddish: ['Grass', 'Poison'],
  Gloom: ['Grass', 'Poison'],
  Paras: ['Bug', 'Grass'],
  Venonat: ['Bug', 'Poison'],
  Diglett: ['Ground'],
  Meowth: ['Normal'],
  Psyduck: ['Water'],
  Mankey: ['Fighting'],
  Growlithe: ['Fire'],
  Poliwag: ['Water', 'Fighting'],
  Poliwhirl: ['Water', 'Fighting'],
  Abra: ['Psychic'],
  Kadabra: ['Psychic'],
  Machop: ['Fighting'],
  Machoke: ['Fighting'],
  Bellsprout: ['Grass', 'Poison'],
  Weepinbell: ['Grass', 'Poison'],
  Tentacool: ['Water', 'Poison'],
  Geodude: ['Rock', 'Ground'],
  Graveler: ['Rock', 'Ground'],
  Ponyta: ['Fire'],
  Slowpoke: ['Water', 'Psychic'],
  Magnemite: ['Electric', 'Steel'],
  Doduo: ['Normal', 'Flying'],
  Seel: ['Water', 'Ice'],
  Grimer: ['Poison'],
  Shellder: ['Water', 'Ice'],
  Gastly: ['Ghost', 'Poison'],
  Haunter: ['Ghost', 'Poison'],
  Drowzee: ['Psychic'],
  Krabby: ['Water'],
  Voltorb: ['Electric'],
  Exeggcute: ['Grass', 'Psychic'],
  Cubone: ['Ground'],
  Koffing: ['Poison'],
  Rhyhorn: ['Ground', 'Rock'],
  Horsea: ['Water', 'Dragon'],
  Goldeen: ['Water'],
  Staryu: ['Water', 'Psychic'],
  Magikarp: ['Water', 'Flying'],
  Eevee: ['Water', 'Electric', 'Fire', 'Psychic', 'Dark', 'Grass', 'Ice', 'Fairy'],
  Dratini: ['Dragon', 'Flying'],
  Lechonk: ['Normal'],
  Tarountula: ['Bug'],
  Pawmi: ['Electric', 'Fighting'],
  Hoppip: ['Grass', 'Flying'],
  Fletchling: ['Normal', 'Flying', 'Fire'],
  Fidough: ['Fairy'],
  Azurill: ['Water', 'Fairy'],
  Marill: ['Water', 'Fairy'],
  Ralts: ['Psychic', 'Fairy'],
  Shinx: ['Electric'],
  Riolu: ['Fighting', 'Steel'],
  Charcadet: ['Fire', 'Ghost', 'Psychic'],
  Tadbulb: ['Electric'],
  Wattrel: ['Electric', 'Flying'],
  Maschiff: ['Dark'],
  Tinkatink: ['Fairy', 'Steel'],
  Glimmet: ['Rock', 'Poison'],
  Greavard: ['Ghost'],
  Frigibax: ['Dragon', 'Ice'],
};

function speciesMatchesMonotype(species: string, monotype?: PokemonType) {
  if (!monotype) return true;
  const currentTypes = pokemonTypesForSpecies(species);
  const familyTypes = evolutionTypeHints[species] ?? [];
  return [...currentTypes, ...familyTypes].includes(monotype);
}

function bossTypes(boss: NuzlockeBoss) {
  const mapped: Record<string, PokemonType[]> = {
    katy: ['Bug'],
    brassius: ['Grass'],
    iono: ['Electric'],
    kofu: ['Water'],
    larry: ['Normal'],
    ryme: ['Ghost'],
    tulip: ['Psychic'],
    grusha: ['Ice'],
    klawf: ['Rock'],
    bombirdier: ['Flying', 'Dark'],
    orthworm: ['Steel'],
    'great-tusk-iron-treads': ['Ground'],
    tatsugiri: ['Water', 'Dragon'],
    giacomo: ['Dark'],
    mela: ['Fire'],
    atticus: ['Poison'],
    ortega: ['Fairy'],
    eri: ['Fighting'],
    rika: ['Ground'],
    poppy: ['Steel'],
    'larry-e4': ['Flying'],
    hassel: ['Dragon'],
    'champion-geeta': ['Rock', 'Poison'],
    penny: ['Fairy', 'Dark'],
    'brock-rb': ['Rock'],
    'brock-y': ['Rock'],
    'misty-rb': ['Water'],
    'misty-y': ['Water'],
    'surge-rb': ['Electric'],
    'surge-y': ['Electric'],
    'erika-rb': ['Grass'],
    'erika-y': ['Grass'],
    'koga-rb': ['Poison'],
    'koga-y': ['Poison'],
    'sabrina-rb': ['Psychic'],
    'sabrina-y': ['Psychic'],
    'blaine-rb': ['Fire'],
    'blaine-y': ['Fire'],
    'giovanni-rb': ['Ground'],
    'giovanni-y': ['Ground'],
    'lorelei-rb': ['Ice', 'Water'],
    'lorelei-y': ['Ice', 'Water'],
    'bruno-rb': ['Fighting', 'Rock'],
    'bruno-y': ['Fighting', 'Rock'],
    'agatha-rb': ['Ghost', 'Poison'],
    'agatha-y': ['Ghost', 'Poison'],
    'lance-rb': ['Dragon', 'Flying'],
    'lance-y': ['Dragon', 'Flying'],
    'champion-rb': ['Normal'],
    'champion-y': ['Normal'],
  };

  return mapped[boss.id] ?? pokemonTypesForSpecies(boss.pokemon?.[0]?.species ?? '');
}

function normalizePokemonApiName(species: string) {
  const cleanSpecies = species.split('/')[0]?.trim();
  const mapped: Record<string, string> = {
    MrMime: 'mr-mime',
    NidoranF: 'nidoran-f',
    NidoranM: 'nidoran-m',
    'Great Tusk': 'great-tusk',
    'Iron Treads': 'iron-treads',
    'Segin Starmobile': 'revavroom',
    'Schedar Starmobile': 'revavroom',
    'Navi Starmobile': 'revavroom',
    'Ruchbah Starmobile': 'revavroom',
    'Caph Starmobile': 'revavroom',
  };

  return mapped[cleanSpecies] ?? cleanSpecies.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function usePublicPokemonTypes(species: string, fallbackTypes: PokemonType[]) {
  const fallbackKey = fallbackTypes.join('|');
  const [types, setTypes] = useState<PokemonType[]>(fallbackTypes);

  useEffect(() => {
    setTypes(fallbackTypes);
    if (fallbackTypes.length > 0 || !species || species.includes('Team') || species.includes('Ace')) return;

    let active = true;
    fetch(`https://pokeapi.co/api/v2/pokemon/${normalizePokemonApiName(species)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data?.types) return;
        const fetchedTypes = data.types
          .map((entry: { type?: { name?: string } }) => {
            const name = entry.type?.name;
            return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
          })
          .filter((name: string): name is PokemonType => pokemonTypes.includes(name as PokemonType));
        if (fetchedTypes.length > 0) setTypes(fetchedTypes);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [species, fallbackKey]);

  return types;
}

function pokemonBaseStats(species: string) {
  const stats: Record<string, { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }> = {
    Geodude: { hp: 40, atk: 80, def: 100, spa: 30, spd: 30, spe: 20 },
    Onix: { hp: 35, atk: 45, def: 160, spa: 30, spd: 45, spe: 70 },
    Staryu: { hp: 30, atk: 45, def: 55, spa: 70, spd: 55, spe: 85 },
    Starmie: { hp: 60, atk: 75, def: 85, spa: 100, spd: 85, spe: 115 },
    Voltorb: { hp: 40, atk: 30, def: 50, spa: 55, spd: 55, spe: 100 },
    Pikachu: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    Raichu: { hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 110 },
    Victreebel: { hp: 80, atk: 105, def: 65, spa: 100, spd: 70, spe: 70 },
    Tangela: { hp: 65, atk: 55, def: 115, spa: 100, spd: 40, spe: 60 },
    Vileplume: { hp: 75, atk: 80, def: 85, spa: 110, spd: 90, spe: 50 },
    Koffing: { hp: 40, atk: 65, def: 95, spa: 60, spd: 45, spe: 35 },
    Muk: { hp: 105, atk: 105, def: 75, spa: 65, spd: 100, spe: 50 },
    Weezing: { hp: 65, atk: 90, def: 120, spa: 85, spd: 70, spe: 60 },
    Kadabra: { hp: 40, atk: 35, def: 30, spa: 120, spd: 70, spe: 105 },
    Alakazam: { hp: 55, atk: 50, def: 45, spa: 135, spd: 95, spe: 120 },
    Venomoth: { hp: 70, atk: 65, def: 60, spa: 90, spd: 75, spe: 90 },
    Gyarados: { hp: 95, atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
    Dragonite: { hp: 91, atk: 134, def: 95, spa: 100, spd: 100, spe: 80 },
  };

  return stats[species];
}

function defaultMoveHints(pokemon: NuzlockeBossPokemon): NuzlockeMove[] {
  if (pokemon.moves?.length) return pokemon.moves;
  const types = pokemonTypesForSpecies(pokemon.species);
  return types.slice(0, 2).map((type) => ({ name: `${type} attack`, type, power: null }));
}

function trainerSpriteSlug(name: string) {
  const mapped: Record<string, string> = {
    'Lt. Surge': 'ltsurge',
    'Champion Rival': 'blue',
    'Stony Cliff Titan': 'hiker',
    'Open Sky Titan': 'birdkeeper',
    'Lurking Steel Titan': 'worker-gen4dp',
    'Quaking Earth Titan': 'backpacker-gen5',
    'False Dragon Titan': 'fisherman-gen4dp',
    'Nemona Rival Fights': 'nemona',
    'Champion Geeta': 'geeta',
  };

  return mapped[name] ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function TrainerSprite({ name }: { name: string }) {
  const slug = trainerSpriteSlug(name);
  const src = `https://play.pokemonshowdown.com/sprites/trainers/${slug}.png`;

  return (
    <span className="flex h-16 w-16 shrink-0 items-end justify-center rounded-2xl bg-white/70 shadow-sm">
      <img
        src={src}
        alt={`${name} trainer sprite`}
        className="max-h-16 max-w-14 object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </span>
  );
}

function MonsterToken({
  species,
  status,
  compact = false,
  large = false,
  types = [],
}: {
  species: string;
  status?: PokemonStatus;
  compact?: boolean;
  large?: boolean;
  types?: PokemonType[];
}) {
  const spriteUrl = getPokemonSpriteUrl(species);
  const initials = species
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

  const tokenSize = large ? 'h-24 w-24' : compact ? 'h-12 w-12' : 'h-20 w-20';
  const imageSize = large ? 'h-24 w-24' : compact ? 'h-12 w-12' : 'h-[4.75rem] w-[4.75rem]';
  const style = {
    ...typeStyle(types),
    borderColor: status === 'Dead' ? '#ef5350' : typeHex[types[0] ?? 'Normal'],
    background: types.length > 1
      ? `linear-gradient(135deg, ${typeHex[types[0]]}22, white 46%, ${typeHex[types[1]]}22)`
      : `linear-gradient(135deg, ${typeHex[types[0] ?? 'Normal']}22, white 58%)`,
  } as CSSProperties;

  return (
    <div style={style} className={`flex ${tokenSize} shrink-0 items-center justify-center rounded-full border-2 text-sm font-black shadow-[2px_2px_0_rgba(24,42,64,0.12)] ${
      status === 'Dead' ? 'border-[#ef5350] bg-white text-[#182a40]' : 'border-[#182a40] bg-white text-[#182a40]'
    }`}>
      {spriteUrl ? (
        <img
          src={spriteUrl}
          alt={species}
          className={`${imageSize} object-contain ${status === 'Dead' ? 'grayscale opacity-75' : ''}`}
          style={{ imageRendering: 'pixelated' }}
        />
      ) : initials}
    </div>
  );
}

export function NuzlockeTracker() {
  const [runs, setRuns] = useState<NuzlockeRun[]>([]);
  const [activeRunId, setActiveRunId] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameVersion | ''>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(nuzlockeStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const storedRuns = normalizeRuns(parsed);
      setRuns(storedRuns);
      setActiveRunId(storedRuns[0]?.id ?? '');
    } catch {
      setRuns([]);
      setActiveRunId('');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(nuzlockeStorageKey, JSON.stringify(runs));
  }, [loaded, runs]);

  const activeRun = runs.find((run) => run.id === activeRunId);

  const updateRun = (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => {
    setRuns((currentRuns) => currentRuns.map((run) => (run.id === runId ? updater(run) : run)));
  };

  const addTimeline = (run: NuzlockeRun, type: string, message: string): NuzlockeRun => ({
    ...run,
    updatedAt: nowLabel(),
    timeline: [
      {
        id: makeId('event'),
        createdAt: nowLabel(),
        type,
        message,
      },
      ...(Array.isArray(run.timeline) ? run.timeline : []),
    ],
  });

  const createRun = (run: NuzlockeRun) => {
    setRuns((currentRuns) => [run, ...currentRuns]);
    setActiveRunId(run.id);
    setSelectedGame('');
  };

  const currentGame = activeRun?.gameVersion ?? selectedGame;

  return (
    <section className={`min-h-screen ${trackerTheme(currentGame)}`} style={{ ...trackerVars(currentGame), fontFamily: readableFont }}>
      <div className="mx-auto max-w-7xl p-3 sm:p-5">
      <header className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${panelClass}`}>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">RepeatChannel Tool</div>
          <h1 className="text-2xl font-black sm:text-3xl">Pokemon Nuzlocke Tracker</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {runs.length > 0 ? (
            <select value={activeRunId} onChange={(event) => setActiveRunId(event.target.value)} className={fieldClass}>
              {runs.map((run) => (
                <option key={run.id} value={run.id}>{run.runName}</option>
              ))}
            </select>
          ) : null}
          <button onClick={() => setSelectedGame('')} className={smallButtonClass}>
            New Run
          </button>
        </div>
      </header>

      {!activeRun && !selectedGame ? <GameVersionPicker onSelect={setSelectedGame} /> : null}
      {!activeRun && selectedGame ? <RunSetupForm gameVersion={selectedGame} onBack={() => setSelectedGame('')} onCreate={createRun} /> : null}
      {activeRun ? <NuzlockeDashboard run={activeRun} updateRun={updateRun} addTimeline={addTimeline} onNewRun={() => setActiveRunId('')} /> : null}
      </div>
    </section>
  );
}

function GameVersionPicker({ onSelect }: { onSelect: (game: GameVersion) => void }) {
  return (
    <section className={panelClass}>
      <h2 className="text-3xl font-black">Choose Your Game</h2>
      <p className="mt-2 text-sm font-bold text-[#506078]">Red, Blue, Yellow, Scarlet, and Violet are wired in. The rest are parked here for later.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gameGroups.map((group) => (
          <div key={group.generation} className={softPanelClass}>
            <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">{group.generation}</div>
            <div className="grid grid-cols-2 gap-2">
              {(group.games || []).map((game) => (
                <button
                  key={game.name}
                  onClick={() => game.supported && onSelect(game.name)}
                  disabled={!game.supported}
                  className={`min-h-12 rounded-xl border px-2 text-sm font-black shadow-sm transition ${
                    game.supported
                      ? 'border-[#182a40] bg-[var(--nuz-accent-soft)] hover:-translate-y-0.5'
                      : 'border-[#d9e2ee] bg-white/75 text-[#8a97aa] opacity-75'
                  }`}
                >
                  {game.name}
                  {!game.supported ? <span className="block text-[10px]">Coming Soon</span> : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RunSetupForm({
  gameVersion,
  onBack,
  onCreate,
}: {
  gameVersion: GameVersion;
  onBack: () => void;
  onCreate: (run: NuzlockeRun) => void;
}) {
  const [runName, setRunName] = useState(`${gameVersion} Run`);
  const [runType, setRunType] = useState<RunType>('Standard Nuzlocke');
  const [rules, setRules] = useState<NuzlockeRules>(defaultRules);
  const [error, setError] = useState('');

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!runName.trim()) {
      setError('Run name is required.');
      return;
    }

    const run: NuzlockeRun = {
      id: makeId('run'),
      runName: runName.trim(),
      gameVersion,
      runType,
      rules,
      team: [],
      encounters: [],
      bosses: getNuzlockeBosses(gameVersion),
      timeline: [
        { id: makeId('event'), createdAt: nowLabel(), type: 'Run Created', message: `${runName.trim()} started in ${gameVersion}.` },
        { id: makeId('event'), createdAt: nowLabel(), type: 'Game Selected', message: `${gameVersion} selected.` },
      ],
      createdAt: nowLabel(),
      updatedAt: nowLabel(),
    };

    onCreate(run);
  };

  return (
    <form onSubmit={create} className={panelClass}>
      <button type="button" onClick={onBack} className={`mb-4 ${smallButtonClass}`}>Back to Games</button>
      <h2 className="text-3xl font-black">Run Setup</h2>
      <div className="mt-1 text-sm font-black text-[var(--nuz-accent)]">{gameVersion}</div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Run name
          <input value={runName} onChange={(event) => setRunName(event.target.value)} className={fieldClass} />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Run type
          <select value={runType} onChange={(event) => setRunType(event.target.value as RunType)} className={fieldClass}>
            {runTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>

      {runType === 'Monotype' ? (
        <label className="mt-4 grid gap-2 text-sm font-black">
          Monotype
          <select value={rules.monotype || 'Normal'} onChange={(event) => setRules((current) => ({ ...current, monotype: event.target.value as PokemonType }))} className={fieldClass}>
            {pokemonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      ) : null}

      <div className="mt-5">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Rules</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ruleLabels.map((rule) => (
            <label key={rule.key} className="flex items-center gap-2 rounded-xl bg-white/75 p-3 text-xs font-black shadow-sm">
              <input
                type="checkbox"
                checked={Boolean(rules[rule.key])}
                onChange={(event) => setRules((current) => ({ ...current, [rule.key]: event.target.checked }))}
              />
              {rule.label}
            </label>
          ))}
        </div>
      </div>

      {error ? <div className="mt-3 rounded-lg bg-[#fff2f0] p-2 text-sm font-black text-[#9f2c24]">{error}</div> : null}
      <button className="mt-5 rounded-xl bg-[var(--nuz-accent-soft)] px-5 py-3 text-sm font-black shadow-[0_8px_20px_rgba(24,42,64,0.14)]">Create Run</button>
    </form>
  );
}

function NuzlockeDashboard({
  run,
  updateRun,
  addTimeline,
  onNewRun,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
  onNewRun: () => void;
}) {
  const [tab, setTab] = useState<Tab>('Overview');
  const tabs: Tab[] = ['Overview', 'Team / Box', 'Encounters', 'Badges / Bosses', 'Graveyard', 'Timeline'];

  return (
    <div className="grid gap-4 pb-28">
      <section className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">{run.gameVersion} / {run.runType}</div>
            <h2 className="text-3xl font-black">{run.runName}</h2>
          </div>
          <button onClick={onNewRun} className={smallButtonClass}>
            Back to Game Chooser
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black shadow-sm transition ${
                tab === item ? 'bg-[#182a40] text-white' : 'bg-white/80 hover:bg-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {tab === 'Overview' ? <Overview run={run} /> : null}
      {tab === 'Team / Box' ? <TeamTracker run={run} updateRun={updateRun} addTimeline={addTimeline} /> : null}
      {tab === 'Encounters' ? <EncounterTracker run={run} updateRun={updateRun} addTimeline={addTimeline} /> : null}
      {tab === 'Badges / Bosses' ? <BossTracker run={run} updateRun={updateRun} addTimeline={addTimeline} /> : null}
      {tab === 'Graveyard' ? <Graveyard run={run} /> : null}
      {tab === 'Timeline' ? <TimelineLog run={run} /> : null}
      <CurrentTeamBar run={run} updateRun={updateRun} addTimeline={addTimeline} />
    </div>
  );
}

function CurrentTeamBar({
  run,
  updateRun,
  addTimeline,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
}) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const party = (run.team || []).filter((pokemon) => pokemon.status === 'Party').slice(0, 6);
  const slots: (NuzlockePokemon | null)[] = [...party, ...Array.from({ length: Math.max(0, 6 - party.length) }, () => null)];

  const updatePokemonStatus = (pokemon: NuzlockePokemon, status: PokemonStatus) => {
    updateRun(run.id, (current) => {
      const nextRun = {
        ...current,
        updatedAt: nowLabel(),
        team: (current.team || []).map((item) =>
          item.id === pokemon.id
            ? {
                ...item,
                status,
                ...(status === 'Dead'
                  ? {
                      levelDied: item.level,
                      causeOfDeath: item.causeOfDeath || 'Team bar quick mark',
                      deathLocation: item.deathLocation || item.metLocation || 'Not recorded',
                    }
                  : {}),
              }
            : item
        ),
      };

      return status === 'Dead'
        ? addTimeline(nextRun, 'Pokemon Died', `${pokemon.nickname || pokemon.species} was marked dead from the team bar.`)
        : nextRun;
    });
    setActiveSlot(null);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/85 px-3 py-2 shadow-[0_-14px_35px_rgba(24,42,64,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
        <div className="shrink-0 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Current Team</div>
        {slots.map((pokemon, index) => {
          const slotId = pokemon?.id ?? `empty-${index}`;
          const isActive = activeSlot === slotId;

          return (
            <div key={slotId} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setActiveSlot(isActive ? null : slotId)}
                className={`flex min-w-[150px] items-center gap-2 rounded-xl p-2 text-left shadow-sm ${
                  pokemon ? 'bg-white' : 'border border-dashed border-[#c8d2df] bg-white/55 text-[#8a97aa]'
                }`}
              >
                {pokemon ? <MonsterToken species={pokemon.species} status={pokemon.status} types={pokemon.types} compact /> : <div className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-[#9baec8] bg-white text-sm font-black">+</div>}
                <div className="min-w-0">
                  <div className="truncate text-xs font-black">{pokemon ? pokemon.nickname || pokemon.species : `Slot ${index + 1}`}</div>
                  <div className="text-[11px] font-bold text-[#506078]">{pokemon ? `Lv ${pokemon.level} / ${pokemon.species}` : 'Empty party spot'}</div>
                </div>
              </button>
              {isActive ? (
                <div className="absolute bottom-full left-0 z-40 mb-2 w-56 rounded-xl bg-white p-2 shadow-[0_14px_35px_rgba(24,42,64,0.18)]">
                  {pokemon ? (
                    <div className="grid gap-2">
                      <div className="text-xs font-black">{pokemon.nickname || pokemon.species}</div>
                      <button type="button" onClick={() => updatePokemonStatus(pokemon, 'Boxed')} className={smallButtonClass}>Box It</button>
                      <button type="button" onClick={() => updatePokemonStatus(pokemon, 'Dead')} className="rounded-lg bg-[#fff2f0] px-3 py-2 text-xs font-black text-[#9f2c24] shadow-sm">Mark Dead</button>
                      <button type="button" onClick={() => updatePokemonStatus(pokemon, 'Released')} className={smallButtonClass}>Release</button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold leading-5 text-[#506078]">Empty slot. Add a caught Pokemon from the Team tab and it will land here.</div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Overview({ run }: { run: NuzlockeRun }) {
  const team = run.team || [];
  const encounters = run.encounters || [];
  const bosses = run.bosses || [];
  const rules = run.rules || defaultRules;
  const deaths = team.filter((pokemon) => pokemon.status === 'Dead').length;
  const caught = encounters.filter((encounter) => encounter.status === 'Caught').length;
  const completedBosses = bosses.filter((boss) => boss.completed).length;
  const enabledRules = ruleLabels.filter((rule) => Boolean(rules[rule.key])).map((rule) => rule.label);

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className={panelClass}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Progress" value={`${completedBosses}/${bosses.length || 0}`} />
          <Stat label="Team Count" value={team.filter((pokemon) => pokemon.status === 'Party').length} />
          <Stat label="Death Count" value={deaths} />
          <Stat label="Encounters Caught" value={caught} />
        </div>
      </div>
      <RuleSummary rules={enabledRules} monotype={rules.monotype} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/70 p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function RuleSummary({ rules, monotype }: { rules: string[]; monotype?: PokemonType }) {
  return (
    <div className={panelClass}>
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Rules Summary</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(rules || []).map((rule) => <span key={rule} className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm">{rule}</span>)}
        {monotype ? <TypeBadge type={monotype} /> : null}
      </div>
    </div>
  );
}

function TeamTracker({
  run,
  updateRun,
  addTimeline,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
}) {
  const caughtEncounters = (run.encounters || []).filter((encounter) => encounter.status === 'Caught');
  const encounterIdsOnTeam = new Set((run.team || []).map((pokemon) => pokemon.encounterId).filter(Boolean));
  const availableEncounters = caughtEncounters.filter((encounter) => !encounterIdsOnTeam.has(encounter.id));
  const hasNatures = !isGenOneGame(run.gameVersion);
  const hasAbilities = !isGenOneGame(run.gameVersion);

  const addPokemonFromEncounter = (encounter: NuzlockeEncounter | undefined) => {
    if (!encounter?.pokemon || encounterIdsOnTeam.has(encounter.id)) return;
    const pokemon: NuzlockePokemon = {
      id: makeId('pokemon'),
      encounterId: encounter.id,
      metLocation: encounter.location,
      species: encounter.pokemon,
      nickname: encounter.nickname,
      level: encounter.levelMet,
      types: encounter.types || [],
      nature: encounter.nature ?? 'Not Sure',
      ability: encounter.ability ?? getAbilityOptions(encounter.pokemon)[0],
      heldItem: 'None',
      status: 'Party',
      notes: encounter.notes,
    };

    updateRun(run.id, (current) => addTimeline({ ...current, team: [pokemon, ...(current.team || [])] }, 'Pokemon Added', `${pokemon.nickname || pokemon.species} joined the run.`));
  };

  const markDead = (pokemon: NuzlockePokemon) => {
    updateRun(run.id, (current) => addTimeline({
      ...current,
      team: (current.team || []).map((item) =>
        item.id === pokemon.id
          ? { ...item, status: 'Dead', levelDied: item.level, causeOfDeath: 'Quick marked dead', deathLocation: item.metLocation || 'Not recorded' }
          : item
      ),
    }, 'Pokemon Died', `${pokemon.nickname || pokemon.species} died at level ${pokemon.level}.`));
  };

  const setStatus = (id: string, status: PokemonStatus) => {
    updateRun(run.id, (current) => ({ ...current, updatedAt: nowLabel(), team: (current.team || []).map((pokemon) => pokemon.id === id ? { ...pokemon, status } : pokemon) }));
  };

  const updatePokemon = (id: string, changes: Partial<NuzlockePokemon>) => {
    updateRun(run.id, (current) => ({
      ...current,
      updatedAt: nowLabel(),
      team: (current.team || []).map((pokemon) => (pokemon.id === id ? { ...pokemon, ...changes } : pokemon)),
    }));
  };

  return (
    <section className="grid gap-4">
      <div className="grid gap-4">
        <div className={panelClass}>
          <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Available Caught Pokemon</div>
          {caughtEncounters.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#c8d2df] bg-white/65 p-3 text-sm font-bold text-[#506078]">
              Catch an encounter first. Caught Pokemon will show up here automatically.
            </div>
          ) : availableEncounters.length === 0 ? (
            <div className="text-sm font-bold text-[#506078]">No unused catches available. Log a caught encounter or move someone off the team list.</div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {availableEncounters.map((encounter) => (
                <button
                  key={encounter.id}
                  onClick={() => addPokemonFromEncounter(encounter)}
                  style={typeCardStyle(encounter.types)}
                  className="rounded-xl p-3 text-left text-xs font-black shadow-sm transition hover:-translate-y-0.5"
                  title="Add to team"
                >
                  <span className="flex items-center gap-2">
                    <MonsterToken species={encounter.pokemon} types={encounter.types} compact />
                    <span>
                      <span className="block text-sm">{encounter.pokemon}</span>
                      <span className="block text-[#506078]">{encounter.location}</span>
                    </span>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1">{(encounter.types || []).map((type) => <TypeBadge key={type} type={type} />)}</span>
                  <span className="mt-2 block pt-2 text-[11px] text-[var(--nuz-accent)]">Click to add</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(run.team || []).map((pokemon) => (
            <article key={pokemon.id} className={panelClass}>
              <div className="flex items-start gap-3">
                <MonsterToken species={pokemon.species} status={pokemon.status} types={pokemon.types} />
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black">{pokemon.nickname || pokemon.species}</h3>
                  <div className="text-xs font-bold text-[#506078]">{pokemon.species} / Lv {pokemon.level}</div>
                  <div className="mt-1 text-[11px] font-black text-[var(--nuz-accent)]">{pokemon.metLocation || 'Unknown area'}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">{(pokemon.types || []).map((type) => <TypeBadge key={type} type={type} />)}</div>
              {hasNatures || hasAbilities ? (
                <div className="mt-3 text-xs font-bold text-[#506078]">
                  {[hasNatures ? pokemon.nature : '', hasAbilities ? pokemon.ability : ''].filter(Boolean).join(' / ')}
                </div>
              ) : null}
              <label className="mt-3 grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
                Held item
                <span className="flex items-center gap-2">
                  <ItemSprite item={pokemon.heldItem || 'None'} />
                  <select value={pokemon.heldItem || 'None'} onChange={(event) => updatePokemon(pokemon.id, { heldItem: event.target.value })} className={`${fieldClass} min-w-0 flex-1 text-xs normal-case tracking-normal text-[#182a40]`}>
                    {heldItemOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </span>
              </label>
              <p className="mt-2 text-sm font-bold leading-6">{pokemon.notes}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ChoiceButtons options={['Party', 'Boxed', 'Released'] as PokemonStatus[]} value={pokemon.status} onChange={(status) => setStatus(pokemon.id, status)} />
                {pokemon.status !== 'Dead' ? (
                  <button onClick={() => markDead(pokemon)} className="flex items-center gap-1 rounded-lg bg-[#fff2f0] px-2 py-1 text-xs font-black text-[#9f2c24]">
                    <Skull size={13} />
                    Dead
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EncounterTracker({
  run,
  updateRun,
  addTimeline,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
}) {
  const caughtLocations = new Set((run.encounters || []).filter((encounter) => encounter.status === 'Caught').map((encounter) => encounter.location));
  const locations = getNuzlockeLocations(run.gameVersion);
  const encounterOptionsByLocation = getNuzlockeEncounterOptions(run.gameVersion);
  const firstOpenLocation = locations.find((location) => !caughtLocations.has(location)) ?? locations[0];
  const initialOptions = encounterOptionsByLocation[firstOpenLocation] ?? [];
  const [form, setForm] = useState({
    location: firstOpenLocation,
    pokemon: initialOptions[0]?.species ?? '',
    nickname: '',
    levelMet: '5',
    status: 'Caught' as EncounterStatus,
    types: initialOptions[0]?.types ?? (['Normal'] as PokemonType[]),
    nature: 'Not Sure',
    ability: getAbilityOptions(initialOptions[0]?.species ?? '')[0],
    notes: '',
  });
  const [showSurfEncounters, setShowSurfEncounters] = useState(false);
  const [showFishingEncounters, setShowFishingEncounters] = useState(false);

  const monotype = run.runType === 'Monotype' ? run.rules?.monotype : undefined;
  const encounterOptions = (encounterOptionsByLocation[form.location] ?? []).filter((option) => speciesMatchesMonotype(option.species, monotype));
  const canShowEncounterOption = (option: { surfMethod?: boolean; fishingMethod?: boolean }) =>
    (!option.surfMethod || showSurfEncounters) && (!option.fishingMethod || showFishingEncounters);
  const visibleEncounterOptions = encounterOptions.filter(canShowEncounterOption);
  const selectedAbilityOptions = getAbilityOptions(form.pokemon);
  const locationAlreadyCaught = caughtLocations.has(form.location);
  const hasNatures = !isGenOneGame(run.gameVersion);
  const hasAbilities = !isGenOneGame(run.gameVersion) && selectedAbilityOptions.some((option) => option !== 'No abilities in Gen 1');
  const loggedByLocation = new Map((run.encounters || []).map((encounter) => [encounter.location, encounter]));
  const openLocations = locations.filter((location) => !loggedByLocation.has(location));
  const completedLocations = locations.filter((location) => loggedByLocation.has(location));
  const orderedLocations = [...openLocations, ...completedLocations];

  const chooseLocation = (location: string) => {
    const options = (encounterOptionsByLocation[location] ?? [])
      .filter((option) => speciesMatchesMonotype(option.species, monotype))
      .filter(canShowEncounterOption);
    const firstOption = options[0];
    setForm((current) => ({
      ...current,
      location,
      pokemon: firstOption?.species ?? '',
      types: firstOption?.types ?? (['Normal'] as PokemonType[]),
      ability: getAbilityOptions(firstOption?.species ?? '')[0],
    }));
  };

  const choosePokemon = (species: string) => {
    const selected = visibleEncounterOptions.find((option) => option.species === species);
    const guessedTypes = pokemonTypesForSpecies(species);
    setForm((current) => ({
      ...current,
      pokemon: species,
      types: selected?.types ?? guessedTypes ?? current.types,
      ability: getAbilityOptions(species)[0],
    }));
  };

  const typeManualPokemon = (species: string) => {
    const guessedTypes = pokemonTypesForSpecies(species);
    setForm((current) => ({
      ...current,
      pokemon: species,
      types: guessedTypes.length > 0 ? guessedTypes : current.types,
      ability: getAbilityOptions(species)[0],
    }));
  };

  useEffect(() => {
    const currentStillVisible = visibleEncounterOptions.some((option) => option.species === form.pokemon);
    if (currentStillVisible) return;
    const firstOption = visibleEncounterOptions[0];
    setForm((current) => ({
      ...current,
      pokemon: firstOption?.species ?? '',
      types: firstOption?.types ?? (['Normal'] as PokemonType[]),
      ability: getAbilityOptions(firstOption?.species ?? '')[0],
    }));
  }, [form.pokemon, visibleEncounterOptions]);

  const addEncounter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.location.trim()) return;
    if (form.status === 'Caught' && locationAlreadyCaught) return;

    const encounter: NuzlockeEncounter = {
      id: makeId('encounter'),
      location: form.location.trim(),
      pokemon: form.pokemon.trim(),
      nickname: form.nickname.trim(),
      levelMet: safeNumber(form.levelMet),
      status: form.status,
      types: form.types,
      nature: form.nature,
      ability: form.ability,
      notes: form.notes.trim(),
    };

    updateRun(run.id, (current) => addTimeline({ ...current, encounters: [encounter, ...(current.encounters || [])] }, encounter.status === 'Caught' ? 'Encounter Caught' : 'Encounter Logged', `${encounter.location}: ${encounter.pokemon || encounter.status}.`));
    const nextOpenLocation = locations.find((location) => location !== form.location && !loggedByLocation.has(location)) ?? form.location;
    const nextOptions = (encounterOptionsByLocation[nextOpenLocation] ?? []).filter(canShowEncounterOption);
    const firstOption = nextOptions[0];
    setForm((current) => ({
      ...current,
      location: nextOpenLocation,
      pokemon: firstOption?.species ?? '',
      nickname: '',
      levelMet: '5',
      types: firstOption?.types ?? (['Normal'] as PokemonType[]),
      nature: 'Not Sure',
      ability: getAbilityOptions(firstOption?.species ?? '')[0],
      notes: '',
    }));
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className={panelClass}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Route Board</div>
            <h3 className="text-lg font-black">Pick an encounter area</h3>
            <p className="mt-1 text-xs font-bold text-[#506078]">Click a route once to reveal its available Pokemon.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-xl bg-white/70 p-3 text-xs font-black shadow-sm">
              <input
                type="checkbox"
                checked={showSurfEncounters}
                onChange={(event) => setShowSurfEncounters(event.target.checked)}
              />
              Show surf encounters
            </label>
            <label className="flex items-center gap-2 rounded-xl bg-white/70 p-3 text-xs font-black shadow-sm">
              <input
                type="checkbox"
                checked={showFishingEncounters}
                onChange={(event) => setShowFishingEncounters(event.target.checked)}
              />
              Show fishing rod encounters
            </label>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {orderedLocations.map((location) => {
            const logged = loggedByLocation.get(location);
            const options = (encounterOptionsByLocation[location] ?? [])
              .filter((option) => speciesMatchesMonotype(option.species, monotype))
              .filter(canShowEncounterOption);
            const isSelected = form.location === location;

            return (
              <div
                key={location}
                role="button"
                tabIndex={0}
                onClick={() => chooseLocation(location)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') chooseLocation(location);
                }}
                className={`rounded-xl p-3 text-left shadow-sm transition hover:-translate-y-0.5 ${
                  logged
                    ? 'bg-white/55 opacity-70'
                    : isSelected
                      ? 'bg-[var(--nuz-accent-soft)] ring-2 ring-[var(--nuz-accent)]'
                      : 'bg-white/75'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black">{location}</span>
                  {logged ? <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black shadow-sm">{logged.status}</span> : null}
                </div>
                {logged ? (
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold text-[#506078]">
                    <MonsterToken species={logged.pokemon || 'Unknown'} types={logged.types} compact />
                    <span>{logged.pokemon || 'No Pokemon recorded'} / Lv {logged.levelMet}</span>
                  </div>
                ) : isSelected ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {options.length > 0 ? options.map((option) => (
                      <button
                        key={option.species}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          choosePokemon(option.species);
                        }}
                        style={typeCardStyle(option.types)}
                        className="flex items-center gap-3 rounded-xl bg-white p-2 text-left text-xs font-black shadow-sm transition hover:-translate-y-0.5"
                      >
                        <MonsterToken species={option.species} types={option.types} />
                        <span>
                          <span className="block">{option.species}</span>
                          <span className="mt-1 flex flex-wrap gap-1">{option.types.map((type) => <TypeBadge key={type} type={type} />)}</span>
                        </span>
                      </button>
                    )) : (
                      <span className="rounded-xl bg-white p-3 text-xs font-black text-[#6f7b8d]">
                        No listed encounters match the current filters.
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={addEncounter} className={`${panelClass} xl:sticky xl:top-4 xl:self-start`}>
        <div className="mb-3">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Add Encounter</div>
          <h3 className="text-lg font-black">{form.location}</h3>
        </div>
        <div className="grid gap-3">
          <SpriteSelect
            value={form.pokemon}
            onChange={choosePokemon}
            options={visibleEncounterOptions.length > 0 ? visibleEncounterOptions : [{ species: 'Not listed', types: ['Normal'] as PokemonType[] }]}
          />
          <label className="grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
            Randomizer / manual Pokemon
            <input
              value={form.pokemon}
              onChange={(event) => typeManualPokemon(event.target.value)}
              placeholder="Type any Pokemon"
              className={`${fieldClass} text-sm normal-case tracking-normal text-[#182a40]`}
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_88px]">
            <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="Nickname" className={fieldClass} />
            <input value={form.levelMet} onChange={(event) => setForm({ ...form, levelMet: event.target.value })} type="number" min="1" placeholder="Lv" className={fieldClass} />
          </div>
          <div className="grid gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Result</div>
            <div className="grid grid-cols-4 gap-1">
              {(['Caught', 'Failed', 'Skipped', 'Dead'] as EncounterStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, status })}
                  className={`rounded-lg px-2 py-2 text-[11px] font-black shadow-sm ${
                    form.status === status
                      ? 'bg-[#182a40] text-white'
                      : 'bg-white text-[#182a40]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className={softPanelClass}>
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Auto-filled typing</div>
            <div className="flex flex-wrap gap-2">
              {(form.types || []).map((type) => <TypeBadge key={type} type={type} />)}
            </div>
          </div>
          {hasNatures ? (
            <div className="grid gap-2">
              <select value={form.nature} onChange={(event) => setForm({ ...form, nature: event.target.value })} className={fieldClass}>
                {natureOptions.map((nature) => <option key={nature}>{nature}</option>)}
              </select>
              <NatureEffect nature={form.nature} />
            </div>
          ) : null}
          {hasAbilities ? (
            <div className="grid gap-2">
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Ability</div>
              <ChoiceButtons options={selectedAbilityOptions} value={form.ability} onChange={(ability) => setForm({ ...form, ability })} />
            </div>
          ) : null}
          {locationAlreadyCaught && form.status === 'Caught' ? (
            <div className="rounded-xl bg-[#fff2f0] p-3 text-xs font-black text-[#9f2c24]">
              This area already has a caught encounter. Change the result or choose another area.
            </div>
          ) : null}
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className={`${fieldClass} min-h-20`} />
          <button disabled={form.status === 'Caught' && locationAlreadyCaught} className="rounded-xl bg-[var(--nuz-accent-soft)] px-4 py-3 text-sm font-black shadow-[0_8px_20px_rgba(24,42,64,0.14)] disabled:opacity-45">Add Encounter</button>
        </div>
      </form>
    </section>
  );
}

function BossTracker({
  run,
  updateRun,
  addTimeline,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
}) {
  const sortedBosses = [...(run.bosses || [])].sort((a, b) => Number(a.completed) - Number(b.completed));
  const [selectedBossPokemon, setSelectedBossPokemon] = useState<{ bossId: string; pokemon: NuzlockeBossPokemon } | null>(null);
  const [expandedBossId, setExpandedBossId] = useState(sortedBosses.find((boss) => !boss.completed)?.id ?? sortedBosses[0]?.id ?? '');

  const toggleBoss = (boss: NuzlockeBoss) => {
    updateRun(run.id, (current) => {
      const nextCompleted = !boss.completed;
      const nextRun = {
        ...current,
        updatedAt: nowLabel(),
        bosses: (current.bosses || []).map((item) => item.id === boss.id ? { ...item, completed: nextCompleted } : item),
      };
      return nextCompleted ? addTimeline(nextRun, 'Boss Defeated', `${boss.name} completed.`) : nextRun;
    });
  };

  const updateBoss = (bossId: string, changes: Partial<NuzlockeBoss>) => {
    updateRun(run.id, (current) => ({
      ...current,
      updatedAt: nowLabel(),
      bosses: (current.bosses || []).map((boss) => boss.id === bossId ? { ...boss, ...changes } : boss),
    }));
  };

  const toggleExpandedBoss = (bossId: string) => {
    setExpandedBossId((current) => (current === bossId ? '' : bossId));
  };

  return (
    <section className="grid gap-3">
      {sortedBosses.map((boss) => (
        <article key={boss.id} style={typeCardStyle(bossTypes(boss))} className={`rounded-2xl border border-white/75 p-4 shadow-[0_18px_50px_rgba(24,42,64,0.10)] backdrop-blur ${boss.completed ? 'opacity-70' : ''}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleExpandedBoss(boss.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') toggleExpandedBoss(boss.id);
            }}
            className="flex cursor-pointer flex-wrap items-start justify-between gap-3 rounded-2xl p-1 transition hover:bg-white/30"
          >
            <div className="flex min-w-0 items-start gap-3">
              <TrainerSprite name={boss.name} />
              <BadgeToken name={boss.name} types={bossTypes(boss)} />
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">{boss.category}</div>
                <h3 className="mt-1 truncate text-lg font-black">{boss.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1">{bossTypes(boss).map((type) => <TypeBadge key={type} type={type} />)}</div>
                {boss.completed ? <div className="mt-1 text-xs font-black text-[#2f7d4f]">Completed / {boss.deaths} deaths</div> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white/70 px-3 py-2 text-xs font-black shadow-sm">{expandedBossId === boss.id ? 'Open' : 'Closed'}</span>
              <label className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs font-black shadow-sm" onClick={(event) => event.stopPropagation()}>
                <input type="checkbox" checked={boss.completed} onChange={() => toggleBoss(boss)} />
                Done
              </label>
            </div>
          </div>

          {expandedBossId === boss.id ? (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-xs font-black">
                  Level cap
                  <input value={boss.levelCap} onChange={(event) => updateBoss(boss.id, { levelCap: safeNumber(event.target.value) })} type="number" className={fieldClass} />
                </label>
                <label className="grid gap-1 text-xs font-black">
                  Deaths
                  <input value={boss.deaths} onChange={(event) => updateBoss(boss.id, { deaths: Math.max(0, Number(event.target.value) || 0) })} type="number" min="0" className={fieldClass} />
                </label>
              </div>
              <div className={softPanelClass}>
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Pokemon Used</div>
                {(boss.pokemon || []).length > 0 ? (
                  <div className="grid gap-2">
                    {(boss.pokemon || []).map((pokemon) => (
                      <BossPokemonRow
                        key={`${boss.id}-${pokemon.species}-${pokemon.level}`}
                        pokemon={pokemon}
                        bossId={boss.id}
                        selected={selectedBossPokemon?.bossId === boss.id && selectedBossPokemon.pokemon.species === pokemon.species && selectedBossPokemon.pokemon.level === pokemon.level}
                        onSelect={() => setSelectedBossPokemon({ bossId: boss.id, pokemon })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[#506078]">Team data is not listed yet.</div>
                )}
              </div>
              {selectedBossPokemon?.bossId === boss.id ? <BossPokemonDetails pokemon={selectedBossPokemon.pokemon} /> : null}
              <textarea value={boss.notes} onChange={(event) => updateBoss(boss.id, { notes: event.target.value })} placeholder="Notes" className={`${fieldClass} mt-3 min-h-20 w-full text-sm`} />
            </>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function BossPokemonDetails({ pokemon }: { pokemon: NuzlockeBossPokemon }) {
  const types = usePublicPokemonTypes(pokemon.species, pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species));
  const stats = pokemonBaseStats(pokemon.species);
  const matchups = getDefensiveMatchups(types);
  const strong = getStabStrongAgainst(types);
  const moves = defaultMoveHints(pokemon);

  return (
    <div className="mt-3 rounded-2xl bg-white/78 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <MonsterToken species={pokemon.species} types={types} large />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">Scout Report</div>
          <h4 className="text-lg font-black">{pokemon.species}</h4>
          <div className="mt-2 flex flex-wrap gap-1">{types.map((type) => <TypeBadge key={type} type={type} />)}</div>
          {pokemon.teraType ? <div className="mt-2 text-xs font-black">Tera: <TypeBadge type={pokemon.teraType} /></div> : null}
          {pokemon.notes ? <p className="mt-2 text-xs font-bold leading-5 text-[#506078]">{pokemon.notes}</p> : null}
        </div>
      </div>

      {stats ? (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black sm:grid-cols-6">
          {Object.entries(stats).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white p-2 shadow-sm">
              <div className="uppercase text-[#6f7b8d]">{label}</div>
              <div className="text-sm text-[#182a40]">{value}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-3">
        <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Moves</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {moves.map((moveInfo) => (
            <div key={`${moveInfo.name}-${moveInfo.type}`} className="rounded-xl bg-white p-2 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black">{moveInfo.name}</span>
                <TypeBadge type={moveInfo.type} />
              </div>
              <div className="mt-1 text-[11px] font-bold text-[#506078]">Power: {moveInfo.power ?? 'Status'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-[11px] font-black">
        <MatchupRow label="4x weak" types={matchups.weak4x} empty="None" />
        <MatchupRow label="2x weak" types={matchups.weak2x} empty="None" />
        <MatchupRow label="Neutral 1x" types={matchups.neutral1x} empty="None" />
        <MatchupRow label="1/2 resist" types={matchups.resistHalf} empty="None" />
        <MatchupRow label="1/4 resist" types={matchups.resistQuarter} empty="None" />
        <MatchupRow label="Immune 0x" types={matchups.immune0x} empty="None" />
        <MatchupRow label="STAB strong into" types={strong} empty="No super-effective STAB hits" />
      </div>
    </div>
  );
}

function MatchupRow({ label, types, empty }: { label: string; types: PokemonType[]; empty: string }) {
  return (
    <div className="rounded-xl bg-white p-2 shadow-sm">
      <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-[#6f7b8d]">{label}</div>
      <div className="flex flex-wrap gap-1">
        {types.length > 0 ? types.map((type) => <TypeBadge key={type} type={type} />) : <span className="text-[#6f7b8d]">{empty}</span>}
      </div>
    </div>
  );
}

function Graveyard({ run }: { run: NuzlockeRun }) {
  const deadPokemon = (run.team || []).filter((pokemon) => pokemon.status === 'Dead');

  return (
    <section className={panelClass}>
      <div className="mb-4 flex items-center gap-2 text-lg font-black"><Skull size={20} /> Graveyard</div>
      {deadPokemon.length === 0 ? <p className="text-sm font-bold text-[#506078]">No losses recorded. The notebook is mercifully quiet.</p> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {deadPokemon.map((pokemon) => (
          <article key={pokemon.id} className="rounded-2xl bg-white/75 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <MonsterToken species={pokemon.species} status="Dead" types={pokemon.types} />
              <div>
                <h3 className="text-lg font-black">{pokemon.nickname || pokemon.species}</h3>
                <div className="text-xs font-bold text-[#506078]">{pokemon.species} / Lv {pokemon.levelDied || pokemon.level}</div>
              </div>
            </div>
            <div className="mt-3 text-sm font-bold">Cause: {pokemon.causeOfDeath || 'Not recorded'}</div>
            <div className="mt-1 text-sm font-bold">Where: {pokemon.deathLocation || 'Not recorded'}</div>
            <p className="mt-2 text-sm leading-6">{pokemon.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelineLog({ run }: { run: NuzlockeRun }) {
  return (
    <section className={panelClass}>
      <div className="mb-4 text-lg font-black">Timeline</div>
      <div className="grid gap-2">
        {(run.timeline || []).map((event) => (
          <div key={event.id} className="rounded-xl bg-white/75 p-3 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">{event.type} / {event.createdAt}</div>
            <div className="mt-1 text-sm font-bold">{event.message}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
