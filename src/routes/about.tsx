import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Coffee, Github, Linkedin, Radio, ExternalLink, Terminal, Code2 } from 'lucide-react'
import { db } from '@/lib/db'

const getStationCount = createServerFn({ method: 'GET' }).handler(async () => {
  return db.radioStation.count()
})

export const Route = createFileRoute('/about')({
  loader: () => getStationCount(),
  component: About,
})

function About() {
  const count = Route.useLoaderData()
  return (
    <main>
      {/* Hero */}
      <section className="relative mb-10 border-border pb-10 sm:mb-6 sm:pb-6">
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-5xl">
          Tuning into the world,
          <br />
          <span className="text-fg-muted">one station at a time.</span>
        </h1>

        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-fg" aria-hidden="true" />
          On air · Made in Brazil
        </div>
      </section>

       {/* Station count stat */}
      <section className="mb-12">
        <div className="flex flex-col items-start gap-4 rounded-md border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              Database
            </p>
            <p className="font-mono text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {count.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              radio stations available to stream from around the world.
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2">
            <Radio className="h-7 w-7 text-fg" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mb-12 space-y-5 text-base leading-relaxed text-fg sm:text-lg">
        <p>
          Hi, I&apos;m <span className="font-semibold">Johni</span> — a software engineer from Brazil.
          Since <span className="font-mono">2008</span>, I&apos;ve been using technology to make my
          daily life better, and occasionally just to have fun.
        </p>
        <p>
          As an enthusiast of radio, I built this project to help me discover stations from around
          the world. Radio takes me back to my childhood — I was born and raised in the countryside,
          where listening to the radio was a big part of growing up.
        </p>
        <p>
          This is an open source project. You can find the source code on{' '}
          <a
            href="https://github.com/johnidm/antenna"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 border-b border-border text-fg transition-colors hover:border-fg"
          >
            GitHub
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          .
        </p>
        <p>
          Have a suggestion to improve the project? Send me an email at{' '}
          <a
            href="mailto:johni.douglas.marangon@gmail.com"
            className="inline-flex items-center gap-1 border-b border-border text-fg transition-colors hover:border-fg"
          >
            johni.douglas.marangon@gmail.com
          </a>
          .
        </p>
      </section>

      {/* Coffee */}
      <section className="mb-16">
        <a
          href="https://www.buymeacoffee.com/johnidouglasmarangon"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start gap-3 rounded-md border border-border bg-surface p-6 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 transition-colors group-hover:border-fg">
              <Coffee className="h-5 w-5 text-fg" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
                Enjoying the project?
              </p>
              <p className="mt-1 text-base font-semibold text-fg sm:text-lg">
                Buy me a coffee ☕
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg">
            Support →
          </span>
        </a>
      </section>

      {/* Connect */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            Connect &amp; Explore
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            /links
          </span>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <ExternalCard
            href="https://www.linkedin.com/in/johnidouglas/"
            icon={<Linkedin className="h-5 w-5" />}
            title="LinkedIn"
            subtitle="Say hi — let's connect"
          />
          <ExternalCard
            href="https://github.com/johnidm/antenna"
            icon={<Github className="h-5 w-5" />}
            title="GitHub"
            subtitle="Source code & issues"
          />
        </div>
      </section>

      {/* Inspiration */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            Worth Checking Out
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            /inspiration
          </span>
        </header>

        <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
          <InspirationItem
            href="https://radio.garden/"
            name="Radio Garden"
            description="Explore live radio stations on an interactive globe."
          />
          <InspirationItem
            href="https://app.radiooooo.com/"
            name="Radiooooo"
            description="A musical time machine by country and decade."
          />
        </ul>
      </section>


      {/* REST API */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            REST API
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            /api
          </span>
        </header>

        <p className="mb-6 text-sm leading-relaxed text-fg-muted">
          Antenna exposes a public HTTP API so you can query the radio station database programmatically.
        </p>

        {/* Endpoint */}
        <div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
          <span className="shrink-0 rounded-sm bg-fg px-2 py-0.5 font-mono text-[11px] font-semibold text-bg">
            GET
          </span>
          <code className="font-mono text-sm text-fg">/api/radio/stations</code>
        </div>

        {/* Parameters */}
        <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          Query Parameters
        </h3>
        <div className="mb-6 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-2">
              <tr>
                {['Parameter', 'Type', 'Default', 'Description'].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {[
                ['pageSize', 'number', '20', 'Items per page (max 100)'],
                ['cursor', 'string', '—', "Opaque cursor from a previous response's pagination.nextCursor"],
                ['sortBy', 'name | country', 'name', 'Field to sort by'],
                ['order', 'asc | desc', 'asc', 'Sort direction'],
                ['country', 'string', '—', 'Filter by exact country name'],
                ['language', 'string', '—', 'Filter by exact language'],
                ['tag', 'string', '—', 'Filter stations that contain this tag'],
              ].map(([param, type, def, desc]) => (
                <tr key={param}>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-fg">{param}</code></td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{def}</td>
                  <td className="px-4 py-3 text-xs text-fg-muted">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Response */}
        <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          Response
        </h3>
        <pre className="mb-4 overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg-muted">
          {`{
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
    "nextPage": "https://antenna.show/api/radio/stations?pageSize=20&cursor=MDE4ZWRj...",
    "previousPage": "https://antenna.show/api/radio/stations?pageSize=20&cursor=MDAwMDAw...",
    "hasMore": true,
    "pageSize": 20
  }
}`}
        </pre>
        <ul className="mb-6 space-y-1.5 text-xs text-fg-muted">
          {[
            ['nextCursor', 'Pass as cursor in the next request; null when no more results.'],
            ['nextPage', 'Full URL to the next page; null when no more results.'],
            ['previousPage', 'Full URL to the previous page; null when at the first page.'],
            ['hasMore', 'true if another page exists.'],
          ].map(([field, desc]) => (
            <li key={field} className="flex gap-2">
              <code className="shrink-0 font-mono text-fg">{field}</code>
              <span>— {desc}</span>
            </li>
          ))}
        </ul>

        {/* Examples */}
        <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
          <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
          Examples
        </h3>
        <pre className="overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg-muted">
          {`# First page, 10 results sorted by name
curl "https://antenna.show/api/radio/stations?pageSize=10"

# Next page using cursor from previous response
curl "https://antenna.show/api/radio/stations?pageSize=10&cursor=<nextCursor>"

# Filter by country, sorted descending
curl "https://antenna.show/api/radio/stations?country=Germany&sortBy=name&order=desc"

# Filter by tag
curl "https://antenna.show/api/radio/stations?tag=jazz"`}
        </pre>
      </section>

      {/* Footer signature */}
      <footer className="mb-8 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
        <span className="inline-flex items-center gap-2">
          <Radio className="h-3.5 w-3.5" aria-hidden="true" />
          Antenna · Open Source
        </span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  )
}

function ExternalCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-md border border-border bg-surface p-4 transition-colors hover:bg-surface-2"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 text-fg transition-colors group-hover:border-fg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-fg">{title}</p>
        <p className="truncate text-[11px] uppercase tracking-widest text-fg-muted">
          {subtitle}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-fg-muted transition-colors group-hover:text-fg" />
    </a>
  )
}

function InspirationItem({
  href,
  name,
  description,
}: {
  href: string
  name: string
  description: string
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-2"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-fg">{name}</p>
          <p className="mt-1 text-sm text-fg-muted">{description}</p>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-fg-muted transition-colors group-hover:text-fg" />
      </a>
    </li>
  )
}
