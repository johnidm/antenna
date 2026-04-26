import { Radio } from 'lucide-react'

type StationCountCardProps = {
  count: number
}

export function StationCountCard({ count }: StationCountCardProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col items-start gap-4 rounded-md border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-fg-muted">Database</p>
          <p className="font-mono text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {count.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-fg-muted">radio stations available to stream from around the world.</p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2">
          <Radio className="h-7 w-7 text-fg" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
