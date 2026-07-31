# Updating project dependencies

Guide for safely updating dependencies in `antenna`. Run this process periodically (e.g. every sprint) or before important releases.

## Prerequisites

- Clean working tree (`git status` with no pending changes).
- Dedicated branch for the update, e.g. `git checkout -b chore/update-dependencies`.
- Node.js 24+ and an up-to-date pnpm (`node -v`, `pnpm -v`). Use `nvm use 24` if needed.
- Local database available if you will validate the app with real data (`docker compose up -d db`).
- Environment variables configured in `.env` (required for `pnpm build` / `pnpm dev`).

## Step by step

Run the commands from the project root:

```bash
pnpx npm-check-updates -u
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm install
pnpm build
```

### What each command does

- **`pnpx npm-check-updates -u`** — Rewrites versions in `package.json` to the latest available on the registry. Review the diff before continuing, especially *major* bumps. Watch packages pinned to `"latest"` (e.g. `@tanstack/*`, `nitro`): ncu may replace the pin with a concrete version — that is desirable for reproducible builds.
- **`rm -rf node_modules pnpm-lock.yaml`** — Ensures a clean install and a new lockfile consistent with the updated versions.
- **`pnpm install`** — Reinstalls all dependencies and generates the new `pnpm-lock.yaml`. The `postinstall` script runs `prisma generate` automatically. Resolve any peer dependency warnings here.
- **`pnpm test`** — Runs the Vitest suite (`vitest run`). All tests must pass before continuing.
- **`pnpm build`** — Ensures the production build (Vite + TanStack Start / Nitro) compiles without type or bundle errors.

## Additional checks

- Run `pnpm dev` and smoke-test the main routes (home, station listing, detail/player if present) and the `GET /api/radios/stations` endpoint.
- Review changelogs/release notes for critical libraries on major bumps:
  - `@tanstack/react-start`, `@tanstack/react-router`, and other `@tanstack/*` packages
  - `react` / `react-dom`
  - `vite`, `nitro`
  - `prisma`, `@prisma/client`, `@prisma/adapter-pg`
  - `pg`
  - `tailwindcss`, `@tailwindcss/vite`
  - `vitest`
- Validate typings with `pnpx tsc --noEmit` if the build did not cover some paths.
- After a Prisma bump, run `pnpx prisma migrate status` (and regenerate the client if `postinstall` did not run).

## Common troubleshooting

- **Peer dependency conflicts**: prefer adjusting the responsible library via `pnpm.peerDependencyRules` / overrides in `package.json` instead of ignoring peers globally. Document in the PR if unavoidable.
- **Breakages in TanStack Start / Router**: review the official TanStack Start/Router upgrade guide and the config in `vite.config` / routes under `src/routes/`.
- **Breakages in Prisma 7**: the client uses an adapter (`@prisma/adapter-pg`); do not expect classic `DATABASE_URL` wiring in `schema.prisma`. Confirm `src/lib/db.ts` and regenerate with `pnpx prisma generate`.
- **Breakages in Tailwind v4**: validate the `@tailwindcss/vite` plugin and `@import` directives in the global CSS — there is no classic `tailwind.config` by default.
- **Breakages in Vite / Nitro**: confirm the `dev` / `build` / `preview` scripts and the `nitro/vite` integration.
- **Vitest failures**: run `pnpm test` in isolation; check environment/DOM mocks (`jsdom`, Testing Library) if the UI suite fails.
- **Build failing on types**: run `pnpx tsc --noEmit` and fix types / imports (`@/*`).

## Commit and pull request

- Suggested commit: `chore(deps): update dependencies`.
- Checklist before opening the PR:
  - [ ] `pnpm test` passes
  - [ ] `pnpm build` passes
  - [ ] Smoke test on `pnpm dev` (UI + stations API)
  - [ ] PR describes updated majors and any manual fixes
