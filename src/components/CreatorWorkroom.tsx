
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Download, MessageSquare, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface CreatorWorkroomProps {
  project: any;
  onBack: () => void;
}

const CreatorWorkroom: React.FC<CreatorWorkroomProps> = ({ project, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentVersion, setCurrentVersion] = useState(2);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  const handleFileUpload = () => {
    // File upload logic
  };

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
              {project?.title || 'Epic Space Opera Trailer'}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Badge className="bg-green-100 text-green-800">In Progress</Badge>
              <span>Due: January 25, 2024</span>
              <span>Client: Michael Chen</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-bold text-gray-900">60%</p>
            </div>
            <Progress value={60} className="w-24 h-2" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="workspace" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="brief">Brief</TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&h=300&fit=crop"
                      alt="Work in progress"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30">
                        <Eye className="w-6 h-6 mr-2" />
                        Preview v{currentVersion}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Version {currentVersion}.0</h4>
                      <p className="text-sm text-gray-600">Last updated 2 hours ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        onClick={handleFileUpload}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Version
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Version Notes</h5>
                    <p className="text-sm text-blue-700">
                      Added space battle sequences and improved lighting. Ready for client review.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Concept & Storyboard', status: 'completed', date: 'Jan 8' },
                      { title: 'First Draft', status: 'completed', date: 'Jan 12' },
                      { title: 'Client Review', status: 'in_progress', date: 'Jan 15' },
                      { title: 'Final Version', status: 'pending', date: 'Jan 20' },
                      { title: 'Delivery', status: 'pending', date: 'Jan 25' }
                    ].map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : milestone.status === 'in_progress' ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{milestone.title}</p>
                          <p className="text-sm text-gray-600">Due: {milestone.date}</p>
                        </div>
                        <Badge className={
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Client Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {/* Messages would be rendered here */}
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm">Looking great so far! Can you make the space battle more dramatic?</p>
                      <p className="text-xs text-gray-600 mt-1">Michael Chen • 3 hours ago</p>
                    </div>
                    <div className="bg-amber-500 text-white rounded-lg p-3 ml-auto max-w-xs">
                      <p className="text-sm">Absolutely! I'll enhance the explosions and add more dynamic camera movements.</p>
                      <p className="text-xs opacity-75 mt-1">You • 2 hours ago</p>
                    </div>
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
                  <CardTitle>Project Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">File management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brief">
              <Card>
                <CardHeader>
                  <CardTitle>Project Brief</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">
                        Looking for a creator to bring my sci-fi novel to life with an epic space battle trailer. 
                        Need someone experienced with VFX and space environments.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Requirements</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>90-second trailer</li>
                        <li>Space battle scenes</li>
                        <li>Cinematic quality</li>
                        <li>Epic orchestral soundtrack</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Author & Storyteller</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-xs text-gray-600">4.7 ⭐ (23 reviews)</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Client
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contract Value</span>
                <span className="font-medium">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You'll Receive</span>
                <span className="font-medium text-green-600">$2,375</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deadline</span>
                <span className="font-medium">Jan 25, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">90 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revisions</span>
                <span className="font-medium">1 of 3 used</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Version
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Request Feedback
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Request Extension
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorWorkroom;
