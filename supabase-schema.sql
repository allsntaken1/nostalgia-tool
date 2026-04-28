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

-- Create a public Supabase Storage bucket named `nostalgia-uploads` in the dashboard.
-- The app uploads pending community images to `pending/<id>.<ext>` inside that bucket.
