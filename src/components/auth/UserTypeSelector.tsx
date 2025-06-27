
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Play } from 'lucide-react';

interface UserTypeSelectorProps {
  userType: 'storyteller' | 'creator';
  onUserTypeChange: (type: 'storyteller' | 'creator') => void;
}

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-white mb-4">Join Creators Now</h2>
      <p className="text-white/80 mb-6">Choose How You Want To Get Started</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button
          variant={userType === 'storyteller' ? 'default' : 'outline'}
          onClick={() => onUserTypeChange('storyteller')}
          className={userType === 'storyteller' 
            ? 'bg-white text-black hover:bg-white/90' 
            : 'border-white text-white hover:bg-white hover:text-black'
          }
        >
          <User className="w-4 h-4 mr-2" />
          Storyteller
        </Button>
        <Button
          variant={userType === 'creator' ? 'default' : 'outline'}
          onClick={() => onUserTypeChange('creator')}
          className={userType === 'creator' 
            ? 'bg-white text-black hover:bg-white/90' 
            : 'bg-white text-black border-white hover:bg-white/90'
          }
        >
          <Play className="w-4 h-4 mr-2" />
          AI Creator
        </Button>
      </div>
    </div>
  );
};

export default UserTypeSelector;
