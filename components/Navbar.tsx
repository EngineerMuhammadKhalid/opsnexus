
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { Menu, X, Sun, Moon, Terminal, PlusCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-darklighter border-t-[3px] border-t-so-orange border-b border-b-gray-200 dark:border-b-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Terminal className="h-8 w-8 text-so-orange" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                OpsNexus
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-so-orange'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center ml-4 space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
               <Link
                to={user ? "/create-task" : "/login"}
                state={!user ? { from: "/create-task" } : undefined}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                <PlusCircle className="h-4 w-4" /> Share Problem
              </Link>
              
              {user ? (
                <>
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-2 pl-2">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.username} 
                      className={`h-8 w-8 rounded-md border-2 ${isActive(`/profile/${user.username}`) ? 'border-so-orange' : 'border-transparent hover:border-gray-300'}`}
                      title={user.username + (user.role === 'admin' ? ' (Admin)' : '')}
                    />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 p-2"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    state={{ from: location.pathname }}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
             <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-darklighter border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-so-orange bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-so-orange hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 space-y-1">
               <Link
                to={user ? "/create-task" : "/login"}
                state={!user ? { from: "/create-task" } : undefined}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                Share Problem
              </Link>

              {user ? (
                <>
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    state={{ from: location.pathname }}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
