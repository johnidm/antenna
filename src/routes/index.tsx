import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'

const getStations = createServerFn({ method: 'GET' }).handler(async () => {
  const count = await db.radioStation.count()
  const take = 20

  const randomSkip = Math.floor(Math.random() * (count - take))
  console.log("[DEBUG] Total stations:", count)
  const stations = await db.radioStation.findMany({
    skip: randomSkip,
    take,
  })

  return stations
})

export const Route = createFileRoute('/')({
  loader: () => getStations(),
  component: StationsPage,
})

function StationsPage() {
  const stations = Route.useLoaderData()

  return (
    <main>
      <h1>Radio Stations</h1>
      <p>{stations.length} stations found</p>

      <div>
        {stations.map((station) => (
          <article key={station.id}>
            {station.logoUrl && (
              <img
                src={station.logoUrl}
                alt={station.name}
                height={50}
                width={50}
              />
            )}
            <div>
              <h2>{station.name}</h2>
              {station.country && <p>{station.country}</p>}
              {station.tags.length > 0 && (
                <div>
                  {station.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              {station.streamUrl && (
                <a href={station.streamUrl} target="_blank" rel="noopener noreferrer">
                  ▶ Stream
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}


