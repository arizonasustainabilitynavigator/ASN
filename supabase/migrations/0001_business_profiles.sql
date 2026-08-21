-- One business profile per authenticated user, linked to auth.users.
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  description text,
  phone text,
  email text,
  website text,
  zip_code text,
  waste_types text[] not null default '{}',
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

-- Anyone signed in can browse the directory.
drop policy if exists "Business profiles are viewable by authenticated users" on public.business_profiles;
create policy "Business profiles are viewable by authenticated users"
  on public.business_profiles for select
  to authenticated
  using (true);

-- You can only create a profile that belongs to you.
drop policy if exists "Users can insert their own business profile" on public.business_profiles;
create policy "Users can insert their own business profile"
  on public.business_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

-- You can only edit your own profile.
drop policy if exists "Users can update their own business profile" on public.business_profiles;
create policy "Users can update their own business profile"
  on public.business_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- You can only delete your own profile.
drop policy if exists "Users can delete their own business profile" on public.business_profiles;
create policy "Users can delete their own business profile"
  on public.business_profiles for delete
  to authenticated
  using (auth.uid() = user_id);
