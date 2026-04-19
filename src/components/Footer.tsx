export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div>
        <p>
          &copy; {year} Your name here. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
