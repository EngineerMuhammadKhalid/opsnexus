
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tools: string[];
  category: string;
  points: number;
  author?: string;
  createdAt?: string;
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  userName: string;
  repoLink: string;
  screenshotUrl?: string;
  timestamp: string;
  upvotes: number;
  description?: string; // Short description of the solution
}

export interface Comment {
  id: string;
  taskId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  icon: string;
}

export interface User {
  id: string;
  username: string;
  password?: string; // For mock auth
  role: 'admin' | 'user';
  avatarUrl: string;
  solutionsCount: number;
  badges: string[]; // Array of badge names
  totalPoints: number;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}
