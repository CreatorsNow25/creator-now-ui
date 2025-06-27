
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Creators Now</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:text-black hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Home
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
