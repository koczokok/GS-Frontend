"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getChallengeById, getSubmissionsByChallenge, isChallengeActive, createSubmission, type Challenge, type Submission } from "@/lib/api";
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
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const challengeId = parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [challengeData, submissionsData] = await Promise.all([
          getChallengeById(challengeId),
          getSubmissionsByChallenge(challengeId),
        ]);
        
        setChallenge(challengeData);
        
        // Filter user's submissions
        if (session?.userId && typeof session.userId === "string") {
          const userId = parseInt(session.userId);
          if (!isNaN(userId)) {
            const userSubs = submissionsData.filter(
              (sub) => sub.user?.id === userId
            );
            setUserSubmissions(userSubs);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load challenge");
        console.error("Error fetching challenge:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [challengeId, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Challenge not found</h3>
        <p className="text-sm text-muted-foreground mb-4">{error || "The challenge you're looking for doesn't exist"}</p>
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

  const handleSubmit = async () => {
    if (!selectedFile || !session?.userId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const userId = typeof session.userId === "string" ? parseInt(session.userId) : session.userId;
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");
      const fileExtension = selectedFile.name.split(".").pop() || "";

      await createSubmission({
        challengeId,
        userId,
        file: selectedFile,
        fileName,
        fileExtension,
      });

      setSubmitSuccess(true);
      setSelectedFile(null);

      // Refresh submissions
      const submissionsData = await getSubmissionsByChallenge(challengeId);
      const userSubs = submissionsData.filter((sub) => sub.user?.id === userId);
      setUserSubmissions(userSubs);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit solution");
      console.error("Error submitting:", err);
    } finally {
      setIsSubmitting(false);
    }
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

            {error && (
              <Alert className="bg-destructive/10 border-destructive/50">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

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
              disabled={!selectedFile || isSubmitting || !session?.userId}
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
                  challengeTitle={challenge.title}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
