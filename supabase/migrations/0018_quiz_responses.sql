-- Table
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_responses enable row level security;

-- Insert policy
drop policy if exists "Users can insert their own quiz responses" on public.quiz_responses;
create policy "Users can insert their own quiz responses"
  on public.quiz_responses for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Select policy
drop policy if exists "Users can view their own quiz responses" on public.quiz_responses;
create policy "Users can view their own quiz responses"
  on public.quiz_responses for select
  to authenticated
  using (auth.uid() = user_id);

-- Index
create index if not exists quiz_responses_user_id_idx on public.quiz_responses (user_id);
