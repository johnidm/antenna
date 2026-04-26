const EQ_BARS: ReadonlyArray<{ delay: number; height: number }> = [
  { delay: 0, height: 24 },
  { delay: 0.15, height: 32 },
  { delay: 0.3, height: 40 },
  { delay: 0.45, height: 32 },
  { delay: 0.6, height: 24 },
]

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
        Tuning in
      </p>

      <div aria-hidden="true" className="flex h-10 items-end gap-1.5">
        {EQ_BARS.map((bar, i) => (
          <span
            key={i}
            className="animate-eq-bar block w-1.5 rounded-sm bg-fg"
            style={{
              height: `${bar.height}px`,
              animationDelay: `${bar.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="space-y-2">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Catching the signal&hellip;
        </h1>
        <p className="max-w-sm text-sm text-fg-muted">
          Hold tight while we lock onto the frequency.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="relative h-[2px] w-48 overflow-hidden rounded-full border border-border bg-surface-2"
      >
        <span className="player-bar-buffer absolute inset-y-0 left-0 w-1/3 bg-fg" />
      </div>

      <span className="sr-only">Loading&hellip;</span>
    </main>
  )
}
