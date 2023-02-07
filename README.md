# Edge Database Latency

This demo helps observe the latency characteristics of querying different popular data services from varying compute locations.

https://edge-data-latency.vercel.app

## Providers

- Grafbase (GraphQL)
- PlanetScale (Kysely + Serverless SDK)
- Shopify (Storefront GraphQL API)
- Supabase (supabase-js)
- Xata (TypeScript SDK)
- Upstash (SDK)

🚧 Coming Soon 🚧

- Neon
- Fauna
- ReadySet
- Convex

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
