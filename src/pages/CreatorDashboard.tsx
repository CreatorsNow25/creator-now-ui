
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
import HelpCenter from '@/components/HelpCenter';
import ProfileCompletionBanner from '@/components/creator-dashboard/ProfileCompletionBanner';
import DashboardStats from '@/components/creator-dashboard/DashboardStats';
import QuickActions from '@/components/creator-dashboard/QuickActions';
import RecentProjects from '@/components/creator-dashboard/RecentProjects';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'portfolio' | 'earnings' | 'profile' | 'inbox' | 'proposal' | 'workroom' | 'payout'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

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

  const handleHeaderProfileClick = () => {
    setActiveView('profile');
  };

  const handleHeaderEarningsClick = () => {
    // Could navigate to earnings view or show earnings modal
    console.log('Earnings clicked');
  };

  const handleHeaderSettingsClick = () => {
    setActiveView('profile'); // or create a separate settings view
  };

  const handleHeaderHelpClick = () => {
    setShowHelpCenter(true); // Show the HelpCenter modal
  };

  const handleHeaderLogout = () => {
    navigate('/');
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
      case 'projects':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <Button 
                onClick={() => setActiveView('inbox')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Browse New Projects
              </Button>
            </div>
            <RecentProjects
              projects={recentProjects}
              onViewProject={handleViewProject}
            />
          </div>
        );
      case 'portfolio':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
              <Button 
                onClick={() => setActiveView('profile')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Edit Portfolio
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Portfolio Item {item}</h3>
                    <p className="text-sm text-gray-600 mb-3">Sample description of the creative work showcased here.</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Action/Adventure</Badge>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">4.9</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'earnings':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
              <Button 
                onClick={() => setActiveView('payout')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Setup Payouts
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$12,450</div>
                  <p className="text-sm text-gray-600">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">$2,850</div>
                  <p className="text-sm text-gray-600">5 projects in review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">$1,200</div>
                  <p className="text-sm text-gray-600">Ready for withdrawal</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+${project.budget.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{project.lastUpdate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <ProfileCompletionBanner
              profileComplete={profileComplete}
              onCompleteProfile={() => setActiveView('profile')}
            />
            <DashboardStats {...stats} />
            <QuickActions
              onInbox={() => setActiveView('inbox')}
              onPayout={() => setActiveView('payout')}
              onProfile={() => setActiveView('profile')}
            />
            <RecentProjects
              projects={recentProjects}
              onViewProject={handleViewProject}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <CreatorHeader
        currentView={activeView}
        onDashboardClick={() => setActiveView('dashboard')}
        onProjectsClick={() => setActiveView('projects')}
        onPortfolioClick={() => setActiveView('portfolio')}
        onEarningsClick={() => setActiveView('earnings')}
        onProfileClick={() => setActiveView('profile')}
        onSettingsClick={() => setActiveView('profile')}
        onHelpClick={() => setShowHelpCenter(true)}
        onLogout={() => navigate('/')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </div>
      <HelpCenter isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} />
    </div>
  );
};

export default CreatorDashboard;
