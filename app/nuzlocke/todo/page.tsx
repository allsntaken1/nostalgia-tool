'use client';

import { useMemo, useRef, useState } from 'react';
import {
  TODO_GAME_GROUPS,
  type TodoEntityType,
  type TodoItem,
  type TodoStatus,
  todoRegistry,
} from '@/lib/nuzlocke/data/todo-registry';

const STORAGE_KEY = 'nuzlocke-todo-data-patches-v1';
const SCHEMA_VERSION = 1;

type PatchRecord = {
  todoId: string;
  proposedValue: string;
  notes: string;
  updatedAt: string;
};

type ExportedPatch = {
  todoId: string;
  generation: number;
  gameId: string;
  gameLabel: string;
  filePath: string;
  entityType: TodoEntityType;
  entityId: string;
  entityLabel: string;
  fieldPath: string;
  oldValue: unknown;
  proposedValue: string;
  status: 'saved_locally';
  notes: string;
};

type ExportPayload = {
  schemaVersion: number;
  exportedAt: string;
  source: string;
  patches: ExportedPatch[];
};

type FilterStatus = TodoStatus | 'all' | 'locally_filled';

const STATUS_LABEL: Record<TodoStatus, string> = {
  missing: 'Missing',
  needs_verification: 'Needs Verification',
  incomplete: 'Incomplete',
};

const STATUS_COLOR: Record<TodoStatus, string> = {
  missing: 'bg-[#ef5350] text-white',
  needs_verification: 'bg-[#ffa726] text-[#182a40]',
  incomplete: 'bg-[#42a5f5] text-white',
};

const ENTITY_TYPES: { value: TodoEntityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'boss', label: 'Boss' },
  { value: 'encounter', label: 'Encounter' },
  { value: 'pokemon', label: 'Pokémon' },
  { value: 'route', label: 'Route' },
  { value: 'metadata', label: 'Metadata' },
  { value: 'sprite', label: 'Sprite' },
  { value: 'move', label: 'Move' },
  { value: 'other', label: 'Other' },
];

const STATUSES: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'missing', label: 'Missing' },
  { value: 'needs_verification', label: 'Needs verification' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'locally_filled', label: 'Locally filled' },
];

function loadPatches(): Record<string, PatchRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, PatchRecord> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue;
      const candidate = value as Partial<PatchRecord>;
      if (typeof candidate.todoId !== 'string') continue;
      out[key] = {
        todoId: candidate.todoId,
        proposedValue: typeof candidate.proposedValue === 'string' ? candidate.proposedValue : '',
        notes: typeof candidate.notes === 'string' ? candidate.notes : '',
        updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
      };
    }
    return out;
  } catch {
    return {};
  }
}

function savePatches(patches: Record<string, PatchRecord>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patches));
  } catch {
    // ignore quota / sandboxed contexts
  }
}

function downloadJson(payload: ExportPayload) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nuzlocke-todo-patches-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function NuzlockeTodoAdminPage() {
  // Lazy initializer reads localStorage once during the first client render so we
  // never set state inside an effect (which would cascade renders / trigger lint).
  const [patches, setPatches] = useState<Record<string, PatchRecord>>(() => loadPatches());
  const [search, setSearch] = useState('');
  const [generationFilter, setGenerationFilter] = useState<number | 'all'>('all');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<TodoEntityType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [importMessage, setImportMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generations = useMemo(() => {
    const seen = new Set<number>();
    for (const t of todoRegistry) seen.add(t.generation);
    return Array.from(seen).sort((a, b) => a - b);
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return todoRegistry.filter((item) => {
      if (generationFilter !== 'all' && item.generation !== generationFilter) return false;
      if (gameFilter !== 'all' && item.gameId !== gameFilter) return false;
      if (typeFilter !== 'all' && item.entityType !== typeFilter) return false;
      if (statusFilter === 'locally_filled') {
        if (!patches[item.id]?.proposedValue?.trim()) return false;
      } else if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!query) return true;
      const haystack = [
        item.entityLabel,
        item.entityId,
        item.fieldPath,
        item.gameLabel,
        item.filePath,
        item.instructions,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [search, generationFilter, gameFilter, typeFilter, statusFilter, patches]);

  const itemsByGroupKey = useMemo(() => {
    const map = new Map<string, TodoItem[]>();
    for (const item of filteredItems) {
      const key = `${item.generation}::${item.gameId}`;
      const bucket = map.get(key) ?? [];
      bucket.push(item);
      map.set(key, bucket);
    }
    return map;
  }, [filteredItems]);

  const totalCount = todoRegistry.length;
  const filledCount = useMemo(
    () => Object.values(patches).filter((p) => p.proposedValue?.trim()).length,
    [patches],
  );

  const updatePatch = (todoId: string, field: 'proposedValue' | 'notes', value: string) => {
    setPatches((current) => {
      const existing = current[todoId] ?? {
        todoId,
        proposedValue: '',
        notes: '',
        updatedAt: new Date().toISOString(),
      };
      const next = { ...current, [todoId]: { ...existing, [field]: value, updatedAt: new Date().toISOString() } };
      savePatches(next);
      return next;
    });
  };

  const clearPatch = (todoId: string) => {
    setPatches((current) => {
      const next = { ...current };
      delete next[todoId];
      savePatches(next);
      return next;
    });
  };

  const handleExport = () => {
    const exportedPatches: ExportedPatch[] = todoRegistry
      .filter((item) => patches[item.id]?.proposedValue?.trim())
      .map((item) => ({
        todoId: item.id,
        generation: item.generation,
        gameId: item.gameId,
        gameLabel: item.gameLabel,
        filePath: item.filePath,
        entityType: item.entityType,
        entityId: item.entityId,
        entityLabel: item.entityLabel,
        fieldPath: item.fieldPath,
        oldValue: item.currentValue,
        proposedValue: patches[item.id]?.proposedValue ?? '',
        status: 'saved_locally',
        notes: patches[item.id]?.notes ?? '',
      }));

    const payload: ExportPayload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      source: 'RepeatChannel Nuzlocke TODO Admin',
      patches: exportedPatches,
    };
    downloadJson(payload);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.patches)) {
        throw new Error('Missing or invalid patches array.');
      }
      if (parsed.schemaVersion !== SCHEMA_VERSION) {
        throw new Error(`Unsupported schema version (expected ${SCHEMA_VERSION}).`);
      }
      const merged: Record<string, PatchRecord> = { ...patches };
      let added = 0;
      for (const raw of parsed.patches as unknown[]) {
        if (!raw || typeof raw !== 'object') continue;
        const p = raw as Partial<ExportedPatch>;
        if (typeof p.todoId !== 'string' || typeof p.proposedValue !== 'string') continue;
        merged[p.todoId] = {
          todoId: p.todoId,
          proposedValue: p.proposedValue,
          notes: typeof p.notes === 'string' ? p.notes : '',
          updatedAt: new Date().toISOString(),
        };
        added += 1;
      }
      setPatches(merged);
      savePatches(merged);
      setImportMessage(`Imported ${added} patch${added === 1 ? '' : 'es'}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed.';
      setImportMessage(`Import failed: ${message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleGroup = (key: string) => {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  };

  const gameOptionsForGeneration = useMemo(() => {
    if (generationFilter === 'all') return TODO_GAME_GROUPS;
    return TODO_GAME_GROUPS.filter((g) => g.generation === generationFilter);
  }, [generationFilter]);

  const groupedRender: { generation: number; games: { gameId: string; gameLabel: string; items: TodoItem[] }[] }[] =
    useMemo(() => {
      const out: { generation: number; games: { gameId: string; gameLabel: string; items: TodoItem[] }[] }[] = [];
      for (const gen of generations) {
        if (generationFilter !== 'all' && gen !== generationFilter) continue;
        const games: { gameId: string; gameLabel: string; items: TodoItem[] }[] = [];
        for (const group of TODO_GAME_GROUPS) {
          if (group.generation !== gen) continue;
          if (gameFilter !== 'all' && group.gameId !== gameFilter) continue;
          const items = itemsByGroupKey.get(`${gen}::${group.gameId}`) ?? [];
          if (items.length === 0) continue;
          games.push({ gameId: group.gameId, gameLabel: group.gameLabel, items });
        }
        if (games.length > 0) out.push({ generation: gen, games });
      }
      return out;
    }, [generations, generationFilter, gameFilter, itemsByGroupKey]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-[#182a40]">
      <header className="mb-6">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#506078]">RepeatChannel Tool / Internal Admin</div>
        <h1 className="text-2xl font-black sm:text-3xl">Nuzlocke Data TODOs</h1>
        <p className="mt-1 max-w-2xl text-sm font-bold text-[#506078]">
          Track and fill missing boss, encounter, move, sprite, and metadata fields. Saved entries are stored locally in this
          browser. Export your TODO fixes and send/apply the JSON patch to update the source data.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-black">
          <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">{totalCount} TODO{totalCount === 1 ? '' : 's'} registered</span>
          <span className="rounded-full bg-[#a5d6a7] px-3 py-1.5 shadow-sm">{filledCount} locally filled</span>
        </div>
      </header>

      <section className="mb-5 rounded-2xl bg-white/70 p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#506078]">
            Search
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Boss / route / file…"
              className="rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#506078]">
            Generation
            <select
              value={generationFilter === 'all' ? 'all' : String(generationFilter)}
              onChange={(event) => {
                const value = event.target.value;
                setGenerationFilter(value === 'all' ? 'all' : Number(value));
                setGameFilter('all');
              }}
              className="rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
            >
              <option value="all">All generations</option>
              {generations.map((gen) => (
                <option key={gen} value={gen}>
                  Generation {gen || '0 (Shared)'}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#506078]">
            Game
            <select
              value={gameFilter}
              onChange={(event) => setGameFilter(event.target.value)}
              className="rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
            >
              <option value="all">All games</option>
              {gameOptionsForGeneration.map((group) => (
                <option key={group.gameId} value={group.gameId}>
                  {group.gameLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#506078]">
            Type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TodoEntityType | 'all')}
              className="rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
            >
              {ENTITY_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#506078]">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
              className="rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
            >
              {STATUSES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-black">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg bg-[#182a40] px-3 py-2 text-white shadow-sm hover:-translate-y-0.5"
            >
              Export TODO Fixes
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="rounded-lg bg-white px-3 py-2 text-[#182a40] shadow-sm hover:-translate-y-0.5"
            >
              Import Patches
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
            <span className="self-center text-[11px] font-bold text-[#506078]">{importMessage}</span>
          </div>
          <span className="text-[11px] font-bold text-[#506078]">
            Showing {filteredItems.length} of {totalCount}
          </span>
        </div>
      </section>

      {groupedRender.length === 0 ? (
        <div className="rounded-2xl bg-white/70 p-6 text-center text-sm font-bold text-[#506078] shadow-sm">
          No TODOs match the current filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groupedRender.map(({ generation, games }) => (
            <section key={generation} className="rounded-2xl bg-white/65 p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#506078]">
                Generation {generation || '0 (Shared)'}
              </h2>
              <div className="flex flex-col gap-3">
                {games.map(({ gameId, gameLabel, items }) => {
                  const key = `${generation}::${gameId}`;
                  const isOpen = openGroups[key] ?? false;
                  return (
                    <div key={key} className="rounded-xl bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleGroup(key)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left"
                      >
                        <span className="text-base font-black text-[#182a40]">{gameLabel}</span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-full bg-[#182a40] px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white">
                            {items.length} TODO{items.length === 1 ? '' : 's'}
                          </span>
                          <span className="text-xs font-black text-[#506078]">{isOpen ? '▾' : '▸'}</span>
                        </span>
                      </button>
                      {isOpen ? (
                        <div className="flex flex-col gap-3 border-t border-[#e5e9f0] px-4 pb-4 pt-3">
                          {items.map((item) => (
                            <TodoRow
                              key={item.id}
                              item={item}
                              patch={patches[item.id]}
                              onChangeValue={(v) => updatePatch(item.id, 'proposedValue', v)}
                              onChangeNotes={(v) => updatePatch(item.id, 'notes', v)}
                              onClear={() => clearPatch(item.id)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function TodoRow({
  item,
  patch,
  onChangeValue,
  onChangeNotes,
  onClear,
}: {
  item: TodoItem;
  patch?: PatchRecord;
  onChangeValue: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onClear: () => void;
}) {
  const hasValue = Boolean(patch?.proposedValue?.trim());
  return (
    <div className="rounded-lg border border-[#e5e9f0] bg-[#f8f9fc] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-[#182a40]">{item.entityLabel}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ${STATUS_COLOR[item.status]}`}>
              {STATUS_LABEL[item.status]}
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#506078] shadow-sm">
              {item.entityType}
            </span>
            {hasValue ? (
              <span className="rounded-full bg-[#a5d6a7] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#1b3a1b]">
                Saved locally
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[11px] font-bold text-[#506078]">
            <span className="block">{item.instructions}</span>
            <span className="mt-0.5 block text-[10px] text-[#7a8499]">
              {item.filePath} → <code className="font-mono">{item.fieldPath}</code>
            </span>
            {item.sourceNote ? <span className="mt-0.5 block text-[10px] italic text-[#7a8499]">{item.sourceNote}</span> : null}
          </div>
        </div>
      </div>
      <div className="mt-2 grid gap-2">
        <textarea
          value={patch?.proposedValue ?? ''}
          onChange={(event) => onChangeValue(event.target.value)}
          placeholder="Proposed value (text, JSON, or move list — whatever fits the field)…"
          rows={3}
          className="w-full rounded-lg bg-white px-2 py-2 text-xs font-mono text-[#182a40] shadow-sm"
        />
        <input
          type="text"
          value={patch?.notes ?? ''}
          onChange={(event) => onChangeNotes(event.target.value)}
          placeholder="Optional notes / source citation"
          className="w-full rounded-lg bg-white px-2 py-2 text-xs font-bold text-[#182a40] shadow-sm"
        />
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#506078]">
          <span>{hasValue ? `Last saved ${new Date(patch?.updatedAt ?? '').toLocaleString()}` : 'Not yet filled in this browser.'}</span>
          <button
            type="button"
            onClick={onClear}
            disabled={!hasValue}
            className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-black text-[#182a40] shadow-sm disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
