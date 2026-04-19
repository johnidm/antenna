import { createFileRoute } from '@tanstack/react-router'
import { getRequestUrl } from '@tanstack/react-start/server'
import { db } from '@/lib/db'
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

export const Route = createFileRoute('/api/radios/stations')({
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

        const isBackwards = beforeId !== undefined

        // Flip sort direction when navigating backwards so we can use cursor pagination
        const activeOrder = isBackwards ? (order === 'asc' ? 'desc' : 'asc') : order
        const idOrder: 'asc' | 'desc' = isBackwards ? 'desc' : 'asc'

        const orderBy =
          sortBy === 'country'
            ? [{ country: activeOrder }, { id: idOrder }]
            : [{ name: activeOrder }, { id: idOrder }]

        const activeCursorId = isBackwards ? beforeId : cursorId

        const items = await db.radioStation.findMany({
          where: {
            ...(country !== undefined && { country }),
            ...(language !== undefined && { language }),
            ...(tag !== undefined && { tags: { has: tag } }),
          },
          orderBy,
          ...(activeCursorId !== undefined && { cursor: { id: activeCursorId }, skip: 1 }),
          take: pageSize + 1,
        })

        // Restore original sort order after a backwards fetch
        const orderedItems = isBackwards ? [...items].reverse() : items

        const hasMore = isBackwards ? orderedItems.length > 0 : orderedItems.length > pageSize
        const hasPrev = isBackwards ? orderedItems.length > pageSize : !!cursorParam

        const page = orderedItems.slice(0, pageSize)
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
