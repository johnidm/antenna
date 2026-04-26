import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { AboutHero } from '@/components/features/AboutHero'
import { AboutBio } from '@/components/features/AboutBio'
import { AboutFooter } from '@/components/features/AboutFooter'
import { ApiDocs } from '@/components/features/ApiDocs'
import { BuyMeCoffeeCard } from '@/components/features/BuyMeCoffeeCard'
import { ConnectSection } from '@/components/features/ConnectSection'
import { InspirationSection } from '@/components/features/InspirationSection'
import { StationCountCard } from '@/components/features/StationCountCard'

const getStationCount = createServerFn({ method: 'GET' }).handler(async () => {
  return db.radioStation.count()
})

export const Route = createFileRoute('/about')({
  loader: () => getStationCount(),
  component: About,
})

function About() {
  const count = Route.useLoaderData()
  return (
    <main>
      <AboutHero />
      <StationCountCard count={count} />
      <AboutBio />
      <BuyMeCoffeeCard />
      <ConnectSection />
      <InspirationSection />
      <ApiDocs />
      <AboutFooter />
    </main>
  )
}
