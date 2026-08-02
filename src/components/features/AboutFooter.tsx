import { Radio } from 'lucide-react'
import { LINKS } from '@/lib/constants/links'

const CURRENT_YEAR = new Date().getFullYear()

export function AboutFooter({ version }: { version: string }) {
  return (
    <footer className="mb-8 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
      <span className="inline-flex items-center gap-2">
        <Radio className="h-3.5 w-3.5" aria-hidden="true" />
        Antenna · Open Source
        <a
          href={LINKS.releases}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg-muted/60 transition-colors hover:text-fg"
        >
          · v{version}
        </a>
      </span>
      <span>© {CURRENT_YEAR}</span>
    </footer>
  )
}
