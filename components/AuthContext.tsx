
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/database';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (updatedData: Partial<User>) => void;
  getUserByUsername: (username: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => {},
  logout: () => {},
  isLoading: true,
  updateUserProfile: () => {},
  getUserByUsername: () => undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // 1. Check for active session
    const storedUser = localStorage.getItem('opsnexus_user');
    if (storedUser) {
      // Validate that the user still exists in DB (in case of manual deletion)
      const parsedUser = JSON.parse(storedUser);
      const dbUser = db.users.getById(parsedUser.id);
      if (dbUser) {
        setUser(dbUser); // Use fresh data from DB
      } else {
        localStorage.removeItem('opsnexus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const getUserByUsername = (username: string): User | undefined => {
    return db.users.getByUsername(username);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const found = db.users.getAll().find(u => u.username === username && u.password === password);
    
    if (found) {
      setUser(found);
      localStorage.setItem('opsnexus_user', JSON.stringify(found));
      return true;
    }

    return false;
  };

  const signup = async (username: string, password: string, isAdmin: boolean = false): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      password,
      role: isAdmin ? 'admin' : 'user',
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
      solutionsCount: 0,
      badges: ['Rising Star'],
      totalPoints: 0,
      joinedAt: new Date().toISOString()
    };

    // Store in DB
    db.users.create(newUser);

    // Auto login
    setUser(newUser);
    localStorage.setItem('opsnexus_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opsnexus_user');
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    
    // Update State
    setUser(updatedUser);
    localStorage.setItem('opsnexus_user', JSON.stringify(updatedUser));

    // Update DB
    db.users.update(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUserProfile, getUserByUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
