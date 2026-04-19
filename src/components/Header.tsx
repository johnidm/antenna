import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6 h-14">
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <span className="inline-block h-2 w-2 rounded-sm bg-fg transition-transform group-hover:scale-125" />
          <span>Antenna</span>
        </Link>

        <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-fg-muted">
          <Link
            to="/"
            className="transition-colors hover:text-fg"
            activeProps={{ className: 'text-fg' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-fg"
            activeProps={{ className: 'text-fg' }}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
