import { Radio } from 'lucide-react'

export function AboutFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mb-8 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
      <span className="inline-flex items-center gap-2">
        <Radio className="h-3.5 w-3.5" aria-hidden="true" />
        Antenna · Open Source
      </span>
      <span>© {year}</span>
    </footer>
  )
}
