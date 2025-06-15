
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface ProfileCompletionBannerProps {
  profileComplete: boolean;
  onCompleteProfile: () => void;
}

const ProfileCompletionBanner = ({ profileComplete, onCompleteProfile }: ProfileCompletionBannerProps) => {
  if (!profileComplete) {
    return (
      <Card className="border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">Get 3x more project invites by completing your creator profile</p>
              <div className="mt-3">
                <Progress value={30} className="h-2 w-64" />
                <p className="text-sm text-gray-600 mt-1">3 of 10 steps completed</p>
              </div>
            </div>
            <Button
              onClick={onCompleteProfile}
              className="bg-black text-white hover:bg-gray-800"
            >
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Profile Complete!</h3>
            <p className="text-gray-600">You're now eligible for premium project invites</p>
          </div>
          <Badge className="bg-gray-100 text-gray-800 ml-auto">Premium Creator</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionBanner;
