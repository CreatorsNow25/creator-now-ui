
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, Award, Play, MessageSquare, ArrowLeft } from 'lucide-react';
import { getDisplayName } from '@/hooks/useCreatorDashboard';

interface CreatorProfileViewProps {
  creator: any;
  onBack: () => void;
  onContactCreator: (creatorName: string) => void;
  onPlayVideo?: (videoUrl: string, title: string) => void;
}

const CreatorProfileView = ({ 
  creator, 
  onBack, 
  onContactCreator, 
  onPlayVideo 
}: CreatorProfileViewProps) => {
  if (!creator) return null;

  const displayName = getDisplayName(creator.name);

  const extendedPortfolio = [
    ...creator.portfolio,
    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=200&h=120&fit=crop",
    "https://images.unsplash.com/photo-1551847973-5d3c845d4b68?w=200&h=120&fit=crop",
    "https://images.unsplash.com/photo-1478720568477-b0ac9fb7b56d?w=200&h=120&fit=crop"
  ];

  const reviews = [
    {
      id: 1,
      clientName: "Jennifer M.",
      rating: 5,
      comment: "Absolutely stunning work! The trailer exceeded all my expectations. Professional, creative, and delivered on time.",
      projectTitle: "Fantasy Epic Trailer",
      date: "2 weeks ago"
    },
    {
      id: 2,
      clientName: "Michael R.",
      rating: 5,
      comment: "Incredible attention to detail and amazing visual effects. Will definitely work with again!",
      projectTitle: "Sci-Fi Adventure Teaser",
      date: "1 month ago"
    },
    {
      id: 3,
      clientName: "Sarah K.",
      rating: 4,
      comment: "Great communication throughout the project. The final result was exactly what we were looking for.",
      projectTitle: "Drama Series Promo",
      date: "2 months ago"
    }
  ];

  const handlePlayVideo = (videoUrl: string, title: string) => {
    if (onPlayVideo) {
      onPlayVideo(videoUrl, title);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Browse
      </Button>

      {/* Header Section */}
      <div className="flex items-start space-x-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={creator.avatar} alt={displayName} />
          <AvatarFallback>{displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">{displayName}</h2>
            <Badge className="bg-black text-white text-lg px-3 py-1">
              Top Creator
            </Badge>
          </div>
          <p className="text-xl text-gray-600 font-medium mb-2">{creator.specialty}</p>
          <div className="flex items-center space-x-4 text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 fill-black text-black" />
              <span className="font-medium">{creator.rating}</span>
              <span>({creator.reviewCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Award className="w-5 h-5" />
              <span>150+ projects completed</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Based in Los Angeles, CA</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Member since 2021</span>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Award-winning creator specializing in cinematic trailers and promotional content. 
            With over 5 years of experience in the industry, I bring stories to life through 
            compelling visuals and immersive storytelling techniques.
          </p>
        </div>
      </div>

      {/* Skills & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skills & Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {creator.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pricing & Availability</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Starting Rate:</span>
                <span className="font-semibold">${creator.rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-semibold">Within 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <Badge className={creator.availability.includes('now') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {creator.availability}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {extendedPortfolio.map((image, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={() => handlePlayVideo(`/api/placeholder-video-${index + 1}`, `Portfolio Video ${index + 1}`)}
              >
                <img 
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Client Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{review.clientName}</p>
                    <p className="text-sm text-gray-600">{review.projectTitle}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{review.date}</span>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4 border-t">
        <Button 
          onClick={() => onContactCreator(creator.name)}
          className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Creator
        </Button>
        <Button 
          variant="outline"
          onClick={() => handlePlayVideo('/api/demo-reel', `${displayName}'s Demo Reel`)}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          View Demo Reel
        </Button>
      </div>
    </div>
  );
};

export default CreatorProfileView;
