import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
    employees: defineTable({
      empNo: s.number(),
      firstName: s.string(),
      lastName: s.string(),
    }),
});
