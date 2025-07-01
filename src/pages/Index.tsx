
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TopCreatorsSection from '@/components/TopCreatorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustSecuritySection from '@/components/TrustSecuritySection';
import CTASection from '@/components/CTASection';
import FooterSection from '@/components/FooterSection';
import PasswordProtection from '@/components/PasswordProtection';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user has entered password (stored in sessionStorage)
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('creators-access') === 'true';
    setIsAuthenticated(hasAccess);
  }, []);

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && user && isAuthenticated) {
      console.log('Index: User authenticated, redirecting to dashboard', { userRole: user.role });
      if (user.role === 'storyteller') {
        navigate('/storyteller-dashboard');
      } else if (user.role === 'creator') {
        navigate('/creator-dashboard');
      }
    }
  }, [user, loading, navigate, isAuthenticated]);

  const handlePasswordAuthenticated = () => {
    sessionStorage.setItem('creators-access', 'true');
    setIsAuthenticated(true);
  };

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handlePasswordAuthenticated} />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TopCreatorsSection />
        <TestimonialsSection />
        <TrustSecuritySection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
