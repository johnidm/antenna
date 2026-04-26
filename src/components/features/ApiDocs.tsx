import { Code2, Terminal } from 'lucide-react'

export function ApiDocs() {
  return (
    <section className="mb-12">
      <header className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-mono text-base font-semibold tracking-tight text-fg sm:text-lg">REST API</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">/api</span>
      </header>

      <p className="mb-6 text-sm leading-relaxed text-fg-muted">
        Antenna exposes a public HTTP API so you can query the radio station database programmatically.
      </p>

      <div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
        <span className="shrink-0 rounded-sm bg-fg px-2 py-0.5 font-mono text-[11px] font-semibold text-bg">GET</span>
        <code className="font-mono text-sm text-fg">/api/radio/stations</code>
      </div>

      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
        Query Parameters
      </h3>
      <div className="mb-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2">
            <tr>
              {['Parameter', 'Type', 'Default', 'Description'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-fg-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {[
              ['pageSize', 'number', '20', 'Items per page (max 100)'],
              ['cursor', 'string', '—', "Opaque cursor from a previous response's pagination.nextCursor"],
              ['sortBy', 'name | country', 'name', 'Field to sort by'],
              ['order', 'asc | desc', 'asc', 'Sort direction'],
              ['country', 'string', '—', 'Filter by exact country name'],
              ['language', 'string', '—', 'Filter by exact language'],
              ['tag', 'string', '—', 'Filter stations that contain this tag'],
            ].map(([param, type, def, desc]) => (
              <tr key={param}>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-fg">{param}</code>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-fg-muted">{type}</td>
                <td className="px-4 py-3 font-mono text-xs text-fg-muted">{def}</td>
                <td className="px-4 py-3 text-xs text-fg-muted">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response */}
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
        Response
      </h3>
      <pre className="mb-4 overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg-muted">
        {`{
  "data": [
    {
      "id": "018edc4f-...",
      "name": "Arrow Classic Rock",
      "country": "The Netherlands",
      "language": "dutch",
      "streamUrl": "http://...",
      "homepageUrl": "https://...",
      "logoUrl": "https://...",
      "tags": ["classic rock", "rock"]
    }
  ],
  "pagination": {
    "nextCursor": "MDE4ZWRj...",
    "nextPage": "https://antenna.show/api/radio/stations?pageSize=20&cursor=MDE4ZWRj...",
    "previousPage": "https://antenna.show/api/radio/stations?pageSize=20&cursor=MDAwMDAw...",
    "hasMore": true,
    "pageSize": 20
  }
}`}
      </pre>
      <ul className="mb-6 space-y-1.5 text-xs text-fg-muted">
        {[
          ['nextCursor', 'Pass as cursor in the next request; null when no more results.'],
          ['nextPage', 'Full URL to the next page; null when no more results.'],
          ['previousPage', 'Full URL to the previous page; null when at the first page.'],
          ['hasMore', 'true if another page exists.'],
        ].map(([field, desc]) => (
          <li key={field} className="flex gap-2">
            <code className="shrink-0 font-mono text-fg">{field}</code>
            <span>— {desc}</span>
          </li>
        ))}
      </ul>

      {/* Examples */}
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widestOn ">
        <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
        Examples
      </h3>
      <pre className="overflow-x-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg-muted">
        {`# First page, 10 results sorted by name
curl "https://antenna.show/api/radio/stations?pageSize=10"

# Next page using cursor from previous response
curl "https://antenna.show/api/radio/stations?pageSize=10&cursor=<nextCursor>"

# Filter by country, sorted descending
curl "https://antenna.show/api/radio/stations?country=Germany&sortBy=name&order=desc"

# Filter by tag
curl "https://antenna.show/api/radio/stations?tag=jazz"`}
      </pre>
    </section>
  )
}
