-- Optional link/phone/email fields for curated events, matching the same
-- fields already added to `events` (self-submitted).
alter table public.curated_events add column if not exists link text;
alter table public.curated_events add column if not exists phone text;
alter table public.curated_events add column if not exists email text;
