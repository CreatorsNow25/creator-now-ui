
import React from 'react';
import { Users, Zap, Play } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-black mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-4">1. Discover Talent</h3>
            <p className="text-gray-600">Browse portfolios of AI creators who specialize in film trailers, shorts, and story-driven visuals.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-4">2. Collaborate Seamlessly</h3>
            <p className="text-gray-600">Chat, exchange drafts, and shape your vision together in real time.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-4">3. Approve And Get Paid</h3>
            <p className="text-gray-600">Once the final cut is approved, payment is released and both sides leave a review.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
