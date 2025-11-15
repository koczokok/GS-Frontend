"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSubmissionsByUser, getChallenges, type Submission, type Challenge } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MySubmissionsPage() {
  const { data: session } = useSession();
  const [selectedChallenge, setSelectedChallenge] = useState<string>("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = typeof session.userId === "string" ? parseInt(session.userId) : session.userId;
        if (isNaN(userId)) {
          throw new Error("Invalid user ID");
        }

        const [subsData, challengesData] = await Promise.all([
          getSubmissionsByUser(userId),
          getChallenges(),
        ]);

        setSubmissions(subsData);
        setChallenges(challengesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!session?.userId) {
    return <div>Please log in to view your submissions</div>;
  }

  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedChallenge === "all") return true;
    return sub.challengeId === parseInt(selectedChallenge);
  });

  const totalSubmissions = submissions.length;
  const scoredSubmissions = submissions.filter((sub) => sub.score !== null);
  const pendingSubmissions = submissions.filter((sub) => sub.score === null);
  const avgScore = scoredSubmissions.length > 0
    ? Math.round(scoredSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / scoredSubmissions.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          My Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          View all your challenge submissions and scores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filter by challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challenges</SelectItem>
            {challenges.map((challenge) => (
              <SelectItem key={challenge.id} value={challenge.id.toString()}>
                {challenge.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
            <p className="text-sm text-muted-foreground">
              Start by submitting a solution to a challenge
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submissions History</CardTitle>
            <CardDescription>
              All your submissions with scores and feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challenge</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {challenges.find(c => c.id === submission.challengeId)?.title || `Challenge ${submission.challengeId}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {submission.fileName}.{submission.fileExtension}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.score !== null ? (
                          <Badge variant="default" className="bg-blue-600">
                            <Award className="h-3 w-3 mr-1" />
                            {submission.score}/100
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {submission.feedback ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {submission.feedback}
                          </p>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No feedback yet
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
