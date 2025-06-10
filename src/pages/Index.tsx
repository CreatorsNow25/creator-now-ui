
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TopCreatorsSection from '@/components/TopCreatorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustSecuritySection from '@/components/TrustSecuritySection';
import CTASection from '@/components/CTASection';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <TopCreatorsSection />
      <TestimonialsSection />
      <TrustSecuritySection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Index;
