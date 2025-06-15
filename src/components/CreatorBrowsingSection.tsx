
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, ArrowRight, Eye, MessageSquare, Users } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

interface CreatorBrowsingSectionProps {
  onViewMatches: () => void;
  onCreateProject: () => void;
}

const CreatorBrowsingSection: React.FC<CreatorBrowsingSectionProps> = ({ 
  onViewMatches, 
  onCreateProject 
}) => {
  const featuredCreators = [
    {
      id: 1,
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 127,
      specialty: "Sci-Fi & Fantasy Trailers",
      rate: 2500,
      availability: "Available now",
      tags: ["AI Animation", "VFX", "Sound Design"]
    },
    {
      id: 2,
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 89,
      specialty: "Fantasy & Adventure",
      rate: 2200,
      availability: "Available next week",
      tags: ["Character Animation", "Environmental Design"]
    },
    {
      id: 3,
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 203,
      specialty: "Drama & Thriller",
      rate: 2800,
      availability: "Available now",
      tags: ["Cinematic Editing", "Advanced VFX"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Top AI Creators</h2>
        <p className="text-gray-600 text-lg mb-8">Find the perfect creator for your next project</p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onCreateProject}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Start New Project
          </Button>
          <Button 
            onClick={onViewMatches}
            variant="outline"
          >
            <Users className="w-4 h-4 mr-2" />
            View All Creators
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featuredCreators.map((creator) => {
          const displayName = getDisplayName(creator.name);
          
          return (
            <Card key={creator.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={creator.avatar}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{displayName}</h3>
                    <p className="text-sm text-gray-600">{creator.specialty}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{creator.rating}</span>
                      <span className="text-sm text-gray-500">({creator.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Starting at</span>
                    <span className="font-bold text-lg">${creator.rate.toLocaleString()}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {creator.availability}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {creator.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorBrowsingSection;
