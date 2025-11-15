"use client";

import { useState } from "react";
import { mockChallenges, isChallengeActive } from "@/lib/mock-data";
import { ChallengeCard } from "@/components/challenge-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";

export default function ChallengesPage() {
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (filter === "all") return true;
    if (filter === "active") return isChallengeActive(challenge);
    if (filter === "closed") return !isChallengeActive(challenge);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Challenges
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and participate in hackathon challenges
          </p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === "active"
                  ? "There are no active challenges at the moment"
                  : "There are no closed challenges"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
