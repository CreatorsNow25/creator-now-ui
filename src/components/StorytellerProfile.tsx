
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Edit } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface StorytellerProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialUserProfile = {
  name: "Sarah C.",
  fullName: "Sarah Chen",
  email: "sarah.chen@email.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=128&h=128&fit=crop&crop=face",
  city: "San Francisco, CA",
  bio: "Passionate storyteller with 5+ years of experience creating compelling narratives for film and digital media. I specialize in fantasy, sci-fi, and drama genres.",
  joinDate: "March 2023",
  totalProjects: 12,
  totalSpent: 7500,
  averageRating: 4.8,
  reviews: [
    {
      id: 1,
      creatorName: "Alex Thompson",
      rating: 5,
      comment: "Sarah provided clear direction and excellent feedback throughout the project. Great communication!",
      projectTitle: "Epic Fantasy Adventure Trailer",
      date: "2 weeks ago"
    },
    {
      id: 2,
      creatorName: "Maya Patel",
      rating: 5,
      comment: "Very professional and creative. The project brief was detailed and inspiring to work with.",
      projectTitle: "Sci-Fi Thriller Teaser",
      date: "1 month ago"
    },
    {
      id: 3,
      creatorName: "Jordan Kim",
      rating: 4,
      comment: "Good collaboration and timely responses. Looking forward to working together again.",
      projectTitle: "Romance Drama Preview",
      date: "2 months ago"
    }
  ]
};

const StorytellerProfile = ({ isOpen, onClose }: StorytellerProfileProps) => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [showEdit, setShowEdit] = useState(false);

  const handleEditProfile = () => setShowEdit(true);

  const handleSaveProfile = (updated: { name: string; city: string; bio: string; avatar: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      name: updated.name,
      city: updated.city,
      bio: updated.bio,
      avatar: updated.avatar,
      fullName: updated.name,
    }));
    setShowEdit(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{userProfile.name}</h3>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{userProfile.city}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                <p className="text-gray-700 mt-3">{userProfile.bio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.totalProjects}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">${userProfile.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-gray-900">{userProfile.averageRating}</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.joinDate}</div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Reviews from Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.reviews.map((review) => (
                    <div key={review.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{review.creatorName}</p>
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
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Profile Modal */}
      <EditProfileModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        initialProfile={{
          name: userProfile.name,
          city: userProfile.city,
          bio: userProfile.bio,
          avatar: userProfile.avatar,
        }}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default StorytellerProfile;
