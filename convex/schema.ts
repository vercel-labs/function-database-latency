import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
    employees: defineTable({
      emp_no: s.number(),
      first_name: s.string(),
      last_name: s.string(),
    }),
});
