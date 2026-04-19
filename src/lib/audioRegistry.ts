let active: HTMLAudioElement | null = null

export function claim(el: HTMLAudioElement) {
  if (active && active !== el && !active.paused) {
    active.pause()
  }
  active = el
}

export function release(el: HTMLAudioElement) {
  if (active === el) active = null
}
