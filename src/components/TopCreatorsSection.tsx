
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Pause } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';
import { useRealUsers } from '@/hooks/useRealUsers';
import emmaAvatar from '@/assets/avatars/emma.jpg';

const TopCreatorsSection = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const { realCreators, loading } = useRealUsers();
  const [playNonce, setPlayNonce] = useState(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const thumbRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const demoCreators = useMemo(() => [
    {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      specialty: "Animation Trailers",
      thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: 'demo' as const
    },
    {
      name: "Emma Collins",
      avatar: emmaAvatar,
      rating: 4.8,
      specialty: "Fantasy Adventures",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: 'demo' as const
    },
    {
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: "New",
      specialty: "Sci-Fi Concepts",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=120&fit=crop",
      videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
      type: 'demo' as const
    }
  ], []);

  // Combine real creators with demo creators
  const allCreators = useMemo(() => {
    const combined = [...realCreators, ...demoCreators];
    // Show maximum of 6 creators (prioritize real users)
    return combined.slice(0, 6);
  }, [realCreators, demoCreators]);

  // Memoize display names to prevent recalculation
  const creatorsWithDisplayNames = useMemo(() => 
    allCreators.map(creator => ({
      ...creator,
      displayName: creator.type === 'real' ? creator.displayName : getDisplayName(creator.name)
    })), [allCreators]);

  const toggleVideo = (index: number) => {
    if (playingVideo === index) {
      const vid = videoRefs.current[index];
      if (vid) {
        try { vid.pause(); vid.currentTime = 0; } catch {}
      }
      setPlayingVideo(null);
    } else {
      setPlayNonce((n) => n + 1);
      setPlayingVideo(index);
    }
  };
  useEffect(() => {
    if (playingVideo !== null) {
      const vid = videoRefs.current[playingVideo];
      if (vid) {
        try {
          vid.currentTime = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } catch {}
      }
    }
  }, [playingVideo, playNonce]);

  return (
    <section className="py-20 bg-black-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Top Rated AI Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {creatorsWithDisplayNames.map((creator, index) => (
            <Card key={index} className="bg-dark-card text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="relative mb-4">
                  <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {playingVideo === index ? (
                      <div className="relative w-full h-full">
                        <video 
                          key={`video-${index}-${playNonce}`}
                          ref={(el) => { videoRefs.current[index] = el; }}
                          src={`${creator.videoUrl}${creator.videoUrl.includes('?') ? '&' : '?'}cb=${playNonce}`}
                          className="w-full h-full object-cover"
                          poster={`${creator.thumbnail}${creator.thumbnail?.includes('?') ? '&' : '?'}cb=${playNonce}`}
                          controls
                          playsInline
                          preload="metadata"
                          onEnded={() => setPlayingVideo(null)}
                          onError={(e) => {
                            console.error('Video failed to load:', creator.videoUrl, e);
                            setPlayingVideo(null);
                          }}
                          onLoadStart={() => console.log('Video loading started:', creator.videoUrl)}
                          onCanPlay={() => console.log('Video can play:', creator.videoUrl)}
                        />
                        <button
                          onClick={() => toggleVideo(index)}
                          className="absolute top-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
                        >
                          <Pause className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          key={`poster-${index}-${playNonce}`}
                          ref={(el) => {
                            const isTarget = creator.type === 'demo' && (creator.name === 'Emma Collins' || creator.name === 'Jordan Kim');
                            if (isTarget) thumbRefs.current[index] = el;
                          }}
                          className="w-full h-full object-cover"
                          poster={`${creator.thumbnail}${creator.thumbnail?.includes('?') ? '&' : '?'}cb=${playNonce}`}
                          src={(() => {
                            const isTarget = creator.type === 'demo' && (creator.name === 'Emma Collins' || creator.name === 'Jordan Kim');
                            return isTarget ? `${creator.videoUrl}${creator.videoUrl.includes('?') ? '&' : '?'}cb=${playNonce}` : undefined;
                          })()}
                          preload="metadata"
                          playsInline
                          muted
                          onLoadedMetadata={(e) => {
                            const isTarget = creator.type === 'demo' && (creator.name === 'Emma Collins' || creator.name === 'Jordan Kim');
                            if (isTarget) {
                              try { e.currentTarget.currentTime = 0.12; } catch {}
                            }
                          }}
                          onSeeked={(e) => {
                            const isTarget = creator.type === 'demo' && (creator.name === 'Emma Collins' || creator.name === 'Jordan Kim');
                            if (isTarget) {
                              try { e.currentTarget.pause(); } catch {}
                            }
                          }}
                        />
                        <button
                          onClick={() => toggleVideo(index)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors group"
                        >
                          <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={creator.avatar}
                    alt={creator.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div>
                    <h3 className="font-bold text-white">{creator.displayName}</h3>
                    <p className="text-sm text-gray-300">{creator.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="font-medium text-white">
                    {creator.rating === "New" ? "New" : creator.rating}
                  </span>
                  {creator.rating !== "New" && (
                    <Badge variant="secondary" className="bg-gray-700 text-white">Pro</Badge>
                  )}
                  {creator.rating === "New" && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">New</Badge>
                  )}
                  {creator.type === 'real' && (
                    <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-400">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCreatorsSection;
