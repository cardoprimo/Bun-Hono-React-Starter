import { defineSchema, defineTable, varchar, timestamp } from 'convex/schema';

import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

// Define the expenses schema using Convex
const schema = defineSchema({
  expenses: defineTable({
  id: v.id(), // assuming UUID or some string-like ID
  userId: v.id('users'),
  title: v.string(),
}).index("userid_index", userId),
users: defineSchema({
  clerkId: v.string().regex(/^user_.+/),
  expensesId: v.id('expenses')
}).index('id', clerkId)
}) ;




export const insertExpenseSchema = {} 

