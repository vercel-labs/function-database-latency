import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function api(req: Request) {
  const url = process.env.TURSO_DB_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_DB_URL env var is not defined");
  }

  const authToken = process.env.TURSO_DB_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    throw new Error("TURSO_DB_AUTH_TOKEN env var is not defined");
  }
  return Response.json(
    {
      url: url,
      authToken: authToken,
    }
  );
}
