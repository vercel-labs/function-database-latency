import type { NextApiRequest, NextApiResponse } from "next";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

let url = process.env.TURSO_DB_URL as string;

if (!url.startsWith("https://")) {
  url = url.replace(/^https/, "wss");
}

const client = createClient({
  url,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

export const employees = sqliteTable("employees", {
  id: integer("emp_no").primaryKey(),
  first_name: text("first_name"),
  last_name: text("last_name"),
});

const start = Date.now();

const db = drizzle(client);

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  const count = toNumber(req.query.count);
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await db.select().from(employees).limit(10);
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
