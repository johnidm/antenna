import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { getRandomStations, getStationsPaginated } from '@/lib/repositories/stations'

type FetchStationsInput = {
  query?: string
  cursorId?: string
  pageSize?: number
  country?: string
}

export const fetchStationCount = createServerFn({ method: 'GET' }).handler(async () => {
  return db.radioStation.count()
})

export const fetchCountries = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.radioStation.findMany({
    where: { country: { not: null } },
    select: { country: true },
    distinct: ['country'],
    orderBy: { country: 'asc' },
  })
  return rows.map((r) => r.country as string)
})

export const fetchStations = createServerFn({ method: 'GET' })
  .inputValidator((data: FetchStationsInput) => data)
  .handler(async ({ data }) => {
    try {
      const query = data.query?.trim() || undefined
      const country = data.country?.trim() || undefined
      const pageSize = data.pageSize ?? 20

      // No query, no country filter, no pagination cursor => random stations (discovery mode)
      if (!query && !country && !data.cursorId) {
        const items = await getRandomStations(pageSize)
        return {
          ok: true as const,
          items,
          hasMore: false,
          hasPrev: false,
        }
      }

      const result = await getStationsPaginated({
        query,
        country,
        cursorId: data.cursorId,
        pageSize,
        sortBy: 'name',
        order: 'asc',
      })
      return {
        ok: true as const,
        items: result.items,
        hasMore: result.hasMore,
        hasPrev: result.hasPrev,
      }
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : 'Unknown error',
      }
    }
  })
