import { query } from "./_generated/server";
import { v } from "convex/values";

export default query({
    args: { limit: v.number() },
    handler: async ({ db }, args) => {
        return await db.query("employees").take(args.limit);
    },
});
