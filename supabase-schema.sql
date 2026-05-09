create table if not exists public.archive_items (
  id text primary key,
  title text not null,
  image_url text not null,
  thumb_url text not null,
  source text not null default 'Unknown source',
  source_url text not null default '',
  original_query text not null default '',
  decade text not null default 'Not Sure',
  category text not null default 'Unsorted',
  sub_tags text[] not null default '{}',
  extra_tags text[] not null default '{}',
  saved_at text not null
);

create table if not exists public.submissions (
  id text primary key,
  title text not null,
  image_url text not null,
  thumb_url text not null,
  source text not null default 'Community upload',
  source_url text not null default '',
  original_query text not null default 'Community upload',
  decade text not null default 'Not Sure',
  category text not null default 'Unsorted',
  sub_tags text[] not null default '{}',
  extra_tags text[] not null default '{}',
  submitted_at text not null,
  status text not null default 'pending'
);

create index if not exists archive_items_saved_at_idx on public.archive_items (saved_at desc);
create index if not exists submissions_submitted_at_idx on public.submissions (submitted_at desc);
create index if not exists submissions_status_idx on public.submissions (status);

create table if not exists public.archive_volume (
  id text primary key references public.archive_items(id) on delete cascade,
  volume_up integer not null default 0,
  volume_down integer not null default 0
);

create index if not exists archive_volume_score_idx on public.archive_volume ((volume_up - volume_down) desc);

-- Create a public Supabase Storage bucket named `nostalgia-uploads` in the dashboard.
-- The app uploads pending community images to `pending/<id>.<ext>` inside that bucket.

create table if not exists public.nuzlocke_runs (
  id text primary key,
  client_id text not null default '',
  run_name text not null,
  game_version text not null,
  run_type text not null,
  starter_choice text,
  constraint nuzlocke_runs_starter_choice_check check (
    starter_choice is null
    or starter_choice in ('grass', 'fire', 'water')
  ),
  rules jsonb not null default '{}',
  run_data jsonb not null default '{}',
  created_at text not null,
  updated_at text not null
);

create table if not exists public.nuzlocke_team_members (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  encounter_id text,
  met_location text not null default '',
  species text not null,
  nickname text not null default '',
  level integer not null default 1,
  types text[] not null default '{}',
  nature text not null default '',
  ability text not null default '',
  held_item text not null default 'None',
  status text not null default 'Party',
  notes text not null default '',
  level_died integer,
  cause_of_death text not null default '',
  death_location text not null default ''
);

create table if not exists public.nuzlocke_encounters (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  location text not null,
  pokemon text not null default '',
  nickname text not null default '',
  level_met integer not null default 1,
  status text not null default 'Caught',
  types text[] not null default '{}',
  nature text not null default '',
  ability text not null default '',
  notes text not null default ''
);

create table if not exists public.nuzlocke_deaths (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  pokemon_id text not null,
  species text not null,
  nickname text not null default '',
  level_died integer not null default 1,
  cause_of_death text not null default '',
  death_location text not null default '',
  notes text not null default ''
);

create table if not exists public.nuzlocke_boss_progress (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  boss_id text not null,
  completed boolean not null default false,
  deaths integer not null default 0,
  notes text not null default ''
);

create table if not exists public.nuzlocke_boss_prep (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  boss_id text not null,
  lead_pokemon_id text not null default '',
  planned_team_ids text[] not null default '{}',
  held_items jsonb not null default '{}',
  planned_moves jsonb not null default '{}',
  move_prep_notes text not null default '',
  battle_plan_notes text not null default '',
  post_fight_notes text not null default '',
  completed boolean not null default false
);

create table if not exists public.nuzlocke_timeline_events (
  id text primary key,
  client_id text not null default '',
  run_id text not null references public.nuzlocke_runs(id) on delete cascade,
  created_at text not null,
  event_type text not null,
  message text not null
);

alter table if exists public.nuzlocke_runs add column if not exists client_id text;
alter table if exists public.nuzlocke_runs add column if not exists starter_choice text;
alter table if exists public.nuzlocke_team_members add column if not exists client_id text not null default '';
alter table if exists public.nuzlocke_encounters add column if not exists client_id text not null default '';
alter table if exists public.nuzlocke_deaths add column if not exists client_id text not null default '';
alter table if exists public.nuzlocke_boss_progress add column if not exists client_id text not null default '';
alter table if exists public.nuzlocke_boss_prep add column if not exists client_id text not null default '';
alter table if exists public.nuzlocke_timeline_events add column if not exists client_id text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'nuzlocke_runs_starter_choice_check'
      and conrelid = 'public.nuzlocke_runs'::regclass
  ) then
    alter table public.nuzlocke_runs
      add constraint nuzlocke_runs_starter_choice_check
      check (
        starter_choice is null
        or starter_choice in ('grass', 'fire', 'water')
      ) not valid;
  end if;
end $$;

create index if not exists idx_nuzlocke_runs_client_id on public.nuzlocke_runs (client_id);
create index if not exists nuzlocke_runs_client_updated_idx on public.nuzlocke_runs (client_id, updated_at desc);
create index if not exists nuzlocke_runs_updated_at_idx on public.nuzlocke_runs (updated_at desc);
create index if not exists nuzlocke_team_members_client_run_idx on public.nuzlocke_team_members (client_id, run_id);
create index if not exists nuzlocke_encounters_client_run_idx on public.nuzlocke_encounters (client_id, run_id);
create index if not exists nuzlocke_deaths_client_run_idx on public.nuzlocke_deaths (client_id, run_id);
create index if not exists nuzlocke_boss_progress_client_run_idx on public.nuzlocke_boss_progress (client_id, run_id);
create index if not exists nuzlocke_boss_prep_client_run_idx on public.nuzlocke_boss_prep (client_id, run_id);
create index if not exists nuzlocke_timeline_events_client_run_idx on public.nuzlocke_timeline_events (client_id, run_id);
create index if not exists nuzlocke_team_members_run_id_idx on public.nuzlocke_team_members (run_id);
create index if not exists nuzlocke_encounters_run_id_idx on public.nuzlocke_encounters (run_id);
create index if not exists nuzlocke_deaths_run_id_idx on public.nuzlocke_deaths (run_id);
create index if not exists nuzlocke_boss_progress_run_id_idx on public.nuzlocke_boss_progress (run_id);
create index if not exists nuzlocke_boss_prep_run_id_idx on public.nuzlocke_boss_prep (run_id);
create index if not exists nuzlocke_timeline_events_run_id_idx on public.nuzlocke_timeline_events (run_id);

create table if not exists public.pokemon_species_cache (
  slug text primary key,
  data jsonb not null,
  updated_at text not null
);

create table if not exists public.pokemon_move_cache (
  slug text primary key,
  data jsonb not null,
  updated_at text not null
);

create table if not exists public.pokemon_ability_cache (
  slug text primary key,
  data jsonb not null,
  updated_at text not null
);
