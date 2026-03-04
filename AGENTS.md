# AGENTS.md

## Product concept
A developer side-project random team matching service.

Key features
- Team project lifecycle management (e.g., forming → active → shipping → completed/paused)
- Progress tracking + metrics dashboard (team/project KPIs and trends)

Primary goal
- Simple UI and predictable code structure. Avoid unnecessary complexity.

---

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- TanStack Query
- Biome (lint/format)
- pnpm (never use npm or yarn)

---

## Code style
- Strict TypeScript. Avoid `any`.
- Named exports only (no default exports).
- Prefer small, composable components.
- Business logic in hooks or `src/lib`, not in JSX.

## Folder structure
src/
  pages/         route-level pages
  features/      domain modules (matching, teams, projects, progress, dashboard)
  components/    shared UI components
  hooks/         shared hooks
  lib/
    api/         API client + request functions
    types/       shared domain types
    utils/       utilities

Rules
- UI primitives in `components/` (Button, Input, Modal, etc.)
- Domain logic lives under `features/<domain>/`
- API calls only in `src/lib/api/*`
- Keep route pages thin; put logic in `features/*`

---

## Styling (Tailwind)
- Tailwind-first; minimal custom CSS.
- Avoid inline styles.
- Extract repeated class patterns into components.

---

## Data fetching (TanStack Query)
- Reads use `useQuery`, writes use `useMutation`.
- Prefer query keys per domain (e.g., `['teams']`, `['projects', id]`).
- No direct `fetch` inside components.

---

## Lint / format (Biome)
- Keep imports organized.
- No unused vars/exports.
- Run formatting before finalizing.

---

## Commands
- install: `pnpm install`
- dev: `pnpm dev`
- build: `pnpm build`
- lint: `pnpm biome lint .`
- format: `pnpm biome format --write .`
- typecheck: `pnpm tsc --noEmit`

---

## Documentation rules
After completing work:
- Update `DECISIONS.md` when choosing/changing a tool/library/approach.
- Update `ARCHITECTURE.md` only when folder structure or major data flow changes.
- Use `TASK.md` only for multi-step work spanning multiple sessions.
Do not invent reasons; write `Reason: TBD` if needed.
Keep docs short and bullet-based.