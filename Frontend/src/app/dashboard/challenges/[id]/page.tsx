"use client";

import { use, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getChallengeById, getSubmissionsByChallenge, isChallengeActive } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/file-upload";
import { SubmissionCard } from "@/components/submission-card";
import { Calendar, Clock, Upload, FileText, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const challengeId = parseInt(id);
  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Challenge not found</h3>
        <Button onClick={() => router.push("/dashboard/challenges")}>
          Back to Challenges
        </Button>
      </div>
    );
  }

  const isActive = isChallengeActive(challenge);
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Get user's submissions for this challenge
  const userSubmissions = getSubmissionsByChallenge(challengeId).filter(
    (sub) => sub.userId === session?.userId
  );

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setSelectedFile(null);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
          <p className="text-muted-foreground">{challenge.description}</p>
        </div>
        {isActive ? (
          <Badge variant="default" className="bg-green-600">Active</Badge>
        ) : (
          <Badge variant="secondary">Closed</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium">{deadline.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
        {isActive && daysLeft > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time remaining:</span>
                <span className="font-medium">{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{challenge.rules}</pre>
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit Your Solution
            </CardTitle>
            <CardDescription>
              Upload your solution file (.csv, .json, or .py)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload onFileSelect={setSelectedFile} />

            {submitSuccess && (
              <Alert className="bg-green-500/10 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Submission successful! Your solution has been submitted for review.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Solution
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {userSubmissions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  showChallenge={false}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
