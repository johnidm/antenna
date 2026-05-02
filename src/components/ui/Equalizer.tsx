export function Equalizer() {
  return (
    <div aria-hidden="true" className="flex h-5 items-end gap-[2px]">
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '40%', animationDuration: '0.9s' }} />
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '80%', animationDuration: '0.7s', animationDelay: '0.15s' }} />
      <span className="animate-eq-bar inline-block w-[3px] bg-fg" style={{ height: '60%', animationDuration: '1.1s', animationDelay: '0.3s' }} />
    </div>
  )
}
