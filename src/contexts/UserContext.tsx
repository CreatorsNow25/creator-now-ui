
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'storyteller' | 'creator';
  avatar_url?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Using a proper UUID format instead of "1"
  const [user, setUser] = useState<User | null>({
    id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'storyteller',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'
  });
  const [loading, setLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
