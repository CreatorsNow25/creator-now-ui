
import { useState, useEffect, useMemo } from 'react';

export type ActiveView = 'dashboard' | 'projects' | 'portfolio' | 'earnings' | 'profile' | 'inbox' | 'proposal' | 'workroom' | 'payout';

// Memoized version of getDisplayName to prevent redundant calls
const displayNameCache = new Map<string, string>();

export function getDisplayName(fullName: string): string {
  if (!fullName) {
    return '';
  }

  // Check cache first
  if (displayNameCache.has(fullName)) {
    console.log('getDisplayName: returning cached result for:', fullName);
    return displayNameCache.get(fullName)!;
  }

  console.log('getDisplayName called with:', fullName);
  
  // If name is already shortened (contains a single letter followed by a dot), return as is
  if (/\s[A-Z]\.$/.test(fullName)) {
    console.log('getDisplayName: name already shortened, returning as is:', fullName);
    displayNameCache.set(fullName, fullName);
    return fullName;
  }
  
  const parts = fullName.trim().split(' ');
  console.log('getDisplayName: name parts:', parts);
  
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() + '.' : '';
  const result = `${first} ${last}`.trim();
  
  console.log('getDisplayName: result:', result);
  
  // Cache the result
  displayNameCache.set(fullName, result);
  
  return result;
}

export const useCreatorDashboard = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
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

  useEffect(() => {
    const isComplete = localStorage.getItem('creatorProfileComplete');
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
