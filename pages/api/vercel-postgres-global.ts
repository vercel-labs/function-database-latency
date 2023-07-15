import { sql } from '@vercel/postgres';
import { NextRequest as Request, NextResponse as Response } from 'next/server';

export const config = {
  runtime: 'edge',
};

const start = Date.now();

export default async function api(req: Request, ctx: any) {
  const count = toNumber(new URL(req.url).searchParams.get('count'));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const { rows } = await sql`
      SELECT "emp_no", "first_name", "last_name" 
      FROM "employees" 
      LIMIT 10`;
    data = rows;
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
      headers: { 'x-edge-is-cold': start === time ? '1' : '0' },
    }
  );
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
