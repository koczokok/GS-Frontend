const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface Challenge {
  id: number
  title: string
  description: string
  rules: string
  deadline: string
}

export interface Submission {
  id: number
  score: number | null
  feedback: string | null
  submissionDate: string
  fileName: string
  fileExtension: string
  challengeId: number
  user?: {
    id: number
    email: string
  }
}

export interface User {
  id: number
  email: string
  providerId: string
  role?: {
    id: number
    name: string
  }
  team: string | null
}

export interface TodoItem {
  id: number
  text: string
  done: boolean
  deadline: string | null
  userId: number
  challenge?: Challenge | null
}

// Challenges API
export async function getChallenges(): Promise<Challenge[]> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch('/api/challenges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Failed to fetch challenges: ${response.status} ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Cannot connect to backend at ${API_BASE_URL}. Is the backend server running?`)
    }
    throw error
  }
}

export async function getChallengeById(id: number): Promise<Challenge> {
  const response = await fetch(`/api/challenges/${id}`)
  if (!response.ok) throw new Error("Failed to fetch challenge")
  return response.json()
}

export async function getActiveChallenges(): Promise<Challenge[]> {
  const response = await fetch(`/api/challenges/active`)
  if (!response.ok) throw new Error("Failed to fetch active challenges")
  return response.json()
}

export async function createChallenge(challenge: Omit<Challenge, "id">): Promise<Challenge> {
  const response = await fetch(`/api/challenges/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(challenge),
  })
  if (!response.ok) throw new Error("Failed to create challenge")
  return response.json()
}

// Submissions API
export async function getSubmissions(): Promise<Submission[]> {
  const response = await fetch(`${API_BASE_URL}/api/submissions`)
  if (!response.ok) throw new Error("Failed to fetch submissions")
  return response.json()
}

export async function getSubmissionById(id: number): Promise<Submission> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`)
  if (!response.ok) throw new Error("Failed to fetch submission")
  return response.json()
}

export async function getSubmissionsByUser(userId: number): Promise<Submission[]> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/user/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch user submissions")
  return response.json()
}

export async function getSubmissionsByChallenge(challengeId: number): Promise<Submission[]> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/challenge/${challengeId}`)
  if (!response.ok) throw new Error("Failed to fetch challenge submissions")
  return response.json()
}

export async function createSubmission(data: {
  challengeId: number
  userId: number
  file: File
  fileName: string
  fileExtension: string
}): Promise<Submission> {
  // Convert file to base64
  const fileBase64 = await fileToBase64(data.file)
  const fileBytes = Uint8Array.from(atob(fileBase64), c => c.charCodeAt(0))

  const submission = {
    challengeId: data.challengeId,
    userId: data.userId,
    fileName: data.fileName,
    fileExtension: data.fileExtension,
    file: Array.from(fileBytes),
    submissionDate: new Date().toISOString(),
    score: null,
    feedback: null,
  }

  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  })
  if (!response.ok) throw new Error("Failed to create submission")
  return response.json()
}

export async function updateSubmission(
  id: number,
  score: number,
  feedback: string
): Promise<Submission> {
  const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, feedback }),
  })
  if (!response.ok) throw new Error("Failed to update submission")
  return response.json()
}

// Helper to convert file to base64 for submission
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:type;base64, prefix
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

// Users API
export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`)
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((u) => u.email === email) || null
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`)
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

// Todos API
export async function getTodos(): Promise<TodoItem[]> {
  const response = await fetch(`/api/todos`)
  if (!response.ok) throw new Error("Failed to fetch todos")
  return response.json()
}

export async function getTodosByUser(userId: number): Promise<TodoItem[]> {
  const response = await fetch(`/api/todos?userId=${userId}`)
  if (!response.ok) throw new Error("Failed to fetch user todos")
  return response.json()
}

export async function createTodo(todo: Omit<TodoItem, "id">): Promise<TodoItem> {
  const response = await fetch(`/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  })
  if (!response.ok) throw new Error("Failed to create todo")
  return response.json()
}

export async function updateTodo(id: number, todo: Partial<TodoItem>): Promise<TodoItem> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  })
  if (!response.ok) throw new Error("Failed to update todo")
  return response.json()
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete todo")
}

// Hackathon Information API
export async function getHackathonInformation() {
  const response = await fetch(`${API_BASE_URL}/api/hackathon-information`)
  if (!response.ok) return null
  return response.json()
}

// Helper function to check if challenge is active
export function isChallengeActive(challenge: Challenge): boolean {
  const deadline = new Date(challenge.deadline)
  const now = new Date()
  return deadline > now
}

// Calculate leaderboard from submissions
export async function calculateLeaderboard() {
  const submissions = await getSubmissions()
  const users = await getAllUsers()

  // Group submissions by user and calculate scores
  const userScores = new Map<number, { totalScore: number; submissionCount: number }>()

  submissions.forEach((sub) => {
    if (sub.score !== null && sub.user) {
      const userId = sub.user.id
      const current = userScores.get(userId) || { totalScore: 0, submissionCount: 0 }
      userScores.set(userId, {
        totalScore: current.totalScore + sub.score,
        submissionCount: current.submissionCount + 1,
      })
    }
  })

  // Convert to array and sort
  const leaderboard = Array.from(userScores.entries())
    .map(([userId, scores]) => {
      const user = users.find((u) => u.id === userId)
      return {
        userId: userId.toString(),
        userName: user?.email || "Unknown",
        totalScore: scores.totalScore,
        submissionCount: scores.submissionCount,
        averageScore: Math.round(scores.totalScore / scores.submissionCount),
        rank: 0, // Will be set after sorting
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)

  // Assign ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1
  })

  return leaderboard
}

