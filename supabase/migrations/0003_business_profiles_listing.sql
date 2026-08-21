-- Business profiles are private by default; owners opt in to appear
-- in the public Resource Directory via is_listed.
alter table public.business_profiles
  add column if not exists is_listed boolean not null default false;

-- Replace the old "everyone can see everything" policy: now you can see
-- your own profile regardless of listing status, and other people's
-- profiles only if they've opted in to be listed.
drop policy if exists "Business profiles are viewable by authenticated users" on public.business_profiles;
drop policy if exists "Business profiles are viewable if listed or own" on public.business_profiles;

create policy "Business profiles are viewable if listed or own"
  on public.business_profiles for select
  to authenticated
  using (is_listed = true or auth.uid() = user_id);
