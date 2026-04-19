Welcome to your new TanStack Start app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `pnpm add @tailwindcss/vite tailwindcss --dev`



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

---

# REST API

## `GET /v1/radios/stations`

Returns a paginated list of radio stations.

### Query Parameters

| Parameter  | Type     | Default  | Description |
|------------|----------|----------|-------------|
| `pageSize` | number   | `20`     | Items per page (max `100`) |
| `cursor`   | string   | —        | Opaque cursor from a previous response's `pagination.nextCursor` |
| `sortBy`   | `name` \| `country` | `name` | Field to sort by |
| `order`    | `asc` \| `desc` | `asc` | Sort direction |
| `country`  | string   | —        | Filter by exact country name |
| `language` | string   | —        | Filter by exact language |
| `tag`      | string   | —        | Filter stations that contain this tag |

### Response

```json
{
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
    "nextPage": "http://localhost:3000/v1/radios/stations?pageSize=20&cursor=MDE4ZWRj...",
    "previousPage": "http://localhost:3000/v1/radios/stations?pageSize=20&cursor=MDAwMDAw...",
    "hasMore": true,
    "pageSize": 20
  }
}
```

- **`nextCursor`** — pass as `cursor` in the next request to fetch the following page; `null` when there are no more results.
- **`nextPage`** — URL to fetch the following page; `null` when there are no more results.
- **`previousPage`** — URL to fetch the previous page; `null` when there are no previous results.
- **`hasMore`** — `true` if another page exists.

### Examples

```bash
# First page, 10 results sorted by name
curl "http://localhost:3000/v1/radios/stations?pageSize=10"

# Next page using cursor from previous response
curl "http://localhost:3000/v1/radios/stations?pageSize=10&cursor=<nextCursor>"

# Filter by country, sorted descending
curl "http://localhost:3000/v1/radios/stations?country=Germany&sortBy=name&order=desc"

# Filter by tag
curl "http://localhost:3000/v1/radios/stations?tag=jazz"
```

### Error Responses

| Status | Cause |
|--------|-------|
| `400`  | Malformed `cursor` value |

---

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
