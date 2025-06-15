import React, { useState } from 'react';
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
import DashboardView from '@/components/storyteller-dashboard/DashboardView';
import { getDisplayName } from '@/hooks/useCreatorDashboard';
import MessagingModal from '@/components/messaging/MessagingModal';
import { useMessaging } from '@/hooks/useMessaging';

const StorytellerDashboard = () => {
  const navigate = useNavigate();
  const { createOrFindConversation } = useMessaging();
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'matches' | 'workroom' | 'payment' | 'review' | 'browse-creators'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingCreator, setMessagingCreator] = useState<string>('');
  const [messagingProject, setMessagingProject] = useState<string>('');

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

  const handleMessageCreator = async (creatorName: string, projectTitle?: string) => {
    console.log(`Opening messaging with ${getDisplayName(creatorName)}`);
    setMessagingCreator(creatorName);
    setMessagingProject(projectTitle || '');
    setShowMessaging(true);
  };

  const handleDashboardClick = () => {
    console.log('Dashboard clicked - switching to dashboard view');
    setActiveView('dashboard');
  };

  const handleProjectsClick = () => {
    console.log('Projects clicked - switching to dashboard view');
    setActiveView('dashboard');
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
          <DashboardView
            projects={projects}
            onCreateProject={handleCreateProject}
            onViewProject={handleViewProject}
            onMessageCreator={(creatorName) => handleMessageCreator(creatorName, projects.find(p => p.creator.name === creatorName)?.title)}
          />
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
        onDashboardClick={handleDashboardClick}
        onProjectsClick={handleProjectsClick}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </div>
      
      {/* Modals */}
      <StorytellerProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <StorytellerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpCenter isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <MessagingModal 
        isOpen={showMessaging} 
        onClose={() => setShowMessaging(false)}
        initialCreatorName={messagingCreator}
        projectTitle={messagingProject}
      />
    </div>
  );
};

export default StorytellerDashboard;
