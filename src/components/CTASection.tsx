
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-black mb-6">Ready To Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">Join thousands of storytellers and creators bringing amazing projects to life.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
          >
            Storyteller
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
          >
            AI Creator
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
