
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWaitlistSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitWaitlist = async (
    email: string, 
    message: string, 
    requestType: 'waitlist' | 'demo'
  ) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Store in database
      const { error: dbError } = await supabase
        .from('waitlist_submissions')
        .insert({
          email,
          message: message || null,
          request_type: requestType
        });

      if (dbError) {
        console.error('Database error:', dbError);
        setError('Failed to submit. Please try again.');
        return false;
      }

      // Send notification email to admin
      console.log('Invoking send-email function for admin notification:', requestType, 'request from:', email);
      const { data: adminEmailData, error: adminEmailError } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'waitlist_notification',
          email,
          message,
          request_type: requestType,
          timestamp: new Date().toISOString()
        }
      });

      if (adminEmailError) {
        console.error('Admin email function error:', adminEmailError);
        console.error('Admin email error details:', JSON.stringify(adminEmailError, null, 2));
      } else {
        console.log('Admin email function response:', adminEmailData);
      }

      // Send confirmation email to user
      console.log('Invoking send-email function for user confirmation:', requestType, 'request from:', email);
      const { data: userEmailData, error: userEmailError } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'user_confirmation',
          email,
          user_name: email.split('@')[0],
          request_type: requestType
        }
      });

      if (userEmailError) {
        console.error('User confirmation email error:', userEmailError);
        console.error('User email error details:', JSON.stringify(userEmailError, null, 2));
      } else {
        console.log('User confirmation email response:', userEmailData);
      }

      // If either email failed, show warning but still return success since data was saved
      if (adminEmailError || userEmailError) {
        const failedEmails = [];
        if (adminEmailError) failedEmails.push('admin notification');
        if (userEmailError) failedEmails.push('user confirmation');
        setError(`Submission saved successfully, but ${failedEmails.join(' and ')} email(s) failed to send.`);
        return true;
      }

      return true;
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitWaitlist,
    isSubmitting,
    error,
    setError
  };
};
