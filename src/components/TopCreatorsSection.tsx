
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Pause } from 'lucide-react';

const TopCreatorsSection = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const creators = [
    {
      name: "Alex T.",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      specialty: "Animation Trailers",
      thumbnail: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      name: "Emma C.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&h=80&fit=crop&crop=face",
      rating: 4.8,
      specialty: "Fantasy Adventures",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      name: "Jordan K.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: "New",
      specialty: "Product Commercials",
      thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=120&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
    }
  ];

  const toggleVideo = (index: number) => {
    if (playingVideo === index) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(index);
    }
  };

  return (
    <section className="py-20 bg-black-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Top Rated AI Creators</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {creators.map((creator, index) => (
            <Card key={index} className="bg-dark-card text-white">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  {playingVideo === index ? (
                    <div className="relative">
                      <video 
                        src={creator.videoUrl}
                        className="w-full aspect-video object-cover rounded-lg"
                        controls
                        autoPlay
                        onEnded={() => setPlayingVideo(null)}
                      />
                      <button
                        onClick={() => toggleVideo(index)}
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                      >
                        <Pause className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={creator.thumbnail}
                        alt={creator.specialty}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <button
                        onClick={() => toggleVideo(index)}
                        className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center hover:bg-black/60 transition-colors group"
                      >
                        <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-white">{creator.name}</h3>
                    <p className="text-sm text-gray-300">{creator.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="font-medium text-white">
                    {creator.rating === "New" ? "New" : creator.rating}
                  </span>
                  <Badge variant="secondary" className="bg-gray-700 text-white">Pro</Badge>
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
