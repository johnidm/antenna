import { db } from '@/lib/db'

type SortField = 'name' | 'country'
type Order = 'asc' | 'desc'

interface GetStationsPaginatedOptions {
  pageSize: number
  cursorId?: string
  beforeId?: string
  sortBy: SortField
  order: Order
  country?: string
  language?: string
  tag?: string
}

interface PaginatedStationsResult {
  items: Awaited<ReturnType<typeof db.radioStation.findMany>>
  hasMore: boolean
  hasPrev: boolean
}

export async function getRandomStations(take = 20) {
  const count = await db.radioStation.count()
  const randomSkip = Math.floor(Math.random() * (count - take))

  return db.radioStation.findMany({
    skip: randomSkip,
    take,
  })
}

export async function getNextStation(id: string) {
  return db.radioStation.findFirst({
    where: {
      id: { gt: id },
      streamUrl: { not: null },
    },
    orderBy: { id: 'asc' },
  })
}

export async function getPreviousStation(id: string) {
  return db.radioStation.findFirst({
    where: {
      id: { lt: id },
      streamUrl: { not: null },
    },
    orderBy: { id: 'desc' },
  })
}

export async function getStationsPaginated(
  options: GetStationsPaginatedOptions
): Promise<PaginatedStationsResult> {
  const { pageSize, cursorId, beforeId, sortBy, order, country, language, tag } = options

  const isBackwards = beforeId !== undefined

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

  const orderedItems = isBackwards ? [...items].reverse() : items

  const hasMore = isBackwards ? orderedItems.length > 0 : orderedItems.length > pageSize
  const hasPrev = isBackwards ? orderedItems.length > pageSize : cursorId !== undefined

  return {
    items: orderedItems.slice(0, pageSize),
    hasMore,
    hasPrev,
  }
}
