import {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
  buildClient,
} from "@xata.io/client";
import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { count } = req.query;
  const time = Date.now();

  let data = null;
  for (let i = 0; i < toNumber(count); i++) {
    data = await xata.db.employees
      .select(["emp_no", "first_name", "last_name"])
      .getMany({ pagination: { size: 10 }, consistency: "eventual" });
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
