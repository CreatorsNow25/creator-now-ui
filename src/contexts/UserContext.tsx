
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, loading: authLoading, signOut: authSignOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setUser({
            id: profile.id,
            email: authUser?.email || '',
            full_name: profile.full_name || '',
            role: (profile.role === 'storyteller' || profile.role === 'creator') ? profile.role : 'storyteller',
            avatar_url: profile.avatar_url
          });
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    };

    if (authUser) {
      setTimeout(() => {
        fetchUserProfile(authUser.id);
      }, 0);
    } else {
      setUser(null);
    }
    
    setLoading(authLoading);
  }, [authUser, authLoading]);

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, signOut: handleSignOut }}>
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
