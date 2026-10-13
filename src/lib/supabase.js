import { createClient } from "@supabase/supabase-js";

// Connection settings
const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const dedupedSupabaseUrl = configuredSupabaseUrl?.replace(/^(?:https?:)+\/\//, "https://");
const normalizedSupabaseUrl = dedupedSupabaseUrl?.match(/^https?:\/\//)
  ? dedupedSupabaseUrl
  : dedupedSupabaseUrl
  ? `https://${dedupedSupabaseUrl}`
  : undefined;

const supabaseUrl = normalizedSupabaseUrl || "https://example.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "demo-key";

// Warn if credentials are missing (requests will fail, but this keeps the build from crashing)
if (!import.meta.env.VITE_SUPABASE_URL || !(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  console.error(
    "[supabase] VITE_SUPABASE_URL and/or a Supabase key are missing. " +
      "Using a placeholder project, so all Supabase requests will fail. " +
      "If you just added/changed .env.local, fully restart `npm run dev` " +
      "(env vars are only read at server startup)."
  );
}

// Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: "pkce",
  },
});