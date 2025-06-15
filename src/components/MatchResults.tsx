
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, ArrowLeft, Eye, MessageSquare, DollarSign } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

interface MatchResultsProps {
  onCreatorSelect: (creator: any) => void;
  onBack: () => void;
}

const MatchResults: React.FC<MatchResultsProps> = ({ onCreatorSelect, onBack }) => {
  const matchedCreators = [
    {
      id: 1,
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 127,
      completedProjects: 156,
      rate: 2500,
      specialty: "Sci-Fi & Fantasy Trailers",
      responseTime: "2 hours",
      availability: "Available now",
      portfolio: [
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=120&fit=crop"
      ],
      tags: ["AI Animation", "VFX", "Sound Design", "Color Grading"],
      bio: "Award-winning AI creator specializing in epic fantasy and sci-fi trailers. 8+ years of experience creating stunning visuals for indie films and major studios.",
      matchScore: 95
    },
    {
      id: 2,
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 89,
      completedProjects: 112,
      rate: 2200,
      specialty: "Fantasy & Adventure",
      responseTime: "4 hours",
      availability: "Available next week",
      portfolio: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=120&fit=crop"
      ],
      tags: ["Character Animation", "Environmental Design", "Motion Graphics"],
      bio: "Creative storyteller with a passion for bringing fantasy worlds to life through cutting-edge AI technology and traditional animation principles.",
      matchScore: 92
    },
    {
      id: 3,
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 203,
      completedProjects: 178,
      rate: 2800,
      specialty: "Drama & Thriller",
      responseTime: "1 hour",
      availability: "Available now",
      portfolio: [
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=120&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop"
      ],
      tags: ["Cinematic Editing", "Advanced VFX", "Audio Design", "Color Theory"],
      bio: "Professional director turned AI creator. Specialized in creating emotionally compelling trailers that capture the essence of dramatic storytelling.",
      matchScore: 88
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('now')) return 'bg-green-100 text-green-800';
    if (availability.includes('week')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfect Matches Found</h1>
        <p className="text-gray-600">We found 5 creators that match your project requirements</p>
      </div>

      <div className="space-y-6">
        {matchedCreators.map((creator) => (
          <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-amber-400">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                {/* Creator Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={creator.avatar}
                        alt={getDisplayName(creator.name)}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{getDisplayName(creator.name)}</h3>
                          <Badge className="bg-amber-100 text-amber-800">
                            {creator.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium">{creator.specialty}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Portfolio Preview */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Work</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {creator.portfolio.map((image, index) => (
                        <div key={index} className="relative group">
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

                  {/* Quick Stats */}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => onCreatorSelect(creator)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Invite to Bid
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                    <Button variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      View Reel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline">
          View More Creators
        </Button>
      </div>
    </div>
  );
};

export default MatchResults;
