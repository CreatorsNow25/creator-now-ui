
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import AuthHeader from '@/components/auth/AuthHeader';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userType, setUserType] = useState<'storyteller' | 'creator'>('storyteller');
  
  const {
    isLoading,
    error,
    successMessage,
    handleSignUp,
    handleSignIn,
    handleOAuthLogin,
  } = useAuthForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'storyteller') {
        navigate('/storyteller-dashboard');
      } else {
        navigate('/creator-dashboard');
      }
    }
  }, [user, navigate]);

  const onSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignUp(e, userType);
  };

  return (
    <div className="min-h-screen bg-black">
      <AuthHeader />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <UserTypeSelector 
            userType={userType} 
            onUserTypeChange={setUserType} 
          />

          <AuthForm
            userType={userType}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onSignUp={onSignUp}
            onSignIn={handleSignIn}
            onOAuthLogin={handleOAuthLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
