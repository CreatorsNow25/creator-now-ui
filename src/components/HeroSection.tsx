
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-black-section py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Connect With AI Creators.
          <br />
          <span className="text-gray-300">Bring Your Story To Life.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The marketplace where storytellers meet talented AI creators to produce cinematic trailers, 
          short films, and visual content that captivates audiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/real-auth?role=storyteller')}
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3"
          >
            I'm a Storyteller
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/real-auth?role=creator')}
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3"
          >
            I'm an AI Creator
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
