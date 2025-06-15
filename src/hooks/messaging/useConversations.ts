
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Conversation } from './types';

export const useConversations = () => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      console.log('Fetching conversations for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('get-user-conversations', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw error;
      }

      console.log('Raw conversation data:', data);

      const transformedConversations = (data || []).map((conv: any) => {
        const isStoryteller = conv.storyteller_id === user.id;
        const participantProfile = isStoryteller ? conv.participant_profile : conv.storyteller_profile;
        
        return {
          ...conv,
          participant_profile: participantProfile,
          last_message: '',
          unread_count: 0
        };
      });

      console.log('Transformed conversations:', transformedConversations);
      setConversations(transformedConversations);

      for (const conv of transformedConversations) {
        await fetchLastMessage(conv.id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastMessage = async (conversationId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching last message:', error);
        return;
      }

      if (data?.content) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, last_message: data.content }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error fetching last message:', error);
    }
  };

  const createOrFindConversation = async (otherUserId: string, projectTitle?: string) => {
    if (!user?.id) return null;

    try {
      console.log('Creating/finding conversation with:', otherUserId);
      
      const { data: existing, error: findError } = await (supabase as any)
        .from('conversations')
        .select('id')
        .or(`and(storyteller_id.eq.${user.id},creator_id.eq.${otherUserId}),and(storyteller_id.eq.${otherUserId},creator_id.eq.${user.id})`)
        .limit(1)
        .maybeSingle();

      if (findError) {
        console.error('Error finding conversation:', findError);
        throw findError;
      }

      if (existing?.id) {
        console.log('Found existing conversation:', existing.id);
        return existing.id;
      }

      const isStoryteller = user.role === 'storyteller';
      const { data, error } = await (supabase as any)
        .from('conversations')
        .insert({
          storyteller_id: isStoryteller ? user.id : otherUserId,
          creator_id: isStoryteller ? otherUserId : user.id,
          project_title: projectTitle
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }

      console.log('Created new conversation:', data?.id);
      await fetchConversations();
      return data?.id || null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      console.log('User ID changed, fetching conversations for:', user.id);
      fetchConversations();
    }
  }, [user?.id]);

  return {
    conversations,
    loading,
    fetchConversations,
    createOrFindConversation,
    setConversations
  };
};
