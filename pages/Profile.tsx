
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BADGES } from '../constants';
import { useTasks } from '../components/TaskContext';
import { useAuth } from '../components/AuthContext';
import { User } from '../types';
import { MapPin, Calendar, Award, ExternalLink, Shield, Zap, Box, Server, Star, Edit2, Save, X, RefreshCw } from 'lucide-react';

const Profile: React.FC = () => {
  const { user: currentUser, getUserByUsername, updateUserProfile } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { submissions } = useTasks();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    website: '',
    avatarUrl: ''
  });

  useEffect(() => {
    // If username param exists, lookup user. Else use current user.
    if (username) {
      const foundUser = getUserByUsername(username);
      setProfileUser(foundUser || null);
    } else if (currentUser) {
      // If no param, redirect to own profile url for consistency
      navigate(`/profile/${currentUser.username}`, { replace: true });
    } else {
      // No param, no login -> Login
      navigate('/login');
    }
  }, [username, currentUser, getUserByUsername, navigate]);

  useEffect(() => {
    if (profileUser) {
      setEditForm({
        bio: profileUser.bio || '',
        location: profileUser.location || '',
        website: profileUser.website || '',
        avatarUrl: profileUser.avatarUrl || ''
      });
    }
  }, [profileUser]);

  const handleSave = () => {
    if (currentUser && profileUser && currentUser.id === profileUser.id) {
      updateUserProfile(editForm);
      setIsEditing(false);
      // Update local profile user state to reflect changes immediately
      setProfileUser({ ...profileUser, ...editForm });
    }
  };

  const handleResetData = () => {
    if (window.confirm("⚠️ Reset all data? \n\nThis will clear all created tasks, users, and comments, restoring the app to its initial state. You will be logged out.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!profileUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The user you are looking for does not exist.</p>
      </div>
    );
  }

  // Filter submissions made by this user (including ones added in session)
  const userSubmissions = submissions.filter(s => s.userName === profileUser.username);
  
  // Calculate total upvotes dynamically
  const totalUpvotes = userSubmissions.reduce((acc, curr) => acc + curr.upvotes, 0);

  const isOwner = currentUser?.id === profileUser.id;
  const isAdmin = currentUser?.role === 'admin';
  
  // Map string icon names to Lucide components
  const getBadgeIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Award': return <Award className={className} />;
      case 'Server': return <Server className={className} />;
      case 'Box': return <Box className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Shield': return <Shield className={className} />;
      default: return <Award className={className} />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
      case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
      case 'Bronze': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
        
        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end pt-12">
          
          <div className="relative group">
            <img 
              src={isEditing ? editForm.avatarUrl : profileUser.avatarUrl} 
              alt={profileUser.username} 
              className="h-32 w-32 rounded-lg border-4 border-white dark:border-darklighter shadow-lg bg-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profileUser.username}&background=random`;
              }}
            />
          </div>
          
          <div className="flex-1 mb-2 w-full">
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {profileUser.username} 
                    {profileUser.role === 'admin' && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full font-bold uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </h1>

                  {isEditing ? (
                    <div className="space-y-3 mt-2 max-w-md">
                      <input 
                         type="text"
                         value={editForm.bio}
                         onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                         placeholder="Bio"
                         className="w-full px-3 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <input 
                         type="text"
                         value={editForm.location}
                         onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                         placeholder="Location"
                         className="w-full px-3 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                       <input 
                         type="text"
                         value={editForm.avatarUrl}
                         onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})}
                         placeholder="Avatar URL"
                         className="w-full px-3 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{profileUser.bio || 'DevOps Enthusiast'}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {profileUser.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {profileUser.location}
                          </div>
                        )}
                        {profileUser.joinedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Joined {new Date(profileUser.joinedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </>
                  )}
               </div>

               {isOwner && (
                 <div>
                   {isEditing ? (
                     <div className="flex gap-2">
                        <button 
                          onClick={handleSave} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          <Save className="h-4 w-4" /> Save
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                     </div>
                   ) : (
                     <button 
                       onClick={() => setIsEditing(true)} 
                       className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors"
                     >
                       <Edit2 className="h-4 w-4" /> Edit Profile
                     </button>
                   )}
                 </div>
               )}
            </div>
          </div>

          <div className="flex gap-6 mt-4 md:mt-0">
             <div className="text-center">
               <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.totalPoints}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wide">Reputation</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.solutionsCount}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wide">Solutions</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalUpvotes}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wide">Impact</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Badges */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Badges</h3>
            <div className="grid grid-cols-1 gap-3">
              {BADGES.map(badge => {
                const isEarned = profileUser.badges.includes(badge.name);
                return (
                  <div 
                    key={badge.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isEarned 
                        ? `${getTierColor(badge.tier)}` 
                        : 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-800 opacity-60 grayscale'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getBadgeIcon(badge.icon, "h-6 w-6")}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{badge.name}</div>
                      <div className="text-xs opacity-80">{badge.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

           {/* Admin Zone - Reset Data */}
           {(isAdmin || isOwner) && (
             <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-sm border border-red-200 dark:border-red-900/30 p-6">
               <h3 className="font-bold text-red-800 dark:text-red-400 mb-2 text-lg">Danger Zone</h3>
               <p className="text-xs text-red-600 dark:text-red-300 mb-4">
                 Resetting data will clear all local changes, new tasks, and created users. The app will revert to the default mock data.
               </p>
               <button 
                 onClick={handleResetData}
                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
               >
                 <RefreshCw className="h-4 w-4" /> Reset Demo Data
               </button>
             </div>
           )}
        </div>

        {/* Right Column: Activity History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-darklighter rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Recent Submissions</h3>
            
            {userSubmissions.length === 0 ? (
               <p className="text-gray-500 dark:text-gray-400 italic">No submissions yet.</p>
            ) : (
              <div className="space-y-6">
                {userSubmissions.map(sub => (
                  <div key={sub.id} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0 pb-6">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-white dark:border-darklighter"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                          Solved: <span className="text-primary">{sub.taskTitle}</span>
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(sub.timestamp).toLocaleDateString()} • {sub.upvotes} upvotes
                        </p>
                        {sub.description && (
                          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            "{sub.description}"
                          </p>
                        )}
                      </div>
                      <a 
                        href={sub.repoLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
