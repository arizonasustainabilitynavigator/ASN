-- Storage bucket for business profile logos.
-- Files are stored as {user_id}/logo-{timestamp}.{ext}; bucket is public for read
-- (so <img src> works directly) but writes are restricted to each user's own folder.
insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true)
on conflict (id) do nothing;

drop policy if exists "Business logos are publicly readable" on storage.objects;
create policy "Business logos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'business-logos');

drop policy if exists "Users can upload their own business logo" on storage.objects;
create policy "Users can upload their own business logo"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own business logo" on storage.objects;
create policy "Users can update their own business logo"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own business logo" on storage.objects;
create policy "Users can delete their own business logo"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
