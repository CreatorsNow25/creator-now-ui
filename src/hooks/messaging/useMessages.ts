
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Message } from './types';

export const useMessages = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});

  const fetchMessages = async (conversationId: string) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      
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
      await fetchMessages(conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    fetchMessages,
    sendMessage,
    setMessages
  };
};
