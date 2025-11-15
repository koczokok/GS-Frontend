"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockSubmissions, mockChallenges } from "@/lib/mock-data";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, FileText, Award, Calendar, Eye } from "lucide-react";

export default function JudgeSubmissionsPage() {
  const router = useRouter();
  const [selectedChallenge, setSelectedChallenge] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    if (selectedChallenge !== "all" && sub.challengeId !== parseInt(selectedChallenge)) {
      return false;
    }
    if (selectedStatus === "pending" && sub.score !== null) {
      return false;
    }
    if (selectedStatus === "scored" && sub.score === null) {
      return false;
    }
    return true;
  });

  const totalSubmissions = mockSubmissions.length;
  const pendingSubmissions = mockSubmissions.filter((sub) => sub.score === null).length;
  const scoredSubmissions = mockSubmissions.filter((sub) => sub.score !== null).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Gavel className="h-8 w-8 text-primary" />
          Review Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Evaluate and score participant submissions
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
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{scoredSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Filter by challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challenges</SelectItem>
            {mockChallenges.map((challenge) => (
              <SelectItem key={challenge.id} value={challenge.id.toString()}>
                {challenge.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="scored">Scored</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Click "Review" to view details and provide a score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.userName}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.challengeTitle}
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
                          <Badge variant="default" className="bg-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            {submission.score}/100
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/judge/submissions/${submission.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
