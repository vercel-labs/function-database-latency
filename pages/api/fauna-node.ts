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
