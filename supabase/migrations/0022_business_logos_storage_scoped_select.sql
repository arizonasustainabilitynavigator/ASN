-- Bucket
insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true)
on conflict (id) do nothing;

-- Read policy (scoped to own folder - was public/listable before)
drop policy if exists "Business logos are publicly readable" on storage.objects;
drop policy if exists "Users can read their own business logo" on storage.objects;
create policy "Users can read their own business logo"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Insert policy
drop policy if exists "Users can upload their own business logo" on storage.objects;
create policy "Users can upload their own business logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update policy
drop policy if exists "Users can update their own business logo" on storage.objects;
create policy "Users can update their own business logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete policy
drop policy if exists "Users can delete their own business logo" on storage.objects;
create policy "Users can delete their own business logo"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
