import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Submission, Comment } from '../types';
import { MOCK_TASKS, MOCK_SUBMISSIONS, MOCK_COMMENTS } from '../constants';

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
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage if available, otherwise use MOCK constants
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('opsnexus_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('opsnexus_submissions');
    return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('opsnexus_comments');
    return saved ? JSON.parse(saved) : MOCK_COMMENTS;
  });

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('opsnexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('opsnexus_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('opsnexus_comments', JSON.stringify(comments));
  }, [comments]);

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSubmissions(prev => prev.filter(s => s.taskId !== taskId));
    setComments(prev => prev.filter(c => c.taskId !== taskId));
  };

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => [submission, ...prev]);
  };

  const deleteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== submissionId));
  };

  const getTask = (id: string) => {
    return tasks.find(t => t.id === id);
  };

  const getSubmissionsForTask = (taskId: string) => {
    return submissions.filter(s => s.taskId === taskId).sort((a, b) => b.upvotes - a.upvotes);
  };

  const upvoteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, upvotes: sub.upvotes + 1 } : sub
    ));
  };

  const addComment = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const getCommentsForTask = (taskId: string) => {
    return comments.filter(c => c.taskId === taskId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
      getCommentsForTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};
