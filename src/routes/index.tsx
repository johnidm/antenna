import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  getRandomStations,
  getNextStation,
  getPreviousStation,
} from '@/lib/repositories/stations'
import { InlinePlayer } from '@/components/InlinePlayer'
import { Player } from '@/components/Player'

const getStations = createServerFn({ method: 'GET' }).handler(async () => {
  return getRandomStations(20)
})

const fetchNextStation = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(({ data }) => getNextStation(data.id))

const fetchPreviousStation = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(({ data }) => getPreviousStation(data.id))

type Station = Awaited<ReturnType<typeof getStations>>[number]

export const Route = createFileRoute('/')({
  loader: () => getStations(),
  component: StationsPage,
})

function StationsPage() {
  const stations = Route.useLoaderData()

  const playableStations = stations.filter((s) => !!s.streamUrl)

  const [currentStation, setCurrentStation] = useState<Station | null>(() => {
    if (playableStations.length === 0) return null
    return playableStations[Math.floor(Math.random() * playableStations.length)]
  })
  const [loading, setLoading] = useState(false)
  const [atStart, setAtStart] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  const goPrev = async () => {
    if (!currentStation || loading) return
    setLoading(true)
    try {
      const prev = await fetchPreviousStation({ data: { id: currentStation.id } })
      if (prev) {
        setCurrentStation(prev as Station)
        setAtEnd(false)
      } else {
        setAtStart(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const goNext = async () => {
    if (!currentStation || loading) return
    setLoading(true)
    try {
      const next = await fetchNextStation({ data: { id: currentStation.id } })
      if (next) {
        setCurrentStation(next as Station)
        setAtStart(false)
      } else {
        setAtEnd(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <header className="mb-10 flex flex-col gap-6 border-b border-border pb-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-fg-muted">
              Live streams
            </p>
            <h1 className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
              Radio Stations
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              onClick={goPrev}
              disabled={!currentStation || loading || atStart}
            >
              Prev
            </button>
            <button
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              onClick={goNext}
              disabled={!currentStation || loading || atEnd}
            >
              Next
            </button>
          </div>
        </div>

        {currentStation && currentStation.streamUrl && (
          <Player
            src={currentStation.streamUrl}
            title={currentStation.name}
            subtitle={currentStation.country ?? 'Ready'}
          />
        )}
      </header>

      <section>
        <header className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-mono text-lg font-semibold tracking-tight text-fg">
            Recommended Stations
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            {stations.length.toString().padStart(2, '0')} picks
          </span>
        </header>

        <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
          {stations.map((station) => {
            const isActive = currentStation?.id === station.id
            const selectStation = () => {
              if (!station.streamUrl) return
              setCurrentStation(station)
              setAtStart(false)
              setAtEnd(false)
            }
            return (
            <li
              key={station.id}
              onClick={selectStation}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  selectStation()
                }
              }}
              role={station.streamUrl ? 'button' : undefined}
              tabIndex={station.streamUrl ? 0 : undefined}
              aria-pressed={station.streamUrl ? isActive : undefined}
              className={`group flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:gap-4 ${
                station.streamUrl ? 'cursor-pointer hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2' : ''
              } ${isActive ? 'bg-surface-2' : ''}`}
            >
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
                <h3 className="truncate font-medium text-fg" title={station.name}>
                  {station.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {station.country && (
                    <small className="text-[11px] uppercase tracking-widest text-fg-muted">
                      {station.country}
                    </small>
                  )}
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
                </div>
              </div>

              {station.streamUrl && (
                <div
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <InlinePlayer src={station.streamUrl} />
                </div>
              )}
            </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}


