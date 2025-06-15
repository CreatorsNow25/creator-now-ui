
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Message, Conversation } from './types';

export const useRealtimeMessages = (
  conversations: Conversation[],
  fetchMessages: (conversationId: string) => Promise<void>,
  fetchLastMessage: (conversationId: string) => Promise<void>
) => {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions');
    
    // Create a unique channel name to avoid conflicts
    const channelName = `messages-${user.id}-${Date.now()}`;
    
    const messageSubscription = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        console.log('New message received:', payload);
        const newMessage = payload.new as Message;
        
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
  }, [user?.id, conversations, fetchMessages, fetchLastMessage]);
};
