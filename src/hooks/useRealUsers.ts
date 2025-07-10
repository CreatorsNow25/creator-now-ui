import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealUserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  city_state_country: string;
  role: 'storyteller' | 'creator';
  avatar_url?: string;
  bio?: string;
  email_confirmed: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

interface RealUserVideo {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  tools_used?: string;
  specialties?: string;
}

interface RealUserProject {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  file_url: string;
  file_name: string;
}

export interface RealCreator {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  specialty: string;
  thumbnail: string;
  videoUrl: string;
  rating: number | 'New';
  location: string;
  tools?: string;
  type: 'real';
}

export interface RealStoryteller {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  location: string;
  bio?: string;
  projectTitle?: string;
  projectSummary?: string;
  type: 'real';
}

export const useRealUsers = () => {
  const [realCreators, setRealCreators] = useState<RealCreator[]>([]);
  const [realStorytellers, setRealStorytellers] = useState<RealStoryteller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRealUsers();
  }, []);

  const fetchRealUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch confirmed and onboarded creators with their videos
      const { data: creatorProfiles, error: creatorError } = await supabase
        .from('real_user_profiles')
        .select(`
          *,
          real_user_videos (*)
        `)
        .eq('role', 'creator')
        .eq('email_confirmed', true)
        .eq('onboarding_completed', true);

      if (creatorError) throw creatorError;

      // Fetch confirmed and onboarded storytellers with their projects
      const { data: storytellerProfiles, error: storytellerError } = await supabase
        .from('real_user_profiles')
        .select(`
          *,
          real_user_projects (*)
        `)
        .eq('role', 'storyteller')
        .eq('email_confirmed', true)
        .eq('onboarding_completed', true);

      if (storytellerError) throw storytellerError;

      // Transform creators data
      const creators: RealCreator[] = (creatorProfiles || [])
        .filter(profile => profile.real_user_videos && profile.real_user_videos.length > 0)
        .map(profile => {
          const video = profile.real_user_videos[0]; // Use first video
          return {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name}`,
            displayName: profile.display_name,
            avatar: profile.avatar_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face`,
            specialty: video.specialties || 'AI Creator',
            thumbnail: video.thumbnail_url || profile.avatar_url || `https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop`,
            videoUrl: video.video_url,
            rating: 'New', // Could implement rating system later
            location: profile.city_state_country,
            tools: video.tools_used,
            type: 'real'
          };
        });

      // Transform storytellers data
      const storytellers: RealStoryteller[] = (storytellerProfiles || [])
        .map(profile => {
          const project = profile.real_user_projects?.[0]; // Use first project
          return {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name}`,
            displayName: profile.display_name,
            avatar: profile.avatar_url || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face`,
            location: profile.city_state_country,
            bio: profile.bio,
            projectTitle: project?.title,
            projectSummary: project?.summary,
            type: 'real'
          };
        });

      setRealCreators(creators);
      setRealStorytellers(storytellers);
    } catch (err: any) {
      console.error('Error fetching real users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return {
    realCreators,
    realStorytellers,
    loading,
    error,
    refetch: fetchRealUsers
  };
};