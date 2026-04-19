import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main>
      <section>
        <h1>About</h1>
      </section>
    </main>
  )
}
