
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTasks } from '../components/TaskContext';
import { useAuth } from '../components/AuthContext';
import { Difficulty, Comment } from '../types';
import { Clock, User, Award, Tag, ExternalLink, ThumbsUp, Code, MessageSquare, Trash2 } from 'lucide-react';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTask, getSubmissionsForTask, upvoteSubmission, getCommentsForTask, addComment, deleteComment, deleteSubmission } = useTasks();
  const { user } = useAuth();

  const task = getTask(id || '');
  const submissions = getSubmissionsForTask(id || '');
  const comments = getCommentsForTask(id || '');

  const [commentText, setCommentText] = useState('');
  
  // Track upvoted submission IDs in localStorage
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('opsnexus_upvoted_submissions');
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  });

  const handleUpvote = (submissionId: string) => {
    if (upvotedIds.has(submissionId)) return;

    upvoteSubmission(submissionId);
    
    const newSet = new Set(upvotedIds);
    newSet.add(submissionId);
    setUpvotedIds(newSet);
    localStorage.setItem('opsnexus_upvoted_submissions', JSON.stringify(Array.from(newSet)));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !task) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      taskId: task.id,
      userName: user.username,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    
    addComment(newComment);
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      deleteComment(commentId);
    }
  };

  const handleDeleteSubmission = (submissionId: string) => {
    if (window.confirm('Delete this submission?')) {
      deleteSubmission(submissionId);
    }
  };

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task not found</h2>
        <Link to="/tasks" className="text-primary hover:underline mt-4 inline-block">Back to tasks</Link>
      </div>
    );
  }

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case Difficulty.INTERMEDIATE: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case Difficulty.ADVANCED: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/tasks" className="hover:text-primary">Tasks</Link> &gt; <span className="text-gray-800 dark:text-gray-200">{task.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Task + Comments + Solutions) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Task Card */}
          <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </span>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                <Clock className="h-4 w-4" /> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recently'}
              </span>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                <User className="h-4 w-4" /> 
                <Link to={`/profile/${task.author}`} className="hover:text-primary">
                  {task.author || 'Community'}
                </Link>
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{task.title}</h1>
            
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {task.description}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
               <div className="flex flex-wrap gap-2">
                 {task.tools.map(tool => (
                   <span key={tool} className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-gray-800 text-primary dark:text-blue-300 rounded-md text-sm">
                     <Tag className="h-3 w-3 mr-1" /> {tool}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="text-blue-800 dark:text-blue-200 font-medium">
              Know how to solve this?
            </div>
            <Link
              to={user ? `/submit?taskId=${task.id}` : "/login"}
              className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold shadow-sm transition-colors"
            >
              Submit Solution
            </Link>
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Discussion <span className="text-sm font-normal text-gray-500">({comments.length})</span>
            </h3>
            
            <div className="space-y-4 mb-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3 text-sm group">
                  <div className="flex-shrink-0 mt-1">
                     <div className="bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                        {comment.userName.charAt(0).toUpperCase()}
                     </div>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <Link to={`/profile/${comment.userName}`} className="font-semibold text-primary hover:underline">{comment.userName}</Link>
                        <span className="text-gray-400 text-xs">{new Date(comment.timestamp).toLocaleDateString()}</span>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                     </div>
                     <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-500 text-sm italic">No comments yet.</p>}
            </div>

            {user ? (
              <form onSubmit={handlePostComment} className="flex gap-3">
                 <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   placeholder="Ask a question or share a tip..."
                   className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                 />
                 <button 
                   type="submit" 
                   disabled={!commentText.trim()}
                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                 >
                   Post
                 </button>
              </form>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm text-center text-gray-500 dark:text-gray-400">
                <Link to="/login" className="text-primary hover:underline">Log in</Link> to join the discussion.
              </div>
            )}
          </div>

          {/* Solutions Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              Community Solutions <span className="bg-gray-200 dark:bg-gray-700 text-base font-normal py-0.5 px-3 rounded-full text-gray-600 dark:text-gray-300">{submissions.length}</span>
            </h3>

            {submissions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-darklighter rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <Code className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No solutions yet. Be the first to solve it!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white dark:bg-darklighter rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative group">
                    
                    {user?.role === 'admin' && (
                       <button 
                         onClick={() => handleDeleteSubmission(sub.id)}
                         className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                         title="Delete Submission (Admin)"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold">
                          {sub.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link to={`/profile/${sub.userName}`} className="font-semibold text-primary dark:text-blue-400 hover:underline">{sub.userName}</Link>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Submitted on {new Date(sub.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(sub.id)}
                        disabled={upvotedIds.has(sub.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          upvotedIds.has(sub.id)
                            ? 'bg-orange-100 text-so-orange dark:bg-orange-900/30 cursor-default ring-1 ring-orange-200 dark:ring-orange-800'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ring-1 ring-gray-200 dark:ring-gray-700'
                        }`}
                        title={upvotedIds.has(sub.id) ? 'You upvoted this' : 'Upvote this solution'}
                      >
                         <ThumbsUp className={`h-4 w-4 ${upvotedIds.has(sub.id) ? 'fill-current' : ''}`} /> 
                         <span>{sub.upvotes}</span>
                      </button>
                    </div>
                    
                    {sub.description && (
                      <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm">
                        {sub.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-4">
                      <a 
                        href={sub.repoLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" /> View Repository
                      </a>
                      {sub.screenshotUrl && (
                        <a 
                          href={sub.screenshotUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                        >
                          View Screenshot
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-darklighter p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Reward</h4>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                 <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{task.points}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Reputation Points</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <h4 className="font-bold text-lg mb-2">Need a hint?</h4>
            <p className="text-indigo-100 text-sm mb-4">
              OpsBot is ready to help you break down this problem without giving away the full answer.
            </p>
            <button 
              onClick={() => {
                const chatTrigger = document.querySelector('button[aria-label="Toggle Chat"]') as HTMLElement;
                if (chatTrigger) {
                  chatTrigger.click();
                } else {
                  alert("Click the chat bubble in the bottom right corner!");
                }
              }}
              className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition"
            >
              Ask AI Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
