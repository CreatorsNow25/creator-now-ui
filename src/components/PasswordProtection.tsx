
import React, { useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import PasswordAccessForm from './password-protection/PasswordAccessForm';
import WaitlistForm from './password-protection/WaitlistForm';
import SuccessMessage from './password-protection/SuccessMessage';
import WaitlistOptions from './password-protection/WaitlistOptions';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

type ViewState = 'password' | 'waitlist' | 'success';

const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('password');
  const [requestType, setRequestType] = useState<'waitlist' | 'demo' | null>(null);

  const handleWaitlistClick = () => {
    setRequestType('waitlist');
    setCurrentView('waitlist');
  };

  const handleDemoClick = () => {
    setRequestType('demo');
    setCurrentView('waitlist');
  };

  const handleWaitlistSuccess = () => {
    setCurrentView('success');
  };

  const handleBackToMain = () => {
    setCurrentView('password');
    setRequestType(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'waitlist':
        return (
          <WaitlistForm
            requestType={requestType!}
            onSuccess={handleWaitlistSuccess}
            onBack={handleBackToMain}
          />
        );
      case 'success':
        return (
          <SuccessMessage
            requestType={requestType!}
            onBack={handleBackToMain}
          />
        );
      default:
        return (
          <div className="w-full max-w-md space-y-6">
            <PasswordAccessForm onAuthenticated={onAuthenticated} />
            <WaitlistOptions 
              onWaitlistClick={handleWaitlistClick}
              onDemoClick={handleDemoClick}
            />
            <p className="text-center text-white/60 text-sm">
              Connect with AI creators and bring your stories to life
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="flex-1 flex items-center justify-center">
        {renderCurrentView()}
      </div>
      
      {/* Social Media Icons */}
      <div className="mb-8">
        <div className="flex space-x-4 justify-center">
          <a href="https://x.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
          <a href="https://instagram.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://tiktok.com/@joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.204-1.864-1.204-2.804V1H12.68v14.66c0 .917-.283 1.793-.82 2.535a4.37 4.37 0 01-2.24 1.629c-.897.309-1.864.309-2.761 0a4.37 4.37 0 01-2.24-1.629c-.537-.742-.82-1.618-.82-2.535 0-.917.283-1.793.82-2.535a4.37 4.37 0 012.24-1.629c.448-.154.923-.231 1.398-.231v-3.89c-1.381.077-2.716.464-3.89 1.127-1.174.664-2.145 1.635-2.808 2.808C.674 12.644.287 13.98.21 15.36v.3c0 2.12.84 4.156 2.34 5.66C4.05 22.82 6.086 23.66 8.206 23.66s4.156-.84 5.66-2.34c1.5-1.504 2.34-3.54 2.34-5.66V8.542a9.1 9.1 0 005.115 1.55V6.235c-.795-.077-1.55-.385-2.145-.964-.595-.58-.964-1.35-.964-2.145-.077-.232-.154-.463-.231-.695z"></path></svg>
          </a>
          <a href="https://threads.net/@joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.001 1.5 8.416 2.35 5.562 3.995 3.51 5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.65 5.56 22.5 8.414 22.5 11.999c0 3.585-.85 6.439-2.495 8.49-1.85 2.305-4.603 3.486-8.184 3.51zm5.267-13.566c-.684-5.207-3.88-8.77-7.454-8.77s-6.77 3.563-7.454 8.77c.684 5.207 3.88 8.77 7.454 8.77s6.77-3.563 7.454-8.77z"></path></svg>
          </a>
          <a href="https://facebook.com/joincreatorsnow" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
