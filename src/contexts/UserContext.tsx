
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
  const lastAuthUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('UserContext: Auth state changed', { 
      authUserId: authUser?.id, 
      authLoading, 
      lastAuthUserId: lastAuthUserIdRef.current 
    });
    
    // Prevent unnecessary fetches for the same user
    if (authUser?.id === lastAuthUserIdRef.current && !authLoading) {
      setLoading(false);
      return;
    }

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
          lastAuthUserIdRef.current = userId;
        } else {
          console.log('UserContext: No profile found, user needs to complete profile');
          setUser(null);
          lastAuthUserIdRef.current = null;
        }
      } catch (error) {
        console.error('UserContext: Error in fetchUserProfile:', error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    if (authUser && !authLoading) {
      console.log('UserContext: Auth user exists, fetching profile');
      fetchUserProfile(authUser.id);
    } else if (!authUser && !authLoading) {
      console.log('UserContext: No auth user, clearing user state');
      setUser(null);
      setLoading(false);
      fetchingRef.current = false;
      lastAuthUserIdRef.current = null;
    } else {
      setLoading(authLoading);
    }
  }, [authUser, authLoading]);

  const handleSetUser = (userData: User | null) => {
    console.log('UserContext: Manual user update:', userData);
    setUser(userData);
    if (userData) {
      lastAuthUserIdRef.current = userData.id;
    } else {
      lastAuthUserIdRef.current = null;
    }
  };

  const handleSignOut = async () => {
    console.log('UserContext: Signing out');
    setUser(null);
    fetchingRef.current = false;
    lastAuthUserIdRef.current = null;
    await authSignOut();
  };

  console.log('UserContext: Current state:', { 
    user: user?.id, 
    loading, 
    authUser: authUser?.id,
    authLoading
  });

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
