-- Search path
alter function public.contains_banned_word(text) set search_path = public;
alter function public.events_block_banned_words() set search_path = public;
alter function public.business_profiles_block_banned_words() set search_path = public;
