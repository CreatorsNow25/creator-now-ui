
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordProtection from '@/components/PasswordProtection';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user has entered password (stored in sessionStorage)
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('creators-access') === 'true';
    setIsAuthenticated(hasAccess);
  }, []);

  // Redirect authenticated users directly to the auth/demo page
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Index: User authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handlePasswordAuthenticated = () => {
    sessionStorage.setItem('creators-access', 'true');
    setIsAuthenticated(true);
  };

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handlePasswordAuthenticated} />;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading demo platform...</p>
      </div>
    </div>
  );
};

export default Index;
