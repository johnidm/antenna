# Antenna — Agent Guide

Antenna is a web app for streaming radio stations from around the world. This file documents the project for AI coding assistants.

---

## Project Overview

- **Goal:** Discover and stream live radio stations from a curated global database
- **Status:** Early development — routing and database layer in place, UI unstyled

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React SSR + file-based routing) |
| Server runtime | Nitro (via `nitro/vite` plugin) |
| Routing | TanStack Router (file-based, `src/routes/`) |
| ORM | Prisma 7 (adapter-based, no binary query engine) |
| Database | PostgreSQL 15 (Docker locally, Supabase in production) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Package manager | pnpm |
| Node version | 24+ required (use `nvm use 24`) |

---

## Key Conventions

### Path Aliases

- `@/*` → `src/*` — use this for all imports within `src/`
- Example: `import { db } from '@/lib/db'`
- The generated Prisma client is outside `src/`, so it uses a relative import from `db.ts`

### Data Fetching Pattern (TanStack Start)

Server-side queries use `createServerFn` + a route `loader`. The `db` client must **only** be imported in server contexts — never in client components.

```ts
// In a route file
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'

const getStations = createServerFn({ method: 'GET' }).handler(async () => {
  return db.radioStation.findMany({ orderBy: { name: 'asc' } })
})

export const Route = createFileRoute('/')({
  loader: () => getStations(),
  component: MyPage,
})

function MyPage() {
  const stations = Route.useLoaderData() // typed, server-fetched
}
```

### Prisma Client

- Prisma 7 requires a **driver adapter** — the classic `DATABASE_URL` in schema is gone
- The client is a singleton exported from `src/lib/db.ts` as `db`
- Import only in server functions / server-side code

```ts
import { db } from '@/lib/db'
```

### Prisma CLI

Always use `pnpx` (not `npx`) to pick up the local version:

```bash
pnpx prisma migrate dev --name <name>
pnpx prisma generate
pnpx prisma studio
```

### Resetting the Database

```bash
docker compose down -v   # removes volume
docker compose up -d
pnpx prisma migrate dev --name init
./populate.sh
```

---