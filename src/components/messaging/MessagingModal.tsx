
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useUser } from '@/contexts/UserContext';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCreatorName?: string;
  projectTitle?: string;
}

const MessagingModal = ({ isOpen, onClose, initialCreatorName, projectTitle }: MessagingModalProps) => {
  const { user } = useUser();
  const { conversations, messages, loading, fetchMessages, sendMessage, createOrFindConversation } = useMessaging();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle initial creator selection
  useEffect(() => {
    if (isOpen && initialCreatorName && conversations.length > 0) {
      const conversation = conversations.find(conv => 
        conv.participant_profile?.full_name === initialCreatorName
      );
      if (conversation) {
        setSelectedConversation(conversation.id);
        fetchMessages(conversation.id);
      }
    }
  }, [isOpen, initialCreatorName, conversations]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      await sendMessage(selectedConversation, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    await fetchMessages(conversationId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const getDisplayName = (name: string) => {
    if (!name) return 'Unknown User';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading conversations...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-1/3 border-r bg-gray-50 flex flex-col">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg font-semibold">Messages</DialogTitle>
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </DialogHeader>
            
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conversations yet</p>
                    <p className="text-sm">Start messaging creators from your projects</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? 'bg-amber-100 border border-amber-200'
                          : 'hover:bg-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.participant_profile?.avatar_url} />
                            <AvatarFallback>
                              {conversation.participant_profile?.full_name
                                ?.split(' ')
                                .map(n => n[0])
                                .join('') || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.participant_profile?.is_online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {getDisplayName(conversation.participant_profile?.full_name || '')}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conversation.updated_at)}
                            </span>
                          </div>
                          
                          {conversation.project_title && (
                            <p className="text-xs text-amber-600 font-medium mb-1">
                              {conversation.project_title}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.last_message || 'No messages yet'}
                            </p>
                            {conversation.unread_count > 0 && (
                              <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentConversation.participant_profile?.avatar_url} />
                      <AvatarFallback>
                        {currentConversation.participant_profile?.full_name
                          ?.split(' ')
                          .map(n => n[0])
                          .join('') || 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getDisplayName(currentConversation.participant_profile?.full_name || '')}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          currentConversation.participant_profile?.is_online ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-sm text-gray-600">
                          {currentConversation.participant_profile?.is_online ? 'Online' : 'Offline'}
                        </span>
                        {currentConversation.project_title && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-amber-600 font-medium">
                              {currentConversation.project_title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user?.id ? 'text-amber-100' : 'text-gray-500'
                            }`}>
                              {formatTimestamp(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingModal;
