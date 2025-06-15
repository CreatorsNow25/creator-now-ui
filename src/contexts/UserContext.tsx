
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'storyteller' | 'creator';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isStoryteller: boolean;
  isCreator: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    fullName: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face',
    role: 'storyteller'
  });

  const isStoryteller = user?.role === 'storyteller';
  const isCreator = user?.role === 'creator';

  return (
    <UserContext.Provider value={{ user, setUser, isStoryteller, isCreator }}>
      {children}
    </UserContext.Provider>
  );
};
