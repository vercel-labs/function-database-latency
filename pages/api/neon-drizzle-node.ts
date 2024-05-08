import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: serial("emp_no").primaryKey(),
  first_name: varchar("first_name", { length: 256 }),
  last_name: varchar("last_name", { length: 256 }),
});

const client = neon(process.env.NEON_DATABASE_URL);
const db = drizzle(client);

const start = Date.now();

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { count } = req.query;
  
  const time = Date.now();

  let data = null;
  for (let i = 0; i < toNumber(count); i++) {
    data = await db.select().from(employees).limit(10);
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
