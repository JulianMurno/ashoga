import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { ac, roles } from "./permissions"

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient({
    ac,
    roles
  })],
})