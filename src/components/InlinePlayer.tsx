import { useEffect, useRef, useState } from 'react'
import { Loader2, Pause, Play } from 'lucide-react'
import { claim, release } from '@/lib/audioRegistry'

export function InlinePlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
    setIsLoading(false)
    setError(false)
  }, [src])

  // Release from registry on unmount
  useEffect(() => {
    const el = audioRef.current
    return () => {
      if (el) release(el)
    }
  }, [])

  function toggle() {
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

  return (
    <div className="flex items-center gap-2 text-fg-muted">
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
          setError(true)
          setIsLoading(false)
          setIsPlaying(false)
        }}
        className="hidden"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5 translate-x-[1px]" />
        )}
      </button>

      <span className="font-mono text-[10px] uppercase tracking-widest">
        {error ? 'Unavailable' : isPlaying ? 'Live' : isLoading ? 'Loading' : 'Play'}
      </span>
    </div>
  )
}
