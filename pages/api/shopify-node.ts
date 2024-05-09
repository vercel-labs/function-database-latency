import { NextRequest as Request, NextResponse as Response } from 'next/server';

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get('count'));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await fetch(
      `https://hydrogen-preview.myshopify.com/api/2022-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // this is the token for the demo store
          // extracted from https://dub.sh/hydrogen-demo-token
          'X-Shopify-Storefront-Access-Token':
            '3b580e70970c4528da70c98e097c2fa0',
        },
        body: JSON.stringify({
          query: `{ shop { name } }`,
        }),
      }
    ).then((res) => res.json());
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
