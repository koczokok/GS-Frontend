import { Challenge, Submission, User, Role, LeaderboardEntry } from "@/types";

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: Role.PARTICIPANT,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: Role.PARTICIPANT,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: Role.PARTICIPANT,
  },
  {
    id: "4",
    name: "Dr. Emily Watson",
    email: "judge@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    role: Role.JUDGE,
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    role: Role.ADMIN,
  },
  {
    id: "6",
    name: "Jamie Lee",
    email: "jamie@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    role: Role.PARTICIPANT,
  },
];

// Mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "Data Analysis Challenge: Customer Insights",
    description: "Analyze customer purchase data to identify trends and patterns. Use the provided CSV dataset to extract meaningful insights about customer behavior, popular products, and sales trends.",
    rules: "1. Submit your analysis as a Python script (.py) or Jupyter notebook\n2. Include data visualizations and statistical summaries\n3. Provide actionable business recommendations\n4. Code must be well-documented with comments\n5. Use pandas, matplotlib, or seaborn libraries",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: 2,
    title: "Machine Learning Model: Predict Customer Churn",
    description: "Build a machine learning model to predict which customers are likely to churn. Train your model on the provided dataset and submit predictions for the test set.",
    rules: "1. Submit a Python script with your trained model\n2. Include model evaluation metrics (accuracy, precision, recall, F1)\n3. Submit predictions as a CSV file\n4. Document your feature engineering process\n5. Maximum file size: 10MB",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  },
  {
    id: 3,
    title: "API Design Challenge: RESTful Service",
    description: "Design and document a RESTful API for a social media platform. Your submission should include API endpoints, request/response formats, and error handling.",
    rules: "1. Submit an OpenAPI/Swagger specification (JSON or YAML)\n2. Include at least 10 endpoints covering CRUD operations\n3. Document authentication and authorization\n4. Provide example requests and responses\n5. Consider rate limiting and pagination",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
  {
    id: 4,
    title: "Code Optimization Challenge",
    description: "Optimize the provided inefficient Python code to improve performance by at least 50%. Focus on algorithmic improvements and best practices.",
    rules: "1. Submit optimized Python script (.py)\n2. Include performance benchmarks (before/after timing)\n3. Explain optimization techniques used\n4. Maintain original functionality\n5. Code must pass all test cases",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    id: 5,
    title: "Data Visualization Dashboard",
    description: "Create an interactive dashboard to visualize climate change data. Use the provided datasets to create compelling visualizations that tell a story.",
    rules: "1. Submit Python script using Plotly, Dash, or Streamlit\n2. Include at least 5 different chart types\n3. Dashboard must be interactive\n4. Include data filtering options\n5. Provide a README with setup instructions",
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
  },
  {
    id: 6,
    title: "Algorithm Challenge: Path Finding",
    description: "Implement an efficient pathfinding algorithm for a maze-solving robot. Your solution should handle dynamic obstacles and find the optimal path.",
    rules: "1. Submit Python implementation\n2. Include test cases and performance metrics\n3. Algorithm must handle 100x100 grids\n4. Visualize the path found\n5. Time complexity should be O(n log n) or better",
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (past deadline)
  },
];

// Mock submissions
export const mockSubmissions: Submission[] = [
  {
    id: 1,
    challengeId: 1,
    userId: "1",
    userName: "Alex Chen",
    challengeTitle: "Data Analysis Challenge: Customer Insights",
    score: 85,
    feedback: "Excellent data analysis with clear visualizations. The insights about seasonal trends were particularly valuable. Could improve by adding more statistical tests.",
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fileName: "customer_analysis",
    fileExtension: "py",
  },
  {
    id: 2,
    challengeId: 2,
    userId: "1",
    userName: "Alex Chen",
    challengeTitle: "Machine Learning Model: Predict Customer Churn",
    score: null,
    feedback: null,
    submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fileName: "churn_prediction_model",
    fileExtension: "py",
  },
  {
    id: 3,
    challengeId: 1,
    userId: "2",
    userName: "Sarah Johnson",
    challengeTitle: "Data Analysis Challenge: Customer Insights",
    score: 92,
    feedback: "Outstanding work! Comprehensive analysis with professional-grade visualizations. Great use of statistical methods. Minor improvement: add executive summary.",
    submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    fileName: "customer_insights_analysis",
    fileExtension: "py",
  },
  {
    id: 4,
    challengeId: 4,
    userId: "2",
    userName: "Sarah Johnson",
    challengeTitle: "Code Optimization Challenge",
    score: 78,
    feedback: "Good optimization efforts with 45% performance improvement. Code is clean and well-documented. Didn't quite reach the 50% target but solid approach.",
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    fileName: "optimized_solution",
    fileExtension: "py",
  },
  {
    id: 5,
    challengeId: 3,
    userId: "3",
    userName: "Michael Rodriguez",
    challengeTitle: "API Design Challenge: RESTful Service",
    score: 88,
    feedback: "Well-structured API design with good documentation. Authentication scheme is robust. Consider adding more detailed error codes.",
    submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fileName: "social_media_api",
    fileExtension: "json",
  },
  {
    id: 6,
    challengeId: 2,
    userId: "3",
    userName: "Michael Rodriguez",
    challengeTitle: "Machine Learning Model: Predict Customer Churn",
    score: null,
    feedback: null,
    submissionDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    fileName: "ml_churn_predictor",
    fileExtension: "py",
  },
  {
    id: 7,
    challengeId: 5,
    userId: "6",
    userName: "Jamie Lee",
    challengeTitle: "Data Visualization Dashboard",
    score: 95,
    feedback: "Exceptional dashboard with intuitive interactions! Beautiful design and insightful visualizations. This is exactly what we were looking for.",
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fileName: "climate_dashboard",
    fileExtension: "py",
  },
  {
    id: 8,
    challengeId: 6,
    userId: "6",
    userName: "Jamie Lee",
    challengeTitle: "Algorithm Challenge: Path Finding",
    score: 82,
    feedback: "Solid implementation of A* algorithm. Good performance on test cases. Visualization is helpful. Could optimize memory usage for larger grids.",
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    fileName: "pathfinding_algorithm",
    fileExtension: "py",
  },
];

// Utility function to get submissions by user
export function getSubmissionsByUser(userId: string): Submission[] {
  return mockSubmissions.filter((sub) => sub.userId === userId);
}

// Utility function to get submissions by challenge
export function getSubmissionsByChallenge(challengeId: number): Submission[] {
  return mockSubmissions.filter((sub) => sub.challengeId === challengeId);
}

// Utility function to get challenge by ID
export function getChallengeById(id: number): Challenge | undefined {
  return mockChallenges.find((challenge) => challenge.id === id);
}

// Utility function to calculate leaderboard
export function calculateLeaderboard(): LeaderboardEntry[] {
  const userScores = new Map<string, { total: number; count: number; user: User }>();

  mockSubmissions.forEach((submission) => {
    if (submission.score !== null) {
      const existing = userScores.get(submission.userId) || {
        total: 0,
        count: 0,
        user: mockUsers.find((u) => u.id === submission.userId)!,
      };
      existing.total += submission.score;
      existing.count += 1;
      userScores.set(submission.userId, existing);
    }
  });

  const entries: LeaderboardEntry[] = Array.from(userScores.entries())
    .map(([userId, data]) => ({
      userId,
      userName: data.user.name,
      userImage: data.user.image,
      totalScore: data.total,
      submissionCount: data.count,
      rank: 0, // Will be assigned after sorting
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return entries;
}

// Utility function to get user stats
export function getUserStats(userId: string) {
  const userSubmissions = getSubmissionsByUser(userId);
  const scoredSubmissions = userSubmissions.filter((sub) => sub.score !== null);
  const totalScore = scoredSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
  const averageScore = scoredSubmissions.length > 0 ? totalScore / scoredSubmissions.length : 0;

  const leaderboard = calculateLeaderboard();
  const userEntry = leaderboard.find((entry) => entry.userId === userId);
  const rank = userEntry?.rank || 0;

  const completedChallenges = new Set(scoredSubmissions.map((sub) => sub.challengeId)).size;

  return {
    totalSubmissions: userSubmissions.length,
    averageScore: Math.round(averageScore),
    rank,
    completedChallenges,
  };
}

// Utility function to check if challenge is active
export function isChallengeActive(challenge: Challenge): boolean {
  return new Date() < new Date(challenge.deadline);
}

// Utility function to get user by email (for role assignment)
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

// Mock function to assign role based on email pattern
export function getRoleFromEmail(email: string): Role {
  if (email.includes("admin")) return Role.ADMIN;
  if (email.includes("judge")) return Role.JUDGE;
  return Role.PARTICIPANT;
}
