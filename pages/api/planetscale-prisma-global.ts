import { NextRequest as Request, NextResponse as Response } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { Client } from '@planetscale/database';

export const config = {
  runtime: 'edge',
};

const client = new Client({ url: process.env.PLANETSCALE_DATABASE_URL });
const adapter = new PrismaPlanetScale(client);
const prisma = new PrismaClient({ adapter });

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get('count'));

  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await prisma.employees.findMany({ take: 10 });
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
    },
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}
