
import { Difficulty, Task, User, Submission, Badge, Comment } from './types';

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Dockerize a Node.js App',
    description: 'Create a Dockerfile for a basic Express.js application. Ensure usage of multi-stage builds to minimize image size. The application listens on port 3000.',
    difficulty: Difficulty.BEGINNER,
    tools: ['Docker', 'Node.js'],
    category: 'Containerization',
    points: 10,
    author: 'cloud_guru',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 't2',
    title: 'Deploy to AWS via Terraform',
    description: 'Write Terraform scripts to provision an EC2 instance, a Security Group allowing port 80/443, and an S3 bucket. Store state remotely if possible.',
    difficulty: Difficulty.INTERMEDIATE,
    tools: ['Terraform', 'AWS'],
    category: 'IaC',
    points: 30,
    author: 'devops_ninja',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 't3',
    title: 'Setup GitHub Actions CI/CD',
    description: 'Create a workflow that runs tests on every push and deploys to a staging environment on merge to main.',
    difficulty: Difficulty.INTERMEDIATE,
    tools: ['GitHub Actions', 'Bash'],
    category: 'CI/CD',
    points: 25,
    author: 'automation_queen',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 't4',
    title: 'Kubernetes Ingress Controller',
    description: 'Deploy Nginx Ingress Controller on a local Minikube cluster and configure routing for two microservices.',
    difficulty: Difficulty.ADVANCED,
    tools: ['Kubernetes', 'Helm', 'Nginx'],
    category: 'Orchestration',
    points: 50,
    author: 'k8s_fanatic',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 't5',
    title: 'Log Aggregation with ELK',
    description: 'Set up an Elasticsearch, Logstash, and Kibana stack using Docker Compose to visualize logs from a Python app.',
    difficulty: Difficulty.ADVANCED,
    tools: ['Docker Compose', 'Elasticsearch', 'Kibana'],
    category: 'Monitoring',
    points: 45,
    author: 'log_master',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 't6',
    title: 'Basic Linux Shell Scripting',
    description: 'Write a script that monitors disk usage and sends an alert if usage exceeds 80%.',
    difficulty: Difficulty.BEGINNER,
    tools: ['Bash', 'Linux'],
    category: 'Scripting',
    points: 15,
    author: 'shell_wizard',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  }
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    taskId: 't1',
    taskTitle: 'Dockerize a Node.js App',
    userName: 'junior_dev_1',
    repoLink: 'https://github.com/example/docker-node',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    upvotes: 5,
    description: 'Here is my multi-stage build using alpine images.'
  },
  {
    id: 's2',
    taskId: 't1',
    taskTitle: 'Dockerize a Node.js App',
    userName: 'container_pro',
    repoLink: 'https://github.com/example/optimized-docker',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    upvotes: 12,
    description: 'Used distroless images for maximum security and minimal size.'
  },
  {
    id: 's3',
    taskId: 't2',
    taskTitle: 'Deploy to AWS via Terraform',
    userName: 'devops_ninja',
    repoLink: 'https://github.com/devops_ninja/terraform-aws',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    upvotes: 25,
    description: 'Full modular Terraform structure with remote backend state locking.'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    taskId: 't1',
    userName: 'devops_ninja',
    text: 'Make sure to ignore node_modules in your .dockerignore file!',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'c2',
    taskId: 't1',
    userName: 'cloud_guru',
    text: 'Great tip! Also, try using `npm ci` instead of `npm install` for builds.',
    timestamp: new Date(Date.now() - 86400000 * 3.9).toISOString()
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'devops_ninja',
    password: 'password123',
    role: 'admin',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    solutionsCount: 42,
    badges: ['Top Contributor', 'Docker Pro', 'Terraform Master'],
    totalPoints: 1250,
    bio: 'Senior DevOps Engineer passionate about automation and IaC.',
    location: 'San Francisco, CA',
    joinedAt: '2023-01-15'
  },
  {
    id: 'u2',
    username: 'cloud_walker',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    solutionsCount: 28,
    badges: ['Automation Hero'],
    totalPoints: 890,
    joinedAt: '2023-03-22'
  },
  {
    id: 'u3',
    username: 'script_kiddie_v2',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    solutionsCount: 15,
    badges: ['Rising Star'],
    totalPoints: 450,
    joinedAt: '2023-06-10'
  },
  {
    id: 'u4',
    username: 'k8s_fanatic',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    solutionsCount: 12,
    badges: [],
    totalPoints: 320,
    joinedAt: '2023-08-05'
  },
  {
    id: 'u5',
    username: 'cloud_guru',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=5',
    solutionsCount: 55,
    badges: ['Top Contributor'],
    totalPoints: 1500,
    joinedAt: '2022-11-05'
  },
  {
    id: 'u6',
    username: 'automation_queen',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=6',
    solutionsCount: 30,
    badges: ['Automation Hero'],
    totalPoints: 950,
    joinedAt: '2023-02-14'
  },
  {
    id: 'u7',
    username: 'log_master',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=7',
    solutionsCount: 18,
    badges: [],
    totalPoints: 400,
    joinedAt: '2023-05-30'
  },
  {
    id: 'u8',
    username: 'shell_wizard',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=8',
    solutionsCount: 22,
    badges: ['Bug Hunter'],
    totalPoints: 600,
    joinedAt: '2023-04-12'
  },
   {
    id: 'u9',
    username: 'junior_dev_1',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=9',
    solutionsCount: 5,
    badges: ['Rising Star'],
    totalPoints: 100,
    joinedAt: '2023-09-01'
  },
  {
    id: 'u10',
    username: 'container_pro',
    password: 'password123',
    role: 'user',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    solutionsCount: 25,
    badges: ['Docker Pro'],
    totalPoints: 750,
    joinedAt: '2023-03-15'
  }
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Top Contributor', description: 'Reached 1000+ Reputation Points', tier: 'Gold', icon: 'Award' },
  { id: 'b2', name: 'Terraform Master', description: 'Submitted 10+ Terraform Solutions', tier: 'Silver', icon: 'Server' },
  { id: 'b3', name: 'Docker Pro', description: 'Submitted 5+ Docker Solutions', tier: 'Silver', icon: 'Box' },
  { id: 'b4', name: 'Automation Hero', description: 'Created a highly upvoted CI/CD pipeline', tier: 'Silver', icon: 'Zap' },
  { id: 'b5', name: 'Rising Star', description: 'Joined and submitted a solution in the first week', tier: 'Bronze', icon: 'Star' },
  { id: 'b6', name: 'Bug Hunter', description: 'Fixed a critical issue in a task description', tier: 'Bronze', icon: 'Shield' },
];

export const AVAILABLE_TOOLS = Array.from(new Set(MOCK_TASKS.flatMap(t => t.tools))).sort();
