
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const EmailVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('EmailVerify: Starting verification process');
    
    const verifyEmail = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log('EmailVerify: URL params:', { token: token?.substring(0, 10) + '...', type });

        if (!token || !type) {
          console.log('EmailVerify: Missing token or type');
          setStatus('error');
          setMessage('Invalid verification link. Please check your email and try again.');
          return;
        }

        // Verify the email with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        console.log('EmailVerify: Verification result:', { user: data?.user?.id, error });

        if (error) {
          console.error('EmailVerify: Verification failed:', error);
          setStatus('error');
          
          if (error.message.includes('expired')) {
            setMessage('This verification link has expired. Please request a new one.');
          } else if (error.message.includes('invalid')) {
            setMessage('This verification link is invalid. Please check your email and try again.');
          } else {
            setMessage('Email verification failed. Please try again or contact support.');
          }
        } else if (data?.user) {
          console.log('EmailVerify: Verification successful');
          setStatus('success');
          setMessage('Your email has been verified successfully! Redirecting to your dashboard...');
          
          // Wait a moment then redirect based on user role
          setTimeout(() => {
            // For now, redirect to auth page which will handle the role-based redirect
            navigate('/auth');
          }, 2000);
        } else {
          console.log('EmailVerify: No user data received');
          setStatus('error');
          setMessage('Verification completed but no user data received. Please try signing in.');
        }
      } catch (err) {
        console.error('EmailVerify: Unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white">Creators Now</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:text-black hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back To Home
            </Button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="bg-gray-900 border-white/20 text-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {status === 'loading' && (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                )}
                {status === 'success' && (
                  <CheckCircle className="w-12 h-12 text-green-400" />
                )}
                {status === 'error' && (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>
              <CardTitle className="text-2xl text-white">
                {status === 'loading' && 'Verifying Your Email...'}
                {status === 'success' && 'Email Verified!'}
                {status === 'error' && 'Verification Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Alert className={`mb-4 ${
                status === 'success' 
                  ? 'bg-green-900/50 border-green-500' 
                  : status === 'error'
                  ? 'bg-red-900/50 border-red-500'
                  : 'bg-blue-900/50 border-blue-500'
              }`}>
                <AlertDescription className={`${
                  status === 'success' 
                    ? 'text-green-200' 
                    : status === 'error'
                    ? 'text-red-200'
                    : 'text-blue-200'
                }`}>
                  {message || 'Please wait while we verify your email address...'}
                </AlertDescription>
              </Alert>

              {status === 'error' && (
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/auth')}
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
              )}

              {status === 'success' && (
                <p className="text-white/80 text-sm">
                  You will be redirected automatically in a few seconds...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
