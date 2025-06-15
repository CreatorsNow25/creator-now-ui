
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  const fetchingRef = useRef(false);

  useEffect(() => {
    console.log('UserContext: Auth state changed', { authUser: authUser?.id, authLoading });
    
    const fetchUserProfile = async (userId: string) => {
      if (fetchingRef.current) {
        console.log('UserContext: Already fetching, skipping');
        return;
      }
      
      fetchingRef.current = true;
      console.log('UserContext: Fetching profile for user:', userId);
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        console.log('UserContext: Profile query result:', { profile, error });

        if (error && error.code !== 'PGRST116') {
          console.error('UserContext: Error fetching profile:', error);
          setLoading(false);
          return;
        }

        if (profile) {
          const userRole = (profile.role === 'storyteller' || profile.role === 'creator') 
            ? profile.role as 'storyteller' | 'creator'
            : 'storyteller' as const;
            
          const userData: User = {
            id: profile.id,
            email: authUser?.email || '',
            full_name: profile.full_name || '',
            role: userRole,
            avatar_url: profile.avatar_url
          };
          console.log('UserContext: Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('UserContext: No profile found, user needs to complete profile');
          setUser(null);
        }
      } catch (error) {
        console.error('UserContext: Error in fetchUserProfile:', error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    if (authUser && !user && !fetchingRef.current) {
      console.log('UserContext: Auth user exists, fetching profile');
      fetchUserProfile(authUser.id);
    } else if (!authUser) {
      console.log('UserContext: No auth user, clearing user state');
      setUser(null);
      setLoading(authLoading);
      fetchingRef.current = false;
    } else {
      setLoading(authLoading);
    }
  }, [authUser, authLoading, user]);

  const handleSetUser = (userData: User | null) => {
    console.log('UserContext: Manual user update:', userData);
    setUser(userData);
  };

  const handleSignOut = async () => {
    console.log('UserContext: Signing out');
    setUser(null);
    fetchingRef.current = false;
    await authSignOut();
  };

  console.log('UserContext: Current state:', { user: user?.id, loading, authUser: authUser?.id });

  return (
    <UserContext.Provider value={{ user, loading, setUser: handleSetUser, signOut: handleSignOut }}>
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
