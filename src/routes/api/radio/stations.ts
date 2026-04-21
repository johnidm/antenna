import { createFileRoute } from '@tanstack/react-router'
import { getRequestUrl } from '@tanstack/react-start/server'
import { getStationsPaginated } from '@/lib/repositories/stations'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  encodeCursor,
  decodeCursor,
  buildNextPageUrl,
  buildPrevPageUrl,
} from '@/lib/pagination'

const SORT_FIELDS = ['name', 'country'] as const
const ORDER_VALUES = ['asc', 'desc'] as const

type SortField = (typeof SORT_FIELDS)[number]
type Order = (typeof ORDER_VALUES)[number]

export const Route = createFileRoute('/api/radio/stations')({
  server: {
    handlers: {
      GET: async () => {
        const url = getRequestUrl()
        const sp = url.searchParams

        const cursorParam = sp.get('cursor') ?? undefined
        const beforeParam = sp.get('before') ?? undefined

        const rawPageSize = Number(sp.get('pageSize') ?? DEFAULT_PAGE_SIZE)
        const pageSize = Math.min(
          Math.max(1, Number.isNaN(rawPageSize) ? DEFAULT_PAGE_SIZE : rawPageSize),
          MAX_PAGE_SIZE,
        )

        const sortByParam = sp.get('sortBy') ?? 'name'
        const sortBy: SortField = (SORT_FIELDS as readonly string[]).includes(sortByParam)
          ? (sortByParam as SortField)
          : 'name'

        const orderParam = sp.get('order') ?? 'asc'
        const order: Order = (ORDER_VALUES as readonly string[]).includes(orderParam)
          ? (orderParam as Order)
          : 'asc'

        const country = sp.get('country') ?? undefined
        const language = sp.get('language') ?? undefined
        const tag = sp.get('tag') ?? undefined

        let cursorId: string | undefined
        if (cursorParam) {
          try {
            cursorId = decodeCursor(cursorParam)
          } catch {
            return Response.json({ error: 'Invalid cursor' }, { status: 400 })
          }
        }

        let beforeId: string | undefined
        if (beforeParam) {
          try {
            beforeId = decodeCursor(beforeParam)
          } catch {
            return Response.json({ error: 'Invalid before cursor' }, { status: 400 })
          }
        }

        const { items: page, hasMore, hasPrev } = await getStationsPaginated({
          pageSize,
          cursorId,
          beforeId,
          sortBy: sortBy as 'name' | 'country',
          order: order as 'asc' | 'desc',
          country,
          language,
          tag,
        })

        const lastItem = page[page.length - 1]
        const firstItem = page[0]

        const nextCursor = hasMore && lastItem ? encodeCursor(lastItem.id) : null
        const prevCursor = hasPrev && firstItem ? encodeCursor(firstItem.id) : null

        return Response.json({
          data: page,
          pagination: {
            nextCursor,
            nextPage: buildNextPageUrl(url, nextCursor),
            prevPage: buildPrevPageUrl(url, prevCursor),
            hasMore,
            pageSize,
          },
        })
      },
    },
  },
})
