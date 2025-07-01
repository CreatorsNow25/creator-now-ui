
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BrandHeader from './BrandHeader';

interface SuccessMessageProps {
  requestType: 'waitlist' | 'demo';
  onBack: () => void;
}

const SuccessMessage = ({ requestType, onBack }: SuccessMessageProps) => {
  return (
    <Card className="w-full max-w-md bg-gray-900 border-white/20">
      <CardContent className="p-8 text-center">
        <BrandHeader 
          title="Thank You!" 
          iconSize="lg"
        />
        <p className="text-white/80 mb-6">
          {requestType === 'demo' 
            ? "We'll be in touch soon to schedule your demo."
            : "You're on the waitlist! We'll notify you when we launch."
          }
        </p>
        <Button 
          onClick={onBack}
          className="bg-white text-black hover:bg-gray-200"
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuccessMessage;
