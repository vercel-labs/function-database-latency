# Vercel Functions Database Latency

This demo helps observe the latency characteristics of querying different popular data services from [Vercel Functions](https://vercel.com/docs/functions).

https://db-latency.vercel.app

## Providers

Here is an overview of all data service providers and the compute locations available in this app:

| Provider                         | Edge (Global) | Edge (Regional / US East) | Node |
| :------------------------------- | :------------ | :------------------------ | ---- |
| Convex (SDK)                     | ✅            | ✅                        | ✅   |
| Fauna                            | ✅            | ✅                        | ❌   |
| Grafbase (GraphQL)               | ✅            | ✅                        | ❌   |
| Neon                             | ✅            | ✅                        | ❌   |
| Fauna                            | ✅            | ✅                        | ❌   |
| PlanetScale w/ Kysely            | ✅            | ✅                        | ❌   |
| PlanetScale w/ Prisma ORM        | ✅            | ✅                        | ✅   |
| PlanetScale w/ Drizzle           | ✅            | ✅                        | ✅   |
| PolyScale                        | ✅            | ✅                        | ❌   |
| Shopify (Storefront GraphQL API) | ✅            | ✅                        | ❌   |
| Supabase w/ supabase-js          | ✅            | ✅                        | ❌   |
| Supabase w/ Prisma ORM           | ❌            | ❌                        | ✅   |
| Supabase w/ Drizzle              | ❌            | ❌                        | ✅   |
| TiDB Cloud (serverless-js)       | ✅            | ✅                        | ❌   |
| Tigris                           | ✅            | ✅                        | ❌   |
| Turso                            | ✅            | ✅                        | ❌   |
| Upstash (SDK)                    | ✅            | ✅                        | ❌   |
| Xata (TypeScript SDK)            | ✅            | ✅                        | ❌   |

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
