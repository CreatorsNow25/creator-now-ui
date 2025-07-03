
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

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user has entered password (stored in sessionStorage)
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('creators-access') === 'true';
    setIsAuthenticated(hasAccess);
  }, []);

  const handlePasswordAuthenticated = () => {
    sessionStorage.setItem('creators-access', 'true');
    setIsAuthenticated(true);
  };

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handlePasswordAuthenticated} />;
  }

  // Show main website after demo code entry
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
