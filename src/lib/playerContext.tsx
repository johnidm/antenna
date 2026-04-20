import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getNextStation, getPreviousStation } from '@/lib/repositories/stations'

export type Station = {
  id: string
  name: string
  country: string | null
  language: string | null
  streamUrl: string | null
  homepageUrl: string | null
  logoUrl: string | null
  tags: string[]
}

const fetchNextStation = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(({ data }) => getNextStation(data.id))

const fetchPreviousStation = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(({ data }) => getPreviousStation(data.id))

type PlayerContextValue = {
  currentStation: Station | null
  setCurrentStation: (station: Station | null) => void
  playStation: (station: Station) => void
  playRequestTick: number
  playPrev: () => Promise<void>
  playNext: () => Promise<void>
  loading: boolean
  atStart: boolean
  atEnd: boolean
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentStation, setCurrentStationState] = useState<Station | null>(null)
  const [playRequestTick, setPlayRequestTick] = useState(0)
  const [loading, setLoading] = useState(false)
  const [atStart, setAtStart] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  const setCurrentStation = useCallback((station: Station | null) => {
    setCurrentStationState(station)
    setAtStart(false)
    setAtEnd(false)
  }, [])

  const playStation = useCallback((station: Station) => {
    setCurrentStationState(station)
    setAtStart(false)
    setAtEnd(false)
    setPlayRequestTick((t) => t + 1)
  }, [])

  const playPrev = useCallback(async () => {
    if (!currentStation || loading) return
    setLoading(true)
    try {
      const prev = await fetchPreviousStation({ data: { id: currentStation.id } })
      if (prev) {
        setCurrentStationState(prev as Station)
        setAtEnd(false)
      } else {
        setAtStart(true)
      }
    } finally {
      setLoading(false)
    }
  }, [currentStation, loading])

  const playNext = useCallback(async () => {
    if (!currentStation || loading) return
    setLoading(true)
    try {
      const next = await fetchNextStation({ data: { id: currentStation.id } })
      if (next) {
        setCurrentStationState(next as Station)
        setAtStart(false)
      } else {
        setAtEnd(true)
      }
    } finally {
      setLoading(false)
    }
  }, [currentStation, loading])

  return (
    <PlayerContext.Provider
      value={{
        currentStation,
        setCurrentStation,
        playStation,
        playRequestTick,
        playPrev,
        playNext,
        loading,
        atStart,
        atEnd,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider')
  return ctx
}
