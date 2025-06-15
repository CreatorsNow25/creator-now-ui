import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Eye, Star, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StorytellerHeader from '@/components/StorytellerHeader';
import StorytellerProfile from '@/components/StorytellerProfile';
import StorytellerSettings from '@/components/StorytellerSettings';
import HelpCenter from '@/components/HelpCenter';
import ProjectBriefForm from '@/components/ProjectBriefForm';
import MatchResults from '@/components/MatchResults';
import ProjectWorkroom from '@/components/ProjectWorkroom';
import PaymentModal from '@/components/PaymentModal';
import ReviewForm from '@/components/ReviewForm';
import CreatorBrowsingSection from '@/components/CreatorBrowsingSection';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

const StorytellerDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'matches' | 'workroom' | 'payment' | 'review' | 'browse-creators'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Epic Fantasy Adventure Trailer",
      status: "in_progress",
      budget: 2500,
      deadline: "2024-01-15",
      creator: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
      },
      progress: 75,
      lastUpdate: "2 hours ago"
    },
    {
      id: 2,
      title: "Sci-Fi Thriller Teaser",
      status: "pending_review",
      budget: 1800,
      deadline: "2024-01-20",
      creator: {
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face"
      },
      progress: 100,
      lastUpdate: "1 day ago"
    },
    {
      id: 3,
      title: "Romance Drama Preview",
      status: "completed",
      budget: 3200,
      deadline: "2023-12-30",
      creator: {
        name: "Jordan Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
      },
      progress: 100,
      lastUpdate: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'pending_review': return 'Pending Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleViewProject = (project: any) => {
    console.log('Viewing project:', project);
    setSelectedProject(project);
    if (project.status === 'pending_review') {
      setActiveView('review');
    } else if (project.status === 'completed') {
      setActiveView('workroom');
    } else {
      setActiveView('workroom');
    }
  };

  const handleCreateProject = () => {
    console.log('Creating new project - switching to create view');
    setSelectedProject(null);
    setActiveView('create');
  };

  const handleProjectSubmitted = () => {
    console.log('Project submitted - switching to matches view');
    setActiveView('matches');
  };

  const handleCreatorSelected = (creator: any) => {
    console.log('Creator selected:', creator);
    setActiveView('workroom');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  const handleMessageCreator = (creatorName: string) => {
    console.log(`Messaging ${getDisplayName(creatorName)}`);
    alert(`Starting a conversation with ${getDisplayName(creatorName)}. (This is a placeholder action)`);
  };

  const renderActiveView = () => {
    console.log('Rendering active view:', activeView);
    
    switch (activeView) {
      case 'create':
        return <ProjectBriefForm onSubmit={handleProjectSubmitted} onCancel={() => setActiveView('dashboard')} />;
      case 'matches':
        return <MatchResults onCreatorSelect={handleCreatorSelected} onBack={() => setActiveView('dashboard')} />;
      case 'workroom':
        return <ProjectWorkroom project={selectedProject} onPayment={() => setActiveView('payment')} onBack={() => setActiveView('dashboard')} />;
      case 'payment':
        return <PaymentModal project={selectedProject} onComplete={() => setActiveView('review')} onCancel={() => setActiveView('workroom')} />;
      case 'review':
        return <ReviewForm project={selectedProject} onComplete={() => setActiveView('dashboard')} onSkip={() => setActiveView('dashboard')} />;
      case 'browse-creators':
        return <CreatorBrowsingSection onViewMatches={() => setActiveView('matches')} onCreateProject={handleCreateProject} />;
      default:
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">$7,500</p>
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
                      <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
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
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create New Project CTA */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to bring your next story to life?</h3>
                <p className="text-gray-600 mb-6">Connect with top AI creators and transform your vision into stunning trailers</p>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
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
                        <div className="flex items-center space-x-3">
                          <img 
                            src={project.creator.avatar}
                            alt={getDisplayName(project.creator.name)}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{getDisplayName(project.creator.name)}</p>
                            <p className="text-xs text-gray-600">Updated {project.lastUpdate}</p>
                          </div>
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
                          <Button variant="outline" size="sm" onClick={() => handleMessageCreator(project.creator.name)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <StorytellerHeader 
        onProfileClick={() => setShowProfile(true)}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
        onLogout={handleLogout}
        onBrowseCreators={() => setActiveView('browse-creators')}
        onDashboardClick={() => setActiveView('dashboard')}
        onProjectsClick={() => setActiveView('dashboard')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </div>
      
      {/* Modals */}
      <StorytellerProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <StorytellerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpCenter isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default StorytellerDashboard;
