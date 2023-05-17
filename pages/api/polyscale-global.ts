import { Client } from "@polyscale/serverless-js";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
};

const polyscale = new Client("https://serverless.aws.psedge.global", {
  cacheId: process.env.POLYSCALE_CACHE_ID,
  username: process.env.POLYSCALE_DB_USERNAME,
  password: process.env.POLYSCALE_DB_PASSWORD,
  database: process.env.POLYSCALE_DB,
  provider: "postgres",
});

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const response = await polyscale.query(`
    SELECT "emp_no", "first_name", "last_name" 
    FROM "employees" 
    LIMIT 10
  `);
    data = response;
    console.log(data);
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

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}
