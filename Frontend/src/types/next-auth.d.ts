import { DefaultSession } from "next-auth"
import { Role } from "./index"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    provider?: string
    role?: Role
    userId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    provider?: string
    role?: Role
    userId?: string
  }
}
