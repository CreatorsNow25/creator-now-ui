
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
  storyteller_profile?: {
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

  // Fetch conversations for the current user using Edge Function
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

      // Transform data to include the other participant's profile
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
      console.log('Fetching messages for conversation:', conversationId);
      
      // Use type assertion to bypass empty types
      const { data, error } = await (supabase as any)
        .from('messages')
        .select(`
          *,
          sender_profile:profiles(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Messages data:', data);
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

  // Send a new message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user?.id || !content.trim()) return;

    try {
      console.log('Sending message:', { conversationId, content, sender: user.id });
      
      const { error } = await (supabase as any)
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully');
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
      console.log('Creating/finding conversation with:', otherUserId);
      
      // First, try to find existing conversation
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

      // Create new conversation
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

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions');
    
    const messageSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        console.log('New message received:', payload);
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
      console.log('Cleaning up real-time subscriptions');
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
