import { useEffect, useRef, useState } from 'react'
import { Loader2, Pause, Play } from 'lucide-react'
import { claim, release } from '@/lib/audioRegistry'

type InlinePlayerProps = {
  src: string
  onPlay?: () => void
}

export function InlinePlayer({ src, onPlay }: InlinePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
    setIsLoading(false)
    setError(false)
  }, [src])

  useEffect(() => {
    const el = audioRef.current
    return () => {
      if (el) release(el)
    }
  }, [])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return

    if (el.paused) {
      setIsLoading(true)
      setError(false)
      claim(el)
      el.play().catch(() => {
        setError(true)
        setIsLoading(false)
      })
    } else {
      el.pause()
    }
  }

  const label = error ? 'Unavailable' : isPlaying ? 'Playing' : isLoading ? 'Loading' : 'Preview'

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={() => {
          const el = audioRef.current
          if (el) claim(el)
          setIsPlaying(true)
          setIsLoading(false)
          onPlay?.()
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
          setIsPlaying(false)
        }}
        className="hidden"
      />

      {isPlaying && <Equalizer />}

      <button
        type="button"
        onClick={toggle}
        disabled={error}
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        aria-pressed={isPlaying}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5 translate-x-[1px]" />
        )}
      </button>

      <span className="hidden font-mono text-[10px] uppercase tracking-widest text-fg-muted sm:inline">
        {label}
      </span>
    </div>
  )
}

function Equalizer() {
  return (
    <div aria-hidden="true" className="flex h-5 items-end gap-[2px]">
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '40%', animationDuration: '0.9s' }} />
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '80%', animationDuration: '0.7s', animationDelay: '0.15s' }} />
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '60%', animationDuration: '1.1s', animationDelay: '0.3s' }} />
    </div>
  )
}
