"use client";

import { useSession } from "next-auth/react";
import { getUserStats } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Award, FileText, Trophy, Target } from "lucide-react";
import { StatsCard } from "@/components/stats-card";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session || !session.userId) {
    return <div>Loading...</div>;
  }

  const stats = getUserStats(session.userId);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          View your account information and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                <AvatarFallback className="text-2xl">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                <p className="text-sm text-muted-foreground">{session.user?.email}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {session.role?.toLowerCase() || "Participant"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{session.user?.name || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{session.user?.email || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{session.role?.toLowerCase() || "Participant"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">OAuth Provider</p>
                  <p className="font-medium capitalize">{session.provider || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon={FileText}
            description="All time submissions"
          />
          <StatsCard
            title="Average Score"
            value={`${stats.averageScore}/100`}
            icon={Award}
            description="Across all submissions"
          />
          <StatsCard
            title="Current Rank"
            value={stats.rank > 0 ? `#${stats.rank}` : "N/A"}
            icon={Trophy}
            description="On the leaderboard"
          />
          <StatsCard
            title="Challenges Completed"
            value={stats.completedChallenges}
            icon={Target}
            description="Submitted and scored"
          />
        </div>
      </div>
    </div>
  );
}
