// Import Supabase
import { createClient } from "@supabase/supabase-js";

// Get connection settings, normalizing away accidental duplicated/missing
// "https://" prefixes (an easy mistake when pasting a URL into a field
// that already has one, or leaving the protocol off entirely).
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

if (!import.meta.env.VITE_SUPABASE_URL || !(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  // Falling back to a placeholder project instead of throwing keeps builds without
  // secrets (e.g. CI) from crashing, but every request will fail with a generic
  // "Failed to fetch" unless this is fixed. Restart the dev server after setting
  // .env.local, or provide these as build-time env vars in CI/hosting.
  console.error(
    "[supabase] VITE_SUPABASE_URL and/or a Supabase key are missing. " +
      "Using a placeholder project, so all Supabase requests will fail. " +
      "If you just added/changed .env.local, fully restart `npm run dev` " +
      "(env vars are only read at server startup)."
  );
}

// Connect to Supabase using fallback values so the app can render locally
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: "pkce",
  },
});