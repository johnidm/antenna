import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { fetchStations } from '@/lib/services/stations'
import { usePlayer, type Station } from '@/lib/playerContext'
import { useSearch } from '@/lib/searchContext'
import { InlinePlayer } from '@/components/InlinePlayer'

export const Route = createFileRoute('/')({
  component: StationsPage,
})

const PAGE_SIZE = 20

function StationsPage() {
  const { submittedQuery } = useSearch()
  const { currentStation, setCurrentStation } = usePlayer()

  const [items, setItems] = useState<Station[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)
  const preselectedRef = useRef(false)

  const load = async (query: string, cursorId?: string) => {
    const isInitial = !cursorId
    if (isInitial) {
      setLoading(true)
      setError(null)
    } else {
      setLoadingMore(true)
    }

    const id = ++requestIdRef.current
    try {
      const res = await fetchStations({ data: { query, cursorId, pageSize: PAGE_SIZE } })
      if (id !== requestIdRef.current) return // stale response

      if (!res.ok) {
        setError(res.error)
        if (isInitial) setItems([])
        setHasMore(false)
        return
      }

      const newItems = res.items as Station[]
      setItems((prev) => (isInitial ? newItems : [...prev, ...newItems]))
      setHasMore(res.hasMore)
    } catch (e) {
      if (id !== requestIdRef.current) return
      setError(e instanceof Error ? e.message : 'Failed to load stations')
      if (isInitial) setItems([])
      setHasMore(false)
    } finally {
      if (id === requestIdRef.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }

  // Reload whenever the submitted query changes
  useEffect(() => {
    load(submittedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery])

  // Preselect the first playable station once items are available
  useEffect(() => {
    if (preselectedRef.current) return
    if (currentStation) {
      preselectedRef.current = true
      return
    }
    const pick = items.find((s) => !!s.streamUrl)
    if (pick) {
      setCurrentStation(pick)
      preselectedRef.current = true
    }
  }, [items, currentStation, setCurrentStation])

  const loadMore = () => {
    if (loadingMore || loading || !hasMore) return
    const last = items[items.length - 1]
    if (!last) return
    load(submittedQuery, last.id)
  }

  return (
    <main>
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:mb-10 sm:gap-6 sm:pb-6">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-fg-muted sm:text-xs">
            Live streams
          </p>
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            {submittedQuery ? `Results for "${submittedQuery}"` : 'Radio Stations'}
          </h1>
        </div>
      </header>

      <section>
        <header className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            {submittedQuery ? 'Matching Stations' : 'Recommended Stations'}
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            {items.length.toString().padStart(2, '0')} shown
          </span>
        </header>

        {error && !loading && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4">
            <p className="font-mono text-xs text-fg-muted">
              {error}
            </p>
            <button
              type="button"
              onClick={() => load(submittedQuery)}
              className="rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-fg"
            >
              Retry
            </button>
          </div>
        )}

        {loading && items.length === 0 ? (
          <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-fg-muted">
            Loading stations...
          </p>
        ) : !loading && items.length === 0 && !error ? (
          <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-fg-muted">
            {submittedQuery
              ? `No stations found for "${submittedQuery}"`
              : 'No stations available'}
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
            {items.map((station) => {
              const isActive = currentStation?.id === station.id
              const selectStation = () => {
                if (!station.streamUrl) return
                setCurrentStation(station)
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
                  className={`group flex flex-col gap-3 p-3 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:p-4 ${
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
                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                      <InlinePlayer src={station.streamUrl} />
                      <div
                        className="rounded-sm border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg"
                      >
                        Play on Main
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {hasMore && items.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-sm border border-border px-5 py-2 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'See more'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
