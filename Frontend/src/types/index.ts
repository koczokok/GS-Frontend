// Enum for user roles
export enum Role {
  PARTICIPANT = "PARTICIPANT",
  JUDGE = "JUDGE",
  ADMIN = "ADMIN",
}

// Challenge entity matching backend schema
export interface Challenge {
  id: number;
  title: string;
  description: string;
  rules: string;
  deadline: Date;
}

// Submission entity matching backend schema
export interface Submission {
  id: number;
  challengeId: number;
  userId: string;
  userName?: string; // For display purposes
  challengeTitle?: string; // For display purposes
  score: number | null;
  feedback: string | null;
  submissionDate: Date;
  fileName: string;
  fileExtension: string;
  file?: File | Blob; // File for upload, Blob for download
}

// User entity
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
}

// Leaderboard entry for rankings
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage?: string;
  totalScore: number;
  submissionCount: number;
}

// Stats for dashboard
export interface UserStats {
  totalSubmissions: number;
  averageScore: number;
  rank: number;
  completedChallenges: number;
}
