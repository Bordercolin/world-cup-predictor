<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Agent Skills

Before changing product behavior, data flows, Supabase code, scoring, predictions, groups, or power-ups, read `PROJECT.md` for the current project model and implementation status.

Before changing UI, layout, typography, color, spacing, or component styling, read `DESIGN.md` and use the semantic tokens in `app/globals.css`.

When creating or substantially rebuilding a page, extract page-specific UI into components under `components/<page-name>/`, where `<page-name>` matches the route segment or page name. Keep `app/**/page.tsx` focused on route-level data loading, auth/redirects, and composition. For example, `/home` should use components from `components/home/`.

Local skills live in `.agents/skills/`. They are not optional when a task matches their scope: read the relevant `SKILL.md` before planning, editing, or reviewing code.

## Skill Routing

- For frontend design, UI polish, product UX, visual audits, accessibility, responsive behavior, design systems, motion, theming, or live browser iteration, read `.agents/skills/impeccable/SKILL.md`.
- For component-level polish, animation choices, micro-interactions, or UI code review, read `.agents/skills/emil-design-eng/SKILL.md`.
- For upgrading an existing website or app without rewriting it from scratch, read `.agents/skills/redesign-existing-projects/SKILL.md`.
- For image-first website, landing page, marketing page, hero, portfolio, editorial, or premium multi-section implementation work, read `.agents/skills/image-to-code/SKILL.md`.
- For high-agency React/Next.js frontend generation, Tailwind architecture, interaction states, hardware-accelerated motion, and anti-generic UI defaults, read `.agents/skills/design-taste-frontend/SKILL.md`.
- For Awwwards-style creative pages, GSAP-heavy motion, cinematic scrolling, bento grids, or highly art-directed marketing UI, read `.agents/skills/gpt-taste/SKILL.md`.
- For generating or refining a Google Stitch-oriented `DESIGN.md`, read `.agents/skills/stitch-design-taste/SKILL.md`.

If multiple skills apply, read the most specific one first, then any supporting skill that covers the implementation details.
