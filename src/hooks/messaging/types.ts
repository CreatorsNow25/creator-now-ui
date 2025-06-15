
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
