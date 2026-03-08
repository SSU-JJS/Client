# DECISIONS.md

## 2026-03-05
- Stack: Vite + React + TypeScript
- Styling: Tailwind CSS
- UI components: shadcn/ui
- Server state: TanStack Query
- Routing: React Router
- Development API mocking: MSW with centralized `src/lib/api/config.ts`
- Lint/format: Biome
- Package manager: pnpm
- Landing UI approach: token-driven design system (CSS variables + Tailwind extension)
- Shared primitives for marketing pages: `Button`, `Badge`, `Surface`, `Container`, `SectionHeading`
- Auth/API approach: OpenAPI-first contract for login, signup, email verification, and current-user profile
