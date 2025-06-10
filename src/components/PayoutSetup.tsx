
import React from 'react';
import StripeConnectOnboarding from './StripeConnectOnboarding';

interface PayoutSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PayoutSetup: React.FC<PayoutSetupProps> = ({ onComplete, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <StripeConnectOnboarding 
        onComplete={onComplete}
      />
    </div>
  );
};

export default PayoutSetup;
