import React from 'react';
import { RealAuthForm } from '@/components/auth/RealAuthForm';
import AuthHeader from '@/components/auth/AuthHeader';

const RealAuth = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <AuthHeader />
        <RealAuthForm />
      </div>
    </div>
  );
};

export default RealAuth;