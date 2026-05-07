'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { FormEvent, useEffect, useState } from 'react';
import { Plus, Skull } from 'lucide-react';
import {
  gameGroups,
  nuzlockeStorageKey,
  pokemonTypes,
  runTypes,
  scarletVioletBosses,
  scarletVioletLocations,
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

  return value.filter(isRun).map((run) => ({
    ...run,
    team: Array.isArray(run.team) ? run.team : [],
    encounters: Array.isArray(run.encounters) ? run.encounters : [],
    bosses: Array.isArray(run.bosses) ? run.bosses : [],
    timeline: Array.isArray(run.timeline) ? run.timeline : [],
    rules: run.rules || defaultRules,
  }));
}

function TypeBadge({ type }: { type: PokemonType }) {
  return <span className={`rounded-sm px-2 py-1 text-[11px] font-black ${typeColors[type] ?? 'bg-white text-[#182a40]'}`}>{type}</span>;
}

function MonsterToken({ species, status }: { species: string; status?: PokemonStatus }) {
  const initials = species
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

  return (
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-[#182a40] text-sm font-black shadow-[3px_3px_0_rgba(24,42,64,0.25)] ${
      status === 'Dead' ? 'bg-[#182a40] text-white' : 'bg-[#ffe36e] text-[#182a40]'
    }`}>
      {initials}
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

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-4 border-[#182a40] bg-[#fffdf1] p-3 shadow-[6px_6px_0_rgba(24,42,64,0.2)]">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7fbf]">RepeatChannel Tool</div>
          <h1 className="text-2xl font-black sm:text-3xl">Pokemon Nuzlocke Tracker</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {runs.length > 0 ? (
            <select value={activeRunId} onChange={(event) => setActiveRunId(event.target.value)} className="border-2 border-[#182a40] bg-white px-3 py-2 text-xs font-black">
              {runs.map((run) => (
                <option key={run.id} value={run.id}>{run.runName}</option>
              ))}
            </select>
          ) : null}
          <button onClick={() => setSelectedGame('')} className="border-2 border-[#182a40] bg-white px-3 py-2 text-xs font-black shadow-[3px_3px_0_rgba(24,42,64,0.2)]">
            New Run
          </button>
        </div>
      </header>

      {!activeRun && !selectedGame ? <GameVersionPicker onSelect={setSelectedGame} /> : null}
      {!activeRun && selectedGame ? <RunSetupForm gameVersion={selectedGame} onBack={() => setSelectedGame('')} onCreate={createRun} /> : null}
      {activeRun ? <NuzlockeDashboard run={activeRun} updateRun={updateRun} addTimeline={addTimeline} onNewRun={() => setActiveRunId('')} /> : null}
    </section>
  );
}

function GameVersionPicker({ onSelect }: { onSelect: (game: GameVersion) => void }) {
  return (
    <section className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[8px_8px_0_rgba(24,42,64,0.2)]">
      <h2 className="text-3xl font-black">Choose Your Game</h2>
      <p className="mt-2 text-sm font-bold text-[#506078]">Scarlet and Violet are fully wired first. The rest are parked here for later.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gameGroups.map((group) => (
          <div key={group.generation} className="border-2 border-[#9baec8] bg-[#f8fbff] p-3">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#3f7fbf]">{group.generation}</div>
            <div className="grid grid-cols-2 gap-2">
              {(group.games || []).map((game) => (
                <button
                  key={game.name}
                  onClick={() => game.supported && onSelect(game.name)}
                  disabled={!game.supported}
                  className={`min-h-12 border-2 px-2 text-sm font-black shadow-[3px_3px_0_rgba(24,42,64,0.16)] ${
                    game.supported
                      ? 'border-[#182a40] bg-[#ffe36e] hover:-translate-y-0.5'
                      : 'border-[#c8d2df] bg-white text-[#8a97aa] opacity-75'
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
      bosses: gameVersion === 'Scarlet' || gameVersion === 'Violet' ? scarletVioletBosses.map((boss) => ({ ...boss })) : [],
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
    <form onSubmit={create} className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[8px_8px_0_rgba(24,42,64,0.2)]">
      <button type="button" onClick={onBack} className="mb-4 border-2 border-[#182a40] bg-white px-3 py-2 text-xs font-black">Back to Games</button>
      <h2 className="text-3xl font-black">Run Setup</h2>
      <div className="mt-1 text-sm font-black text-[#3f7fbf]">{gameVersion}</div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Run name
          <input value={runName} onChange={(event) => setRunName(event.target.value)} className="border-4 border-[#9baec8] bg-white px-3 py-3 outline-none focus:border-[#182a40]" />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Run type
          <select value={runType} onChange={(event) => setRunType(event.target.value as RunType)} className="border-4 border-[#9baec8] bg-white px-3 py-3">
            {runTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>

      {runType === 'Monotype' ? (
        <label className="mt-4 grid gap-2 text-sm font-black">
          Monotype
          <select value={rules.monotype || 'Normal'} onChange={(event) => setRules((current) => ({ ...current, monotype: event.target.value as PokemonType }))} className="border-4 border-[#9baec8] bg-white px-3 py-3">
            {pokemonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      ) : null}

      <div className="mt-5">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#3f7fbf]">Rules</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ruleLabels.map((rule) => (
            <label key={rule.key} className="flex items-center gap-2 border-2 border-[#9baec8] bg-white p-3 text-xs font-black">
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

      {error ? <div className="mt-3 border-2 border-[#ef5350] bg-[#fff2f0] p-2 text-sm font-black text-[#9f2c24]">{error}</div> : null}
      <button className="mt-5 border-4 border-[#182a40] bg-[#ffe36e] px-5 py-3 text-sm font-black shadow-[5px_5px_0_#3f7fbf]">Create Run</button>
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
    <div className="grid gap-4">
      <section className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[8px_8px_0_rgba(24,42,64,0.2)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7fbf]">{run.gameVersion} / {run.runType}</div>
            <h2 className="text-3xl font-black">{run.runName}</h2>
          </div>
          <button onClick={onNewRun} className="border-2 border-[#182a40] bg-white px-3 py-2 text-xs font-black shadow-[3px_3px_0_rgba(24,42,64,0.2)]">
            New Run
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 border-2 px-3 py-2 text-xs font-black shadow-[3px_3px_0_rgba(24,42,64,0.14)] ${
                tab === item ? 'border-[#182a40] bg-[#182a40] text-white' : 'border-[#9baec8] bg-white'
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
      <div className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
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
    <div className="border-2 border-[#9baec8] bg-[#f8fbff] p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[#3f7fbf]">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function RuleSummary({ rules, monotype }: { rules: string[]; monotype?: PokemonType }) {
  return (
    <div className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[#3f7fbf]">Rules Summary</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(rules || []).map((rule) => <span key={rule} className="border-2 border-[#9baec8] bg-white px-2 py-1 text-xs font-black">{rule}</span>)}
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
  const [form, setForm] = useState({
    species: '',
    nickname: '',
    level: '5',
    typeOne: 'Normal' as PokemonType,
    typeTwo: '',
    nature: '',
    ability: '',
    status: 'Party' as PokemonStatus,
    notes: '',
  });

  const addPokemon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.species.trim()) return;

    const types = [form.typeOne, form.typeTwo].filter(Boolean) as PokemonType[];
    const pokemon: NuzlockePokemon = {
      id: makeId('pokemon'),
      species: form.species.trim(),
      nickname: form.nickname.trim(),
      level: safeNumber(form.level),
      types,
      nature: form.nature.trim(),
      ability: form.ability.trim(),
      status: form.status,
      notes: form.notes.trim(),
    };

    updateRun(run.id, (current) => addTimeline({ ...current, team: [pokemon, ...(current.team || [])] }, 'Pokemon Added', `${pokemon.nickname || pokemon.species} joined the run.`));
    setForm((current) => ({ ...current, species: '', nickname: '', level: '5', notes: '' }));
  };

  const markDead = (pokemon: NuzlockePokemon) => {
    const causeOfDeath = window.prompt('Cause of death?') || 'Not recorded';
    const deathLocation = window.prompt('Where did it happen?') || 'Not recorded';

    updateRun(run.id, (current) => addTimeline({
      ...current,
      team: (current.team || []).map((item) =>
        item.id === pokemon.id
          ? { ...item, status: 'Dead', levelDied: item.level, causeOfDeath, deathLocation }
          : item
      ),
    }, 'Pokemon Died', `${pokemon.nickname || pokemon.species} died at level ${pokemon.level}.`));
  };

  const setStatus = (id: string, status: PokemonStatus) => {
    updateRun(run.id, (current) => ({ ...current, updatedAt: nowLabel(), team: (current.team || []).map((pokemon) => pokemon.id === id ? { ...pokemon, status } : pokemon) }));
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <form onSubmit={addPokemon} className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
        <div className="mb-3 flex items-center gap-2 text-sm font-black"><Plus size={16} /> Add Pokemon</div>
        <div className="grid gap-3">
          <input value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} placeholder="Species" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="Nickname" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <input value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} placeholder="Level" type="number" min="1" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <div className="grid grid-cols-2 gap-2">
            <TypeSelect value={form.typeOne} onChange={(value) => value && setForm({ ...form, typeOne: value })} />
            <TypeSelect value={form.typeTwo} onChange={(value) => setForm({ ...form, typeTwo: value })} optional />
          </div>
          <input value={form.nature} onChange={(event) => setForm({ ...form, nature: event.target.value })} placeholder="Nature" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <input value={form.ability} onChange={(event) => setForm({ ...form, ability: event.target.value })} placeholder="Ability" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PokemonStatus })} className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold">
            {(['Party', 'Boxed', 'Dead', 'Released'] as PokemonStatus[]).map((status) => <option key={status}>{status}</option>)}
          </select>
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className="min-h-20 border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <button className="border-4 border-[#182a40] bg-[#ffe36e] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#3f7fbf]">Add to Team</button>
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(run.team || []).map((pokemon) => (
          <article key={pokemon.id} className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[5px_5px_0_rgba(24,42,64,0.16)]">
            <div className="flex items-start gap-3">
              <MonsterToken species={pokemon.species} status={pokemon.status} />
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black">{pokemon.nickname || pokemon.species}</h3>
                <div className="text-xs font-bold text-[#506078]">{pokemon.species} / Lv {pokemon.level}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{(pokemon.types || []).map((type) => <TypeBadge key={type} type={type} />)}</div>
            <div className="mt-3 text-xs font-bold text-[#506078]">{pokemon.nature || 'No nature'} / {pokemon.ability || 'No ability'}</div>
            <p className="mt-2 text-sm font-bold leading-6">{pokemon.notes}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <select value={pokemon.status} onChange={(event) => setStatus(pokemon.id, event.target.value as PokemonStatus)} className="border-2 border-[#9baec8] bg-white px-2 py-1 text-xs font-black">
                {(['Party', 'Boxed', 'Dead', 'Released'] as PokemonStatus[]).map((status) => <option key={status}>{status}</option>)}
              </select>
              {pokemon.status !== 'Dead' ? (
                <button onClick={() => markDead(pokemon)} className="flex items-center gap-1 border-2 border-[#ef5350] bg-[#fff2f0] px-2 py-1 text-xs font-black text-[#9f2c24]">
                  <Skull size={13} />
                  Mark Dead
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TypeSelect({ value, onChange, optional = false }: { value: PokemonType | string; onChange: (value: PokemonType | '') => void; optional?: boolean }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as PokemonType | '')} className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold">
      {optional ? <option value="">No second type</option> : null}
      {pokemonTypes.map((type) => <option key={type} value={type}>{type}</option>)}
    </select>
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
  const [form, setForm] = useState({
    location: scarletVioletLocations[0],
    pokemon: '',
    nickname: '',
    levelMet: '5',
    status: 'Caught' as EncounterStatus,
    typeOne: 'Normal' as PokemonType,
    typeTwo: '',
    notes: '',
  });

  const addEncounter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.location.trim()) return;

    const encounter: NuzlockeEncounter = {
      id: makeId('encounter'),
      location: form.location.trim(),
      pokemon: form.pokemon.trim(),
      nickname: form.nickname.trim(),
      levelMet: safeNumber(form.levelMet),
      status: form.status,
      types: [form.typeOne, form.typeTwo].filter(Boolean) as PokemonType[],
      notes: form.notes.trim(),
    };

    updateRun(run.id, (current) => addTimeline({ ...current, encounters: [encounter, ...(current.encounters || [])] }, encounter.status === 'Caught' ? 'Encounter Caught' : 'Encounter Logged', `${encounter.location}: ${encounter.pokemon || encounter.status}.`));
    setForm((current) => ({ ...current, pokemon: '', nickname: '', levelMet: '5', notes: '' }));
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <form onSubmit={addEncounter} className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
        <div className="mb-3 text-sm font-black">Add Encounter</div>
        <div className="grid gap-3">
          <select value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold">
            {scarletVioletLocations.map((location) => <option key={location}>{location}</option>)}
          </select>
          <input value={form.pokemon} onChange={(event) => setForm({ ...form, pokemon: event.target.value })} placeholder="Pokemon encountered" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="Nickname" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <input value={form.levelMet} onChange={(event) => setForm({ ...form, levelMet: event.target.value })} type="number" min="1" placeholder="Level met" className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as EncounterStatus })} className="border-2 border-[#9baec8] bg-white px-3 py-2 font-bold">
            {(['Caught', 'Failed', 'Skipped', 'Dead'] as EncounterStatus[]).map((status) => <option key={status}>{status}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <TypeSelect value={form.typeOne} onChange={(value) => setForm({ ...form, typeOne: value || 'Normal' })} />
            <TypeSelect value={form.typeTwo} onChange={(value) => setForm({ ...form, typeTwo: value })} optional />
          </div>
          <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" className="min-h-20 border-2 border-[#9baec8] bg-white px-3 py-2 font-bold" />
          <button className="border-4 border-[#182a40] bg-[#ffe36e] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#3f7fbf]">Add Encounter</button>
        </div>
      </form>

      <div className="grid gap-3">
        {(run.encounters || []).map((encounter) => (
          <article key={encounter.id} className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[5px_5px_0_rgba(24,42,64,0.16)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">{encounter.location}</h3>
                <div className="text-sm font-bold text-[#506078]">{encounter.pokemon || 'No Pokemon recorded'} {encounter.nickname ? `/ ${encounter.nickname}` : ''} / Lv {encounter.levelMet}</div>
              </div>
              <span className="border-2 border-[#9baec8] bg-white px-2 py-1 text-xs font-black">{encounter.status}</span>
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
      {(run.bosses || []).map((boss) => (
        <article key={boss.id} className={`border-4 p-4 shadow-[5px_5px_0_rgba(24,42,64,0.16)] ${boss.completed ? 'border-[#2f7d4f] bg-[#f1fff5]' : 'border-[#182a40] bg-[#fffdf1]'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[#3f7fbf]">{boss.category}</div>
              <h3 className="mt-1 text-lg font-black">{boss.name}</h3>
            </div>
            <label className="flex items-center gap-2 text-xs font-black">
              <input type="checkbox" checked={boss.completed} onChange={() => toggleBoss(boss)} />
              Done
            </label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-xs font-black">
              Level cap
              <input value={boss.levelCap} onChange={(event) => updateBoss(boss.id, { levelCap: safeNumber(event.target.value) })} type="number" className="border-2 border-[#9baec8] bg-white px-2 py-1" />
            </label>
            <label className="grid gap-1 text-xs font-black">
              Deaths
              <input value={boss.deaths} onChange={(event) => updateBoss(boss.id, { deaths: Math.max(0, Number(event.target.value) || 0) })} type="number" min="0" className="border-2 border-[#9baec8] bg-white px-2 py-1" />
            </label>
          </div>
          <textarea value={boss.notes} onChange={(event) => updateBoss(boss.id, { notes: event.target.value })} placeholder="Notes" className="mt-3 min-h-20 w-full border-2 border-[#9baec8] bg-white px-2 py-2 text-sm font-bold" />
        </article>
      ))}
    </section>
  );
}

function Graveyard({ run }: { run: NuzlockeRun }) {
  const deadPokemon = (run.team || []).filter((pokemon) => pokemon.status === 'Dead');

  return (
    <section className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
      <div className="mb-4 flex items-center gap-2 text-lg font-black"><Skull size={20} /> Graveyard</div>
      {deadPokemon.length === 0 ? <p className="text-sm font-bold text-[#506078]">No losses recorded. The notebook is mercifully quiet.</p> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {deadPokemon.map((pokemon) => (
          <article key={pokemon.id} className="border-4 border-[#182a40] bg-[#e9edf3] p-4">
            <div className="flex items-start gap-3">
              <MonsterToken species={pokemon.species} status="Dead" />
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
    <section className="border-4 border-[#182a40] bg-[#fffdf1] p-4 shadow-[6px_6px_0_rgba(24,42,64,0.18)]">
      <div className="mb-4 text-lg font-black">Timeline</div>
      <div className="grid gap-2">
        {(run.timeline || []).map((event) => (
          <div key={event.id} className="border-2 border-[#9baec8] bg-white p-3">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[#3f7fbf]">{event.type} / {event.createdAt}</div>
            <div className="mt-1 text-sm font-bold">{event.message}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
