import type { NextApiRequest, NextApiResponse } from 'next';

const start = Date.now();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { count } = req.query;

  const time = Date.now();

  let data = null;
  for (let i = 0; i < toNumber(count); i++) {
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

  return res.status(200).json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | string[] | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
