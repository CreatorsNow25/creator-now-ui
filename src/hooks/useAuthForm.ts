
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthForm = () => {
  const { signUp, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password validation function
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  // Send signup confirmation email
  const sendSignupConfirmationEmail = async (email: string, fullName: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'signup_confirmation',
          email: email,
          user_name: fullName || email.split('@')[0]
        }
      });

      if (error) {
        console.error('Failed to send signup confirmation email:', error);
      }
    } catch (error) {
      console.error('Error sending signup confirmation email:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>, userType: 'storyteller' | 'creator') => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('name') as string;

    // Validate password strength before attempting signup
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    console.log('Auth: Attempting signup with:', { email, passwordLength: password.length, fullName, userType });

    const { data, error } = await signUp(email, password, {
      full_name: fullName,
      role: userType
    });

    console.log('Auth: Signup result:', { data: data?.user?.id, error });

    if (error) {
      console.error('Auth: Signup error details:', error);
      if (error.message.includes('already registered')) {
        setError('This email is already registered. Please try signing in instead.');
      } else if (error.message.includes('Password should be at least')) {
        setError('Password must be at least 8 characters long with uppercase, lowercase, and numbers.');
      } else if (error.message.includes('weak')) {
        setError('Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.');
      } else {
        setError(`Signup failed: ${error.message}`);
      }
    } else if (data?.user) {
      // Send signup confirmation email
      await sendSignupConfirmationEmail(email, fullName);
      
      if (data.user.email_confirmed_at) {
        setSuccessMessage('Account created and verified! You can now sign in.');
      } else {
        setSuccessMessage('Account created successfully! Please check your email for a verification link to complete your setup.');
      }
    } else {
      setSuccessMessage('Account created! Please check your email for a verification link.');
    }

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

    console.log('Auth: Attempting signin with:', { email, passwordLength: password.length });

    const { data, error } = await signIn(email, password);

    console.log('Auth: Signin result:', { data: data?.user?.id, error });

    if (error) {
      console.error('Auth: Signin error details:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you just signed up, please check your email and verify your account first.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and click the verification link before signing in.');
      } else if (error.message.includes('not confirmed')) {
        setError('Please verify your email address by clicking the link we sent you.');
      } else {
        setError(`Sign in failed: ${error.message}`);
      }
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    successMessage,
    handleSignUp,
    handleSignIn,
  };
};
