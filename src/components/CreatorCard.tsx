
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, Eye, MessageSquare } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

interface CreatorCardProps {
  creator: any;
  onCreatorSelect: (creator: any) => void;
  onViewProfile: (creator: any) => void;
  onViewReel: (creator: any) => void;
  onPortfolioVideoClick: (creator: any, index: number) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onCreatorSelect,
  onViewProfile,
  onViewReel,
  onPortfolioVideoClick
}) => {
  const displayName = getDisplayName(creator.name);
  console.log(`CreatorCard: Processing creator ${creator.name}, display name: ${displayName}`);

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('now')) return 'bg-green-100 text-green-800';
    if (availability.includes('week')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-black">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={creator.avatar}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
                    <Badge className="bg-black text-white">
                      {creator.matchScore}% Match
                    </Badge>
                  </div>
                  <p className="text-gray-600 font-medium">{creator.specialty}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-black text-black" />
                      <span>{creator.rating}</span>
                      <span>({creator.reviewCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>{creator.completedProjects} projects</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${creator.rate.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Starting at</p>
                <Badge className={getAvailabilityColor(creator.availability)}>
                  {creator.availability}
                </Badge>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{creator.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4 h-[3rem] overflow-hidden">
              {creator.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Recent Work</h4>
              <div className="grid grid-cols-3 gap-2">
                {creator.portfolio.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => onPortfolioVideoClick(creator, index)}
                  >
                    <img 
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600">Response Time</p>
                <p className="font-medium">{creator.responseTime}</p>
              </div>
              <div>
                <p className="text-gray-600">Delivery</p>
                <p className="font-medium">5-7 days</p>
              </div>
              <div>
                <p className="text-gray-600">Revisions</p>
                <p className="font-medium">3 included</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => onCreatorSelect(creator)}
                className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Invite to Bid
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onViewProfile(creator)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
              <Button 
                variant="outline"
                onClick={() => onViewReel(creator)}
              >
                <Play className="w-4 h-4 mr-2" />
                View Reel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
