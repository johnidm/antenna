import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useSearch } from '@/lib/searchContext'

export default function Header() {
  const { query, setQuery, submit } = useSearch()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-3 sm:h-20 sm:gap-4 sm:px-6 lg:h-24 lg:gap-6">
        {/* LEFT: wordmark */}
        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-baseline gap-1.5 font-mono leading-none sm:gap-2.5">
            <span className="text-base font-bold tracking-tight text-fg sm:text-lg lg:text-xl">
              ANTENNA
            </span>
            <span className="hidden text-base font-normal tracking-tight text-fg-muted sm:inline sm:text-lg lg:text-xl">
              LIVE
            </span>
          </Link>
        </div>

        {/* CENTER: search */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="flex min-w-0 flex-1 justify-center"
        >
          <div className="relative flex h-10 w-full max-w-2xl items-center rounded-full border border-border bg-surface pl-4 pr-1 transition-colors focus-within:border-fg sm:h-12 sm:pl-5 sm:pr-1.5 lg:h-14 lg:pl-6">
            <Search className="h-4 w-4 shrink-0 text-fg-muted sm:h-5 sm:w-5" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stations..."
              className="ml-2 min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-fg-muted focus:outline-none sm:ml-3 sm:text-base"
              aria-label="Search"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-8 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-fg-muted transition-colors hover:border-fg hover:text-fg sm:h-9 sm:w-14 lg:h-11 lg:w-16"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </form>

        {/* RIGHT: nav links, bell, avatar */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
          <Link
            to="/"
            className="hidden h-10 items-center rounded-full px-3 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex lg:h-12 lg:px-5 lg:text-sm"
            activeProps={{ className: 'text-fg bg-surface-2' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="hidden h-10 items-center rounded-full px-3 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex lg:h-12 lg:px-5 lg:text-sm"
            activeProps={{ className: 'text-fg bg-surface-2' }}
          >
            About
          </Link>

        </div>
      </nav>
    </header>
  )
}
