import { NextRequest as Request, NextResponse as Response } from 'next/server';

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get('count'));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await fetch(process.env.FAUNA_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.FAUNA_API_KEY,
      },
      body: JSON.stringify({
        query: `{
            listEmployees(_size: 10) {
              data {
                name
                email
                position
              }
            }
          }`,
      }),
    }).then((res) => res.json());
  }

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationRegion:
        (req.headers.get('x-vercel-id') ?? '').split(':')[1] || null,
    },
    {
      headers: {
        'x-edge-is-cold': start === time ? '1' : '0',
      },
    }
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}

/**
 * You can use the following schema for your FaunaDB database
 * 

type Employee {
  name: String!
  email: String!
  phone: String!
  address: String!
  position: String!
  salary: Float!
}

type Query {
  listEmployees: [Employee]
}

 */
