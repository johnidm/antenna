import { useCallback, useEffect, useRef, useState } from 'react'
import { claim, release } from '@/lib/audioRegistry'

type UseAudioOptions = {
  src: string | null
  onPlay?: () => void
  // When true, changing src auto-plays (after the initial mount).
  // Player needs this; InlinePlayer doesn't.
  autoPlayOnSrcChange?: boolean
}

type UseAudioReturn = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  isBuffering: boolean
  error: string | null
  play: () => void
  togglePlay: () => void
  audioProps: {
    onPlaying: () => void
    onPause: () => void
    onWaiting: () => void
    onCanPlay: () => void
    onError: () => void
  }
}

export function useAudio({ src, onPlay, autoPlayOnSrcChange = false }: UseAudioOptions): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement>(null)
  const isFirstSrcRef = useRef(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const play = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    setIsBuffering(true)
    setError(null)
    claim(el)
    el.play().catch((e) => {
      setError(e instanceof Error ? e.message : 'Playback failed')
      setIsBuffering(false)
    })
  }, [])

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      play()
    } else {
      el.pause()
    }
  }, [play])

  useEffect(() => {
    setIsPlaying(false)
    setIsBuffering(false)
    setError(null)

    if (!src || !autoPlayOnSrcChange) return

    // Skip auto-play on the initial mount — only play on subsequent src changes.
    if (isFirstSrcRef.current) {
      isFirstSrcRef.current = false
      return
    }

    play()
  }, [src, autoPlayOnSrcChange, play])

  useEffect(() => {
    const el = audioRef.current
    return () => {
      if (el) release(el)
    }
  }, [])

  const audioProps = {
    onPlaying() {
      setIsPlaying(true)
      setIsBuffering(false)
      onPlay?.()
    },
    onPause() {
      setIsPlaying(false)
    },
    onWaiting() {
      setIsBuffering(true)
    },
    onCanPlay() {
      setIsBuffering(false)
    },
    onError() {
      setError('Stream unavailable')
      setIsBuffering(false)
      setIsPlaying(false)
    },
  }

  return { audioRef, isPlaying, isBuffering, error, play, togglePlay, audioProps }
}
