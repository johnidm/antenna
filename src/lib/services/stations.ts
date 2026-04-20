import { createServerFn } from '@tanstack/react-start'
import { getRandomStations, getStationsPaginated } from '@/lib/repositories/stations'

type FetchStationsInput = {
  query?: string
  cursorId?: string
  pageSize?: number
}

export const fetchStations = createServerFn({ method: 'GET' })
  .inputValidator((data: FetchStationsInput) => data)
  .handler(async ({ data }) => {
    try {
      const query = data.query?.trim() || undefined
      const pageSize = data.pageSize ?? 20

      // No query and no pagination cursor => random stations (discovery mode)
      if (!query && !data.cursorId) {
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
