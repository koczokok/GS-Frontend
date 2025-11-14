"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0d1424] p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <Card className="w-full max-w-2xl border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Welcome to Dashboard
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                You have successfully authenticated with OAuth
              </CardDescription>
            </div>
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-primary shadow-lg"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="grid gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              <p className="text-lg text-white font-medium">{session.user?.email}</p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
              <p className="text-lg text-white font-medium">{session.user?.name || "N/A"}</p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Provider</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-lg text-white font-medium capitalize">{session.provider || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
              className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
