# Antenna - Radio Station Directory

## Getting Started

### 1. Start the database

Spin up the local PostgreSQL container (defaults: user `postgres`, password `postgres`, db `antenna` on port `5432`):

```bash
docker compose up -d db
```

Override any credential via environment variables if needed:

```bash
POSTGRES_USER=myuser POSTGRES_PASSWORD=secret POSTGRES_DB=mydb docker compose up -d db
```

### 2. Run database migrations

```bash
pnpx prisma migrate dev --name init
```

### 3. Populate with station data

```bash
./populate.sh
```

> Requires `jq` to be installed and a `data/stations.json` file to be present.

### 4. Install dependencies and start the dev server

```bash
pnpm install
pnpm dev
```

---

## Running the application locally (production)

Start the full stack (PostgreSQL + app) with a single command:

```bash
docker compose up -d
```

Then seed the database with station data:

```bash
./populate.sh
```

The app will be available at `http://localhost:3000`.

---

## Resetting the database

```bash
docker compose down -v   # removes the volume
docker compose up -d db
pnpx prisma migrate dev --name init
./populate.sh
```

## Releasing

Releases are automated with [Release Please](https://github.com/googleapis/release-please). Each release bumps the version in `package.json`, creates a git tag (e.g. `v0.1.1`), and publishes a [GitHub Release](https://github.com/johnidm/antenna/releases).

### Conventional commits

Use [Conventional Commits](https://www.conventionalcommits.org/) on PRs merged to `main`:

- `feat:` — new feature (patch bump while below `1.0.0`)
- `fix:` — bug fix (patch bump)
- `feat!:` or `BREAKING CHANGE:` — breaking change (minor bump while below `1.0.0`)
- `chore:`, `docs:`, `refactor:` — no version bump unless paired with a releasable change

### Release flow

1. Merge feature/fix PRs to `main` using conventional commit titles.
2. Release Please opens or updates a **Release PR** with the next version, `CHANGELOG.md`, and `package.json` bump.
3. Review and merge the Release PR.
4. Release Please creates the git tag and GitHub Release automatically.

The version shown on the About page comes from `package.json` and updates after the release PR is merged and deployed.

---

## REST API

### `GET /api/radios/stations`

Returns a paginated list of radio stations.

### Query Parameters

| Parameter  | Type     | Default  | Description |
|------------|----------|----------|-------------|
| `pageSize` | number   | `20`     | Items per page (max `100`) |
| `cursor`   | string   | —        | Opaque cursor from a previous response's `pagination.nextCursor` |
| `sortBy`   | `name` \| `country` | `name` | Field to sort by |
| `order`    | `asc` \| `desc` | `asc` | Sort direction |
| `country`  | string   | —        | Filter by exact country name |
| `language` | string   | —        | Filter by exact language |
| `tag`      | string   | —        | Filter stations that contain this tag |

### Response

```json
{
  "data": [
    {
      "id": "018edc4f-...",
      "name": "Arrow Classic Rock",
      "country": "The Netherlands",
      "language": "dutch",
      "streamUrl": "http://...",
      "homepageUrl": "https://...",
      "logoUrl": "https://...",
      "tags": ["classic rock", "rock"]
    }
  ],
  "pagination": {
    "nextCursor": "MDE4ZWRj...",
    "nextPage": "http://localhost:3000/api/radios/stations?pageSize=20&cursor=MDE4ZWRj...",
    "previousPage": "http://localhost:3000/api/radios/stations?pageSize=20&cursor=MDAwMDAw...",
    "hasMore": true,
    "pageSize": 20
  }
}
```

- **`nextCursor`** — pass as `cursor` in the next request to fetch the following page; `null` when there are no more results.
- **`nextPage`** — URL to fetch the following page; `null` when there are no more results.
- **`previousPage`** — URL to fetch the previous page; `null` when there are no previous results.
- **`hasMore`** — `true` if another page exists.

### Examples

```bash
# First page, 10 results sorted by name
curl "http://localhost:3000/api/radios/stations?pageSize=10"

# Next page using cursor from previous response
curl "http://localhost:3000/api/radios/stations?pageSize=10&cursor=<nextCursor>"

# Filter by country, sorted descending
curl "http://localhost:3000/api/radios/stations?country=Germany&sortBy=name&order=desc"

# Filter by tag
curl "http://localhost:3000/api/radios/stations?tag=jazz"
```
