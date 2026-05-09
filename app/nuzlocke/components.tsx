'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { type CSSProperties, FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Skull } from 'lucide-react';
import { getAttackMultiplier, getMultiplierLabel, getStabStrongAgainst } from '@/lib/nuzlocke/typeChart';
import { getMoveData, getPokemonLevelMoves, type PokemonMove } from '@/lib/nuzlocke/services/moveService';
import { applyDefensiveAbilityMultiplier, getPokemonAbilities, type PokemonAbility } from '@/lib/nuzlocke/services/abilityService';
import { readNuzlockeApiCache, writeNuzlockeApiCache } from '@/lib/nuzlocke/services/apiCache';
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
  NuzlockeBossPrep,
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
    bossPrep: Array.isArray(run.bossPrep)
      ? run.bossPrep.map((prep) => ({
          bossId: prep.bossId,
          leadPokemonId: prep.leadPokemonId || '',
          plannedTeamIds: Array.isArray(prep.plannedTeamIds) ? prep.plannedTeamIds : [],
          heldItems: prep.heldItems || {},
          plannedMoves: prep.plannedMoves || {},
          movePrepNotes: prep.movePrepNotes || '',
          battlePlanNotes: prep.battlePlanNotes || '',
          postFightNotes: prep.postFightNotes || '',
          completed: Boolean(prep.completed),
        }))
      : [],
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
  return <span className={`inline-flex items-center rounded-[4px] border border-black/10 px-1.5 py-0.5 text-[10px] font-black uppercase leading-none tracking-[0.03em] shadow-sm ${typeColors[type] ?? 'bg-white text-[#182a40]'}`}>{type}</span>;
}

function useAbilityData(species: string) {
  const [abilities, setAbilities] = useState<PokemonAbility[]>([]);

  useEffect(() => {
    let active = true;
    if (!species) {
      setAbilities([]);
      return;
    }

    getPokemonAbilities(species).then((results) => {
      if (active) setAbilities(results);
    });

    return () => {
      active = false;
    };
  }, [species]);

  return abilities;
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
      {up ? <span className="rounded-[4px] bg-[#e5f7df] px-2 py-1 text-[#267a38]">{up}</span> : null}
      {down ? <span className="rounded-[4px] bg-[#ffe2de] px-2 py-1 text-[#a43128]">{down}</span> : null}
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
    <div key={`${bossId}-${pokemon.species}-${pokemon.level}`} style={typeCardStyle(types)} className={`rounded-xl p-2 text-xs font-bold shadow-sm ${selected ? 'ring-2 ring-[var(--nuz-accent)]' : ''}`}>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-2 text-left transition hover:-translate-y-0.5"
      >
        <MonsterToken species={pokemon.species} types={types} compact />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="truncate text-sm font-black">{pokemon.species}</span>
          <span className="shrink-0 text-[11px] font-black">Lv {pokemon.level}</span>
          {types.map((type) => <TypeBadge key={type} type={type} />)}
          {details.length > 0 ? <span className="min-w-0 truncate text-[11px] text-[#506078]">{details.join(' / ')}</span> : null}
        </div>
      </button>
      {selected ? <BossPokemonDetails pokemon={pokemon} embedded /> : null}
    </div>
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
    Grookey: ['Grass'],
    Scorbunny: ['Fire'],
    Sobble: ['Water'],
    Wooloo: ['Normal'],
    Skwovet: ['Normal'],
    Nickit: ['Dark'],
    Yamper: ['Electric'],
    Chewtle: ['Water'],
    Gossifleur: ['Grass'],
    Eldegoss: ['Grass'],
    Arrokuda: ['Water'],
    Drednaw: ['Water', 'Rock'],
    Sizzlipede: ['Fire', 'Bug'],
    Centiskorch: ['Fire', 'Bug'],
    Roggenrola: ['Rock'],
    Woobat: ['Psychic', 'Flying'],
    Drilbur: ['Ground'],
    Milcery: ['Fairy'],
    Pumpkaboo: ['Ghost', 'Grass'],
    Stufful: ['Normal', 'Fighting'],
    Sinistea: ['Ghost'],
    Clobbopus: ['Fighting'],
    Darumaka: ['Ice'],
    Duraludon: ['Steel', 'Dragon'],
    Bunnelby: ['Normal'],
    Tyrogue: ['Fighting'],
    Budew: ['Grass', 'Poison'],
    Bounsweet: ['Grass'],
    Nuzleaf: ['Grass', 'Dark'],
    Duskull: ['Ghost'],
    Drifloon: ['Ghost', 'Flying'],
    Lotad: ['Water', 'Grass'],
    Wingull: ['Water', 'Flying'],
    Tympole: ['Water'],
    Krabby: ['Water'],
    Dreepy: ['Dragon', 'Ghost'],
    Vullaby: ['Dark', 'Flying'],
    Goldeen: ['Water'],
    Hitmontop: ['Fighting'],
    Pangoro: ['Fighting', 'Dark'],
    "Sirfetch'd": ['Fighting'],
    Yamask: ['Ground', 'Ghost'],
    Cursola: ['Ghost'],
    Mawile: ['Steel', 'Fairy'],
    Togekiss: ['Fairy', 'Flying'],
    Alcremie: ['Fairy'],
    Barbaracle: ['Rock', 'Water'],
    Shuckle: ['Bug', 'Rock'],
    Stonjourner: ['Rock'],
    Coalossal: ['Rock', 'Fire'],
    Darmanitan: ['Ice'],
    Scrafty: ['Dark', 'Fighting'],
    Malamar: ['Dark', 'Psychic'],
    Obstagoon: ['Dark', 'Normal'],
    Gigalith: ['Rock'],
    Flygon: ['Ground', 'Dragon'],
    Sandaconda: ['Ground'],
    Aegislash: ['Steel', 'Ghost'],
    Dragapult: ['Dragon', 'Ghost'],
    Seismitoad: ['Water', 'Ground'],
    'Mr. Rime': ['Ice', 'Psychic'],
    Solosis: ['Psychic'],
    Gothita: ['Psychic'],
    Hatenna: ['Psychic'],
    Scraggy: ['Dark', 'Fighting'],
    Morpeko: ['Electric', 'Dark'],
    Turtwig: ['Grass'],
    Chimchar: ['Fire'],
    Piplup: ['Water'],
    Starly: ['Normal', 'Flying'],
    Bidoof: ['Normal'],
    Cranidos: ['Rock'],
    Cherubi: ['Grass'],
    Roserade: ['Grass', 'Poison'],
    Spiritomb: ['Ghost', 'Dark'],
    Gastrodon: ['Water', 'Ground'],
    Milotic: ['Water'],
    Garchomp: ['Dragon', 'Ground'],
    Rowlet: ['Grass', 'Flying'],
    Cyndaquil: ['Fire'],
    Oshawott: ['Water'],
    Munchlax: ['Normal'],
    Kleavor: ['Bug', 'Rock'],
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
    'milo-swsh': ['Grass'],
    'nessa-swsh': ['Water'],
    'kabu-swsh': ['Fire'],
    'bea-sw': ['Fighting'],
    'allister-sh': ['Ghost'],
    'opal-swsh': ['Fairy'],
    'gordie-sw': ['Rock'],
    'melony-sh': ['Ice'],
    'piers-swsh': ['Dark'],
    'raihan-swsh': ['Dragon'],
    'hop-route-2-swsh': ['Normal'],
    'bede-galar-mine-swsh': ['Psychic'],
    'marnie-motostoke-swsh': ['Dark'],
    'champion-leon-swsh': ['Fire', 'Flying'],
    'roark-bdsp': ['Rock'],
    'gardenia-bdsp': ['Grass'],
    'cynthia-bdsp': ['Dragon', 'Ground'],
    'mai-la': ['Normal'],
    'kleavor-la': ['Bug', 'Rock'],
    'avalugg-la': ['Ice', 'Rock'],
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
      .then((response) => (response?.ok ? response.json() : null))
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

function pokemonApiSlug(species: string) {
  const mapped: Record<string, string> = {
    MrMime: 'mr-mime',
    'Mr. Rime': 'mr-rime',
    NidoranF: 'nidoran-f',
    NidoranM: 'nidoran-m',
    "Sirfetch'd": 'sirfetchd',
  };

  return (mapped[species] || species).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function usePokemonStats(species: string, fallback?: ReturnType<typeof pokemonBaseStats>) {
  const [stats, setStats] = useState(fallback);

  useEffect(() => {
    let active = true;
    setStats(pokemonBaseStats(species));
    if (!species) return;
    const slug = pokemonApiSlug(species);

    readNuzlockeApiCache<{ hp: number; atk: number; def: number; spa: number; spd: number; spe: number }>('pokemon', `stats_${slug}`)
      .then((cached) => {
        if (active && cached) setStats(cached);
        return cached;
      })
      .then((cached) => {
        if (cached) return null;
        return fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
      })
      .then((response) => (response?.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data?.stats) return;
        const mapped = (data.stats || []).reduce((acc: Record<string, number>, entry: { base_stat?: number; stat?: { name?: string } }) => {
          const key = entry.stat?.name;
          if (key === 'hp') acc.hp = Number(entry.base_stat) || 0;
          if (key === 'attack') acc.atk = Number(entry.base_stat) || 0;
          if (key === 'defense') acc.def = Number(entry.base_stat) || 0;
          if (key === 'special-attack') acc.spa = Number(entry.base_stat) || 0;
          if (key === 'special-defense') acc.spd = Number(entry.base_stat) || 0;
          if (key === 'speed') acc.spe = Number(entry.base_stat) || 0;
          return acc;
        }, {});
        if (mapped.hp) {
          const nextStats = mapped as { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
          setStats(nextStats);
          writeNuzlockeApiCache('pokemon', `stats_${slug}`, nextStats);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [species]);

  return stats;
}

function defaultMoveHints(pokemon: NuzlockeBossPokemon): NuzlockeMove[] {
  return pokemon.moves ?? [];
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
    Leon: 'leon',
    Milo: 'milo',
    Nessa: 'nessa',
    Kabu: 'kabu',
    Bea: 'bea',
    Allister: 'allister',
    Opal: 'opal',
    Gordie: 'gordie',
    Melony: 'melony',
    Piers: 'piers',
    Raihan: 'raihan',
    Hop: 'hop',
    Bede: 'bede',
    Marnie: 'marnie',
    Roark: 'roark',
    Gardenia: 'gardenia',
    Cynthia: 'cynthia-gen4',
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

function BossAvatar({ boss }: { boss: NuzlockeBoss }) {
  const firstPokemon = boss.pokemon?.[0];
  const isTitan = boss.category.includes('Titan');

  if (isTitan && firstPokemon) {
    const types = firstPokemon.types?.length ? firstPokemon.types : pokemonTypesForSpecies(firstPokemon.species);
    return (
      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
        <MonsterToken species={firstPokemon.species} types={types} large />
      </span>
    );
  }

  return <TrainerSprite name={boss.name} />;
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
  const [storageMode, setStorageMode] = useState<'loading' | 'database' | 'local'>('loading');
  const [storageMessage, setStorageMessage] = useState('Loading tracker storage...');
  const [localImportRuns, setLocalImportRuns] = useState<NuzlockeRun[]>([]);

  useEffect(() => {
    let active = true;

    try {
      const raw = window.localStorage.getItem(nuzlockeStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const storedRuns = normalizeRuns(parsed);
      setLocalImportRuns(storedRuns);
      setRuns(storedRuns);
      setActiveRunId(storedRuns[0]?.id ?? '');

      fetch('/api/nuzlocke/runs', { cache: 'no-store' })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Could not load database runs.'))))
        .then((payload) => {
          if (!active) return;
          const databaseRuns = normalizeRuns(payload?.runs || []);

          if (payload?.configured) {
            setStorageMode('database');
            setStorageMessage('Saving Nuzlocke runs to Supabase.');
            setRuns(databaseRuns);
            setActiveRunId(databaseRuns[0]?.id ?? '');
          } else {
            setStorageMode('local');
            setStorageMessage('Supabase is not configured for Nuzlocke yet. Using local fallback.');
          }
        })
        .catch((error) => {
          if (!active) return;
          setStorageMode('local');
          setStorageMessage(error instanceof Error ? `${error.message} Using local fallback.` : 'Using local fallback.');
        })
        .finally(() => {
          if (active) setLoaded(true);
        });
    } catch {
      setRuns([]);
      setActiveRunId('');
      setStorageMode('local');
      setStorageMessage('Could not read local runs. Using a fresh local tracker.');
      setLoaded(true);
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    if (storageMode === 'database') {
      const timeout = window.setTimeout(() => {
        fetch('/api/nuzlocke/runs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ runs }),
        }).catch(() => setStorageMessage('Could not save to Supabase. Your screen still has the latest run data.'));
      }, 650);

      return () => window.clearTimeout(timeout);
    }

    if (storageMode === 'local') {
      window.localStorage.setItem(nuzlockeStorageKey, JSON.stringify(runs));
    }
  }, [loaded, runs, storageMode]);

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

  const startNewRun = () => {
    setActiveRunId('');
    setSelectedGame('');
  };

  const deleteRun = (runId: string) => {
    const run = runs.find((item) => item.id === runId);
    if (!run) return;
    if (!window.confirm(`Delete ${run.runName}? This removes the local tracker data for this run.`)) return;

    setRuns((currentRuns) => {
      const nextRuns = currentRuns.filter((item) => item.id !== runId);
      setActiveRunId(nextRuns[0]?.id ?? '');
      return nextRuns;
    });
    setSelectedGame('');
  };

  const importLocalRuns = () => {
    if (localImportRuns.length === 0) return;
    fetch('/api/nuzlocke/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runs: localImportRuns }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Import failed.');
        const payload = await response.json();
        if (!payload?.verified) throw new Error('Import could not be verified.');
        window.localStorage.setItem(`${nuzlockeStorageKey}_imported`, 'true');
        setRuns(localImportRuns);
        setActiveRunId(localImportRuns[0]?.id ?? '');
        setStorageMode('database');
        setStorageMessage('Imported local Nuzlocke runs into the dedicated Supabase project. Local backup was not deleted.');
      })
      .catch((error) => setStorageMessage(error instanceof Error ? error.message : 'Import failed.'));
  };

  const currentGame = activeRun?.gameVersion ?? selectedGame;
  const runToolbar = (
    <>
      {runs.length > 0 ? (
        <select value={activeRunId} onChange={(event) => setActiveRunId(event.target.value)} className={fieldClass}>
          {runs.map((run) => (
            <option key={run.id} value={run.id}>{run.runName}</option>
          ))}
        </select>
      ) : null}
      {activeRun ? (
        <button onClick={() => deleteRun(activeRun.id)} className="rounded-lg bg-[#fff2f0] px-3 py-2 text-xs font-black text-[#9f2c24] shadow-sm hover:-translate-y-0.5">
          Delete Run
        </button>
      ) : null}
      <button onClick={startNewRun} className={smallButtonClass}>
        New Run
      </button>
    </>
  );

  return (
    <section className={`min-h-screen ${trackerTheme(currentGame)}`} style={{ ...trackerVars(currentGame), fontFamily: readableFont }}>
      <div className="mx-auto max-w-7xl p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/75 px-3 py-2 text-xs font-bold shadow-sm">
        <span>{storageMessage}</span>
        {storageMode === 'database' && localImportRuns.length > 0 ? (
          <button type="button" onClick={importLocalRuns} className={smallButtonClass}>
            Import Existing Local Runs
          </button>
        ) : null}
      </div>
      {!activeRun ? (
        <header className={`mb-4 flex flex-wrap items-center justify-between gap-3 ${panelClass}`}>
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">RepeatChannel Tool</div>
            <h1 className="text-2xl font-black sm:text-3xl">Pokemon Nuzlocke Tracker</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">{runToolbar}</div>
        </header>
      ) : null}

      {!activeRun && !selectedGame ? <GameVersionPicker onSelect={setSelectedGame} /> : null}
      {!activeRun && selectedGame ? <RunSetupForm gameVersion={selectedGame} onBack={() => setSelectedGame('')} onCreate={createRun} /> : null}
      {activeRun ? <NuzlockeDashboard run={activeRun} updateRun={updateRun} addTimeline={addTimeline} onNewRun={startNewRun} toolbar={runToolbar} /> : null}
      </div>
    </section>
  );
}

function GameVersionPicker({ onSelect }: { onSelect: (game: GameVersion) => void }) {
  return (
    <section className={panelClass}>
      <h2 className="text-3xl font-black">Choose Your Game</h2>
      <p className="mt-2 text-sm font-bold text-[#506078]">Gen 1, Gen 8, Scarlet, and Violet are wired in. The rest are parked here for later.</p>
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
      bossPrep: [],
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
  toolbar,
}: {
  run: NuzlockeRun;
  updateRun: (runId: string, updater: (run: NuzlockeRun) => NuzlockeRun) => void;
  addTimeline: (run: NuzlockeRun, type: string, message: string) => NuzlockeRun;
  onNewRun: () => void;
  toolbar?: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>('Overview');
  const [teamBarAction, setTeamBarAction] = useState<{ pokemonId: string; action: PokemonStatus } | null>(null);
  const tabs: Tab[] = ['Overview', 'Team / Box', 'Encounters', 'Badges / Bosses', 'Graveyard', 'Timeline'];

  useEffect(() => {
    if (!teamBarAction) return;
    updateRun(run.id, (current) => {
      const nextRun = {
        ...current,
        updatedAt: nowLabel(),
        team: (current.team || []).map((pokemon) =>
          pokemon.id === teamBarAction.pokemonId
            ? {
                ...pokemon,
                status: teamBarAction.action,
                ...(teamBarAction.action === 'Dead'
                  ? {
                      levelDied: pokemon.level,
                      causeOfDeath: pokemon.causeOfDeath || 'Team bar quick mark',
                      deathLocation: pokemon.deathLocation || pokemon.metLocation || 'Not recorded',
                    }
                  : {}),
              }
            : pokemon
        ),
      };
      const target = current.team.find((pokemon) => pokemon.id === teamBarAction.pokemonId);
      return teamBarAction.action === 'Dead' && target
        ? addTimeline(nextRun, 'Pokemon Died', `${target.nickname || target.species} was marked dead from the team bar.`)
        : nextRun;
    });
    setTeamBarAction(null);
  }, [teamBarAction, run.id, updateRun, addTimeline]);

  return (
    <div className="grid gap-3 pb-28">
      <section className="rounded-2xl border border-white/75 bg-white/88 p-3 shadow-[0_12px_30px_rgba(24,42,64,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">RepeatChannel Tool / {run.gameVersion} / {run.runType}</div>
            <h1 className="text-2xl font-black">Pokemon Nuzlocke Tracker</h1>
            <div className="mt-1 text-sm font-black text-[#506078]">{run.runName}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black shadow-sm transition ${
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
      <CurrentTeamBar run={run} onQuickStatus={(pokemonId, action) => setTeamBarAction({ pokemonId, action })} />
    </div>
  );
}

function CurrentTeamBar({
  run,
  onQuickStatus,
}: {
  run: NuzlockeRun;
  onQuickStatus: (pokemonId: string, status: PokemonStatus) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const party = (run.team || []).filter((pokemon) => pokemon.status === 'Party').slice(0, 6);
  const slots: (NuzlockePokemon | null)[] = [...party, ...Array.from({ length: Math.max(0, 6 - party.length) }, () => null)];
  const activeIndex = slots.findIndex((pokemon, index) => (pokemon?.id ?? `empty-${index}`) === activeSlot);
  const activePokemon = activeIndex >= 0 ? slots[activeIndex] : null;

  const updatePokemonStatus = (pokemon: NuzlockePokemon, status: PokemonStatus) => {
    onQuickStatus(pokemon.id, status);
    setActiveSlot(null);
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/85 px-3 py-2 shadow-[0_-14px_35px_rgba(24,42,64,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
          <div className="shrink-0 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Current Team</div>
          {slots.map((pokemon, index) => {
            const slotId = pokemon?.id ?? `empty-${index}`;
            const isActive = activeSlot === slotId;

            return (
              <button
                key={slotId}
                type="button"
                onClick={() => setActiveSlot(isActive ? null : slotId)}
                className={`flex min-w-[150px] shrink-0 items-center gap-2 rounded-xl p-2 text-left shadow-sm transition ${
                  isActive ? 'ring-2 ring-[var(--nuz-accent)]' : ''
                } ${pokemon ? 'bg-white' : 'border border-dashed border-[#c8d2df] bg-white/55 text-[#8a97aa]'}`}
              >
                {pokemon ? <MonsterToken species={pokemon.species} status={pokemon.status} types={pokemon.types} compact /> : <div className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-[#9baec8] bg-white text-sm font-black">+</div>}
                <div className="min-w-0">
                  <div className="truncate text-xs font-black">{pokemon ? pokemon.nickname || pokemon.species : `Slot ${index + 1}`}</div>
                  <div className="text-[11px] font-bold text-[#506078]">{pokemon ? `Lv ${pokemon.level} / ${pokemon.species}` : 'Empty party spot'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {activeSlot ? (
        <TeamBarPopup
          pokemon={activePokemon}
          slotNumber={activeIndex + 1}
          run={run}
          onClose={() => setActiveSlot(null)}
          onQuickStatus={updatePokemonStatus}
        />
      ) : null}
    </>
  );
}

function TeamBarPopup({
  pokemon,
  slotNumber,
  run,
  onClose,
  onQuickStatus,
}: {
  pokemon: NuzlockePokemon | null;
  slotNumber: number;
  run: NuzlockeRun;
  onClose: () => void;
  onQuickStatus: (pokemon: NuzlockePokemon, status: PokemonStatus) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-xl rounded-2xl bg-white/95 p-3 shadow-[0_22px_70px_rgba(24,42,64,0.28)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">Team Slot {Math.max(1, slotNumber)}</div>
        <button type="button" onClick={onClose} className={smallButtonClass}>Close</button>
      </div>
      {pokemon ? (
        <TeamPokemonScout
          pokemon={pokemon}
          compact
          showNatureAbility={!isGenOneGame(run.gameVersion)}
          actions={
            <>
              <button type="button" onClick={() => onQuickStatus(pokemon, 'Boxed')} className={smallButtonClass}>Box</button>
              <button type="button" onClick={() => onQuickStatus(pokemon, 'Released')} className={smallButtonClass}>Release</button>
              <button type="button" onClick={() => onQuickStatus(pokemon, 'Dead')} className="rounded-lg bg-[#fff2f0] px-3 py-2 text-xs font-black text-[#9f2c24] shadow-sm">Dead</button>
            </>
          }
        />
      ) : (
        <div className="rounded-xl bg-white p-3 text-sm font-bold leading-6 text-[#506078] shadow-sm">
          Empty party spot. Add a caught Pokemon from Team / Box and it will appear here.
        </div>
      )}
    </div>,
    document.body
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
            <article key={pokemon.id} className="rounded-2xl border border-white/75 bg-white/90 p-3 shadow-[0_12px_32px_rgba(24,42,64,0.08)] backdrop-blur">
              <TeamPokemonScout pokemon={pokemon} showDetails showHeldDetail={false} showNatureAbility={hasNatures || hasAbilities} />
              <label className="mt-2 grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
                Held item
                <span className="flex items-center gap-2">
                  <ItemSprite item={pokemon.heldItem || 'None'} />
                  <select value={pokemon.heldItem || 'None'} onChange={(event) => updatePokemon(pokemon.id, { heldItem: event.target.value })} className={`${fieldClass} min-w-0 flex-1 text-xs normal-case tracking-normal text-[#182a40]`}>
                    {heldItemOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </span>
              </label>
              <p className="mt-2 text-xs font-bold leading-5 text-[#506078]">{pokemon.notes}</p>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {(['Party', 'Boxed', 'Released'] as PokemonStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(pokemon.id, status)}
                    className={`rounded-lg px-2 py-2 text-[11px] font-black shadow-sm ${
                      pokemon.status === status ? 'bg-[var(--nuz-accent)] text-white' : 'bg-white text-[#182a40]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                {pokemon.status !== 'Dead' ? (
                  <button onClick={() => markDead(pokemon)} className="flex items-center justify-center gap-1 rounded-lg bg-[#fff2f0] px-2 py-2 text-[11px] font-black text-[#9f2c24] shadow-sm">
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
  const caughtSpecies = new Set((run.encounters || []).filter((encounter) => encounter.status === 'Caught').map((encounter) => encounter.pokemon.toLowerCase()));
  const dupesClauseEnabled = Boolean(run.rules?.dupesClause);
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
  const [manualEntry, setManualEntry] = useState(false);
  const [manualAbilityOptions, setManualAbilityOptions] = useState<string[]>([]);
  const fetchedAbilityData = useAbilityData(form.pokemon);

  const monotype = run.runType === 'Monotype' ? run.rules?.monotype : undefined;
  const encounterOptions = (encounterOptionsByLocation[form.location] ?? []).filter((option) => speciesMatchesMonotype(option.species, monotype));
  const canShowEncounterOption = (option: { surfMethod?: boolean; fishingMethod?: boolean }) =>
    (!option.surfMethod || showSurfEncounters) && (!option.fishingMethod || showFishingEncounters);
  const visibleEncounterOptions = encounterOptions.filter(canShowEncounterOption);
  const selectedAbilityOptions =
    fetchedAbilityData.length > 0
      ? fetchedAbilityData.map((ability) => `${ability.name}${ability.isHidden ? ' (Hidden)' : ''}`)
      : manualEntry && manualAbilityOptions.length > 0
        ? manualAbilityOptions
        : getAbilityOptions(form.pokemon);
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
    setManualEntry(false);
    setManualAbilityOptions([]);
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
    setManualEntry(false);
    setManualAbilityOptions([]);
  };

  const typeManualPokemon = (species: string) => {
    const guessedTypes = pokemonTypesForSpecies(species);
    setForm((current) => ({
      ...current,
      pokemon: species,
      types: guessedTypes.length > 0 ? guessedTypes : current.types,
      ability: getAbilityOptions(species)[0],
    }));
    setManualEntry(Boolean(species.trim()));
  };

  const randomizeAreaEncounter = () => {
    if (visibleEncounterOptions.length === 0) return;
    // Randomness only runs from the button click, not during render.
    // eslint-disable-next-line react-hooks/purity
    const randomOption = visibleEncounterOptions[Math.floor(Math.random() * visibleEncounterOptions.length)];
    if (randomOption) choosePokemon(randomOption.species);
  };

  useEffect(() => {
    if (manualEntry) return;
    const currentStillVisible = visibleEncounterOptions.some((option) => option.species === form.pokemon);
    if (currentStillVisible) return;
    const firstOption = visibleEncounterOptions[0];
    setForm((current) => ({
      ...current,
      pokemon: firstOption?.species ?? '',
      types: firstOption?.types ?? (['Normal'] as PokemonType[]),
      ability: getAbilityOptions(firstOption?.species ?? '')[0],
    }));
  }, [form.pokemon, manualEntry, visibleEncounterOptions]);

  useEffect(() => {
    if (!manualEntry || !form.pokemon.trim()) return;

    let active = true;
    fetch(`https://pokeapi.co/api/v2/pokemon/${normalizePokemonApiName(form.pokemon)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data?.types) return;
        const fetchedTypes = data.types
          .map((entry: { type?: { name?: string } }) => {
            const name = entry.type?.name;
            return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
          })
          .filter((name: string): name is PokemonType => pokemonTypes.includes(name as PokemonType));
        if (fetchedTypes.length > 0) setForm((current) => ({ ...current, types: fetchedTypes }));
        const fetchedAbilities = (data.abilities || [])
          .map((entry: { ability?: { name?: string } }) => entry.ability?.name)
          .filter(Boolean)
          .map((name: string) => name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '));
        if (fetchedAbilities.length > 0) {
          setManualAbilityOptions([...fetchedAbilities, 'Not Sure']);
          setForm((current) => current.ability && current.ability !== 'Primary Ability' ? current : { ...current, ability: fetchedAbilities[0] });
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [manualEntry, form.pokemon]);

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
    setManualEntry(false);
    setManualAbilityOptions([]);
  };

  return (
    <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className={panelClass}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Route Board</div>
            <h3 className="text-base font-black">Pick an encounter area</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-black">
            <span className="self-center text-[#506078]">Click a route to reveal Pokemon.</span>
            <label className="flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1.5 shadow-sm">
              <input
                type="checkbox"
                checked={showSurfEncounters}
                onChange={(event) => setShowSurfEncounters(event.target.checked)}
              />
              Surf
            </label>
            <label className="flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1.5 shadow-sm">
              <input
                type="checkbox"
                checked={showFishingEncounters}
                onChange={(event) => setShowFishingEncounters(event.target.checked)}
              />
              Fishing
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
                className={`rounded-xl p-2 text-left shadow-sm transition hover:-translate-y-0.5 ${
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
                  <div className="mt-2 grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {options.length > 0 ? options.map((option) => {
                      const isDupe = dupesClauseEnabled && caughtSpecies.has(option.species.toLowerCase());
                      return (
                        <button
                          key={option.species}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            choosePokemon(option.species);
                          }}
                          style={typeCardStyle(option.types)}
                          className={`relative flex items-center gap-2 rounded-xl bg-white p-2 text-left text-xs font-black shadow-sm transition hover:-translate-y-0.5 ${isDupe ? 'grayscale opacity-55' : ''}`}
                        >
                          <MonsterToken species={option.species} types={option.types} compact />
                          <span>
                            <span className="block">{option.species}</span>
                            <span className="mt-1 flex flex-wrap gap-1">{option.types.map((type) => <TypeBadge key={type} type={type} />)}</span>
                          </span>
                          {isDupe ? <span className="absolute right-2 top-2 rounded-[4px] bg-[#182a40] px-1.5 py-1 text-[9px] uppercase tracking-[0.1em] text-white">Dupe</span> : null}
                        </button>
                      );
                    }) : (
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
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--nuz-accent)]">Add Encounter</div>
            <h3 className="text-base font-black leading-tight">{form.location}</h3>
          </div>
          <div className="flex flex-wrap gap-1">{(form.types || []).map((type) => <TypeBadge key={type} type={type} />)}</div>
        </div>
        <div className="grid gap-2">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto]">
            <SpriteSelect
              value={form.pokemon}
              onChange={choosePokemon}
              options={visibleEncounterOptions.length > 0 ? visibleEncounterOptions : [{ species: 'Not listed', types: ['Normal'] as PokemonType[] }]}
            />
            <button
              type="button"
              onClick={randomizeAreaEncounter}
              disabled={visibleEncounterOptions.length === 0}
              className="rounded-lg bg-[var(--nuz-accent-soft)] px-3 py-2 text-xs font-black shadow-sm transition hover:-translate-y-0.5 disabled:opacity-45"
              title="Randomize from this area only"
            >
              Random
            </button>
          </div>
          <div className="grid gap-2">
            <input
              value={form.pokemon}
              onChange={(event) => typeManualPokemon(event.target.value)}
              placeholder="Randomizer/manual Pokemon"
              className={`${fieldClass} text-sm`}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_88px]">
            <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="Nickname" className={fieldClass} />
            <input value={form.levelMet} onChange={(event) => setForm({ ...form, levelMet: event.target.value })} type="number" min="1" placeholder="Lv" className={fieldClass} />
          </div>
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
          {hasNatures ? (
            <div className="grid gap-1">
              <select value={form.nature} onChange={(event) => setForm({ ...form, nature: event.target.value })} className={fieldClass}>
                {natureOptions.map((nature) => <option key={nature}>{nature}</option>)}
              </select>
              <NatureEffect nature={form.nature} />
            </div>
          ) : null}
          {hasAbilities ? (
            <div className="grid gap-1">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Ability</div>
              <ChoiceButtons options={selectedAbilityOptions} value={form.ability} onChange={(ability) => setForm({ ...form, ability })} />
              {fetchedAbilityData.length > 0 ? (
                <div className="grid gap-1">
                  {fetchedAbilityData.map((ability) => (
                    <div key={`${ability.name}-${ability.slot}`} className="rounded-lg bg-white/80 px-2 py-1 text-[11px] font-bold text-[#506078] shadow-sm">
                      <span className="font-black text-[#182a40]">{ability.name}</span>
                      {ability.isHidden ? <span className="ml-1 text-[var(--nuz-accent)]">Hidden</span> : null}
                      {ability.shortEffect ? <span className="block">{ability.shortEffect}</span> : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {locationAlreadyCaught && form.status === 'Caught' ? (
            <div className="rounded-xl bg-[#fff2f0] p-3 text-xs font-black text-[#9f2c24]">
              This area already has a caught encounter. Change the result or choose another area.
            </div>
          ) : null}
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className={`${fieldClass} min-h-12`} />
          <button disabled={form.status === 'Caught' && locationAlreadyCaught} className="rounded-xl bg-[var(--nuz-accent-soft)] px-4 py-2.5 text-sm font-black shadow-[0_8px_20px_rgba(24,42,64,0.14)] disabled:opacity-45">Add Encounter</button>
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
  const [prepBossId, setPrepBossId] = useState('');

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

  const updateBossPrep = (bossId: string, changes: Partial<NuzlockeBossPrep>) => {
    updateRun(run.id, (current) => {
      const currentPrep = current.bossPrep || [];
      const existing = currentPrep.find((prep) => prep.bossId === bossId);
      const nextPrep: NuzlockeBossPrep = {
        bossId,
        leadPokemonId: '',
        plannedTeamIds: [],
        heldItems: {},
        plannedMoves: {},
        movePrepNotes: '',
        battlePlanNotes: '',
        postFightNotes: '',
        completed: false,
        ...(existing || {}),
        ...changes,
      };

      return {
        ...current,
        updatedAt: nowLabel(),
        bossPrep: existing
          ? currentPrep.map((prep) => (prep.bossId === bossId ? nextPrep : prep))
          : [...currentPrep, nextPrep],
      };
    });
  };

  return (
    <section className="grid gap-3">
      {sortedBosses.map((boss) => (
        <article key={boss.id} style={typeCardStyle(bossTypes(boss))} className={`rounded-2xl border border-white/75 p-3 shadow-[0_14px_34px_rgba(24,42,64,0.09)] backdrop-blur ${boss.completed ? 'opacity-70' : ''}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleExpandedBoss(boss.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') toggleExpandedBoss(boss.id);
            }}
            className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-xl p-1 transition hover:bg-white/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <BossAvatar boss={boss} />
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">{boss.category}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-black">{boss.name}</h3>
                  {bossTypes(boss).map((type) => <TypeBadge key={type} type={type} />)}
                  {boss.threatMetadata?.overallDifficulty ? <DangerBadge label={boss.threatMetadata.overallDifficulty} /> : null}
                </div>
                <div className="mt-1 text-xs font-bold text-[#506078]">
                  Cap {boss.levelCap} / Deaths {boss.deaths}{boss.notes ? ` / ${boss.notes}` : ''}
                </div>
                {boss.completed ? <div className="mt-1 text-xs font-black text-[#2f7d4f]">Completed / {boss.deaths} deaths</div> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setExpandedBossId(boss.id);
                  setPrepBossId((current) => current === boss.id ? '' : boss.id);
                }}
                className="rounded-lg bg-[var(--nuz-accent-soft)] px-3 py-2 text-xs font-black shadow-sm"
              >
                Prep Fight
              </button>
              <label className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs font-black shadow-sm" onClick={(event) => event.stopPropagation()}>
                <input type="checkbox" checked={boss.completed} onChange={() => toggleBoss(boss)} />
                Done
              </label>
            </div>
          </div>

          {expandedBossId === boss.id ? (
            <>
              <div className="mt-2 grid gap-2 sm:grid-cols-[92px_92px_1fr]">
                <label className="grid gap-1 text-xs font-black">
                  Level cap
                  <input value={boss.levelCap} onChange={(event) => updateBoss(boss.id, { levelCap: safeNumber(event.target.value) })} type="number" className={fieldClass} />
                </label>
                <label className="grid gap-1 text-xs font-black">
                  Deaths
                  <input value={boss.deaths} onChange={(event) => updateBoss(boss.id, { deaths: Math.max(0, Number(event.target.value) || 0) })} type="number" min="0" className={fieldClass} />
                </label>
                <label className="grid gap-1 text-xs font-black">
                  Notes
                  <input value={boss.notes} onChange={(event) => updateBoss(boss.id, { notes: event.target.value })} placeholder="Notes" className={`${fieldClass} text-sm`} />
                </label>
              </div>
              <div className="mt-2">
                {boss.threatMetadata ? <ThreatCallouts metadata={boss.threatMetadata} /> : null}
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
            </>
          ) : null}
          {prepBossId === boss.id ? (
            <BossPrepModal
              onClose={() => setPrepBossId('')}
              boss={boss}
              run={run}
              prep={(run.bossPrep || []).find((prep) => prep.bossId === boss.id)}
              updatePrep={(changes) => updateBossPrep(boss.id, changes)}
              updateBoss={updateBoss}
            />
          ) : null}
        </article>
      ))}
    </section>
  );
}

function PrepTypeCoverageBadge({ type, targetTypes }: { type: PokemonType; targetTypes: PokemonType[] }) {
  const multiplier = getAttackMultiplier(type, targetTypes);
  const tone =
    multiplier >= 2
      ? 'bg-[#e5f7df] text-[#267a38]'
      : multiplier === 0
        ? 'bg-[#f0f2f7] text-[#506078]'
        : multiplier < 1
          ? 'bg-[#ffe2de] text-[#a43128]'
          : 'bg-white text-[#182a40]';

  return (
    <span className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-[10px] font-black shadow-sm ${tone}`}>
      <TypeBadge type={type} />
      <span>{getMultiplierLabel(multiplier)}</span>
    </span>
  );
}

function DangerBadge({ label }: { label: string }) {
  const tone = label === 'Run Killer' || label === 'Very High'
    ? 'bg-[#fff2f0] text-[#9f2c24]'
    : label === 'High'
      ? 'bg-[#fff4d8] text-[#9a6500]'
      : 'bg-[#e9f7ef] text-[#267a38]';

  return <span className={`rounded-[4px] px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] shadow-sm ${tone}`}>{label}</span>;
}

function ThreatCallouts({ metadata }: { metadata: NonNullable<NuzlockeBoss['threatMetadata']> }) {
  const callouts = [
    ...(metadata.setupSweepers || []).map((text) => `Setup Sweeper: ${text}`),
    ...(metadata.priorityThreats || []).map((text) => `Priority Threat: ${text}`),
    ...(metadata.weatherThreats || []).map((text) => `Weather Core: ${text}`),
    ...(metadata.abilityThreats || []).map((text) => `Ability Threat: ${text}`),
    ...(metadata.dangerousMatchups || []).map((text) => `Matchup Warning: ${text}`),
  ];

  return (
    <div className="mb-2 grid gap-2 rounded-xl bg-white/55 p-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {metadata.overallDifficulty ? <DangerBadge label={metadata.overallDifficulty} /> : null}
        {(metadata.recommendedCoverage || []).map((coverage) => <span key={coverage} className="rounded-[4px] bg-white px-2 py-1 text-[10px] font-black shadow-sm">{coverage}</span>)}
      </div>
      {metadata.notableThreats?.length ? (
        <div className="flex flex-wrap gap-1">
          {metadata.notableThreats.map((threat) => (
            <span key={`${threat.species}-${threat.threatLevel}`} className="rounded-[4px] bg-[#fff2f0] px-2 py-1 text-[10px] font-black text-[#9f2c24] shadow-sm">
              {threat.species}: {threat.threatLevel}
            </span>
          ))}
        </div>
      ) : null}
      {callouts.length > 0 ? (
        <div className="grid gap-1 text-xs font-bold text-[#506078]">
          {callouts.slice(0, 4).map((callout) => <div key={callout}>{callout}</div>)}
        </div>
      ) : null}
    </div>
  );
}

function bossAttackTypes(boss: NuzlockeBoss) {
  const types = new Set<PokemonType>();
  (boss.pokemon || []).forEach((pokemon) => {
    (pokemon.moves || []).forEach((move) => types.add(move.type));
    const memberTypes = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
    memberTypes.forEach((type) => types.add(type));
    if (pokemon.teraType) types.add(pokemon.teraType);
  });
  return Array.from(types);
}

function bossDefensiveTypes(boss: NuzlockeBoss) {
  const types = new Set<PokemonType>();
  (boss.pokemon || []).forEach((pokemon) => {
    const memberTypes = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
    memberTypes.forEach((type) => types.add(type));
    if (pokemon.teraType) types.add(pokemon.teraType);
  });
  return Array.from(types);
}

function getAbilityAwareDefensiveMatchups(types: PokemonType[], ability?: string) {
  return pokemonTypes.reduce(
    (matchups, attackType) => {
      const multiplier = applyDefensiveAbilityMultiplier(ability, attackType, types || []);

      if (multiplier >= 4) matchups.weak4x.push(attackType);
      else if (multiplier === 2) matchups.weak2x.push(attackType);
      else if (multiplier === 1) matchups.neutral1x.push(attackType);
      else if (multiplier === 0.5) matchups.resistHalf.push(attackType);
      else if (multiplier > 0 && multiplier < 0.5) matchups.resistQuarter.push(attackType);
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

function teamCoverageTypes(team: NuzlockePokemon[]) {
  const types = new Set<PokemonType>();
  (team || []).forEach((pokemon) => {
    const memberTypes = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
    memberTypes.forEach((type) => types.add(type));
  });
  return Array.from(types);
}

function leadRiskScore(pokemon: NuzlockePokemon, boss: NuzlockeBoss) {
  const types = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
  const attacks = bossAttackTypes(boss);
  const danger = attacks.reduce((score, attackType) => {
    const multiplier = applyDefensiveAbilityMultiplier(pokemon.ability, attackType, types);
    return score + (multiplier >= 4 ? 4 : multiplier >= 2 ? 2 : multiplier === 0 ? -1 : multiplier < 1 ? -0.5 : 0);
  }, 0);
  const coverage = bossDefensiveTypes(boss).reduce((score, targetType) => {
    const best = types.reduce((bestMultiplier, ownType) => Math.max(bestMultiplier, getAttackMultiplier(ownType, [targetType])), 1);
    return score + (best >= 2 ? 1 : 0);
  }, 0);
  return danger - coverage;
}

function leadScore(pokemon: NuzlockePokemon, boss: NuzlockeBoss) {
  return -leadRiskScore(pokemon, boss);
}

function leadScoreReasons(pokemon: NuzlockePokemon, boss: NuzlockeBoss) {
  const types = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
  const attacks = bossAttackTypes(boss);
  const dangerous = attacks.filter((attackType) => applyDefensiveAbilityMultiplier(pokemon.ability, attackType, types) >= 2);
  const safeInto = attacks.filter((attackType) => applyDefensiveAbilityMultiplier(pokemon.ability, attackType, types) < 1);
  const coverage = bossDefensiveTypes(boss).filter((targetType) => types.some((ownType) => getAttackMultiplier(ownType, [targetType]) >= 2));
  const reasons = [];

  if (coverage.length > 0) reasons.push(`hits ${Array.from(new Set(coverage)).join('/')}`);
  if (safeInto.length > 0) reasons.push(`handles ${Array.from(new Set(safeInto)).join('/')}`);
  if (dangerous.length > 0) reasons.push(`watch ${Array.from(new Set(dangerous)).join('/')}`);

  return reasons.join(' - ') || 'mostly neutral';
}

function pokemonDisplayTypes(pokemon: Pick<NuzlockePokemon, 'species' | 'types'> | Pick<NuzlockeBossPokemon, 'species' | 'types'>) {
  return pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
}

function BossPrepPanel({
  boss,
  run,
  prep,
  updatePrep,
  updateBoss,
}: {
  boss: NuzlockeBoss;
  run: NuzlockeRun;
  prep?: NuzlockeBossPrep;
  updatePrep: (changes: Partial<NuzlockeBossPrep>) => void;
  updateBoss: (bossId: string, changes: Partial<NuzlockeBoss>) => void;
}) {
  const team = (run.team || []).filter((pokemon) => pokemon.status === 'Party');
  const plannedIds = prep?.plannedTeamIds || team.map((pokemon) => pokemon.id);
  const plannedTeam = team.filter((pokemon) => plannedIds.includes(pokemon.id));
  const bossTeam = boss.pokemon || [];
  const bossMaxLevel = Math.max(boss.levelCap || 1, ...bossTeam.map((pokemon) => pokemon.level || 1));
  const overleveled = team.filter((pokemon) => Number(pokemon.level) > Number(boss.levelCap || bossMaxLevel));
  const underleveled = team.filter((pokemon) => Number(pokemon.level) < Math.max(1, Number(boss.levelCap || bossMaxLevel) - 4));
  const defensiveTypes = bossDefensiveTypes(boss);
  const coverage = teamCoverageTypes(plannedTeam.length ? plannedTeam : team);
  const missingCoverage = defensiveTypes.filter((targetType) => !coverage.some((ownType) => getAttackMultiplier(ownType, [targetType]) >= 2));
  const sortedLeads = [...team].sort((a, b) => leadScore(b, boss) - leadScore(a, boss));
  const safeLeads = sortedLeads.slice(0, 3);
  const riskyLeads = sortedLeads.filter((pokemon) => leadScore(pokemon, boss) <= -2).slice(0, 3);
  const [selectedTeamId, setSelectedTeamId] = useState(prep?.leadPokemonId || team[0]?.id || '');
  const [selectedBossIndex, setSelectedBossIndex] = useState(0);
  const selectedTeamPokemon = team.find((pokemon) => pokemon.id === selectedTeamId) ?? team[0];
  const selectedBossPokemon = bossTeam[selectedBossIndex] ?? bossTeam[0];

  const togglePlanned = (pokemonId: string) => {
    const nextIds = plannedIds.includes(pokemonId)
      ? plannedIds.filter((id) => id !== pokemonId)
      : [...plannedIds, pokemonId];
    updatePrep({ plannedTeamIds: nextIds });
  };

  const updatePlannedMove = (pokemonId: string, moveIndex: number, moveName: string) => {
    const currentMoves = prep?.plannedMoves?.[pokemonId] || ['', '', '', ''];
    const nextMoves = [...currentMoves];
    nextMoves[moveIndex] = moveName;
    updatePrep({ plannedMoves: { ...(prep?.plannedMoves || {}), [pokemonId]: nextMoves } });
  };

  return (
    <section className="rounded-2xl bg-white/82 p-3 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">Boss Prep Mode</div>
          <div className="text-sm font-black">{boss.name} / Cap {boss.levelCap}</div>
        </div>
        <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black shadow-sm">
          <input type="checkbox" checked={Boolean(prep?.completed)} onChange={(event) => updatePrep({ completed: event.target.checked })} />
          Mark fight complete
        </label>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <div className="grid gap-2">
          {boss.threatMetadata ? (
            <PrepSection title="Threat Notes">
              <ThreatCallouts metadata={boss.threatMetadata} />
            </PrepSection>
          ) : null}
          <PrepSection title="Boss Team">
            {bossTeam.length > 0 ? bossTeam.map((pokemon, index) => {
              const types = pokemonDisplayTypes(pokemon);
              return (
                <button
                  type="button"
                  key={`${pokemon.species}-${pokemon.level}`}
                  onClick={() => setSelectedBossIndex(index)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1 text-left shadow-sm ${selectedBossIndex === index ? 'bg-[var(--nuz-accent-soft)] ring-2 ring-[var(--nuz-accent)]' : 'bg-white'}`}
                >
                  <MonsterToken species={pokemon.species} types={types} compact />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black">{pokemon.species} / Lv {pokemon.level}</div>
                    <div className="mt-1 flex flex-wrap gap-1">{types.map((type) => <TypeBadge key={type} type={type} />)}</div>
                  </div>
                </button>
              );
            }) : <EmptyPrepText text="No boss team data listed yet." />}
          </PrepSection>

          <PrepSection title="Level Cap Check">
            {team.length === 0 ? <EmptyPrepText text="No current team yet." /> : null}
            {team.map((pokemon) => {
              const delta = Number(pokemon.level) - Number(boss.levelCap || bossMaxLevel);
              const tone = delta > 0 ? 'text-[#9f2c24]' : delta < -4 ? 'text-[#a06a00]' : 'text-[#267a38]';
              return (
                <div key={pokemon.id} className="flex items-center justify-between rounded-lg bg-white px-2 py-1 text-xs font-black shadow-sm">
                  <span>{pokemon.nickname || pokemon.species} / Lv {pokemon.level}</span>
                  <span className={tone}>{delta > 0 ? `Over +${delta}` : delta < -4 ? 'Under' : 'Ready'}</span>
                </div>
              );
            })}
            {overleveled.length > 0 ? <WarningText text={`Overleveled: ${overleveled.map((pokemon) => pokemon.nickname || pokemon.species).join(', ')}`} /> : null}
            {underleveled.length > 0 ? <WarningText text={`Underleveled: ${underleveled.map((pokemon) => pokemon.nickname || pokemon.species).join(', ')}`} /> : null}
          </PrepSection>
        </div>

        <div className="grid gap-2">
          <PrepSection title="My Planned Team">
            {team.length === 0 ? <EmptyPrepText text="Add party members first." /> : null}
            <div className="grid gap-1 sm:grid-cols-2">
              {team.map((pokemon) => (
                <button
                  type="button"
                  key={pokemon.id}
                  onClick={() => {
                    togglePlanned(pokemon.id);
                    setSelectedTeamId(pokemon.id);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs font-black shadow-sm ${plannedIds.includes(pokemon.id) ? 'bg-[var(--nuz-accent-soft)]' : 'bg-white/65 text-[#6f7b8d]'}`}
                >
                  <MonsterToken species={pokemon.species} types={pokemonDisplayTypes(pokemon)} compact />
                  <span>{pokemon.nickname || pokemon.species} / Lv {pokemon.level}</span>
                </button>
              ))}
            </div>
          </PrepSection>

          <PrepSection title="Suggested Leads">
            {safeLeads.length > 0 ? safeLeads.map((pokemon) => (
              <button
                type="button"
                key={pokemon.id}
                onClick={() => {
                  setSelectedTeamId(pokemon.id);
                  updatePrep({ leadPokemonId: pokemon.id });
                }}
                className={`rounded-lg px-2 py-1 text-left text-xs font-black shadow-sm ${prep?.leadPokemonId === pokemon.id ? 'bg-[var(--nuz-accent-soft)]' : 'bg-white'}`}
              >
                <span className="block">{pokemon.nickname || pokemon.species} / score {leadScore(pokemon, boss).toFixed(1)}</span>
                <span className="block text-[10px] font-bold text-[#506078]">{leadScoreReasons(pokemon, boss)}</span>
              </button>
            )) : <EmptyPrepText text="No team members to suggest yet." />}
            <div className="rounded-lg bg-white/75 px-2 py-1 text-[11px] font-bold leading-5 text-[#506078] shadow-sm">
              Higher is better. The score rewards useful typing into the boss and penalizes leads that take super-effective pressure. It is matchup advice, not exact damage math.
            </div>
            {riskyLeads.length > 0 ? <WarningText text={`Risky leads: ${riskyLeads.map((pokemon) => pokemon.nickname || pokemon.species).join(', ')}`} /> : null}
          </PrepSection>

          <PrepSection title="Coverage Summary">
            <div className="flex flex-wrap gap-1">
              {defensiveTypes.length > 0 ? defensiveTypes.map((type) => <PrepTypeCoverageBadge key={type} type={type} targetTypes={[type]} />) : <EmptyPrepText text="No boss typing listed." />}
            </div>
            {missingCoverage.length > 0 ? (
              <WarningText text={`Missing super-effective coverage into: ${missingCoverage.join(', ')}`} />
            ) : (
              <div className="text-xs font-black text-[#267a38]">Coverage looks reasonable from current team typing.</div>
            )}
          </PrepSection>
        </div>
      </div>

      <PrepSection title="Held Items">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(plannedTeam.length ? plannedTeam : team).map((pokemon) => (
            <label key={pokemon.id} className="grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
              {pokemon.nickname || pokemon.species}
              <select
                value={prep?.heldItems?.[pokemon.id] ?? pokemon.heldItem ?? 'None'}
                onChange={(event) => updatePrep({ heldItems: { ...(prep?.heldItems || {}), [pokemon.id]: event.target.value } })}
                className={`${fieldClass} text-xs normal-case tracking-normal text-[#182a40]`}
              >
                {heldItemOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          ))}
        </div>
      </PrepSection>

      <PrepSection title="My Team Moves">
        <div className="grid gap-2 lg:grid-cols-2">
          {(plannedTeam.length ? plannedTeam : team).map((pokemon) => (
            <PrepPokemonMoveInputs
              key={pokemon.id}
              pokemon={pokemon}
              moves={prep?.plannedMoves?.[pokemon.id] || []}
              onChange={(moveIndex, moveName) => updatePlannedMove(pokemon.id, moveIndex, moveName)}
            />
          ))}
        </div>
      </PrepSection>

      <PrepComparePanel
        bossPokemon={selectedBossPokemon}
        teamPokemon={selectedTeamPokemon}
        plannedMoves={selectedTeamPokemon ? prep?.plannedMoves?.[selectedTeamPokemon.id] || [] : []}
        gameVersion={run.gameVersion}
      />

      <div className="mt-2 grid gap-2 lg:grid-cols-3">
        <PrepNote label="Move Prep Checklist" value={prep?.movePrepNotes || ''} onChange={(value) => updatePrep({ movePrepNotes: value })} />
        <PrepNote label="Battle Plan Notes" value={prep?.battlePlanNotes || ''} onChange={(value) => updatePrep({ battlePlanNotes: value })} />
        <PrepNote label="Post-Fight Notes" value={prep?.postFightNotes || ''} onChange={(value) => updatePrep({ postFightNotes: value })} />
      </div>

      <label className="mt-2 grid max-w-xs gap-1 text-xs font-black">
        Deaths during fight
        <input value={boss.deaths} onChange={(event) => updateBoss(boss.id, { deaths: Math.max(0, Number(event.target.value) || 0) })} type="number" min="0" className={fieldClass} />
      </label>
    </section>
  );
}

function PrepPokemonMoveInputs({
  pokemon,
  moves,
  onChange,
}: {
  pokemon: NuzlockePokemon;
  moves: string[];
  onChange: (moveIndex: number, moveName: string) => void;
}) {
  const suggestions = usePokemonLevelMoves(pokemon.species, pokemon.level, true);
  const listId = `prep-moves-${pokemon.id}`;
  const moveSlots = Array.from({ length: 4 }, (_, index) => moves[index] || suggestions[index]?.name || '');

  return (
    <div className="rounded-xl bg-white/75 p-2 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <MonsterToken species={pokemon.species} types={pokemonDisplayTypes(pokemon)} compact />
        <div>
          <div className="text-xs font-black">{pokemon.nickname || pokemon.species} / Lv {pokemon.level}</div>
          <div className="text-[10px] font-bold text-[#506078]">Pick or type planned moves</div>
        </div>
      </div>
      <datalist id={listId}>
        {suggestions.map((move) => <option key={move.name} value={move.name} />)}
      </datalist>
      <div className="grid gap-1 sm:grid-cols-2">
        {moveSlots.map((moveName, index) => (
          <input
            key={`${pokemon.id}-move-${index}`}
            value={moveName}
            list={listId}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={`Move ${index + 1}`}
            className={`${fieldClass} py-1.5 text-xs`}
          />
        ))}
      </div>
    </div>
  );
}

function safePokemonType(type: string | undefined): PokemonType {
  return pokemonTypes.includes(type as PokemonType) ? type as PokemonType : 'Normal';
}

const preSplitPhysicalTypes = new Set<PokemonType>(['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel']);

function usesPrePhysicalSpecialSplit(gameVersion: GameVersion) {
  return ['Red', 'Blue', 'Yellow', 'Gold', 'Silver', 'Crystal', 'Ruby', 'Sapphire', 'Emerald', 'FireRed', 'LeafGreen'].includes(gameVersion);
}

function displayedMoveCategory(move: PokemonMove, gameVersion: GameVersion): PokemonMove['category'] {
  if (!usesPrePhysicalSpecialSplit(gameVersion) || move.category === 'Status') return move.category;
  return preSplitPhysicalTypes.has(safePokemonType(move.type)) ? 'Physical' : 'Special';
}

function PrepComparePanel({
  bossPokemon,
  teamPokemon,
  plannedMoves,
  gameVersion,
}: {
  bossPokemon?: NuzlockeBossPokemon;
  teamPokemon?: NuzlockePokemon;
  plannedMoves: string[];
  gameVersion: GameVersion;
}) {
  const teamMoveData = useMoveData(plannedMoves.filter(Boolean));
  const teamFallbackMoves = usePokemonLevelMoves(teamPokemon?.species || '', teamPokemon?.level || 1, Boolean(teamPokemon && plannedMoves.filter(Boolean).length === 0));
  const bossListedMoves = bossPokemon ? defaultMoveHints(bossPokemon).map((move) => move.name) : [];
  const bossListedMoveData = useMoveData(bossListedMoves);
  const bossFallbackMoves = usePokemonLevelMoves(bossPokemon?.species || '', bossPokemon?.level || 1, Boolean(bossPokemon && bossListedMoves.length === 0));
  const bossMoves = bossListedMoves.length > 0 ? bossListedMoveData : bossFallbackMoves;

  if (!bossPokemon || !teamPokemon) {
    return (
      <PrepSection title="Compare Pokemon">
        <EmptyPrepText text="Select one boss Pokemon and one planned team member to compare." />
      </PrepSection>
    );
  }

  const bossTypes = pokemonDisplayTypes(bossPokemon);
  const teamTypes = pokemonDisplayTypes(teamPokemon);
  const bossStats = pokemonBaseStats(bossPokemon.species);
  const teamStats = pokemonBaseStats(teamPokemon.species);
  const teamMoves = teamMoveData.length > 0 ? teamMoveData : teamFallbackMoves;
  const incoming = bossMoves.map((move) => ({
    move,
    multiplier: applyDefensiveAbilityMultiplier(teamPokemon.ability, safePokemonType(move.type), teamTypes),
  }));
  const outgoing = teamMoves.map((move) => ({
    move,
    multiplier: getAttackMultiplier(safePokemonType(move.type), bossTypes),
  }));

  return (
    <PrepSection title="Compare Pokemon">
      <div className="grid gap-2 xl:grid-cols-2">
        <PrepCompareCard
          label="My Pokemon"
          species={teamPokemon.species}
          title={`${teamPokemon.nickname || teamPokemon.species} / Lv ${teamPokemon.level}`}
          types={teamTypes}
          stats={teamStats}
          moves={teamMoves}
          defenderTypes={bossTypes}
          gameVersion={gameVersion}
        />
        <PrepCompareCard
          label="Boss Pokemon"
          species={bossPokemon.species}
          title={`${bossPokemon.species} / Lv ${bossPokemon.level}`}
          types={bossTypes}
          stats={bossStats}
          moves={bossMoves}
          defenderTypes={teamTypes}
          ability={bossPokemon.ability}
          item={bossPokemon.item}
          gameVersion={gameVersion}
        />
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        <div className="rounded-xl bg-white/75 p-2 shadow-sm">
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">My move pressure</div>
          <MoveMultiplierList entries={outgoing} empty="Add team moves above to see coverage." />
        </div>
        <div className="rounded-xl bg-white/75 p-2 shadow-sm">
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Incoming boss pressure</div>
          <MoveMultiplierList entries={incoming} empty="No boss moves listed yet." />
        </div>
      </div>
    </PrepSection>
  );
}

function PrepCompareCard({
  label,
  species,
  title,
  types,
  stats,
  moves,
  defenderTypes,
  ability,
  item,
  gameVersion,
}: {
  label: string;
  species: string;
  title: string;
  types: PokemonType[];
  stats?: ReturnType<typeof pokemonBaseStats>;
  moves: PokemonMove[];
  defenderTypes: PokemonType[];
  ability?: string;
  item?: string;
  gameVersion: GameVersion;
}) {
  const shownStats = usePokemonStats(species, stats);

  return (
    <div className="rounded-xl bg-white/75 p-2 shadow-sm">
      <div className="flex items-start gap-2">
        <MonsterToken species={species} types={types} compact />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">{label}</div>
          <div className="text-sm font-black">{title}</div>
          <div className="mt-1 flex flex-wrap gap-1">{types.map((type) => <TypeBadge key={type} type={type} />)}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-bold text-[#506078]">
            {ability ? <span>Ability: {ability}</span> : null}
            {item ? <span>Item: {item}</span> : null}
          </div>
        </div>
      </div>
      {shownStats ? (
        <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-black">
          {Object.entries(shownStats).map(([stat, value]) => (
            <span key={stat} className="rounded-[4px] bg-white px-2 py-1 shadow-sm"><span className="uppercase text-[#6f7b8d]">{stat}</span> {value}</span>
          ))}
        </div>
      ) : null}
      <div className="mt-2 grid gap-1">
        {moves.length > 0 ? moves.map((move) => (
          <div key={`${title}-${move.name}`} className="flex flex-wrap items-center justify-between gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold shadow-sm">
            <span className="font-black">{move.name}</span>
            <span className="flex items-center gap-1">
              <MoveCategoryBadge category={displayedMoveCategory(move, gameVersion)} />
              <MoveTypeBadge type={safePokemonType(move.type)} defenderTypes={defenderTypes} />
              <span className="text-[#506078]">Pwr {move.power ?? '-'}</span>
            </span>
          </div>
        )) : <EmptyPrepText text="No moves selected yet." />}
      </div>
    </div>
  );
}

function MoveMultiplierList({
  entries,
  empty,
}: {
  entries: { move: PokemonMove; multiplier: number }[];
  empty: string;
}) {
  if (entries.length === 0) return <EmptyPrepText text={empty} />;

  return (
    <div className="grid gap-1">
      {entries.map(({ move, multiplier }) => (
        <div key={`${move.name}-${move.type}`} className="flex items-center justify-between rounded-lg bg-white px-2 py-1 text-[11px] font-black shadow-sm">
          <span>{move.name}</span>
          <span className="flex items-center gap-1">
            <TypeBadge type={safePokemonType(move.type)} />
            <span>{getMultiplierLabel(multiplier)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function BossPrepModal({
  onClose,
  ...props
}: {
  onClose: () => void;
  boss: NuzlockeBoss;
  run: NuzlockeRun;
  prep?: NuzlockeBossPrep;
  updatePrep: (changes: Partial<NuzlockeBossPrep>) => void;
  updateBoss: (bossId: string, changes: Partial<NuzlockeBoss>) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#182a40]/45 p-3 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-6xl rounded-2xl bg-white p-3 shadow-[0_24px_80px_rgba(24,42,64,0.28)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">Floating Prep Window</div>
          <button type="button" onClick={onClose} className={smallButtonClass}>Close</button>
        </div>
        <BossPrepPanel {...props} />
      </div>
    </div>,
    document.body
  );
}

function PrepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/65 p-2 shadow-sm">
      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">{title}</div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function PrepNote({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} min-h-20 text-sm normal-case tracking-normal text-[#182a40]`} />
    </label>
  );
}

function EmptyPrepText({ text }: { text: string }) {
  return <div className="text-xs font-bold text-[#506078]">{text}</div>;
}

function WarningText({ text }: { text: string }) {
  return <div className="rounded-lg bg-[#fff2f0] px-2 py-1 text-xs font-black text-[#9f2c24]">{text}</div>;
}

function MoveTypeBadge({ type, defenderTypes }: { type: PokemonType; defenderTypes: PokemonType[] }) {
  const multiplier = getAttackMultiplier(type, defenderTypes);
  const tone =
    multiplier >= 2
      ? 'bg-[#e5f7df] text-[#267a38]'
      : multiplier === 0
        ? 'bg-[#f0f2f7] text-[#506078]'
        : multiplier < 1
          ? 'bg-[#ffe2de] text-[#a43128]'
          : 'bg-white text-[#182a40]';

  return (
    <span className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-[10px] font-black shadow-sm ${tone}`}>
      <TypeBadge type={type} />
      <span>{getMultiplierLabel(multiplier)}</span>
    </span>
  );
}

function MoveCategoryBadge({ category }: { category: PokemonMove['category'] }) {
  const tone =
    category === 'Physical'
      ? 'bg-[#ffe2de] text-[#a43128]'
      : category === 'Special'
        ? 'bg-[#e7f1ff] text-[#2559a8]'
        : 'bg-[#f0f2f7] text-[#506078]';

  return <span className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-black uppercase ${tone}`}>{category}</span>;
}

function useMoveData(moveNames: string[]) {
  const key = moveNames.join('|');
  const [moves, setMoves] = useState<PokemonMove[]>([]);

  useEffect(() => {
    let active = true;
    const uniqueNames = Array.from(new Set(moveNames.filter(Boolean)));
    if (uniqueNames.length === 0) {
      setMoves([]);
      return;
    }

    Promise.all(uniqueNames.map((name) => getMoveData(name))).then((results) => {
      if (!active) return;
      setMoves(results.filter((move): move is PokemonMove => Boolean(move)));
    });

    return () => {
      active = false;
    };
  }, [key]);

  return moves;
}

function usePokemonLevelMoves(species: string, level: number, enabled: boolean) {
  const [moves, setMoves] = useState<PokemonMove[]>([]);

  useEffect(() => {
    let active = true;
    if (!enabled || !species) {
      setMoves([]);
      return;
    }

    getPokemonLevelMoves(species, level).then((results) => {
      if (active) setMoves(results);
    });

    return () => {
      active = false;
    };
  }, [species, level, enabled]);

  return moves;
}

function BossPokemonDetails({ pokemon, embedded = false }: { pokemon: NuzlockeBossPokemon; embedded?: boolean }) {
  const types = usePublicPokemonTypes(pokemon.species, pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species));
  const stats = pokemonBaseStats(pokemon.species);
  const matchups = getAbilityAwareDefensiveMatchups(types, pokemon.ability);
  const strong = getStabStrongAgainst(types);
  const listedMoves = defaultMoveHints(pokemon).map((move) => move.name);
  const listedMoveData = useMoveData(listedMoves);
  const fallbackMoveData = usePokemonLevelMoves(pokemon.species, pokemon.level, listedMoves.length === 0);
  const moves = listedMoves.length > 0 ? listedMoveData : fallbackMoveData;

  return (
    <div className={`${embedded ? 'mt-2 border-t border-white/80 pt-2' : 'mt-3 rounded-2xl bg-white/78 p-3 shadow-sm'}`}>
      {!embedded ? (
        <div className="flex flex-wrap items-start gap-3">
          <MonsterToken species={pokemon.species} types={types} large />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">Scout Report</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h4 className="text-base font-black">{pokemon.species}</h4>
              {types.map((type) => <TypeBadge key={type} type={type} />)}
              {pokemon.teraType ? <span className="text-xs font-black">Tera <TypeBadge type={pokemon.teraType} /></span> : null}
            </div>
            {pokemon.notes ? <p className="mt-1 text-xs font-bold leading-5 text-[#506078]">{pokemon.notes}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="mt-2 grid gap-2 xl:grid-cols-[0.7fr_1.05fr_1.25fr]">
        {stats ? (
          <div>
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Stats</div>
            <div className="flex flex-wrap gap-1 text-[10px] font-black">
              {Object.entries(stats).map(([label, value]) => (
                <span key={label} className="rounded-[4px] bg-white px-2 py-1 shadow-sm">
                  <span className="uppercase text-[#6f7b8d]">{label}</span> {value}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Moves</div>
          {moves.length === 0 ? (
            <div className="rounded-lg bg-white/80 px-2 py-1 text-[11px] font-bold text-[#506078] shadow-sm">Loading move data...</div>
          ) : (
            <div className="grid gap-1">
              {moves.map((moveInfo) => (
              <div key={`${moveInfo.name}-${moveInfo.type}`} className="rounded-lg bg-white px-2 py-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black">{moveInfo.name}</span>
                  <span className="flex items-center gap-1">
                    <MoveCategoryBadge category={moveInfo.category} />
                    <MoveTypeBadge type={pokemonTypes.includes(moveInfo.type as PokemonType) ? moveInfo.type as PokemonType : 'Normal'} defenderTypes={types} />
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-bold text-[#506078]">
                  <span>Power: {moveInfo.power ?? '-'}</span>
                  <span>Acc: {moveInfo.accuracy ?? '-'}</span>
                  <span>PP: {moveInfo.pp ?? '-'}</span>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Matchups</div>
          <div className="grid gap-1 text-[11px] font-black">
            <MatchupRow label="Weak" amount="4x" types={matchups.weak4x} empty="None" />
            <MatchupRow label="Weak" amount="2x" types={matchups.weak2x} empty="None" />
            <MatchupRow label="Resist" amount="1/2" types={matchups.resistHalf} empty="None" />
            <MatchupRow label="Resist" amount="1/4" types={matchups.resistQuarter} empty="None" />
            <MatchupRow label="Immune" amount="0x" types={matchups.immune0x} empty="None" />
            <MatchupRow label="Strong" amount="STAB" types={strong} empty="None" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchupRow({ label, amount, types, empty }: { label: string; amount: string; types: PokemonType[]; empty: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg bg-white/85 px-2 py-1 shadow-sm">
      <span className="mr-1 min-w-14 text-[10px] uppercase tracking-[0.12em] text-[#6f7b8d]">{label}</span>
      <div className="flex flex-wrap gap-1">
        {types.length > 0 ? types.map((type) => (
          <span key={type} className="inline-flex items-center gap-1 rounded-[4px] bg-[#f7f9fc] px-1.5 py-1">
            <TypeBadge type={type} />
            <span className="text-[10px] text-[#182a40]">{amount}</span>
          </span>
        )) : <span className="text-[#6f7b8d]">{empty}</span>}
      </div>
    </div>
  );
}

function TeamPokemonScout({
  pokemon,
  compact = false,
  actions,
  showDetails = true,
  showNatureAbility = true,
  showHeldDetail = true,
}: {
  pokemon: NuzlockePokemon;
  compact?: boolean;
  actions?: React.ReactNode;
  showDetails?: boolean;
  showNatureAbility?: boolean;
  showHeldDetail?: boolean;
}) {
  const types = pokemon.types?.length ? pokemon.types : pokemonTypesForSpecies(pokemon.species);
  const matchups = getAbilityAwareDefensiveMatchups(types, pokemon.ability);
  const item = pokemon.heldItem || 'None';
  const abilities = useAbilityData(pokemon.species);
  const selectedAbility = abilities.find((ability) => pokemon.ability?.toLowerCase().startsWith(ability.name.toLowerCase()));

  return (
    <div className={`rounded-2xl bg-white p-3 shadow-sm ${compact ? 'w-[min(92vw,560px)]' : ''}`}>
      <div className="flex items-start gap-3">
        <MonsterToken species={pokemon.species} status={pokemon.status} types={types} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="truncate text-base font-black">{pokemon.nickname || pokemon.species}</h3>
              <div className="text-xs font-bold text-[#506078]">{pokemon.species} / Lv {pokemon.level} / {pokemon.status}</div>
              <div className="mt-1 text-[11px] font-black text-[var(--nuz-accent)]">{pokemon.metLocation || 'Unknown area'}</div>
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {types.map((type) => <TypeBadge key={type} type={type} />)}
            {showDetails && showHeldDetail && item !== 'None' ? (
              <span className="inline-flex items-center gap-1 rounded-[4px] bg-white px-2 py-1 text-[11px] font-black shadow-sm">
                <ItemSprite item={item} />
                {item}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`mt-3 grid gap-3 ${showDetails && showNatureAbility ? 'lg:grid-cols-[0.8fr_1.2fr]' : ''}`}>
        {showDetails && showNatureAbility ? (
          <div className="grid gap-1 text-xs font-bold text-[#506078]">
            {pokemon.nature ? (
              <div className="rounded-lg bg-[#f7f9fc] p-2">
                <span className="font-black text-[#182a40]">Nature</span>
                <span className="ml-2">{pokemon.nature}</span>
                <NatureEffect nature={pokemon.nature} />
              </div>
            ) : null}
            {pokemon.ability ? (
              <div className="rounded-lg bg-[#f7f9fc] p-2">
                <span className="font-black text-[#182a40]">Ability</span>
                <span className="ml-2">{pokemon.ability}</span>
                {selectedAbility?.shortEffect ? <div className="mt-1 text-[11px] leading-4">{selectedAbility.shortEffect}</div> : null}
              </div>
            ) : null}
            {showHeldDetail && item !== 'None' ? (
              <div className="rounded-lg bg-[#f7f9fc] p-2">
                <span className="font-black text-[#182a40]">Held</span>
                <span className="ml-2">{item}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div>
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Defensive Matchups</div>
          <div className="grid gap-1 text-[11px] font-black">
            <MatchupRow label="Weak" amount="4x" types={matchups.weak4x} empty="None" />
            <MatchupRow label="Weak" amount="2x" types={matchups.weak2x} empty="None" />
            <MatchupRow label="Resist" amount="1/2" types={matchups.resistHalf} empty="None" />
            <MatchupRow label="Resist" amount="1/4" types={matchups.resistQuarter} empty="None" />
            <MatchupRow label="Immune" amount="0x" types={matchups.immune0x} empty="None" />
          </div>
        </div>
      </div>

      {pokemon.notes ? <p className="mt-3 text-xs font-bold leading-5 text-[#506078]">{pokemon.notes}</p> : null}
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
