-- Tags are now hand-picked per row in the source Google Sheet and pushed
-- directly by Apps Script — there's no longer any need for Supabase to
-- guess tags from category/keyword matching. Removing the trigger and its
-- two lookup tables so `tags` is just stored as-is on every write.
drop trigger if exists curated_resources_tags_trigger on public.curated_resources;
drop function if exists public.curated_resources_set_tags();
drop table if exists public.curated_resource_category_tags;
drop table if exists public.curated_resource_tag_keywords;
