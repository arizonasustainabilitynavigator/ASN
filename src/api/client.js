import { supabase } from "@/lib/supabase";
import { WASTE_TYPES } from "@/lib/constants";

// Local fallback for events until the `events` table migration
// (supabase/migrations/0004_events.sql) has been run against the project.
// Once that table exists, Supabase calls stop erroring and this is skipped.
const LOCAL_EVENTS_KEY = "asn_local_events";

const readLocalEvents = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EVENTS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeLocalEvents = (events) => {
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
};

// Only fall back to localStorage when the `events` table genuinely doesn't
// exist yet (migration not run). Any other error - RLS rejection, a trigger
// blocking profanity, a network issue - must propagate to the caller instead
// of being silently swallowed by writing to local storage anyway.
const isMissingTableError = (error) =>
  error?.code === "PGRST205" ||
  error?.code === "42P01" ||
  /schema cache|does not exist/i.test(error?.message || "");

const generateLocalId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const ensureLocalSampleEvents = () => {
  const existing = readLocalEvents();
  if (existing.length > 0) return existing;

  const sampleEvents = [
    {
      id: generateLocalId(),
      title: "Community Cleanup Day",
      organization: "Keep Phoenix Beautiful",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Downtown Phoenix",
      categories: ["cleanup"],
      waste_types: ["Recycling", "Chemicals"],
      description: "Join neighbors to clean up local parks and public spaces.",
      created_by: null,
    },
    {
      id: generateLocalId(),
      title: "Zero Waste Workshop",
      organization: "Tempe Public Library",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Tempe Library",
      categories: ["workshop"],
      waste_types: ["Food", "Recycling"],
      description: "Learn practical tips to reduce waste at home and work.",
      created_by: null,
    },
    {
      id: generateLocalId(),
      title: "Sustainability Networking Night",
      organization: "Scottsdale Innovation Hub",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Scottsdale Innovation Hub",
      categories: ["networking", "conference"],
      waste_types: [],
      description: "Connect with other sustainability-minded local businesses.",
      created_by: null,
    },
  ];
  writeLocalEvents(sampleEvents);
  return sampleEvents;
};

const api = {
  entities: {
    BusinessProfile: {
      list: async () => {
        const { data, error } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("is_listed", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      filter: async (query) => {
        let request = supabase.from("business_profiles").select("*");
        for (const [key, value] of Object.entries(query)) {
          request = request.eq(key, value);
        }
        const { data, error } = await request;
        if (error) throw error;
        return data;
      },
      update: async (id, data) => {
        const { data: updated, error } = await supabase
          .from("business_profiles")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return updated;
      },
      create: async (data) => {
        const { data: created, error } = await supabase
          .from("business_profiles")
          .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
          .select()
          .single();
        if (error) throw error;
        return created;
      },
    },
    CuratedResource: {
      // Database-owned resources imported from the team's research spreadsheet.
      // Server-side filtered/paginated since this table can hold thousands of rows.
      // Queries the curated_resources_grouped view, which collapses rows
      // that share the same resource name + link (the same statewide/
      // regional resource listed once per city in the source spreadsheet)
      // into a single row with a combined cities/counties array.
      list: async ({ category, categoryKeywords, wasteTypeKeywords, county, cities, search, limit = 60, offset = 0 } = {}) => {
        let request = supabase
          .from("curated_resources_grouped")
          .select("*", { count: "exact" })
          .order("resource_name", { ascending: true })
          .range(offset, offset + limit - 1);

        if (category) request = request.eq("category", category);
        if (categoryKeywords?.length) {
          const clause = categoryKeywords
            .map((kw) => `category.ilike.%${kw.replace(/[%,]/g, "")}%`)
            .join(",");
          request = request.or(clause);
        }
        if (wasteTypeKeywords?.length) {
          const clause = wasteTypeKeywords
            .map((kw) => `category.ilike.%${kw.replace(/[%,]/g, "")}%`)
            .join(",");
          request = request.or(clause);
        }
        if (county) request = request.contains("counties", [county]);
        if (cities?.length) request = request.overlaps("cities", cities);
        if (search) {
          const term = search.replace(/[%,]/g, "");
          const clauses = [
            `resource_name.ilike.%${term}%`,
            `city_text.ilike.%${term}%`,
            `county_text.ilike.%${term}%`,
          ];
          // Also match against the fixed tag vocabulary (e.g. typing
          // "climate" surfaces everything tagged Climate), since tags is
          // an array column PostgREST can't ILIKE directly - contains (cs)
          // needs the exact tag value, so match it against typed tags
          // whose name contains what was typed.
          const matchingTags = WASTE_TYPES.filter((tag) => tag.toLowerCase().includes(term.toLowerCase()));
          for (const tag of matchingTags) {
            clauses.push(`tags.cs.{${tag}}`);
          }
          request = request.or(clauses.join(","));
        }

        const { data, error, count } = await request;
        if (error) throw error;
        return { data, count: count ?? data.length };
      },
    },
    QuizResponse: {
      // Ties a completed sustainability quiz submission to the account
      // that took it, so the team can see what users need by browsing
      // this table directly in Supabase.
      create: async ({ userId, answers }) => {
        const { data, error } = await supabase
          .from("quiz_responses")
          .insert({ user_id: userId, answers })
          .select()
          .single();
        if (error) throw error;
        return data;
      },
    },
    Event: {
      list: async () => {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });
        if (error) {
          if (!isMissingTableError(error)) throw error;
          return [...ensureLocalSampleEvents()].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return data;
      },
      create: async (data) => {
        const { data: created, error } = await supabase
          .from("events")
          .insert(data)
          .select()
          .single();
        if (error) {
          if (!isMissingTableError(error)) throw error;
          const newEvent = { id: generateLocalId(), ...data, created_at: new Date().toISOString() };
          writeLocalEvents([...readLocalEvents(), newEvent]);
          return newEvent;
        }
        return created;
      },
      update: async (id, data) => {
        const { data: updated, error } = await supabase
          .from("events")
          .update(data)
          .eq("id", id)
          .select()
          .single();
        if (error) {
          if (!isMissingTableError(error)) throw error;
          const events = readLocalEvents();
          const updatedEvent = { ...events.find((e) => e.id === id), ...data, id };
          writeLocalEvents(events.map((e) => (e.id === id ? updatedEvent : e)));
          return updatedEvent;
        }
        return updated;
      },
      delete: async (id) => {
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) {
          if (!isMissingTableError(error)) throw error;
          writeLocalEvents(readLocalEvents().filter((e) => e.id !== id));
          return;
        }
      },
    },
    CuratedEvent: {
      // Database-owned events synced in from the team's events spreadsheet via
      // an Apps Script — read-only from the app, same as CuratedResource.
      list: async () => {
        const { data, error } = await supabase
          .from("curated_events")
          .select("*")
          .order("date", { ascending: true });
        if (error) {
          if (!isMissingTableError(error)) throw error;
          return [];
        }
        return data;
      },
    },
  },

  integrations: {
    Core: {
      UploadFile: async ({ file, userId }) => {
        if (!file) {
          throw new Error("No file provided.");
        }
        if (!userId) {
          throw new Error("You must be signed in to upload a file.");
        }
        if (!file.type || !file.type.startsWith("image/")) {
          throw new Error("Please upload an image file.");
        }
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("Image must be smaller than 5MB.");
        }

        const extension = file.name.split(".").pop() || "jpg";
        const path = `${userId}/logo-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("business-logos")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("business-logos").getPublicUrl(path);
        return { file_url: data.publicUrl };
      },
    },
  },
};

export { api };
