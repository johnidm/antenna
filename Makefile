.PHONY: install update-deps dev build preview test knip db-up db-down db-reset migrate migrate-deploy populate generate seed clean reset all

install:
	pnpm install --frozen-lockfile

update-deps:
	pnpx npm-check-updates -u
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

preview:
	pnpm preview

test:
	pnpm test

knip:
	pnpm knip

db-up:
	docker compose up -d db

db-down:
	docker compose down

db-reset:
	docker compose down -v
	docker compose up -d db
	pnpx prisma migrate dev --name init
	@test -f populate.sh && ./populate.sh || echo "populate.sh not found — skipping seed"

migrate:
	pnpx prisma migrate dev

migrate-deploy:
	pnpx prisma migrate deploy

generate:
	pnpx prisma generate

populate:
	./populate.sh

seed: populate

studio:
	pnpx prisma studio

all: install db-up migrate populate dev

reset: db-reset
