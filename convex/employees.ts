import { query } from "./_generated/server";

export default query(async ({ db }, limit: number) => {
    return await db.query("employees").take(limit);
});
