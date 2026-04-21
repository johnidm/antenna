import { createFileRoute } from '@tanstack/react-router'
import { Coffee, Github, Linkedin, Radio, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative mb-10 border-b border-border pb-10 sm:mb-14 sm:pb-14">
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

      {/* Story */}
      <section className="mb-12 space-y-5 text-base leading-relaxed text-fg sm:text-lg">
        <p>
          Hi, I&apos;m <span className="font-semibold">Johni</span> — a software engineer from Brazil.
          Since <span className="font-mono">2008</span>, I&apos;ve been using technology to make my
          daily life better, and occasionally just to have fun.
        </p>
        <p>
          As an enthusiast of radio, I built this project to help me discover stations from around
          the world. Radio takes me back to my childhood — I was born and raised in the countryside,
          where listening to the radio was a big part of growing up.
        </p>
        <p className="text-fg-muted">
          This is an open source project. You can find the source code on{' '}
          <a
            href="https://github.com/johnidm/antenna"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 border-b border-border text-fg transition-colors hover:border-fg"
          >
            GitHub
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          .
        </p>
        <p className="text-fg-muted">
          Have a suggestion to improve the project? Send me an email at{' '}
          <a
            href="mailto:johni.douglas.marangon@gmail.com"
            className="inline-flex items-center gap-1 border-b border-border text-fg transition-colors hover:border-fg"
          >
            johni.douglas.marangon@gmail.com
          </a>
          .
        </p>
      </section>

      {/* Connect */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            Connect &amp; Explore
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            /links
          </span>
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

      {/* Inspiration */}
      <section className="mb-12">
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">
            Worth Checking Out
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            /inspiration
          </span>
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

      {/* Coffee */}
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
              <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
                Enjoying the project?
              </p>
              <p className="mt-1 text-base font-semibold text-fg sm:text-lg">
                Buy me a coffee ☕
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg">
            Support →
          </span>
        </a>
      </section>

      {/* Footer signature */}
      <footer className="mb-8 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
        <span className="inline-flex items-center gap-2">
          <Radio className="h-3.5 w-3.5" aria-hidden="true" />
          Antenna · Open Source
        </span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  )
}

function ExternalCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
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
        <p className="truncate text-[11px] uppercase tracking-widest text-fg-muted">
          {subtitle}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-fg-muted transition-colors group-hover:text-fg" />
    </a>
  )
}

function InspirationItem({
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
