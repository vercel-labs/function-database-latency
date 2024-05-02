import type { NextApiRequest, NextApiResponse } from "next";
import { Client as LibsqlClient, createClient } from "@libsql/client";

const start = Date.now();
const client = buildLibsqlClient();

export function buildLibsqlClient(): LibsqlClient {
  let url = process.env.TURSO_DB_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_DB_URL env var is not defined");
  }

  // if (!url.startsWith("https://")) {
  //   url = url.replace(/https$/g, "wss");
  // }

  const authToken = process.env.TURSO_DB_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    throw new Error("TURSO_DB_AUTH_TOKEN env var is not defined");
  }

  return createClient({ url, authToken });
}

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  const count = toNumber(req.query.count);
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await client.execute(
      "select emp_no, first_name, last_name from employees limit 10",
    );
  }

  return res.json({
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
