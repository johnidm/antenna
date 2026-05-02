import { Loader2, Pause, Play } from 'lucide-react'
import { useAudio } from '@/lib/useAudio'
import { Equalizer } from '@/components/ui/Equalizer'

type InlinePlayerProps = {
  src: string
  onPlay?: () => void
}

export function InlinePlayer({ src, onPlay }: InlinePlayerProps) {
  const { audioRef, isPlaying, isBuffering, error, togglePlay, audioProps } = useAudio({ src, onPlay })

  const label = error ? 'Unavailable' : isPlaying ? 'Playing' : isBuffering ? 'Loading' : 'Preview'

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <audio ref={audioRef} src={src} preload="none" className="hidden" {...audioProps} />

      {isPlaying && <Equalizer />}

      <button
        type="button"
        onClick={togglePlay}
        disabled={error !== null}
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        aria-pressed={isPlaying}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isBuffering ? (
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
