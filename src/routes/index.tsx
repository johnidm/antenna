import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRandomStations } from '@/lib/repositories/stations'

const getStations = createServerFn({ method: 'GET' }).handler(async () => {
  return getRandomStations(20)
})

export const Route = createFileRoute('/')({
  loader: () => getStations(),
  component: StationsPage,
})

function StationsPage() {
  const stations = Route.useLoaderData()

  return (
    <main>
      <header className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-fg-muted">
            Live streams
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
            Radio Stations
          </h1>
        </div>
        <span className="shrink-0 rounded-sm border border-border px-2.5 py-1 font-mono text-xs text-fg-muted">
          {stations.length.toString().padStart(2, '0')} found
        </span>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((station) => (
          <li key={station.id}>
            <article className="group flex h-full flex-col gap-4 rounded-md border border-border bg-surface p-4 transition-colors hover:border-fg">
              <header className="flex items-start gap-3">
                {station.logoUrl ? (
                  <img
                    src={station.logoUrl}
                    alt=""
                    height={48}
                    width={48}
                    className="h-12 w-12 shrink-0 rounded-sm border border-border bg-surface-2 object-contain p-1 transition-all group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 font-mono text-sm text-fg-muted">
                    {station.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-medium text-fg" title={station.name}>
                    {station.name}
                  </h2>
                  {station.country && (
                    <small className="text-[11px] uppercase tracking-widest text-fg-muted">
                      {station.country}
                    </small>
                  )}
                </div>
              </header>

              {station.tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {station.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {station.streamUrl && (
                <audio
                  controls
                  preload="none"
                  src={station.streamUrl}
                  className="mt-auto h-9"
                />
              )}
            </article>
          </li>
        ))}
      </ul>
    </main>
  )
}


