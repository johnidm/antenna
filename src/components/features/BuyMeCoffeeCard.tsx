import { Coffee } from 'lucide-react'

export function BuyMeCoffeeCard() {
  return (
    <section className="mb-16">
      <a
        href="https://www.buymeacoffee.com/johnidouglasmarangon"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-start gap-3 rounded-md border border-border bg-surface p-6 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 transition-colors group-hover:border-fg">
            <Coffee className="h-5 w-5 text-fg" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">Enjoying the project?</p>
            <p className="mt-1 text-base font-semibold text-fg sm:text-lg">Buy me a coffee ☕</p>
          </div>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg">
          Support →
        </span>
      </a>
    </section>
  )
}
