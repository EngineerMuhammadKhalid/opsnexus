
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { db } from '../services/database';
import { Database, User as UserIcon, CheckSquare, MessageSquare, Code, RefreshCw, Trash } from 'lucide-react';

const AdminDatabase: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'submissions' | 'comments'>('users');
  // Use a force update pattern that TypeScript ignores (skipping the first destructuring element)
  const [, setRefreshTrigger] = useState(0);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const renderTable = () => {
    switch (activeTab) {
      case 'users':
        const users = db.users.getAll();
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-darklighter divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'tasks':
        const tasks = db.tasks.getAll();
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-darklighter divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{t.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{t.difficulty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{t.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                       <button 
                         onClick={() => { db.tasks.delete(t.id); refresh(); }}
                         className="text-red-600 hover:text-red-900"
                       >
                         <Trash className="h-4 w-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        case 'submissions':
          const subs = db.submissions.getAll();
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repo</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-darklighter divide-y divide-gray-200 dark:divide-gray-700">
                  {subs.map(s => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{s.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{s.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{s.taskTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                        <a href={s.repoLink} target="_blank" rel="noreferrer" className="hover:underline">Link</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
      case 'comments':
          const comments = db.comments.getAll();
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-darklighter divide-y divide-gray-200 dark:divide-gray-700">
                  {comments.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{c.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{c.taskId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{c.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{c.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                         <button 
                           onClick={() => { db.comments.delete(c.id); refresh(); }}
                           className="text-red-600 hover:text-red-900"
                         >
                           <Trash className="h-4 w-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
      default:
        return null;
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Database className="h-8 w-8 text-so-orange" /> System Database
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Raw data view of the application persistence layer.
          </p>
        </div>
        <button 
          onClick={refresh} 
          className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-darklighter text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <UserIcon className="h-5 w-5" /> Users
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'tasks' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-darklighter text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <CheckSquare className="h-5 w-5" /> Tasks
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'submissions' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-darklighter text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Code className="h-5 w-5" /> Submissions
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'comments' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-darklighter text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <MessageSquare className="h-5 w-5" /> Comments
          </button>
        </div>

        {/* Main Table View */}
        <div className="flex-1 bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">{activeTab} Table</h2>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
               {activeTab === 'users' ? db.users.getAll().length : 
                activeTab === 'tasks' ? db.tasks.getAll().length :
                activeTab === 'submissions' ? db.submissions.getAll().length :
                db.comments.getAll().length} records
            </span>
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default AdminDatabase;
