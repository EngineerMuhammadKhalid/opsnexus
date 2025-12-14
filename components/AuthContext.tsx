
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

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
    // 1. Check for logged in user
    const storedUser = localStorage.getItem('opsnexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Seed 'Database' with MOCK_USERS if empty, so edits persist
    const storedUsersStr = localStorage.getItem('opsnexus_registered_users');
    if (!storedUsersStr) {
      localStorage.setItem('opsnexus_registered_users', JSON.stringify(MOCK_USERS));
    } else {
      // Optional: If you want to ensure new mock users appear after code updates, 
      // you could merge them here. For now, we respect the local DB state.
    }

    setIsLoading(false);
  }, []);

  const getUserByUsername = (username: string): User | undefined => {
    const storedUsersStr = localStorage.getItem('opsnexus_registered_users');
    const storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : MOCK_USERS;
    return storedUsers.find(u => u.username === username);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get fresh list of users from Storage (or default to Mocks)
    const storedUsersStr = localStorage.getItem('opsnexus_registered_users');
    const allUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : MOCK_USERS;

    const found = allUsers.find(u => u.username === username && u.password === password);
    
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

    // Store in "DB" (LocalStorage)
    const storedUsersStr = localStorage.getItem('opsnexus_registered_users');
    const storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : MOCK_USERS;
    
    storedUsers.push(newUser);
    localStorage.setItem('opsnexus_registered_users', JSON.stringify(storedUsers));

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
    setUser(updatedUser);
    localStorage.setItem('opsnexus_user', JSON.stringify(updatedUser));

    // Update in registered users list
    const storedUsersStr = localStorage.getItem('opsnexus_registered_users');
    let storedUsers: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : MOCK_USERS;
    
    const index = storedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      storedUsers[index] = { ...storedUsers[index], ...updatedData };
      localStorage.setItem('opsnexus_registered_users', JSON.stringify(storedUsers));
    } else {
      // Edge case: if user somehow isn't in the list (legacy session), add them
      storedUsers.push(updatedUser);
      localStorage.setItem('opsnexus_registered_users', JSON.stringify(storedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUserProfile, getUserByUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
