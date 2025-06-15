
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (user?.role === 'storyteller') {
      navigate('/storyteller-dashboard');
    } else {
      navigate('/creator-dashboard');
    }
  };

  return (
    <header className="bg-black-section sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Creators Now</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white/80 hidden sm:block">
                  Welcome, {user.full_name}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={handleDashboardClick}
                  className="text-white hover:text-black hover:bg-white"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-white hover:text-black hover:bg-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="text-white hover:text-black hover:bg-white">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-black text-white hover:bg-gray-800 border border-white">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
