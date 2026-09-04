-- Free-text time field for curated events, matching the `time` column that
-- already exists on `events` (self-submitted) and is already displayed by
-- the app when present.
alter table public.curated_events add column if not exists time text;
