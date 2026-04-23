import { useEffect, useRef, useState } from 'react'
import { Loader2, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react'
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
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2
  const effectiveVolume = isMuted ? 0 : volume
  const volumeFill = `${Math.round(effectiveVolume * 100)}%`

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-4 sm:pb-4">
      <div
        className="player-shell pointer-events-auto relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-border"
        role="region"
        aria-label="Audio player"
      >
        {/* Progress / live indicator */}
        <div className="relative h-[2px] w-full overflow-hidden bg-border/60">
          {isBuffering ? (
            <div className="player-bar-buffer absolute inset-y-0 left-0 w-1/3 bg-fg/80" />
          ) : (
            <div
              className={`absolute inset-y-0 left-0 bg-fg transition-[width,opacity] duration-500 ${
                isPlaying ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          )}
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

        <div className="mx-auto grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-6 sm:px-6 sm:py-4">
          {/* LEFT: station info */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              {currentStation.logoUrl ? (
                <img
                  src={currentStation.logoUrl}
                  alt=""
                  height={56}
                  width={56}
                  className="h-11 w-11 rounded-lg border border-border bg-surface-2 object-contain p-1 shadow-sm sm:h-14 sm:w-14"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-base font-semibold text-fg-muted shadow-sm sm:h-14 sm:w-14">
                  {currentStation.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isPlaying && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center">
                  <span className="live-dot h-2 w-2 rounded-full bg-fg" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate font-mono text-[13px] font-bold tracking-wider text-fg sm:text-sm"
                title={currentStation.name}
              >
                {title}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-fg-muted sm:text-xs">
                  {subtitle}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 shrink-0 rounded-full bg-border sm:inline-block"
                />
                <span
                  className={`hidden shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest sm:inline-flex ${
                    error
                      ? 'text-fg-muted'
                      : isPlaying
                        ? 'text-fg'
                        : isBuffering
                          ? 'text-fg-muted'
                          : 'text-fg-muted'
                  }`}
                  aria-live="polite"
                >
                  {isPlaying && <span className="live-dot h-1.5 w-1.5 rounded-full bg-fg" />}
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: controls */}
          <div className="col-start-2 row-start-1 flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={playPrev}
              disabled={loading || atStart}
              aria-label="Previous station"
              className="player-btn h-10 w-10"
            >
              <SkipBack className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
              className="player-btn player-btn--primary h-12 w-12 sm:h-13 sm:w-13"
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              disabled={loading || atEnd}
              aria-label="Next station"
              className="player-btn h-10 w-10"
            >
              <SkipForward className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* MOBILE: status below title row (hidden on sm+) */}
          <div className="col-span-3 row-start-2 -mt-1 flex items-center justify-start sm:hidden">
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-fg-muted"
              aria-live="polite"
            >
              {isPlaying && <span className="live-dot h-1.5 w-1.5 rounded-full bg-fg" />}
              {statusLabel}
            </span>
          </div>

          {/* RIGHT: volume */}
          <div className="col-start-3 row-start-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              aria-pressed={isMuted}
              className="player-btn h-9 w-9 sm:h-10 sm:w-10"
            >
              <VolumeIcon className="h-[18px] w-[18px]" />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="player-volume hidden h-1 w-24 cursor-pointer appearance-none rounded-full sm:block sm:w-32"
              style={{ ['--_fill' as string]: volumeFill }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
