"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSubmissionById, getChallengeById, updateSubmission, type Submission, type Challenge } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Calendar, Award, CheckCircle, User as UserIcon } from "lucide-react";

export default function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissionId = parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const submissionData = await getSubmissionById(submissionId);
        setSubmission(submissionData);

        // Fetch challenge separately
        const challengeData = await getChallengeById(submissionData.challengeId);
        setChallenge(challengeData);

        // Pre-fill if already scored
        if (submissionData.score !== null) {
          setScore(submissionData.score.toString());
          setFeedback(submissionData.feedback || "");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submission");
        console.error("Error fetching submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Submission not found</h3>
        <p className="text-sm text-muted-foreground mb-4">{error || "The submission you're looking for doesn't exist"}</p>
        <Button onClick={() => router.push("/dashboard/judge/submissions")}>
          Back to Submissions
        </Button>
      </div>
    );
  }

  const isAlreadyScored = submission.score !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const scoreValue = parseInt(score);
      if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
        throw new Error("Score must be between 0 and 100");
      }

      await updateSubmission(submissionId, scoreValue, feedback);

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/judge/submissions");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update submission");
      console.error("Error updating submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreValue = parseInt(score);
  const isScoreValid = !isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Submission</h1>
          <p className="text-muted-foreground mt-1">
            Evaluate the submission and provide a score
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/judge/submissions")}>
          Back to List
        </Button>
      </div>

      {error && (
        <Alert className="bg-destructive/10 border-destructive/50">
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-500/10 border-green-500/50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Score submitted successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-6">
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Challenge</Label>
                <p className="text-lg font-medium mt-1">{challenge?.title}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Participant</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar>
                    <AvatarFallback>{submission.userName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{submission.userName}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Submitted File</Label>
                <Card className="mt-2">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">
                          {submission.fileName}.{submission.fileExtension}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(submission.submissionDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {isAlreadyScored && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Current Score</Label>
                    <div className="mt-2">
                      <Badge variant="default" className="bg-blue-600 text-lg px-3 py-1">
                        <Award className="h-4 w-4 mr-1" />
                        {submission.score}/100
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Challenge Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                {challenge?.rules}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isAlreadyScored ? "Update Score & Feedback" : "Provide Score & Feedback"}
          </CardTitle>
          <CardDescription>
            Evaluate the submission based on the challenge criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="score">
                Score (0-100) *
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                placeholder="Enter score between 0 and 100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
              {score && !isScoreValid && (
                <p className="text-xs text-destructive">
                  Please enter a valid score between 0 and 100
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed feedback on the submission..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Constructive feedback helps participants improve
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={!isScoreValid || isSubmitting || success}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting Score...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    {isAlreadyScored ? "Update Score" : "Submit Score"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/judge/submissions")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
