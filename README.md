# Edge Database Latency

This demo helps observe the latency characteristics of querying different popular data services from varying compute locations.

https://edge-data-latency.vercel.app

## Providers

- Convex (SDK)
- Fauna
- Grafbase (GraphQL)
- Neon
- PlanetScale (Kysely + Serverless SDK)
- PolyScale
- Shopify (Storefront GraphQL API)
- Supabase (supabase-js)
- Tigris
- Turso
- Upstash (SDK)
- Xata (TypeScript SDK)

## Testing Methodology

1. Smallest atomic unit, e.g. 1 item / row.
2. Data schema:

```ts
interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}
```

## Learn More

- [Vercel Edge Functions Docs](https://vercel.com/docs/concepts/functions/edge-functions)
- [Vercel Edge Functions Templates](https://vercel.com/templates/edge-functions)
- [Regional Edge Functions](https://vercel.com/blog/regional-execution-for-ultra-low-latency-rendering-at-the-edge)
