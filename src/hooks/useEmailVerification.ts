
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useEmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('EmailVerify: Starting verification process');
    
    const verifyEmail = async () => {
      try {
        // Get all possible parameters from URL
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        
        console.log('EmailVerify: URL params:', { 
          tokenHash: tokenHash?.substring(0, 10) + '...', 
          type,
          token: token?.substring(0, 10) + '...',
          email,
          allParams: Object.fromEntries(searchParams.entries())
        });

        // Try token_hash method first (this is what Supabase typically sends)
        if (tokenHash && type) {
          console.log('EmailVerify: Using token_hash method');
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any
          });

          console.log('EmailVerify: Token hash verification result:', { user: data?.user?.id, error });

          if (error) {
            console.error('EmailVerify: Token hash verification failed:', error);
            setStatus('error');
            setMessage(`Email verification failed: ${error.message}`);
            return;
          }
          
          if (data?.user) {
            console.log('EmailVerify: Verification successful for user:', data.user.id);

            // Mark email as confirmed and set display_name if missing
            try {
              const userId = data.user.id;
              const { data: profile, error: profileFetchError } = await supabase
                .from('real_user_profiles')
                .select('first_name, last_name, display_name')
                .eq('user_id', userId)
                .maybeSingle();

              if (profileFetchError) {
                console.error('EmailVerify: Failed to fetch profile for update:', profileFetchError);
              }

              const updates: any = { email_confirmed: true };
              if (profile && !profile.display_name && profile.first_name && profile.last_name) {
                updates.display_name = `${profile.first_name} ${profile.last_name.charAt(0)}.`;
              }

              const { error: updateError } = await supabase
                .from('real_user_profiles')
                .update(updates)
                .eq('user_id', userId);
              if (updateError) {
                console.error('EmailVerify: Failed to update profile after verification:', updateError);
              }
            } catch (e) {
              console.error('EmailVerify: Error updating profile after verification:', e);
            }

            setStatus('success');
            setMessage('Your email has been verified successfully! You can now sign in to your account.');
            
            // Wait a moment then redirect to sign in
            setTimeout(() => {
              navigate('/real-auth', { 
                state: { 
                  message: 'Email verified! You can now sign in.',
                  verified: true 
                } 
              });
            }, 3000);
            return;
          }
        }

        // Fallback to token method if we have token and email
        if (token && type && email) {
          console.log('EmailVerify: Using token method with email');
          const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: type as any
          });

          console.log('EmailVerify: Token verification result:', { user: data?.user?.id, error });

          if (error) {
            console.error('EmailVerify: Token verification failed:', error);
            setStatus('error');
            setMessage(`Email verification failed: ${error.message}`);
            return;
          }
          
          if (data?.user) {
            console.log('EmailVerify: Verification successful for user:', data.user.id);

            // Mark email as confirmed and set display_name if missing
            try {
              const userId = data.user.id;
              const { data: profile, error: profileFetchError } = await supabase
                .from('real_user_profiles')
                .select('first_name, last_name, display_name')
                .eq('user_id', userId)
                .maybeSingle();

              if (profileFetchError) {
                console.error('EmailVerify: Failed to fetch profile for update:', profileFetchError);
              }

              const updates: any = { email_confirmed: true };
              if (profile && !profile.display_name && profile.first_name && profile.last_name) {
                updates.display_name = `${profile.first_name} ${profile.last_name.charAt(0)}.`;
              }

              const { error: updateError } = await supabase
                .from('real_user_profiles')
                .update(updates)
                .eq('user_id', userId);
              if (updateError) {
                console.error('EmailVerify: Failed to update profile after verification:', updateError);
              }
            } catch (e) {
              console.error('EmailVerify: Error updating profile after verification:', e);
            }

            setStatus('success');
            setMessage('Your email has been verified successfully! You can now sign in to your account.');
            
            // Wait a moment then redirect to sign in
            setTimeout(() => {
              navigate('/real-auth', { 
                state: { 
                  message: 'Email verified! You can now sign in.',
                  verified: true 
                } 
              });
            }, 3000);
            return;
          }
        }

        // If we get here, none of the methods worked
        console.log('EmailVerify: No valid verification parameters found');
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again, or contact support if the problem persists.');

      } catch (err) {
        console.error('EmailVerify: Unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return { status, message };
};
