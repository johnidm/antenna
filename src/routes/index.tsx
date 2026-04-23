import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { fetchStations, fetchCountries, fetchStationCount } from '@/lib/services/stations'
import { usePlayer, type Station } from '@/lib/playerContext'
import { useSearch } from '@/lib/searchContext'
import { InlinePlayer } from '@/components/InlinePlayer'

export const Route = createFileRoute('/')({
  component: StationsPage,
})

// TODO move the const to a file `lib/constants.ts`
const PAGE_SIZE = 20

function StationsPage() {
  const { submittedQuery } = useSearch()
  const { currentStation, setCurrentStation } = usePlayer()

  const [items, setItems] = useState<Station[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [countries, setCountries] = useState<string[]>([])
  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  const [totalStations, setTotalStations] = useState<number | null>(null)

  const requestIdRef = useRef(0)
  const preselectedRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const load = async (query: string, country: string | null, cursorId?: string) => {
    const isInitial = !cursorId
    if (isInitial) {
      setLoading(true)
      setError(null)
    } else {
      setLoadingMore(true)
    }

    const id = ++requestIdRef.current
    try {
      const res = await fetchStations({
        data: {
          query,
          country: country ?? undefined,
          cursorId,
          pageSize: PAGE_SIZE,
        },
      })
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

  // Fetch available countries once on mount
  useEffect(() => {
    fetchCountries().then(setCountries).catch(() => {})
    fetchStationCount().then(setTotalStations).catch(() => {})
  }, [])

  // Reload whenever the submitted query or active country changes
  useEffect(() => {
    preselectedRef.current = false
    load(submittedQuery, activeCountry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery, activeCountry])

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
    load(submittedQuery, activeCountry, last.id)
  }

  const toggleCountry = (country: string) => {
    setActiveCountry((prev) => (prev === country ? null : country))
  }

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  const scrollNav = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  // Initialise scroll button visibility once countries load
  useEffect(() => {
    updateScrollButtons()
  }, [countries])

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
          {!submittedQuery && totalStations !== null && (
            <p className="mt-2 font-mono text-sm text-fg-muted sm:text-base">
              Explore {totalStations.toLocaleString('en-US')} stations around the world
            </p>
          )}
        </div>

        {/* Country tag navigation */}
        {countries.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Left arrow */}
            <button
              type="button"
              onClick={() => scrollNav('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll countries left"
              className="nav-arrow shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Scrollable pill row */}
            <div className="relative min-w-0 flex-1">
              <div
                ref={scrollRef}
                onScroll={updateScrollButtons}
                className="country-scroll flex gap-1.5 overflow-x-auto py-0.5"
                style={{ scrollbarWidth: 'none' }}
              >
                <button
                  type="button"
                  onClick={() => setActiveCountry(null)}
                  className={`tag-pill shrink-0 ${
                    activeCountry === null ? 'tag-pill--active' : 'tag-pill--idle'
                  }`}
                >
                  All
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleCountry(country)}
                    className={`tag-pill shrink-0 ${
                      activeCountry === country ? 'tag-pill--active' : 'tag-pill--idle'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {/* Left fade */}
              <div className={`pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-bg to-transparent transition-opacity duration-200 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`} />
              {/* Right fade */}
              <div className={`pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-bg to-transparent transition-opacity duration-200 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`} />
            </div>

            {/* Right arrow */}
            <button
              type="button"
              onClick={() => scrollNav('right')}
              disabled={!canScrollRight}
              aria-label="Scroll countries right"
              className="nav-arrow shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </header>

      <section>
        <header className="mb-3 flex items-end justify-between gap-4 sm:mb-4">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            {activeCountry
              ? `Stations in ${activeCountry}`
              : submittedQuery
                ? 'Matching Stations'
                : 'Recommended Stations'}
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            {items.length.toString().padStart(2, '0')} shown
          </span>
        </header>

        {error && !loading && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4">
            <p className="font-mono text-xs text-fg-muted">{error}</p>
            <button
              type="button"
              onClick={() => load(submittedQuery, activeCountry)}
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
              : activeCountry
                ? `No stations found for ${activeCountry}`
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
                    station.streamUrl
                      ? 'cursor-pointer hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2'
                      : ''
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

                  {(station.streamUrl || station.homepageUrl) && (
                    <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                      {station.homepageUrl && (
                        <a
                          href={station.homepageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          aria-label={`Open ${station.name} homepage`}
                          title="Open homepage"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border text-fg-muted transition-colors hover:border-fg hover:text-fg"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {station.streamUrl && (
                        <>
                          <InlinePlayer src={station.streamUrl} />
                          <div className="rounded-sm border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg">
                            Play on Main
                          </div>
                        </>
                      )}
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
