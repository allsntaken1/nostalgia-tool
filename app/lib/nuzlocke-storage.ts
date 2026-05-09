import type {
  NuzlockeBoss,
  NuzlockeBossPrep,
  NuzlockeEncounter,
  NuzlockePokemon,
  NuzlockeRun,
  NuzlockeTimelineEvent,
} from '@/app/nuzlocke/types';
import { isNuzlockeSupabaseConfigured, nuzlockeSupabaseHeaders, nuzlockeSupabaseRequest } from '@/lib/nuzlocke/supabase/server';

type NuzlockeRunRow = {
  id: string;
  run_name: string;
  game_version: string;
  run_type: string;
  rules: unknown;
  run_data: NuzlockeRun;
  created_at: string;
  updated_at: string;
};

function runRow(run: NuzlockeRun) {
  return {
    id: run.id,
    run_name: run.runName,
    game_version: run.gameVersion,
    run_type: run.runType,
    rules: run.rules || {},
    run_data: run,
    created_at: run.createdAt,
    updated_at: run.updatedAt,
  };
}

function teamRow(runId: string, pokemon: NuzlockePokemon) {
  return {
    id: pokemon.id,
    run_id: runId,
    encounter_id: pokemon.encounterId || null,
    met_location: pokemon.metLocation || '',
    species: pokemon.species,
    nickname: pokemon.nickname,
    level: pokemon.level,
    types: pokemon.types || [],
    nature: pokemon.nature,
    ability: pokemon.ability,
    held_item: pokemon.heldItem,
    status: pokemon.status,
    notes: pokemon.notes,
    level_died: pokemon.levelDied || null,
    cause_of_death: pokemon.causeOfDeath || '',
    death_location: pokemon.deathLocation || '',
  };
}

function encounterRow(runId: string, encounter: NuzlockeEncounter) {
  return {
    id: encounter.id,
    run_id: runId,
    location: encounter.location,
    pokemon: encounter.pokemon,
    nickname: encounter.nickname,
    level_met: encounter.levelMet,
    status: encounter.status,
    types: encounter.types || [],
    nature: encounter.nature,
    ability: encounter.ability,
    notes: encounter.notes,
  };
}

function deathRow(runId: string, pokemon: NuzlockePokemon) {
  return {
    id: `${runId}-${pokemon.id}`,
    run_id: runId,
    pokemon_id: pokemon.id,
    species: pokemon.species,
    nickname: pokemon.nickname,
    level_died: pokemon.levelDied || pokemon.level,
    cause_of_death: pokemon.causeOfDeath || '',
    death_location: pokemon.deathLocation || '',
    notes: pokemon.notes || '',
  };
}

function bossProgressRow(runId: string, boss: NuzlockeBoss) {
  return {
    id: `${runId}-${boss.id}`,
    run_id: runId,
    boss_id: boss.id,
    completed: boss.completed,
    deaths: boss.deaths,
    notes: boss.notes,
  };
}

function bossPrepRow(runId: string, prep: NuzlockeBossPrep) {
  return {
    id: `${runId}-${prep.bossId}`,
    run_id: runId,
    boss_id: prep.bossId,
    lead_pokemon_id: prep.leadPokemonId || '',
    planned_team_ids: prep.plannedTeamIds || [],
    held_items: prep.heldItems || {},
    planned_moves: prep.plannedMoves || {},
    move_prep_notes: prep.movePrepNotes || '',
    battle_plan_notes: prep.battlePlanNotes || '',
    post_fight_notes: prep.postFightNotes || '',
    completed: prep.completed,
  };
}

function timelineRow(runId: string, event: NuzlockeTimelineEvent) {
  return {
    id: event.id,
    run_id: runId,
    created_at: event.createdAt,
    event_type: event.type,
    message: event.message,
  };
}

async function replaceChildRows(table: string, runId: string, rows: unknown[]) {
  await nuzlockeSupabaseRequest(`/rest/v1/${table}?run_id=eq.${encodeURIComponent(runId)}`, {
    method: 'DELETE',
    headers: nuzlockeSupabaseHeaders(),
  });

  if (rows.length === 0) return;

  await nuzlockeSupabaseRequest(`/rest/v1/${table}`, {
    method: 'POST',
    headers: nuzlockeSupabaseHeaders('resolution=merge-duplicates'),
    body: JSON.stringify(rows),
  });
}

export function isNuzlockeDatabaseConfigured() {
  return isNuzlockeSupabaseConfigured();
}

export async function listNuzlockeRuns() {
  if (!isNuzlockeSupabaseConfigured()) return [];

  const rows = await nuzlockeSupabaseRequest<NuzlockeRunRow[]>(
    '/rest/v1/nuzlocke_runs?select=*&order=updated_at.desc',
    { headers: nuzlockeSupabaseHeaders() }
  );

  return rows.map((row) => row.run_data).filter(Boolean);
}

export async function saveNuzlockeRuns(runs: NuzlockeRun[]) {
  if (!isNuzlockeSupabaseConfigured()) return { configured: false, saved: 0 };

  await nuzlockeSupabaseRequest('/rest/v1/nuzlocke_runs', {
    method: 'POST',
    headers: nuzlockeSupabaseHeaders('resolution=merge-duplicates'),
    body: JSON.stringify(runs.map(runRow)),
  });

  const incomingIds = new Set(runs.map((run) => run.id));
  const existingRows = await nuzlockeSupabaseRequest<{ id: string }[]>('/rest/v1/nuzlocke_runs?select=id', {
    headers: nuzlockeSupabaseHeaders(),
  });
  const staleIds = existingRows.map((row) => row.id).filter((id) => !incomingIds.has(id));

  await Promise.all(staleIds.map((id) => nuzlockeSupabaseRequest(`/rest/v1/nuzlocke_runs?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: nuzlockeSupabaseHeaders(),
  })));

  for (const run of runs) {
    await replaceChildRows('nuzlocke_team_members', run.id, (run.team || []).map((pokemon) => teamRow(run.id, pokemon)));
    await replaceChildRows('nuzlocke_encounters', run.id, (run.encounters || []).map((encounter) => encounterRow(run.id, encounter)));
    await replaceChildRows('nuzlocke_deaths', run.id, (run.team || []).filter((pokemon) => pokemon.status === 'Dead').map((pokemon) => deathRow(run.id, pokemon)));
    await replaceChildRows('nuzlocke_boss_progress', run.id, (run.bosses || []).map((boss) => bossProgressRow(run.id, boss)));
    await replaceChildRows('nuzlocke_boss_prep', run.id, (run.bossPrep || []).map((prep) => bossPrepRow(run.id, prep)));
    await replaceChildRows('nuzlocke_timeline_events', run.id, (run.timeline || []).map((event) => timelineRow(run.id, event)));
  }

  return { configured: true, saved: runs.length };
}
