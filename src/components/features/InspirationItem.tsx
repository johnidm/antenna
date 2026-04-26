import { ExternalLink } from 'lucide-react'

export function InspirationItem({
  href,
  name,
  description,
}: {
  href: string
  name: string
  description: string
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-2"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-fg">{name}</p>
          <p className="mt-1 text-sm text-fg-muted">{description}</p>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-fg-muted transition-colors group-hover:text-fg" />
      </a>
    </li>
  )
}

