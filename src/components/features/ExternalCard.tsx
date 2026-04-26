import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'

export function ExternalCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-md border border-border bg-surface p-4 transition-colors hover:bg-surface-2"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 text-fg transition-colors group-hover:border-fg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-fg">{title}</p>
        <p className="truncate text-[11px] uppercase tracking-widest text-fg-muted">{subtitle}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-fg-muted transition-colors group-hover:text-fg" />
    </a>
  )
}

