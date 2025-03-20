import { defineSchema, defineTable, varchar, timestamp } from 'convex/schema';

import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

// Define the expenses schema using Convex
const schema = defineSchema({
  expenses: defineTable({
  id: v.id(), // assuming UUID or some string-like ID
  userId: varchar().required(),
  title: varchar().required(),
  createdAt: timestamp().default(() => new Date()),
});

export const insertExpenseSchema = {} 

