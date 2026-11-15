
import React, { useState } from 'react';
import PasswordAccessForm from './password-protection/PasswordAccessForm';
import WaitlistForm from './password-protection/WaitlistForm';
import SuccessMessage from './password-protection/SuccessMessage';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

type ViewState = 'password' | 'waitlist' | 'success';

const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('password');
  const [requestType, setRequestType] = useState<'waitlist' | 'demo' | null>(null);

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
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
