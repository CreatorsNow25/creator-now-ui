import { useState, useEffect } from 'react';

export type ActiveView = 'dashboard' | 'projects' | 'portfolio' | 'earnings' | 'profile' | 'inbox' | 'proposal' | 'workroom' | 'payout';

export function getDisplayName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() + '.' : '';
  return `${first} ${last}`;
}

export const useCreatorDashboard = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  // For testing purposes, set to true by default to avoid the profile wizard
  const [profileComplete, setProfileComplete] = useState(true);
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

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setActiveView('workroom');
  };

  const handleProfileComplete = () => {
    // Save profile completion to localStorage
    localStorage.setItem('creatorProfileComplete', 'true');
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

  // Check profile completion on mount - for testing, default to complete
  useEffect(() => {
    const isComplete = localStorage.getItem('creatorProfileComplete');
    // If no value in localStorage, default to true for testing (fake profile)
    setProfileComplete(isComplete !== 'false');
  }, []);

  return {
    activeView,
    setActiveView,
    selectedProject,
    setSelectedProject,
    profileComplete,
    setProfileComplete,
    showHelpCenter,
    setShowHelpCenter,
    stats,
    recentProjects,
    handleViewProject,
    handleProfileComplete,
    handleProjectSelect,
    handleProposalSubmit,
  };
};
