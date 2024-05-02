import {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
  buildClient,
} from "@xata.io/client";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
};

const tables = [
  {
    name: "employees",
    columns: [
      { name: "emp_no", type: "int" },
      { name: "first_name", type: "string" },
      { name: "last_name", type: "string" },
    ],
  },
] as const;

type InferredTypes = SchemaInference<typeof tables>;
type EmployeesRecord = InferredTypes["employees"] & XataRecord;

type DatabaseSchema = {
  employees: EmployeesRecord;
};

class XataClient extends buildClient()<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super(options, tables);
  }
}

const xata = new XataClient();

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await xata.db.employees
      .select(["emp_no", "first_name", "last_name"])
      .getMany({ pagination: { size: 10 }, consistency: "eventual" });
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

function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}
