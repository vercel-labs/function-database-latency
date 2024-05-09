import type { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

const start = Date.now();
const sql = neon(process.env.NEON_DATABASE_URL);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { count } = req.query;
  
  const time = Date.now();
  
  let data = null;
  for (let i = 0; i < toNumber(count); i++) {
    data = await sql`
      SELECT "emp_no", "first_name", "last_name" 
      FROM "employees" 
      LIMIT 10`;
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
