"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, CheckCircle } from "lucide-react";

export default function CreateChallengePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { createChallenge } = await import("@/lib/api");
      
      await createChallenge({
        title: formData.title,
        description: formData.description,
        rules: formData.rules,
        deadline: new Date(formData.deadline).toISOString(),
      });

      setIsSubmitting(false);
      setSuccess(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        rules: "",
        deadline: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error creating challenge:", err);
      // You could add error state here
    }
  };

  const isFormValid = formData.title && formData.description && formData.rules && formData.deadline;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PlusCircle className="h-8 w-8 text-primary" />
          Create Challenge
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new hackathon challenge for participants
        </p>
      </div>

      {success && (
        <Alert className="bg-green-500/10 border-green-500/50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Challenge created successfully! Participants can now view and submit solutions.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Data Analysis Challenge: Customer Insights"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                A clear, descriptive title for the challenge
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief overview of the challenge..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                A short description that will appear on the challenge card (2-3 sentences)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Rules & Requirements *</Label>
              <Textarea
                id="rules"
                name="rules"
                placeholder="1. Submit your solution as a Python script&#10;2. Include documentation&#10;3. ..."
                value={formData.rules}
                onChange={handleChange}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Detailed rules, requirements, and submission guidelines
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Submissions will not be accepted after this date and time
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Challenge...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Challenge
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/challenges")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Tips for Creating Challenges</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Make the title clear and specific to the challenge domain</li>
            <li>Provide enough context in the description without overwhelming participants</li>
            <li>Include clear acceptance criteria in the rules</li>
            <li>Specify file formats accepted (CSV, JSON, Python scripts)</li>
            <li>Set realistic deadlines that give participants enough time</li>
            <li>Consider including example inputs/outputs if applicable</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
