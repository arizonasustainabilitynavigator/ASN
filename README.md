# Arizona Sustainability Navigator (ASN)

ASN is a web app built to help Arizonans actually find the sustainability resources that exist around them — recycling and waste programs, utility rebates, and local sustainability events — without having to dig through a dozen different city and utility websites to find them. You search your zip code, and it shows you what's nearby, closest first.

It's a Collaboration for Good Initiative.

## What it's built with

We kept the stack pretty simple on purpose:

- **React 19 + Vite** for the frontend, with Tailwind CSS v4 for styling and React Router for pages
- **Supabase** as the backend — it handles our Postgres database, authentication, and file storage (business logos), so we didn't have to stand up our own server
- **Google sign-in**, alongside regular email/password, through Supabase Auth
- **Resend**, wired up as Supabase's SMTP provider, for the confirmation/reset emails so they actually land in people's inboxes instead of getting rate-limited or stuck in spam
- **[`zipcodes`](https://www.npmjs.com/package/zipcodes)**, a small npm package that does the distance math for the "find resources near me" search
- **GitHub Pages**, deployed automatically through GitHub Actions whenever we push to `main`

## What it does

- Search by zip code with a set radius, and results sort by how close they actually are
- A public "Resource Vault" directory of businesses/programs — owners choose whether to be listed, it's not automatic
- Business profiles can be a physical location (with an address) or an online/virtual service
- A community events calendar anyone signed in can post to
- A profanity/slur filter on anything public-facing (business names, taglines, descriptions, event details), enforced in the database itself so it can't be bypassed by going around the frontend

Coming soon: a static/curated resource list — official programs and services we maintain directly, alongside the business-submitted directory. Structure/schema still being worked out.

## How the code is laid out

```
src/
  api/client.js          talks to Supabase (business profiles, events)
  lib/AuthContext.jsx     handles login state, Google sign-in, sessions
  lib/supabase.js         where the Supabase client gets created
  pages/                  the actual pages (Home, Resource, Events, Profile, Login, etc.)
  components/             shared UI pieces used across pages
supabase/migrations/      SQL files that build the database, run in order
```

## Setting this up yourself

If you're trying to get a copy of this running as the next team — here's the whole process.

### 1. Grab the code

```bash
git clone <this-repo-url>
cd ASN
npm install
```

### 2. Spin up a Supabase project

Head to [supabase.com](https://supabase.com) and create a new project. Once it's ready, grab your **Project URL** and **anon/publishable key** from Project Settings → API — you'll need both in a minute.

### 3. Build the database

Open the Supabase SQL Editor and run each file in `supabase/migrations/`, **in order**, from 0001 up through 0007. They're written so you can safely re-run any of them if something goes wrong.

| File                                  | What it does                                     |
| ------------------------------------- | ------------------------------------------------ |
| `0001_business_profiles.sql`          | Creates the main `business_profiles` table       |
| `0002_business_logos_storage.sql`     | Sets up storage for business logo uploads        |
| `0003_business_profiles_listing.sql`  | Adds the "list me publicly" opt-in flag          |
| `0004_events.sql`                     | Creates the `events` table for the calendar      |
| `0005_content_filter.sql`             | Adds the profanity/slur filter                   |
| `0006_business_profiles_location.sql` | Adds physical vs. online location, address, city |
| `0007_business_profiles_tagline.sql`  | Adds a short tagline field to business cards     |

### 4. Turn on Google sign-in

1. Over in [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 Client ID (Web application type).
2. Supabase needs to be listed as an authorized redirect — you'll find that exact callback URL under **Authentication → Providers → Google** in your Supabase dashboard (it looks like `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Back in Supabase, enable the Google provider and paste in the Client ID and Client Secret Google gave you.
4. Also add your app's URLs (like `http://localhost:5173`, plus wherever it's deployed) under **Authentication → URL Configuration**, or the redirect will get rejected.

### 5. Hook up Resend for emails

1. Make an account at [resend.com](https://resend.com) and verify a sending domain (their test domain works fine while you're developing).
2. Grab an API key from Resend.
3. In Supabase, go to **Project Settings → Authentication → SMTP Settings**, turn on custom SMTP, and fill in:
   - Host: `smtp.resend.com`
   - Port: `465` (or `587`)
   - Username: `resend`
   - Password: your Resend API key
   - Sender email: something on your verified domain

Once that's set, all the auth emails — confirmations, password resets — go out through Resend instead of Supabase's default sender.

### 6. Set your environment variables

Make a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
```

You only need this next one if the app guesses the wrong redirect URL for your setup:

```
VITE_SUPABASE_REDIRECT_URL=https://your-deployed-url/
```

Optional: set this to send traffic to Google Analytics 4 (page views, resource clicks, and searches). Create a GA4 property and grab the Measurement ID from **Admin → Data Streams**. Leave it unset to keep analytics off, which is the default for local dev.

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 7. Run it

```bash
npm run dev
```

Then just open `http://localhost:5173`.

## Deploying it

Every push to `main` kicks off [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the app and publishes it to GitHub Pages automatically. To set that up on your own fork:

1. In your repo's **Settings → Secrets and variables → Actions**, add `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and (optional) `VITE_GA_MEASUREMENT_ID`.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Push to `main`, and it'll build and deploy on its own from there.

Heads up: the app is currently configured to be served at `/ASN/` in production (see `base` in `vite.config.js`) — if you fork this under a different repo name, update that or your assets won't load right.

## Scripts

- `npm run dev` — run it locally
- `npm run build` — build for production
- `npm run preview` — preview that production build
- `npm run lint` — run the linter

## Next Steps

Right now resources are found by matching zip codes within a radius, which works but isn't very visual. The plan is to move toward an actual interactive map:

- **React Leaflet** for the map itself — plotting resources as pins a user can click through, instead of (or alongside) the current list view.
- **Supabase** keeps doing what it already does — storing user accounts and resource/business data — but that data would also feed the map's pins.
- **A geocoding service** to turn a business's street address into real latitude/longitude coordinates, since right now we only store zip codes and don't have precise map-ready locations.
- **GeoJSON files** to draw shaded regions on the map — for example, coloring in service areas, counties, or coverage zones, rather than just showing single points.
