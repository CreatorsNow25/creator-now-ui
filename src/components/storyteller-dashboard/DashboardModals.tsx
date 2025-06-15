
import React from 'react';
import StorytellerProfile from '@/components/StorytellerProfile';
import StorytellerSettings from '@/components/StorytellerSettings';
import HelpCenter from '@/components/HelpCenter';
import MessagingModal from '@/components/messaging/MessagingModal';

interface DashboardModalsProps {
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  showMessaging: boolean;
  setShowMessaging: (show: boolean) => void;
  messagingCreator: string;
  messagingProject: string;
}

const DashboardModals = ({
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
}: DashboardModalsProps) => {
  return (
    <>
      <StorytellerProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <StorytellerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpCenter isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <MessagingModal 
        isOpen={showMessaging} 
        onClose={() => setShowMessaging(false)}
        initialCreatorName={messagingCreator}
        projectTitle={messagingProject}
      />
    </>
  );
};

export default DashboardModals;
