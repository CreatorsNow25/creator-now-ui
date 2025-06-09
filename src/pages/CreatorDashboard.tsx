
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, DollarSign, Star, Eye, MessageSquare, Clock, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreatorHeader from '@/components/CreatorHeader';
import ProfileWizard from '@/components/ProfileWizard';
import ProjectInbox from '@/components/ProjectInbox';
import ProposalModal from '@/components/ProposalModal';
import CreatorWorkroom from '@/components/CreatorWorkroom';
import PayoutSetup from '@/components/PayoutSetup';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'inbox' | 'proposal' | 'workroom' | 'payout'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  const stats = {
    activeProjects: 5,
    totalEarnings: 12450,
    averageRating: 4.9,
    completedProjects: 127
  };

  const recentProjects = [
    {
      id: 1,
      title: "Epic Fantasy Adventure Trailer",
      client: "Sarah Chen",
      status: "in_progress",
      budget: 2500,
      deadline: "2024-01-15",
      progress: 75,
      lastUpdate: "2 hours ago"
    },
    {
      id: 2,
      title: "Sci-Fi Thriller Teaser",
      client: "Marcus Rivera",
      status: "review",
      budget: 1800,
      deadline: "2024-01-20",
      progress: 100,
      lastUpdate: "1 day ago"
    },
    {
      id: 3,
      title: "Romance Drama Preview",
      client: "Elena Kowalski",
      status: "completed",
      budget: 3200,
      deadline: "2023-12-30",
      progress: 100,
      lastUpdate: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setActiveView('workroom');
  };

  const handleProfileComplete = () => {
    setProfileComplete(true);
    setActiveView('dashboard');
  };

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
    setActiveView('proposal');
  };

  const handleProposalSubmit = () => {
    setActiveView('workroom');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileWizard onComplete={handleProfileComplete} onCancel={() => setActiveView('dashboard')} />;
      case 'inbox':
        return <ProjectInbox onProjectSelect={handleProjectSelect} onBack={() => setActiveView('dashboard')} />;
      case 'proposal':
        return <ProposalModal project={selectedProject} onSubmit={handleProposalSubmit} onCancel={() => setActiveView('inbox')} />;
      case 'workroom':
        return <CreatorWorkroom project={selectedProject} onBack={() => setActiveView('dashboard')} />;
      case 'payout':
        return <PayoutSetup onComplete={() => setActiveView('dashboard')} onCancel={() => setActiveView('dashboard')} />;
      default:
        return (
          <div className="space-y-8">
            {/* Profile Completion Banner */}
            {!profileComplete && (
              <Card className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Complete Your Profile</h3>
                      <p className="text-gray-600">Get 3x more project invites by completing your creator profile</p>
                      <div className="mt-3">
                        <Progress value={30} className="h-2 w-64" />
                        <p className="text-sm text-gray-600 mt-1">3 of 10 steps completed</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveView('profile')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {profileComplete && (
              <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Profile Complete!</h3>
                      <p className="text-gray-600">You're now eligible for premium project invites</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 ml-auto">Premium Creator</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Browse Projects</h3>
                  <p className="text-gray-600 mb-4 text-sm">Find new opportunities that match your skills</p>
                  <Button 
                    onClick={() => setActiveView('inbox')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Inbox
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Setup Payouts</h3>
                  <p className="text-gray-600 mb-4 text-sm">Connect your payment method to receive earnings</p>
                  <Button 
                    onClick={() => setActiveView('payout')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Setup Payments
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Profile Settings</h3>
                  <p className="text-gray-600 mb-4 text-sm">Update your portfolio and pricing</p>
                  <Button 
                    onClick={() => setActiveView('profile')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Badge>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${project.budget.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {project.deadline}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{project.client}</p>
                          <p className="text-xs text-gray-600">Updated {project.lastUpdate}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message Client
                          </Button>
                        </div>
                        <Button 
                          onClick={() => handleViewProject(project)}
                          variant="default" 
                          size="sm"
                        >
                          View Project
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <CreatorHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </div>
    </div>
  );
};

export default CreatorDashboard;
