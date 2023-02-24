import { ConvexHttpClient } from "convex/browser";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
};

// Make sure we use the Edge endpoints.
let url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url.endsWith("edge.convex.cloud")) {
  url = url.replace(/convex.cloud$/g, "edge.convex.cloud");
}

const convex = new ConvexHttpClient(url);

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const limit = 10;
    data = await convex.query("employees")(limit);
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
