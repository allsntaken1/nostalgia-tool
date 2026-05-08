'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { type CSSProperties, FormEvent, useEffect, useState } from 'react';
import { Skull } from 'lucide-react';
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
  NuzlockeEncounter,
  NuzlockePokemon,
  NuzlockeRules,
  NuzlockeRun,
  PokemonStatus,
  PokemonType,
  RunType,
} from './types';

type Tab = 'Overview' | 'Team' | 'Encounters' | 'Badges / Bosses' | 'Graveyard' | 'Timeline';

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

const badgeShapes: Record<string, string> = {
  Brock: 'polygon(50% 4%, 86% 22%, 96% 58%, 72% 92%, 28% 92%, 4% 58%, 14% 22%)',
  Misty: 'polygon(50% 0%, 61% 32%, 95% 35%, 68% 55%, 79% 90%, 50% 69%, 21% 90%, 32% 55%, 5% 35%, 39% 32%)',
  'Lt. Surge': 'polygon(48% 0%, 82% 0%, 64% 37%, 94% 37%, 39% 100%, 50% 56%, 16% 56%)',
  Erika: 'circle(43% at 50% 50%)',
  Koga: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  Sabrina: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
  Blaine: 'polygon(50% 0%, 66% 32%, 100% 37%, 75% 61%, 81% 96%, 50% 78%, 19% 96%, 25% 61%, 0% 37%, 34% 32%)',
  Giovanni: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
  Lorelei: 'polygon(50% 0%, 90% 18%, 100% 58%, 72% 100%, 28% 100%, 0% 58%, 10% 18%)',
  Bruno: 'polygon(50% 0%, 100% 38%, 80% 100%, 20% 100%, 0% 38%)',
  Agatha: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  Lance: 'polygon(50% 0%, 92% 18%, 82% 100%, 50% 78%, 18% 100%, 8% 18%)',
  'Champion Rival': 'polygon(50% 0%, 94% 24%, 82% 100%, 50% 82%, 18% 100%, 6% 24%)',
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
    bosses.map((boss) => {
      const defaultBoss = getNuzlockeBosses(gameVersion).find((item) => item.id === boss.id);
      const defaultPokemon = defaultBoss?.pokemon ?? [];
      const pokemon = Array.isArray(boss.pokemon) && boss.pokemon.length > 0
        ? boss.pokemon.map((member) => {
            const defaultMember = defaultPokemon.find((item) => item.species === member.species);
            return {
              ...member,
              ability: cleanBossDetail(member.ability) || defaultMember?.ability || '',
              item: cleanBossDetail(member.item) || defaultMember?.item || '',
              nature: cleanBossDetail(member.nature) || defaultMember?.nature || '',
            };
          })
        : defaultPokemon;

      return {
        ...boss,
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
  const shape = badgeShapes[name] ?? 'polygon(50% 0%, 95% 28%, 82% 100%, 50% 82%, 18% 100%, 5% 28%)';

  return (
    <div className="relative h-14 w-14 shrink-0 drop-shadow-[2px_3px_0_rgba(24,42,64,0.18)]" title={name}>
      <div
        className="absolute inset-0 border-2 border-[#182a40]"
        style={{
          clipPath: shape,
          background: `linear-gradient(135deg, ${typeHex[primary]}, ${typeHex[secondary]})`,
        }}
      />
      <div className="absolute inset-[7px] bg-white/40" style={{ clipPath: shape }} />
      <div className="absolute inset-x-0 top-[18px] text-center text-sm font-black text-[#182a40] drop-shadow-[1px_1px_0_rgba(255,255,255,0.6)]">
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

function BossPokemonRow({ pokemon, bossId }: { pokemon: NonNullable<NuzlockeBoss['pokemon']>[number]; bossId: string }) {
  const details = [cleanBossDetail(pokemon.nature), cleanBossDetail(pokemon.ability), cleanBossDetail(pokemon.item)].filter(Boolean);
  const types = pokemonTypesForSpecies(pokemon.species);

  return (
    <div key={`${bossId}-${pokemon.species}-${pokemon.level}`} style={typeCardStyle(types)} className="flex items-center gap-3 rounded-md p-2 text-xs font-bold shadow-sm">
      <MonsterToken species={pokemon.species} types={types} compact />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 font-black">
          <span className="truncate">{pokemon.species}</span>
          <span className="shrink-0">Lv {pokemon.level}</span>
        </div>
        {details.length > 0 ? <div className="mt-1 text-[11px] leading-5 text-[#506078]">{details.join(' / ')}</div> : null}
        {types.length > 0 ? <div className="mt-2 flex flex-wrap gap-1">{types.map((type) => <TypeBadge key={type} type={type} />)}</div> : null}
      </div>
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
    Pidgeot: ['Normal', 'Flying'],
    Staryu: ['Water'],
    Starmie: ['Water', 'Psychic'],
    Raichu: ['Electric'],
    Victreebel: ['Grass', 'Poison'],
    Vileplume: ['Grass', 'Poison'],
    Muk: ['Poison'],
    Weezing: ['Poison'],
    Kadabra: ['Psychic'],
    Alakazam: ['Psychic'],
    MrMime: ['Psychic'],
    Venomoth: ['Bug', 'Poison'],
    Ninetales: ['Fire'],
    Arcanine: ['Fire'],
    Nidoqueen: ['Poison', 'Ground'],
    Nidoking: ['Poison', 'Ground'],
    Rhydon: ['Ground', 'Rock'],
    Dewgong: ['Water', 'Ice'],
    Cloyster: ['Water', 'Ice'],
    Slowbro: ['Water', 'Psychic'],
    Jynx: ['Ice', 'Psychic'],
    Machamp: ['Fighting'],
    Gengar: ['Ghost', 'Poison'],
    Haunter: ['Ghost', 'Poison'],
    Arbok: ['Poison'],
    Dragonair: ['Dragon'],
    Dragonite: ['Dragon', 'Flying'],
    Exeggutor: ['Grass', 'Psychic'],
    'Starter Ace': ['Normal'],
  };

  return known[species] ?? [];
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
    'elite-four': ['Ground', 'Steel'],
    'champion-geeta': ['Rock', 'Poison'],
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

function MonsterToken({ species, status, compact = false, types = [] }: { species: string; status?: PokemonStatus; compact?: boolean; types?: PokemonType[] }) {
  const spriteUrl = getPokemonSpriteUrl(species);
  const initials = species
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

  const tokenSize = compact ? 'h-12 w-12' : 'h-20 w-20';
  const imageSize = compact ? 'h-12 w-12' : 'h-[4.5rem] w-[4.5rem]';
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
    <section className={`min-h-screen ${trackerTheme(currentGame)}`} style={trackerVars(currentGame)}>
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
  const tabs: Tab[] = ['Overview', 'Team', 'Encounters', 'Badges / Bosses', 'Graveyard', 'Timeline'];

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
      {tab === 'Team' ? <TeamTracker run={run} updateRun={updateRun} addTimeline={addTimeline} /> : null}
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
              <div className="mt-3 text-xs font-bold text-[#506078]">{pokemon.nature || 'No nature'} / {pokemon.ability || 'No ability'}</div>
              <label className="mt-3 grid gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--nuz-accent)]">
                Held item
                <select value={pokemon.heldItem || 'None'} onChange={(event) => updatePokemon(pokemon.id, { heldItem: event.target.value })} className={`${fieldClass} text-xs normal-case tracking-normal text-[#182a40]`}>
                  {heldItemOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
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

  const encounterOptions = encounterOptionsByLocation[form.location] ?? [];
  const canShowEncounterOption = (option: { surfMethod?: boolean; fishingMethod?: boolean }) =>
    (!option.surfMethod || showSurfEncounters) && (!option.fishingMethod || showFishingEncounters);
  const visibleEncounterOptions = encounterOptions.filter(canShowEncounterOption);
  const selectedAbilityOptions = getAbilityOptions(form.pokemon);
  const locationAlreadyCaught = caughtLocations.has(form.location);

  const chooseLocation = (location: string) => {
    const options = (encounterOptionsByLocation[location] ?? []).filter(canShowEncounterOption);
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
    setForm((current) => ({
      ...current,
      pokemon: species,
      types: selected?.types ?? current.types,
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
    const nextOpenLocation = locations.find((location) => location !== form.location && !caughtLocations.has(location)) ?? form.location;
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
    <section className="grid gap-4 lg:grid-cols-[390px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)]">
      <form onSubmit={addEncounter} className={panelClass}>
        <div className="mb-3 text-sm font-black">Add Encounter</div>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
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
          <select value={form.location} onChange={(event) => chooseLocation(event.target.value)} className={fieldClass}>
            {locations.map((location) => (
              <option key={location} disabled={caughtLocations.has(location)} value={location}>
                {location}{caughtLocations.has(location) ? ' - caught' : ''}
              </option>
            ))}
          </select>
          <SpriteSelect
            value={form.pokemon}
            onChange={choosePokemon}
            options={visibleEncounterOptions.length > 0 ? visibleEncounterOptions : [{ species: 'Not listed', types: ['Normal'] as PokemonType[] }]}
          />
          <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="Nickname" className={fieldClass} />
          <input value={form.levelMet} onChange={(event) => setForm({ ...form, levelMet: event.target.value })} type="number" min="1" placeholder="Level met" className={fieldClass} />
          <div className="grid gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Result</div>
            <div className="grid grid-cols-2 gap-2">
              {(['Caught', 'Failed', 'Skipped', 'Dead'] as EncounterStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, status })}
                  className={`rounded-lg px-3 py-2 text-xs font-black shadow-sm ${
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
          <select value={form.nature} onChange={(event) => setForm({ ...form, nature: event.target.value })} className={fieldClass}>
            {natureOptions.map((nature) => <option key={nature}>{nature}</option>)}
          </select>
          <div className="grid gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--nuz-accent)]">Ability</div>
            <ChoiceButtons options={selectedAbilityOptions} value={form.ability} onChange={(ability) => setForm({ ...form, ability })} />
          </div>
          {locationAlreadyCaught && form.status === 'Caught' ? (
            <div className="rounded-xl bg-[#fff2f0] p-3 text-xs font-black text-[#9f2c24]">
              This area already has a caught encounter. Change the result or choose another area.
            </div>
          ) : null}
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className={`${fieldClass} min-h-20`} />
          <button disabled={form.status === 'Caught' && locationAlreadyCaught} className="rounded-xl bg-[var(--nuz-accent-soft)] px-4 py-3 text-sm font-black shadow-[0_8px_20px_rgba(24,42,64,0.14)] disabled:opacity-45">Add Encounter</button>
        </div>
      </form>

      <div className="grid min-w-0 gap-3">
        {(run.encounters || []).map((encounter) => (
          <article key={encounter.id} className={panelClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">{encounter.location}</h3>
                <div className="text-sm font-bold text-[#506078]">{encounter.pokemon || 'No Pokemon recorded'} {encounter.nickname ? `/ ${encounter.nickname}` : ''} / Lv {encounter.levelMet}</div>
                <div className="mt-1 text-xs font-black text-[var(--nuz-accent)]">{encounter.nature || 'Not Sure'} / {encounter.ability || 'Not Sure'}</div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm">{encounter.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{(encounter.types || []).map((type) => <TypeBadge key={type} type={type} />)}</div>
            <p className="mt-2 text-sm font-bold leading-6">{encounter.notes}</p>
          </article>
        ))}
      </div>
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

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {sortedBosses.map((boss) => (
        <article key={boss.id} style={typeCardStyle(bossTypes(boss))} className={`rounded-2xl border border-white/75 p-4 shadow-[0_18px_50px_rgba(24,42,64,0.10)] backdrop-blur ${boss.completed ? 'opacity-70' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <BadgeToken name={boss.name} types={bossTypes(boss)} />
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--nuz-accent)]">{boss.category}</div>
                <h3 className="mt-1 truncate text-lg font-black">{boss.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1">{bossTypes(boss).map((type) => <TypeBadge key={type} type={type} />)}</div>
                {boss.completed ? <div className="mt-1 text-xs font-black text-[#2f7d4f]">Completed / {boss.deaths} deaths</div> : null}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-black">
              <input type="checkbox" checked={boss.completed} onChange={() => toggleBoss(boss)} />
              Done
            </label>
          </div>

          {!boss.completed ? (
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
                    {(boss.pokemon || []).map((pokemon) => <BossPokemonRow key={`${boss.id}-${pokemon.species}-${pokemon.level}`} pokemon={pokemon} bossId={boss.id} />)}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-[#506078]">Team data is not listed yet.</div>
                )}
              </div>
              <textarea value={boss.notes} onChange={(event) => updateBoss(boss.id, { notes: event.target.value })} placeholder="Notes" className={`${fieldClass} mt-3 min-h-20 w-full text-sm`} />
            </>
          ) : null}
        </article>
      ))}
    </section>
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
