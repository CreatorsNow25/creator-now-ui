
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
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          email_type: 'waitlist_notification',
          email,
          message,
          request_type: requestType,
          timestamp: new Date().toISOString()
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't show error to user since data was saved
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
