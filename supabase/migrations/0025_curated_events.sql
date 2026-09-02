-- Curated/database-owned events imported from the team's events spreadsheet via
-- an Apps Script — distinct from `events`, which is self-submitted by users
-- through the "Post an Event" form. Publicly readable by everyone but not
-- editable through the app; the import script writes here using the
-- service_role key, which bypasses RLS, so no insert/update/delete policy
-- is needed (same pattern as curated_resources).
create table if not exists public.curated_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  date timestamptz not null,
  categories text[] not null default '{}',
  waste_types text[] not null default '{}',
  location text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.curated_events enable row level security;

drop policy if exists "Curated events are viewable by everyone" on public.curated_events;
create policy "Curated events are viewable by everyone"
  on public.curated_events
  for select
  to anon, authenticated
  using (true);

create index if not exists curated_events_date_idx on public.curated_events (date);
