import { InspirationItem } from '@/components/features/InspirationItem'

export function InspirationSection() {
  return (
    <section className="mb-12">
      <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">Worth Checking Out</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">/inspiration</span>
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
  )
}
