import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header>
      <nav>
        <h2>
          <Link to="/">
            Antenna
          </Link>
        </h2>

        <div>
          <Link to="/">
            Home
          </Link>
          <div />
          <Link to="/about">
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
