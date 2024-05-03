import { NextRequest as Request, NextResponse as Response } from "next/server";
import { PrismaClient } from "@/prisma-turso/prisma-client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

export const config = {
  runtime: "edge",
};

const libsql = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

const start = Date.now();

export default async function handler(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
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
        (req.headers.get("x-vercel-id") ?? "").split(":")[1] || null,
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    },
  );
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | string[] | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
