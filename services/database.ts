
import { User, Task, Submission, Comment } from '../types';
import { MOCK_USERS, MOCK_TASKS, MOCK_SUBMISSIONS, MOCK_COMMENTS } from '../constants';

class DatabaseService {
  private get <T>(key: string, defaultData: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        // Initial seed
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error reading ${key} from DB`, e);
      return defaultData;
    }
  }

  private set <T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error writing ${key} to DB`, e);
    }
  }

  // --- USERS ---
  get users() {
    return {
      getAll: (): User[] => this.get('opsnexus_registered_users', MOCK_USERS),
      getById: (id: string): User | undefined => this.users.getAll().find(u => u.id === id),
      getByUsername: (username: string): User | undefined => this.users.getAll().find(u => u.username === username),
      create: (user: User): void => {
        const users = this.users.getAll();
        users.push(user);
        this.set('opsnexus_registered_users', users);
      },
      update: (updatedUser: User): void => {
        const users = this.users.getAll();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          users[index] = updatedUser;
          this.set('opsnexus_registered_users', users);
        }
      },
      // Cascade update for username changes
      updateUsernameRef: (oldName: string, newName: string) => {
        // Update Tasks
        const tasks = this.tasks.getAll();
        const updatedTasks = tasks.map(t => t.author === oldName ? { ...t, author: newName } : t);
        this.set('opsnexus_tasks', updatedTasks);

        // Update Submissions
        const subs = this.submissions.getAll();
        const updatedSubs = subs.map(s => s.userName === oldName ? { ...s, userName: newName } : s);
        this.set('opsnexus_submissions', updatedSubs);

        // Update Comments
        const comments = this.comments.getAll();
        const updatedComments = comments.map(c => c.userName === oldName ? { ...c, userName: newName } : c);
        this.set('opsnexus_comments', updatedComments);
      }
    };
  }

  // --- TASKS ---
  get tasks() {
    return {
      getAll: (): Task[] => this.get('opsnexus_tasks', MOCK_TASKS),
      getById: (id: string): Task | undefined => this.tasks.getAll().find(t => t.id === id),
      create: (task: Task): void => {
        const tasks = this.tasks.getAll();
        tasks.unshift(task); // Add to top
        this.set('opsnexus_tasks', tasks);
      },
      delete: (id: string): void => {
        const tasks = this.tasks.getAll().filter(t => t.id !== id);
        this.set('opsnexus_tasks', tasks);
        // Cascade delete submissions/comments for this task
        const subs = this.submissions.getAll().filter(s => s.taskId !== id);
        this.set('opsnexus_submissions', subs);
        const comments = this.comments.getAll().filter(c => c.taskId !== id);
        this.set('opsnexus_comments', comments);
      }
    };
  }

  // --- SUBMISSIONS ---
  get submissions() {
    return {
      getAll: (): Submission[] => this.get('opsnexus_submissions', MOCK_SUBMISSIONS),
      getByTaskId: (taskId: string): Submission[] => this.submissions.getAll().filter(s => s.taskId === taskId),
      create: (sub: Submission): void => {
        const subs = this.submissions.getAll();
        subs.unshift(sub);
        this.set('opsnexus_submissions', subs);
      },
      delete: (id: string): void => {
        const subs = this.submissions.getAll().filter(s => s.id !== id);
        this.set('opsnexus_submissions', subs);
      },
      update: (updatedSub: Submission): void => {
        const subs = this.submissions.getAll();
        const index = subs.findIndex(s => s.id === updatedSub.id);
        if (index !== -1) {
          subs[index] = updatedSub;
          this.set('opsnexus_submissions', subs);
        }
      }
    };
  }

  // --- COMMENTS ---
  get comments() {
    return {
      getAll: (): Comment[] => this.get('opsnexus_comments', MOCK_COMMENTS),
      getByTaskId: (taskId: string): Comment[] => this.comments.getAll().filter(c => c.taskId === taskId),
      create: (comment: Comment): void => {
        const comments = this.comments.getAll();
        comments.push(comment);
        this.set('opsnexus_comments', comments);
      },
      delete: (id: string): void => {
        const comments = this.comments.getAll().filter(c => c.id !== id);
        this.set('opsnexus_comments', comments);
      }
    };
  }

  // --- UTILS ---
  resetDatabase() {
    localStorage.removeItem('opsnexus_registered_users');
    localStorage.removeItem('opsnexus_tasks');
    localStorage.removeItem('opsnexus_submissions');
    localStorage.removeItem('opsnexus_comments');
    localStorage.removeItem('opsnexus_user'); // Log out
    window.location.reload();
  }
}

export const db = new DatabaseService();
