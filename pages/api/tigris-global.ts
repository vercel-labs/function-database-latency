import { NextRequest as Request, NextResponse as Response } from 'next/server';

export const config = {
  runtime: 'edge',
};

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get('count'));
  const token = await fetchToken();
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const uri = `${process.env.TIGRIS_API_URL}/projects/vercel-edge-data-latency/database/collections/employees/documents/read`;

    data = await fetch(uri, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filter: {},
        options: {
          limit: 10,
        },
        branch: 'main',
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

async function fetchToken() {
  const data = await fetch(`${process.env.TIGRIS_API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'content-type': 'x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'CLIENT_CREDENTIALS',
      client_id: process.env.TIGRIS_CLIENT_ID,
      client_secret: process.env.TIGRIS_CLIENT_SECRET,
    }),
  }).then((res) => res.json());
  return data.access_token;
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}

/**
 * Following is the corresponding data model definition for the employees collection
 * 

@TigrisCollection("employees")
export class Employee {
  @PrimaryKey(TigrisDataTypes.INT32, { order: 1, autoGenerate: true })
  emp_no?: number;

  @Field()
  first_name?: string;

  @Field()
  last_name?: string;
}

 */
