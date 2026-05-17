---
name: Prono Club
description: Warm, tactical World Cup predictor UI for private groups, score picks, power-ups, and leaderboards.
colors:
  canvas: "#f5f1e8"
  surface: "#fff8ec"
  cream: "#f8f0df"
  muted-surface: "#e3dbc8"
  ink: "#152016"
  muted: "#405143"
  green: "#165d4a"
  terracotta: "#d24a2a"
  navy: "#1d345e"
  sage: "#cdddbb"
  sand: "#e8d8bb"
  mint: "#dfe7d6"
  mint-soft: "#dfe8d3"
  warning: "#ffe0c8"
  warning-ink: "#9f321b"
  danger-ink: "#8f2f1c"
  ocean-ink: "#263b62"
  pitch: "#163427"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.7
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.68rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  pill: "999px"
  tile: "1.35rem"
  panel: "1.5rem"
  shell: "2rem"
spacing:
  page-x: "1.25rem"
  page-y: "1.5rem"
  card: "1.25rem"
  panel: "1.75rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  button-accent:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "1rem 1.75rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.25rem"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "1rem"
    padding: "0.75rem 1rem"
---

# Design System: Prono Club

## 1. Overview

**Creative North Star: "The Matchday Ledger"**

Prono Club should feel like a private football table kept with care: warm paper, deep pitch green, terracotta matchday urgency, navy structure, and dense but legible scoring information. The product is not a generic fantasy dashboard. It is a social prediction room where users can see picks, locks, power-ups, rivals, and group movement without losing the friendly tournament atmosphere.

The system is product-first: predictable navigation, readable tables, strong status labels, and restrained color. Use visual variety through asymmetric grids and varied surface tones, not through random gradients, icon clutter, or excessive animation. Dashboard screens should feel usable at a glance on a laptop and collapse cleanly to one column on mobile.

Key characteristics:

- Warm cream canvas with layered cream, surface, and muted-surface panels.
- Deep green and ink provide authority; terracotta is the only urgent action accent.
- Mono uppercase labels mark metadata, times, statuses, ranks, and scoring numbers.
- Rounded shells and tiles are generous but consistent.
- Shadows are diffused and tinted, never neon or glossy.

## 2. Colors

The palette is a warm football ledger: aged paper neutrals, pitch green, terracotta urgency, and navy tournament structure.

### Primary

- **Pitch Green** (`#165d4a`): Brand mark, leaderboard surfaces, success states, and available power-up states.
- **Terracotta Whistle** (`#d24a2a`): Primary accent for registration, urgent CTAs, warnings, and "needs action" moments. Use sparingly.

### Secondary

- **Tournament Navy** (`#1d345e`): Structural labels, host-city metadata, focus rings, and secondary dark panels.
- **Deep Ink** (`#152016`): Primary text, dark panels, primary buttons, and high-contrast separators.

### Neutral

- **Matchday Canvas** (`#f5f1e8`): Page background and quiet inset blocks.
- **Scorecard Surface** (`#fff8ec`): Cards, forms, header shells, and primary content surfaces.
- **Warm Cream** (`#f8f0df`): Dark-panel text, elevated inner surfaces, and chips.
- **Muted Fixture Surface** (`#e3dbc8`): Large secondary feature panels.
- **Tactical Muted Text** (`#405143`): Descriptions, helper copy, and secondary metadata.
- **Sage Highlight** (`#cdddbb`), **Sand Rank** (`#e8d8bb`), and **Mint Feedback** (`#dfe7d6`): Supporting tones for dark panels, ranks, and positive status surfaces.

### Named Rules

**The One Whistle Rule.** Terracotta is the only warm accent with urgency. Do not add purple, neon blue, or extra CTA colors.

**The Token Rule.** Component files should use semantic Tailwind classes from `app/globals.css` (`bg-canvas`, `text-ink`, `rounded-shell`, `shadow-stat`, etc.). Raw hex values belong in `globals.css` and this file only.

## 3. Typography

**Display Font:** Geist with Arial and Helvetica fallbacks.  
**Body Font:** Geist with Arial and Helvetica fallbacks.  
**Label/Mono Font:** Geist Mono for metadata, ranks, times, points, codes, and numeric dashboard values.

The typography is compact and confident. Headings use heavy weight and tight tracking, while labels use mono uppercase with generous letter spacing to create a tournament-control-room feel.

### Hierarchy

- **Hero** (`font-weight: 900`, `letter-spacing: -0.06em`, `line-height: 1`): Large marketing and featured match headings.
- **Display** (`font-weight: 900`, `letter-spacing: -0.045em`, `line-height: 1`): Page and section headlines.
- **Title** (`font-weight: 900`, `1.125rem-1.5rem`): Cards, table rows, match names, group names.
- **Body** (`1rem`, `line-height: 1.6-1.8`): Descriptions, helper copy, legal text, and explanatory dashboard copy.
- **Label** (`0.68rem-0.75rem`, uppercase, mono, `0.14em-0.22em` tracking): Eyebrows, statuses, timestamps, invite codes, and metadata.
- **Numbers** (mono, heavy, tight tracking): Scores, points, countdowns, ranks, and inventory counts.

### Named Rules

Do not introduce serif typography in authenticated product UI. Do not use decorative display fonts. Hierarchy should come from weight, color, and spacing rather than oversized text alone.

## 4. Elevation

Elevation is soft and ambient. Use tinted shadows only when a surface must float above the warm canvas. Most grouping should come from surface tone, borders, and dividers.

- **Navigation shadow:** `shadow-nav`, used on the pill header.
- **Panel shadow:** `shadow-panel`, used for auth shells and large elevated panels.
- **Dashboard shadow:** `shadow-dashboard`, used for the signed-in dashboard header.
- **Stat shadow:** `shadow-stat`, used for small metric cards.
- **Feature shadow:** `shadow-feature`, used for the main prediction feature surface.

Do not add neon glows, pure black shadows, or random one-off shadow values in component files.

## 5. Components

**Page shells:** Use `.app-page` for full-height app pages and token-backed page padding where possible. Keep content centered with `max-w-7xl` or `max-w-[1400px]`.

**Cards and panels:** Use `rounded-shell` for large sections, `rounded-panel` for table containers, and `rounded-tile` for nested content. Prefer `bg-surface`, `bg-canvas`, `bg-muted-surface`, `bg-ink`, `bg-green`, or `bg-navy` over hardcoded colors.

**Buttons:** Primary buttons are ink or terracotta filled, pill-shaped, heavy, and tactile. Hover may translate up slightly; active may scale or press down. Disabled future actions should remain visibly disabled and should not pretend to be live.

**Inputs:** Use `.form-field`. Labels sit above fields. Focus border uses navy. Errors and success messages use warning/green tokens with inline copy.

**Status pills:** Use mono uppercase labels with tokenized good, warning, neutral, or dark styles. Status copy should be concrete: "Ready", "Needs pick", "Queued", "Available".

**Dashboard data:** Prediction rows should read like a table on desktop and stack clearly on mobile. Scores, ranks, inventory counts, and lock times use mono.

**Power-ups:** Treat power-ups as single-use inventory. The UI should show availability, queued/used state, and how a power-up affects points without making the client the scoring authority.

## 6. Do's and Don'ts

Do:

- Use semantic tokens from `app/globals.css` for color, radius, tracking, shadows, and shared form styles.
- Keep mobile layouts single-column below `768px`.
- Use grid for dashboard structure and row alignment.
- Keep terracotta rare and meaningful.
- Make pending backend actions visibly disabled with explanatory copy.
- Use server-trusted language for predictions, locking, scoring, and power-up consumption.

Don't:

- Do not put raw hex colors or arbitrary shadow values in component files.
- Do not introduce purple, neon gradients, pure black, or glowing buttons.
- Do not use emojis, generic placeholder names, or startup-sounding filler copy.
- Do not use centered SaaS hero patterns for major marketing sections.
- Do not create identical 3-card feature grids when an asymmetric layout would better match the brand.
- Do not make client-side UI appear authoritative for points, kickoff locks, or power-up consumption.
