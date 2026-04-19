# Antenna - Radio Station Directory

## Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

## REST API

### `GET /api/radios/stations`

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
    "nextPage": "http://localhost:3000/api/radios/stations?pageSize=20&cursor=MDE4ZWRj...",
    "previousPage": "http://localhost:3000/api/radios/stations?pageSize=20&cursor=MDAwMDAw...",
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
curl "http://localhost:3000/api/radios/stations?pageSize=10"

# Next page using cursor from previous response
curl "http://localhost:3000/api/radios/stations?pageSize=10&cursor=<nextCursor>"

# Filter by country, sorted descending
curl "http://localhost:3000/api/radios/stations?country=Germany&sortBy=name&order=desc"

# Filter by tag
curl "http://localhost:3000/api/radios/stations?tag=jazz"
```
