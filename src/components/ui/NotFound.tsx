import { Link } from '@tanstack/react-router'

export function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
                Signal lost
            </p>
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                404 — Page not found
            </h1>
            <p className="max-w-md text-sm text-fg-muted">
                The frequency you were tuning to does not exist. Try returning to the main dial.
            </p>
            <Link
                to="/"
                className="mt-2 rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-fg transition-colors hover:border-fg"
            >
                Back to stations
            </Link>
        </main>
    )
}
