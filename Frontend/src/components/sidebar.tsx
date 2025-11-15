"use client"

import { useSession, signOut } from "next-auth/react"
import { UserDashboard } from "./user-dashboard"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="w-80 h-screen bg-card/95 border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="destructive"
          className="w-full"
          size="sm"
        >
          Sign Out
        </Button>
      </div>

      {/* User Dashboard Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Dashboard</h2>
        <UserDashboard />
      </div>
    </div>
  )
}

