import { v } from 'convex/values'
import { query } from './_generated/server'

export const getConvexUser = query({
  args: v.object({
    id: v.id('users'),
  }),
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id)
    return user
  },
})
