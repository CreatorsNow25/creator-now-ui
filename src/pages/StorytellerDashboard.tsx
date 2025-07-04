
import React from 'react';
import StorytellerHeader from '@/components/StorytellerHeader';
import ActiveViewRenderer from '@/components/storyteller-dashboard/ActiveViewRenderer';
import DashboardModals from '@/components/storyteller-dashboard/DashboardModals';
import { useStorytellerDashboard } from '@/hooks/useStorytellerDashboard';

const StorytellerDashboard = () => {
  const {
    user,
    loading,
    activeView,
    setActiveView,
    selectedProject,
    selectedCreator,
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
    handleViewCreatorProfile,
    handleDashboardClick,
    handleProjectsClick,
  } = useStorytellerDashboard();

  // Show loading while authentication is being resolved
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for demo access
  const hasDemoAccess = sessionStorage.getItem('creators-access') === 'true';
  
  // Show loading if user is not available yet (but auth is done) and no demo access
  if (!user && !hasDemoAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Setting up your profile...</p>
        </div>
      </div>
    );
  }

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
        <ActiveViewRenderer
          activeView={activeView}
          selectedProject={selectedProject}
          selectedCreator={selectedCreator}
          projects={projects}
          onCreateProject={handleCreateProject}
          onViewProject={handleViewProject}
          onMessageCreator={handleMessageCreator}
          onViewCreatorProfile={handleViewCreatorProfile}
          onProjectSubmitted={handleProjectSubmitted}
          onCreatorSelected={handleCreatorSelected}
          setActiveView={setActiveView}
        />
      </div>
      
      <DashboardModals
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        showMessaging={showMessaging}
        setShowMessaging={setShowMessaging}
        messagingCreator={messagingCreator}
        messagingProject={messagingProject}
      />
    </div>
  );
};

export default StorytellerDashboard;
