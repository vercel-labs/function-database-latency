import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

export const config = {
  runtime: "experimental-edge",
};

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

export default async function api(req, res) {
  const persons = await db
    .selectFrom("employees")
    .select(["emp_no", "first_name", "last_name"])
    .limit(10)
    .execute();

  return Response.json(persons);
}
