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
  client_id?: string;
  starter_choice?: string | null;
  rules: unknown;
  run_data: NuzlockeRun;
  created_at: string;
  updated_at: string;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

function runRow(clientId: string, run: NuzlockeRun) {
  return {
    id: run.id,
    client_id: clientId,
    run_name: run.runName,
    game_version: run.gameVersion,
    run_type: run.runType,
    starter_choice: run.starterChoice || null,
    rules: run.rules || {},
    run_data: run,
    created_at: run.createdAt,
    updated_at: run.updatedAt,
  };
}

function teamRow(clientId: string, runId: string, pokemon: NuzlockePokemon) {
  return {
    id: pokemon.id,
    client_id: clientId,
    run_id: runId,
    encounter_id: pokemon.encounterId || null,
    met_location: pokemon.metLocation || '',
    species: pokemon.species,
    nickname: pokemon.nickname,
    level: pokemon.level,
    types: Array.isArray(pokemon.types) ? pokemon.types : [],
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

function encounterRow(clientId: string, runId: string, encounter: NuzlockeEncounter) {
  return {
    id: encounter.id,
    client_id: clientId,
    run_id: runId,
    location: encounter.location,
    pokemon: encounter.pokemon,
    nickname: encounter.nickname,
    level_met: encounter.levelMet,
    status: encounter.status,
    types: Array.isArray(encounter.types) ? encounter.types : [],
    nature: encounter.nature,
    ability: encounter.ability,
    notes: encounter.notes,
  };
}

function deathRow(clientId: string, runId: string, pokemon: NuzlockePokemon) {
  return {
    id: `${runId}-${pokemon.id}`,
    client_id: clientId,
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

function bossProgressRow(clientId: string, runId: string, boss: NuzlockeBoss) {
  return {
    id: `${runId}-${boss.id}`,
    client_id: clientId,
    run_id: runId,
    boss_id: boss.id,
    completed: boss.completed,
    deaths: boss.deaths,
    notes: boss.notes,
  };
}

function bossPrepRow(clientId: string, runId: string, prep: NuzlockeBossPrep) {
  return {
    id: `${runId}-${prep.bossId}`,
    client_id: clientId,
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

function timelineRow(clientId: string, runId: string, event: NuzlockeTimelineEvent) {
  return {
    id: event.id,
    client_id: clientId,
    run_id: runId,
    created_at: event.createdAt,
    event_type: event.type,
    message: event.message,
  };
}

async function replaceChildRows(table: string, clientId: string, runId: string, rows: unknown[]) {
  await nuzlockeSupabaseRequest(`/rest/v1/${table}?client_id=eq.${encode(clientId)}&run_id=eq.${encode(runId)}`, {
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

export async function listNuzlockeRuns(clientId: string) {
  if (!isNuzlockeSupabaseConfigured() || !clientId) return [];

  const rows = await nuzlockeSupabaseRequest<NuzlockeRunRow[]>(
    `/rest/v1/nuzlocke_runs?client_id=eq.${encode(clientId)}&select=*&order=updated_at.desc`,
    { headers: nuzlockeSupabaseHeaders() }
  );

  return (Array.isArray(rows) ? rows : []).map((row) => row.run_data).filter(Boolean);
}

export async function saveNuzlockeRuns(clientId: string, runs: NuzlockeRun[]) {
  if (!isNuzlockeSupabaseConfigured()) return { configured: false, saved: 0 };
  if (!clientId) return { configured: true, saved: 0, error: 'Missing client_id.' };

  await nuzlockeSupabaseRequest('/rest/v1/nuzlocke_runs', {
    method: 'POST',
    headers: nuzlockeSupabaseHeaders('resolution=merge-duplicates'),
    body: JSON.stringify((Array.isArray(runs) ? runs : []).map((run) => runRow(clientId, run))),
  });

  const safeRuns = Array.isArray(runs) ? runs : [];
  const incomingIds = new Set(safeRuns.map((run) => run.id));
  const existingRows = await nuzlockeSupabaseRequest<{ id: string }[]>(`/rest/v1/nuzlocke_runs?client_id=eq.${encode(clientId)}&select=id`, {
    headers: nuzlockeSupabaseHeaders(),
  });
  const staleIds = (Array.isArray(existingRows) ? existingRows : []).map((row) => row.id).filter((id) => !incomingIds.has(id));

  await Promise.all(staleIds.map((id) => nuzlockeSupabaseRequest(`/rest/v1/nuzlocke_runs?client_id=eq.${encode(clientId)}&id=eq.${encode(id)}`, {
    method: 'DELETE',
    headers: nuzlockeSupabaseHeaders(),
  })));

  for (const run of safeRuns) {
    const team = Array.isArray(run.team) ? run.team : [];
    const encounters = Array.isArray(run.encounters) ? run.encounters : [];
    const bosses = Array.isArray(run.bosses) ? run.bosses : [];
    const bossPrep = Array.isArray(run.bossPrep) ? run.bossPrep : [];
    const timeline = Array.isArray(run.timeline) ? run.timeline : [];

    await replaceChildRows('nuzlocke_team_members', clientId, run.id, team.map((pokemon) => teamRow(clientId, run.id, pokemon)));
    await replaceChildRows('nuzlocke_encounters', clientId, run.id, encounters.map((encounter) => encounterRow(clientId, run.id, encounter)));
    await replaceChildRows('nuzlocke_deaths', clientId, run.id, team.filter((pokemon) => pokemon.status === 'Dead').map((pokemon) => deathRow(clientId, run.id, pokemon)));
    await replaceChildRows('nuzlocke_boss_progress', clientId, run.id, bosses.map((boss) => bossProgressRow(clientId, run.id, boss)));
    await replaceChildRows('nuzlocke_boss_prep', clientId, run.id, bossPrep.map((prep) => bossPrepRow(clientId, run.id, prep)));
    await replaceChildRows('nuzlocke_timeline_events', clientId, run.id, timeline.map((event) => timelineRow(clientId, run.id, event)));
  }

  return { configured: true, saved: safeRuns.length };
}
