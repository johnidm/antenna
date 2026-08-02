import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import pkg from '../../package.json' with { type: 'json' }
import { db } from '@/lib/db'
import { AboutHero } from '@/components/features/AboutHero'
import { AboutBio } from '@/components/features/AboutBio'
import { AboutFooter } from '@/components/features/AboutFooter'
import { ApiDocs } from '@/components/features/ApiDocs'
import { BuyMeCoffeeCard } from '@/components/features/BuyMeCoffeeCard'
import { ConnectSection } from '@/components/features/ConnectSection'
import { InspirationSection } from '@/components/features/InspirationSection'
import { StationCountCard } from '@/components/features/StationCountCard'

const getAboutData = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    count: await db.radioStation.count(),
    version: pkg.version,
  }
})

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About · Antenna' },
      { name: 'description', content: 'Learn about Antenna — a radio streaming app built by Johni from Brazil.' },
    ],
  }),
  loader: () => getAboutData(),
  component: About,
})

function About() {
  const { count, version } = Route.useLoaderData()
  return (
    <main>
      <AboutHero />
      <StationCountCard count={count} />
      <AboutBio />
      <BuyMeCoffeeCard />
      <ConnectSection />
      <InspirationSection />
      <ApiDocs />
      <AboutFooter version={version} />
    </main>
  )
}
