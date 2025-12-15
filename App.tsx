
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { TaskProvider } from './components/TaskContext';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import SubmitSolution from './pages/SubmitSolution';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIAgent from './components/AIAgent';
import AdminDatabase from './pages/AdminDatabase';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="min-h-screen transition-colors duration-200">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id" element={<TaskDetail />} />
                  <Route path="/create-task" element={<CreateTask />} />
                  <Route path="/submit" element={<SubmitSolution />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile/:username?" element={<Profile />} />
                  <Route path="/admin/database" element={<AdminDatabase />} />
                </Routes>
              </main>
              
              <AIAgent />

              <footer className="bg-white dark:bg-darklighter border-t border-gray-200 dark:border-gray-700 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <p>&copy; {new Date().getFullYear()} OpsNexus. Built for the DevOps Community.</p>
                </div>
              </footer>
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
