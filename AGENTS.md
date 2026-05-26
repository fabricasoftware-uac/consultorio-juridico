# Consultorio Jurídico — AGENTS.md

## Stack
- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Supabase** (auth, DB, local dev via Docker)
- **Tailwind CSS v4** + **shadcn/ui** (new-york style) + **Radix UI**
- **pnpm** (workspace, v9+), Node 20+

## Commands
```bash
pnpm dev              # next dev --turbopack
pnpm build            # next build
pnpm start            # next start
pnpm lint             # eslint (no config file — uses Next.js defaults)
pnpm supabase start   # Docker containers for local Supabase
pnpm supabase db reset  # drop + re-apply all migrations
pnpm supabase migration new <name>  # create new migration
npx tsx scripts/seed.ts  # seed DB with 4 test users (pw: "testuser")
```

No test framework, no typecheck script, no formatter config.

## Setup order
1. `pnpm install`
2. `pnpm supabase start`
3. `pnpm supabase db reset`
4. `npx tsx scripts/seed.ts`
5. `pnpm dev` → http://localhost:3000

## Env vars (see `.env.example`)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_SUPABASE_DATABASE_URL
NEXT_SUPABASE_SERVICE_ROLE_KEY
```

## Architecture

### Roles & routing
4 roles enforced via JWT claim `user_role` in `src/middleware.ts`:
| Route prefix | Role |
|---|---|
| `/admin/*` | `admin` |
| `/asesor/*` | `asesor` |
| `/estudiante/*` | `estudiante` |
| `/pro-apoyo/*` | `pro_apoyo` |

Role claim is injected by a Supabase **custom access token hook** (`custom_access_token_hook` — a pg-function). The seed script creates users but the migration that assigns roles must run.

### Supabase clients
- `src/lib/supabase/supabase-client.ts` — browser client (`createBrowserClient`)
- `src/lib/supabase/supabase-server.ts` — server component client (not read yet, likely `createServerClient`)
- `src/lib/supabase/supabase-admin.ts` — service-role client (`createClient`, NEVER use in browser)
- `src/lib/supabase/middleware.ts` — middleware client for session+RABC

### DB queries
Live in `supabase/queries/` (`.tsx` files, import `@/lib/supabase/supabase-client`).

### Path aliases (tsconfig `baseUrl: src/`)
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`
- `components.json` aliases are misleading — trust `tsconfig.json`.

### Project structure
```
src/
  app/         # Next.js App Router pages (admin, asesor, estudiante, pro-apoyo, auth, ...)
  components/  # Shared UI (global/, ui/ = shadcn, casos-juridicos/)
  lib/         # Supabase clients, utils
  middleware.ts # Session + RBAC
supabase/
  migrations/  # 20 SQL migrations
  queries/     # TS query helpers
  seeds/       # SQL seed (unused; actual seed is scripts/seed.ts)
  config.toml  # Local Supabase config (port 54321 API, 54322 DB, 54323 Studio)
scripts/
  seed.ts      # Snaplet Seed: creates 4 test users via supabaseAdmin.auth.signUp()
```

### Key details
- Supabase Studio: http://localhost:54323
- Email testing (Inbucket): http://localhost:54324
- DB major version: PostgreSQL 17
- JWT expiry: 1h, refresh token rotation enabled
- Signups enabled, email confirmation disabled (dev)
- `src/lib/utils.ts` exports `cleanData()` — converts empty strings to null
- `tailwindcss` v4 with `@tailwindcss/postcss`, `tw-animate-css` plugin
- VSCode recommended extension: `denoland.vscode-deno` (for edge functions — none present yet)
