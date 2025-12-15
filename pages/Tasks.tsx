
import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../components/TaskContext';
import { useAuth } from '../components/AuthContext';
import { AVAILABLE_TOOLS } from '../constants';
import { Difficulty, Task } from '../types';
import { Filter, Tag, BookOpen, AlertCircle, PlusCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tasks: React.FC = () => {
  const { tasks, deleteTask } = useTasks();
  const { user } = useAuth();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterTool, setFilterTool] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesDiff = filterDifficulty === 'All' || task.difficulty === filterDifficulty;
      const matchesTool = filterTool === 'All' || task.tools.includes(filterTool);
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesTool && matchesSearch;
    });
  }, [tasks, filterDifficulty, filterTool, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDifficulty, filterTool, searchQuery]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case Difficulty.INTERMEDIATE: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case Difficulty.ADVANCED: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">DevOps Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Pick a challenge and start building.</p>
        </div>
        <Link to={user ? "/create-task" : "/login"} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Share a Problem
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-darklighter p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <Filter className="h-4 w-4" />
          </span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:text-white appearance-none"
          >
            <option value="All">All Difficulties</option>
            <option value={Difficulty.BEGINNER}>Beginner</option>
            <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
            <option value={Difficulty.ADVANCED}>Advanced</option>
          </select>
        </div>

        <div className="relative">
           <span className="absolute left-3 top-3 text-gray-400">
            <Tag className="h-4 w-4" />
          </span>
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:text-white appearance-none"
          >
            <option value="All">All Tools</option>
            {AVAILABLE_TOOLS.map(tool => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              getDifficultyColor={getDifficultyColor} 
              isAdmin={user?.role === 'admin'}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-darklighter rounded-xl border border-dashed border-gray-300 dark:border-gray-700 h-fit">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or create a new task.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
};

const TaskCard: React.FC<{ 
  task: Task; 
  getDifficultyColor: (d: Difficulty) => string; 
  isAdmin: boolean;
  onDelete: (id: string) => void;
}> = ({ task, getDifficultyColor, isAdmin, onDelete }) => (
  <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col h-full group relative">
    
    {isAdmin && (
      <button 
        onClick={(e) => { e.preventDefault(); onDelete(task.id); }}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 z-10"
        title="Delete Task (Admin)"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )}

    <div className="flex justify-between items-start mb-4 pr-8">
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
        {task.difficulty}
      </span>
      <span className="text-sm font-semibold text-primary">{task.points} pts</span>
    </div>
    
    <Link to={`/tasks/${task.id}`} className="block">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
    </Link>
    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 line-clamp-3">{task.description}</p>
    
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap gap-2">
          {task.tools.slice(0, 3).map(tool => (
            <span key={tool} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-700">
              {tool}
            </span>
          ))}
          {task.tools.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400">+ {task.tools.length - 3} more</span>
          )}
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          By {task.author || 'Anonymous'}
        </div>
        <Link 
          to={`/tasks/${task.id}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-700"
        >
          View Details <BookOpen className="h-3 w-3" />
        </Link>
      </div>
    </div>
  </div>
);

export default Tasks;
