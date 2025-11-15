"use client";

import { LeaderboardEntry } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500";
    if (rank === 2) return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    if (rank === 3) return "bg-amber-500/10 text-amber-600 dark:text-amber-500";
    return "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead className="text-right">Total Score</TableHead>
            <TableHead className="text-right">Submissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isCurrentUser = currentUserId && entry.userId === currentUserId;
            return (
              <TableRow
                key={entry.userId}
                className={`${isCurrentUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''} ${getRankBadgeColor(entry.rank)}`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={entry.userImage} alt={entry.userName} />
                      <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {entry.userName}
                        {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold">{entry.totalScore}</TableCell>
                <TableCell className="text-right text-muted-foreground">{entry.submissionCount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
