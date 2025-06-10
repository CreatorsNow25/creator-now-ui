
import React from 'react';
import { Shield, CheckCircle, Star } from 'lucide-react';

const TrustSecuritySection = () => {
  return (
    <section className="py-20 bg-black-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-16">Built For Trust & Security</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Escrow Protection</h3>
            <p className="text-gray-300">Your payments are protected until you're 100% satisfied.</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Verified Creators</h3>
            <p className="text-gray-300">All creators are vetted and verified for quality work.</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Review System</h3>
            <p className="text-gray-300">Transparent reviews help you make informed decisions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
