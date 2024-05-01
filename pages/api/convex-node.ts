import { ConvexHttpClient } from "convex/browser";
import type { NextApiRequest, NextApiResponse } from "next";
import { api as convexApi } from "../../convex/_generated/api";

// Make sure we use the Edge endpoints.
let url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url.endsWith("edge.convex.cloud")) {
  url = url.replace(/convex.cloud$/g, "edge.convex.cloud");
}

const convex = new ConvexHttpClient(url);

const start = Date.now();

export default async function api(req: NextApiRequest, res: NextApiResponse) {
  const count = toNumber(req.query.count);
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const limit = 10;
    data = await convex.query(convexApi.employees.default, { limit });
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
