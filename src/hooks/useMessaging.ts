
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  created_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  storyteller_id: string;
  creator_id: string;
  project_id?: string;
  project_title?: string;
  created_at: string;
  updated_at: string;
  participant_profile?: {
    full_name: string;
    avatar_url?: string;
    role: string;
    is_online: boolean;
  };
  last_message?: string;
  unread_count: number;
}

export const useMessaging = () => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [loading, setLoading] = useState(false);

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_profile:profiles!conversations_creator_id_fkey(full_name, avatar_url, role, is_online),
          storyteller_profile:profiles!conversations_storyteller_id_fkey(full_name, avatar_url, role, is_online)
        `)
        .or(`storyteller_id.eq.${user.id},creator_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform data to include the other participant's profile
      const transformedConversations = data?.map(conv => {
        const isStoryteller = conv.storyteller_id === user.id;
        const participantProfile = isStoryteller ? conv.participant_profile : conv.storyteller_profile;
        
        return {
          ...conv,
          participant_profile: participantProfile,
          last_message: '',
          unread_count: 0
        };
      }) || [];

      setConversations(transformedConversations);

      // Fetch last message for each conversation
      for (const conv of transformedConversations) {
        await fetchLastMessage(conv.id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [conversationId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch last message for conversation list
  const fetchLastMessage = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
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

  // Send a new message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user?.id || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      // Refresh messages for this conversation
      await fetchMessages(conversationId);
      await fetchLastMessage(conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create or find existing conversation
  const createOrFindConversation = async (otherUserId: string, projectTitle?: string) => {
    if (!user?.id) return null;

    try {
      // First, try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(storyteller_id.eq.${user.id},creator_id.eq.${otherUserId}),and(storyteller_id.eq.${otherUserId},creator_id.eq.${user.id})`)
        .limit(1)
        .single();

      if (findError && findError.code !== 'PGRST116') throw findError;

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const isStoryteller = user.role === 'storyteller';
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          storyteller_id: isStoryteller ? user.id : otherUserId,
          creator_id: isStoryteller ? otherUserId : user.id,
          project_title: projectTitle
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchConversations();
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const messageSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        const newMessage = payload.new as Message;
        
        // Only update if this message is in one of our conversations
        const conversationExists = conversations.some(conv => conv.id === newMessage.conversation_id);
        if (conversationExists) {
          await fetchMessages(newMessage.conversation_id);
          await fetchLastMessage(newMessage.conversation_id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [user?.id, conversations]);

  return {
    conversations,
    messages,
    loading,
    fetchMessages,
    sendMessage,
    createOrFindConversation,
    refreshConversations: fetchConversations
  };
};
