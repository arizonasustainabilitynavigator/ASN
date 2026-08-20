-- The new source spreadsheet (12 clean tabs) now gives every row its own
-- hand-picked Tags value, pushed by Apps Script directly into `tags`.
-- The trigger below previously ignored whatever was sent and always
-- overwrote `tags` with its own category/keyword guess, which would
-- clobber that real per-row data on every sync. Now it only computes a
-- fallback when the incoming write doesn't already supply tags, so rows
-- pushed from the sheet keep their real tags, and anything written
-- without tags (e.g. a manual insert) still gets the old best-effort guess.
create or replace function public.curated_resources_set_tags()
returns trigger
language plpgsql
as $$
declare
  base_tags text[];
  computed text[] := '{}';
  kw record;
begin
  if new.tags is not null and array_length(new.tags, 1) > 0 then
    return new;
  end if;

  select tags into base_tags
  from public.curated_resource_category_tags
  where category = new.category;

  if base_tags is not null then
    computed := base_tags;
  end if;

  for kw in select keyword, tag from public.curated_resource_tag_keywords loop
    if new.resource_name ilike ('%' || kw.keyword || '%') and not (kw.tag = any(computed)) then
      computed := computed || kw.tag;
    end if;
  end loop;

  new.tags := computed;
  return new;
end;
$$;
