import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { schema } from "@/db/schema";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  plugins: [admin({
    defaultRole: 'secretario',
    ac,
    roles
  }), nextCookies()],
  advanced: {
    cookiePrefix: 'ashoga'
  }
});