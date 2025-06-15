
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Play, Bell, Settings, LogOut, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StorytellerHeaderProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogout?: () => void;
}

const StorytellerHeader = ({ onProfileClick, onSettingsClick, onHelpClick, onLogout }: StorytellerHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - redirect to home
      navigate('/');
    }
  };

  const handleProfile = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleSettings = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleHelp = () => {
    if (onHelpClick) {
      onHelpClick();
    }
  };

  // New navigation handlers for header links
  const handleNavDashboard = () => navigate('/storyteller-dashboard');
  const handleNavProjects = () => navigate('/storyteller-dashboard');
  const handleNavBrowseCreators = () => navigate('/creator-dashboard');

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Creators Now</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none outline-none cursor-pointer"
                onClick={handleNavDashboard}
                type="button"
              >
                Dashboard
              </button>
              <button
                className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none outline-none cursor-pointer"
                onClick={handleNavProjects}
                type="button"
              >
                Projects
              </button>
              <button
                className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none outline-none cursor-pointer"
                onClick={handleNavBrowseCreators}
                type="button"
              >
                Browse Creators
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face" alt="Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Sarah Chen</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      sarah.chen@email.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleHelp}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help Center</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StorytellerHeader;
