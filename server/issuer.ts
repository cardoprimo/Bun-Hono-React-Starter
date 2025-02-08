import { handle } from "hono/aws-lambda",
import { issuer } from "@openauthjs/openauth"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { subjects } from "../../subjects.js"
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare"


async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123"
}


const storage = CloudflareStorage({
  namespace: "bun-starter"
})

export default issuer({
  subjects,
  storage,
  providers: {
    github: GithubProvider({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scopes: ["user:email"],
    }),
  },
  async allow() {
    return true
  },
  success: async (ctx, value) => {
    if (value.provider === "github") {
      console.log(value.tokenset.access)
      userID = ... // lookup user or create them
    },
    return ctx.subject("user", {
      userID,
      'a workspace id'
    })
    throw new Error("Invalid provider")
  },
})

export const handler = handle(app