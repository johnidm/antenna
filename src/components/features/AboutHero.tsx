export function AboutHero() {
  return (
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
  )
}
