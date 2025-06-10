
import React from 'react';
import EscrowPaymentModal from './EscrowPaymentModal';

interface PaymentModalProps {
  project: any;
  onComplete: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ project, onComplete, onCancel }) => {
  // In a real implementation, you'd get the creator's Connect account ID from your database
  const creatorConnectId = project?.creator?.stripe_connect_id || 'acct_example';

  return (
    <EscrowPaymentModal
      project={project}
      creatorConnectId={creatorConnectId}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};

export default PaymentModal;
