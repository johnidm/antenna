import { useEffect, useRef, useState } from 'react'
import { Loader2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { claim, release } from '@/lib/audioRegistry'

type PlayerProps = {
  src: string
  title?: string
  subtitle?: string
}

export function Player({ src, title, subtitle }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const isFirstSrcRef = useRef(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = volume
  }, [volume])

  // Reset state + auto-play on subsequent src changes (not initial mount)
  useEffect(() => {
    setIsPlaying(false)
    setIsLoading(false)
    setError(null)

    if (isFirstSrcRef.current) {
      isFirstSrcRef.current = false
      return
    }

    const el = audioRef.current
    if (!el) return

    setIsLoading(true)
    claim(el)
    el.play().catch((e) => {
      setError(e instanceof Error ? e.message : 'Playback failed')
      setIsLoading(false)
    })
  }, [src])

  // Release from registry on unmount
  useEffect(() => {
    const el = audioRef.current
    return () => {
      if (el) release(el)
    }
  }, [])

  function togglePlay() {
    const el = audioRef.current
    if (!el) return

    if (el.paused) {
      setIsLoading(true)
      setError(null)
      claim(el)
      el.play().catch((e) => {
        setError(e instanceof Error ? e.message : 'Playback failed')
        setIsLoading(false)
      })
    } else {
      el.pause()
    }
  }

  function toggleMute() {
    const el = audioRef.current
    if (!el) return
    el.muted = !el.muted
    setIsMuted(el.muted)
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(e.target.value))
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface-2 p-2">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={() => {
          const el = audioRef.current
          if (el) claim(el)
          setIsPlaying(true)
          setIsLoading(false)
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError('Stream unavailable')
          setIsLoading(false)
          setIsPlaying(false)
        }}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-fg transition-colors hover:border-fg disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 translate-x-[1px]" />
        )}
      </button>

      {(title || subtitle || error) && (
        <div className="min-w-0 flex-1">
          {title && (
            <p className="truncate font-mono text-xs font-medium text-fg">{title}</p>
          )}
          {error ? (
            <p className="truncate text-[10px] uppercase tracking-widest text-fg-muted">
              {error}
            </p>
          ) : (
            subtitle && (
              <p className="truncate text-[10px] uppercase tracking-widest text-fg-muted">
                {isPlaying ? 'On air' : subtitle}
              </p>
            )
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-fg"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
          className="player-volume h-1 w-16 cursor-pointer appearance-none rounded-full bg-border accent-fg"
        />
      </div>
    </div>
  )
}
