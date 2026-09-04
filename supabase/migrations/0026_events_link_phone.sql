-- Optional link and phone fields for events, matching contact_email which
-- already existed on this table but was never exposed in the Post an Event
-- form until now.
alter table public.events add column if not exists link text;
alter table public.events add column if not exists phone text;
