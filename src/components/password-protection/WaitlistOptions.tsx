
import React from 'react';
import { Button } from '@/components/ui/button';

interface WaitlistOptionsProps {
  onWaitlistClick: () => void;
  onDemoClick: () => void;
}

const WaitlistOptions = ({ onWaitlistClick, onDemoClick }: WaitlistOptionsProps) => {
  return (
    <div className="space-y-3">
      <Button
        onClick={onWaitlistClick}
        variant="outline"
        className="w-full border-white/20 text-white bg-transparent hover:bg-white hover:text-black"
      >
        Join Waitlist
      </Button>
      <Button
        onClick={onDemoClick}
        variant="outline"
        className="w-full border-white/20 text-white bg-transparent hover:bg-white hover:text-black"
      >
        Request Demo
      </Button>
    </div>
  );
};

export default WaitlistOptions;
