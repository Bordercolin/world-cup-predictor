# Project Guide

This repository is intentionally reset to a clean Next.js slate with Supabase connectivity preserved.

## Current State

- Next.js `16.3.0-canary.19` App Router app.
- React `19.2.6`, TypeScript, Tailwind CSS v4.
- shadcn/ui is installed with the `base-nova` style in `components.json`; shared UI primitives live in `components/ui/`.
- Supabase packages are installed:
  - `@supabase/ssr`
  - `@supabase/supabase-js`
- Supabase browser/server clients live in:
  - `utils/supabase/client.ts`
  - `utils/supabase/server.ts`
- `proxy.ts` refreshes Supabase Auth sessions using the current `@supabase/ssr` cookie pattern.
- The app surface is a minimal shadcn-based homepage showing dummy World Cup 2026 matches for the day.

## Intentionally Removed

The previous full World Cup predictor product work has been removed from the app and database. Do not assume any of these exist yet:

- Full marketing/product landing sections.
- Auth UI routes.
- Dashboard routes.
- Prediction, group, leaderboard, scoring, power-up, rivalry, or World Cup fixture tables.
- Gameplay RPCs, triggers, RLS policies, or imported WC2026 reference data.

## Scoring Rules

Use these exact scoring rules and English copy when implementing or displaying how scoring works.

### During the Group Stage

- **10 POINTS** Bullseye! You predicted the exact match score.
- **7 POINTS** Not perfect, but close! The score is not exact, but your goal difference is correct.
  Example: you predict 3–1 and the result is 2–0.
- **5 POINTS** You picked the right winner! Your score and goal difference are not correct, but you do know who takes the three points.
  Example: you predict 1–0 and the result is 3–0.
- **1 POINT** Scoring starts with taking part. You get one point for submitting your prediction.

### From the Round of 16

- **+ 10 POINTS** You know who advanced! You predicted the winning country correctly, even if the match is only decided by a penalty shootout.
  Example: your chosen country wins the match after penalties.
- **+ 6 POINTS** Fortune teller! You predicted the exact score after 90 minutes, or after 120 minutes if extra time is played.
- **+ 4 POINTS** Bonus! In addition to the winner, your predicted goal difference is also correct. This is the difference in goals between both teams after 90 or 120 minutes.
  Example: you predict 3–1 and the result is 2–0.
- **1 POINT** Here too, submitting pays off. You get one point for submitting your prediction.

## Current Homepage

- Route: `/`
- Page file: `app/page.tsx`
- Page-specific components: `components/homepage/`
- Data source: local dummy data in `components/homepage/MatchOverview.tsx`
- Purpose: show a bare-minimum daily match overview for World Cup 2026 with inline prediction controls.

The dummy match shape should stay close to future real fixture data: match ID, match date, group, kickoff time, teams, venue, city, and status.
Matches are grouped by match date on the homepage, with each date heading followed by that day's matches.
Predictions are entered directly on each match card. Match cards use a simple left-center-right structure: home team, centered kickoff/prediction score, away team. Empty prediction scores display as `-`, and users adjust each team score with `+` and `-` controls.

## Supabase Rules

This project must use `@supabase/ssr`.

Do:

- Use `createBrowserClient` for browser code.
- Use `createServerClient` for server code.
- Use `cookies.getAll()` and `cookies.setAll(...)` patterns.
- Preserve Supabase response cookies when changing `proxy.ts`.

Do not:

- Import from `@supabase/auth-helpers-nextjs`.
- Use deprecated individual cookie methods from old examples.
- Add auth-refresh logic between creating the server client and calling `auth.getUser()` in `proxy.ts`.

Also read `.agents/skills/auth.md` before changing Supabase Auth code.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Next Steps

Future product work should start from this clean baseline. Add schema, routes, and UI deliberately as new requirements are defined.
