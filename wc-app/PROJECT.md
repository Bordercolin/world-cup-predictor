# Prono Club Project Guide

This file is agent-facing project context. Read it before making product, data, auth, routing, or scoring changes.

## Project Summary

Prono Club is a private World Cup prediction game. Users create accounts, join private groups, predict match scores before kickoff, and compete on group leaderboards through the tournament.

The app is currently a Next.js 16 canary App Router project with Supabase Auth wired in. Most prediction-game features are represented by UI copy, static demo data, and a Supabase database schema, but are not fully connected in application code yet.

## Product Concepts

- **User**: A signed-in player. Supabase Auth stores login identity. The public `users` table is intended to store game profile data such as username, avatar, supported country, group membership, and total points.
- **Group**: A private prediction league. Groups have names, invite codes, admins, and members.
- **Match**: A World Cup fixture with teams, kickoff time, score, status, and optional underdog multiplier.
- **Prediction**: A user's submitted score prediction for a match. Predictions should lock before or at kickoff.
- **Power-up**: A limited-use modifier a user can attach to a prediction. Example: a `2x` power-up doubles the points earned by that prediction.
- **User power-up**: A specific inventory item owned by a user. It tracks whether a power-up has been used and, if used, which match it was used on.
- **Leaderboard**: Ranking of users by points, usually scoped to a private group.
- **Rivalry**: A user-to-user relationship intended for extra social competition.

## Current App State

Implemented:

- Marketing landing page at `/`.
- Login and registration pages with Supabase Auth server actions.
- Authenticated dashboard shell at `/home`.
- Static legal pages at `/privacy` and `/terms`.
- Supabase SSR clients in `utils/supabase/client.ts` and `utils/supabase/server.ts`.
- A `proxy.ts` file that Next.js 16 recognizes as middleware/proxy behavior for auth refresh and redirects.

Not yet implemented in app logic:

- Creating or joining groups.
- Reading or writing public profile rows.
- Reading matches from Supabase.
- Creating, editing, locking, or scoring predictions.
- Awarding points.
- Assigning or consuming power-ups.
- Leaderboard calculation.
- Rivalries.
- Real countdown timers or kickoff locking.

Important auth note: `proxy.ts` is active in the current Next.js 16 canary build and handles Supabase session refresh plus route redirects. The `/home` route also protects itself by calling `supabase.auth.getUser()` and redirecting unauthenticated users.

## Tech Stack

- Next.js `16.3.0-canary.19`
- React `19.2.6`
- TypeScript
- Tailwind CSS v4
- Supabase Auth and Postgres
- `@supabase/ssr`
- `@supabase/supabase-js`

Commands:

```bash
npm run dev
npm run build
npm run lint
```

## Routes

### `/`

Marketing page for the product. It composes components from `components/homepage` and uses inline static data for demo fixtures, leaderboard rows, host cities, and scoring rules.

Key files:

- `app/page.tsx`
- `components/homepage/*`
- `components/global/Footer.tsx`
- `components/global/Header.tsx`

### `/login`

Login form using a server action.

Behavior:

- Reads `email`, `password`, and hidden `next`.
- Validates that `next` is an internal path.
- Calls `supabase.auth.signInWithPassword`.
- Redirects to `next` on success, defaulting to `/home`.
- Redirects back with `?error=` on failure.

Key files:

- `app/login/page.tsx`
- `app/login/actions.ts`
- `components/auth/AuthLayout.tsx`
- `components/auth/AuthMessage.tsx`

### `/register`

Registration form using a server action.

Behavior:

- Reads display name, email, and password.
- Requires a password of at least 8 characters.
- Calls `supabase.auth.signUp`.
- Stores display name in `user_metadata.display_name`.
- Redirects to `/login` with a confirmation message.

Key files:

- `app/register/page.tsx`
- `app/register/actions.ts`

### `/home`

Authenticated dashboard shell.

Behavior:

- Forces dynamic rendering.
- Creates a server Supabase client.
- Calls `supabase.auth.getUser()`.
- Redirects to `/login?next=/home` when unauthenticated.
- Shows signed-in email, display name, sign out, static dashboard cards, static groups, static open predictions, static leaderboard, and static scoring rules.

Key files:

- `app/home/page.tsx`
- `app/home/actions.ts`

## Supabase Auth Rules

This project must use `@supabase/ssr`.

Do:

- Use `createBrowserClient` for browser code.
- Use `createServerClient` for server code.
- Use `cookies.getAll()` and `cookies.setAll(...)` patterns.
- Preserve Supabase response cookies when adding middleware/proxy behavior.

Do not:

- Import from `@supabase/auth-helpers-nextjs`.
- Use deprecated individual cookie methods from old examples.
- Put logic between creating the server client and `auth.getUser()` in middleware-style auth refresh code.

Also read `.agents/skills/auth.md` before changing Supabase Auth code.

## Database Schema

The Supabase project currently has these `public` tables. Row counts were `0` when inspected, and RLS was enabled on each table.

### `public.users`

Purpose: Game profile for a player. This is separate from Supabase Auth's internal auth user record.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `username text unique`
- `avatar_url text nullable`
- `supported_country text nullable`
- `group_id uuid nullable`
- `total_points integer default 0`
- `created_at timestamptz default now()`

Foreign keys:

- `group_id` references `public.groups.id`
- Referenced by `groups.admin_id`, `predictions.user_id`, `rivalries.user_id`, `rivalries.rival_id`, and `user_power_ups.user_id`

Implementation note: The app currently authenticates via Supabase Auth but does not create or query rows in `public.users`. When connecting this table, define how Auth user IDs map to `public.users.id`.

### `public.groups`

Purpose: Private prediction leagues.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `name text`
- `invite_code varchar unique`
- `created_at timestamptz default now()`
- `admin_id uuid nullable`

Foreign keys:

- `admin_id` references `public.users.id`
- Referenced by `users.group_id`

Implementation note: The dashboard has disabled create/join buttons and static group cards. Create/join flows should connect here.

### `public.matches`

Purpose: World Cup fixtures and results.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `home_team text`
- `away_team text`
- `kickoff_time timestamptz`
- `home_score integer nullable`
- `away_score integer nullable`
- `status text default 'scheduled'`
- `underdog_multiplier numeric default 1.0`
- `created_at timestamptz default now()`

Foreign keys:

- Referenced by `predictions.match_id`
- Referenced by `user_power_ups.used_on_match_id`

Implementation note: Use `kickoff_time` as the source of truth for prediction locking. Avoid trusting client-side countdowns for lock eligibility.

### `public.predictions`

Purpose: A user's score prediction for a match.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid nullable`
- `match_id uuid nullable`
- `home_score_pred integer`
- `away_score_pred integer`
- `user_power_up_id uuid nullable`
- `points_earned integer default 0`
- `locked_at timestamptz default now()`

Foreign keys:

- `user_id` references `public.users.id`
- `match_id` references `public.matches.id`
- `user_power_up_id` references `public.user_power_ups.id`

Implementation notes:

- A prediction may attach one user-owned power-up through `user_power_up_id`.
- Once a match is locked, prediction score fields and attached power-up should not be editable.
- `points_earned` should be written by trusted server-side scoring logic, not calculated only in the browser.

### `public.power_ups`

Purpose: Catalog of available power-up types.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `code_name text unique`
- `display_name text`
- `description text`
- `icon_url text nullable`

Implementation note: Examples can include `double_points`, `underdog_boost`, or other product-defined modifiers. Keep code names stable because scoring logic will likely branch on them.

### `public.user_power_ups`

Purpose: Inventory of power-up instances owned by users.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid nullable`
- `power_up_id uuid nullable`
- `is_used boolean default false`
- `used_on_match_id uuid nullable`
- `created_at timestamptz default now()`

Foreign keys:

- `user_id` references `public.users.id`
- `power_up_id` references `public.power_ups.id`
- `used_on_match_id` references `public.matches.id`
- Referenced by `predictions.user_power_up_id`

Implementation notes:

- Treat each row as a single-use inventory item.
- When a prediction attaches a power-up, update both `predictions.user_power_up_id` and `user_power_ups.is_used`.
- Set `used_on_match_id` to the same match as the prediction.
- Enforce that a used power-up cannot be reused for another prediction.
- Prefer transactional server-side logic or a database function when consuming a power-up and saving a prediction together.

### `public.rivalries`

Purpose: Social relationship between two users.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid nullable`
- `rival_id uuid nullable`
- `created_at timestamptz default now()`

Foreign keys:

- `user_id` references `public.users.id`
- `rival_id` references `public.users.id`

Implementation note: No current app code uses rivalries.

## Intended Prediction Flow

1. User signs in.
2. App resolves the signed-in Auth user to a `public.users` profile.
3. App loads the user's groups and available matches.
4. App shows only matches that are still open for prediction.
5. User enters a home and away score prediction.
6. User optionally selects an unused power-up from their inventory.
7. Server verifies:
   - The user is authenticated.
   - The user can access the relevant group/match context.
   - The match kickoff time has not passed.
   - The selected power-up belongs to the user.
   - The selected power-up is unused.
8. Server writes or updates the prediction.
9. If a power-up is attached, server marks the user power-up as used and records the match.
10. After match results are known, trusted scoring logic calculates `points_earned`.
11. User totals and leaderboards update from scored predictions.

## Intended Scoring Model

Current UI copy shows these base rules:

- Exact score: 5 points.
- Correct result: 3 points.
- Goal difference: 1 point.
- Knockout streak bonuses are mentioned in marketing copy but not implemented.

Power-ups should modify trusted server-side scoring. For example:

- Base exact-score points: `5`
- User attached a `2x` power-up
- Final awarded points: `10`

Do not let client code be the authority for points or power-up consumption.

## Implementation Guidance For Agents

- Distinguish clearly between implemented behavior and product intent.
- Before database work, use the Supabase MCP server to inspect current tables, policies, migrations, and advisors.
- Keep RLS in mind. All public tables currently have RLS enabled.
- Avoid assuming the app has a profile row for every Auth user until profile creation is implemented.
- Use server actions, route handlers, or database functions for sensitive writes like predictions, scoring, and power-up consumption.
- Keep prediction locking based on server time and `matches.kickoff_time`.
- Keep scoring deterministic and testable.
- When adding power-up logic, make reuse impossible at the database or transaction boundary.
- Preserve the current visual direction: warm cream background, deep green, terracotta, navy, rounded cards, bold condensed-feeling typography, and mono uppercase labels.
- This project uses a Next.js canary. Before changing Next.js APIs or conventions, read the relevant docs in `node_modules/next/dist/docs/`.

## Known Gaps To Resolve Later

- Decide how `auth.users.id` maps to `public.users.id`.
- Add profile creation after registration or first login.
- Keep `proxy.ts` aligned with the active Next.js 16 middleware/proxy convention.
- Add group creation and invite-code joining.
- Add match ingestion or admin tooling for fixtures/results.
- Add prediction CRUD with kickoff locking.
- Add user power-up inventory and consumption.
- Add scoring jobs/functions and leaderboard queries.
- Add RLS policies for users, groups, predictions, matches, and power-ups.
- Add tests for auth, prediction locking, power-up consumption, and scoring.
