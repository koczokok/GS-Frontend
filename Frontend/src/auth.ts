import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import AzureAD from "next-auth/providers/azure-ad"
import { getRoleFromEmail } from "@/lib/mock-data"

// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        // Store OAuth data
        token.accessToken = account.access_token
        token.provider = account.provider
        token.userId = user.id

        // Send user data to backend for creation/update
        try {
          const response = await fetch(`${BACKEND_URL}/api/users/oauth-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              providerId: account.providerAccountId, // OAuth provider's user ID
              email: user.email,
            }),
          })

          if (response.ok) {
            console.log("User synced with backend successfully")
            // You can store additional data from backend response if needed
            const data = await response.json()
            // Example: token.backendUserId = data.id
          } else {
            console.error("Failed to sync user with backend:", await response.text())
          }
        } catch (error) {
          console.error("Error syncing user with backend:", error)
        }

        // Assign role based on email (for development/mock purposes)
        // In production, you should get the role from the backend response
        token.role = getRoleFromEmail(user.email || "")
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      session.role = token.role
      session.userId = token.userId as string
      return session
    },
  },
})
