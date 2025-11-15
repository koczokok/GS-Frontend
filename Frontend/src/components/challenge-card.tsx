"use client";

import { Challenge } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { isChallengeActive } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface ChallengeCardProps {
  challenge: Challenge;
  onView?: () => void;
}

export function ChallengeCard({ challenge, onView }: ChallengeCardProps) {
  const router = useRouter();
  const isActive = isChallengeActive(challenge);
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const handleClick = () => {
    if (onView) {
      onView();
    } else {
      router.push(`/dashboard/challenges/${challenge.id}`);
    }
  };

  return (
    <Card className="hover:scale-[1.02] transition-transform cursor-pointer hover:shadow-lg" onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          {isActive ? (
            <Badge variant="default" className="bg-green-600">Active</Badge>
          ) : (
            <Badge variant="secondary">Closed</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{challenge.rules}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{deadline.toLocaleDateString()}</span>
        </div>
        {isActive && daysLeft > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
          </div>
        )}
        {!isActive && (
          <span className="text-sm text-red-500 font-medium">Deadline passed</span>
        )}
      </CardFooter>
    </Card>
  );
}
