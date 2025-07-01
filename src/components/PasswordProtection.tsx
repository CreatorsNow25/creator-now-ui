
import React, { useState } from 'react';
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {renderCurrentView()}
    </div>
  );
};

export default PasswordProtection;
