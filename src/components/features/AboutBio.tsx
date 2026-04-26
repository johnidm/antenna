import { ExternalLink } from 'lucide-react'

export function AboutBio() {
  return (
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
      <p>
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
      <p>
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
  )
}
