import { useEffect, useRef, useState } from 'react'
import { Loader2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { claim, release } from '@/lib/audioRegistry'
import { usePlayer } from '@/lib/playerContext'

export function Player() {
  const { currentStation, playPrev, playNext, loading, atStart, atEnd, playRequestTick } = usePlayer()

  const audioRef = useRef<HTMLAudioElement>(null)
  const isFirstSrcRef = useRef(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [error, setError] = useState<string | null>(null)

  const src = currentStation?.streamUrl ?? null

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = volume
  }, [volume])

  useEffect(() => {
    setIsPlaying(false)
    setIsBuffering(false)
    setError(null)

    if (!src) return

    if (isFirstSrcRef.current) {
      isFirstSrcRef.current = false
      return
    }

    const el = audioRef.current
    if (!el) return

    setIsBuffering(true)
    claim(el)
    el.play().catch((e) => {
      setError(e instanceof Error ? e.message : 'Playback failed')
      setIsBuffering(false)
    })
  }, [src])

  useEffect(() => {
    const el = audioRef.current
    return () => {
      if (el) release(el)
    }
  }, [])

  // Force playback whenever playStation() is dispatched (even if same station)
  useEffect(() => {
    if (playRequestTick === 0) return
    const el = audioRef.current
    if (!el || !src) return
    setIsBuffering(true)
    setError(null)
    claim(el)
    el.play().catch((e) => {
      setError(e instanceof Error ? e.message : 'Playback failed')
      setIsBuffering(false)
    })
  }, [playRequestTick])

  if (!currentStation) return null

  function togglePlay() {
    const el = audioRef.current
    if (!el) return

    if (el.paused) {
      setIsBuffering(true)
      setError(null)
      claim(el)
      el.play().catch((e) => {
        setError(e instanceof Error ? e.message : 'Playback failed')
        setIsBuffering(false)
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

  const title = currentStation.name.toUpperCase()
  const subtitle = (currentStation.country ?? 'ANTENNA_LIVE_TRANS').toUpperCase().replace(/\s+/g, '_')
  const statusLabel = error ? 'UNAVAILABLE' : isBuffering ? 'BUFFERING' : isPlaying ? 'LIVE' : 'READY'

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface">
      {/* Progress / live indicator */}
      <div className="relative h-[2px] w-full bg-border">
        <div
          className={`absolute inset-y-0 left-0 bg-fg transition-[width] duration-500 ${
            isPlaying ? 'w-full' : isBuffering ? 'w-1/3 animate-pulse' : 'w-0'
          }`}
        />
      </div>

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onPlaying={() => {
            const el = audioRef.current
            if (el) claim(el)
            setIsPlaying(true)
            setIsBuffering(false)
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          onError={() => {
            setError('Stream unavailable')
            setIsBuffering(false)
            setIsPlaying(false)
          }}
        />
      )}

      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:gap-6 sm:px-8 sm:py-5">
        {/* LEFT: station info */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {currentStation.logoUrl ? (
            <img
              src={currentStation.logoUrl}
              alt=""
              height={56}
              width={56}
              className="h-12 w-12 shrink-0 rounded-sm border border-border bg-surface-2 object-contain p-1 sm:h-14 sm:w-14"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 font-mono text-base text-fg-muted sm:h-14 sm:w-14">
              {currentStation.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden min-w-0 sm:block">
            <p className="truncate font-mono text-sm font-bold tracking-wider text-fg" title={currentStation.name}>
              {title}
            </p>
            <p className="truncate font-mono text-xs uppercase tracking-widest text-fg-muted">
              {subtitle}
            </p>
          </div>
        </div>

        {/* CENTER: controls */}
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={playPrev}
              disabled={loading || atStart}
              aria-label="Previous station"
              className="flex h-10 w-10 items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-12 w-12 items-center justify-center rounded-sm bg-fg text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 translate-x-[1px]" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              disabled={loading || atEnd}
              aria-label="Next station"
              className="flex h-10 w-10 items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
            {statusLabel}
          </span>
        </div>

        {/* RIGHT: volume */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-fg"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="player-volume h-1 w-24 cursor-pointer appearance-none rounded-full bg-border accent-fg sm:w-32"
          />
        </div>
      </div>
    </div>
  )
}
