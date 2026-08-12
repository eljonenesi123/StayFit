# StayFit

A mobile-first fitness web app: interval timer, exercise library, AI photo
exercise recognition, AI workout/meal plan generation, and a calorie
calculator with food logging — behind a sign-up/login flow and a stats
dashboard.

## App flow

```
/            -> redirects to /home if logged in, else /welcome
/welcome     -> hero/landing (Get Started -> /signup, Log in -> /login)
/signup      -> create account
/login       -> log in
/home        -> dashboard (protected) — bodyweight trend, calorie ring,
                "Workouts" / "Meals" shortcut cards, log out
/timer, /library, /scan, /plans, /calories
             -> the 5 feature sections (protected), reached from the
                dashboard's shortcut cards or the bottom nav once inside.
                Each has a small top bar to tap back to /home.
```

**Auth is a client-only mock right now** — see the loud warning comment at
the top of `client/src/features/auth/authStorage.ts`. "Accounts" live in
this browser's localStorage with a basic unsalted SHA-256 password digest;
there is no server validating anything, and it must be swapped for a real
auth provider (Firebase Auth, Supabase Auth, or your own backend doing
password hashing + session issuance server-side) before any real user's
password touches this app.

## Stack

- **`client/`** — React + Vite + TypeScript. All UI, timer logic, and local
  data (exercise library, saved plans, food log) live here. No API key ever
  ships in this bundle.
- **`server/`** — Express. A thin proxy that holds the real API keys
  (server-side environment variables only) and forwards two kinds of request
  to Claude: exercise-photo recognition and workout/meal plan generation.

A backend is required — not optional — because a Vite frontend bundle is
plain JavaScript shipped to the browser as-is; any API key embedded in it
(even via `VITE_*` env vars) would be extractable by anyone who opens dev
tools. `server/` exists specifically to keep `ANTHROPIC_API_KEY` and
`USDA_API_KEY` off the client.

## What's live vs. stubbed

| Feature | Status | Needs |
|---|---|---|
| Interval timer | **Live** — fully local, no API | — |
| Exercise library (search/filter) | **Live** — local seed data | — |
| Exercise library video demos | **Stub-by-design** — see below | (optional) curated video IDs or a video API |
| Photo/video exercise recognition | **Live once configured** | `ANTHROPIC_API_KEY` |
| AI workout/meal plan generation | **Live once configured** | `ANTHROPIC_API_KEY` |
| Calorie calculator (BMR/TDEE) | **Live** — pure client-side math | — |
| Food-to-calorie lookup | **Stub until configured** | `USDA_API_KEY` (free) — falls back to manual entry |

Every stub returns a real HTTP 501 with a clear message (`server/src/routes/*.js`),
and the client shows that message inline rather than pretending the feature
half-works.

### Exercise video demos — why they're "search" embeds, not fixed video IDs

`client/src/features/exercises/data.ts` doesn't have a real curated video
library yet, so each exercise's `videoUrl` uses a `search:<query>`
pseudo-URL (see `youtube.ts`), which embeds a **live YouTube search player**
for that query rather than one hand-picked video. This was a deliberate
choice over hardcoding specific YouTube video IDs, which could easily be
wrong, deleted, or point at the wrong exercise.

To go live with curated content: change any `Exercise.videoUrl` to a real
`https://www.youtube.com/watch?v=<id>` you've picked, or point it at a
self-hosted file or a stock exercise-video API — nothing else in the data
model or player needs to change, since the field is just a URL string.

## Setup

### 1. Server

```sh
cd server
npm install
cp .env.example .env
# edit .env — set ANTHROPIC_API_KEY (required for recognition + plans),
# optionally USDA_API_KEY (food lookup; otherwise manual entry is used)
npm run dev
```

Runs on `http://localhost:8787`. `GET /api/health` reports which keys are
configured.

### 2. Client

```sh
cd client
npm install
cp .env.example .env.local   # only needed if the server isn't on localhost:8787
npm run dev
```

Runs on `http://localhost:5173`.

## External services

| Service | Used for | Sign up |
|---|---|---|
| Anthropic API | Photo exercise recognition + AI plan generation | https://console.anthropic.com |
| USDA FoodData Central | Food-to-calorie search (optional) | https://fdc.nal.usda.gov/api-key-signup |
| YouTube | Exercise demo videos (embed only, no key needed by default) | — |

## Project layout

```
client/src/
  components/        shared UI primitives (BottomNav, AppTopBar/AppShell, Sheet, icons)
  lib/                storage, audio, wake lock, format helpers, api config
  features/
    auth/             mock local auth (STUB — see warning in authStorage.ts),
                       hero/signup/login pages, route guards
    dashboard/         home screen: bodyweight trend + calorie ring + shortcuts
    timer/            round builder + Date.now()-based countdown engine
    exercises/         library data model + search/filter + video embed
    recognition/       photo/video capture -> vision API client
    plans/             AI plan form + structured result view
    calories/          BMR/TDEE calculator + food log
  styles/             design tokens (tokens.css) + global styles

server/src/
  lib/anthropicClient.js   shared Anthropic client (reads ANTHROPIC_API_KEY)
  routes/recognize.js      POST /api/recognize   — vision, structured JSON out
  routes/plans.js          POST /api/generate-plan — plan JSON out
  routes/nutrition.js      GET  /api/nutrition/search — USDA proxy
```

## Notes

- Both AI routes ask Claude for `output_config.format: json_schema`, so
  responses are guaranteed-parseable JSON, not prose the client has to
  regex apart.
- The interval timer computes elapsed time from `Date.now()` timestamps, not
  by counting `setInterval` ticks, so it stays accurate through backgrounding
  or a locked screen. It also requests a Screen Wake Lock while running,
  with a silent no-op fallback on browsers that don't support it.
- Photo/video exercise recognition explicitly identifies the exercise and
  gives generic guidance — it does not generate video, and the UI carries a
  standing disclaimer that it isn't a substitute for professional coaching.
- The dashboard's bodyweight trend is seeded placeholder data (there's no
  weight-logging feature yet) and its macro breakdown is a fixed 30/40/30
  protein/carbs/fat split applied to real logged calories, not real per-food
  macros — both are flagged inline in `features/dashboard/placeholderData.ts`.
  The calorie ring itself uses real data: today's logged total from the food
  log, against your saved TDEE target (or a 2000 kcal default if you haven't
  calculated one yet).
