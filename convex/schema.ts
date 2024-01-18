import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    employees: defineTable({
      empNo: v.number(),
      firstName: v.string(),
      lastName: v.string(),
    }),
});
