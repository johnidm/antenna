# syntax=docker/dockerfile:1

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app

# Enable Corepack so pnpm is available without a global install
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

COPY . .

# Generate the Prisma typed client into generated/prisma/
RUN node_modules/.bin/prisma generate

# Build the Nitro node-server bundle → .output/
RUN pnpm build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs antenna

# node_modules is needed for the prisma CLI (migrate deploy) and the pg adapter
COPY --from=deps    /app/node_modules   ./node_modules
COPY --from=builder /app/.output        ./.output
COPY --from=builder /app/generated      ./generated
COPY --from=builder /app/prisma         ./prisma
COPY                package.json        ./
COPY                prisma.config.ts    ./
COPY                entrypoint.sh       ./

RUN chmod +x entrypoint.sh && \
    chown -R antenna:nodejs /app

USER antenna

EXPOSE 3000

# Health check: the Nitro server must respond on /
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

ENTRYPOINT ["./entrypoint.sh"]
