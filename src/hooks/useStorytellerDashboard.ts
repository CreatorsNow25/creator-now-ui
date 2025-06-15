
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

export type ActiveView = 'dashboard' | 'create' | 'matches' | 'workroom' | 'payment' | 'review' | 'browse-creators';

export const useStorytellerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
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

  return {
    user,
    loading,
    activeView,
    setActiveView,
    selectedProject,
    showProfile,
    setShowProfile,
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showMessaging,
    setShowMessaging,
    messagingCreator,
    messagingProject,
    projects,
    handleViewProject,
    handleCreateProject,
    handleProjectSubmitted,
    handleCreatorSelected,
    handleLogout,
    handleMessageCreator,
    handleDashboardClick,
    handleProjectsClick,
  };
};
