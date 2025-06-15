import React from 'react';
import ProjectBriefForm from '@/components/ProjectBriefForm';
import MatchResults from '@/components/MatchResults';
import ProjectWorkroom from '@/components/ProjectWorkroom';
import PaymentModal from '@/components/PaymentModal';
import ReviewForm from '@/components/ReviewForm';
import CreatorBrowsingSection from '@/components/CreatorBrowsingSection';
import CreatorProfileView from '@/components/CreatorProfileView';
import DashboardView from '@/components/storyteller-dashboard/DashboardView';
import { ActiveView } from '@/hooks/useStorytellerDashboard';

interface ActiveViewRendererProps {
  activeView: ActiveView;
  selectedProject: any;
  selectedCreator: any;
  projects: any[];
  onCreateProject: () => void;
  onViewProject: (project: any) => void;
  onMessageCreator: (creatorName: string) => void;
  onViewCreatorProfile: (creatorName: string) => void;
  onProjectSubmitted: () => void;
  onCreatorSelected: (creator: any) => void;
  setActiveView: (view: ActiveView) => void;
}

const ActiveViewRenderer = ({
  activeView,
  selectedProject,
  selectedCreator,
  projects,
  onCreateProject,
  onViewProject,
  onMessageCreator,
  onViewCreatorProfile,
  onProjectSubmitted,
  onCreatorSelected,
  setActiveView,
}: ActiveViewRendererProps) => {
  console.log('Rendering active view:', activeView);
  
  switch (activeView) {
    case 'create':
      return <ProjectBriefForm onSubmit={onProjectSubmitted} onCancel={() => setActiveView('dashboard')} />;
    case 'matches':
      return <MatchResults onCreatorSelect={onCreatorSelected} onBack={() => setActiveView('dashboard')} />;
    case 'workroom':
      return <ProjectWorkroom project={selectedProject} onPayment={() => setActiveView('payment')} onBack={() => setActiveView('dashboard')} />;
    case 'payment':
      return <PaymentModal project={selectedProject} onComplete={() => setActiveView('review')} onCancel={() => setActiveView('workroom')} />;
    case 'review':
      return <ReviewForm project={selectedProject} onComplete={() => setActiveView('dashboard')} onSkip={() => setActiveView('dashboard')} />;
    case 'browse-creators':
      return (
        <CreatorBrowsingSection 
          onViewMatches={() => setActiveView('matches')} 
          onCreateProject={onCreateProject}
          onContactCreator={onMessageCreator}
          onViewCreatorProfile={onViewCreatorProfile}
        />
      );
    case 'creator-profile':
      return (
        <CreatorProfileView
          creator={selectedCreator}
          onBack={() => setActiveView('browse-creators')}
          onContactCreator={onMessageCreator}
        />
      );
    default:
      return (
        <DashboardView
          projects={projects}
          onCreateProject={onCreateProject}
          onViewProject={onViewProject}
          onMessageCreator={onMessageCreator}
        />
      );
  }
};

export default ActiveViewRenderer;
