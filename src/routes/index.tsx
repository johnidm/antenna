import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'

const getStations = createServerFn({ method: 'GET' }).handler(async () => {
  return db.radioStation.findMany({
    orderBy: { name: 'asc' },
  })
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
        {stations.map((station: any) => (
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
                  {station.tags.slice(0, 3).map((tag: string) => (
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


