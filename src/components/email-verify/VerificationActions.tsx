
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VerificationActionsProps {
  status: 'loading' | 'success' | 'error';
}

const VerificationActions = ({ status }: VerificationActionsProps) => {
  const navigate = useNavigate();

  if (status === 'error') {
    return (
      <div className="space-y-3">
        <Button 
          onClick={() => navigate('/real-auth')}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          Go to Sign In
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="w-full border-white text-white hover:bg-white hover:text-black"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-3">
        <p className="text-white/80 text-sm">
          Redirecting you to sign in...
        </p>
        <Button 
          onClick={() => navigate('/real-auth')}
          className="w-full bg-white text-black hover:bg-white/90"
        >
          Continue to Sign In
        </Button>
      </div>
    );
  }

  return null;
};

export default VerificationActions;
