
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'creator' | 'storyteller';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  projectTitle?: string;
  isOnline: boolean;
  messages: Message[];
}

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCreatorName?: string;
  projectTitle?: string;
}

const MessagingModal = ({ isOpen, onClose, initialCreatorName, projectTitle }: MessagingModalProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'alex-thompson',
      participantName: 'Alex Thompson',
      participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      participantRole: 'creator',
      lastMessage: 'I\'ve uploaded the latest version for your review',
      lastMessageTime: '2 hours ago',
      unreadCount: 2,
      projectTitle: 'Epic Fantasy Adventure Trailer',
      isOnline: true,
      messages: [
        {
          id: 'm1',
          senderId: 'alex-thompson',
          senderName: 'Alex Thompson',
          content: 'Hi! Thanks for choosing me for your project. I\'m excited to work on the Epic Fantasy Adventure Trailer.',
          timestamp: '2 days ago',
          type: 'text'
        },
        {
          id: 'm2',
          senderId: 'current-user',
          senderName: 'You',
          content: 'Great! I\'m looking forward to seeing what you create. The key scenes I want to highlight are the dragon battle and the final confrontation.',
          timestamp: '2 days ago',
          type: 'text'
        },
        {
          id: 'm3',
          senderId: 'alex-thompson',
          senderName: 'Alex Thompson',
          content: 'Perfect! I\'ve started working on the initial concepts. I\'ll have the first draft ready by tomorrow.',
          timestamp: '1 day ago',
          type: 'text'
        },
        {
          id: 'm4',
          senderId: 'alex-thompson',
          senderName: 'Alex Thompson',
          content: 'I\'ve uploaded the latest version for your review',
          timestamp: '2 hours ago',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      participantId: 'maya-patel',
      participantName: 'Maya Patel',
      participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
      participantRole: 'creator',
      lastMessage: 'The final video is ready for approval',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      projectTitle: 'Sci-Fi Thriller Teaser',
      isOnline: false,
      messages: [
        {
          id: 'm5',
          senderId: 'maya-patel',
          senderName: 'Maya Patel',
          content: 'Hello! I\'ve completed your Sci-Fi Thriller Teaser. The final video is ready for approval.',
          timestamp: '1 day ago',
          type: 'text'
        }
      ]
    }
  ]);

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      // In a real app, this would send the message to a backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-amber-100 border border-amber-200'
                        : 'hover:bg-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback>
                            {getDisplayName(conversation.participantName).split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {getDisplayName(conversation.participantName)}
                          </h4>
                          <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                        </div>
                        
                        {conversation.projectTitle && (
                          <p className="text-xs text-amber-600 font-medium mb-1">
                            {conversation.projectTitle}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                      <AvatarImage src={currentConversation.participantAvatar} />
                      <AvatarFallback>
                        {getDisplayName(currentConversation.participantName).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getDisplayName(currentConversation.participantName)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          currentConversation.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-sm text-gray-600">
                          {currentConversation.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {currentConversation.projectTitle && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-amber-600 font-medium">
                              {currentConversation.projectTitle}
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
                    {currentConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === 'current-user'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'current-user' ? 'text-amber-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
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
