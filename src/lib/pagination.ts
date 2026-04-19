export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const encodeCursor = (id: string): string => btoa(id)

export const decodeCursor = (cursor: string): string => atob(cursor)

export const buildNextPageUrl = (currentUrl: URL, nextCursor: string | null): string | null => {
  if (!nextCursor) return null
  const url = new URL(currentUrl.toString())
  url.searchParams.delete('before')
  url.searchParams.set('cursor', nextCursor)
  return url.toString()
}

export const buildPrevPageUrl = (currentUrl: URL, prevCursor: string | null): string | null => {
  if (!prevCursor) return null
  const url = new URL(currentUrl.toString())
  url.searchParams.delete('cursor')
  url.searchParams.set('before', prevCursor)
  return url.toString()
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    nextCursor: string | null
    nextPage: string | null
    prevPage: string | null
    hasMore: boolean
    pageSize: number
  }
}
