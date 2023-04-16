import { NextRequest as Request, NextResponse as Response } from "next/server";
import { Client as LibsqlClient, createClient } from "@libsql/client/web";

export const config = {
  runtime: "edge",
};

const start = Date.now();
const client = buildLibsqlClient();

function buildLibsqlClient(): LibsqlClient {
    const url = process.env.TURSO_DB_URL?.trim();
    if (url === undefined) {
        throw new Error("TURSO_DB_URL env var is not defined");
    }

    const authToken = process.env.TURSO_DB_AUTH_TOKEN?.trim();
    if (authToken === undefined) {
        throw new Error("TURSO_DB_AUTH_TOKEN env var is not defined");
    }

    return createClient({ url, authToken });
}

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await client.execute("select emp_no, first_name, last_name from employees limit 10");
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
    }
  );
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
