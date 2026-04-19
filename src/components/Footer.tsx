export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 text-center text-xs uppercase tracking-widest text-fg-muted">
        <p>&copy; {year} Antenna. All rights reserved.</p>
      </div>
    </footer>
  )
}
