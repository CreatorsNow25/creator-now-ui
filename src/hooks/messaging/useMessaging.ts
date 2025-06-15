
import { supabase } from '@/integrations/supabase/client';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { useRealtimeMessages } from './useRealtimeMessages';

export const useMessaging = () => {
  const {
    conversations,
    loading,
    fetchConversations,
    createOrFindConversation,
    setConversations
  } = useConversations();

  const {
    messages,
    fetchMessages,
    sendMessage,
    setMessages
  } = useMessages();

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

  useRealtimeMessages(conversations, fetchMessages, fetchLastMessage);

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

export * from './types';
