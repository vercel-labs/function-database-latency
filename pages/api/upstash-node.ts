import { Redis } from "@upstash/redis"
import type { NextApiRequest, NextApiResponse } from "next";

const redis = Redis.fromEnv()
const start = Date.now();

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  const count = toNumber(req.query.count);
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await redis.get("employees")
  }

  return res.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | string[] | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}
