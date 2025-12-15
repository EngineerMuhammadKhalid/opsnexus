
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../components/TaskContext';
import { useAuth } from '../components/AuthContext';
import { Send, CheckCircle, Github, Info, Upload, Image as ImageIcon } from 'lucide-react';
import { Submission } from '../types';

const SubmitSolution: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskIdParam = searchParams.get('taskId');
  const { tasks, addSubmission } = useTasks();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    taskId: taskIdParam || '',
    username: user ? user.username : '',
    repoLink: '',
    screenshotUrl: '',
    description: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Update taskId if param changes
  useEffect(() => {
    if (taskIdParam) {
      setFormData(prev => ({ ...prev, taskId: taskIdParam }));
    }
  }, [taskIdParam]);

  // Update username if user logs in/out
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, username: user.username }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshotUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const task = tasks.find(t => t.id === formData.taskId);
    
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      taskId: formData.taskId,
      taskTitle: task ? task.title : 'Unknown Task',
      userName: formData.username,
      repoLink: formData.repoLink,
      screenshotUrl: formData.screenshotUrl,
      description: formData.description,
      timestamp: new Date().toISOString(),
      upvotes: 0
    };

    // Simulate API call
    setTimeout(() => {
      addSubmission(newSubmission);
      setStatus('success');
      // Reset after success
      setTimeout(() => {
        // Optional: navigate back to task
        if (taskIdParam) {
          navigate(`/tasks/${taskIdParam}`);
        } else {
           setStatus('idle');
           setFormData({ taskId: '', username: user ? user.username : '', repoLink: '', screenshotUrl: '', description: '' });
        }
      }, 2000);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Please log in to submit a solution.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Submit Your Solution</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showcase your code, earn points, and get feedback from the community.
        </p>
      </div>

      <div className="bg-white dark:bg-darklighter rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {status === 'success' ? (
          <div className="text-center py-10">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Submission Received!</h3>
            <p className="text-gray-600 dark:text-gray-300">Redirecting you shortly...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="taskId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Task
              </label>
              <select
                id="taskId"
                name="taskId"
                required
                value={formData.taskId}
                onChange={handleChange}
                disabled={!!taskIdParam}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
              >
                <option value="">-- Choose a task --</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </select>
              {taskIdParam && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Info className="h-3 w-3"/> Task pre-selected from details page.</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                disabled
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="repoLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Repository / Gist Link
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Github className="h-5 w-5" />
                </span>
                <input
                  type="url"
                  id="repoLink"
                  name="repoLink"
                  required
                  value={formData.repoLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brief Explanation <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="How did you solve it? Any specific tools used?"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Screenshot <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-primary dark:hover:border-primary transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-800/50">
                <div className="space-y-1 text-center">
                  {formData.screenshotUrl ? (
                    <div className="relative">
                      <img src={formData.screenshotUrl} alt="Preview" className="mx-auto h-48 object-contain rounded-md" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, screenshotUrl: ''})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Upload className="h-3 w-3 transform rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 px-4 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting...' : (
                <>
                  <Send className="h-5 w-5" /> Submit Solution
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitSolution;
