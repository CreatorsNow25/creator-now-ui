import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageSquare, Upload, Download, Eye, Clock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import ProjectApproval from './ProjectApproval';
import MessagingModal from './messaging/MessagingModal';

interface ProjectWorkroomProps {
  project: any;
  onPayment: () => void;
  onBack: () => void;
}

const ProjectWorkroom: React.FC<ProjectWorkroomProps> = ({ project, onPayment, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [activeView, setActiveView] = useState<'workroom' | 'approval'>('workroom');
  const [showMessaging, setShowMessaging] = useState(false);

  const messages = [
    {
      id: 1,
      sender: 'creator',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: 'Thanks for choosing me for this project! I\'ve reviewed your brief and I\'m excited to bring your epic fantasy vision to life. I\'ll start with some initial concept sketches.',
      timestamp: '2 hours ago',
      type: 'message'
    },
    {
      id: 2,
      sender: 'client',
      name: 'You',
      content: 'Great! I\'m looking forward to seeing what you create. The key scenes I want to highlight are the dragon battle and the final confrontation.',
      timestamp: '2 hours ago',
      type: 'message'
    },
    {
      id: 3,
      sender: 'creator',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: 'Here are the initial concept frames for your review. I\'ve focused on the dramatic lighting and epic scale you mentioned.',
      timestamp: '1 hour ago',
      type: 'file',
      file: {
        name: 'concept_frames_v1.zip',
        size: '15.2 MB',
        type: 'zip'
      }
    },
    {
      id: 4,
      sender: 'system',
      content: 'Milestone 1 completed: Initial concept approved',
      timestamp: '30 minutes ago',
      type: 'milestone'
    }
  ];

  const deliverables = [
    {
      id: 1,
      title: 'Concept & Storyboard',
      status: 'completed',
      dueDate: '2024-01-10',
      description: 'Initial concept frames and storyboard layout'
    },
    {
      id: 2,
      title: 'First Draft',
      status: 'in_progress',
      dueDate: '2024-01-12',
      description: 'Complete trailer with basic effects and sound'
    },
    {
      id: 3,
      title: 'Final Version',
      status: 'pending',
      dueDate: '2024-01-15',
      description: 'Polished final trailer with all effects and sound design'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const handleApproveProject = () => {
    setActiveView('workroom');
    // Additional logic for post-approval
  };

  const handleOpenMessaging = () => {
    setShowMessaging(true);
  };

  if (activeView === 'approval') {
    return (
      <ProjectApproval
        project={project}
        onApprove={handleApproveProject}
        onReject={() => setActiveView('workroom')}
        onRequestRevision={() => setActiveView('workroom')}
        onBack={() => setActiveView('workroom')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {project?.title || 'Epic Fantasy Adventure Trailer'}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              <span>Due: January 15, 2024</span>
              <span>Budget: $2,500</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-bold text-gray-900">75%</p>
            </div>
            <Progress value={75} className="w-24 h-2" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="revisions">Revisions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliverables.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">Due: {item.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latest Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=300&fit=crop"
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Draft v2.1</h4>
                      <p className="text-sm text-gray-600">Uploaded 2 hours ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md ${
                          message.sender === 'client' 
                            ? 'bg-amber-500 text-white' 
                            : message.type === 'milestone'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg p-3`}>
                          {message.sender !== 'client' && message.sender !== 'system' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <img 
                                src={message.avatar}
                                alt={message.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-xs font-medium">{message.name}</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          {message.file && (
                            <div className="mt-2 p-2 bg-white/10 rounded flex items-center space-x-2">
                              <Upload className="w-4 h-4" />
                              <div>
                                <p className="text-xs font-medium">{message.file.name}</p>
                                <p className="text-xs opacity-75">{message.file.size}</p>
                              </div>
                            </div>
                          )}
                          <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">File management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revisions">
              <Card>
                <CardHeader>
                  <CardTitle>Revision History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Revision tracking coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                  alt="Alex Thompson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Alex Thompson</h4>
                  <p className="text-sm text-gray-600">Sci-Fi Specialist</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleOpenMessaging}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Creator
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Escrow Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Escrow Protected</span>
                </div>
                <p className="text-xs text-green-700">
                  Your payment is safely held until you approve the final work
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Fee</span>
                  <span className="font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (15%)</span>
                  <span className="font-medium">$375</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span>$2,875</span>
                </div>
              </div>
              
              {project?.status === 'pending_review' ? (
                <Button 
                  onClick={() => setActiveView('approval')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Review Final Work
                </Button>
              ) : (
                <Button 
                  onClick={onPayment}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  disabled
                >
                  Funds in Escrow
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Started:</span>
                <span className="ml-2 font-medium">Jan 5, 2024</span>
              </div>
              <div>
                <span className="text-gray-600">Deadline:</span>
                <span className="ml-2 font-medium">Jan 15, 2024</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">60 seconds</span>
              </div>
              <div>
                <span className="text-gray-600">Revisions:</span>
                <span className="ml-2 font-medium">1 of 3 used</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MessagingModal 
        isOpen={showMessaging} 
        onClose={() => setShowMessaging(false)}
        initialCreatorName="Alex Thompson"
        projectTitle={project?.title || 'Epic Fantasy Adventure Trailer'}
      />
    </div>
  );
};

export default ProjectWorkroom;
