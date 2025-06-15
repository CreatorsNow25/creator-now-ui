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
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'inbox' | 'proposal' | 'workroom' | 'payout'>('dashboard');
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
        onProfileClick={handleHeaderProfileClick}
        onEarningsClick={handleHeaderEarningsClick}
        onSettingsClick={handleHeaderSettingsClick}
        onHelpClick={handleHeaderHelpClick}
        onLogout={handleHeaderLogout}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </div>
      <HelpCenter isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} />
    </div>
  );
};

export default CreatorDashboard;
