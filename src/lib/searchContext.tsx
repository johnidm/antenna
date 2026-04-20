import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

const DEBOUNCE_MS = 400

type SearchContextValue = {
  query: string
  setQuery: (q: string) => void
  submittedQuery: string
  submit: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    clearTimer()
    timerRef.current = setTimeout(() => {
      setSubmittedQuery(query)
      timerRef.current = null
    }, DEBOUNCE_MS)
    return clearTimer
  }, [query])

  const submit = useCallback(() => {
    clearTimer()
    setSubmittedQuery(query)
  }, [query])

  return (
    <SearchContext.Provider value={{ query, setQuery, submittedQuery, submit }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider')
  return ctx
}
