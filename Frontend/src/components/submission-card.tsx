"use client";

import { Submission } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Award } from "lucide-react";

interface SubmissionCardProps {
  submission: Submission;
  showChallenge?: boolean;
  onDownload?: () => void;
}

export function SubmissionCard({ submission, showChallenge = true, onDownload }: SubmissionCardProps) {
  const isScored = submission.score !== null;
  const submissionDate = new Date(submission.submissionDate);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Mock download
      console.log(`Downloading ${submission.fileName}.${submission.fileExtension}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {showChallenge && submission.challengeTitle && (
              <p className="text-sm text-muted-foreground mb-1">{submission.challengeTitle}</p>
            )}
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {submission.fileName}.{submission.fileExtension}
            </CardTitle>
          </div>
          {isScored ? (
            <Badge variant="default" className="bg-blue-600">
              <Award className="h-3 w-3 mr-1" />
              {submission.score}/100
            </Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Submitted {submissionDate.toLocaleDateString()} at {submissionDate.toLocaleTimeString()}</span>
          </div>

          {isScored && submission.feedback && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Feedback:</p>
              <p className="text-sm text-muted-foreground">{submission.feedback}</p>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
