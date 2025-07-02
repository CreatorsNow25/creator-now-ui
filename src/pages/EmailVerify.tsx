
import React from 'react';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import VerificationHeader from '@/components/email-verify/VerificationHeader';
import VerificationCard from '@/components/email-verify/VerificationCard';

const EmailVerify = () => {
  const { status, message } = useEmailVerification();

  return (
    <div className="min-h-screen bg-black">
      <VerificationHeader />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <VerificationCard status={status} message={message} />
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
