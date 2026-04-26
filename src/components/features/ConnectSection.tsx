import { Github, Linkedin } from 'lucide-react'
import { ExternalCard } from '@/components/features/ExternalCard'

export function ConnectSection() {
  return (
    <section className="mb-12">
      <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">Connect &amp; Explore</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">/links</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <ExternalCard
          href="https://www.linkedin.com/in/johnidouglas/"
          icon={<Linkedin className="h-5 w-5" />}
          title="LinkedIn"
          subtitle="Say hi — let's connect"
        />
        <ExternalCard
          href="https://github.com/johnidm/antenna"
          icon={<Github className="h-5 w-5" />}
          title="GitHub"
          subtitle="Source code & issues"
        />
      </div>
    </section>
  )
}
