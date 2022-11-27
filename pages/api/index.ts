import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}

interface Database {
  employees: EmployeeTable;
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(req: Request) {
  const time = Date.now();
  const persons = await db
    .selectFrom("employees")
    .select(["emp_no", "first_name", "last_name"])
    .limit(10)
    .execute();

  console.log(Object.fromEntries(req.headers.entries()));

  return Response.json(
    {
      persons,
      elapsed: Date.now() - time,
      isCold: start === time,
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  );
}
