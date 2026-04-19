I am happy to share my journey building a Radio Studio App.

The idea is build a web app that can stream radio stations around the world.

Of course, I will use AI to help me build this app.

## Discovery

In this phase, I will search similar app on internet.

I type some keywords on google and find the following links:

- https://radiomc.vercel.app/
- https://radio.garden/ (I already use it)
- https://app.radiooooo.com/ (I already know)
- https://globeradio.app/
- https://github.com/jonasrmichel/radio-garden-openapi
- https://www.radio-browser.info/

The result: 

On Globe Radio, I found a two urls with radio stations around the world.
- https://globetv.app/assets/locales/eng.json
- https://globeradio.app/api/get_stations_by_country.php?country=BR

In this site I found a json file with radio stations.
- https://radiomc.vercel.app/radios.json

On Radio Browser, I found full datebase with a curated list of radio stations.

```
curl "https://de1.api.radio-browser.info/json/stations?limit=100000&hidebroken=true" -o stations-100k.json
```

## Thinking about the UX

This part is really important because I am not skilled to build a good UX. Fortunately, the AI help me in this challenge, but still I need to think about the user flow, colors, and the interaction with the radio stations.

The key here is think about the player and how the user can find the radio stations over a ton of radio stations.

## Domain name 

My suggestions for the domain name:

- antenna
- antennas
- antennaradio

## Create a database schema

The main decision is about NoSQL and relational DB.

And, choose the rigth SGDB, in my case I will chose Postgres and Supabase.

I can recreate the database schema any time. So I will start with a simple schema.

### Main Table:

```
Table name: radio_station

Fields:
- name: string - name of the radio station
- country: string - country of the radio station
- language: string - language of the radio station
- stream_url: string - URL of the stream
- homepage : string - URL of the radio station
- logo: string - URL of the logo
- tags: array of strings - tags of the radio station
```

I am going to set up a Postgres database locally, to start the development. I will use Docker compose to run the database. and init it.

Also, I am going to create a inital script so create the main table and populate this table with some rows.

The idea of the prompt is:
- Create a Docker Compose file to start a Postgres database locally.`
- Create an init script base on the schema above to craete a table.
- Create a script to populate the database (insert commands) with some rows using `jq` and `stations.json`.


### How to use:

Start the database:

```bash
docker compose up -d
```

> **Note:** The very first time this starts, PostgreSQL will automatically execute the init.sql and create the radio_station table.

Wait a couple seconds for the database initialization to complete.

Populate the database:
x
```bash
./populate.sh
```

To stop the database and remove the volume (recreate the table):

```bash
docker compose down -v
```

## Spin Up The Project

I am going to use TanStack Start to build the app.

Running the command

```bash
pnpm create @tanstack/start@latest .
```

CLI Prompts — Recommended Answers

- TypeScript → Yes.
- Tailwind CSS → Yes.
- ESLint → Yes.
- TanStack Query → Yes.
- TanStack Router Devtools → Yes.

```
pnpm install   # if not auto-run
pnpm dev
```

- Your app will be running at http://localhost:3000.

Install the pnpm if not installed:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

After installing, restart your terminal (or run source ~/.zshrc), then verify it worked:

```bash
pnpm --version
```

Then you're good to run your original command again:

```bash
pnpm create @tanstack/start@latest .
```

> Important: Check if the Node version is compatible with the project. Some errors can happen if the Node is out of date.

## Install and setup Prisma ORM

Prisma 7 uses a driver adapter instead of the classic binary query engine. The client is configured with `PrismaPg` and exported as a singleton from `src/lib/db.ts`.

Run migrations:

```bash
pnpx prisma migrate dev --name init
```

Inspect data with Prisma Studio:

```bash
pnpx prisma studio
```

After any schema change, regenerate the client:

```bash
pnpx prisma generate
```

## Create API endpoints

API routes live under `src/routes/api/` and use TanStack Router's `server.handlers` pattern.

The stations endpoint (`GET /api/radios/stations`) supports:

- **Cursor-based pagination** — `cursor` (forward) and `before` (backward) params, both base64-encoded item IDs
- **Sorting** — `sortBy` (`name` | `country`) and `order` (`asc` | `desc`)
- **Filtering** — `country`, `language`, and `tag` query params

Pagination helpers (`encodeCursor`, `decodeCursor`, `buildNextPageUrl`, `buildPrevPageUrl`) are centralised in `src/lib/pagination.ts`.

## Add metadata to the app