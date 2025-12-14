
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../components/TaskContext';
import { useAuth } from '../components/AuthContext';
import { Difficulty, Task } from '../types';
import { PlusCircle, HelpCircle } from 'lucide-react';

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { addTask } = useTasks();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: Difficulty.BEGINNER,
    tools: '',
    category: 'General',
    points: 10,
    author: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, author: user.username }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toolsArray = formData.tools.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    const newTask: Task = {
      id: `t${Date.now()}`, // Simple ID generation
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tools: toolsArray,
      category: formData.category,
      points: Number(formData.points),
      author: formData.author || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    // Simulate network delay
    setTimeout(() => {
      addTask(newTask);
      setIsSubmitting(false);
      navigate('/tasks');
    }, 800);
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Please log in to post a new task.</p>
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <PlusCircle className="h-8 w-8 text-primary" />
          Share a DevOps Problem
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Post a scenario, bug, or architecture challenge for the community to solve.
        </p>
      </div>

      <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Optimize Docker build time for React App"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Problem Details)
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the scenario, constraints, and goal..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. CI/CD, K8s, Monitoring"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value={Difficulty.BEGINNER}>Beginner</option>
                <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                <option value={Difficulty.ADVANCED}>Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tools */}
            <div>
              <label htmlFor="tools" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tools Involved <span className="text-xs text-gray-500">(comma separated)</span>
              </label>
              <input
                type="text"
                id="tools"
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                placeholder="Docker, AWS, Terraform"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Points */}
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Points Reward
              </label>
              <input
                type="number"
                id="points"
                name="points"
                min="5"
                max="100"
                value={formData.points}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Username
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              disabled
              value={formData.author}
              onChange={handleChange}
              placeholder="Who is asking?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Problem'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-200">
        <HelpCircle className="h-5 w-5 flex-shrink-0" />
        <p>
          <strong>Tip:</strong> Provide clear requirements. If you have a broken configuration file, paste it in the description. The more details you provide, the better solutions you'll receive.
        </p>
      </div>
    </div>
  );
};

export default CreateTask;
