import React, { useEffect, useState } from 'react';
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
import ProjectsView from '@/components/creator-dashboard/ProjectsView';
import PortfolioView from '@/components/creator-dashboard/PortfolioView';
import EarningsView from '@/components/creator-dashboard/EarningsView';
import { useCreatorDashboard } from '@/hooks/useCreatorDashboard';
import { supabase } from '@/integrations/supabase/client';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const {
    activeView,
    setActiveView,
    selectedProject,
    profileComplete,
    showHelpCenter,
    setShowHelpCenter,
    stats,
    recentProjects,
    handleViewProject,
    handleProfileComplete,
    handleProjectSelect,
    handleProposalSubmit,
  } = useCreatorDashboard();

  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { count, error } = await supabase
          .from('real_user_videos')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (!error && (count ?? 0) === 0) {
          setShowEmpty(true);
        }
      } catch (e) {
        console.error('Error checking creator videos count', e);
      }
    })();
  }, []);

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
          <ProjectsView
            projects={recentProjects}
            onViewProject={handleViewProject}
            onBrowseProjects={() => setActiveView('inbox')}
          />
        );
      case 'portfolio':
        return (
          <PortfolioView
            onEditPortfolio={() => setActiveView('profile')}
          />
        );
      case 'earnings':
        return (
          <EarningsView
            projects={recentProjects}
            onSetupPayout={() => setActiveView('payout')}
          />
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
        {activeView === 'dashboard' && showEmpty && (
          <div className="mb-4 rounded border border-gray-200 bg-white p-4 text-gray-700">
            Your portfolio is empty. Add work samples to get discovered.
          </div>
        )}
        {renderActiveView()}
      </div>
      <HelpCenter isOpen={showHelpCenter} onClose={() => setShowHelpCenter(false)} />
    </div>
  );
};

export default CreatorDashboard;
