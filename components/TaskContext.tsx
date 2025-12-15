
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Submission, Comment } from '../types';
import { db } from '../services/database';

interface TaskContextType {
  tasks: Task[];
  submissions: Submission[];
  comments: Comment[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  addSubmission: (submission: Submission) => void;
  deleteSubmission: (submissionId: string) => void;
  getTask: (id: string) => Task | undefined;
  getSubmissionsForTask: (taskId: string) => Submission[];
  upvoteSubmission: (submissionId: string) => void;
  addComment: (comment: Comment) => void;
  deleteComment: (commentId: string) => void;
  getCommentsForTask: (taskId: string) => Comment[];
  updateUserReferences: (oldUsername: string, newUsername: string) => void;
  refreshData: () => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  submissions: [],
  comments: [],
  addTask: () => {},
  deleteTask: () => {},
  addSubmission: () => {},
  deleteSubmission: () => {},
  getTask: () => undefined,
  getSubmissionsForTask: () => [],
  upvoteSubmission: () => {},
  addComment: () => {},
  deleteComment: () => {},
  getCommentsForTask: () => [],
  updateUserReferences: () => {},
  refreshData: () => {},
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We keep local state to trigger re-renders, but source of truth is DB service
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const refreshData = () => {
    setTasks(db.tasks.getAll());
    setSubmissions(db.submissions.getAll());
    setComments(db.comments.getAll());
  };

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  const addTask = (task: Task) => {
    db.tasks.create(task);
    refreshData();
  };

  const deleteTask = (taskId: string) => {
    db.tasks.delete(taskId);
    refreshData();
  };

  const addSubmission = (submission: Submission) => {
    db.submissions.create(submission);
    refreshData();
  };

  const deleteSubmission = (submissionId: string) => {
    db.submissions.delete(submissionId);
    refreshData();
  };

  const getTask = (id: string) => {
    return tasks.find(t => t.id === id);
  };

  const getSubmissionsForTask = (taskId: string) => {
    return submissions.filter(s => s.taskId === taskId).sort((a, b) => b.upvotes - a.upvotes);
  };

  const upvoteSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (sub) {
      const updated = { ...sub, upvotes: sub.upvotes + 1 };
      db.submissions.update(updated);
      refreshData();
    }
  };

  const addComment = (comment: Comment) => {
    db.comments.create(comment);
    refreshData();
  };

  const deleteComment = (commentId: string) => {
    db.comments.delete(commentId);
    refreshData();
  };

  const getCommentsForTask = (taskId: string) => {
    return comments.filter(c => c.taskId === taskId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Update all references when a user changes their username
  const updateUserReferences = (oldUsername: string, newUsername: string) => {
    db.users.updateUsernameRef(oldUsername, newUsername);
    refreshData();
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      submissions, 
      comments,
      addTask, 
      deleteTask, 
      addSubmission, 
      deleteSubmission,
      getTask, 
      getSubmissionsForTask, 
      upvoteSubmission,
      addComment, 
      deleteComment,
      getCommentsForTask,
      updateUserReferences,
      refreshData
    }}>
      {children}
    </TaskContext.Provider>
  );
};
