
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getDisplayName } from '@/hooks/useCreatorDashboard';
import CreatorCard from './CreatorCard';
import MatchResultsHeader from './MatchResultsHeader';
import CreatorProfileModal from './CreatorProfileModal';
import VideoPlayerModal from './VideoPlayerModal';
import { matchedCreators } from '@/data/mockCreators';

interface MatchResultsProps {
  onCreatorSelect: (creator: any) => void;
  onBack: () => void;
}

const MatchResults: React.FC<MatchResultsProps> = ({ onCreatorSelect, onBack }) => {
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '' });

  const handleViewProfile = (creator: any) => {
    setSelectedCreator(creator);
    setShowProfileModal(true);
  };

  const handleViewReel = (creator: any) => {
    const displayName = getDisplayName(creator.name);
    setCurrentVideo({
      url: `/api/demo-reel-${creator.id}`,
      title: `${displayName}'s Demo Reel`
    });
    setShowVideoModal(true);
  };

  const handlePlayVideo = (videoUrl: string, title: string) => {
    setCurrentVideo({ url: videoUrl, title });
    setShowVideoModal(true);
  };

  const handlePortfolioVideoClick = (creator: any, index: number) => {
    const displayName = getDisplayName(creator.name);
    setCurrentVideo({
      url: `/api/portfolio-video-${creator.id}-${index + 1}`,
      title: `${displayName} - Portfolio Video ${index + 1}`
    });
    setShowVideoModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <MatchResultsHeader onBack={onBack} />

      <div className="space-y-6">
        {matchedCreators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            onCreatorSelect={onCreatorSelect}
            onViewProfile={handleViewProfile}
            onViewReel={handleViewReel}
            onPortfolioVideoClick={handlePortfolioVideoClick}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline">
          View More Creators
        </Button>
      </div>

      <CreatorProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        creator={selectedCreator}
        onInviteToBid={onCreatorSelect}
        onPlayVideo={handlePlayVideo}
      />

      <VideoPlayerModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={currentVideo.url}
        title={currentVideo.title}
      />
    </div>
  );
};

export default MatchResults;
